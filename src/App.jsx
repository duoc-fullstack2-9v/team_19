//import { useState } from 'react'
import React, { useState } from 'react'
import './components/styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Inicio } from './components/pages/Inicio'
import { Biblioteca } from './components/pages/Biblioteca'
import { Busqueda } from './components/pages/Busqueda'
import { Carrito } from './components/pages/Carrito'
import { Admin } from './components/pages/Admin'
import { Editar } from './components/pages/Editar'
import { Crear } from './components/pages/Crear'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Nav } from './components/layout/Nav'
import { Body } from './components/layout/Body'

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [user, setUser] = useState(null); // { email, name, isAdmin }

  return (
    <BrowserRouter>
      <div className="app-layout">
  <Header />
  <Nav onSearch={setSearchTerm} user={user} onLogin={setUser} onLogout={() => setUser(null)} />

        <div className="app-main-wrapper">
          <main className="app-main">
            <Routes>
              {/* La página de inicio mostrará Body */}
              <Route path="/" element={<Body searchTerm={searchTerm} />} />
              <Route path="/inicio" element={<Body searchTerm={searchTerm} />} />
              <Route path="/biblioteca" element={<Biblioteca/>} />
              <Route path="/busqueda" element={<Busqueda/>} />
              <Route path="/carrito" element={<Carrito/>} />
              <Route path="/admin" element={user?.isAdmin ? <Admin/> : <div>Acceso denegado: se requiere cuenta de administrador.</div>} />
              <Route path="/editar" element={user?.isAdmin ? <Editar/> : <div>Acceso denegado: se requiere cuenta de administrador.</div>} />
              <Route path="/crear" element={user?.isAdmin ? <Crear/> : <div>Acceso denegado: se requiere cuenta de administrador.</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
