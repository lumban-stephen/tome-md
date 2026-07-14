import type { TomeIndexEntry } from '../../shared/types';

type DirectoryIndexProps = {
  entries: TomeIndexEntry[];
  onOpen: (path: string) => void;
};

export function DirectoryIndex({ entries, onOpen }: DirectoryIndexProps) {
  if (entries.length === 0) {
    return <p className="index-empty">No Markdown files found in this directory.</p>;
  }

  return (
    <table className="index-table">
      <thead>
        <tr>
          <th>Document</th>
          <th>Path</th>
        </tr>
      </thead>
      <tbody>
        {entries.map((entry) => (
          <tr key={entry.path}>
            <td>
              <button className="index-link" onClick={() => onOpen(entry.path)}>{entry.title}</button>
            </td>
            <td className="index-path">{entry.path}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
