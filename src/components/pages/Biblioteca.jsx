import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import getImagenUrl from '../../utils/imagenUtils'

export const Biblioteca = () => {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('biblioteca');
      const parsed = raw ? JSON.parse(raw) : [];
      setCompras(parsed);
    } catch (e) {
      console.error('Error leyendo biblioteca desde localStorage', e);
      setCompras([]);
    }
  }, []);

  if (!compras || compras.length === 0) {
    return <div className="biblioteca-empty">Tu biblioteca está vacía.</div>;
  }

  return (
    <div className="biblioteca-list">
      <h2>Mi Biblioteca</h2>
      <ul>
        {compras.map(item => (
          <li key={item.id} className="biblioteca-item">
            <div className="biblioteca-item-row">
              <img src={getImagenUrl(item.imagen, item.nombre)} alt={item.nombre} className="biblioteca-thumb" style={{width: 80, height: 100, objectFit: 'cover', marginRight: 12}} />
              <div>
                <Link to={`/producto/${item.id}`}>{item.nombre}</Link>
                <div>Cantidad: {item.cantidad || 1}</div>
                <div>Precio unitario: ${item.precio?.toLocaleString('es-CL') || '-'}</div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
