import React, { useEffect, useState } from 'react'
import '../styles/Admin.css'

export const Admin = () => {
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', isAdmin: false })
  const [showCreatePopup, setShowCreatePopup] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('users')
    setUsers(s ? JSON.parse(s) : [])
  }, [])

  const save = (next) => {
    localStorage.setItem('users', JSON.stringify(next))
    setUsers(next)
  }

  const handleDelete = (email) => {
    if (!confirm('Eliminar usuario ' + email + ' ?')) return
    const next = users.filter(u => u.email !== email)
    save(next)
  }

  const startEdit = (u) => {
    setEditingId(u.email)
    setForm({ name: u.name, email: u.email, password: u.password || '', isAdmin: !!u.isAdmin })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setForm({ name: '', email: '', password: '', isAdmin: false })
  }

  const submitEdit = () => {
    if (!form.name.trim()) return alert('Nombre requerido')
    if (!/\S+@\S+\.\S+/.test(form.email)) return alert('Email inválido')
    const next = users.map(u => u.email === editingId ? { ...u, name: form.name, email: form.email, password: form.password || u.password, isAdmin: !!form.isAdmin } : u)
    save(next)
    cancelEdit()
  }

  const createUserFromPopup = (u) => {
    if (!u.name || !u.name.trim()) return alert('Nombre requerido') || false
    if (!/\S+@\S+\.\S+/.test(u.email)) return alert('Email inválido') || false
    if (!u.password || u.password.length < 6) return alert('Contraseña mínima 6 caracteres') || false
    if (users.find(x => x.email === u.email)) return alert('Email ya registrado') || false
    const next = [...users, { name: u.name, email: u.email, password: u.password, isAdmin: !!u.isAdmin }]
    save(next)
    return true
  }

  return (
    <div className="admin-root">
      <div>

        {/* Title small background (unchanged) */}
        <div className="admin-title">
            <h2>Administración de usuarios</h2>
        </div>

        {/* Large semitransparent block that wraps the users table and the edit panel (rest of the admin content) */}
        <div className="admin-block">
            <div className="admin-grid">
              <div className="admin-left">
              <h3>Usuarios</h3>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th className="sep">Nombre</th>
                    <th className="sep">Email</th>
                    <th className="sep">Admin</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.email}>
                      <td className="sep">{u.name}</td>
                      <td className="sep">{u.email}</td>
                      <td className="sep">{u.isAdmin ? 'Sí' : 'No'}</td>
                      <td>
                        <button onClick={() => startEdit(u)}>Editar</button>
                         <button onClick={() => handleDelete(u.email)} className="ml-8">Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-panel">
              {editingId ? (
                <div>
                  <h3>Editar usuario</h3>
                  <label htmlFor="edit-name">Nombre</label>
                  <input id="edit-name" value={form.name} onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))} />
                  <label htmlFor="edit-email">Email</label>
                  <input id="edit-email" value={form.email} onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))} />
                  <label htmlFor="edit-password">Contraseña</label>
                  <input id="edit-password" value={form.password} onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))} />
                  <label htmlFor="edit-isadmin">
                    <input id="edit-isadmin" type="checkbox" checked={form.isAdmin} onChange={(e) => setForm(prev => ({ ...prev, isAdmin: e.target.checked }))} /> Dar rol admin
                  </label>
                   <div className="mt-8">
                    <button onClick={submitEdit}>Guardar</button>
                    <button onClick={cancelEdit} className="ml-8">Cancelar</button>
                  </div>
                </div>
              ) : (
                <div>
                  <h3>Crear usuario</h3>
                </div>
              )}
            </div>
          </div>

          <button className="admin-fab" onClick={() => setShowCreatePopup(true)}>Crear usuario</button>

          {showCreatePopup && (
            <div className="popup-overlay active">
              <div className="popup-content">
                <h2>Crear usuario</h2>
                <CreateUserPopupForm onCancel={() => setShowCreatePopup(false)} onCreate={(u) => { if (createUserFromPopup(u)) setShowCreatePopup(false) }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CreateUserPopupForm({ onCreate, onCancel }) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isAdmin, setIsAdmin] = React.useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    onCreate({ name, email, password, isAdmin })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="popup-name">Nombre</label>
      <input id="popup-name" value={name} onChange={(e) => setName(e.target.value)} />
      <label htmlFor="popup-email">Email</label>
      <input id="popup-email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="popup-password">Contraseña</label>
      <input id="popup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <label htmlFor="popup-isadmin">
        <input id="popup-isadmin" type="checkbox" checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} /> Dar rol admin
      </label>
      <div className="mt-8">
        <button type="submit">Crear</button>
        <button type="button" onClick={onCancel} className="ml-8">Cancelar</button>
      </div>
    </form>
  )
}

