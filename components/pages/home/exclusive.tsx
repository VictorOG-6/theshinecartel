"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const SLIDE_INTERVAL_MS = 6000;

type Point = { x: number; y: number };

type CustomerImage = {
  src: string;
  alt: string;
  /** Swatch position on palette background (0–1). Tune later per shade. */
  paletteAnchor: Point;
  /** Where the shade sits on the customer photo (0–1). */
  shadeOnImage: Point;
  /** Where the “Color used” label sits on the customer photo (0–1). */
  labelOnImage: Point;
};

type PaletteSlide = {
  name: string;
  paletteBgImage: string;
  description: string;
  customerImages: CustomerImage[];
};

const PALETTES: PaletteSlide[] = [
  {
    name: "Lollypop Liner Palette",
    paletteBgImage: "/images/palette-1.avif",
    description:
      "We make the things that live closest to you: a tint that meets your skin where it is, a dress that follows your movement, a balm that looks like you on your best ordinary day.",
    customerImages: [
      {
        src: "/images/palette-1a.avif",
        alt: "Lollypop palette look 1",
        paletteAnchor: { x: 0.7, y: 0.55 },
        shadeOnImage: { x: 0.55, y: 0.45 },
        labelOnImage: { x: 0.72, y: 0.28 },
      },
      {
        src: "/images/palette-1b.avif",
        alt: "Lollypop palette look 2",
        paletteAnchor: { x: 0.78, y: 0.44 },
        shadeOnImage: { x: 0.5, y: 0.5 },
        labelOnImage: { x: 0.78, y: 0.32 },
      },
      {
        src: "/images/palette-1c.avif",
        alt: "Lollypop palette look 3",
        paletteAnchor: { x: 0.57, y: 0.45 },
        shadeOnImage: { x: 0.48, y: 0.42 },
        labelOnImage: { x: 0.68, y: 0.24 },
      },
    ],
  },
  {
    name: "Candypop Liner Palette",
    paletteBgImage: "/images/palette-2.avif",
    description:
      "Bright, glossy liners that read like candy on the lid—buildable pops of color that stay comfortable from morning coffee to last call.",
    customerImages: [
      {
        src: "/images/palette-2a.avif",
        alt: "Candypop palette look 1",
        paletteAnchor: { x: 0.7, y: 0.6 },
        shadeOnImage: { x: 0.52, y: 0.48 },
        labelOnImage: { x: 0.7, y: 0.3 },
      },
      {
        src: "/images/palette-2b.avif",
        alt: "Candypop palette look 2",
        paletteAnchor: { x: 0.58, y: 0.48 },
        shadeOnImage: { x: 0.5, y: 0.44 },
        labelOnImage: { x: 0.75, y: 0.26 },
      },
      {
        src: "/images/palette-2c.avif",
        alt: "Candypop palette look 3",
        paletteAnchor: { x: 0.68, y: 0.37 },
        shadeOnImage: { x: 0.54, y: 0.5 },
        labelOnImage: { x: 0.68, y: 0.34 },
      },
    ],
  },
  {
    name: "Earthpop Liner Palette",
    paletteBgImage: "/images/palette-3.avif",
    description:
      "Soft earth tones and muted liners for everyday definition—grounded shades that melt into your skin and lift the eye without shouting.",
    customerImages: [],
  },
];

function formatSlideIndex(index: number, total: number) {
  return `${String(index + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;
}

const Exclusive = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [previewAlt, setPreviewAlt] = useState("");
  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(
    null,
  );
  const [focusedImageIndex, setFocusedImageIndex] = useState<number | null>(
    null,
  );
  const [isPaused, setIsPaused] = useState(false);
  const [connector, setConnector] = useState<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
  } | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const palettePanelRef = useRef<HTMLDivElement>(null);
  const customerImageRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const slide = PALETTES[activeIndex];
  const activeHighlightIndex = hoveredImageIndex ?? focusedImageIndex;

  const advanceSlide = useCallback(() => {
    setActiveIndex((i) => (i + 1) % PALETTES.length);
    setHoveredImageIndex(null);
    setFocusedImageIndex(null);
  }, []);

  useEffect(() => {
    if (isPaused || previewSrc) return;
    const id = window.setInterval(advanceSlide, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [advanceSlide, isPaused, previewSrc]);

  const updateConnector = useCallback(() => {
    const highlightIndex = hoveredImageIndex ?? focusedImageIndex;
    if (
      highlightIndex === null ||
      !sectionRef.current ||
      !palettePanelRef.current
    ) {
      setConnector(null);
      return;
    }

    const customer = slide.customerImages[highlightIndex];
    const imageEl = customerImageRefs.current[highlightIndex];
    if (!customer || !imageEl) {
      setConnector(null);
      return;
    }

    const sectionRect = sectionRef.current.getBoundingClientRect();
    const paletteRect = palettePanelRef.current.getBoundingClientRect();
    const imageRect = imageEl.getBoundingClientRect();

    const x1 =
      paletteRect.left -
      sectionRect.left +
      paletteRect.width * customer.paletteAnchor.x;
    const y1 =
      paletteRect.top -
      sectionRect.top +
      paletteRect.height * customer.paletteAnchor.y;
    const x2 =
      imageRect.left -
      sectionRect.left +
      imageRect.width * customer.shadeOnImage.x;
    const y2 =
      imageRect.top -
      sectionRect.top +
      imageRect.height * customer.shadeOnImage.y;
    setConnector({ x1, y1, x2, y2 });
  }, [focusedImageIndex, hoveredImageIndex, slide.customerImages]);

  useLayoutEffect(() => {
    updateConnector();
  }, [updateConnector, activeIndex]);

  useEffect(() => {
    if (activeHighlightIndex === null) {
      setConnector(null);
      return;
    }
    updateConnector();
    window.addEventListener("resize", updateConnector);
    window.addEventListener("scroll", updateConnector, true);
    return () => {
      window.removeEventListener("resize", updateConnector);
      window.removeEventListener("scroll", updateConnector, true);
    };
  }, [activeHighlightIndex, updateConnector]);

  const openPreview = (src: string, alt: string) => {
    setPreviewSrc(src);
    setPreviewAlt(alt);
    setIsPaused(true);
  };

  const closePreview = () => {
    setPreviewSrc(null);
    setPreviewAlt("");
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative mx-auto flex max-w-7xl flex-col-reverse px-5 py-12 md:py-18 lg:h-163.5 lg:flex-row lg:px-0 lg:py-0"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          setIsPaused(false);
          setHoveredImageIndex(null);
        }}
        aria-roledescription="carousel"
        aria-label="Exclusive palette collection"
      >
        {connector && activeHighlightIndex !== null && (
          <svg
            className="pointer-events-none absolute inset-0 z-30 hidden lg:block"
            aria-hidden
          >
            <line
              x1={connector.x1}
              y1={connector.y1}
              x2={connector.x2}
              y2={connector.y2}
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 4"
              className="drop-shadow-sm"
            />
          </svg>
        )}

        <div
          key={`palette-${activeIndex}`}
          ref={palettePanelRef}
          className="relative flex min-h-72 w-full animate-in fade-in duration-500 items-end justify-center px-5 pb-8 pt-32 sm:min-h-80 sm:px-7.5 lg:h-full lg:w-[59.47%] lg:px-7.5 lg:pb-20"
          style={{
            backgroundImage: `url(${slide.paletteBgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {activeHighlightIndex !== null &&
            slide.customerImages[activeHighlightIndex] && (
              <div
                className="pointer-events-none absolute z-20 hidden flex-col items-center lg:flex"
                style={{
                  left: `${slide.customerImages[activeHighlightIndex].paletteAnchor.x * 100}%`,
                  top: `${slide.customerImages[activeHighlightIndex].paletteAnchor.y * 100}%`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <span className="mb-1 rounded-md bg-white/95 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-black shadow-md sm:text-sm">
                  Color used
                </span>
                <svg
                  width="12"
                  height="40"
                  viewBox="0 0 12 40"
                  className="drop-shadow-sm"
                  aria-hidden
                >
                  <path d="M6 2 L2 9 H4.5 V38 H7.5 V9 H10 Z" fill="white" />
                </svg>
              </div>
            )}

          <div className="flex w-full max-w-xl flex-col gap-3 lg:max-w-none">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-roboto-mono text-2xl font-bold text-white">
                {formatSlideIndex(activeIndex, PALETTES.length)}
              </h2>
              <div
                className="flex gap-1.5"
                role="tablist"
                aria-label="Choose palette"
              >
                {PALETTES.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === activeIndex}
                    aria-label={`Show palette ${i + 1}`}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      i === activeIndex ? "bg-white" : "bg-white/40",
                    )}
                    onClick={() => {
                      setActiveIndex(i);
                      setHoveredImageIndex(null);
                      setFocusedImageIndex(null);
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="h-px w-full bg-neutral-200/80" />
            <div className="rounded-xl bg-neutral-200/80 px-5 py-4 text-base text-black">
              <p>{slide.description}</p>
            </div>
          </div>
        </div>

        <div
          key={`detail-${activeIndex}`}
          className="flex min-h-80 w-full animate-in fade-in duration-500 flex-col items-center justify-between bg-black px-5 py-6 lg:h-full lg:w-[40.53%] lg:py-9"
        >
          <h1 className="text-center text-xl font-bold text-white md:text-4xl">
            {slide.name}
          </h1>

          {slide.customerImages.length > 0 ? (
            <div className="flex w-full flex-col gap-1.5">
              {slide.customerImages.map((image, imageIndex) => {
                const isHighlighted = activeHighlightIndex === imageIndex;
                return (
                  <button
                    key={image.src}
                    type="button"
                    ref={(el) => {
                      customerImageRefs.current[imageIndex] = el;
                    }}
                    className="group relative w-full cursor-pointer overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    onMouseEnter={() => setHoveredImageIndex(imageIndex)}
                    onMouseLeave={() => setHoveredImageIndex(null)}
                    onFocus={() => setFocusedImageIndex(imageIndex)}
                    onBlur={() => setFocusedImageIndex(null)}
                    onClick={() => openPreview(image.src, image.alt)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={800}
                      height={400}
                      className="h-26.5 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <span
                      className={cn(
                        "pointer-events-none absolute inset-0 bg-black/25 transition-opacity duration-200",
                        isHighlighted ? "opacity-100" : "opacity-0",
                      )}
                    />
                    <span className="sr-only">
                      Open full preview of {image.alt}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="max-w-sm px-2 text-center text-sm leading-relaxed text-neutral-300 md:text-base">
              Customer looks for this palette are coming soon. Explore the
              shades in the hero image and shop the collection when you are
              ready.
            </p>
          )}

          <Link
            href="/products/liner-palette"
            className="mt-4 flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-2xl bg-white py-3 text-sm font-semibold text-black transition-all duration-300 hover:gap-3 hover:bg-neutral-200 md:mt-0 md:text-base"
          >
            View Product
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Dialog
        open={previewSrc !== null}
        onOpenChange={(open) => {
          if (!open) closePreview();
        }}
      >
        <DialogContent
          className="max-w-[min(100%-1.5rem,56rem)] border-0 bg-black/95 p-2 sm:p-3"
          showCloseButton
        >
          <DialogTitle className="sr-only">Customer look preview</DialogTitle>
          {previewSrc && (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-[16/10]">
              <Image
                src={previewSrc}
                alt={previewAlt}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 896px"
                priority
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Exclusive;
