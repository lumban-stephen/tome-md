import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './components/CodeBlock';

export function MarkdownRenderer({ markdown }: { markdown: string }) {
  return (
    <article className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const match = /language-(\w+)/.exec(props.className ?? '');
            return match ? <CodeBlock code={String(props.children).replace(/\n$/, '')} language={match[1]} /> : <code>{props.children}</code>;
          },
          blockquote(props) {
            return <blockquote className="callout" {...props} />;
          },
          img(props) {
            return <img loading="lazy" {...props} />;
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
