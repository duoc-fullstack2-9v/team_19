import React, { useEffect, useState, useCallback } from 'react'
import '../styles/Admin.css'
import productsService from '../../services/productsService'
import { useCart } from '../../context/CartContext'

export const Admin = () => {
  const { reloadProducts } = useCart()
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ nombre: '', precio: '', imagen: '', enlace: '' })
  const [showCreatePopup, setShowCreatePopup] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Cargar productos
  const loadProductos = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await productsService.getAll()
      setProductos(data)
    } catch (err) {
      setError(err.message)
      console.error('Error al cargar productos:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProductos()
  }, [loadProductos])

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!confirm(`¿Eliminar producto con ID ${id}?`)) return
    try {
      setLoading(true)
      await productsService.delete(id)
      setSuccess('Producto eliminado correctamente')
      await loadProductos()
      reloadProducts()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Iniciar edición
  const startEdit = (producto) => {
    setEditingId(producto.id)
    setForm({
      nombre: producto.nombre,
      precio: producto.precio,
      imagen: producto.imagen,
      enlace: producto.enlace
    })
  }

  // Cancelar edición
  const cancelEdit = () => {
    setEditingId(null)
    setForm({ nombre: '', precio: '', imagen: '', enlace: '' })
  }

  // Guardar producto (crear o actualizar)
  const submitForm = async () => {
    if (!form.nombre.trim()) return alert('Nombre requerido')
    if (!form.precio || parseFloat(form.precio) <= 0) return alert('Precio válido requerido')

    try {
      setLoading(true)
      setError(null)

      if (editingId) {
        // Actualizar
        await productsService.update(editingId, {
          nombre: form.nombre,
          precio: parseFloat(form.precio),
          imagen: form.imagen,
          enlace: form.enlace
        })
        setSuccess('Producto actualizado correctamente')
      } else {
        // Crear
        await productsService.create({
          nombre: form.nombre,
          precio: parseFloat(form.precio),
          imagen: form.imagen,
          enlace: form.enlace
        })
        setSuccess('Producto creado correctamente')
      }

      await loadProductos()
      reloadProducts()
      cancelEdit()
      setShowCreatePopup(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateClick = () => {
    cancelEdit()
    setShowCreatePopup(true)
  }

  return (
    <div className="admin-container">
      <h1>Panel de Administración - Productos</h1>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {loading && <div className="loading">Cargando...</div>}

      <button className="btn-create" onClick={handleCreateClick} disabled={loading}>
        + Crear Nuevo Producto
      </button>

      {showCreatePopup && (
        <div className="admin-popup">
          <div className="popup-content">
            <h3>{editingId ? 'Editar Producto' : 'Crear Nuevo Producto'}</h3>
            <input
              type="text"
              placeholder="Nombre del producto"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            />
            <input
              type="number"
              placeholder="Precio"
              value={form.precio}
              onChange={(e) => setForm({ ...form, precio: e.target.value })}
              step="0.01"
              min="0"
            />
            <input
              type="text"
              placeholder="URL de imagen"
              value={form.imagen}
              onChange={(e) => setForm({ ...form, imagen: e.target.value })}
            />
            <input
              type="text"
              placeholder="Enlace (opcional)"
              value={form.enlace}
              onChange={(e) => setForm({ ...form, enlace: e.target.value })}
            />
            <div className="popup-buttons">
              <button onClick={submitForm} disabled={loading} className="btn-save">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              <button onClick={() => { setShowCreatePopup(false); cancelEdit(); }} disabled={loading} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="products-table-wrapper">
        <table className="products-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Imagen</th>
              <th>Enlace</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td>{producto.nombre}</td>
                <td>${producto.precio}</td>
                <td className="image-cell">
                  {producto.imagen && (
                    <img src={producto.imagen} alt={producto.nombre} className="product-thumb" />
                  )}
                </td>
                <td>{producto.enlace}</td>
                <td className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      startEdit(producto)
                      setShowCreatePopup(true)
                    }}
                    disabled={loading}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(producto.id)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productos.length === 0 && !loading && (
        <div className="empty-state">
          No hay productos. ¡Crea uno para comenzar!
        </div>
      )}
    </div>
  )
}

export default Admin
