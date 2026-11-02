import { useState } from 'react'
import { Link } from 'react-router-dom'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import Footer from '../components/Footer'
import SidebarDrawer from '../components/SidebarDrawer'
import './NotFoundPage.css'

export default function NotFoundPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <>
      <MarketplaceNavbar onOpenSidebar={() => setSidebarOpen(true)} />
      <main className="not-found-page">
        <p className="not-found-page__code">404</p>
        <h1>We couldn’t find that page</h1>
        <p>The page may have moved, or the link may be incorrect.</p>
        <div className="not-found-page__actions">
          <Link to="/" className="not-found-page__primary">Go to home</Link>
          <Link to="/browse" className="not-found-page__secondary">Browse products</Link>
        </div>
      </main>
      <Footer />
      <SidebarDrawer open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  )
}
