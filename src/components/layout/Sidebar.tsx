import { NavLink } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  FolderOpen,
  FolderTree,
  CalendarDays,
  ClipboardCheck,
  Star,
  FileImage,
  FileBarChart,
  UserCog,
  Shield,
} from 'lucide-react'
import { clsx } from 'clsx'
import { ROLE_LABELS } from '@/lib/constants'

interface NavItem {
  to: string
  icon: any
  label: string
  rolesRequired?: string[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Principal',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/estudiantes', icon: GraduationCap, label: 'Estudiantes' },
      { to: '/programas', icon: FolderOpen, label: 'Programas' },
      { to: '/subprogramas', icon: FolderTree, label: 'Subprogramas' },
      { to: '/actividades', icon: CalendarDays, label: 'Actividades' },
    ],
  },
  {
    title: 'Seguimiento',
    items: [
      { to: '/asistencia', icon: ClipboardCheck, label: 'Asistencia' },
      { to: '/participacion', icon: Star, label: 'Participación' },
      { to: '/evidencias', icon: FileImage, label: 'Evidencias' },
      { to: '/reportes', icon: FileBarChart, label: 'Reporte de seguimiento' },
    ],
  },
  {
    title: 'Administración',
    items: [
      { to: '/usuarios', icon: UserCog, label: 'Usuarios y roles', rolesRequired: ['coordinacion'] as string[] },
    ],
  },
]

export function Sidebar() {
  const { roles } = useAuth()

  return (
    <aside className="w-[270px] bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white min-h-screen flex flex-col shrink-0">
      {/* Logo / Brand */}
      <div className="px-6 pt-7 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold leading-tight tracking-tight">Fundación</h1>
            <h1 className="text-[15px] font-bold leading-tight tracking-tight">Victoria Elena</h1>
          </div>
        </div>
        <div className="mt-4 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 inline-flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">
            {roles.length > 0 ? ROLE_LABELS[roles[0]] || roles[0] : 'Sistema'}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-6 overflow-y-auto">
        {navSections.map(section => {
          const visibleItems = section.items.filter(item => {
            if (!item.rolesRequired) return true
            return item.rolesRequired.some(r => roles.includes(r as any))
          })
          if (visibleItems.length === 0) return null
          return (
            <div key={section.title}>
              <p className="px-3 mb-2.5 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                {section.title}
              </p>
              <ul className="space-y-0.5">
                {visibleItems.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                          isActive
                            ? 'bg-gradient-to-r from-blue-600/90 to-blue-500/80 text-white shadow-md shadow-blue-500/15'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        )
                      }
                    >
                      <item.icon size={18} strokeWidth={1.8} />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[10px] text-slate-600 text-center">v1.0 Demo</p>
      </div>
    </aside>
  )
}
