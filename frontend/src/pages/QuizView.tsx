import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { submitQuiz } from '../api/client'
import { BookOpen, Calculator, BrainCircuit, Activity, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react'

// --- Data Types ---
type Question = {
  question: string
  options: string[]
  correctIndex: number
}

type Module = {
  id: string
  title: string
  icon: ReactNode
  color: string
  questions: Question[]
}

// --- Question Banks ---
const MODULES: Module[] = [
  {
    id: 'Matematika',
    title: 'Matematika Dasar',
    icon: <Calculator size={24} />,
    color: '#3b82f6',
    questions: [
      {
        question: 'Berapakah hasil dari 15 × 12?',
        options: ['160', '170', '180', '190'],
        correctIndex: 2,
      },
      {
        question: 'Jika x + 7 = 15, berapakah nilai x?',
        options: ['6', '7', '8', '9'],
        correctIndex: 2,
      },
      {
        question: 'Berapakah luas persegi panjang dengan panjang 8 cm dan lebar 5 cm?',
        options: ['30 cm²', '35 cm²', '40 cm²', '45 cm²'],
        correctIndex: 2,
      },
      {
        question: 'Berapakah hasil dari √144?',
        options: ['10', '11', '12', '14'],
        correctIndex: 2,
      },
      {
        question: 'Jika 2x - 3 = 11, berapakah nilai x?',
        options: ['5', '6', '7', '8'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'Sains',
    title: 'Sains Terpadu',
    icon: <Activity size={24} />,
    color: '#10b981',
    questions: [
      {
        question: 'Planet manakah yang paling dekat dengan matahari?',
        options: ['Venus', 'Mars', 'Merkurius', 'Bumi'],
        correctIndex: 2,
      },
      {
        question: 'Apa rumus kimia dari air?',
        options: ['CO₂', 'H₂O', 'NaCl', 'O₂'],
        correctIndex: 1,
      },
      {
        question: 'Satuan SI untuk gaya adalah?',
        options: ['Joule', 'Watt', 'Newton', 'Pascal'],
        correctIndex: 2,
      },
      {
        question: 'Proses tumbuhan mengubah cahaya matahari menjadi energi disebut?',
        options: ['Respirasi', 'Fotosintesis', 'Fermentasi', 'Osmosis'],
        correctIndex: 1,
      },
      {
        question: 'Lapisan atmosfer bumi yang paling dekat dengan permukaan disebut?',
        options: ['Stratosfer', 'Mesosfer', 'Troposfer', 'Termosfer'],
        correctIndex: 2,
      },
    ],
  },
  {
    id: 'Logika',
    title: 'Logika & Penalaran',
    icon: <BrainCircuit size={24} />,
    color: '#8b5cf6',
    questions: [
      {
        question: 'Jika semua kucing adalah hewan, dan Mimi adalah kucing, maka:',
        options: ['Mimi bukan hewan', 'Mimi adalah hewan', 'Semua hewan adalah kucing', 'Mimi adalah anjing'],
        correctIndex: 1,
      },
      {
        question: 'Apa bilangan berikutnya dalam deret: 2, 6, 18, 54, ...?',
        options: ['108', '162', '72', '148'],
        correctIndex: 1,
      },
      {
        question: 'Negasi dari pernyataan "Semua siswa lulus ujian" adalah:',
        options: ['Semua siswa tidak lulus', 'Ada siswa yang tidak lulus', 'Tidak ada siswa yang lulus', 'Beberapa siswa lulus'],
        correctIndex: 1,
      },
      {
        question: 'Jika p → q benar dan p benar, maka:',
        options: ['q salah', 'q benar', 'Tidak dapat ditentukan', 'p salah'],
        correctIndex: 1,
      },
      {
        question: 'Manakah yang merupakan contoh silogisme yang valid?',
        options: [
          'Semua A adalah B, semua B adalah C, maka semua A adalah C',
          'Beberapa A adalah B, semua C adalah B, maka semua A adalah C',
          'Semua A adalah B, beberapa C adalah A, maka semua C adalah B',
          'Tidak ada yang valid',
        ],
        correctIndex: 0,
      },
    ],
  },
]

// --- Component ---
export function QuizView() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

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
          {MODULES.map(mod => (
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
                {mod.icon}
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)' }}>{mod.title}</h2>
              <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: '14px' }}>
                {mod.questions.length} soal pilihan ganda · AI akan menyesuaikan kurikulum Anda berdasarkan hasil.
              </p>
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
