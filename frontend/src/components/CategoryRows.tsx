import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/api'
import './CategoryRows.css'

type Product = {
  _id: string
  productName: string
  desc: string
  image: string
}

const rowTitles = ['Fresh finds', 'New arrivals', 'Handmade favourites', 'More to explore']

export default function CategoryRows() {
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

  const rows = rowTitles
    .map((title, index) => ({
      title,
      items: products.slice(index * 4, index * 4 + 4),
    }))
    .filter(row => row.items.length > 0)

  return (
    <section className="catrows">
      <div className="catrows__inner">
        {loading && <p className="text-sm text-text-secondary">Loading products...</p>}

        {!loading && error && (
          <div className="text-sm text-brand" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => { setError(''); setLoading(true); setRetryCount(count => count + 1) }}>Try again</button>
          </div>
        )}

        {!loading && !error && rows.length === 0 && (
          <div className="text-sm text-text-secondary">
            <p>No products yet.</p>
            <Link to="/browse">Explore product categories</Link>
          </div>
        )}

        {!loading &&
          !error &&
          rows.map(row => (
            <div key={row.title} className="catrows__block">
              <div className="catrows__head">
                <h2 className="catrows__title">{row.title}</h2>
                <Link to="/browse" className="catrows__viewall">
                  View all
                  <span className="catrows__arrow" aria-hidden="true">
                    &rarr;
                  </span>
                </Link>
              </div>

              <div className="catrows__grid">
                {row.items.map(item => (
                  <Link key={item._id} to={`/product/${item._id}`} className="crow-card">
                    <span className="crow-card__img-wrap">
                      {item.image && <img src={item.image} alt={item.productName} loading="lazy" />}
                      <span className="crow-card__wish" aria-hidden="true">
                        <svg
                          viewBox="0 0 24 24"
                          width="18"
                          height="18"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20.8 5.6a5.1 5.1 0 0 0-7.2 0L12 7.2l-1.6-1.6a5.1 5.1 0 1 0-7.2 7.2L12 21l8.8-8.2a5.1 5.1 0 0 0 0-7.2Z" />
                        </svg>
                      </span>
                    </span>

                    <span className="crow-card__title">{item.productName}</span>
                    <span className="crow-card__rating">{item.desc}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
      </div>
    </section>
  )
}
