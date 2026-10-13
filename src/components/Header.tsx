import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../cart/CartContext'
import { useLanguage } from '../i18n/LanguageContext'

export function Header() {
  const { lang, setLang, t } = useLanguage()
  const { itemCount, openCart } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function onSearch(e: FormEvent) {
    e.preventDefault()
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`)
  }

  return (
    <>
      <div className="demo-bar">
        {t('demo.bar')} {t('demo.by')} <a href="https://yigitdikmenq.github.io">Yigit Dikmen</a>
      </div>
      <header className="header">
        <div className="container header-inner">
          <Link to="/" className="logo">
            <span className="logo-mark" aria-hidden="true">▲</span> Alpenmarkt
          </Link>
          <nav className="nav">
            <NavLink to="/shop">{t('nav.shop')}</NavLink>
            <Link to="/#story">{t('nav.about')}</Link>
          </nav>
          <form className="search" onSubmit={onSearch} role="search">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search.placeholder')}
              aria-label={t('search.placeholder')}
            />
          </form>
          <div className="lang-switch" role="group" aria-label="Language">
            {(['en', 'de'] as const).map((l) => (
              <button key={l} aria-pressed={lang === l} onClick={() => setLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="cart-button" onClick={openCart} aria-label={`${t('nav.cart')} (${itemCount})`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6h15l-1.5 9h-12z" />
              <path d="M6 6 5 3H2" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            <span className="cart-label">{t('nav.cart')}</span>
            <span className="cart-count" data-testid="cart-count">
              {itemCount}
            </span>
          </button>
        </div>
      </header>
    </>
  )
}
