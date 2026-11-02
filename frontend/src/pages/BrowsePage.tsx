import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import SidebarDrawer from '../components/SidebarDrawer'
import Footer from '../components/Footer'
import CategoryCircles from '../components/CategoryCircles'
import { categories } from '../data/categories'
import api from '../api/api'
import './BrowsePage.css'

type Product = {
  _id: string
  productName?: string
  name?: string
  desc?: string
  description?: string
  image?: string
  images?: string[]
  price?: number
  compareAtPrice?: number
  category?: string
  stock?: number
  status?: string
}

const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-up', label: 'Price: low to high' },
  { value: 'price-down', label: 'Price: high to low' },
  { value: 'popular', label: 'Popular' }
]

function BrowseCard({ product }: { product: Product }) {
  const title = product.productName || product.name || ''
  const desc = product.desc || product.description || ''
  const img = product.image || (Array.isArray(product.images) && product.images[0]) || ''
  const price = typeof product.price === 'number' ? product.price : 0
  const compareAtPrice = typeof product.compareAtPrice === 'number' ? product.compareAtPrice : undefined
  const stock = typeof product.stock === 'number' ? product.stock : 0
  const outOfStock = stock <= 0 || product.status === 'archived'
  const onSale = compareAtPrice !== undefined && compareAtPrice > price

  return (
    <Link to={`/product/${product._id}`} className="browse-card">
      <span className="browse-card__img-wrap">
        {img && (
          <img src={img} alt={title} loading="lazy" />
        )}
        <span className="absolute left-2 top-2 flex flex-col gap-1">
          {onSale && <span className="rounded-full bg-brand px-2 py-1 text-xs text-white">Sale</span>}
          {outOfStock && <span className="rounded-full bg-text-secondary px-2 py-1 text-xs text-white">Out of stock</span>}
        </span>
      </span>

      <span className="browse-card__title">{title}</span>
      <span className="browse-card__seller">{desc}</span>
      <span className="flex items-center gap-2 text-sm font-medium">
        <span>PKR {price}</span>
        {onSale && compareAtPrice !== undefined && (
          <span className="text-xs text-text-secondary line-through">PKR {compareAtPrice}</span>
        )}
      </span>
    </Link>
  )
}

export default function BrowsePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const categoryId = searchParams.get('category')
  const search = searchParams.get('q') ?? searchParams.get('search') ?? ''
  const tags = searchParams.get('tags') ?? ''
  const sort = searchParams.get('sort') ?? 'newest'
  const page = Number(searchParams.get('page')) || 1
  const limit = Number(searchParams.get('limit')) || 20
  const activeCategory = categories.find(category => category.id === categoryId)

  const updateQuery = useCallback((updates: Record<string, string>, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null) params.delete(key)
      else params.set(key, value)
    })
    if (resetPage) params.delete('page')
    navigate(`?${params.toString()}`, { replace: true })
  }, [searchParams, navigate])

  useEffect(() => {
    let active = true
    setLoading(true)
    const params: Record<string, string | undefined> = {}
    if (categoryId) params.category = categoryId
    if (search) params.q = search
    if (tags) params.tags = tags
    params.sort = sort
    params.page = String(page)
    params.limit = String(limit)

    api
      .get('/api/product', { params })
      .then(({ data }) => {
        if (active) {
          setProducts(data.products ?? [])
          setError('')
        }
      })
      .catch(() => {
        if (active) setError('Could not load products. Please try again.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [categoryId, search, tags, sort, page, limit, retryCount])

  const handleSortChange = (value: string) => {
    updateQuery({ sort: value }, true)
  }

  const handlePageChange = (newPage: number) => {
    updateQuery({ page: String(newPage) })
  }

  const handleCategoryChange = (catId: string | null) => {
    updateQuery(catId ? { category: catId } : { category: '' }, true)
  }

  const total = products.length
  const pages = Math.ceil(total / limit)

  return (
    <div className="browse-page">
      <MarketplaceNavbar onOpenSidebar={() => setSidebarOpen(true)} />

      <main className="browse">
        <section className="browse-banner">
          <span className="browse-banner__eyebrow">Handy's seasonal edit</span>
          <h1 className="browse-banner__title">
            {activeCategory ? activeCategory.label : search ? `Search results for "${search}"` : 'Top 100 Handmade Gifts'}
          </h1>
          <p className="browse-banner__subtitle">
            {search
              ? `Search results for "${search}"`
              : activeCategory ? 'One-of-a-kind finds from independent makers' : 'Festive finds for everyone'}
          </p>
        </section>

        <div className="browse__inner">
          <CategoryCircles activeCategoryId={categoryId} onCategoryChange={handleCategoryChange} />

          <div className="browse-toolbar">
            <span className="browse-count" aria-live="polite">
              {loading ? 'Loading products...' : `${total} ${total === 1 ? 'item' : 'items'}`}
            </span>
            <div className="browse-sort">
              <label htmlFor="browse-sort" className="browse-sort__label">Sort by</label>
              <select
                id="browse-sort"
                className="browse-sort__select"
                value={sort}
                onChange={e => handleSortChange(e.target.value)}
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {!loading && error && (
            <div className="browse-empty" role="alert">
              <h2>Could not load products</h2>
              <p>{error}</p>
              <button type="button" className="browse-empty__btn" onClick={() => { setError(''); setLoading(true); setRetryCount(count => count + 1) }}>
                Try again
              </button>
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="browse-empty">
              <h2>No products yet</h2>
              <p>Check back soon for new handmade finds.</p>
              {categoryId && <button type="button" className="browse-empty__btn" onClick={() => handleCategoryChange(null)}>Browse all products</button>}
            </div>
          )}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="browse-grid">
                {products.map(product => (
                  <BrowseCard key={product._id} product={product} />
                ))}
              </div>

              {pages > 1 && (
                <nav className="browse-pagination" aria-label="Pagination">
                  <button
                    type="button"
                    className={`browse-pagination__btn${page <= 1 ? ' browse-pagination__btn--disabled' : ''}`}
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page <= 1}
                    aria-label="Previous page"
                  >
                    ← Prev
                  </button>
                  <span className="browse-pagination__page">
                    Page {page} of {pages}
                  </span>
                  <button
                    type="button"
                    className={`browse-pagination__btn${page >= pages ? ' browse-pagination__btn--disabled' : ''}`}
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= pages}
                    aria-label="Next page"
                  >
                    Next →
                  </button>
                </nav>
              )}
            </>
          )}
        </div>
      </main>

      <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Footer />
    </div>
  )
}
