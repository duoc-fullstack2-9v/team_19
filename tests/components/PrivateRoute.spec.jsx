import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivateRoute } from '../../src/components/PrivateRoute';
import { AuthContext } from '../../src/context/AuthContext';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }) => {
      mockNavigate(to);
      return <div data-testid="navigate">{to}</div>;
    },
  };
});

// Componente protegido de prueba
const ProtectedComponent = () => <div data-testid="protected">Contenido Protegido</div>;

// Helper para renderizar con contexto de auth
const renderWithAuth = (user, loading = false) => {
  const mockAuthValue = {
    user,
    loading,
    error: null,
    token: user ? 'mock-token' : null,
    login: vi.fn(),
    logout: vi.fn(),
    register: vi.fn(),
  };

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={mockAuthValue}>
        <Routes>
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <PrivateRoute requiredRole="ADMIN">
                <div data-testid="admin-content">Admin Content</div>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe('PrivateRoute Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.history.pushState({}, '', '/');
  });

  test('muestra loading mientras se valida el usuario', () => {
    renderWithAuth(null, true);
    
    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();
  });

  test('redirige a login cuando no hay usuario autenticado', () => {
    renderWithAuth(null, false);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  test('renderiza el contenido protegido cuando hay usuario autenticado', () => {
    const mockUser = { email: 'test@test.com', rol: 'USUARIO' };
    renderWithAuth(mockUser, false);
    
    expect(screen.getByTestId('protected')).toBeInTheDocument();
    expect(screen.getByText(/Contenido Protegido/i)).toBeInTheDocument();
  });

  test('permite acceso a ruta sin requiredRole cuando el usuario está autenticado', () => {
    const mockUser = { email: 'test@test.com', rol: 'USUARIO' };
    renderWithAuth(mockUser, false);
    
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });

  test('muestra mensaje de acceso denegado cuando el rol no coincide', () => {
    const mockUser = { email: 'test@test.com', rol: 'USUARIO' };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: mockUser,
          loading: false,
          error: null,
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <div data-testid="admin-content">Admin Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Acceso Denegado/i)).toBeInTheDocument();
    expect(screen.getByText(/No tienes permisos para acceder a esta sección/i)).toBeInTheDocument();
    expect(screen.getByText(/Se requiere rol: ADMIN/i)).toBeInTheDocument();
  });

  test('permite acceso cuando el rol del usuario coincide con requiredRole', () => {
    const mockUser = { email: 'admin@test.com', rol: 'ADMIN' };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: mockUser,
          loading: false,
          error: null,
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <div data-testid="admin-content">Admin Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
    expect(screen.getByText(/Admin Content/i)).toBeInTheDocument();
  });

  test('no redirige cuando el usuario tiene el rol correcto', () => {
    const mockUser = { email: 'admin@test.com', rol: 'ADMIN' };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: mockUser,
          loading: false,
          error: null,
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route
              path="/"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <div data-testid="admin-content">Admin Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.queryByTestId('login-page')).not.toBeInTheDocument();
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  test('maneja múltiples roles diferentes correctamente', () => {
    // Probar con rol USUARIO
    const { rerender } = render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: { email: 'user@test.com', rol: 'USUARIO' },
          loading: false,
          error: null,
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute requiredRole="USUARIO">
                  <div data-testid="user-content">User Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('user-content')).toBeInTheDocument();

    // Cambiar a rol ADMIN
    rerender(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: { email: 'admin@test.com', rol: 'ADMIN' },
          loading: false,
          error: null,
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute requiredRole="ADMIN">
                  <div data-testid="admin-content">Admin Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('admin-content')).toBeInTheDocument();
  });

  test('renderiza children correctamente sin requiredRole', () => {
    const mockUser = { email: 'any@test.com', rol: 'ANY_ROLE' };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: mockUser,
          loading: false,
          error: null,
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <div data-testid="any-protected">Any Protected Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByTestId('any-protected')).toBeInTheDocument();
  });

  test('muestra el rol requerido en el mensaje de acceso denegado', () => {
    const mockUser = { email: 'user@test.com', rol: 'USUARIO' };
    
    render(
      <BrowserRouter>
        <AuthContext.Provider value={{
          user: mockUser,
          loading: false,
          error: null,
          token: 'mock-token',
          login: vi.fn(),
          logout: vi.fn(),
          register: vi.fn(),
        }}>
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute requiredRole="SUPER_ADMIN">
                  <div data-testid="super-admin">Super Admin Content</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthContext.Provider>
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Se requiere rol: SUPER_ADMIN/i)).toBeInTheDocument();
  });
});
