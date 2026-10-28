import React from "react";
import { motion } from "framer-motion";

interface EfficacyBarProps {
  label: string;
  value: number;
  delay: number;
}

const EfficacyBar = ({ label, value, delay }: EfficacyBarProps) => (
  <div className="flex-1 min-w-50">
    <div className="flex items-baseline justify-between mb-3">
      <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-neutral-500">
        {label}
      </span>
      <span className="font-mono text-[11px] text-neutral-500">{value}%</span>
    </div>
    <div className="relative h-0.5 bg-border overflow-hidden rounded-full">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: "hsl(var(--sage))" }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  </div>
);

interface EfficacySpectrumProps {
  productEffectiveness: number;
  quality: number;
  customerSatisfaction: number;
}

export default function EfficacySpectrum({
  productEffectiveness,
  quality,
  customerSatisfaction,
}: EfficacySpectrumProps) {
  return (
    <div className="flex flex-col md:flex-row gap-10 md:gap-16">
      <EfficacyBar
        label="Product Effectiveness"
        value={productEffectiveness}
        delay={0.2}
      />
      <EfficacyBar label="Quality and Saftey" value={quality} delay={0.4} />
      <EfficacyBar
        label="Customer Satisfaction"
        value={customerSatisfaction}
        delay={0.6}
      />
    </div>
  );
}
