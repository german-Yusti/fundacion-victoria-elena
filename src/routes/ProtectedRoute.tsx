import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { PageLoader } from '@/components/ui/Spinner'
import type { AppRole } from '@/lib/types'

interface Props {
  children: React.ReactNode
  allowedRoles?: AppRole[]
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { session, loading, roles } = useAuth()

  if (loading) return <PageLoader />

  if (!session) return <Navigate to="/login" replace />

  if (allowedRoles && allowedRoles.length > 0) {
    const hasAccess = allowedRoles.some(r => roles.includes(r))
    if (!hasAccess) return <Navigate to="/" replace />
  }

  return <>{children}</>
}
