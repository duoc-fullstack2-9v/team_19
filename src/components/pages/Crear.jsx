import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Admin.css'

export const Crear = () => {
  const [productos, setProductos] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('productos');
    setProductos(raw ? JSON.parse(raw) : []);
  }, [])

  const save = (next) => {
    localStorage.setItem('productos', JSON.stringify(next))
    setProductos(next)
  }

  const handleDelete = (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    const next = productos.filter(p => p.id !== id)
    save(next)
  }

  const startEdit = (p) => {
    setEditingId(p.id)
    setNombre(p.nombre)
    setPrecio(p.precio)
    setImagen(p.imagen)
    setDescripcion(p.descripcion)
    setPreview(p.imagen)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setNombre('')
    setPrecio('')
    setImagen('')
    setDescripcion('')
    setPreview('')
    setMensaje('')
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setMensaje('El nombre es requerido');
    const precioNum = Number(precio || 0);
    if (!precioNum || precioNum <= 0) return setMensaje('Precio inválido');

    try {
      const imagenFinal = preview || imagen.trim();

      if (editingId) {
        // Editar producto existente
        const next = productos.map(p => 
          p.id === editingId 
            ? { ...p, nombre: nombre.trim(), precio: precioNum, imagen: imagenFinal, descripcion: descripcion.trim() }
            : p
        )
        save(next)
        setMensaje('Producto actualizado correctamente');
        cancelEdit()
      } else {
        // Crear nuevo producto
        const nextId = Date.now();

        const nuevo = {
          id: nextId,
          nombre: nombre.trim(),
          precio: precioNum,
          imagen: imagenFinal,
          descripcion: descripcion.trim(),
          enlace: `/producto/${nextId}`
        };

        save([...productos, nuevo])
        setMensaje('Producto creado correctamente');
        cancelEdit()
      }
    } catch (e) {
      console.error(e);
      setMensaje('Error al guardar el producto');
    }
  }

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setImagenFile(f);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="admin-root crear-page">
      <div>
        <div className="admin-title">
          <h2>{editingId ? 'Editar producto' : 'Crear nuevo producto'}</h2>
        </div>

        <div className="admin-block">
          {mensaje && <div className="mensaje" style={{marginBottom:12}}>{mensaje}</div>}

          <div className="admin-grid">
            <div className="admin-left">
              <h3>Productos</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="sep">Nombre</th>
                    <th className="sep">Precio</th>
                    <th className="sep">Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id}>
                      <td className="sep">{p.nombre}</td>
                      <td className="sep">${p.precio}</td>
                      <td className="sep">{p.descripcion ? p.descripcion.substring(0, 30) + (p.descripcion.length > 30 ? '...' : '') : '-'}</td>
                      <td>
                        <button onClick={() => startEdit(p)}>Editar</button>
                        <button onClick={() => handleDelete(p.id)} className="ml-8">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-panel">
              <h3>{editingId ? 'Editando' : 'Crear nuevo'}</h3>
              <form onSubmit={handleSubmit} className="form-crear">
                <label>Nombre</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

                <label>Precio (CLP)</label>
                <input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" />

                <label>Imagen (subir archivo o ruta)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <div className="mt-8">O ingresar ruta:</div>
                <input value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="ej: covers/mi-imagen.jpg" />

                <label>Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

                {preview && (
                  <div style={{marginTop:12}}>
                    <strong>Vista previa:</strong>
                    <img src={preview} alt="preview" style={{width:'100%', maxHeight:200, objectFit:'cover', borderRadius:6, marginTop:8}} />
                  </div>
                )}

                <div className="mt-8">
                  <button type="submit" className="admin-fab">{editingId ? 'Guardar cambios' : 'Crear producto'}</button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="ml-8" style={{padding:'10px 14px', background:'#6c757d', color:'white', border:'none', borderRadius:6, cursor:'pointer'}}>Cancelar</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Crear
