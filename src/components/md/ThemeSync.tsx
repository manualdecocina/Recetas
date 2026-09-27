'use client';
import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

const KEY = 'md-theme';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

function apply() {
  try {
    const stored = localStorage.getItem(KEY);
    if ((stored === 'dark' || stored === 'light') && document.documentElement.dataset.theme !== stored) {
      document.documentElement.dataset.theme = stored;
    }
  } catch { /* sin almacenamiento: se mantiene el tema claro por defecto */ }
}

/**
 * Mantiene el tema elegido al cambiar de página o de idioma. Al navegar entre rutas con
 * distinto segmento [lang] Next puede sustituir <html>, y el script inicial del <head> no
 * se vuelve a ejecutar; este componente reaplica la preferencia guardada en cada navegación
 * y también cuando cambia en otra pestaña. Sin preferencia guardada, el tema es claro.
 */
export default function ThemeSync() {
  const pathname = usePathname();
  useIsoLayoutEffect(() => { apply(); }, [pathname]);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => { if (event.key === KEY) apply(); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  return null;
}
