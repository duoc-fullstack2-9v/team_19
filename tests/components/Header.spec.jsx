import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Header } from '../../src/components/layout/Header'

describe('Header', () => {
  test('muestra el título y el logo (alt)', () => {
    render(<Header />)
    expect(screen.getByText(/MULTIVERSO COMICS/i)).toBeInTheDocument()
    // imagen con alt 'logo' debería estar presente
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument()
  })

  test('popups de registro/login no están visibles por defecto', () => {
    render(<Header />)
    expect(screen.queryByText(/Formulario de Registro/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Iniciar sesión/i)).not.toBeInTheDocument()
  })
})
