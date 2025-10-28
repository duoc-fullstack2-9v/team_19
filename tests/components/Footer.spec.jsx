import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, test, expect } from 'vitest'

import { Footer } from '../../src/components/layout/Footer'

describe('Footer', () => {
  test('renderiza copyright y texto', () => {
    render(<Footer />)
    expect(screen.getByText(/MULTIVERSO COMICS/i)).toBeInTheDocument()
  })
})
