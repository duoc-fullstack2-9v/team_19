import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, test, expect } from 'vitest'

import { Body } from '../../src/components/layout/Body'

describe('Body (funcional)', () => {
  test('agrega producto al carrito, procede a pago y muestra éxito', async () => {
    const user = userEvent.setup()
    const { container } = render(<Body />)

    // click en el primer icono de carrito (emoji)
    const carritoIcons = container.querySelectorAll('.carrito-icono')
    expect(carritoIcons.length).toBeGreaterThan(0)
    await user.click(carritoIcons[0])

    // abrir popup de carrito
    const verCarritoBtn = screen.getByText(/Ver Carrito/i)
    await user.click(verCarritoBtn)

    // Debe aparecer el encabezado del popup
    expect(screen.getByText(/Carrito de Compras/i)).toBeInTheDocument()

    // Debe mostrar el total y el botón de proceder al pago
    expect(screen.getByText(/Total:/i)).toBeInTheDocument()
    const procederBtn = screen.getByText(/Proceder al Pago/i)
    await user.click(procederBtn)

    // En modo pago, seleccionar una forma de pago (ej. Tarjeta de Débito)
    const tarjetaBtn = screen.getByText(/Tarjeta de Débito/i)
    await user.click(tarjetaBtn)

    // Debe aparecer el popup de pago exitoso
    expect(screen.getByText(/¡Pago Exitoso!/i)).toBeInTheDocument()

    // Cerrar popup de pago
    const cerrarBtn = screen.getByText(/^Cerrar$/i)
    await user.click(cerrarBtn)

    // Verificar que el contador de carrito volvió a 0
    expect(screen.getByText(/Ver Carrito \(0\)/i)).toBeInTheDocument()
  })
})
