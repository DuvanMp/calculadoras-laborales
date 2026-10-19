import { botonCompartir, hoyISO } from './comun.js'
import { festivos } from './calculos.js'

const $ = (id) => document.getElementById(id)
const hoy = hoyISO()
const anioHoy = Number(hoy.slice(0, 4))
const aFecha = (iso) => new Date(`${iso}T12:00:00`)
const largo = (iso) => aFecha(iso).toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const corto = (iso) => aFecha(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' })
const dia = (iso) => aFecha(iso).toLocaleDateString('es-CO', { weekday: 'long' })
const esPuente = (iso) => [1, 5].includes(aFecha(iso).getDay())

// Próximo festivo (busca en este año y el siguiente)
const todos = [...festivos(anioHoy), ...festivos(anioHoy + 1)]
const prox = todos.find((f) => f.fecha >= hoy)
const faltan = Math.round((aFecha(prox.fecha) - aFecha(hoy)) / 86400000)
$('dias').textContent = faltan === 0 ? '¡Hoy!' : faltan
$('dias-label').textContent = faltan === 0 ? '' : faltan === 1 ? 'día' : 'días'
$('prox-nombre').textContent = prox.nombre
$('prox-fecha').textContent = largo(prox.fecha) + (esPuente(prox.fecha) ? ' · ¡puente!' : '')

const puentes = festivos(anioHoy).filter((f) => f.fecha >= hoy && esPuente(f.fecha)).length
$('puentes-resumen').textContent = `Quedan ${puentes} puentes festivos en ${anioHoy}.`

// Lista por año
function mostrar(y) {
  document.querySelectorAll('.year-tabs button').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.y) === y)))
  $('lista-titulo').textContent = `Festivos ${y}`
  $('lista').innerHTML = festivos(y).map((f) => {
    const cls = [f.fecha < hoy ? 'past' : '', f.fecha === prox.fecha ? 'is-next' : ''].join(' ').trim()
    return `<li class="${cls}"><span class="date">${corto(f.fecha)}</span><span>${f.nombre}<br><span class="dow">${dia(f.fecha)}</span></span>${esPuente(f.fecha) ? '<span class="tag">Puente</span>' : '<span></span>'}</li>`
  }).join('')
}
const tabs = document.querySelectorAll('.year-tabs button')
tabs[0].dataset.y = anioHoy; tabs[0].textContent = anioHoy
tabs[1].dataset.y = anioHoy + 1; tabs[1].textContent = anioHoy + 1
tabs.forEach((b) => b.addEventListener('click', () => mostrar(Number(b.dataset.y))))
mostrar(anioHoy)

botonCompartir($('share'), () => `Faltan ${faltan} días para el próximo festivo: ${prox.nombre} (${largo(prox.fecha)}).`)
