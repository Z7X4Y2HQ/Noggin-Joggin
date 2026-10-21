# Noggin Joggin Field Guide

An interactive React documentation index for a narrative adventure game. The current interface includes section navigation, searchable field notes, responsive mobile navigation, and previous/next article controls.

The **Demo countdown & roadmap** page tracks a personal October 2027 demo target, a staged plan for a 20–30 minute narrative-adventure demo, and a shelf of learning references. Roadmap stage titles and tasks are editable and saved in the current browser. Tasks in the current time period and every optional curriculum topic can be added to the editable Current Focus queue. The queue supports optional resource links, reordering by dragging or arrow controls, and moves checked items into a collapsible Completed section. Aikodex is listed as a real-time animated storytelling tool; the user's downloaded tutorials are separate. The full nine-phase Unity learning curriculum is included below the demo-first plan as an optional, expandable reference. Focus items are saved in the current browser; field notes continue to use the notes API described below.

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

Open TCP port `3000` in the Oracle Cloud VCN security list and the instance firewall, or place Nginx/Caddy in front of the app on ports 80/443. For a persistent process, use a systemd service or PM2. Notes continue to save to `data/notes.json` on the server. That runtime file is intentionally ignored by Git, so future pulls cannot overwrite or conflict with server notes.

After the first setup, update and restart the Oracle deployment with:

```bash
chmod +x deploy.sh
./deploy.sh
```

The script pulls the latest commit, installs dependencies, builds the app, replaces the process on port `3000`, and writes server output to `noggin-joggin.log`.

## Notes storage

Run the app with `npm run dev` to edit the guide. Notes are automatically saved to `data/notes.json` in the project folder through the local Vite server. The tracked `data/notes.example.json` file documents the expected shape, while the runtime notes file stays local to each deployment. The Export JSON and Import JSON controls provide an additional backup workflow.

## Content

The DOCX headings and notes are imported into `src/content.ts`. The source document remains in the project root as `Narrative_Adventure_Game_Requirements_Document.docx`; regenerate `src/content.ts` if the source document changes.
