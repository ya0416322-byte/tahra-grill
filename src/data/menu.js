export const PHONES = {
  mobile1: "01150019095",
  mobile2: "01009621414",
  landline: "26322131",
  whatsapp: "201009621414",
  address: "17 شارع ابراهيم عبد الرازق - بجوار مسجد فاطمة الزهراء - عين شمس",
};

export const CATEGORIES = [
  { id: "all", name: "الكل", icon: "🔥" },
  { id: "wajbat", name: "ركن الوجبات", icon: "🍗" },
  { id: "sawany", name: "ركن الصواني", icon: "🥘" },
  { id: "mashwyat", name: "ركن المشويات", icon: "🥩" },
  { id: "sandwich", name: "السندوتشات", icon: "🥖" },
  { id: "salatat", name: "السلطات", icon: "🥗" },
  { id: "talabat", name: "الأرز والطلبات", icon: "🍚" },
];

export const MENU = [
  // ===== الوجبات =====
  { id: "w1", cat: "wajbat", name: "ربع فراخ صدر + سلطة + عيش", price: 90, desc: "ربع صدر مشوي على الفحم مع سلطة وعيش", tag: "الأكثر مبيعاً" },
  { id: "w2", cat: "wajbat", name: "ربع فراخ ورك + سلطة + عيش", price: 80, desc: "ربع ورك متبل بخلطة الطاهرة" },
  { id: "w3", cat: "wajbat", name: "ربع كفتة كندوز + سلطة + عيش", price: 90, desc: "كفتة كندوز صافي على السيخ" },
  { id: "w4", cat: "wajbat", name: "ربع كفتة ضاني + سلطة + عيش", price: 110, desc: "كفتة ضاني بخلطة الحاتي الأصلية", tag: "مميز" },
  { id: "w5", cat: "wajbat", name: "ربع شيش طاووق + سلطة + عيش", price: 90, desc: "مكعبات صدور متبلة 12 ساعة" },
  { id: "w6", cat: "wajbat", name: "ربع فراخ صدر + أرز بالكبد والقوانص", price: 115, desc: "مع أرز بالخلطة الغني" },
  { id: "w7", cat: "wajbat", name: "ربع فراخ ورك + أرز بالكبد والقوانص", price: 105, desc: "وجبة مشبعة بسعر توفير" },
  { id: "w8", cat: "wajbat", name: "ربع فراخ صدر + ⅛ كفتة + أرز", price: 145, desc: "ميكس فراخ وكفتة مع أرز" },
  { id: "w9", cat: "wajbat", name: "ربع فراخ ورك + ⅛ كفتة + أرز", price: 135, desc: "ميكس اقتصادي مشبع" },
  { id: "w10", cat: "wajbat", name: "ربع فراخ صدر + أرز + سلطة + عيش", price: 100, desc: "وجبة كاملة" },
  { id: "w11", cat: "wajbat", name: "ربع فراخ ورك + أرز + سلطة + عيش", price: 90, desc: "وجبة كاملة بسعر حنين" },
  { id: "w12", cat: "wajbat", name: "ربع شيش طاووق + عيش + سلطة + أرز", price: 100, desc: "شيش مع أرز وسلطات" },
  { id: "w13", cat: "wajbat", name: "ربع طرب + عيش + سلطة + أرز", price: 130, desc: "طرب ضاني ملفوف بمنديل", tag: "فاخر" },
  { id: "w14", cat: "wajbat", name: "⅛ كباب + عيش + سلطة + أرز", price: 110, desc: "كباب ضاني طري" },
  { id: "w15", cat: "wajbat", name: "⅛ طرب + عيش + سلطة + أرز", price: 80, desc: "على قد الإيد" },
  { id: "w16", cat: "wajbat", name: "⅛ كفتة + عيش + سلطة + أرز", price: 60, desc: "وجبة اقتصادية" },
  { id: "w17", cat: "wajbat", name: "⅛ شيش طاووق + عيش + سلطة + أرز", price: 60, desc: "وجبة اقتصادية" },
  { id: "w18", cat: "wajbat", name: "ميكس كباب + شيش + طرب + كفتة", price: 270, desc: "تشكيلة الأكيلة - 4 أصناف", tag: "الأكثر مبيعاً" },
  { id: "w19", cat: "wajbat", name: "ميكس كفتة + طرب", price: 115, desc: "ثنائية الطرب والكفتة" },
  { id: "w20", cat: "wajbat", name: "ميكس كباب + شيش", price: 150, desc: "كباب وشيش طاووق" },
  { id: "w21", cat: "wajbat", name: "ميكس شيش + كفتة + كباب", price: 195, desc: "الثلاثي الذهبي" },
  { id: "w22", cat: "wajbat", name: "ميكس شيش + كفتة + طرب", price: 165, desc: "تشكيلة مشويات مميزة" },
  { id: "w23", cat: "wajbat", name: "ميكس شيش + طرب", price: 115, desc: "شيش وطرب" },
  { id: "w24", cat: "wajbat", name: "ميكس كفتة + شيش", price: 95, desc: "سعر التوفير" },
  { id: "w25", cat: "wajbat", name: "ميكس ربع كفتة + ربع طرب", price: 210, desc: "نص كيلو مشويات مشكلة" },
  { id: "w26", cat: "wajbat", name: "وجبة ميكس كفتة + طرب + أرز", price: 125, desc: "مع أرز وسلطات" },
  { id: "w27", cat: "wajbat", name: "وجبة ميكس كفتة + شيش", price: 105, desc: "وجبة ميكس بالأرز" },
  { id: "w28", cat: "wajbat", name: "وجبة شيش + طرب", price: 130, desc: "وجبة بالأرز والسلطات" },

  // ===== الصواني =====
  { id: "s1", cat: "sawany", name: "صينية الفرادي الصغير", price: 350, desc: "فرخة + ½ كفتة + طرب + أرز + سلطات + عيش - تكفي 2", tag: "تكفي 2" },
  { id: "s2", cat: "sawany", name: "صينية الأصدقاء", price: 450, desc: "فرخة + ½ كفتة + ½ شيش + أرز + سلطات - تكفي 3", tag: "تكفي 3" },
  { id: "s3", cat: "sawany", name: "صينية الميكس", price: 450, desc: "½ فرخة + ½ شيش + ½ كفتة + ½ طرب + أرز", tag: "تشكيلة" },
  { id: "s4", cat: "sawany", name: "صينية التوفير", price: 550, desc: "فرخة + ½ كفتة + ½ طرب + ½ شيش + أرز كبير", tag: "موفرة" },
  { id: "s5", cat: "sawany", name: "صينية السعادة", price: 800, desc: "2 فرخة + 1 كفتة + ½ طرب + أرز + سلطات - تكفي 5", tag: "تكفي 5" },
  { id: "s6", cat: "sawany", name: "صينية العيلة", price: 1400, desc: "2 فرخة + 1 كفتة + 1 شيش + ½ طرب - تكفي 7-8", tag: "للعزومات" },
  { id: "s7", cat: "sawany", name: "صينية الانسجام", price: 1450, desc: "2 فرخة + 1 شيش + 1 طرب + أرز - تكفي 8", tag: "للعزومات" },
  { id: "s8", cat: "sawany", name: "صينية الفرادي الكبير", price: 2400, desc: "الوحش الكبير للمناسبات والعزومات الكبيرة", tag: "مناسبات" },

  // ===== السندوتشات =====
  { id: "sw1", cat: "sandwich", name: "ساندوتش كفتة", price: 30, prices: "25 / 30 / 40", desc: "صغير / وسط / كبير" },
  { id: "sw2", cat: "sandwich", name: "ساندوتش كفتة ضاني", price: 50, prices: "40 / 50 / 60", desc: "بخلطة الحاتي", tag: "مميز" },
  { id: "sw3", cat: "sandwich", name: "ساندوتش شيش طاووق", price: 50, prices: "45 / 50 / 60", desc: "مع تومية ومخلل" },
  { id: "sw4", cat: "sandwich", name: "ساندوتش طرب", price: 70, prices: "60 / 80", desc: "طرب ضاني على الفحم" },
  { id: "sw5", cat: "sandwich", name: "ساندوتش كباب", price: 80, prices: "60 / 80 / 100", desc: "قطع كباب مشوية" },
  { id: "sw6", cat: "sandwich", name: "ساندوتش كباب ضاني", price: 30, prices: "15 / 30 / 40", desc: "صغير / وسط / كبير" },
  { id: "sw7", cat: "sandwich", name: "حواوشي سادة", price: 30, prices: "15 / 30 / 40", desc: "عجينة طازة ولحمة متبلة" },
  { id: "sw8", cat: "sandwich", name: "حواوشي ضاني", price: 55, prices: "50 / 55 / 60", desc: "بلية ضاني أصلية", tag: "الأكثر مبيعاً" },
  { id: "sw9", cat: "sandwich", name: "حواوشي إضافة جبنة", price: 50, prices: "40 / 50 / 60", desc: "جبنة سايحة مع الحواوشي" },

  // ===== السلطات =====
  { id: "sa1", cat: "salatat", name: "طحينة", price: 10, prices: "5 / 10", desc: "طحينة بلدي بالليمون" },
  { id: "sa2", cat: "salatat", name: "سلطة خضراء", price: 10, prices: "5 / 10", desc: "طازة يوم بيوم" },
  { id: "sa3", cat: "salatat", name: "مخلل", price: 5, desc: "مخلل مشكل بيتي" },
  { id: "sa4", cat: "salatat", name: "باذنجان وطماطم مخللة", price: 12, desc: "بدقة التوم والخل" },
  { id: "sa5", cat: "salatat", name: "خضار مشوي (بصل + طماطم)", price: 15, desc: "مشوي على الفحم", tag: "مع المشويات" },
  { id: "sa6", cat: "salatat", name: "طماطم مخللة", price: 10, desc: "حراقة مظبوطة" },

  // ===== الطلبات =====
  { id: "t1", cat: "talabat", name: "أرز شعيرية", price: 30, prices: "20 / 30 / 40", desc: "صغير / وسط / كبير" },
  { id: "t2", cat: "talabat", name: "أرز سادة بالكاري", price: 30, prices: "20 / 30 / 40", desc: "بنكهة الكاري" },
  { id: "t3", cat: "talabat", name: "أرز بالخلطة", price: 35, prices: "25 / 30 / 35 / 50", desc: "بالمكسرات والكبد" },
  { id: "t4", cat: "talabat", name: "أرز بسمتي", price: 40, prices: "30 / 40 / 50", desc: "حبة طويلة مبهرة" },
  { id: "t5", cat: "talabat", name: "أرز بالخضار", price: 35, prices: "25 / 30 / 35 / 50", desc: "خضار سوتيه مع الأرز" },
  { id: "t6", cat: "talabat", name: "خضار مشكل", price: 20, prices: "15 / 25", desc: "تورلي بلدي" },
  { id: "t7", cat: "talabat", name: "بامية", price: 20, prices: "15 / 25", desc: "باللحمة الضاني" },
  { id: "t8", cat: "talabat", name: "فاصوليا / لوبيا", price: 20, prices: "15 / 25", desc: "طبيخ بيتي" },
  { id: "t9", cat: "talabat", name: "ملوخية", price: 20, prices: "15 / 25", desc: "بالشربة الضاني", tag: "بيتي" },
  { id: "t10", cat: "talabat", name: "شوربة لسان عصفور", price: 10, desc: "شوربة دسمة" },
  { id: "t11", cat: "talabat", name: "مكرونة بشاميل", price: 25, desc: "قطعة محترمة" },
];

export const KILO_MENU = [
  { name: "كباب", prices: [100, 200, 400, 600, 800] },
  { name: "لحم مشكل", prices: ["-", 145, 290, 435, 580] },
  { name: "كفتة ضاني", prices: [60, 110, 220, 330, 440] },
  { name: "كفتة كندوز", prices: [50, 90, 180, 270, 360] },
  { name: "طرب ضاني", prices: [70, 120, 240, 380, 480] },
  { name: "كبدة ضاني", prices: [65, 125, 250, 375, 500] },
  { name: "فرخة شيش", prices: [80, 90, 160, 240, 320] },
  { name: "فرخة تكا", prices: ["-", "-", "-", "-", 320] },
  { name: "فرخة شواية", prices: [80, 90, 160, 240, 320] },
  { name: "شيش طاووق", prices: [50, 90, 180, 270, 360] },
  { name: "سجق", prices: [50, 80, 160, 240, 320] },
  { name: "ممبار", prices: [50, 60, 120, 180, 240] },
];

export const KILO_SIZES = ["⅛ كيلو", "¼ كيلو", "½ كيلو", "¾ كيلو", "كيلو"];
