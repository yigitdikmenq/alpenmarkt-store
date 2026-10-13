import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { formatCHF } from '../cart/pricing'
import { imageUrl } from '../data/products'
import { useLanguage } from '../i18n/LanguageContext'
import { QuantityStepper } from './QuantityStepper'

export function CartDrawer() {
  const { lang, t } = useLanguage()
  const cart = useCart()
  const navigate = useNavigate()
  const { isOpen, closeCart } = cart

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCart()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  return (
    <>
      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={closeCart} aria-hidden="true" />
      <aside className={`drawer ${isOpen ? 'open' : ''}`} aria-label={t('cart.title')} aria-hidden={!isOpen} inert={!isOpen}>
        <div className="drawer-head">
          <h2>{t('cart.title')}</h2>
          <button className="icon-button" onClick={closeCart} aria-label={t('cart.close')}>
            ✕
          </button>
        </div>

        {cart.lines.length === 0 ? (
          <div className="drawer-empty">
            <p>{t('cart.empty')}</p>
            <Link to="/shop" className="btn btn-primary" onClick={closeCart}>
              {t('cart.continue')}
            </Link>
          </div>
        ) : (
          <>
            <ul className="drawer-lines">
              {cart.lines.map(({ product, quantity, lineTotal }) => (
                <li key={product.id} className="line">
                  <img src={imageUrl(product.image)} alt="" width={72} height={72} />
                  <div className="line-info">
                    <Link to={`/product/${product.id}`} onClick={closeCart} className="line-name">
                      {product.name[lang]}
                    </Link>
                    <span className="muted">{formatCHF(product.price)}</span>
                    <QuantityStepper
                      value={quantity}
                      onChange={(q) => cart.dispatch({ type: 'setQuantity', id: product.id, quantity: q })}
                    />
                  </div>
                  <div className="line-end">
                    <strong>{formatCHF(lineTotal)}</strong>
                    <button className="link-button" onClick={() => cart.dispatch({ type: 'remove', id: product.id })}>
                      {t('cart.remove')}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="drawer-summary">
              <ShippingProgress />
              <div className="row">
                <span>{t('cart.subtotal')}</span>
                <span>{formatCHF(cart.subtotal)}</span>
              </div>
              <div className="row">
                <span>{t('cart.shipping')}</span>
                <span>{cart.shipping ? formatCHF(cart.shipping) : t('cart.free')}</span>
              </div>
              <div className="row total">
                <span>{t('cart.total')}</span>
                <span data-testid="cart-total">{formatCHF(cart.total)}</span>
              </div>
              <div className="row muted small">
                <span>{t('cart.vat')}</span>
                <span>{formatCHF(cart.vat)}</span>
              </div>
              <button
                className="btn btn-primary btn-block"
                onClick={() => {
                  closeCart()
                  navigate('/checkout')
                }}
              >
                {t('cart.checkout')}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}

export function ShippingProgress() {
  const { t } = useLanguage()
  const { subtotal, missingForFreeShipping } = useCart()
  const percent = Math.min(100, Math.round((subtotal / (subtotal + missingForFreeShipping)) * 100))
  return (
    <div className="shipping-progress">
      <span>
        {missingForFreeShipping > 0
          ? t('cart.missing', { amount: formatCHF(missingForFreeShipping) })
          : `${t('cart.freeReached')} 🎉`}
      </span>
      <div className="bar">
        <div style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
