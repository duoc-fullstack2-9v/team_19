import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../../src/components/pages/Login';
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

const renderLogin = () => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <Login />
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('renderiza el formulario de login correctamente', () => {
    renderLogin();
    
    expect(screen.getByText(/Iniciar Sesión/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ingresar/i })).toBeInTheDocument();
  });

  test('realiza login exitoso con credenciales válidas', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwicm9sIjoiVVNVQVJJTyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.test',
      }),
    });

    renderLogin();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  test('muestra error cuando las credenciales son incorrectas', async () => {
    const user = userEvent.setup();
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: 'Credenciales inválidas',
      }),
    });

    renderLogin();

    const emailInput = screen.getByLabelText(/Email/i);
    const passwordInput = screen.getByLabelText(/Contraseña/i);
    
    await user.type(emailInput, 'wrong@test.com');
    await user.type(passwordInput, 'wrongpass');

    const submitButton = screen.getByRole('button', { name: /Ingresar/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Credenciales inválidas/i)).toBeInTheDocument();
    });
  });

  test('muestra las credenciales de prueba', () => {
    renderLogin();
    
    expect(screen.getByText(/admin@test.com/i)).toBeInTheDocument();
    expect(screen.getByText(/user@test.com/i)).toBeInTheDocument();
  });
});
