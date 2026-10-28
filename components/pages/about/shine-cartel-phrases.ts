export type ShineCartelPhrase = {
  id: string;
  text: string;
  mobile: boolean;
};

export const SHINE_CARTEL_PHRASES: ShineCartelPhrase[] = [
  {
    id: "confidence",
    text: "We are not just selling beauty, we are building confidence.",
    mobile: false,
  },
  {
    id: "stand-for",
    text: "Our brand must stand for something",
    mobile: true,
  },
  {
    id: "represented",
    text: "We want customers to feel represented, not targeted.",
    mobile: true,
  },
  {
    id: "detail",
    text: "Every detail communicates our value",
    mobile: true,
  },
  {
    id: "seen-valued",
    text: "Beauty should make everyone feel seen, valued, and confident",
    mobile: false,
  },
  {
    id: "experience",
    text: "Beauty should feel like an experience, not a transaction.",
    mobile: true,
  },
  {
    id: "complexion",
    text: "Every complexion deserves to be celebrated, represented, and cared for",
    mobile: false,
  },
  {
    id: "quality",
    text: "Great beauty products should combine quality ingredients, safety, and affordability",
    mobile: false,
  },
  {
    id: "self-care",
    text: "Self-care should feel like an act of love, not another financial burden",
    mobile: false,
  },
  // {
  //   id: "products-work",
  //   text: "Everyone deserves to experience the confidence that comes from finding products that work for them",
  //   mobile: false,
  // },
  {
    id: "shine-for-all",
    text: "Creating a shine for everyone",
    mobile: true,
  },
];

export type PhraseAlign = "left" | "center" | "right";

export type PhrasePosition = {
  left?: string;
  right?: string;
  top: string;
  align: PhraseAlign;
};

/** Positions for max 1280×400 — keeps copy off edges and out of the center logo. */
export const DESKTOP_PHRASE_POSITIONS: PhrasePosition[] = [
  { left: "8%", top: "18%", align: "left" },
  { left: "50%", top: "14%", align: "center" },
  { right: "8%", top: "18%", align: "right" },
  { left: "6%", top: "38%", align: "left" },
  { left: "6%", top: "62%", align: "left" },
  { left: "10%", top: "82%", align: "left" },
  { left: "50%", top: "86%", align: "center" },
  { right: "10%", top: "82%", align: "right" },
  { right: "6%", top: "38%", align: "right" },
  { right: "6%", top: "60%", align: "right" },
  { right: "6%", top: "62%", align: "right" },
];

/** Six corners + top/bottom for narrow screens (340px tall frame). */
export const MOBILE_PHRASE_POSITIONS: PhrasePosition[] = [
  { left: "8%", top: "17%", align: "left" },
  { left: "50%", top: "14%", align: "center" },
  { right: "8%", top: "17%", align: "right" },
  { left: "8%", top: "83%", align: "left" },
  { left: "72%", top: "86%", align: "center" },
  { right: "8%", top: "83%", align: "right" },
];

export function getPhrasePosition(
  index: number,
  mobile: boolean,
): PhrasePosition {
  const slots = mobile ? MOBILE_PHRASE_POSITIONS : DESKTOP_PHRASE_POSITIONS;
  return slots[index] ?? slots[slots.length - 1];
}
