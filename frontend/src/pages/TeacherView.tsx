import { useEffect, useState } from 'react'
import { Brain, BellRing } from 'lucide-react'
import { fetchTeacherOverview } from '../api/client'
import type { TeacherOverview } from '../types'

export function TeacherView() {
  const [teacher, setTeacher] = useState<TeacherOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nudged, setNudged] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchTeacherOverview()
        setTeacher(data)
      } catch (err) {
        console.error(err)
        setError('Gagal mengambil data dari server.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleNudge = (studentId: string) => {
    setNudged(prev => ({ ...prev, [studentId]: true }))
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem' }}>
        <Brain size={48} color="var(--accent-primary)" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <h2 style={{ color: 'var(--ink)' }}>Menarik Data Kelas...</h2>
      </div>
    )
  }

  if (error || !teacher) {
    return (
      <div style={{ padding: '2rem', color: 'var(--danger)', textAlign: 'center' }}>
        <h2>Oops!</h2>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="content">
      <header className="topbar" style={{ marginBottom: '12px' }}>
        <div>
          <p className="eyebrow">Pusat Kendali Pengajar</p>
          <h1>Monitoring Kelas</h1>
        </div>
      </header>

      <section className="teacher-band">
        <div>
          <p className="eyebrow" style={{ color: '#c2410c' }}>Peringatan Dini AI</p>
          <h2>{teacher.students_need_attention.length} siswa perlu bimbingan pada modul {teacher.risk_topics.join(' & ')}.</h2>
        </div>
        <div className="teacher-stats">
          <span>{teacher.total_students} Total Siswa</span>
          <span>{Math.round(teacher.average_completion_rate * 100)}% Laju Kelas</span>
          <span>{teacher.average_score} Skor Rata-rata</span>
        </div>
      </section>

      <section className="panel" style={{ marginTop: '32px' }}>
        <div className="panel-heading">
          <h2>Siswa Prioritas (Intervensi AI)</h2>
          <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '6px 12px', borderRadius: '8px', fontWeight: '700' }}>
            Remedial / Berisiko
          </span>
        </div>
        <div className="recommendation-list">
          {teacher.students_need_attention.length === 0 ? (
            <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '24px' }}>Tidak ada siswa yang berisiko saat ini. Kelas berjalan optimal.</p>
          ) : (
            teacher.students_need_attention.map((id) => (
              <article key={id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>{id}</strong>
                  <span style={{ color: 'var(--danger)' }}>Terdeteksi anomali penurunan skor oleh sistem.</span>
                </div>
                <button 
                  onClick={() => handleNudge(id)}
                  disabled={nudged[id]}
                  style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px', 
                    borderRadius: '12px', 
                    border: 'none', 
                    background: nudged[id] ? 'var(--surface-alt)' : 'rgba(239, 68, 68, 0.1)', 
                    color: nudged[id] ? 'var(--muted)' : 'var(--danger)', 
                    cursor: nudged[id] ? 'not-allowed' : 'pointer',
                    fontWeight: '700',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (!nudged[id]) {
                      e.currentTarget.style.background = 'var(--danger)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!nudged[id]) {
                      e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                      e.currentTarget.style.color = 'var(--danger)';
                    }
                  }}
                >
                  <BellRing size={16} />
                  {nudged[id] ? 'Notifikasi Terkirim' : 'Kirim Peringatan'}
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}
