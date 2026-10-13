import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AppRoutes } from './App'
import { CartProvider } from './cart/CartContext'
import { LanguageProvider } from './i18n/LanguageContext'

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <LanguageProvider>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </LanguageProvider>
    </MemoryRouter>,
  )
}

describe('Alpenmarkt user flows', () => {
  it('filters the shop by category', async () => {
    const user = userEvent.setup()
    renderApp('/shop')
    expect(screen.getByTestId('result-count')).toHaveTextContent('12 products')

    await user.click(screen.getByRole('button', { name: 'Chocolate' }))
    expect(screen.getByTestId('result-count')).toHaveTextContent('3 products')
  })

  it('switches the interface to German', async () => {
    const user = userEvent.setup()
    renderApp('/shop')
    await user.click(screen.getByRole('button', { name: 'DE' }))
    expect(screen.getByRole('heading', { name: 'Alle Produkte' })).toBeInTheDocument()
  })

  it('adds products to the cart and completes checkout', async () => {
    const user = userEvent.setup()
    renderApp('/product/gruyere-aop')

    // Choose 2 and add to cart: 2 × 14.90 = 29.80, plus 7.90 delivery.
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: /Add to cart · CHF 29.80/ }))
    expect(screen.getByTestId('cart-count')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('CHF 37.70')

    await user.click(screen.getByRole('button', { name: 'Go to checkout' }))
    expect(screen.getByRole('heading', { name: 'Checkout' })).toBeInTheDocument()

    // Submitting an empty form shows errors and does not place the order.
    await user.click(screen.getByRole('button', { name: /Place order/ }))
    expect(screen.getByRole('alert')).toHaveTextContent('Please check the highlighted fields.')

    await user.type(screen.getByLabelText('Full name'), 'Anna Muster')
    await user.type(screen.getByLabelText('Email'), 'anna@example.ch')
    await user.type(screen.getByLabelText('Street and number'), 'Bahnhofstrasse 1')
    await user.type(screen.getByLabelText('Postcode'), '8001')
    await user.type(screen.getByLabelText('City'), 'Zürich')
    await user.click(screen.getByLabelText(/PostFinance/))
    await user.click(screen.getByRole('button', { name: /Place order · CHF 37.70/ }))

    const main = screen.getByRole('main')
    expect(within(main).getByRole('heading', { name: 'Thank you for your order!' })).toBeInTheDocument()
    expect(within(main).getByText(/anna@example.ch/)).toBeInTheDocument()
    expect(screen.getByTestId('cart-count')).toHaveTextContent('0')
  })

  it('keeps the cart after a reload', async () => {
    const user = userEvent.setup()
    const { unmount } = renderApp('/product/alpine-honey')
    await user.click(screen.getByRole('button', { name: /Add to cart · / }))
    unmount()

    renderApp('/')
    expect(screen.getByTestId('cart-count')).toHaveTextContent('1')
  })

  it('shows a friendly message for unknown products', () => {
    renderApp('/product/does-not-exist')
    expect(screen.getByText('Product not found.')).toBeInTheDocument()
  })
})
