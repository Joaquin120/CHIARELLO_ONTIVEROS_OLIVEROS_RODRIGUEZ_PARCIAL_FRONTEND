# Reglas Globales del Proyecto: TPI Librería (Programación III - UTN)

## 1. Alcance Técnico y Estructura de Archivos
- **Tecnologías permitidas:** Únicamente HTML5, CSS3 y JavaScript nativos (Vanilla).
- **Prohibiciones globales:** Prohibido usar librerías externas, frameworks (Bootstrap, Tailwind, React, etc.), CDNs, npm o herramientas de compilación.
- **Estructura del proyecto:**
  - `index.html`: Archivo único de entrada con las 5 vistas.
  - `css/styles.css`: Hoja de estilos externa única.
  - `js/app.js`: Lógica en JavaScript nativo.
  - `README.md`: Documentación obligatoria y registro de pruebas manuales.

---

## 2. Reglas para `index.html` (Ejercicio 1 - HTML Semántico)
- **Etiquetas estructurales:** Usar `<header>`, `<nav>`, `<main>` (solo uno por documento), `<section>`, `<article>`, `<aside>`, `<footer>`, `<fieldset>` y `<legend>`. Evitar `<div>` genéricos cuando exista una etiqueta semántica.
- **Jerarquía y texto:** Un único `<h1>` para el título de la librería, `<h2>` para cada vista y `<h3>` para subsecciones. Usar `<strong>`, `<em>`, `<mark>` y `<small>` según su valor semántico.
- **Prohibiciones de HTML:**
  - Prohibido usar `<br>` para generar espacio visual entre bloques.
  - Prohibido usar tablas (`<table>`) para maquetar el diseño (layout).
  - Prohibido hacer listas con guiones manuales; usar siempre `<ul>` o `<ol>` con `<li>`.
  - Prohibido omitir el atributo `alt` en imágenes `<img>`.
- **Formularios y Accesibilidad:**
  - Todo `<input>`, `<select>` o `<textarea>` debe tener su `<label for="...">` coincidiendo con su `id`.
  - Todo `<form>` debe tener atributos `action` y `method`.
  - Botones con `<button type="submit">` o `type="button"` y texto descriptivo de su acción.
- **Tablas:** Estructura completa obligatoria con `<table>`, `<thead>`, `<tbody>` (y `<tfoot>` para totales), usando `<th>` y `<td>`.
- **Vistas obligatorias (5 secciones navegables):**
  1. **Catálogo:** Buscador por título y listado de libros (título, ISBN, editorial, género —mostrar `«Sin clasificar»` si no tiene—, autores y precio).
  2. **Libros:** Formulario de alta (título, ISBN, precio, select editorial, select género con opción `«Sin clasificar»`, select múltiple autores) y tabla de libros.
  3. **Clientes:** Formulario de alta (nombre completo en un solo campo y email) y tabla de clientes.
  4. **Ventas:** Selección de cliente, carga de renglones (libro y cantidad entera > 0), tabla de renglones actuales (libro, cantidad, precio unitario, subtotal, quitar) y total general.
  5. **Historial:** Tabla de ventas confirmadas (ID, fecha, cliente, total) y vista de detalle de sus renglones.
- **Estados:** Incluir contenedores para mensajes de listas vacías, búsquedas sin resultados y errores/éxitos de formularios.

---

## 3. Reglas para `css/styles.css` (Ejercicio 2 - Presentación y Adaptabilidad)
- **Organización:** Mantener todo el CSS en archivo externo (`css/styles.css`), definir identidad visual coherente y reutilizar clases para tarjetas, tablas, formularios y botones.
- **Layout:** Utilizar CSS **Flexbox** o **Grid** para maquetar el contenido.
- **Diseño Responsivo:** Debe verse correctamente y sin scroll horizontal de la página tanto en **320px** como en **1280px** de ancho.
- **Tablas adaptables:** Si una tabla excede el ancho en pantallas chicas, debe desplazarse horizontalmente dentro de su propio contenedor (`overflow-x: auto`), sin desbordar toda la página.
- **Accesibilidad visual:** Conservar foco visible (`:focus-visible`) para navegación con teclado. Los mensajes de error no deben depender solo del color (acompañar con texto claro, bordes o íconos textuales).

---

## 4. Reglas para `js/app.js` (Ejercicios 3, 4, 5 y 6 - Lógica y Persistencia)
- **Seguridad en el DOM:** Insertar datos ingresados por el usuario como texto seguro (`textContent`), evitando inyectar HTML crudo con `innerHTML`.
- **Datos iniciales (Ejercicio 3):** Representar mediante arrays y objetos con IDs estables al menos: 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios.
- **Filtro de catálogo (Ejercicio 3):** Ignorar mayúsculas/minúsculas (`toLowerCase()`), buscar coincidencias parciales (`includes()`) y limpiar espacios exteriores (`trim()`). Búsqueda vacía muestra todo; sin coincidencias muestra mensaje claro.
- **Altas y Validaciones (Ejercicio 4):**
  - Controlar el envío de formularios con `event.preventDefault()`.
  - **Alta de Libro:** Validar título e ISBN no vacíos, ISBN único en el conjunto local (comparado sin espacios ni guiones), precio numérico > 0, editorial existente, al menos un autor existente y género opcional (`«Sin clasificar»` o existente).
  - **Alta de Cliente:** Validar nombre completo y email no vacíos, formato de email válido y email único (comparado con `trim()` y sin distinguir mayúsculas/minúsculas).
  - Actualizar listados y selectores (`<select>`) dinámicamente sin recargar la página.
- **Ventas e Historial Inmutable (Ejercicio 5):**
  - Validar cliente seleccionado y al menos un renglón con cantidad entera > 0.
  - No permitir filas con libros repetidos en la misma venta (sumar/modificar cantidad del renglón existente o informar duplicado).
  - Formatear todos los importes (precio unitario, subtotales y total) con **2 decimales** (`toFixed(2)`).
  - **Precio Histórico Crítico:** Al confirmar la venta, copiar el precio unitario actual del libro dentro del renglón de la venta guardada. Al consultar el historial, usar siempre ese valor histórico guardado y NUNCA volver a leer el precio actual del catálogo.
- **Persistencia en `localStorage` (Ejercicio 6):**
  - Guardar libros, clientes y ventas en `localStorage`.
  - En el primer inicio cargar el lote de datos de ejemplo; en recargas posteriores recuperar desde `localStorage` sin duplicar los datos iniciales.

---

## 5. Reglas para `README.md` (Ejercicio 6 - Documentación)
- Incluir integrantes, instrucciones para abrir `index.html` sin npm, explicación de navegación, estado de funcionalidades, ubicación de datos iniciales y explicación de límites de `localStorage`.
- Documentar la estructura de claves de `localStorage` para que el docente pueda realizar la prueba guiada de cambio de precio en el catálogo y verificar que el historial conserva el precio histórico.
- Incluir la tabla de los 8 casos de prueba manuales exigidos por la cátedra.