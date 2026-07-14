import { useEffect, useMemo, useRef, useState } from 'react';
import type { Mode, TomeDocument } from '../shared/types';
import { resolveRelativePath } from '../shared/links';
import { MarkdownRenderer } from './MarkdownRenderer';
import { Pagination } from './components/Pagination';
import { Sidebar } from './components/Sidebar';

type Theme = 'light' | 'dark' | 'system';

export function App() {
  const params = new URLSearchParams(location.search);
  const mode = (params.get('mode') === 'scroll' ? 'scroll' : 'pages') as Mode;
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [doc, setDoc] = useState<TomeDocument | null>(null);
  const [page, setPage] = useState(0);
  const pathRef = useRef<string | undefined>(undefined);

  async function load(path?: string, options: { replace?: boolean } = {}) {
    const query = path ? `?path=${encodeURIComponent(path)}` : '';
    const response = await fetch(`/api/document${query}`);
    const data = await response.json();
    if (!response.ok) {
      console.error(data.error ?? 'Unable to load document');
      return;
    }

    const nextDoc = data as TomeDocument;
    pathRef.current = nextDoc.path;
    setDoc(nextDoc);
    setPage(0);

    const url = new URL(location.href);
    url.searchParams.set('doc', nextDoc.path);
    const state = { path: nextDoc.path };
    if (options.replace) history.replaceState(state, '', url);
    else history.pushState(state, '', url);
  }

  function onNavigate(href: string) {
    const current = pathRef.current;
    if (!current) return;
    load(resolveRelativePath(current, href));
  }

  useEffect(() => {
    load(params.get('doc') ?? undefined, { replace: true });

    const events = new EventSource('/api/events');
    events.addEventListener('reload', () => load(pathRef.current, { replace: true }));
    return () => events.close();
  }, []);

  useEffect(() => {
    function onPopState() {
      const target = new URLSearchParams(location.search).get('doc');
      load(target ?? undefined, { replace: true });
    }
    addEventListener('popstate', onPopState);
    return () => removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const initial = parseTheme(params.get('theme'));
    const apply = () => setTheme(initial === 'system' ? (media.matches ? 'dark' : 'light') : initial);
    apply();
    media.addEventListener('change', apply);
    return () => media.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (mode !== 'pages' || !doc) return;
      if (event.key === 'ArrowLeft') setPage((value) => Math.max(0, value - 1));
      if (event.key === 'ArrowRight') setPage((value) => Math.min(doc.pages.length - 1, value + 1));
    }
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [doc, mode]);

  useEffect(() => {
    if (doc) setPage((value) => Math.min(value, doc.pages.length - 1));
  }, [doc]);

  useEffect(() => {
    if (mode === 'pages') scrollTo({ top: 0, behavior: 'smooth' });
  }, [mode, page]);

  const markdown = useMemo(() => {
    if (!doc) return '';
    return mode === 'scroll' ? doc.markdown : doc.pages[page]?.content ?? '';
  }, [doc, mode, page]);

  if (!doc) return <main className="loading">Opening Tome…</main>;

  const progress = mode === 'scroll' ? 100 : Math.round(((page + 1) / doc.pages.length) * 100);
  const title = mode === 'pages' ? doc.pages[page]?.title : 'Scroll mode';

  return (
    <div className="shell">
      <Sidebar pages={doc.pages} active={page} onSelect={setPage} mode={mode} theme={theme} progress={progress} onTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
      <main className="reader">
        <header className="reader-header">
          <p className="eyebrow">{doc.fileName}</p>
          <h1 className="page-title">{title}</h1>
          <div className="progress"><span style={{ width: `${progress}%` }} /></div>
        </header>
        <MarkdownRenderer markdown={markdown} onNavigate={onNavigate} />
        {mode === 'pages' && <Pagination page={page} total={doc.pages.length} onPage={setPage} />}
      </main>
    </div>
  );
}

function parseTheme(value: string | null): Theme {
  return value === 'light' || value === 'dark' ? value : 'system';
}
