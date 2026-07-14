/** True for links that should be opened inside Tome instead of the browser's default navigation. */
export function isRelativeMarkdownLink(href: string): boolean {
  if (!href || href.startsWith('#')) return false;
  if (/^[a-z][\w+.-]*:/i.test(href)) return false;
  const clean = href.split('#')[0].split('?')[0];
  return /\.(md|markdown)$/i.test(clean);
}

/** Resolves an href found in `currentPath`'s Markdown against the document root, posix-style. */
export function resolveRelativePath(currentPath: string, href: string): string {
  const clean = href.split('#')[0].split('?')[0];
  const stack = clean.startsWith('/') ? [] : currentPath.split('/').slice(0, -1);
  for (const part of clean.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') stack.pop();
    else stack.push(part);
  }
  return stack.join('/');
}
