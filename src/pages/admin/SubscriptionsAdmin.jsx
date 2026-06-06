import { useEffect, useState, useCallback } from 'react'
import { list, remove } from '../../api/client.js'
import { formatDateTime } from '../../lib/format.js'
import Loader from '../../components/Loader.jsx'

export default function SubscriptionsAdmin() {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    setRows(null)
    list('Subscriptions', { orderby: 'datetime desc' })
      .then(setRows)
      .catch((e) => {
        setRows([])
        setError(e.message)
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function del(row) {
    if (!window.confirm(`Excluir o contato de "${row.name}"?`)) return
    try {
      await remove('Subscriptions', row.ID)
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-serif text-2xl font-bold text-slate-800">Inscrições / Contatos</h1>
        <p className="text-sm text-slate-500">
          Pessoas que deixaram contato pelo formulário do site.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-100">
        {rows === null ? (
          <Loader />
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-slate-400">Nenhuma inscrição recebida ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">E-mail</th>
                  <th className="px-4 py-3 font-semibold">Telefone</th>
                  <th className="px-4 py-3 font-semibold">Recebido em</th>
                  <th className="px-4 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {rows.map((r) => (
                  <tr key={r.ID} className="hover:bg-slate-50/50">
                    <td className="px-4 py-3 font-medium text-slate-700">{r.name}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {r.email ? (
                        <a href={`mailto:${r.email}`} className="text-brand hover:underline">
                          {r.email}
                        </a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{r.phone || '—'}</td>
                    <td className="px-4 py-3 text-slate-500">{formatDateTime(r.datetime) || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => del(r)}
                        className="rounded-md px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
