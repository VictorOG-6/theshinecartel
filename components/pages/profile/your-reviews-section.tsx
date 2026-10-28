"use client";

import { StarRating } from "@/components/shared/star-rating";
import useFetchReviews from "@/hooks/review/use-fetch-reviews";
import { Review } from "@/types";
import { MessageSquare } from "lucide-react";

export const YourReviewsSection = () => {
  const { data: reviews = [], isLoading: reviewsLoading } = useFetchReviews({
    page_size: 10,
    page: 1,
  });

  return (
    <div className="flex flex-col items-center lg:items-start gap-7.5">
      <div className="flex items-center gap-3 text-sm md:text-2xl text-black">
        <MessageSquare className="w-6 h-6" />
        <h2>Your Reviews</h2>
      </div>
      <div className="max-h-80 overflow-y-scroll w-full bg-white rounded-2xl">
        {reviews.length <= 0 && !reviewsLoading && (
          <div className="w-full h-30 md:h-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-xs md:text-base text-neutral-400">
              <MessageSquare className="w-7 h-7 md:w-10 md:h-10" />
              <p>You haven&apos;t written any reviews yet.</p>
            </div>
          </div>
        )}
        {reviewsLoading && (
          <div className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300 animate-pulse">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-foreground" />
                  <div className="flex flex-col gap-1 md:gap-1.5">
                    <div className="w-18.5 h-6 bg-foreground" />
                    <div className="w-20 h-6 bg-foreground" />
                  </div>
                </div>
                <div className="w-18.5 h-6 bg-foreground" />
              </div>
            </div>
          </div>
        )}
        {reviews.length > 0 &&
          reviews.map((review: Review) => (
            <div
              key={review.id}
              className="md:gap-5.5 py-3.5 md:py-6 px-4 md:px-7 border-b border-neutral-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={review.product.image_url}
                      alt={review.product.name}
                      className="h-10 object-cover"
                    />
                    <div className="flex flex-col gap-1 md:gap-1.5">
                      <h4 className="text-base text-black">
                        {review.product.name}
                      </h4>
                      <p className="max-w-45 md:max-w-80 lg:max-w-102.5 text-xs md:text-base text-neutral-500 line-clamp-3">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                  <span>
                    <StarRating rating={review.rating} />
                  </span>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
