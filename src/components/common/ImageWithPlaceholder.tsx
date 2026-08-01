interface ImageWithPlaceholderProps {
  src?: string;
  alt: string;
  className?: string;
}

export function ImageWithPlaceholder({ src, alt, className = "" }: ImageWithPlaceholderProps) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-300 text-brand-700 ${className}`}
        role="img"
        aria-label={alt}
      >
        <svg
          aria-hidden="true"
          className="h-10 w-10 opacity-70"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16l5-5 4 4 3-3 6 6" />
          <circle cx="8" cy="9" r="1.5" />
        </svg>
      </div>
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" />;
}
