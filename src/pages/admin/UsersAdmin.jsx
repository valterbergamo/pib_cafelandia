import { useEffect, useState, useCallback } from 'react'
import { list, create, update, remove } from '../../api/client.js'
import { useAuth } from '../../context/AuthContext.jsx'
import Modal from '../../components/admin/Modal.jsx'
import Loader from '../../components/Loader.jsx'

const EMPTY = { username: '', email: '', password: '', role: 'user', active: true }

export default function UsersAdmin() {
  const { user } = useAuth()
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)

  const load = useCallback(() => {
    setRows(null)
    list('Users', { orderby: 'username asc' })
      .then(setRows)
      .catch((e) => {
        setRows([])
        setError(e.message)
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  function openNew() {
    setEditing(null)
    setForm(EMPTY)
    setOpen(true)
  }
  function openEdit(row) {
    setEditing(row.ID)
    setForm({ username: row.username || '', email: row.email || '', password: '', role: row.role || 'user', active: row.active !== false })
    setOpen(true)
  }
  function set(name, value) {
    setForm((p) => ({ ...p, [name]: value }))
  }

  async function save(e) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        const payload = { username: form.username, email: form.email, role: form.role, active: form.active }
        if (form.password) payload.password = form.password // só atualiza se preenchido
        await update('Users', editing, payload)
      } else {
        if (!form.password) throw new Error('Defina uma senha para o novo usuário.')
        await create('Users', { ...form, datetime: new Date().toISOString() })
      }
      setOpen(false)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function del(row) {
    if (row.username === user?.username) {
      alert('Você não pode excluir o seu próprio usuário.')
      return
    }
    if (!window.confirm(`Excluir o usuário "${row.username}"?`)) return
    try {
      await remove('Users', row.ID)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-800">Usuários</h1>
          <p className="text-sm text-slate-500">Gerencie os acessos ao painel administrativo.</p>
        </div>
        <button onClick={openNew} className="admin-btn bg-brand text-white hover:bg-brand-light">
          + Novo usuário
        </button>
      </div>

      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        {rows === null ? (
          <Loader />
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-slate-400">Nenhum usuário.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Usuário</th>
                  <th className="px-4 py-3 font-semibold">E-mail</th>
                  <th className="px-4 py-3 font-semibold">Papel</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r) => (
                  <tr key={r.ID} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-700">{r.username}</td>
                    <td className="px-4 py-3 text-slate-600">{r.email || '—'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          r.role === 'admin'
                            ? 'bg-brand/10 text-brand'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {r.role || 'user'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {r.active !== false ? (
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Ativo</span>
                      ) : (
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">Inativo</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(r)} className="rounded-md px-2.5 py-1 text-xs font-medium text-brand hover:bg-brand/10">
                          Editar
                        </button>
                        <button onClick={() => del(r)} className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50">
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
        open={open}
        title={editing ? 'Editar usuário' : 'Novo usuário'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button onClick={() => setOpen(false)} className="admin-btn bg-slate-100 text-slate-600 hover:bg-slate-200">
              Cancelar
            </button>
            <button form="user-form" type="submit" disabled={saving} className="admin-btn bg-brand text-white hover:bg-brand-light">
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </>
        }
      >
        <form id="user-form" onSubmit={save} className="space-y-4">
          <div>
            <label className="label">Usuário *</label>
            <input className="input" value={form.username} onChange={(e) => set('username', e.target.value)} required />
          </div>
          <div>
            <label className="label">E-mail</label>
            <input type="email" className="input" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className="label">{editing ? 'Nova senha (deixe em branco para manter)' : 'Senha *'}</label>
            <input
              type="password"
              className="input"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              required={!editing}
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="label">Papel</label>
            <select className="input" value={form.role} onChange={(e) => set('role', e.target.value)}>
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set('active', e.target.checked)}
              className="h-5 w-5 rounded border-slate-300 text-brand focus:ring-brand"
            />
            <span className="text-sm font-medium text-slate-600">Ativo</span>
          </label>
        </form>
      </Modal>
    </div>
  )
}
