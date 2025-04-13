// Inicializar IndexedDB
let db;
let grafico = null

const request = indexedDB.open("FinanzasDB", 1);

// Crear estructura de la base de datos
request.onupgradeneeded = (event) => {
  db = event.target.result;

  // Object Store para transacciones
  const transaccionesStore = db.createObjectStore("transacciones", {
    keyPath: "id",
    autoIncrement: true,
  });
  transaccionesStore.createIndex("tipo", "tipo", { unique: false });
  transaccionesStore.createIndex("categoria", "categoria", { unique: false });

  // Object Store para gastos estimados
  db.createObjectStore("estimados", { keyPath: "id" });
  db.createObjectStore("categorias", {keyPath: "valor"})
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("IndexedDB inicializado correctamente.");

  // Ejecutar funciones principales al cargar la aplicación
  cargarTransacciones();
  actualizarBalance();
  actualizarUltimaTransaccion();
  actualizarGrafico();
  cargarEstimados();
  cargarCategorias();
};

request.onerror = (event) => {
  console.error("Error al inicializar IndexedDB:", event.target.errorCode);
};

// Alternar entre secciones
function mostrarPestaña(id) {
  const secciones = document.querySelectorAll("section");
  const tabs = document.querySelectorAll(".tab");

  // Ocultar todas las secciones y desactivar las pestañas
  secciones.forEach((section) => {
    section.classList.remove("pestaña-activa");
    section.classList.add("pestaña-oculta");
  });
  tabs.forEach((tab) => tab.classList.remove("active"));

  // Mostrar la sección activa y activar la pestaña correspondiente
  const seccionActiva = document.getElementById(id);
  if (seccionActiva) {
    seccionActiva.classList.add("pestaña-activa");
    seccionActiva.classList.remove("pestaña-oculta");
  }
  const tabActiva = document.querySelector(`.tab[onclick="mostrarPestaña('${id}')"]`);
  if (tabActiva) {
    tabActiva.classList.add("active");
  }

  // Asegurar que balance y última transacción se actualicen
  actualizarBalance();
  actualizarUltimaTransaccion();
}

// hola
document.getElementById("form-categorias").addEventListener("submit", (e) =>{
  e.preventDefault();

  const categoriaName = document.getElementById("nombre-categoria").value
  const categoria = {nombre : categoriaName, valor : categoriaName.toLowerCase()}
  const transaction = db.transaction(["categorias"], "readwrite");
  const store = transaction.objectStore("categorias");
  const request = store.add(categoria)
  
  request.onsuccess = () =>{
    alert("Se ha creado la categoria exitosamente!")
    cargarCategorias()
  }

  request.onerror = () => {
    alert("Ha ocurrido un error al crear la categoria pipipipipi")
  }
  
})

function cargarCategorias(){
  const selectTransaccion = document.getElementById("categoria")
  const selectEstimado = document.getElementById("categoriaEstimado")

  const transaction = db.transaction(["categorias"], "readonly");
  const store = transaction.objectStore("categorias");
  const request = store.getAll()

  request.onsuccess = () => {

    const transaccionNodos = selectTransaccion.children
    const estimadoNodos = selectEstimado.children
      if(transaccionNodos.length > 0 ){
        for(let i = transaccionNodos.length - 1; i >= 0; i--){
          transaccionNodos[i].remove()
          estimadoNodos[i].remove()
        }
      }

    request.result.forEach((categorias) => {
      const optionTransaccion = new Option(categorias.nombre, categorias.valor)
      const optionEstimado = new Option(categorias.nombre, categorias.valor)
      selectTransaccion.appendChild(optionTransaccion)
      selectEstimado.appendChild(optionEstimado)
    });
  };
}

// Función para añadir transacción
document.getElementById("form-transaccion").addEventListener("submit", (e) => {
  e.preventDefault(); // Evita que el formulario recargue la página

  const tipo = document.getElementById("tipo").value;
  const monto = parseFloat(document.getElementById("monto").value);
  const fecha = document.getElementById("fecha").value;
  const categoria = document.getElementById("categoria").value.toLowerCase();

  if (tipo && !isNaN(monto) && fecha && categoria) {
    const transaccion = { tipo, monto, fecha, categoria };

    if (!db) {
      alert("La base de datos no está inicializada.");
      return;
    }

    const transaction = db.transaction(["transacciones"], "readwrite");
    const store = transaction.objectStore("transacciones");

    const request = store.add(transaccion);
    request.onsuccess = () => {
      alert("Transacción añadida correctamente.");
      cargarTransacciones(); // Actualiza la lista
      actualizarBalance(); // Actualiza el balance
      actualizarUltimaTransaccion(); // Muestra la última transacción
      actualizarGrafico(); // Actualiza la gráfica
    };

    request.onerror = () => {
      console.error("Error al guardar la transacción:", request.error);
      alert("Error al guardar los datos.");
    };
  } else {
    alert("Por favor, completa todos los campos correctamente.");
    console.log("Datos inválidos:", { tipo, monto, fecha, categoria });
  }
});

// Función para mostrar la última transacción
function actualizarUltimaTransaccion() {
  const transaction = db.transaction(["transacciones"], "readonly");
  const store = transaction.objectStore("transacciones");
  const request = store.getAll();

  request.onsuccess = () => {
    const transacciones = request.result;

    if (transacciones.length > 0) {
      const ultimaTransaccion = transacciones.reduce((masReciente, actual) =>
        new Date(actual.fecha) >= new Date(masReciente.fecha) ? actual : masReciente
      );

      document.getElementById("ultima-transaccion").textContent = `${ultimaTransaccion.tipo.toUpperCase()} de $${ultimaTransaccion.monto.toFixed(
        2
      )} (${ultimaTransaccion.categoria}) el ${ultimaTransaccion.fecha}`;
    } else {
      document.getElementById("ultima-transaccion").textContent = "Sin transacciones registradas.";
    }
  };

  request.onerror = () => {
    console.error("Error al obtener la última transacción.");
    document.getElementById("ultima-transaccion").textContent = "Error al cargar.";
  };
}

// Función para cargar transacciones
// Escuchar cambios en el filtro de tipo
document.getElementById("filtro-tipo").addEventListener("change", (e) => {
  const tipoSeleccionado = e.target.value; // Obtener el valor seleccionado
  cargarTransacciones(tipoSeleccionado); // Llamar a cargarTransacciones con el filtro
});

// Modificar cargarTransacciones para aceptar un filtro
function cargarTransacciones(filtroTipo = "todos") {
  const transaction = db.transaction(["transacciones"], "readonly");
  const store = transaction.objectStore("transacciones");
  const request = store.getAll();

  request.onsuccess = () => {
    const lista = document.getElementById("transacciones-lista");
    lista.innerHTML = "";

    // Filtrar las transacciones según el tipo seleccionado
    const transaccionesFiltradas = request.result.filter((transaccion) => {
      return filtroTipo === "todos" || transaccion.tipo === filtroTipo;
    });

    let number = 1
    // Mostrar las transacciones filtradas
    transaccionesFiltradas.forEach((transaccion) => {
      const item = document.createElement("li");
      item.innerHTML = `${transaccion.fecha} - ${transaccion.tipo.toUpperCase()}: $${transaccion.monto} (${transaccion.categoria}) <img src="trash.svg" class="img" id="D${number}"></img>`;
      const button = item.querySelector("#D"+number)
      button.addEventListener("click", () =>{
        eliminarTransaccion(transaccion.id)
      })
      number++
      lista.appendChild(item);
    });
  };

  request.onerror = () => {
    console.error("Error al cargar transacciones.");
 };
}

// Función para actualizar el balance
function actualizarBalance() {
  const transaction = db.transaction(["transacciones", "estimados"], "readonly");
  const store = transaction.objectStore("transacciones");
  const request = store.getAll();

  request.onsuccess = () => {
    const transacciones = request.result;
    let balance = 0;

    transacciones.forEach((t) => {
      if (t.tipo === "ingreso") {
        balance += t.monto;
      } else if (t.tipo === "egreso") {
        balance -= t.monto;
      }
    });

    document.getElementById("balance-actual").textContent = `$${balance.toFixed(2)}`;
  };

  request.onerror = () => {
    console.error("Error al calcular el balance.");
    document.getElementById("balance-actual").textContent = "Error al calcular.";
  };

  const storeEstimados = transaction.objectStore("estimados")
  const requestEstimados = storeEstimados.getAll()

  requestEstimados.onsuccess = () =>{
    const transacciones = requestEstimados.result;
    let balance = 0;

    transacciones.forEach((t) => {
      balance += t.monto
    });

    document.getElementById("balance-estimado").textContent = `$${(parseFloat(document.getElementById("balance-actual").textContent.split("$")[1]).toFixed(2) - balance.toFixed(2)).toFixed(2)}`;
  }
}

// Función para eliminar transacciones
function eliminarTransaccion(id) {
  const transaction = db.transaction(["transacciones"], "readwrite");
  const store = transaction.objectStore("transacciones");

  store.delete(id).onsuccess = () => {
    alert("Transacción eliminada.");
    cargarTransacciones();
    actualizarBalance();
    actualizarUltimaTransaccion();
    actualizarGrafico();
  };
}

function eliminarEstimado(id) {
  const transaction = db.transaction(["estimados"], "readwrite");
  const store = transaction.objectStore("estimados");

  store.delete(id).onsuccess = () => {
    alert("Estimado eliminado.");
    cargarEstimados();
    actualizarBalance();
    actualizarGrafico();
  };
}

// Función para actualizar la gráfica
function actualizarGrafico() {
  const transaction = db.transaction(["transacciones"], "readonly");
  const store = transaction.objectStore("transacciones");
  const request = store.getAll();

  request.onsuccess = () => {
    const transacciones = request.result;
    const ingresos = transacciones
      .filter((t) => t.tipo === "ingreso")
      .reduce((total, t) => total + t.monto, 0);
    const egresos = transacciones
      .filter((t) => t.tipo === "egreso")
      .reduce((total, t) => total + t.monto, 0);

      const transactionEst = db.transaction(["estimados"], "readonly");
      const storeEst = transactionEst.objectStore("estimados");
      const requestEst = storeEst.getAll();
      requestEst.onsuccess = () => {

        const transaccionesEst = requestEst.result;
        const egresosEst = transaccionesEst
          .reduce((total, t) => total + t.monto, 0);

        const ctx = document.getElementById("grafico-canvas").getContext("2d");
        if(grafico){
          grafico.destroy()
        }

        grafico = new Chart(ctx, {
          type: "bar",
          data: {
            labels: ["Ingresos", "Egresos", "Egresos Estimados"],
            datasets: [
              {
                label: "Monto",
                data: [ingresos, egresos, egresosEst],
                backgroundColor: ["#4CAF50", "#FF5722", "gold"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: true,
              },
            },
          },
        });
      }

      requestEst.onerror = () => {
        console.error("Error al generar la gráfica.");
      };

  };

  request.onerror = () => {
    console.error("Error al generar la gráfica.");
  };
}

document.getElementById("form-estimados").addEventListener("submit", async (e) => {
  e.preventDefault(); // Evita que el formulario recargue la página

  const mes = document.getElementById("mes").value;
  const montoEstimado = parseFloat(document.getElementById("monto-estimado").value);
  const categoria = document.getElementById("categoriaEstimado").value.toLowerCase();

  async function getID(){
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["estimados"], "readonly");
      const store = transaction.objectStore("estimados");
      const request = store.getAll()
      request.onsuccess = () =>{ resolve(request.result.length + 1) }
      request.onerror = () =>{ reject(request.error) }
    })

  }

  let id = await getID()

  if (id && !isNaN(montoEstimado)) {

    const transaction = db.transaction(["estimados"], "readwrite");
    const store = transaction.objectStore("estimados");
    
    const estimado = { id, mes, monto: montoEstimado, categoria : categoria };

    const request = store.add(estimado);
    request.onsuccess = () => {
      alert("Ingreso estimado guardado correctamente.");
      cargarEstimados(); // Actualiza la lista de estimados
    };

    request.onerror = () => {
      console.error("Error al guardar el ingreso estimado:", request.error);
      alert("Error al guardar los datos.");
    };
  } else {
    alert("Por favor, completa todos los campos correctamente.");
  }
});

function cargarEstimados() {
  const transaction = db.transaction(["estimados"], "readonly");
  const store = transaction.objectStore("estimados");
  const request = store.getAll();

  request.onsuccess = () => {
    const lista = document.getElementById("lista-estimados");
    lista.innerHTML = "";
    let number = 1;
    request.result.forEach((estimado) => {
      const item = document.createElement("li");
      item.innerHTML = `Mes: ${estimado.mes}, Monto Estimado: $${estimado.monto.toFixed(2)}, Categoria: ${estimado.categoria} <img src="trash.svg" class="img" id="DE${number}"></img>`;
      const button = item.querySelector("#DE"+number)
      button.addEventListener("click", () =>{
        eliminarEstimado(estimado.id)
      })
      number++
      lista.appendChild(item);
    });

    actualizarGrafico();
  };

  request.onerror = () => {
    console.error("Error al cargar los ingresos estimados.");
  };
}


