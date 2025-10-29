'use client';

export default function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('open-cookie-banner'))}
      style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textDecoration: 'underline' }}
      aria-label="Cookie settings"
    >
      Настройки на бисквитки
    </button>
  );
}


