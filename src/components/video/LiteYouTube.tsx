import { useState } from 'react';

interface Props {
  videoId: string;
  title: string;
}

export default function LiteYouTube({ videoId, title }: Props) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="border-ink/10 bg-night-alt aspect-video w-full overflow-hidden rounded-xl border">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play video: ${title}`}
      className="group border-ink/10 bg-night-alt relative block aspect-video w-full overflow-hidden rounded-xl border"
    >
      <img
        src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <span className="bg-night/30 group-hover:bg-night/40 absolute inset-0 flex items-center justify-center transition-colors">
        <span className="bg-brand text-night flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
      <span className="from-night/90 font-display text-ink absolute right-0 bottom-0 left-0 bg-gradient-to-t to-transparent p-3 text-left text-sm font-bold tracking-wide uppercase">
        {title}
      </span>
    </button>
  );
}
