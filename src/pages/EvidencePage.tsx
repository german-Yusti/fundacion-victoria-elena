import { useState, type FormEvent } from 'react'
import { useEvidence } from '@/hooks/useEvidence'
import { useActivities } from '@/hooks/useActivities'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent } from '@/components/ui/Card'
import { Table, Thead, Th, Td, Tr } from '@/components/ui/Table'
import { Badge, statusBadgeVariant } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { Modal } from '@/components/ui/Modal'
import { PageLoader } from '@/components/ui/Spinner'
import { Plus, FileImage } from 'lucide-react'

export default function EvidencePage() {
  const { evidences, loading, create } = useEvidence()
  const { activities } = useActivities()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ actividad_id: '', tipo: 'foto', url: '', comentario: '' })

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.actividad_id) { setError('Selecciona una actividad'); return }
    if (!form.url) { setError('Ingresa una URL'); return }
    setSaving(true)
    setError('')
    const { error } = await create({
      actividad_id: form.actividad_id,
      tipo: form.tipo,
      url: form.url,
      comentario: form.comentario || undefined,
      subido_por: user?.id || 'u1',
    })
    if (error) setError((error as any).message || 'Error')
    else {
      setOpen(false)
      setForm({ actividad_id: '', tipo: 'foto', url: '', comentario: '' })
    }
    setSaving(false)
  }

  if (loading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/10">
            <FileImage size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Evidencias</h1>
            <p className="text-slate-500 text-sm mt-0.5">Gestionar evidencias de actividades</p>
          </div>
        </div>
        <Button onClick={() => setOpen(true)}><Plus size={16} /> Subir evidencia</Button>
      </div>

      <Card>
        <CardContent className="!p-0">
          <Table>
            <Thead>
              <tr><Th>Tipo</Th><Th>Actividad</Th><Th>Comentario</Th><Th>Subido por</Th><Th>Fecha</Th><Th>Estado</Th></tr>
            </Thead>
            <tbody>
              {evidences.map(ev => (
                <Tr key={ev.id}>
                  <Td><Badge variant={ev.tipo === 'foto' ? 'info' : 'neutral'}>{ev.tipo.toUpperCase()}</Badge></Td>
                  <Td className="font-semibold text-slate-800">{ev.actividad?.nombre || '—'}</Td>
                  <Td className="max-w-xs truncate text-slate-500">{ev.comentario || '—'}</Td>
                  <Td>{ev.uploader?.full_name || '—'}</Td>
                  <Td>{new Date(ev.created_at).toLocaleDateString()}</Td>
                  <Td><Badge variant={statusBadgeVariant(ev.status)}>{ev.status === 'activa' ? 'Activa' : 'Inactiva'}</Badge></Td>
                </Tr>
              ))}
              {evidences.length === 0 && (
                <tr><Td className="text-center text-slate-400 !py-8" colSpan={6}>No hay evidencias</Td></tr>
              )}
            </tbody>
          </Table>
        </CardContent>
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="Subir evidencia">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 font-medium border border-red-100">{error}</div>}
          <Select label="Actividad" value={form.actividad_id} onChange={e => setForm({ ...form, actividad_id: e.target.value })} options={activities.map(a => ({ value: a.id, label: `${a.nombre} — ${a.fecha}` }))} placeholder="Seleccionar actividad" />
          <Select label="Tipo" value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} options={[{ value: 'foto', label: 'Foto' }, { value: 'pdf', label: 'PDF' }]} />
          <Input label="URL del archivo" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." required />
          <Textarea label="Comentario" value={form.comentario} onChange={e => setForm({ ...form, comentario: e.target.value })} />
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Subiendo...' : 'Subir evidencia'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
