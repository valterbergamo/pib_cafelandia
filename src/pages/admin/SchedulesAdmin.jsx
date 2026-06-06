import CrudManager from '../../components/admin/CrudManager.jsx'
import { WEEKDAY_OPTIONS, weekdayName, formatTime } from '../../lib/format.js'

const fields = [
  { name: 'title', label: 'Título (ex.: Culto da Família)', required: true, full: true },
  {
    name: 'dayOfWeek',
    label: 'Dia da semana',
    type: 'select',
    required: true,
    options: WEEKDAY_OPTIONS,
  },
  { name: 'hour', label: 'Horário', type: 'time', help: 'Ex.: 19:30' },
  { name: 'description', label: 'Descrição', type: 'textarea', rows: 2, full: true },
  { name: 'order', label: 'Ordem de exibição', type: 'number', default: 0 },
  { name: 'active', label: 'Ativo (visível no site)', type: 'checkbox', default: true },
]

const columns = [
  { key: 'title', label: 'Título' },
  { key: 'dayOfWeek', label: 'Dia', render: (v) => weekdayName(v) },
  { key: 'hour', label: 'Horário', render: (v) => formatTime(v) || '—' },
  {
    key: 'active',
    label: 'Status',
    render: (v) =>
      v ? (
        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Ativo</span>
      ) : (
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">Oculto</span>
      ),
  },
]

export default function SchedulesAdmin() {
  return (
    <CrudManager
      entity="Schedules"
      title="Agenda / Cultos"
      subtitle="Horários semanais exibidos na home e na página de agenda."
      columns={columns}
      fields={fields}
      orderby="dayOfWeek asc"
      emptyLabel="Nenhum horário cadastrado."
    />
  )
}
