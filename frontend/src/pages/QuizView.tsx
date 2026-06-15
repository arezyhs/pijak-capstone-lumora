import { useState, useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitQuiz, fetchQuizzes } from '../api/client'
import { BookOpen, Calculator, BrainCircuit, Activity, CheckCircle2, XCircle, ArrowLeft, Languages, Landmark, Map, Cpu } from 'lucide-react'

// --- Data Types ---
type Question = {
  question: string
  options: string[]
  correctIndex: number
  tags?: string[]
}

type Module = {
  id: string
  title: string
  icon: string | ReactNode
  color: string
  tags?: string[]
  questions: Question[]
}

const ICON_MAP: Record<string, ReactNode> = {
  "Calculator": <Calculator size={24} />,
  "Activity": <Activity size={24} />,
  "BrainCircuit": <BrainCircuit size={24} />,
  "Languages": <Languages size={24} />,
  "Landmark": <Landmark size={24} />,
  "Map": <Map size={24} />,
  "Cpu": <Cpu size={24} />,
  "BookOpen": <BookOpen size={24} />
}

// --- Component ---
export function QuizView() {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchQuizzes()
        setModules(data)
      } catch (err) {
        console.error('Failed to load quizzes', err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const startQuiz = (mod: Module) => {
    setSelectedModule(mod)
    setCurrentQ(0)
    setAnswers(new Array(mod.questions.length).fill(null))
    setSubmitted(false)
  }

  const selectAnswer = (optionIndex: number) => {
    if (submitted) return
    setAnswers(prev => {
      const copy = [...prev]
      copy[currentQ] = optionIndex
      return copy
    })
  }

  const calcScore = (): number => {
    if (!selectedModule) return 0
    const correct = answers.filter((a, i) => a === selectedModule.questions[i].correctIndex).length
    return Math.round((correct / selectedModule.questions.length) * 100)
  }

  const handleSubmit = async () => {
    if (!selectedModule) return
    setSubmitted(true)

    const score = calcScore()
    try {
      setIsSubmitting(true)
      const username = localStorage.getItem('username') || 'student1'
      await submitQuiz(username, { subject: selectedModule.id, score })
    } catch (err) {
      console.error('Gagal mengirim skor:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // --- Module Selection Screen ---
  if (loading) {
    return (
      <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--muted)' }}>Memuat bank soal dari server...</p>
      </div>
    )
  }

  if (!selectedModule) {
    return (
      <div className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Evaluasi Adaptif</p>
            <h1>Pilih Modul Ujian</h1>
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px', marginTop: '16px' }}>
          {modules.map(mod => (
            <div
              key={mod.id}
              onClick={() => startQuiz(mod)}
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border)',
                borderRadius: '24px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-8px)'
                e.currentTarget.style.boxShadow = `0 20px 40px ${mod.color}20`
                e.currentTarget.style.borderColor = mod.color
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.02)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <div style={{ padding: '20px', background: `${mod.color}15`, color: mod.color, borderRadius: '50%' }}>
                {typeof mod.icon === 'string' ? ICON_MAP[mod.icon] : mod.icon}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)' }}>{mod.title}</h2>
              <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '14px' }}>
                {mod.questions.length} soal pilihan ganda · AI akan menyesuaikan kurikulum Anda berdasarkan hasil.
              </p>
              {mod.tags && mod.tags.length > 0 && (
                <div className="content-tags compact" style={{ justifyContent: 'center' }}>
                  {mod.tags.slice(0, 4).map(tag => <span key={tag}>#{tag}</span>)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // --- Results Screen ---
  if (submitted) {
    const score = calcScore()
    const total = selectedModule.questions.length
    const correct = answers.filter((a, i) => a === selectedModule.questions[i].correctIndex).length

    return (
      <div className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Hasil Evaluasi</p>
            <h1>{selectedModule.title}</h1>
          </div>
        </header>

        {/* Score Summary Card */}
        <section className="hero-panel" style={score < 60 ? { background: 'linear-gradient(135deg, #dc2626, #ef4444)' } : {}}>
          <div style={{ zIndex: 2 }}>
            <p className="eyebrow">Skor Anda</p>
            <h2 style={{ fontSize: '64px', lineHeight: 1 }}>{score}</h2>
            <p>{correct} dari {total} jawaban benar. {score >= 70 ? 'Bagus sekali! AI akan mempertahankan kurikulum Anda.' : 'AI telah mengubah kurikulum Anda ke mode Remedial.'}</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', zIndex: 2 }}>
            <div className="score-ring">
              <strong>{correct}/{total}</strong>
              <span>BENAR</span>
            </div>
          </div>
        </section>

        {/* Answer Review */}
        <section className="panel">
          <div className="panel-heading">
            <h2>Pembahasan Jawaban</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
            {selectedModule.questions.map((q, i) => {
              const isCorrect = answers[i] === q.correctIndex
              return (
                <div key={i} style={{
                  padding: '20px',
                  borderRadius: '16px',
                  border: `1px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`,
                  background: isCorrect ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                    {isCorrect
                      ? <CheckCircle2 size={22} color="var(--success)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      : <XCircle size={22} color="var(--danger)" style={{ flexShrink: 0, marginTop: '2px' }} />}
                    <div>
                      <strong style={{ color: 'var(--ink)', fontSize: '15px' }}>Soal {i + 1}: {q.question}</strong>
                      <p style={{ fontSize: '14px', color: 'var(--muted)', marginTop: '4px' }}>
                        Jawaban Anda: <strong style={{ color: isCorrect ? 'var(--success)' : 'var(--danger)' }}>{answers[i] !== null ? q.options[answers[i]] : '(Tidak dijawab)'}</strong>
                        {!isCorrect && <> · Jawaban benar: <strong style={{ color: 'var(--success)' }}>{q.options[q.correctIndex]}</strong></>}
                      </p>
                      {q.tags && q.tags.length > 0 && (
                        <div className="content-tags compact">
                          {q.tags.slice(0, 3).map(tag => <span key={tag}>#{tag}</span>)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
          <button className="btn-outline" onClick={() => { setSelectedModule(null); setSubmitted(false) }}>Pilih Modul Lain</button>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>Lihat Dashboard AI</button>
        </div>
      </div>
    )
  }

  // --- Active Quiz Screen ---
  const q = selectedModule.questions[currentQ]
  const progress = ((currentQ + 1) / selectedModule.questions.length) * 100

  return (
    <div className="content">
      <header className="topbar">
        <div>
          <p className="eyebrow">Modul: {selectedModule.title}</p>
          <h1>Soal {currentQ + 1} dari {selectedModule.questions.length}</h1>
        </div>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setSelectedModule(null)}>
          <ArrowLeft size={16} /> Keluar
        </button>
      </header>

      {/* Progress bar */}
      <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: '3px', transition: 'width 0.4s ease' }} />
      </div>

      <section className="panel" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '28px' }}>
          <div style={{ padding: '14px', background: `${selectedModule.color}15`, color: selectedModule.color, borderRadius: '16px', flexShrink: 0 }}>
            <BookOpen size={28} />
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)', lineHeight: 1.5 }}>{q.question}</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
          {q.options.map((opt, oi) => {
            const isSelected = answers[currentQ] === oi
            return (
              <button
                key={oi}
                onClick={() => selectAnswer(oi)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  borderRadius: '14px',
                  border: isSelected ? `2px solid ${selectedModule.color}` : '1px solid var(--border)',
                  background: isSelected ? `${selectedModule.color}08` : '#ffffff',
                  color: 'var(--ink)',
                  cursor: 'pointer',
                  fontWeight: isSelected ? '700' : '500',
                  fontSize: '15px',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? `0 4px 16px ${selectedModule.color}15` : '0 2px 8px rgba(0,0,0,0.02)',
                }}
              >
                <span style={{
                  width: '36px',
                  height: '36px',
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '10px',
                  background: isSelected ? selectedModule.color : 'var(--surface-alt)',
                  color: isSelected ? '#ffffff' : 'var(--ink-light)',
                  fontWeight: '800',
                  fontSize: '14px',
                  flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + oi)}
                </span>
                {opt}
              </button>
            )
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            className="btn-outline"
            disabled={currentQ === 0}
            onClick={() => setCurrentQ(prev => prev - 1)}
            style={{ opacity: currentQ === 0 ? 0.4 : 1 }}
          >
            Sebelumnya
          </button>

          {currentQ < selectedModule.questions.length - 1 ? (
            <button
              className="btn-primary"
              disabled={answers[currentQ] === null}
              onClick={() => setCurrentQ(prev => prev + 1)}
              style={{ opacity: answers[currentQ] === null ? 0.5 : 1 }}
            >
              Selanjutnya
            </button>
          ) : (
            <button
              className="btn-primary"
              disabled={answers.some(a => a === null) || isSubmitting}
              onClick={handleSubmit}
              style={{ opacity: answers.some(a => a === null) ? 0.5 : 1 }}
            >
              {isSubmitting ? 'Mengirim...' : 'Selesai & Kirim'}
            </button>
          )}
        </div>
      </section>
    </div>
  )
}
