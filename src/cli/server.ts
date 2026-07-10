import { createReadStream, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { basename, extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { paginate } from '../parser/paginator.js';
import type { TomeOptions } from '../shared/types.js';

const clients = new Set<ServerResponse>();

export async function startServer(options: TomeOptions) {
  const root = fileURLToPath(new URL('../renderer', import.meta.url));
  if (!existsSync(join(root, 'index.html'))) throw new Error('Renderer build not found. Run `npm run build` first.');

  const server = createServer(async (req, res) => {
    try {
      if (req.url === '/api/document') return json(res, document(options.file, await readFile(options.file, 'utf8')));
      if (req.url === '/api/highlight' && req.method === 'POST') return json(res, { html: await highlight(await body(req)) });
      if (req.url === '/api/events') return events(res);
      serve(root, req.url ?? '/', res);
    } catch (error) {
      json(res, { error: error instanceof Error ? error.message : 'Unable to read Markdown' }, 500);
    }
  });

  await new Promise<void>((resolve, reject) => {
    server.once('error', reject);
    server.listen(options.port, '127.0.0.1', resolve);
  }).catch((error) => {
    if ((error as NodeJS.ErrnoException).code === 'EADDRINUSE') throw new Error(`Port unavailable: ${options.port}`);
    throw error;
  });

  return {
    url: `http://127.0.0.1:${options.port}/?mode=${options.mode}&theme=${options.theme}`,
    reload() {
      for (const client of clients) client.write('event: reload\ndata: now\n\n');
    }
  };
}

function document(file: string, markdown: string) {
  return { fileName: basename(file), markdown, pages: paginate(markdown) };
}

function serve(root: string, url: string, res: ServerResponse) {
  const path = join(root, url.split('?')[0] === '/' ? 'index.html' : url.split('?')[0]);
  createReadStream(path)
    .on('open', () => res.writeHead(200, { 'Content-Type': contentType(path) }))
    .on('error', () => createReadStream(join(root, 'index.html')).pipe(res.writeHead(200, { 'Content-Type': 'text/html' })))
    .pipe(res);
}

function contentType(path: string) {
  const extension = extname(path);
  if (extension === '.css') return 'text/css';
  if (extension === '.js') return 'text/javascript';
  return extension === '.html' ? 'text/html' : 'application/octet-stream';
}

function events(res: ServerResponse) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive'
  });
  clients.add(res);
  res.write('\n');
  res.on('close', () => clients.delete(res));
}

async function body(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as { code?: string; language?: string };
}

async function highlight({ code = '', language = 'text' }: { code?: string; language?: string }) {
  try {
    const { codeToHtml } = await import('shiki');
    return await codeToHtml(code, { lang: language, theme: 'github-dark' });
  } catch {
    return `<pre><code>${escapeHtml(code)}</code></pre>`;
  }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!);
}

function json(res: ServerResponse, data: unknown, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}
