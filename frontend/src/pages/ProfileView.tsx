import { useState, useEffect } from 'react'
import { User, Award, BookOpen, Clock, Settings, Activity, Moon, BarChart2, TrendingUp, TrendingDown, Hash } from 'lucide-react'
import { fetchStudentHistory } from '../api/client'
import type { StudentHistoryResponse } from '../types'

export function ProfileView() {
  const role = localStorage.getItem('role') || 'student'
  const username = localStorage.getItem('username') || ''
  const name = localStorage.getItem('name') || username
  const rawCreatedAt = localStorage.getItem('created_at') || ''
  const createdAt = rawCreatedAt ? new Date(rawCreatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Hari Ini'
  const isTeacher = role === 'teacher'

  const [history, setHistory] = useState<StudentHistoryResponse | null>(null)
  const [historyLoading, setHistoryLoading] = useState(true)

  useEffect(() => {
    if (!isTeacher) {
      fetchStudentHistory(username)
        .then(setHistory)
        .catch(console.error)
        .finally(() => setHistoryLoading(false))
    } else {
      setHistoryLoading(false)
    }
  }, [username, isTeacher])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--success)'
    if (score >= 60) return 'var(--warning)'
    return 'var(--danger)'
  }

  return (
    <div className="content">
      <header className="topbar" style={{ marginBottom: '24px' }}>
        <div>
          <p className="eyebrow">Pengaturan Akun</p>
          <h1>Profil Saya</h1>
        </div>
        <button className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} />
          Pengaturan
        </button>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

        {/* Identity Card */}
        <section className="panel" style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '32px' }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'var(--accent-glow)', color: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <User size={48} strokeWidth={1.5} />
          </div>
          <div>
            <h2 style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '4px' }}>
              {name}
            </h2>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span style={{
                background: isTeacher ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                color: isTeacher ? 'var(--success)' : '#3b82f6',
                padding: '4px 12px', borderRadius: '20px',
                fontSize: '13px', fontWeight: '700', textTransform: 'uppercase'
              }}>
                {isTeacher ? 'Guru Pembimbing' : 'Siswa Aktif'}
              </span>
              <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Bergabung sejak: {createdAt}</span>
            </div>
          </div>
        </section>

        {/* Stats Row */}
        <section>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '16px' }}>
            {isTeacher ? 'Statistik Mengajar' : 'Statistik Belajar'}
          </h3>
          <div className="metric-grid">
            {isTeacher ? (
              <>
                <article><User size={24} color="#3b82f6" /><span>Total Siswa Didik</span><strong>142 Siswa</strong></article>
                <article><BookOpen size={24} color="#8b5cf6" /><span>Mata Pelajaran</span><strong>3 Mapel</strong></article>
                <article><Activity size={24} color="#10b981" /><span>Rata-rata Kelas</span><strong>82.5</strong></article>
              </>
            ) : (
              <>
                <article>
                  <Hash size={24} color="#3b82f6" />
                  <span>Total Kuis Dikerjakan</span>
                  <strong>{history?.total_quizzes ?? '—'} Kuis</strong>
                </article>
                <article>
                  <BarChart2 size={24} color="#8b5cf6" />
                  <span>AVG Score</span>
                  <strong style={{ color: history ? getScoreColor(history.average_score) : 'var(--ink)' }}>
                    {history?.average_score ?? '—'}
                  </strong>
                </article>
                <article>
                  <TrendingUp size={24} color="var(--success)" />
                  <span>Skor Tertinggi</span>
                  <strong style={{ color: 'var(--success)' }}>{history?.highest_score ?? '—'}</strong>
                </article>
                <article>
                  <TrendingDown size={24} color="var(--danger)" />
                  <span>Skor Terendah</span>
                  <strong style={{ color: 'var(--danger)' }}>{history?.lowest_score ?? '—'}</strong>
                </article>
                <article>
                  <Moon size={24} color="#6366f1" />
                  <span>Waktu Tidur</span>
                  <strong>{localStorage.getItem('sleepHours') || 7} Jam / Hari</strong>
                </article>
                <article>
                  <Clock size={24} color="#ef4444" />
                  <span>Tingkat Stres</span>
                  <strong>{localStorage.getItem('stressLevel') || 5} / 10</strong>
                </article>
              </>
            )}
          </div>
        </section>

        {/* AVG Score Breakdown — student only */}
        {!isTeacher && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>

            {/* Quiz History Table */}
            <section className="panel">
              <div className="panel-heading">
                <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                  <BarChart2 size={20} color="var(--accent-primary)" /> Histori Kuis
                </h2>
                {history && (
                  <span style={{ fontSize: '13px', color: 'var(--muted)' }}>
                    AVG = ({history.quiz_history.map(q => q.score).join(' + ')}) ÷ {history.total_quizzes} = <strong style={{ color: 'var(--ink)' }}>{history.average_score}</strong>
                  </span>
                )}
              </div>

              {historyLoading ? (
                <p style={{ color: 'var(--muted)', padding: '16px 0', textAlign: 'center' }}>Memuat histori...</p>
              ) : history && history.quiz_history.length > 0 ? (
                <div style={{ marginTop: '16px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                    <thead>
                      <tr style={{ background: 'var(--surface-alt)', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: '600', width: '40px' }}>#</th>
                        <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: '600' }}>Mata Pelajaran</th>
                        <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: '600' }}>Skor</th>
                        <th style={{ padding: '10px 12px', color: 'var(--muted)', fontWeight: '600' }}>Waktu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.quiz_history.map((item, idx) => (
                        <tr
                          key={item.id}
                          style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-alt)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '12px', color: 'var(--muted)' }}>{idx + 1}</td>
                          <td style={{ padding: '12px', fontWeight: '500', color: 'var(--ink)' }}>{item.subject}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '20px',
                              fontWeight: '700',
                              fontSize: '13px',
                              background: item.score >= 80
                                ? 'rgba(16, 185, 129, 0.1)'
                                : item.score >= 60
                                ? 'rgba(245, 158, 11, 0.1)'
                                : 'rgba(239, 68, 68, 0.1)',
                              color: getScoreColor(item.score)
                            }}>
                              {item.score}
                            </span>
                          </td>
                          <td style={{ padding: '12px', color: 'var(--muted)', fontSize: '13px' }}>{item.submitted_at}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr style={{ background: 'var(--surface-alt)', fontWeight: '700' }}>
                        <td colSpan={2} style={{ padding: '12px', color: 'var(--ink)' }}>Rata-rata (AVG)</td>
                        <td style={{ padding: '12px' }}>
                          <span style={{
                            display: 'inline-block', padding: '3px 10px', borderRadius: '20px',
                            fontWeight: '700', fontSize: '13px',
                            background: 'var(--accent-glow)', color: 'var(--accent-primary)'
                          }}>
                            {history.average_score}
                          </span>
                        </td>
                        <td style={{ padding: '12px', color: 'var(--muted)', fontSize: '13px' }}>—</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <p style={{ color: 'var(--muted)', padding: '24px 0', textAlign: 'center' }}>
                  Belum ada kuis yang dikerjakan. Kerjakan kuis untuk melihat histori di sini.
                </p>
              )}
            </section>

            {/* Per-subject breakdown + badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Per-subject avg */}
              {history && Object.keys(history.score_by_subject).length > 0 && (
                <section className="panel">
                  <div className="panel-heading">
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                      <Activity size={18} color="var(--accent-primary)" /> AVG per Mata Pelajaran
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {Object.entries(history.score_by_subject).map(([subj, avg]) => (
                      <div key={subj}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px' }}>
                          <span style={{ color: 'var(--ink)', fontWeight: '500' }}>{subj}</span>
                          <span style={{ fontWeight: '700', color: getScoreColor(avg) }}>{avg}</span>
                        </div>
                        <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{
                            height: '100%', width: `${avg}%`, borderRadius: '3px', transition: 'width 0.6s ease',
                            background: avg >= 80 ? 'var(--success)' : avg >= 60 ? 'var(--warning)' : 'var(--danger)'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Badges */}
              <section className="panel" style={{ background: 'linear-gradient(to bottom, var(--surface), var(--surface-alt))' }}>
                <div className="panel-heading">
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                    <Award size={20} color="var(--warning)" /> Lencana Prestasi
                  </h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                  {history && history.highest_score >= 80 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Award size={20} />
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Skor Sempurna</strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Pernah dapat skor ≥ 80</span>
                      </div>
                    </div>
                  )}
                  {history && history.total_quizzes >= 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Hash size={20} />
                      </div>
                      <div>
                        <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Rajin Ujian</strong>
                        <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Sudah mengerjakan {history.total_quizzes} kuis</span>
                      </div>
                    </div>
                  )}
                  {(!history || history.total_quizzes === 0) && (
                    <p style={{ color: 'var(--muted)', fontSize: '14px', textAlign: 'center', padding: '8px 0' }}>
                      Kerjakan kuis untuk mendapatkan lencana!
                    </p>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
