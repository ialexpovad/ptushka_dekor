/* =========================================
   Ptushka Dekor — статический магазин
   Тема (light/dark) + i18n (RU/BE) + чипы-фильтры
   ========================================= */

const CONFIG = {
  SHEET_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSdu-ukIcKN3DCYuKUXId6sTh62ieH4p7CzXN3FEPBtzo_55K8CQu00A6mhVgqt9Qn08tG7k464T3BW/pub?output=csv",
  SHEETS: {
    PRODUCTS_GID: "0",                        // Лист «Товары»
    META_GID: "1891142108"                    // ← ЗАМЕНИТЕ на gid листа «Инфо»
  },
  COLUMN_MAP: {
    sku: "sku", title: "title", price: "price", old_price: "old_price",
    image: "image", category: "category", active: "active", discount: "discount"
  },
  GS_WEB_APP_URL: "https://script.google.com/macros/s/AKfycbzpboxaHaZSyp4nQfuDhC6TZrOpkq5m7aPlJe2E0GRdin_zFvGfj6GQQXFSw9jQl_-VaA/exec"
};

/* ===== helpers для Published CSV ===== */
function withGid(url, gid){
  try { const u = new URL(url); u.searchParams.set("gid", String(gid)); return u.toString(); }
  catch { return url.replace(/gid=\d+/, `gid=${gid}`); }
}

/* ===== i18n ===== */
const I18N = {
  ru: {
    // topbar_msg:"Букеты с доставкой по городу Хойники — быстрый заказ на сайте 🌸",
    nav_about:"О нас", nav_catalog:"Каталог", nav_reviews:"Отзывы", nav_contacts:"Контакты", nav_delivery:"Доставка", nav_faq:"FAQ",

    hero_tag_city:"Хойники • Доставка", hero_tag_fresh:"Свежие цветы каждый день",
    hero_eyebrow:"Авторские композиции и декор",
    hero_h1:"Свежие цветы каждый день",
    hero_p:"Выберите букет из каталога и оформите заказ за 1–2 минуты. Доставим по городу или подготовим к самовывозу.",
    hero_cta:"Смотреть каталог", hero_cta2:"Написать нам",

    usp_fast:"Доставка в день заказа", usp_fresh:"Только свежие цветы", usp_custom:"Индивидуальные композиции",

    about_h1_a:"О", about_h1_b:"нас", about_card:"Любовь к деталям",
    about_why:"Почему выбирают нас",
    about_p1:"Работаем с живыми цветами и бережной упаковкой. Собираем композиции под бюджет, повод и стиль.",
    about_p2:"Быстрые согласования в мессенджерах и чёткие сроки доставки.",
    benefit_range_t:"От классики до экзотики", benefit_range_d:"Букеты/композиции под любой повод",
    benefit_bride_t:"Букет невесты", benefit_bride_d:"Свадебная флористика и декор",
    benefit_delivery_t:"Заказ и доставка", benefit_delivery_d:"Хойники и ближайшие районы",
    about_cta:"В каталог",

    feat_delivery:"Доставка", feat_city:"По городу", feat_exchange:"Обмен", feat_as_agreed:"По договорённости",
    feat_cards:"Открытки", feat_ribbons:"и ленточки", feat_safe:"Надёжно", feat_careful:"и аккуратно",

    catalog_h1:"Наши букеты",
    chip_all:"Все", chip_roses:"Розы", chip_tulips:"Тюльпаны", chip_peonies:"Пионы", chip_wedding:"Свадьба", chip_exotic:"Экзотика",
    filters_search_placeholder:"Поиск по названию…",
    filters_all_categories:"Все категории",
    filters_reset:"Сброс",
    filters_cart_button:"Корзина",
    empty_catalog:"Каталог скоро пополнится 🌸",

    delivery_h1_a:"Доставка", delivery_h1_b:"в Хойниках",
    delivery_title:"Заказ и доставка букетов — Хойники",
    delivery_point1:"Букеты/композиции: от классики до экзотики",
    delivery_point2:"Букет невесты, свадебный декор",
    delivery_point3:"Самовывоз или курьером по городу",
    delivery_btn1:"Сделать заказ", delivery_btn2:"Смотреть каталог",
    delivery_contacts:"Контакты",
    delivery_address_t:"Адрес:", delivery_address_v:"улица Жукова 2Л, Хойники 247618",
    delivery_phone_t:"Телефон:", delivery_hours_t:"Время:", delivery_hours_v:"ежедневно 8:30–18:30",
    delivery_note:"Позвоните нам — подскажем по составу, бюджету и срокам доставки.",

    reviews_h1:"Отзывы клиентов", rev_1:"Красиво, вовремя, и запах — восторг!", rev_2:"Собрали букет под бюджет и пожелания.", rev_buyer:"Покупатель",

    faq_h1_a:"Ответы", faq_h1_b:"на вопросы",
    faq_q1:"Как оформить заказ?", faq_a1:"Выберите букет в каталоге, добавьте в корзину и оставьте заявку. Мы свяжемся, уточним детали и согласуем доставку.",
    faq_q2:"Вы делаете индивидуальные композиции?", faq_a2:"Да. Под бюджет, цветовую гамму и повод. Подберём свежие сезонные цветы и упаковку.",
    faq_q3:"Как работает доставка по городу?", faq_a3:"Доставляем по Хойникам в день заказа (при наличии цветов). Также есть самовывоз по адресу: ул. Жукова, 2Л.",

    contact_h1_a:"Свяжитесь", contact_h1_b:"с нами",
    contact_name:"Имя", contact_email:"Email", contact_phone:"Телефон", contact_msg:"Сообщение", contact_submit:"Отправить",

    f_quick:"Быстрые ссылки", f_home:"Главная", f_about:"О нас", f_catalog:"Каталог", f_reviews:"Отзывы", f_contacts:"Контакты",
    f_services:"Услуги", f_s1:"Заказ и доставка букетов — Хойники", f_s2:"Букеты/композиции: от классики до экзотики", f_s3:"Букет невесты", f_s4:"Свадебный декор",
    f_address_t:"Адрес", f_address_v1:"улица Жукова, 2Л", f_address_v2:"г. Хойники, 247618", f_address_v3:"Беларусь",
    f_contact_t:"Контакты", f_feedback:"Форма обратной связи",

    rights:"Все права защищены.",
    cart_title:"Корзина", cart_total_label:"Итого:", cart_checkout:"Оформить заказ",
    order_title:"Оформление заказа",
    order_name_label:"Имя*", order_phone_label:"Телефон*",
    order_dt_label:"Доставка или самовывоз*", order_dt_delivery:"Доставка", order_dt_pickup:"Самовывоз",
    order_address_label:"Адрес (если доставка)", order_when_label:"Желаемые дата и время",
    order_comment_label:"Комментарии", order_hint:"После подтверждения заказа вы получите реквизиты для оплаты или оплатите при получении.",
    order_submit:"Отправить заявку", order_success:"Спасибо! Заявка отправлена.",
    order_error_empty:"Корзина пуста.", order_error_send:"Не удалось отправить. Попробуйте ещё раз или свяжитесь по телефону.",

    add_to_cart:"В корзину", wishlist_title:"В избранное", share_title:"Поделиться"
  },
  be: {
    // topbar_msg:"Букеты з дастаўкай па горадзе Хойнікі — хуткі заказ на сайце 🌸",
    nav_about:"Пра нас", nav_catalog:"Каталог", nav_reviews:"Водгукі", nav_contacts:"Кантакты", nav_delivery:"Дастаўка", nav_faq:"FAQ",

    hero_tag_city:"Хойнікі • Дастаўка", hero_tag_fresh:"Свежыя кветкі штодня",
    hero_eyebrow:"Аўтарскія кампазіцыі і дэкор",
    hero_h1:"Свежыя кветкі кожны дзень",
    hero_p:"Абярыце букет і аформіце заказ за 1–2 хвіліны. Даставім па горадзе або падрыхтуем да самавывазу.",
    hero_cta:"Паглядзець каталог", hero_cta2:"Напісаць нам",

    usp_fast:"Дастаўка ў дзень заказу", usp_fresh:"Толькі свежыя кветкі", usp_custom:"Індывідуальныя кампазіцыі",

    about_h1_a:"Пра", about_h1_b:"нас", about_card:"Любоў да дэталяў",
    about_why:"Чаму абіраюць нас",
    about_p1:"Працуюем з жывымі кветкамі і далікатнай упакоўкай. Збіраем кампазіцыі пад бюджэт, нагоду і стыль.",
    about_p2:"Хуткія ўзгадненні ў мэсэджарах і дакладныя тэрміны дастаўкі.",
    benefit_range_t:"Ад класікі да экзотыкі", benefit_range_d:"Букеты/кампазіцыі на любы выпадак",
    benefit_bride_t:"Букет нявесты", benefit_bride_d:"Вясельная флорыстыка і дэкор",
    benefit_delivery_t:"Заказ і дастаўка", benefit_delivery_d:"Хойнікі і суседнія раёны",
    about_cta:"У каталог",

    feat_delivery:"Дастаўка", feat_city:"Па горадзе", feat_exchange:"Абмен", feat_as_agreed:"Па дамоўленасці",
    feat_cards:"Карцiчкі", feat_ribbons:"і стужкі", feat_safe:"Надзейна", feat_careful:"і акуратна",

    catalog_h1:"Нашы букеты",
    chip_all:"Усе", chip_roses:"Розы", chip_tulips:"Цюльпаны", chip_peonies:"Півоні", chip_wedding:"Вяселле", chip_exotic:"Экзотыка",
    filters_search_placeholder:"Пошук па назве…",
    filters_all_categories:"Усе катэгорыі",
    filters_reset:"Скід",
    filters_cart_button:"Кошык",
    empty_catalog:"Каталог хутка папоўніцца 🌸",

    delivery_h1_a:"Дастаўка", delivery_h1_b:"у Хойніках",
    delivery_title:"Заказ і дастаўка букетаў — Хойнікі",
    delivery_point1:"Букеты/кампазіцыі: ад класікі да экзотыкі",
    delivery_point2:"Букет нявесты, вясельны дэкор",
    delivery_point3:"Самавываз або кур’ерам па горадзе",
    delivery_btn1:"Зрабіць заказ", delivery_btn2:"Глядзець каталог",
    delivery_contacts:"Кантакты",
    delivery_address_t:"Адрас:", delivery_address_v:"вуліца Жукава 2Л, Хойнікі 247618",
    delivery_phone_t:"Тэлефон:", delivery_hours_t:"Час:", delivery_hours_v:"штодня 8:30–18:30",
    delivery_note:"Патэлефануйце — параім па складзе, бюджэце і тэрмінах дастаўкі.",

    reviews_h1:"Водгукі кліентаў", rev_1:"Прыгожа, своечасова і пах — захапленне!", rev_2:"Збілі букет пад бюджэт і пажаданні.", rev_buyer:"Пакупнік",

    faq_h1_a:"Адказы", faq_h1_b:"на пытанні",
    faq_q1:"Як аформіць заказ?", faq_a1:"Абярыце букет у каталогу, дадайце ў кошык і пакіньце заяўку. Мы звяжамся і ўзгоднім дастаўку.",
    faq_q2:"Рабіце індывідуальныя кампазіцыі?", faq_a2:"Так. Пад бюджэт, колеры і нагоду. Падбяром свежыя сезонныя кветкі.",
    faq_q3:"Як працуе дастаўка па горадзе?", faq_a3:"Дастаўляем па Хойніках у дзень заказу (калі ёсць кветкі). Ёсць самавываз: вул. Жукава, 2Л.",

    contact_h1_a:"Звяжыцеся", contact_h1_b:"з намі",
    contact_name:"Імя", contact_email:"Email", contact_phone:"Тэлефон", contact_msg:"Паведамленне", contact_submit:"Адправіць",

    f_quick:"Хуткія спасылкі", f_home:"Галоўная", f_about:"Пра нас", f_catalog:"Каталог", f_reviews:"Водгукі", f_contacts:"Кантакты",
    f_services:"Паслугі", f_s1:"Заказ і дастаўка букетаў — Хойнікі", f_s2:"Букеты/кампазіцыі: ад класікі да экзотыкі", f_s3:"Букет нявесты", f_s4:"Вясельны дэкор",
    f_address_t:"Адрас", f_address_v1:"вуліца Жукава, 2Л", f_address_v2:"г. Хойнікі, 247618", f_address_v3:"Беларусь",
    f_contact_t:"Кантакты", f_feedback:"Форма зваротнай сувязі",

    rights:"Усе правы абаронены.",
    cart_title:"Кошык", cart_total_label:"Разам:", cart_checkout:"Аформіць заказ",
    order_title:"Афармленне заказу",
    order_name_label:"Імя*", order_phone_label:"Тэлефон*",
    order_dt_label:"Дастаўка або самавываз*", order_dt_delivery:"Дастаўка", order_dt_pickup:"Самавываз",
    order_address_label:"Адрас (калі дастаўка)", order_when_label:"Жаданыя дата і час",
    order_comment_label:"Каментары", order_hint:"Пасля пацвярджэння вы атрымаеце рэквізіты для аплаты або аплаціце пры атрыманні.",
    order_submit:"Адправіць заяўку", order_success:"Дзякуй! Заяўка адпраўлена.",
    order_error_empty:"Кошык пусты.", order_error_send:"Не ўдалося адправіць. Паспрабуйце яшчэ раз або патэлефануйце.",

    add_to_cart:"У кошык", wishlist_title:"У абраныя", share_title:"Падзяліцца"
  }
};
const t = (key) => (I18N[state.lang] && I18N[state.lang][key]) || I18N.ru[key] || key;

function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{ el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el=>{ el.setAttribute("placeholder", t(el.dataset.i18nPlaceholder)); });
  const cartLabel = document.querySelector("#cartOffcanvasLabel");
  if (cartLabel) cartLabel.textContent = t("cart_title");
  const cartCheckout = document.querySelector("#openOrderModal");
  if (cartCheckout) cartCheckout.textContent = t("cart_checkout");
}

/* ===== Theme ===== */
function getPreferredTheme(){
  const saved = localStorage.getItem("pt_theme");
  if (saved) return saved;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function setTheme(theme){
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("pt_theme", theme);
  updateThemeIcons(theme);
}
function toggleTheme(){
  const next = (document.documentElement.getAttribute("data-theme") === "dark") ? "light" : "dark";
  setTheme(next);
}
function updateThemeIcons(theme){
  document.querySelectorAll("#themeToggle i, #themeToggleFooter i").forEach(icon=>{
    icon.className = "fa-solid " + (theme === "dark" ? "fa-sun" : "fa-moon");
  });
}

/* ===== State ===== */
const BYN = (n) => `${(Number(n) || 0).toFixed(2)} BYN`;
const el = (sel) => document.querySelector(sel);
const els = (sel) => document.querySelectorAll(sel);

const state = {
  lang: localStorage.getItem("pt_lang") || document.documentElement.lang || "ru",
  products: [],
  filtered: [],
  cart: loadCart()
};

function setLang(lang){
  state.lang = (lang === "be" ? "be" : "ru");
  localStorage.setItem("pt_lang", state.lang);
  document.documentElement.lang = state.lang;
  ["#langSelect","#langSelectFooter"].forEach(id=>{
    const s = el(id); if (s) s.value = state.lang;
  });
  applyI18n();
  renderProducts();
}

/* ===== Flower Preloader control ===== */
const Preloader = (() => {
  const root = document.getElementById("flower-pre");
  let hideTimer = 0;

  function start(){
    if (!root) return;
    root.classList.remove("flower-pre--out");
    clearTimeout(hideTimer);
  }
  function done(){
    if (!root) return;
    root.classList.add("flower-pre--out");
    hideTimer = setTimeout(() => root.remove(), 650);
  }

  // Fail-safe: чтобы не зависал
  setTimeout(() => { if (document.getElementById("flower-pre")) done(); }, 12000);

  return { start, done };
})();


/* ===== Cart ===== */
function loadCart(){ try { return JSON.parse(localStorage.getItem("pt_cart") || '{"items":[]}'); } catch { return { items: [] }; } }
function saveCart(){ localStorage.setItem("pt_cart", JSON.stringify(state.cart)); updateCartUI(); }
function addToCart(prod){
  if (!prod) return;
  const idx = state.cart.items.findIndex(i => i.sku === prod.sku);
  if (idx >= 0) state.cart.items[idx].qty += 1;
  else state.cart.items.push({ sku: prod.sku, title: prod.title, price: prod.price, image: prod.image, qty: 1 });
  saveCart();
  bootstrap.Offcanvas.getOrCreateInstance(el("#cartOffcanvas")).show();

}
function removeFromCart(sku){ state.cart.items = state.cart.items.filter(i => i.sku !== sku); saveCart(); }
function changeQty(sku, delta){
  const it = state.cart.items.find(i => i.sku === sku);
  if (!it) return; it.qty = Math.max(1, it.qty + delta); saveCart();
}
function cartTotal(){ return state.cart.items.reduce((s, i) => s + i.price * i.qty, 0); }
function updateCartUI(){
  const list = el("#cartList");
  list.innerHTML = "";

  if (!state.cart.items.length) {
    list.innerHTML = `<li class="list-group-item text-center text-muted">${t("order_error_empty")}</li>`;
    el("#openOrderModal").disabled = true;
  } else el("#openOrderModal").disabled = false;

  state.cart.items.forEach(i => {
    const li = document.createElement("li");
    li.className = "list-group-item d-flex align-items-center";
    li.innerHTML = `
      <img src="${i.image || './assets/productsimg5.webp'}" class="me-3" style="width:56px;height:56px;object-fit:cover;border-radius:6px" alt="">
      <div class="flex-grow-1">
        <div class="fw-semibold">${i.title}</div>
        <div class="text-muted small">${BYN(i.price)} × ${i.qty}</div>
      </div>
      <div class="btn-group btn-group-sm ms-2" role="group">
        <button class="btn btn-outline-secondary" data-act="dec" data-sku="${i.sku}">−</button>
        <button class="btn btn-outline-secondary" disabled>${i.qty}</button>
        <button class="btn btn-outline-secondary" data-act="inc" data-sku="${i.sku}">+</button>
      </div>
      <button class="btn btn-link text-danger ms-2" data-act="del" data-sku="${i.sku}" title="Удалить">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    list.appendChild(li);
  });

  el("#cartTotal").textContent = BYN(cartTotal());
  const count = state.cart.items.reduce((s,i)=>s+i.qty,0);
  el("#cartCount").textContent = count;
  el("#cartCountInline").textContent = count;

  list.querySelectorAll("[data-act]").forEach(b=>{
    b.onclick = () => {
      const sku = b.getAttribute("data-sku");
      const act = b.getAttribute("data-act");
      if (act === "inc") changeQty(sku, +1);
      if (act === "dec") changeQty(sku, -1);
      if (act === "del") removeFromCart(sku);
    };
  });

  el("#cart_json") && (el("#cart_json").value = JSON.stringify(state.cart));
}

/* ===== Fetch products from Sheets ===== */
async function fetchText(url){
  if (!url || url === "PASTE_SHEET_URL_HERE") return null;
  const res = await fetch(url);
  return await res.text();
}
function parseCSV(text){
  const rows = text.trim().split(/\r?\n/).map(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(s => s.replace(/^"|"$/g,'')));
  const headers = rows.shift().map(h => h.trim());
  return rows.map(r => Object.fromEntries(r.map((v,i)=>[headers[i], v])));
}
function parseGViz(text){
  const json = JSON.parse(text.replace(/^[^{]+\(/,'').replace(/\);?$/,''));
  const cols = json.table.cols.map(c => c.label || c.id);
  return json.table.rows.map(r => {
    const obj = {};
    r.c.forEach((cell,i)=>{ obj[cols[i]] = cell ? (cell.f ?? cell.v) : ""; });
    return obj;
  });
}

// Достаём fileId из любой drive-ссылки
function extractDriveId(url) {
  if (!url) return "";
  // уже uc?export=... с id=...
  const m0 = String(url).match(/[?&]id=([-\w]{25,})/);
  if (m0) return m0[1];

  try {
    const u = new URL(url);
    // формат /file/d/<ID>/view
    const m1 = u.pathname.match(/\/d\/([-\w]{25,})/);
    if (m1) return m1[1];
  } catch (_) {}

  // фолбэк: берём похожий на ID фрагмент
  const m2 = String(url).match(/[-\w]{25,}/);
  return m2 ? m2[0] : "";
}

// Собираем 2 вида ссылок: primary (thumbnail) и fallback (uc=view)
function buildDriveImageURLs(fileId, size = 1200) {
  if (!fileId) return { primary: "", fallback: "" };
  return {
    // Возвращает image/jpeg → не вызывает CORB
    primary: `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`,
    // Фолбэк на случай недоступности thumbnail
    fallback: `https://drive.google.com/uc?export=view&id=${fileId}`
  };
}

/* ===== Overlay helpers (Modal/Offcanvas) ===== */
function closeOverlays(){
  const orderModalEl    = el("#orderModal");
  const cartOffcanvasEl = el("#cartOffcanvas");

  try { if (orderModalEl)    bootstrap.Modal.getOrCreateInstance(orderModalEl).hide(); } catch(_) {}
  try { if (cartOffcanvasEl) bootstrap.Offcanvas.getOrCreateInstance(cartOffcanvasEl).hide(); } catch(_) {}
}

/* ===== Toast helper (с иконками) ===== */
/* ===== Toast: гарантированно создаём и показываем ===== */
function ensureToastDOM(){
  if (document.getElementById("globalToast")) return;

  const wrap = document.createElement("div");
  wrap.className = "position-fixed top-0 start-50 translate-middle-x p-3";
  wrap.style.zIndex = "2000";
  wrap.innerHTML = `
    <div id="globalToast" class="toast align-items-center border-0 shadow" role="status" aria-live="polite" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i id="globalToastIcon" class="fa-solid" aria-hidden="true"></i>
          <span id="globalToastBody"></span>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
}

function showToast(message, type = "success"){
  ensureToastDOM();

  const toastEl = document.getElementById("globalToast");
  const bodyEl  = document.getElementById("globalToastBody");
  const iconEl  = document.getElementById("globalToastIcon");

  if (!toastEl || !bodyEl) {
    // жёсткий фолбэк, если что-то пошло совсем не так
    alert(message);
    return;
  }

  const ok = (type === "success");
  toastEl.classList.remove("text-bg-success","text-bg-danger");
  toastEl.classList.add(ok ? "text-bg-success" : "text-bg-danger");

  if (iconEl){
    iconEl.className = "fa-solid " + (ok ? "fa-circle-check" : "fa-triangle-exclamation");
  }
  bodyEl.textContent = message;

  try {
    const inst = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 4000, autohide: true });
    // если только что показывали — перезапустим анимацию
    toastEl.classList.remove("show");
    // небольшой таймаут даёт Bootstrap корректно пересчитать состояние
    setTimeout(() => inst.show(), 20);
  } catch {
    // на случай отсутствия Bootstrap
    alert(message);
  }
}


/* ===== Redirect helper ===== */
function redirectHome(status){
  const url = new URL(window.location.href);
  url.searchParams.set("status", status); // ok | fail
  url.hash = "#top";
  // небольшая пауза даёт Bootstrap анимациям закрытия завершиться
  window.setTimeout(() => { window.location.assign(url.toString()); }, 160);
}

// Принимаем share-ссылку и возвращаем {primary, fallback}
function normalizeDriveURL(url, size = 1200) {
  const id = extractDriveId(url);
  return id ? buildDriveImageURLs(id, size) : { primary: url || "", fallback: "" };
}

function normalizeProducts(rows){
  const M = CONFIG.COLUMN_MAP;
  return rows.map(r => {
    const rawImg = String(r[M.image] ?? "").trim();
    const img = normalizeDriveURL(rawImg, 1400); // можно варьировать ширину
    return {
      sku: String(r[M.sku] ?? "").trim(),
      title: String(r[M.title] ?? "").trim(),
      price: Number(String(r[M.price]).replace(',', '.')),
      old_price: Number(String(r[M.old_price]).replace(',', '.')) || null,
      image: img.primary,                // thumbnail-ссылка (image/jpeg)
      image_fallback: img.fallback,      // uc?export=view
      category: String(r[M.category] ?? "").trim(),
      active: String(r[M.active] ?? "true").toLowerCase() !== "false",
      discount: String(r[M.discount] ?? "").trim()
    };
  }).filter(p => p.title && p.active);
}

async function loadProducts(){
  let text = null, rows = null;
  try{
    const url = withGid(CONFIG.SHEET_URL, CONFIG.SHEETS.PRODUCTS_GID);
    text = await fetchText(url);
    if (text) {
      if (text.startsWith("/*O_o*/")) rows = parseGViz(text);
      else if (text.trim().startsWith("[")) rows = JSON.parse(text);
      else rows = parseCSV(text);
    }
  }catch(e){ console.warn("Не удалось прочитать таблицу, использую демо-товары.", e); }
  if (!rows) rows = [
    { sku:"B001", title:"Букет роз Нежность", price:"49", old_price:"59", image:"./assets/productsimg1.webp", category:"Розы", active:"true", discount:"-17%" },
    { sku:"B002", title:"Букет тюльпан",      price:"35", old_price:"",   image:"./assets/productsimg2.webp", category:"Тюльпаны", active:"true", discount:"" },
    { sku:"B003", title:"Букет пионей",       price:"55", old_price:"65", image:"./assets/productsimg3.webp", category:"Пионы", active:"true", discount:"-15%" }
  ];
  state.products = normalizeProducts(rows);
  state.filtered = [...state.products];

  const cats = Array.from(new Set(state.products.map(p => p.category).filter(Boolean))).sort();
  const catSel = el("#categorySelect"); catSel.innerHTML = `<option value="">${t("filters_all_categories")}</option>`;
  cats.forEach(c => {
    const o = document.createElement("option"); o.value = c; o.textContent = c; catSel.appendChild(o);
  });

  renderProducts();
}


/* ===== Render products ===== */
function renderProducts(){
  const grid = el("#products-grid"); grid.innerHTML = "";
  const list = state.filtered;
  if (!list.length){ el("#emptyCatalog").classList.remove("d-none"); return; }
  el("#emptyCatalog").classList.add("d-none");

  list.forEach(p => {
    const col = document.createElement("div");
    col.className = "col-sm-6 col-lg-4 mb-4";
    col.innerHTML = `
      <div class="innerproductsection h-100 d-flex flex-column">
        ${p.discount ? `<span class="discount">${p.discount}</span>` : ""}
        <img src="${p.image || './assets/productsimg5.webp'}"
             alt="${p.title}"
             loading="lazy"
             referrerpolicy="no-referrer">
        <div class="cartcontainer">
          <button class="wishlist" title="${t("wishlist_title")}"><i class="fa-solid fa-heart"></i></button>
          <button class="btn add-to-cart" data-sku="${p.sku}">${t("add_to_cart")} <i class="fa-solid fa-cart-plus"></i></button>
          <button class="share" title="${t("share_title")}"><i class="fa-solid fa-share"></i></button>
        </div>
        <h2>${p.title}</h2>
        <h1 class="price">
          <span class="clrchange">${BYN(p.price)}</span>
          ${p.old_price ? `<del>${BYN(p.old_price)}</del>` : ""}
        </h1>
      </div>
    `;
    grid.appendChild(col);

    // Фолбэк на uc?export=view при 403/404/CORB и т.п.
    const imgEl = col.querySelector("img");
    imgEl.addEventListener("error", () => {
      if (imgEl.dataset.fallbackTried) return;
      imgEl.dataset.fallbackTried = "1";
      if (p.image_fallback && imgEl.src !== p.image_fallback) {
        imgEl.src = p.image_fallback;
      }
    });
  });

  grid.querySelectorAll(".add-to-cart").forEach(btn=>{
    btn.addEventListener("click", e=>{
      const sku = e.currentTarget.dataset.sku;
      const prod = state.products.find(x => x.sku === sku);
      addToCart(prod);
    });
  });
}


/* ===== Filters ===== */
function applyFilters(){
  const q = el("#searchInput").value.trim().toLowerCase();
  const cat = el("#categorySelect").value;
  state.filtered = state.products.filter(p => {
    const okQ = !q || p.title.toLowerCase().includes(q);
    const okC = !cat || p.category === cat || (cat && p.category.toLowerCase().includes(cat.toLowerCase()));
    return okQ && okC;
  });
  renderProducts();
}
function resetFilters(){
  el("#searchInput").value = "";
  el("#categorySelect").value = "";
  state.filtered = [...state.products];
  renderProducts();
}
function setCategory(catVal){
  const sel = el("#categorySelect");
  sel.value = catVal;
  applyFilters();
}

/* ===== Order / Contact ===== */

// Надёжная отправка заказа: сначала CORS (нормально читаем ответ),
// если браузер блокирует — no-cors (opaque, но запрос уходит),
// в крайнем случае sendBeacon (fire-and-forget).
async function postOrder(payload){
  const url = CONFIG.GS_WEB_APP_URL;

  // 1) Проверяем, что URL действительно Apps Script /exec
  const okURL = typeof url === "string" && /^https:\/\/script\.google\.com\/macros\/s\/[-\w]+\/exec(\?.*)?$/.test(url);
  if (!okURL) return { status: "fail", reason: "invalid_url" };

  // 2) Отправляем ТОЛЬКО с CORS и ждём нормальный ответ
  const res = await fetch(url, {
    method: "POST",
    // сохраняем совместимость с вашим беком (как было у вас)
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(payload),
    mode: "cors",
    cache: "no-store",
    keepalive: true
  });

  if (!res.ok) return { status: "fail", code: res.status };

  // 3) Подтверждаем по JSON: { ok: true } или { status: "ok" }
  let data = null;
  try { data = await res.json(); } catch(_) {}

  if (data && (data.ok === true || data.status === "ok")) {
    return { status: "ok", server: data };
  }

  // Никакого подтверждения от сервера — считаем неуспехом
  return { status: "fail", reason: "bad_response", server: data };
}


async function submitOrder(e){
  e.preventDefault();

  // Сохраняем стабильные ссылки ДО await/закрытия модалок
  const form     = e.currentTarget || el("#orderForm");
  const errEl    = el("#orderError");
  const submitBtn= el("#submitOrderBtn");

  if (errEl) errEl.classList.add("d-none");

  const data = Object.fromEntries(new FormData(form).entries());
  const orderId = "ORD-" + Date.now() + "-" + Math.floor(Math.random()*1e6);

  const payload = {
    order: {
      id: orderId,
      name: data.name || "",
      phone: data.phone || "",
      delivery_type: data.delivery_type || "delivery",
      address: data.address || "",
      date_time: data.date_time || "",
      comment: data.comment || "",
      total_byn: cartTotal()
    },
    items: state.cart.items
  };

  if (!payload.items.length){
    if (errEl) {
      errEl.textContent = t("order_error_empty");
      errEl.classList.remove("d-none");
    }
    return;
  }

  // Кнопка: спиннер/блокировка — по возможности
  const prevHTML = submitBtn ? submitBtn.innerHTML : "";
  if (submitBtn){
    submitBtn.disabled = true;
    submitBtn.setAttribute("aria-busy","true");
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> ${t("order_submit")}`;
  }

  try{
    const result = await postOrder(payload);

    if (result.status === "ok"){
      // Только подтверждённый успех закрывает UI
      closeOverlays();
      state.cart.items = []; 
      saveCart();
      if (form) form.reset();
      showToast(t("order_success") + ` (№ ${orderId})`, "success");
    } else {
      if (errEl){
        errEl.textContent = t("order_error_send");
        errEl.classList.remove("d-none");
      }
      showToast(t("order_error_send"), "danger");
    }

  } finally{
    if (submitBtn){
      submitBtn.disabled = false;
      submitBtn.removeAttribute("aria-busy");
      submitBtn.innerHTML = prevHTML;
    }
  }
}


function submitContact(e){
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.currentTarget).entries());
  alert((state.lang === "be" ? "Дзякуй! Мы звяжамся: " : "Спасибо! Мы свяжемся: ") + (data.phone || data.email || ""));
  e.currentTarget.reset();
}

/* ===== Init ===== */
$(document).ready(function () {
  $(".owl-carousel").owlCarousel({
    autoplay:true, margin:30, loop:true, dots:true, nav:true,
    navText:["<i class='fas fa-long-arrow-alt-left'></i>","<i class='fas fa-long-arrow-alt-right'></i>"],
    responsive:{0:{items:1},600:{items:2},1000:{items:3}}
  });
});

/* ===== Topbar: текст/скорость/вкл-выкл из листа «Инфо», закрытие без запоминания ===== */
function pickLangCol(headers, lang){
  const low = headers.map(h=>h.toLowerCase());
  let idx = low.findIndex(h => h === lang);
  if (idx<0) idx = low.findIndex(h => h.endsWith("_"+lang));
  if (idx<0) idx = low.findIndex(h => /^(value|msg|text|content)$/.test(h));
  if (idx<0) idx = headers[1] ? 1 : 0;
  return headers[idx];
}

function findKeyCol(headers){
  const low = headers.map(h=>h.toLowerCase());
  const candidates = ["key","name","id","slug","code"];
  const idx = candidates.map(k=>low.indexOf(k)).find(i=>i>=0);
  return idx>=0 ? headers[idx] : null;
}
function isTruthy(v){
  return /^(1|true|yes|on|да|вкл|enable|enabled)$/i.test(String(v).trim());
}
function findCol(headers, ...names){
  const low = headers.map(h=>String(h).toLowerCase().trim());
  for (const name of names.flat()){
    const i = low.indexOf(String(name).toLowerCase());
    if (i >= 0) return headers[i];
  }
  return null;
}
function isTruthy(v){
  return /^(1|true|yes|on|да|вкл|enable|enabled)$/i.test(String(v).trim());
}
function phoneToHref(raw){
  const hasPlus = /\+/.test(raw);
  const digits  = String(raw).replace(/\D/g,'');
  return "tel:" + (hasPlus ? "+" : "") + digits;
}

/** Устанавливаем все динамические контакты на странице */
function updateContactsDynamic({ address, phone, hours, company, unp }){
  // Доставка (карточка)
  const addrEl = el("#deliveryAddress");
  const phoneEl = el("#phoneLink");
  const hoursEl = el("#deliveryHours");

  if (address && addrEl) addrEl.textContent = address;
  if (hours && hoursEl)  hoursEl.textContent = hours;
  if (phone && phoneEl){
    phoneEl.textContent = phone;
    phoneEl.setAttribute("href", phoneToHref(phone));
  }

  // Подвал: адрес и телефон
  const fAddrEl = el("#footerAddress");
  const fPhoneEl = el("#footerPhone");
  if (address && fAddrEl) fAddrEl.textContent = address;
  if (phone && fPhoneEl){
    fPhoneEl.textContent = phone;
    fPhoneEl.setAttribute("href", phoneToHref(phone));
  }

  // Подвал: владелец + УНП (локализуем подпись)
  const legalEl = el("#legalOwner");
  if (legalEl && (company || unp)){
    const ownerLabel = (state.lang === "be")
      ? "Уладальнік"
      : "Владелец";
    const unpLabel = "УНП";
    const companyTxt = company || "";
    const unpTxt = unp ? ` ${unpLabel}: ${String(unp).trim()}` : "";
    legalEl.textContent = `${ownerLabel}: ${companyTxt}${unpTxt}`;
  }
}

/* ===== Topbar: msg + active из строки topbar_msg на листе «Инфо» ===== */
async function initTopbarFromSheet(){
  const bar = el("#topbar");
  const mq  = el("#topbarMarquee");
  const btn = el("#topbarClose");
  if (!bar || !mq) return;

  const html = document.documentElement;
  const LS_DISMISS = "pt_topbar_dismissed_until";
  const until = Number(localStorage.getItem(LS_DISMISS) || 0);
  if (Date.now() < until){
    bar.classList.add("topbar--out");
    html.classList.add("topbar-closed");
  }

  btn && btn.addEventListener("click", ()=>{
    bar.classList.add("topbar--out");
    html.classList.add("topbar-closed");
    const d = new Date(); d.setDate(d.getDate()+3);
    localStorage.setItem(LS_DISMISS, String(d.getTime()));
  });

  // читаем «Инфо»
  try{
    const url  = withGid(CONFIG.SHEET_URL, CONFIG.SHEETS.META_GID);
    const text = await fetchText(url);
    if (!text) return;

    const rows = text.startsWith("/*O_o*/") ? parseGViz(text)
               : text.trim().startsWith("[") ? JSON.parse(text)
               : parseCSV(text);
    if (!rows?.length) return;

    const headers = Object.keys(rows[0]);
    const keyCol  = findKeyCol(headers);                  // key/name/...
    const valCol  = pickLangCol(headers, state.lang);     // ru/be/value/...
    const actCol  = findCol(headers, "active");

    // Словарь по ключу
    const norm = s => String(s ?? "").trim().toLowerCase();
    const byKey = {};
    rows.forEach(r => {
      const k = keyCol ? norm(r[keyCol]) : "";
      if (k) byKey[k] = r;
    });
    const get = (k) => {
      const r = byKey[norm(k)];
      if (!r) return "";
      const v = r[valCol] ?? r.ru ?? r.be ?? r.value ?? r.msg ?? r.text ?? "";
      return String(v ?? "").trim();
    };
    const isActive = (rec) => (actCol && rec) ? isTruthy(rec[actCol]) : true;

    // ---- Topbar (msg + active) ----
    const tb = byKey["topbar_msg"] || rows[0];
    if (!tb || !isActive(tb)){
      bar.classList.add("topbar--out");
      html.classList.add("topbar-closed");
    } else {
      const msg = get("topbar_msg");
      if (msg) mq.textContent = msg;
      else {
        bar.classList.add("topbar--out");
        html.classList.add("topbar-closed");
      }
    }

    // ---- Контакты/адрес/часы/УНП ----
    updateContactsDynamic({
      address: get("address"),
      phone:   get("phone"),
      hours:   get("hours"),
      company: get("company_name"),
      unp:     get("unp")
    });

  } catch(e){
    console.warn("Topbar/Meta read failed", e);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  // Year
  el("#year").textContent = new Date().getFullYear();

  // Theme
  setTheme(getPreferredTheme());
  els("#themeToggle, #themeToggleFooter").forEach(b => b.addEventListener("click", toggleTheme));

  // Language
  setLang(state.lang);
  ["#langSelect","#langSelectFooter"].forEach(id=>{
    const s = el(id); if (s){ s.value = state.lang; s.addEventListener("change", e => setLang(e.target.value)); }
  });
  applyI18n();

  // Filters
  el("#searchInput").addEventListener("input", applyFilters);
  el("#categorySelect").addEventListener("change", applyFilters);
  el("#resetFilters").addEventListener("click", resetFilters);

  // Chips -> category filter
  document.addEventListener("click", (e)=>{
    const chip = e.target.closest(".chip-cat");
    if (!chip) return;
    setCategory(chip.dataset.cat || "");
  });

  // Forms
  el("#orderForm").addEventListener("submit", submitOrder);
  el("#contactForm").addEventListener("submit", submitContact);

  Preloader.start();
  await initTopbarFromSheet(); 
  await loadProducts();
  updateCartUI();
  Preloader.done();

  // Localize dynamic placeholders
  el("#searchInput").setAttribute("placeholder", t("filters_search_placeholder"));

  // Показать уведомление после редиректа (и очистить URL)
  const params = new URLSearchParams(window.location.search);
  const st = params.get("status");
  if (st === "ok") {
    showToast(t("order_success"), "success");
  } else if (st === "fail") {
    showToast(t("order_error_send"), "danger");
  }
  if (st) {
    history.replaceState({}, "", window.location.pathname + window.location.hash);
  }


});
