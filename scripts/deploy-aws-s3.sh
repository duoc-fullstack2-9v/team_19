#!/bin/bash
set -e

echo "==================================================="
echo "  Despliegue de Multiverso Comics a AWS S3"
echo "==================================================="

BUCKET_NAME=$1
CLOUDFRONT_ID=$2

if [ -z "$BUCKET_NAME" ]; then
    echo "[ERROR] Debes proporcionar el nombre del bucket de S3."
    echo "Uso: ./deploy-aws-s3.sh NOMBRE_DEL_BUCKET [DISTRIBUTION_ID_CLOUDFRONT]"
    exit 1
fi

echo "[1/3] Compilando el proyecto para producción..."
npm run build

echo "[2/3] Sincronizando archivos con el bucket s3://$BUCKET_NAME..."
aws s3 sync dist/ s3://"$BUCKET_NAME" --delete

if [ -n "$CLOUDFRONT_ID" ]; then
    echo "[3/3] Invalidando caché en CloudFront ($CLOUDFRONT_ID)..."
    aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_ID" --paths "/*"
else
    echo "[3/3] Omisión de invalidación de CloudFront (No se proporcionó DISTRIBUTION_ID)."
fi

echo "==================================================="
echo "  ¡Despliegue completado exitosamente!"
echo "==================================================="
