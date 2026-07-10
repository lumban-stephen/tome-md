import type { Mode, TomePage } from '../../shared/types';

type SidebarProps = {
  pages: TomePage[];
  active: number;
  onSelect: (page: number) => void;
  mode: Mode;
  theme: 'light' | 'dark';
  progress: number;
  onTheme: () => void;
};

export function Sidebar({ pages, active, onSelect, mode, theme, progress, onTheme }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div>
          <strong>Tome</strong>
          <span>{progress}% read</span>
        </div>
        <button className="theme-toggle" onClick={onTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
          {theme === 'dark' ? '☀︎' : '☾'}
        </button>
      </div>
      <nav aria-label="Table of contents">
        {pages.map((page, index) => (
          <button key={`${page.title}-${index}`} className={mode === 'pages' && index === active ? 'active' : ''} onClick={() => onSelect(index)}>
            {page.title}
          </button>
        ))}
      </nav>
    </aside>
  );
}
