'use client';
import { useEffect, useRef, useState } from 'react';
import type { MdLanguage } from './md-types';
import { getMdCopy } from '@/lib/copy';
import { countLabel } from '@/lib/plural';

const KEY = 'manualdecocina:rated';

/** Adapter assumption: votos por dispositivo guardados como Record<recipeId, 1-5>. */
function readMyVote(recipeId: string): number | null {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (typeof parsed !== 'object' || parsed === null) return null;
    const value = (parsed as Record<string, unknown>)[recipeId];
    return typeof value === 'number' && value >= 1 && value <= 5 ? value : null;
  } catch { return null; }
}

function saveMyVote(recipeId: string, rating: number) {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    const next = (typeof parsed === 'object' && parsed !== null) ? { ...(parsed as Record<string, number>) } : {};
    next[recipeId] = rating;
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* Almacenamiento restringido: el voto igual se contó en el servidor. */ }
}

/**
 * Estrellas de valoración real (distintas del botón de favoritos ★/☆). Muestra el
 * promedio real acumulado en la base de datos y, si el dispositivo no ha votado antes
 * en esta receta, permite votar una vez (1-5). El aggregateRating del JSON-LD sale de
 * estos mismos números — nunca se inventa ninguno.
 */
export default function RatingWidget({ recipeId, lang, ratingCount, ratingSum }: {
  recipeId: string;
  lang: MdLanguage;
  ratingCount: number;
  ratingSum: number;
}) {
  const t = getMdCopy(lang);
  const [count, setCount] = useState(ratingCount);
  const [sum, setSum] = useState(ratingSum);
  const [myVote, setMyVote] = useState<number | null>(null);
  const [hover, setHover] = useState(0);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);

  useEffect(() => { setMyVote(readMyVote(recipeId)); }, [recipeId]);

  const average = count > 0 ? sum / count : 0;

  async function vote(rating: number) {
    if (inFlight.current || myVote !== null) return;
    inFlight.current = true;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/rate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, rating }),
      });
      if (res.status === 409) {
        setError(t.ratingDuplicate);
        return;
      }
      if (!res.ok) throw new Error('rating rejected');
      const data = await res.json();
      if (typeof data.rating_count !== 'number' || typeof data.rating_sum !== 'number') throw new Error('invalid rating response');
      setMyVote(rating);
      saveMyVote(recipeId, rating);
      setCount(data.rating_count);
      setSum(data.rating_sum);
    } catch {
      setError(t.ratingError);
    } finally {
      inFlight.current = false;
      setSending(false);
    }
  }

  const displayValue = hover || myVote || 0;

  return (
    <div className="md-rating-widget">
      <span className="md-rating-heading">{t.ratingHeading}</span>
      <div className="md-rating-stars" role="group" aria-label={t.ratingHeading}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className="md-rating-star"
            aria-label={`${n} ${t.ratingStarLabel}`}
            aria-pressed={myVote === n}
            disabled={sending || myVote !== null}
            onMouseEnter={() => myVote === null && setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => vote(n)}
          >
            {n <= displayValue ? '★' : '☆'}
          </button>
        ))}
      </div>
      <span className="md-rating-summary">
        {count > 0
          ? `${average.toFixed(1)} ${t.ratingAverageOf5} · ${countLabel(lang, count, 'vote')}`
          : t.ratingNoVotesYet}
      </span>
      {error && <span className="md-rating-error" role="alert">{error}</span>}
      {myVote !== null && <span className="md-rating-thanks">{t.ratingThanks}</span>}
    </div>
  );
}
