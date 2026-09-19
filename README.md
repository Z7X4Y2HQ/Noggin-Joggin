# Noggin Joggin Field Guide

An interactive React documentation index for a narrative adventure game. The current interface includes section navigation, searchable field notes, responsive mobile navigation, and previous/next article controls.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and run the linter with `npm run lint`.

## Notes storage

Run the app with `npm run dev` to edit the guide. Notes are automatically saved to `data/notes.json` in the project folder through the local Vite server. This file is intentionally tracked so it can be committed and pushed manually. The Export JSON and Import JSON controls provide an additional backup workflow.

## Content

The DOCX headings and notes are imported into `src/content.ts`. The source document remains in the project root as `Narrative_Adventure_Game_Requirements_Document.docx`; regenerate `src/content.ts` if the source document changes.
