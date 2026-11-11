# SCAE - Sistema de Control de Asistencia Escolar
I.E. Secundaria José María Flores - Huaccana

## Cómo abrirlo en Visual Studio Code
1. Descomprime el ZIP y abre la carpeta `scae` en VS Code (Archivo > Abrir carpeta).
2. Instala la extensión **Live Server** (Ritwick Dey).
3. Clic derecho en `index.html` > **Open with Live Server**. Se abre en el navegador.
   (También puedes hacer doble clic en `index.html`.)

## Usuarios de prueba
- Rol Director: `director` / `admin123`
- Rol Docente: `prof_garcia` / `doc123` (también `prof_martinez`, `prof_rodriguez`)
Elige primero el rol y luego escribe usuario y contraseña. Para entrar sin login, cambia `REQUIRE_LOGIN` a `false` en `js/app.js`.

## Fondo del login
El login usa la foto de la institución guardada en `assets/institucion.jpg`. Para cambiarla, reemplaza ese archivo por otra imagen horizontal; mientras más resolución (1600 px o más), más nítida se verá. Si el archivo falta, se muestra un fondo azul con cerros.

## Estructura
- `index.html`: pantallas. `css/style.css`: estilos. `js/app.js`: lógica y datos de prueba.
- `database/schema.sql`: las 8 tablas del documento de requisitos más una de log de actividades (MySQL).

## Estado actual y pendiente
Es un prototipo de interfaz: los datos se guardan en el navegador (localStorage), no en una base de datos.
Falta el backend (Node.js/Express o Laravel) que use `schema.sql`, autentique con bcrypt y exporte reportes a Excel y PDF reales.
