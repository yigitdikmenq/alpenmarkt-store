import type { CartItems } from '../types'

export const MAX_QUANTITY = 99

export type CartAction =
  | { type: 'add'; id: string; quantity?: number }
  | { type: 'setQuantity'; id: string; quantity: number }
  | { type: 'remove'; id: string }
  | { type: 'clear' }

export function cartReducer(state: CartItems, action: CartAction): CartItems {
  switch (action.type) {
    case 'add': {
      const next = (state[action.id] ?? 0) + (action.quantity ?? 1)
      return { ...state, [action.id]: Math.min(next, MAX_QUANTITY) }
    }
    case 'setQuantity': {
      if (action.quantity <= 0) return cartReducer(state, { type: 'remove', id: action.id })
      return { ...state, [action.id]: Math.min(Math.floor(action.quantity), MAX_QUANTITY) }
    }
    case 'remove': {
      const next = { ...state }
      delete next[action.id]
      return next
    }
    case 'clear':
      return {}
  }
}
