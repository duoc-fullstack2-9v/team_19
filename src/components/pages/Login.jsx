import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();

  const validarFormulario = () => {
    const newErrors = {};

    // Validar email
    if (!email) {
      newErrors.email = 'El email es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    // Validar password
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-wrapper">
        <h1>Iniciar Sesión</h1>
        
        {authError && (
          <div className="error-message">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && (
              <span className="error-text">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
          <p className="test-credentials">
            <small>👤 Admin: admin@test.com / admin123</small><br/>
            <small>👤 Usuario: user@test.com / user123</small>
          </p>
        </div>
      </div>
    </div>
  );
};
