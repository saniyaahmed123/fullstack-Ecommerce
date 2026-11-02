import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import Footer from '../components/Footer'
import SidebarDrawer from '../components/SidebarDrawer'
import api from '../api/api'

type Product = {
  _id: string
  productName: string
  desc: string
  image: string
  price?: number
  category?: string
}

export default function Shop() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true

    api
      .get('/api/product')
      .then(({ data }) => {
        if (active) setProducts(data.products ?? [])
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
  }, [retryCount])

  return (
    <div className="min-h-screen bg-bg-primary">
      <MarketplaceNavbar onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="container py-10">
        <div className="mb-8">
          <h1 className="section-title">Shop all</h1>
          <p className="section-subtitle">Browse curated finds from independent makers</p>
        </div>

        {loading && <p className="text-sm text-text-secondary">Loading products...</p>}

        {!loading && error && (
          <div role="alert">
            <p className="text-sm text-brand">{error}</p>
            <button type="button" className="mt-3 rounded-full border border-border px-4 py-2 text-sm" onClick={() => { setError(''); setLoading(true); setRetryCount(count => count + 1) }}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="browse-empty">
            <h2>No products yet</h2>
            <p>Check back soon for new handmade finds.</p>
            <Link to="/browse" className="browse-empty__btn">Explore categories</Link>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className="overflow-hidden rounded-3xl border border-border bg-surface">
                <div className="h-56 bg-gradient-to-br from-surface-alt to-bg-primary">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.productName}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <h2 className="font-medium">{product.productName}</h2>
                  <p className="text-sm text-text-secondary">{product.desc}</p>
                  <p className="text-sm font-medium">PKR {product.price ?? 0}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}
