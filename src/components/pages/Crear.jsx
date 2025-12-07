import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Admin.css'

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
    <div className="admin-root crear-page">
      <div>
        <div className="admin-title">
          <h2>Crear nuevo producto</h2>
        </div>

        <div className="admin-block">
          {mensaje && <div className="mensaje" style={{marginBottom:12}}>{mensaje}</div>}

          <div className="admin-grid">
            <div className="admin-left">
              <form onSubmit={handleSubmit} className="form-crear">
                <label>Nombre</label>
                <input value={nombre} onChange={(e) => setNombre(e.target.value)} />

                <label>Precio (CLP)</label>
                <input value={precio} onChange={(e) => setPrecio(e.target.value)} type="number" />

                <label>Imagen (puedes subir un archivo o indicar ruta)</label>
                <input type="file" accept="image/*" onChange={handleFileChange} />
                <div className="mt-8">O ingresar ruta (ej: <code>covers/mi-imagen.jpg</code> o URL):</div>
                <input value={imagen} onChange={(e) => setImagen(e.target.value)} placeholder="ej: covers/mi-imagen.jpg" />

                <label>Descripción</label>
                <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />

                <div className="mt-8">
                  <button type="submit" className="admin-fab">Crear producto</button>
                </div>
              </form>
            </div>

            <div className="admin-panel">
              <h3>Vista previa</h3>
              <div style={{minHeight:200}}>
                {preview ? (
                  <img src={preview} alt="preview" style={{width:'100%', maxHeight:300, objectFit:'cover', borderRadius:6}} />
                ) : (
                  imagen ? (
                    <img src={imagen} alt="ruta" style={{width:'100%', maxHeight:300, objectFit:'cover', borderRadius:6}} />
                  ) : (
                    <div style={{padding:12, color:'#666'}}>Sube una imagen o pega una ruta para ver vista previa.</div>
                  )
                )}

                <div style={{marginTop:12}}>
                  <strong>{nombre || 'Nombre del producto'}</strong>
                  <div style={{marginTop:6}}>{descripcion || 'Breve descripción'}</div>
                  <div style={{marginTop:8, fontWeight:'600'}}>{precio ? `${precio} CLP` : ''}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Crear
