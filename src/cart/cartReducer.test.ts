import { describe, expect, it } from 'vitest'
import { MAX_QUANTITY, cartReducer } from './cartReducer'

describe('cartReducer', () => {
  it('adds a new product with quantity 1 by default', () => {
    expect(cartReducer({}, { type: 'add', id: 'a' })).toEqual({ a: 1 })
  })

  it('increases the quantity of an existing product', () => {
    expect(cartReducer({ a: 2 }, { type: 'add', id: 'a', quantity: 3 })).toEqual({ a: 5 })
  })

  it('never goes above the maximum quantity', () => {
    expect(cartReducer({ a: 98 }, { type: 'add', id: 'a', quantity: 5 })).toEqual({ a: MAX_QUANTITY })
  })

  it('removes the product when the quantity is set to 0', () => {
    expect(cartReducer({ a: 2, b: 1 }, { type: 'setQuantity', id: 'a', quantity: 0 })).toEqual({ b: 1 })
  })

  it('removes a product', () => {
    expect(cartReducer({ a: 2, b: 1 }, { type: 'remove', id: 'b' })).toEqual({ a: 2 })
  })

  it('clears the cart', () => {
    expect(cartReducer({ a: 2, b: 1 }, { type: 'clear' })).toEqual({})
  })

  it('does not mutate the previous state', () => {
    const before = { a: 1 }
    cartReducer(before, { type: 'add', id: 'a' })
    expect(before).toEqual({ a: 1 })
  })
})
