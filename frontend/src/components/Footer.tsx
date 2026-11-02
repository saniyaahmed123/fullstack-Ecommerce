import { Link } from 'react-router-dom'
import './Footer.css'

const year = new Date().getFullYear()

const columns = [
  {
    title: 'Explore',
    links: [
      { label: 'Shop all', to: '/shop' },
      { label: 'Browse products', to: '/browse' },
      { label: 'Jewellery', to: '/browse?category=jewellery' },
      { label: 'Home decor', to: '/browse?category=home-decor' },
    ],
  },
  {
    title: 'Your account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create an account', to: '/register' },
      { label: 'Your cart', to: '/cart' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">Handy</Link>
          <p className="footer__tagline">
            A home for independent creators to sell their one-of-a-kind goods.
            Built with warmth, curated with care.
          </p>
        </div>

        {columns.map(column => (
          <div className="footer__col" key={column.title}>
            <h2 className="footer__heading">{column.title}</h2>
            <ul className="footer__links">
              {column.links.map(link => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <span>© {year} Handy. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}
