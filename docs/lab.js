"use strict";
// The lab: the real card, fed by hand. Scene (place, date, time, weather), cases, power readings, the parts and
// their names/colours, and the YAML that carries the same look into Home Assistant.
(() => {
  const $ = (id) => document.getElementById(id);
  const card = $("card");
  const STORE = "energy-flow-lab";

  const PLACES = [
    ["london", "London", 51.5072, -0.1276, "Europe/London"],
    ["warsaw", "Warsaw", 52.2297, 21.0122, "Europe/Warsaw"],
    ["newyork", "New York", 40.7128, -74.006, "America/New_York"],
    ["losangeles", "Los Angeles", 34.0522, -118.2437, "America/Los_Angeles"],
    ["sydney", "Sydney", -33.8688, 151.2093, "Australia/Sydney"],
    ["tokyo", "Tokyo", 35.6762, 139.6503, "Asia/Tokyo"],
    ["singapore", "Singapore", 1.3521, 103.8198, "Asia/Singapore"],
    ["capetown", "Cape Town", -33.9249, 18.4241, "Africa/Johannesburg"],
    ["reykjavik", "Reykjavík", 64.1466, -21.9426, "Atlantic/Reykjavik"],
    ["tromso", "Tromsø (midnight sun)", 69.6492, 18.9553, "Europe/Oslo"],
  ];
  const WEATHER = [["clear", "Clear"], ["partly", "Partly"], ["cloudy", "Cloudy"], ["fog", "Fog"], ["drizzle", "Drizzle"],
    ["rain", "Rain"], ["heavy", "Heavy rain"], ["snow", "Snow"], ["storm", "Storm"]];
  const DEFAULT_CONFIG = {
    solar: { show: true, name: "Solar", color: "#d6a62c" },
    home: { name: "Home" },
    grid: { name: "Grid", color: "#cfd3d6" },
    battery1: { show: true, name: "Battery 1", color: "#4dbd80", face: "#eeeeee" },
    battery2: { show: true, name: "Battery 2", color: "#4aa5f2", face: "#4b4e54" },
    ev: { show: false, name: "EV", color: "#9b7bea" },
    garage: "closed",
    lights: "on",
  };
  // Home's other loads in Try it, as shares of the home reading: they are part of it, so never add up to more.
  const EXTRAS = [["Pool", 0.35], ["A/C", 0.5]];
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const today = () => new Date().toISOString().slice(0, 10);

  const state = {
    place: "london", latitude: 51.5072, longitude: -0.1276, zone: "Europe/London",
    date: today(), minute: 720, weather: "clear", temperature: 15, effects: "auto", theme: "auto",
    power: { solar: 2.2, b1: 0, b2: 0, grid: 0, home: 2.2, b1soc: 64, b2soc: 48, ev: 1.5, evsoc: 62 }, derive: "grid",
    config: clone(DEFAULT_CONFIG),
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved) {
      for (const k of ["place", "latitude", "longitude", "zone", "weather", "temperature", "derive", "effects", "theme"]) if (k in saved) state[k] = saved[k];
      if (state.derive !== "home") state.derive = "grid";
      Object.assign(state.power, saved.power || {});
      const fit = (k, lo, hi) => { state.power[k] = Math.min(hi, Math.max(lo, +state.power[k] || 0)); };
      fit("solar", 0, 5); fit("b1", -5, 5); fit("b2", -5, 5); fit("ev", -3, 7);  // older saves allowed more
      for (const part of Object.keys(DEFAULT_CONFIG)) {
        if (typeof DEFAULT_CONFIG[part] === "string") { if (typeof saved.config?.[part] === "string") state.config[part] = saved.config[part]; }
        else Object.assign(state.config[part], saved.config?.[part] || {});
      }
      if (!state.config.battery1.show) state.config.battery2.show = false;
    }
  } catch { /* a private window: start fresh */ }
  const save = () => {
    try {
      const { place, latitude, longitude, zone, weather, temperature, derive, power, config, effects, theme } = state;
      localStorage.setItem(STORE, JSON.stringify({ place, latitude, longitude, zone, weather, temperature, derive, power, config, effects, theme }));
    } catch { /* not kept, still works */ }
  };

  // ---------- time zones: local wall time <-> instants, with daylight saving gaps and repeats ----------
  const formatters = new Map();
  function parts(zone, ms) {
    let f = formatters.get(zone);
    if (!f) {
      f = new Intl.DateTimeFormat("en-US", { timeZone: zone, hourCycle: "h23", year: "numeric", month: "2-digit",
        day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });
      formatters.set(zone, f);
    }
    const o = {};
    for (const p of f.formatToParts(new Date(ms))) o[p.type] = +p.value;
    return o;
  }
  const offset = (zone, ms) => {
    const p = parts(zone, ms);
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(ms / 1000) * 1000;
  };
  function localMidnight(zone, y, m, d) {
    let t = Date.UTC(y, m - 1, d);
    for (let i = 0; i < 3; i++) t = Date.UTC(y, m - 1, d) - offset(zone, t);
    return t;
  }
  function dayRange() {
    const [y, m, d] = state.date.split("-").map(Number);
    const start = localMidnight(state.zone, y, m, d);
    const next = new Date(Date.UTC(y, m - 1, d + 1));
    const end = localMidnight(state.zone, next.getUTCFullYear(), next.getUTCMonth() + 1, next.getUTCDate());
    return { start, minutes: Math.max(1, Math.round((end - start) / 60000)) };
  }
  const validZone = (zone) => { try { new Intl.DateTimeFormat("en", { timeZone: zone }); return true; } catch { return false; } };
  function clockLabel(ms) {
    return new Intl.DateTimeFormat("en-GB", { timeZone: state.zone, hour: "2-digit", minute: "2-digit", timeZoneName: "short" }).format(ms);
  }
  function setClock(hh, mm) {
    const { start, minutes } = dayRange();
    // The first minute of the day that shows this wall time.
    for (let m = 0; m < minutes; m++) {
      const p = parts(state.zone, start + m * 60000);
      if (p.hour * 60 + p.minute >= hh * 60 + mm) { state.minute = m; return; }
    }
    state.minute = minutes - 1;
  }

  // ---------- the card ----------
  const names = () => ({ b1: state.config.battery1.name, b2: state.config.battery2.name, solar: state.config.solar.name,
    grid: state.config.grid.name, ev: state.config.ev.name });

  function cardConfig() {
    return { preview: true, ...clone(state.config), effects: state.effects, theme: state.theme };
  }

  // The readings always add up, as in a real house: what comes in (solar, batteries giving out, the car giving out,
  // the grid importing) is what goes out (home, batteries and the car charging, the grid exporting). One reading is
  // worked out from the rest: the grid, always there to give or take, or home right after the grid is moved. The
  // showcase sets its own.
  // the car has a reading: its sensor switched on (the garage open or not)
  const evLive = () => !!activeConfig().ev?.show;
  function balance() {
    const p = state.power, c = activeConfig();
    if (!state.derive) return;
    // net power from solar, the batteries and the car (the car takes + or gives −)
    const net = (c.solar.show ? p.solar : 0) + (c.battery1.show ? p.b1 : 0) + (c.battery2.show ? p.b2 : 0) - (evLive() ? p.ev : 0);
    if (state.derive === "grid") p.grid = +(p.home - net).toFixed(1);
    else {
      p.home = Math.max(0, +(net + p.grid).toFixed(1));
      if (net + p.grid < 0) p.grid = +(-net).toFixed(1);  // more than home could take: the rest goes out to the street
    }
  }

  function render() {
    balance();
    const { start, minutes } = dayRange();
    state.minute = Math.max(0, Math.min(state.minute, minutes - 1));
    const instant = start + state.minute * 60000;
    const minute = $("minute");
    minute.max = minutes - 1;
    minute.value = state.minute;
    const label = clockLabel(instant);
    $("clock").textContent = label;
    minute.setAttribute("aria-valuetext", label);
    const sky = EnergyFlowSky(state.latitude, state.longitude, instant);
    const sun = sky.sun.altitude;
    $("sky-status").textContent = show.timer ? "Showcase" : sun > 6 ? "Daylight" : sun > -0.27 ? "Low sun" : sun > -12 ? "Twilight" : "Night";
    const w = (kw) => Math.round(kw * 1000);
    const p = state.power;
    card.preview({
      solar: w(p.solar), home: w(p.home), grid: w(p.grid),
      battery1: { power: w(p.b1), soc: p.b1soc }, battery2: { power: w(p.b2), soc: p.b2soc },
      weather: state.weather, temperature: state.temperature, sky, time: instant,
      ev: evLive() ? w(p.ev) : null, evSoc: evLive() ? p.evsoc : null,
      extras: (show.config ? SHOWCASE[show.index].extras || [] : EXTRAS)
        .map(([name, share]) => ({ name, power: w(Math.round(p.home * share * 10) / 10) })),
    });
    for (const b of $("weather").children) b.setAttribute("aria-pressed", b.dataset.key === state.weather);
    for (const b of $("effects").children) b.setAttribute("aria-pressed", b.dataset.key === state.effects);
    for (const b of $("theme").children) b.setAttribute("aria-pressed", b.dataset.key === state.theme);
    $("temperature").value = state.temperature;
    $("temperature-out").textContent = `${state.temperature} °C`;
    syncPower();
    $("yaml").textContent = yaml();
    if (!show.timer) save();
  }

  // a tap on the shutter or the window in the picture
  card.addEventListener("energy-flow-toggle", ({ detail: { part, on } }) => {
    if (show.timer) return;
    if (part === "garage") state.config.garage = on ? "open" : "closed";
    if (part === "lights") state.config.lights = on ? "on" : "off";
    applyConfig();
  });
  function applyConfig() {
    card.setConfig(cardConfig());
    buildPower();
    buildCases();
    render();
  }

  // ---------- scene ----------
  const placeSelect = $("place");
  for (const [key, label] of PLACES) placeSelect.add(new Option(label, key));
  placeSelect.add(new Option("My location", "here"));
  placeSelect.add(new Option("Custom…", "custom"));
  for (const zone of ["UTC", ...(Intl.supportedValuesOf?.("timeZone") ?? [])]) $("zones").append(new Option(zone));

  function showPlace() {
    placeSelect.value = state.place;
    $("custom-place").hidden = state.place !== "custom";
    $("latitude").value = state.latitude;
    $("longitude").value = state.longitude;
    $("zone").value = state.zone;
  }
  placeSelect.addEventListener("change", () => {
    const key = placeSelect.value;
    const place = PLACES.find((p) => p[0] === key);
    if (place) [, , state.latitude, state.longitude, state.zone] = place;
    if (key === "here") {
      navigator.geolocation?.getCurrentPosition((pos) => {
        state.latitude = +pos.coords.latitude.toFixed(4);
        state.longitude = +pos.coords.longitude.toFixed(4);
        state.zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
        showPlace();
        render();
      }, () => { $("sky-status").textContent = "Location not shared"; });
    }
    state.place = key;
    showPlace();
    render();
  });
  for (const id of ["latitude", "longitude"]) {
    $(id).addEventListener("change", () => {
      const v = Number($(id).value), limit = id === "latitude" ? 90 : 180;
      if (Number.isFinite(v) && Math.abs(v) <= limit) { state[id] = v; render(); } else showPlace();
    });
  }
  $("zone").addEventListener("change", () => {
    const zone = $("zone").value.trim();
    if (validZone(zone)) { state.zone = zone; render(); } else showPlace();
  });

  for (const [key, label] of WEATHER) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.dataset.key = key;
    b.onclick = () => { state.weather = key; render(); };
    $("weather").append(b);
  }
  for (const [key, label] of [["auto", "Auto"], ["high", "High"], ["medium", "Medium"], ["low", "Low"]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.dataset.key = key;
    b.onclick = () => { state.effects = key; card.setConfig(cardConfig()); render(); };
    $("effects").append(b);
  }
  for (const [key, label] of [["auto", "Auto"], ["dark", "Dark"], ["light", "Light"]]) {
    const b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    b.dataset.key = key;
    b.onclick = () => { state.theme = key; card.setConfig(cardConfig()); render(); };
    $("theme").append(b);
  }
  $("temperature").addEventListener("input", () => { state.temperature = +$("temperature").value; render(); });

  $("date").value = state.date;
  $("date").addEventListener("change", () => {
    if (!$("date").value) return;
    const p = parts(state.zone, dayRange().start + state.minute * 60000);
    state.date = $("date").value;
    setClock(p.hour, p.minute);
    render();
  });
  $("minute").addEventListener("input", () => { state.minute = +$("minute").value; render(); });
  $("now").addEventListener("click", () => {
    const p = parts(state.zone, Date.now());
    state.date = `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
    $("date").value = state.date;
    setClock(p.hour, p.minute);
    render();
  });

  // ---------- showcase: three looped scenes that show what the card can be made to look like ----------
  // Plays on its own like a shop display. It borrows the scene and the card's config while it runs and gives back
  // the visitor's own when stopped; anything in the sidebar or on the timeline stops it.
  const SHOWCASE = [
    {
      title: "Out of the box", note: "summer afternoon, solar charging both batteries and exporting",
      config: DEFAULT_CONFIG, date: "2026-06-21", clock: [14, 0], weather: "clear", temperature: 24,
      power: { solar: 4.8, b1: -1.4, b2: -1.0, grid: -0.2, home: 2.2, b1soc: 72, b2soc: 85 },
      extras: EXTRAS,  // pool 0.8 and A/C 1.1 of home's 2.2 kW
    },
    {
      title: "Your colours", note: "a December evening in the snow under a waxing crescent, decorations up",
      config: {
        solar: { show: true, name: "Solar", color: "#e0a030" }, home: { name: "Home" },
        grid: { name: "Grid", color: "#aab3bc" },
        battery1: { show: true, name: "Battery 1", color: "#3fa796", face: "#3a3d42" },
        battery2: { show: true, name: "Battery 2", color: "#5b8def", face: "#c9ccd1" },
      },
      date: "2026-01-23", clock: [17, 30], weather: "snow", temperature: -3,
      power: { solar: 0, b1: 1.6, b2: 0.6, grid: 0.4, home: 2.6, b1soc: 58, b2soc: 41 },
    },
    {
      title: "Just one battery", note: "a rainy night, cheap-rate grid power filling the battery and charging the car",
      config: {
        ...DEFAULT_CONFIG,
        battery1: { show: true, name: "Battery 1", color: "#4f9fe0", face: "#d9dde2" },
        battery2: { ...DEFAULT_CONFIG.battery2, show: false },
        ev: { ...DEFAULT_CONFIG.ev, show: true },
        garage: "open",
      },
      date: "2026-10-24", clock: [2, 30], weather: "rain", temperature: 9,
      power: { solar: 0, b1: -3.0, b2: 0, grid: 7.1, home: 0.4, b1soc: 34, b2soc: 0, ev: 3.7, evsoc: 48 },  // grid: battery 3.0 + home 0.4 + car 3.7
    },
  ];
  const SHOW_FOR = 9000;  // ms per scene
  const show = { timer: null, index: 0, saved: null, config: null };
  const activeConfig = () => show.config || state.config;

  function showScene(i) {
    show.index = i % SHOWCASE.length;
    const scene = SHOWCASE[show.index];
    show.config = clone(scene.config);
    card.setConfig({ preview: true, ...clone(show.config) });
    state.date = scene.date;
    $("date").value = state.date;
    state.weather = scene.weather;
    state.temperature = scene.temperature;
    Object.assign(state.power, scene.power);
    state.derive = null;
    setClock(...scene.clock);
    render();
  }

  function startShowcase() {
    if (show.timer) return;
    const { place, latitude, longitude, zone, date, minute, weather, temperature, derive, power } = state;
    show.saved = clone({ place, latitude, longitude, zone, date, minute, weather, temperature, derive, power });
    Object.assign(state, { place: "london", latitude: 51.5072, longitude: -0.1276, zone: "Europe/London" });
    showScene(0);
    show.timer = setInterval(() => showScene(show.index + 1), SHOW_FOR);
    document.body.classList.add("showcase");
    showMode();
  }

  function stopShowcase() {
    if (!show.timer) return;
    clearInterval(show.timer);
    show.timer = null;
    show.config = null;
    Object.assign(state, show.saved);
    $("date").value = state.date;
    document.body.classList.remove("showcase");
    showMode();
    showPlace();
    applyConfig();
  }

  // Either the demo or every control is on screen, never a mix.
  $("mode-demo").addEventListener("click", startShowcase);
  $("mode-try").addEventListener("click", stopShowcase);
  function showMode() {
    $("mode-demo").setAttribute("aria-checked", !!show.timer);
    $("mode-try").setAttribute("aria-checked", !show.timer);
  }
  for (const el of [document.querySelector(".sidebar"), document.querySelector(".clock")]) {
    for (const type of ["pointerdown", "keydown"]) {
      el.addEventListener(type, (e) => {
        // A click on a section heading only opens or closes it.
        if (e.isTrusted && !e.target.closest("summary")) stopShowcase();
      }, true);
    }
  }

  // ---------- cases ----------
  // [label, solar, battery 1, battery 2, grid, time, needs, car (0 if left out: − gives power out)]
  function cases() {
    const n = names();
    return [
      ["Idle", 0, 0, 0, 0, "23:00", []],
      [`Night: ${n.b1}`, 0, 1.4, 0, 0, "23:00", ["b1"]],
      ["Night: both batteries", 0, 1.2, 0.6, 0, "23:00", ["b1", "b2"]],
      [`Night: ${n.b2} only`, 0, 0, 0.8, 0, "23:00", ["b2"]],
      [`Night: ${n.b2} + ${n.grid}`, 0, 0, 0.5, 0.9, "23:00", ["b2"]],
      [`Night: ${n.grid} only`, 0, 0, 0, 1.6, "23:00", []],
      [`${n.grid} charges ${n.b1}`, 0, -3, 0, 4, "02:00", ["b1"]],
      [`${n.grid} charges ${n.b2}`, 0, 0, -2.5, 3.5, "02:00", ["b2"]],
      [`${n.grid} charges both`, 0, -2.5, -1.5, 5, "02:00", ["b1", "b2"]],
      [`Day: ${n.solar} only`, 2.2, 0, 0, 0, "12:00", ["solar"]],
      [`${n.solar} + ${n.b1}`, 1.1, 0.9, 0, 0, "15:00", ["solar", "b1"]],
      [`${n.solar} + both`, 1.1, 0.9, 0.6, 0, "15:00", ["solar", "b1", "b2"]],
      [`${n.solar} + ${n.b2}`, 1.0, 0, 0.7, 0, "15:00", ["solar", "b2"]],
      [`${n.solar} charges both`, 5, -3, -1.5, 0, "11:00", ["solar", "b1", "b2"]],
      [`${n.solar} exports`, 5, 0, 0, -3.3, "13:00", ["solar"]],
      [`${n.b1} exports`, 0, 5, 0, -3.6, "19:00", ["b1"]],
      ["All four feed", 1, 1, 0.5, 0.8, "14:30", ["solar", "b1", "b2"]],
      [`${n.ev} powers the house`, 0, 0, 0, 0, "21:00", ["ev"], -1.8],
      ["All five feed", 1.2, 0.8, 0.6, 0.5, "18:00", ["solar", "b1", "b2", "ev"], -0.9],
      [`${n.ev}, ${n.solar} + ${n.b1} export`, 3, 1.5, 0, -4, "16:00", ["solar", "b1", "ev"], -2],
    ];
  }
  function buildCases() {
    const box = $("cases");
    box.replaceChildren();
    const c = state.config, have = { solar: c.solar.show, b1: c.battery1.show, b2: c.battery2.show, ev: c.ev.show };
    const n = names(), missing = (k) => n[k];
    for (const [label, solar, b1, b2, grid, time, needs, ev = 0] of cases()) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      // every case is listed; one needing a part that is switched off waits for it
      const off = needs.filter((k) => !have[k]);
      if (off.length) { b.disabled = true; b.title = `Needs ${off.map(missing).join(" and ")}`; }
      b.onclick = () => {
        Object.assign(state.power, { solar, b1, b2, grid, ev });  // the car idle unless the case says, so home is what the rest gives
        state.derive = "home";
        const [hh, mm] = time.split(":").map(Number);
        setClock(hh, mm);
        render();
      };
      box.append(b);
    }
  }

  // Panels open and close smoothly: the height runs from where it is to where it is going.
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  for (const d of document.querySelectorAll(".sidebar details")) {
    d.querySelector("summary").addEventListener("click", (e) => {
      if (calm()) return;
      e.preventDefault();
      const from = d.offsetHeight, opening = !(d.open && !d.closing);
      d.anim?.cancel();
      d.open = true;
      d.closing = false;
      const to = opening ? d.offsetHeight : d.querySelector("summary").offsetHeight + (d.offsetHeight - d.clientHeight);
      d.closing = !opening;
      d.style.overflow = "hidden";
      d.anim = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: 320, easing: "cubic-bezier(.3,.7,.2,1)" });
      d.anim.onfinish = () => { d.open = opening; d.closing = false; d.style.overflow = ""; d.anim = null; };
    });
  }

  // ---------- power ----------
  const sliders = {};
  // A slider whose value rides on its thumb.
  function slider(key, min, max, step, unit = "kW") {
    const track = document.createElement("div");
    track.className = "track";
    track.innerHTML = `<input type="range"><output></output>`;
    const input = track.querySelector("input");
    Object.assign(input, { min, max, step });
    input.addEventListener("input", () => {
      state.power[key] = +input.value;
      // the reading moved stays as set: home moved, the grid makes up the difference; the grid moved, home does
      if (key === "home") state.derive = "grid";
      else if (key === "grid") state.derive = "home";
      else state.derive = "grid";
      render();
    });
    sliders[key] = { input, output: track.querySelector("output"), unit, track };
    return track;
  }

  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  // Power: one row per part, as it reads on the card. A switch before the name for the parts that can be left out,
  // the name to rename in place, its colours after it, then its sliders.
  const ROWS = [
    { key: "solar", sliders: [["solar", 0, 5]], show: "show", colors: [["color", "Flow"]] },
    { key: "battery1", sliders: [["b1", -5, 5], ["b1soc", 0, 100, "Charge"]], show: "show", colors: [["color", "Flow"], ["face", "Glass"]] },
    { key: "battery2", sliders: [["b2", -5, 5], ["b2soc", 0, 100, "Charge"]], show: "show", colors: [["color", "Flow"], ["face", "Glass"]] },
    { key: "grid", sliders: [["grid", -20, 30]], colors: [["color", "Flow"]] },
    { key: "home", sliders: [["home", 0, 12]], colors: [], toggle: ["lights", "Lights", "on", "off"] },
    { key: "ev", sliders: [["ev", -3, 7], ["evsoc", 0, 100, "Charge"]], show: "show", toggle: ["garage", "Garage", "open", "closed"], colors: [["color", "Flow"]] },
  ];
  function buildPower() {
    const box = $("power"), c = state.config;
    box.replaceChildren();
    for (const k of Object.keys(sliders)) delete sliders[k];
    for (const row of ROWS) {
      const part = c[row.key];
      const on = () => !row.show || part.show;
      const el = document.createElement("div");
      el.className = "prow";
      el.innerHTML = `<div class="prow-head"><input class="pname" type="text" maxlength="24" spellcheck="false"><span class="dots"></span></div>`;
      const head = el.querySelector(".prow-head");
      if (row.show) {
        const sw = document.createElement("label");
        sw.className = "switch";
        sw.innerHTML = `<input type="checkbox" role="switch"><span></span>`;
        const input = sw.querySelector("input");
        input.checked = on();
        // battery 2 only alongside battery 1
        if (row.key === "battery2" && !c.battery1.show) { input.disabled = true; sw.title = `Needs ${c.battery1.name}`; }
        input.setAttribute("aria-label", `Show ${part.name}`);
        input.addEventListener("change", () => {
          part.show = input.checked;
          if (row.key === "battery1" && !input.checked) c.battery2.show = false;
          el.classList.toggle("off", !on());
          applyConfig();
        });
        head.prepend(sw);
      }
      if (row.toggle) {
        // the garage (before the car's own switch) and the house lights: a tap on the shutter or window does it too
        const [key, label, yes, no] = row.toggle;
        const g = document.createElement("label");
        g.className = "switch-text";
        g.innerHTML = `<span class="switch"><input type="checkbox" role="switch" aria-label="${label}"><span></span></span>${label}`;
        const input = g.querySelector("input");
        input.checked = c[key] === yes;
        input.addEventListener("change", () => { c[key] = input.checked ? yes : no; applyConfig(); });
        head.prepend(g);
      }
      const name = el.querySelector(".pname");
      name.value = part.name;
      name.setAttribute("aria-label", `Name of ${part.name}`);
      name.addEventListener("input", () => { part.name = name.value; card.setConfig(cardConfig()); render(); });
      name.addEventListener("change", () => { buildCases(); render(); });
      const dots = el.querySelector(".dots");
      for (const [prop, label] of row.colors) {
        const dot = document.createElement("input");
        dot.type = "color";
        dot.value = part[prop];
        dot.title = `${label} colour`;
        dot.setAttribute("aria-label", `${part.name} ${label.toLowerCase()} colour`);
        dot.addEventListener("input", () => { part[prop] = dot.value; card.setConfig(cardConfig()); render(); });
        dots.append(dot);
      }
      for (const [key, min, max, sub] of row.sliders) {
        const track = slider(key, min, max, sub ? 1 : 0.1, sub ? "%" : "kW");
        if (sub) {
          const line = document.createElement("div");
          line.className = "prow-sub";
          line.innerHTML = `<span>${sub}</span>`;
          line.append(track);
          el.append(line);
        } else el.append(track);
      }
      el.classList.toggle("off", !on());
      box.append(el);
    }
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "button ghost";
    reset.textContent = "Reset names and colours";
    reset.onclick = () => {
      for (const k of Object.keys(DEFAULT_CONFIG)) state.config[k] = clone(DEFAULT_CONFIG[k]);
      applyConfig();
    };
    box.append(reset);
  }
  function syncPower() {
    for (const [key, s] of Object.entries(sliders)) {
      const v = +state.power[key];
      s.input.value = v;
      s.output.textContent = s.unit === "%" ? `${v}%` : `${v.toFixed(1)} kW`;
      s.track.style.setProperty("--pct", (v - s.input.min) / (s.input.max - s.input.min));
    }
  }
  $("reset-all").addEventListener("click", () => {
    try { localStorage.removeItem(STORE); } catch { /* nothing kept */ }
    location.reload();
  });

  // ---------- Home Assistant YAML ----------
  const q = (s) => (/^[\w .-]+$/.test(s) && !/^(yes|no|true|false|on|off|null)$/i.test(s.trim()) && s.trim() === s ? s : JSON.stringify(s));
  function yaml() {
    const c = state.config, d = DEFAULT_CONFIG;
    const lines = ["type: custom:energy-flow-card", "weather: weather.forecast_home"];
    if (state.effects !== "auto") lines.push(`effects: ${state.effects}`);
    if (state.theme !== "auto") lines.push(`theme: ${state.theme}`);
    const block = (key, entities) => {
      const out = [`${key}:`, ...entities.map(([k, v]) => `  ${k}: ${v}`)];
      for (const prop of ["name", "color", "face"]) {
        if (c[key][prop] !== undefined && c[key][prop] !== d[key][prop]) out.push(`  ${prop}: ${q(c[key][prop])}`);
      }
      lines.push(...out);
    };
    if (c.solar.show) block("solar", [["entity", "sensor.solar_power"]]);
    block("grid", [["entity", "sensor.grid_power"]]);
    block("home", [["entity", "sensor.home_power"]]);
    lines.push("  extras:", ...EXTRAS.map(([name]) => `    - { name: ${q(name)}, entity: sensor.${name.toLowerCase().replace(/\W+/g, "_")}_power }`));
    // The batteries are on by default, so one switched off is written out.
    if (c.battery1.show) block("battery1", [["power", "sensor.battery_1_power"], ["soc", "sensor.battery_1_charge"]]);
    else lines.push("battery1: false");
    if (c.battery2.show) block("battery2", [["power", "sensor.battery_2_power"], ["soc", "sensor.battery_2_charge"]]);
    else lines.push("battery2: false");
    if (c.garage === "open") lines.push("garage: on");
    if (c.lights === "off") lines.push("lights: off");
    if (c.ev.show) {
      lines.push("ev:", "  entity: sensor.ev_charger_power", "  soc: sensor.ev_battery_level");
      for (const prop of ["name", "color"]) if (c.ev[prop] !== d.ev[prop]) lines.push(`  ${prop}: ${q(c.ev[prop])}`);
    }
    return lines.join("\n") + "\n";
  }
  $("copy").addEventListener("click", async () => {
    const button = $("copy");
    try {
      await navigator.clipboard.writeText(yaml());
      button.textContent = "Copied";
    } catch {
      getSelection().selectAllChildren($("yaml"));
      button.textContent = "Press Ctrl+C";
    }
    setTimeout(() => { button.textContent = "Copy YAML"; }, 1600);
  });
  document.querySelector("[data-open=install]").addEventListener("click", () => { stopShowcase(); $("install").open = true; });

  // ---------- start ----------
  showPlace();
  setClock(12, 0);
  applyConfig();
  // Like a shop display: it plays on its own until someone takes hold of it.
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) startShowcase();
  showMode();
})();
