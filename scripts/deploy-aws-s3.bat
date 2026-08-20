@echo off
echo ===================================================
echo   Despliegue de Multiverso Comics a AWS S3
echo ===================================================

if "%~1"=="" (
    echo [ERROR] Debes proporcionar el nombre del bucket de S3.
    echo Uso: deploy-aws-s3.bat NOMBRE_DEL_BUCKET [DISTRIBUTION_ID_CLOUDFRONT]
    exit /b 1
)

set BUCKET_NAME=%~1
set CLOUDFRONT_ID=%~2

echo [1/3] Compilando el proyecto para produccion...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] La compilacion fallo. Corrige los errores antes de desplegar.
    exit /b %ERRORLEVEL%
)

echo [2/3] Sincronizando archivos con el bucket s3://%BUCKET_NAME%...
aws s3 sync dist/ s3://%BUCKET_NAME% --delete
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Error al sincronizar con AWS S3. Verifica tus credenciales de AWS CLI.
    exit /b %ERRORLEVEL%
)

if not "%CLOUDFRONT_ID%"=="" (
    echo [3/3] Invalidando cache en CloudFront (%CLOUDFRONT_ID%)...
    aws cloudfront create-invalidation --distribution-id %CLOUDFRONT_ID% --paths "/*"
) else (
    echo [3/3] Omision de invalidacion de CloudFront (No se proporciono DISTRIBUTION_ID).
)

echo ===================================================
echo   Despliegue completado exitosamente!
echo ===================================================
