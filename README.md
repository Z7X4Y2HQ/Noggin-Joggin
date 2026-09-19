# Noggin Joggin Field Guide

An interactive React documentation index for a narrative adventure game. The current interface includes section navigation, searchable field notes, responsive mobile navigation, and previous/next article controls.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build` and run the linter with `npm run lint`.

## Content

The DOCX headings and notes are imported into `src/content.ts`. The source document remains in the project root as `Narrative_Adventure_Game_Requirements_Document.docx`; regenerate `src/content.ts` if the source document changes.
