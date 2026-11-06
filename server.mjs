import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.join(root, 'dist')
const port = Number(process.env.PORT ?? 3000)
const apiUrl = process.env.API_URL ?? 'http://127.0.0.1:3002'
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    let tooLarge = false
    request.on('data', (chunk) => {
      size += chunk.length
      if (size > 2 * 1024 * 1024) {
        tooLarge = true
        chunks.length = 0
        return
      }
      if (!tooLarge) chunks.push(chunk)
    })
    request.on('end', () => resolve(tooLarge ? null : Buffer.concat(chunks)))
    request.on('error', reject)
  })
}

async function proxyApi(request, response) {
  try {
    const body = ['GET', 'HEAD'].includes(request.method)
      ? undefined
      : await readRequestBody(request)
    if (body === null) {
      sendJson(response, 413, { error: 'Request body is too large.' })
      return
    }
    const upstream = await fetch(new URL(request.url, apiUrl), {
      method: request.method,
      headers: {
        ...(request.headers.authorization ? { Authorization: request.headers.authorization } : {}),
        ...(request.headers['content-type'] ? { 'Content-Type': request.headers['content-type'] } : {}),
      },
      body,
    })
    response.writeHead(upstream.status, {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    })
    response.end(Buffer.from(await upstream.arrayBuffer()))
  } catch (error) {
    console.error('Backend proxy request failed:', error)
    sendJson(response, 502, { error: 'The backend API is unavailable.' })
  }
}

function serveStatic(request, response) {
  let requestedPath
  try {
    requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname)
  } catch {
    sendJson(response, 400, { error: 'Invalid request path.' })
    return
  }
  const relativePath = requestedPath === '/' ? '/index.html' : requestedPath
  const filePath = path.resolve(distDirectory, `.${relativePath}`)
  const relativeFilePath = path.relative(distDirectory, filePath)
  if (
    relativeFilePath.startsWith(`..${path.sep}`) ||
    relativeFilePath === '..' ||
    path.isAbsolute(relativeFilePath) ||
    !fs.existsSync(filePath) ||
    !fs.statSync(filePath).isFile()
  ) {
    const fallback = path.join(distDirectory, 'index.html')
    if (!fs.existsSync(fallback)) {
      sendJson(response, 503, { error: 'The production build is missing. Run npm run build.' })
      return
    }
    response.writeHead(200, { 'Content-Type': mimeTypes['.html'] })
    response.end(fs.readFileSync(fallback))
    return
  }
  const extension = path.extname(filePath)
  response.writeHead(200, { 'Content-Type': mimeTypes[extension] ?? 'application/octet-stream' })
  response.end(fs.readFileSync(filePath))
}

const server = http.createServer((request, response) => {
  if (request.url.startsWith('/api/')) {
    void proxyApi(request, response)
    return
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    sendJson(response, 405, { error: 'Method not allowed.' })
    return
  }
  serveStatic(request, response)
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Noggin Joggin listening on port ${port}; API proxy: ${apiUrl}`)
})
