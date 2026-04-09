import { useState, type FormEvent } from 'react'
import { useStudents } from '@/hooks/useStudents'
import { usePrograms } from '@/hooks/usePrograms'
import { useSubprograms } from '@/hooks/useSubprograms'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Modal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/Spinner'
import { STUDENT_STATUS_LABELS, DOCUMENT_TYPES } from '@/lib/constants'
import { Plus, Search } from 'lucide-react'

export default function StudentsPage() {
  const [filters, setFilters] = useState({ search: '', status: '', programa_id: '', subprograma_id: '' })
  const { students, loading, create } = useStudents(filters)
  const { programs } = usePrograms()
  const { subprograms } = useSubprograms()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    nombres: '', apellidos: '', tipo_documento: 'CC', numero_documento: '',
    fecha_nacimiento: '', fecha_ingreso: new Date().toISOString().split('T')[0],
    programa_id: '', subprograma_id: '', acudiente_nombre: '', acudiente_telefono: '',
    status: 'activo', autorizacion_datos: false, autorizacion_imagen: false,
  })

  const filteredSubprograms = subprograms.filter(s => !form.programa_id || s.programa_id === form.programa_id)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.programa_id) { setError('Selecciona un programa'); return }
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      fecha_nacimiento: form.fecha_nacimiento || null,
      subprograma_id: form.subprograma_id || null,
      acudiente_nombre: form.acudiente_nombre || null,
      acudiente_telefono: form.acudiente_telefono || null,
    }
    const { error } = await create(payload)
    if (error) setError((error as any).message || 'Error al crear estudiante')
    else {
      setOpen(false)
      setForm({
        nombres: '', apellidos: '', tipo_documento: 'CC', numero_documento: '',
        fecha_nacimiento: '', fecha_ingreso: new Date().toISOString().split('T')[0],
        programa_id: '', subprograma_id: '', acudiente_nombre: '', acudiente_telefono: '',
        status: 'activo', autorizacion_datos: false, autorizacion_imagen: false,
      })
    }
    setSaving(false)
  }

  if (loading && students.length === 0) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Estudiantes</h1>
          <p className="text-muted text-sm mt-1">Registro y consulta de estudiantes</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Nuevo estudiante</Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                placeholder="Buscar por nombre o documento..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border focus:border-accent focus:outline-none"
              />
            </div>
            <Select
              value={filters.status}
              onChange={e => setFilters({ ...filters, status: e.target.value })}
              options={[
                { value: 'activo', label: 'Activo' },
                { value: 'inactivo', label: 'Inactivo' },
                { value: 'seguimiento_especial', label: 'Seguimiento especial' },
              ]}
              placeholder="Todos los estados"
            />
            <Select
              value={filters.programa_id}
              onChange={e => setFilters({ ...filters, programa_id: e.target.value })}
              options={programs.map(p => ({ value: p.id, label: p.nombre }))}
              placeholder="Todos los programas"
            />
            <Select
              value={filters.subprograma_id}
              onChange={e => setFilters({ ...filters, subprograma_id: e.target.value })}
              options={subprograms.filter(s => !filters.programa_id || s.programa_id === filters.programa_id).map(s => ({ value: s.id, label: s.nombre }))}
              placeholder="Todos los subprogramas"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="!p-0">
          <Table>
            <Thead>
              <tr>
                <Th>Nombre</Th><Th>Documento</Th><Th>Programa</Th><Th>Subprograma</Th><Th>Acudiente</Th><Th>Estado</Th>
              </tr>
            </Thead>
            <tbody>
              {students.map(s => (
                <Tr key={s.id}>
                  <Td className="font-medium">{s.apellidos}, {s.nombres}</Td>
                  <Td>{s.tipo_documento} {s.numero_documento}</Td>
                  <Td>{s.programa?.nombre || '—'}</Td>
                  <Td>{s.subprograma?.nombre || '—'}</Td>
                  <Td>{s.acudiente_nombre || '—'}</Td>
                  <Td><Badge variant={statusBadgeVariant(s.status)}>{STUDENT_STATUS_LABELS[s.status]}</Badge></Td>
                </Tr>
              ))}
              {students.length === 0 && (
                <tr><Td className="text-center text-muted !py-8" colSpan={6}>No se encontraron estudiantes</Td></tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal open={open} onClose={() => setOpen(false)} title="Registrar estudiante" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3">{error}</div>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombres" value={form.nombres} onChange={e => setForm({ ...form, nombres: e.target.value })} required />
            <Input label="Apellidos" value={form.apellidos} onChange={e => setForm({ ...form, apellidos: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Tipo de documento" value={form.tipo_documento} onChange={e => setForm({ ...form, tipo_documento: e.target.value })} options={DOCUMENT_TYPES} />
            <Input label="Número de documento" value={form.numero_documento} onChange={e => setForm({ ...form, numero_documento: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Fecha de nacimiento" type="date" value={form.fecha_nacimiento} onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })} />
            <Input label="Fecha de ingreso" type="date" value={form.fecha_ingreso} onChange={e => setForm({ ...form, fecha_ingreso: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Programa" value={form.programa_id} onChange={e => setForm({ ...form, programa_id: e.target.value, subprograma_id: '' })} options={programs.map(p => ({ value: p.id, label: p.nombre }))} placeholder="Seleccionar" />
            <Select label="Subprograma (opcional)" value={form.subprograma_id} onChange={e => setForm({ ...form, subprograma_id: e.target.value })} options={filteredSubprograms.map(s => ({ value: s.id, label: s.nombre }))} placeholder="Ninguno" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Nombre del acudiente" value={form.acudiente_nombre} onChange={e => setForm({ ...form, acudiente_nombre: e.target.value })} />
            <Input label="Teléfono del acudiente" value={form.acudiente_telefono} onChange={e => setForm({ ...form, acudiente_telefono: e.target.value })} />
          </div>
          <Select label="Estado" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }, { value: 'seguimiento_especial', label: 'Seguimiento especial' }]} />
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.autorizacion_datos} onChange={e => setForm({ ...form, autorizacion_datos: e.target.checked })} className="rounded" />
              Autorización de tratamiento de datos personales
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.autorizacion_imagen} onChange={e => setForm({ ...form, autorizacion_imagen: e.target.checked })} className="rounded" />
              Autorización de uso de imagen
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Registrar estudiante'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
