export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <table className="admin-table admin-table--full" aria-label="Loading…" aria-busy="true">
      <thead>
        <tr>
          {Array.from({ length: cols }).map((_, i) => (
            <th key={i}><div className="skeleton skeleton--text" /></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: rows }).map((_, r) => (
          <tr key={r}>
            {Array.from({ length: cols }).map((_, c) => (
              <td key={c}><div className={`skeleton skeleton--text${c === 0 ? ' skeleton--short' : ''}`} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function StatSkeleton() {
  return (
    <div className="admin-stat-card" aria-busy="true">
      <div className="skeleton skeleton--icon" />
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton--value" />
        <div className="skeleton skeleton--label" />
      </div>
    </div>
  )
}

export function AdminError({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="admin-error-state" role="alert">
      <span className="admin-error-state__icon">⚠</span>
      <p className="admin-error-state__msg">{message}</p>
      {onRetry && (
        <button className="btn btn--sm admin-action-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}
