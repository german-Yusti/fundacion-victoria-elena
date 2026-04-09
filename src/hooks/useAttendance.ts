import { useState, useCallback } from 'react'
import { asistencias as store, estudiantes, generateId, now } from '@/lib/mockData'
import type { Asistencia, Estudiante } from '@/lib/types'

export function useAttendance() {
  const [records, setRecords] = useState<Asistencia[]>([])
  const [students, setStudents] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(false)

  const loadForActivity = useCallback((actividadId: string, programaId: string, subprogramaId?: string | null) => {
    setLoading(true)

    let filtered = estudiantes.filter(s => s.programa_id === programaId && s.status === 'activo')
    if (subprogramaId) filtered = filtered.filter(s => s.subprograma_id === subprogramaId)
    filtered.sort((a, b) => a.apellidos.localeCompare(b.apellidos))

    const attendance = store.filter(r => r.actividad_id === actividadId)

    setStudents(filtered)
    setRecords(attendance)
    setLoading(false)
  }, [])

  const save = async (actividadId: string, entries: { estudiante_id: string; asistio: boolean; observacion?: string }[]) => {
    for (const entry of entries) {
      const existing = store.findIndex(r => r.actividad_id === actividadId && r.estudiante_id === entry.estudiante_id)
      if (existing >= 0) {
        store[existing] = { ...store[existing], asistio: entry.asistio, observacion: entry.observacion || null, updated_at: now() }
      } else {
        store.push({
          id: generateId(),
          actividad_id: actividadId,
          estudiante_id: entry.estudiante_id,
          asistio: entry.asistio,
          observacion: entry.observacion || null,
          evidencia_url: null,
          created_at: now(),
          updated_at: now(),
        })
      }
    }
    return { error: null }
  }

  return { records, students, loading, loadForActivity, save }
}
