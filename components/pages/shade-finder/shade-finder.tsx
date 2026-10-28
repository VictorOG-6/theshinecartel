"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  shadeFamilies,
  undertones,
  getFilteredShades,
  type FilteredShade,
  type ShadeFamilyId,
  type UndertoneId,
} from "@/lib/shade-finder-data";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const stepLabels = ["SHADE FAMILY", "UNDERTONE", "SHADE DEPTH"];

const ShadeFinderComponent = () => {
  const [step, setStep] = useState(1);
  const [selectedFamily, setSelectedFamily] = useState<ShadeFamilyId>("fair");
  const [selectedUndertone, setSelectedUndertone] =
    useState<UndertoneId | null>(null);
  const [selectedShade, setSelectedShade] = useState<FilteredShade | null>(
    null,
  );

  const reset = () => {
    setStep(1);
    setSelectedFamily("fair");
    setSelectedUndertone(null);
    setSelectedShade(null);
  };

  const filteredShades =
    selectedFamily && selectedUndertone
      ? getFilteredShades(selectedFamily, selectedUndertone)
      : [];

  const familyData = shadeFamilies.find((f) => f.id === selectedFamily);
  const undertoneData = undertones.find((u) => u.id === selectedUndertone);

  return (
    <div>
      {/* Tab indicators */}
      <div>
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
            <h1 className="text-primary font-medium font-roboto-mono text-base md:text-xl">
              THE SHADE TRADITION
            </h1>
            <h2 className="font-roboto-mono font-medium text-black text-[28px] md:text-[48px] lg:text-[89px] leading-13.75 md:leading-21.5">
              MEET YOUR <br /> RIGHT NOW
            </h2>
            <p className="text-black text-sm md:text-base">
              A considered way to find the shade that feels like yours.
            </p>
          </div>
          <div className="w-full flex items-center justify-between">
            {stepLabels.map((label, i) => (
              <div
                key={i}
                className={`w-full flex items-center lg:pl-7 pb-7 ${i + 1 === step ? "border-b-2 border-primary" : "border-b border-neutral-200"}`}
              >
                <div className="flex items-center gap-2 md:gap-4.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium font-roboto-mono transition-all ${
                      i + 1 === step
                        ? "bg-primary text-white shadow-md shadow-primary/20"
                        : i + 1 < step
                          ? "bg-green-500 text-white"
                          : "bg-transparent border border-neutral-200 text-neutral-400"
                    }`}
                  >
                    {i + 1 < step ? <Check className="w-4 h-4" /> : `0${i + 1}`}
                  </div>
                  <span
                    className={`text-sm font-medium font-roboto-mono sm:inline ${i + 1 === step ? "text-primary" : "text-neutral-400"}`}
                  >
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <section className="w-full bg-white border border-neutral-200 lg:pl-10 mt-10">
          {/* Step 1: Shade Family */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="grid md:grid-cols-5 gap-6">
                {/* Left: Color grid */}
                <div className="md:col-span-2 flex flex-col gap-5 pt-10">
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
                    <h2 className="text-primary font-medium font-roboto-mono text-xs">
                      01 / SHADE FAMILY
                    </h2>
                    <h2 className="text-black font-display text-xl md:text-3xl">
                      Start with your depth.
                    </h2>
                    <p className="text-sm text-tertiary mb-8">
                      Choose the family that feels closest to your skin today.
                    </p>
                  </div>
                  <div>
                    <div className="grid grid-cols-2 gap-3">
                      {shadeFamilies.map((family) => (
                        <button
                          key={family.id}
                          onClick={() => setSelectedFamily(family.id)}
                          className={`p-2 cursor-pointer transition-all text-center ${
                            selectedFamily === family.id
                              ? "border-2 border-primary bg-neutral-200 shadow-md"
                              : "border border-neutral-200 hover:border-neutral-300"
                          }`}
                        >
                          <div
                            className="w-full h-14 mb-2 shadow-sm"
                            style={{ backgroundColor: family.color }}
                          />
                          <p className="font-semibold text-sm text-neutral-900">
                            {family.name}
                          </p>
                          <p className="text-xs text-neutral-400">
                            {family.range}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="hidden mt-4 lg:flex justify-center">
                    <Button
                      onClick={() => setStep(2)}
                      className="w-full rounded-none bg-primary/80 hover:bg-primary/60 cursor-pointer"
                    >
                      Continue
                    </Button>
                  </div>
                </div>

                {/* Right: Selected family collage image */}
                <div className="relative md:col-span-3">
                  <div className="overflow-hidden bg-white shadow-sm">
                    <img
                      src={familyData?.collageImage}
                      alt={`${familyData?.name} shades`}
                      className="w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent p-6 pt-20 text-white md:p-10 md:pt-28 space-y-2">
                      <p className="text-xs text-neutral-200">
                        SELECTED FAMILY
                      </p>
                      <p className="font-medium text-white text-3xl">
                        {familyData?.name}
                      </p>
                      <p className="text-sm text-neutral-200">
                        {familyData?.range}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex md:col-span-2 mt-4 md:mt-0 lg:mt-4 lg:hidden justify-center pb-0 md:pb-4 lg:pb-0">
                  <Button
                    onClick={() => setStep(2)}
                    className="w-full rounded-none bg-primary/80 hover:bg-primary/60 cursor-pointer"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Undertone */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="grid md:grid-cols-5 gap-6">
                <div className="md:col-span-2 flex flex-col gap-5 pt-10">
                  <button
                    onClick={() => setStep(1)}
                    className="text-sm cursor-pointer text-neutral-500 hover:text-neutral-900 flex items-center mb-6 ml-3 lg:ml-0"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to shade family
                  </button>
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
                    <h2 className="text-primary font-medium font-roboto-mono text-xs">
                      02 / UNDERTONE
                    </h2>
                    <h2 className="text-black font-display text-xl md:text-3xl">
                      How does your skin read the light?
                    </h2>
                  </div>
                  <div className="flex flex-col gap-3">
                    {undertones.map((ut) => (
                      <button
                        key={ut.id}
                        onClick={() => {
                          setSelectedUndertone(ut.id);
                          setStep(3);
                        }}
                        className={`flex items-center text-neutral-400 text-left p-3 cursor-pointer border border-neutral-200 transition-all shadow-md hover:shadow-lg hover:border-primary ${
                          selectedUndertone === ut.id
                            ? "border-primary shadow-lg bg-neutral-200"
                            : "border-neutral-100 hover:border-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 shrink-0 rounded-full shadow-lg"
                            style={{ background: ut.color }}
                          />
                          <div className="flex flex-col gap-1">
                            <h3 className="text-black font-semibold text-base">
                              {ut.name}
                            </h3>
                            <p className="text-sm">{ut.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Selected family collage image */}
                <div className="relative md:col-span-3">
                  <div className="overflow-hidden bg-white shadow-sm">
                    <img
                      src={familyData?.collageImage}
                      alt={`${familyData?.name} shades`}
                      className="w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/65 to-transparent p-6 pt-20 text-white md:p-10 md:pt-28 space-y-2">
                      <p className="text-xs text-neutral-200">
                        {familyData?.range}
                      </p>
                      <p className="font-medium text-white text-3xl">
                        {familyData?.name}
                      </p>
                      <p className="text-sm text-neutral-200">
                        Now choose your undertone
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Shade Depth */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <div className="pt-10 flex flex-col lg:flex-row lg:items-end justify-between mb-8 lg:mr-10 pb-8 border-b border-neutral-200 gap-5 lg:gap-0">
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setStep(2)}
                    className="text-sm cursor-pointer text-neutral-500 hover:text-neutral-900 flex items-center my-2 ml-4 lg:ml-o"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to undertone
                  </button>
                  <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-2.5">
                    <h2 className="text-primary font-medium font-roboto-mono text-xs">
                      03 / SHADE DEPTH
                    </h2>
                    <h2 className="text-black font-display text-xl md:text-3xl">
                      Your Depth, <br /> in focus.
                    </h2>
                  </div>
                </div>
                <div className="text-center lg:text-left text-sm text-neutral-500 flex flex-col items-center lg:items-start gap-2">
                  <div className="flex items-center gap-1">
                    <p className="font-bold text-black">{familyData?.name}</p>
                    <span>.</span>
                    <p>{undertoneData?.name}</p>
                  </div>
                  <p>Choose the image that feels closest to your skin.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-6 pb-10">
                {filteredShades.map((shade) => (
                  <button
                    key={shade.number}
                    onClick={() => {
                      setSelectedShade(shade);
                      setStep(4);
                    }}
                    className="group overflow-hidden border-2 border-neutral-100 hover:border-primary hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={shade.image}
                        alt={`Shade ${shade.number}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow flex-shrink-0"
                        style={{ backgroundColor: shade.color }}
                      />
                      <div className="text-left">
                        <h3 className="text-primary font-semibold">
                          Shade {shade.number}
                        </h3>
                        <p className="text-xs text-neutral-400 capitalize">
                          {shade.undertone} undertone
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Result */}
          {step === 4 && selectedShade && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <section className="flex flex-col items-center py-10">
                <div className="overflow-hidden shadow-2xl mb-6 max-w-xs mx-auto border border-primary">
                  <img
                    src={selectedShade.image}
                    alt={`Shade ${selectedShade.number}`}
                    className="w-full aspect-[3/4] object-cover"
                  />
                </div>
                <p className="text-sm font-medium text-primary tracking-widest uppercase mb-2">
                  Your Perfect Match
                </p>
                <h2 className="font-display text-3xl font-bold text-black">
                  Shade {selectedShade.number}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow"
                    style={{ backgroundColor: selectedShade.color }}
                  />
                  <p className="text-neutral-500 capitalize">
                    {selectedShade.family} · {selectedShade.undertone} Undertone
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
                  <Link href="/shop">
                    <Button
                      size="lg"
                      className="rounded-full px-8 bg-primary hover:bg-primary/90 cursor-pointer"
                    >
                      Shop Matching Products
                    </Button>
                  </Link>
                  <Button
                    onClick={reset}
                    size="lg"
                    className="rounded-full px-8 cursor-pointer bg-white hover:bg-gray-200 text-black"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" /> Start Over
                  </Button>
                </div>
              </section>
            </motion.div>
          )}
        </section>
      </AnimatePresence>
    </div>
  );
};

export default ShadeFinderComponent;
