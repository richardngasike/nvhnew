'use client';

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      onFocus={e => { e.target.style.top = '0px'; }}
      onBlur={e => { e.target.style.top = '-40px'; }}
      style={{
        position: 'absolute',
        top: '-40px',
        left: 0,
        background: '#C8A96E',
        color: '#fff',
        padding: '8px 16px',
        zIndex: 9999,
        borderRadius: '0 0 8px 0',
        fontWeight: 600,
        fontSize: '0.9rem',
        transition: 'top 0.2s',
        textDecoration: 'none',
      }}
    >
      Skip to main content
    </a>
  );
}