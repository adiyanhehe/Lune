# Noctis Player

A GitHub Pages-ready React music player inspired by the LUNE/Noctis cinematic audio design.

## Install and run

```bash
npm install
npm run dev
```

Then open the local URL Vite prints, usually `http://localhost:5173`.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that builds and deploys the site whenever `main` is pushed.

In GitHub, set **Settings -> Pages -> Source** to **GitHub Actions**.

For YouTube search in production, add this repository secret:

```text
VITE_YOUTUBE_API_KEY
```

Manual deploy is also available:

```bash
npm run deploy
```

Or build with `npm run build` and publish the `dist` folder through GitHub Pages. The Vite config uses `base: './'`, matching the old Soul Test setup.
