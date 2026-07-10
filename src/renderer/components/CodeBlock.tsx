import { useEffect, useState } from 'react';

export function CodeBlock({ code, language }: { code: string; language: string }) {
  const [html, setHtml] = useState(plain(code));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/highlight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language })
    })
      .then((response) => response.json())
      .then((data: { html?: string }) => !cancelled && setHtml(data.html ?? plain(code)))
      .catch(() => !cancelled && setHtml(plain(code)));

    return () => {
      cancelled = true;
    };
  }, [code, language]);

  return (
    <figure className="code-card">
      <figcaption>
        <span>{language}</span>
        <button onClick={() => copy(code, setCopied)}>{copied ? 'Copied' : 'Copy'}</button>
      </figcaption>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}

async function copy(code: string, setCopied: (copied: boolean) => void) {
  await navigator.clipboard.writeText(code);
  setCopied(true);
  setTimeout(() => setCopied(false), 1200);
}

function plain(code: string) {
  return `<pre><code>${escapeHtml(code)}</code></pre>`;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]!);
}
