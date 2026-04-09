import { useState, type FormEvent } from 'react'
import { useActivities } from '@/hooks/useActivities'
import { usePrograms } from '@/hooks/usePrograms'
import { useSubprograms } from '@/hooks/useSubprograms'
import { useProfesionales } from '@/hooks/useUsers'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/Spinner'
import { ACTIVITY_STATUS_LABELS } from '@/lib/constants'
import { Plus, Search, CalendarDays } from 'lucide-react'

export default function ActivitiesPage() {
  const [filters, setFilters] = useState({ search: '', status: '', programa_id: '' })
  const { activities, loading, create } = useActivities(filters)
  const { programs } = usePrograms()
  const { subprograms } = useSubprograms()
  const profesionales = useProfesionales()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombre: '', programa_id: '', subprograma_id: '', profesional_id: user?.id ?? '',
    fecha: '', lugar: '', status: 'programada',
  })

  const filteredSubs = subprograms.filter(s => !form.programa_id || s.programa_id === form.programa_id)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.programa_id || !form.profesional_id) { setError('Programa y profesional son requeridos'); return }
    setSaving(true)
    setError('')
    const { error } = await create({
      nombre: form.nombre,
      programa_id: form.programa_id,
      subprograma_id: form.subprograma_id || null,
      profesional_id: form.profesional_id,
      fecha: form.fecha,
      lugar: form.lugar || null,
      status: form.status,
    })
    if (error) setError((error as any).message || 'Error')
    else {
      setOpen(false)
      setForm({ nombre: '', programa_id: '', subprograma_id: '', profesional_id: user?.id ?? '', fecha: '', lugar: '', status: 'programada' })
    }
    setSaving(false)
  }

  if (loading && activities.length === 0) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/10">
            <CalendarDays size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Actividades</h1>
            <p className="text-slate-500 text-sm mt-0.5">Registro de actividades por programa</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Nueva actividad</Button>
      </div>

      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Buscar actividad..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:border-blue-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
            <Select value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })} options={[{ value: 'programada', label: 'Programada' }, { value: 'realizada', label: 'Realizada' }, { value: 'cancelada', label: 'Cancelada' }]} placeholder="Todos los estados" />
            <Select value={filters.programa_id} onChange={e => setFilters({ ...filters, programa_id: e.target.value })} options={programs.map(p => ({ value: p.id, label: p.nombre }))} placeholder="Todos los programas" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <Thead>
              <tr><Th>Actividad</Th><Th>Programa</Th><Th>Subprograma</Th><Th>Profesional</Th><Th>Fecha</Th><Th>Lugar</Th><Th>Estado</Th></tr>
            </Thead>
            <tbody>
              {activities.map(a => (
                <Tr key={a.id}>
                  <Td className="font-semibold text-slate-800">{a.nombre}</Td>
                  <Td>{a.programa?.nombre || '—'}</Td>
                  <Td>{a.subprograma?.nombre || '—'}</Td>
                  <Td>{a.profesional?.full_name || '—'}</Td>
                  <Td>{a.fecha}</Td>
                  <Td>{a.lugar || '—'}</Td>
                  <Td><Badge variant={statusBadgeVariant(a.status)}>{ACTIVITY_STATUS_LABELS[a.status]}</Badge></Td>
                </Tr>
              ))}
              {activities.length === 0 && (
                <tr><Td className="text-center text-slate-400 !py-8" colSpan={7}>No hay actividades</Td></tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Registrar actividad">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 font-medium border border-red-100">{error}</div>}
          <Input label="Nombre de la actividad" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Programa" value={form.programa_id} onChange={e => setForm({ ...form, programa_id: e.target.value, subprograma_id: '' })} options={programs.map(p => ({ value: p.id, label: p.nombre }))} placeholder="Seleccionar" />
            <Select label="Subprograma (opcional)" value={form.subprograma_id} onChange={e => setForm({ ...form, subprograma_id: e.target.value })} options={filteredSubs.map(s => ({ value: s.id, label: s.nombre }))} placeholder="Ninguno" />
          </div>
          <Select label="Profesional responsable" value={form.profesional_id} onChange={e => setForm({ ...form, profesional_id: e.target.value })} options={profesionales.map(p => ({ value: p.id, label: p.full_name }))} placeholder="Seleccionar" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha" type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })} required />
            <Input label="Lugar" value={form.lugar} onChange={e => setForm({ ...form, lugar: e.target.value })} />
          </div>
          <Select label="Estado" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={[{ value: 'programada', label: 'Programada' }, { value: 'realizada', label: 'Realizada' }, { value: 'cancelada', label: 'Cancelada' }]} />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear actividad'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
