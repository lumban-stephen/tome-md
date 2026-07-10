export function Pagination({ page, total, onPage }: { page: number; total: number; onPage: (page: number) => void }) {
  return (
    <nav className="pagination" aria-label="Pages">
      <button disabled={page === 0} onClick={() => onPage(page - 1)}>Previous</button>
      <span>Page {page + 1} / {total}</span>
      <button disabled={page === total - 1} onClick={() => onPage(page + 1)}>Next</button>
    </nav>
  );
}
