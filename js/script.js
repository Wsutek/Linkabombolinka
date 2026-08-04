/* =====================================================
   Laurka – interakcje
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- 1. OTWIERANIE KOPERTY ---------- */
  const screenOpen = document.getElementById("screen-open");
  const envelope = document.getElementById("envelope");
  const btnOpen = document.getElementById("btn-open");
  const cardContent = document.getElementById("card-content");

  let opened = false;
  function openCard() {
    if (opened) return;
    opened = true;

    envelope.classList.add("opening");
    burstHearts(window.innerWidth / 2, window.innerHeight / 2, 40);

    setTimeout(() => {
      screenOpen.classList.add("fade-out");
      setTimeout(() => {
        screenOpen.classList.remove("active");
        screenOpen.style.display = "none";
        cardContent.classList.remove("hidden");
        initReveals();
        startLetter();
      }, 550);
    }, 900);
  }

  envelope.addEventListener("click", openCard);
  btnOpen.addEventListener("click", openCard);
  envelope.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openCard(); }
  });

  /* ---------- 2. ANIMOWANY LIST (linijka po linijce) ---------- */
  function startLetter() {
    const lines = document.querySelectorAll("#letter-text p");
    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add("show"), 500 + i * 900);
    });
  }

  /* ---------- REVEAL przy scrollu ---------- */
  function initReveals() {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach((el) => io.observe(el));

    /* Aktywna kropka nawigacji */
    const sections = document.querySelectorAll(".section");
    const dots = document.querySelectorAll(".dots-nav .dot");
    const navIo = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          dots.forEach((d) => d.classList.toggle("active", d.getAttribute("href") === "#" + id));
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => navIo.observe(s));
  }

  /* ---------- 3. KARTECZKI FLIP ---------- */
  document.querySelectorAll(".flip-card").forEach((card) => {
    const toggle = () => {
      card.classList.toggle("flipped");
      if (card.classList.contains("flipped")) {
        const r = card.getBoundingClientRect();
        burstHearts(r.left + r.width / 2, r.top + r.height / 2, 8);
      }
    };
    card.addEventListener("click", toggle);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* ---------- PRZYKRYWKA NSFW (środkowe zdjęcie) ---------- */
  const nsfwBtn = document.getElementById("nsfw-btn");
  const photoCenter = document.getElementById("photo-center");
  if (nsfwBtn && photoCenter) {
    nsfwBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      photoCenter.classList.add("revealed");
      const r = photoCenter.getBoundingClientRect();
      burstHearts(r.left + r.width / 2, r.top + r.height / 2, 12);
    });
  }

  /* ---------- 4. FINAŁ: uciekający "Nie" + "Tak" ---------- */
  const btnNo = document.getElementById("btn-no");
  const btnYes = document.getElementById("btn-yes");
  const finalReveal = document.getElementById("final-reveal");

  let dodgeCount = 0;
  const teases = ["Nie", "Na pewno?", "Pomyśl jeszcze!", "Niemożliwe 😏", "Spróbuj złapać!", "Hehe 😜", "Nawet nie próbuj 💕"];

  function dodge() {
    const btn = btnNo;
    btn.style.position = "fixed";
    const bw = btn.offsetWidth, bh = btn.offsetHeight;
    const maxX = window.innerWidth - bw - 20;
    const maxY = window.innerHeight - bh - 20;
    const x = Math.max(20, Math.random() * maxX);
    const y = Math.max(20, Math.random() * maxY);
    btn.style.left = x + "px";
    btn.style.top = y + "px";

    dodgeCount++;
    btn.textContent = teases[Math.min(dodgeCount, teases.length - 1)];

    // Z każdym razem "Tak" trochę rośnie :) (mniej na małych ekranach)
    const cap = window.innerWidth < 600 ? 1.5 : 2.2;
    const scale = Math.min(1 + dodgeCount * 0.12, cap);
    btnYes.style.transform = `scale(${scale})`;
  }

  btnNo.addEventListener("mouseover", dodge);
  btnNo.addEventListener("click", dodge);
  btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodge(); }, { passive: false });

  btnYes.addEventListener("click", () => {
    finalReveal.classList.remove("hidden");
    btnNo.style.display = "none";
    celebrate();
    finalReveal.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  /* ---------- LICZNIK "RAZEM OD..." ---------- */
  const START_DATE = new Date(2025, 11, 6, 0, 0, 0); // 6 grudnia 2025
  const cDays = document.getElementById("c-days");
  const cHours = document.getElementById("c-hours");
  const cMins = document.getElementById("c-mins");
  const cSecs = document.getElementById("c-secs");
  function updateCounter() {
    let diff = Math.max(0, (Date.now() - START_DATE.getTime()) / 1000);
    const days = Math.floor(diff / 86400); diff -= days * 86400;
    const hours = Math.floor(diff / 3600); diff -= hours * 3600;
    const mins = Math.floor(diff / 60);
    const secs = Math.floor(diff - mins * 60);
    if (cDays) cDays.textContent = days;
    if (cHours) cHours.textContent = hours;
    if (cMins) cMins.textContent = mins;
    if (cSecs) cSecs.textContent = secs;
  }
  if (cDays) { updateCounter(); setInterval(updateCounter, 1000); }

  /* =====================================================
     EFEKTY: konfetti / serduszka na canvasie
     ===================================================== */
  const canvas = document.getElementById("fx-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const EMOJIS = ["❤️", "💖", "💕", "✨", "🎀", "💗", "🌸"];

  function addParticle(x, y) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * -6 - 2,
      g: 0.15 + Math.random() * 0.1,
      life: 1,
      decay: 0.008 + Math.random() * 0.01,
      size: 18 + Math.random() * 22,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      fall: false,
      baseAlpha: 1,
    });
  }

  window.burstHearts = function (x, y, count = 20) {
    for (let i = 0; i < count; i++) addParticle(x, y);
  };

  /* Delikatnie padające serduszka w tle */
  const FALL_EMOJIS = ["❤️", "💖", "💕", "🌸", "🩷"];
  function addFalling() {
    particles.push({
      x: Math.random() * canvas.width,
      y: -30,
      vx: (Math.random() - 0.5) * 0.6,
      vy: 0.6 + Math.random() * 1.1,
      g: 0,
      life: 1,
      decay: 0,
      size: 14 + Math.random() * 16,
      emoji: FALL_EMOJIS[Math.floor(Math.random() * FALL_EMOJIS.length)],
      rot: (Math.random() - 0.5) * 0.6,
      vr: (Math.random() - 0.5) * 0.03,
      fall: true,
      baseAlpha: 0.35 + Math.random() * 0.35,
      sway: Math.random() * Math.PI * 2,
    });
  }
  // co jakiś czas dorzucamy jedno serduszko (limit dla wydajności)
  setInterval(() => {
    if (particles.filter((p) => p.fall).length < 35) addFalling();
  }, 650);

  function celebrate() {
    let bursts = 0;
    const timer = setInterval(() => {
      burstHearts(Math.random() * canvas.width, canvas.height * 0.3, 14);
      if (++bursts > 8) clearInterval(timer);
    }, 250);
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      if (p.fall) {
        p.sway += 0.02;
        p.x += p.vx + Math.sin(p.sway) * 0.5;
        p.y += p.vy;
        p.rot += p.vr;
      } else {
        p.vy += p.g;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vr;
        p.life -= p.decay;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(p.life, 0) * (p.baseAlpha ?? 1);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = p.size + "px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();
    });
    particles = particles.filter((p) => p.life > 0 && p.y < canvas.height + 60);
    requestAnimationFrame(loop);
  }
  loop();
});
