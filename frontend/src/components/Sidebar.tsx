import { Activity, BookOpen, Brain, LogOut, Users, FileText, User, Moon, Sun, ChevronsUpDown } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from './ThemeProvider'

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const role = localStorage.getItem('role')
  
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  // Komponen pembungkus untuk gaya menu seragam
  const NavButton = ({ onClick, icon, label, danger }: { onClick: () => void, icon: React.ReactNode, label: string, danger?: boolean }) => (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px', background: 'transparent', border: 'none',
        color: danger ? 'var(--danger)' : 'var(--ink-light)', cursor: 'pointer', fontWeight: '500', width: '100%',
        padding: '6px 12px', fontSize: '14px', borderRadius: '4px', textAlign: 'left', transition: 'background 0.1s'
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(55, 53, 47, 0.08)'}
      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
    >
      {icon} {label}
    </button>
  )

  return (
    <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', background: 'var(--surface-alt)' }}>
      {/* Workspace Switcher */}
      <div 
        style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', margin: '12px 12px 16px', borderRadius: '4px',
          cursor: 'pointer', transition: 'background 0.1s', color: 'var(--ink)'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(55, 53, 47, 0.08)'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '22px', height: '22px', background: 'var(--ink)', borderRadius: '4px', display: 'grid', placeItems: 'center', color: 'var(--surface)' }}>
            <Brain size={14} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Lumora {role === 'teacher' ? 'Guru' : 'Siswa'}
          </span>
        </div>
        <ChevronsUpDown size={14} color="var(--muted)" />
      </div>

      {/* Main Navigation */}
      <div style={{ flex: 1, padding: '0 12px' }}>
        <nav className="nav-list" aria-label="Main navigation">
          {role === 'student' && (
            <>
              <Link className={location.pathname === '/dashboard' ? 'active' : ''} to="/dashboard">
                <Activity size={16} /> Dashboard AI
              </Link>
              <Link className={location.pathname === '/materials' ? 'active' : ''} to="/materials">
                <FileText size={16} /> Materi Belajar
              </Link>
              <Link className={location.pathname === '/quiz' ? 'active' : ''} to="/quiz">
                <BookOpen size={16} /> Simulasi Kuis
              </Link>
            </>
          )}

          {role === 'teacher' && (
            <Link className={location.pathname === '/teacher' ? 'active' : ''} to="/teacher">
              <Users size={16} /> Monitoring Guru
            </Link>
          )}
        </nav>
      </div>

      {/* Footer Navigation */}
      <div style={{ padding: '0 12px 16px', marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ margin: '8px 0', borderBottom: '1px solid var(--border)' }} />
        
        <Link 
          to="/profile" 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--ink-light)', 
            textDecoration: 'none', padding: '6px 12px', borderRadius: '4px', fontWeight: '500', 
            fontSize: '14px', transition: 'background 0.1s' 
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(55, 53, 47, 0.08)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <User size={16} /> Profil Saya
        </Link>

        <NavButton 
          onClick={toggleTheme} 
          icon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} 
          label={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'} 
        />
        
        <NavButton 
          onClick={handleLogout} 
          icon={<LogOut size={16} />} 
          label="Keluar" 
          danger 
        />
      </div>
    </aside>
  )
}
