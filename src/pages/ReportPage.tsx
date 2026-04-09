import { useState, useEffect } from 'react'
import { usePrograms } from '@/hooks/usePrograms'
import { useSubprograms } from '@/hooks/useSubprograms'
import { useProfesionales } from '@/hooks/useUsers'
import {
  estudiantes as allStudents, asistencias, participaciones,
  actividades, profiles, resolveEstudiante,
} from '@/lib/mockData'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { Users, UserCheck, AlertTriangle, ClipboardCheck, Star, FileBarChart } from 'lucide-react'

interface ReportRow {
  id: string
  nombre: string
  programa: string
  subprograma: string
  profesional: string
  ultimaActividad: string
  asistencia_pct: number
  ultima_asistencia: string
  participacion_avg: number
  status: string
  alerta: boolean
  observacion: string
}

export default function ReportPage() {
  const { programs } = usePrograms()
  const { subprograms } = useSubprograms()
  const profesionales = useProfesionales()

  const [filters, setFilters] = useState({
    programa_id: '', subprograma_id: '', profesional_id: '', status: '',
    alerta: '', fecha_desde: '', fecha_hasta: '',
  })
  const [rows, setRows] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(false)
  const [kpis, setKpis] = useState({ total: 0, activos: 0, alertas: 0, asistencia_avg: 0, participacion_avg: 0 })

  useEffect(() => {
    setLoading(true)

    let students = allStudents.map(resolveEstudiante)
    if (filters.programa_id) students = students.filter(s => s.programa_id === filters.programa_id)
    if (filters.subprograma_id) students = students.filter(s => s.subprograma_id === filters.subprograma_id)
    if (filters.status) students = students.filter(s => s.status === filters.status)
    if (filters.profesional_id) {
      students = students.filter(s => s.programa?.profesional_id === filters.profesional_id)
    }

    const profMap = new Map(profiles.map(p => [p.id, p.full_name]))

    const reportRows: ReportRow[] = students.map(s => {
      let studentAsistencias = asistencias.filter(a => a.estudiante_id === s.id)
      let studentParticipaciones = participaciones.filter(p => p.estudiante_id === s.id)

      // Date filter
      if (filters.fecha_desde || filters.fecha_hasta) {
        const actMap = new Map(actividades.map(a => [a.id, a.fecha]))
        if (filters.fecha_desde) {
          studentAsistencias = studentAsistencias.filter(a => (actMap.get(a.actividad_id) || '') >= filters.fecha_desde)
          studentParticipaciones = studentParticipaciones.filter(p => (actMap.get(p.actividad_id) || '') >= filters.fecha_desde)
        }
        if (filters.fecha_hasta) {
          studentAsistencias = studentAsistencias.filter(a => (actMap.get(a.actividad_id) || '') <= filters.fecha_hasta)
          studentParticipaciones = studentParticipaciones.filter(p => (actMap.get(p.actividad_id) || '') <= filters.fecha_hasta)
        }
      }

      const totalAtt = studentAsistencias.length
      const presentAtt = studentAsistencias.filter(a => a.asistio).length
      const asistencia_pct = totalAtt > 0 ? Math.round((presentAtt / totalAtt) * 100) : 0

      const totalPart = studentParticipaciones.length
      const sumPart = studentParticipaciones.reduce((sum, p) => sum + p.calificacion, 0)
      const participacion_avg = totalPart > 0 ? Math.round((sumPart / totalPart) * 10) / 10 : 0

      // Find last attendance date
      const attendedDates = studentAsistencias
        .filter(a => a.asistio)
        .map(a => actividades.find(act => act.id === a.actividad_id)?.fecha)
        .filter(Boolean)
        .sort() as string[]
      const ultima_asistencia = attendedDates.length > 0 ? attendedDates[attendedDates.length - 1] : '—'

      // Last activity
      const studentActIds = [...new Set([...studentAsistencias.map(a => a.actividad_id), ...studentParticipaciones.map(p => p.actividad_id)])]
      const studentActs = actividades.filter(a => studentActIds.includes(a.id)).sort((a, b) => b.fecha.localeCompare(a.fecha))
      const ultimaActividad = studentActs.length > 0 ? studentActs[0].nombre : '—'

      const alerta = asistencia_pct < 60 || participacion_avg < 2.5 || s.status === 'seguimiento_especial'

      // Observacion
      let observacion = ''
      if (s.status === 'seguimiento_especial') observacion = 'Seguimiento especial'
      else if (participacion_avg > 0 && participacion_avg < 2.5) observacion = 'Baja participación'
      else if (asistencia_pct < 60 && totalAtt > 0) observacion = 'Baja asistencia'

      return {
        id: s.id,
        nombre: `${s.apellidos}, ${s.nombres}`,
        programa: s.programa?.nombre || '—',
        subprograma: s.subprograma?.nombre || '—',
        profesional: profMap.get(s.programa?.profesional_id || '') || '—',
        ultimaActividad,
        asistencia_pct,
        ultima_asistencia,
        participacion_avg,
        status: s.status,
        alerta,
        observacion,
      }
    })

    // Filter by alert
    let filteredRows = reportRows
    if (filters.alerta === 'si') filteredRows = reportRows.filter(r => r.alerta)
    if (filters.alerta === 'no') filteredRows = reportRows.filter(r => !r.alerta)

    const total = filteredRows.length
    const activos = filteredRows.filter(r => r.status === 'activo').length
    const alertas = filteredRows.filter(r => r.alerta).length
    const asistencia_avg = total > 0 ? Math.round(filteredRows.reduce((s, r) => s + r.asistencia_pct, 0) / total) : 0
    const participacion_avg_global = total > 0 ? Math.round(filteredRows.reduce((s, r) => s + r.participacion_avg, 0) / total * 10) / 10 : 0

    setKpis({ total, activos, alertas, asistencia_avg, participacion_avg: participacion_avg_global })
    setRows(filteredRows)
    setLoading(false)
  }, [filters, programs, subprograms, profesionales])

  const statusLabel: Record<string, string> = { activo: 'Activo', inactivo: 'Inactivo', seguimiento_especial: 'Seguimiento' }
  const statusVariant = (s: string) => s === 'activo' ? 'success' as const : s === 'seguimiento_especial' ? 'warning' as const : 'neutral' as const

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <FileBarChart size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Reporte de seguimiento</h1>
          <p className="text-slate-500 text-sm mt-0.5">Consolidado de seguimiento de estudiantes</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
            <Select value={filters.programa_id} onChange={e => setFilters({ ...filters, programa_id: e.target.value })} options={programs.map(p => ({ value: p.id, label: p.nombre }))} placeholder="Programa" />
            <Select value={filters.subprograma_id} onChange={e => setFilters({ ...filters, subprograma_id: e.target.value })} options={subprograms.filter(s => !filters.programa_id || s.programa_id === filters.programa_id).map(s => ({ value: s.id, label: s.nombre }))} placeholder="Subprograma" />
            <Select value={filters.profesional_id} onChange={e => setFilters({ ...filters, profesional_id: e.target.value })} options={profesionales.map(p => ({ value: p.id, label: p.full_name }))} placeholder="Profesional" />
            <Select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }, { value: 'seguimiento_especial', label: 'Seguimiento especial' }]} placeholder="Estado" />
            <Select value={filters.alerta} onChange={e => setFilters({ ...filters, alerta: e.target.value })} options={[{ value: 'si', label: 'Con alerta' }, { value: 'no', label: 'Sin alerta' }]} placeholder="Alertas" />
            <Input type="date" value={filters.fecha_desde} onChange={e => setFilters({ ...filters, fecha_desde: e.target.value })} placeholder="Desde" />
            <Input type="date" value={filters.fecha_hasta} onChange={e => setFilters({ ...filters, fecha_hasta: e.target.value })} placeholder="Hasta" />
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: 'Total estudiantes', value: kpis.total, icon: Users, color: 'text-blue-600 bg-blue-50' },
          { label: 'Activos', value: kpis.activos, icon: UserCheck, color: 'text-green-600 bg-green-50' },
          { label: 'Con alerta', value: kpis.alertas, icon: AlertTriangle, color: 'text-yellow-600 bg-yellow-50' },
          { label: 'Asistencia prom.', value: `${kpis.asistencia_avg}%`, icon: ClipboardCheck, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Participación prom.', value: kpis.participacion_avg, icon: Star, color: 'text-orange-600 bg-orange-50' },
        ].map(k => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-3 !py-3">
              <div className={`p-2 rounded-lg ${k.color}`}><k.icon size={18} /></div>
              <div>
                <p className="text-xl font-bold text-gray-900">{k.value}</p>
                <p className="text-xs text-muted">{k.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardContent className="!p-0">
          {loading ? <PageLoader /> : (
            <Table>
              <Thead>
                <tr>
                  <Th>Estudiante</Th><Th>Programa</Th><Th>Subprograma</Th><Th>Última actividad</Th><Th>Profesional</Th>
                  <Th>Asistencia %</Th><Th>Última asist.</Th><Th>Partic. prom.</Th><Th>Estado</Th><Th>Alerta</Th><Th>Observación</Th>
                </tr>
              </Thead>
              <tbody>
                {rows.map(r => (
                  <Tr key={r.id}>
                    <Td className="font-medium">{r.nombre}</Td>
                    <Td>{r.programa}</Td>
                    <Td>{r.subprograma}</Td>
                    <Td className="text-xs">{r.ultimaActividad}</Td>
                    <Td>{r.profesional}</Td>
                    <Td>
                      <span className={r.asistencia_pct < 60 && r.asistencia_pct > 0 ? 'text-danger font-semibold' : ''}>{r.asistencia_pct}%</span>
                    </Td>
                    <Td>{r.ultima_asistencia}</Td>
                    <Td>
                      <span className={r.participacion_avg > 0 && r.participacion_avg < 2.5 ? 'text-danger font-semibold' : ''}>{r.participacion_avg}</span>
                    </Td>
                    <Td><Badge variant={statusVariant(r.status)}>{statusLabel[r.status] || r.status}</Badge></Td>
                    <Td>
                      {r.alerta && <Badge variant="danger">Alerta</Badge>}
                    </Td>
                    <Td className="text-xs text-muted">{r.observacion}</Td>
                  </Tr>
                ))}
                {rows.length === 0 && (
                  <tr><Td className="text-center text-muted !py-8" colSpan={11}>No se encontraron datos</Td></tr>
                )}
              </tbody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
