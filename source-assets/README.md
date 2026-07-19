# Source artwork

This directory keeps the original, full-resolution site artwork for future edits.
It is intentionally outside `public/`, so Vite and GitHub Pages do not ship these
large master files to visitors.

Production-ready AVIF and WebP derivatives live under `public/assets/`. Add new
masters here and export appropriately sized variants before referencing them in
the site.
