import './styles.css'

// Lee un número escrito con puntos de miles ("1.750.905") o sin ellos
export const leerPesos = (txt) => Number(String(txt).replace(/[^\d]/g, '')) || 0

// Formatea el campo de dinero mientras se escribe
export function campoPesos(input, onChange) {
  const fmt = () => {
    const n = leerPesos(input.value)
    input.value = n ? n.toLocaleString('es-CO') : ''
    onChange(n)
  }
  input.addEventListener('input', fmt)
  fmt()
  return (n) => { input.value = n.toLocaleString('es-CO'); fmt() }
}

// Compartir resultado (WhatsApp en celular, copiar en escritorio)
export function botonCompartir(btn, texto) {
  btn.addEventListener('click', async () => {
    const t = texto()
    const url = location.href.split('#')[0]
    if (navigator.share) {
      try { await navigator.share({ text: t, url }); return } catch { return }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${t}\n${url}`)}`, '_blank', 'noopener')
  })
}

export const hoyISO = () => {
  const d = new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}
