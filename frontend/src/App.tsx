import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  ClipboardCheck,
  GraduationCap,
  LineChart,
  Users,
} from 'lucide-react'
import './App.css'

function App() {
  const learningPath = [
    'Review konsep pecahan',
    'Latihan persamaan linear',
    'Quiz adaptif remedial',
    'Evaluasi ulang rekomendasi',
  ]

  const recommendations = [
    { title: 'Pecahan - Remedial Path', type: 'Practice', priority: 'P1' },
    { title: 'Persamaan Linear - Remedial Path', type: 'Practice', priority: 'P2' },
    { title: 'Video konsep dasar aljabar', type: 'Lesson', priority: 'P3' },
  ]

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <Brain size={28} />
          <div>
            <span>Lumora</span>
            <small>Adaptive Learning</small>
          </div>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          <a className="active" href="#dashboard">
            <Activity size={18} /> Dashboard
          </a>
          <a href="#path">
            <BookOpen size={18} /> Learning Path
          </a>
          <a href="#teacher">
            <Users size={18} /> Monitoring
          </a>
        </nav>
      </aside>

      <section className="content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">Student workspace</p>
            <h1>Adaptive AI Learning Path</h1>
          </div>
          <button type="button" className="icon-button" aria-label="Open assessment">
            <ClipboardCheck size={20} />
          </button>
        </header>

        <section className="hero-panel">
          <div>
            <p className="eyebrow">Rekomendasi aktif</p>
            <h2>Nadia perlu memperkuat pecahan sebelum lanjut ke aljabar.</h2>
            <p>
              Baseline AI menilai skor quiz 68 dan completion rate 72%, sehingga jalur
              remedial diprioritaskan untuk sesi berikutnya.
            </p>
          </div>
          <div className="score-ring" aria-label="Average score 76.5">
            <strong>76.5</strong>
            <span>avg score</span>
          </div>
        </section>

        <section className="metric-grid" aria-label="Learning metrics">
          <article>
            <LineChart size={20} />
            <span>Progress</span>
            <strong>72%</strong>
          </article>
          <article>
            <GraduationCap size={20} />
            <span>Streak</span>
            <strong>5 hari</strong>
          </article>
          <article>
            <BarChart3 size={20} />
            <span>Quiz terakhir</span>
            <strong>68</strong>
          </article>
        </section>

        <section className="workspace-grid">
          <section className="panel" id="path">
            <div className="panel-heading">
              <h2>Personal Learning Path</h2>
              <span>4 langkah</span>
            </div>
            <ol className="path-list">
              {learningPath.map((item, index) => (
                <li key={item}>
                  <span>{index + 1}</span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <h2>Materi Direkomendasikan</h2>
              <span>Remedial</span>
            </div>
            <div className="recommendation-list">
              {recommendations.map((item) => (
                <article key={item.title}>
                  <div>
                    <strong>{item.title}</strong>
                    <span>{item.type}</span>
                  </div>
                  <small>{item.priority}</small>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="teacher-band" id="teacher">
          <div>
            <p className="eyebrow">Teacher overview</p>
            <h2>3 siswa perlu perhatian pada topik pecahan dan persamaan linear.</h2>
          </div>
          <div className="teacher-stats">
            <span>32 siswa</span>
            <span>69% avg progress</span>
            <span>74.2 avg score</span>
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
