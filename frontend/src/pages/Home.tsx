import { useState } from 'react'
import MarketplaceNavbar from '../components/MarketplaceNavbar'
import HeroGallery from '../components/HeroGallery'
import HeroEditorial from '../components/HeroEditorial'
import SellerInfoBar from '../components/SellerInfoBar.jsx'
import DealsRow from '../components/DealsRow'
import GiftGuides from '../components/GiftGuides'
import CategoryRows from '../components/CategoryRows'
import AboutSection from '../components/AboutSection'
import ValuesBar from '../components/ValuesBar'
import Footer from '../components/Footer'
import SidebarDrawer from '../components/SidebarDrawer'
import './Home.css'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const openSidebar = () => setSidebarOpen(true)
  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className="home">
      <MarketplaceNavbar onOpenSidebar={openSidebar} />
      <HeroEditorial />
      <HeroGallery />
      <SellerInfoBar />
      <DealsRow />
      <GiftGuides />
      <CategoryRows />
      <AboutSection />
      <ValuesBar />
      <Footer />
      <SidebarDrawer open={sidebarOpen} onClose={closeSidebar} />
    </div>
  )
}
