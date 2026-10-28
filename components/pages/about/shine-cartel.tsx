"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import ShineCartelFloatingPhrase from "./shine-cartel-floating-phrase";
import {
  SHINE_CARTEL_PHRASES,
  getPhrasePosition,
} from "./shine-cartel-phrases";
import { useMediaQuery } from "./use-media-query";

const ShineCartelViewer = dynamic(() => import("./shine-cartel-viewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[400px] w-full items-center justify-center text-sm text-tertiary">
      Loading 3D model…
    </div>
  ),
});

const ShineCartel = () => {
  const isMdUp = useMediaQuery("(min-width: 768px)");
  const isMobileLayout = isMdUp !== true;

  const activePhrases = useMemo(() => {
    if (isMdUp === null) {
      return SHINE_CARTEL_PHRASES.filter((phrase) => phrase.mobile);
    }
    return isMdUp
      ? SHINE_CARTEL_PHRASES
      : SHINE_CARTEL_PHRASES.filter((phrase) => phrase.mobile);
  }, [isMdUp]);

  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center gap-2 px-5 py-5 lg:px-0">
      <h1 className="font-roboto-mono text-primary font-medium text-center lg:text-left text-base md:text-xl">
        Thoughts Behind The Shine Cartel
      </h1>
      <div className="overflow-hidden relative mx-auto flex w-full flex-col items-center gap-10 px-5 py-5 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:px-0">
        <div className="w-full flex justify-center relative z-50">
          <ShineCartelViewer />
        </div>
        <div className="absolute inset-0">
          {activePhrases.map((phrase, index) => {
            const position = getPhrasePosition(index, isMobileLayout);

            return (
              <ShineCartelFloatingPhrase
                key={phrase.id}
                text={phrase.text}
                position={position}
                compact={isMobileLayout}
                delay={(isMdUp ? 0.12 : 0.18) + index * (isMdUp ? 0.1 : 0.14)}
                pulseVariant={index % 2 === 0 ? "float" : "pulse"}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShineCartel;
