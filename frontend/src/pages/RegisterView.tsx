import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { registerApi } from '../api/client';

export function RegisterView() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await registerApi({ username, name, password, role });
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('username', data.username);
      localStorage.setItem('name', data.name);
      localStorage.setItem('created_at', data.created_at);
      if (data.has_completed_onboarding) {
        localStorage.setItem('has_completed_onboarding', 'true');
      } else {
        localStorage.removeItem('has_completed_onboarding');
      }
      
      // Arahkan sesuai role
      if (data.role === 'student') {
        navigate('/dashboard');
      } else if (data.role === 'teacher') {
        navigate('/teacher');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Gagal mendaftar. Username mungkin sudah digunakan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--surface)' }}>
      {/* Kiri: Banner Info */}
      <div style={{ 
        flex: 2, 
        background: 'linear-gradient(135deg, var(--accent-primary) 0%, #1e1b4b 100%)', 
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'center', 
        padding: '10%', 
        color: 'white',
        position: 'relative'
      }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(40px)' }} />
        
        <Brain size={64} color="white" style={{ marginBottom: '32px', opacity: 0.9 }} />
        <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '16px', lineHeight: 1.1, letterSpacing: '-1px' }}>
          Mulai Belajar <br />Lebih Cerdas.
        </h1>
        <p style={{ fontSize: '20px', opacity: 0.85, maxWidth: '480px', lineHeight: 1.6, fontWeight: 300 }}>
          Bergabunglah dengan Lumora. Kami akan menganalisis potensimu dan merancang kurikulum yang secara otomatis beradaptasi dengan kecepatan belajarmu.
        </p>
      </div>

      {/* Kanan: Form Register */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: '3rem',
        minWidth: '450px',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border)'
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.5px' }}>Daftar Akun</h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>Buat akun baru secara gratis.</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '14px', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
                placeholder="Contoh: Budi Santoso"
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Username</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
                placeholder="Unik dan tanpa spasi"
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
                placeholder="Minimal 6 karakter"
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Peran (Role)</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', outline: 'none', fontSize: '15px', color: 'var(--ink)' }}
              >
                <option value="student">Siswa (Student)</option>
                <option value="teacher">Guru (Teacher)</option>
              </select>
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: '8px', padding: '14px', fontSize: '16px', fontWeight: '600', width: '100%' }}
            >
              {loading ? 'Memproses...' : 'Buat Akun'}
            </button>
          </form>
          
          <div style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '14px' }}>
            <span style={{ color: 'var(--muted)' }}>Sudah punya akun? </span>
            <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Masuk di sini</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
