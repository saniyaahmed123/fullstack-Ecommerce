import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BrowsePage from './pages/BrowsePage'
import ProductPage from './pages/ProductPage'
import Shop from './pages/Shop'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import AdminDashboard from './pages/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'
import RequireAuth from './components/RequireAuth'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/browse" element={<BrowsePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<RequireAuth><CartPage /></RequireAuth>} />
      <Route path="/admin" element={<RequireAuth adminOnly><AdminDashboard /></RequireAuth>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
