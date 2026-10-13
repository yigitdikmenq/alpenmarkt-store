import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, PRODUCTS } from '../data/products'
import { useLanguage } from '../i18n/LanguageContext'
import { filterProducts, type SortOption } from '../shop/filterProducts'
import type { Category } from '../types'

export function Shop() {
  const { lang, t } = useLanguage()
  const [params, setParams] = useSearchParams()

  // Filters live in the URL, so a filtered view can be shared or bookmarked.
  const category = (CATEGORIES as readonly string[]).includes(params.get('category') ?? '')
    ? (params.get('category') as Category)
    : 'all'
  const query = params.get('q') ?? ''
  const sort = (params.get('sort') as SortOption) || 'featured'

  const products = useMemo(() => filterProducts(PRODUCTS, { category, query, sort, lang }), [category, query, sort, lang])

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value && value !== 'all' && !(key === 'sort' && value === 'featured')) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  return (
    <div className="container section">
      <h1 className="page-title">{t('shop.title')}</h1>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Categories">
          {(['all', ...CATEGORIES] as const).map((c) => (
            <button key={c} className="chip" aria-pressed={category === c} onClick={() => update('category', c)}>
              {t(`category.${c}`)}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          <input
            className="input"
            type="search"
            value={query}
            onChange={(e) => update('q', e.target.value)}
            placeholder={t('search.placeholder')}
            aria-label={t('search.placeholder')}
          />
          <label className="sort">
            <span>{t('sort.label')}</span>
            <select className="input" value={sort} onChange={(e) => update('sort', e.target.value)}>
              <option value="featured">{t('sort.featured')}</option>
              <option value="price-asc">{t('sort.priceAsc')}</option>
              <option value="price-desc">{t('sort.priceDesc')}</option>
              <option value="rating">{t('sort.rating')}</option>
            </select>
          </label>
        </div>
      </div>

      <p className="muted" data-testid="result-count">
        {t('shop.results', { count: products.length })}
      </p>

      {products.length ? (
        <div className="product-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>{t('shop.empty')}</p>
          <button className="btn btn-light" onClick={() => setParams({}, { replace: true })}>
            {t('shop.reset')}
          </button>
        </div>
      )}
    </div>
  )
}
