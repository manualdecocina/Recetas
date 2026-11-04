'use client';
import { useEffect, useLayoutEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Reset new routes AND catalogue query pages after Next's own scroll handling.
 * Hash links keep their requested section; in-page scrolling is left alone. */
export default function NavigationScroll() {
 const pathname = usePathname(), query = useSearchParams().toString();
 useEffect(() => {
  const previous = history.scrollRestoration;
  history.scrollRestoration = 'manual';
  return () => { history.scrollRestoration = previous; };
 }, []);
 useIsoLayoutEffect(() => {
  const reset = () => {
   if (window.location.hash) return;
   window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };
  reset();
  const frame = requestAnimationFrame(reset);
  return () => cancelAnimationFrame(frame);
 }, [pathname, query]);
 return null;
}
