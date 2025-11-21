// Utilidad para resolver imágenes de covers usando import.meta.glob (Vite)

// Cargar todas las imágenes de covers en tiempo de compilación con Vite
const _imagenesCovers = import.meta.glob('../images/covers/**/*.{jpg,jpeg,png}', { eager: true, as: 'url' });

// Normalizamos a un mapa por nombre de archivo en minúsculas para buscar fácilmente
const imagenMap = {};
for (const ruta in _imagenesCovers) {
  const partes = ruta.split('/');
  const nombre = partes[partes.length - 1].toLowerCase();
  imagenMap[nombre] = _imagenesCovers[ruta];
}

// Normalizar cadenas: quitar acentos y pasar a minúsculas
function normalize(str = '') {
  return str
    .toString()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();
}

export function getImagenUrl(rutaOriginal, productoNombre) {
  if (!rutaOriginal) return '';

  // extraer solo el nombre del archivo
  const partes = rutaOriginal.split('/');
  const nombreArchivo = partes[partes.length - 1].toLowerCase();

  // Intentos de búsqueda:
  // 1) nombre tal cual en minúsculas
  if (imagenMap[nombreArchivo]) return imagenMap[nombreArchivo];

  // 2) reemplazar espacios por '%20' o por guiones bajos
  const reemplazos = [nombreArchivo.replace(/ /g, '%20'), nombreArchivo.replace(/ /g, '_'), nombreArchivo.replace(/ /g, '-')];
  for (const r of reemplazos) {
    if (imagenMap[r]) return imagenMap[r];
  }

  // 3) buscar por coincidencia parcial (contiene) - toma la primera coincidencia
  const keys = Object.keys(imagenMap);
  const parcial = keys.find(k => k.includes(nombreArchivo.replace(/\.[^.]+$/, '')));
  if (parcial) return imagenMap[parcial];

  // 4) Intento adicional: si se nos pasa el nombre del producto, buscar coincidencias
  if (productoNombre) {
    const target = normalize(productoNombre).replace(/\s+/g, ' ');
    for (const k of keys) {
      const baseNoExt = k.replace(/\.[^.]+$/, '');
      const normKey = normalize(baseNoExt).replace(/\s+/g, ' ');
      if (normKey.includes(target) || target.includes(normKey)) {
        return imagenMap[k];
      }
    }
  }

  // 5) como fallback, devolver la ruta original
  return rutaOriginal;
}

export default getImagenUrl;
