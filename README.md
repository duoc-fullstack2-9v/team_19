# team_19
=======
# team_19

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Cambios recientes (extraídos a CSS y refactorizaciones)

Resumen en español de los cambios realizados:

- Se identificaron y eliminaron estilos inline en varios componentes del proyecto para mejorar la mantenibilidad.
- Se crearon nuevos archivos de estilos en `src/components/styles/`:
	- `Body.css` — estilos para la lista del carrito, botones y layout del popup de pago.
	- `Nav.css` — estilos para la cabecera de navegación, buscador y acciones (login/registro).
	- `App.css` — estilos globales de layout (contenedor principal y padding).
- Se actualizaron y ampliaron estilos existentes en `Admin.css` (añadidas utilidades .ml-8, .mt-8, .admin-left, etc.) y se movieron estilos inline de `Admin.jsx` a esas clases.
- Componentes modificados para importar y usar las nuevas clases CSS:
	- `src/components/layout/Body.jsx` (carrito, popups, botones): reemplazados múltiples estilos inline por clases en `Body.css`.
	- `src/components/layout/Nav.jsx` (cabecera y popups de login/registro): reemplazados estilos inline por clases en `Nav.css`.
	- `src/App.jsx`: movido el layout inline a `App.css` y uso de clases.
	- `src/components/pages/Admin.jsx`: eliminadas la mayoría de las reglas inline y uso de utilidades definidas en `Admin.css`.
- Se añadieron utilidades CSS para botones y márgenes reutilizables (.btn, .btn-primary, .mt-8, .ml-8, etc.).
- Se mantuvo la compatibilidad con los popups (clases `popup-overlay` y `popup-content`) para no romper la apariencia existente.

Impacto:

- La separación de estilos facilita futuras modificaciones visuales y pruebas.
- Las pruebas unitarias (Vitest) se ejecutaron luego de los cambios y pasaron correctamente.

Si quieres, puedo consolidar además los estilos de los popups en un archivo compartido (`popups.css`) y mover utilidades comunes a `utils.css`.


Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# team_19
>>>>>>> f42ec026d4023b4d4903a25ca8e97c253ad9e824
