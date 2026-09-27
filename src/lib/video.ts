export type ParsedVideo = { provider: 'youtube' | 'vimeo'; id: string; embedUrl: string; watchUrl: string }

/** Acepta URLs de YouTube o del reproductor de Vimeo (con o sin hash privado `h=`). */
export function parseVideo(url?: string | null): ParsedVideo | null {
  if (!url) return null
  const yt = url.match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (yt) {
    return {
      provider: 'youtube',
      id: yt[1],
      embedUrl: `https://www.youtube-nocookie.com/embed/${yt[1]}`,
      watchUrl: `https://www.youtube.com/watch?v=${yt[1]}`,
    }
  }
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:[/?][^\s]*?h=|\/)?([0-9a-f]{8,12})?/i)
  if (vm) {
    const hash = url.match(/[?&]h=([0-9a-f]+)/i)?.[1] ?? vm[2]
    const query = hash ? `?h=${hash}&dnt=1` : '?dnt=1'
    return {
      provider: 'vimeo',
      id: vm[1],
      embedUrl: `https://player.vimeo.com/video/${vm[1]}${query}`,
      watchUrl: `https://vimeo.com/${vm[1]}${hash ? '/' + hash : ''}`,
    }
  }
  return null
}

export function youtubeId(url?: string | null): string | null {
  const v = parseVideo(url)
  return v?.provider === 'youtube' ? v.id : null
}

/** Convierte minutos/segundos a duración ISO 8601 (PT6M56S). */
export function isoDuration(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = Math.round(totalSeconds % 60)
  return `PT${m}M${s}S`
}
