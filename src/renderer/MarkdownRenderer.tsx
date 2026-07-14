import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { looksLikeFileTree } from '../parser/fileTree';
import { isRelativeMarkdownLink } from '../shared/links';
import { CodeBlock } from './components/CodeBlock';
import { FileTree } from './components/FileTree';

type MarkdownRendererProps = {
  markdown: string;
  onNavigate: (href: string) => void;
};

export function MarkdownRenderer({ markdown, onNavigate }: MarkdownRendererProps) {
  return (
    <article className="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const match = /language-(\w+)/.exec(props.className ?? '');
            const language = match?.[1];
            const code = String(props.children).replace(/\n$/, '');

            if ((!language || language === 'text' || language === 'txt' || language === 'tree') && looksLikeFileTree(code)) {
              return <FileTree text={code} />;
            }

            return language ? <CodeBlock code={code} language={language} /> : <code>{props.children}</code>;
          },
          blockquote(props) {
            return <blockquote className="callout" {...props} />;
          },
          img(props) {
            return <img loading="lazy" {...props} />;
          },
          a(props) {
            const href = props.href ?? '';

            if (isRelativeMarkdownLink(href)) {
              return (
                <a
                  {...props}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(href);
                  }}
                />
              );
            }

            const external = /^[a-z][\w+.-]*:\/\//i.test(href);
            return <a {...props} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} />;
          }
        }}
      >
        {markdown}
      </ReactMarkdown>
    </article>
  );
}
