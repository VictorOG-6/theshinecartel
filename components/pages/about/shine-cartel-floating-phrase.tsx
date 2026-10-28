"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { PhrasePosition } from "./shine-cartel-phrases";

type ShineCartelFloatingPhraseProps = {
  text: string;
  position: PhrasePosition;
  delay: number;
  pulseVariant: "float" | "pulse";
  compact?: boolean;
};

const ShineCartelFloatingPhrase = ({
  text,
  position,
  delay,
  pulseVariant,
  compact = false,
}: ShineCartelFloatingPhraseProps) => {
  const reduceMotion = useReducedMotion();
  const { align, top, left, right } = position;

  const alignClass =
    align === "left"
      ? "text-left -translate-y-1/2"
      : align === "right"
        ? "text-right -translate-y-1/2"
        : "text-center -translate-x-1/2 -translate-y-1/2";

  return (
    <motion.p
      className={`pointer-events-none absolute z-10 leading-snug text-tertiary font-bold text-shadow-sm ${alignClass} ${
        compact
          ? "max-w-[6.5rem] text-[9px] sm:max-w-[7.25rem] sm:text-[10px]"
          : "max-w-[6.75rem] text-[10px] sm:max-w-[7.5rem] sm:text-[11px] md:max-w-[8.25rem] md:text-xs lg:max-w-[9rem]"
      }`}
      style={{ top, left, right }}
      initial={{ opacity: 0, scale: 0.92, y: 6 }}
      animate={
        reduceMotion
          ? { opacity: 1, scale: 1, y: 0 }
          : pulseVariant === "float"
            ? {
                opacity: 1,
                scale: 1,
                y: [0, -4, 0],
              }
            : {
                opacity: [0.9, 1, 0.9],
                scale: [1, 1.03, 1],
                y: 0,
              }
      }
      transition={
        reduceMotion
          ? { delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }
          : pulseVariant === "float"
            ? {
                opacity: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                scale: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                y: {
                  delay: delay + 0.5,
                  duration: 4.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }
            : {
                opacity: {
                  delay: delay + 0.45,
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                scale: {
                  delay: delay + 0.45,
                  duration: 3.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                y: { delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
              }
      }
    >
      {text}
    </motion.p>
  );
};

export default ShineCartelFloatingPhrase;
