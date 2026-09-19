import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const distDirectory = path.join(root, 'dist')
const notesFile = path.join(root, 'data', 'notes.json')
const port = Number(process.env.PORT ?? 3000)
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' })
  response.end(JSON.stringify(body))
}

function serveStatic(request, response) {
  const requestedPath = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname)
  const relativePath = requestedPath === '/' ? '/index.html' : requestedPath
  const filePath = path.resolve(distDirectory, `.${relativePath}`)
  if (!filePath.startsWith(distDirectory) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const fallback = path.join(distDirectory, 'index.html')
    response.writeHead(200, { 'Content-Type': mimeTypes['.html'] })
    response.end(fs.readFileSync(fallback))
    return
  }
  const extension = path.extname(filePath)
  response.writeHead(200, { 'Content-Type': mimeTypes[extension] ?? 'application/octet-stream' })
  response.end(fs.readFileSync(filePath))
}

const server = http.createServer((request, response) => {
  if (request.url === '/api/notes' && request.method === 'GET') {
    if (!fs.existsSync(notesFile)) fs.writeFileSync(notesFile, JSON.stringify({ version: 1, fields: {} }, null, 2))
    response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    response.end(fs.readFileSync(notesFile, 'utf8'))
    return
  }

  if (request.url === '/api/notes' && request.method === 'PUT') {
    const chunks = []
    request.on('data', (chunk) => chunks.push(chunk))
    request.on('end', () => {
      try {
        const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
        fs.mkdirSync(path.dirname(notesFile), { recursive: true })
        fs.writeFileSync(notesFile, `${JSON.stringify(payload, null, 2)}\n`)
        sendJson(response, 200, { ok: true })
      } catch {
        sendJson(response, 400, { ok: false, error: 'Invalid notes JSON' })
      }
    })
    return
  }

  if (request.method !== 'GET') {
    sendJson(response, 405, { ok: false, error: 'Method not allowed' })
    return
  }
  serveStatic(request, response)
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Noggin Joggin listening on port ${port}`)
})
