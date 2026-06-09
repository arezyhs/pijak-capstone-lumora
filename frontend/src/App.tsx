import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'
import { Dashboard } from './pages/Dashboard'
import { QuizView } from './pages/QuizView'
import { MaterialView } from './pages/MaterialView'
import { TeacherView } from './pages/TeacherView'
import { LoginView } from './pages/LoginView'
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
      
      {/* Rute Siswa */}
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

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
