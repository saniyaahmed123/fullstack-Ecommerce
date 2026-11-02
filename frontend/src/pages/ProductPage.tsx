import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import SidebarDrawer from '../components/SidebarDrawer'
import Footer from '../components/Footer'
import type { Product } from '../data/products'
import { categories } from '../data/categories'
import api from '../api/api'
import { useAuth } from '../auth/AuthContext'
import './ProductPage.css'

type ApiProduct = {
  _id: string
  productName?: string
  name?: string
  desc?: string
  description?: string
  image?: string
  images?: string[]
  price?: number
  compareAtPrice?: number
  currency?: string
  category?: string
  admin?: { username?: string }
  seller?: { username?: string }
  stock?: number
  status?: string
  materials?: string[]
  dimensions?: string
  weight?: string
  colors?: string[]
  sizes?: string[]
  variants?: { name: string; values: string[] }[]
  personalisable?: boolean
  personalisationNote?: string
  madeToOrder?: boolean
  processingDays?: number
  shippingFee?: number
  deliveryDays?: number
}

function toProduct(item: ApiProduct): Product {
  const sellerName = item.admin?.username || item.seller?.username || 'Handy seller'
  const title = item.productName || item.name || ''
  const desc = item.desc || item.description || ''
  const images = Array.isArray(item.images) && item.images.length > 0 ? item.images.filter(Boolean) : (item.image ? [item.image] : [])

  const details: string[] = []
  if (Array.isArray(item.materials) && item.materials.length > 0) {
    details.push(`Materials: ${item.materials.filter(Boolean).join(', ')}`)
  }
  if (item.dimensions) details.push(`Dimensions: ${item.dimensions}`)
  if (item.weight) details.push(`Weight: ${item.weight}`)
  if (Array.isArray(item.colors) && item.colors.length > 0) details.push(`Colors: ${item.colors.join(', ')}`)
  if (Array.isArray(item.sizes) && item.sizes.length > 0) details.push(`Sizes: ${item.sizes.join(', ')}`)
  if (item.personalisable) {
    details.push(item.personalisationNote ? `Personalisation: ${item.personalisationNote}` : 'Personalisation available')
  }
  if (item.madeToOrder || (typeof item.processingDays === 'number' && item.processingDays > 0)) {
    if (typeof item.processingDays === 'number' && item.processingDays > 0) {
      details.push(`Making time: ${item.processingDays} day${item.processingDays === 1 ? '' : 's'}`)
    } else {
      details.push('Made to order')
    }
  }
  if (typeof item.shippingFee === 'number' && item.shippingFee > 0) {
    details.push(`Shipping fee: PKR ${item.shippingFee}`)
  } else if (typeof item.deliveryDays === 'number' && item.deliveryDays > 0) {
    details.push(`Estimated delivery: ${item.deliveryDays} day${item.deliveryDays === 1 ? '' : 's'}`)
  }

  return {
    id: item._id,
    title,
    category: item.category || 'Handmade',
    categoryId: item.category || '',
    price: item.price ?? 0,
    oldPrice: item.compareAtPrice,
    currency: item.currency || 'PKR',
    rating: 0,
    reviews: 0,
    images,
    alt: title,
    description: desc,
    details,
    options: item.variants || [],
    seller: {
      name: sellerName,
      location: 'Handmade',
      rating: 0,
      reviews: 0,
      sales: 0,
      since: '',
      initials: sellerName.slice(0, 2).toUpperCase(),
      color: '#C65D3B'
    },
    shipping: {
      cost: typeof item.shippingFee === 'number' && item.shippingFee > 0 ? `Shipping ${item.currency || 'PKR'} ${item.shippingFee}` : 'Shipping calculated at checkout',
      estimate: typeof item.deliveryDays === 'number' && item.deliveryDays > 0 ? `Estimated delivery ${item.deliveryDays} day${item.deliveryDays === 1 ? '' : 's'}` : 'Delivery time varies',
      returns: 'Buyer protection included'
    },
    badge: (typeof item.stock === 'number' && item.stock <= 0) || item.status === 'archived' ? 'Out of stock' : (typeof item.compareAtPrice === 'number' && item.compareAtPrice > (item.price ?? 0) ? 'Sale' : undefined)
  } as Product & { badge?: string }
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.5 8h13l-1.2 13H6.7L5.5 8z" fill="currentColor" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ProductView({ product, related, relatedError }: { product: Product & { badge?: string }; related: Product[]; relatedError: string }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activeImage, setActiveImage] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => Object.fromEntries((product.options || []).map(option => [option.name, option.values[0]]))
  )
  const [quantity, setQuantity] = useState(1)
  const [toast, setToast] = useState('')
  const [addingToCart, setAddingToCart] = useState(false)

  const category = categories.find(item => item.id === product.categoryId)

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  const addToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/product/${product.id}` } })
      return false
    }

    setAddingToCart(true)
    try {
      await api.post('/api/cart/add', { productId: product.id, quantity })
      window.dispatchEvent(new Event('handy:cart-updated'))
      setToast(`Added ${quantity} x ${product.title} to your cart`)
      return true
    } catch (requestError: unknown) {
      setToast(axios.isAxiosError(requestError)
        ? requestError.response?.data?.message || 'Could not add this product to your cart.'
        : 'Could not add this product to your cart.')
      return false
    } finally {
      setAddingToCart(false)
    }
  }

  const buyNow = async () => {
    if (await addToCart()) navigate('/cart')
  }

  return (
    <main className="pp">
      <div className="pp__inner">
        <nav className="pp-crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          {product.categoryId ? (
            <Link to={`/browse?category=${product.categoryId}`}>
              {category?.label ?? product.category}
            </Link>
          ) : (
            <span>{product.category}</span>
          )}
          <span aria-hidden="true">/</span>
          <span className="pp-crumbs__current">{product.title}</span>
        </nav>

        <div className="pp-top">
          <div className="pp-gallery">
            <div className="pp-gallery__thumbs" role="tablist" aria-label="Product images">
              {product.images.map((image, index) => (
                <button
                  key={image + index}
                  type="button"
                  role="tab"
                  aria-selected={activeImage === index}
                  aria-label={`View image ${index + 1}`}
                  className={`pp-gallery__thumb${activeImage === index ? ' is-active' : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt="" loading="lazy" />
                </button>
              ))}
            </div>

            <div className="pp-gallery__main">
              {(product as any).badge && (
                <span className={`pp-badge pp-badge--${String((product as any).badge).toLowerCase().replace(/\s+/g, '-')}`}>
                  {(product as any).badge}
                </span>
              )}
              {product.images && product.images[activeImage] && (
                <img
                  key={product.images[activeImage]}
                  className="pp-gallery__img"
                  src={product.images[activeImage]}
                  alt={product.alt}
                />
              )}
            </div>
          </div>

          <aside className="pp-info">
            <h1 className="pp-info__title">{product.title}</h1>

            <div className="pp-info__meta">
              <span className="pp-info__seller-inline">{product.seller.name}</span>
            </div>

            <p className="pp-info__desc">{product.description}</p>

            <div className="pp-price">
              <span className="pp-price__current">{product.currency || 'PKR'} {product.price}</span>
              {(product as any).compareAtPrice && (product as any).compareAtPrice > product.price && (
                <span className="pp-price__old">{product.currency || 'PKR'} {(product as any).compareAtPrice}</span>
              )}
            </div>

            <div className="pp-options">
              {(product.options || []).map(option => (
                <label className="pp-option" key={option.name}>
                  <span className="pp-option__label">{option.name}</span>
                  <span className="pp-option__select-wrap">
                    <select
                      className="pp-option__select"
                      value={selectedOptions[option.name]}
                      onChange={event =>
                        setSelectedOptions(prev => ({
                          ...prev,
                          [option.name]: event.target.value
                        }))
                      }
                    >
                      {option.values.map(value => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </label>
              ))}

              <div className="pp-option">
                <span className="pp-option__label">Quantity</span>
                <div className="pp-qty">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(value => Math.max(1, value - 1))}
                    disabled={quantity <= 1}
                  >
                    &minus;
                  </button>
                  <span aria-live="polite">{quantity}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity(value => Math.min(20, value + 1))}
                    disabled={quantity >= 20}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="pp-actions">
              <button type="button" className="pp-actions__cart" onClick={addToCart} disabled={addingToCart}>
                <BagIcon />
                {addingToCart ? 'Adding...' : 'Add to cart'}
              </button>
              <button type="button" className="pp-actions__buy" onClick={buyNow} disabled={addingToCart}>
                Buy now
              </button>
            </div>

            <div className="pp-seller">
              <span
                className="pp-seller__avatar"
                style={{ backgroundColor: product.seller.color }}
                aria-hidden="true"
              >
                {product.seller.initials}
              </span>
              <div className="pp-seller__body">
                <Link to="/shop" className="pp-seller__name">
                  {product.seller.name}
                </Link>
                <div className="pp-seller__meta">
                  <span className="pp-seller__star" aria-hidden="true">&#9733;</span>
                  {product.seller.rating.toFixed(1)}
                  <span>({product.seller.reviews})</span>
                  <span aria-hidden="true">·</span>
                  <span>{product.seller.sales} sales</span>
                </div>
                <div className="pp-seller__sub">
                  {product.seller.location} · {product.seller.since}
                </div>
              </div>
            </div>

            <div className="pp-shipping">
              <div className="pp-shipping__row">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M2.5 6.5h10v9h-10zM12.5 9.5h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <circle cx="6.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="16.5" cy="17.5" r="1.8" stroke="currentColor" strokeWidth="1.6" />
                </svg>
                <div>
                  <strong>{product.shipping.cost}</strong>
                  <span>{product.shipping.estimate}</span>
                </div>
              </div>
              <div className="pp-shipping__row">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 8l8-4 8 4v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div>
                  <strong>{product.shipping.returns}</strong>
                  <span>Shop confidently with buyer protection</span>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="pp-about" id="details">
          <div className="pp-about__main">
            <h2 className="pp-section-title">About this item</h2>
            {product.description && <p>{product.description}</p>}
            {(product.details && product.details.length > 0) ? (
              <ul className="pp-about__list">
                {product.details.map(detail => (
                  <li key={detail}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {detail}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-secondary">No additional details provided.</p>
            )}
          </div>

          <aside className="pp-specs">
            <h3 className="pp-specs__title">Item details</h3>
            <dl>
              <div>
                <dt>Category</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt>Made by</dt>
                <dd>{product.seller.name}</dd>
              </div>
              <div>
                <dt>Ships from</dt>
                <dd>{product.seller.location}</dd>
              </div>
              <div>
                <dt>Dispatch</dt>
                <dd>1 - 3 business days</dd>
              </div>
            </dl>
          </aside>
        </section>

        <section className="pp-reviews" id="reviews">
          <div className="pp-reviews__head">
            <h2 className="pp-section-title">Reviews</h2>
          </div>

          <div className="pp-reviews__grid">
            <p>There are no reviews for this product yet.</p>
          </div>
        </section>

        <section className="pp-related">
          <div className="pp-related__head">
            <h2 className="pp-section-title">You may also like</h2>
            <Link to="/browse" className="pp-related__link">
              Explore more
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
          <div className="pp-related__grid">
            {relatedError ? (
              <p role="status">{relatedError}</p>
            ) : related.length === 0 ? (
              <p>No related products are available right now.</p>
            ) : related.map(item => (
              <Link key={item.id} to={`/product/${item.id}`} className="pp-card">
                <span className="pp-card__img-wrap">
                  {item.images && item.images[0] && <img src={item.images[0]} alt={item.alt} loading="lazy" />}
                  {(item as any).badge && (
                    <span className={`pp-badge pp-badge--${String((item as any).badge).toLowerCase().replace(/\s+/g, '-')}`}>
                      {(item as any).badge}
                    </span>
                  )}
                </span>
                <span className="pp-card__title">{item.title}</span>
                <span className="pp-card__seller">{item.seller.name}</span>
                <span className="pp-card__price">PKR {item.price}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <div className={`pp-toast${toast ? ' pp-toast--show' : ''}`} role="status" aria-live="polite">
        {toast}
      </div>
    </main>
  )
}

function NotFound() {
  return (
    <main className="pp pp--missing">
      <div className="pp-missing">
        <span className="pp-missing__icon" aria-hidden="true">?</span>
        <h1>We could not find that product</h1>
        <p>It may have sold out or moved. Explore the shop for more handmade finds.</p>
        <Link to="/" className="pp-missing__link">Back to home</Link>
      </div>
    </main>
  )
}

export default function ProductPage() {
  const { id } = useParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [relatedError, setRelatedError] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError('')
    setNotFound(false)
    setProducts([])
    setRelatedProducts([])
    setRelatedError('')

    if (!id) {
      setLoading(false)
      return
    }

    api.get(`/api/product/${id}`)
      .then(({ data }) => {
        if (active) setProducts([toProduct(data.product)])
      })
      .catch((requestError: unknown) => {
        if (!active) return
        if (axios.isAxiosError(requestError) && requestError.response?.status === 404) {
          setNotFound(true)
        } else {
          setError(axios.isAxiosError(requestError)
            ? requestError.response?.data?.message || 'Could not load this product. Please try again.'
            : 'Could not load this product. Please try again.')
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    api.get('/api/product', { params: { limit: 8 } })
      .then(({ data }) => {
        if (active) setRelatedProducts((data.products ?? []).map(toProduct))
      })
      .catch(() => {
        if (active) setRelatedError('Related products could not be loaded.')
      })

    return () => {
      active = false
    }
  }, [id, retryCount])

  const product = id ? products.find(item => item.id === id) : undefined
  const related = product
    ? relatedProducts.filter(item => item.id !== product.id).slice(0, 4)
    : []

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [id])

  useEffect(() => {
    document.title = loading
      ? 'Loading product | Handy'
      : product
        ? `${product.title} | Handy`
        : 'Product not found | Handy'
    return () => {
      document.title = 'Handy'
    }
  }, [loading, product])

  return (
    <div className="product-page">
      <MarketplaceNavbar onOpenSidebar={() => setSidebarOpen(true)} />
      {loading ? (
        <main className="pp pp--missing">
          <div className="pp-missing">
            <h1>Loading product...</h1>
          </div>
        </main>
      ) : error ? (
        <main className="pp pp--missing">
          <div className="pp-missing" role="alert">
            <h1>Could not load product</h1>
            <p>{error}</p>
            <button type="button" className="pp-missing__link" onClick={() => { setError(''); setLoading(true); setRetryCount(count => count + 1) }}>Try again</button>
            <Link to="/browse" className="pp-missing__link">Browse products</Link>
          </div>
        </main>
      ) : notFound ? (
        <NotFound />
      ) : product ? (
        <ProductView key={product.id} product={product} related={related} relatedError={relatedError} />
      ) : (
        <NotFound />
      )}
      <Footer />
      <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </div>
  )
}
