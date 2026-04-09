import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import UsersPage from '@/pages/UsersPage'
import ProgramsPage from '@/pages/ProgramsPage'
import SubprogramsPage from '@/pages/SubprogramsPage'
import StudentsPage from '@/pages/StudentsPage'
import ActivitiesPage from '@/pages/ActivitiesPage'
import AttendancePage from '@/pages/AttendancePage'
import ParticipationPage from '@/pages/ParticipationPage'
import EvidencePage from '@/pages/EvidencePage'
import ReportPage from '@/pages/ReportPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/registro', element: <RegisterPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'estudiantes', element: <StudentsPage /> },
      { path: 'programas', element: <ProgramsPage /> },
      { path: 'subprogramas', element: <SubprogramsPage /> },
      { path: 'actividades', element: <ActivitiesPage /> },
      { path: 'asistencia', element: <AttendancePage /> },
      { path: 'participacion', element: <ParticipationPage /> },
      { path: 'evidencias', element: <EvidencePage /> },
      { path: 'reportes', element: <ReportPage /> },
      {
        path: 'usuarios',
        element: (
          <ProtectedRoute allowedRoles={['coordinacion']}>
            <UsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
