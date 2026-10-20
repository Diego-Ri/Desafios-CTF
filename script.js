/* ==========================================================================
   Desafíos CTF · CyLab — lógica de la página
   Vanilla JavaScript. Sin dependencias, sin build.
   ========================================================================== */

/* ==========================================================================
   CONFIGURACIÓN
   >>> EVENT_START ES LA ÚNICA LÍNEA QUE HAY QUE EDITAR PARA CAMBIAR LA
   >>> HORA DE INICIO DE LOS DESAFÍOS.
   Formato: "AAAA-MM-DDTHH:MM:SS±HH:MM" (aquí: 27 oct 2026, 14:00,
   hora de Chile, verano = UTC-3; termina a las 17:00).
   ========================================================================== */
const EVENT_START = new Date("2026-10-27T14:00:00-03:00");

const DURATION_MS = 3 * 60 * 60 * 1000; // Duración de la competencia: 3 horas (14:00–17:00).
const TICK_MS = 1000; // El contador se actualiza cada segundo.

/* --------------------------------------------------------------------------
   Estado de la cuenta regresiva (calculado con la hora actual del navegador,
   por lo que es correcto aunque la página se abra tarde o se recargue).
   tipo: "antes" | "durante" | "despues"
   -------------------------------------------------------------------------- */
function calcularEstado(ahora, inicio, duracion) {
  const t = inicio.getTime();
  const fin = t + duracion;

  if (ahora < t) {
    return { tipo: "antes", restante: t - ahora };
  }
  if (ahora < fin) {
    return { tipo: "durante", restante: fin - ahora };
  }
  return { tipo: "despues", restante: 0 };
}

function desgloseTiempo(ms) {
  // Math.ceil: el último segundo se muestra como 00:00:01 y solo se llega a
  // 00:00:00 en el estado final (el cálculo usa milisegundos reales).
  const totalSegundos = Math.max(0, Math.ceil(ms / 1000));
  const horas = Math.floor(totalSegundos / 3600);
  const minutos = Math.floor((totalSegundos % 3600) / 60);
  const segundos = totalSegundos % 60;
  return { totalSegundos, horas, minutos, segundos };
}

function reloj(d) {
  const dd = (n) => String(n).padStart(2, "0");
  return dd(d.horas) + ":" + dd(d.minutos) + ":" + dd(d.segundos);
}

function textoCompacto(d) {
  return d.horas + "h " + d.minutos + "m " + d.segundos + "s";
}

function textoLargo(d) {
  const partes = [];
  if (d.horas > 0) {
    partes.push(d.horas + (d.horas === 1 ? " hora" : " horas"));
  }
  if (d.minutos > 0) {
    partes.push(d.minutos + (d.minutos === 1 ? " minuto" : " minutos"));
  }
  if (partes.length === 0) {
    partes.push("menos de un minuto");
  }
  return partes.join(" y ");
}

/* --------------------------------------------------------------------------
   Render de la interfaz
   -------------------------------------------------------------------------- */
const MENSAJE_FINAL = "¡Tiempo agotado! La competencia ha finalizado.";

let temporizador = null;
let resumenAnterior = "";
let etiquetaAnterior = "";

function elemento(id) {
  return document.getElementById(id);
}

function pintar(estado) {
  const caja = elemento("cuenta");
  const nodoEstado = elemento("cuenta-estado");
  const nodoTiempo = elemento("cuenta-tiempo");
  const nodoMensaje = elemento("cuenta-mensaje");
  const nodoResumen = elemento("cuenta-resumen");
  if (!caja || !nodoEstado || !nodoTiempo || !nodoMensaje || !nodoResumen) {
    return;
  }

  const d = desgloseTiempo(estado.restante);
  let clase = "cuenta";
  let etiquetaEstado = "";
  let mensaje = "";
  let resumen = "";

  if (estado.tipo === "antes") {
    clase += " cuenta--espera";
    etiquetaEstado = "Esperando el inicio";
    mensaje = "Faltan " + textoCompacto(d) + " para que comiencen los desafíos";
    resumen =
      "Los desafíos aún no han comenzado. Faltan " +
      textoLargo(d) +
      " para que comiencen los desafíos.";
  } else if (estado.tipo === "durante") {
    clase += " cuenta--curso";
    etiquetaEstado = "Competencia en curso";
    mensaje = "Quedan " + textoCompacto(d) + " de competencia";
    resumen =
      "La competencia está en curso. Quedan " +
      textoLargo(d) +
      " de competencia.";
  } else {
    clase += " cuenta--final";
    etiquetaEstado = "Competencia finalizada";
    mensaje = MENSAJE_FINAL;
    resumen = MENSAJE_FINAL;
  }

  caja.className = clase;
  // La etiqueta de estado solo se reescribe cuando cambia, para que la región
  // aria-live/aria-atomic no anuncie lo mismo en cada tic.
  if (etiquetaEstado !== etiquetaAnterior) {
    etiquetaAnterior = etiquetaEstado;
    nodoEstado.textContent = etiquetaEstado;
  }
  nodoTiempo.textContent = estado.tipo === "despues" ? "00:00:00" : reloj(d);
  nodoMensaje.textContent = mensaje;

  // El resumen accesible solo cambia de estado o de minuto, para que la
  // región aria-live no anuncie cada segundo.
  if (resumen !== resumenAnterior) {
    resumenAnterior = resumen;
    nodoResumen.textContent = resumen;
  }

  if (estado.tipo === "despues" && temporizador !== null) {
    clearInterval(temporizador);
    temporizador = null;
  }
}

function actualizar() {
  const estado = calcularEstado(Date.now(), EVENT_START, DURATION_MS);
  pintar(estado);
}

/* --------------------------------------------------------------------------
   Copiar el código de clase
   -------------------------------------------------------------------------- */
function mensajeCopia(texto, esError) {
  const nodo = elemento("estado-copia");
  const boton = elemento("boton-copiar");
  if (nodo) {
    nodo.textContent = texto;
    if (esError) {
      nodo.setAttribute("data-estado", "error");
    } else {
      nodo.removeAttribute("data-estado");
    }
  }
  if (boton) {
    if (esError) {
      boton.setAttribute("data-estado", "error");
    } else {
      boton.setAttribute("data-estado", "ok");
    }
  }
}

function seleccionarCodigo() {
  const nodo = elemento("codigo-clase");
  if (!nodo || !document.createRange || !window.getSelection) {
    return false;
  }
  try {
    const rango = document.createRange();
    rango.selectNodeContents(nodo);
    const seleccion = window.getSelection();
    seleccion.removeAllRanges();
    seleccion.addRange(rango);
    return true;
  } catch (e) {
    return false;
  }
}

function copiarConFallback() {
  const seleccionado = seleccionarCodigo();
  if (!seleccionado) {
    return false;
  }
  try {
    return document.execCommand("copy");
  } catch (e) {
    return false;
  }
}

async function copiarCodigo() {
  const nodo = elemento("codigo-clase");
  if (!nodo) {
    return;
  }
  const codigo = nodo.textContent.trim();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(codigo);
      mensajeCopia("¡Código copiado al portapapeles!", false);
      return;
    } catch (e) {
      // Se intenta el método clásico a continuación.
    }
  }

  if (copiarConFallback()) {
    mensajeCopia("¡Código copiado al portapapeles!", false);
  } else {
    mensajeCopia(
      "No se pudo copiar automáticamente. El código está seleccionado: " +
        "usa Ctrl+C (o Cmd+C) para copiarlo.",
      true
    );
  }
}

/* --------------------------------------------------------------------------
   Arranque
   -------------------------------------------------------------------------- */
function iniciar() {
  const boton = elemento("boton-copiar");
  if (boton) {
    boton.addEventListener("click", copiarCodigo);
  }

  // Primer pintado inmediato. El intervalo se crea solo si la competencia no
  // ha finalizado ya (si se carga en "despues" no se crea ningún temporizador).
  const estadoInicial = calcularEstado(Date.now(), EVENT_START, DURATION_MS);
  pintar(estadoInicial);
  if (estadoInicial.tipo !== "despues" && temporizador === null) {
    temporizador = setInterval(actualizar, TICK_MS);
  }

  // Refresca el valor justo al volver a la pestaña (los segundos perdidos
  // mientras estaba en segundo plano se corrigen en el siguiente tic).
  document.addEventListener("visibilitychange", function () {
    if (!document.hidden) {
      actualizar();
    }
  });
}

iniciar();
