import { Link, Navigate, useLocation } from 'react-router-dom'
import { formatCHF } from '../cart/pricing'
import { useLanguage } from '../i18n/LanguageContext'
import type { OrderConfirmationState } from './Checkout'

export function OrderConfirmation() {
  const { t } = useLanguage()
  const order = useLocation().state as OrderConfirmationState | null

  // Opening this page directly (without placing an order) just goes back to the shop.
  if (!order) return <Navigate to="/shop" replace />

  return (
    <div className="container section confirmation">
      <div className="confirmation-icon" aria-hidden="true">
        ✓
      </div>
      <h1>{t('done.title')}</h1>
      <p>{t('done.text', { order: order.orderNumber, amount: formatCHF(order.total), email: order.email })}</p>
      <p className="muted small">{t('done.note')}</p>
      <Link to="/shop" className="btn btn-primary btn-lg">
        {t('cart.continue')}
      </Link>
    </div>
  )
}
