# Noggin Joggin Field Guide

A private documentation and planning workspace for multiple games. Each game has separate notes, roadmap headings and tasks, focus items, and an optional deadline.

## Games and documentation

Sign in with the backend owner credentials. Use the current-game selector in the sidebar to switch games, **New game** to create another, and **Game settings** to rename a game or change its deadline and timezone.

Every game uses the complete original documentation template: 186 pages across 62 sections, with all existing topics, index labels, and editable prompts preserved. New games start with blank notes, an empty delivery roadmap, and the reference Unity curriculum. The original documentation is migrated into **My first game**, which you can rename.

On the roadmap page, **Add heading** opens a styled modal for the title, optional description/dates, and tasks. Cancel discards the draft; Add heading commits it. Headings and tasks have their own database rows with parent references. Roadmap tasks appear as plain items and can be added to Current Focus. Removing a heading hides it from the roadmap while retaining existing focus items.

The countdown reads the current game's saved deadline. The date, time, and IANA timezone are explicit in Game settings. Labels update together. Stages extending beyond the deadline show a planning warning.

## Saving and backups

Notes, delivery roadmaps, and focus queues save independently to relational tables in the shared backend's story_dump database. Saves are serialized, switching games waits for pending changes, and versions detect stale writes from other browsers. Save or cancel an open heading/focus editor before switching games.

**Export game JSON** exports the current game's notes, guide definitions, roadmap, curriculum, focus queue, and settings. **Import notes JSON** accepts the existing notes-only format and validates the keys against the guide. Import is limited to notes; it does not replace game settings or roadmap data. Database backups remain the full recovery mechanism.

The original story_documents JSON row is retained as a read-only migration snapshot. Old clients must reload; the retired JSON write endpoint returns HTTP 410. Existing browser storage is not deleted. Theme stays local and the session token remains in session storage.

## Run locally

Start all three projects with start-apps.cmd in Desktop/Server/server, or start Docker Compose in that folder and run npm run dev here. Vite proxies /api to http://localhost:3002 by default; the combined launcher uses http://localhost:5174 for this app.

Use npm run build and npm run lint to verify changes. The Node production server can serve the built app and proxy API requests with PORT=3000 and API_URL=http://127.0.0.1:3002. Use HTTPS and exact CORS origins when deploying remotely.

## GitHub Pages

The master branch deploys automatically through the GitHub Pages Actions workflow. In the repository, open Settings > Pages and set the publishing source to GitHub Actions.

The frontend can deploy before the API is hosted; sign-in and saved data will not work until the API is available. When the API is live, add a repository Actions variable named VITE_API_URL with its public HTTPS base URL (for example, https://api.example.com, without a trailing slash). If set, the workflow requires HTTPS and builds with the GitHub Pages project path.

The API and PostgreSQL database must remain hosted separately; GitHub Pages serves only the frontend and cannot run server.mjs. In the backend environment, include https://z7x4y2hq.github.io in CORS_ORIGINS, preserving any existing origins, then restart the API. The GitHub Pages project URL is https://z7x4y2hq.github.io/Noggin-Joggin/.

## Source template

The original reference document and src/content.ts remain in this project. The backend's src/story-template.json is the preserved seed used to initialize the database template. The running app reads guide definitions from the database. Do not regenerate stable field IDs when updating a template; use an explicit migration so existing notes remain attached to their prompts.
