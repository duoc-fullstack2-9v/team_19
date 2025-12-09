import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'

// Mock components that may be complex
vi.mock('../src/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>
}))
vi.mock('../src/components/layout/Nav', () => ({
  Nav: () => <nav data-testid="nav">Nav</nav>
}))

import App from '../src/App'

describe('App (render básico)', () => {
  test('renderiza Body y Footer dentro de App', () => {
    render(<App />)
    // Body contiene el botón Ver Carrito
    expect(screen.getByText(/Ver Carrito/i)).toBeInTheDocument()
    // Footer debe estar presente
    expect(screen.getByText(/MULTIVERSO COMICS/i)).toBeInTheDocument()
  })
})
