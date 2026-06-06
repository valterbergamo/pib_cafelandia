export default function Loader({ label = 'Carregando...' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-brand" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
