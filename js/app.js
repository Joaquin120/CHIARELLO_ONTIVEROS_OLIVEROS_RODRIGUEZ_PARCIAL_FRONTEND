// ==========================================
// 1. ESTADO Y DATOS INICIALES (Cristian)
// ==========================================
const estado = {
  editoriales: [
    { id: 1, nombre: "Planeta" },
    { id: 2, nombre: "Editorial Sudamericana" }
  ],
  generos: [
    { id: 1, nombre: "Fantasía" },
    { id: 2, nombre: "Policial" },
    { id: 3, nombre: "Ciencia" },
    { id: 4, nombre: "Informática" },
    { id: 5, nombre: "Poesía" }
  ],
  autores: [
    { id: 1, nombre: "Ana Gómez" },
    { id: 2, nombre: "Carlos Ruiz" },
    { id: 3, nombre: "María López" }
  ],
  libros: [
    {
      id: 1,
      titulo: "El umbral de la tormenta",
      isbn: "978-84-01-00011-1",
      precio: 2500.00,
      editorialId: 1,
      generoId: 1,
      autoresIds: [1]
    },
    {
      id: 2,
      titulo: "Crónica del fuego",
      isbn: "978-987-566-001-7",
      precio: 1500.00,
      editorialId: 2,
      generoId: null,
      autoresIds: [2]
    },
    {
      id: 3,
      titulo: "Sombras de Buenos Aires",
      isbn: "978-987-1234-56-7",
      precio: 2000.00,
      editorialId: 1,
      generoId: 2,
      autoresIds: [1, 2]
    },
    {
      id: 4,
      titulo: "Introducción a la lógica",
      isbn: "978-84-415-3001-4",
      precio: 3200.50,
      editorialId: 2,
      generoId: 3,
      autoresIds: [3]
    },
    {
      id: 5,
      titulo: "Algoritmos y estructuras de datos",
      isbn: "978-950-07-2001-3",
      precio: 4500.00,
      editorialId: 1,
      generoId: 4,
      autoresIds: [3, 2]
    },
    {
      id: 6,
      titulo: "Versos de la tarde",
      isbn: "978-987-738-201-8",
      precio: 890.00,
      editorialId: 2,
      generoId: 5,
      autoresIds: [1]
    }
  ]
};

// ==========================================
// 2. FUNCIONES AUXILIARES PARA RESOLVER NOMBRES
// ==========================================
function obtenerNombreEditorial(editorialId) {
  const ed = estado.editoriales.find(e => e.id === Number(editorialId));
  return ed ? ed.nombre : "Desconocida";
}

function obtenerNombreGenero(generoId) {
  if (!generoId) return "«Sin clasificar»";
  const gen = estado.generos.find(g => g.id === Number(generoId));
  return gen ? gen.nombre : "«Sin clasificar»";
}

function obtenerNombresAutores(autoresIdsArray) {
  if (!autoresIdsArray || autoresIdsArray.length === 0) return "Desconocido";
  return autoresIdsArray
    .map(id => {
      const aut = estado.autores.find(a => a.id === Number(id));
      return aut ? aut.nombre : "";
    })
    .filter(Boolean)
    .join(", ");
}

// ==========================================
// 3. RENDERIZADO DEL CATÁLOGO Y TABLA (Ejercicio 3)
// ==========================================
function renderizarCatalogo(filtroTexto = "") {
  const listaCatalogo = document.getElementById("catalogo-lista");
  const msgSinResultados = document.getElementById("catalogo-sin-resultados");
  const msgVacio = document.getElementById("catalogo-vacio");
  const feedbackMsg = document.getElementById("feedback-catalogo");

  if (!listaCatalogo) return;

  const textoLimpio = filtroTexto.trim().toLowerCase();

  if (estado.libros.length === 0) {
    listaCatalogo.innerHTML = "";
    if (msgVacio) msgVacio.hidden = false;
    if (msgSinResultados) msgSinResultados.hidden = true;
    return;
  }

  if (msgVacio) msgVacio.hidden = true;

  const librosFiltrados = estado.libros.filter(libro => 
    libro.titulo.toLowerCase().includes(textoLimpio)
  );

  if (librosFiltrados.length === 0) {
    listaCatalogo.innerHTML = "";
    if (msgSinResultados) msgSinResultados.hidden = false;
    if (feedbackMsg) feedbackMsg.textContent = `No se encontraron resultados para "${filtroTexto}"`;
    return;
  }

  if (msgSinResultados) msgSinResultados.hidden = true;
  if (feedbackMsg) feedbackMsg.textContent = filtroTexto ? `Mostrando ${librosFiltrados.length} resultado(s)` : "";

  listaCatalogo.innerHTML = librosFiltrados.map(libro => `
    <article class="tarjeta-libro" data-libro-id="${libro.id}">
      <h3>${libro.titulo}</h3>
      <p><strong>ISBN:</strong> ${libro.isbn}</p>
      <p><strong>Editorial:</strong> ${obtenerNombreEditorial(libro.editorialId)}</p>
      <p><strong>Género:</strong> ${obtenerNombreGenero(libro.generoId)}</p>
      <p><strong>Autores:</strong> ${obtenerNombresAutores(libro.autoresIds)}</p>
      <p><strong>Precio:</strong> $${libro.precio.toFixed(2)}</p>
    </article>
  `).join("");
}

function renderizarTablaLibros() {
  const tbodyLibros = document.querySelector("#tabla-libros tbody");
  const msgTablaVacio = document.getElementById("libros-vacio");

  if (!tbodyLibros) return;

  if (estado.libros.length === 0) {
    tbodyLibros.innerHTML = "";
    if (msgTablaVacio) msgTablaVacio.hidden = false;
    return;
  }

  if (msgTablaVacio) msgTablaVacio.hidden = true;

  tbodyLibros.innerHTML = estado.libros.map(libro => `
    <tr data-libro-id="${libro.id}">
      <th scope="row">${libro.titulo}</th>
      <td>${libro.isbn}</td>
      <td>${obtenerNombreEditorial(libro.editorialId)}</td>
      <td>${obtenerNombreGenero(libro.generoId)}</td>
      <td>${obtenerNombresAutores(libro.autoresIds)}</td>
      <td class="precio">$${libro.precio.toFixed(2)}</td>
    </tr>
  `).join("");
}

// Buscador por título en tiempo real
const inputBuscador = document.getElementById("catalogo-busqueda");
if (inputBuscador) {
  inputBuscador.addEventListener("input", (e) => {
    renderizarCatalogo(e.target.value);
  });
}

const formBuscar = document.getElementById("form-buscar-catalogo");
if (formBuscar) {
  formBuscar.addEventListener("submit", (e) => {
    e.preventDefault();
    renderizarCatalogo(inputBuscador ? inputBuscador.value : "");
  });
}

// ==========================================
// 4. SELECTORES DINÁMICOS Y ALTA DE LIBROS (Ejercicio 4A)
// ==========================================
function cargarSelectsFormularioLibro() {
  const selectEditorial = document.getElementById("libro-editorial");
  const selectGenero = document.getElementById("libro-genero");
  const selectAutores = document.getElementById("libro-autores");

  if (selectEditorial) {
    selectEditorial.innerHTML = '<option value="">Seleccione una editorial</option>' + 
      estado.editoriales.map(e => `<option value="${e.id}">${e.nombre}</option>`).join("");
  }

  if (selectGenero) {
    selectGenero.innerHTML = '<option value="" selected>«Sin clasificar»</option>' + 
      estado.generos.map(g => `<option value="${g.id}">${g.nombre}</option>`).join("");
  }

  if (selectAutores) {
    selectAutores.innerHTML = estado.autores
      .map(a => `<option value="${a.id}">${a.nombre}</option>`).join("");
  }
}

const formAltaLibro = document.getElementById("form-alta-libro");
if (formAltaLibro) {
  formAltaLibro.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputTitulo = document.getElementById("libro-titulo").value.trim();
    const inputIsbn = document.getElementById("libro-isbn").value.trim();
    const inputPrecio = parseFloat(document.getElementById("libro-precio").value);
    const selectEditorialVal = document.getElementById("libro-editorial").value;
    const selectGeneroVal = document.getElementById("libro-genero").value;
    const selectAutoresElem = document.getElementById("libro-autores");
    const feedbackLibros = document.getElementById("feedback-libros");
    
    const autoresSeleccionados = Array.from(selectAutoresElem.selectedOptions).map(opt => Number(opt.value));

    let errores = [];

    if (!inputTitulo) {
      errores.push("El título no puede estar vacío.");
    }

    if (!inputIsbn) {
      errores.push("El ISBN es obligatorio.");
    } else {
      // Normalizamos comparación de ISBN quitando guiones y espacios
      const isbnLimpio = inputIsbn.replace(/[-\s]/g, "");
      const isbnExiste = estado.libros.some(l => l.isbn.replace(/[-\s]/g, "") === isbnLimpio);
      if (isbnExiste) {
        errores.push("El ISBN ingresado ya pertenece a otro libro registrado.");
      }
    }

    if (isNaN(inputPrecio) || inputPrecio <= 0) {
      errores.push("El precio debe ser un número mayor a cero.");
    }

    if (!selectEditorialVal) {
      errores.push("Debe seleccionar una editorial existente.");
    }

    if (autoresSeleccionados.length === 0) {
      errores.push("Debe seleccionar al menos un autor.");
    }

    if (errores.length > 0) {
      if (feedbackLibros) {
        feedbackLibros.style.color = "red";
        feedbackLibros.textContent = errores.join(" ");
      } else {
        alert(errores.join("\n"));
      }
      return;
    }

    const nuevoLibro = {
      id: estado.libros.length > 0 ? Math.max(...estado.libros.map(l => l.id)) + 1 : 1,
      titulo: inputTitulo,
      isbn: inputIsbn,
      precio: inputPrecio,
      editorialId: Number(selectEditorialVal),
      generoId: selectGeneroVal ? Number(selectGeneroVal) : null,
      autoresIds: autoresSeleccionados
    };

    estado.libros.push(nuevoLibro);
    
    if (feedbackLibros) {
      feedbackLibros.style.color = "green";
      feedbackLibros.textContent = "¡Libro registrado con éxito!";
    }

    formAltaLibro.reset();
    renderizarCatalogo();
    renderizarTablaLibros();
  });
}

// Inicialización general al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  renderizarCatalogo();
  renderizarTablaLibros();
  cargarSelectsFormularioLibro();
});
