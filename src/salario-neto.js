import { campoPesos, botonCompartir } from './comun.js'
import { salarioNeto, pesos } from './calculos.js'
import { vigente } from './datos.js'

const v = vigente()
const $ = (id) => document.getElementById(id)
let ultimo = null

const set = campoPesos($('salario'), (salario) => {
  const r = salarioNeto(salario, v)
  ultimo = r
  $('neto').textContent = pesos(r.neto)
  $('r-salario').textContent = pesos(r.salario)
  $('r-aux').textContent = pesos(r.aux)
  $('r-salud').textContent = '−' + pesos(r.salud)
  $('r-pension').textContent = '−' + pesos(r.pension)
  $('r-fsp').textContent = r.fsp ? '−' + pesos(r.fsp) : pesos(0)
  $('r-quincena').textContent = pesos(Math.round(r.neto / 2))
})

document.querySelectorAll('.quick button').forEach((b) =>
  b.addEventListener('click', () => set(Math.round(v.smmlv * Number(b.dataset.v))))
)
set(v.smmlv)

botonCompartir($('share'), () =>
  `Con un salario de ${pesos(ultimo.salario)} recibo ${pesos(ultimo.neto)} al mes. Calcula el tuyo:`
)
