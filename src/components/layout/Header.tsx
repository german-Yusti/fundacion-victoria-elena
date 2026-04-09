import { useAuth } from '@/contexts/AuthContext'
import { LogOut, ChevronDown } from 'lucide-react'
import { ROLE_LABELS } from '@/lib/constants'

export function Header() {
  const { profile, roles, signOut } = useAuth()

  const roleColor: Record<string, string> = {
    coordinacion: 'bg-blue-100 text-blue-700',
    profesional: 'bg-purple-100 text-purple-700',
    estudiante: 'bg-emerald-100 text-emerald-700',
  }

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-8 shrink-0">
      <div />
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {profile?.full_name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800 leading-tight">{profile?.full_name}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {roles.map(r => (
                <span key={r} className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${roleColor[r] || 'bg-slate-100 text-slate-600'}`}>
                  {ROLE_LABELS[r] || r}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="w-px h-8 bg-slate-200" />
        <button
          onClick={signOut}
          className="flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer text-sm"
          title="Cerrar sesión"
        >
          <LogOut size={16} />
          <span className="text-xs font-medium hidden sm:inline">Salir</span>
        </button>
      </div>
    </header>
  )
}
