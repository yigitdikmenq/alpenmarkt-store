import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { formatCHF } from '../cart/pricing'
import { validateCheckout, type CheckoutErrors, type CheckoutValues, type PaymentMethod } from '../checkout/validation'
import { ShippingProgress } from '../components/CartDrawer'
import { imageUrl } from '../data/products'
import { useLanguage } from '../i18n/LanguageContext'
import type { TranslationKey } from '../i18n/translations'

const EMPTY: CheckoutValues = { name: '', email: '', street: '', zip: '', city: '', payment: 'twint' }

const PAYMENT_OPTIONS: { value: PaymentMethod; label: TranslationKey; icon: string }[] = [
  { value: 'twint', label: 'checkout.twint', icon: '📱' },
  { value: 'postfinance', label: 'checkout.postfinance', icon: '🟡' },
  { value: 'card', label: 'checkout.card', icon: '💳' },
]

export interface OrderConfirmationState {
  orderNumber: string
  total: number
  email: string
}

export function Checkout() {
  const { lang, t } = useLanguage()
  const cart = useCart()
  const navigate = useNavigate()
  const [values, setValues] = useState<CheckoutValues>(EMPTY)
  const [errors, setErrors] = useState<CheckoutErrors>({})
  const [submitted, setSubmitted] = useState(false)

  if (cart.lines.length === 0) {
    return (
      <div className="container section empty-state">
        <p>{t('checkout.emptyCart')}</p>
        <Link to="/shop" className="btn btn-primary">
          {t('cart.continue')}
        </Link>
      </div>
    )
  }

  function setField<K extends keyof CheckoutValues>(field: K, value: CheckoutValues[K]) {
    const next = { ...values, [field]: value }
    setValues(next)
    // After the first submit attempt, re-validate live so errors disappear as soon as they are fixed.
    if (submitted) setErrors(validateCheckout(next))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const found = validateCheckout(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0]
      document.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus()
      return
    }
    const order: OrderConfirmationState = {
      orderNumber: `AM-${Math.floor(100000 + Math.random() * 900000)}`,
      total: cart.total,
      email: values.email.trim(),
    }
    cart.dispatch({ type: 'clear' })
    navigate('/order-confirmation', { state: order })
  }

  const field = (name: Exclude<keyof CheckoutValues, 'payment'>, label: TranslationKey, props: Record<string, string> = {}) => (
    <div className="field">
      <label htmlFor={`checkout-${name}`}>{t(label)}</label>
      <input
        className="input"
        id={`checkout-${name}`}
        name={name}
        value={values[name]}
        onChange={(e) => setField(name, e.target.value)}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <span className="field-error" id={`${name}-error`}>
          {t(errors[name])}
        </span>
      )}
    </div>
  )

  return (
    <div className="container section">
      <h1 className="page-title">{t('checkout.title')}</h1>
      <div className="checkout-grid">
        <form onSubmit={onSubmit} noValidate className="checkout-form">
          <fieldset>
            <legend>{t('checkout.contact')}</legend>
            {field('name', 'checkout.name', { autoComplete: 'name' })}
            {field('email', 'checkout.email', { type: 'email', autoComplete: 'email' })}
            {field('street', 'checkout.street', { autoComplete: 'street-address' })}
            <div className="field-row">
              {field('zip', 'checkout.zip', { inputMode: 'numeric', autoComplete: 'postal-code', maxLength: '4' })}
              {field('city', 'checkout.city', { autoComplete: 'address-level2' })}
            </div>
          </fieldset>

          <fieldset>
            <legend>{t('checkout.payment')}</legend>
            <div className="payment-options">
              {PAYMENT_OPTIONS.map((o) => (
                <label key={o.value} className={`payment-option ${values.payment === o.value ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="payment"
                    value={o.value}
                    checked={values.payment === o.value}
                    onChange={() => setField('payment', o.value)}
                  />
                  <span aria-hidden="true">{o.icon}</span> {t(o.label)}
                </label>
              ))}
            </div>
          </fieldset>

          <p className="muted small">{t('checkout.demoNote')}</p>
          {Object.keys(errors).length > 0 && (
            <p className="form-error" role="alert">
              {t('error.form')}
            </p>
          )}
          <button type="submit" className="btn btn-primary btn-lg btn-block">
            {t('checkout.place', { amount: formatCHF(cart.total) })}
          </button>
        </form>

        <aside className="summary">
          <h2>{t('checkout.summary')}</h2>
          <ul>
            {cart.lines.map(({ product, quantity, lineTotal }) => (
              <li key={product.id}>
                <img src={imageUrl(product.image)} alt="" width={48} height={48} />
                <span>
                  {quantity} × {product.name[lang]}
                </span>
                <strong>{formatCHF(lineTotal)}</strong>
              </li>
            ))}
          </ul>
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
            <span>{formatCHF(cart.total)}</span>
          </div>
          <div className="row muted small">
            <span>{t('cart.vat')}</span>
            <span>{formatCHF(cart.vat)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
