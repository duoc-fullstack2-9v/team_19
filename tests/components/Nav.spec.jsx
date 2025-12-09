import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, vi, beforeEach } from 'vitest'

import { Nav } from '../../src/components/layout/Nav'
import { MemoryRouter } from 'react-router-dom'

describe('Nav', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('alert', () => {})
  // remove any global search handler
  if (typeof globalThis !== 'undefined') delete globalThis.__onSearch
  })

  test('buscador llama a onSearch cuando se escribe', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(
      <MemoryRouter>
        <Nav onSearch={onSearch} />
      </MemoryRouter>
    )

    const input = screen.getByPlaceholderText(/Que busca mi estimado/i)
    await user.type(input, 'Spiderman')

    expect(onSearch).toHaveBeenCalled()
    expect(onSearch).toHaveBeenLastCalledWith('Spiderman')
  })

  test('registro guarda usuario en localStorage y cierra popup', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    )

    // Abrir popup de registro
    const regBtn = screen.getByText(/Registrarse/i)
    await user.click(regBtn)

  // Rellenar formulario de registro (labels no están asociados por id, usamos within)
  const registroHeading = screen.getByText(/Registro/i)
  const popupContent = registroHeading.closest('.popup-content')
  const inputs = popupContent.querySelectorAll('input')
  const nombre = inputs[0]
  const email = inputs[1]
  const password = inputs[2]
  await user.type(nombre, 'Prueba')
  await user.type(email, 'prueba@example.com')
  await user.type(password, '123456')

    const registrarBtn = screen.getByText(/^Registrar$/i)
    await user.click(registrarBtn)

    // Debe haberse guardado en localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]')
    expect(users.some(u => u.email === 'prueba@example.com')).toBe(true)

    // Popup debe cerrarse (no debe encontrar el título Registro)
    expect(screen.queryByText(/Registro/i)).not.toBeInTheDocument()
  })

  test('login usa onLogin con usuario almacenado', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()

    // Pre-guardar usuario
    const stored = [{ name: 'Stored', email: 'stored@example.com', password: 'secret', isAdmin: false }]
    localStorage.setItem('users', JSON.stringify(stored))

    render(
      <MemoryRouter>
        <Nav onLogin={onLogin} />
      </MemoryRouter>
    )

    // Abrir popup de login
    const loginBtn = screen.getByText(/Iniciar sesión/i)
    await user.click(loginBtn)

    const loginHeading = screen.getByRole('heading', { name: /Iniciar sesión/i })
    const loginPopup = loginHeading.closest('.popup-content')
    const loginInputs = loginPopup.querySelectorAll('input')
    const emailInput = loginInputs[0]
    const passInput = loginInputs[1]
    await user.type(emailInput, 'stored@example.com')
    await user.type(passInput, 'secret')

    const entrarBtn = screen.getByText(/^Entrar$/i)
    await user.click(entrarBtn)

    expect(onLogin).toHaveBeenCalled()
    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ email: 'stored@example.com' }))
  })

  test('login admin fallback funciona y llama onLogin con isAdmin true', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn()

    render(
      <MemoryRouter>
        <Nav onLogin={onLogin} />
      </MemoryRouter>
    )

    // Abrir popup de login
    const loginBtn = screen.getByText(/Iniciar sesión/i)
    await user.click(loginBtn)

    const loginHeading = screen.getByRole('heading', { name: /Iniciar sesión/i })
    const loginPopup = loginHeading.closest('.popup-content')
    const loginInputs = loginPopup.querySelectorAll('input')
    await user.type(loginInputs[0], 'admin@admin.com')
    await user.type(loginInputs[1], 'admin')

    await user.click(screen.getByText(/^Entrar$/i))

    expect(onLogin).toHaveBeenCalled()
    expect(onLogin).toHaveBeenCalledWith(expect.objectContaining({ email: 'admin@admin.com', isAdmin: true }))
  })
})
