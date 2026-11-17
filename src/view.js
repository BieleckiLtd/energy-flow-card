// The picture of the house and what it does: readings in, moving pulses, labels, sky and weather out.
// One view per card. It owns the inlined SVG and updates it in place, so its animations run on between updates.

const FLOW_MIN = 50;  // watts: less than this reads as "0 kW" and draws no flow
const PULSE_SPEED = 125;  // SVG units per second on every wire
const SHORTEST_CYCLE = 275;  // very short routes should not flash rapidly
const LANE_GAP = 19;  // between neighbouring lanes on the wall, in the picture's own units
const MOON_RADIUS = 22;
const HORIZON = -.27;  // the apparent centre is just below the horizon when the upper edge rises
const GRID_FLOWS = ["grid", "grid2", "grid3"];
const HOT = 30;  // °C: above this heat haze rises off the roofs
const FROST_START = 3;  // °C: frost begins to form here...
const FROST_FULL = -10;  // ...and is fully grown here

// The weather the picture can draw, and how much of the sky (sun, moon, twilight) shows through each.
export const WEATHERS = ["clear", "partly", "cloudy", "fog", "drizzle", "rain", "heavy", "snow", "storm"];
const PICTURE_WEATHER = { clear: "clear", partly: "cloudy", cloudy: "cloudy", fog: "fog", drizzle: "drizzle", rain: "rain", heavy: "heavy", snow: "snow", storm: "storm" };
// Snow showers let some sky through, so a winter moon still shows.
const SKY_VISIBILITY = { clear: 1, partly: .62, cloudy: .12, snow: .5 };

export const DEFAULTS = {
  solar: { show: true, name: "Solar", color: "#d6a62c" },
  home: { name: "Home" },
  grid: { name: "Grid", color: "#cfd3d6" },
  battery1: { show: true, name: "Battery 1", color: "#4dbd80", face: "#eeeeee" },
  battery2: { show: true, name: "Battery 2", color: "#4aa5f2", face: "#4b4e54" },
  look: { glass: "#2d334d", roof: "#333333", wall: "#0a0a0a", window: "#d6d3ca", background: "#17181a" },
};

const missing = (v) => v === null || v === undefined || Number.isNaN(v);
const flow = (v) => (missing(v) || Math.abs(v) < FLOW_MIN ? 0 : v);
const kw = (v) => (missing(v) ? "–" : Math.abs(v) < FLOW_MIN ? "0 kW" : `${(Math.abs(v) / 1000).toFixed(1)} kW`);
const skyX = (progress) => 65 + progress * 1040;

function smoothstep(low, high, value) {
  const x = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return x * x * (3 - 2 * x);
}

function linearLight(channel) {
  const srgb = channel / 255;
  return srgb <= .04045 ? srgb / 12.92 : ((srgb + .055) / 1.055) ** 2.4;
}

// Colours: "#rgb" / "#rrggbb" in, mixes out, so one chosen colour can drive a part's whole gradient.
function rgb(hex) {
  let h = String(hex).trim().replace(/^#/, "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function mix(hex, other, t) {
  const a = rgb(hex), b = rgb(other);
  if (!a || !b) return hex;
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
export const validColor = (hex) => !!rgb(hex);

// Every colour the picture takes from the config, as the SVG's custom properties. Only colours that differ from
// the drawing's own are set, so an untouched card looks exactly as drawn.
function colorVars(cfg) {
  const vars = {};
  const set = (part, key, fn) => {
    const value = cfg[part]?.[key];
    if (value && validColor(value) && value.toLowerCase() !== DEFAULTS[part][key]) Object.assign(vars, fn(value));
  };
  set("solar", "color", (c) => ({ "--ef-solar-color": c }));
  set("grid", "color", (c) => ({ "--ef-grid-color": c }));
  for (const n of [1, 2]) {
    set(`battery${n}`, "color", (c) => ({
      [`--ef-b${n}-color`]: c, [`--ef-b${n}-dir`]: mix(c, "#ffffff", .25),
      [`--ef-b${n}-strip-1`]: mix(c, "#d0d0d0", .4), [`--ef-b${n}-strip-2`]: mix(c, "#d0d0d0", .3),
    }));
    set(`battery${n}`, "face", (c) => ({
      [`--ef-b${n}-face-1`]: c, [`--ef-b${n}-face-2`]: mix(c, "#000000", .14), [`--ef-b${n}-mirror`]: mix(c, "#808080", .1),
    }));
  }
  set("look", "glass", (c) => ({ "--ef-glass-1": c, "--ef-glass-2": mix(c, "#000000", .27), "--ef-glass-3": mix(c, "#000000", .52) }));
  set("look", "window", (c) => ({ "--ef-window-1": c, "--ef-window-2": mix(c, "#000000", .19), "--ef-window-mirror": mix(c, "#000000", .04) }));
  set("look", "wall", (c) => ({ "--ef-wall-1": c, "--ef-wall-2": mix(c, "#ffffff", .02) }));
  set("look", "roof", (c) => ({
    "--ef-roof-1": c, "--ef-roof-2": mix(c, "#000000", .14), "--ef-roof-3": mix(c, "#000000", .2),
    "--ef-roof-back-1": mix(c, "#ffffff", .03), "--ef-roof-back-2": mix(c, "#000000", .05),
    "--ef-gable-1": mix(c, "#000000", .25), "--ef-gable-2": mix(c, "#000000", .45),
  }));
  return vars;
}

export class EnergyFlowView {
  constructor(container, svgText) {
    container.innerHTML = svgText;
    this.svg = container.querySelector("svg");
    this.cfg = DEFAULTS;
    this.cadenceRoutes = [];
    this.cycleDistance = 0;
    this.beatStart = 0;
    this.gridTurns = 0;
    this.colorKeys = [];
    this.seen = true;
    this.contrastBusy = false;
    this.contrastDirty = false;

    const svg = this.svg;
    for (const lane of svg.querySelectorAll("[data-route]")) {
      // The grid can carry several pulses. It follows the beat set by the shorter wires.
      if (lane.id.startsWith("ef-f-grid")) continue;
      const length = this.part(lane.dataset.route).getTotalLength();
      const junctionEnd = lane.hasAttribute("data-junction-end");
      if (junctionEnd) lane.style.setProperty("--ef-junction", length);
      // Parts of a pulse drawn in their own frame start part-way along the route.
      for (const piece of lane.querySelectorAll("[data-junction-shift]")) {
        piece.style.setProperty("--ef-junction", length + Number(piece.dataset.junctionShift));
      }
      this.cadenceRoutes.push({ lane, length, junctionEnd });
    }
    svg.classList.add("ef-still");  // the first readings go in as they are; lanes animate only on later changes

    // Nothing moves while the picture is off the screen or the page is in the background.
    this.onVisibility = () => this.restWhenUnseen();
    document.addEventListener("visibilitychange", this.onVisibility);
    if (typeof IntersectionObserver === "function") {
      this.observer = new IntersectionObserver(([entry]) => { this.seen = entry.isIntersecting; this.restWhenUnseen(); });
      this.observer.observe(svg);
    }
  }

  destroy() {
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
  }

  part(id) { return this.svg.getElementById(id); }

  // Writes only real changes: parts of the picture are mirrored by <use> copies, which the browser rebuilds
  // (restarting their animations) on every attribute write, even one that sets the same value.
  attr(el, name, value) { value = String(value); if (el.getAttribute(name) !== value) el.setAttribute(name, value); }

  text(id, value, idle = false) {
    const el = this.part(id);
    if (el.textContent !== value) el.textContent = value;
    if (idle !== null) el.classList.toggle("ef-idle", idle);
  }

  // Names, colours and which parts are there. Takes the card's config, filled in from DEFAULTS.
  configure(cfg) {
    this.cfg = cfg;
    const svg = this.svg;
    svg.classList.toggle("ef-no-solar", !cfg.solar.show);
    svg.classList.toggle("ef-no-b1", !cfg.battery1.show);
    svg.classList.toggle("ef-no-b2", !cfg.battery2.show);
    const name = (id, value) => this.text(id, String(value ?? "").toUpperCase(), null);
    name("ef-solar-name", cfg.solar.name);
    name("ef-home-name", cfg.home.name);
    name("ef-grid-name", cfg.grid.name);
    name("ef-b1-name", cfg.battery1.name);
    name("ef-b2-name", cfg.battery2.name);
    const vars = colorVars(cfg);
    for (const key of this.colorKeys) if (!(key in vars)) svg.style.removeProperty(key);
    for (const [key, value] of Object.entries(vars)) svg.style.setProperty(key, value);
    this.colorKeys = Object.keys(vars);
    this.colors = {
      solar: cfg.solar.color, grid: cfg.grid.color, b1: cfg.battery1.color, b2: cfg.battery2.color,
    };
    this.scheduleLabelContrast();
  }

  // A battery's line: power, which way it flows (▼ out of the battery, ▲ into it) and its charge.
  battery(key, watts, soc) {
    const w = flow(watts);
    this.text(`ef-${key}`, kw(watts), !w);
    const dir = this.part(`ef-${key}-dir`);
    const arrow = w < 0 ? "▲" : "▼";
    if (dir.textContent !== arrow) dir.textContent = arrow;
    this.attr(dir, "fill-opacity", w ? 1 : 0);  // kept in the line, so the numbers don't jump sideways
    this.text(`ef-${key}-soc`, missing(soc) ? "–" : `${Math.round(soc)}%`, null);
    // The lit strip on the battery's side is as tall as its charge.
    const strip = this.part(`ef-${key}-level`);
    const [backFoot, frontFoot, frontTop, backTop] = strip.dataset.full.split(" ").map((p) => p.split(",").map(Number));
    const share = Math.max(0, Math.min(1, (soc ?? 0) / 100));
    const up = (a, b) => `${(a[0] + (b[0] - a[0]) * share).toFixed(1)},${(a[1] + (b[1] - a[1]) * share).toFixed(1)}`;
    this.attr(strip, "points", `${backFoot} ${frontFoot} ${up(frontFoot, frontTop)} ${up(backFoot, backTop)}`);
  }

  // A lane's moving pulse: "out" runs away from the source (towards the house), "in" back into it; none = idle.
  pulse(lane, way, color) {
    const el = this.part(`ef-f-${lane}`);
    this.attr(el, "data-flow", way || "off");
    if (color) el.style.setProperty("--ef-flow-color", color);
    else el.style.removeProperty("--ef-flow-color");
  }

  // A lane on the wall is there only while power runs in it. It fades and slides half a place as it comes and
  // goes (CSS transitions in the svg); `place` is how many lanes down from its drawn position it sits.
  line(lane, way, place = 0, color) {
    const el = this.part(`ef-l-${lane}`);
    el.classList.toggle("ef-gone", !way);
    el.style.transform = `translateY(${(way ? place : place - 0.5) * LANE_GAP}px)`;
    if (way) this.pulse(lane, way, color);  // a lane on its way out keeps its pulse while it fades
  }

  // The grid pipe's sources, [way, colour] each. Up to three share the one lane by taking turns: each flow carries
  // every n-th pulse (--ef-turns in the svg). A change in their number restarts the beat, as iOS Safari would
  // otherwise keep the old timing.
  gridLanes(flows) {
    GRID_FLOWS.forEach((name, i) => {
      const [way, color] = flows[i] || [];
      const el = this.part(`ef-f-${name}`);
      el.style.setProperty("--ef-turns", flows.length);
      el.style.setProperty("--ef-turn", i);
      this.pulse(name, i < flows.length && way, color);
    });
    if (flows.length === this.gridTurns) return;
    this.gridTurns = flows.length;
    this.restartBeats();
  }

  updatePulseCadence() {
    let incoming = 0, outgoing = 0;
    for (const { lane, length, junctionEnd } of this.cadenceRoutes) {
      const way = lane.dataset.flow;
      if (way === "off" || lane.closest(".ef-gone")) continue;
      if ((way === "out") === junctionEnd) incoming = Math.max(incoming, length);
      else outgoing = Math.max(outgoing, length);
    }
    // The longest incoming run starts as the longest outgoing run finishes its trip.
    const distance = Math.max(SHORTEST_CYCLE, incoming + outgoing);
    if (distance === this.cycleDistance) return;
    const now = document.timeline?.currentTime ?? performance.now();
    // Keep the pulses where they are: the beat is PULSE_SPEED units a second since beatStart, wrapped at the cycle.
    if (this.cycleDistance) this.beatStart = now - (((now - this.beatStart) * PULSE_SPEED / 1000) % this.cycleDistance) * 1000 / PULSE_SPEED;
    this.svg.style.setProperty("--ef-cycle-distance", distance);
    this.svg.style.setProperty("--ef-cycle-period", `${distance / PULSE_SPEED}s`);
    // Restarted, not just retimed: iOS Safari keeps a running animation's old duration and end value when the
    // custom properties behind them change.
    this.cycleDistance = distance;
    this.restartBeats();
  }

  restartBeats() {
    this.svg.classList.add("ef-restart");
    this.svg.getBoundingClientRect();
    this.svg.classList.remove("ef-restart");
  }

  // Every wire runs its own beat animation (cheaper than one on the whole picture); they all take their time from
  // the one clock, so a wire that appears joins in step with the others.
  alignBeats() {
    if (!this.svg.getAnimations || !this.cycleDistance) return;
    const now = document.timeline?.currentTime ?? performance.now();
    for (const a of this.svg.getAnimations({ subtree: true })) {
      if (!a.animationName?.endsWith("-beat")) continue;
      const turns = a.animationName === "ef-grid-beat" ? this.gridTurns || 1 : 1;
      a.currentTime = (now - this.beatStart) % (turns * this.cycleDistance * 1000 / PULSE_SPEED);
    }
  }

  light(name, body, brightness, reflection) {
    const el = this.part(`ef-${name}`);
    el.style.opacity = brightness;
    this.attr(this.part(`ef-${name}-shine`), "opacity", reflection);
    if (!body || !brightness) return;
    const { progress, altitude } = body;
    const height = Math.sin(Math.max(0, altitude) * Math.PI / 180);
    const bodyX = skyX(progress);
    this.attr(el, "transform", `translate(${bodyX} ${125 - height * 89})`);
    // Follow the front array's centre line, with the solar glint just to the right of the disc.
    const solar = name === "sun";
    const x = solar ? bodyX + 10 : bodyX;
    const y = 674 - .2 * x - 10 * height;
    const centre = `translate(${x} ${y})`;
    const softShape = "matrix(1 -.2 .33 .52 0 0)";
    const shape = solar ? `rotate(86) scale(.67 ${.16 + .05 * height})` : softShape;
    this.attr(this.part(`ef-${name}-reflection`), "gradientTransform", `${centre} ${shape}`);
    if (solar) this.attr(this.part("ef-sun-sheen"), "gradientTransform", `${centre} ${softShape}`);
  }

  updateSky(sky, weather) {
    const { sun, moon } = sky || {};
    const day = sun ? sun.altitude >= HORIZON : true;
    if (day) this.svg.removeAttribute("data-time");
    else this.attr(this.svg, "data-time", "night");

    const visibility = SKY_VISIBILITY[weather] || 0;
    const altitude = sun?.altitude ?? 90;
    this.svg.style.setProperty("--ef-darkness", 1 - smoothstep(-13, 10, altitude));
    // Christmas lights are either on or off: on once the sun is a few degrees down, like a timer switch.
    this.svg.classList.toggle("ef-xmas-lit", altitude < -3);
    this.svg.style.setProperty("--ef-starlight", 1 - smoothstep(-14, -5, altitude));
    const twilight = smoothstep(-13, -3, altitude) * (1 - smoothstep(-2, 8, altitude));
    this.svg.style.setProperty("--ef-twilight", twilight * visibility);
    if (sun && twilight) this.attr(this.part("ef-twilight"), "cx", skyX(sun.progress));

    const sunlight = sun ? visibility * smoothstep(HORIZON, 4, altitude) : 0;
    const sunHeight = Math.sin(Math.max(0, altitude) * Math.PI / 180);
    this.light("sun", sun, sunlight, sunlight * (.45 + .35 * sunHeight));

    const fraction = moon?.illuminated ?? 0;
    const moonlight = moon ? visibility * (1 - smoothstep(-6, HORIZON, altitude)) * smoothstep(HORIZON, 2, moon.altitude) : 0;
    const moonBrightness = moonlight * Math.min(1, fraction * 45);
    this.light("moon", moon, moonBrightness, moonlight * fraction ** 1.5 * .75);
    if (!moonBrightness) return;

    // The limb is a semicircle, and the terminator is an ellipse whose width follows the illuminated fraction.
    const r = MOON_RADIUS, terminator = r * Math.abs(1 - 2 * fraction);
    const phase = this.part("ef-moon-phase");
    this.attr(phase, "d", `M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${terminator} ${r} 0 0 ${+(fraction > .5)} 0 ${-r}Z`);
    this.attr(phase, "transform", `rotate(${moon.tilt})`);
    this.attr(this.part("ef-moon-halo"), "opacity", .3 * fraction ** .65);
    const title = this.part("ef-moon-title");
    const label = `Moon, ${Math.round(fraction * 100)}% illuminated`;
    if (title.textContent !== label) title.textContent = label;
  }

  // Readings in watts: solar, home, grid (+ import, − export), battery1/battery2 { power (+ gives out, − charges), soc }.
  // weather is one of WEATHERS; sky is energySky()'s result, or null for a plain daytime sky; time (ms) is the moment
  // shown, for the seasonal decorations; temperature (°C) brings heat haze or frost.
  update(state) {
    const cfg = this.cfg, color = this.colors;
    const b1 = cfg.battery1.show ? state.battery1 || {} : {}, b2 = cfg.battery2.show ? state.battery2 || {} : {};
    const solar = cfg.solar.show ? Math.max(0, flow(state.solar)) : 0;
    const b1w = flow(b1.power), b2w = flow(b2.power), grid = flow(state.grid);
    let home = state.home;
    // Home worked out from the others only when every part in the picture has a reading: with one sensor unavailable
    // the sum would be wrong, so home shows a dash too.
    const inputs = [state.grid, cfg.solar.show && state.solar, cfg.battery1.show && b1.power, cfg.battery2.show && b2.power]
      .filter((v) => v !== false);
    if (missing(home) && inputs.every((v) => !missing(v))) {
      home = Math.max(0, inputs.reduce((sum, v) => sum + v, 0));
    }
    this.text("ef-solar", kw(missing(state.solar) ? null : Math.max(0, state.solar)), !solar);
    this.text("ef-home", kw(home), !flow(home));
    this.text("ef-grid", kw(state.grid), !grid);
    this.battery("b1", b1.power, b1.soc);
    this.battery("b2", b2.power, b2.soc);

    // Who feeds what: the street takes solar first, then the batteries; a charging battery takes solar first, then
    // the grid, then the other battery; the house gets what is left. A charging battery or the street takes the
    // colour of what feeds it most.
    const left = { solar, b1: Math.max(0, b1w), b2: Math.max(0, b2w), grid: Math.max(0, grid) };
    const feed = (need, order) => {
      let most = "grid", best = 0;
      for (const k of order) {
        const got = Math.min(need, left[k]);
        if (got <= 0) continue;
        left[k] -= got;
        need -= got;
        if (got > best) [most, best] = [k, got];
      }
      return color[most];
    };
    const before = { ...left };
    const toGrid = feed(Math.max(0, -grid), ["solar", "b2", "b1"]);
    // Every source that sends at least FLOW_MIN out to the street gets its own grid lane (the biggest always does).
    const exporters = grid < 0 ? ["solar", "b1", "b2"].filter((k) => before[k] - left[k] >= FLOW_MIN) : [];
    const toB1 = feed(Math.max(0, -b1w), ["solar", "grid", "b2"]);
    const toB2 = feed(Math.max(0, -b2w), ["solar", "grid", "b1"]);
    this.pulse("solar", solar && "out");
    this.line("b1", b1w > 0 ? "out" : b1w < 0 && "in", 0, b1w < 0 && toB1);
    this.line("b2", b2w > 0 ? "out" : b2w < 0 && "in", 0, b2w < 0 && toB2);
    if (grid < 0) this.gridLanes(exporters.length ? exporters.map((k) => ["out", color[k]]) : [["out", toGrid]]);
    else this.gridLanes([[grid > 0 && "in"]]);  // the grid's "in" is into the house
    // From the meter box on to the house, top to bottom: solar, battery 1, battery 2, grid - one lane for each
    // that feeds it. The batteries' lanes run straight through the box (battery 1 place 0, battery 2 place 1),
    // solar, coming down from above, sits on top of them and the grid under the lowest.
    const used = missing(home) || home >= FLOW_MIN;
    const [hB1, hSolar, hB2, hGrid] = ["b1", "solar", "b2", "grid"].map((k) => used && left[k] >= FLOW_MIN);
    this.line("h1", hB1 && "out", 0, color.b1);
    this.line("h2", hSolar && "out", hB1 ? -1 : 0, color.solar);
    this.line("h3", hB2 && "out", 1, color.b2);
    this.line("h4", hGrid && "out", hB2 ? 2 : hB1 || hSolar ? 1 : 0, color.grid);
    this.updatePulseCadence();
    this.alignBeats();

    // Christmas decorations from 6 December to 6 January, unless switched off.
    const day = new Date(state.time ?? Date.now()), md = (day.getMonth() + 1) * 100 + day.getDate();
    this.svg.classList.toggle("ef-christmas", cfg.christmas !== false && (md >= 1206 || md <= 106));

    const weather = WEATHERS.includes(state.weather) ? state.weather : "cloudy";
    this.attr(this.svg, "data-weather", PICTURE_WEATHER[weather]);
    this.updateSky(state.sky, weather);
    this.temperature(state.temperature);

    if (this.svg.classList.contains("ef-still")) {
      this.svg.getBoundingClientRect();  // lays the lanes out where they are before transitions are switched on
      this.svg.classList.remove("ef-still");
    }
    this.scheduleLabelContrast();
  }

  // Air temperature in °C, or nothing. The haze grows stronger up to 40 °C.
  temperature(celsius) {
    const hot = !missing(celsius) && celsius > HOT;
    this.svg.classList.toggle("ef-hot", hot);
    const frost = missing(celsius) ? 0 : Math.max(0, Math.min(1, (FROST_START - celsius) / (FROST_START - FROST_FULL)));
    this.svg.classList.toggle("ef-frosty", frost > 0);
    this.svg.style.setProperty("--ef-frost", frost.toFixed(2));
    if (hot) this.svg.style.setProperty("--ef-heat", Math.min(1, (celsius - HOT) / 10).toFixed(2));
  }

  restWhenUnseen() {
    this.svg.classList.toggle("ef-paused", !this.seen || document.hidden);
    this.alignBeats();
    this.scheduleLabelContrast();
  }

  canSampleContrast() {
    return this.svg.isConnected && this.seen && !document.hidden && !this.svg.classList.contains("ef-paused");
  }

  // Labels stay readable on any sky: each one's background is sampled, and over a bright patch it gets a dark halo.
  adaptLabel(label, context, scale) {
    const { x, y, width, height } = label.getBBox();
    const left = Math.max(0, Math.floor(x * scale)), top = Math.max(0, Math.floor(y * scale));
    const right = Math.min(context.canvas.width, Math.ceil((x + width) * scale));
    const bottom = Math.min(context.canvas.height, Math.ceil((y + height) * scale));
    if (right <= left || bottom <= top) return;
    const pixels = context.getImageData(left, top, right - left, bottom - top).data;
    let light = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      light += .2126 * linearLight(pixels[i]) + .7152 * linearLight(pixels[i + 1]) + .0722 * linearLight(pixels[i + 2]);
    }
    const luminance = light * 4 / pixels.length;
    const threshold = label.classList.contains("ef-ink-lifted") ? .165 : .18;
    const lifted = luminance > threshold;
    label.classList.toggle("ef-ink-lifted", lifted);
    label.classList.toggle("ef-ink-bright", !lifted && luminance > .075);
  }

  async sampleLabelContrast() {
    // Rasterize the background locally at a small size, with the labels removed from the sample.
    const svg = this.svg;
    const scene = svg.cloneNode(true);
    scene.querySelector("#ef-labels").remove();
    const drift = scene.querySelector("#ef-drift");
    drift.style.animation = "none";
    drift.style.transform = getComputedStyle(this.part("ef-drift")).transform;
    const view = svg.viewBox.baseVal, width = 240, scale = width / view.width;
    const height = Math.round(view.height * scale);
    scene.setAttribute("width", width);
    scene.setAttribute("height", height);
    this.canvas ??= document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    const context = this.canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(scene)], { type: "image/svg+xml" }));
    try {
      const image = new Image();
      image.src = url;
      await image.decode();
      if (!this.canSampleContrast()) return;
      context.drawImage(image, 0, 0);
      for (const label of this.part("ef-labels").querySelectorAll("text")) {
        if (label.getClientRects().length) this.adaptLabel(label, context, scale);
      }
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  scheduleLabelContrast() {
    if (!this.canSampleContrast()) return;
    this.contrastDirty = true;
    if (this.contrastBusy) return;
    this.contrastBusy = true;
    setTimeout(async () => {
      this.contrastDirty = false;
      try {
        if (this.canSampleContrast()) await this.sampleLabelContrast();
      } catch {
        // Keep the base label colours if the browser cannot rasterize the scene.
      } finally {
        this.contrastBusy = false;
        if (this.contrastDirty) this.scheduleLabelContrast();
      }
    }, 160);
  }
}
