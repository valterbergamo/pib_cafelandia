import CrudManager from '../../components/admin/CrudManager.jsx'

const fields = [
  { name: 'title', label: 'Nome', required: true },
  { name: 'link', label: 'Site / link', type: 'url' },
  { name: 'description', label: 'Descrição', type: 'textarea', rows: 2, full: true },
  { name: 'imageUrl', label: 'Logo (URL)', type: 'url', full: true },
  { name: 'order', label: 'Ordem', type: 'number', default: 0 },
  { name: 'active', label: 'Ativo', type: 'checkbox', default: true },
]

const columns = [
  {
    key: 'imageUrl',
    label: 'Logo',
    render: (v) =>
      v ? <img src={v} alt="" className="h-8 w-auto" /> : <span className="text-slate-300">—</span>,
  },
  { key: 'title', label: 'Nome' },
  {
    key: 'link',
    label: 'Link',
    render: (v) =>
      v ? (
        <a href={v} target="_blank" rel="noreferrer" className="text-brand hover:underline">
          abrir
        </a>
      ) : (
        '—'
      ),
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

export default function PartnersAdmin() {
  return (
    <CrudManager
      entity="Partners"
      title="Parceiros"
      subtitle="Organizações e ministérios parceiros."
      columns={columns}
      fields={fields}
      orderby="order asc"
      emptyLabel="Nenhum parceiro cadastrado."
    />
  )
}
