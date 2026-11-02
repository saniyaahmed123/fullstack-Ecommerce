import { categories } from '../data/categories'
import './CategoryCircles.css'

interface CategoryCirclesProps {
  activeCategoryId: string | null
  onCategoryChange?: (catId: string | null) => void
}

export default function CategoryCircles({ activeCategoryId, onCategoryChange }: CategoryCirclesProps) {
  const handleCategoryClick = (catId: string | null) => {
    if (onCategoryChange) {
      onCategoryChange(catId)
    }
  }

  return (
    <nav className="cat-circles" aria-label="Shop by category">
      <button
        type="button"
        className={`cat-circle${activeCategoryId ? '' : ' is-active'}`}
        aria-current={activeCategoryId ? undefined : 'page'}
        onClick={() => handleCategoryClick(null)}
      >
        <span className="cat-circle__ring cat-circle__ring--all">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="14" y="3" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="3" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
            <rect x="14" y="14" width="7" height="7" rx="1.5" fill="currentColor" />
          </svg>
        </span>
        <span className="cat-circle__label">
          All products
          <span className="cat-circle__arrow" aria-hidden="true">
            &rarr;
          </span>
        </span>
      </button>

      {categories.map(category => {
        const active = activeCategoryId === category.id

        return (
          <button
            key={category.id}
            type="button"
            className={`cat-circle${active ? ' is-active' : ''}`}
            aria-current={active ? 'page' : undefined}
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className="cat-circle__ring">
              <img src={category.image} alt="" loading="lazy" />
            </span>
            <span className="cat-circle__label">
              {category.label}
              <span className="cat-circle__arrow" aria-hidden="true">
                &rarr;
              </span>
            </span>
          </button>
        )
      })}
    </nav>
  )
}
