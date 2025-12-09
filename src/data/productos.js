// Listado mínimo de productos por defecto. Puedes editarlo si quieres.
const defaultProductos = [
  {
    id: 1,
    nombre: 'New Mutants Combate el Futuro 3 de 3',
    precio: 5990,
    imagen: '/src/images/covers/0006e93f62963735cf75b324bbccbf00e976ed2325127889.jpg',
    enlace: '/producto/1'
  },
  {
    id: 2,
    nombre: 'Patrulla X Especie en Peligro 13',
    precio: 8990,
    imagen: '/src/images/covers/0068adf75be74e30491346d250a383c12cfa8fbd27623174.jpg',
    enlace: '/producto/2'
  },
  {
    id: 3,
    nombre: 'Superior Ironman',
    precio: 15990,
    imagen: '/src/images/covers/0210a8ecdb91c6247d5f0b19bfbf37811197e7827696592.jpg',
    enlace: '/producto/3'
  }
];

// Devuelve la lista combinada: productos por defecto + productos guardados en localStorage
export default function getProductos() {
  try {
    const raw = localStorage.getItem('productos');
    const saved = raw ? JSON.parse(raw) : [];

    // Calcular max id existente
    const maxDefault = defaultProductos.reduce((m, p) => Math.max(m, p.id || 0), 0);
    const maxSaved = saved.reduce((m, p) => Math.max(m, p.id || 0), 0);
    let nextId = Math.max(maxDefault, maxSaved) + 1;

    // Asegurar ids únicos para saved
    const seen = new Set(defaultProductos.map(p => p.id));
    const normalizedSaved = saved.map(p => {
      const copy = { ...p };
      if (!copy.id || seen.has(copy.id)) {
        copy.id = nextId++;
      }
      seen.add(copy.id);
      return copy;
    });

    return [...defaultProductos, ...normalizedSaved];
  } catch (e) {
    console.error('Error leyendo productos desde localStorage', e);
    return defaultProductos;
  }
}
