import { Activity, BookOpen, Brain, LogOut, Users, FileText, User } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="brand">
        <Brain size={28} />
        <div>
          <span>Lumora</span>
          <small>{role === 'teacher' ? 'Teacher Portal' : 'Student Portal'}</small>
        </div>
      </div>
      
      <nav className="nav-list" aria-label="Main navigation" style={{ flex: 1 }}>
        {role === 'student' && (
          <>
            <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">
              <Activity size={18} /> Dashboard AI
            </Link>
            <Link className={location.pathname === '/materials' ? 'active' : ''} to="/materials">
              <FileText size={18} /> Materi Belajar
            </Link>
            <Link className={location.pathname === '/quiz' ? 'active' : ''} to="/quiz">
              <BookOpen size={18} /> Simulasi Kuis
            </Link>
          </>
        )}

        {role === 'teacher' && (
          <Link className={location.pathname === '/teacher' ? 'active' : ''} to="/teacher">
            <Users size={18} /> Monitoring Guru
          </Link>
        )}

        <div style={{ margin: '12px 0', borderBottom: '1px solid var(--border)' }} />
        
        <Link className={location.pathname === '/profile' ? 'active' : ''} to="/profile">
          <User size={18} /> Profil Saya
        </Link>
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid #e5e7eb', marginTop: 'auto' }}>
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#4b5563' }}>
          Halo, <strong>{username}</strong>
        </div>
        <button 
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: '500', width: '100%', padding: '0.5rem 0' }}
        >
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </aside>
  )
}
