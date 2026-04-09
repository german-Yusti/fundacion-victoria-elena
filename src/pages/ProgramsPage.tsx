import { useState, type FormEvent } from 'react'
import { usePrograms } from '@/hooks/usePrograms'
import { useProfesionales } from '@/hooks/useUsers'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/Spinner'
import { Plus } from 'lucide-react'

export default function ProgramsPage() {
  const { programs, loading, create } = usePrograms()
  const profesionales = useProfesionales()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', descripcion: '', profesional_id: '', status: 'activo' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const { error } = await create({
      nombre: form.nombre,
      descripcion: form.descripcion || undefined,
      profesional_id: form.profesional_id || undefined,
      status: form.status,
    })
    if (error) setError((error as any).message || 'Error')
    else {
      setOpen(false)
      setForm({ nombre: '', descripcion: '', profesional_id: '', status: 'activo' })
    }
    setSaving(false)
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programas</h1>
          <p className="text-muted text-sm mt-1">Administrar programas de la fundación</p>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Nuevo programa</Button>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <Thead>
              <tr><Th>Programa</Th><Th>Descripción</Th><Th>Profesional</Th><Th>Estado</Th></tr>
            </Thead>
            <tbody>
              {programs.map(p => (
                <Tr key={p.id}>
                  <Td className="font-medium">{p.nombre}</Td>
                  <Td className="text-muted max-w-xs truncate">{p.descripcion || '—'}</Td>
                  <Td>{p.profesional?.full_name || '—'}</Td>
                  <Td><Badge variant={statusBadgeVariant(p.status)}>{p.status === 'activo' ? 'Activo' : 'Inactivo'}</Badge></Td>
                </Tr>
              ))}
              {programs.length === 0 && (
                <tr><Td className="text-center text-muted !py-8" colSpan={4}>No hay programas</Td></tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Crear programa">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3">{error}</div>}
          <Input label="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <Textarea label="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          <Select
            label="Profesional responsable"
            value={form.profesional_id}
            onChange={e => setForm({ ...form, profesional_id: e.target.value })}
            options={profesionales.map(p => ({ value: p.id, label: p.full_name }))}
            placeholder="Seleccionar profesional"
          />
          <Select
            label="Estado"
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear programa'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
