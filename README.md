# CineAI — Standalone AI Movie Discovery

Pure HTML / CSS / Vanilla JS. No build, no server, no backend.

## Run locally
Just open `index.html` in any modern browser, or serve the folder:
```
python3 -m http.server 8000
```

## Deploy
Upload the entire folder to GitHub Pages, Netlify, Cloudflare Pages, Vercel (static) — nothing to configure.

## Data
All 224 movies live in `data/movies.js` (generated from `movies list.xlsx`).
Replace that file to update the catalog — the schema is:
```
{ id, title, genres:[], country, director, year, rating }
```

## Features
- Cinematic hero, animated particles, glassmorphism, gradients
- Instant search + advanced filters (genre, country, director, sort)
- AI recommendation engine (natural-language, runs in-browser, explains each pick)
- 8 curated collections
- Favorites + Watchlist (localStorage, persists)
- Movie details modal with trailer/IMDb links and similar titles
- Surprise Me, dark/light toggle, fully responsive, reduced-motion friendly
