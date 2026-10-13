import type { CartItems, Product } from '../types'

/** Delivery is free from CHF 80. */
export const FREE_SHIPPING_FROM = 8000
export const SHIPPING_FEE = 790
/** Swiss standard VAT rate since 2024. Prices already include VAT. */
export const VAT_RATE = 0.081

export interface CartLine {
  product: Product
  quantity: number
  lineTotal: number
}

export interface CartTotals {
  lines: CartLine[]
  itemCount: number
  subtotal: number
  shipping: number
  total: number
  /** VAT contained in the total (prices are VAT-inclusive). */
  vat: number
  /** How much more the customer must spend for free delivery (0 if already free). */
  missingForFreeShipping: number
}

export function calculateTotals(items: CartItems, catalogue: Product[]): CartTotals {
  const lines: CartLine[] = []
  for (const [id, quantity] of Object.entries(items)) {
    const product = catalogue.find((p) => p.id === id)
    if (product && quantity > 0) {
      lines.push({ product, quantity, lineTotal: product.price * quantity })
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0)
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0)
  const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_FEE
  const total = subtotal + shipping
  const vat = Math.round(total - total / (1 + VAT_RATE))
  const missingForFreeShipping = subtotal === 0 ? FREE_SHIPPING_FROM : Math.max(0, FREE_SHIPPING_FROM - subtotal)

  return { lines, itemCount, subtotal, shipping, total, vat, missingForFreeShipping }
}

/** Formats Rappen as Swiss francs, e.g. 1490 -> "CHF 14.90". */
export function formatCHF(rappen: number): string {
  return `CHF ${(rappen / 100).toFixed(2)}`
}
