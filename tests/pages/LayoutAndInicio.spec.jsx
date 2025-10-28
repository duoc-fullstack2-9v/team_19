import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../../src/components/layout/Header', () => ({
  Header: () => <header data-testid="header">Header</header>
}))
vi.mock('../../src/components/layout/Nav', () => ({
  Nav: () => <nav data-testid="nav">Nav</nav>
}))
vi.mock('../../src/components/layout/Body', () => ({
  Body: () => <main data-testid="body">Body</main>
}))
vi.mock('../../src/components/layout/Lateral', () => ({
  Lateral: () => <aside data-testid="lateral">Lateral</aside>
}))
vi.mock('../../src/components/layout/Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>
}))

import { Inicio } from '../../src/components/pages/Inicio'
import { Header } from '../../src/components/layout/Header'
import { Nav } from '../../src/components/layout/Nav'
import { Body } from '../../src/components/layout/Body'
import { Lateral } from '../../src/components/layout/Lateral'
import { Footer } from '../../src/components/layout/Footer'

describe('Layout + Inicio', () => {
  test('inicio y layout renderizan correctamente y snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Header />
        <Nav />
        <Lateral />
        <Inicio />
        <Body />
        <Footer />
      </MemoryRouter>
    )

    expect(screen.getByText(/inicio/i)).toBeInTheDocument()
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('nav')).toBeInTheDocument()
    expect(screen.getByTestId('body')).toBeInTheDocument()
    expect(screen.getByTestId('lateral')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()

    expect(asFragment()).toMatchSnapshot()
  })
})