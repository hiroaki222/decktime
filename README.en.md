# decktime

Full-screen countdown timer PWA for DJ sets. Portrait mobile first, three-panel view (clock / remaining / elapsed) with second-level precision, and a screen wake-lock toggle.

**日本語版 → [README.md](./README.md)**

---

## Features

- **Three-panel layout**: top = current clock, middle = remaining (countdown), bottom = elapsed (count-up). All shown as `H:MM:SS` down to seconds.
- **HH:MM start/end pairs**: sessions are defined by wall-clock start and end times, so it matches the lineup on the flyer instead of a raw duration.
- **Progressive urgency**: remaining turns **yellow** at ≤ 3 minutes, **yellow + 1 Hz blink** at ≤ 1 minute, and **red** once you've gone over.
- **Early START is allowed**: press START before the session's start time and ELAPSED counts *negatively* toward zero, flipping to positive the moment the session begins.
- **Saved presets**: keep up to 12 favourite start–end pairs. One tap applies a preset and returns to the timer. Sorted ascending. `×` deletes with a confirmation modal.
- **Screen Wake Lock toggle**: `SLEEP: OFF / ON` indicator in the top-right, tappable to toggle. Once you manually turn it off it stays off — no surprise re-acquire.
- **Custom confirm modals**: RESET / OVERWRITE / DELETE all use in-app dialogs (Chakra Petch styling, blurred backdrop) instead of the browser's native `confirm()`.
- **Zero dependencies**: a single `index.html` plus static icons. No build step, no framework.

## Usage

1. Open the app → tap `SET` (bottom-right).
2. Pick `START` / `END`. Defaults: current time / +20 minutes. Use the `−/+ 20m` duration picker to nudge in 10-minute steps.
3. Save frequent slots with `↑ SAVE CURRENT`. They appear at the top of the editor next time and apply in one tap.
4. Back on the main screen, `START` begins the countdown and the wake lock activates (`SLEEP: OFF`).

## Stack

- Vanilla HTML / CSS / JavaScript in a single `index.html`
- [Chakra Petch](https://fonts.google.com/specimen/Chakra+Petch) (Google Fonts)
- Screen Wake Lock API (requires secure context)
- `localStorage` for session state and saved presets
- Designed to ship as static files on Cloudflare Pages (or any static host)

## Local development

```bash
# Any static server works. Wake Lock is enabled on localhost too.
cd decktime
python3 -m http.server 8787
# → http://localhost:8787/
```

**Wake Lock requires a secure context.** Serving over `http://<lan-ip>:port/` will silently fail to acquire the lock. To exercise it, use `localhost`, HTTPS via Cloudflare Pages, or a tunnel (cloudflared / ngrok).

## Lint

```bash
bun run lint
```

`tools/lint-index.mjs` guards the structure of `index.html`: a single inline `<script>`, consistent id declarations vs. references, and centralised `document.getElementById` usage.

## Deploy

Direct Upload to Cloudflare Pages:

1. Zip the runtime assets: `_headers`, `manifest.webmanifest`, `index.html`, `icon-*.png`, `icon.svg`, `favicon-32.png`.
2. Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets.
3. Drag the zip in and hit Deploy.
4. Add a custom subdomain (e.g. `timer.example.com`) under Custom domains.

## License

MIT
