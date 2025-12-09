import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Crear } from '../../src/components/pages/Crear'

describe('Crear', () => {
  test('renderiza texto Crear', () => {
    render(<Crear />)
    expect(screen.getByText(/crear/i)).toBeInTheDocument()
  })
})
