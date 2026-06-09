import { useState } from 'react'
import { PlayCircle, FileText, CheckCircle2, ArrowLeft, BookOpen, Clock, ChevronRight } from 'lucide-react'

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

// --- Material Data ---
const CATEGORIES: SubjectCategory[] = [
  {
    id: 'matematika',
    name: 'Matematika',
    color: '#3b82f6',
    materials: [
      {
        id: 'm1', title: 'Konsep Dasar Aljabar & Persamaan Linear', type: 'article', duration: '8 min read', completed: false,
        content: `Aljabar adalah cabang matematika yang mempelajari simbol dan aturan untuk memanipulasi simbol tersebut. Dalam aljabar, huruf digunakan untuk mewakili bilangan dalam persamaan dan rumus.

**Persamaan Linear** adalah persamaan yang memiliki variabel berpangkat satu. Bentuk umum persamaan linear satu variabel adalah:

ax + b = 0

dimana *a* dan *b* adalah konstanta, dan *x* adalah variabel yang dicari nilainya.

**Contoh:**
- 2x + 5 = 11 → solusi: x = 3
- 3x - 7 = 8 → solusi: x = 5

**Langkah-langkah menyelesaikan persamaan linear:**
1. Pindahkan semua suku yang mengandung variabel ke satu sisi
2. Pindahkan semua konstanta ke sisi lainnya
3. Sederhanakan kedua sisi
4. Bagi kedua sisi dengan koefisien variabel

**Latihan Mandiri:**
Coba selesaikan: 4x + 12 = 28. Berapa nilai x?`,
      },
      {
        id: 'm2', title: 'Rumus Luas dan Keliling Bangun Datar', type: 'video', duration: '15 min', completed: false,
      },
      {
        id: 'm3', title: 'Operasi Pecahan dan Desimal', type: 'article', duration: '6 min read', completed: false,
        content: `Pecahan adalah bilangan yang merepresentasikan bagian dari suatu keseluruhan. Pecahan ditulis dalam bentuk a/b, dimana *a* disebut pembilang dan *b* disebut penyebut.

**Penjumlahan Pecahan:**
Jika penyebutnya sama: a/c + b/c = (a+b)/c
Jika penyebutnya berbeda, samakan penyebut terlebih dahulu dengan mencari KPK (Kelipatan Persekutuan Terkecil).

**Contoh:** 1/3 + 1/4
- KPK dari 3 dan 4 = 12
- 1/3 = 4/12
- 1/4 = 3/12
- 4/12 + 3/12 = 7/12

**Konversi Pecahan ke Desimal:**
Bagi pembilang dengan penyebut.
- 1/4 = 0.25
- 3/8 = 0.375
- 2/3 = 0.666...

**Tips Penting:** Selalu sederhanakan pecahan ke bentuk paling sederhana dengan membagi pembilang dan penyebut dengan FPB (Faktor Persekutuan Terbesar).`,
      },
    ],
  },
  {
    id: 'sains',
    name: 'Sains',
    color: '#10b981',
    materials: [
      {
        id: 's1', title: 'Sistem Tata Surya dan Planet', type: 'article', duration: '10 min read', completed: false,
        content: `Tata surya kita terdiri dari Matahari sebagai pusat, delapan planet, planet kerdil, asteroid, komet, dan benda langit lainnya.

**Urutan Planet dari Matahari:**
1. **Merkurius** — Planet terkecil dan terdekat dari matahari. Suhu permukaannya sangat ekstrem.
2. **Venus** — Disebut "kembaran Bumi" karena ukurannya mirip, namun atmosfernya sangat panas dan beracun.
3. **Bumi** — Satu-satunya planet yang diketahui memiliki kehidupan. Memiliki satu satelit alami: Bulan.
4. **Mars** — Disebut "Planet Merah" karena permukaannya kaya oksida besi.
5. **Jupiter** — Planet terbesar di tata surya, memiliki Great Red Spot (badai raksasa).
6. **Saturnus** — Terkenal dengan cincinnya yang indah, terbuat dari es dan batuan.
7. **Uranus** — Planet yang berotasi secara miring (hampir 90°).
8. **Neptunus** — Planet terjauh, memiliki angin tercepat di tata surya.

**Fakta Menarik:** Cahaya matahari membutuhkan waktu sekitar 8 menit 20 detik untuk sampai ke Bumi.`,
      },
      {
        id: 's2', title: 'Proses Fotosintesis pada Tumbuhan', type: 'article', duration: '7 min read', completed: false,
        content: `Fotosintesis adalah proses dimana tumbuhan mengubah energi cahaya matahari menjadi energi kimia (glukosa). Proses ini terjadi di kloroplas, organel sel yang mengandung pigmen hijau bernama klorofil.

**Persamaan Fotosintesis:**
6CO₂ + 6H₂O + cahaya → C₆H₁₂O₆ + 6O₂

Artinya: Karbon dioksida + Air + Energi cahaya → Glukosa + Oksigen

**Tahapan Fotosintesis:**
1. **Reaksi Terang** — Terjadi di membran tilakoid. Cahaya diserap klorofil dan digunakan untuk memecah air (H₂O) menjadi hidrogen dan oksigen.
2. **Siklus Calvin (Reaksi Gelap)** — Terjadi di stroma kloroplas. CO₂ diubah menjadi glukosa menggunakan energi dari reaksi terang.

**Faktor yang Mempengaruhi Fotosintesis:**
- Intensitas cahaya
- Konsentrasi CO₂
- Suhu lingkungan
- Ketersediaan air

**Mengapa Fotosintesis Penting?**
Fotosintesis menghasilkan oksigen yang kita hirup dan merupakan dasar dari rantai makanan seluruh ekosistem.`,
      },
      {
        id: 's3', title: 'Hukum Newton tentang Gerak', type: 'video', duration: '20 min', completed: false,
      },
    ],
  },
  {
    id: 'logika',
    name: 'Logika & Penalaran',
    color: '#8b5cf6',
    materials: [
      {
        id: 'l1', title: 'Pengenalan Logika Proposisi', type: 'article', duration: '9 min read', completed: false,
        content: `Logika proposisi adalah cabang logika yang mempelajari proposisi (pernyataan) dan hubungan antar proposisi menggunakan operator logika.

**Proposisi** adalah kalimat deklaratif yang memiliki nilai kebenaran: BENAR (True) atau SALAH (False).

**Contoh proposisi:**
- "Jakarta adalah ibu kota Indonesia" → BENAR
- "2 + 3 = 6" → SALAH

**Operator Logika Dasar:**
1. **Negasi (¬)** — Membalik nilai kebenaran. Jika p benar, maka ¬p salah.
2. **Konjungsi (∧)** — "DAN". p ∧ q benar hanya jika keduanya benar.
3. **Disjungsi (∨)** — "ATAU". p ∨ q salah hanya jika keduanya salah.
4. **Implikasi (→)** — "JIKA...MAKA". p → q salah hanya jika p benar dan q salah.
5. **Biimplikasi (↔)** — "JIKA DAN HANYA JIKA". p ↔ q benar jika p dan q memiliki nilai kebenaran sama.

**Tabel Kebenaran Implikasi (p → q):**
| p     | q     | p → q |
|-------|-------|-------|
| Benar | Benar | Benar |
| Benar | Salah | Salah |
| Salah | Benar | Benar |
| Salah | Salah | Benar |

**Kunci Pemahaman:** Implikasi hanya salah ketika premis (p) benar tapi kesimpulan (q) salah.`,
      },
      {
        id: 'l2', title: 'Pola Deret Angka dan Barisan', type: 'article', duration: '6 min read', completed: false,
        content: `Deret angka adalah susunan bilangan yang mengikuti pola atau aturan tertentu. Kemampuan mengenali pola deret sangat penting dalam penalaran logis.

**Jenis-jenis Deret:**

1. **Deret Aritmatika** — Selisih antar suku berurutan konstan (disebut beda).
   Contoh: 3, 7, 11, 15, 19, ... (beda = 4)
   Rumus suku ke-n: Un = a + (n-1)d

2. **Deret Geometri** — Rasio antar suku berurutan konstan.
   Contoh: 2, 6, 18, 54, 162, ... (rasio = 3)
   Rumus suku ke-n: Un = a × r^(n-1)

3. **Deret Fibonacci** — Setiap suku merupakan jumlah dua suku sebelumnya.
   Contoh: 1, 1, 2, 3, 5, 8, 13, 21, ...

4. **Deret Kuadrat** — Suku ke-n merupakan kuadrat dari n.
   Contoh: 1, 4, 9, 16, 25, 36, ...

**Strategi Menemukan Pola:**
- Hitung selisih antar suku berurutan
- Jika selisihnya konstan → deret aritmatika
- Hitung rasio antar suku berurutan
- Jika rasionya konstan → deret geometri
- Jika selisih pertama tidak konstan, coba hitung selisih kedua`,
      },
      {
        id: 'l3', title: 'Teknik Penalaran Deduktif & Induktif', type: 'video', duration: '14 min', completed: false,
      },
    ],
  },
]

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
  const [materials, setMaterials] = useState(CATEGORIES)
  const [activeMaterial, setActiveMaterial] = useState<MaterialItem | null>(null)

  const markCompleted = (catId: string, matId: string) => {
    setMaterials(prev =>
      prev.map(cat =>
        cat.id === catId
          ? { ...cat, materials: cat.materials.map(m => m.id === matId ? { ...m, completed: true } : m) }
          : cat
      )
    )
    setActiveMaterial(null)
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
