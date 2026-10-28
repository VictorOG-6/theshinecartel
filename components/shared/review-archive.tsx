import React, { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "@/constants/data";

const ReviewArchive = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const diptychs = reviews.filter(
    (r) => r.before_image_url && r.after_image_url,
  );
  if (diptychs.length === 0) return null;

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="relative" aria-label="Before and after photo gallery">
      <div className="flex items-baseline justify-between mb-8">
        <div>
          <h2 className="font-inter text-3xl md:text-4xl font-light tracking-tight text-foreground">
            Result Archive
          </h2>
          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500 mt-2">
            Unedited Transformations · {diptychs.length} Results Documented
          </p>
        </div>
        <div className="hidden md:flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
            aria-label="Scroll gallery left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-foreground focus:ring-offset-2"
            aria-label="Scroll gallery right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:-mx-8 md:px-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {diptychs.map((review, i) => (
          <motion.div
            key={review.user_name || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="flex-none w-85 md:w-105 snap-start"
          >
            <div
              className="relative rounded overflow-hidden bg-muted"
              style={{ filter: "contrast(0.98) saturate(0.9)" }}
            >
              <div className="grid grid-cols-2 gap-px bg-border">
                <div className="aspect-3/4 bg-muted">
                  <img
                    src={review.before_image_url}
                    alt={`Before photo by ${review.user_name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-3/4 bg-muted">
                  <img
                    src={review.after_image_url}
                    alt={`After photo by ${review.user_name}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
              {/* Labels */}
              <div className="absolute bottom-0 inset-x-0 grid grid-cols-2 gap-px">
                <div className="bg-background/80 backdrop-blur-sm px-3 py-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500">
                    Before
                  </span>
                </div>
                <div className="bg-background/80 backdrop-blur-sm px-3 py-2">
                  <span className="font-mono text-[9px] uppercase tracking-[0.15em] text-neutral-500">
                    After · {review.usage_duration?.replace("_", " ")}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <p className="font-body text-sm text-foreground">
                {review.user_name}
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-neutral-500">
                {review.skin_type} · {review.skin_tone}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ReviewArchive;
