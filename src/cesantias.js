import { campoPesos, botonCompartir } from './comun.js'
import { cesantias, dias360, pesos } from './calculos.js'
import { vigente, ANIO_VIGENTE } from './datos.js'

const v = vigente()
const $ = (id) => document.getElementById(id)
let salario = v.smmlv
let r = null

function calcular() {
  const dias = $('desde').value && $('hasta').value ? dias360($('desde').value, $('hasta').value) : 0
  r = cesantias(salario, dias, v)
  $('total').textContent = pesos(r.cesantias + r.intereses)
  $('r-ces').textContent = pesos(r.cesantias)
  $('r-int').textContent = pesos(r.intereses)
  $('r-base').textContent = pesos(r.base)
  $('r-dias').textContent = `${r.dias} de 360`
}

$('desde').value = `${ANIO_VIGENTE}-01-01`
$('hasta').value = `${ANIO_VIGENTE}-12-31`
$('desde').addEventListener('change', calcular)
$('hasta').addEventListener('change', calcular)
const set = campoPesos($('salario'), (n) => { salario = n; calcular() })
set(v.smmlv)

botonCompartir($('share'), () =>
  `Mis cesantías son ${pesos(r.cesantias)} y los intereses ${pesos(r.intereses)}. Calcula las tuyas:`
)
