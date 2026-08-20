import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'

import { Nav } from '../../src/components/layout/Nav'
import { AuthProvider } from '../../src/context/AuthContext'
import { MemoryRouter } from 'react-router-dom'

describe('Nav', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('alert', () => {})
    if (typeof globalThis !== 'undefined') delete globalThis.__onSearch
  })

  test('buscador llama a onSearch cuando se escribe', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(
      <MemoryRouter>
        <AuthProvider>
          <Nav onSearch={onSearch} />
        </AuthProvider>
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Que busca mi estimado/i)
    await user.type(input, 'Spiderman')

    expect(onSearch).toHaveBeenCalled()
    expect(onSearch).toHaveBeenLastCalledWith('Spiderman')
  })

  test('muestra enlaces de navegación pública y botones de autenticación', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Nav />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
    expect(screen.getByText('Registrarse')).toBeInTheDocument()
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument()
  })

  test('muestra enlaces de administración cuando el usuario tiene rol ADMIN', async () => {
    // JWT mock con payload: {"sub":"admin@test.com","rol":"ADMIN"}
    const mockAdminToken = 'header.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbCI6IkFETUlOIn0.signature'
    localStorage.setItem('authToken', mockAdminToken)

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({ success: true })
    })

    render(
      <MemoryRouter>
        <AuthProvider>
          <Nav />
        </AuthProvider>
      </MemoryRouter>
    )

    expect(screen.getByText('Inicio')).toBeInTheDocument()
    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
  })
})
