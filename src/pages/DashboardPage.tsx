import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { ACTIVITY_STATUS_LABELS } from '@/lib/constants'
import { Users, UserCheck, FolderOpen, CalendarDays, AlertTriangle, Star, TrendingUp } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const kpiConfig = [
  { key: 'totalStudents', label: 'Total estudiantes', icon: Users, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', shadow: 'shadow-blue-500/10' },
  { key: 'activeStudents', label: 'Estudiantes activos', icon: UserCheck, gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', shadow: 'shadow-emerald-500/10' },
  { key: 'activePrograms', label: 'Programas activos', icon: FolderOpen, gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', shadow: 'shadow-purple-500/10' },
  { key: 'monthActivities', label: 'Actividades del mes', icon: CalendarDays, gradient: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', shadow: 'shadow-indigo-500/10' },
  { key: 'alerts', label: 'Alertas activas', icon: AlertTriangle, gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', shadow: 'shadow-amber-500/10' },
  { key: 'avgParticipation', label: 'Participación prom.', icon: Star, gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', shadow: 'shadow-orange-500/10' },
]

export default function DashboardPage() {
  const { data, loading } = useDashboard()

  if (loading) return <PageLoader />

  const alertTypeLabels: Record<string, string> = {
    inasistencia: 'Inasistencia',
    baja_participacion: 'Baja participación',
    seguimiento_especial: 'Seguimiento especial',
  }

  const alertTypeVariant = (tipo: string) => {
    if (tipo === 'seguimiento_especial') return 'warning' as const
    if (tipo === 'baja_participacion') return 'danger' as const
    return 'neutral' as const
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard de Coordinación</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen general del seguimiento de estudiantes y programas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiConfig.map(kpi => (
          <Card key={kpi.key} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="!py-5 !px-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{(data as any)[kpi.key]}</p>
                  <p className="text-[11px] font-medium text-slate-500 mt-1">{kpi.label}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center shadow-lg ${kpi.shadow}`}>
                  <kpi.icon size={18} className="text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900">Asistencia por programa</h3>
                <p className="text-xs text-slate-400 mt-0.5">Porcentaje de asistencia general</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <TrendingUp size={16} className="text-blue-500" />
              </div>
            </div>
            {data.attendanceByProgram.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.attendanceByProgram}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="programa" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Bar dataKey="porcentaje" fill="url(#blueGradient)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-sm py-8 text-center">No hay datos de asistencia aún</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-slate-900">Actividades recientes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Últimas actividades registradas</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                <CalendarDays size={16} className="text-indigo-500" />
              </div>
            </div>
            {data.recentActivities.length > 0 ? (
              <div className="space-y-1">
                {data.recentActivities.map((act: any) => (
                  <div key={act.id} className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{act.nombre}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {act.programa?.nombre} &middot; {act.profesional?.full_name} &middot; {act.fecha}
                      </p>
                    </div>
                    <Badge variant={statusBadgeVariant(act.status)}>
                      {ACTIVITY_STATUS_LABELS[act.status] || act.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-sm py-8 text-center">No hay actividades registradas</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/10">
                <AlertTriangle size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Alertas recientes</h3>
                <p className="text-xs text-slate-400 mt-0.5">Situaciones que requieren atención</p>
              </div>
            </div>
            <span className="text-sm font-bold text-slate-400">{data.alertsList.length}</span>
          </div>
          {data.alertsList.length > 0 ? (
            <div className="space-y-1">
              {data.alertsList.map(alert => (
                <div key={alert.id} className="flex items-start gap-4 py-3.5 px-4 rounded-xl hover:bg-slate-50 transition-colors">
                  <Badge variant={alertTypeVariant(alert.tipo)} className="mt-0.5 whitespace-nowrap shrink-0">
                    {alertTypeLabels[alert.tipo]}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{alert.estudiante}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{alert.mensaje}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-slate-500">{alert.programa}</p>
                    <p className="text-xs text-slate-400">{alert.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm py-4 text-center">No hay alertas activas</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
