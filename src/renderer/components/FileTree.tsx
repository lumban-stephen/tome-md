import { parseFileTree, type FileTreeNode } from '../../parser/fileTree';

const ICONS: Record<string, string> = {
  ts: '📘', tsx: '📘', js: '📙', jsx: '📙', json: '🧾', md: '📝', markdown: '📝',
  css: '🎨', html: '🌐', png: '🖼️', jpg: '🖼️', jpeg: '🖼️', svg: '🖼️', yml: '⚙️', yaml: '⚙️'
};

export function FileTree({ text }: { text: string }) {
  const nodes = parseFileTree(text);
  return (
    <div className="file-tree" role="tree">
      <ul>
        {nodes.map((node, index) => (
          <FileTreeItem key={`${node.name}-${index}`} node={node} />
        ))}
      </ul>
    </div>
  );
}

function FileTreeItem({ node }: { node: FileTreeNode }) {
  return (
    <li role="treeitem" aria-expanded={node.isDirectory ? true : undefined}>
      <span className={node.isDirectory ? 'file-tree-dir' : 'file-tree-file'}>
        <span className="file-tree-icon" aria-hidden="true">{node.isDirectory ? '📁' : icon(node.name)}</span>
        {node.name}
      </span>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child, index) => (
            <FileTreeItem key={`${child.name}-${index}`} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

function icon(name: string) {
  const extension = name.split('.').pop()?.toLowerCase() ?? '';
  return ICONS[extension] ?? '📄';
}
