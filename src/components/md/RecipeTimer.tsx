'use client';
import { useEffect, useState } from 'react';
import type { MdLanguage, MdStep } from './md-types';
import { kitchenCopy } from '@/lib/kitchen-copy';
import { stepTimerSeconds } from '@/lib/recipe-quantities';
type Timer = { remaining: number; deadline: number | null; duration: number; started: boolean };
export default function RecipeTimer({ recipeId, step, position, lang, current }: { recipeId: string; step: MdStep; position: number; lang: MdLanguage; current: boolean }) {
 const t = kitchenCopy(lang), seconds = stepTimerSeconds(step), key = `manualdecocina:timer:${recipeId}:${position}`;
 const [timer, setTimer] = useState<Timer>({ remaining: seconds ?? 0, deadline: null, duration: seconds ?? 0, started: false });
 const [minutes, setMinutes] = useState(seconds ? String(seconds / 60) : '');
 useEffect(() => { try { const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
  if (saved && Number.isFinite(saved.duration) && saved.duration > 0 && Number.isFinite(saved.remaining) && saved.remaining >= 0 && (saved.deadline === null || Number.isFinite(saved.deadline))) {
   setTimer({ ...saved, remaining: saved.deadline ? Math.max(0, Math.ceil((saved.deadline - Date.now()) / 1000)) : saved.remaining }); setMinutes(String(saved.duration / 60));
  }
 } catch {} }, [key]);
 useEffect(() => {
  if (!timer.deadline) return;
  const tick = () => setTimer(previous => ({ ...previous, remaining: Math.max(0, Math.ceil(((previous.deadline ?? Date.now()) - Date.now()) / 1000)) }));
  tick(); const id = window.setInterval(tick, 1000); return () => window.clearInterval(id);
 }, [timer.deadline]);
 function save(next: Timer) { setTimer(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch {} }
 if (!current && !timer.started) return null;
 const done = timer.started && timer.remaining === 0;
 const running = timer.deadline !== null && !done;
 return <div className="md-step-timer">
  <strong>{seconds ? t.timer : t.manualTimer} · {position + 1}</strong>
  <span className="md-timer-clock" role="timer" aria-live="off">{Math.floor(timer.remaining / 60)}:{String(timer.remaining % 60).padStart(2, '0')}</span>
  {done && <p role="status">{t.done} · {step.title}</p>}
  <div className="md-kitchen-actions">
   {!timer.started && <label>{t.minutes} <input type="number" min="0.0167" max="1440" step="any" value={minutes} onChange={event => { setMinutes(event.currentTarget.value); const duration = Math.round(Number(event.currentTarget.value) * 60); if (duration > 0 && duration <= 86400) save({ duration, remaining: duration, deadline: null, started: false }); }} /></label>}
   {!done && <button type="button" className="md-button-secondary" disabled={!timer.started && (!Number.isFinite(Number(minutes)) || Number(minutes) <= 0 || Number(minutes) > 1440)} onClick={() => save(running
    ? { ...timer, remaining: Math.max(0, Math.ceil((timer.deadline! - Date.now()) / 1000)), deadline: null }
    : { ...timer, deadline: Date.now() + timer.remaining * 1000, started: true })}>{running ? t.pause : t.start}</button>}
   {timer.started && <button type="button" className="md-button-quiet" onClick={() => save({ remaining: timer.duration, duration: timer.duration, deadline: null, started: false })}>{t.reset}</button>}
  </div>
 </div>;
}
