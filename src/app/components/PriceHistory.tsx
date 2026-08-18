import type { PriceHistoryEntry } from '@/types/vehicle'
import { formatChange, formatChangedAt, formatPercent, isBaseline, priceDelta } from '@/lib/price-history'

/**
 * Public price log on the ficha. Server component — the list is static and
 * revalidated with the rest of the page whenever the admin PATCHes a price.
 *
 * Newest first, as delivered by the API. Baseline rows (no previous price)
 * read "Precio inicial"; when they are the only rows there is nothing to list,
 * so a single line says since when the price has held.
 */
export default function PriceHistory({ history }: { history: PriceHistoryEntry[] }) {
  if (!history.length) return null

  const changes = history.filter((e) => !isBaseline(e))
  const oldest = history[history.length - 1]

  return (
    <div style={{ marginTop: 22 }}>
      <h4 className="tm-eyebrow" style={{ margin: '0 0 10px' }}>Historial de precios</h4>
      {changes.length === 0 ? (
        <p className="dt__pricenote" style={{ margin: 0 }}>
          Sin cambios de precio desde {formatChangedAt(oldest)}
        </p>
      ) : (
        <ol className="dt__phist">
          {history.map((e, i) => {
            const delta = priceDelta(e)
            const change = isBaseline(e) ? null : formatChange(e)
            return (
              <li key={`${e.changedAt}-${i}`}>
                <span className="d">{formatChangedAt(e)}</span>
                {change ? (
                  <span className="p">
                    <span className="old">{change.from}</span>
                    <span className="arrow" aria-hidden="true">→</span>
                    {change.to}
                  </span>
                ) : (
                  <span className="p">
                    <span className="old">Precio inicial</span>
                    <span className="arrow" aria-hidden="true">·</span>
                    {formatChange(e).to}
                  </span>
                )}
                {delta && (
                  <span className={`delta ${delta.direction}`}>{formatPercent(delta.pct)}</span>
                )}
                {e.note && <span className="n">{e.note}</span>}
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
