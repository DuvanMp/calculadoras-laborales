// ─────────────────────────────────────────────────────────────
// Valores oficiales. Actualízalos cada enero cuando salga el decreto.
// ─────────────────────────────────────────────────────────────
export const VALORES = {
  2026: {
    smmlv: 1750905, // Decreto 1469 de 2025
    auxilio: 249095, // Decreto 1470 de 2025
    fuente: 'Decretos 1469 y 1470 de 2025',
  },
  2025: {
    smmlv: 1423500,
    auxilio: 200000,
    fuente: 'Decretos 1572 y 1573 de 2024',
  },
}

export const ANIO_VIGENTE = 2026
export const vigente = () => VALORES[ANIO_VIGENTE]
