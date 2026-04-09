import { useDashboard } from '@/hooks/useDashboard'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { ACTIVITY_STATUS_LABELS } from '@/lib/constants'
import { Users, UserCheck, FolderOpen, CalendarDays, AlertTriangle, Star } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function DashboardPage() {
  const { data, loading } = useDashboard()

  if (loading) return <PageLoader />

  const kpis = [
    { label: 'Total estudiantes', value: data.totalStudents, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Estudiantes activos', value: data.activeStudents, icon: UserCheck, color: 'text-green-600 bg-green-50' },
    { label: 'Programas activos', value: data.activePrograms, icon: FolderOpen, color: 'text-purple-600 bg-purple-50' },
    { label: 'Actividades del mes', value: data.monthActivities, icon: CalendarDays, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Alertas activas', value: data.alerts, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Participación promedio', value: data.avgParticipation, icon: Star, color: 'text-orange-600 bg-orange-50' },
  ]

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de Coordinación</h1>
        <p className="text-muted text-sm mt-1">Resumen general del seguimiento de estudiantes y programas</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map(kpi => (
          <Card key={kpi.label}>
            <CardContent className="flex items-center gap-3 !py-4">
              <div className={`p-2.5 rounded-lg ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                <p className="text-xs text-muted">{kpi.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-4">Asistencia por programa (%)</h3>
            {data.attendanceByProgram.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.attendanceByProgram}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="programa" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="porcentaje" fill="#3182ce" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted text-sm py-8 text-center">No hay datos de asistencia aún</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-900 mb-4">Actividades recientes</h3>
            {data.recentActivities.length > 0 ? (
              <div className="space-y-3">
                {data.recentActivities.map((act: any) => (
                  <div key={act.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{act.nombre}</p>
                      <p className="text-xs text-muted">
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
              <p className="text-muted text-sm py-8 text-center">No hay actividades registradas</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardContent>
          <h3 className="font-semibold text-gray-900 mb-4">
            <span className="inline-flex items-center gap-2">
              <AlertTriangle size={18} className="text-yellow-600" />
              Alertas recientes
            </span>
          </h3>
          {data.alertsList.length > 0 ? (
            <div className="space-y-3">
              {data.alertsList.map(alert => (
                <div key={alert.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                  <Badge variant={alertTypeVariant(alert.tipo)} className="mt-0.5 whitespace-nowrap">
                    {alertTypeLabels[alert.tipo]}
                  </Badge>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.estudiante}</p>
                    <p className="text-xs text-muted">{alert.mensaje}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted">{alert.programa}</p>
                    <p className="text-xs text-muted">{alert.fecha}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm py-4 text-center">No hay alertas activas</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
