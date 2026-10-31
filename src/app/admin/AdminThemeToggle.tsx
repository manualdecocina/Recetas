'use client'

/** Alterna el panel entre oscuro (por defecto) y claro. La elección se guarda solo en este navegador. */
export function AdminThemeToggle() {
  function toggle() {
    const root = document.documentElement
    const next = root.dataset.theme === 'light' ? 'dark' : 'light'
    root.dataset.theme = next
    try { localStorage.setItem('md-admin-theme', next) } catch { /* sin almacenamiento: dura hasta recargar */ }
  }
  return (
    <button type="button" className="adm-theme-toggle" onClick={toggle} aria-label="Cambiar entre tema oscuro y claro" title="Tema oscuro / claro">
      <svg className="adm-icon-sun" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7" /></svg>
      <svg className="adm-icon-moon" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" /></svg>
    </button>
  )
}
