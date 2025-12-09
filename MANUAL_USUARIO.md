# MANUAL DE USUARIO - Sistema de Gestión de Biblioteca Digital

**Versión:** 1.0  
**Fecha:** Diciembre 2025  
**Equipo:** Team 19

---

## Tabla de Contenidos

1. [Introducción](#introducción)
2. [Requisitos Previos](#requisitos-previos)
3. [Instalación](#instalación)
4. [Primeros Pasos](#primeros-pasos)
5. [Funciones del Usuario Estándar](#funciones-del-usuario-estándar)
6. [Funciones del Administrador](#funciones-del-administrador)
7. [Preguntas Frecuentes](#preguntas-frecuentes)
8. [Solución de Problemas](#solución-de-problemas)

---

## Introducción

Bienvenido al Sistema de Gestión de Biblioteca Digital. Esta aplicación te permite explorar un catálogo de libros y, si tienes permisos de administrador, gestionar el inventario.

### Características Principales
- 📚 Catálogo de libros accesible públicamente
- 🔐 Autenticación segura con tokens JWT
- 👤 Roles de usuario (Estándar y Administrador)
- 🔍 Búsqueda de libros por título o autor
- ✏️ Creación, edición y eliminación de productos (Admins)

---

## Requisitos Previos

### Hardware
- Computadora con navegador web moderno
- Conexión a Internet
- Mínimo 512 MB de RAM

### Software
- Navegador actualizado (Chrome, Firefox, Safari, Edge)
- Java 17+ (si ejecutas el servidor localmente)
- Node.js 18+ (si ejecutas el cliente localmente)

---

## Instalación

### Instalación Rápida (Precompilado)

#### 1. Descargar Archivos
```bash
# Descargar el proyecto
cd tu-carpeta-de-proyectos
git clone https://github.com/tu-repo/biblioteca-digital.git
cd biblioteca-digital
```

#### 2. Ejecutar el Backend
```bash
# Windows
cd team_19
java -jar target/producto-api-1.0.0.jar

# Linux/Mac
./target/producto-api-1.0.0.jar
```

El servidor se ejecutará en: `http://localhost:8080`

#### 3. Ejecutar el Frontend
```bash
# En otra terminal/consola
cd team_19
npm install
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

### Instalación desde Código Fuente

#### Backend (Java/Spring Boot)
```bash
cd team_19
mvn clean install
mvn spring-boot:run
```

#### Frontend (React/Vite)
```bash
cd team_19
npm install
npm run dev
```

---

## Primeros Pasos

### Acceder a la Aplicación

1. Abre tu navegador web
2. Ve a `http://localhost:5173` (frontend)
3. Verás la página de inicio con el catálogo de libros

### Credenciales de Prueba

La aplicación incluye dos cuentas de prueba preconfiguradas:

**Usuario Estándar:**
```
Email: user@test.com
Contraseña: user123
```

**Administrador:**
```
Email: admin@test.com
Contraseña: admin123
```

---

## Funciones del Usuario Estándar

### 1. Ver Catálogo de Libros

**Paso a paso:**
1. Abre la aplicación
2. En la página principal verás todos los libros disponibles
3. Cada libro muestra:
   - Título
   - Autor
   - Descripción
   - Año de publicación

### 2. Registrarse

**Para crear una cuenta nueva:**

1. Haz clic en el botón "Registrarse" en la navegación
2. Completa el formulario:
   - **Nombre:** Tu nombre completo
   - **Email:** Correo electrónico válido
   - **Contraseña:** Mínimo 6 caracteres
   - **Confirmar Contraseña:** Debe coincidir con la contraseña
3. Valida que no haya errores en rojo
4. Haz clic en "Registrarse"
5. Serás redirigido automáticamente a la página principal

**Validaciones:**
- ❌ El email no es válido → Muestra: "El email no es válido"
- ❌ Contraseña muy corta → Muestra: "La contraseña debe tener al menos 6 caracteres"
- ❌ Las contraseñas no coinciden → Muestra: "Las contraseñas no coinciden"
- ❌ El email ya existe → Muestra: "Ese email ya está registrado"

### 3. Iniciar Sesión

**Para acceder con tu cuenta:**

1. Haz clic en "Iniciar sesión"
2. Completa:
   - **Email:** Tu email de registro
   - **Contraseña:** Tu contraseña
3. Haz clic en "Entrar"
4. Si es correcto, verás tu email en la navegación

**Si falla el login:**
- Verifica que el email sea correcto
- Asegúrate que la contraseña sea exacta (distingue mayúsculas/minúsculas)

### 4. Cerrar Sesión

**Para salir de tu cuenta:**

1. Mira el top-right donde aparece tu email
2. Haz clic en el botón "Cerrar sesión"
3. Se limpiará tu sesión y volverás a la página principal

### 5. Buscar Libros

**Buscar por título o autor:**

1. En la página principal, usa la barra de búsqueda
2. Escribe el nombre del libro o autor
3. Los resultados se filtran automáticamente
4. Los resultados se muestran en tiempo real

**Ejemplos de búsqueda:**
- "Quijote" → Encuentra "El Quijote"
- "García" → Encuentra "Cien años de soledad" (autor García Márquez)

---

## Funciones del Administrador

> **Nota:** Solo los administradores pueden acceder a estas funciones.

### 1. Acceder al Panel de Administración

**Requisitos:**
- Tu cuenta debe tener rol ADMIN
- Debes estar autenticado

**Pasos:**

1. Inicia sesión con tu cuenta admin
2. En la navegación, verás aparece la opción "Admin"
3. Haz clic en "Admin"
4. Verás la lista de todos los productos

### 2. Crear un Nuevo Producto

**Para agregar un nuevo libro al catálogo:**

1. Haz clic en "Crear" en la navegación (visible solo para admins)
2. Completa el formulario:
   - **Título:** Nombre del libro
   - **Autor:** Nombre del autor
   - **Descripción:** Descripción del libro
   - **Año:** Año de publicación (ej: 2024)
3. Haz clic en "Crear"
4. Si todo es correcto, el producto se agregará y verás un mensaje de éxito

**Validaciones:**
- Todos los campos son requeridos
- El título no puede estar vacío
- El año debe ser un número válido

### 3. Editar un Producto

**Para modificar un libro existente:**

1. Ve a la página Admin
2. Busca el producto que deseas editar
3. Haz clic en el botón "Editar"
4. Modifica los campos que necesites
5. Haz clic en "Guardar"
6. Verás el mensaje "Producto actualizado"

### 4. Eliminar un Producto

**Para remover un libro del catálogo:**

1. Ve a la página Admin
2. Busca el producto que deseas eliminar
3. Haz clic en el botón "Eliminar"
4. Se te pedirá confirmación
5. Confirma y el producto será eliminado
6. Verás el mensaje "Producto eliminado correctamente"

---

## Preguntas Frecuentes

### ¿Olvidé mi contraseña?

Por ahora, no hay función de recuperación de contraseña. Contacta al administrador del sistema o crea una nueva cuenta con otro email.

**Solución temporal:** 
- Usa la cuenta de prueba: `user@test.com / user123`

### ¿Puedo cambiar mi rol de usuario a admin?

No, el rol se asigna solo durante el registro (siempre USUARIO) o por el administrador manualmente en la base de datos. Contacta al administrador si necesitas permisos de admin.

### ¿Por cuánto tiempo mi sesión es válida?

Tu token de sesión es válido por **24 horas**. Después de ese tiempo, deberás iniciar sesión nuevamente.

### ¿Mis datos están seguros?

La contraseña se transmite encriptada (HTTPS en producción). Los tokens usan algoritmo HS512. En producción, implementaremos encriptación adicional.

### ¿Puedo buscar un libro que no aparece?

Si el libro no aparece en búsqueda:
1. Intenta búsquedas parciales (ej: "Cer" para "Cervantes")
2. Verifica la ortografía
3. Contacta al administrador para que agregue el libro

### ¿Cómo elimino mi cuenta?

Por ahora, no existe función de auto-eliminación. Contacta al administrador del sistema.

---

## Solución de Problemas

### El servidor no inicia

**Síntomas:** Error al ejecutar `java -jar`

**Soluciones:**
1. Verifica que Java 17+ esté instalado:
   ```bash
   java -version
   ```
2. Verifica que el puerto 8080 esté disponible
3. Ejecuta con rutas completas si tiene espacios en el path

### No puedo conectarme al backend

**Síntomas:** Error "No es posible conectar" cuando intento login

**Soluciones:**
1. Verifica que el backend esté ejecutándose:
   ```bash
   # Terminal separada
   java -jar target/producto-api-1.0.0.jar
   ```
2. Verifica que esté en puerto 8080:
   ```bash
   netstat -an | findstr :8080
   ```
3. Desactiva el firewall temporalmente para probar

### El login falla aunque las credenciales son correctas

**Síntomas:** Mensaje "Usuario no encontrado" o "Contraseña incorrecta"

**Soluciones:**
1. Verifica que escribiste el email correctamente (distingue mayúsculas)
2. Verifica que escribiste la contraseña correctamente
3. Intenta con las credenciales de prueba: `admin@test.com / admin123`
4. Comprueba que el archivo `users.json` existe

### No veo los botones de Admin

**Síntomas:** No aparecen "Admin" y "Crear" en la navegación

**Soluciones:**
1. Verifica estar autenticado como ADMIN
2. Recarga la página (F5 o Ctrl+R)
3. Cierra sesión y vuelve a iniciar
4. Limpia el caché del navegador

### La búsqueda no funciona

**Síntomas:** La búsqueda no filtra libros

**Soluciones:**
1. Asegúrate que hay productos en el catálogo
2. Prueba con búsquedas más simples
3. Refresca la página
4. Verifica en la consola del navegador (F12) si hay errores

### Tengo un error 401 Unauthorized

**Síntoma:** Mensaje "Token inválido o expirado"

**Soluciones:**
1. Inicia sesión nuevamente
2. Limpia localStorage: 
   ```javascript
   // Abre la consola (F12) y ejecuta:
   localStorage.removeItem('authToken')
   ```
3. Recarga la página

---

## Contato y Soporte

Para reportar problemas o sugerencias:
- Email: team19@ejemplo.com
- Repositorio: GitHub (enlace)

---

## Apéndice: Guía Técnica Rápida

### URLs Importantes

| Servicio | URL |
|----------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Swagger Docs | http://localhost:8080/swagger-ui.html |
| API Docs | http://localhost:8080/api-docs |

### Credenciales por Defecto

| Usuario | Email | Contraseña | Rol |
|---------|-------|------------|-----|
| Admin | admin@test.com | admin123 | ADMIN |
| Usuario | user@test.com | user123 | USUARIO |

### Estructura de Carpetas del Proyecto

```
team_19/
├── src/
│   ├── components/           # Componentes React
│   │   ├── layout/          # Componentes de diseño
│   │   ├── pages/           # Páginas
│   │   └── styles/          # Estilos CSS
│   ├── context/             # Contexto de autenticación
│   └── main.jsx
├── public/                  # Archivos estáticos
├── pom.xml                  # Configuración Maven
├── vite.config.js           # Configuración Vite
├── package.json             # Dependencias Node
└── README.md
```

### Comandos Útiles

```bash
# Desarrollo
npm run dev              # Ejecutar frontend en desarrollo
mvn spring-boot:run     # Ejecutar backend en desarrollo

# Compilación
npm run build           # Build de React
mvn clean package       # Compilar JAR de Spring Boot

# Testing
npm run test            # Tests de React
mvn test                # Tests de Java
```

---

**Última actualización:** Diciembre 2025

**Este manual cubre la versión 1.0 del Sistema de Gestión de Biblioteca Digital.**
