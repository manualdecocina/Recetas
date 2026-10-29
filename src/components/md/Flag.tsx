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
          <rect width="24" height="16" fill="#fff" />
          {Array.from({ length: 7 }, (_, stripe) => (
            <rect key={stripe} y={stripe * 32 / 13} width="24" height={16 / 13} fill="#B22234" />
          ))}
          <rect width="9.6" height={112 / 13} fill="#3C3B6E" />
          {Array.from({ length: 9 }, (_, row) =>
            Array.from({ length: row % 2 === 0 ? 6 : 5 }, (_, column) => (
              <path
                key={`${row}-${column}`}
                d="M0-.38L.09-.12H.36L.14.04L.22.3L0 .14L-.22.3L-.14.04L-.36-.12H-.09Z"
                transform={`translate(${(row % 2 === 0 ? 0.8 : 1.6) + column * 1.6} ${0.48 + row * 0.96})`}
                fill="#fff"
              />
            ))
          )}
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
    case 'pt':
      return <svg {...common}><rect width="24" height="16" fill="#009C3B" /><path d="M12 1.6L22 8L12 14.4L2 8Z" fill="#FFDF00" /><circle cx="12" cy="8" r="3.4" fill="#002776" /></svg>;
  }
}
