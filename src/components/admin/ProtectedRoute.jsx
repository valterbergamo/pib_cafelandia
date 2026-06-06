import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ProtectedRoute({ children, requireAdmin = true }) {
  const { isAuthenticated, isAdmin } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  if (requireAdmin && !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Acesso restrito</h1>
          <p className="mt-2 text-slate-500">Sua conta não tem permissão de administrador.</p>
        </div>
      </div>
    )
  }
  return children
}
