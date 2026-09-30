import React from 'react';
import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';

const RatingStars = ({ rating = 0, reviewCount = null, size = 14, className = "" }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} size={size} className="text-neutral-900" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="text-neutral-900" />);
    } else {
      stars.push(<FiStar key={i} size={size} className="text-neutral-300" />);
    }
  }

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center gap-0.5">{stars}</div>
      {rating > 0 && <span className="text-xs font-semibold text-neutral-900">{rating.toFixed(1)}</span>}
      {reviewCount !== null && (
        <span className="text-xs text-neutral-500">({reviewCount})</span>
      )}
    </div>
  );
};

export default RatingStars;
