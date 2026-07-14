<p align="center">
  <img src="https://raw.githubusercontent.com/lumban-stephen/tome-md/main/public/tome-logo.png" alt="Tome logo" width="160" />
</p>

<h1 align="center">Tome</h1>

<p align="center">
  <strong>A local-first presentation engine for Markdown — a browser for beautiful reading.</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/tome-md"><img src="https://img.shields.io/npm/v/tome-md" alt="npm version" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue" alt="MIT license" /></a>
  <img src="https://img.shields.io/node/v/tome-md" alt="node version" />
</p>

---

Your Markdown deserves better than a raw text editor or a GitHub preview. Tome turns any `.md` file into a polished, book-like reading experience in your browser — instantly, locally, with zero configuration.

```bash
npm install -g tome-md

tome README.md
```

That's it. Your default browser opens with your document beautifully rendered.

## Why Tome?

- **📖 Two reading modes** — flip through your document page by page (split on `#` and `##` headings, arrow keys to navigate), or read it as one continuous scroll.
- **🔄 Live reload** — Tome watches your file and refreshes the view the moment you save. Write in your editor, read in Tome.
- **🎨 Light & dark themes** — Graphite-style themes that follow your system preference by default.
- **✨ Real syntax highlighting** — code blocks rendered with [Shiki](https://shiki.style), the same highlighter that powers VS Code.
- **📋 GitHub-flavored Markdown** — tables, task lists, strikethrough, and autolinks all work.
- **🔒 Local-first** — a tiny server bound to `127.0.0.1`. Your files never leave your machine, and your original Markdown is never touched.
- **🔗 Linked docs** — relative Markdown links open in place, and pointing Tome at a directory gives you a browsable table of every `.md` file inside it.

## Usage

```bash
tome <file.md|directory> [options]
```

| Option | Values | Default | Description |
| --- | --- | --- | --- |
| `--mode` | `pages` \| `scroll` | `pages` | Paged reading or continuous scroll |
| `--theme` | `light` \| `dark` \| `system` | `system` | Color theme |
| `--port` | number | `4321` | Local server port |
| `--no-open` | — | — | Start the server without opening a browser |

### Examples

```bash
tome docs/spec.md                    # paged mode, system theme
tome docs/spec.md --mode scroll      # one continuous page
tome notes.md --theme dark           # force dark mode
tome README.md --port 8080 --no-open # serve only, open manually
tome docs                            # browse every .md file in docs/
```

### Keyboard shortcuts

| Key | Action |
| --- | --- |
| `→` | Next page |
| `←` | Previous page |

## How it works

Tome starts a lightweight local HTTP server (no Express, just `node:http`), splits your document into pages at `#`/`##` headings — code fences are never split — and renders it with a React viewer. A file watcher pushes changes to the browser over server-sent events, so the view stays in sync with your editor on every save.

## Local development

```bash
git clone https://github.com/lumban-stephen/tome-md.git
cd tome-md
npm install
npm run build
node dist/cli/index.js sample.md
```

`npm run dev <file.md>` runs the CLI straight from TypeScript via tsx.

## License

[MIT](LICENSE) © Stephen Lumban
