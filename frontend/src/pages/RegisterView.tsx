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
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'relative', zIndex: 1, background: 'var(--surface)', padding: '3rem 4rem', borderRadius: '6px', border: '1px solid var(--border)', width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--accent-glow)', padding: '16px', borderRadius: '20px', marginBottom: '16px' }}>
            <Brain size={48} color="var(--accent-primary)" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.5px' }}>Daftar ke Lumora</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '4px' }}>Mulai belajar adaptif sekarang</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '14px', textAlign: 'center', border: '1px solid #fecaca' }}>
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
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
              placeholder="Contoh: Budi Santoso"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
              placeholder="Unik dan tanpa spasi"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
              placeholder="Minimal 6 karakter"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Peran (Role)</label>
            <select 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', outline: 'none', fontSize: '15px', color: 'var(--ink)' }}
            >
              <option value="student">Siswa (Student)</option>
              <option value="teacher">Guru (Teacher)</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '8px', padding: '14px', fontSize: '16px' }}
          >
            {loading ? 'Memproses...' : 'Buat Akun'}
          </button>
        </form>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--muted)' }}>Sudah punya akun? </span>
          <Link to="/login" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
}
