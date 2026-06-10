export interface SpecItem {
  label: string
  value: React.ReactNode
  highlight?: boolean
}

export interface SpecGroup {
  title?: string
  items: SpecItem[]
}

interface SpecGridProps {
  items?: SpecItem[]
  groups?: SpecGroup[]
  cols?: number
  className?: string
}

function Grid({ items, cols }: { items: SpecItem[]; cols: number }) {
  return (
    <div className="tm-specs__grid" style={{ '--cols': cols } as React.CSSProperties}>
      {items.map((it, i) => (
        <div className="tm-specs__row" key={i}>
          <span className="tm-specs__k">{it.label}</span>
          <span className={`tm-specs__v${it.highlight ? ' tm-specs__v--hl' : ''}`}>{it.value}</span>
        </div>
      ))}
    </div>
  )
}

export function SpecGrid({ items, groups, cols = 2, className = '' }: SpecGridProps) {
  return (
    <div className={['tm-specs', className].filter(Boolean).join(' ')}>
      {groups
        ? groups.map((g, i) => (
            <section className="tm-specs__group" key={i}>
              {g.title && <h4 className="tm-specs__gtitle">{g.title}</h4>}
              <Grid items={g.items} cols={cols} />
            </section>
          ))
        : <Grid items={items || []} cols={cols} />}
    </div>
  )
}
