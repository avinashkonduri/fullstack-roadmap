# Full-Stack Development Family Tree Roadmap

A dependency-free interactive roadmap built with:

- HTML5
- CSS3
- Vanilla JavaScript

## Features

- Family-tree style roadmap
- Frontend / Backend / Data & Delivery branches
- Click a technology to open a detailed learning view
- Detailed topic tree for each technology
- Topic examples, real-world use cases, exercises and interview questions
- Search across technologies and topics
- Topic completion tracking
- Progress saved with localStorage
- Light/dark theme
- Responsive layout
- GitHub Pages compatible
- No framework or build step required

## Run locally

Open `index.html` in a browser.

For a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## GitHub Pages

1. Create a GitHub repository.
2. Upload all files.
3. Go to Settings → Pages.
4. Select the `main` branch and `/root`.
5. Save.
6. GitHub will provide the public URL.

## Customize

All roadmap content is in:

`data/roadmap.js`

Main behavior is in:

`app.js`

Visual styling is in:

`style.css`
