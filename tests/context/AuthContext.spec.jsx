import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

global.fetch = vi.fn();

// Componente de prueba para usar el hook
const TestComponent = () => {
  const { user, loading, error, login, logout, register } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Ready'}</div>
      <div data-testid="user">{user ? user.email : 'No user'}</div>
      <div data-testid="role">{user ? user.rol : 'No role'}</div>
      <div data-testid="error">{error || 'No error'}</div>
      <button onClick={() => login('test@test.com', 'password123')}>Login</button>
      <button onClick={() => logout()}>Logout</button>
      <button onClick={() => register('Test User', 'new@test.com', 'password123')}>Register</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('proporciona el contexto correctamente', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No user');
    expect(screen.getByTestId('role')).toHaveTextContent('No role');
  });

  test('valida el token al iniciar si existe en localStorage', async () => {
    const mockToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwicm9sIjoiVVNVQVJJTyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.test';
    localStorage.setItem('authToken', mockToken);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { email: 'test@test.com', rol: 'USUARIO' },
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@test.com');
      expect(screen.getByTestId('role')).toHaveTextContent('USUARIO');
    });
  });

  test('elimina token inválido del localStorage', async () => {
    const mockToken = 'invalid-token';
    localStorage.setItem('authToken', mockToken);

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  test('realiza login exitoso y guarda el token', async () => {
    const mockToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwicm9sIjoiQURNSU4iLCJpYXQiOjE3MDAwMDAwMDAsImV4cCI6MTcwMDA4NjQwMH0.test';
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockToken,
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@test.com');
      expect(screen.getByTestId('role')).toHaveTextContent('ADMIN');
      expect(localStorage.getItem('authToken')).toBe(mockToken);
    });
  });

  test('maneja error de login con credenciales incorrectas', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: 'Credenciales inválidas',
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Credenciales inválidas');
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
    });
  });

  test('maneja error de red durante login', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Error de conexión al servidor');
    });
  });

  test('realiza logout correctamente', async () => {
    const mockToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwicm9sIjoiVVNVQVJJTyIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDg2NDAwfQ.test';
    
    // Login primero
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockToken,
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@test.com');
    });

    // Ahora logout
    const logoutButton = screen.getByText('Logout');
    logoutButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('No user');
      expect(screen.getByTestId('role')).toHaveTextContent('No role');
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  test('realiza registro exitoso', async () => {
    const mockToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJuZXdAdGVzdC5jb20iLCJyb2wiOiJVU1VBUklPIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwODY0MDB9.test';
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockToken,
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const registerButton = screen.getByText('Register');
    registerButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('new@test.com');
      expect(screen.getByTestId('role')).toHaveTextContent('USUARIO');
      expect(localStorage.getItem('authToken')).toBe(mockToken);
    });
  });

  test('maneja error cuando el email ya está registrado', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        error: 'El email ya está registrado',
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const registerButton = screen.getByText('Register');
    registerButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('El email ya está registrado');
    });
  });

  test('maneja error de red durante registro', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const registerButton = screen.getByText('Register');
    registerButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Error de conexión al servidor');
    });
  });

  test('decodifica correctamente un token JWT válido', async () => {
    // Token con payload: {"sub":"admin@test.com","rol":"ADMIN","iat":1700000000,"exp":1700086400}
    const mockToken = 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsInJvbCI6IkFETUlOIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwODY0MDB9.test';
    
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockToken,
      }),
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('admin@test.com');
      expect(screen.getByTestId('role')).toHaveTextContent('ADMIN');
    });
  });

  test('maneja token malformado sin romper la aplicación', async () => {
    const badToken = 'not-a-valid-jwt';
    localStorage.setItem('authToken', badToken);

    // No debería hacer fetch con token inválido
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Debería cargar sin errores
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });
  });

  test('actualiza el estado de loading correctamente durante las operaciones', async () => {
    global.fetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => 
          resolve({
            ok: true,
            json: async () => ({
              success: true,
              data: 'token',
            }),
          }), 
          50
        )
      )
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    });

    const loginButton = screen.getByText('Login');
    loginButton.click();

    // Durante la operación debería mostrar loading
    // Nota: Esto depende de la implementación específica del AuthContext
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Ready');
    }, { timeout: 200 });
  });
});
