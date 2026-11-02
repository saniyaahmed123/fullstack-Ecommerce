import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/api'
import { useAuth } from '../auth/AuthContext'
import { categories } from '../data/categories'
import './MarketplaceNavbar.css'

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16M4 12h16M4 18h16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M15.6 15.6 21 21"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BagIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5.5 8h13l-1.2 13H6.7L5.5 8z" fill="currentColor" />
      <path
        d="M9 8V6.2a3 3 0 0 1 6 0V8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

interface MarketplaceNavbarProps {
  onOpenSidebar: () => void
}

export default function MarketplaceNavbar({ onOpenSidebar }: MarketplaceNavbarProps) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [search, setSearch] = useState('')
  const [cartCount, setCartCount] = useState(0)
  const [navError, setNavError] = useState('')

  useEffect(() => {
    if (!user) {
      setCartCount(0)
      return
    }

    const loadCount = () => {
      setNavError('')
      api.get('/api/cart')
        .then(({ data }) => setCartCount((data.cart ?? []).reduce(
          (count: number, item: { quantity: number }) => count + item.quantity,
          0
        )))
        .catch(() => {
          setCartCount(0)
          setNavError('Could not load cart count. Open your cart to retry.')
        })
    }
    loadCount()
    window.addEventListener('handy:cart-updated', loadCount)
    return () => window.removeEventListener('handy:cart-updated', loadCount)
  }, [user])

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/browse?q=${encodeURIComponent(query)}` : '/browse')
  }

  async function handleLogout() {
    setNavError('')
    try {
      await logout()
      navigate('/')
    } catch {
      setNavError('Could not sign out. Please try again.')
    }
  }

  return (
    <header className="mnav">
      <div className="mnav__inner">
        <Link to="/" className="mnav__logo" aria-label="Handy home">
          Handy
        </Link>

        <button type="button" className="mnav__categories" onClick={onOpenSidebar}>
          <MenuIcon />
          <span>Categories</span>
        </button>

        <form className="mnav__search" onSubmit={submitSearch}>
          <input
            type="search"
            className="mnav__search-input"
            placeholder="Search handmade gifts"
            aria-label="Search handmade gifts"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />
          <button type="submit" className="mnav__search-btn" aria-label="Search">
            <SearchIcon />
          </button>
        </form>

        <div className="mnav__right">
          {user ? (
            <>
              <span className="mnav__welcome">Hi, {user.username}</span>
              {user.role === 'admin' && <Link className="mnav__signin" to="/admin">Admin</Link>}
              <button type="button" className="mnav__signin" onClick={handleLogout}>Sign out</button>
            </>
          ) : (
            <>
              <Link className="mnav__signin" to="/login">Login</Link>
              <Link className="mnav__signin" to="/register">Sign up</Link>
            </>
          )}
          <Link to="/cart" className="mnav__icon-btn" aria-label={`Cart${cartCount ? `, ${cartCount} items` : ''}`}>
            <BagIcon />
            {cartCount > 0 && <span className="mnav__cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>
      {navError && <p className="mnav__error" role="alert">{navError}</p>}

      <nav className="mnav__cats" aria-label="Shop categories">
        {categories.map(category => (
          <Link key={category.id} to={`/browse?category=${category.id}`} className="mnav__cat">
            <span>{category.label}</span>
          </Link>
        ))}
      </nav>
    </header>
  )
}
