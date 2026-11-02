import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'

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
  stock?: number
  status?: string
}

export default function ProductGrid() {
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
    <section className="container py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="section-title">Popular right now</h2>
          <p className="section-subtitle">Pieces our community is loving</p>
        </div>
        <Link to="/browse" className="text-sm text-text-secondary transition hover:text-text-primary">See all</Link>
      </div>

      {loading && <p className="mt-6 text-sm text-text-secondary">Loading products...</p>}

      {!loading && error && (
        <div className="mt-6 text-sm text-brand" role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => { setError(''); setLoading(true); setRetryCount(count => count + 1) }}>Try again</button>
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="mt-6 text-sm text-text-secondary">
          <p>No products yet.</p>
          <Link to="/browse">Explore product categories</Link>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const title = product.productName || product.name || ''
            const desc = product.desc || product.description || ''
            const img = product.image || (Array.isArray(product.images) && product.images[0]) || ''
            const price = typeof product.price === 'number' ? product.price : 0
            const compareAtPrice = typeof product.compareAtPrice === 'number' ? product.compareAtPrice : undefined
            const stock = typeof product.stock === 'number' ? product.stock : 0
            const outOfStock = stock <= 0 || product.status === 'archived'
            const onSale = compareAtPrice !== undefined && compareAtPrice > price

            return (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-[0_40px_80px_-60px_rgba(122,98,132,0.9)]"
              >
                <div className="relative h-64 w-full bg-gradient-to-br from-surface-alt to-bg-primary">
                  {img && (
                    <img
                      src={img}
                      alt={title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute left-3 top-3 flex flex-col gap-2">
                    {onSale && <span className="rounded-full bg-brand px-2 py-1 text-xs text-white">Sale</span>}
                    {outOfStock && <span className="rounded-full bg-text-secondary px-2 py-1 text-xs text-white">Out of stock</span>}
                  </div>
                </div>
                <div className="space-y-2 p-5">
                  <h3 className="font-medium transition group-hover:text-accent">{title}</h3>
                  <p className="text-sm text-text-secondary line-clamp-2">{desc}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">PKR {price}</span>
                    {onSale && compareAtPrice !== undefined && (
                      <span className="text-xs text-text-secondary line-through">PKR {compareAtPrice}</span>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
