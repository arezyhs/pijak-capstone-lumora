import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Memuat data..." }: LoadingScreenProps) {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '60vh', 
      flexDirection: 'column', 
      gap: '20px' 
    }}>
      <div style={{
        background: 'var(--surface-alt)',
        padding: '20px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        border: '1px solid var(--border)'
      }}>
        <Loader2 size={36} color="var(--accent-primary)" style={{ animation: 'spin 1.5s linear infinite' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: 'var(--ink)', fontSize: '18px', fontWeight: '600', letterSpacing: '-0.3px', marginBottom: '4px' }}>
          {message}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: '14px' }}>Harap tunggu sebentar</p>
      </div>
    </div>
  );
}
