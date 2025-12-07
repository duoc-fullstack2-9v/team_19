import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import '../../index.css'
import '../styles/Nav.css'

export const Nav = ({ onSearch }) => {
  const [term, setTerm] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const emitSearch = (t) => {
    if (typeof onSearch === 'function') onSearch(t);
    if (typeof window !== 'undefined') {
      window.__onSearch = window.__onSearch || null;
      if (typeof window.__onSearch === 'function') window.__onSearch(t);
    }
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <header className="nav-header">
      <nav className="top-nav-links">
        {/* Rutas públicas */}
        <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Inicio</NavLink>
        <NavLink to="/biblioteca" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Biblioteca</NavLink>        
        {user?.rol === 'ADMIN' && (
          <>
            <NavLink to="/admin" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Admin</NavLink>
            <NavLink to="/crear" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>Crear</NavLink>
          </>
        )}
      </nav>

      <div className="nav-actions">
        <form onSubmit={(e) => { e.preventDefault(); emitSearch(term); }}>
          <input
            type="text"
            placeholder="Que busca mi estimado.."
            className="buscar"
            value={term}
            onChange={(e) => { setTerm(e.target.value); emitSearch(e.target.value); }}
          />
        </form>

        <div className="nav-auth">
          {user ? (
            <>
              <span className="nav-greeting">👤 {user.email}</span>
              <button onClick={handleLogout} className="nav-button logout-btn">Cerrar sesión</button>
            </>
          ) : (
            <>
              <NavLink to="/register" className="nav-button">Registrarse</NavLink>
              <NavLink to="/login" className="nav-button">Iniciar sesión</NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
