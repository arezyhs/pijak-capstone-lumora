import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Brain, HeartPulse, Moon, ArrowRight, Loader2 } from 'lucide-react'
import { updateStudentProfile } from '../api/client'

export function OnboardingView() {
  const navigate = useNavigate()
  const [sleepHours, setSleepHours] = useState(7)
  const [stressLevel, setStressLevel] = useState(5)
  const [age, setAge] = useState(20)
  const [gender, setGender] = useState("Female")
  const [internetAccess, setInternetAccess] = useState("Yes")
  const [familyIncome, setFamilyIncome] = useState("Medium")
  const [parentEdu, setParentEdu] = useState("High School")
  const [extracurricular, setExtracurricular] = useState("No")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const username = localStorage.getItem('username') || 'student1'
      await updateStudentProfile(
        username, sleepHours, stressLevel,
        age, gender, internetAccess, familyIncome, parentEdu, extracurricular
      )
      
      // Save locally to display in profile view later
      localStorage.setItem('sleepHours', sleepHours.toString())
      localStorage.setItem('stressLevel', stressLevel.toString())
      localStorage.setItem('has_completed_onboarding', 'true')
      
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      setError('Gagal menyimpan profil. Pastikan backend berjalan.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg)',
      padding: '2rem'
    }}>
      <div className="panel" style={{
        maxWidth: '500px',
        width: '100%',
        padding: '2.5rem',
        animation: 'slideUp 0.5s ease-out'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            borderRadius: '50%', 
            background: 'var(--accent-glow)', 
            color: 'var(--accent-primary)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 1rem'
          }}>
            <Brain size={32} />
          </div>
          <h1 style={{ fontSize: '24px', color: 'var(--ink)' }}>Personalisasi AI Anda</h1>
          <p style={{ color: 'var(--muted)', marginTop: '8px', lineHeight: '1.5' }}>
            Lumora membutuhkan data perilaku dan demografi Anda agar rekomendasi pembelajaran benar-benar disesuaikan dengan kondisi real Anda.
          </p>
        </div>

        {error && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Age */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--ink)', fontSize: '14px' }}>Umur</label>
              <input 
                type="number" min="10" max="60" value={age} onChange={e => setAge(Number(e.target.value))}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--ink)' }}
              />
            </div>
            
            {/* Gender */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--ink)', fontSize: '14px' }}>Jenis Kelamin</label>
              <select 
                value={gender} onChange={e => setGender(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--ink)' }}>
                <option value="Female">Perempuan</option>
                <option value="Male">Laki-laki</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Income */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--ink)', fontSize: '14px' }}>Pendapatan Keluarga</label>
              <select 
                value={familyIncome} onChange={e => setFamilyIncome(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--ink)' }}>
                <option value="Low">Rendah</option>
                <option value="Medium">Menengah</option>
                <option value="High">Tinggi</option>
              </select>
            </div>

            {/* Parent Edu */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--ink)', fontSize: '14px' }}>Pendidikan Orang Tua</label>
              <select 
                value={parentEdu} onChange={e => setParentEdu(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--ink)' }}>
                <option value="None">Tidak Ada</option>
                <option value="High School">SMA</option>
                <option value="Bachelor's">Sarjana</option>
                <option value="Master's">Magister</option>
                <option value="PhD">Doktoral</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Internet */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--ink)', fontSize: '14px' }}>Akses Internet (Rumah)</label>
              <select 
                value={internetAccess} onChange={e => setInternetAccess(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--ink)' }}>
                <option value="Yes">Ya</option>
                <option value="No">Tidak</option>
              </select>
            </div>

            {/* Extracurricular */}
            <div>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '8px', color: 'var(--ink)', fontSize: '14px' }}>Ekstrakurikuler</label>
              <select 
                value={extracurricular} onChange={e => setExtracurricular(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface-alt)', color: 'var(--ink)' }}>
                <option value="Yes">Ya</option>
                <option value="No">Tidak</option>
              </select>
            </div>
          </div>

          {/* Sleep Hours */}
          <div style={{ marginTop: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', marginBottom: '12px', color: 'var(--ink)', fontSize: '14px' }}>
              <Moon size={16} color="#8b5cf6" />
              Waktu Tidur Malam
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input 
                type="range" min="3" max="12" value={sleepHours} onChange={(e) => setSleepHours(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--accent-primary)' }}
              />
              <div style={{ width: '60px', textAlign: 'center', background: 'var(--surface-alt)', padding: '6px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                {sleepHours} Jam
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500', marginBottom: '12px', color: 'var(--ink)', fontSize: '14px' }}>
              <HeartPulse size={16} color="#ef4444" />
              Tingkat Stres/Beban
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <input 
                type="range" min="1" max="10" value={stressLevel} onChange={(e) => setStressLevel(Number(e.target.value))}
                style={{ flex: 1, accentColor: 'var(--danger)' }}
              />
              <div style={{ width: '60px', textAlign: 'center', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '6px', borderRadius: '8px', fontSize: '14px', fontWeight: '600' }}>
                {stressLevel}/10
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              marginTop: '16px',
              width: '100%', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '8px', 
              background: 'var(--accent-primary)', 
              color: 'white', 
              border: 'none', 
              padding: '16px', 
              borderRadius: '12px', 
              fontSize: '16px', 
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'all 0.2s'
            }}>
            {loading ? <Loader2 size={20} className="spinner" /> : (
              <>Simpan Profil AI & Mulai Belajar <ArrowRight size={20} /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
