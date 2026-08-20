import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { authApi } from '../services/api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem('authToken');
      }
    } catch {
      // Ignorar errores de acceso a localStorage
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para decodificar JWT
  const decodeToken = useCallback((jwtToken) => {
    return authApi.decodeToken(jwtToken);
  }, []);

  // Validar token al montar el componente
  useEffect(() => {
    let isMounted = true;

    const validarTokenAlInicio = async () => {
      if (token) {
        try {
          await authApi.validateToken(token);
          if (isMounted) {
            const decoded = decodeToken(token);
            if (decoded && decoded.sub) {
              setUser({ email: decoded.sub, rol: decoded.rol });
            }
          }
        } catch (err) {
          if (isMounted) {
            console.error('Error validando token:', err);
            setToken(null);
            authApi.logout();
          }
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    };

    validarTokenAlInicio();

    return () => {
      isMounted = false;
    };
  }, [token, decodeToken]);

  const login = useCallback(async (email, password) => {
    try {
      setError(null);
      const res = await authApi.login(email, password);
      const newToken = res.token;
      setToken(newToken);

      const decoded = res.decoded || decodeToken(newToken);
      if (decoded && decoded.sub) {
        setUser({ email: decoded.sub, rol: decoded.rol });
      }
      return true;
    } catch (err) {
      console.error('Error en login:', err);
      if (err.isNetworkError && (!err.message || err.message === 'Network error' || err.message.includes('conexión') || err.message.includes('fetch'))) {
        setError('Error de conexión al servidor');
      } else {
        setError(err.message || 'Error en login');
      }
      return false;
    }
  }, [decodeToken]);

  const register = useCallback(async (nombre, email, password) => {
    try {
      setError(null);
      const res = await authApi.register(nombre, email, password);
      const newToken = res.token;
      if (newToken) {
        setToken(newToken);
        const decoded = res.decoded || decodeToken(newToken);
        if (decoded && decoded.sub) {
          setUser({ email: decoded.sub, rol: decoded.rol });
        }
      }
      return true;
    } catch (err) {
      console.error('Error en register:', err);
      if (err.isNetworkError && (!err.message || err.message === 'Network error' || err.message.includes('conexión') || err.message.includes('fetch'))) {
        setError('Error de conexión al servidor');
      } else {
        setError(err.message || 'Error en registro');
      }
      return false;
    }
  }, [decodeToken]);

  const logout = useCallback(() => {
    authApi.logout();
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      loading: false,
      error: null,
      login: async () => false,
      register: async () => false,
      logout: () => {}
    };
  }
  return context;
};

export default AuthProvider;
