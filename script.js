// =====================================================================
// CONFIG — buraları kendi bilgilerinle değiştir
// =====================================================================
const ORDER_WHATSAPP_NUMBER = "201213773921"; // siparişlerin WhatsApp'tan düşeceği numara (başında + ve boşluk olmadan)
const ORDER_EMAIL_ADDRESS = "siparis@blackcore.com"; // TODO: gerçek sipariş e-postanla değiştir

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
  }, 2600);
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
const sendWhatsappBtn = document.getElementById("sendWhatsapp");
const sendEmailBtn = document.getElementById("sendEmail");

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
  // force reflow so animation can restart
  void cartCountEl.offsetWidth;
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

// event delegation for qty/remove buttons
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

// add-to-cart buttons on product cards
document.querySelectorAll(".add-to-cart").forEach((btn) => {
  btn.addEventListener("click", () => {
    const { id, name, price, tag } = btn.dataset;
    addToCart(id, name, Number(price), tag);
    openCart();
  });
});

// =====================================================================
// CHECKOUT — build order message, send via WhatsApp or email
// =====================================================================
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildOrderText() {
  const lines = [];
  lines.push("🆕 Yeni Sipariş! - Blackcore");
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

if (sendWhatsappBtn) {
  sendWhatsappBtn.addEventListener("click", () => {
    if (!validateCheckout()) return;
    const text = encodeURIComponent(buildOrderText());
    window.open(`https://wa.me/${ORDER_WHATSAPP_NUMBER}?text=${text}`, "_blank");
    showToast("WhatsApp açılıyor, mesajı göndermeyi unutma");
  });
}

if (sendEmailBtn) {
  sendEmailBtn.addEventListener("click", () => {
    if (!validateCheckout()) return;
    const subject = encodeURIComponent("Yeni Sipariş! - Blackcore");
    const body = encodeURIComponent(buildOrderText());
    window.location.href = `mailto:${ORDER_EMAIL_ADDRESS}?subject=${subject}&body=${body}`;
    showToast("E-posta programın açılıyor");
  });
}

// initial paint
renderCart();

// =====================================================================
// Hero signature: verification code reel
// Cycles random digits like an incoming OTP, then "locks in"
// and settles on a verified state — echoes the virtual-number product.
// =====================================================================
const otpDigits = document.querySelectorAll("#otpDigits span:not(:nth-child(4))");
const otpStatus = document.getElementById("otpStatus");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function randomDigit() {
  return Math.floor(Math.random() * 10);
}

function runOtpCycle() {
  if (!otpDigits.length || !otpStatus) return;

  if (prefersReducedMotion) {
    otpDigits.forEach((d, i) => (d.textContent = "204819"[i] || "0"));
    otpStatus.textContent = "doğrulandı";
    otpStatus.classList.add("is-verified");
    return;
  }

  otpStatus.textContent = "kod bekleniyor…";
  otpStatus.classList.remove("is-verified");

  let ticks = 0;
  const maxTicks = 14;

  const interval = setInterval(() => {
    otpDigits.forEach((d) => (d.textContent = randomDigit()));
    ticks += 1;

    if (ticks >= maxTicks) {
      clearInterval(interval);
      otpStatus.textContent = "doğrulandı";
      otpStatus.classList.add("is-verified");
      setTimeout(runOtpCycle, 3600);
    }
  }, 90);
}

runOtpCycle();

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
