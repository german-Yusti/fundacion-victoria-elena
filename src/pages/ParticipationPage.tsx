import { useState, useEffect } from 'react'
import { useActivities } from '@/hooks/useActivities'
import { useParticipation } from '@/hooks/useParticipation'
import { Card, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { PageLoader } from '@/components/ui/Spinner'
import { PARTICIPATION_LEVELS } from '@/lib/constants'
import { Star } from 'lucide-react'

export default function ParticipationPage() {
  const { activities } = useActivities()
  const { records, students, loading, loadForActivity, save } = useParticipation()
  const [selectedActivity, setSelectedActivity] = useState('')
  const [entries, setEntries] = useState<Record<string, { calificacion: number; observacion: string }>>({})
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const activity = activities.find(a => a.id === selectedActivity)

  useEffect(() => {
    if (activity) {
      loadForActivity(activity.id, activity.programa_id, activity.subprograma_id)
    }
  }, [selectedActivity, activity, loadForActivity])

  useEffect(() => {
    const initial: Record<string, { calificacion: number; observacion: string }> = {}
    students.forEach(s => {
      const existing = records.find(r => r.estudiante_id === s.id)
      initial[s.id] = {
        calificacion: existing?.calificacion ?? 3,
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
      calificacion: vals.calificacion,
      observacion: vals.observacion,
    }))
    const { error } = await save(selectedActivity, data)
    if (!error) setSuccess(true)
    setSaving(false)
  }

  const getLevelBadge = (score: number) => {
    const level = PARTICIPATION_LEVELS[score]
    if (!level) return null
    const variant = score <= 2 ? 'danger' : score === 3 ? 'warning' : 'success'
    return <Badge variant={variant}>{level.label}</Badge>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Participación</h1>
        <p className="text-muted text-sm mt-1">Evaluar participación de estudiantes por actividad</p>
      </div>

      <Card>
        <CardContent>
          <Select
            label="Seleccionar actividad"
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
                    <tr><Th>Estudiante</Th><Th>Calificación</Th><Th>Nivel</Th><Th>Observación</Th></tr>
                  </Thead>
                  <tbody>
                    {students.map(s => (
                      <Tr key={s.id}>
                        <Td className="font-medium">{s.apellidos}, {s.nombres}</Td>
                        <Td>
                          <select
                            value={entries[s.id]?.calificacion ?? 3}
                            onChange={e => setEntries({ ...entries, [s.id]: { ...entries[s.id], calificacion: Number(e.target.value) } })}
                            className="px-2 py-1 text-sm border border-border rounded focus:outline-none focus:border-accent"
                          >
                            {[1, 2, 3, 4, 5].map(v => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                          </select>
                        </Td>
                        <Td>{getLevelBadge(entries[s.id]?.calificacion ?? 3)}</Td>
                        <Td>
                          <input
                            type="text"
                            value={entries[s.id]?.observacion ?? ''}
                            onChange={e => setEntries({ ...entries, [s.id]: { ...entries[s.id], observacion: e.target.value } })}
                            className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:border-accent"
                            placeholder="Observación"
                          />
                        </Td>
                      </Tr>
                    ))}
                  </tbody>
                </Table>
                <div className="flex items-center justify-between mt-4">
                  {success && <p className="text-success text-sm font-medium">Participación guardada correctamente</p>}
                  <div className="ml-auto">
                    <Button onClick={handleSave} disabled={saving}>
                      <Star size={16} />
                      {saving ? 'Guardando...' : 'Guardar participación'}
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
