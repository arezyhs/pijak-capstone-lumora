import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
      {/* Background ambient mesh */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--accent-glow) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(255,255,255,0) 70%)', borderRadius: '50%', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', padding: '3rem 4rem', borderRadius: '24px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)', border: '1px solid rgba(255,255,255,0.5)', width: '100%', maxWidth: '440px' }}>
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
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
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
              style={{ width: '100%', padding: '14px 16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'white', outline: 'none', transition: 'border-color 0.2s', fontSize: '15px' }}
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
        
        <div style={{ marginTop: '2.5rem', fontSize: '13px', color: 'var(--muted)', textAlign: 'center', padding: '16px', background: 'rgba(255,255,255,0.5)', borderRadius: '12px' }}>
          <p style={{ marginBottom: '8px', color: 'var(--ink-light)' }}><strong>Akun Demo MVP:</strong></p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
            <span><strong>Siswa:</strong> <code>student1</code></span>
            <span><strong>Guru:</strong> <code>teacher1</code></span>
          </div>
          <p style={{ marginTop: '8px' }}>Sandi: <code>password123</code></p>
        </div>
      </div>
    </div>
  );
}
