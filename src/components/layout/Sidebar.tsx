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
    <aside className="w-64 bg-primary text-white min-h-screen flex flex-col shrink-0">
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-lg font-bold leading-tight">Fundación Victoria Elena</h1>
        <p className="text-sm text-white/60 mt-1">
          {roles.length > 0 ? ROLE_LABELS[roles[0]] || roles[0] : 'Sistema'}
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navSections.map(section => {
          const visibleItems = section.items.filter(item => {
            if (!item.rolesRequired) return true
            return item.rolesRequired.some(r => roles.includes(r as any))
          })
          if (visibleItems.length === 0) return null
          return (
            <div key={section.title}>
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
                {section.title}
              </p>
              <ul className="space-y-1">
                {visibleItems.map(item => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        clsx(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                          isActive
                            ? 'bg-white/15 text-white font-medium'
                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                        )
                      }
                    >
                      <item.icon size={18} />
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
