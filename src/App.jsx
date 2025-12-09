//import { useState } from 'react'
import React, { useState } from 'react'
import './components/styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import { Inicio } from './components/pages/Inicio'
import { Biblioteca } from './components/pages/Biblioteca'
import { Admin } from './components/pages/Admin'
import { Crear } from './components/pages/Crear'
import { Login } from './components/pages/Login'
import { Register } from './components/pages/Register'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { Nav } from './components/layout/Nav'
import { Body } from './components/layout/Body'

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Header />
            <Nav onSearch={setSearchTerm} />

            <div className="app-main-wrapper">
              <main className="app-main">
                <Routes>
                  {/* Rutas públicas */}
                  <Route path="/" element={<Body searchTerm={searchTerm} />} />
                  <Route path="/inicio" element={<Body searchTerm={searchTerm} />} />
                  <Route path="/biblioteca" element={<Biblioteca/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="/register" element={<Register/>} />

                  {/* Rutas protegidas (solo admin) */}
                  <Route 
                    path="/admin" 
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <Admin/>
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/crear" 
                    element={
                      <PrivateRoute requiredRole="ADMIN">
                        <Crear/>
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
