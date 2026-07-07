// ===================================================
// Mobile nav toggle
// ===================================================
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

// ===================================================
// Footer year
// ===================================================
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===================================================
// Hero signature: verification code reel
// Cycles random digits like an incoming OTP, then "locks in"
// and settles on a verified state — echoes the virtual-number product.
// ===================================================
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

    // lock digits in one by one from the left as ticks progress
    const lockedCount = Math.floor((ticks / maxTicks) * otpDigits.length);
    otpDigits.forEach((d, i) => {
      if (i < lockedCount) d.classList.add("locked");
    });

    if (ticks >= maxTicks) {
      clearInterval(interval);
      otpStatus.textContent = "doğrulandı";
      otpStatus.classList.add("is-verified");
      setTimeout(runOtpCycle, 3600);
    }
  }, 90);
}

runOtpCycle();

// ===================================================
// Scroll reveal for product cards, process steps, contact cards
// ===================================================
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
