const IMG =
  "https://studio-assets.cartfulsolutions.com/019c7d1e-ef6f-7ff6-b001-7b25b5f23ef0/assets/019c7d1f-4556-7ff6-b001-8e6f5a538934/images/";

export type UndertoneId = "warm" | "neutral" | "cool";

export type ShadeFamilyId =
  | "fair"
  | "light"
  | "light-medium"
  | "medium"
  | "medium-deep"
  | "deep";

export interface Shade {
  number: number;
  warm: string;
  neutral: string;
  cool: string;
  warmImage: string | null;
  neutralImage: string | null;
  coolImage: string | null;
}

export interface ShadeFamily {
  id: ShadeFamilyId;
  name: string;
  range: string;
  color: string;
  description: string;
  collageImage: string;
  shades: Shade[];
}

export interface Undertone {
  id: UndertoneId;
  name: string;
  description: string;
  color: string;
  icon: string;
}

export interface FilteredShade {
  number: number;
  color: string;
  undertone: UndertoneId;
  family: string;
  image: string;
}

const undertoneImageKeys: Record<
  UndertoneId,
  keyof Pick<Shade, "warmImage" | "neutralImage" | "coolImage">
> = {
  warm: "warmImage",
  neutral: "neutralImage",
  cool: "coolImage",
};

export const shadeFamilies = [
  {
    id: "fair",
    name: "Fair",
    range: "Shades 1 – 6",
    color: "#FFE7D8",
    description: "Very light skin tones with minimal melanin",
    collageImage: IMG + "cScFB3nWt5HXcRR31x4DA.jpg",
    shades: [
      {
        number: 1,
        warm: "#F5DEB3",
        neutral: "#FAE6D3",
        cool: "#F0D5D5",
        warmImage: null,
        neutralImage: IMG + "TvxJ4iDvutRsFvHMjgkHI.jpg",
        coolImage: null,
      },
      {
        number: 2,
        warm: "#F0D5A0",
        neutral: "#F5DCC5",
        cool: "#EBC8C8",
        warmImage: IMG + "6XrjTcV3QFy6CqIb3o6Bq.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 3,
        warm: "#ECCC90",
        neutral: "#F0D2B5",
        cool: "#E5BCBC",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "4RUZ7AxvhEmvQRRDgKe_2.jpg",
      },
      {
        number: 4,
        warm: "#E8C380",
        neutral: "#EBC8A8",
        cool: "#DFB0B0",
        warmImage: null,
        neutralImage: IMG + "N8a8I5DsI0qJuVcz_kJEl.jpg",
        coolImage: null,
      },
      {
        number: 5,
        warm: "#E3BA70",
        neutral: "#E6BF9A",
        cool: "#D9A4A4",
        warmImage: IMG + "4IChDa6dfNU79ayfUW1ua.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 6,
        warm: "#DEB060",
        neutral: "#E1B58D",
        cool: "#D39898",
        warmImage: null,
        neutralImage: IMG + "XO6Z0Jx1CEJNYILcyfZu_.jpg",
        coolImage: null,
      },
    ],
  },
  {
    id: "light",
    name: "Light",
    range: "Shades 7 – 13",
    color: "#FFD4B5",
    description: "Light skin tones with subtle warmth",
    collageImage: IMG + "7qdmxERkPt3mtaK4e0bX9.png",
    shades: [
      {
        number: 7,
        warm: "#D4A76A",
        neutral: "#D9AB80",
        cool: "#CC9090",
        warmImage: IMG + "1qqCC2AMbe9ppWJ70-_sS.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 8,
        warm: "#CF9E5C",
        neutral: "#D4A273",
        cool: "#C68585",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "NOQOWEUNkJL5xML8z0YGr.jpg",
      },
      {
        number: 9,
        warm: "#CA954E",
        neutral: "#CF9866",
        cool: "#C07A7A",
        warmImage: null,
        neutralImage: IMG + "AMcJYzk88hXXQt5b_-XvI.jpg",
        coolImage: null,
      },
      {
        number: 10,
        warm: "#C58C40",
        neutral: "#CA8F59",
        cool: "#BA6F6F",
        warmImage: IMG + "1IjabbyhhXX0ywP7I2uDN.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 11,
        warm: "#C08332",
        neutral: "#C5854C",
        cool: "#B46464",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "3shQ94RcHTMxxX3TkPaTR.jpg",
      },
      {
        number: 12,
        warm: "#BB7A24",
        neutral: "#C07C3F",
        cool: "#AE5959",
        warmImage: IMG + "7FcBZFvukLAom7fkoR465.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 13,
        warm: "#B67116",
        neutral: "#BB7232",
        cool: "#A84E4E",
        warmImage: null,
        neutralImage: IMG + "tvgJ-qQcro6T876ggzIIn.jpg",
        coolImage: null,
      },
    ],
  },
  {
    id: "light-medium",
    name: "Light-Medium",
    range: "Shades 14 – 21",
    color: "#E8A472",
    description: "Transitional tones between light and medium",
    collageImage: IMG + "oRc9n9GKnx8stS32IBWyg.png",
    shades: [
      {
        number: 14,
        warm: "#B06A10",
        neutral: "#B56C28",
        cool: "#A24545",
        warmImage: IMG + "8wt2s4emx_-uobQ9rMuK1.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 15,
        warm: "#A86308",
        neutral: "#AD6520",
        cool: "#9C3C3C",
        warmImage: null,
        neutralImage: IMG + "ehIVONG2XyUnQeXA3OzZH.jpg",
        coolImage: null,
      },
      {
        number: 16,
        warm: "#A05C00",
        neutral: "#A55E18",
        cool: "#963333",
        warmImage: null,
        neutralImage: IMG + "0TmlF4iZoWB7iAgCnTDOJ.jpg",
        coolImage: null,
      },
      {
        number: 17,
        warm: "#985500",
        neutral: "#9D5710",
        cool: "#902A2A",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "d45M-xz03_ANR0nJemtqE.jpg",
      },
      {
        number: 18,
        warm: "#904E00",
        neutral: "#955008",
        cool: "#8A2121",
        warmImage: null,
        neutralImage: IMG + "E7Z9BJqHJXo38AFqJIEDd.jpg",
        coolImage: null,
      },
      {
        number: 19,
        warm: "#884700",
        neutral: "#8D4900",
        cool: "#841818",
        warmImage: IMG + "UrzXTZbWEd9kFbgdutPiT.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 20,
        warm: "#804000",
        neutral: "#854200",
        cool: "#7E0F0F",
        warmImage: null,
        neutralImage: IMG + "oMOT8UrWCyJ4iU6OA36UU.jpg",
        coolImage: null,
      },
      {
        number: 21,
        warm: "#783900",
        neutral: "#7D3B00",
        cool: "#780606",
        warmImage: IMG + "6YpHoW8j-epNuOAFA41xH.jpg",
        neutralImage: null,
        coolImage: null,
      },
    ],
  },
  {
    id: "medium",
    name: "Medium",
    range: "Shades 22 – 30",
    color: "#DA8249",
    description: "Medium skin tones with rich undertones",
    collageImage: IMG + "L574YNJSMd3pBjf0f4px0.jpg",
    shades: [
      {
        number: 22,
        warm: "#8B6914",
        neutral: "#7A5A20",
        cool: "#6B4030",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "_tYtkRUT5YN45hX4JpuN3.jpg",
      },
      {
        number: 23,
        warm: "#836215",
        neutral: "#72531E",
        cool: "#643A2C",
        warmImage: null,
        neutralImage: IMG + "-Mnk5A9QnukQQFMsyUw7v.jpg",
        coolImage: null,
      },
      {
        number: 24,
        warm: "#7B5B16",
        neutral: "#6A4C1C",
        cool: "#5D3428",
        warmImage: IMG + "WaD9gXWcwrtn-VZHcxu2k.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 25,
        warm: "#735417",
        neutral: "#624518",
        cool: "#562E24",
        warmImage: null,
        neutralImage: IMG + "-JUguXydT0pjNvaLYoQ8e.jpg",
        coolImage: null,
      },
      {
        number: 26,
        warm: "#6B4D18",
        neutral: "#5A3E16",
        cool: "#4F2820",
        warmImage: IMG + "rNnmViUMIbEMkQAz9VrGJ.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 27,
        warm: "#634619",
        neutral: "#523714",
        cool: "#48221C",
        warmImage: IMG + "6zAjd4I5FaH2A823jq8_s.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 28,
        warm: "#5B3F1A",
        neutral: "#4A3012",
        cool: "#411C18",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "v6UBi0E16QUqlZ8easvSK.jpg",
      },
      {
        number: 29,
        warm: "#53381B",
        neutral: "#422910",
        cool: "#3A1614",
        warmImage: null,
        neutralImage: IMG + "7OooJWP2QzlvJJx0-MhpX.jpg",
        coolImage: null,
      },
      {
        number: 30,
        warm: "#4B311C",
        neutral: "#3A220E",
        cool: "#331010",
        warmImage: IMG + "Yx_4WktmOkxzGZgkw9y1o.jpg",
        neutralImage: null,
        coolImage: null,
      },
    ],
  },
  {
    id: "medium-deep",
    name: "Medium-Deep",
    range: "Shades 31 – 39",
    color: "#B65524",
    description: "Rich medium-deep skin tones",
    collageImage: IMG + "lxf9cV38vWR6Ug3_iqJpe.jpg",
    shades: [
      {
        number: 31,
        warm: "#6B4422",
        neutral: "#5A3518",
        cool: "#4A2520",
        warmImage: null,
        neutralImage: IMG + "7X_EnbsNjiIEM_tWgkVuc.jpg",
        coolImage: null,
      },
      {
        number: 32,
        warm: "#633D20",
        neutral: "#522E16",
        cool: "#431F1C",
        warmImage: null,
        neutralImage: IMG + "5VyZHrLmHR6Dsq8RDVmoZ.jpg",
        coolImage: null,
      },
      {
        number: 33,
        warm: "#5B361E",
        neutral: "#4A271A",
        cool: "#3C1918",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "JVxV-Ug6INENhH2d3bjIr.jpg",
      },
      {
        number: 34,
        warm: "#532F1C",
        neutral: "#422018",
        cool: "#351314",
        warmImage: IMG + "joY4JxbLtQ-HzXa5LguXY.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 35,
        warm: "#4B281A",
        neutral: "#3A1916",
        cool: "#2E0D10",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "0OGcbDBmdA91Xzhx1Jy11.jpg",
      },
      {
        number: 36,
        warm: "#432118",
        neutral: "#321214",
        cool: "#27070C",
        warmImage: IMG + "NvqdKsomzCBh6uUBzU6NW.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 37,
        warm: "#3B1A16",
        neutral: "#2A0B12",
        cool: "#200108",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "4TSZ6PRo6efJ3cbIyu3f_.jpg",
      },
      {
        number: 38,
        warm: "#331314",
        neutral: "#220410",
        cool: "#190004",
        warmImage: null,
        neutralImage: IMG + "o3ndWlea8KXQnYn4Z7nXq.jpg",
        coolImage: null,
      },
      {
        number: 39,
        warm: "#2B0C12",
        neutral: "#1A000E",
        cool: "#120000",
        warmImage: IMG + "TfOqpA_s9Dt31PcFwbXJq.jpg",
        neutralImage: null,
        coolImage: null,
      },
    ],
  },
  {
    id: "deep",
    name: "Deep",
    range: "Shades 40 – 48",
    color: "#732A18",
    description: "Deep, rich skin tones with beautiful depth",
    collageImage: IMG + "J1r88vkYhsK4mMMa_YBDk.jpg",
    shades: [
      {
        number: 40,
        warm: "#4A2E18",
        neutral: "#3A2010",
        cool: "#2A1515",
        warmImage: null,
        neutralImage: IMG + "3OfguUfoXS16VzJXrSTa1.jpg",
        coolImage: null,
      },
      {
        number: 41,
        warm: "#432814",
        neutral: "#331A0C",
        cool: "#231010",
        warmImage: IMG + "Zj9lG9n4VUmInDAGJDPI4.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 42,
        warm: "#3C2210",
        neutral: "#2C1408",
        cool: "#1C0B0B",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "K1oYh6K6AT-jGsNbsltRh.jpg",
      },
      {
        number: 43,
        warm: "#351C0C",
        neutral: "#250E04",
        cool: "#150606",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "-fTtgTT3UftGL6qBYHpYH.jpg",
      },
      {
        number: 44,
        warm: "#2E1608",
        neutral: "#1E0800",
        cool: "#0E0101",
        warmImage: IMG + "LGBuxbH5B7HjfN04TpmqS.jpg",
        neutralImage: null,
        coolImage: null,
      },
      {
        number: 45,
        warm: "#271004",
        neutral: "#170200",
        cool: "#070000",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "n88EzeLLec2pRkb1JhLho.jpg",
      },
      {
        number: 46,
        warm: "#200A00",
        neutral: "#100000",
        cool: "#050000",
        warmImage: null,
        neutralImage: IMG + "P27z3YOAY9_w7UMHC5x-Z.jpg",
        coolImage: null,
      },
      {
        number: 47,
        warm: "#190400",
        neutral: "#090000",
        cool: "#030000",
        warmImage: null,
        neutralImage: IMG + "nqdlMfu1mFKCpRuU8GzI8.jpg",
        coolImage: null,
      },
      {
        number: 48,
        warm: "#120000",
        neutral: "#020000",
        cool: "#010000",
        warmImage: null,
        neutralImage: null,
        coolImage: IMG + "-Y-nOdaqOzxHlF5fS12Py.jpg",
      },
    ],
  },
] satisfies ShadeFamily[];

export const undertones = [
  {
    id: "warm",
    name: "Warm",
    description: "My veins appear green. Yellow gold jewelry looks best on me.",
    color: "linear-gradient(135deg, rgb(231, 172, 112), rgb(155, 77, 48))",
    icon: "☀️",
  },
  {
    id: "neutral",
    name: "Neutral",
    description:
      "My veins appear blue-green. All shades of jewelry look good on me.",
    color: "linear-gradient(135deg, rgb(229, 197, 165), rgb(182, 123, 97))",
    icon: "⚖️",
  },
  {
    id: "cool",
    name: "Cool",
    description:
      "My veins appear blue or purple. Silver & platinum jewelry look best on me.",
    color: "linear-gradient(135deg, rgb(212, 180, 179), rgb(156, 120, 134))",
    icon: "❄️",
  },
] satisfies Undertone[];

export function getFilteredShades(
  familyId: ShadeFamilyId,
  undertoneId: UndertoneId | null,
): FilteredShade[] {
  const family = shadeFamilies.find((f) => f.id === familyId);
  if (!family || !undertoneId) return [];

  const imageKey = undertoneImageKeys[undertoneId];

  return family.shades.flatMap((shade) => {
    const image = shade[imageKey];
    if (!image) return [];

    return [
      {
        number: shade.number,
        color: shade[undertoneId],
        undertone: undertoneId,
        family: family.name,
        image,
      },
    ];
  });
}
