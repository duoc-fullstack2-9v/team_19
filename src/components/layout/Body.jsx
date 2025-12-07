import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import '../../index.css';
import '../styles/Body.css';
import getProductos from '../../data/productos'; // ahora una función que lee localStorage + defaults
import getImagenUrl from '../../utils/imagenUtils';
import { CartContext } from '../../context/cartToken';

function filterProductos(lista, term) {
  if (!term) return lista;
  const t = term?.toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return lista.filter(p => p.nombre?.toString().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().includes(t));
}

export const Body = ({ searchTerm = '' }) => {
  const productos = getProductos();
  const { cart: carrito, addItem, clearCart, totalCount, totalPrice } = useContext(CartContext);
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [mostrarPagoExito, setMostrarPagoExito] = useState(false);
  const [modoPago, setModoPago] = useState(false);

  const agregarAlCarrito = (id) => {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    addItem(producto, 1);
  };

  const calcularTotal = () => totalPrice;

  const pagar = () => {
    // Guardar las compras procesadas en localStorage (clave: 'biblioteca')
    guardarCompras(carrito);

    // Vaciar carrito global
    clearCart();

    setModoPago(false);
    setMostrarCarrito(false);
    setMostrarPagoExito(true);
  };

  const vaciarCarrito = () => {
    clearCart();
    setMostrarPagoExito(false);
  };

  // Guarda compras en localStorage, fusionando cantidades para productos ya existentes
  function guardarCompras(nuevasCompras) {
    if (!nuevasCompras || nuevasCompras.length === 0) return;

    try {
      const raw = localStorage.getItem('biblioteca');
      const actuales = raw ? JSON.parse(raw) : [];

      // merge por id: sumar cantidades
      const map = {};
      actuales.forEach(it => { map[it.id] = { ...it }; });
      nuevasCompras.forEach(it => {
        if (map[it.id]) {
          map[it.id].cantidad = (map[it.id].cantidad || 0) + (it.cantidad || 1);
        } else {
          map[it.id] = { ...it };
        }
      });

      const result = Object.values(map);
      localStorage.setItem('biblioteca', JSON.stringify(result));
    } catch (e) {
      // en caso de error, no romper la UI
      console.error('Error guardando compras en localStorage', e);
    }
  }

  const Producto = ({ producto }) => (
    <div className="producto">
      <div className="producto-overlay">
        <span className="precio">${producto.precio.toLocaleString('es-CL')}</span>
        <span 
          className="carrito-icono" 
          onClick={() => agregarAlCarrito(producto.id)}
        >
          🛒
        </span>
      </div>
      <Link to={`/producto/${producto.id}`}>
        <img 
          className="producto-imagen"
          src={getImagenUrl(producto.imagen, producto.nombre)}
          alt={producto.nombre}
        />
      </Link>
    </div>
  );

  const CarritoPopup = () => {
    if (!mostrarCarrito) return null;

    return (
      <div className="popup-overlay active">
        <div className="popup-content">
          <h2>Carrito de Compras</h2>
          {carrito.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            <>
              <ul className="carrito-list">
                {carrito.map(item => (
                  <li key={item.id} className="carrito-item">
                    <div>
                      <strong>{item.nombre}</strong>
                      <br />
                      <small>Cantidad: {item.cantidad}</small>
                    </div>
                    <div>${(item.precio * item.cantidad).toLocaleString('es-CL')}</div>
                  </li>
                ))}
              </ul>
              <div className="carrito-total">
                <strong>Total: ${calcularTotal().toLocaleString('es-CL')}</strong>
              </div>
            </>
          )}
          
          {!modoPago ? (
            <div className="carrito-actions">
              {carrito.length > 0 && (
                <button onClick={() => setModoPago(true)} className="btn btn-primary">Proceder al Pago</button>
              )}
              <button onClick={() => setMostrarCarrito(false)} className="btn btn-secondary">{carrito.length > 0 ? 'Seguir Comprando' : 'Cerrar'}</button>
              {carrito.length > 0 && (
                <button onClick={vaciarCarrito} className="btn btn-danger">Vaciar Carrito</button>
              )}
            </div>
          ) : (
            <div className="mt-8">
              <h3>Selecciona forma de pago</h3>
              <div className="payment-options">
                <button onClick={() => pagar()} className="btn btn-success">Tarjeta de Débito</button>
                <button onClick={() => pagar()} className="btn btn-info">Tarjeta de Crédito</button>
                <button onClick={() => pagar()} className="btn btn-primary">PayPal</button>
                <button onClick={() => setModoPago(false)} className="btn btn-secondary">Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const PagoExitoPopup = () => {
    if (!mostrarPagoExito) return null;

    return (
      <div className="popup-overlay active">
        <div className="popup-content">
          <h2>¡Pago Exitoso! 🎉</h2>
          <p>Que disfrutes tus comics :D</p>
          <p>Te llegará al correo la boleta de compra</p>
          <button onClick={vaciarCarrito} className="btn btn-success popup-close-btn">Cerrar</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Botón para ver carrito */}
      <div className="cart-button-wrapper">
        <button onClick={() => setMostrarCarrito(true)} className="cart-button">🛒 Ver Carrito ({totalCount})</button>
      </div>

      {/* Grid de productos */}
      <div className="contenedor">
        {filterProductos(productos, searchTerm).map(producto => (
          <Producto key={producto.id} producto={producto} />
        ))}
      </div>

      {/* Popups */}
      <CarritoPopup />
      <PagoExitoPopup />
    </div>
  );
};