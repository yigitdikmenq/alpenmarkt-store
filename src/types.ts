export type Lang = 'en' | 'de'

export type Localized = Record<Lang, string>

export type Category = 'cheese' | 'chocolate' | 'pantry' | 'drinks'

export interface Product {
  id: string
  name: Localized
  description: Localized
  category: Category
  /** Price in Rappen (1 CHF = 100 Rappen) to avoid floating-point rounding errors. */
  price: number
  image: string
  weight: string
  origin: string
  rating: number
  reviews: number
  featured?: boolean
}

/** Cart contents: product id -> quantity. */
export type CartItems = Record<string, number>
