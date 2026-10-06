import { useEffect, useMemo, useState } from "react";
import { MENU, CATEGORIES, KILO_MENU, KILO_SIZES, PHONES } from "./data/menu.js";
import { IMAGES, GALLERY, imgFor } from "./data/images.js";
import {
  OPEN_FROM, OPEN_TO, MIN_ORDER, DELIVERY_ZONES, EXTRAS, STORY,
  SOCIALS, FAQS, BOOKING, MAP_QUERY, MAP_DIR, MENU_SHEET_CSV,
} from "./data/site.js";

function waLink(text) {
  return `https://wa.me/${PHONES.whatsapp}?text=${encodeURIComponent(text)}`;
}

function isOpenNow() {
  try {
    const h = Number(
      new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Cairo", hour: "numeric", hour12: false }).format(new Date())
    );
    return h >= OPEN_FROM || h < OPEN_TO;
  } catch {
    const h = new Date().getHours();
    return h >= OPEN_FROM || h < OPEN_TO;
  }
}

function loadReviews() {
  try {
    const raw = localStorage.getItem("tahra-reviews");
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return [];
}

export default function App() {
  const [cat, setCat] = useState("all");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const [kiloSel, setKiloSel] = useState({});
  const [openNow] = useState(isOpenNow);
  // الطلب: نوع الاستلام + المنطقة + العنوان
  const [fulfill, setFulfill] = useState("delivery"); // delivery | pickup
  const [zone, setZone] = useState(0);
  const [address, setAddress] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custName, setCustName] = useState("");
  // الأسئلة الشائعة
  const [faqOpen, setFaqOpen] = useState(null);
  // آراء الزبائن
  const [reviews, setReviews] = useState(loadReviews);
  const [rName, setRName] = useState("");
  const [rStars, setRStars] = useState(5);
  const [rText, setRText] = useState("");
  // فورم حجز الصواني
  const [bk, setBk] = useState({ name: "", phone: "", date: "", guests: "", tray: "s5", qty: 1, notes: "", pay: BOOKING.depositMethods[0] });
  // المنيو: من شيت جوجل لو متظبط، وإلا من البيانات الأصلية
  const [liveMenu, setLiveMenu] = useState(MENU);
  const [menuSrc, setMenuSrc] = useState("built-in");

  useEffect(() => {
    if (!MENU_SHEET_CSV) return;
    const parseCSV = (text) => {
      const rows = [];
      let cur = [""], inQ = false;
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (inQ) {
          if (ch === '"') { if (text[i + 1] === '"') { cur[cur.length - 1] += '"'; i++; } else inQ = false; }
          else cur[cur.length - 1] += ch;
        } else if (ch === '"') inQ = true;
        else if (ch === ",") cur.push("");
        else if (ch === "\n") { rows.push(cur); cur = [""]; }
        else if (ch !== "\r") cur[cur.length - 1] += ch;
      }
      if (cur.some((c) => c.trim())) rows.push(cur);
      return rows;
    };
    fetch(MENU_SHEET_CSV)
      .then((r) => { if (!r.ok) throw new Error("sheet"); return r.text(); })
      .then((text) => {
        const rows = parseCSV(text).filter((c) => c.length >= 4 && c[2].trim() && !isNaN(Number(c[3])));
        const hasHeader = rows.length && isNaN(Number(rows[0][3]));
        const data = (hasHeader ? rows.slice(1) : rows).map((c, i) => ({
          id: (c[0] || `sheet-${i}`).trim(),
          cat: (c[1] || "wajbat").trim(),
          name: c[2].trim(),
          price: Number(c[3]),
          desc: (c[4] || "").trim(),
          tag: (c[5] || "").trim() || undefined,
          prices: (c[6] || "").trim() || undefined,
        }));
        if (data.length) { setLiveMenu(data); setMenuSrc("sheet"); }
      })
      .catch(() => { /* يفضل شغال بالبيانات الأصلية */ });
  }, []);

  const filtered = useMemo(() => {
    return liveMenu.filter((m) => {
      const okCat = cat === "all" || m.cat === cat;
      const q = query.trim();
      const okQ = !q || m.name.includes(q) || m.desc.includes(q);
      return okCat && okQ;
    });
  }, [cat, query, liveMenu]);

  const cartCount = Object.values(cart).reduce((a, b) => a + b.qty, 0);
  const cartTotal = Object.values(cart).reduce((a, b) => a + b.qty * b.price, 0);
  const deliveryFee = fulfill === "delivery" && cartCount > 0 ? DELIVERY_ZONES[zone].fee : 0;
  const grandTotal = cartTotal + deliveryFee;
  const belowMin = cartCount > 0 && cartTotal < MIN_ORDER;

  const submitReview = () => {
    if (!rName.trim() || !rText.trim()) return;
    const nr = [{ name: rName.trim(), stars: rStars, text: rText.trim(), date: "الآن" }, ...reviews].slice(0, 30);
    setReviews(nr);
    try { localStorage.setItem("tahra-reviews", JSON.stringify(nr)); } catch { /* ignore */ }
    setRName(""); setRText(""); setRStars(5);
  };

  const bookingTray = liveMenu.find((m) => m.id === bk.tray) || liveMenu[0];
  const bookingTotal = bookingTray.price * bk.qty;
  const bookingDeposit = Math.round(bookingTotal * BOOKING.depositRate);
  const bookingText = () => {
    return `حجز صينية جديد 🥘\n----------------\nالاسم: ${bk.name}\nالتليفون: ${bk.phone}\nالصينية: ${bookingTray.name} × ${bk.qty} = ${bookingTotal} ج\nالمعاد: ${bk.date}\nعدد الأفراد: ${bk.guests}\nالمقدم (${BOOKING.depositRate * 100}%): ${bookingDeposit} ج - ${bk.pay}\nملاحظات: ${bk.notes || "-"}`;
  };

  const addToCart = (item, priceOverride, labelSuffix = "") => {
    const key = item.id + (labelSuffix || "");
    const price = priceOverride ?? item.price;
    setCart((p) => ({
      ...p,
      [key]: {
        name: item.name + (labelSuffix ? ` (${labelSuffix})` : ""),
        price,
        qty: (p[key]?.qty || 0) + 1,
      },
    }));
  };

  const changeQty = (key, d) => {
    setCart((p) => {
      const cur = p[key];
      if (!cur) return p;
      const qty = cur.qty + d;
      if (qty <= 0) {
        const { [key]: _, ...rest } = p;
        return rest;
      }
      return { ...p, [key]: { ...cur, qty } };
    });
  };

  const orderText = () => {
    const lines = Object.values(cart).map((c) => `• ${c.name} × ${c.qty} = ${c.qty * c.price} ج`);
    const type = fulfill === "delivery" ? `دليفري - ${DELIVERY_ZONES[zone].name}` : "استلام من المحل (تيك أواي)";
    const extra = fulfill === "delivery"
      ? `\nالاسم: ${custName || "-"}\nالعنوان: ${address || "-"}\nتليفون: ${custPhone || "-"}\nرسوم التوصيل: ${deliveryFee} ج`
      : `\nالاسم: ${custName || "-"}\nتليفون: ${custPhone || "-"}`;
    return `طلب جديد من مشويات الطاهرة 🔥\n----------------\n${lines.join("\n")}\n----------------\nالمجموع: ${cartTotal} ج${fulfill === "delivery" ? `\nالتوصيل: ${deliveryFee} ج` : ""}\nالإجمالي: ${grandTotal} جنيه\nنوع الاستلام: ${type}${extra}`;
  };

  const addKilo = (row, sizeIdx) => {
    const price = row.prices[sizeIdx];
    if (price === "-") return;
    addToCart({ id: `k-${row.name}`, name: `${row.name}`, price }, price, KILO_SIZES[sizeIdx]);
  };

  return (
    <div className="min-h-screen bg-coal-950 bg-grill" dir="rtl">
      {/* Top bar */}
      <div className="bg-flame-600 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-2">
          <p className="font-bold truncate">🔥 خبرة 32 عاماً في المشويات • إدارة أولاد الحاج محمد الفرماوي</p>
          <div className="flex items-center gap-3">
            <span className={`shrink-0 font-black px-3 py-0.5 rounded-full text-xs ${openNow ? "bg-green-500" : "bg-black/40 border border-white/30"}`}>
              {openNow ? "🟢 مفتوح الآن" : "🔴 قافل - بنفتح 11 ص"}
            </span>
            <div className="hidden sm:flex items-center gap-3 font-bold" dir="ltr">
              <a href={`tel:${PHONES.mobile1}`} className="hover:underline">{PHONES.mobile1}</a>
              <span>•</span>
              <a href={`tel:${PHONES.mobile2}`} className="hover:underline">{PHONES.mobile2}</a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-coal-950/85 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <a href="#top" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-flame-500 to-amber-600 grid place-items-center text-2xl shadow-lg">🔥</div>
            <div>
              <h1 className="font-ruqaa text-2xl leading-none text-gold-400">مشويات الطاهرة</h1>
              <p className="text-[12px] text-orange-200/70 font-semibold">عين شمس • منذ 32 عاماً</p>
            </div>
          </a>
          <nav className="hidden lg:flex items-center gap-5 font-bold text-orange-100/90 text-[15px]">
            <a href="#menu" className="hover:text-gold-400">المنيو</a>
            <a href="#story" className="hover:text-gold-400">حكايتنا</a>
            <a href="#reviews" className="hover:text-gold-400">آراء الزبائن</a>
            <a href="#booking" className="hover:text-gold-400">حجز صينية</a>
            <a href="#faq" className="hover:text-gold-400">أسئلة شائعة</a>
            <a href="#contact" className="hover:text-gold-400">اتصل بينا</a>
          </nav>
          <div className="flex items-center gap-2">
            <a
              href={waLink("عايز أطلب من مشويات الطاهرة")}
              target="_blank"
              className="hidden sm:inline-flex glow-btn bg-green-600 hover:bg-green-500 text-white font-extrabold px-4 py-2 rounded-xl text-sm"
            >
              واتساب مباشر
            </a>
            <button
              onClick={() => setCartOpen(true)}
              className="relative glow-btn bg-flame-500 hover:bg-flame-600 text-white font-extrabold px-4 py-2 rounded-xl text-sm"
            >
              🛒 السلة
              {cartCount > 0 && (
                <span className="absolute -top-2 -left-2 bg-gold-500 text-black text-xs font-black w-6 h-6 rounded-full grid place-items-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="top" className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 pt-10 pb-8 md:pt-16 md:pb-14 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-gold-500/15 border border-gold-400/40 text-gold-400 font-bold px-4 py-1.5 rounded-full text-sm mb-4">
              ⭐ تقييم أهل عين شمس الأول في المشويات
            </div>
            <h2 className="text-4xl md:text-6xl font-black leading-[1.15]">
              ريحة الفحم…
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold-400 via-orange-400 to-flame-500">
                وطعم مايتنسيش
              </span>
            </h2>
            <p className="mt-4 text-orange-100/80 text-lg leading-relaxed">
              كباب وكفتة وطرب وشيش على الفحم الأصلي، صواني تكفي العيلة كلها،
              وسندوتشات على السريع. اطلب دلوقتي وهيوصلك سخن مولع.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#menu" className="glow-btn bg-flame-500 hover:bg-flame-600 font-black px-7 py-3 rounded-2xl text-lg">
                🍖 شوف المنيو
              </a>
              <a href={`tel:${PHONES.mobile2}`} className="bg-white/10 hover:bg-white/15 border border-white/15 font-black px-7 py-3 rounded-2xl text-lg" dir="ltr">
                📞 {PHONES.mobile2}
              </a>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
              {[
                ["+32", "سنة خبرة"],
                ["+50", "صنف في المنيو"],
                ["30د", "متوسط التوصيل"],
              ].map(([n, l]) => (
                <div key={l} className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-black text-gold-400">{n}</div>
                  <div className="text-sm text-orange-100/70 font-bold">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-flame-500/40 to-gold-500/20 blur-3xl rounded-full" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl">
              <img src={IMAGES.hero} alt="مشويات الطاهرة على الفحم" className="h-72 md:h-80 w-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 right-0 left-0 p-5">
                <h3 className="font-ruqaa text-3xl text-gold-400">صينية السعادة - 800 ج</h3>
                <p className="text-orange-100/85 font-bold text-sm">2 فرخة + كيلو كفتة + طرب + أرز + سلطات</p>
                <button
                  onClick={() => addToCart({ id: "s5", name: "صينية السعادة", price: 800 })}
                  className="mt-3 bg-gold-500 hover:bg-gold-400 text-black font-black px-5 py-2 rounded-xl"
                >
                  ضيف للسلة +
                </button>
              </div>
            </div>
            <div className="relative mt-3 grid grid-cols-3 gap-2">
              {[IMAGES.kabab, IMAGES.chicken, IMAGES.grill].map((s, i) => (
                <img key={i} src={s} alt="مشويات" className="h-20 w-full object-cover rounded-2xl border border-white/10" loading="lazy" />
              ))}
            </div>
            <div className="relative mt-3 grid grid-cols-2 gap-2 text-sm font-bold">
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">✅ فحم طبيعي 100%</div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">✅ لحمة بلدي يوم بيوم</div>
            </div>
          </div>
        </div>
        {/* marquee */}
        <div className="bg-gold-500 text-black font-black py-2 overflow-hidden whitespace-nowrap border-y-4 border-flame-600">
          <div className="marquee-track inline-flex gap-8 px-4" dir="ltr">
            {Array(2).fill("كباب • كفتة ضاني • طرب • شيش طاووق • حواوشي • صواني عائلية • توصيل سريع • ").map((t, i) => (
              <span key={i} dir="rtl">{t.repeat(4)}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h3 className="font-ruqaa text-4xl text-gold-400">المنيو الكامل</h3>
            <p className="text-orange-100/70 font-bold">دوس على أي صنف عشان تضيفه للسلة وتطلب واتساب{menuSrc === "sheet" && <span className="text-green-400"> • الأسعار محدثة ✅</span>}</p>
          </div>
          <div className="relative w-full md:w-80">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="دوّر على أكلة… (كباب، طرب، حواوشي)"
              className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-gold-400 font-bold placeholder:text-orange-100/40"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`shrink-0 px-5 py-2.5 rounded-2xl font-black border transition ${
                cat === c.id
                  ? "bg-flame-500 border-flame-500 text-white shadow-lg"
                  : "bg-white/5 border-white/10 text-orange-100/80 hover:bg-white/10"
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        {cat === "mashwyat" ? (
          <div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {KILO_MENU.filter((r) => !query.trim() || r.name.includes(query.trim())).map((r) => {
                const nums = r.prices.filter((p) => p !== "-");
                const min = Math.min(...nums);
                return (
                  <div key={r.name} className="card-hover overflow-hidden bg-gradient-to-b from-coal-800 to-coal-900 border border-white/10 rounded-2xl flex flex-col">
                    <div className="relative h-36">
                      <img src={imgFor({ name: r.name })} alt={r.name} className="h-full w-full object-cover" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1110] via-transparent to-transparent" />
                      <span className="absolute top-2 right-2 text-[11px] font-black bg-gold-500 text-black px-2 py-1 rounded-lg">بالكيلو ⚖️</span>
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h4 className="font-extrabold text-lg leading-snug">{r.name}</h4>
                      <p className="text-sm text-orange-100/60 font-semibold mt-1 flex-1">يبدأ من {min} ج (⅛ كيلو) لحد {nums[nums.length - 1]} ج (كيلو)</p>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="text-2xl font-black text-gold-400">{min} <span className="text-sm">ج</span></div>
                        <a href="#kilo" className="bg-flame-500 hover:bg-flame-600 font-black px-4 py-2 rounded-xl text-sm glow-btn">
                          اختار الوزن 👇
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.filter((m) => m.cat !== "sawany" || cat === "sawany" || cat === "all").map((m) => (
            <div key={m.id} className="card-hover overflow-hidden bg-gradient-to-b from-coal-800 to-coal-900 border border-white/10 rounded-2xl flex flex-col">
              <div className="relative h-36">
                <img src={imgFor(m)} alt={m.name} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c1110] via-transparent to-transparent" />
                {m.tag && (
                  <span className="absolute top-2 right-2 text-[11px] font-black bg-gold-500 text-black px-2 py-1 rounded-lg">{m.tag}</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-extrabold text-lg leading-snug">{m.name}</h4>
              </div>
              <p className="text-sm text-orange-100/60 font-semibold mt-1 flex-1">{m.desc}</p>
              {m.prices && <p className="text-xs text-gold-400/90 font-bold mt-1">الأحجام: {m.prices} جنيه</p>}
              <div className="mt-3 flex items-center justify-between">
                <div className="text-2xl font-black text-gold-400">{m.price} <span className="text-sm">ج</span></div>
                <button
                  onClick={() => addToCart(m)}
                  className="bg-flame-500 hover:bg-flame-600 font-black px-4 py-2 rounded-xl text-sm glow-btn"
                >
                  + ضيف
                </button>
              </div>
              </div>
            </div>
          ))}
        </div>
        )}
        {filtered.length === 0 && cat !== "mashwyat" && (
          <p className="text-center text-orange-100/60 font-bold py-10">مفيش نتيجة… جرب كلمة تانية</p>
        )}

        {/* Sawany highlight */}
        <div id="sawany" className="mt-12">
          <h3 className="font-ruqaa text-3xl text-gold-400 mb-1">🥘 ركن الصواني - للعيلة والعزومات</h3>
          <p className="text-orange-100/60 font-bold mb-4">كل الصواني معاها أرز + سلطات + عيش</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {liveMenu.filter((m) => m.cat === "sawany").map((m) => (
              <div key={m.id} className="relative overflow-hidden rounded-2xl border border-gold-400/30 bg-gradient-to-b from-[#3a1410] to-coal-900 card-hover">
                <img src={imgFor(m)} alt={m.name} className="h-40 w-full object-cover" loading="lazy" />
                <div className="p-5">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-l from-flame-500 to-gold-500" />
                <span className="text-xs font-black bg-flame-500 px-2 py-1 rounded-lg">{m.tag}</span>
                <h4 className="font-black text-xl mt-2">{m.name}</h4>
                <p className="text-sm text-orange-100/65 font-semibold mt-1 min-h-[40px]">{m.desc}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-black text-gold-400">{m.price} ج</span>
                  <button onClick={() => addToCart(m)} className="bg-gold-500 hover:bg-gold-400 text-black font-black px-4 py-2 rounded-xl text-sm">
                    اطلب الصينية
                  </button>
                </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery */}
        <div id="gallery" className="mt-12">
          <h3 className="font-ruqaa text-3xl text-gold-400 mb-1">📸 من السيخ للترابيزة</h3>
          <p className="text-orange-100/60 font-bold mb-4">شوية صور تفتح النفس من شغلنا على الفحم</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {GALLERY.map((g) => (
              <div key={g.src + g.title} className="group relative overflow-hidden rounded-2xl border border-white/10 card-hover">
                <img src={g.src} alt={g.title} className="h-44 w-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <p className="absolute bottom-2 right-2 left-2 text-sm font-black">{g.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What you can do */}
        <div className="mt-12 grid md:grid-cols-4 gap-3">
          {[
            ["🔍", "تصفح ودور", "فلتر بالأقسام أو ابحث عن أي أكلة بالاسم"],
            ["🛒", "كوّن سلتك", "ضيف وجبات وكيلوهات وصواني وزود الكمية"],
            ["💬", "اطلب واتساب", "طلبك بيتبعت جاهز بالأسعار على واتساب المحل"],
            ["📞", "اتصل مباشرة", "3 أرقام + عنوان المحل ومواعيد العمل"],
          ].map(([icon, t, d]) => (
            <div key={t} className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <div className="text-3xl">{icon}</div>
              <h4 className="font-black mt-1">{t}</h4>
              <p className="text-sm text-orange-100/60 font-bold">{d}</p>
            </div>
          ))}
        </div>

        {/* Kilo table */}
        <div id="kilo" className="mt-12 bg-coal-900/80 border border-white/10 rounded-3xl p-5 md:p-8 overflow-hidden">
          <h3 className="font-ruqaa text-3xl text-gold-400">🥩 ركن المشويات بالكيلو</h3>
          <p className="text-orange-100/60 font-bold mb-4">اختار الصنف والوزن ودوس على السعر عشان يضاف للسلة</p>
          <div className="overflow-x-auto">
            <table className="w-full text-center min-w-[640px] font-bold">
              <thead>
                <tr className="text-gold-400">
                  <th className="p-3 text-right">الصنف</th>
                  {KILO_SIZES.map((s) => (
                    <th key={s} className="p-3 bg-white/5 rounded-lg">{s}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {KILO_MENU.map((row) => (
                  <tr key={row.name} className="border-t border-white/10 hover:bg-white/5">
                    <td className="p-3 text-right font-black">
                      <span className="flex items-center gap-2">
                        <img src={imgFor({ name: row.name })} alt={row.name} className="w-11 h-11 rounded-xl object-cover border border-white/10" loading="lazy" />
                        {row.name}
                      </span>
                    </td>
                    {row.prices.map((pr, i) => (
                      <td key={i} className="p-1.5">
                        {pr === "-" ? (
                          <span className="text-white/20">-</span>
                        ) : (
                          <button
                            onClick={() => { setKiloSel({ name: row.name }); addKilo(row, i); }}
                            className="w-full bg-white/5 hover:bg-flame-500 border border-white/10 hover:border-flame-500 rounded-xl px-2 py-2 transition font-black"
                          >
                            {pr}
                          </button>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-6 items-center bg-coal-900/70 border border-white/10 rounded-3xl p-6 md:p-10 overflow-hidden">
          <div>
            <h3 className="font-ruqaa text-4xl text-gold-400">{STORY.title} 📜</h3>
            {STORY.lines.map((p) => (
              <p key={p.slice(0, 20)} className="mt-3 text-orange-100/80 font-semibold leading-relaxed">{p}</p>
            ))}
            <div className="mt-4 flex flex-wrap gap-2">
              {STORY.badges.map((b) => (
                <span key={b} className="bg-gold-500/15 border border-gold-400/40 text-gold-400 font-black px-3 py-1.5 rounded-full text-sm">{b}</span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={IMAGES.hero} alt="مشويات الطاهرة على الفحم" className="rounded-2xl h-52 w-full object-cover border border-white/10" loading="lazy" />
            <img src={IMAGES.chicken} alt="فراخ مشوية الطاهرة" className="rounded-2xl h-52 w-full object-cover mt-6 border border-white/10" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="font-ruqaa text-3xl text-gold-400 mb-1">⭐ آراء زبايننا</h3>
        <p className="text-orange-100/60 font-bold mb-4">جربتنا؟ سيب رأيك تحت وخلي غيرك يطمن</p>
        <div className="grid md:grid-cols-3 gap-3 mb-5">
          {reviews.length === 0 && (
            <p className="md:col-span-3 text-center text-orange-100/50 font-bold py-6 bg-white/5 border border-white/10 rounded-2xl">
              لسه مفيش تقييمات — جربت الأكل؟ كن أول واحد يقيّم 👇
            </p>
          )}
          {reviews.map((r, i) => (
            <div key={`${r.name}-${i}`} className="bg-coal-900/70 border border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <span className="font-black">{r.name}</span>
                <span className="text-gold-400 text-sm font-black">{"★".repeat(r.stars)}{"☆".repeat(5 - r.stars)}</span>
              </div>
              <p className="mt-2 text-sm text-orange-100/75 font-semibold leading-relaxed">{r.text}</p>
              <p className="mt-2 text-xs text-orange-100/40 font-bold">{r.date}</p>
            </div>
          ))}
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <h4 className="font-black text-lg mb-3">✍️ اكتب رأيك</h4>
          <div className="grid md:grid-cols-[1fr_auto] gap-3">
            <input value={rName} onChange={(e) => setRName(e.target.value)} placeholder="اسمك" className="bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
            <div className="flex items-center gap-1 bg-black/30 border border-white/15 rounded-xl px-4 py-2">
              <span className="text-sm font-bold text-orange-100/60 ml-2">تقييمك:</span>
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRStars(s)} className={`text-2xl ${s <= rStars ? "text-gold-400" : "text-white/20"}`}>★</button>
              ))}
            </div>
          </div>
          <textarea value={rText} onChange={(e) => setRText(e.target.value)} placeholder="قولنا رأيك في الأكل والخدمة..." rows={3} className="mt-3 w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
          <button onClick={submitReview} className="mt-3 bg-flame-500 hover:bg-flame-600 font-black px-6 py-2.5 rounded-xl glow-btn">انشر رأيك</button>
        </div>
      </section>

      {/* Delivery */}
      <section id="delivery" className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="font-ruqaa text-3xl text-gold-400 mb-1">🛵 التوصيل والمناطق</h3>
        <p className="text-orange-100/60 font-bold mb-4">الحد الأدنى للطلب {MIN_ORDER} جنيه • وقت التجهيز على الفحم 25-40 دقيقة</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {DELIVERY_ZONES.map((z) => (
            <div key={z.name} className="bg-coal-900/70 border border-white/10 rounded-2xl p-4 text-center card-hover">
              <div className="font-black">{z.name}</div>
              <div className="text-gold-400 font-black text-xl mt-1">{z.fee} ج</div>
              <div className="text-xs text-orange-100/60 font-bold mt-1">{z.time}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking */}
      <section id="booking" className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-l from-[#3a1410] to-coal-900 border border-gold-400/30 rounded-3xl p-6 md:p-8">
          <h3 className="font-ruqaa text-3xl text-gold-400">🥘 احجز صينية العزومة</h3>
          <p className="text-orange-100/70 font-bold mt-1">الحجز قبلها بيوم على الأقل • مقدم تأكيد {BOOKING.depositRate * 100}% والباقي عند الاستلام</p>
          <div className="mt-5 grid md:grid-cols-3 gap-3">
            <input value={bk.name} onChange={(e) => setBk({ ...bk, name: e.target.value })} placeholder="الاسم" className="bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
            <input value={bk.phone} onChange={(e) => setBk({ ...bk, phone: e.target.value })} placeholder="رقم الموبايل" className="bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" dir="ltr" />
            <input value={bk.date} onChange={(e) => setBk({ ...bk, date: e.target.value })} placeholder="المعاد (مثال: الجمعة 7 مساءً)" className="bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
            <select value={bk.tray} onChange={(e) => setBk({ ...bk, tray: e.target.value })} className="bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 text-orange-100">
              {liveMenu.filter((m) => m.cat === "sawany").map((m) => (
                <option key={m.id} value={m.id} className="bg-coal-900">{m.name} - {m.price} ج</option>
              ))}
            </select>
            <div className="flex items-center gap-2 bg-black/30 border border-white/15 rounded-xl px-4 py-2">
              <span className="text-sm font-bold text-orange-100/60">الكمية:</span>
              <button onClick={() => setBk({ ...bk, qty: Math.max(1, bk.qty - 1) })} className="w-8 h-8 rounded-lg bg-white/10 font-black">-</button>
              <span className="font-black w-6 text-center">{bk.qty}</span>
              <button onClick={() => setBk({ ...bk, qty: bk.qty + 1 })} className="w-8 h-8 rounded-lg bg-flame-500 font-black">+</button>
            </div>
            <input value={bk.guests} onChange={(e) => setBk({ ...bk, guests: e.target.value })} placeholder="عدد الأفراد (مثال: 6)" className="bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
          </div>
          <textarea value={bk.notes} onChange={(e) => setBk({ ...bk, notes: e.target.value })} placeholder="ملاحظات (زيادة شطة، بدون بصل...)" rows={2} className="mt-3 w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-orange-100/60">دفع المقدم:</span>
            {BOOKING.depositMethods.map((m) => (
              <button key={m} onClick={() => setBk({ ...bk, pay: m })} className={`px-4 py-2 rounded-xl font-black text-sm border ${bk.pay === m ? "bg-gold-500 text-black border-gold-500" : "bg-white/5 border-white/15"}`}>{m}</button>
            ))}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-black">
              الإجمالي: <span className="text-gold-400">{bookingTotal} ج</span>
              <span className="text-orange-100/60 text-sm"> • المقدم: <span className="text-gold-400">{bookingDeposit} ج</span></span>
            </div>
            <a href={bk.name && bk.phone ? waLink(bookingText()) : undefined} onClick={(e) => { if (!bk.name || !bk.phone) e.preventDefault(); }} target="_blank" className={`text-center font-black px-6 py-2.5 rounded-xl ${bk.name && bk.phone ? "bg-green-600 hover:bg-green-500" : "bg-white/10 text-white/40"}`}>
              💬 ابعت الحجز واتساب
            </a>
          </div>
          {(!bk.name || !bk.phone) && <p className="mt-2 text-xs font-bold text-orange-100/50">اكتب الاسم ورقم الموبايل عشان زر الحجز يتفعل</p>}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="font-ruqaa text-3xl text-gold-400 mb-4">❓ أسئلة شائعة</h3>
        <div className="space-y-2">
          {FAQS.map((f, i) => (
            <div key={f.q} className="bg-coal-900/70 border border-white/10 rounded-2xl overflow-hidden">
              <button onClick={() => setFaqOpen(faqOpen === i ? null : i)} className="w-full flex items-center justify-between gap-2 p-4 font-black text-right">
                {f.q}
                <span className="text-gold-400 text-xl shrink-0">{faqOpen === i ? "−" : "+"}</span>
              </button>
              {faqOpen === i && <p className="px-4 pb-4 text-sm text-orange-100/75 font-semibold leading-relaxed">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* Map */}
      <section id="location" className="max-w-7xl mx-auto px-4 py-6">
        <h3 className="font-ruqaa text-3xl text-gold-400 mb-1">📍 مكاننا فين</h3>
        <p className="text-orange-100/60 font-bold mb-4">{PHONES.address}</p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 overflow-hidden rounded-3xl border border-white/10 min-h-[300px]">
            <iframe
              title="موقع مشويات الطاهرة على الخريطة"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`}
              className="w-full h-[320px] grayscale-[20%] contrast-[1.05]"
              loading="lazy"
            />
          </div>
          <div className="bg-coal-900/70 border border-white/10 rounded-3xl p-6 flex flex-col justify-center gap-3">
            <p className="font-bold text-orange-100/80 text-sm leading-relaxed">17 شارع ابراهيم عبد الرازق<br />بجوار مسجد فاطمة الزهراء<br />عين شمس - القاهرة</p>
            <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_DIR)}`} target="_blank" className="text-center bg-flame-500 hover:bg-flame-600 font-black px-6 py-3 rounded-2xl glow-btn">
              🧭 وصّلني للمحل
            </a>
            <a href={`tel:${PHONES.mobile2}`} className="text-center bg-white/10 hover:bg-white/15 border border-white/15 font-black px-6 py-3 rounded-2xl" dir="ltr">
              📞 {PHONES.mobile2}
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-7xl mx-auto px-4 pb-14">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2 bg-gradient-to-l from-flame-600 to-[#7a1410] rounded-3xl p-6 md:p-8 relative overflow-hidden">
            <h3 className="font-ruqaa text-3xl">جوعت؟ اطلب دلوقتي 🛵</h3>
            <p className="font-bold text-white/85 mt-1">خدمة توصيل الطلبات لجميع أنحاء عين شمس والمناطق المجاورة</p>
            <p className="mt-2 text-sm font-bold text-white/70">📍 {PHONES.address}</p>
            <div className="mt-5 grid sm:grid-cols-3 gap-3" dir="ltr">
              <a href={`tel:${PHONES.mobile1}`} className="bg-black/30 hover:bg-black/40 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-white/70">اتصال</div>
                <div className="font-black text-xl">{PHONES.mobile1}</div>
              </a>
              <a href={`tel:${PHONES.mobile2}`} className="bg-black/30 hover:bg-black/40 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-white/70">اتصال / واتساب</div>
                <div className="font-black text-xl">{PHONES.mobile2}</div>
              </a>
              <a href={`tel:${PHONES.landline}`} className="bg-black/30 hover:bg-black/40 border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-xs font-bold text-white/70">أرضي</div>
                <div className="font-black text-xl">{PHONES.landline}</div>
              </a>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <a href={waLink("عايز أعمل أوردر")} target="_blank" className="bg-green-500 hover:bg-green-400 text-white font-black px-6 py-3 rounded-2xl">
                💬 اطلب واتساب
              </a>
              {cartTotal > 0 && (
                <button onClick={() => setCartOpen(true)} className="bg-gold-500 hover:bg-gold-400 text-black font-black px-6 py-3 rounded-2xl">
                  🛒 تكملة الطلب ({cartTotal} ج)
                </button>
              )}
            </div>
          </div>
          <div className="bg-coal-900 border border-white/10 rounded-3xl p-6">
            <h4 className="font-black text-xl mb-3">⏰ مواعيد العمل</h4>
            <div className="space-y-2 font-bold text-orange-100/80 text-sm">
              <div className="flex justify-between bg-white/5 rounded-xl p-3"><span>يومياً</span><span className="text-gold-400">11 ص - 2 بعد منتصف الليل</span></div>
              <div className="flex justify-between bg-white/5 rounded-xl p-3"><span>الدليفري</span><span className="text-gold-400">لحد 1:30 بالليل</span></div>
              <div className="flex justify-between bg-white/5 rounded-xl p-3"><span>صواني العزومات</span><span className="text-gold-400">بالحجز المسبق</span></div>
            </div>
            <div className="mt-4 bg-gold-500/10 border border-gold-400/30 rounded-2xl p-4 text-sm font-bold text-gold-400">
              💡 نصيحة المعلم: الطرب والكباب الضاني بيخلصوا بدري يوم الخميس والجمعة — احجز من بدري!
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            {SOCIALS.map((s) => (
              <span key={s.name} title={`${s.name} - قريباً`} className="opacity-40 grayscale bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-sm font-black cursor-not-allowed">
                {s.icon} {s.name}
              </span>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm font-bold text-orange-100/60">
            <p>© 2026 مشويات الطاهرة - جميع الحقوق محفوظة 🔥</p>
            <p>إدارة أولاد الحاج محمد الفرماوي • عين شمس</p>
          </div>
        </div>
      </footer>

      {/* Cart drawer */}
      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/70" onClick={() => setCartOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-full max-w-md bg-coal-900 border-r border-white/10 p-5 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black text-2xl">🛒 سلة الطلب</h3>
              <button onClick={() => setCartOpen(false)} className="bg-white/10 px-3 py-1.5 rounded-xl font-black">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {Object.entries(cart).length === 0 && (
                <p className="text-center text-orange-100/50 font-bold py-10">السلّة فاضية… الحق اختار من المنيو 😋</p>
              )}
              {Object.entries(cart).map(([key, c]) => (
                <div key={key} className="bg-white/5 border border-white/10 rounded-2xl p-3 flex items-center justify-between gap-2">
                  <div>
                    <div className="font-extrabold">{c.name}</div>
                    <div className="text-gold-400 font-black">{c.price} ج</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => changeQty(key, 1)} className="w-8 h-8 rounded-lg bg-flame-500 font-black">+</button>
                    <span className="font-black w-6 text-center">{c.qty}</span>
                    <button onClick={() => changeQty(key, -1)} className="w-8 h-8 rounded-lg bg-white/10 font-black">-</button>
                  </div>
                </div>
              ))}
            </div>
            {cartTotal > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                {/* نوع الاستلام */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setFulfill("delivery")} className={`py-2.5 rounded-xl font-black border ${fulfill === "delivery" ? "bg-flame-500 border-flame-500" : "bg-white/5 border-white/15"}`}>🛵 دليفري</button>
                  <button onClick={() => setFulfill("pickup")} className={`py-2.5 rounded-xl font-black border ${fulfill === "pickup" ? "bg-flame-500 border-flame-500" : "bg-white/5 border-white/15"}`}>🏃 استلام من المحل</button>
                </div>
                {/* بيانات الزبون - عشان تعرفه لما يبعت */}
                <input value={custName} onChange={(e) => setCustName(e.target.value)} placeholder="اسمك" className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
                <input value={custPhone} onChange={(e) => setCustPhone(e.target.value)} placeholder="رقم الموبايل" className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" dir="ltr" />
                {fulfill === "delivery" && (
                  <>
                    <select value={zone} onChange={(e) => setZone(Number(e.target.value))} className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 text-orange-100">
                      {DELIVERY_ZONES.map((z, i) => (
                        <option key={z.name} value={i} className="bg-coal-900">{z.name} - توصيل {z.fee} ج ({z.time})</option>
                      ))}
                    </select>
                    <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="العنوان بالتفصيل (شارع - عمارة - علامة مميزة)" className="w-full bg-black/30 border border-white/15 rounded-xl px-4 py-2.5 font-bold outline-none focus:border-gold-400 placeholder:text-orange-100/40" />
                  </>
                )}
                {/* إضافات */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-3">
                  <p className="font-black text-sm mb-2">➕ تحب تضيف حاجة؟</p>
                  <div className="flex flex-wrap gap-1.5">
                    {EXTRAS.map((x) => (
                      <button key={x.id} onClick={() => addToCart(x)} className="text-xs font-black bg-black/30 border border-white/15 hover:border-gold-400 rounded-lg px-2.5 py-1.5">
                        {x.name} +{x.price}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 font-bold text-sm">
                  <div className="flex justify-between text-orange-100/70"><span>المجموع</span><span>{cartTotal} ج</span></div>
                  {fulfill === "delivery" && <div className="flex justify-between text-orange-100/70"><span>التوصيل ({DELIVERY_ZONES[zone].name})</span><span>{deliveryFee} ج</span></div>}
                  <div className="flex justify-between font-black text-xl"><span>الإجمالي</span><span className="text-gold-400">{grandTotal} جنيه</span></div>
                </div>
                {belowMin && <p className="text-xs font-black text-red-400">⚠️ الحد الأدنى للطلب {MIN_ORDER} جنيه - زود أصناف عشان نأكد الطلب</p>}
                {!openNow && <p className="text-xs font-black text-red-400">🔴 المحل قافل دلوقتي (بنفتح {OPEN_FROM} الصبح) - تقدر تحجز صينية لمعاد تاني من قسم الحجز</p>}
                {(() => {
                  const missing = !custName.trim() || !custPhone.trim() || (fulfill === "delivery" && !address.trim());
                  const canOrder = openNow && !belowMin && !missing;
                  const reason = !openNow
                    ? "🔴 المحل قافل دلوقتي"
                    : belowMin
                      ? `كمّل طلبك لـ ${MIN_ORDER} جنيه`
                      : "اكتب الاسم والموبايل والعنوان";
                  return canOrder ? (
                    <a
                      href={waLink(orderText())}
                      target="_blank"
                      className="block text-center bg-green-600 hover:bg-green-500 font-black py-3 rounded-2xl"
                    >
                      💬 تأكيد الطلب واتساب
                    </a>
                  ) : (
                    <div>
                      <div className="block text-center bg-white/10 text-white/40 font-black py-3 rounded-2xl cursor-not-allowed">
                        💬 تأكيد الطلب واتساب
                      </div>
                      <p className="mt-1.5 text-xs font-black text-gold-400 text-center">{reason}</p>
                    </div>
                  );
                })()}
                <button onClick={() => setCart({})} className="w-full text-sm font-bold text-white/50 hover:text-white">
                  تفريغ السلة
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
