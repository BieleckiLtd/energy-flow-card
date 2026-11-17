// The Home Assistant card: <energy-flow-card>, a Lovelace custom card. It reads power sensors, a weather entity
// and Home Assistant's location, and draws them with EnergyFlowView. The lab page drives the same element
// through preview(), without Home Assistant.
import { EnergyFlowView, DEFAULTS, WEATHERS, validColor } from "./view.js";
import { energySky } from "./sky.js";
import { SVG, VERSION } from "./svg.js";

// Home Assistant's weather states -> the picture's weather
const HA_WEATHER = {
  "clear-night": "clear", sunny: "clear", partlycloudy: "partly", cloudy: "cloudy", fog: "fog", hail: "snow",
  lightning: "storm", "lightning-rainy": "storm", pouring: "heavy", rainy: "rain", snowy: "snow",
  "snowy-rainy": "rain", windy: "partly", "windy-variant": "cloudy", exceptional: "cloudy",
};
const PARTS = ["solar", "home", "grid", "battery1", "battery2"];

// The config as written (YAML or the editor) -> every option filled in. A part given as a plain string is its entity.
export function normalizeConfig(config = {}) {
  const out = { title: config.title || "", weather: config.weather || "", temperature: config.temperature || "", latitude: config.latitude, longitude: config.longitude,
    christmas: config.christmas !== false };
  for (const key of PARTS) {
    let c = config[key];
    if (typeof c === "string") c = { entity: c };
    if (c === false) c = { show: false };
    c = { ...(c || {}) };
    const part = { ...DEFAULTS[key], ...c };
    for (const k of ["color", "face"]) if (part[k] && !validColor(part[k])) part[k] = DEFAULTS[key][k];
    if ("show" in DEFAULTS[key]) {
      const hasEntity = !!(c.entity || c.power || c.soc || c.charge || c.discharge);
      part.show = c.show ?? (config.preview ? true : hasEntity);
    }
    out[key] = part;
  }
  out.look = { ...DEFAULTS.look, ...(config.look || {}) };
  for (const k of Object.keys(out.look)) if (!validColor(out.look[k])) out.look[k] = DEFAULTS.look[k];
  return out;
}

const UNIT = { w: 1, kw: 1000, mw: 1e6 };

export class EnergyFlowCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card, .card { overflow: hidden; background: var(--efc-background, #17181a); border-radius: var(--ha-card-border-radius, 12px); }
        .card { display: block; }
        .title { margin: 0; padding: 14px 16px 0; font: 500 16px/1.3 var(--paper-font-body1_-_font-family, system-ui, sans-serif); color: #f1f1f1; }
        /* Not an icon: back to SVG's own defaults, whatever the page around it inherits. */
        .picture svg { display: block; width: 100%; height: auto; fill: #000; stroke: none; stroke-width: 1; stroke-linecap: butt; stroke-linejoin: miter; letter-spacing: normal; }
        .picture .ef-clickable { cursor: pointer; }
      </style>
      <div class="card" part="card"><h2 class="title" hidden></h2><div class="picture"></div></div>`;
    this.picture = this.shadowRoot.querySelector(".picture");
    this.titleEl = this.shadowRoot.querySelector(".title");
    this.view = new EnergyFlowView(this.picture, SVG);
    this.view.part("ef-labels").addEventListener("click", (e) => this.openMoreInfo(e));
    this.config = normalizeConfig({});
  }

  // Home Assistant wraps cards in <ha-card> for the theme's shadow and radius; outside it we keep our own box.
  connectedCallback() {
    const card = this.shadowRoot.querySelector(".card");
    if (customElements.get("ha-card") && card.tagName !== "HA-CARD") {
      const haCard = document.createElement("ha-card");
      haCard.className = "card";
      haCard.append(...card.childNodes);
      card.replaceWith(haCard);
    }
    if (this._hass) this.startClock();
  }

  disconnectedCallback() {
    clearInterval(this.clock);
    this.clock = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    this.rawConfig = config;
    this.config = normalizeConfig(config);
    this.titleEl.textContent = this.config.title;
    this.titleEl.hidden = !this.config.title;
    this.picture.style.background = this.config.look.background;
    this.shadowRoot.host.style.setProperty("--efc-background", this.config.look.background);
    this.view.configure(this.config);
    for (const [id, part] of [["ef-solar-label", "solar"], ["ef-home-name", "home"], ["ef-home", "home"],
      ["ef-grid-name", "grid"], ["ef-grid", "grid"], ["ef-b1-label", "battery1"], ["ef-b2-label", "battery2"]]) {
      this.view.part(id).classList.toggle("ef-clickable", !!this.entityOf(part));
    }
    this.render();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this.clock && this.isConnected) this.startClock();
    this.render();
  }

  get hass() { return this._hass; }

  // The sky moves on even when no sensor changes.
  startClock() {
    clearInterval(this.clock);
    this.clock = setInterval(() => this.render(), 60000);
  }

  // The lab's way in: readings, weather and sky set by hand instead of read from Home Assistant.
  preview(state) {
    this.previewState = state;
    this.render();
  }

  entityOf(part) {
    const c = this.config[part];
    return c.entity || c.power || c.soc || c.import || c.discharge || "";
  }

  openMoreInfo(event) {
    const target = event.target.closest("[id]");
    const map = { "ef-solar": "solar", "ef-solar-name": "solar", "ef-home": "home", "ef-home-name": "home",
      "ef-grid": "grid", "ef-grid-name": "grid" };
    let part = map[target?.id];
    if (!part) part = event.target.closest("#ef-b1-label") ? "battery1" : event.target.closest("#ef-b2-label") ? "battery2" : "";
    const entityId = part && this.entityOf(part);
    if (!entityId || !this._hass) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  number(entityId) {
    const s = entityId && this._hass?.states[entityId];
    if (!s) return null;
    const v = parseFloat(s.state);
    return Number.isFinite(v) ? v : null;
  }

  watts(entityId) {
    const v = this.number(entityId);
    if (v === null) return null;
    const unit = String(this._hass.states[entityId].attributes?.unit_of_measurement || "W").toLowerCase();
    return v * (UNIT[unit] ?? 1);
  }

  // One signed reading from either a signed sensor or a pair of always-positive ones.
  signed(c, single, plus, minus) {
    let v;
    if (c[single]) v = this.watts(c[single]);
    else if (c[plus] || c[minus]) {
      const p = this.watts(c[plus]), m = this.watts(c[minus]);
      v = p === null && m === null ? null : (p || 0) - (m || 0);
    } else return null;
    return v !== null && c.invert ? -v : v;
  }

  readHass() {
    const hass = this._hass, cfg = this.config;
    const weatherState = cfg.weather && hass.states[cfg.weather]?.state;
    const latitude = Number(cfg.latitude ?? hass.config?.latitude), longitude = Number(cfg.longitude ?? hass.config?.longitude);
    const solar = this.signed(cfg.solar, "entity");
    return {
      solar: solar === null ? null : Math.abs(solar),
      home: this.signed(cfg.home, "entity"),
      grid: this.signed(cfg.grid, "entity", "import", "export"),
      battery1: { power: this.signed(cfg.battery1, "power", "discharge", "charge"), soc: this.number(cfg.battery1.soc) },
      battery2: { power: this.signed(cfg.battery2, "power", "discharge", "charge"), soc: this.number(cfg.battery2.soc) },
      weather: HA_WEATHER[weatherState] || (cfg.weather ? "cloudy" : "clear"),
      sky: Number.isFinite(latitude) && Number.isFinite(longitude) ? energySky(latitude, longitude, Date.now()) : null,
      temperature: this.celsius(),
      time: Date.now(),
    };
  }

  // A temperature sensor if one is set, else the weather entity's own temperature; °F is converted.
  celsius() {
    const cfg = this.config, hass = this._hass;
    let value, unit;
    if (cfg.temperature) {
      value = this.number(cfg.temperature);
      unit = hass.states[cfg.temperature]?.attributes?.unit_of_measurement;
    } else {
      const attrs = cfg.weather && hass.states[cfg.weather]?.attributes;
      value = attrs ? parseFloat(attrs.temperature) : NaN;
      unit = attrs?.temperature_unit ?? hass.config?.unit_system?.temperature;
    }
    if (!Number.isFinite(value)) return null;
    return /F/i.test(unit || "") ? (value - 32) * 5 / 9 : value;
  }

  render() {
    const state = this.previewState || (this._hass ? this.readHass() : null);
    if (state) this.view.update(state);
  }

  getCardSize() { return 7; }

  getGridOptions() { return { columns: 12, min_columns: 6, rows: "auto" }; }

  static getConfigForm() {
    const power = { entity: { domain: "sensor" } };
    const text = { text: {} };
    const color = (name) => ({ name, selector: text });
    return {
      schema: [
        { name: "title", selector: text },
        { name: "weather", selector: { entity: { domain: "weather" } } },
        { name: "temperature", selector: { entity: { domain: "sensor", device_class: "temperature" } } },
        { name: "christmas", selector: { boolean: {} } },
        { type: "expandable", name: "solar", title: "Solar", schema: [
          { name: "entity", selector: power }, { name: "name", selector: text }, color("color"),
          { name: "show", selector: { boolean: {} } }] },
        { type: "expandable", name: "grid", title: "Grid", schema: [
          { name: "entity", selector: power }, { name: "import", selector: power }, { name: "export", selector: power },
          { name: "invert", selector: { boolean: {} } }, { name: "name", selector: text }, color("color")] },
        { type: "expandable", name: "home", title: "Home", schema: [
          { name: "entity", selector: power }, { name: "name", selector: text }] },
        ...[1, 2].map((n) => ({ type: "expandable", name: `battery${n}`, title: `Battery ${n}`, schema: [
          { name: "power", selector: power }, { name: "soc", selector: power },
          { name: "discharge", selector: power }, { name: "charge", selector: power },
          { name: "invert", selector: { boolean: {} } }, { name: "name", selector: text },
          color("color"), color("face"), { name: "show", selector: { boolean: {} } }] })),
        { type: "expandable", name: "look", title: "House colours", schema: [
          color("glass"), color("roof"), color("wall"), color("window"), color("background")] },
      ],
      computeLabel: (s) => LABELS[s.name] ?? undefined,
      computeHelper: (s) => HELPERS[s.name] ?? undefined,
    };
  }

  static getStubConfig(hass) {
    const sensors = Object.keys(hass?.states || {}).filter((id) => id.startsWith("sensor.")
      && hass.states[id].attributes?.device_class === "power");
    const find = (...words) => sensors.find((id) => words.some((w) => id.includes(w))) || "";
    const socs = Object.keys(hass?.states || {}).filter((id) => id.startsWith("sensor.")
      && hass.states[id].attributes?.device_class === "battery");
    const weather = Object.keys(hass?.states || {}).find((id) => id.startsWith("weather.")) || "";
    // Only what was found goes in, so a new card's YAML has no empty entries. christmas stays: the editor shows a
    // missing switch as off.
    const config = { christmas: true };
    if (weather) config.weather = weather;
    for (const [part, key, id] of [["solar", "entity", find("solar", "pv")], ["grid", "entity", find("grid")],
      ["home", "entity", find("home", "house", "load", "consumption")], ["battery1", "power", find("battery")],
      ["battery1", "soc", socs[0]]]) {
      if (id) (config[part] ??= {})[key] = id;
    }
    return config;
  }
}

const LABELS = {
  title: "Title", weather: "Weather entity", temperature: "Outdoor temperature sensor (optional)", christmas: "Christmas decorations (6 December to 6 January)", entity: "Power sensor", import: "Import sensor (instead of one signed sensor)",
  export: "Export sensor", invert: "Flip the sign", name: "Name", color: "Flow colour (#rrggbb)", show: "Show in picture",
  power: "Power sensor", soc: "Charge (%) sensor", discharge: "Discharge sensor (instead of one signed sensor)",
  charge: "Charge sensor", face: "Front colour (#rrggbb)", glass: "Solar glass", roof: "Roof", wall: "Wall",
  window: "Window", background: "Background",
};
const HELPERS = {
  temperature: "Above 30 °C heat haze rises off the roofs; below 3 °C frost grows, fully at -10 °C. Without a sensor the weather entity's temperature is used.",
  invert: "Grid: + is import. Batteries: + is discharging. Turn on if your sensor uses the other sign.",
};

if (!customElements.get("energy-flow-card")) {
  // The pulses move by animating --ef-beat, which must be a registered number. The picture's own @property rule is
  // ignored inside a shadow root, so it is registered for the whole page here.
  try {
    CSS.registerProperty({ name: "--ef-beat", syntax: "<number>", inherits: true, initialValue: "0" });
  } catch { /* already registered (another copy of the card) or not supported */ }
  customElements.define("energy-flow-card", EnergyFlowCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "energy-flow-card", name: "Energy Flow Card", preview: true,
    description: "An animated house showing solar, batteries, grid and home power under the real sky and weather.",
    documentationURL: "https://github.com/BieleckiLtd/energy-flow-card",
  });
  console.info(`%c ENERGY-FLOW-CARD %c ${VERSION} `, "background:#d6a62c;color:#000", "background:#17181a;color:#fff");
}

// The lab page uses the card's own sky maths.
window.EnergyFlowSky ??= energySky;
