import { useState, useEffect } from 'react'
import { useActivities } from '@/hooks/useActivities'
import { useAttendance } from '@/hooks/useAttendance'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { PageLoader } from '@/components/ui/Spinner'
import { ClipboardCheck } from 'lucide-react'

export default function AttendancePage() {
  const { activities } = useActivities({ status: 'realizada' })
  const { records, students, loading, loadForActivity, save } = useAttendance()
  const [selectedActivity, setSelectedActivity] = useState('')
  const [entries, setEntries] = useState<Record<string, { asistio: boolean; observacion: string }>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const activity = activities.find(a => a.id === selectedActivity)

  useEffect(() => {
    if (activity) {
      loadForActivity(activity.id, activity.programa_id, activity.subprograma_id)
    }
  }, [selectedActivity, activity, loadForActivity])

  useEffect(() => {
    const initial: Record<string, { asistio: boolean; observacion: string }> = {}
    students.forEach(s => {
      const existing = records.find(r => r.estudiante_id === s.id)
      initial[s.id] = {
        asistio: existing?.asistio ?? false,
        observacion: existing?.observacion ?? '',
      }
    })
    setEntries(initial)
  }, [students, records])

  const handleSave = async () => {
    if (!selectedActivity) return
    setSaving(true)
    setSuccess(false)
    const data = Object.entries(entries).map(([estudiante_id, vals]) => ({
      estudiante_id,
      asistio: vals.asistio,
      observacion: vals.observacion,
    }))
    const { error } = await save(selectedActivity, data)
    if (!error) setSuccess(true)
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Asistencia</h1>
        <p className="text-muted text-sm mt-1">Registrar asistencia de estudiantes por actividad</p>
      </div>

      <Card>
        <CardContent>
          <Select
            label="Seleccionar actividad realizada"
            value={selectedActivity}
            onChange={e => { setSelectedActivity(e.target.value); setSuccess(false) }}
            options={activities.map(a => ({ value: a.id, label: `${a.nombre} — ${a.fecha}` }))}
            placeholder="Seleccionar una actividad..."
          />
        </CardContent>
      </Card>

      {selectedActivity && (
        <Card>
          <CardContent>
            {loading ? <PageLoader /> : students.length === 0 ? (
              <p className="text-muted text-center py-8">No hay estudiantes activos en este programa</p>
            ) : (
              <>
                <Table>
                  <Thead>
                    <tr><Th>Estudiante</Th><Th className="text-center">Asistió</Th><Th>Observación</Th></tr>
                  </Thead>
                  <tbody>
                    {students.map(s => (
                      <Tr key={s.id}>
                        <Td className="font-medium">{s.apellidos}, {s.nombres}</Td>
                        <Td className="text-center">
                          <input
                            type="checkbox"
                            checked={entries[s.id]?.asistio ?? false}
                            onChange={e => setEntries({ ...entries, [s.id]: { ...entries[s.id], asistio: e.target.checked } })}
                            className="h-5 w-5 rounded border-border text-accent cursor-pointer"
                          />
                        </Td>
                        <Td>
                          <input
                            type="text"
                            value={entries[s.id]?.observacion ?? ''}
                            onChange={e => setEntries({ ...entries, [s.id]: { ...entries[s.id], observacion: e.target.value } })}
                            className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:border-accent"
                            placeholder="Observación opcional"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                  {success && <p className="text-success text-sm font-medium">Asistencia guardada correctamente</p>}
                  <div className="ml-auto">
                    <Button onClick={handleSave} disabled={saving}>
                      <ClipboardCheck size={16} />
                      {saving ? 'Guardando...' : 'Guardar asistencia'}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
