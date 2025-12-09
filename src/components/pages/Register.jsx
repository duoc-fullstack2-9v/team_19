import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/Login.css';

export const Register = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await register(nombre, email, password);
      // Si register es exitoso, redirige automáticamente
      navigate('/');
    } catch (err) {
      setErrors({ submit: err.message || 'Error en el registro' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Crear Cuenta</h2>
        
        {errors.submit && <div className="error-box">{errors.submit}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Repite tu contraseña"
              className={errors.passwordConfirm ? 'input-error' : ''}
            />
            {errors.passwordConfirm && <span className="error-text">{errors.passwordConfirm}</span>}
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="test-credentials">
          <p>Para probar, usa:</p>
          <code>admin@test.com / admin123</code>
          <code>user@test.com / user123</code>
        </div>

        <p className="login-link">
          ¿Ya tienes cuenta? <a href="/login">Inicia sesión aquí</a>
        </p>
      </div>
    </div>
  );
};
