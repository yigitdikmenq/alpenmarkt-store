import credits from '../data/photoCredits.json'
import { useLanguage } from '../i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="logo">
            <span className="logo-mark" aria-hidden="true">▲</span> Alpenmarkt
          </div>
          <p className="muted small">© 2026 Alpenmarkt · {t('demo.bar')}</p>
          <p className="small">
            {t('demo.by')} <a href="https://yigitdikmenq.github.io">Yigit Dikmen</a> ·{' '}
            <a href="https://github.com/yigitdikmenq/alpenmarkt-store">{t('footer.source')}</a>
          </p>
        </div>
        <details className="credits">
          <summary>{t('footer.credits')}</summary>
          <ul>
            {credits.map((c) => (
              <li key={c.file}>
                <a href={c.photo_url}>{c.file.replace('.jpg', '')}</a> by <a href={c.author_url}>{c.author}</a>
              </li>
            ))}
          </ul>
        </details>
      </div>
    </footer>
  )
}
