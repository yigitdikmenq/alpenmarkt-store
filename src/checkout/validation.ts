import type { TranslationKey } from '../i18n/translations'

export type PaymentMethod = 'twint' | 'postfinance' | 'card'

export interface CheckoutValues {
  name: string
  email: string
  street: string
  zip: string
  city: string
  payment: PaymentMethod
}

export type CheckoutErrors = Partial<Record<keyof CheckoutValues, TranslationKey>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SWISS_ZIP_PATTERN = /^[1-9]\d{3}$/

/** Returns an error message key per invalid field. An empty object means the form is valid. */
export function validateCheckout(values: CheckoutValues): CheckoutErrors {
  const errors: CheckoutErrors = {}
  const required: (keyof CheckoutValues)[] = ['name', 'email', 'street', 'zip', 'city']

  for (const field of required) {
    if (!values[field].trim()) errors[field] = 'error.required'
  }
  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) errors.email = 'error.email'
  if (!errors.zip && !SWISS_ZIP_PATTERN.test(values.zip.trim())) errors.zip = 'error.zip'

  return errors
}
