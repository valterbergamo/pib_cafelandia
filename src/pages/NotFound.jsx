import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <p className="font-serif text-7xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-dark">Página não encontrada</h1>
      <p className="mt-2 text-slate-500">A página que você procura não existe ou foi movida.</p>
      <Link to="/" className="btn-primary mt-8">
        Voltar para o início
      </Link>
    </div>
  )
}
