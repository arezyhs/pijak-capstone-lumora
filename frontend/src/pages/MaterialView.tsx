import { useState, useEffect } from 'react'
import { PlayCircle, FileText, CheckCircle2, ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react'
import { completeMaterial, fetchMaterials } from '../api/client'

// --- Data Types ---
type MaterialItem = {
  id: string
  title: string
  type: 'video' | 'article'
  duration: string
  completed: boolean
  content?: string
}

type SubjectCategory = {
  id: string
  name: string
  color: string
  materials: MaterialItem[]
}

// --- Simple Markdown → HTML renderer ---
function renderMarkdown(text: string): string {
  return text
    .split('\n\n')
    .map(block => {
      const trimmed = block.trim()
      if (!trimmed) return ''

      const lines = trimmed.split('\n')
      const isBulletList = lines.every(l => l.trim().startsWith('- '))
      const isNumberedList = lines.every(l => /^\d+\.\s/.test(l.trim()))

      if (isBulletList) {
        const items = lines.map(l => `<li>${inlineFormat(l.trim().slice(2))}</li>`).join('')
        return `<ul>${items}</ul>`
      }
      if (isNumberedList) {
        const items = lines.map(l => `<li>${inlineFormat(l.trim().replace(/^\d+\.\s/, ''))}</li>`).join('')
        return `<ol>${items}</ol>`
      }

      if (trimmed.includes('|') && trimmed.includes('---')) {
        const tableLines = lines.filter(l => l.trim() && !l.trim().match(/^\|[-| ]+\|$/))
        if (tableLines.length >= 1) {
          const headerCells = tableLines[0].split('|').filter(c => c.trim())
          const bodyRows = tableLines.slice(1)
          let html = '<table><thead><tr>' + headerCells.map(c => `<th>${inlineFormat(c.trim())}</th>`).join('') + '</tr></thead><tbody>'
          for (const row of bodyRows) {
            const cells = row.split('|').filter(c => c.trim())
            html += '<tr>' + cells.map(c => `<td>${inlineFormat(c.trim())}</td>`).join('') + '</tr>'
          }
          html += '</tbody></table>'
          return html
        }
      }

      const formatted = lines.map(l => inlineFormat(l)).join('<br/>')
      return `<p>${formatted}</p>`
    })
    .join('')
}

function inlineFormat(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
}

// --- Component ---
export function MaterialView() {
  const [activeCategory, setActiveCategory] = useState<SubjectCategory | null>(null)
  const [materials, setMaterials] = useState<SubjectCategory[]>([])
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const data = await fetchMaterials()
        // Ensure all fetched materials have a 'completed' field initialized
        const processedData = data.map((cat: any) => ({
          ...cat,
          materials: cat.materials.map((m: any) => ({ ...m, completed: false }))
        }))
        setMaterials(processedData)
      } catch (err) {
        console.error('Failed to load materials', err)
      } finally {
        setLoading(false)
      }
    }
    loadMaterials()
  }, [])

  const markCompleted = async (catId: string, matId: string) => {
    try {
      const username = localStorage.getItem('username') || 'student1';
      await completeMaterial(username, matId);
      
      setMaterials(prev =>
        prev.map(cat =>
          cat.id === catId
            ? { ...cat, materials: cat.materials.map(m => m.id === matId ? { ...m, completed: true } : m) }
            : cat
        )
      )
      setActiveMaterial(null)
    } catch (err) {
      console.error('Failed to mark material as completed', err);
    }
  }

  // Sync category state
  const currentCat = activeCategory ? materials.find(c => c.id === activeCategory.id)! : null

  // ============================================================
  // FULLSCREEN READER VIEW (Notion-inspired)
  // ============================================================
  if (activeMaterial && currentCat) {
    return (
      <div className="reader-fullscreen">
        {/* Top nav bar */}
        <nav className="reader-nav">
          <button className="reader-back" onClick={() => setActiveMaterial(null)}>
            <ArrowLeft size={18} />
            <span>Kembali ke {currentCat.name}</span>
          </button>
          {!activeMaterial.completed && (
            <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '14px' }} onClick={() => markCompleted(currentCat.id, activeMaterial.id)}>
              <CheckCircle2 size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
              Tandai Selesai
            </button>
          )}
          {activeMaterial.completed && (
            <span className="reader-badge-done">
              <CheckCircle2 size={16} /> Selesai
            </span>
          )}
        </nav>

        {/* Centered narrow column */}
        <article className="reader-body">
          {/* Breadcrumb */}
          <div className="reader-breadcrumb">
            <span>{currentCat.name}</span>
            <ChevronRight size={14} />
            <span>{activeMaterial.type === 'video' ? 'Video' : 'Artikel'}</span>
          </div>

          {/* Title block */}
          <h1 className="reader-title">{activeMaterial.title}</h1>

          <div className="reader-meta">
            <span className="reader-meta-badge" style={{ color: currentCat.color, background: `${currentCat.color}12` }}>
              {activeMaterial.type === 'video' ? <PlayCircle size={14} /> : <FileText size={14} />}
              {activeMaterial.type === 'video' ? 'Video' : 'Artikel'}
            </span>
            <span className="reader-meta-item">
              <Clock size={14} /> {activeMaterial.duration}
            </span>
          </div>

          <hr className="reader-divider" />

          {/* Content */}
          {activeMaterial.type === 'article' && activeMaterial.content ? (
            <div
              className="reader-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(activeMaterial.content) }}
            />
          ) : (
            <div className="reader-video-placeholder">
              <div className="reader-video-inner">
                <PlayCircle size={56} color={currentCat.color} strokeWidth={1.5} />
                <p>Simulasi Pemutar Video</p>
                <span>Durasi: {activeMaterial.duration}</span>
              </div>
            </div>
          )}
        </article>
      </div>
    )
  }

  // ============================================================
  // CATEGORY SELECTION
  // ============================================================
  if (loading) {
    return (
      <div className="content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--muted)' }}>Memuat materi dari server...</p>
      </div>
    )
  }

  if (!activeCategory) {
    return (
      <div className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">Perpustakaan Cerdas</p>
            <h1>Materi Belajar</h1>
          </div>
        </header>

        <p style={{ color: 'var(--muted)', fontSize: '15px', maxWidth: '560px', marginBottom: '8px' }}>
          Pilih kategori pelajaran untuk mulai belajar. Setiap kategori berisi artikel lengkap dan simulasi video yang dirancang untuk mendukung kurikulum AI Anda.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {materials.map(cat => {
            const completedCount = cat.materials.filter(m => m.completed).length
            const pct = Math.round((completedCount / cat.materials.length) * 100)
            return (
              <div
                key={cat.id}
                onClick={() => setActiveCategory(cat)}
                className="mat-category-card"
                style={{ '--cat-color': cat.color } as React.CSSProperties}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="mat-category-icon" style={{ background: `${cat.color}12`, color: cat.color }}>
                    <BookOpen size={22} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--muted)' }}>
                    {completedCount}/{cat.materials.length}
                  </span>
                </div>
                <h2 style={{ fontSize: '21px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.3px' }}>{cat.name}</h2>
                <p style={{ color: 'var(--muted)', fontSize: '14px', lineHeight: '1.5' }}>
                  {cat.materials.length} materi · artikel & video
                </p>
                <div className="mat-progress-track">
                  <div className="mat-progress-fill" style={{ width: `${pct}%`, background: cat.color }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ============================================================
  // MATERIAL LIST WITHIN A CATEGORY
  // ============================================================
  return (
    <div className="content">
      <header className="topbar">
        <div>
          <p className="eyebrow">{currentCat!.name}</p>
          <h1>Daftar Materi</h1>
        </div>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }} onClick={() => setActiveCategory(null)}>
          <ArrowLeft size={16} /> Semua Kategori
        </button>
      </header>

      <div className="mat-list">
        {currentCat!.materials.map((mat, idx) => (
          <div
            key={mat.id}
            className="mat-list-item"
            onClick={() => setActiveMaterial(mat)}
          >
            <div className="mat-list-num" style={{ borderColor: mat.completed ? 'var(--success)' : currentCat!.color, color: mat.completed ? 'var(--success)' : currentCat!.color }}>
              {mat.completed ? <CheckCircle2 size={18} /> : idx + 1}
            </div>
            <div className="mat-list-body">
              <h3>{mat.title}</h3>
              <div className="mat-list-tags">
                <span style={{ color: mat.type === 'video' ? currentCat!.color : 'var(--warning)' }}>
                  {mat.type === 'video' ? <PlayCircle size={13} /> : <FileText size={13} />}
                  {mat.type === 'video' ? 'Video' : 'Artikel'}
                </span>
                <span><Clock size={13} /> {mat.duration}</span>
              </div>
            </div>
            <ChevronRight size={20} className="mat-list-arrow" />
          </div>
        ))}
      </div>
    </div>
  )
}
