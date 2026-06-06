import CrudManager from '../../components/admin/CrudManager.jsx'
import { formatDateTime } from '../../lib/format.js'

const fields = [
  { name: 'title', label: 'Título', required: true, full: true },
  { name: 'description', label: 'Resumo (aparece nos cards)', type: 'textarea', rows: 2, full: true },
  { name: 'contentText', label: 'Conteúdo completo', type: 'textarea', rows: 6, full: true },
  { name: 'datetime', label: 'Data e hora', type: 'datetime-local' },
  { name: 'location', label: 'Local' },
  { name: 'author', label: 'Autor / responsável' },
  { name: 'imageUrl', label: 'Imagem (URL)', type: 'url', full: true, help: 'Cole o link de uma imagem hospedada.' },
  { name: 'highlight', label: 'Destacar este evento', type: 'checkbox', default: false },
  { name: 'active', label: 'Ativo (visível no site)', type: 'checkbox', default: true },
]

const columns = [
  { key: 'title', label: 'Título' },
  { key: 'datetime', label: 'Data', render: (v) => formatDateTime(v) || '—' },
  { key: 'location', label: 'Local', render: (v) => v || '—' },
  {
    key: 'highlight',
    label: 'Destaque',
    render: (v) => (v ? '⭐' : '—'),
  },
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

export default function EventsAdmin() {
  return (
    <CrudManager
      entity="Events"
      title="Eventos"
      subtitle="Cadastre e gerencie os eventos exibidos no site."
      columns={columns}
      fields={fields}
      orderby="datetime desc"
      emptyLabel="Nenhum evento cadastrado. Clique em “Novo” para começar."
    />
  )
}
