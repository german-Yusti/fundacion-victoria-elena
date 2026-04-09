import { useAuth } from '@/contexts/AuthContext'
import { LogOut } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/constants'

export function Header() {
  const { profile, roles, signOut } = useAuth()

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900">{profile?.full_name}</p>
          <p className="text-xs text-muted">
            {roles.map(r => ROLE_LABELS[r] || r).join(', ')}
          </p>
        </div>
        <button
          onClick={signOut}
          className="p-2 text-gray-400 hover:text-danger rounded-lg hover:bg-surface-alt transition-colors cursor-pointer"
          title="Cerrar sesión"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
