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
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const today = () => new Date().toISOString().slice(0, 10);

  const state = {
    place: "london", latitude: 51.5072, longitude: -0.1276, zone: "Europe/London",
    date: today(), minute: 720, weather: "clear",
    power: { solar: 2.2, b1: 0, b2: 0, grid: 0, home: 2.2, b1soc: 64, b2soc: 48 }, balance: true,
    config: clone(DEFAULT_CONFIG),
  };
  try {
    const saved = JSON.parse(localStorage.getItem(STORE) || "null");
    if (saved) {
      for (const k of ["place", "latitude", "longitude", "zone", "weather", "balance"]) if (k in saved) state[k] = saved[k];
      Object.assign(state.power, saved.power || {});
      for (const part of Object.keys(DEFAULT_CONFIG)) Object.assign(state.config[part], saved.config?.[part] || {});
    }
  } catch { /* a private window: start fresh */ }
  const save = () => {
    try {
      const { place, latitude, longitude, zone, weather, balance, power, config } = state;
      localStorage.setItem(STORE, JSON.stringify({ place, latitude, longitude, zone, weather, balance, power, config }));
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
  const names = () => ({ b1: state.config.battery1.name, b2: state.config.battery2.name, solar: state.config.solar.name, grid: state.config.grid.name });

  function cardConfig() {
    return { preview: true, ...clone(state.config) };
  }

  function balance() {
    const p = state.power, c = activeConfig();
    if (state.balance) {
      const total = (c.solar.show ? p.solar : 0) + (c.battery1.show ? p.b1 : 0) + (c.battery2.show ? p.b2 : 0) + p.grid;
      p.home = Math.max(0, +total.toFixed(1));
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
      weather: state.weather, sky, time: instant,
    });
    for (const b of $("weather").children) b.setAttribute("aria-pressed", b.dataset.key === state.weather);
    syncPower();
    $("yaml").textContent = yaml();
    if (!show.timer) save();
  }

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
      config: DEFAULT_CONFIG, date: "2026-06-21", clock: [14, 0], weather: "clear",
      power: { solar: 5.8, b1: -2.4, b2: -1.0, grid: -1.7, home: 0.7, b1soc: 72, b2soc: 85 },
    },
    {
      title: "Your colours", note: "a December evening in the snow under a waxing crescent, decorations up",
      config: {
        solar: { show: true, name: "Solar", color: "#e0a030" }, home: { name: "Home" },
        grid: { name: "Grid", color: "#aab3bc" },
        battery1: { show: true, name: "Battery 1", color: "#3fa796", face: "#3a3d42" },
        battery2: { show: true, name: "Battery 2", color: "#5b8def", face: "#c9ccd1" },
      },
      date: "2026-01-23", clock: [17, 30], weather: "snow",
      power: { solar: 0, b1: 1.6, b2: 0.6, grid: 0.4, home: 2.6, b1soc: 58, b2soc: 41 },
    },
    {
      title: "Just one battery", note: "a rainy night, cheap-rate grid power filling it up",
      config: {
        ...DEFAULT_CONFIG,
        battery1: { show: true, name: "Battery 1", color: "#4f9fe0", face: "#d9dde2" },
        battery2: { ...DEFAULT_CONFIG.battery2, show: false },
      },
      date: "2026-10-24", clock: [2, 30], weather: "rain",
      power: { solar: 0, b1: -3.0, b2: 0, grid: 3.4, home: 0.4, b1soc: 34, b2soc: 0 },
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
    Object.assign(state.power, scene.power);
    state.balance = false;
    setClock(...scene.clock);
    render();
  }

  function startShowcase() {
    if (show.timer) return;
    const { place, latitude, longitude, zone, date, minute, weather, balance, power } = state;
    show.saved = clone({ place, latitude, longitude, zone, date, minute, weather, balance, power });
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
  // [label, solar, battery 1, battery 2, grid, time, needs]
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
      [`${n.grid} charges both`, 0, -2.5, -1.5, 5, "02:00", ["b1", "b2"]],
      [`Day: ${n.solar} only`, 2.2, 0, 0, 0, "12:00", ["solar"]],
      [`${n.solar} + ${n.b1}`, 1.1, 0.9, 0, 0, "15:00", ["solar", "b1"]],
      [`${n.solar} + both`, 1.1, 0.9, 0.6, 0, "15:00", ["solar", "b1", "b2"]],
      [`${n.solar} + ${n.b2}`, 1.0, 0, 0.7, 0, "15:00", ["solar", "b2"]],
      [`${n.solar} charges both`, 6, -3, -1.5, 0, "11:00", ["solar", "b1", "b2"]],
      [`${n.solar} exports`, 6.5, 0, 0, -4.8, "13:00", ["solar"]],
      [`${n.b1} exports`, 0, 5, 0, -3.6, "19:00", ["b1"]],
      ["All four feed", 1, 1, 0.5, 0.8, "14:30", ["solar", "b1", "b2"]],
    ];
  }
  function buildCases() {
    const box = $("cases");
    box.replaceChildren();
    const c = state.config, have = { solar: c.solar.show, b1: c.battery1.show, b2: c.battery2.show };
    for (const [label, solar, b1, b2, grid, time, needs] of cases()) {
      if (!needs.every((k) => have[k])) continue;
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.onclick = () => {
        Object.assign(state.power, { solar, b1, b2, grid });
        state.balance = true;
        const [hh, mm] = time.split(":").map(Number);
        setClock(hh, mm);
        render();
      };
      box.append(b);
    }
  }

  // ---------- power ----------
  const sliders = {};
  function slider(key, label, min, max, step, color, sub = false, unit = "kW") {
    const row = document.createElement("label");
    row.className = `slider${sub ? " sub" : ""}`;
    row.innerHTML = `<span>${color ? `<i style="background:${color}"></i>` : ""}</span><input type="range"><output></output>`;
    row.querySelector("span").append(label);
    const input = row.querySelector("input");
    Object.assign(input, { min, max, step });
    input.addEventListener("input", () => {
      state.power[key] = +input.value;
      if (key === "home") state.balance = false;
      render();
    });
    sliders[key] = { input, output: row.querySelector("output"), unit };
    return row;
  }
  function buildPower() {
    const box = $("power"), c = state.config;
    box.replaceChildren();
    for (const k of Object.keys(sliders)) delete sliders[k];
    if (c.solar.show) box.append(slider("solar", c.solar.name, 0, 10, 0.1, c.solar.color));
    for (const [n, key] of [[1, "b1"], [2, "b2"]]) {
      const b = c[`battery${n}`];
      if (!b.show) continue;
      box.append(slider(key, b.name, -5, 5, 0.1, b.color));
      box.append(slider(`${key}soc`, "Charge", 0, 100, 1, "", true, "%"));
    }
    box.append(slider("grid", c.grid.name, -8, 8, 0.1, c.grid.color));
    box.append(slider("home", c.home.name, 0, 12, 0.1, ""));
    const check = document.createElement("label");
    check.className = "check";
    check.innerHTML = `<input type="checkbox"> ${escapeHtml(c.home.name)} uses what the others give`;
    const input = check.querySelector("input");
    input.checked = state.balance;
    input.addEventListener("change", () => { state.balance = input.checked; render(); });
    sliders.balance = { check: input };
    box.append(check);
    const hint = document.createElement("p");
    hint.className = "hint";
    hint.textContent = "Batteries: + gives out (▼), − charges (▲). Grid: + import, − export. Under 0.05 kW counts as nothing.";
    box.append(hint);
  }
  function syncPower() {
    for (const [key, s] of Object.entries(sliders)) {
      if (key === "balance") { s.check.checked = state.balance; continue; }
      s.input.value = state.power[key];
      s.output.textContent = s.unit === "%" ? `${state.power[key]}%` : (+state.power[key]).toFixed(1);
    }
  }

  // ---------- parts ----------
  const escapeHtml = (s) => String(s).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  function swatch(label, value, onInput) {
    const el = document.createElement("label");
    el.className = "swatch";
    el.innerHTML = `<input type="color"><span></span>`;
    el.querySelector("span").textContent = label;
    const input = el.querySelector("input");
    input.value = value;
    input.addEventListener("input", () => onInput(input.value));
    return el;
  }
  function buildParts() {
    const box = $("parts");
    box.replaceChildren();
    const PARTS = [["solar", "Solar", true, ["color", "Flow"]], ["battery1", "Battery 1", true, ["color", "Flow"], ["face", "Front"]],
      ["battery2", "Battery 2", true, ["color", "Flow"], ["face", "Front"]], ["grid", "Grid", false, ["color", "Flow"]], ["home", "Home", false]];
    for (const [key, title, optional, ...colors] of PARTS) {
      const part = state.config[key];
      const el = document.createElement("div");
      el.className = `part${optional && !part.show ? " off" : ""}`;
      el.innerHTML = `<div class="part-head"><span></span></div><div class="part-body">
        <label class="field">Name<input type="text" maxlength="24"></label><div class="swatches"></div></div>`;
      el.querySelector(".part-head span").textContent = title;
      if (optional) {
        const sw = document.createElement("label");
        sw.className = "switch";
        sw.innerHTML = `<input type="checkbox" role="switch"><span></span>`;
        const input = sw.querySelector("input");
        input.checked = part.show;
        input.setAttribute("aria-label", `Show ${title}`);
        input.addEventListener("change", () => {
          part.show = input.checked;
          el.classList.toggle("off", !part.show);
          applyConfig();
        });
        el.querySelector(".part-head").append(sw);
      }
      const name = el.querySelector("input[type=text]");
      name.value = part.name;
      name.addEventListener("input", () => {
        part.name = name.value;
        card.setConfig(cardConfig());
        render();
      });
      name.addEventListener("change", () => { buildPower(); buildCases(); render(); });
      const sw = el.querySelector(".swatches");
      for (const [prop, label] of colors) {
        sw.append(swatch(label, part[prop], (v) => { part[prop] = v; card.setConfig(cardConfig()); render(); }));
      }
      if (!colors.length) sw.remove();
      box.append(el);
    }
    const reset = document.createElement("button");
    reset.type = "button";
    reset.className = "button ghost";
    reset.textContent = "Reset parts";
    reset.onclick = () => {
      for (const k of ["solar", "home", "grid", "battery1", "battery2"]) state.config[k] = clone(DEFAULT_CONFIG[k]);
      buildParts();
      applyConfig();
    };
    box.append(reset);
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
    if (c.battery1.show) block("battery1", [["power", "sensor.battery_1_power"], ["soc", "sensor.battery_1_charge"]]);
    if (c.battery2.show) block("battery2", [["power", "sensor.battery_2_power"], ["soc", "sensor.battery_2_charge"]]);
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
  buildParts();
  setClock(12, 0);
  applyConfig();
  // Like a shop display: it plays on its own until someone takes hold of it.
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) startShowcase();
  showMode();
})();
