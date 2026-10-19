// ==========================================
// MÓDULO DE CLIENTES Y VENTAS - TPI UTN
// Autor: Joseph (Rama: feat/joseph-ventas-clientes)
// ==========================================================================

// 1. ESTADO GLOBAL COMPARTIDO
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
    { id: 1, titulo: "El umbral de la tormenta", isbn: "978-84-01-00011-1", precio: 2500.00, editorialId: 1, generoId: 1, autoresIds: [1] },
    { id: 2, titulo: "Crónica del fuego", isbn: "978-987-566-001-7", precio: 1500.00, editorialId: 2, generoId: null, autoresIds: [2] },
    { id: 3, titulo: "Sombras de Buenos Aires", isbn: "978-987-1234-56-7", precio: 2000.00, editorialId: 1, generoId: 2, autoresIds: [1, 2] },
    { id: 4, titulo: "Introducción a la lógica", isbn: "978-84-415-3001-4", precio: 3200.50, editorialId: 2, generoId: 3, autoresIds: [3] },
    { id: 5, titulo: "Algoritmos y estructuras de datos", isbn: "978-950-07-2001-3", precio: 4500.00, editorialId: 1, generoId: 4, autoresIds: [3, 2] },
    { id: 6, titulo: "Versos de la tarde", isbn: "978-987-738-201-8", precio: 890.00, editorialId: 2, generoId: 5, autoresIds: [1] }
  ],
  clientes: [
    { id: 1, nombre: "Camila Fernández", email: "camila.fernandez@correo.com" },
    { id: 2, nombre: "Diego Ramírez", email: "diego.ramirez@correo.com" },
    { id: 3, nombre: "Valentina Sosa", email: "valentina.sosa@correo.com" }
  ],
  renglonesVentaActual: [],
  historialVentas: []
};

// ==========================================================================
// 2. MÓDULO DE PERSISTENCIA (LocalStorage - Ejercicio 6)
// ==========================================================================
const CLAVE_STORAGE = "TPI_LIBRERIA_ESTADO";

function guardarEstadoEnStorage() {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado));
  } catch (error) {
    console.error("Error al guardar en LocalStorage:", error);
  }
}

function cargarEstadoDeStorage() {
  try {
    const estadoGuardado = localStorage.getItem(CLAVE_STORAGE);
    if (estadoGuardado) {
      const datosParseados = JSON.parse(estadoGuardado);
      if (datosParseados.libros) estado.libros = datosParseados.libros;
      if (datosParseados.clientes) estado.clientes = datosParseados.clientes;
      if (datosParseados.historialVentas) estado.historialVentas = datosParseados.historialVentas;
    }
  } catch (error) {
    console.error("Error al cargar desde LocalStorage:", error);
  }
}

// ==========================================================================
// 3. MÓDULO DE CATÁLOGO Y LIBROS (Cristian)
// ==========================================================================
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

// ==========================================================================
// 4. MÓDULO DE CLIENTES (Joseph - Ejercicio 4B)
// ==========================================================================
function registrarCliente(nombre, email) {
  const emailNormalizado = email.trim().toLowerCase();
  const nombreLimpio = nombre.trim();

  if (!nombreLimpio || !emailNormalizado) {
    alert("Por favor, completa todos los campos del cliente.");
    return false;
  }

  const emailExistente = estado.clientes.some(c => c.email.toLowerCase() === emailNormalizado);
  
  if (emailExistente) {
    alert("Error: Ya existe un cliente registrado con ese correo electrónico.");
    return false;
  }

  const nuevoCliente = {
    id: Date.now(),
    nombre: nombreLimpio,
    email: emailNormalizado
  };

  estado.clientes.push(nuevoCliente);
  guardarEstadoEnStorage();

  console.log("Cliente registrado con éxito:", nuevoCliente);
  alert(`¡Cliente ${nombreLimpio} registrado con éxito!`);
  
  actualizarSelectClientesVenta();
  return true;
}

function actualizarSelectClientesVenta() {
  const selectCliente = document.querySelector("#venta-cliente");
  if (!selectCliente) return;

  selectCliente.innerHTML = '<option value="">Seleccione un cliente</option>';
  estado.clientes.forEach(c => {
    selectCliente.innerHTML += `<option value="${c.id}">${c.nombre} — ${c.email}</option>`;
  });
}

function actualizarSelectLibrosVenta() {
  const selectLibro = document.querySelector("#venta-libro");
  if (!selectLibro) return;

  selectLibro.innerHTML = '<option value="">Seleccione un libro</option>';
  estado.libros.forEach(l => {
    selectLibro.innerHTML += `<option value="${l.id}">${l.titulo} — $${l.precio.toFixed(2)}</option>`;
  });
}

// ==========================================================================
// 5. MÓDULO DE VENTAS E HISTORIAL INMUTABLE (Joseph - Ejercicio 5)
// ==========================================================================
function mostrarFeedbackVenta(mensaje, tipo = "error") {
  const pFeedback = document.querySelector("#feedback-ventas");
  if (pFeedback) {
    pFeedback.textContent = mensaje;
    pFeedback.className = `mensaje ${tipo}`;
  }
}

function renderizarRenglones() {
  const tbody = document.querySelector("#tabla-renglones tbody");
  const pSinRenglones = document.querySelector("#venta-sin-renglones");
  const tdTotal = document.querySelector("#venta-total");

  if (!tbody) return;

  tbody.innerHTML = "";

  if (estado.renglonesVentaActual.length === 0) {
    if (pSinRenglones) pSinRenglones.hidden = false;
    if (tdTotal) tdTotal.textContent = "$0.00";
    return;
  }

  if (pSinRenglones) pSinRenglones.hidden = true;

  let totalGeneral = 0;

  estado.renglonesVentaActual.forEach((renglon, index) => {
    const subtotal = renglon.cantidad * renglon.precioUnitario;
    totalGeneral += subtotal;

    const tr = document.createElement("tr");
    tr.setAttribute("data-renglon-id", index + 1);
    tr.innerHTML = `
      <th scope="row">${renglon.titulo}</th>
      <td>${renglon.cantidad}</td>
      <td class="precio">$${renglon.precioUnitario.toFixed(2)}</td>
      <td class="precio">$${subtotal.toFixed(2)}</td>
      <td><button type="button" class="btn-quitar" data-libro-id="${renglon.libroId}" aria-label="Quitar ${renglon.titulo} de la venta">Quitar</button></td>
    `;
    tbody.appendChild(tr);
  });

  if (tdTotal) {
    tdTotal.textContent = `$${totalGeneral.toFixed(2)}`;
  }

  document.querySelectorAll(".btn-quitar").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idLibroQuitar = Number(e.target.getAttribute("data-libro-id"));
      quitarRenglon(idLibroQuitar);
    });
  });
}

function agregarRenglon() {
  const selectLibro = document.querySelector("#venta-libro");
  const inputCantidad = document.querySelector("#venta-cantidad");

  if (!selectLibro || !inputCantidad) return;

  const libroId = Number(selectLibro.value);
  const cantidad = parseInt(inputCantidad.value);

  if (!libroId) {
    mostrarFeedbackVenta("Por favor, seleccione un libro válido.");
    return;
  }

  if (isNaN(cantidad) || cantidad <= 0) {
    mostrarFeedbackVenta("La cantidad debe ser un número entero mayor a cero.");
    return;
  }

  const libroEncontrado = estado.libros.find(l => l.id === libroId);
  if (!libroEncontrado) {
    mostrarFeedbackVenta("El libro seleccionado no existe en el catálogo.");
    return;
  }

  // Validación: No permitir libros repetidos en la venta actual
  const libroRepetido = estado.renglonesVentaActual.find(r => r.libroId === libroId);
  if (libroRepetido) {
    mostrarFeedbackVenta(`El libro "${libroEncontrado.titulo}" ya se encuentra agregado en la venta actual.`);
    return;
  }

  // Agregar renglón con copia del precio unitario histórico
  estado.renglonesVentaActual.push({
    libroId: libroEncontrado.id,
    titulo: libroEncontrado.titulo,
    precioUnitario: libroEncontrado.precio,
    cantidad: cantidad
  });

  mostrarFeedbackVenta("Renglón agregado con éxito.", "exito");
  selectLibro.value = "";
  inputCantidad.value = "";
  renderizarRenglones();
}

function quitarRenglon(libroId) {
  estado.renglonesVentaActual = estado.renglonesVentaActual.filter(r => r.libroId !== libroId);
  mostrarFeedbackVenta("Libro quitado de la venta actual.", "exito");
  renderizarRenglones();
}

function confirmarVenta(e) {
  e.preventDefault();

  const selectCliente = document.querySelector("#venta-cliente");
  if (!selectCliente || !selectCliente.value) {
    mostrarFeedbackVenta("Debe seleccionar un cliente antes de confirmar la venta.");
    return;
  }

  if (estado.renglonesVentaActual.length === 0) {
    mostrarFeedbackVenta("Debe agregar al menos un renglón para confirmar la venta.");
    return;
  }

  const clienteTexto = selectCliente.options[selectCliente.selectedIndex].text;
  const totalVenta = estado.renglonesVentaActual.reduce((acc, r) => acc + (r.cantidad * r.precioUnitario), 0);

  const nuevaVentaConfirmada = {
    idVenta: Date.now(),
    fecha: new Date().toLocaleString(),
    cliente: clienteTexto,
    renglones: [...estado.renglonesVentaActual], // Copia inmutable de los renglones con precio histórico
    total: Number(totalVenta.toFixed(2))
  };

  estado.historialVentas.push(nuevaVentaConfirmada);
  guardarEstadoEnStorage();

  console.log("Venta confirmada guardada en el historial inmutable:", nuevaVentaConfirmada);

  estado.renglonesVentaActual = [];
  selectCliente.value = "";
  renderizarRenglones();
  mostrarFeedbackVenta("¡Venta confirmada y registrada en el historial con éxito!", "exito");
  alert("¡Venta confirmada con éxito!");
}

// ==========================================================================
// 6. INICIALIZACIÓN GLOBAL AL CARGAR EL DOM
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Cargar estado persistido
  cargarEstadoDeStorage();

  // Inicializar vistas de Cristian
  renderizarCatalogo();
  renderizarTablaLibros();
  cargarSelectsFormularioLibro();

  // Inicializar vistas de Joseph
  actualizarSelectClientesVenta();
  actualizarSelectLibrosVenta();
  renderizarRenglones();

  // Listener Buscador
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

  // Listener Alta de Libros
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

      if (!inputTitulo) errores.push("El título no puede estar vacío.");
      if (!inputIsbn) {
        errores.push("El ISBN es obligatorio.");
      } else {
        const isbnLimpio = inputIsbn.replace(/[-\s]/g, "");
        if (estado.libros.some(l => l.isbn.replace(/[-\s]/g, "") === isbnLimpio)) {
          errores.push("El ISBN ingresado ya pertenece a otro libro registrado.");
        }
      }
      if (isNaN(inputPrecio) || inputPrecio <= 0) errores.push("El precio debe ser un número mayor a cero.");
      if (!selectEditorialVal) errores.push("Debe seleccionar una editorial existente.");
      if (autoresSeleccionados.length === 0) errores.push("Debe seleccionar al menos un autor.");

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
      guardarEstadoEnStorage();
      
      if (feedbackLibros) {
        feedbackLibros.style.color = "green";
        feedbackLibros.textContent = "¡Libro registrado con éxito!";
      }

      formAltaLibro.reset();
      renderizarCatalogo();
      renderizarTablaLibros();
      actualizarSelectLibrosVenta();
    });
  }

  // Listener Alta de Clientes
  const formAltaCliente = document.querySelector("#form-alta-cliente") || document.querySelector("#form-cliente");
  if (formAltaCliente) {
    formAltaCliente.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputs = formAltaCliente.querySelectorAll("input");
      if (inputs.length >= 2) {
        const exito = registrarCliente(inputs[0].value, inputs[1].value);
        if (exito) formAltaCliente.reset();
      }
    });
  }

  // Listeners de Ventas
  const btnAgregarRenglon = document.querySelector("#btn-agregar-renglon");
  if (btnAgregarRenglon) {
    btnAgregarRenglon.addEventListener("click", agregarRenglon);
  }

  const formArmarVenta = document.querySelector("#form-armar-venta");
  if (formArmarVenta) {
    formArmarVenta.addEventListener("submit", confirmarVenta);
  }
});