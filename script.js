// =====================================================================
// CONFIG — buraları kendi bilgilerinle değiştir
// =====================================================================
// 1) https://web3forms.com adresine git, e-postanla ücretsiz bir "Access Key" oluştur.
// 2) O anahtarı aşağıya yapıştır. Bu sayede müşteri "Siparişi Gönder"e bastığında
//    hiçbir uygulama açılmadan, doğrudan senin e-postana otomatik bildirim düşer.
const WEB3FORMS_ACCESS_KEY = "YOUR_WEB3FORMS_ACCESS_KEY";

const ORDER_WHATSAPP_NUMBER = "201213773921"; // yedek "WhatsApp'tan yaz" linki için

// =====================================================================
// Mobile nav toggle
// =====================================================================
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// =====================================================================
// Footer year
// =====================================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// =====================================================================
// Toast
// =====================================================================
const toastEl = document.getElementById("toast");
let toastTimer = null;

function showToast(message) {
  if (!toastEl) return;
  toastEl.textContent = message;
  toastEl.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.classList.remove("is-visible");
  }, 3200);
}

// =====================================================================
// CART — state + persistence
// =====================================================================
const CART_KEY = "blackcore_cart";

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (e) {
    /* localStorage unavailable, cart just won't persist */
  }
}

let cart = loadCart();

// --- DOM refs ---
const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");
const cartClose = document.getElementById("cartClose");
const cartCountEl = document.getElementById("cartCount");
const cartItemsEl = document.getElementById("cartItems");
const cartEmptyEl = document.getElementById("cartEmpty");
const cartSummaryEl = document.getElementById("cartSummary");
const cartTotalEl = document.getElementById("cartTotal");
const cartCheckoutEl = document.getElementById("cartCheckout");
const checkoutEmail = document.getElementById("checkoutEmail");
const checkoutNote = document.getElementById("checkoutNote");
const checkoutError = document.getElementById("checkoutError");
const sendOrderBtn = document.getElementById("sendOrder");
const sendOrderLabel = document.getElementById("sendOrderLabel");
const sendWhatsappAlt = document.getElementById("sendWhatsappAlt");

function openCart() {
  cartDrawer.classList.add("is-open");
  cartOverlay.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartOverlay.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
}

if (cartToggle) cartToggle.addEventListener("click", openCart);
if (cartClose) cartClose.addEventListener("click", closeCart);
if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

function findItem(id) {
  return cart.find((item) => item.id === id);
}

function addToCart(id, name, price, tag) {
  const existing = findItem(id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, tag, qty: 1 });
  }
  saveCart(cart);
  renderCart();
  bumpBadge();
  showToast(`${name} sepete eklendi`);
}

function changeQty(id, delta) {
  const item = findItem(id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter((i) => i.id !== id);
  }
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart(cart);
  renderCart();
}

function bumpBadge() {
  if (!cartCountEl) return;
  cartCountEl.classList.remove("bump");
  void cartCountEl.offsetWidth; // restart animation
  cartCountEl.classList.add("bump");
}

function cartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function cartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function renderCart() {
  const count = cartCount();
  if (cartCountEl) cartCountEl.textContent = String(count);

  updateWhatsappAlt();

  if (!cartItemsEl) return;

  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartEmptyEl.hidden = false;
    cartSummaryEl.hidden = true;
    cartCheckoutEl.hidden = true;
    return;
  }

  cartEmptyEl.hidden = true;
  cartSummaryEl.hidden = false;
  cartCheckoutEl.hidden = false;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${escapeHtml(item.name)}</div>
        <div class="cart-item-tag">${escapeHtml(item.tag)} · ~${item.price}₺/adet</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" data-action="dec" data-id="${item.id}" aria-label="Azalt">−</button>
        <span class="qty-value">${item.qty}</span>
        <button class="qty-btn" data-action="inc" data-id="${item.id}" aria-label="Artır">+</button>
      </div>
      <button class="cart-item-remove" data-action="remove" data-id="${item.id}" aria-label="Kaldır">✕</button>
    `;
    cartItemsEl.appendChild(li);
  });

  cartTotalEl.textContent = `~${cartTotal()}₺`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

if (cartItemsEl) {
  cartItemsEl.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if (action === "inc") changeQty(id, 1);
    if (action === "dec") changeQty(id, -1);
    if (action === "remove") removeItem(id);
  });
}

document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { id, name, price, tag } = btn.dataset;
    addToCart(id, name, Number(price), tag);
    openCart();
  });
});

// =====================================================================
// CHECKOUT — build order text, auto-notify via Web3Forms, WhatsApp fallback
// =====================================================================
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildOrderText() {
  const lines = [];
  lines.push("Yeni Sipariş! - Blackcore");
  lines.push("");
  lines.push("Ürünler:");
  cart.forEach((item) => {
    lines.push(`- ${item.name} x${item.qty} (~${item.price * item.qty}₺)`);
  });
  lines.push("");
  lines.push(`Tahmini toplam: ~${cartTotal()}₺ (kesin fiyat onay sonrası)`);
  lines.push("");
  lines.push(`Müşteri e-posta: ${checkoutEmail.value.trim()}`);
  if (checkoutNote.value.trim()) {
    lines.push(`Not: ${checkoutNote.value.trim()}`);
  }
  return lines.join("\n");
}

function updateWhatsappAlt() {
  if (!sendWhatsappAlt) return;
  const text = encodeURIComponent(buildOrderText());
  sendWhatsappAlt.href = `https://wa.me/${ORDER_WHATSAPP_NUMBER}?text=${text}`;
}

function validateCheckout() {
  if (cart.length === 0) return false;
  const email = checkoutEmail.value.trim();
  if (!isValidEmail(email)) {
    checkoutError.hidden = false;
    checkoutEmail.focus();
    return false;
  }
  checkoutError.hidden = true;
  return true;
}

async function sendOrderAutomatically() {
  const email = checkoutEmail.value.trim();
  const note = checkoutNote.value.trim();
  const orderText = buildOrderText();

  const payload = {
    access_key: WEB3FORMS_ACCESS_KEY,
    subject: "Yeni Sipariş! - Blackcore",
    from_name: "Blackcore Sipariş Botu",
    replyto: email,
    message: orderText,
    "Müşteri E-posta": email,
    Not: note || "—",
  };

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!data.success) throw new Error(data.message || "Gönderim başarısız");
}

if (sendOrderBtn) {
  sendOrderBtn.addEventListener("click", async () => {
    if (!validateCheckout()) return;

    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === "YOUR_WEB3FORMS_ACCESS_KEY") {
      showToast("Site sahibi otomatik bildirimi henüz bağlamadı — WhatsApp linkiyle gönder");
      return;
    }

    sendOrderBtn.disabled = true;
    sendOrderLabel.textContent = "Gönderiliyor…";

    try {
      await sendOrderAutomatically();
      showToast("Siparişin iletildi, kısa süre içinde dönüş yapacağız");
      cart = [];
      saveCart(cart);
      renderCart();
      checkoutEmail.value = "";
      checkoutNote.value = "";
      setTimeout(closeCart, 1200);
    } catch (err) {
      showToast("Gönderilemedi, WhatsApp linkinden dene");
    } finally {
      sendOrderBtn.disabled = false;
      sendOrderLabel.textContent = "Siparişi Gönder";
    }
  });
}

// initial paint
renderCart();

// =====================================================================
// Hero signature: reactor core readout
// Cycles like an incoming verification code, then "locks in" — ties
// the brand mark to the virtual-number product without repeating it.
// =====================================================================
const coreDigitsEl = document.getElementById("coreDigits");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function randomCode() {
  const a = Math.floor(Math.random() * 900) + 100;
  const b = Math.floor(Math.random() * 900) + 100;
  return `${a}-${b}`;
}

function runCoreCycle() {
  if (!coreDigitsEl) return;

  if (prefersReducedMotion) {
    coreDigitsEl.textContent = "204-819";
    coreDigitsEl.classList.add("is-verified");
    return;
  }

  coreDigitsEl.classList.remove("is-verified");
  let ticks = 0;
  const maxTicks = 12;

  const interval = setInterval(() => {
    coreDigitsEl.textContent = randomCode();
    ticks += 1;
    if (ticks >= maxTicks) {
      clearInterval(interval);
      coreDigitsEl.textContent = "204-819";
      coreDigitsEl.classList.add("is-verified");
      setTimeout(runCoreCycle, 3800);
    }
  }, 95);
}

runCoreCycle();

// =====================================================================
// Scroll reveal for product cards, process steps, contact cards
// =====================================================================
const revealTargets = document.querySelectorAll(
  ".product-card, .process-step, .contact-card"
);

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  revealTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(16px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((el) => observer.observe(el));
}
