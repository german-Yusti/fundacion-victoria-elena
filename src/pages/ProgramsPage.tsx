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
import { Plus, FolderOpen } from 'lucide-react'

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
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/10">
            <FolderOpen size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Programas</h1>
            <p className="text-slate-500 text-sm mt-0.5">Administrar programas de la fundación</p>
          </div>
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
                  <Td className="font-semibold text-slate-800">{p.nombre}</Td>
                  <Td className="text-slate-500 max-w-xs truncate">{p.descripcion || '—'}</Td>
                  <Td>{p.profesional?.full_name || '—'}</Td>
                  <Td><Badge variant={statusBadgeVariant(p.status)}>{p.status === 'activo' ? 'Activo' : 'Inactivo'}</Badge></Td>
                </Tr>
              ))}
              {programs.length === 0 && (
                <tr><Td className="text-center text-slate-400 !py-8" colSpan={4}>No hay programas</Td></tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Crear programa">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 font-medium border border-red-100">{error}</div>}
          <Input label="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <Textarea label="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          <Select label="Profesional responsable" value={form.profesional_id} onChange={e => setForm({ ...form, profesional_id: e.target.value })} options={profesionales.map(p => ({ value: p.id, label: p.full_name }))} placeholder="Seleccionar profesional" />
          <Select label="Estado" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]} />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear programa'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
