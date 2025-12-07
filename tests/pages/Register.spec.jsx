import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Register } from '../../src/components/pages/Register';
import { AuthProvider } from '../../src/context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

global.fetch = vi.fn();

const renderRegister = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Register />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Register Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renderiza el formulario de registro correctamente', () => {
    renderRegister();
    
    expect(screen.getByText(/Crear Cuenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    expect(passwordInputs).toHaveLength(2);
  });

  test('realiza registro exitoso con datos válidos', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwicm9sIjoiVVNVQVJJTyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.test',
      }),
    });

    renderRegister();

    const nombreInput = screen.getByLabelText(/Nombre/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    
    await user.type(nombreInput, 'Test User');
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('muestra error cuando el email ya está registrado', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: 'El email ya está registrado',
      }),
    });

    renderRegister();

    const nombreInput = screen.getByLabelText(/Nombre/i);
    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInputs = screen.getAllByLabelText(/Contraseña/i);
    
    await user.type(nombreInput, 'Test User');
    await user.type(emailInput, 'existing@test.com');
    await user.type(passwordInputs[0], 'password123');
    await user.type(passwordInputs[1], 'password123');

    const submitButton = screen.getByRole('button', { name: /Registrarse/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/El email ya está registrado/i)).toBeInTheDocument();
    });
  });
});
