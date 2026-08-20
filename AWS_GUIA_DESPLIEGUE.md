# Guía de Despliegue en AWS - Multiverso Comics

Esta guía describe paso a paso cómo desplegar la aplicación React + Vite en la nube de **Amazon Web Services (AWS)** utilizando las opciones más recomendadas de la industria.

---

## Índice
1. [Estructura del API Manager y Variables de Entorno](#1-estructura-del-api-manager-y-variables-de-entorno)
2. [Opción 1: AWS S3 + Amazon CloudFront (Recomendada / Serverless)](#2-opción-1-aws-s3--amazon-cloudfront-recomendada)
3. [Opción 2: AWS Amplify Hosting (Fácil y Rápida)](#3-opción-2-aws-amplify-hosting)
4. [Opción 3: Contenedor Docker en AWS App Runner / ECS](#4-opción-3-contenedor-docker-en-aws-app-runner--ecs)
5. [Configuración de Dominio y SSL con Route 53 y ACM](#5-configuración-de-dominio-y-ssl)

---

## 1. Estructura del API Manager y Variables de Entorno

El proyecto incluye una capa centralizada en `src/services/api/`:
- **`apiClient.js`**: Cliente HTTP base con inyección de JWT, manejo de errores `ApiError` y URLs dinámicas.
- **`authApi.js`**: Endpoints de login, registro, validación de tokens y decodificación JWT.
- **`productsApi.js`**: CRUD de productos y health check.
- **`usersApi.js`**: Gestión de usuarios.
- **`apiManager`** (`src/services/api/index.js`): Façade unificada para importar en cualquier componente.

### Variables de Entorno Disponibles:
| Variable | Descripción | Ejemplo Local | Ejemplo Producción |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | URL base de la API de backend | `http://localhost:5000/api` | `https://api.tudominio.com/api` o `/api` |
| `VITE_AUTH_API_URL` | URL del servicio de autenticación | `http://localhost:8080/api` | `https://api.tudominio.com/api/auth` o `/api/auth` |
| `VITE_APP_NAME` | Nombre de la aplicación | `Multiverso Comics` | `Multiverso Comics` |

---

## 2. Opción 1: AWS S3 + Amazon CloudFront (Recomendada)

Es la arquitectura estándar de alto rendimiento, bajo costo y alta disponibilidad para aplicaciones SPA en React.

### Paso 1: Crear el Bucket en Amazon S3
1. Ingresa a la consola de **AWS S3** y haz clic en **Create bucket**.
2. Asigna un nombre único (ejemplo: `multiverso-comics-frontend`).
3. En **Object Ownership**, selecciona *ACLs disabled (recommended)*.
4. Desmarca *Block all public access* si deseas acceso directo o manténlo bloqueado si utilizarás **CloudFront Origin Access Control (OAC)** (Recomendado por seguridad).

### Paso 2: Crear la Distribución en Amazon CloudFront
1. Ve a la consola de **CloudFront** y haz clic en **Create distribution**.
2. En **Origin domain**, selecciona el bucket de S3 creado.
3. En **Origin access**, selecciona **Origin access control settings (recommended)** y crea un nuevo OAC.
4. En **Default cache behavior**:
   - **Viewer protocol policy**: *Redirect HTTP to HTTPS*.
   - **Allowed HTTP methods**: *GET, HEAD*.
5. En **Custom error response** (Crucial para React Router):
   - Haz clic en **Create custom error response**.
   - **HTTP error code**: `403: Forbidden` y `404: Not Found`.
   - **Response page path**: `/index.html`.
   - **HTTP Response code**: `200: OK`.

### Paso 3: Compilar y Subir los Archivos
Ejecuta la compilación de producción:
```bash
npm run build
```
Sube los archivos a S3 usando AWS CLI:
```bash
aws s3 sync dist/ s3://multiverso-comics-frontend --delete
```
Invalida la caché de CloudFront para reflejar los cambios de inmediato:
```bash
aws cloudfront create-invalidation --distribution-id TU_DISTRIBUTION_ID --paths "/*"
```

> **Nota:** Puedes usar el script automático `scripts/deploy-aws-s3.bat` (Windows) o `scripts/deploy-aws-s3.sh` (Linux/Mac):
> ```bash
> scripts\deploy-aws-s3.bat multiverso-comics-frontend TU_DISTRIBUTION_ID
> ```

---

## 3. Opción 2: AWS Amplify Hosting

AWS Amplify proporciona despliegues continuos directamente desde tu repositorio de GitHub / GitLab.

### Pasos:
1. Sube tu código a GitHub.
2. Ingresa a **AWS Amplify Console** y selecciona **Host web app**.
3. Conecta tu repositorio y selecciona la rama (`main`).
4. Amplify detectará automáticamente la configuración definida en `amplify.yml`.
5. En **Environment variables**, agrega `VITE_API_URL` con la URL de tu backend.
6. Haz clic en **Save and Deploy**. Cada nuevo `push` a la rama desplegará automáticamente.

---

## 4. Opción 3: Contenedor Docker en AWS App Runner / ECS

Si prefieres desplegar mediante contenedores Docker con Nginx:

### Paso 1: Probar el contenedor localmente
```bash
# Construir la imagen
docker build -t multiverso-comics:latest .

# Ejecutar el contenedor
docker run -p 8080:80 multiverso-comics:latest
```
Abre en tu navegador: `http://localhost:8080`

### Paso 2: Subir la imagen a Amazon ECR (Elastic Container Registry)
```bash
# Autenticar Docker con AWS ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin TU_ID_CUENTA.dkr.ecr.us-east-1.amazonaws.com

# Crear repositorio
aws ecr create-repository --repository-name multiverso-comics

# Etiquetar y subir imagen
docker tag multiverso-comics:latest TU_ID_CUENTA.dkr.ecr.us-east-1.amazonaws.com/multiverso-comics:latest
docker push TU_ID_CUENTA.dkr.ecr.us-east-1.amazonaws.com/multiverso-comics:latest
```

### Paso 3: Desplegar en AWS App Runner
1. Ve a **AWS App Runner** y haz clic en **Create service**.
2. Selecciona **Container registry** -> **Amazon ECR**.
3. Selecciona la imagen `multiverso-comics:latest`.
4. En puerto, especifica `80`.
5. Haz clic en **Deploy**. App Runner te dará una URL HTTPS pública y gestionará el autoescalado automáticamente.

---

## 5. Configuración de Dominio y SSL

1. **Amazon Route 53**: Crea una zona alojada para tu dominio (ej. `tudominio.com`).
2. **AWS Certificate Manager (ACM)**: Solicita un certificado SSL/TLS gratuito para `tudominio.com` y `*.tudominio.com` en la región `us-east-1` (obligatorio para CloudFront).
3. **Vincular en CloudFront / Amplify**: Agrega tu dominio personalizado (CNAME) y asocia el certificado SSL emitido por ACM.
4. **Registros DNS**: En Route 53, crea un registro tipo `A` (Alias) apuntando a la distribución de CloudFront o al servicio de App Runner/Amplify.
