import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export const Crear = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState('');
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return setMensaje('El nombre es requerido');
    const precioNum = Number(precio || 0);
    if (!precioNum || precioNum <= 0) return setMensaje('Precio inválido');

    try {
      const raw = localStorage.getItem('productos');
      const saved = raw ? JSON.parse(raw) : [];

      // calcular nuevo id (timestamp para unicidad)
      const nextId = Date.now();

      // si se subió un archivo, imagen ya está en state como dataURL (preview)
      const imagenFinal = preview || imagen.trim();

      const nuevo = {
        id: nextId,
        nombre: nombre.trim(),
        precio: precioNum,
        imagen: imagenFinal,
        descripcion: descripcion.trim(),
        enlace: `/producto/${nextId}`
      };

      saved.push(nuevo);
      localStorage.setItem('productos', JSON.stringify(saved));

      setMensaje('Producto creado correctamente');
      // limpiar formulario
      setNombre(''); setPrecio(''); setImagen(''); setDescripcion('');

      // navegar al detalle del producto nuevo
      navigate(`/producto/${nuevo.id}`);
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
      // reader.result es data URL (base64)
      setPreview(reader.result);
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="crear-page">
      <h2>Crear nuevo producto</h2>
      {mensaje && <div className="mensaje">{mensaje}</div>}
      <form onSubmit={handleSubmit} className="form-crear">
        <label>Nombre</label>
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <label>Precio (CLP)</label>
        <input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" />

        <label>Imagen (puedes subir un archivo o indicar ruta)</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <div style={{marginTop:8}}>O ingresar ruta (ej: <code>covers/mi-imagen.jpg</code> o URL):</div>
        <input value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="ej: covers/mi-imagen.jpg" />

        {preview && (
          <div style={{marginTop:12}}>
            <strong>Vista previa:</strong>
            <div>
              <img src={preview} alt="preview" style={{maxWidth:200, maxHeight:250, objectFit:'cover', marginTop:8}} />
            </div>
          </div>
        )}

        <label>Descripción</label>
        <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Crear producto</button>
        </div>
      </form>
    </div>
  )
}

export default Crear
