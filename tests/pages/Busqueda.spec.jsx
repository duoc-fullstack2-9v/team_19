import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Busqueda } from '../../src/components/pages/Busqueda'

describe('Busqueda', () => {
  test('renderiza texto Busqueda', () => {
    render(<Busqueda />)
    expect(screen.getByText(/busqueda/i)).toBeInTheDocument()
  })
})
