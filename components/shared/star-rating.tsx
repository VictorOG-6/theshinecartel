"use client";

import { useId } from "react";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
}

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

const STAR_CLASS = "size-[15px] md:size-5 shrink-0";

export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const id = useId();
  const clampedRating = Math.min(Math.max(rating, 0), maxStars);
  const fullStars = Math.floor(clampedRating);
  const decimal = clampedRating - fullStars;

  const filledCount = decimal > 0.5 ? fullStars + 1 : fullStars;
  const hasHalfStar = decimal > 0 && decimal <= 0.5 && filledCount < maxStars;

  const getStarState = (index: number): "empty" | "half" | "full" => {
    if (index < filledCount) return "full";
    if (index === filledCount && hasHalfStar) return "half";
    return "empty";
  };

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star key={i} state={getStarState(i)} clipId={`${id}-half-${i}`} />
      ))}
    </div>
  );
}

function Star({
  state,
  clipId,
}: {
  state: "empty" | "half" | "full";
  clipId: string;
}) {
  if (state === "half") {
    return (
      <svg className={STAR_CLASS} viewBox="0 0 24 24" aria-hidden="true">
        <defs>
          <clipPath id={clipId}>
            <rect x="0" y="0" width="12" height="24" />
          </clipPath>
        </defs>
        <path d={STAR_PATH} fill="none" stroke="#D1D5DB" strokeWidth={1.5} />
        <path
          d={STAR_PATH}
          fill="#FBBF24"
          stroke="#FBBF24"
          strokeWidth={1.5}
          clipPath={`url(#${clipId})`}
        />
      </svg>
    );
  }

  const filled = state === "full";

  return (
    <svg
      className={STAR_CLASS}
      viewBox="0 0 24 24"
      fill={filled ? "#FBBF24" : "none"}
      stroke={filled ? "#FBBF24" : "#D1D5DB"}
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}
