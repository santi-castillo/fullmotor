import Link from 'next/link'
import { Suspense } from 'react'
import { GitCompareArrows } from 'lucide-react'
import { Logo } from './ui/Logo'
import HeaderSearch from './HeaderSearch'
import SavedHeaderButton from './SavedHeaderButton'
import UserMenu from './UserMenu'

export default function SiteHeader() {
  return (
    <header className="k-header">
      <div className="k-header__in">
        <Logo size={22} />
        <nav className="k-nav">
          <Link href="/?category=all">Vehículos</Link>
          <Link href="/clasificados">Clasificados</Link>
          <Link href="/blog">Blog</Link>
        </nav>
        <Suspense fallback={<div className="k-search" />}>
          <HeaderSearch />
        </Suspense>
        <div className="k-actions">
          <Link href="/compare" className="k-icbtn">
            <GitCompareArrows size={17} aria-hidden="true" />
            <span className="k-icbtn__label">Comparar</span>
          </Link>
          <SavedHeaderButton />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
