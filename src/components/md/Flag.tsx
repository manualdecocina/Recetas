import type { MdLanguage } from './md-types';

/** Banderas en SVG (los emojis de bandera no se ven en Windows: salen como letras). */
export default function Flag({ code, className = 'md-flag' }: { code: MdLanguage; className?: string }) {
  const common = { className, viewBox: '0 0 24 16', width: 24, height: 16, 'aria-hidden': true as const, focusable: false as const };
  switch (code) {
    case 'es':
      return <svg {...common}><rect width="24" height="16" fill="#AA151B" /><rect y="4" width="24" height="8" fill="#F1BF00" /></svg>;
    case 'en':
      return (
        <svg {...common}>
          <rect width="24" height="16" fill="#012169" />
          <path d="M0 0L24 16M24 0L0 16" stroke="#fff" strokeWidth="3.2" />
          <path d="M0 0L24 16M24 0L0 16" stroke="#C8102E" strokeWidth="1.2" />
          <path d="M12 0V16M0 8H24" stroke="#fff" strokeWidth="5.2" />
          <path d="M12 0V16M0 8H24" stroke="#C8102E" strokeWidth="3" />
        </svg>
      );
    case 'de':
      return <svg {...common}><rect width="24" height="16" fill="#FFCE00" /><rect width="24" height="10.67" fill="#DD0000" /><rect width="24" height="5.33" fill="#000" /></svg>;
    case 'it':
      return <svg {...common}><rect width="24" height="16" fill="#fff" /><rect width="8" height="16" fill="#009246" /><rect x="16" width="8" height="16" fill="#CE2B37" /></svg>;
    case 'fr':
      return <svg {...common}><rect width="24" height="16" fill="#fff" /><rect width="8" height="16" fill="#0055A4" /><rect x="16" width="8" height="16" fill="#EF4135" /></svg>;
    case 'ja':
      return <svg {...common}><rect width="24" height="16" fill="#fff" /><circle cx="12" cy="8" r="4.6" fill="#BC002D" /></svg>;
  }
}
