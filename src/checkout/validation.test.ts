import { describe, expect, it } from 'vitest'
import { validateCheckout, type CheckoutValues } from './validation'

const valid: CheckoutValues = {
  name: 'Anna Muster',
  email: 'anna@example.ch',
  street: 'Bahnhofstrasse 1',
  zip: '8001',
  city: 'Zürich',
  payment: 'twint',
}

describe('validateCheckout', () => {
  it('accepts a complete, valid form', () => {
    expect(validateCheckout(valid)).toEqual({})
  })

  it('requires every text field', () => {
    const errors = validateCheckout({ ...valid, name: ' ', email: '', street: '', zip: '', city: '' })
    expect(errors).toEqual({
      name: 'error.required',
      email: 'error.required',
      street: 'error.required',
      zip: 'error.required',
      city: 'error.required',
    })
  })

  it('rejects an invalid email', () => {
    expect(validateCheckout({ ...valid, email: 'anna@example' }).email).toBe('error.email')
  })

  it.each(['800', '80011', '0123', 'abcd'])('rejects the postcode %s', (zip) => {
    expect(validateCheckout({ ...valid, zip }).zip).toBe('error.zip')
  })

  it('accepts postcodes with surrounding spaces', () => {
    expect(validateCheckout({ ...valid, zip: ' 3011 ' })).toEqual({})
  })
})
