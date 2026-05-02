# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common development workflow

This checkout is a static HTML/CSS/JS launcher. There is no root `package.json`, no build pipeline, and no automated lint/test setup in the current repo state.

### Run locally
- Open `index.html` directly in a browser for the current static web build.
- Work from the repository root when validating asset paths; the app expects relative files such as `images/...`, `app.ico`, and `Phan canh.pdf`.

### Validation
- Manually refresh the page after editing `index.html`, `app.js`, or `style.css`.
- No first-party build, lint, or test commands are configured in this checkout.
- No single-test command exists.

### Repo-state notes
- `README.md` still describes a GitHub Pages `/docs` variant, but the active app in this checkout lives at the repository root and there is no `docs/` directory.
- The launcher supports two runtimes: a browser-only static mode and a desktop mode backed by `pywebview`.

## High-level architecture

### 1) This is a single-page launcher, not a framework app
- `index.html` contains the static shell: header, tool grid container, guide modal, and notice modal.
- `app.js` acts as the controller/state layer for the entire app.
- `style.css` owns the visual system, theme tokens, card layout, modal styling, and responsive breakpoints.

### 2) The app has two runtimes behind one API surface
- In desktop mode, boot waits for `window.pywebview.api` and delegates actions like launching apps, downloading files, fixing FFmpeg, and storing licenses to the native backend.
- In browser/static mode, `createBrowserApi()` in `app.js` provides a shim using `localStorage` and `window.open`.
- If a feature behaves differently between GitHub Pages and desktop, inspect the API contract first rather than the card UI.

### 3) `STATIC_ENTRIES` is the source of truth for the launcher catalog
- The tool list is hardcoded in `app.js` as `STATIC_ENTRIES`.
- Each entry controls card rendering and behavior through fields like `type`, `target`, `download_url`, `backup_download_url`, `guide_tab`, `guide_video_url`, `step`, and `needs_license`.
- Add, remove, or reorder tools there first; `reloadGrid()` and `makeCard()` derive the visible UI from that data.

### 4) The guide system is split across HTML content and JS routing
- The guide modal content for each tab is authored directly in `index.html`.
- Cards connect into that modal using numeric `guide_tab` indexes or direct `guide_video_url` links from `STATIC_ENTRIES`.
- If you reorder guide tabs in `index.html`, update the matching `guide_tab` values in `app.js` at the same time.

### 5) State is lightweight and browser-persisted
- Theme, license key, hidden-app settings, and notice dismissal are stored in `localStorage`.
- Relevant keys in `app.js` include `applauncher_theme`, `applauncher_license_key`, `applauncher_hidden_apps`, and `notice_skip_until`.
- There is no server-side persistence in the browser build.

### 6) Rendering is imperative DOM code
- The app is not componentized; cards and grouped sections are built with `makeCard()` and `reloadGrid()`.
- “App chính” vs “App hỗ trợ” grouping comes from the `step === 'main'` convention plus numeric `step` buckets for support tools.
- UI changes usually require coordinated edits in `STATIC_ENTRIES`, the card HTML generation, and the CSS grid rules.

### 7) Asset paths are literal and tightly coupled
- Card icons are loaded from `images/<icon filename>`.
- Guide content also links directly to root assets such as `Phan canh.pdf`.
- Renaming or moving assets requires updating both the catalog entries and the hardcoded guide markup.

### 8) There are legacy desktop-era code paths still present
- `app.js` still contains helpers for license handling, FFmpeg repair, expert visibility controls, and notice rendering.
- Some corresponding DOM nodes are absent from the current `index.html`, so those functions only partially activate unless the HTML is restored.
- When reviving desktop features, verify both the JS hooks and the HTML shell exist before debugging backend behavior.
