# Librería El Estante — TPI Frontend

**Trabajo Práctico Integrador · Programación III · UTN — Tecnicatura Universitaria en Programación a Distancia**

Sistema de catálogo de librería con alta de libros y clientes, armado de ventas, e historial con **precio histórico inmutable**. Construido con **HTML5 semántico, CSS3 y JavaScript nativo (Vanilla)**: sin frameworks, sin librerías externas, sin CDNs, sin npm ni herramientas de compilación.

---

## Índice

1. [Descripción del proyecto](#1-descripción-del-proyecto)
2. [Integrantes y distribución de responsabilidades](#2-integrantes-y-distribución-de-responsabilidades)
3. [Instrucciones de ejecución (sin npm ni servidor)](#3-instrucciones-de-ejecución-sin-npm-ni-servidor)
4. [Arquitectura y navegación entre vistas](#4-arquitectura-y-navegación-entre-vistas)
5. [Estado de avance (Etapa 1 vs. Etapa 2)](#5-estado-de-avance-etapa-1-vs-etapa-2)
6. [Datos iniciales y funcionamiento de `localStorage`](#6-datos-iniciales-y-funcionamiento-de-localstorage)
7. [Registro de casos de prueba manuales (Ejercicio 6)](#7-registro-de-casos-de-prueba-manuales-ejercicio-6)
8. [Procedencia de recursos](#8-procedencia-de-recursos)

---

## 1. Descripción del proyecto

La **Librería El Estante** es una aplicación web de una sola página (SPA liviana, sin router) que cubre las cinco funcionalidades del TPI:

1. **Catálogo** de libros con búsqueda por título.
2. **Gestión de libros** (alta con editorial, género y autores).
3. **Gestión de clientes** (alta con nombre completo y email).
4. **Armado de ventas** por renglones (libro + cantidad) con total general.
5. **Historial de ventas** con detalle de renglones que conserva el precio al momento de la confirmación.

**Stack tecnológico (obligatorio y verificado):**

| Capa | Tecnología | Restricción cumplida |
|------|-----------|----------------------|
| Estructura | HTML5 semántico | Sin tablas de layout, sin `<br>` para espaciado, sin divs genéricos donde existe etiqueta semántica |
| Presentación | CSS3 externo (`css/styles.css`) | Flexbox / Grid, responsive 320px–1280px |
| Lógica | JavaScript nativo (`js/app.js`) | Sin frameworks, sin librerías, sin CDNs, sin paso de build |

---

## 2. Integrantes y distribución de responsabilidades

| Integrante | Responsabilidad | Archivos |
|------------|----------------|----------|
| **Joaquín** | Estructura HTML semántica, vistas, formularios, tablas y estados de maqueta; documentación inicial | `index.html`, `README.md` |
| **Santiago** | Diseño visual, maquetación con Flexbox/Grid, adaptabilidad (320px y 1280px), accesibilidad y pruebas de interfaz | `css/styles.css` |
| **Cristian** | Modelo de datos locales, renderizado dinámico del catálogo, filtro de búsqueda por título y lógica de alta de libros | `js/app.js` |
| **Joseph** | Alta de clientes, simulación de ventas, historial inmutable con precio histórico, persistencia en `localStorage` y ejecución de casos de prueba | `js/app.js` |

---

## 3. Instrucciones de ejecución (sin npm ni servidor)

El proyecto **no requiere instalar nada**: no hay `package.json`, no hay `node_modules`, no hay servidor de desarrollo ni paso de compilación. Es HTML, CSS y JavaScript estático.

**Paso a paso:**

1. **Obtener el proyecto:**
   - *Opción A (Git):* clonar el repositorio:
     ```bash
     git clone <URL del repositorio>
     ```
   - *Opción B (ZIP):* descargar el ZIP desde la plataforma y descomprimirlo en cualquier carpeta.
2. **Abrir la carpeta** del proyecto: debe contener `index.html`, `css/`, `js/`, `README.md`.
3. **Ejecutar la aplicación:** hacer **doble clic sobre `index.html`**. Se abrirá directamente en el navegador web predeterminado. También se puede arrastrar el archivo a la ventana del navegador o escribir en la barra de direcciones:
   ```
   file:///ruta/completa/al/proyecto/index.html
   ```
4. **Listo:** las cinco vistas son navegables desde el menú superior (Catálogo, Libros, Clientes, Ventas, Historial).

**Navegadores compatiles:** Chrome, Firefox, Edge o Safari en sus versiones actuales. No se usa ninguna API exótica: solo DOM, eventos, `localStorage` y `Intl`/`toFixed()` para formato numérico.

> **Importante para las pruebas:** abrir el proyecto siempre **desde la misma ruta y el mismo navegador**. `localStorage` está atado al origen del archivo (ver sección 6); cambiar de carpeta o de navegador muestra datos distintos.

---

## 4. Arquitectura y navegación entre vistas

### 4.1 Estructura del proyecto

```
CHIARELLO_ONTIVEROS_OLIVEROS_RODRIGUEZ_PARCIAL_FRONTEND/
├── index.html      # Ejercicio 1: maqueta semántica con las 5 vistas  ✅ Etapa 1
├── css/
│   └── styles.css  # Ejercicio 2: estilos, Flexbox/Grid, responsive   🔧 Etapa 2 (Santiago)
├── js/
│   └── app.js      # Ejercicios 3-6: datos, filtros, altas, ventas,
│                   # historial inmutable y localStorage              🔧 Etapa 2 (Cristian y Joseph)
├── README.md       # Ejercicio 6: documentación y casos de prueba     ✅ Etapa 1 (estructura completa)
└── AGENTS.md       # Reglas duras del proyecto (referencia interna del equipo)
```

> `index.html` ya referencia `css/styles.css` y `js/app.js` con `<link>` y `<script defer>`. Mientras esos archivos no existan, el navegador muestra 404 inofensivos y la maqueta se ve sin estilos: es el estado esperado de la Etapa 1.

### 4.2 Esqueleto global

| Elemento | Selector | Función |
|----------|----------|---------|
| Enlace de salto | `a.enlace-saltar` | Accesibilidad: primer tabulador lleva al contenido |
| Cabecera | `header.encabezado-sitio` | Contiene el único `<h1>` y la navegación |
| Menú | `nav > ul.menu-principal` | 5 enlaces-ancla (`href="#vista-..."`); el activo lleva `aria-current="page"` |
| Contenido | `main#contenido-principal` | Único `<main>`; contiene las 5 secciones-vista |
| Pie | `footer.pie-sitio` > `ul.integrantes` | Créditos del equipo |

### 4.3 Vista 1 — Catálogo (`#vista-catalogo`)

Buscador por título y listado de libros en tarjetas.

| Elemento | Selector / ID | Clase | Notas |
|----------|--------------|-------|-------|
| Formulario de búsqueda | `#form-buscar-catalogo` | — | `role="search"`, `action="#"`, `method="get"` |
| Campo de búsqueda | `#catalogo-busqueda` | — | `input type="search"`, con `<label>` asociado |
| Mensaje de la búsqueda | `#feedback-catalogo` | `.mensaje` | `role="status" aria-live="polite"` |
| Contenedor del listado | `#catalogo-lista` | `.listado-tarjetas` | Los hijos los renderiza JS |
| Estado: catálogo vacío | `#catalogo-vacio` | `.estado-vacio` | `hidden` por defecto |
| Estado: sin resultados | `#catalogo-sin-resultados` | `.estado-vacio` | `hidden` por defecto |
| Tarjeta de libro | `article.tarjeta-libro` | — | Atributo **`data-libro-id`** como clave de enlace con el modelo |
| Complemento | `aside.informacion-catalogo` | — | Reglas de lectura del catálogo |

*Regla de negocio asociada (Cristian):* la búsqueda ignora mayúsculas/minúsculas (`toLowerCase()`), busca coincidencias parciales (`includes()`) y limpia espacios exteriores (`trim()`).

### 4.4 Vista 2 — Libros (`#vista-libros`)

| Elemento | Selector / ID | Clase | Notas |
|----------|--------------|-------|-------|
| Formulario de alta | `#form-alta-libro` | — | `action="#"`, `method="post"` |
| Título | `#libro-titulo` | — | `required` |
| ISBN | `#libro-isbn` | — | `required`; debe validarse único (sin espacios ni guiones) |
| Precio | `#libro-precio` | — | `type="number"`, `min="0.01"`, `step="0.01"` |
| Editorial | `#libro-editorial` | — | `<select>` con opción vacía placeholder + editoriales (Cristian lo poblará desde el modelo) |
| Género | `#libro-genero` | — | `<select>` **opcional**: la opción **`«Sin clasificar»`** está seleccionada por defecto (`value=""`) |
| Autores | `#libro-autores` | — | `<select multiple required>` con ayuda `#ayuda-libro-autores`; debe elegirse al menos uno |
| Mensaje de validación/operación | `#feedback-libros` | `.mensaje` | `role="alert"` (alta correcta, ISBN duplicado, datos inválidos) |
| Estado: lista vacía | `#libros-vacio` | `.estado-vacio` | `hidden` por defecto |
| Tabla de libros | `#tabla-libros` | — | Columnas: Título, ISBN, Editorial, Género, Autores, Precio |
| Fila de libro | `tr[data-libro-id]` | — | Título como `<th scope="row">`; precios en `td.precio` |

### 4.5 Vista 3 — Clientes (`#vista-clientes`)

| Elemento | Selector / ID | Clase | Notas |
|----------|--------------|-------|-------|
| Formulario de alta | `#form-alta-cliente` | — | `action="#"`, `method="post"` |
| Nombre completo | `#cliente-nombre` | — | **Un único campo** (sin separar apellido), `required` |
| Email | `#cliente-email` | — | `type="email"`, `required`; debe validarse único (sin distinguir mayúsculas) |
| Mensaje de validación/operación | `#feedback-clientes` | `.mensaje` | `role="alert"` |
| Estado: lista vacía | `#clientes-vacio` | `.estado-vacio` | `hidden` por defecto |
| Tabla de clientes | `#tabla-clientes` | — | Columnas: Nombre completo, Email |
| Fila de cliente | `tr[data-cliente-id]` | — | Nombre como `<th scope="row">` |

### 4.6 Vista 4 — Ventas (`#vista-ventas`)

| Elemento | Selector / ID | Clase | Notas |
|----------|--------------|-------|-------|
| Formulario de venta | `#form-armar-venta` | — | `action="#"`, `method="post"`; agrupa dos `<fieldset>` |
| Cliente | `#venta-cliente` | — | `<select>` con el placeholder "Seleccione un cliente" |
| Libro del renglón | `#venta-libro` | — | `<select>` con título y precio actual de cada libro |
| Cantidad | `#venta-cantidad` | — | `type="number"`, `min="1"`, `step="1"` (entera mayor a cero) |
| Agregar renglón | `#btn-agregar-renglon` | — | `type="button"` (no envía el formulario) |
| Confirmar venta | `#btn-confirmar-venta` | — | `type="submit"` |
| Mensaje de validación/operación | `#feedback-ventas` | `.mensaje` | `role="alert"` (cliente faltante, libro repetido, venta confirmada) |
| Estado: sin renglones | `#venta-sin-renglones` | `.estado-vacio` | `hidden` por defecto |
| Tabla de renglones | `#tabla-renglones` | — | Columnas: Libro, Cantidad, Precio unitario, Subtotal, Acción |
| Fila de renglón | `tr[data-renglon-id]` | — | Clave del libro en el botón quitar: `button.btn-quitar[data-libro-id]` |
| Total general | `#venta-total` | `.precio` | Dentro de `<tfoot>` |
| Complemento | `aside.informacion-ventas` | — | Reglas de la venta (cliente obligatorio, sin repetidos, precio copiado) |

*Reglas de negocio asociadas (Joseph):* no se permite un libro repetido dentro de la misma venta (informar o sumar cantidad en el renglón existente); al confirmar se **copia** el precio unitario vigente dentro del renglón guardado; todos los importes se formatean con 2 decimales (`toFixed(2)`).

### 4.7 Vista 5 — Historial (`#vista-historial`)

| Elemento | Selector / ID | Clase | Notas |
|----------|--------------|-------|-------|
| Estado: sin ventas | `#historial-vacio` | `.estado-vacio` | `hidden` por defecto |
| Tabla de ventas | `#tabla-historial` | — | Columnas: ID, Fecha (`<time datetime>`), Cliente, Total |
| Fila de venta | `tr[data-venta-id]` | — | El ID de la venta (`th scope="row"`) es el ancla para abrir el detalle |
| Sección de detalle | `#historial-detalle` | `.tabla-contenedor` | Visible por defecto en la maqueta; JS lo actualizará según la venta seleccionada |
| Estado: sin selección | `#historial-detalle-vacio` | `.estado-vacio` | `hidden` por defecto |
| Datos de la venta | `dl.datos-venta` | — | Cliente y Fecha como `<dt>`/`<dd>` |
| Tabla de renglones del detalle | `#tabla-historial-detalle` | — | Columnas: Libro, Cantidad, **Precio unitario histórico**, Subtotal |
| Total del detalle | `#historial-total` | `.precio` | Dentro de `<tfoot>` |
| Mensaje del historial | `#feedback-historial` | `.mensaje` | `role="status" aria-live="polite"` |

*Regla crítica asociada (Joseph):* el detalle del historial **lee siempre el precio guardado en la venta** y **nunca** el precio actual del catálogo.

### 4.8 Catálogo de clases CSS disponibles (para Santiago)

`.vista`, `.mensaje`, `.estado-vacio`, `.tabla-contenedor`, `.precio`, `.ayuda`, `.listado-tarjetas`, `.tarjeta-libro`, `.etiqueta`, `.informacion-catalogo`, `.informacion-ventas`, `.btn-quitar`, `.datos-venta`, `.enlace-saltar`, `.encabezado-sitio`, `.menu-principal`, `.pie-sitio`, `.integrantes`.

- `.tabla-contenedor` es el **envoltorio de scroll**: las 5 tablas deben moverse horizontalmente dentro de este contenedor (`overflow-x: auto`) para no desbordar la página a 320px.
- `.mensaje` y `.estado-vacio` son los contenedores de feedback: los errores no deben depender solo del color (acompañar texto, borde o ícono textual).
- Los importes usan la clase `.precio` para alineación numérica y formato con dos decimales.

---

## 5. Estado de avance (Etapa 1 vs. Etapa 2)

### ✅ Etapa 1 — Completada: maqueta estática (`index.html`)

Las **cinco vistas están navegables** con sus formularios, tablas, estados vacíos y mensajes ya posicionados con datos de ejemplo escritos directamente en el HTML (6 libros, 3 clientes, 2 renglones de venta y 3 ventas en el historial). El HTML es la **maqueta canónica**: define IDs, clases y estructura sobre los que trabajan el CSS y el JS.

### 🔧 Etapa 2 — En desarrollo: comportamiento dinámico

| Módulo | Responsable | Pendiente |
|--------|-------------|-----------|
| Estilos y responsive | Santiago | `css/styles.css`: identidad visual, Flexbox/Grid, 320px–1280px, foco visible, `.tabla-contenedor` con scroll propio |
| Datos y catálogo | Cristian | `js/app.js`: modelo con IDs estables, render dinámico de `#catalogo-lista`, filtro por título, alta de libros con validación de ISBN único |
| Clientes, ventas e historial | Joseph | `js/app.js`: alta de clientes con email único, armado de renglones sin repetidos, confirmación con precio copiado, historial inmutable, persistencia en `localStorage` |
| Casos de prueba | Joseph | Ejecutar y completar la tabla de la sección 7 |

**Pendiente explícito sobre la maqueta:** al activar el JS, los datos de ejemplo del HTML (tarjetas, filas de tablas, `<option>` de los selects y renglones/ventas precargados) deben ser **regenerados desde el modelo** para que catálogo, selects y listados queden sincronizados entre sí y con el `localStorage`.

---

## 6. Datos iniciales y funcionamiento de `localStorage`

### 6.1 Dónde están los datos iniciales

El lote de datos de ejemplo se define **dentro de `js/app.js`** como constantes arrays de objetos con **IDs estables** (los mismos `data-libro-id`, `data-cliente-id` que ya usa la maqueta):

- **6 libros** (incluye uno sin género → «Sin clasificar» y uno con dos autores → relación N a M),
- **2 editoriales**, **2 o más géneros**, **3 autores**, **3 clientes**.

En el **primer inicio** de la aplicación, si `localStorage` está vacío, se copia este lote al almacenamiento. En **recargas posteriores** se recuperan los datos desde `localStorage` y el lote de ejemplo **no se vuelve a insertar** (se usa una clave-bandera de semilla), de modo que nunca se duplican libros, clientes ni ventas.

### 6.2 Claves de `localStorage` (contrato del equipo)

| Clave | Contenido | Responsable |
|-------|-----------|-------------|
| `libreria-eltante-libros` | JSON: array de libros (incluye `precio` actual vigente) | Cristian |
| `libreria-eltante-clientes` | JSON: array de clientes | Joseph |
| `libreria-eltante-ventas` | JSON: array de ventas confirmadas, cada una con sus renglones y su **precio unitario copiado al confirmar** | Joseph |
| `libreria-eltante-semilla` | Bandera de versión para no duplicar los datos iniciales en recargas | Cristian / Joseph |

### 6.3 Límites y advertencias de `localStorage`

`localStorage` **no es una base de datos**: es un almacenamiento clave-valor del navegador con alcance muy limitado. Esto implica que:

- **Depende del navegador:** Chrome, Firefox y Edge guardan información **separada**. Un libro dado de alta en Chrome **no aparece** en Firefox.
- **Depende del perfil de usuario:** el modo incógnito/privado **borra todo al cerrarse**. Dos perfiles del mismo navegador no comparten datos.
- **Depende de la ruta de apertura:** el almacenamiento se indexa por origen. Al abrir vía `file://`, mover el proyecto a otra carpeta (o abrirlo desde otro equipo/USB) puede mostrar un conjunto de datos vacío o distinto, aunque el navegador sea el mismo.
- **No comparte información** entre navegadores, dispositivos ni usuarios: cada quien ve únicamente sus propios datos locales.
- **Cuota limitada:** del orden de ~5 MB por origen; es un espacio de sobra para este TPI (datos de texto pequeños), pero no sirve para volúmenes reales.
- **Es editable y borrable por el usuario:** desde las DevTools, o por código con `localStorage.removeItem(clave)` / `localStorage.clear()`.
- **Debe degradar con gracia:** si un navegador restringe `localStorage` en `file://`, la aplicación tiene que seguir funcionando en memoria (perdiendo la persistencia entre recargas).

---

### 6.4 Guía para la comprobación de precio histórico en `localStorage`

Esta prueba demuestra la **inmutabilidad del historial**: cambiar el precio de un libro en el catálogo **no debe alterar** las ventas ya confirmadas. Se recomienda realizarla **en una copia de prueba del proyecto** (duplicar la carpeta y abrir la copia) para no ensuciar la entrega.

**Preparación (una sola vez):**

1. Abrir el proyecto y, en **Ventas**, confirmar una venta de prueba: *Crónica del fuego* × 2 (a $1500.00) y *Sombras de Buenos Aires* × 1 (a $2000.00). Debe dar **total $5000.00**.
2. Ir a **Historial**, abrir el detalle de esa venta y anotar: precio unitario $1500.00, subtotales $3000.00 y $2000.00, total $5000.00.

**Pasos de la comprobación:**

1. Abrir las herramientas de desarrollo del navegador: tecla **F12**.
2. Ir a la pestaña **Application** (Chrome / Edge) o **Almacenamiento** (Firefox).
3. En el panel izquierdo, expandir **Local Storage** y seleccionar el origen del proyecto (`file://...`).
4. Buscar la clave **`libreria-eltante-libros`**, localizar el objeto del libro vendido (*Crónica del fuego*) y **editar el valor de `precio`** de `1500` a `9999`. Confirmar con **Enter**.
5. **Recargar la página** con **F5**.
6. Ir a **Historial** y abrir nuevamente el detalle de la misma venta.

**Resultado esperado (inmutabilidad correcta):**

| Campo | Valor esperado | Indica bug si aparece |
|-------|----------------|-----------------------|
| Precio unitario de *Crónica del fuego* | $1500.00 | $9999.00 |
| Subtotal del renglón (2 unidades) | $3000.00 | $19998.00 |
| Total de la venta | $5000.00 | $21998.00 |

El catálogo, en cambio, **sí** debe mostrar el nuevo precio ($9999.00): eso confirma que el precio de lista y el precio histórico son valores independientes, y que el historial lee su propio snapshot guardado y no el catálogo actual.

**Restauración:** revertir el `precio` a `1500` en las DevTools (o eliminar la clave `libreria-eltante-libros` y recargar) devuelve el proyecto a su estado inicial.

---

## 7. Registro de casos de prueba manuales (Ejercicio 6)

Ejecución manual sobre `index.html` abierto en navegador. La columna *Resultado Observado* se completa durante la ejecución de la Etapa 2.

| N° | Caso de Prueba | Resultado Esperado | Resultado Observado | Estado |
|----|----------------|--------------------|---------------------|--------|
| 1 | Buscar en el catálogo una parte del título escrita en mayúsculas; luego buscar con el campo vacío; luego buscar un texto inexistente. | Ignora mayúsculas/minúsculas y muestra las coincidencias parciales; la búsqueda vacía muestra el catálogo completo; el texto inexistente muestra el mensaje "sin resultados". | _Pendiente de ejecución_ | Pendiente |
| 2 | Dar de alta un libro con un ISBN que ya existe en el sistema; luego dar de alta un libro con ISBN nuevo. | El duplicado se rechaza con mensaje de error; el ISBN nuevo se registra y el libro aparece en el catálogo y en la selección de libros de la venta. | _Pendiente de ejecución_ | Pendiente |
| 3 | Dar de alta un cliente con email inválido; luego con un email ya registrado pero escrito en mayúsculas; luego con un email nuevo. | Se rechazan los dos primeros (formato inválido y duplicado); el email nuevo se registra y el cliente aparece en el listado y en la selección de clientes de la venta. | _Pendiente de ejecución_ | Pendiente |
| 4 | Intentar confirmar una venta sin cliente, con cantidad cero, negativa o decimal, y agregando dos veces el mismo libro. | Ninguna de esas ventas se confirma (mensaje de error); el libro repetido no crea un segundo renglón. | _Pendiente de ejecución_ | Pendiente |
| 5 | Confirmar una venta válida: 2 unidades de un libro a $1500.00 y 1 unidad de otro a $2000.00. | Subtotales $3000.00 y $2000.00; total general $5000.00; el detalle de la venta queda conservado en el historial. | _Pendiente de ejecución_ | Pendiente |
| 6 | Tras confirmar la venta del caso 5, cambiar **exclusivamente** el precio de catálogo guardado (en `localStorage` o en el código), en una copia de prueba del proyecto; recargar y consultar el historial. | El precio unitario, los subtotales y el total de esa venta **conservan** los valores confirmados; solo cambia el precio del catálogo. | _Pendiente de ejecución_ | Pendiente |
| 7 | Recargar la página después de haber dado de libros/clientes de alta y de haber confirmado una venta. | Se recuperan todos los datos guardados sin duplicar los datos de ejemplo ni las ventas. | _Pendiente de ejecución_ | Pendiente |
| 8 | Navegar por teclado (Tab / Shift+Tab / Enter) y verificar la vista a anchos de 320px y 1280px. | Foco visible en todos los controles, controles utilizables sin scroll horizontal de la página, y las tablas se desplazan horizontalmente dentro de su propio contenedor si lo necesitan. | Foco visible verificado (anillo azul). Interfaz fluida en 320px sin scroll general, con overflow-x activo en tablas. En 1280px grid adaptado y centrado correctamente. Se validó contraste para daltonismo en errores. | **Aprobado** |

**Convenciones de estado:**

- **Pendiente:** caso aún no ejecutado.
- **Aprobado:** resultado observado coincide con el esperado.
- **Fallido:** no coincide; se documenta la diferencia en *Resultado Observado* y se abre el ajuste correspondiente.

### 7.1 Detalle de Pruebas de Diseño y Accesibilidad (Ejecutadas por Santiago Ontivero)

**A. Prueba de Adaptabilidad (Diseño Responsivo)**
*   **Metodología:** Se utilizó el panel de herramientas para desarrolladores (F12) del navegador, activando la vista de dispositivos para simular resoluciones límite.
*   **Resultado en 320px (Móvil):** Se verificó estrictamente la ausencia de scroll horizontal general en la página. Los contenedores de las tablas de datos (`.tabla-contenedor`) activan su propio scroll interno (`overflow-x: auto`), permitiendo visualizar el contenido desbordado sin romper la estructura general del sitio.
*   **Resultado en 1280px (Escritorio):** Se comprobó que el contenedor principal respeta el límite de `max-width: 1280px` y se mantiene centrado en la pantalla, distribuyendo las tarjetas del catálogo de forma fluida mediante CSS Grid.

**B. Prueba de Accesibilidad WAI y Contraste**
*   **Navegación por Teclado:** Se interactuó con la interfaz utilizando únicamente la tecla `TAB`. Al hacer foco en elementos interactivos, se dispara la pseudo-clase `:focus-visible`, generando un contorno sólido de 3px con un color de alto contraste exclusivo para navegación por teclado.
*   **Contraste para Daltonismo:** Se verificó forzando la clase `.error-text` en el inspector. El sistema no depende únicamente del color rojo para transmitir un error, sino que aplica automáticamente texto en negrita, subrayado y un ícono de alerta (⚠).

---

## 8. Procedencia de recursos

Todo el material de este proyecto es **original del equipo**, sin recursos externos:

- **Sin imágenes, íconos ni fuentes ajenas:** el proyecto no incluye ningún `<img>`, no carga tipografías de terceros y no usa iconos de librerías externas; toda la señalización es **texto semántico**.
- **Sin CDNs ni scripts de terceros:** no hay `<script src="https://...">` ni `<link>` a hojas de estilo externas.
- **Sin frameworks ni librerías:** el HTML, el CSS y el JavaScript están escritos a mano por el equipo; no se incorporaron fragmentos de código de terceros sin atribución.
- **Datos ficticios:** los libros, editoriales, géneros, autores, clientes y ventas son inventados con fines académicos; las coincidencias con personas o catálogos reales son casuales.
- **Referencias académicas:** las convenciones de accesibilidad (enlace de salto, `aria-live`, `scope`, `aria-current`) siguen las pautas públicas de WAI/W3C citadas con fines educativos, sin reproducción de material protegido.

Si en una etapa posterior se incorporara cualquier recurso de terceros (una fuente libre, un ícono o un snippet), quedará **detallado y atribuido en esta sección**.
