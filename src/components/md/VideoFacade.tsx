'use client';
import { useState } from 'react';
import Image from 'next/image';

/**
 * El reproductor de terceros solo se carga cuando la persona pulsa "reproducir":
 * la página no descarga el iframe (ni cookies de terceros) hasta entonces.
 */
export default function VideoFacade({ embedUrl, title, posterUrl, playLabel }: {
  embedUrl: string;
  title: string;
  posterUrl?: string | null;
  playLabel: string;
}) {
  const [active, setActive] = useState(false);
  const src = embedUrl + (embedUrl.includes('?') ? '&' : '?') + 'autoplay=1';
  return (
    <div className="md-video-frame">
      {active ? (
        <iframe src={src} title={title} allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
      ) : (
        <button type="button" className="md-video-play" onClick={() => setActive(true)} aria-label={`${playLabel}: ${title}`}>
          {posterUrl && <Image src={posterUrl} alt="" fill sizes="(max-width: 900px) 100vw, 900px" />}
          <span className="md-video-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="30" height="30"><path d="M8 5v14l11-7z" fill="currentColor" /></svg></span>
        </button>
      )}
    </div>
  );
}
