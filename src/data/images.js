// الصور محفوظة محلياً في public/images عشان الموقع ميعتمدش على سيرفرات بره
const U = (name) => `${import.meta.env.BASE_URL}images/${name}.jpg`;

export const P = {
  mixGrill: "mixGrill", // صينية مشويات مشكلة على الفحم
  koftaSkewers: "koftaSkewers", // أسياخ كفتة/شيش مع عيش
  tikkaSkewers: "tikkaSkewers", // أسياخ شيش على الفحم
  roastChicken: "roastChicken", // فرخة مشوية كاملة
  grilledChicken: "grilledChicken", // صدور فراخ مشوية
  crispyChicken: "crispyChicken", // فراخ مقرمشة
  ribs: "ribs", // ريش/كباب مشوي
  steak: "steak", // لحمة مشوية متقطعة
  mixPlate: "mixPlate", // أطباق مشكلة
  biryani: "biryani", // أرز بالفراخ (برياني)
  biryaniBowls: "biryaniBowls", // أطباق أرز
  friedRice: "friedRice", // طاسة أرز
  vegRice: "vegRice", // خضار مع أرز
  soup: "soup", // شوربة
  pasta: "pasta", // مكرونة
  chickenSandwich: "chickenSandwich", // ساندوتش فراخ مقرمشة
  wraps: "wraps", // ساندوتشات ملفوفة (شيش)
  baguette: "baguette", // ساندوتش فينو
  cheeseSandwich: "cheeseSandwich", // ساندوتش جبنة سايحة
  greenSalad: "greenSalad", // سلطة خضراء
  saladBowl: "saladBowl", // طبق سلطة
  saladBowl2: "saladBowl2", // سلطة + طماطم
  cucumber: "cucumber", // خيار (مخلل/سلطة)
};

// صورة مناسبة لكل صنف حسب اسمه
export function imgFor(item) {
  const n = item?.name || "";
  const has = (...ws) => ws.some((w) => n.includes(w));

  // الصواني
  if (has("صينية")) {
    if (n.includes("ميكس")) return U(P.mixPlate);
    if (has("السعادة", "الفرادي")) return U(P.roastChicken);
    if (has("التوفير", "الأصدقاء")) return U(P.mixGrill);
    return U(P.mixGrill);
  }
  // الميكسات
  if (has("ميكس", "مشكل", "مشكلة")) {
    if (has("أرز")) return U(P.biryani);
    return U(P.mixGrill);
  }
  // الحواوشي
  if (has("حواوشي")) {
    if (has("جبنة")) return U(P.cheeseSandwich);
    return U(P.koftaSkewers);
  }
  // السندوتشات
  if (has("ساندوتش", "سندوتش")) {
    if (has("شيش", "فراخ", "طاووق")) return U(P.wraps);
    if (has("كفتة")) return U(P.koftaSkewers);
    if (has("طرب", "كباب")) return U(P.ribs);
    return U(P.baguette);
  }
  // الفراخ
  if (has("فرخة", "فراخ", "شيش", "طاووق", "تكا", "شواية", "صدر", "ورك")) {
    if (has("تكا", "شيش", "طاووق")) return U(P.tikkaSkewers);
    if (has("فرخة", "شواية")) return U(P.roastChicken);
    if (has("أرز", "الخلطة", "الكبد")) return U(P.biryani);
    return U(P.grilledChicken);
  }
  // الكفتة والكباب والطرب
  if (has("كفتة")) return U(P.koftaSkewers);
  if (has("طرب")) return U(P.ribs);
  if (has("كباب")) return U(P.ribs);
  if (has("كبدة", "سجق", "ممبار", "لحم")) return U(P.steak);
  // السلطات
  if (has("طحينة")) return U(P.saladBowl2);
  if (has("خضراء")) return U(P.greenSalad);
  if (has("مخلل", "باذنجان")) {
    if (has("طماطم")) return U(P.saladBowl);
    return U(P.cucumber);
  }
  if (has("خضار مشوي", "مشوي بصل")) return U(P.tikkaSkewers);
  if (has("سلطة", "خضار")) return U(P.saladBowl);
  // الأرز والطبيخ
  if (has("أرز")) {
    if (has("الخلطة", "بسمتي")) return U(P.biryani);
    if (has("الخضار")) return U(P.vegRice);
    return U(P.friedRice);
  }
  if (has("بامية", "فاصوليا", "لوبيا", "خضار مشكل")) return U(P.vegRice);
  if (has("ملوخية", "شوربة", "لسان عصفور")) return U(P.soup);
  if (has("مكرونة", "بشاميل")) return U(P.pasta);
  return U(P.mixGrill);
}

export const IMAGES = {
  hero: U(P.mixGrill),
  kabab: U(P.ribs),
  chicken: U(P.roastChicken),
  grill: U(P.tikkaSkewers),
};

export const GALLERY = [
  { src: U(P.mixGrill), title: "صينية مشويات مشكلة" },
  { src: U(P.koftaSkewers), title: "كفتة على السيخ" },
  { src: U(P.tikkaSkewers), title: "شيش طاووق على الفحم" },
  { src: U(P.roastChicken), title: "فراخ مشوية" },
  { src: U(P.ribs), title: "كباب وطرب" },
  { src: U(P.biryani), title: "أرز بالخلطة" },
];
