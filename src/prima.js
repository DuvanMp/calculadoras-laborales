import { campoPesos, botonCompartir, hoyISO } from './comun.js'
import { prima, dias360, pesos } from './calculos.js'
import { vigente, ANIO_VIGENTE } from './datos.js'

const v = vigente()
const $ = (id) => document.getElementById(id)
let salario = v.smmlv
let r = null

const rango = (sem) => sem === '1'
  ? [`${ANIO_VIGENTE}-01-01`, `${ANIO_VIGENTE}-06-30`]
  : [`${ANIO_VIGENTE}-07-01`, `${ANIO_VIGENTE}-12-31`]

function calcular() {
  const dias = $('desde').value && $('hasta').value ? dias360($('desde').value, $('hasta').value) : 0
  r = prima(salario, dias, v)
  $('valor').textContent = pesos(r.valor)
  $('r-base').textContent = pesos(r.base)
  $('r-dias').textContent = `${r.dias} de 180`
  $('r-pago').textContent = $('semestre').value === '1'
    ? 'Se paga a más tardar el 30 de junio.'
    : 'Se paga a más tardar el 20 de diciembre.'
}

function ponerSemestre() {
  const [a, b] = rango($('semestre').value)
  $('desde').value = a
  $('hasta').value = b
  calcular()
}

const set = campoPesos($('salario'), (n) => { salario = n; calcular() })
$('semestre').value = hoyISO().slice(5, 7) <= '06' ? '1' : '2'
$('semestre').addEventListener('change', ponerSemestre)
$('desde').addEventListener('change', calcular)
$('hasta').addEventListener('change', calcular)
ponerSemestre()
set(v.smmlv)

botonCompartir($('share'), () => `Mi prima de este semestre es de ${pesos(r.valor)}. Calcula la tuya:`)
