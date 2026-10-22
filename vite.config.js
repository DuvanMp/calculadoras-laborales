import { defineConfig } from 'vite'
import { resolve } from 'node:path'
import { writeFileSync } from 'node:fs'

// Nombre del sitio y páginas. Al agregar una calculadora, súmala aquí.
const SITE = 'Calculadoras Laborales Colombia'
const PAGES = [
  { path: '/', file: 'index.html', label: 'Inicio' },
  { path: '/festivos/', file: 'festivos/index.html', label: 'Festivos' },
  { path: '/salario-neto/', file: 'salario-neto/index.html', label: 'Salario neto' },
  { path: '/prima/', file: 'prima/index.html', label: 'Prima' },
  { path: '/cesantias/', file: 'cesantias/index.html', label: 'Cesantías' },
  { path: '/liquidacion/', file: 'liquidacion/index.html', label: 'Liquidación' },
]

// Dominio público: en Vercel se toma solo; con dominio propio, cámbialo aquí.
const SITE_URL = process.env.SITE_URL
  || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://example.com')

const header = (current) => `
<header class="top">
  <div class="wrap top-inner">
    <a class="logo" href="/"><b>$</b>${SITE}</a>
    <nav class="menu" aria-label="Calculadoras">
      ${PAGES.slice(1).map((p) => `<a href="${p.path}"${p.path === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}
    </nav>
  </div>
</header>`

const footer = `
<footer class="wrap foot">
  <p><strong>Importante:</strong> los resultados son una estimación de referencia según la legislación laboral colombiana vigente. No reemplazan la asesoría de un contador o abogado laboral.</p>
  <p>Valores 2026: salario mínimo $1.750.905 (Decreto 1469 de 2025) y auxilio de transporte $249.095 (Decreto 1470 de 2025).</p>
  <p>Hecho por <a href="https://duvan-martinez.vercel.app" target="_blank" rel="noopener">Duvan Martínez</a></p>
</footer>`

// Nombre del sitio para Google (en vez de "Vercel") y vista previa al compartir
const SITE_NAME = 'Calculadoras Laborales'
const seo = (page) => {
  const og = `<meta property="og:site_name" content="${SITE_NAME}" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="es_CO" />
<meta property="og:url" content="${SITE_URL}${page.path}" />`
  if (page.path !== '/') return og
  const data = { '@context': 'https://schema.org', '@type': 'WebSite', name: SITE_NAME, alternateName: SITE, url: `${SITE_URL}/` }
  return `${og}\n<script type="application/ld+json">${JSON.stringify(data)}</script>`
}

const analytics = `
<script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
<script defer src="/_vercel/insights/script.js"></script>`

export default defineConfig({
  build: {
    rollupOptions: {
      input: Object.fromEntries(PAGES.map((p) => [p.file.replace('/index.html', '') || 'index', resolve(__dirname, p.file)])),
    },
  },
  plugins: [
    {
      name: 'layout-y-seo',
      transformIndexHtml(html, ctx) {
        const page = PAGES.find((p) => ctx.path === `/${p.file}` || ctx.path === p.path) || PAGES[0]
        return html
          .replace('<!--HEADER-->', header(page.path))
          .replace('<!--FOOTER-->', footer)
          .replace('</head>', `<link rel="canonical" href="${SITE_URL}${page.path}" />\n${seo(page)}\n${analytics}\n</head>`)
      },
      closeBundle() {
        const today = new Date().toISOString().slice(0, 10)
        const urls = PAGES.map((p) => `  <url><loc>${SITE_URL}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')
        writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
        writeFileSync('dist/robots.txt', `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      },
    },
  ],
})
