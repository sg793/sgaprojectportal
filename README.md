# SGA Client Portal (multi-tab Google Sheet feed)

This project is a lightweight Vite + React client portal wired to four published Google Sheet CSV feeds:

- `project_info`
- `project_status`
- `owner_actions`
- `project_progress`

## Run locally

```bash
npm install
npm run dev
```

## Deploy

Push the contents of this folder to GitHub and import the repo into Vercel.

## Feed URLs

The URLs are defined near the top of `src/App.jsx` in the `FEEDS` object.

## Expected columns

### `project_info`
- `field`
- `value`

Rows used by the app:
- `projectName`
- `client`
- `location`
- `summary`

### `project_status`
- `field`
- `value`

Rows used by the app:
- `phase`
- `progress`
- `progressLabel`
- `ownerActionRequired`

### `owner_actions`
- `order`
- `actionTitle`
- `note`
- `status`

Visible statuses:
- `active`
- blank = hidden

### `project_progress`
- `order`
- `stepTitle`
- `status`
- `note`

Visible statuses:
- `completed`
- `active`
- `upcoming`
- blank = hidden

The portal shows a moving window:
- up to 3 completed
- up to 3 active
- up to 3 upcoming

## Notes

- The intro line is hard-coded in the app.
- The progress bar is segmented according to fee-weighted project phases:
  - SD 0–15
  - DD 15–35
  - CD 35–75
  - PR 75–80
  - CA 80–100
- If one or more sheet feeds fail, the app falls back to built-in sample content.
