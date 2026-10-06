// كل الصور من Unsplash ومتأكد منها بالنظر إنها مناسبة للصنف
const U = (id) => `https://images.unsplash.com/${id}?q=80&w=800&auto=format&fit=crop`;

export const P = {
  mixGrill: "photo-1555939594-58d7cb561ad1", // صينية مشويات مشكلة على الفحم
  koftaSkewers: "photo-1603360946369-dc9bb6258143", // أسياخ كفتة/شيش مع عيش
  tikkaSkewers: "photo-1599487488170-d11ec9c172f0", // أسياخ شيش على الفحم
  roastChicken: "photo-1598103442097-8b74394b95c6", // فرخة مشوية كاملة
  grilledChicken: "photo-1532550907401-a500c9a57435", // صدور فراخ مشوية
  crispyChicken: "photo-1562967914-608f82629710", // فراخ مقرمشة
  ribs: "photo-1544025162-d76694265947", // ريش/كباب مشوي
  steak: "photo-1558030006-450675393462", // لحمة مشوية متقطعة
  mixPlate: "photo-1504674900247-0877df9cc836", // أطباق مشكلة
  biryani: "photo-1631515243349-e0cb75fb8d3a", // أرز بالفراخ (برياني)
  biryaniBowls: "photo-1563379091339-03b21ab4a4f8", // أطباق أرز
  friedRice: "photo-1512058564366-18510be2db19", // طاسة أرز
  vegRice: "photo-1547592180-85f173990554", // خضار مع أرز
  soup: "photo-1547592166-23ac45744acd", // شوربة
  pasta: "photo-1621996346565-e3dbc646d9a9", // مكرونة
  chickenSandwich: "photo-1606755962773-d324e0a13086", // ساندوتش فراخ مقرمشة
  wraps: "photo-1626700051175-6818013e1d4f", // ساندوتشات ملفوفة (شيش)
  baguette: "photo-1550507992-eb63ffee0847", // ساندوتش فينو
  cheeseSandwich: "photo-1565299507177-b0ac66763828", // ساندوتش جبنة سايحة
  greenSalad: "photo-1540189549336-e6e99c3679fe", // سلطة خضراء
  saladBowl: "photo-1512621776951-a57141f2eefd", // طبق سلطة
  saladBowl2: "photo-1546069901-ba9599a7e63c", // سلطة + طماطم
  cucumber: "photo-1589621316382-008455b857cd", // خيار (مخلل/سلطة)
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
