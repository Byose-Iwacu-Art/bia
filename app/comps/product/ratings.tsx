import React from 'react';

type P = { rate?: number | null };

export function RatingStars({ rate }: P) {
  const safeRate = typeof rate === 'number' && rate >= 0 ? rate : 0;
  const normalizedRate = (safeRate / 20) * 5; // convert 0–100 to 0–5 scale
  const filledStars = Math.round(normalizedRate);
  const emptyStars = 5 - filledStars;

  return (
    <div className="flex items-center">
      {[...Array(filledStars)].map((_, i) => (
        <span key={`filled-${i}`} className="text-orange-300 text-xl">★</span>
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <span key={`empty-${i}`} className="text-gray-300 text-xl">★</span>
      ))}
      <span className="ml-2 text-xs text-red-500 font-medium">
        {safeRate === 0 ? 'No rating yet' : `${safeRate*5}%`}
      </span>
    </div>
  );
}
