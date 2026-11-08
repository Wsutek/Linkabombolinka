document.addEventListener("DOMContentLoaded", () => {
  /* ---------- List: linijka po linijce ---------- */
  document.querySelectorAll(".letter p").forEach((p, i) => {
    setTimeout(() => p.classList.add("show"), 900 + i * 1100);
  });

  /* ---------- Złote iskierki ---------- */
  const canvas = document.getElementById("sparkles");
  const ctx = canvas.getContext("2d");
  let stars = [];
  let bursts = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const STAR_COUNT = window.innerWidth < 700 ? 35 : 60;
  for (let i = 0; i < STAR_COUNT; i++) {
    stars.push({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.6,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.025,
      drift: 0.00005 + Math.random() * 0.0001,
    });
  }

  function goldBurst(x, y, count = 60) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 1.5 + Math.random() * 4.5;
      bursts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1.5, life: 1, r: 1 + Math.random() * 2.2 });
    }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.phase += s.speed;
      s.y -= s.drift;
      if (s.y < -0.02) s.y = 1.02;
      ctx.globalAlpha = 0.25 + 0.6 * (0.5 + 0.5 * Math.sin(s.phase));
      ctx.fillStyle = "#f3dfa8";
      ctx.beginPath();
      ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const b of bursts) {
      b.vy += 0.07;
      b.vx *= 0.985;
      b.x += b.vx;
      b.y += b.vy;
      b.life -= 0.012;
      ctx.globalAlpha = Math.max(b.life, 0);
      ctx.fillStyle = b.r > 2 ? "#fff3cf" : "#d9b56c";
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }
    bursts = bursts.filter((b) => b.life > 0);
    ctx.globalAlpha = 1;
    if (!document.hidden) requestAnimationFrame(loop);
  }
  document.addEventListener("visibilitychange", () => { if (!document.hidden) requestAnimationFrame(loop); });
  requestAnimationFrame(loop);

  /* ---------- Sztuczka: każda karta to "wymuszona" karta ---------- */
  const MAIN = '<span class="big">19:00</span><span class="emoji">✨</span><span class="label">Dziś wieczorem</span>';
  const OTHERS = [
    '<span class="emoji">🏡</span><span class="label">Nasz wspólny dom</span>',
    '<span class="emoji">💛</span><span class="label">Ty i ja</span>',
  ];

  const deck = document.getElementById("deck");
  const cards = [...deck.querySelectorAll(".pcard")];
  const revealBox = document.getElementById("reveal-box");

  function centerOf(el) {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  }

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (deck.classList.contains("picked")) return;
      deck.classList.add("picked");

      card.querySelector(".pcard-front").innerHTML = MAIN;
      cards.filter((c) => c !== card).forEach((c, i) => {
        c.querySelector(".pcard-front").innerHTML = OTHERS[i];
      });

      card.classList.add("flipped", "chosen");
      setTimeout(() => goldBurst(...centerOf(card), 70), 450);

      setTimeout(() => {
        cards.filter((c) => c !== card).forEach((c) => c.classList.add("flipped"));
      }, 1300);

      setTimeout(() => {
        revealBox.classList.add("show");
        revealBox.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => goldBurst(...centerOf(revealBox), 110), 600);
      }, 2400);
    });
  });
});
