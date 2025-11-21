import React, { useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import getProductos from '../../data/productos'
import getImagenUrl from '../../utils/imagenUtils'
import { useNavigate } from 'react-router-dom'
import { CartContext } from '../../context/cartToken'

// función local para añadir un producto a la "biblioteca" (localStorage), fusionando cantidades
function addToBiblioteca(producto, cantidad = 1) {
  if (!producto) return;
  try {
    const raw = localStorage.getItem('biblioteca');
    const actuales = raw ? JSON.parse(raw) : [];
    const map = {};
    actuales.forEach(it => { map[it.id] = { ...it }; });
    if (map[producto.id]) {
      map[producto.id].cantidad = (map[producto.id].cantidad || 0) + cantidad;
    } else {
      map[producto.id] = { ...producto, cantidad };
    }
    const result = Object.values(map);
    localStorage.setItem('biblioteca', JSON.stringify(result));
    return true;
  } catch (e) {
    console.error('Error guardando en biblioteca', e);
    return false;
  }
}

export const ProductoDetalle = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const pid = Number(id);
  const { addItem } = useContext(CartContext);
  const producto = getProductos().find(p => p.id === pid);

  if (!producto) {
    return (
      <div className="producto-detalle">
        <h2>Producto no encontrado</h2>
        <p>El producto con id {id} no existe.</p>
        <Link to="/">Volver al inicio</Link>
      </div>
    )
  }

  const handleAgregar = () => {
    addToBiblioteca(producto, 1);
    // llevar al usuario a la biblioteca para ver el resultado
    navigate('/biblioteca');
  }

  const handleAgregarAlCarrito = () => {
    addItem(producto, 1);
    // navegar a inicio y notificar al usuario (el popup de carrito está en Body)
    navigate('/');
  }

  return (
    <div className="producto-detalle">
      <h2>{producto.nombre}</h2>
      <div className="detalle-grid">
        <div className="detalle-imagen">
          <img src={getImagenUrl(producto.imagen, producto.nombre)} alt={producto.nombre} style={{maxWidth: '300px'}} />
        </div>
        <div className="detalle-info">
          <p><strong>Precio:</strong> ${producto.precio?.toLocaleString('es-CL')}</p>
          <p><strong>Categoría:</strong> {producto.categoria || 'N/A'}</p>
          <p>{producto.descripcion || 'Sin descripción disponible.'}</p>
          <div style={{marginTop: '16px'}}>
            <button onClick={handleAgregarAlCarrito} className="btn btn-secondary">Agregar al Carrito</button>
            <button onClick={handleAgregar} style={{marginLeft: '8px'}} className="btn btn-primary">Agregar a Biblioteca</button>
            <Link to="/" style={{marginLeft: '8px'}} className="btn">Volver</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoDetalle
