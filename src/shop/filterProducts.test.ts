import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '../data/products'
import { filterProducts } from './filterProducts'

const base = { category: 'all' as const, query: '', sort: 'featured' as const, lang: 'en' as const }

describe('filterProducts', () => {
  it('returns every product without filters', () => {
    expect(filterProducts(PRODUCTS, base)).toHaveLength(PRODUCTS.length)
  })

  it('filters by category', () => {
    const result = filterProducts(PRODUCTS, { ...base, category: 'chocolate' })
    expect(result.length).toBeGreaterThan(0)
    expect(result.every((p) => p.category === 'chocolate')).toBe(true)
  })

  it('searches English and German names', () => {
    expect(filterProducts(PRODUCTS, { ...base, query: 'honey' }).map((p) => p.id)).toContain('alpine-honey')
    expect(filterProducts(PRODUCTS, { ...base, query: 'honig' }).map((p) => p.id)).toContain('alpine-honey')
  })

  it('sorts by price ascending', () => {
    const prices = filterProducts(PRODUCTS, { ...base, sort: 'price-asc' }).map((p) => p.price)
    expect(prices).toEqual([...prices].sort((a, b) => a - b))
  })

  it('does not mutate the original catalogue', () => {
    const before = PRODUCTS.map((p) => p.id)
    filterProducts(PRODUCTS, { ...base, sort: 'price-desc' })
    expect(PRODUCTS.map((p) => p.id)).toEqual(before)
  })
})
