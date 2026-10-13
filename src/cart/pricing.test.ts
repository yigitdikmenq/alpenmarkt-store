import { describe, expect, it } from 'vitest'
import type { Product } from '../types'
import { FREE_SHIPPING_FROM, SHIPPING_FEE, calculateTotals, formatCHF } from './pricing'

const product = (id: string, price: number): Product => ({
  id,
  price,
  name: { en: id, de: id },
  description: { en: '', de: '' },
  category: 'cheese',
  image: '',
  weight: '',
  origin: '',
  rating: 5,
  reviews: 0,
})

const catalogue = [product('cheese', 1490), product('chocolate', 450), product('box', 2900)]

describe('calculateTotals', () => {
  it('returns zeros for an empty cart and no delivery fee', () => {
    const t = calculateTotals({}, catalogue)
    expect(t.subtotal).toBe(0)
    expect(t.shipping).toBe(0)
    expect(t.total).toBe(0)
    expect(t.itemCount).toBe(0)
  })

  it('adds the delivery fee below CHF 80', () => {
    const t = calculateTotals({ cheese: 2, chocolate: 1 }, catalogue)
    expect(t.subtotal).toBe(3430)
    expect(t.shipping).toBe(SHIPPING_FEE)
    expect(t.total).toBe(3430 + SHIPPING_FEE)
    expect(t.itemCount).toBe(3)
    expect(t.missingForFreeShipping).toBe(FREE_SHIPPING_FROM - 3430)
  })

  it('gives free delivery from exactly CHF 80', () => {
    const t = calculateTotals({ box: 2, cheese: 1, chocolate: 2 }, catalogue) // 5800 + 1490 + 900 = 8190
    expect(t.subtotal).toBe(8190)
    expect(t.shipping).toBe(0)
    expect(t.missingForFreeShipping).toBe(0)
  })

  it('calculates the VAT included in the total (8.1%)', () => {
    const t = calculateTotals({ box: 3 }, catalogue) // 8700, free delivery
    expect(t.vat).toBe(Math.round(8700 - 8700 / 1.081)) // 652
  })

  it('ignores unknown products and zero quantities', () => {
    const t = calculateTotals({ ghost: 3, cheese: 0, chocolate: 1 }, catalogue)
    expect(t.lines).toHaveLength(1)
    expect(t.subtotal).toBe(450)
  })
})

describe('formatCHF', () => {
  it('formats Rappen as francs with two decimals', () => {
    expect(formatCHF(1490)).toBe('CHF 14.90')
    expect(formatCHF(5)).toBe('CHF 0.05')
    expect(formatCHF(0)).toBe('CHF 0.00')
  })
})
