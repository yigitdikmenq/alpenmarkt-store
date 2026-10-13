import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ProductCard } from '../components/ProductCard'
import { CATEGORIES, PRODUCTS, imageUrl } from '../data/products'
import { useLanguage } from '../i18n/LanguageContext'
import type { Lang } from '../types'

const CATEGORY_IMAGES = {
  cheese: 'gruyere.jpg',
  chocolate: 'pralines.jpg',
  pantry: 'honey.jpg',
  drinks: 'coffee.jpg',
} as const

const REVIEWS: { name: string; city: string; text: Record<Lang, string> }[] = [
  {
    name: 'Laura M.',
    city: 'Zürich',
    text: {
      en: 'The Gruyère tastes exactly like the one from the farm near my grandparents. Delivered the next morning.',
      de: 'Der Gruyère schmeckt genau wie der vom Hof bei meinen Grosseltern. Am nächsten Morgen geliefert.',
    },
  },
  {
    name: 'Marc D.',
    city: 'Lausanne',
    text: {
      en: 'Ordered the praline box as a gift. Beautiful packaging and paying with TWINT took ten seconds.',
      de: 'Die Pralinenbox als Geschenk bestellt. Schöne Verpackung und mit TWINT in zehn Sekunden bezahlt.',
    },
  },
  {
    name: 'Sandra K.',
    city: 'Basel',
    text: {
      en: 'Finally a shop that shows where everything comes from. The alpine honey is now a staple at home.',
      de: 'Endlich ein Shop, der zeigt, woher alles kommt. Der Alpenhonig ist bei uns jetzt Standard.',
    },
  },
]

export function Home() {
  const { lang, t } = useLanguage()
  const { hash } = useLocation()
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 4)

  useEffect(() => {
    if (hash === '#story') document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
  }, [hash])

  return (
    <>
      <section className="hero" style={{ backgroundImage: `url(${imageUrl('hero.jpg')})` }}>
        <div className="hero-shade" />
        <div className="container hero-content">
          <span className="kicker">{t('hero.kicker')}</span>
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.text')}</p>
          <div className="hero-actions">
            <Link to="/shop" className="btn btn-primary btn-lg">
              {t('hero.cta')}
            </Link>
            <a href="#story" className="btn btn-light btn-lg" onClick={(e) => {
              e.preventDefault()
              document.getElementById('story')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              {t('hero.secondary')}
            </a>
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="container trust-grid">
          <div>
            <span className="trust-icon" aria-hidden="true">🚚</span>
            <div>
              <strong>{t('trust.delivery')}</strong>
              <span>{t('trust.delivery.sub')}</span>
            </div>
          </div>
          <div>
            <span className="trust-icon" aria-hidden="true">📱</span>
            <div>
              <strong>{t('trust.payment')}</strong>
              <span>{t('trust.payment.sub')}</span>
            </div>
          </div>
          <div>
            <span className="trust-icon" aria-hidden="true">
              {/* Swiss flag as SVG: flag emojis render as letters on Windows. */}
              <svg width="26" height="26" viewBox="0 0 32 32">
                <rect width="32" height="32" rx="6" fill="#d52b1e" />
                <path d="M13 6h6v7h7v6h-7v7h-6v-7H6v-6h7z" fill="#fff" />
              </svg>
            </span>
            <div>
              <strong>{t('trust.local')}</strong>
              <span>{t('trust.local.sub')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">{t('home.categories')}</h2>
        <div className="category-grid">
          {CATEGORIES.map((c) => (
            <Link key={c} to={`/shop?category=${c}`} className="category-tile">
              <img src={imageUrl(CATEGORY_IMAGES[c])} alt="" loading="lazy" />
              <span>{t(`category.${c}`)}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section">
        <div className="section-head">
          <h2 className="section-title">{t('home.featured')}</h2>
          <Link to="/shop" className="text-link">
            {t('home.viewAll')} →
          </Link>
        </div>
        <div className="product-grid">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section id="story" className="story">
        <div className="container story-grid">
          <img src={imageUrl('market.jpg')} alt="" loading="lazy" />
          <div>
            <h2>{t('home.story.title')}</h2>
            <p>{t('home.story.text')}</p>
            <Link to="/shop" className="btn btn-primary">
              {t('hero.cta')}
            </Link>
          </div>
        </div>
      </section>

      <section className="container section">
        <h2 className="section-title">{t('home.reviews')}</h2>
        <div className="review-grid">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="review">
              <div className="stars">★★★★★</div>
              <blockquote>“{r.text[lang]}”</blockquote>
              <figcaption>
                {r.name} · {r.city}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}
