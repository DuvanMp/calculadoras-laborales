# Calculadoras Laborales Colombia

Sitio estático con herramientas gratuitas para trabajadores en Colombia:

- `/salario-neto/` — salario neto mensual (salud, pensión, fondo de solidaridad, auxilio de transporte)
- `/prima/` — prima de servicios por semestre
- `/cesantias/` — cesantías e intereses del 12 %
- `/festivos/` — próximo festivo, puentes y calendario (calculado con la Ley Emiliani, sirve para cualquier año)

Cada herramienta es una página HTML independiente, con su propio título y descripción, lo que ayuda a que Google la encuentre.

## Actualizar cada año

En enero, cuando salgan los decretos, cambia `src/datos.js` (salario mínimo y auxilio de transporte) y `ANIO_VIGENTE`. Revisa también los textos con valores en los `.html` y en `vite.config.js` (pie de página).

## Desarrollo

```bash
npm install
npm run dev     # servidor local
npm test        # pruebas de las fórmulas
npm run build   # genera dist/ con sitemap.xml y robots.txt
```

## Publicar y medir visitas

1. Sube el repositorio a GitHub e impórtalo en Vercel (detecta Vite solo).
2. En Vercel: proyecto → **Analytics** → **Enable**. El script ya está incluido en todas las páginas.
3. Registra el sitio en Google Search Console y envía `/sitemap.xml`.

Mientras esté en el plan gratis de Vercel, **no agregues publicidad** (es solo para uso no comercial).

Con dominio propio: define la variable `SITE_URL` (por ejemplo `https://tudominio.com`) para que el sitemap y las URL canónicas usen ese dominio.

## Agregar una calculadora

1. Crea la carpeta con su `index.html` (copia una existente).
2. Agrega su lógica en `src/calculos.js` y una prueba en `src/test.mjs`.
3. Súmala a la lista `PAGES` en `vite.config.js` (menú, sitemap y build).
