import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import SellerInfoBar from '../components/SellerInfoBar.jsx'
import api from '../api/api'
import './SellerShop.css'

export default function SellerShop() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
  }, [])

  return (
    <div className="seller-shop">
      <Navbar />
      <SellerInfoBar />
      <main className="seller-shop__main">
        {loading && <p className="text-sm text-text-secondary">Loading products...</p>}

        {!loading && error && (
          <p className="text-sm text-brand" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-sm text-text-secondary">No products yet.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="seller-shop__grid">
            {products.map((product) => (
              <article key={product._id} className="product-card">
                <div className="product-card__img-wrap">
                  {product.image && (
                    <img src={product.image} alt={product.productName} className="product-card__img" />
                  )}
                </div>
                <div className="product-card__info">
                  <p className="product-card__title">{product.productName}</p>
                  <p className="text-sm text-text-secondary">{product.desc}</p>
                  <p className="text-sm font-medium">PKR {product.price ?? 0}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
