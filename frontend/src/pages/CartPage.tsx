import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import api from '../api/api'
import Footer from '../components/Footer'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import SidebarDrawer from '../components/SidebarDrawer'
import './AccountPages.css'

interface CartProduct {
  _id: string
  productName: string
  desc: string
  image: string
  price: number
  stock: number
}

interface CartItem {
  productId: CartProduct
  quantity: number
}

export default function CartPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  const loadCart = useCallback(async () => {
    const { data } = await api.get<{ cart: CartItem[] }>('/api/cart')
    setItems(data.cart ?? [])
  }, [])

  useEffect(() => {
    loadCart()
      .then(() => setError(''))
      .catch(() => setError('Could not load your cart. Please try again.'))
      .finally(() => setLoading(false))
  }, [loadCart, retryCount])

  async function changeQuantity(productId: string, quantity: number) {
    setError('')
    try {
      await api.put(`/api/cart/${productId}`, { quantity })
      await loadCart()
      window.dispatchEvent(new Event('handy:cart-updated'))
    } catch (requestError: unknown) {
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'Could not update your cart.' : 'Could not update your cart.')
    }
  }

  async function removeItem(productId: string) {
    setError('')
    try {
      await api.delete(`/api/cart/${productId}`)
      await loadCart()
      window.dispatchEvent(new Event('handy:cart-updated'))
    } catch (requestError: unknown) {
      setError(axios.isAxiosError(requestError) ? requestError.response?.data?.message || 'Could not remove this item.' : 'Could not remove this item.')
    }
  }

  const total = items.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)

  return (
    <>
      <MarketplaceNavbar onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="cart-page">
        <h1>Your cart</h1>
        <p className="cart-intro">Products in your cart are saved to your account.</p>
        {loading && <p>Loading your cart...</p>}
        {!loading && error && (
          <div className="account-error" role="alert">
            <p>{error}</p>
            <button type="button" onClick={() => { setError(''); setLoading(true); setRetryCount(count => count + 1) }}>Try again</button>
          </div>
        )}
        {!loading && !error && items.length === 0 && (
          <div className="browse-empty">
            <h2>Your cart is empty</h2>
            <p>Find something special from our independent makers.</p>
            <Link to="/browse" className="browse-empty__btn">Explore products</Link>
          </div>
        )}
        {!loading && items.length > 0 && (
          <div className="cart-layout">
            <section className="cart-items" aria-label="Cart items">
              {items.map(item => {
                const stock = typeof item.productId.stock === 'number' ? item.productId.stock : 0
                return (
                  <article className="cart-item" key={item.productId._id}>
                    <Link to={`/product/${item.productId._id}`}>
                      <img src={item.productId.image} alt={item.productId.productName} />
                    </Link>
                    <div>
                      <h2><Link to={`/product/${item.productId._id}`}>{item.productId.productName}</Link></h2>
                      <p>{item.productId.desc}</p>
                      {stock > 0 && stock < item.quantity && (
                        <p className="cart-item__stock" role="alert">
                          Only {stock} item{stock === 1 ? '' : 's'} left in stock — quantity reduced to match.
                        </p>
                      )}
                      <div className="cart-item__actions">
                        <button type="button" aria-label={`Decrease ${item.productId.productName} quantity`} disabled={item.quantity <= 1} onClick={() => changeQuantity(item.productId._id, item.quantity - 1)}>&minus;</button>
                        <span>{item.quantity}</span>
                        <button type="button" aria-label={`Increase ${item.productId.productName} quantity`} disabled={stock > 0 && item.quantity >= stock} onClick={() => changeQuantity(item.productId._id, item.quantity + 1)}>+</button>
                        <button type="button" onClick={() => removeItem(item.productId._id)}>Remove</button>
                      </div>
                    </div>
                    <span className="cart-item__price">PKR {(item.productId.price * item.quantity).toLocaleString()}</span>
                  </article>
                )
              })}
            </section>
            <aside className="cart-summary">
              <h2>Order summary</h2>
              <div className="cart-summary__row"><span>Subtotal</span><strong>PKR {total.toLocaleString()}</strong></div>
              <div className="cart-summary__row"><span>Shipping</span><span>Calculated at checkout</span></div>
              <div className="cart-summary__row"><strong>Total</strong><strong>PKR {total.toLocaleString()}</strong></div>
              <p className="cart-summary__note">Checkout will be available soon. Your cart is saved and ready for when you return.</p>
            </aside>
          </div>
        )}
      </main>
      <Footer />
      <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
