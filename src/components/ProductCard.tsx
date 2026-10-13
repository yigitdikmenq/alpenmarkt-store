import { Link } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { formatCHF } from '../cart/pricing'
import { imageUrl } from '../data/products'
import { useLanguage } from '../i18n/LanguageContext'
import type { Product } from '../types'
import { Stars } from './Stars'

export function ProductCard({ product }: { product: Product }) {
  const { lang, t } = useLanguage()
  const { dispatch, openCart } = useCart()

  return (
    <article className="card">
      <Link to={`/product/${product.id}`} className="card-media">
        <img src={imageUrl(product.image)} alt={product.name[lang]} loading="lazy" width={400} height={400} />
        <span className="card-tag">{t(`category.${product.category}`)}</span>
      </Link>
      <div className="card-body">
        <Link to={`/product/${product.id}`} className="card-title">
          {product.name[lang]}
        </Link>
        <div className="card-meta">
          <Stars rating={product.rating} /> <span>({product.reviews})</span>
          <span className="card-weight"> · {product.weight}</span>
        </div>
        <div className="card-foot">
          <span className="price">{formatCHF(product.price)}</span>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              dispatch({ type: 'add', id: product.id })
              openCart()
            }}
          >
            {t('product.add')}
          </button>
        </div>
      </div>
    </article>
  )
}
