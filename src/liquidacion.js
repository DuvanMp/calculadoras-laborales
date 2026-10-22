import { campoPesos, botonCompartir, hoyISO } from './comun.js'
import { liquidacion, pesos } from './calculos.js'
import { VALORES, vigente } from './datos.js'

const $ = (id) => document.getElementById(id)
let salario = vigente().smmlv
let r = null

const diasTxt = (n) => `(${n} ${n === 1 ? 'día' : 'días'})`

function calcular() {
  const ingreso = $('ingreso').value
  const retiro = $('retiro').value
  const contrato = $('contrato').value
  const motivo = $('motivo').value
  $('fin-wrap').hidden = contrato !== 'fijo'
  if (!ingreso || !retiro || ingreso > retiro || !salario) {
    r = null
    $('total').textContent = '$0'
    $('r-nota').textContent = ingreso > retiro ? 'La fecha de retiro debe ser posterior a la de ingreso.' : ''
    return
  }
  const valores = VALORES[Number(retiro.slice(0, 4))] || vigente()
  r = liquidacion({
    salario, ingreso, retiro, contrato, motivo,
    finPactado: $('fin-pactado').value,
    vacDisfrutadas: Number($('vac').value) || 0,
    incluirSalario: $('incluir-salario').checked,
  }, valores)

  $('total').textContent = pesos(r.total)
  $('r-salario').textContent = pesos(r.partes.salario)
  $('d-salario').textContent = r.dias.mes ? diasTxt(r.dias.mes) : ''
  $('l-salario').hidden = !$('incluir-salario').checked
  $('r-ces').textContent = pesos(r.partes.cesantias)
  $('d-ces').textContent = diasTxt(r.dias.cesantias)
  $('r-int').textContent = pesos(r.partes.intereses)
  $('r-prima').textContent = pesos(r.partes.prima)
  $('d-prima').textContent = diasTxt(r.dias.prima)
  $('r-vac').textContent = pesos(r.partes.vacaciones)
  $('d-vac').textContent = `(${r.dias.vacaciones.toLocaleString('es-CO')} días hábiles)`
  const conInd = motivo === 'sin-justa-causa'
  $('l-ind').hidden = !conInd
  $('r-ind').textContent = pesos(r.partes.indemnizacion)
  $('d-ind').textContent = conInd ? `(${r.dias.indemnizacion.toLocaleString('es-CO')} días)` : ''

  const notas = []
  if (conInd && contrato === 'fijo' && !$('fin-pactado').value) notas.push('Escribe la fecha pactada de fin del contrato para calcular la indemnización.')
  if (!conInd) notas.push('Sin indemnización: solo aplica si te despiden sin justa causa.')
  if (r.aux) notas.push('Incluye auxilio de transporte en salario, cesantías y prima.')
  notas.push('Supone que ya te pagaron primas de semestres anteriores y que las cesantías de años anteriores están en el fondo.')
  $('r-nota').textContent = notas.join(' ')
}

const set = campoPesos($('salario'), (n) => { salario = n; calcular() })
const hoy = hoyISO()
$('retiro').value = hoy
$('ingreso').value = `${Number(hoy.slice(0, 4)) - 1}-${hoy.slice(5)}`
for (const id of ['ingreso', 'retiro', 'contrato', 'motivo', 'fin-pactado', 'vac', 'incluir-salario']) {
  $(id).addEventListener('input', calcular)
  $(id).addEventListener('change', calcular)
}
set(vigente().smmlv)

botonCompartir($('share'), () => `Mi liquidación sería de ${r ? pesos(r.total) : '$0'}. Calcula la tuya:`)
