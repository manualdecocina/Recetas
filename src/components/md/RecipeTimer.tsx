'use client';
import { useEffect, useState } from 'react';
import type { MdLanguage, MdStep } from './md-types';
import { kitchenCopy } from '@/lib/kitchen-copy';
import { stepTimerSeconds } from '@/lib/recipe-quantities';
type Timer = { remaining: number; deadline: number | null; duration: number; started: boolean };
export default function RecipeTimer({ recipeId, step, position, lang, current, onSelect }: { recipeId: string; step: MdStep; position: number; lang: MdLanguage; current: boolean; onSelect?: () => void }) {
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
 const clock = `${Math.floor(timer.remaining / 60)}:${String(timer.remaining % 60).padStart(2, '0')}`;
 if (!current) return <button type="button" className={`md-timer-chip${done ? ' md-timer-chip-done' : ''}`} onClick={onSelect} aria-label={`${t.timer} ${position + 1}: ${step.title} · ${done ? t.done : clock}`}>
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="14" r="8" /><path d="M12 10v4l2 2M9 2h6M12 2v4" /></svg>
  <span>{t.timer} · {position + 1}</span><strong role={done ? 'status' : undefined}>{done ? t.done : clock}</strong>
 </button>;
 const controls = <>
  {seconds && <strong>{t.timer} · {position + 1}</strong>}
  {timer.duration > 0 && <span className="md-timer-clock" role="timer" aria-live="off">{clock}</span>}
  {done && <p role="status">{t.done} · {step.title}</p>}
  <div className="md-kitchen-actions">
   {!timer.started && <label>{t.minutes} <input type="number" min="0.0167" max="1440" step="any" value={minutes} onChange={event => { setMinutes(event.currentTarget.value); const duration = Math.round(Number(event.currentTarget.value) * 60); if (duration > 0 && duration <= 86400) save({ duration, remaining: duration, deadline: null, started: false }); }} /></label>}
   {!done && <button type="button" className="md-button-secondary" disabled={!timer.started && (!Number.isFinite(Number(minutes)) || Number(minutes) <= 0 || Number(minutes) > 1440)} onClick={() => save(running
    ? { ...timer, remaining: Math.max(0, Math.ceil((timer.deadline! - Date.now()) / 1000)), deadline: null }
    : { ...timer, deadline: Date.now() + timer.remaining * 1000, started: true })}>{running ? t.pause : t.start}</button>}
   {timer.started && <button type="button" className="md-button-quiet" onClick={() => save({ remaining: timer.duration, duration: timer.duration, deadline: null, started: false })}>{t.reset}</button>}
  </div>
 </>;
 if (!seconds) return <details className="md-step-timer md-step-timer-manual" open={timer.started || undefined}>
  <summary>{t.manualTimer} · {position + 1}</summary>{controls}
 </details>;
 return <div className="md-step-timer">{controls}</div>;
}
