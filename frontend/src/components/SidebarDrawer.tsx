import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/categories'
import './SidebarDrawer.css'

interface SidebarDrawerProps {
  open: boolean
  onClose: () => void
}

export default function SidebarDrawer({ open, onClose }: SidebarDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <aside className={`sidebar${open ? ' sidebar--open' : ''}`} aria-hidden={!open}>
      <div className="sidebar__overlay" onClick={onClose} />
      <div
        className="sidebar__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
        inert={!open}
      >
        <div className="sidebar__head">
          <h2 className="sidebar__title" id="sidebar-title">All Categories</h2>
          <button type="button" className="sidebar__close" aria-label="Close sidebar" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="sidebar__list" aria-label="Categories">
          {categories.map((category, index) => (
            <div
              className="sidebar__item-wrapper"
              key={category.id}
              style={{ '--i': index } as React.CSSProperties}
            >
              <Link
                className="sidebar__item"
                to={`/browse?category=${category.id}`}
                onClick={onClose}
              >
                <span className="sidebar__icon-badge" aria-hidden="true">
                  <img className="sidebar__icon-img" src={category.image} alt={category.alt} loading="lazy" />
                </span>
                <span className="sidebar__item-label">{category.label}</span>
              </Link>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  )
}
