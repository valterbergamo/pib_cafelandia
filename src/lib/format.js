const WEEKDAYS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

export function weekdayName(n) {
  return WEEKDAYS[((Number(n) % 7) + 7) % 7] ?? ''
}

export const WEEKDAY_OPTIONS = WEEKDAYS.map((label, value) => ({ value, label }))

export function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d)) return ''
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d)) return ''
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatTime(value) {
  if (!value) return ''
  // value pode ser "19:30:00" ou ISO
  const m = String(value).match(/(\d{1,2}):(\d{2})/)
  if (m) return `${m[1].padStart(2, '0')}h${m[2]}`
  return value
}

export function shortDateParts(value) {
  const d = new Date(value)
  if (isNaN(d)) return { day: '--', month: '' }
  return {
    day: d.toLocaleDateString('pt-BR', { day: '2-digit' }),
    month: d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
  }
}
