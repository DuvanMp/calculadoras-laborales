import { hoyISO } from './comun.js'
import { festivos } from './calculos.js'

const hoy = hoyISO()
const y = Number(hoy.slice(0, 4))
const prox = [...festivos(y), ...festivos(y + 1)].find((f) => f.fecha >= hoy)
const faltan = Math.round((new Date(`${prox.fecha}T12:00:00`) - new Date(`${hoy}T12:00:00`)) / 86400000)
document.getElementById('prox').textContent =
  faltan === 0 ? `Hoy es festivo: ${prox.nombre}` : `Próximo festivo en ${faltan} ${faltan === 1 ? 'día' : 'días'}`
