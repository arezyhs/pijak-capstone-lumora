import { useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { fetchMaterials, fetchQuizzes, fetchStudentDashboard, fetchStudentHistory } from '../api/client'
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Gauge,
  GraduationCap,
  Lightbulb,
  Route,
  Sparkles,
  Tags,
  Target,
  TrendingDown,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import type { DashboardResponse, StudentHistoryResponse } from '../types'

type MaterialItem = {
  id: string
  title: string
  type: 'video' | 'article'
  duration: string
  tags?: string[]
  content?: string
}

type SubjectCategory = {
  id: string
  name: string
  color: string
  tags?: string[]
  materials: MaterialItem[]
}

type QuizModule = {
  id: string
  title: string
  color: string
  tags?: string[]
  questions: { tags?: string[] }[]
}

const PATH_ACTIONS: Record<string, { label: string; to: string }> = {
  review: { label: 'Buka Materi', to: '/materials' },
  latihan: { label: 'Mulai Kuis', to: '/quiz' },
  evaluasi: { label: 'Mulai Evaluasi', to: '/quiz' },
}

function getPathAction(step: string): { label: string; to: string } {
  const lower = step.toLowerCase()
  if (lower.includes('review') || lower.includes('baca') || lower.includes('pelajari') || lower.includes('video')) return PATH_ACTIONS.review
  if (lower.includes('latihan') || lower.includes('soal') || lower.includes('praktik')) return PATH_ACTIONS.latihan
  if (lower.includes('evaluasi') || lower.includes('ujian') || lower.includes('kuis')) return PATH_ACTIONS.evaluasi
  return PATH_ACTIONS.review
}

function normalizeTag(value: string): string {
  return value.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-')
}

function scoreColor(score: number): string {
  if (score >= 80) return 'var(--success)'
  if (score >= 60) return 'var(--warning)'
  return 'var(--danger)'
}

function buildAdaptiveTips(dashboard: DashboardResponse, weakSubjects: [string, number][]) {
  const tags = dashboard.recommendation.recommended_tags
  const tips = []

  if (weakSubjects.length > 0) {
    tips.push({
      tag: 'Prioritas',
      title: `Fokus 30 menit di ${weakSubjects[0][0]}`,
      body: `Skor rata-rata terendah Anda ada di ${weakSubjects[0][0]} (${weakSubjects[0][1]}). Buka 1 materi bertag #${tags[0] ?? normalizeTag(weakSubjects[0][0])}, lalu langsung kerjakan kuis ulang.`,
    })
  }

  if (dashboard.progress.completion_rate < 0.35) {
    tips.push({
      tag: 'Konsistensi',
      title: 'Selesaikan satu materi pendek sebelum kuis',
      body: `Progress materi baru ${Math.round(dashboard.progress.completion_rate * 100)}%. Sistem akan lebih akurat kalau Anda menandai materi selesai setelah benar-benar dipelajari.`,
    })
  }

  if (dashboard.latest_quiz.score < 70) {
    tips.push({
      tag: 'Perbaikan',
      title: 'Ulangi kuis setelah review tag lemah',
      body: `Skor kuis terakhir ${dashboard.latest_quiz.score}. Jangan langsung lompat topik; baca materi rekomendasi, catat 3 poin sulit, lalu kerjakan evaluasi ulang.`,
    })
  } else {
    tips.push({
      tag: 'Akselerasi',
      title: 'Naikkan level dengan latihan campuran',
      body: `Skor terakhir ${dashboard.latest_quiz.score}. Pertahankan ritme dengan latihan dari tag yang sama dan satu tag baru agar pemahaman tidak terlalu sempit.`,
    })
  }

  if (!dashboard.recommendation.model_used) {
    tips.push({
      tag: 'Data',
      title: 'Model memakai fallback rule',
      body: 'Model ML belum aktif atau gagal dipakai. Hasil tetap berdasarkan aturan skor/progres, tetapi prediksi akan lebih kuat setelah model tersedia.',
    })
  }

  return tips.slice(0, 3)
}

export function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null)
  const [history, setHistory] = useState<StudentHistoryResponse | null>(null)
  const [materials, setMaterials] = useState<SubjectCategory[]>([])
  const [quizzes, setQuizzes] = useState<QuizModule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const username = localStorage.getItem('username') || 'student1'
        const [dashboardData, historyData, materialData, quizData] = await Promise.all([
          fetchStudentDashboard(username),
          fetchStudentHistory(username),
          fetchMaterials(),
          fetchQuizzes(),
        ])
        setDashboard(dashboardData)
        setHistory(historyData)
        setMaterials(materialData)
        setQuizzes(quizData)
      } catch (err) {
        console.error(err)
        setError('Gagal mengambil data dari server. Pastikan backend FastAPI sedang berjalan di port 8000.')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const weakSubjects = useMemo<[string, number][]>(() => {
    if (!history) return []
    return Object.entries(history.score_by_subject)
      .sort((a, b) => a[1] - b[1])
      .map(([subject, avg]) => [subject, Number(avg.toFixed(1))])
  }, [history])

  const recommendedMaterials = useMemo(() => {
    if (!dashboard) return []
    const recommendedTags = new Set(dashboard.recommendation.recommended_tags.map(normalizeTag))
    const weakSet = new Set(weakSubjects.map(([subject]) => normalizeTag(subject)))

    return materials
      .flatMap(category => category.materials.map(material => ({ category, material })))
      .map(item => {
        const materialTags = (item.material.tags ?? []).map(normalizeTag)
        const categoryTags = (item.category.tags ?? []).map(normalizeTag)
        const allTags = [...materialTags, ...categoryTags]
        const tagMatches = allTags.filter(tag => recommendedTags.has(tag)).length
        const subjectMatch = weakSet.has(normalizeTag(item.category.name)) || weakSet.has(normalizeTag(item.category.id)) ? 2 : 0
        return { ...item, score: tagMatches + subjectMatch }
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
  }, [dashboard, materials, weakSubjects])

  const quizChartData = useMemo(() => {
    if (!history?.quiz_history) return [];
    return history.quiz_history.map((q, i) => ({
      name: `Kuis ${i+1}`,
      date: new Date(q.submitted_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' }),
      score: q.score,
      subject: q.subject
    }));
  }, [history]);

  const conditionChartData = useMemo(() => {
    if (!history?.condition_history) return [];
    return history.condition_history.map((c, i) => ({
      name: `Hari ${i+1}`,
      date: new Date(c.logged_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      stress: c.stress_level,
      sleep: c.sleep_hours
    }));
  }, [history]);

  const targetQuiz = useMemo(() => {
    if (!dashboard) return null
    const recommendedTags = new Set(dashboard.recommendation.recommended_tags.map(normalizeTag))
    const weakSet = new Set(weakSubjects.map(([subject]) => normalizeTag(subject)))

    return quizzes
      .map(quiz => {
        const quizTags = (quiz.tags ?? []).map(normalizeTag)
        const questionTags = quiz.questions.flatMap(question => question.tags ?? []).map(normalizeTag)
        const tagMatches = [...quizTags, ...questionTags].filter(tag => recommendedTags.has(tag)).length
        const subjectMatch = weakSet.has(normalizeTag(quiz.id)) || weakSet.has(normalizeTag(quiz.title)) ? 8 : 0
        return { quiz, score: tagMatches + subjectMatch }
      })
      .sort((a, b) => b.score - a.score)[0]?.quiz ?? null
  }, [dashboard, quizzes, weakSubjects])

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
        <h2 style={{ marginBottom: '8px' }}>Dashboard belum tersedia</h2>
        <p style={{ maxWidth: '460px', lineHeight: '1.6' }}>{error}</p>
      </div>
    )
  }

  const isNeedsAttention = ['Fundamental Level', 'Visual Learning Path', 'Microlearning Mode'].includes(dashboard.recommendation.difficulty)
  const confidencePct = Math.round((dashboard.recommendation.confidence ?? 0) * 100)
  const adaptiveTips = buildAdaptiveTips(dashboard, weakSubjects)
  const primaryWeakSubject = weakSubjects[0]

  return (
    <div className="content">
      <header className="topbar" style={{ marginBottom: '4px' }}>
        <div>
          <p className="eyebrow">Overview AI</p>
          <h1>Dashboard Pembelajaran</h1>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link to="/materials" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <BookOpen size={18} /> Baca Materi
          </Link>
          <Link to="/quiz" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <ClipboardCheck size={18} /> Mulai Kuis
          </Link>
        </div>
      </header>

      <section className="hero-panel" style={isNeedsAttention ? { background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.3)' } : {}}>
        <div style={{ zIndex: 2 }}>
          <p className="eyebrow">Kata AI</p>
          <h2>{dashboard.recommendation.difficulty}</h2>
          <p style={{ fontSize: '15px', lineHeight: '1.6', opacity: 0.95 }}>
            {dashboard.recommendation.reason}
          </p>
          <div className="dash-hero-tags">
            <span><Brain size={14} /> {dashboard.recommendation.model_used ? 'Random Forest aktif' : 'Fallback rule aktif'}</span>
            <span><Gauge size={14} /> Confidence {confidencePct}%</span>
            {primaryWeakSubject && <span><TrendingDown size={14} /> Fokus: {primaryWeakSubject[0]}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <div className="score-ring">
            <strong>{dashboard.progress.average_score}</strong>
            <span>AVG SKOR</span>
          </div>
        </div>
      </section>

      <div className="metric-grid">
        <article>
          <Activity size={24} />
          <span>Tingkat Penyelesaian</span>
          <strong>{Math.round(dashboard.progress.completion_rate * 100)}%</strong>
        </article>
        <article>
          <GraduationCap size={24} />
          <span>Total Kuis</span>
          <strong>{history?.total_quizzes ?? 0}</strong>
        </article>
        <article>
          <Brain size={24} />
          <span>Kuis Terakhir ({dashboard.latest_quiz.subject})</span>
          <strong style={{ color: scoreColor(dashboard.latest_quiz.score) }}>
            {dashboard.latest_quiz.score}
          </strong>
        </article>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Route size={20} color="var(--accent-primary)" /> Peta Kurikulum AI
            </h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '4px' }}>
              Rute ini dibuat dari skor kuis, progres materi, tag lemah, dan prediksi model.
            </p>
          </div>
        </div>
        <div className="dash-path-list">
          {dashboard.learning_path.map((step, i) => {
            const action = getPathAction(step)
            return (
              <Link to={action.to} key={step} className="dash-path-item" style={{ textDecoration: 'none' }}>
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

      <div className="workspace-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="var(--accent-primary)" /> Diagnosis Belajar
            </h2>
          </div>

          <div className="dash-signal-grid">
            {weakSubjects.slice(0, 4).map(([subject, avg]) => (
              <article key={subject} className="dash-signal-card">
                <div>
                  <span>{subject}</span>
                  <strong style={{ color: scoreColor(avg) }}>{avg}</strong>
                </div>
                <div className="dash-score-track">
                  <div style={{ width: `${avg}%`, background: scoreColor(avg) }} />
                </div>
              </article>
            ))}
          </div>

          <div className="content-tags" style={{ marginTop: '18px' }}>
            {dashboard.recommendation.recommended_tags.map(tag => (
              <span key={tag}><Tags size={12} /> #{tag}</span>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--warning)" /> Aksi Berikutnya
            </h2>
          </div>
          <div className="dash-next-actions">
            <Link to="/materials" className="dash-action-card">
              <BookOpen size={20} />
              <div>
                <strong>Baca materi paling cocok</strong>
                <span>{recommendedMaterials[0]?.material.title ?? 'Buka materi sesuai tag rekomendasi'}</span>
              </div>
              <ChevronRight size={18} />
            </Link>
            <Link to="/quiz" className="dash-action-card">
              <ClipboardCheck size={20} />
              <div>
                <strong>Kerjakan kuis target</strong>
                <span>{targetQuiz ? `${targetQuiz.title} - ${targetQuiz.questions.length} soal` : 'Pilih modul kuis sesuai topik lemah'}</span>
              </div>
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      </div>

      <div className="workspace-grid" style={{ marginBottom: '24px' }}>
        <section className="panel">
          <div className="panel-heading">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingDown size={20} color="var(--accent-primary)" /> Visualisasi Perkembangan Nilai
            </h2>
          </div>
          <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
            {quizChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={quizChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--ink)' }}
                    itemStyle={{ color: 'var(--ink)' }}
                  />
                  <Line type="monotone" dataKey="score" name="Skor Kuis" stroke="var(--accent-primary)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="dash-empty-state">Belum ada data kuis untuk divisualisasikan.</div>
            )}
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={20} color="var(--danger)" /> Visualisasi Kondisi Mental & Fisik
            </h2>
          </div>
          <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
            {conditionChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conditionChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--muted)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" stroke="var(--danger)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 10]} />
                  <YAxis yAxisId="right" orientation="right" stroke="var(--warning)" fontSize={12} tickLine={false} axisLine={false} domain={[0, 14]} />
                  <Tooltip 
                    contentStyle={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--ink)' }}
                    itemStyle={{ color: 'var(--ink)' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }} />
                  <Line yAxisId="left" type="monotone" dataKey="stress" name="Tingkat Stres (1-10)" stroke="var(--danger)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="monotone" dataKey="sleep" name="Waktu Tidur (Jam)" stroke="var(--warning)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="dash-empty-state">Belum ada rekam jejak kondisi.</div>
            )}
          </div>
        </section>
      </div>

      <div className="workspace-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Materi yang Direkomendasikan</h2>
            <span className="dash-model-badge">{recommendedMaterials.length} cocok</span>
          </div>
          <div className="recommendation-list">
            {recommendedMaterials.length > 0 ? recommendedMaterials.map(({ category, material }) => (
              <Link to="/materials" key={material.id} style={{ textDecoration: 'none' }}>
                <article className="dash-reco-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'grid', placeItems: 'center', background: `${category.color}15`, color: category.color, flexShrink: 0 }}>
                      <BookOpen size={17} />
                    </div>
                    <div>
                      <strong>{material.title}</strong>
                      <span>{category.name} · {material.type} · {material.duration}</span>
                      <div className="dash-mini-tags">
                        {(material.tags ?? []).slice(0, 3).map(tag => <em key={tag}>#{tag}</em>)}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={18} color="var(--muted)" />
                </article>
              </Link>
            )) : (
              <div className="dash-empty-state">
                <AlertTriangle size={20} />
                <span>Belum ada materi yang cocok dengan tag rekomendasi. Coba kerjakan kuis terbaru untuk memperbarui sinyal.</span>
              </div>
            )}
          </div>
        </section>

        <section className="panel" style={{ background: 'linear-gradient(to bottom, var(--surface), var(--surface-alt))' }}>
          <div className="panel-heading">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Lightbulb size={20} color="var(--warning)" /> Tips Belajar Adaptif
            </h2>
          </div>
          <div className="dash-tips-list">
            {adaptiveTips.map(tip => (
              <article key={tip.title} className="dash-tip-card">
                <div className="dash-tip-tag">{tip.tag}</div>
                <h3>{tip.title}</h3>
                <p>{tip.body}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="panel">
        <div className="panel-heading">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={20} color="var(--accent-primary)" /> Transparansi Sinyal Model
          </h2>
        </div>
        <div className="dash-model-grid">
          <article>
            <CheckCircle2 size={18} />
            <span>Input skor rata-rata</span>
            <strong>{dashboard.progress.average_score}</strong>
          </article>
          <article>
            <CheckCircle2 size={18} />
            <span>Input progres materi</span>
            <strong>{Math.round(dashboard.progress.completion_rate * 100)}%</strong>
          </article>
          <article>
            <CheckCircle2 size={18} />
            <span>Tag rekomendasi</span>
            <strong>{dashboard.recommendation.recommended_tags.length}</strong>
          </article>
          <article>
            <CheckCircle2 size={18} />
            <span>Status model</span>
            <strong>{dashboard.recommendation.model_used ? 'ML aktif' : 'Rule fallback'}</strong>
          </article>
        </div>
      </section>

    </div>
  )
}
