import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { loginApi } from '../api/client';

export function LoginView() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await loginApi(username, password);
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
    } catch (err) {
      console.error(err);
      setError('Username atau password salah.');
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
        {/* Dekorasi Latar */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', filter: 'blur(40px)' }} />
        
        <Brain size={64} color="white" style={{ marginBottom: '32px', opacity: 0.9 }} />
        <h1 style={{ fontSize: '56px', fontWeight: '800', marginBottom: '16px', lineHeight: 1.1, letterSpacing: '-1px' }}>
          Tutor Pribadi <br />Cerdas Anda.
        </h1>
        <p style={{ fontSize: '20px', opacity: 0.85, maxWidth: '480px', lineHeight: 1.6, fontWeight: 300 }}>
          Lumora menganalisis kebiasaan dan performa Anda untuk menciptakan jalur belajar yang paling optimal. Masuk dan mulai perjalanan Anda.
        </p>
      </div>

      {/* Kanan: Form Login */}
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
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.5px' }}>Selamat Datang</h2>
            <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '6px' }}>Silakan masuk ke akun Lumora Anda.</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '14px', border: '1px solid #fecaca' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Username / Nama Pengguna</label>
              <input 
                type="text" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Ketik username kamu..."
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', outline: 'none', fontSize: '15px', color: 'var(--ink)', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Kata Sandi</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Masukkin sandi..."
                style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'transparent', outline: 'none', fontSize: '15px', color: 'var(--ink)', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = 'var(--accent-primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ marginTop: '8px', width: '100%', padding: '14px', fontSize: '16px', fontWeight: '600' }}
            >
              {loading ? 'Lagi Masuk...' : 'Masuk Dashboard'}
            </button>
          </form>

          <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '14px', color: 'var(--muted)' }}>
            Belum punya akun? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '600' }}>Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
