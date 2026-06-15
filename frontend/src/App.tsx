import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { QuizView } from './pages/QuizView'
import { MaterialView } from './pages/MaterialView'
import { TeacherView } from './pages/TeacherView'
import { LoginView } from './pages/LoginView'
import { RegisterView } from './pages/RegisterView'
import { ProfileView } from './pages/ProfileView'
import { OnboardingView } from './pages/OnboardingView'
import './App.css'

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const location = useLocation();

  if (!token || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Pengguna mencoba mengakses rute yang tidak sesuai perannya
    return <Navigate to={role === 'teacher' ? '/teacher' : '/dashboard'} replace />;
  }

  // Cek apakah siswa sudah mengisi kuesioner onboarding
  if (role === 'student' && location.pathname !== '/onboarding') {
    const hasCompletedOnboarding = localStorage.getItem('has_completed_onboarding');
    if (!hasCompletedOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="app-shell">
      <Sidebar />
      {children}
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginView />} />
      <Route path="/register" element={<RegisterView />} />
      
      {/* Rute Siswa */}
      <Route path="/onboarding" element={
        <ProtectedRoute allowedRoles={['student']}>
          <OnboardingView />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['student']}>
          <MainLayout><Dashboard /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/materials" element={
        <ProtectedRoute allowedRoles={['student']}>
          <MainLayout><MaterialView /></MainLayout>
        </ProtectedRoute>
      } />
      <Route path="/quiz" element={
        <ProtectedRoute allowedRoles={['student']}>
          <MainLayout><QuizView /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Rute Guru */}
      <Route path="/teacher" element={
        <ProtectedRoute allowedRoles={['teacher']}>
          <MainLayout><TeacherView /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Rute Shared */}
      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['student', 'teacher']}>
          <MainLayout><ProfileView /></MainLayout>
        </ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
