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

  async function typeLine(text, cls) {
    const line = document.createElement("div");
    if (cls) line.className = cls;
    terminal.appendChild(line);
    const cursor = document.createElement("span");
    cursor.className = "cursor";
    cursor.textContent = "█";
    for (const ch of text) {
      line.textContent += ch;
      line.appendChild(cursor);
      await sleep(ch === "█" ? 45 : 24);
      cursor.remove();
    }
    line.appendChild(cursor);
    await sleep(280);
    cursor.remove();
  }

  async function startHack() {
    if (hacked) return;
    hacked = true;

    // Faza 1: licznik wariuje
    body.classList.add("glitching");
    const originalTitle = title.textContent;
    const scramble = setInterval(() => {
      render(randGlyphs(3), randGlyphs(2), randGlyphs(2), randGlyphs(2));
      setTitle(Math.random() < 0.5 ? originalTitle : randGlyphs(8) + " ERROR " + randGlyphs(4));
      since.textContent = "> " + randGlyphs(26);
    }, 70);
    if (navigator.vibrate) navigator.vibrate([60, 40, 60, 40, 120]);
    await sleep(2300);

    // Faza 2: przejęcie ekranu
    body.classList.add("hacked");
    await sleep(500);
    await typeLine("> wykryto nieautoryzowany dostęp...");
    await typeLine("> łamanie zabezpieczeń licznika");
    await typeLine("  [████████████████] 100%");
    await typeLine("! UWAGA: przekroczono limit 364 dni", "warn");
    await typeLine("> nadpisywanie wartości: dni = 365");
    await typeLine("> źródło ataku: ktoś, kto bardzo Cię kocha\u00a0❤️", "love");
    await typeLine("> ACCESS GRANTED");
    await sleep(1100);

    // Faza 3: restart z niespodzianką
    clearInterval(scramble);
    render(365, "00", "00", "00");
    setTitle("Mamy rocznicę! 🎉");
    since.classList.add("hidden");
    if (testCountdown || testNow) {
      document.getElementById("anniv-btn").href = "rocznica.html?rocznica";
    }
    reveal.classList.remove("hidden");
    body.classList.remove("glitching", "hacked");
    body.classList.add("rebooted");
  }

  tick();
  setInterval(tick, 1000);
})();
