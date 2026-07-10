# Tome Test Document

Welcome to **Tome** — a local-first presentation engine for Markdown.

This file exists to test rendering, pagination, styling, navigation, and live reload.

> Note: This blockquote should render as a polished callout card.

---

## Typography

Good Markdown presentation starts with readable typography.

This paragraph includes **bold text**, *italic text*, a [link](https://example.com), and `inline code`.

### A Smaller Heading

Lists should have comfortable spacing:

- Premium typography
- Generous whitespace
- Responsive layout
- Beautiful defaults

Ordered lists should work too:

1. Validate the file
2. Start the local server
3. Open the browser
4. Render beautifully

---

## Task Lists

- [x] Parse Markdown
- [x] Render headings and paragraphs
- [x] Support page mode
- [ ] Polish every edge case
- [ ] Add future export modes

---

## Table Rendering

| Feature | MVP Status | Notes |
|---|---:|---|
| Scroll mode | ✅ | Traditional document reading |
| Page mode | ✅ | Split on `#` and `##` headings |
| Sidebar | ✅ | Generated from pages |
| Live reload | ✅ | Watches the source file |
| Search | Later | Not in MVP |

---

## Code Blocks

```ts
export function greet(name: string) {
  return `Hello, ${name}!`;
}

console.log(greet('Tome'));
```

```bash
npm run build
node dist/cli/index.js sample.md --no-open
```

---

## Images

Images should be responsive and rounded.

![A placeholder image](https://placehold.co/1200x600/png?text=Tome)

---

## Long Reading Section

This section is intentionally a little longer so page mode feels useful.

Tome treats Markdown as the source and the browser as the presentation layer. The original file remains untouched. The renderer is responsible for turning plain Markdown into a polished reading experience.

The MVP should feel simple: point Tome at a Markdown file, open a local browser view, and keep reading while the file changes update automatically.

If this paragraph changes while Tome is running, the browser should update without a manual refresh.

---

## Final Page

You made it to the end.

Use the left and right arrow keys to move between pages in page mode.
