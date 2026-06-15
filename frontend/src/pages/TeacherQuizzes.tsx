import { useEffect, useState } from 'react'
import { AlertTriangle, Save } from 'lucide-react'
import { LoadingScreen } from '../components/LoadingScreen'
import './TeacherView.css'
import { fetchQuizzes, addQuizQuestion } from '../api/client'

export function TeacherQuizzes() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  
  // Form State
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['', '', '', ''])
  const [correctIndex, setCorrectIndex] = useState(0)
  const [tags, setTags] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fetchQuizzes()
      setCategories(data)
      if (data.length > 0 && !selectedCategory) {
        setSelectedCategory(data[0].id)
      }
    } catch (err) {
      console.error(err)
      setError('Gagal mengambil data bank soal.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) return
    
    setSaving(true)
    setError(null)
    setMessage(null)

    const payload = {
      question,
      options,
      correctIndex,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    try {
      await addQuizQuestion(selectedCategory, payload)
      setMessage('Soal baru berhasil ditambahkan!')
      setQuestion('')
      setOptions(['', '', '', ''])
      setCorrectIndex(0)
      setTags('')
      await loadData()
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.detail ?? 'Gagal menambahkan soal kuis.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <LoadingScreen message="Menarik Data Bank Soal..." />
  }

  const currentCategoryData = categories.find(c => c.id === selectedCategory)

  return (
    <div className="content">
      <header className="topbar" style={{ marginBottom: '12px' }}>
        <div>
          <p className="eyebrow">Content Management System</p>
          <h1>Bank Soal Kuis</h1>
        </div>
      </header>

      {error && <div className="admin-alert danger"><AlertTriangle size={16} /> {error}</div>}
      {message && <div className="admin-alert success">{message}</div>}

      <div className="admin-grid">
        <section className="panel">
          <div className="panel-heading">
            <h2>Tambah Soal Baru</h2>
          </div>

          <form className="admin-form" onSubmit={handleSubmit}>
            <label>
              Pilih Mata Pelajaran
              <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} required>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </select>
            </label>
            
            <label>
              Pertanyaan Soal
              <textarea 
                value={question} 
                onChange={e => setQuestion(e.target.value)} 
                required 
                rows={3} 
                placeholder="Misal: Berapakah hasil dari 15 x 12?" 
                style={{ resize: 'vertical' }}
              />
            </label>

            <div style={{ marginTop: '16px', marginBottom: '8px', fontWeight: 600, fontSize: '13px', color: 'var(--ink)' }}>Opsi Jawaban (Pilih salah satu sebagai jawaban benar)</div>
            {options.map((opt, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
                <input 
                  type="radio" 
                  name="correctAnswer" 
                  checked={correctIndex === idx} 
                  onChange={() => setCorrectIndex(idx)} 
                  style={{ width: '18px', height: '18px', margin: 0, cursor: 'pointer' }}
                />
                <input 
                  value={opt} 
                  onChange={e => handleOptionChange(idx, e.target.value)} 
                  required 
                  placeholder={`Opsi ${String.fromCharCode(65 + idx)}`} 
                  style={{ flex: 1, margin: 0 }}
                />
              </div>
            ))}

            <label style={{ marginTop: '16px' }}>
              Label Topik (Pisahkan dengan koma)
              <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Contoh: matematika, aljabar, akar" />
            </label>

            <button className="btn-primary" type="submit" disabled={saving} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
              <Save size={16} /> Simpan Soal
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <h2>Daftar Soal {currentCategoryData?.title}</h2>
            <span className="dash-model-badge">{currentCategoryData?.questions?.length || 0} Soal</span>
          </div>
          <div className="recommendation-list" style={{ maxHeight: '600px', overflowY: 'auto', paddingRight: '4px' }}>
            {currentCategoryData?.questions?.length === 0 ? (
              <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '18px' }}>Belum ada soal kuis.</p>
            ) : currentCategoryData?.questions?.map((q: any, i: number) => (
              <article key={i} className="admin-risk-row" style={{ alignItems: 'flex-start', background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <strong style={{ color: 'var(--brand)' }}>{i + 1}.</strong>
                    <strong style={{ lineHeight: 1.4 }}>{q.question}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '22px' }}>
                    {q.options.map((opt: string, idx: number) => (
                      <div key={idx} style={{ 
                        fontSize: '13px', 
                        padding: '6px 10px', 
                        borderRadius: '6px',
                        background: q.correctIndex === idx ? 'rgba(34, 197, 94, 0.1)' : 'var(--surface)',
                        color: q.correctIndex === idx ? '#15803d' : 'var(--ink)',
                        border: `1px solid ${q.correctIndex === idx ? '#22c55e' : 'var(--border)'}`,
                        fontWeight: q.correctIndex === idx ? '600' : '400'
                      }}>
                        {String.fromCharCode(65 + idx)}. {opt}
                      </div>
                    ))}
                  </div>
                  {q.tags && q.tags.length > 0 && (
                    <div className="dash-mini-tags" style={{ marginTop: '12px', paddingLeft: '22px' }}>
                      {q.tags.map((tag: string) => <em key={tag}>#{tag}</em>)}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
