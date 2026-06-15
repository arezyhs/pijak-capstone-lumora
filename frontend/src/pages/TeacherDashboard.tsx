import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, RefreshCw, Trash2 } from 'lucide-react'
import { LoadingScreen } from '../components/LoadingScreen'
import './TeacherView.css'
import { fetchTeacherOverview, resetLearningData } from '../api/client'
import type { AdminStudentItem, TeacherOverview } from '../types'

function riskLabel(risk: AdminStudentItem['risk_level']) {
  if (risk === 'high') return 'Tinggi'
  if (risk === 'medium') return 'Sedang'
  return 'Rendah'
}

function riskColor(risk: AdminStudentItem['risk_level']) {
  if (risk === 'high') return 'var(--danger)'
  if (risk === 'medium') return 'var(--warning)'
  return 'var(--success)'
}

export function TeacherDashboard() {
  const [teacher, setTeacher] = useState<TeacherOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const students = teacher?.students ?? []
  const highRisk = useMemo(() => students.filter(student => student.risk_level === 'high').length, [students])
  const mediumRisk = useMemo(() => students.filter(student => student.risk_level === 'medium').length, [students])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchTeacherOverview()
      setTeacher(data)
    } catch (err) {
      console.error(err)
      setError('Gagal mengambil data admin dari server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleResetLearning = async () => {
    const confirmed = window.confirm('Reset semua data siswa, kuis, dan progress materi? Akun guru tetap ada.')
    if (!confirmed) return
    setSaving(true)
    setError(null)
    setMessage(null)
    try {
      await resetLearningData()
      setMessage('Database belajar berhasil direset dari nol.')
      await loadData()
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.detail ?? 'Gagal mereset database belajar.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingScreen message="Menarik Data Kelas..." />
  }

  return (
    <div className="content">
      <header className="topbar" style={{ marginBottom: '12px' }}>
        <div>
          <p className="eyebrow">Admin Pembelajaran</p>
          <h1>Dashboard Guru</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button className="btn-outline" onClick={loadData} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <RefreshCw size={16} /> Sinkronkan
          </button>
          <button className="btn-outline danger-button" onClick={handleResetLearning} disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Trash2 size={16} /> Reset Data Belajar
          </button>
        </div>
      </header>

      {error && <div className="admin-alert danger"><AlertTriangle size={16} /> {error}</div>}
      {message && <div className="admin-alert success">{message}</div>}

      <section className="teacher-band">
        <div>
          <p className="eyebrow" style={{ color: '#c2410c' }}>Sinkron dengan Data Siswa</p>
          <h2>
            {highRisk} siswa risiko tinggi, {mediumRisk} siswa perlu dipantau.
          </h2>
        </div>
        <div className="teacher-stats">
          <span>{teacher?.total_students ?? 0} Total Siswa</span>
          <span>{Math.round((teacher?.average_completion_rate ?? 0) * 100)}% Progress Kelas</span>
          <span>{(teacher?.average_score ?? 0).toFixed(1)} Skor Rata-rata</span>
        </div>
      </section>

      <div className="admin-grid" style={{ gridTemplateColumns: '1fr' }}>
        <section className="panel">
          <div className="panel-heading">
            <h2>Siswa Prioritas</h2>
            <span className="dash-model-badge">{teacher?.risk_topics.length ? teacher.risk_topics.join(', ') : 'Belum ada topik risiko'}</span>
          </div>
          <div className="recommendation-list">
            {students.filter(student => student.risk_level !== 'low').length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '18px' }}>Belum ada siswa berisiko. Data kelas masih bersih.</p>
            ) : students.filter(student => student.risk_level !== 'low').map(student => (
              <article key={student.id} className="admin-risk-row">
                <div>
                  <strong>{student.name}</strong>
                  <span>Skor {student.average_score} · Progress {Math.round(student.completion_rate * 100)}% · Stres {student.stress_level}/10</span>
                  <div className="dash-mini-tags">
                    {student.weak_subjects.map(subject => <em key={subject}>#{subject}</em>)}
                  </div>
                </div>
                <span className="admin-risk-badge" style={{ color: riskColor(student.risk_level) }}>{riskLabel(student.risk_level)}</span>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
