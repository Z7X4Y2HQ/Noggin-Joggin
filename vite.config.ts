import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

const notesFile = path.resolve(process.cwd(), 'data', 'notes.json')

function notesApi() {
  return {
    name: 'noggin-joggin-notes-api',
    configureServer(server: { middlewares: { use: (handler: (request: { method?: string; url?: string; on: (event: string, callback: (...args: unknown[]) => void) => void }, response: { statusCode: number; setHeader: (name: string, value: string) => void; end: (body?: string) => void }, next: () => void) => void) => void } }) {
      fs.mkdirSync(path.dirname(notesFile), { recursive: true })
      server.middlewares.use((request, response, next) => {
        if (request.url !== '/api/notes') {
          next()
          return
        }

        response.setHeader('Content-Type', 'application/json')
        if (request.method === 'GET') {
          if (!fs.existsSync(notesFile)) fs.writeFileSync(notesFile, JSON.stringify({ version: 1, fields: {} }, null, 2))
          response.end(fs.readFileSync(notesFile, 'utf8'))
          return
        }

        if (request.method === 'PUT') {
          const chunks: Buffer[] = []
          request.on('data', (chunk) => chunks.push(Buffer.from(chunk as Uint8Array)))
          request.on('end', () => {
            try {
              const payload = JSON.parse(Buffer.concat(chunks).toString('utf8'))
              fs.writeFileSync(notesFile, `${JSON.stringify(payload, null, 2)}\n`)
              response.end(JSON.stringify({ ok: true }))
            } catch {
              response.statusCode = 400
              response.end(JSON.stringify({ ok: false, error: 'Invalid notes JSON' }))
            }
          })
          return
        }

        response.statusCode = 405
        response.end(JSON.stringify({ ok: false, error: 'Method not allowed' }))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), notesApi()],
})
