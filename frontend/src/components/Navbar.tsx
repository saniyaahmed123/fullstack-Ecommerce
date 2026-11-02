// Navbar component - Handy (static UI only)
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <header className="navbar">
      {/* <div className="navbar__marquee" aria-label="Promotions">
        <div className="navbar__marquee-track">
          <span>Free delivery on orders above Rs. 5,000</span>
          <span className="navbar__marquee-dot">•</span>
          <span>Cash on delivery available nationwide</span>
          <span className="navbar__marquee-dot">•</span>
          <span>Handmade with love by local makers</span>
          <span className="navbar__marquee-dot">•</span>
          <span>Free delivery on orders above Rs. 5,000</span>
          <span className="navbar__marquee-dot">•</span>
          <span>Cash on delivery available nationwide</span>
          <span className="navbar__marquee-dot">•</span>
          <span>Handmade with love by local makers</span>
        </div>
      </div> */}
      <div className="navbar__main">
        <div className="navbar__topbar navbar__container">
          <div className="navbar__topbar-left">
            <Link to="/" className="navbar__logo-link" aria-label="Handy home">
              <span className="navbar__logo-text">Handy</span>
            </Link>
            <button className="navbar__categories" type="button">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <line x1="4" y1="5" x2="14" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="4" y1="9" x2="14" y2="9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <line x1="4" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span>Categories</span>
            </button>
          </div>
          <div className="navbar__search-wrap">
            <label htmlFor="nav-search" className="sr-only">
              Search
            </label>
            <div className="navbar__search-inner">
              <input
                id="nav-search"
                className="navbar__search-input"
                type="search"
                placeholder="Search handmade finds"
                aria-label="Search"
              />
              <button className="navbar__search-btn" aria-label="Search">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <circle cx="9" cy="9" r="6" stroke="#fff" strokeWidth="2" />
                  <line x1="13.5" y1="13.5" x2="17" y2="17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
          <div className="navbar__topbar-right">
            <div className="navbar__account">
              <button className="navbar__login-link" type="button">Login</button>
              <div className="navbar__dropdown" role="menu">
                <Link to="/shop" role="menuitem">My shop</Link>
                <button type="button" role="menuitem">My orders</button>
                <button type="button" role="menuitem">Logout</button>
              </div>
            </div>
            <button className="navbar__icon-btn" type="button" aria-label="Wishlist">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 19.4l-1.2-1.1C6.4 14.4 3.6 11.9 3.6 8.8 3.6 6.3 5.5 4.4 8 4.4c1.54 0 3.02.72 4 1.86.98-1.14 2.46-1.86 4-1.86 2.5 0 4.4 1.9 4.4 4.4 0 3.1-2.8 5.6-7.2 9.5l-1.2 1.1z" />
              </svg>
            </button>
            <button className="navbar__icon-btn navbar__cart" type="button" aria-label="Cart">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M5 7h16l-1.5 11H6.5L5 7z" />
                <path d="M9 7l1.2-3h5.6l1.2 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
              <span className="navbar__cart-badge">2</span>
            </button>
          </div>
        </div>
      </div>
      <div className="navbar__categories-row">
        <nav className="navbar__categories-row-inner navbar__container" aria-label="Categories">
          <button type="button" className="navbar__cat-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect x="3" y="7" width="10" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
              <path d="M3 7h10" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M8 7V4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <path d="M8 4c-0.8 0-1.4-0.6-1.4-1.4S7.2 1.2 8 1.2s1.4 0.6 1.4 1.4S8.8 4 8 4z" stroke="currentColor" strokeWidth="1.3" />
              <path d="M6.5 4l-1.5 3M9.5 4l1.5 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span>Gifts</span>
          </button>
          <button type="button" className="navbar__cat-link">Best sellers</button>
          <button type="button" className="navbar__cat-link">Candles</button>
          <button type="button" className="navbar__cat-link">Jewellery</button>
          <button type="button" className="navbar__cat-link">Home decor</button>
          <button type="button" className="navbar__cat-link">Ceramics</button>
          <button type="button" className="navbar__cat-link">Textiles</button>
        </nav>
      </div>
    </header>
  )
}
