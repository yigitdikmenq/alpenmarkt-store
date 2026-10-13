import type { Category, Lang, Product } from '../types'

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'rating'

export function filterProducts(
  products: Product[],
  { category, query, sort, lang }: { category: Category | 'all'; query: string; sort: SortOption; lang: Lang },
): Product[] {
  const q = query.trim().toLowerCase()
  const result = products.filter(
    (p) =>
      (category === 'all' || p.category === category) &&
      (!q ||
        p.name.en.toLowerCase().includes(q) ||
        p.name.de.toLowerCase().includes(q) ||
        p.description[lang].toLowerCase().includes(q) ||
        p.origin.toLowerCase().includes(q)),
  )
  const sorters: Record<SortOption, (a: Product, b: Product) => number> = {
    featured: (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false),
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  }
  return [...result].sort(sorters[sort])
}
