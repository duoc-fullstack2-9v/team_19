# team_19
=======
# team_19

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Cambios recientes (extraídos a CSS y refactorizaciones)

Resumen de los cambios realizados:

- Se identificaron y eliminaron estilos inline en varios componentes del proyecto para mejorar la mantenibilidad.
 
- Se crearon nuevos archivos de estilos en `src/components/styles/`:
	- `Body.css` — estilos para la lista del carrito, botones y layout del popup de pago.
	- `Nav.css` — estilos para la cabecera de navegación, buscador y acciones (login/registro).
	- `App.css` — estilos globales de layout (contenedor principal y padding).

- Se actualizaron y ampliaron estilos existentes en `Admin.css` y se movieron estilos inline de `Admin.jsx` a esas clases.
  
- Componentes modificados para importar y usar las nuevas clases CSS:
	- `src/components/layout/Body.jsx` (carrito, popups, botones): reemplazados múltiples estilos inline por clases en `Body.css`.
	- `src/components/layout/Nav.jsx` (cabecera y popups de login/registro): reemplazados estilos inline por clases en `Nav.css`.
	- `src/App.jsx`: movido el layout inline a `App.css` y uso de clases.
	- `src/components/pages/Admin.jsx`: eliminadas la mayoría de las reglas inline y uso de utilidades definidas en `Admin.css`.
   
- Se añadieron utilidades CSS para botones y márgenes reutilizables.
- Se mantuvo la compatibilidad con los popups (clases `popup-overlay` y `popup-content`) para no romper la apariencia existente.

Impacto:

- La separación de estilos facilita futuras modificaciones visuales y pruebas.
- Las pruebas unitarias (Vitest) se ejecutaron luego de los cambios y pasaron correctamente.
# team_19
>>>>>>> f42ec026d4023b4d4903a25ca8e97c253ad9e824
