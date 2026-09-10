# Bunny Industries — CMS Deployment Guide

## Quick Reference

| Command | What it does |
|---|---|
| `npm run dev` | Dev server — both site (`/`) and controller (`/controller`) accessible |
| `npm run build` | **Site-only** production build → `dist/site/` |
| `npm run build:controller` | Controller-only production build → `dist/controller/` |
| `npm run build:all` | Both builds in sequence |
| `npm run preview` | Preview the site prod build locally |
| `npm run preview:controller` | Preview the controller prod build locally |

---

## Architecture

```
IntegrityMS/
├── index.html              ← Public site HTML entry
├── controller.html         ← Controller HTML entry (standalone)
├── vite.config.js          ← Dev config (__INCLUDE_CONTROLLER__ = true)
├── vite.prod.config.js     ← Site prod config (__INCLUDE_CONTROLLER__ = false)
├── vite.controller.config.js  ← Controller prod config
├── .env.local              ← VITE_CONTROLLER_PASSWORD (never commit)
└── src/
    ├── App.jsx             ← Site app (controller lazy-loaded, excluded in prod)
    ├── main.jsx            ← Site entry
    ├── content/
    │   ├── types.ts        ← SiteContent TypeScript schema
    │   └── defaultContent.ts  ← Base content values
    ├── context/
    │   └── ContentContext.tsx  ← useContent(), useContentContext(), patchContent()
    ├── components/         ← All public site components
    └── controller/
        ├── main.jsx        ← Standalone controller entry
        ├── ControllerRoute.jsx   ← Password gate
        ├── ControllerApp.tsx     ← Three-pane layout
        ├── components/
        │   └── FieldControls.tsx ← All field controls
        └── sections/
            └── SectionEditors.tsx ← All 12 section editors
```

---

## How content flows

```
Controller (admin)                     Public site (visitor)
     │                                        │
     │  patchContent('hero', {...})           │
     │  → updates React state                │
     │  → writes to localStorage             │
     │         ↓                             │
     │  localStorage['bunny-cms-content']    │
     │         ↓                             │
     │  Preview iframe fires                 │
     │  storage event → re-render ───────────┤
     │                                       │
     │  setContent(full) → Save              │
     │  → pushes undo snapshot               │
     │  → writes to localStorage  ───────────┘
     │                                    (next page load reads from localStorage)
```

---

## Deploying the public site

1. Run `npm run build`
2. Upload `dist/site/` to your hosting (Netlify, Vercel, S3, etc.)
3. The controller is **not present** in this build — verified by bundle scan

## Deploying the controller (optional)

The controller can be deployed separately (e.g. to `admin.yourdomain.com`):

1. Run `npm run build:controller`
2. Upload `dist/controller/` to a separate hosting URL
3. Set `VITE_CONTROLLER_PASSWORD` in your build environment
4. Set `VITE_SITE_PREVIEW_URL=https://yourdomain.com` so the preview iframe points at production

```bash
VITE_CONTROLLER_PASSWORD=your-secure-password \
VITE_SITE_PREVIEW_URL=https://bunnyindustries.com \
npm run build:controller
```

> ⚠️ **Never commit `.env.local`** — it contains the controller password.

---

## CMS password

Current dev password: **`bunny2025`** (set in `.env.local`)

To change: edit `.env.local`, restart the dev server. For production controller build, pass it as a build-time env var (see above).

---

## Undo / History

The controller keeps the last **10 saved states** in memory (cleared on page reload). Use the **↩ Undo** button in the controller top bar.

## Export / Import

- **Export** → downloads `content-export.json` (full SiteContent object)
- **Import** → file picker, validates JSON shape before applying
- Re-importing an export file is guaranteed to restore state exactly

## Reset to Defaults

The **⟲ Reset** button in the controller top bar wipes all edits and restores `defaultContent.ts`. A confirmation dialog fires first. This action is undoable via the Undo button.
