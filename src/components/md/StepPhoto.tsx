'use client';
import { useRef } from 'react';
import Image from 'next/image';
import { recipeImageSrc } from '@/lib/recipe-media';

/** Miniatura compacta que se amplía en un diálogo nativo (Esc o clic fuera para cerrar). */
export default function StepPhoto({ src, alt, closeLabel }: { src: string; alt: string; closeLabel: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="md-step-photo" onClick={() => ref.current?.showModal()} aria-label={alt}>
        <Image src={recipeImageSrc(src)} alt={alt} width={1200} height={800} sizes="(max-width: 700px) 92vw, 260px" loading="lazy" />
        <span className="md-step-photo-zoom" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="6.5" /><path d="M16 16l4.5 4.5M11 8.5v5M8.5 11h5" /></svg>
        </span>
      </button>
      <dialog ref={ref} className="md-lightbox" onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
        <button type="button" className="md-lightbox-close" onClick={() => ref.current?.close()} aria-label={closeLabel}>×</button>
        <Image src={recipeImageSrc(src)} alt={alt} width={1200} height={800} sizes="(max-width: 900px) 96vw, 1100px" />
        <p>{alt}</p>
      </dialog>
    </>
  );
}
