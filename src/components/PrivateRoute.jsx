import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <p>Cargando...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    return (
      <div className="access-denied-container">
        <h2>Acceso Denegado</h2>
        <p>No tienes permisos para acceder a esta sección.</p>
        <p>Se requiere rol: {requiredRole}</p>
      </div>
    );
  }

  return children;
};
