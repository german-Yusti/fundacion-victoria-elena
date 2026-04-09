import { useEffect, useState } from 'react'
import {
  estudiantes, programas, actividades, asistencias, participaciones,
  profiles, resolveActividad, getAlertas, type Alerta,
} from '@/lib/mockData'

interface DashboardData {
  totalStudents: number
  activeStudents: number
  activePrograms: number
  monthActivities: number
  alerts: number
  avgParticipation: number
  recentActivities: any[]
  attendanceByProgram: { programa: string; porcentaje: number }[]
  alertsList: Alerta[]
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalStudents: 0,
    activeStudents: 0,
    activePrograms: 0,
    monthActivities: 0,
    alerts: 0,
    avgParticipation: 0,
    recentActivities: [],
    attendanceByProgram: [],
    alertsList: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const now = new Date()
    const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

    const totalStudents = estudiantes.length
    const activeStudents = estudiantes.filter(s => s.status === 'activo').length
    const activePrograms = programas.filter(p => p.status === 'activo').length
    const monthActivities = actividades.filter(a => a.fecha >= firstOfMonth).length
    const seguimientoEspecial = estudiantes.filter(s => s.status === 'seguimiento_especial').length

    // Average participation
    const avg = participaciones.length > 0
      ? participaciones.reduce((sum, p) => sum + p.calificacion, 0) / participaciones.length
      : 0

    // Attendance by program
    const activeProgs = programas.filter(p => p.status === 'activo')
    const attendanceByProgram = activeProgs.map(prog => {
      const progActivities = actividades.filter(a => a.programa_id === prog.id)
      const actIds = progActivities.map(a => a.id)
      const progAsistencias = asistencias.filter(a => actIds.includes(a.actividad_id))
      const total = progAsistencias.length
      const present = progAsistencias.filter(a => a.asistio).length
      return {
        programa: prog.nombre,
        porcentaje: total > 0 ? Math.round((present / total) * 100) : 0,
      }
    })

    // Recent activities (last 5)
    const recentActivities = actividades
      .map(resolveActividad)
      .sort((a, b) => b.fecha.localeCompare(a.fecha))
      .slice(0, 5)

    // Alerts
    const alertsList = getAlertas()

    setData({
      totalStudents,
      activeStudents,
      activePrograms,
      monthActivities,
      alerts: seguimientoEspecial + alertsList.filter(a => a.tipo === 'baja_participacion').length,
      avgParticipation: Math.round(avg * 10) / 10,
      recentActivities,
      attendanceByProgram,
      alertsList,
    })
    setLoading(false)
  }, [])

  return { data, loading }
}
