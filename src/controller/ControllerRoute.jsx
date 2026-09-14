import React, { useState } from 'react';
import ControllerApp from './ControllerApp';

// ── Password gate ─────────────────────────────────────────────
// Password is read from VITE_CONTROLLER_PASSWORD env var at build time.
// If the env var is not set (production build), accessing /controller
// shows only an empty auth screen — the controller UI is never shipped
// unless the env var is explicitly configured.
const CONTROLLER_PASSWORD = import.meta.env.VITE_CONTROLLER_PASSWORD ?? '';

const gateStyle = {
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', minHeight: '100dvh',
  backgroundColor: '#0A0B0E',
  fontFamily: '"Manrope", sans-serif',
  gap: '24px',
  padding: '24px 16px',
  boxSizing: 'border-box',
  width: '100%',
};

const logoStyle = {
  fontSize: '1.8rem', fontFamily: '"Oswald", sans-serif',
  color: '#FFFFFF', letterSpacing: '0.1em', textTransform: 'uppercase',
  textAlign: 'center',
};

const subStyle = {
  fontSize: '0.75rem', color: '#555', letterSpacing: '0.2em',
  textTransform: 'uppercase', marginTop: '-16px', textAlign: 'center',
};

const inputStyle = {
  width: '100%', maxWidth: '300px', padding: '14px 18px', background: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: '#FFF',
  fontSize: '0.95rem', outline: 'none', fontFamily: 'inherit',
  letterSpacing: '0.15em', boxSizing: 'border-box'
};

const btnStyle = {
  width: '100%', maxWidth: '300px', padding: '14px', background: '#6B9BD0', border: 'none',
  borderRadius: '6px', color: '#000', fontSize: '0.85rem', fontWeight: '700',
  cursor: 'pointer', fontFamily: '"Oswald", sans-serif', letterSpacing: '0.15em',
  textTransform: 'uppercase', transition: 'opacity 0.2s', boxSizing: 'border-box',
};

const errorStyle = { color: '#E74C3C', fontSize: '0.8rem', letterSpacing: '0.05em' };

export default function ControllerRoute() {
  const [input, setInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');

  // If no password is configured, show a clear message rather than a broken gate
  if (!CONTROLLER_PASSWORD) {
    return (
      <div style={gateStyle}>
        <div style={logoStyle}>BUNNY INDUSTRIES</div>
        <div style={subStyle}>Content Controller</div>
        <div style={{ ...errorStyle, textAlign: 'center', maxWidth: '340px', lineHeight: '1.6' }}>
          Controller is not configured. Set the{' '}
          <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px' }}>
            VITE_CONTROLLER_PASSWORD
          </code>{' '}
          environment variable in <code style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '3px' }}>.env.local</code> and restart the dev server.
        </div>
      </div>
    );
  }

  if (unlocked) return <ControllerApp />;

  const attempt = () => {
    if (input === CONTROLLER_PASSWORD) {
      setUnlocked(true);
    } else {
      setError('Incorrect password.');
      setInput('');
    }
  };

  return (
    <div style={gateStyle}>
      <div style={logoStyle}>BUNNY INDUSTRIES</div>
      <div style={subStyle}>Content Controller</div>
      <input
        type="password"
        style={inputStyle}
        placeholder="Enter access password"
        value={input}
        onChange={e => { setInput(e.target.value); setError(''); }}
        onKeyDown={e => e.key === 'Enter' && attempt()}
        autoFocus
      />
      {error && <div style={errorStyle}>{error}</div>}
      <button
        style={btnStyle}
        onClick={attempt}
        onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
        onMouseOut={e => (e.currentTarget.style.opacity = '1')}
      >
        Access Controller
      </button>
      <a href="/" style={{ color: '#444', fontSize: '0.75rem', textDecoration: 'none', letterSpacing: '0.1em' }}>
        ← Back to site
      </a>
    </div>
  );
}
