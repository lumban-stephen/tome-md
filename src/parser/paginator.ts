import type { TomePage } from '../shared/types.js';

const heading = /^(#{1,2})\s+(.+)$/;

export function paginate(markdown: string): TomePage[] {
  const pages: TomePage[] = [];
  let current: TomePage = { title: 'Document', level: 1, content: '' };
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (line.trim().startsWith('```')) inFence = !inFence;

    const match = !inFence ? heading.exec(line) : null;
    if (match && current.content.trim()) {
      pages.push(current);
      current = { title: match[2].trim(), level: match[1].length, content: line + '\n' };
    } else {
      if (match && !current.content.trim()) current.title = match[2].trim();
      current.content += line + '\n';
    }
  }

  if (current.content.trim()) pages.push(current);
  return pages.length ? pages : [{ title: 'Document', level: 1, content: markdown }];
}
