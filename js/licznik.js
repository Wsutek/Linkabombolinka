(() => {
  const START_DATE = new Date(2025, 11, 6, 0, 0, 0);
  const ANNIV_DATE = new Date(2026, 11, 6, 0, 0, 0);

  // ?test = start 10 s przed rocznicą, ?rocznica = glitch od razu
  const params = new URLSearchParams(location.search);
  const testCountdown = params.has("test");
  const testNow = params.has("rocznica");
  const offset = testCountdown ? ANNIV_DATE.getTime() - 10000 - Date.now() : 0;
  const now = () => Date.now() + offset;

  const body = document.body;
  const title = document.getElementById("counter-title");
  const since = document.getElementById("counter-since");
  const reveal = document.getElementById("anniv-reveal");
  const terminal = document.getElementById("terminal");
  const overlay = document.getElementById("hack-overlay");
  const nums = {
    days: document.getElementById("c-days"),
    hours: document.getElementById("c-hours"),
    mins: document.getElementById("c-mins"),
    secs: document.getElementById("c-secs"),
  };

  let hacked = false;

  function render(d, h, m, s) {
    nums.days.textContent = d;
    nums.hours.textContent = h;
    nums.mins.textContent = m;
    nums.secs.textContent = s;
  }

  function tick() {
    if (hacked) return;
    if (testNow || now() >= ANNIV_DATE.getTime()) {
      render(365, 0, 0, 0);
      startHack();
      return;
    }
    let diff = Math.max(0, (now() - START_DATE.getTime()) / 1000);
    const days = Math.floor(diff / 86400); diff -= days * 86400;
    const hours = Math.floor(diff / 3600); diff -= hours * 3600;
    const mins = Math.floor(diff / 60);
    const secs = Math.floor(diff - mins * 60);
    render(days, hours, mins, secs);
  }

  const GLYPHS = "01#$%&@!?<>/\\|=+*ERRØ█▓▒░";
  const randGlyphs = (n) => Array.from({ length: n }, () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join("");

  function setTitle(text) {
    title.textContent = text;
    title.dataset.text = text;
  }

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  async function typeLine(text, cls, pause = 280) {
    const line = document.createElement("div");
    if (cls) line.className = cls;
    terminal.appendChild(line);
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "█";
    for (const ch of text) {
      line.textContent += ch;
      line.appendChild(cursor);
      await sleep("▰▱".includes(ch) ? 70 : 24);
      cursor.remove();
    }
    line.appendChild(cursor);
    await sleep(pause);
    cursor.remove();
    return line;
  }

  async function startHack() {
    if (hacked) return;
    hacked = true;

    // Faza 1: licznik nie umie pokazać 365 dni
    body.classList.add("glitching");
    const errTitles = ["BŁĄD: 365", "WARTOŚĆ POZA ZAKRESEM", "LIMIT PRZEKROCZONY", randGlyphs(6) + " ERROR"];
    const scramble = setInterval(() => {
      const r = Math.random();
      const days = r < 0.35 ? "364" : r < 0.6 ? "365" : r < 0.8 ? "ERR" : randGlyphs(3);
      render(days, randGlyphs(2), randGlyphs(2), randGlyphs(2));
      setTitle(errTitles[Math.floor(Math.random() * errTitles.length)]);
      since.textContent = "! nieobsługiwana wartość: 365";
    }, 90);
    if (navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 120]);
    await sleep(2600);

    // Faza 2: błąd systemu, a potem przejęcie przez miłość
    body.classList.add("hacked");
    await sleep(600);
    await typeLine("! BŁĄD KRYTYCZNY: licznik przekroczył dozwolony zakres", "warn");
    await typeLine("! wartość 365 dni nie istnieje w bazie danych", "warn");
    await typeLine("> przeszukiwanie historii systemu...", "", 700);
    await typeLine("> najdłuższy zapisany rekord: < 365 dni", "", 500);
    await typeLine("! ten system nigdy nie dotarł tak daleko", "warn", 900);
    await typeLine("> uruchamianie procedury awaryjnej: reset do 0");
    const resetLine = await typeLine("  [▰▰▰▰▱▱▱▱▱▱] 40%", "", 700);
    resetLine.textContent += "  PRZERWANO";
    resetLine.className = "warn";
    await sleep(500);

    overlay.classList.add("love");
    if (navigator.vibrate) navigator.vibrate(200);
    await sleep(700);
    await typeLine("> wykryto nowy proces: milosc.exe", "love");
    await typeLine("> reset zablokowany. ktoś tu nie zamierza odpuścić", "love", 600);
    await typeLine("> usuwanie bariery 365 dni", "love");
    await typeLine("  [▰▰▰▰▰▰▰▰▰▰] 100%", "love", 500);
    await typeLine("> limit związku: brak", "love");
    await typeLine("> witaj w nowym systemie, Karolinko\u00a0❤️", "love", 2400);

    // Faza 3: restart z niespodzianką
    clearInterval(scramble);
    render(365, "00", "00", "00");
    setTitle("System przejęty przez miłość 💘");
    since.textContent = "> uptime: 365 dni i liczymy dalej\u00a0❤️";
    if (testCountdown || testNow) {
      document.getElementById("anniv-btn").href = "rocznica.html?rocznica";
    }
    reveal.classList.remove("hidden");
    body.classList.remove("glitching", "hacked");
    body.classList.add("rebooted");
    startRain();
  }

  function startRain() {
    const canvas = document.getElementById("love-rain");
    const ctx = canvas.getContext("2d");
    const SIZE = 16;
    const CHARS = "01♥01❤01♡";
    let cols = [];
    function resize() {
      canvas.width = innerWidth;
      canvas.height = innerHeight;
      cols = Array.from({ length: Math.ceil(innerWidth / SIZE) }, () => Math.random() * -50);
    }
    resize();
    addEventListener("resize", resize);
    ctx.font = SIZE + "px 'Share Tech Mono', monospace";
    setInterval(() => {
      if (document.hidden) return;
      ctx.fillStyle = "rgba(11, 3, 16, 0.12)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = SIZE + "px 'Share Tech Mono', monospace";
      cols.forEach((y, i) => {
        const ch = CHARS[Math.floor(Math.random() * CHARS.length)];
        ctx.fillStyle = ch === "0" || ch === "1" ? "#ff2bd6" : "#ff9cc6";
        ctx.fillText(ch, i * SIZE, y * SIZE);
        cols[i] = y * SIZE > canvas.height && Math.random() > 0.97 ? 0 : y + 1;
      });
    }, 60);
  }

  tick();
  setInterval(tick, 1000);
})();
