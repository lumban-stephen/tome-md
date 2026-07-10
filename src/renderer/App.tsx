import { useEffect, useMemo, useState } from 'react';
import type { Mode, TomeDocument } from '../shared/types';
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

  async function load() {
    const response = await fetch('/api/document');
    setDoc(await response.json());
  }

  useEffect(() => {
    load();
    const events = new EventSource('/api/events');
    events.addEventListener('reload', load);
    return () => events.close();
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
        <MarkdownRenderer markdown={markdown} />
        {mode === 'pages' && <Pagination page={page} total={doc.pages.length} onPage={setPage} />}
      </main>
    </div>
  );
}

function parseTheme(value: string | null): Theme {
  return value === 'light' || value === 'dark' ? value : 'system';
}
