import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Biblioteca } from '../../src/components/pages/Biblioteca'

describe('Biblioteca', () => {
  test('renderiza texto Biblioteca', () => {
    render(<Biblioteca />)
    expect(screen.getByText(/biblioteca/i)).toBeInTheDocument()
  })
})
