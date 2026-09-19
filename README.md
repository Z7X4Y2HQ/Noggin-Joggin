# Noggin Joggin Field Guide

An interactive React documentation index for a narrative adventure game. The current interface includes section navigation, searchable field notes, responsive mobile navigation, and previous/next article controls.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and run the linter with `npm run lint`.

## Oracle Cloud hosting

The production app includes a small Node server so the React build and file-backed notes API run together. On the Oracle Cloud instance, install Node.js 20+, clone this repository, then run:

```bash
npm ci
npm run build
PORT=3000 npm start
```

Open TCP port `3000` in the Oracle Cloud VCN security list and the instance firewall, or place Nginx/Caddy in front of the app on ports 80/443. For a persistent process, use a systemd service or PM2. Notes continue to save to `data/notes.json` on the server.

## Notes storage

Run the app with `npm run dev` to edit the guide. Notes are automatically saved to `data/notes.json` in the project folder through the local Vite server. This file is intentionally tracked so it can be committed and pushed manually. The Export JSON and Import JSON controls provide an additional backup workflow.

## Content

The DOCX headings and notes are imported into `src/content.ts`. The source document remains in the project root as `Narrative_Adventure_Game_Requirements_Document.docx`; regenerate `src/content.ts` if the source document changes.
