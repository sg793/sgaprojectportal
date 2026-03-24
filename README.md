# SGA Client Portal V2

This is a Vite + React + TypeScript project for the CCA Vackar client portal pilot.

## Run locally

```bash
npm install
npm run dev
```

## Build for production

```bash
npm run build
```

## Deploy

Push the project to a GitHub repo and import that repo into Vercel.

## Google Sheet feed

The project already points to the published CSV feed provided for the portal.
If the sheet feed fails or the schema does not match, the app will fall back to embedded content.

Expected sheet columns:

- type
- key
- value
- title
- status
- date
- note
- body
- subtitle
- image

Recognized `type` values:

- setting
- milestone
- update
- gallery
