import type {
  Profile, UserRole, Programa, Subprograma, Estudiante,
  Actividad, Asistencia, Participacion, Evidencia,
  AppRole, UserStatus, ProgramStatus, StudentStatus, ActivityStatus, EvidenceStatus, EvidenceType,
} from './types'

// ─── Helper ──────────────────────────────────────────────
let _counter = 100
function uid() { return `mock-${++_counter}` }
function iso(daysAgo = 0) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString()
}
function dateStr(daysAgo = 0) {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

// ─── Profiles (Users) ────────────────────────────────────
export const profiles: Profile[] = [
  { id: 'u1', full_name: 'Carolina Méndez', email: 'carolina@fundacionve.org', status: 'activo', created_at: iso(90), updated_at: iso(1) },
  { id: 'u2', full_name: 'Andrés Salazar', email: 'andres@fundacionve.org', status: 'activo', created_at: iso(80), updated_at: iso(2) },
  { id: 'u3', full_name: 'Luisa Fernanda Torres', email: 'luisa@fundacionve.org', status: 'activo', created_at: iso(75), updated_at: iso(3) },
  { id: 'u4', full_name: 'Roberto Castillo', email: 'roberto@fundacionve.org', status: 'activo', created_at: iso(60), updated_at: iso(5) },
  { id: 'u5', full_name: 'María José Herrera', email: 'mariajose@fundacionve.org', status: 'inactivo', created_at: iso(50), updated_at: iso(10) },
]

// ─── User Roles ──────────────────────────────────────────
export const userRoles: UserRole[] = [
  { id: 'ur1', user_id: 'u1', role: 'coordinacion', created_at: iso(90) },
  { id: 'ur2', user_id: 'u2', role: 'profesional', created_at: iso(80) },
  { id: 'ur3', user_id: 'u3', role: 'profesional', created_at: iso(75) },
  { id: 'ur4', user_id: 'u4', role: 'profesional', created_at: iso(60) },
  { id: 'ur5', user_id: 'u5', role: 'estudiante', created_at: iso(50) },
]

// ─── Programas ───────────────────────────────────────────
export const programas: Programa[] = [
  { id: 'p1', nombre: 'Formación integral', descripcion: 'Programa de desarrollo personal, habilidades blandas y liderazgo para jóvenes', profesional_id: 'u2', status: 'activo', created_at: iso(85), updated_at: iso(2) },
  { id: 'p2', nombre: 'Deportivo', descripcion: 'Fomento del deporte, la disciplina y el trabajo en equipo', profesional_id: 'u3', status: 'activo', created_at: iso(85), updated_at: iso(3) },
  { id: 'p3', nombre: 'Refuerzo escolar', descripcion: 'Acompañamiento académico en áreas fundamentales', profesional_id: 'u4', status: 'activo', created_at: iso(80), updated_at: iso(5) },
  { id: 'p4', nombre: 'Bienestar', descripcion: 'Atención psicosocial, salud y nutrición', profesional_id: 'u2', status: 'activo', created_at: iso(70), updated_at: iso(7) },
]

// ─── Subprogramas ────────────────────────────────────────
export const subprogramas: Subprograma[] = [
  { id: 'sp1', nombre: 'Lectura creativa', descripcion: 'Taller de lectura comprensiva y escritura creativa', programa_id: 'p1', status: 'activo', created_at: iso(80), updated_at: iso(3) },
  { id: 'sp2', nombre: 'Fútbol sub-12', descripcion: 'Entrenamiento de fútbol para menores de 12 años', programa_id: 'p2', status: 'activo', created_at: iso(80), updated_at: iso(3) },
  { id: 'sp3', nombre: 'Fútbol sub-15', descripcion: 'Entrenamiento de fútbol para menores de 15 años', programa_id: 'p2', status: 'activo', created_at: iso(78), updated_at: iso(4) },
  { id: 'sp4', nombre: 'Matemáticas básicas', descripcion: 'Refuerzo en operaciones y lógica matemática', programa_id: 'p3', status: 'activo', created_at: iso(75), updated_at: iso(5) },
  { id: 'sp5', nombre: 'Lecto-escritura', descripcion: 'Fortalecimiento de competencias de lectura y escritura', programa_id: 'p3', status: 'activo', created_at: iso(72), updated_at: iso(6) },
]

// ─── Estudiantes ─────────────────────────────────────────
export const estudiantes: Estudiante[] = [
  { id: 'e1', nombres: 'Santiago', apellidos: 'Ramírez López', tipo_documento: 'TI', numero_documento: '1045678901', fecha_nacimiento: '2013-03-15', fecha_ingreso: '2025-02-10', programa_id: 'p1', subprograma_id: 'sp1', acudiente_nombre: 'Ana María López', acudiente_telefono: '3101234567', status: 'activo', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(60), updated_at: iso(1) },
  { id: 'e2', nombres: 'Valentina', apellidos: 'García Muñoz', tipo_documento: 'TI', numero_documento: '1045678902', fecha_nacimiento: '2012-07-22', fecha_ingreso: '2025-02-10', programa_id: 'p2', subprograma_id: 'sp2', acudiente_nombre: 'Carlos García', acudiente_telefono: '3209876543', status: 'activo', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(58), updated_at: iso(2) },
  { id: 'e3', nombres: 'Mateo', apellidos: 'Jiménez Rojas', tipo_documento: 'TI', numero_documento: '1045678903', fecha_nacimiento: '2014-01-10', fecha_ingreso: '2025-03-01', programa_id: 'p3', subprograma_id: 'sp4', acudiente_nombre: 'Laura Rojas', acudiente_telefono: '3157894561', status: 'activo', autorizacion_datos: true, autorizacion_imagen: false, created_at: iso(55), updated_at: iso(3) },
  { id: 'e4', nombres: 'Isabela', apellidos: 'Moreno Díaz', tipo_documento: 'TI', numero_documento: '1045678904', fecha_nacimiento: '2013-11-05', fecha_ingreso: '2025-02-15', programa_id: 'p1', subprograma_id: 'sp1', acudiente_nombre: 'Pedro Moreno', acudiente_telefono: '3186543210', status: 'activo', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(52), updated_at: iso(2) },
  { id: 'e5', nombres: 'Samuel', apellidos: 'Ortiz Vargas', tipo_documento: 'TI', numero_documento: '1045678905', fecha_nacimiento: '2011-09-18', fecha_ingreso: '2025-01-20', programa_id: 'p2', subprograma_id: 'sp3', acudiente_nombre: 'Diana Vargas', acudiente_telefono: '3001122334', status: 'seguimiento_especial', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(50), updated_at: iso(1) },
  { id: 'e6', nombres: 'Luciana', apellidos: 'Castro Peña', tipo_documento: 'TI', numero_documento: '1045678906', fecha_nacimiento: '2013-05-30', fecha_ingreso: '2025-03-10', programa_id: 'p3', subprograma_id: 'sp5', acudiente_nombre: 'Marta Peña', acudiente_telefono: '3112233445', status: 'activo', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(48), updated_at: iso(4) },
  { id: 'e7', nombres: 'Nicolás', apellidos: 'Ríos Aguilar', tipo_documento: 'RC', numero_documento: '1045678907', fecha_nacimiento: '2015-02-14', fecha_ingreso: '2025-04-01', programa_id: 'p1', subprograma_id: null, acudiente_nombre: 'Javier Ríos', acudiente_telefono: '3223344556', status: 'activo', autorizacion_datos: true, autorizacion_imagen: false, created_at: iso(45), updated_at: iso(5) },
  { id: 'e8', nombres: 'Mariana', apellidos: 'Suárez Beltrán', tipo_documento: 'TI', numero_documento: '1045678908', fecha_nacimiento: '2012-12-01', fecha_ingreso: '2025-02-20', programa_id: 'p2', subprograma_id: 'sp2', acudiente_nombre: 'Gloria Beltrán', acudiente_telefono: '3054455667', status: 'activo', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(42), updated_at: iso(3) },
  { id: 'e9', nombres: 'Daniel', apellidos: 'Pineda Solano', tipo_documento: 'TI', numero_documento: '1045678909', fecha_nacimiento: '2013-08-25', fecha_ingreso: '2025-01-15', programa_id: 'p4', subprograma_id: null, acudiente_nombre: 'Rosa Solano', acudiente_telefono: '3175566778', status: 'seguimiento_especial', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(40), updated_at: iso(1) },
  { id: 'e10', nombres: 'Sofía', apellidos: 'Herrera Campos', tipo_documento: 'TI', numero_documento: '1045678910', fecha_nacimiento: '2014-04-12', fecha_ingreso: '2025-03-05', programa_id: 'p3', subprograma_id: 'sp4', acudiente_nombre: 'Fernando Herrera', acudiente_telefono: '3086677889', status: 'activo', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(38), updated_at: iso(6) },
  { id: 'e11', nombres: 'Tomás', apellidos: 'Acosta Rincón', tipo_documento: 'TI', numero_documento: '1045678911', fecha_nacimiento: '2012-06-20', fecha_ingreso: '2025-02-25', programa_id: 'p4', subprograma_id: null, acudiente_nombre: 'Claudia Rincón', acudiente_telefono: '3197788990', status: 'inactivo', autorizacion_datos: true, autorizacion_imagen: false, created_at: iso(35), updated_at: iso(8) },
  { id: 'e12', nombres: 'Emma', apellidos: 'Delgado Vera', tipo_documento: 'RC', numero_documento: '1045678912', fecha_nacimiento: '2015-10-08', fecha_ingreso: '2025-04-05', programa_id: 'p1', subprograma_id: 'sp1', acudiente_nombre: 'Luis Delgado', acudiente_telefono: '3008899001', status: 'activo', autorizacion_datos: true, autorizacion_imagen: true, created_at: iso(30), updated_at: iso(2) },
]

// ─── Actividades ─────────────────────────────────────────
export const actividades: Actividad[] = [
  { id: 'a1', nombre: 'Taller de lectura comprensiva', programa_id: 'p1', subprograma_id: 'sp1', profesional_id: 'u2', fecha: dateStr(21), lugar: 'Salón principal', status: 'realizada', created_at: iso(25), updated_at: iso(21) },
  { id: 'a2', nombre: 'Entrenamiento fútbol sub-12', programa_id: 'p2', subprograma_id: 'sp2', profesional_id: 'u3', fecha: dateStr(14), lugar: 'Cancha deportiva', status: 'realizada', created_at: iso(20), updated_at: iso(14) },
  { id: 'a3', nombre: 'Tutoría de matemáticas', programa_id: 'p3', subprograma_id: 'sp4', profesional_id: 'u4', fecha: dateStr(7), lugar: 'Aula 3', status: 'realizada', created_at: iso(14), updated_at: iso(7) },
  { id: 'a4', nombre: 'Jornada de salud y nutrición', programa_id: 'p4', subprograma_id: null, profesional_id: 'u2', fecha: dateStr(3), lugar: 'Sede principal', status: 'realizada', created_at: iso(10), updated_at: iso(3) },
  { id: 'a5', nombre: 'Taller de escritura creativa', programa_id: 'p1', subprograma_id: 'sp1', profesional_id: 'u2', fecha: dateStr(-3), lugar: 'Salón principal', status: 'programada', created_at: iso(5), updated_at: iso(1) },
  { id: 'a6', nombre: 'Campeonato interno fútbol', programa_id: 'p2', subprograma_id: null, profesional_id: 'u3', fecha: dateStr(-7), lugar: 'Cancha deportiva', status: 'programada', created_at: iso(3), updated_at: iso(1) },
]

// ─── Asistencias ─────────────────────────────────────────
export const asistencias: Asistencia[] = [
  // Activity a1 – Taller de lectura (p1/sp1): students e1, e4, e7, e12
  { id: 'at1', actividad_id: 'a1', estudiante_id: 'e1', asistio: true, observacion: null, evidencia_url: null, created_at: iso(21), updated_at: iso(21) },
  { id: 'at2', actividad_id: 'a1', estudiante_id: 'e4', asistio: true, observacion: null, evidencia_url: null, created_at: iso(21), updated_at: iso(21) },
  { id: 'at3', actividad_id: 'a1', estudiante_id: 'e7', asistio: false, observacion: 'Enfermedad', evidencia_url: null, created_at: iso(21), updated_at: iso(21) },
  { id: 'at4', actividad_id: 'a1', estudiante_id: 'e12', asistio: true, observacion: null, evidencia_url: null, created_at: iso(21), updated_at: iso(21) },
  // Activity a2 – Entrenamiento fútbol sub-12 (p2/sp2): students e2, e8
  { id: 'at5', actividad_id: 'a2', estudiante_id: 'e2', asistio: true, observacion: null, evidencia_url: null, created_at: iso(14), updated_at: iso(14) },
  { id: 'at6', actividad_id: 'a2', estudiante_id: 'e8', asistio: true, observacion: null, evidencia_url: null, created_at: iso(14), updated_at: iso(14) },
  // Activity a3 – Tutoría matemáticas (p3/sp4): students e3, e10
  { id: 'at7', actividad_id: 'a3', estudiante_id: 'e3', asistio: true, observacion: null, evidencia_url: null, created_at: iso(7), updated_at: iso(7) },
  { id: 'at8', actividad_id: 'a3', estudiante_id: 'e10', asistio: false, observacion: 'No asistió sin justificación', evidencia_url: null, created_at: iso(7), updated_at: iso(7) },
  // Activity a4 – Jornada salud (p4): students e9, e11
  { id: 'at9', actividad_id: 'a4', estudiante_id: 'e9', asistio: true, observacion: null, evidencia_url: null, created_at: iso(3), updated_at: iso(3) },
  { id: 'at10', actividad_id: 'a4', estudiante_id: 'e11', asistio: false, observacion: 'Inactivo', evidencia_url: null, created_at: iso(3), updated_at: iso(3) },
]

// ─── Participaciones ─────────────────────────────────────
export const participaciones: Participacion[] = [
  // a1
  { id: 'pa1', actividad_id: 'a1', estudiante_id: 'e1', calificacion: 5, observacion: 'Excelente participación', created_at: iso(21), updated_at: iso(21) },
  { id: 'pa2', actividad_id: 'a1', estudiante_id: 'e4', calificacion: 4, observacion: null, created_at: iso(21), updated_at: iso(21) },
  { id: 'pa3', actividad_id: 'a1', estudiante_id: 'e12', calificacion: 3, observacion: null, created_at: iso(21), updated_at: iso(21) },
  // a2
  { id: 'pa4', actividad_id: 'a2', estudiante_id: 'e2', calificacion: 5, observacion: 'Liderazgo en cancha', created_at: iso(14), updated_at: iso(14) },
  { id: 'pa5', actividad_id: 'a2', estudiante_id: 'e8', calificacion: 4, observacion: null, created_at: iso(14), updated_at: iso(14) },
  // a3
  { id: 'pa6', actividad_id: 'a3', estudiante_id: 'e3', calificacion: 2, observacion: 'Poca atención, necesita seguimiento', created_at: iso(7), updated_at: iso(7) },
  // a4
  { id: 'pa7', actividad_id: 'a4', estudiante_id: 'e9', calificacion: 1, observacion: 'Muy baja participación, derivar a psicología', created_at: iso(3), updated_at: iso(3) },
  // Extra entries for richer data
  { id: 'pa8', actividad_id: 'a1', estudiante_id: 'e7', calificacion: 2, observacion: 'No asistió al taller anterior', created_at: iso(21), updated_at: iso(21) },
  { id: 'pa9', actividad_id: 'a2', estudiante_id: 'e5', calificacion: 1, observacion: 'Llegó tarde y no participó', created_at: iso(14), updated_at: iso(14) },
]

// ─── Evidencias ──────────────────────────────────────────
export const evidencias: Evidencia[] = [
  { id: 'ev1', actividad_id: 'a1', tipo: 'foto', url: 'https://picsum.photos/seed/taller1/400/300', comentario: 'Estudiantes durante el taller de lectura', subido_por: 'u2', status: 'activa', created_at: iso(20) },
  { id: 'ev2', actividad_id: 'a2', tipo: 'foto', url: 'https://picsum.photos/seed/futbol1/400/300', comentario: 'Entrenamiento en cancha', subido_por: 'u3', status: 'activa', created_at: iso(13) },
  { id: 'ev3', actividad_id: 'a3', tipo: 'pdf', url: 'https://example.com/informe-tutoria.pdf', comentario: 'Informe de avance en matemáticas', subido_por: 'u4', status: 'activa', created_at: iso(6) },
  { id: 'ev4', actividad_id: 'a4', tipo: 'foto', url: 'https://picsum.photos/seed/salud1/400/300', comentario: 'Jornada de salud y nutrición', subido_por: 'u2', status: 'activa', created_at: iso(2) },
  { id: 'ev5', actividad_id: 'a1', tipo: 'pdf', url: 'https://example.com/lista-asistencia.pdf', comentario: 'Lista de asistencia firmada', subido_por: 'u2', status: 'inactiva', created_at: iso(20) },
]

// ─── Alerts (derived) ────────────────────────────────────
export interface Alerta {
  id: string
  tipo: 'inasistencia' | 'baja_participacion' | 'seguimiento_especial'
  estudiante: string
  programa: string
  mensaje: string
  fecha: string
}

export function getAlertas(): Alerta[] {
  return [
    { id: 'al1', tipo: 'seguimiento_especial', estudiante: 'Samuel Ortiz Vargas', programa: 'Deportivo', mensaje: 'Estudiante en seguimiento especial — requiere atención psicosocial', fecha: dateStr(1) },
    { id: 'al2', tipo: 'seguimiento_especial', estudiante: 'Daniel Pineda Solano', programa: 'Bienestar', mensaje: 'Seguimiento especial activo — baja participación recurrente', fecha: dateStr(2) },
    { id: 'al3', tipo: 'baja_participacion', estudiante: 'Mateo Jiménez Rojas', programa: 'Refuerzo escolar', mensaje: 'Participación calificada 2/5 en última tutoría', fecha: dateStr(7) },
    { id: 'al4', tipo: 'inasistencia', estudiante: 'Nicolás Ríos Aguilar', programa: 'Formación integral', mensaje: 'No asistió al taller de lectura — justificó enfermedad', fecha: dateStr(21) },
    { id: 'al5', tipo: 'inasistencia', estudiante: 'Sofía Herrera Campos', programa: 'Refuerzo escolar', mensaje: 'Inasistencia sin justificación a tutoría de matemáticas', fecha: dateStr(7) },
    { id: 'al6', tipo: 'baja_participacion', estudiante: 'Daniel Pineda Solano', programa: 'Bienestar', mensaje: 'Participación 1/5 en jornada de salud — derivar a psicología', fecha: dateStr(3) },
  ]
}

// ─── Helpers for hooks ───────────────────────────────────

/** Resolve relations for a programa */
export function resolvePrograma(p: Programa): Programa {
  return { ...p, profesional: profiles.find(pr => pr.id === p.profesional_id) }
}

/** Resolve relations for a subprograma */
export function resolveSubprograma(s: Subprograma): Subprograma {
  return { ...s, programa: programas.find(p => p.id === s.programa_id) }
}

/** Resolve relations for an estudiante */
export function resolveEstudiante(e: Estudiante): Estudiante {
  return {
    ...e,
    programa: programas.find(p => p.id === e.programa_id),
    subprograma: subprogramas.find(s => s.id === e.subprograma_id) || undefined,
  }
}

/** Resolve relations for an actividad */
export function resolveActividad(a: Actividad): Actividad {
  return {
    ...a,
    programa: programas.find(p => p.id === a.programa_id),
    subprograma: subprogramas.find(s => s.id === a.subprograma_id) || undefined,
    profesional: profiles.find(p => p.id === a.profesional_id),
  }
}

/** Resolve relations for an evidencia */
export function resolveEvidencia(ev: Evidencia): Evidencia {
  return {
    ...ev,
    actividad: actividades.find(a => a.id === ev.actividad_id),
    uploader: profiles.find(p => p.id === ev.subido_por),
  }
}

/** Generate a new unique ID */
export function generateId() { return uid() }

/** Get current ISO timestamp */
export function now() { return new Date().toISOString() }

// ─── Demo accounts for quick login ──────────────────────
export interface DemoAccount {
  email: string
  name: string
  role: AppRole
  profileId: string
}

export const demoAccounts: DemoAccount[] = [
  { email: 'carolina@fundacionve.org', name: 'Carolina Méndez', role: 'coordinacion', profileId: 'u1' },
  { email: 'andres@fundacionve.org', name: 'Andrés Salazar', role: 'profesional', profileId: 'u2' },
  { email: 'mariajose@fundacionve.org', name: 'María José Herrera', role: 'estudiante', profileId: 'u5' },
]
