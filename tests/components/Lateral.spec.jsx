import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Lateral } from '../../src/components/layout/Lateral'

describe('Lateral', () => {
  test('renderiza texto Lateral', () => {
    render(<Lateral />)
    expect(screen.getByText(/lateral/i)).toBeInTheDocument()
  })
})
