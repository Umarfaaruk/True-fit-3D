export type Category = "Outerwear" | "Tops" | "Bottoms" | "Footwear";
export type Layer = "outer" | "mid" | "bottom" | "footwear";
export type CollectionId = "curated" | "modern" | "considered";

export interface ColorOption {
  name: string;
  hex: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  body: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  material: string;
  description: string;
  price: number;
  salePrice?: number;
  category: Category;
  layer: Layer;
  collection: CollectionId;
  colors: ColorOption[];
  sizes: string[];
  rating: number;
  reviews: Review[];
  badge?: string;
  /** Units on hand; drives the low-stock notice. */
  stock: number;
  /**
   * Populate with a real product photo URL to get full-quality Gemini try-on
   * results. Without one, try-on falls back to a text description of the
   * garment, which works but is noticeably lower fidelity.
   */
  imageUrl?: string;
  /** Describes the photo for screen readers. */
  imageAlt?: string;
}

/** Back-compat alias — the fitting room still speaks in "garments". */
export type Garment = Product;

const APPAREL_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const WAIST_SIZES = ["28", "30", "32", "34", "36", "38"];
const SHOE_SIZES = ["40", "41", "42", "43", "44", "45"];

const INK: ColorOption = { name: "Ink", hex: "#1F2430" };
const CAMEL: ColorOption = { name: "Camel", hex: "#B08857" };
const OLIVE: ColorOption = { name: "Olive", hex: "#5A6247" };
const BONE: ColorOption = { name: "Bone", hex: "#E4DCCB" };
const SLATE: ColorOption = { name: "Slate", hex: "#4A5464" };
const OXBLOOD: ColorOption = { name: "Oxblood", hex: "#6B2F35" };
const INDIGO: ColorOption = { name: "Indigo", hex: "#2E3B55" };
const CHARCOAL: ColorOption = { name: "Charcoal", hex: "#33363B" };

function review(id: string, author: string, rating: number, body: string, date: string): Review {
  return { id, author, rating, body, date, verified: true };
}

export const products: Product[] = [
  {
    id: "trench",
    name: "Heritage Double-Breasted Trench",
    material: "Water-Repellent Cotton Gabardine",
    description:
      "Cut from a densely woven gabardine that sheds a morning downpour and softens with every wear. Storm flap, throat latch, and a half-belt that lets you set the waist where you want it.",
    price: 449,
    category: "Outerwear",
    layer: "outer",
    collection: "curated",
    colors: [CAMEL, INK, OLIVE],
    sizes: APPAREL_SIZES,
    rating: 4.8,
    badge: "Signature",
    reviews: [
      review("r1", "Daniel O.", 5, "Third autumn in this coat and it looks better than the day it arrived. The gabardine has broken in without losing its shape.", "2026-03-14"),
      review("r2", "Priya N.", 5, "Sized up one for layering over knitwear and the drape is exactly right. The half-belt makes it work on a smaller frame.", "2026-02-02"),
      review("r3", "Marcus T.", 4, "Genuinely weatherproof. Only note is that the camel shows rain spotting until it dries.", "2026-01-19"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1619603364904-c0498317e145?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Model wearing a camel double-breasted overcoat against a neutral backdrop",
    stock: 6,
  },
  {
    id: "puffer",
    name: "Alpine Down Quilted Puffer",
    material: "Gloss Ripstop Nylon",
    description:
      "Responsibly sourced 700-fill down held in narrow baffles so it packs warmth without bulk. The gloss ripstop shell reads sharp over tailoring and shrugs off wind.",
    price: 229,
    salePrice: 189,
    category: "Outerwear",
    layer: "outer",
    collection: "modern",
    colors: [INK, OLIVE, OXBLOOD],
    sizes: APPAREL_SIZES,
    rating: 4.6,
    badge: "Sale",
    reviews: [
      review("r4", "Ines B.", 5, "Warm well past what the weight suggests. Packs into its own pocket for travel.", "2026-02-21"),
      review("r5", "Tom H.", 4, "Excellent coat. The baffles are narrow enough that it does not read sporty.", "2026-01-08"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1706765779494-2705542ebe74?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Quilted puffer jacket hanging in a store window",
    stock: 3,
  },
  {
    id: "biker",
    name: "Asymmetrical Biker Jacket",
    material: "Full-Grain Nappa Leather",
    description:
      "Full-grain nappa with an asymmetric zip and a collar that sits flat or snaps closed. Unlined at the shoulder so it moulds to you within a season.",
    price: 690,
    category: "Outerwear",
    layer: "outer",
    collection: "curated",
    colors: [INK, OXBLOOD],
    sizes: APPAREL_SIZES,
    rating: 4.9,
    reviews: [
      review("r6", "Alex R.", 5, "The leather is the real thing. Stiff for a fortnight, then it starts to feel like yours.", "2026-03-01"),
      review("r7", "Sofia L.", 5, "Weighty in the way good leather should be. Hardware feels solid, no rattle.", "2026-02-11"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Close-up of a black leather biker jacket with asymmetric zips",
    stock: 9,
  },
  {
    id: "bomber",
    name: "MA-1 Flight Bomber",
    material: "Sateen Flight Nylon",
    description:
      "The military original, cleaned up. Ribbed collar, cuffs and hem, a utility sleeve pocket, and a sateen shell with just enough sheen to dress it up.",
    price: 265,
    category: "Outerwear",
    layer: "outer",
    collection: "modern",
    colors: [OLIVE, INK, SLATE],
    sizes: APPAREL_SIZES,
    rating: 4.5,
    reviews: [
      review("r8", "Yusuf A.", 5, "Fits true and the ribbing holds its shape after a lot of wear.", "2026-01-30"),
      review("r9", "Chris D.", 4, "Good weight for spring. Sleeves run slightly long on me.", "2025-12-15"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Bomber jacket held on a hanger against a plain wall",
    stock: 24,
  },
  {
    id: "trucker",
    name: "Trucker Denim Jacket",
    material: "14oz Selvedge Denim",
    description:
      "Rigid 14oz selvedge that starts stiff and ends up a personal record of how you wear it. Copper hardware, chest flaps, adjustable waist tabs.",
    price: 159,
    category: "Outerwear",
    layer: "outer",
    collection: "considered",
    colors: [INDIGO, BONE],
    sizes: APPAREL_SIZES,
    rating: 4.7,
    reviews: [
      review("r10", "Nadia F.", 5, "Raw denim done properly. Six months in and the fades are beautiful.", "2026-02-27"),
      review("r11", "Ben W.", 4, "Stiff at first, as it should be. Worth the break-in.", "2026-01-05"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Blue denim trucker jacket photographed flat",
    stock: 15,
  },
  {
    id: "oxford",
    name: "Tailored Oxford Button-Down",
    material: "100% Organic Oxford Cotton",
    description:
      "A properly rolled button-down collar on organic oxford cloth, cut close through the body without pulling at the placket. Single-needle side seams throughout.",
    price: 98,
    category: "Tops",
    layer: "mid",
    collection: "curated",
    colors: [BONE, INDIGO, SLATE],
    sizes: APPAREL_SIZES,
    rating: 4.7,
    reviews: [
      review("r12", "Grace M.", 5, "The collar roll is the detail everyone else gets wrong. This one is right.", "2026-03-09"),
      review("r13", "Owen K.", 4, "Softens nicely after a few washes. Fits trim but not restrictive.", "2026-02-14"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1602810316693-3667c854239a?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Blue oxford button-down shirt laid on a white table",
    stock: 41,
  },
  {
    id: "tee",
    name: "Heavyweight Boxy Crewneck Tee",
    material: "280 GSM Combed Cotton",
    description:
      "280gsm combed cotton with a boxy body and a ribbed neck that stays flat. Heavy enough to hang properly, breathable enough to wear all summer.",
    price: 45,
    category: "Tops",
    layer: "mid",
    collection: "considered",
    colors: [BONE, INK, OLIVE, CHARCOAL],
    sizes: APPAREL_SIZES,
    rating: 4.6,
    reviews: [
      review("r14", "Leo S.", 5, "Finally a tee that does not go translucent after a month.", "2026-03-20"),
      review("r15", "Hana P.", 4, "Boxy in a deliberate way. Order your usual size.", "2026-02-06"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Plain white crew-neck t-shirt on a light background",
    stock: 68,
  },
  {
    id: "knit",
    name: "Ribbed Merino Knit Sweater",
    material: "100% Extra-Fine Merino Wool",
    description:
      "Extra-fine merino in a close rib that holds its shape at the cuff and hem. Warm without weight, and it wears clean under a coat.",
    price: 138,
    category: "Tops",
    layer: "mid",
    collection: "curated",
    colors: [CHARCOAL, CAMEL, OXBLOOD],
    sizes: APPAREL_SIZES,
    rating: 4.8,
    reviews: [
      review("r16", "Ravi C.", 5, "No itch at all, and it layers under a trench without bunching.", "2026-01-24"),
      review("r17", "Elin J.", 5, "The rib keeps its shape. Machine washed cold with no issues.", "2026-03-03"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1611312449297-a69dc9c3987b?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Charcoal knit sweater on a white clothes hanger",
    stock: 11,
  },
  {
    id: "hoodie",
    name: "Oversized Fleece Hoodie",
    material: "Brushed French Terry",
    description:
      "Brushed French terry with a dropped shoulder and a double-layer hood that actually stands up. Pre-shrunk, so what you try on is what you keep.",
    price: 89,
    category: "Tops",
    layer: "mid",
    collection: "modern",
    colors: [CHARCOAL, BONE, OLIVE],
    sizes: APPAREL_SIZES,
    rating: 4.5,
    reviews: [
      review("r18", "Maya T.", 5, "Soft, heavy, sits right. The hood does not collapse.", "2026-02-18"),
      review("r19", "Jonas E.", 4, "Genuinely oversized. Size down if you want a regular fit.", "2026-01-11"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Fleece hoodie styled flat beside a pair of jeans",
    stock: 33,
  },
  {
    id: "turtleneck",
    name: "Slim Thermal Turtleneck",
    material: "Modal Silk Blend",
    description:
      "A modal-silk blend with quiet stretch and a neck that holds without choking. Thin enough for a jacket, warm enough to go without one.",
    price: 72,
    category: "Tops",
    layer: "mid",
    collection: "modern",
    colors: [INK, BONE, OXBLOOD],
    sizes: APPAREL_SIZES,
    rating: 4.4,
    reviews: [
      review("r20", "Clara V.", 4, "Lovely hand-feel and the neck stays up all day.", "2026-02-09"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Studio portrait of a model in a black turtleneck",
    stock: 7,
  },
  {
    id: "trousers",
    name: "Pleated Wide-Leg Trousers",
    material: "Tropical Wool Twill",
    description:
      "A single forward pleat and a wide, clean leg in tropical wool that breathes through summer. Finished with a curtained waistband and hook closure.",
    price: 165,
    category: "Bottoms",
    layer: "bottom",
    collection: "curated",
    colors: [CHARCOAL, BONE, OLIVE],
    sizes: WAIST_SIZES,
    rating: 4.7,
    reviews: [
      review("r21", "Idris M.", 5, "The drape is superb and the wool is cool in real heat.", "2026-03-12"),
      review("r22", "Anya D.", 4, "Beautiful trouser. Needed a small hem adjustment.", "2026-02-24"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1694447814836-c93ab70f7398?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Tailored dark trousers with a belt on a mannequin",
    stock: 19,
  },
  {
    id: "jeans",
    name: "Slim Straight Raw Jeans",
    material: "Japanese Selvedge Denim",
    description:
      "Japanese selvedge with a slim straight leg that skims rather than clings. Raw and unwashed, so the first month is yours to set.",
    price: 145,
    category: "Bottoms",
    layer: "bottom",
    collection: "considered",
    colors: [INDIGO, INK],
    sizes: WAIST_SIZES,
    rating: 4.8,
    reviews: [
      review("r23", "Felix N.", 5, "Fades are coming in exactly where they should. Superb denim.", "2026-03-05"),
      review("r24", "Sara B.", 5, "True to size at the waist. Stretches about an inch after a week.", "2026-01-28"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1714143136372-ddaf8b606da7?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Pair of blue selvedge jeans on a white background",
    stock: 28,
  },
  {
    id: "cargo",
    name: "Relaxed Cargo Pants",
    material: "Heavy Cotton Ripstop",
    description:
      "Ripstop cotton with bellowed thigh pockets that lie flat when empty. Relaxed through the thigh, tapered from the knee so it never reads baggy.",
    price: 118,
    category: "Bottoms",
    layer: "bottom",
    collection: "modern",
    colors: [OLIVE, CHARCOAL, BONE],
    sizes: WAIST_SIZES,
    rating: 4.4,
    reviews: [
      review("r25", "Kofi A.", 4, "Pockets are useful without being bulky. Fabric is tough.", "2026-02-16"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Dark cargo trousers showing the bellowed thigh pockets",
    stock: 4,
  },
  {
    id: "chino-shorts",
    name: "Tailored 7-Inch Chino Shorts",
    material: "Stretch Cotton Chino",
    description:
      "A 7-inch inseam that lands just above the knee, in a stretch chino that keeps its press. Slant pockets, clean side seams, no bunching when seated.",
    price: 68,
    category: "Bottoms",
    layer: "bottom",
    collection: "considered",
    colors: [BONE, OLIVE, INK],
    sizes: WAIST_SIZES,
    rating: 4.3,
    reviews: [
      review("r26", "Peter L.", 4, "Good length and the stretch makes them wearable all day.", "2026-03-18"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1629185752193-0d25bb978c04?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Model wearing beige chino shorts outdoors",
    stock: 52,
  },
  {
    id: "chelsea",
    name: "Leather Chelsea Boots",
    material: "Hand-Burnished Calfskin",
    description:
      "Hand-burnished calfskin on a Goodyear-welted sole that can be resoled rather than replaced. Elastic gussets broken in by the second wear.",
    price: 285,
    category: "Footwear",
    layer: "footwear",
    collection: "curated",
    colors: [INK, CAMEL, OXBLOOD],
    sizes: SHOE_SIZES,
    rating: 4.9,
    badge: "Resolable",
    reviews: [
      review("r27", "Hugo F.", 5, "Welted properly, which is rare at this price. Should last a decade.", "2026-02-28"),
      review("r28", "Amara O.", 5, "The burnishing is done by hand and it shows. No two are identical.", "2026-01-16"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1534233812932-59b8fa1b780c?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Pair of black leather Chelsea boots on a wooden surface",
    stock: 8,
  },
  {
    id: "sneakers",
    name: "Minimalist Court Sneakers",
    material: "Full Grain White Leather",
    description:
      "Full-grain leather on a low court profile with almost no branding. Cupsole construction and a lining that survives being worn without socks.",
    price: 165,
    category: "Footwear",
    layer: "footwear",
    collection: "modern",
    colors: [BONE, INK],
    sizes: SHOE_SIZES,
    rating: 4.6,
    reviews: [
      review("r29", "Nils G.", 5, "Clean lines and the leather creases well rather than cracking.", "2026-03-07"),
      review("r30", "Tara S.", 4, "Comfortable straight out of the box. Runs a half size large.", "2026-02-04"),
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1544441892-794166f1e3be?auto=format&fit=crop&w=900&q=80",
    imageAlt: "Pair of white low-top leather sneakers",
    stock: 37,
  },
];

export const categories: Category[] = ["Outerwear", "Tops", "Bottoms", "Footwear"];

export const collections: { id: CollectionId; numeral: string; name: string; blurb: string }[] = [
  {
    id: "curated",
    numeral: "01",
    name: "The Cornerstones",
    blurb: "The pieces a wardrobe is built around — bought once, worn for years, never quite out of rotation.",
  },
  {
    id: "modern",
    numeral: "02",
    name: "Everyday Modern",
    blurb: "Contemporary cuts for the days that move. Clean silhouettes that hold their shape from morning to last train.",
  },
  {
    id: "considered",
    numeral: "03",
    name: "Made to Age",
    blurb: "Raw denim, selvedge, full grain. Materials chosen because they improve with wear rather than merely survive it.",
  },
];

export function getProduct(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function activePrice(p: Product): number {
  return p.salePrice ?? p.price;
}

export function relatedProducts(p: Product, limit = 4): Product[] {
  const sameCategory = products.filter((x) => x.id !== p.id && x.category === p.category);
  const rest = products.filter((x) => x.id !== p.id && x.category !== p.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

/** Back-compat export — the fitting room imports `garments`. */
export const garments = products;

/** Below this, the product page nudges the shopper. */
export const LOW_STOCK_THRESHOLD = 12;

export function isLowStock(p: Product): boolean {
  return p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
}
