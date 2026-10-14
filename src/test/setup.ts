import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom does not implement scrolling. Current Chrome returns a Promise from
// scrollTo, so the mock does too (an effect must not return that value).
window.scrollTo = vi.fn(() => Promise.resolve()) as unknown as typeof window.scrollTo
Element.prototype.scrollIntoView = vi.fn()

beforeEach(() => {
  localStorage.clear()
  localStorage.setItem('alpenmarkt-lang', 'en')
})

afterEach(() => cleanup())
