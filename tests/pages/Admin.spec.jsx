import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect, beforeEach, vi } from 'vitest'

import { Admin } from '../../src/components/pages/Admin'

describe('Admin (interacciones)', () => {
  beforeEach(() => {
    localStorage.clear()
    // Asegurar confirm y alert controlados
    vi.stubGlobal('confirm', () => true)
    vi.stubGlobal('alert', () => {})
  })

  test('renderiza el título principal', () => {
    render(<Admin />)
    expect(screen.getByText(/Administración de usuarios/i)).toBeInTheDocument()
  })

  test('crear, editar y eliminar un usuario en la lista', async () => {
    const user = userEvent.setup()
  render(<Admin />)

  // Crear usuario vía popup (botón flotante)
  const flBtn = screen.getByRole('button', { name: /Crear usuario/i })
  await user.click(flBtn)

  const popup = document.querySelector('.popup-content')
  const w = within(popup)
  const txts = w.getAllByRole('textbox')
  const nameInput = txts[0]
  const emailInput = txts[1]
  const passInput = popup.querySelector('input[type="password"]')

  await user.type(nameInput, 'Tester')
  await user.type(emailInput, 'tester@example.com')
  await user.type(passInput, 'password')

  // Click en crear dentro del popup
  const createBtn = w.getByText(/^Crear$/i)
  await user.click(createBtn)

    // Ahora debe aparecer en la tabla
    expect(screen.getByText('Tester')).toBeInTheDocument()
    expect(screen.getByText('tester@example.com')).toBeInTheDocument()

    // Editar: primero obtener el botón Editar (el primero)
    const editButtons = screen.getAllByText('Editar')
    await user.click(editButtons[0])

    // Cambiar nombre
    const inputsAfter = screen.getAllByRole('textbox')
    await user.clear(inputsAfter[0])
    await user.type(inputsAfter[0], 'Tester 2')

    const saveBtn = screen.getByText('Guardar')
    await user.click(saveBtn)

    expect(screen.getByText('Tester 2')).toBeInTheDocument()

    // Eliminar: mock confirm devuelve true en beforeEach
    const deleteButtons = screen.getAllByText('Eliminar')
    await user.click(deleteButtons[0])

    // Tras eliminar, el usuario debe desaparecer
    expect(screen.queryByText('Tester 2')).not.toBeInTheDocument()
  })

  test('botón flotante abre popup y crear usuario desde popup', async () => {
    const user = userEvent.setup()
    render(<Admin />)

  // Click en el botón flotante "Crear usuario" (botón, no el h3)
  const flBtn = screen.getByRole('button', { name: /Crear usuario/i })
    await user.click(flBtn)

    // Debe abrirse el popup con la clase igual al popup del carrito
    const overlay = document.querySelector('.popup-overlay.active')
    expect(overlay).toBeTruthy()

    const popup = document.querySelector('.popup-content')
    expect(popup).toBeTruthy()

    const w = within(popup)

    // Inputs: nombre y email son textboxes dentro del popup
    const txts = w.getAllByRole('textbox')
    const nameInput = txts[0]
    const emailInput = txts[1]
    const passInput = popup.querySelector('input[type="password"]')

    await user.type(nameInput, 'PopupUser')
    await user.type(emailInput, 'popup@example.com')
    await user.type(passInput, 'password')

    // En el popup el botón de enviar es "Crear"
    const submitBtn = w.getByText(/^Crear$/i)
    await user.click(submitBtn)

    // Tras crear, debe aparecer en la tabla
    expect(screen.getByText('PopupUser')).toBeInTheDocument()
    expect(screen.getByText('popup@example.com')).toBeInTheDocument()

    // Y en localStorage
    const stored = JSON.parse(localStorage.getItem('users') || '[]')
    expect(stored.some(u => u.email === 'popup@example.com')).toBe(true)
  })
})
