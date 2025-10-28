import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Editar } from '../../src/components/pages/Editar'

describe('Editar', () => {
  test('renderiza texto Editar', () => {
    render(<Editar />)
    expect(screen.getByText(/editar/i)).toBeInTheDocument()
  })
})
