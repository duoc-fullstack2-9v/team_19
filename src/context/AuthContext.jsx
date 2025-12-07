import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para decodificar JWT
  const decodeToken = useCallback((jwtToken) => {
    try {
      const base64Url = jwtToken.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }, []);

  // Validar token al montar el componente
  useEffect(() => {
    const validarTokenAlInicio = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:8080/api/auth/validate', {
            headers: { 'Authorization': `Bearer ${token}` }
          });

          if (response.ok) {
            const decoded = decodeToken(token);
            if (decoded && decoded.sub) {
              setUser({ email: decoded.sub, rol: decoded.rol });
            }
          } else {
            // Token inválido
            setToken(null);
            localStorage.removeItem('authToken');
          }
        } catch (error) {
          console.error('Error validando token:', error);
          setToken(null);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };

    validarTokenAlInicio();
  }, [token, decodeToken]);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newToken = data.data;
        setToken(newToken);
        localStorage.setItem('authToken', newToken);

        // Decodificar para obtener información del usuario
        const decoded = decodeToken(newToken);
        if (decoded && decoded.sub) {
          setUser({ email: decoded.sub, rol: decoded.rol });
        }
        return true;
      } else {
        setError(data.error || 'Error en login');
        return false;
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión al servidor');
      return false;
    }
  }, [decodeToken]);

  const register = useCallback(async (nombre, email, password) => {
    try {
      setError(null);
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const newToken = data.data;
        setToken(newToken);
        localStorage.setItem('authToken', newToken);

        const decoded = decodeToken(newToken);
        if (decoded && decoded.sub) {
          setUser({ email: decoded.sub, rol: decoded.rol });
        }
        return true;
      } else {
        setError(data.error || 'Error en registro');
        return false;
      }
    } catch (err) {
      console.error('Error en register:', err);
      setError('Error de conexión al servidor');
      return false;
    }
  }, [decodeToken]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setError(null);
    localStorage.removeItem('authToken');
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
