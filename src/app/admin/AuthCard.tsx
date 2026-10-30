/** Tarjeta centrada con el logo, para inicio de sesión y recuperación de contraseña. */
export function AuthCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <main className="adm-auth">
      <div className="adm-auth-card">
        <img src="/brand/logo-manual-de-cocina.png" alt="Manual de Cocina" width={640} height={188} className="adm-auth-logo" />
        <h1>{title}</h1>
        {subtitle && <p className="adm-auth-sub">{subtitle}</p>}
        {children}
      </div>
    </main>
  )
}
