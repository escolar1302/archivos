# Instrucciones para Claude

Nube personal de archivos (PDF, documentos, imágenes y HTML de actividades), publicada en
https://escolar1302.github.io/archivos/ con GitHub Pages desde la rama `main`. Sirve para abrir
los archivos desde cualquier computadora con solo la dirección, sin iniciar sesión.

## Publicación

- Todo lo que llega a `main` se publica en el sitio. Hacer `git push` solo cuando yo lo pida.
- No añadir un archivo `.nojekyll`: esta carpeta `.claude/` se publicaría en el sitio.
- El repositorio es público: este archivo se puede leer en GitHub. No guardar aquí datos privados
  y no subir archivos personales ni sensibles.

## Estructura

- Los archivos van sueltos o en subcarpetas, según el tema.
- `index.html`: lo genera solo `scripts/generar-indice.mjs`. No editarlo a mano.
- `.github/workflows/indice.yml`: regenera `index.html` en GitHub cada vez que se sube algo.
  No modificarlo sin avisarme.
- `robots.txt` y `noindex`: evitan que los buscadores indexen el sitio. No quitarlos.
- Límites de GitHub: 100 MB por archivo y conviene que el repositorio no pase de 1 GB.

## Cómo trabajo

Trabajo mayormente solo y en más de una computadora. En algunos repositorios colabora otra persona.
La Action agrega commits sola (el índice), así que la copia local queda atrasada después de
cada subida.

## Git

### Al empezar a trabajar

Cada vez que empiezo a trabajar, antes de hacer cualquier otra cosa:

1. Ejecutar `git fetch` y comparar la copia local con el remoto.
2. Avisarme si la copia local está atrasada, adelantada o si divergió del remoto.
3. Avisarme si hay pull requests abiertos.

### Trabajar siempre en lo último

Siempre tenemos que trabajar sobre la última versión. Antes de empezar un cambio, si la copia
local está atrasada, hacer `git pull` y decírmelo. Si no se puede actualizar sin conflictos
(hay trabajo local que choca con el remoto o las ramas divergieron), parar y preguntarme.

### Cuando pregunto por el estado

Decirme qué existe en mi computadora y todavía no está en el remoto, y al revés. Incluir commits
sin subir, commits sin bajar y archivos nuevos o modificados.

### Vocabulario

- "Bajar" significa `git pull`.
- "Subir" significa `git push`.

### Pull requests

- Si hay pull requests abiertos, avisarme.
- Referirse a ellos como "solicitudes de cambio pedidas por <usuario>", usando el autor del pull request.
