import { useEffect } from 'react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { CartProvider } from './cart/CartContext'
import { CartDrawer } from './components/CartDrawer'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext'
import { Checkout } from './pages/Checkout'
import { Home } from './pages/Home'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { ProductPage } from './pages/ProductPage'
import { Shop } from './pages/Shop'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

function NotFound() {
  const { t } = useLanguage()
  return (
    <div className="container section empty-state">
      <h1>{t('notFound.title')}</h1>
      <Link to="/shop" className="btn btn-primary">
        {t('product.back')}
      </Link>
    </div>
  )
}

export function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <AppRoutes />
      </CartProvider>
    </LanguageProvider>
  )
}
