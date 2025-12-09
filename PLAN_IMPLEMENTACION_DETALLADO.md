# 🛠️ PLAN DETALLADO: IMPLEMENTACIÓN PASO A PASO

## PASO 1: AUTENTICACIÓN JWT (4-5 horas) ⚠️ CRÍTICO

### 1.1 BACKEND - Crear User Entity y Repository

**Archivo:** `producto_back/src/main/java/com/team19/producto/model/User.java`

```java
package com.team19.producto.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    private Long id;
    private String nombre;
    private String email;
    private String password; // Debe estar encriptada
    private String rol; // "USUARIO" o "ADMIN"
    private boolean activo;
}
```

**Archivo:** `producto_back/src/main/java/com/team19/producto/repository/IUserRepository.java`

```java
package com.team19.producto.repository;

import com.team19.producto.model.User;
import java.util.Optional;

public interface IUserRepository {
    User guardar(User user);
    Optional<User> obtenerPorEmail(String email);
    Optional<User> obtenerPorId(Long id);
}
```

**Archivo:** `producto_back/src/main/java/com/team19/producto/repository/UserRepositoryImpl.java`

Similar a ProductoRepositoryImpl pero para usuarios (JSON en users.json)

### 1.2 BACKEND - Crear JWT Utility

**Archivo:** `producto_back/src/main/java/com/team19/producto/util/JwtUtil.java`

```java
package com.team19.producto.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {
    
    @Value("${jwt.secret:miSecretoSeguro12345678}")
    private String jwtSecret;
    
    @Value("${jwt.expiration:86400000}") // 24 horas en ms
    private long jwtExpiration;

    public String generarToken(String email, String rol) {
        Date ahora = new Date();
        Date fechaExpiracion = new Date(ahora.getTime() + jwtExpiration);

        return Jwts.builder()
                .setSubject(email)
                .claim("rol", rol)
                .setIssuedAt(ahora)
                .setExpiration(fechaExpiracion)
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }

    public String obtenerEmailDelToken(String token) {
        return Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validarToken(String token) {
        try {
            Jwts.parser().setSigningKey(jwtSecret).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String obtenerRolDelToken(String token) {
        return (String) Jwts.parser()
                .setSigningKey(jwtSecret)
                .parseClaimsJws(token)
                .getBody()
                .get("rol");
    }
}
```

### 1.3 BACKEND - Crear Auth Service

**Archivo:** `producto_back/src/main/java/com/team19/producto/service/IAuthService.java`

```java
package com.team19.producto.service;

import com.team19.producto.dto.LoginDTO;
import com.team19.producto.dto.RegisterDTO;

public interface IAuthService {
    String login(LoginDTO loginDTO);
    String register(RegisterDTO registerDTO);
}
```

**Archivo:** `producto_back/src/main/java/com/team19/producto/service/AuthServiceImpl.java`

```java
package com.team19.producto.service;

import com.team19.producto.dto.LoginDTO;
import com.team19.producto.dto.RegisterDTO;
import com.team19.producto.exception.BadRequestException;
import com.team19.producto.model.User;
import com.team19.producto.repository.IUserRepository;
import com.team19.producto.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements IAuthService {
    
    @Autowired
    private IUserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public String login(LoginDTO loginDTO) {
        User user = userRepository.obtenerPorEmail(loginDTO.getEmail())
                .orElseThrow(() -> new BadRequestException("Usuario o contraseña incorrectos"));

        if (!user.getPassword().equals(loginDTO.getPassword())) {
            throw new BadRequestException("Usuario o contraseña incorrectos");
        }

        return jwtUtil.generarToken(user.getEmail(), user.getRol());
    }

    @Override
    public String register(RegisterDTO registerDTO) {
        if (userRepository.obtenerPorEmail(registerDTO.getEmail()).isPresent()) {
            throw new BadRequestException("El email ya está registrado");
        }

        User nuevoUser = new User(
                null,
                registerDTO.getNombre(),
                registerDTO.getEmail(),
                registerDTO.getPassword(),
                "USUARIO", // Rol por defecto
                true
        );

        userRepository.guardar(nuevoUser);
        return jwtUtil.generarToken(nuevoUser.getEmail(), nuevoUser.getRol());
    }
}
```

### 1.4 BACKEND - Crear Auth DTOs

**Archivo:** `producto_back/src/main/java/com/team19/producto/dto/LoginDTO.java`

```java
package com.team19.producto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginDTO {
    private String email;
    private String password;
}
```

**Archivo:** `producto_back/src/main/java/com/team19/producto/dto/RegisterDTO.java`

```java
package com.team19.producto.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterDTO {
    private String nombre;
    private String email;
    private String password;
}
```

### 1.5 BACKEND - Crear Auth Controller

**Archivo:** `producto_back/src/main/java/com/team19/producto/controller/AuthController.java`

```java
package com.team19.producto.controller;

import com.team19.producto.dto.ApiResponse;
import com.team19.producto.dto.LoginDTO;
import com.team19.producto.dto.RegisterDTO;
import com.team19.producto.service.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private IAuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<String>> login(@RequestBody LoginDTO loginDTO) {
        try {
            String token = authService.login(loginDTO);
            return ResponseEntity.ok(ApiResponse.success("Login exitoso", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error en login", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@RequestBody RegisterDTO registerDTO) {
        try {
            String token = authService.register(registerDTO);
            return ResponseEntity.ok(ApiResponse.success("Registro exitoso", token));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Error en registro", e.getMessage()));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<ApiResponse<String>> validarToken(
            @RequestHeader("Authorization") String token) {
        // Implementar validación
        return ResponseEntity.ok(ApiResponse.success("Token válido", ""));
    }
}
```

### 1.6 BACKEND - Proteger Endpoints de Admin

Modificar `ProductoController.java`:

```java
@PostMapping
public ResponseEntity<ApiResponse<Producto>> crear(
        @RequestHeader("Authorization") String token,
        @RequestBody ProductoDTO productoDTO) {
    // Validar que sea admin
    if (!esAdmin(token)) {
        throw new BadRequestException("No tienes permisos para crear productos");
    }
    // ... resto del código
}

private boolean esAdmin(String token) {
    // Validar token y verificar rol
    // return jwtUtil.obtenerRolDelToken(token).equals("ADMIN");
}
```

### 1.7 BACKEND - Actualizar application.properties

```properties
# JWT Configuration
jwt.secret=miSecretoSeguro12345678
jwt.expiration=86400000
```

---

## PASO 2: FRONTEND - Autenticación (3-4 horas)

### 2.1 Crear AuthContext

**Archivo:** `src/context/AuthContext.jsx`

```jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar token al montar
    if (token) {
      validarToken();
    }
    setLoading(false);
  }, []);

  const validarToken = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/validate', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        // Token válido
      } else {
        setToken(null);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error validando token:', error);
      setToken(null);
      localStorage.removeItem('token');
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (response.ok) {
        const newToken = data.data;
        setToken(newToken);
        localStorage.setItem('token', newToken);
        // Decodificar y setear usuario
        const decoded = decodeToken(newToken);
        setUser({ email: decoded.email, rol: decoded.rol });
        return true;
      }
      throw new Error(data.error);
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return {};
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### 2.2 Crear LoginForm

**Archivo:** `src/components/pages/Login.jsx`

```jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../styles/Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!email || !password) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Email no válido');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/');
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p>¿No tienes cuenta? <a href="/register">Regístrate aquí</a></p>
    </div>
  );
};
```

### 2.3 Crear PrivateRoute

**Archivo:** `src/components/PrivateRoute.jsx`

```jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.rol !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};
```

### 2.4 Actualizar App.jsx

Envolver con AuthProvider y agregar rutas protegidas.

---

## PASO 3: DOCUMENTACIÓN (3-4 horas)

### 3.1 Crear ERS.md

```markdown
# Especificación de Requisitos del Software (ERS)

## 1. Introducción
- Descripción del proyecto
- Objetivo general
- Alcance

## 2. Requisitos Funcionales
- RF1: Gestión de Productos
- RF2: Gestión de Usuario
- RF3: Carrito de Compras
- RF4: Búsqueda de Productos

## 3. Requisitos No-Funcionales
- Rendimiento
- Seguridad
- Usabilidad

## 4. Casos de Uso
[Detallar casos de uso principales]

## 5. Modelo de Datos
[Describir entidades y relaciones]
```

### 3.2 Crear MANUAL_USUARIO.md

Paso a paso de cómo usar la aplicación: login, crear carrito, comprar, etc.

### 3.3 Crear TESTING_COVERAGE.md

Resultados de `npm run test:coverage`

---

## PASO 4: VALIDACIONES (2-3 horas)

Agregar validaciones en Crear.jsx, Admin.jsx, etc. con mensajes de error claros.

---

## PASO 5: SWAGGER (1-2 horas)

Agregar dependency en pom.xml y anotaciones en controllers.

---

## ⏱️ ORDEN RECOMENDADO

1. **Hoy**: JWT Backend + Frontend Login (4-5 horas)
2. **Mañana**: Documentación (ERS, Manual, Testing) (3-4 horas)
3. **Día 3**: Validaciones + Swagger (3-4 horas)
4. **Día 4**: Testing final + Entrega (2-3 horas)

**Total: 15-20 horas**
