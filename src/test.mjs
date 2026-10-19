// Pruebas rápidas: npm test
import assert from 'node:assert/strict'
import { festivos, dias360, salarioNeto, prima, cesantias, fondoSolidaridad } from './calculos.js'
import { VALORES } from './datos.js'

const v = VALORES[2026]

// Festivos 2026 según calendario oficial (Ley Emiliani, Pascua 5 de abril)
const esperado2026 = ['2026-01-01','2026-01-12','2026-03-23','2026-04-02','2026-04-03','2026-05-01','2026-05-18','2026-06-08','2026-06-15','2026-06-29','2026-07-20','2026-08-07','2026-08-17','2026-10-12','2026-11-02','2026-11-16','2026-12-08','2026-12-25']
assert.deepEqual(festivos(2026).map((f) => f.fecha), esperado2026)

// Festivos 2025 (Pascua 20 de abril) — referencia conocida
const esperado2025 = ['2025-01-01','2025-01-06','2025-03-24','2025-04-17','2025-04-18','2025-05-01','2025-06-02','2025-06-23','2025-06-30','2025-07-20','2025-08-07','2025-08-18','2025-10-13','2025-11-03','2025-11-17','2025-12-08','2025-12-25']
assert.deepEqual(festivos(2025).map((f) => f.fecha), esperado2025)

// Días 360
assert.equal(dias360('2026-01-01', '2026-06-30'), 180)
assert.equal(dias360('2026-01-01', '2026-12-31'), 360)
assert.equal(dias360('2026-03-15', '2026-06-30'), 106)
assert.equal(dias360('2026-02-01', '2026-02-28'), 30)

// Salario neto con mínimo: 1.750.905 + 249.095 - 8 % de 1.750.905
const n = salarioNeto(v.smmlv, v)
assert.equal(n.aux, 249095)
assert.equal(n.neto, Math.round(1750905 + 249095 - 1750905 * 0.08))

// Sin auxilio por encima de 2 SMMLV
assert.equal(salarioNeto(4000000, v).aux, 0)
// Fondo de solidaridad desde 4 SMMLV
assert.equal(fondoSolidaridad(4 * v.smmlv, v.smmlv), 0.01)
assert.equal(fondoSolidaridad(4 * v.smmlv - 1, v.smmlv), 0)

// Prima semestre completo con mínimo = medio salario + medio auxilio
assert.equal(prima(v.smmlv, 180, v).valor, Math.round((1750905 + 249095) / 2))
// Cesantías año completo = un salario + auxilio; intereses 12 %
const c = cesantias(v.smmlv, 360, v)
assert.equal(c.cesantias, 2000000)
assert.equal(c.intereses, 240000)

console.log('✓ Todas las pruebas pasaron')
