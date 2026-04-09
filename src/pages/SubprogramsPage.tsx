import { useState, type FormEvent } from 'react'
import { useSubprograms } from '@/hooks/useSubprograms'
import { usePrograms } from '@/hooks/usePrograms'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/Spinner'
import { Plus, FolderTree } from 'lucide-react'

export default function SubprogramsPage() {
  const { subprograms, loading, create } = useSubprograms()
  const { programs } = usePrograms()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ nombre: '', descripcion: '', programa_id: '', status: 'activo' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.programa_id) { setError('Selecciona un programa padre'); return }
    setSaving(true)
    setError('')
    const { error } = await create({
      nombre: form.nombre,
      descripcion: form.descripcion || undefined,
      programa_id: form.programa_id,
      status: form.status,
    })
    if (error) setError((error as any).message || 'Error')
    else {
      setOpen(false)
      setForm({ nombre: '', descripcion: '', programa_id: '', status: 'activo' })
    }
    setSaving(false)
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/10">
            <FolderTree size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Subprogramas</h1>
            <p className="text-slate-500 text-sm mt-0.5">Subprogramas dependientes de un programa</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Nuevo subprograma</Button>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <Thead>
              <tr><Th>Subprograma</Th><Th>Programa padre</Th><Th>Estado</Th></tr>
            </Thead>
            <tbody>
              {subprograms.map(s => (
                <Tr key={s.id}>
                  <Td className="font-semibold text-slate-800">{s.nombre}</Td>
                  <Td>{s.programa?.nombre || '—'}</Td>
                  <Td><Badge variant={statusBadgeVariant(s.status)}>{s.status === 'activo' ? 'Activo' : 'Inactivo'}</Badge></Td>
                </Tr>
              ))}
              {subprograms.length === 0 && (
                <tr><Td className="text-center text-slate-400 !py-8" colSpan={3}>No hay subprogramas</Td></tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Crear subprograma">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 font-medium border border-red-100">{error}</div>}
          <Input label="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
          <Textarea label="Descripción" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} />
          <Select label="Programa padre" value={form.programa_id} onChange={e => setForm({ ...form, programa_id: e.target.value })} options={programs.map(p => ({ value: p.id, label: p.nombre }))} placeholder="Seleccionar programa" />
          <Select label="Estado" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} options={[{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]} />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Crear subprograma'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
