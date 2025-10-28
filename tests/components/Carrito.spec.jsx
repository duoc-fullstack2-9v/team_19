import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Carrito } from '../../src/components/pages/Carrito'

describe('Carrito', () => {
  test('renderiza texto Carrito', () => {
    render(<Carrito />)
    expect(screen.getByText(/carrito/i)).toBeInTheDocument()
  })
})
