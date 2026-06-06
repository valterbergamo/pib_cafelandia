import { useEffect, useState, useCallback } from 'react'
import { list, create, update, remove } from '../../api/client.js'
import Modal from './Modal.jsx'
import Field from './Field.jsx'
import Loader from '../Loader.jsx'

// Converte ISO -> valor de input datetime-local
function toLocalInput(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d)) return ''
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString().slice(0, 16)
}

function emptyFromFields(fields) {
  const obj = {}
  fields.forEach((f) => {
    obj[f.name] = f.default !== undefined ? f.default : f.type === 'checkbox' ? true : ''
  })
  return obj
}

export default function CrudManager({
  entity,
  title,
  subtitle,
  columns,
  fields,
  orderby,
  emptyLabel = 'Nenhum registro cadastrado.',
}) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null) // ID atual ou null (novo)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setRows(null)
    list(entity, { orderby })
      .then(setRows)
      .catch((e) => {
        setRows([])
        setError(e.message)
      })
  }, [entity, orderby])

  useEffect(() => {
    load()
  }, [load])

  function openNew() {
    setEditing(null)
    setForm(emptyFromFields(fields))
    setModalOpen(true)
  }

  function openEdit(row) {
    setEditing(row.ID)
    const f = {}
    fields.forEach((field) => {
      let v = row[field.name]
      if (field.type === 'datetime-local') v = toLocalInput(v)
      f[field.name] = v ?? (field.type === 'checkbox' ? false : '')
    })
    setForm(f)
    setModalOpen(true)
  }

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {}
      fields.forEach((field) => {
        let v = form[field.name]
        if (field.type === 'datetime-local' && v) v = new Date(v).toISOString()
        if (field.type === 'number' && v === '') v = null
        payload[field.name] = v
      })
      if (editing) await update(entity, editing, payload)
      else await create(entity, payload)
      setModalOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function del(row) {
    if (!window.confirm(`Excluir "${row[columns[0].key] || 'este registro'}"?`)) return
    try {
      await remove(entity, row.ID)
      load()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-800">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500">{subtitle}</p>}
        </div>
        <button onClick={openNew} className="admin-btn bg-brand text-white hover:bg-brand-light">
          + Novo
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        {rows === null ? (
          <Loader />
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-slate-400">{emptyLabel}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  {columns.map((c) => (
                    <th key={c.key} className="px-4 py-3 font-semibold">
                      {c.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((row) => (
                  <tr key={row.ID} className="hover:bg-slate-50/50">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-slate-700">
                        {c.render ? c.render(row[c.key], row) : row[c.key]}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEdit(row)}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/10"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => del(row)}
                          className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        title={editing ? `Editar ${title}` : `Novo registro`}
        onClose={() => setModalOpen(false)}
        wide
        footer={
          <>
            <button onClick={() => setModalOpen(false)} className="admin-btn bg-slate-100 text-slate-600 hover:bg-slate-200">
              Cancelar
            </button>
            <button
              form="crud-form"
              type="submit"
              disabled={saving}
              className="admin-btn bg-brand text-white hover:bg-brand-light"
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </>
        }
      >
        <form id="crud-form" onSubmit={save} className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <Field key={field.name} field={field} value={form[field.name]} onChange={setField} />
          ))}
        </form>
      </Modal>
    </div>
  )
}
