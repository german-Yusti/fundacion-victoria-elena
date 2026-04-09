export type AppRole = 'coordinacion' | 'profesional' | 'estudiante'
export type UserStatus = 'activo' | 'inactivo'
export type ProgramStatus = 'activo' | 'inactivo'
export type StudentStatus = 'activo' | 'inactivo' | 'seguimiento_especial'
export type ActivityStatus = 'programada' | 'realizada' | 'cancelada'
export type EvidenceType = 'foto' | 'pdf'
export type EvidenceStatus = 'activa' | 'inactiva'

export interface Profile {
  id: string
  full_name: string
  email: string
  status: UserStatus
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role: AppRole
  created_at: string
}

export interface Programa {
  id: string
  nombre: string
  descripcion: string | null
  profesional_id: string | null
  status: ProgramStatus
  created_at: string
  updated_at: string
  profesional?: Profile
}

export interface Subprograma {
  id: string
  nombre: string
  descripcion: string | null
  programa_id: string
  status: ProgramStatus
  created_at: string
  updated_at: string
  programa?: Programa
}

export interface Estudiante {
  id: string
  nombres: string
  apellidos: string
  tipo_documento: string
  numero_documento: string
  fecha_nacimiento: string | null
  fecha_ingreso: string
  programa_id: string
  subprograma_id: string | null
  acudiente_nombre: string | null
  acudiente_telefono: string | null
  status: StudentStatus
  autorizacion_datos: boolean
  autorizacion_imagen: boolean
  created_at: string
  updated_at: string
  programa?: Programa
  subprograma?: Subprograma
}

export interface Actividad {
  id: string
  nombre: string
  programa_id: string
  subprograma_id: string | null
  profesional_id: string
  fecha: string
  lugar: string | null
  status: ActivityStatus
  created_at: string
  updated_at: string
  programa?: Programa
  subprograma?: Subprograma
  profesional?: Profile
}

export interface Asistencia {
  id: string
  actividad_id: string
  estudiante_id: string
  asistio: boolean
  observacion: string | null
  evidencia_url: string | null
  created_at: string
  updated_at: string
  estudiante?: Estudiante
  actividad?: Actividad
}

export interface Participacion {
  id: string
  actividad_id: string
  estudiante_id: string
  calificacion: number
  observacion: string | null
  created_at: string
  updated_at: string
  estudiante?: Estudiante
  actividad?: Actividad
}

export interface Evidencia {
  id: string
  actividad_id: string
  tipo: EvidenceType
  url: string
  comentario: string | null
  subido_por: string
  status: EvidenceStatus
  created_at: string
  actividad?: Actividad
  uploader?: Profile
}

// Supabase Database type (simplified for our usage)
export interface Database {
  public: {
    Tables: {
      profiles: { Row: Profile; Insert: Omit<Profile, 'created_at' | 'updated_at'>; Update: Partial<Profile> }
      user_roles: { Row: UserRole; Insert: Omit<UserRole, 'id' | 'created_at'>; Update: Partial<UserRole> }
      programas: { Row: Programa; Insert: Omit<Programa, 'id' | 'created_at' | 'updated_at' | 'profesional'>; Update: Partial<Programa> }
      subprogramas: { Row: Subprograma; Insert: Omit<Subprograma, 'id' | 'created_at' | 'updated_at' | 'programa'>; Update: Partial<Subprograma> }
      estudiantes: { Row: Estudiante; Insert: Omit<Estudiante, 'id' | 'created_at' | 'updated_at' | 'programa' | 'subprograma'>; Update: Partial<Estudiante> }
      actividades: { Row: Actividad; Insert: Omit<Actividad, 'id' | 'created_at' | 'updated_at' | 'programa' | 'subprograma' | 'profesional'>; Update: Partial<Actividad> }
      asistencias: { Row: Asistencia; Insert: Omit<Asistencia, 'id' | 'created_at' | 'updated_at' | 'estudiante' | 'actividad'>; Update: Partial<Asistencia> }
      participaciones: { Row: Participacion; Insert: Omit<Participacion, 'id' | 'created_at' | 'updated_at' | 'estudiante' | 'actividad'>; Update: Partial<Participacion> }
      evidencias: { Row: Evidencia; Insert: Omit<Evidencia, 'id' | 'created_at' | 'actividad' | 'uploader'>; Update: Partial<Evidencia> }
    }
  }
}
