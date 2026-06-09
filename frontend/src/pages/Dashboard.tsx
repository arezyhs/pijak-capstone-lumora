import { useEffect, useState } from 'react'
import { Brain, ClipboardCheck, Activity, GraduationCap, ArrowRight, BookOpen, Lightbulb, Sparkles, Target, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { fetchStudentDashboard } from '../api/client'
import type { DashboardResponse } from '../types'

// --- Tips & Tricks Data ---
const TIPS = [
  {
    title: 'Teknik Pomodoro untuk Belajar Efektif',
    body: 'Belajar selama 25 menit, istirahat 5 menit. Setelah 4 siklus, ambil istirahat panjang 15-30 menit. Metode ini meningkatkan fokus hingga 40% berdasarkan riset Universitas Illinois.',
    tag: 'Produktivitas',
  },
  {
    title: 'Spaced Repetition: Mengingat Lebih Lama',
    body: 'Jangan cram! Ulangi materi dengan jeda waktu yang semakin panjang: 1 hari → 3 hari → 7 hari → 14 hari. Otak Anda memindahkan informasi dari memori jangka pendek ke jangka panjang jauh lebih efektif dengan cara ini.',
    tag: 'Memori',
  },
  {
    title: 'Active Recall: Uji Diri Sendiri',
    body: 'Setelah membaca materi, tutup buku dan coba jelaskan ulang dengan kata-kata sendiri. Jika mentok, buka kembali hanya bagian yang lupa. Teknik ini 3x lebih efektif dibandingkan membaca ulang pasif.',
    tag: 'Strategi',
  },
]

// --- Actionable links for learning path ---
const PATH_ACTIONS: Record<string, { label: string; to: string }> = {
  'review': { label: 'Buka Materi', to: '/materials' },
  'latihan': { label: 'Mulai Kuis', to: '/quiz' },
  'evaluasi': { label: 'Mulai Evaluasi', to: '/quiz' },
}

function getPathAction(step: string): { label: string; to: string } {
  const lower = step.toLowerCase()
  if (lower.includes('review') || lower.includes('baca') || lower.includes('pelajari')) return PATH_ACTIONS['review']
  if (lower.includes('latihan') || lower.includes('soal') || lower.includes('praktik')) return PATH_ACTIONS['latihan']
  if (lower.includes('evaluasi') || lower.includes('ujian') || lower.includes('kuis')) return PATH_ACTIONS['evaluasi']
  return { label: 'Buka Materi', to: '/materials' }
}

export function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const username = localStorage.getItem('username') || 'student1'
        const data = await fetchStudentDashboard(username)
        setDashboard(data)
      } catch (err) {
        console.error(err)
        setError('Gagal mengambil data dari server. Pastikan backend FastAPI sedang berjalan (port 8000).')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', gap: '1rem' }}>
        <Brain size={48} color="var(--accent-primary)" style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }} />
        <h2 style={{ color: 'var(--ink)' }}>Menyelaraskan AI Engine...</h2>
      </div>
    )
  }

  if (error || !dashboard) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', padding: '2rem', color: 'var(--danger)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '8px' }}>Oops!</h2>
        <p style={{ maxWidth: '400px', lineHeight: '1.6' }}>{error}</p>
      </div>
    )
  }

  const isNeedsAttention = ['Fundamental Level', 'Visual Learning Path', 'Microlearning Mode'].includes(dashboard.recommendation.difficulty)
  const diffLabel = dashboard.recommendation.difficulty

  return (
    <div className="content">
      {/* Header */}
      <header className="topbar" style={{ marginBottom: '4px' }}>
        <div>
          <p className="eyebrow">Overview AI</p>
          <h1>Dashboard Pembelajaran</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/materials" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <BookOpen size={18} /> Materi
          </Link>
          <Link to="/quiz" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <ClipboardCheck size={18} /> Mulai Ujian
          </Link>
        </div>
      </header>

      {/* Hero — AI Status */}
      <section className="hero-panel" style={isNeedsAttention ? { background: 'linear-gradient(135deg, #dc2626, #ef4444)' } : {}}>
        <div style={{ zIndex: 2 }}>
          <p className="eyebrow">Prediksi Model AI (Random Forest)</p>
          <h2>{diffLabel}</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.6', opacity: 0.95 }}>{dashboard.recommendation.reason}</p>
          {isNeedsAttention && (
            <Link to="/materials" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '16px', padding: '10px 20px', background: 'rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '14px', backdropFilter: 'blur(4px)' }}>
              <Sparkles size={16} /> Mulai perbaikan sekarang <ArrowRight size={16} />
            </Link>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <div className="score-ring">
            <strong>{dashboard.progress.average_score}</strong>
            <span>AVG SKOR</span>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <div className="metric-grid">
        <article>
          <Activity size={24} />
          <span>Tingkat Penyelesaian</span>
          <strong>{Math.round(dashboard.progress.completion_rate * 100)}%</strong>
        </article>
        <article>
          <GraduationCap size={24} />
          <span>Streak Belajar</span>
          <strong>{dashboard.progress.current_streak} Hari</strong>
        </article>
        <article>
          <Brain size={24} />
          <span>Kuis Terakhir ({dashboard.latest_quiz.subject})</span>
          <strong style={dashboard.latest_quiz.score < 70 ? { color: 'var(--danger)' } : { color: 'var(--success)' }}>
            {dashboard.latest_quiz.score}
          </strong>
        </article>
      </div>

      {/* Learning Path with actionable links */}
      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Target size={20} color="var(--accent-primary)" /> Peta Kurikulum AI</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>Ikuti langkah-langkah berikut secara berurutan untuk hasil optimal.</p>
          </div>
        </div>
        <div className="dash-path-list">
          {dashboard.learning_path.map((step: string, i: number) => {
            const action = getPathAction(step)
            return (
              <Link to={action.to} key={i} className="dash-path-item" style={{ textDecoration: 'none' }}>
                <div className="dash-path-num">{i + 1}</div>
                <div className="dash-path-body">
                  <strong>{step}</strong>
                  <span className="dash-path-action">
                    {action.label} <ChevronRight size={14} />
                  </span>
                </div>
                <ArrowRight size={18} className="dash-path-arrow" />
              </Link>
            )
          })}
        </div>
      </section>

      {/* Two columns: Recommended Topics + Tips */}
      <div className="workspace-grid">
        {/* Topik Rekomendasi with links */}
        <section className="panel">
          <div className="panel-heading">
            <h2>Topik Rekomendasi</h2>
            <span style={{
              backgroundColor: isNeedsAttention ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: isNeedsAttention ? 'var(--danger)' : 'var(--success)',
              padding: '6px 12px', borderRadius: '8px', fontWeight: '700',
            }}>
              {diffLabel}
            </span>
          </div>
          <div className="recommendation-list">
            {dashboard.recommendation.recommended_topics.map((topic, i) => (
              <Link to="/materials" key={i} style={{ textDecoration: 'none' }}>
                <article className="dash-reco-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center', background: 'var(--accent-glow)', color: 'var(--accent-primary)', fontWeight: '800', fontSize: '13px', flexShrink: 0 }}>
                      {i + 1}
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ink)' }}>{topic}</strong>
                      <span style={{ display: 'block', fontSize: '13px', color: 'var(--muted)' }}>Buka materi terkait →</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--muted)" />
                </article>
              </Link>
            ))}
            {dashboard.recommendation.materials.map((mat, i) => (
              <Link to="/materials" key={`mat-${i}`} style={{ textDecoration: 'none' }}>
                <article className="dash-reco-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', display: 'grid', placeItems: 'center', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', flexShrink: 0 }}>
                      <BookOpen size={16} />
                    </div>
                    <div>
                      <strong style={{ color: 'var(--ink)' }}>{mat.title}</strong>
                      <span style={{ display: 'block', fontSize: '13px', color: 'var(--muted)' }}>{mat.type} · Buka materi →</span>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--muted)" />
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Tips & Tricks */}
        <section className="panel" style={{ background: 'linear-gradient(to bottom, #ffffff, var(--surface-alt))' }}>
          <div className="panel-heading">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Lightbulb size={20} color="var(--warning)" /> Tips Belajar Cerdas</h2>
          </div>
          <div className="dash-tips-list">
            {TIPS.map((tip, i) => (
              <article key={i} className="dash-tip-card">
                <div className="dash-tip-tag">{tip.tag}</div>
                <h3>{tip.title}</h3>
                <p>{tip.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
