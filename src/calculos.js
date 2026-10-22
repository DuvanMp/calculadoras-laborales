// Lógica de cálculo, sin dependencias del navegador (se puede probar con Node).

// ── Festivos (Ley 51 de 1983, "Ley Emiliani") ─────────────────
const d = (y, m, day) => new Date(Date.UTC(y, m - 1, day))
const addDays = (date, n) => new Date(date.getTime() + n * 86400000)
const nextMonday = (date) => {
  const dow = date.getUTCDay() // 0 domingo … 1 lunes
  return dow === 1 ? date : addDays(date, (8 - dow) % 7)
}

// Domingo de Pascua (algoritmo de Meeus/Jones/Butcher)
export function pascua(y) {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100
  const dd = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - dd - g + 15) % 30
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return d(y, month, day)
}

export function festivos(y) {
  const p = pascua(y)
  const list = [
    [d(y, 1, 1), 'Año Nuevo'],
    [nextMonday(d(y, 1, 6)), 'Día de los Reyes Magos'],
    [nextMonday(d(y, 3, 19)), 'Día de San José'],
    [addDays(p, -3), 'Jueves Santo'],
    [addDays(p, -2), 'Viernes Santo'],
    [d(y, 5, 1), 'Día del Trabajo'],
    [addDays(p, 43), 'Ascensión del Señor'],
    [addDays(p, 64), 'Corpus Christi'],
    [addDays(p, 71), 'Sagrado Corazón de Jesús'],
    [nextMonday(d(y, 6, 29)), 'San Pedro y San Pablo'],
    [d(y, 7, 20), 'Día de la Independencia'],
    [d(y, 8, 7), 'Batalla de Boyacá'],
    [nextMonday(d(y, 8, 15)), 'La Asunción de la Virgen'],
    [nextMonday(d(y, 10, 12)), 'Día de la Raza'],
    [nextMonday(d(y, 11, 1)), 'Día de Todos los Santos'],
    [nextMonday(d(y, 11, 11)), 'Independencia de Cartagena'],
    [d(y, 12, 8), 'Día de la Inmaculada Concepción'],
    [d(y, 12, 25), 'Navidad'],
  ]
  // Si dos festivos caen el mismo día (pasó en 2025), se unen en uno solo
  const porFecha = new Map()
  for (const [date, nombre] of list) {
    const fecha = date.toISOString().slice(0, 10)
    porFecha.set(fecha, porFecha.has(fecha) ? `${porFecha.get(fecha)} y ${nombre}` : nombre)
  }
  return [...porFecha]
    .map(([fecha, nombre]) => ({ fecha, nombre }))
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
}

// ── Días laborales en base 360 (cada mes cuenta 30 días) ──────
// Se usa en Colombia para prima, cesantías y vacaciones. Incluye ambos extremos.
export function dias360(inicio, fin) {
  const [y1, m1, d1raw] = inicio.split('-').map(Number)
  const [y2, m2, d2raw] = fin.split('-').map(Number)
  const ultimo = (y, m) => new Date(Date.UTC(y, m, 0)).getUTCDate()
  const d1 = Math.min(d1raw === ultimo(y1, m1) ? 30 : d1raw, 30)
  const d2 = Math.min(d2raw === ultimo(y2, m2) ? 30 : d2raw, 30)
  const dias = (y2 - y1) * 360 + (m2 - m1) * 30 + (d2 - d1) + 1
  return Math.max(0, dias)
}

// ── Salario neto mensual ───────────────────────────────────────
export function fondoSolidaridad(salario, smmlv) {
  const veces = salario / smmlv
  if (veces < 4) return 0
  if (veces < 16) return 0.01
  if (veces < 17) return 0.012
  if (veces < 18) return 0.014
  if (veces < 19) return 0.016
  if (veces < 20) return 0.018
  return 0.02
}

export function salarioNeto(salario, { smmlv, auxilio }) {
  const tieneAuxilio = salario <= 2 * smmlv
  const aux = tieneAuxilio ? auxilio : 0
  const salud = salario * 0.04
  const pension = salario * 0.04
  const fsp = salario * fondoSolidaridad(salario, smmlv)
  const neto = salario + aux - salud - pension - fsp
  return { salario, aux, salud, pension, fsp, neto: Math.round(neto) }
}

// ── Prima de servicios ────────────────────────────────────────
// (salario + auxilio) × días trabajados en el semestre / 360
export function prima(salario, dias, { smmlv, auxilio }) {
  const aux = salario <= 2 * smmlv ? auxilio : 0
  const base = salario + aux
  const d = Math.min(dias, 180)
  return { base, aux, dias: d, valor: Math.round((base * d) / 360) }
}

// ── Cesantías e intereses ─────────────────────────────────────
// Cesantías: (salario + auxilio) × días / 360
// Intereses: cesantías × 12 % × días / 360
export function cesantias(salario, dias, { smmlv, auxilio }) {
  const aux = salario <= 2 * smmlv ? auxilio : 0
  const base = salario + aux
  const d = Math.min(dias, 360)
  const ces = (base * d) / 360
  const intereses = (ces * 0.12 * d) / 360
  return { base, aux, dias: d, cesantias: Math.round(ces), intereses: Math.round(intereses) }
}

export const pesos = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n)

// ── Liquidación de contrato ───────────────────────────────────
const isoMas1 = (iso) => new Date(Date.parse(`${iso}T00:00:00Z`) + 86400000).toISOString().slice(0, 10)
const mayor = (a, b) => (a > b ? a : b)

// Indemnización por despido sin justa causa (art. 64 CST)
// Indefinido: < 10 SMMLV → 30 días el primer año + 20 por cada año adicional (proporcional)
//             ≥ 10 SMMLV → 20 días el primer año + 15 por cada año adicional (proporcional)
// Fijo: salarios del tiempo que faltaba para terminar el contrato.
export function indemnizacion({ salario, ingreso, retiro, contrato, finPactado }, { smmlv }) {
  const diario = salario / 30
  if (contrato === 'fijo') {
    const faltan = finPactado && finPactado > retiro ? dias360(isoMas1(retiro), finPactado) : 0
    return { dias: faltan, valor: Math.round(diario * faltan) }
  }
  const anios = dias360(ingreso, retiro) / 360
  const [primero, siguientes] = salario < 10 * smmlv ? [30, 20] : [20, 15]
  const dias = anios <= 1 ? primero : primero + siguientes * (anios - 1)
  return { dias: Math.round(dias * 100) / 100, valor: Math.round(diario * dias) }
}

// Liquidación completa al terminar el contrato.
// Supone que ya te pagaron las primas de semestres anteriores y que las
// cesantías de años anteriores ya están en el fondo.
export function liquidacion(p, valores) {
  const { salario, ingreso, retiro, motivo, vacDisfrutadas = 0, incluirSalario = true } = p
  const { smmlv, auxilio } = valores
  const aux = salario <= 2 * smmlv ? auxilio : 0
  const base = salario + aux
  const [y, m] = retiro.split('-').map(Number)

  // Salario de los días trabajados en el último mes
  const diasMes = dias360(mayor(ingreso, `${retiro.slice(0, 7)}-01`), retiro)
  const salarioPend = incluirSalario ? Math.round((base * diasMes) / 30) : 0

  // Cesantías e intereses del año en curso
  const diasCes = dias360(mayor(ingreso, `${y}-01-01`), retiro)
  const ces = (base * diasCes) / 360
  const intCes = (ces * 0.12 * diasCes) / 360

  // Prima del semestre en curso
  const inicioSem = m <= 6 ? `${y}-01-01` : `${y}-07-01`
  const diasPrima = dias360(mayor(ingreso, inicioSem), retiro)
  const primaV = (base * diasPrima) / 360

  // Vacaciones no disfrutadas: 15 días hábiles por año trabajado (sin auxilio)
  const diasTotales = dias360(ingreso, retiro)
  const vacPend = Math.max(0, (diasTotales * 15) / 360 - vacDisfrutadas)
  const vac = (salario / 30) * vacPend

  const ind = motivo === 'sin-justa-causa' ? indemnizacion(p, valores) : { dias: 0, valor: 0 }

  const partes = {
    salario: salarioPend,
    cesantias: Math.round(ces),
    intereses: Math.round(intCes),
    prima: Math.round(primaV),
    vacaciones: Math.round(vac),
    indemnizacion: ind.valor,
  }
  const total = Object.values(partes).reduce((a, b) => a + b, 0)
  return {
    aux, base, partes, total,
    dias: { mes: incluirSalario ? diasMes : 0, cesantias: diasCes, prima: diasPrima, totales: diasTotales, vacaciones: Math.round(vacPend * 100) / 100, indemnizacion: ind.dias },
  }
}
