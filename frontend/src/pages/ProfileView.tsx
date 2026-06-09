import { User, Award, BookOpen, Clock, Settings, GraduationCap, Users, BookMarked, Activity, Moon } from 'lucide-react'

export function ProfileView() {
  const role = localStorage.getItem('role') || 'student'
  const username = localStorage.getItem('username') || 'student1'

  const isTeacher = role === 'teacher'

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

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px' }}>
        {/* Kolom Utama: Identitas & Statistik */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          
          {/* Card Identitas */}
          <section className="panel" style={{ display: 'flex', gap: '24px', alignItems: 'center', padding: '32px' }}>
            <div style={{ 
              width: '96px', 
              height: '96px', 
              borderRadius: '50%', 
              background: 'var(--accent-glow)', 
              color: 'var(--accent-primary)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <User size={48} strokeWidth={1.5} />
            </div>
            <div>
              <h2 style={{ fontSize: '28px', color: 'var(--ink)', marginBottom: '4px' }}>
                {username === 'student1' ? 'Budi Santoso' : username === 'teacher1' ? 'Pak Andi' : username}
              </h2>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ 
                  background: isTeacher ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                  color: isTeacher ? 'var(--success)' : '#3b82f6',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px',
                  fontWeight: '700',
                  textTransform: 'uppercase'
                }}>
                  {isTeacher ? 'Guru Pembimbing' : 'Siswa Aktif'}
                </span>
                <span style={{ color: 'var(--muted)', fontSize: '14px' }}>Bergabung sejak: Agustus 2023</span>
              </div>
            </div>
          </section>

          {/* Statistik Prestasi / Kinerja */}
          <section>
            <h3 style={{ fontSize: '18px', color: 'var(--ink)', marginBottom: '16px' }}>
              {isTeacher ? 'Statistik Mengajar' : 'Statistik Belajar'}
            </h3>
            <div className="metric-grid">
              {isTeacher ? (
                <>
                  <article>
                    <Users size={24} color="#3b82f6" />
                    <span>Total Siswa Didik</span>
                    <strong>142 Siswa</strong>
                  </article>
                  <article>
                    <BookMarked size={24} color="#8b5cf6" />
                    <span>Mata Pelajaran</span>
                    <strong>3 Mapel</strong>
                  </article>
                  <article>
                    <Activity size={24} color="#10b981" />
                    <span>Rata-rata Kelas</span>
                    <strong>82.5</strong>
                  </article>
                </>
              ) : (
                <>
                  <article>
                    <BookOpen size={24} color="#3b82f6" />
                    <span>Materi Diselesaikan</span>
                    <strong>{localStorage.getItem('modulesCompleted') || 24} Modul</strong>
                  </article>
                  <article>
                    <Clock size={24} color="#8b5cf6" />
                    <span>Jam Belajar</span>
                    <strong>45 Jam / Bulan</strong>
                  </article>
                  <article>
                    <Moon size={24} color="#6366f1" />
                    <span>Waktu Tidur</span>
                    <strong>{localStorage.getItem('sleepHours') || 7} Jam / Hari</strong>
                  </article>
                  <article>
                    <Activity size={24} color="#ef4444" />
                    <span>Tingkat Stres</span>
                    <strong>{localStorage.getItem('stressLevel') || 5} / 10</strong>
                  </article>
                  <article>
                    <User size={24} color="#10b981" />
                    <span>Demografi AI</span>
                    <strong style={{ fontSize: '13px', lineHeight: '1.4' }}>Umur: 20, Pendapatan: Menengah<br/>Akses Internet: Ya</strong>
                  </article>
                </>
              )}
            </div>
          </section>

        </div>

        {/* Kolom Samping: Info Tambahan / Pencapaian */}
        <div>
          <section className="panel" style={{ background: 'linear-gradient(to bottom, #ffffff, var(--surface-alt))' }}>
            <div className="panel-heading">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px' }}>
                <Award size={20} color="var(--warning)" /> 
                {isTeacher ? 'Sertifikasi & Lisensi' : 'Lencana Prestasi'}
              </h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
              {isTeacher ? (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Guru Penggerak Angkatan 4</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Tahun 2022</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Ahli Kurikulum Merdeka</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Tahun 2023</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '40px', height: '40px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Award size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>Top 10% Matematika</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Bulan lalu</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Activity size={20} />
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--ink)' }}>7 Hari Streak Belajar</strong>
                      <span style={{ fontSize: '12px', color: 'var(--muted)' }}>Minggu ini</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
