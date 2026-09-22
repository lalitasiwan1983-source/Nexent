import React from 'react';

interface NexentLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function NexentLogo({ className = '', size = 'md', showText = true }: NexentLogoProps) {
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 24;
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Nexent 'N' geometric mark */}
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-label="Nexent logo"
      >
        <path
          d="M6 22V6L14 18V22H6Z"
          fill="#22c55e"
        />
        <path
          d="M14 6H22V10L14 22V6Z"
          fill="#34d399"
        />
        <path
          d="M14 18L22 6V22H14V18Z"
          fill="#22c55e"
          fillOpacity="0.85"
        />
      </svg>

      {showText && (
        <span className={`font-semibold tracking-tight text-white font-sans ${textSize}`}>
          Nexent
        </span>
      )}
    </div>
  );
}
