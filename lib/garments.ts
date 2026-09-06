export type Category = "Outerwear" | "Tops" | "Bottoms" | "Footwear";

export interface Garment {
  id: string;
  name: string;
  material: string;
  price: number;
  salePrice?: number;
  category: Category;
  layer: "outer" | "mid" | "bottom" | "footwear";
  // Populate with a real product photo URL to get full-quality Gemini try-on
  // results. Without one, try-on falls back to a text description of the
  // garment, which works but is noticeably lower fidelity.
  imageUrl?: string;
}

export const garments: Garment[] = [
  { id: "trench", name: "Heritage Double-Breasted Trench", material: "Water-Repellent Cotton Gabardine", price: 449, category: "Outerwear", layer: "outer" },
  { id: "puffer", name: "Alpine Down Quilted Puffer", material: "Gloss Ripstop Nylon", price: 229, salePrice: 189, category: "Outerwear", layer: "outer" },
  { id: "biker", name: "Iconic Asymmetrical Biker Jacket", material: "Full-Grain Nappa Leather", price: 690, category: "Outerwear", layer: "outer" },
  { id: "bomber", name: "MA-1 Flight Bomber Jacket", material: "Sateen Flight Nylon", price: 265, category: "Outerwear", layer: "outer" },
  { id: "trucker", name: "Trucker Denim Jacket", material: "14oz Selvedge Denim", price: 159, category: "Outerwear", layer: "outer" },
  { id: "oxford", name: "Tailored Oxford Button-Down", material: "100% Organic Oxford Cotton", price: 98, category: "Tops", layer: "mid" },
  { id: "tee", name: "Heavyweight Boxy Crewneck Tee", material: "280 GSM Combed Cotton", price: 45, category: "Tops", layer: "mid" },
  { id: "knit", name: "Ribbed Merino Knit Sweater", material: "100% Extra-Fine Merino Wool", price: 138, category: "Tops", layer: "mid" },
  { id: "hoodie", name: "Oversized Fleece Hoodie", material: "Brushed French Terry", price: 89, category: "Tops", layer: "mid" },
  { id: "turtleneck", name: "Slim Thermal Turtleneck", material: "Modal Silk Blend", price: 72, category: "Tops", layer: "mid" },
  { id: "trousers", name: "Pleated Wide-Leg Trousers", material: "Tropical Wool Twill", price: 165, category: "Bottoms", layer: "bottom" },
  { id: "jeans", name: "Slim Straight Raw Jeans", material: "Japanese Selvedge Denim", price: 145, category: "Bottoms", layer: "bottom" },
  { id: "cargo", name: "Tactical Relaxed Cargo Pants", material: "Heavy Cotton Ripstop", price: 118, category: "Bottoms", layer: "bottom" },
  { id: "chino-shorts", name: "Tailored 7-Inch Chino Shorts", material: "Stretch Cotton Chino", price: 68, category: "Bottoms", layer: "bottom" },
  { id: "chelsea", name: "Classic Leather Chelsea Boots", material: "Hand-Burnished Calfskin", price: 285, category: "Footwear", layer: "footwear" },
  { id: "sneakers", name: "Low-Top Minimalist Court Sneakers", material: "Full Grain White Leather", price: 165, category: "Footwear", layer: "footwear" },
];

export const categories: Category[] = ["Outerwear", "Tops", "Bottoms", "Footwear"];
