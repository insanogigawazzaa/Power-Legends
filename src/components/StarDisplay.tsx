import React from 'react';

interface StarDisplayProps {
  stars: number; // 1 to 7
  isRed: boolean; // false = gold stars, true = red stars (1+ to 7+)
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  showTextLabel?: boolean;
}

export const StarDisplay: React.FC<StarDisplayProps> = ({
  stars,
  isRed,
  size = 'sm',
  className = '',
  showTextLabel = false,
}) => {
  const count = Math.min(Math.max(1, stars), 7);

  const sizeMap = {
    xs: { star: 'w-2.5 h-2.5', text: 'text-[9px]', plus: 'text-[9px]' },
    sm: { star: 'w-3.5 h-3.5', text: 'text-[11px]', plus: 'text-[11px]' },
    md: { star: 'w-5 h-5', text: 'text-xs', plus: 'text-xs' },
    lg: { star: 'w-7 h-7', text: 'text-sm', plus: 'text-sm' },
  };

  const { star: starSize, text: textSize, plus: plusSize } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {/* Stars Icons Row */}
      <div className="flex items-center -space-x-0.5">
        {Array.from({ length: count }).map((_, index) => (
          <svg
            key={index}
            viewBox="0 0 24 24"
            className={`${starSize} transition-transform drop-shadow ${
              isRed
                ? 'text-red-500 fill-red-500 filter drop-shadow-[0_0_4px_rgba(239,68,68,0.9)]'
                : 'text-yellow-400 fill-yellow-400 filter drop-shadow-[0_0_3px_rgba(250,204,21,0.8)]'
            }`}
          >
            <defs>
              {isRed ? (
                <linearGradient id={`redStarGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff4b4b" />
                  <stop offset="50%" stopColor="#dc2626" />
                  <stop offset="100%" stopColor="#991b1b" />
                </linearGradient>
              ) : (
                <linearGradient id={`goldStarGrad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="40%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
              )}
            </defs>
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={isRed ? `url(#redStarGrad-${index})` : `url(#goldStarGrad-${index})`}
              stroke={isRed ? '#fecaca' : '#fef9c3'}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </svg>
        ))}
      </div>

      {/* Red Stars Indicator (+) */}
      {isRed && (
        <span
          className={`font-black font-mono leading-none ${plusSize} text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,1)] ml-0.5`}
        >
          +
        </span>
      )}

      {/* Optional text label */}
      {showTextLabel && (
        <span
          className={`font-black font-mono ${textSize} ml-1 ${
            isRed ? 'text-red-400' : 'text-yellow-400'
          }`}
        >
          {count}
          {isRed ? '+★' : '★'}
        </span>
      )}
    </div>
  );
};
