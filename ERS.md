# ERS - Especificación de Requisitos del Software

**Proyecto:** Sistema de Gestión de Biblioteca Digital  
**Equipo:** Team 19  
**Versión:** 1.0  
**Fecha:** Diciembre 2025

---

## 1. Introducción

### 1.1 Propósito
Este documento especifica los requisitos funcionales y no funcionales del Sistema de Gestión de Biblioteca Digital, una aplicación web que permite a los usuarios explorar un catálogo de libros y a los administradores gestionar el inventario de productos.

### 1.2 Alcance
- Permitir a usuarios navegación pública del catálogo de libros
- Autenticación y autorización mediante JWT
- Gestión de productos (CRUD) por administradores
- Búsqueda de productos
- Carrito de compras (futuro)

### 1.3 Definiciones y Acrónimos
- **JWT:** JSON Web Token - Estándar de autenticación sin estado
- **CRUD:** Create, Read, Update, Delete - Operaciones básicas de datos
- **REST:** Representational State Transfer - Arquitectura de API
- **ADMIN:** Usuario con permisos para gestionar productos
- **USUARIO:** Usuario estándar con acceso de lectura

---

## 2. Descripción General del Sistema

### 2.1 Perspectiva del Producto
El Sistema de Gestión de Biblioteca Digital es una aplicación web de dos capas:
- **Frontend:** React 19 con Vite
- **Backend:** Spring Boot 3.2 con Java 17

La aplicación comunica mediante API REST con autenticación JWT y CORS habilitado.

### 2.2 Características Principales
- Catálogo de libros públicamente accesible
- Sistema de autenticación seguro con JWT
- Control de acceso basado en roles (RBAC)
- API REST para gestión de productos
- Interfaz responsiva y amigable

### 2.3 Usuarios del Sistema

#### 2.3.1 Usuarios Anónimos
- Pueden visualizar el catálogo de libros
- Pueden buscar libros por título o autor
- Pueden registrarse para obtener una cuenta

#### 2.3.2 Usuarios Autenticados (USUARIO)
- Todas las acciones de usuarios anónimos
- Acceso persistente después de autenticarse
- Tokens JWT con expiración de 24 horas

#### 2.3.3 Administradores (ADMIN)
- Todas las acciones de usuarios autenticados
- Crear nuevos productos
- Editar productos existentes
- Eliminar productos
- Acceso protegido a `/admin` y `/crear`

---

## 3. Requisitos Funcionales

### 3.1 Autenticación

#### RF-3.1.1: Registro de Usuario
**Descripción:** Los usuarios pueden crear una nueva cuenta proporcionando nombre, email y contraseña.

**Precondiciones:**
- El email no debe existir en la base de datos
- La contraseña debe tener mínimo 6 caracteres

**Postcondiciones:**
- Nuevo usuario creado con rol USUARIO
- Se genera un token JWT automáticamente
- Usuario es redirigido a la página principal

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

**Response (Éxito - 200):**
```json
{
  "success": true,
  "data": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "error": null
}
```

#### RF-3.1.2: Inicio de Sesión
**Descripción:** Los usuarios autenticados acceden al sistema proporcionando email y contraseña.

**Precondiciones:**
- El usuario debe existir en el sistema
- Las credenciales deben ser correctas

**Postcondiciones:**
- Se genera un token JWT con el rol del usuario
- Token se almacena en localStorage (cliente)
- Usuario puede acceder a recursos protegidos

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "admin@test.com",
  "password": "admin123"
}
```

**Response (Éxito - 200):**
```json
{
  "success": true,
  "data": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9...",
  "error": null
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "data": null,
  "error": "Contraseña incorrecta"
}
```

#### RF-3.1.3: Validación de Token
**Descripción:** Los servidores pueden verificar la validez de un token JWT.

**Endpoint:** `GET /api/auth/validate`

**Headers:** `Authorization: Bearer <token>`

**Response (Éxito - 200):**
```json
{
  "success": true,
  "data": {
    "email": "admin@test.com",
    "rol": "ADMIN"
  },
  "error": null
}
```

### 3.2 Gestión de Productos

#### RF-3.2.1: Obtener Todos los Productos
**Descripción:** Obtener la lista completa de todos los productos disponibles. No requiere autenticación.

**Endpoint:** `GET /api/productos`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "El Quijote",
      "autor": "Miguel de Cervantes",
      "descripcion": "Novela clásica",
      "year": 1605
    }
  ],
  "error": null
}
```

#### RF-3.2.2: Obtener Producto por ID
**Descripción:** Obtener los detalles de un producto específico.

**Endpoint:** `GET /api/productos/{id}`

**Response (Éxito - 200):** Producto encontrado

**Response (Error - 404):**
```json
{
  "success": false,
  "data": null,
  "error": "Producto no encontrado"
}
```

#### RF-3.2.3: Buscar Productos
**Descripción:** Buscar productos por título o autor.

**Endpoint:** `GET /api/productos/buscar?q=quijote`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titulo": "El Quijote",
      ...
    }
  ],
  "error": null
}
```

#### RF-3.2.4: Crear Producto (ADMIN)
**Descripción:** Los administradores pueden crear un nuevo producto.

**Precondiciones:**
- Usuario debe tener rol ADMIN
- Token JWT válido en header Authorization

**Postcondiciones:**
- Nuevo producto agregado a la base de datos
- Se retorna el producto creado con ID

**Endpoint:** `POST /api/productos`

**Headers:** `Authorization: Bearer <admin_token>`

**Request:**
```json
{
  "titulo": "Nuevo Libro",
  "autor": "Nuevo Autor",
  "descripcion": "Descripción del libro",
  "year": 2024
}
```

**Response (Éxito - 201):** Producto creado

**Response (Error - 403):**
```json
{
  "success": false,
  "data": null,
  "error": "No tienes permisos para crear productos"
}
```

#### RF-3.2.5: Actualizar Producto (ADMIN)
**Descripción:** Los administradores pueden modificar un producto existente.

**Endpoint:** `PUT /api/productos/{id}`

**Headers:** `Authorization: Bearer <admin_token>`

**Request:**
```json
{
  "titulo": "Título Actualizado",
  "year": 2025
}
```

#### RF-3.2.6: Eliminar Producto (ADMIN)
**Descripción:** Los administradores pueden eliminar un producto.

**Endpoint:** `DELETE /api/productos/{id}`

**Headers:** `Authorization: Bearer <admin_token>`

**Response (Éxito - 200):**
```json
{
  "success": true,
  "data": "Producto eliminado correctamente",
  "error": null
}
```

---

## 4. Requisitos No Funcionales

### 4.1 Seguridad
- **RNF-4.1.1:** Todos los tokens JWT deben usar algoritmo HS512
- **RNF-4.1.2:** Los tokens expiran después de 24 horas
- **RNF-4.1.3:** Las contraseñas se almacenan en texto plano (para desarrollo; en producción usar bcrypt)
- **RNF-4.1.4:** CORS habilitado para acceso desde aplicación React

### 4.2 Desempeño
- **RNF-4.2.1:** Los endpoints de lectura deben responder en menos de 500ms
- **RNF-4.2.2:** Las búsquedas deben soportar hasta 10,000 productos

### 4.3 Disponibilidad
- **RNF-4.3.1:** El sistema debe estar disponible 24/7 (en desarrollo)
- **RNF-4.3.2:** Tiempo de recuperación ante fallos: menos de 1 minuto

### 4.4 Mantenibilidad
- **RNF-4.4.1:** El código debe seguir estándares REST
- **RNF-4.4.2:** Todos los endpoints deben estar documentados
- **RNF-4.4.3:** La base de datos debe persistir en archivo JSON

---

## 5. Modelo de Datos

### 5.1 Entidades

#### Usuario
```
id: Long (PK)
nombre: String
email: String (UNIQUE)
password: String
rol: String (USUARIO | ADMIN)
activo: Boolean
```

#### Producto
```
id: Long (PK)
titulo: String
autor: String
descripcion: String
year: Integer
```

### 5.2 Relaciones
- Un usuario puede crear múltiples productos
- Un producto es creado por exactamente un usuario (futuro)

---

## 6. Interfaces

### 6.1 Interfaz de Usuario (Frontend)

#### Página Pública - Catálogo
- Navegación principal
- Búsqueda de productos
- Listado de todos los productos
- Enlaces a Login y Registro (si no autenticado)

#### Página Login
- Campos: Email, Contraseña
- Validaciones en cliente
- Mensaje de error si falla
- Enlace a página de Registro

#### Página Registro
- Campos: Nombre, Email, Contraseña, Confirmar Contraseña
- Validaciones en cliente
- Redirección automática a página principal si éxito

#### Página Admin (Protegida)
- Listado de todos los productos
- Opciones para editar y eliminar
- Enlace a página de creación

#### Página Crear Producto (Protegida)
- Formulario para crear nuevo producto
- Validaciones en cliente
- Mensaje de éxito/error

---

## 7. Casos de Uso

### 7.1 Caso de Uso: Registro de Usuario
**Actor:** Usuario Anónimo

**Flujo Principal:**
1. Usuario navega a página de Registro
2. Completa formulario (nombre, email, password)
3. Sistema valida campos
4. Sistema crea usuario con rol USUARIO
5. Sistema genera token JWT
6. Sistema redirige a página principal

**Flujos Alternativos:**
- Email ya existe: Mostrar error "Email duplicado"
- Contraseña muy corta: Mostrar error "Mínimo 6 caracteres"

### 7.2 Caso de Uso: Login de Usuario
**Actor:** Usuario Registrado

**Flujo Principal:**
1. Usuario navega a página Login
2. Completa email y contraseña
3. Sistema valida credenciales
4. Sistema genera token JWT
5. Sistema almacena token en localStorage
6. Sistema redirige a página principal

**Flujos Alternativos:**
- Usuario no existe: Mostrar error
- Contraseña incorrecta: Mostrar error

### 7.3 Caso de Uso: Crear Producto
**Actor:** Administrador

**Precondiciones:** Usuario tiene rol ADMIN y token válido

**Flujo Principal:**
1. Administrador navega a página /crear
2. Completa formulario (título, autor, descripción, year)
3. Sistema valida token en header Authorization
4. Sistema valida rol es ADMIN
5. Sistema crea producto
6. Sistema retorna producto creado

**Flujos Alternativos:**
- Token ausente: Retorna 401 Unauthorized
- Usuario no es ADMIN: Retorna 403 Forbidden
- Datos inválidos: Retorna 400 Bad Request

---

## 8. Arquitectura del Sistema

### 8.1 Diagrama de Componentes

```
┌─────────────────────────────────────┐
│      Navegador Web                  │
│  (React + Vite Frontend)            │
│ ┌───────────────────────────────┐   │
│ │ AuthContext                   │   │
│ │ - user state                  │   │
│ │ - token (localStorage)        │   │
│ └───────────────────────────────┘   │
└──────────────┬──────────────────────┘
               │ HTTP + JWT
               ▼
┌─────────────────────────────────────┐
│   Spring Boot Backend (Java 17)     │
│ ┌───────────────────────────────┐   │
│ │ AuthController                │   │
│ │ /api/auth/login               │   │
│ │ /api/auth/register            │   │
│ │ /api/auth/validate            │   │
│ └───────────────────────────────┘   │
│ ┌───────────────────────────────┐   │
│ │ ProductoController            │   │
│ │ GET /api/productos            │   │
│ │ POST /api/productos (ADMIN)   │   │
│ │ PUT /api/productos/{id} (ADM) │   │
│ │ DELETE /api/productos/{id}... │   │
│ └───────────────────────────────┘   │
│ ┌───────────────────────────────┐   │
│ │ UserRepositoryImpl             │   │
│ │ (Persistencia JSON)           │   │
│ └───────────────────────────────┘   │
└─────────────────────────────────────┘
               │
               ▼
        users.json (Archivo)
```

---

## 9. Estándares de Codificación

### 9.1 Respuestas API
Todas las respuestas deben seguir el formato:
```json
{
  "success": boolean,
  "data": any,
  "error": string | null
}
```

### 9.2 Códigos HTTP
- **200 OK:** Operación exitosa
- **201 Created:** Recurso creado
- **400 Bad Request:** Datos inválidos
- **401 Unauthorized:** Token faltante o inválido
- **403 Forbidden:** Usuario sin permisos
- **404 Not Found:** Recurso no existe
- **500 Internal Server Error:** Error del servidor

---

## 10. Definiciones de Listo (Definition of Done)

Una característica se considera completa cuando:
- ✅ Código compila sin errores
- ✅ Funcionalidad implementada según especificación
- ✅ Pruebas manuales exitosas
- ✅ Validaciones en cliente y servidor
- ✅ Manejo de errores apropiado
- ✅ Documentación actualizada
- ✅ CORS habilitado para comunicación cliente-servidor

---

## 11. Conclusiones

Este documento especifica los requisitos necesarios para implementar un Sistema de Gestión de Biblioteca Digital con autenticación JWT y control de acceso basado en roles. La arquitectura propuesta es escalable y preparada para futuros agregados como base de datos relacional y carrito de compras.

**Aprobado por:** Team 19  
**Fecha:** Diciembre 2025
