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
    <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
      {/* Background ambient mesh removed for flat design */}
      <div style={{ position: 'relative', zIndex: 1, background: 'var(--surface)', padding: '3rem 4rem', borderRadius: '6px', border: '1px solid var(--border)', width: '100%', maxWidth: '440px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div style={{ background: 'var(--accent-glow)', padding: '16px', borderRadius: '20px', marginBottom: '16px' }}>
            <Brain size={48} color="var(--accent-primary)" />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink)', letterSpacing: '-0.5px' }}>Masuk ke Lumora</h1>
          <p style={{ color: 'var(--muted)', fontSize: '15px', marginTop: '4px' }}>Platform Adaptive Learning</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#ef4444', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '14px', textAlign: 'center', border: '1px solid #fecaca' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
              placeholder="Contoh: student1 atau teacher1"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--surface)', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
              placeholder="Masukkan sandi..."
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ marginTop: '10px', padding: '14px', fontSize: '16px' }}
          >
            {loading ? 'Memproses...' : 'Masuk Dashboard'}
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '14px' }}>
          <span style={{ color: 'var(--muted)' }}>Belum punya akun? </span>
          <Link to="/register" style={{ color: 'var(--accent-primary)', fontWeight: '600', textDecoration: 'none' }}>Daftar di sini</Link>
        </div>
      </div>
    </div>
  );
}
