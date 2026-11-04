// Genera index.html con el listado de todos los archivos del repositorio.
// Uso: node scripts/generar-indice.mjs   (se corre solo en GitHub al subir archivos)
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

// Lo que no se lista: archivos del sistema y los del propio índice.
const IGNORAR = new Set(['index.html', 'robots.txt', 'README.md', 'scripts', 'node_modules']);

const ICONOS = {
  '.pdf': '📕', '.doc': '📘', '.docx': '📘', '.odt': '📘', '.txt': '📄',
  '.xls': '📗', '.xlsx': '📗', '.csv': '📗', '.ppt': '📙', '.pptx': '📙',
  '.html': '🌐', '.htm': '🌐',
  '.png': '🖼️', '.jpg': '🖼️', '.jpeg': '🖼️', '.gif': '🖼️', '.webp': '🖼️', '.svg': '🖼️',
  '.mp3': '🎵', '.mp4': '🎬', '.zip': '🗜️',
};

const escapar = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const enlace = (ruta) => ruta.split('/').map(encodeURIComponent).join('/');

function tamano(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

const porNombre = (a, b) => a.localeCompare(b, 'es', { numeric: true, sensitivity: 'base' });

// Devuelve { carpetas: [{nombre, ruta, contenido}], archivos: [{nombre, ruta, bytes}], total }
function leer(carpeta, rutaRel = '') {
  const carpetas = [];
  const archivos = [];
  for (const nombre of readdirSync(carpeta).sort(porNombre)) {
    if (nombre.startsWith('.') || (rutaRel === '' && IGNORAR.has(nombre))) continue;
    const completa = join(carpeta, nombre);
    const ruta = rutaRel ? `${rutaRel}/${nombre}` : nombre;
    const info = statSync(completa);
    if (info.isDirectory()) {
      const contenido = leer(completa, ruta);
      if (contenido.total > 0) carpetas.push({ nombre, ruta, contenido });
    } else {
      archivos.push({ nombre, ruta, bytes: info.size });
    }
  }
  const total = archivos.length + carpetas.reduce((n, c) => n + c.contenido.total, 0);
  return { carpetas, archivos, total };
}

function html({ carpetas, archivos }, nivel = 0) {
  const items = [];
  for (const c of carpetas) {
    items.push(
      `<li><details${nivel === 0 ? ' open' : ''}><summary>📁 ${escapar(c.nombre)} <small>(${c.contenido.total})</small></summary>` +
        html(c.contenido, nivel + 1) + '</details></li>'
    );
  }
  for (const a of archivos) {
    const icono = ICONOS[extname(a.nombre).toLowerCase()] ?? '📄';
    items.push(
      `<li class="archivo"><a href="${enlace(a.ruta)}">${icono} ${escapar(a.nombre)}</a> <small>${tamano(a.bytes)}</small></li>`
    );
  }
  return `<ul>${items.join('')}</ul>`;
}

const arbol = leer(raiz);

const pagina = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Mis archivos</title>
<style>
  body { font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 1rem; line-height: 1.6; }
  h1 { font-size: 1.5rem; }
  input { width: 100%; padding: .6rem; font-size: 1rem; margin-bottom: 1rem; box-sizing: border-box; }
  ul { list-style: none; padding-left: 1.2rem; margin: .2rem 0; }
  body > ul { padding-left: 0; }
  summary { cursor: pointer; font-weight: 600; }
  a { text-decoration: none; }
  a:hover { text-decoration: underline; }
  small { color: #666; }
  .oculto { display: none; }
</style>
</head>
<body>
<h1>Mis archivos <small>(${arbol.total})</small></h1>
<input id="buscar" type="search" placeholder="Buscar archivo…" autofocus>
${arbol.total ? html(arbol) : '<p>Todavía no hay archivos.</p>'}
<script>
  const caja = document.getElementById('buscar');
  caja.addEventListener('input', () => {
    const q = caja.value.trim().toLowerCase();
    document.querySelectorAll('li.archivo').forEach((li) => {
      li.classList.toggle('oculto', q && !li.textContent.toLowerCase().includes(q));
    });
    document.querySelectorAll('details').forEach((d) => {
      const hay = d.querySelector('li.archivo:not(.oculto)');
      d.parentElement.classList.toggle('oculto', q && !hay);
      if (q) d.open = true;
    });
  });
</script>
</body>
</html>
`;

writeFileSync(join(raiz, 'index.html'), pagina);
console.log(`index.html generado con ${arbol.total} archivos`);
