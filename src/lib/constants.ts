export const ROLES = {
  COORDINACION: 'coordinacion',
  PROFESIONAL: 'profesional',
  ESTUDIANTE: 'estudiante',
} as const

export const STUDENT_STATUS_LABELS: Record<string, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  seguimiento_especial: 'Seguimiento especial',
}

export const ACTIVITY_STATUS_LABELS: Record<string, string> = {
  programada: 'Programada',
  realizada: 'Realizada',
  cancelada: 'Cancelada',
}

export const PROGRAM_STATUS_LABELS: Record<string, string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
}

export const ROLE_LABELS: Record<string, string> = {
  coordinacion: 'Coordinación',
  profesional: 'Profesional',
  estudiante: 'Estudiante',
}

export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'RC', label: 'Registro Civil' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PEP', label: 'PEP' },
  { value: 'OTRO', label: 'Otro' },
]

export const PARTICIPATION_LEVELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Muy baja', color: 'bg-danger' },
  2: { label: 'Baja', color: 'bg-danger' },
  3: { label: 'Media', color: 'bg-warning' },
  4: { label: 'Buena', color: 'bg-success' },
  5: { label: 'Excelente', color: 'bg-success' },
}
