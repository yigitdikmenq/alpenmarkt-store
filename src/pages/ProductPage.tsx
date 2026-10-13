import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { formatCHF } from '../cart/pricing'
import { ProductCard } from '../components/ProductCard'
import { QuantityStepper } from '../components/QuantityStepper'
import { Stars } from '../components/Stars'
import { PRODUCTS, findProduct, imageUrl } from '../data/products'
import { useLanguage } from '../i18n/LanguageContext'

export function ProductPage() {
  const { id = '' } = useParams()
  // The key resets local state (e.g. the quantity) when moving to a related product.
  return <ProductDetail key={id} id={id} />
}

function ProductDetail({ id }: { id: string }) {
  const { lang, t } = useLanguage()
  const { dispatch, openCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const product = findProduct(id)

  if (!product) {
    return (
      <div className="container section empty-state">
        <p>{t('product.notFound')}</p>
        <Link to="/shop" className="btn btn-primary">
          {t('product.back')}
        </Link>
      </div>
    )
  }

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="container section">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/shop">{t('nav.shop')}</Link> /{' '}
        <Link to={`/shop?category=${product.category}`}>{t(`category.${product.category}`)}</Link> /{' '}
        <span>{product.name[lang]}</span>
      </nav>

      <div className="product-detail">
        <img className="product-image" src={imageUrl(product.image)} alt={product.name[lang]} width={800} height={800} />
        <div className="product-info">
          <span className="kicker dark">{t(`category.${product.category}`)}</span>
          <h1>{product.name[lang]}</h1>
          <div className="card-meta">
            <Stars rating={product.rating} /> {product.rating.toFixed(1)} · {t('product.reviews', { count: product.reviews })}
          </div>
          <p className="product-price">
            {formatCHF(product.price)} <span className="muted small">{t('product.vat')}</span>
          </p>
          <p className="product-desc">{product.description[lang]}</p>

          <dl className="facts">
            <div>
              <dt>{t('product.weight')}</dt>
              <dd>{product.weight}</dd>
            </div>
            <div>
              <dt>{t('product.origin')}</dt>
              <dd>{product.origin}</dd>
            </div>
          </dl>

          <div className="buy-row">
            <div>
              <span className="small muted">{t('product.quantity')}</span>
              <QuantityStepper value={quantity} onChange={setQuantity} min={1} />
            </div>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                dispatch({ type: 'add', id: product.id, quantity })
                openCart()
              }}
            >
              {t('product.add')} · {formatCHF(product.price * quantity)}
            </button>
          </div>

          <ul className="perks">
            <li>🚚 {t('trust.delivery')}</li>
            <li>📱 {t('trust.payment')}</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="section">
          <h2 className="section-title">{t('product.related')}</h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
