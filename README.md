# FlagHunter · CyLab

Página web estática intermediaria para la competencia **FlagHunter**
(*Capture The Flag*, CTF).
Su único propósito es **redirigir** a los equipos hacia la plataforma
[CyLab](https://learn.cylabacademy.org/), donde se gestionan los equipos, los
puntajes y el ranking.

- **Clase (classroom):** `17301`
- **Código de acceso:** `CIXkTh3Ay`

Esta página no implementa el CTF: solo muestra un contador regresivo, el
reglamento y los enlaces de acceso a CyLab.

```mermaid
flowchart LR
    A[Visitante / equipo] --> B[Desafios-CTF<br/>pagina estatica]
    B -->|codigo de clase + enlace| C[CyLab<br/>classroom 17301]
    C --> D[Equipos · Puntajes · Ranking]
```

---

## Estructura del proyecto

| Archivo | Responsabilidad |
| --- | --- |
| `index.html` | Estructura y contenido de la página (hero, cronómetro, "Antes de comenzar", reglamento, "Cómo participar"/pasos y pie). |
| `style.css` | Estilos con tema oscuro, acento neón y diseño responsive (mobile-first). |
| `script.js` | Cuenta regresiva de la competencia y copiar el código de clase. |

No hay build ni dependencias: los tres archivos se sirven tal cual.

---

## Acceso de los participantes

Los participantes **no se registran por su cuenta**: las cuentas ya están
creadas. El flujo de acceso es:

```mermaid
flowchart TD
    A[Correo del participante<br/>usuario + contrasena unica] --> B[Iniciar sesion en CyLab]
    B --> C[Ingresar codigo de clase<br/>CIXkTh3Ay]
    C --> D[Acceder a los desafios]
```

1. **Recepción de credenciales:** cada participante recibe por **correo
   electrónico** su **usuario** (su propia dirección de email) y una
   **contraseña única**. Hay que revisar también la **carpeta de spam**.
2. **Inicio de sesión:** con esas credenciales se ingresa a
   [CyLab](https://learn.cylabacademy.org/).
3. **Código de clase:** se ingresa el código `CIXkTh3Ay` para entrar a la sala
   del equipo.
4. **Acceso a los desafíos:** una vez iniciada la competencia, los retos se
   resuelven desde CyLab.

> ℹ️ Si el correo no llega (ni a la carpeta de spam), hay que contactar al
> **equipo organizador** antes de que comience la competencia.

Esta información se muestra en la sección **"Antes de comenzar"** de la página
(entre el cronómetro y el reglamento).

---

## Cómo funciona el contador

El contador usa la **hora actual del navegador**, por lo que sigue siendo
correcto aunque la página se abra tarde o se recargue. Se calcula a partir de
dos constantes de `script.js`:

- `EVENT_START` — momento de inicio de la competencia.
- `DURATION_MS` — duración de la competencia (3 horas).

El contador tiene **tres estados**:

1. **Antes** (`antes`) — aún no comienza. Muestra *"Esperando el inicio"* y el
   tiempo que falta: *"Faltan Xh Ym Zs para que comiencen los desafíos"*.
2. **Durante** (`durante`) — la competencia está en curso. Muestra
   *"Competencia en curso"* y el tiempo restante: *"Quedan Xh Ym Zs de
   competencia"*.
3. **Después** (`despues`) — la competencia terminó. El cronómetro se detiene en
   `00:00:00` y muestra el mensaje final:

   > **¡Tiempo agotado! La competencia ha finalizado.**

---

## Cambiar la hora de inicio

La **única línea que hay que editar** es `EVENT_START` en `script.js`:

```js
// script.js
const EVENT_START = new Date("2026-10-27T14:00:00-03:00");
const DURATION_MS = 3 * 60 * 60 * 1000; // Duración: 3 horas.
```

**Formato:** `"AAAA-MM-DDTHH:MM:SS±HH:MM"` (ISO 8601 con offset de zona
horaria).

- El valor actual es `2026-10-27T14:00:00-03:00`: **27 de octubre de 2026 a
  las 14:00, hora de Chile (verano, UTC-3)**, con término a las **17:00**
  (duración de 3 horas).
- La duración se define en `DURATION_MS`. Actualmente son 3 horas
  (`3 * 60 * 60 * 1000`).

> ⚠️ **Zona horaria de Chile:** el offset depende de la estación. En **verano**
> es `-03:00` y en **invierno** es `-04:00`. Si programas una fecha en horario
> de invierno, escribe `-04:00`, por ejemplo:
> `new Date("2026-07-25T14:00:00-04:00")`.

> ℹ️ La fecha también aparece como texto visible en `index.html` (en el párrafo
> del cronómetro y en el aviso `<noscript>`). Recuerda actualizarlos para que
> coincidan con `EVENT_START`.

---

## Cambiar el enlace de la clase o el código de acceso

Ambos están directamente en `index.html`.

**Enlace a CyLab** — aparece dos veces (mismo destino):

- **Botón principal** *"Ir a los desafíos en CyLab"* (`<a id="enlace-cylab">`).
- **Enlace *"Abrir CyLab"*** del pie de página.

No hay que guiarse por números de línea: busca el texto
`learn.cylabacademy.org` para localizar ambas apariciones.

```html
<!-- Botón principal -->
<a class="boton boton--primario" id="enlace-cylab"
   href="https://learn.cylabacademy.org/classrooms/17301/assignments?status=active&amp;page=1">
```

**Código de acceso** — aparece **tres veces** (deben coincidir):

- **Bloque "Código de clase"** (`<p class="codigo__valor" id="codigo-clase">`),
  el valor mostrado y copiable.
- **Paso "Ingresa el código de clase"** de la sección **"Antes de comenzar"**.
- **Paso "Ingresa el código de clase"** de la sección **"Cómo participar"**.

```html
<!-- Bloque "Código de clase" -->
<p class="codigo__valor" id="codigo-clase">CIXkTh3Ay</p>
```

> El botón **"Copiar código"** lee el texto del elemento `#codigo-clase`, así
> que basta con actualizar ese valor; mantén sincronizadas las **tres
> apariciones** para que el texto sea consistente. Busca `CIXkTh3Ay` para
> localizarlas todas.

---

## Despliegue en GitHub Pages

El sitio es **100 % estático**: no requiere build, dependencias ni configuración
adicional.

1. Sube `index.html`, `style.css` y `script.js` a la rama `main`.
2. En el repositorio ve a **Settings → Pages**.
3. En **Source** elige **"Deploy from a branch"**.
4. Selecciona la rama **`main`** y la carpeta **`/ (root)`**.
5. Guarda. GitHub Pages publicará la página en
   `https://<usuario>.github.io/Desafios-CTF/`.

> ℹ️ El repositorio incluye un archivo `.nojekyll` en la raíz para omitir el
> procesado Jekyll de GitHub Pages y publicar los archivos tal cual. Este modo de
> despliegue por rama no usa workflows ni GitHub Actions.

---

## Accesibilidad y responsive

- **Responsive (mobile-first):** los puntos de quiebre en `style.css` están en
  `640px` y `1024px`; el diseño funciona desde 320px hasta 1440px.
- **Accesibilidad:** enlace "Saltar al contenido", foco visible, estructura
  semántica con `header`/`main`/`footer`, región `role="timer"` con
  `aria-live`, utilidad `.sr-only` para lectores de pantalla y contraste WCAG AA.
- **Sin JavaScript:** un bloque `<noscript>` informa la fecha y hora de inicio.
- **Movimiento reducido:** se respeta `prefers-reduced-motion`.

---

## Reglamento (resumen)

El incumplimiento de estas reglas es motivo de revisión por parte del equipo
organizador. Aplican a **todo el equipo**:

1. **No está permitido el uso de IA**, salvo para tener claridad de los desafíos
   (por ejemplo, saber qué tipo de desafío es).
2. **No se puede automatizar** la resolución de los desafíos.
3. **En caso de sospecha de uso indebido de IA**, se consultará al equipo sobre
   el proceso realizado en el desafío.

---

## Licencia

Proyecto educativo para la competencia CTF de CyLab.
