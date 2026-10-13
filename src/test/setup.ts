import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom does not implement scrolling.
window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
Element.prototype.scrollIntoView = vi.fn()

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('alpenmarkt-lang', 'en')
})

afterEach(() => cleanup())
