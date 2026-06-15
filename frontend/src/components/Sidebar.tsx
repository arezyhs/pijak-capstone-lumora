import { Activity, BookOpen, Brain, LogOut, Users, FileText, User, Moon, Sun, ChevronsUpDown, ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTheme } from './ThemeProvider'
import { updateStudentCondition } from '../api/client'
import './Layout.css'

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

  // Survey Modal States
  const [showSurvey, setShowSurvey] = useState(false)
  const [sleepHours, setSleepHours] = useState(Number(localStorage.getItem('sleepHours')) || 7)
  const [stressLevel, setStressLevel] = useState(Number(localStorage.getItem('stressLevel')) || 5)
  const [surveyLoading, setSurveyLoading] = useState(false)

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
                <Activity size={16} /> Beranda Kamu
              </Link>
              <Link className={location.pathname === '/materials' ? 'active' : ''} to="/materials">
                <FileText size={16} /> Baca Materi
              </Link>
              <Link className={location.pathname === '/quiz' ? 'active' : ''} to="/quiz">
                <BookOpen size={16} /> Coba Ujian
              </Link>
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSurvey(true);
                }}
              >
                <ClipboardCheck size={16} /> Cek Kondisi (Check In)
              </a>
            </>
          )}

          {role === 'teacher' && (
            <Link className={location.pathname === '/teacher' ? 'active' : ''} to="/teacher">
              <Users size={16} /> Pantau Siswa
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
          <User size={16} /> Profil Kamu
        </Link>

        <NavButton 
          onClick={toggleTheme} 
          icon={theme === 'light' ? <Moon size={16} /> : <Sun size={16} />} 
          label={theme === 'light' ? 'Mode Gelap' : 'Mode Terang'} 
        />
        
        <NavButton 
          onClick={handleLogout} 
          icon={<LogOut size={16} />} 
          label="Keluar Akun" 
          danger 
        />
      </div>

      {/* Survey Modal */}
      {showSurvey && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
          <div className="panel" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--accent-primary)" /> Cek Kondisi Dulu Yuk!
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '14px', marginBottom: '20px' }}>
              Biar AI kita bisa ngasih saran belajar yang pas, ceritain dong kondisi kamu hari ini.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Tidur Berapa Jam Semalam?</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input 
                    type="range" min="3" max="12" value={sleepHours} 
                    onChange={e => setSleepHours(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
                  />
                  <strong style={{ width: '40px', textAlign: 'right' }}>{sleepHours}</strong>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '500' }}>Lagi Stres atau Mumet Nggak Hari Ini? (1-10)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <input 
                    type="range" min="1" max="10" value={stressLevel} 
                    onChange={e => setStressLevel(Number(e.target.value))}
                    style={{ flex: 1, accentColor: 'var(--danger)' }}
                  />
                  <strong style={{ width: '40px', textAlign: 'right' }}>{stressLevel}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                <button 
                  onClick={() => setShowSurvey(false)} 
                  className="btn-outline" style={{ flex: 1 }}
                >
                  Batal
                </button>
                <button 
                  disabled={surveyLoading}
                  onClick={async () => {
                    setSurveyLoading(true);
                    try {
                      const username = localStorage.getItem('username') || 'student1';
                      await updateStudentCondition(username, sleepHours, stressLevel);
                      localStorage.setItem('sleepHours', sleepHours.toString());
                      localStorage.setItem('stressLevel', stressLevel.toString());
                      setShowSurvey(false);
                      // Force reload dashboard to trigger AI recommendation again
                      window.location.reload();
                    } catch (err) {
                      console.error(err);
                      alert('Gagal update kondisi nih.');
                    } finally {
                      setSurveyLoading(false);
                    }
                  }} 
                  className="btn-primary" style={{ flex: 1 }}
                >
                  {surveyLoading ? 'Lagi Disimpan...' : 'Simpan & Update AI'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
