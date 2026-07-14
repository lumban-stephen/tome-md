export type FileTreeNode = {
  name: string;
  isDirectory: boolean;
  children: FileTreeNode[];
};

const CONNECTOR = /^([│\s]*)([├└]─+\s*)(.*)$/;

/** Heuristic: does this code block look like `tree`-style ASCII output rather than real code? */
export function looksLikeFileTree(text: string): boolean {
  const lines = text.split('\n').filter((line) => line.trim());
  if (lines.length < 2) return false;
  const withConnector = lines.filter((line) => /[├└│]/.test(line)).length;
  return withConnector / lines.length >= 0.4;
}

export function parseFileTree(text: string): FileTreeNode[] {
  const lines = text.split('\n').filter((line) => line.trim());
  const roots: FileTreeNode[] = [];
  const stack: { depth: number; node: FileTreeNode }[] = [];
  let unit = 4;

  for (const line of lines) {
    const match = CONNECTOR.exec(line);

    if (!match) {
      const node = toNode(line);
      if (!node) continue;
      roots.push(node);
      stack.length = 0;
      stack.push({ depth: -1, node });
      continue;
    }

    const [, prefix, connector, rest] = match;
    unit = connector.length || unit;
    const depth = Math.round(prefix.length / unit);
    const node = toNode(rest);
    if (!node) continue;

    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();

    if (stack.length === 0) roots.push(node);
    else stack[stack.length - 1].node.children.push(node);

    stack.push({ depth, node });
  }

  markDirectories(roots);
  return roots;
}

function toNode(raw: string): FileTreeNode | null {
  const name = raw.replace(/\s*#.*$/, '').trim();
  if (!name) return null;
  const isDirectory = name.endsWith('/');
  return { name: isDirectory ? name.slice(0, -1) : name, isDirectory, children: [] };
}

function markDirectories(nodes: FileTreeNode[]) {
  for (const node of nodes) {
    if (node.children.length) node.isDirectory = true;
    markDirectories(node.children);
  }
}
