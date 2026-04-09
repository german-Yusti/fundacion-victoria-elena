-- ============================================
-- FUNDACIÓN VICTORIA ELENA - SCHEMA COMPLETO
-- ============================================

-- ENUMS
CREATE TYPE app_role AS ENUM ('coordinacion', 'profesional', 'estudiante');
CREATE TYPE user_status AS ENUM ('activo', 'inactivo');
CREATE TYPE program_status AS ENUM ('activo', 'inactivo');
CREATE TYPE student_status AS ENUM ('activo', 'inactivo', 'seguimiento_especial');
CREATE TYPE activity_status AS ENUM ('programada', 'realizada', 'cancelada');
CREATE TYPE evidence_type AS ENUM ('foto', 'pdf');
CREATE TYPE evidence_status AS ENUM ('activa', 'inactiva');

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    email       TEXT NOT NULL UNIQUE,
    status      user_status NOT NULL DEFAULT 'activo',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- USER_ROLES
-- ============================================
CREATE TABLE user_roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role        app_role NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, role)
);

-- ============================================
-- PROGRAMAS
-- ============================================
CREATE TABLE programas (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          TEXT NOT NULL,
    descripcion     TEXT,
    profesional_id  UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status          program_status NOT NULL DEFAULT 'activo',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- SUBPROGRAMAS
-- ============================================
CREATE TABLE subprogramas (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre      TEXT NOT NULL,
    descripcion TEXT,
    programa_id UUID NOT NULL REFERENCES programas(id) ON DELETE CASCADE,
    status      program_status NOT NULL DEFAULT 'activo',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ESTUDIANTES
-- ============================================
CREATE TABLE estudiantes (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombres                 TEXT NOT NULL,
    apellidos               TEXT NOT NULL,
    tipo_documento          TEXT NOT NULL DEFAULT 'CC',
    numero_documento        TEXT NOT NULL UNIQUE,
    fecha_nacimiento        DATE,
    fecha_ingreso           DATE NOT NULL DEFAULT CURRENT_DATE,
    programa_id             UUID NOT NULL REFERENCES programas(id) ON DELETE RESTRICT,
    subprograma_id          UUID REFERENCES subprogramas(id) ON DELETE SET NULL,
    acudiente_nombre        TEXT,
    acudiente_telefono      TEXT,
    status                  student_status NOT NULL DEFAULT 'activo',
    autorizacion_datos      BOOLEAN NOT NULL DEFAULT false,
    autorizacion_imagen     BOOLEAN NOT NULL DEFAULT false,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ACTIVIDADES
-- ============================================
CREATE TABLE actividades (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          TEXT NOT NULL,
    programa_id     UUID NOT NULL REFERENCES programas(id) ON DELETE RESTRICT,
    subprograma_id  UUID REFERENCES subprogramas(id) ON DELETE SET NULL,
    profesional_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    fecha           DATE NOT NULL,
    lugar           TEXT,
    status          activity_status NOT NULL DEFAULT 'programada',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ASISTENCIAS
-- ============================================
CREATE TABLE asistencias (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actividad_id    UUID NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    estudiante_id   UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    asistio         BOOLEAN NOT NULL DEFAULT false,
    observacion     TEXT,
    evidencia_url   TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(actividad_id, estudiante_id)
);

-- ============================================
-- PARTICIPACIONES
-- ============================================
CREATE TABLE participaciones (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actividad_id    UUID NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    estudiante_id   UUID NOT NULL REFERENCES estudiantes(id) ON DELETE CASCADE,
    calificacion    SMALLINT NOT NULL CHECK (calificacion BETWEEN 1 AND 5),
    observacion     TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(actividad_id, estudiante_id)
);

-- ============================================
-- EVIDENCIAS
-- ============================================
CREATE TABLE evidencias (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actividad_id    UUID NOT NULL REFERENCES actividades(id) ON DELETE CASCADE,
    tipo            evidence_type NOT NULL,
    url             TEXT NOT NULL,
    comentario      TEXT,
    subido_por      UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    status          evidence_status NOT NULL DEFAULT 'activa',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX idx_user_roles_user ON user_roles(user_id);
CREATE INDEX idx_programas_profesional ON programas(profesional_id);
CREATE INDEX idx_subprogramas_programa ON subprogramas(programa_id);
CREATE INDEX idx_estudiantes_programa ON estudiantes(programa_id);
CREATE INDEX idx_estudiantes_subprograma ON estudiantes(subprograma_id);
CREATE INDEX idx_actividades_programa ON actividades(programa_id);
CREATE INDEX idx_actividades_profesional ON actividades(profesional_id);
CREATE INDEX idx_actividades_fecha ON actividades(fecha);
CREATE INDEX idx_asistencias_actividad ON asistencias(actividad_id);
CREATE INDEX idx_asistencias_estudiante ON asistencias(estudiante_id);
CREATE INDEX idx_participaciones_actividad ON participaciones(actividad_id);
CREATE INDEX idx_participaciones_estudiante ON participaciones(estudiante_id);
CREATE INDEX idx_evidencias_actividad ON evidencias(actividad_id);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_programas_updated BEFORE UPDATE ON programas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_subprogramas_updated BEFORE UPDATE ON subprogramas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_estudiantes_updated BEFORE UPDATE ON estudiantes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_actividades_updated BEFORE UPDATE ON actividades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_asistencias_updated BEFORE UPDATE ON asistencias
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_participaciones_updated BEFORE UPDATE ON participaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================
CREATE OR REPLACE FUNCTION has_role(check_role app_role)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid() AND role = check_role
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_coordinacion()
RETURNS BOOLEAN AS $$
    SELECT has_role('coordinacion');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION my_program_ids()
RETURNS SETOF UUID AS $$
    SELECT id FROM programas WHERE profesional_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- PROFILES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select" ON profiles FOR SELECT
    USING (true);

CREATE POLICY "profiles_insert" ON profiles FOR INSERT
    WITH CHECK (is_coordinacion() OR id = auth.uid());

CREATE POLICY "profiles_update" ON profiles FOR UPDATE
    USING (is_coordinacion() OR id = auth.uid());

-- USER_ROLES
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_roles_select" ON user_roles FOR SELECT
    USING (true);

CREATE POLICY "user_roles_insert" ON user_roles FOR INSERT
    WITH CHECK (is_coordinacion());

CREATE POLICY "user_roles_update" ON user_roles FOR UPDATE
    USING (is_coordinacion());

CREATE POLICY "user_roles_delete" ON user_roles FOR DELETE
    USING (is_coordinacion());

-- PROGRAMAS
ALTER TABLE programas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "programas_select" ON programas FOR SELECT
    USING (true);

CREATE POLICY "programas_insert" ON programas FOR INSERT
    WITH CHECK (is_coordinacion());

CREATE POLICY "programas_update" ON programas FOR UPDATE
    USING (is_coordinacion() OR profesional_id = auth.uid());

CREATE POLICY "programas_delete" ON programas FOR DELETE
    USING (is_coordinacion());

-- SUBPROGRAMAS
ALTER TABLE subprogramas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subprogramas_select" ON subprogramas FOR SELECT
    USING (true);

CREATE POLICY "subprogramas_insert" ON subprogramas FOR INSERT
    WITH CHECK (is_coordinacion());

CREATE POLICY "subprogramas_update" ON subprogramas FOR UPDATE
    USING (is_coordinacion());

CREATE POLICY "subprogramas_delete" ON subprogramas FOR DELETE
    USING (is_coordinacion());

-- ESTUDIANTES
ALTER TABLE estudiantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "estudiantes_select" ON estudiantes FOR SELECT
    USING (
        is_coordinacion()
        OR programa_id IN (SELECT my_program_ids())
    );

CREATE POLICY "estudiantes_insert" ON estudiantes FOR INSERT
    WITH CHECK (is_coordinacion());

CREATE POLICY "estudiantes_update" ON estudiantes FOR UPDATE
    USING (is_coordinacion());

CREATE POLICY "estudiantes_delete" ON estudiantes FOR DELETE
    USING (is_coordinacion());

-- ACTIVIDADES
ALTER TABLE actividades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "actividades_select" ON actividades FOR SELECT
    USING (
        is_coordinacion()
        OR profesional_id = auth.uid()
    );

CREATE POLICY "actividades_insert" ON actividades FOR INSERT
    WITH CHECK (
        is_coordinacion()
        OR profesional_id = auth.uid()
    );

CREATE POLICY "actividades_update" ON actividades FOR UPDATE
    USING (
        is_coordinacion()
        OR profesional_id = auth.uid()
    );

CREATE POLICY "actividades_delete" ON actividades FOR DELETE
    USING (is_coordinacion());

-- ASISTENCIAS
ALTER TABLE asistencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "asistencias_select" ON asistencias FOR SELECT
    USING (
        is_coordinacion()
        OR actividad_id IN (
            SELECT id FROM actividades WHERE profesional_id = auth.uid()
        )
    );

CREATE POLICY "asistencias_insert" ON asistencias FOR INSERT
    WITH CHECK (
        is_coordinacion()
        OR actividad_id IN (
            SELECT id FROM actividades WHERE profesional_id = auth.uid()
        )
    );

CREATE POLICY "asistencias_update" ON asistencias FOR UPDATE
    USING (
        is_coordinacion()
        OR actividad_id IN (
            SELECT id FROM actividades WHERE profesional_id = auth.uid()
        )
    );

-- PARTICIPACIONES
ALTER TABLE participaciones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "participaciones_select" ON participaciones FOR SELECT
    USING (
        is_coordinacion()
        OR actividad_id IN (
            SELECT id FROM actividades WHERE profesional_id = auth.uid()
        )
    );

CREATE POLICY "participaciones_insert" ON participaciones FOR INSERT
    WITH CHECK (
        is_coordinacion()
        OR actividad_id IN (
            SELECT id FROM actividades WHERE profesional_id = auth.uid()
        )
    );

CREATE POLICY "participaciones_update" ON participaciones FOR UPDATE
    USING (
        is_coordinacion()
        OR actividad_id IN (
            SELECT id FROM actividades WHERE profesional_id = auth.uid()
        )
    );

-- EVIDENCIAS
ALTER TABLE evidencias ENABLE ROW LEVEL SECURITY;

CREATE POLICY "evidencias_select" ON evidencias FOR SELECT
    USING (
        is_coordinacion()
        OR actividad_id IN (
            SELECT id FROM actividades WHERE profesional_id = auth.uid()
        )
    );

CREATE POLICY "evidencias_insert" ON evidencias FOR INSERT
    WITH CHECK (
        is_coordinacion()
        OR subido_por = auth.uid()
    );

CREATE POLICY "evidencias_update" ON evidencias FOR UPDATE
    USING (
        is_coordinacion()
        OR subido_por = auth.uid()
    );
