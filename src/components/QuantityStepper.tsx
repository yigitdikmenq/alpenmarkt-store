import { MAX_QUANTITY } from '../cart/cartReducer'
import { useLanguage } from '../i18n/LanguageContext'

interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
}

export function QuantityStepper({ value, onChange, min = 0 }: Props) {
  const { t } = useLanguage()
  return (
    <div className="stepper">
      <button type="button" aria-label={t('qty.decrease')} onClick={() => onChange(value - 1)} disabled={value <= min}>
        −
      </button>
      <span aria-live="polite">{value}</span>
      <button type="button" aria-label={t('qty.increase')} onClick={() => onChange(value + 1)} disabled={value >= MAX_QUANTITY}>
        +
      </button>
    </div>
  )
}
