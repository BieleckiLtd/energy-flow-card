// The picture of the house and what it does: readings in, moving pulses, labels, sky and weather out.
// One view per card. It owns the inlined SVG and updates it in place, so its animations run on between updates.

const FLOW_MIN = 50;  // watts: less than this reads as "0 kW" and draws no flow
const PULSE_SPEED = 125;  // SVG units per second on every wire
const SHORTEST_CYCLE = 275;  // very short routes should not flash rapidly
const LANE_FADE = 700;  // ms: a lane going away has faded (.ef-line's .55 s slide and .4 s fade in the svg)
const LANE_GAP = 19;  // between neighbouring lanes on the wall, in the picture's own units
const MOON_RADIUS = 22;
const HORIZON = -.27;  // the apparent centre is just below the horizon when the upper edge rises
const GRID_FLOWS = ["grid", "grid2", "grid3", "grid4"];
const EV_FLOWS = ["ev", "ev2", "ev3", "ev4"];
const B1_FLOWS = ["b1", "b1-2", "b1-3", "b1-4"], B2_FLOWS = ["b2", "b2-2", "b2-3", "b2-4"];
const HOT = 30;  // °C: above this the air shimmers
const FROST_START = 3;  // °C: frost begins to form here...
const FROST_FULL = -10;  // ...and is fully grown here
const GARAGE_MOVES = 1800;  // ms the shutter takes to roll up or down, with its delay
const EXTRA_ROW = 38;  // picture units between the rows of home's other loads (the list's line-height)
const EXTRA_ROWS = 5.5;  // rows in sight at most, up into the sky above home: the half row shows the list goes on
const EXTRA_BOTTOM = 252;  // where the list ends, just above the home label

// The weather the picture can draw, and how much of the sky (sun, moon, twilight) shows through each.
export const WEATHERS = ["clear", "partly", "cloudy", "fog", "drizzle", "rain", "heavy", "snow", "storm"];
const PICTURE_WEATHER = { clear: "clear", partly: "cloudy", cloudy: "cloudy", fog: "fog", drizzle: "drizzle", rain: "rain", heavy: "heavy", snow: "snow", storm: "storm" };
// Snow showers let some sky through, so a winter moon still shows.
const SKY_VISIBILITY = { clear: 1, partly: .62, cloudy: .12, snow: .5 };

// Where each lane into the house sits (LANE_GAP apart, 0 = in line with battery 1's pipe), given which sources feed
// the house; b2Alone: battery 2 busy and battery 1 not, so a lone line runs in line with battery 2's pipe. Lanes that
// do not run get the place they would take, for their fade. Five lanes do not fit (places -1 to 2): with both
// batteries feeding and one lane too many, the batteries share battery 1's line and the car takes battery 2's place.
export function housePlaces(fed, b2Alone) {
  const ORDER = ["solar", "b1", "b2", "grid", "ev"], SHARED = ["solar", "b1", "ev", "grid"];
  const plan = (share) => {
    const order = share ? SHARED : ORDER, list = order.filter((k) => fed[k]);
    const count = list.length;
    let anchor = 0, at = count <= 1 && b2Alone ? 1 : 0;  // the first lane, at the top place
    if (list.includes("b1")) [anchor, at] = [list.indexOf("b1"), 0];
    else if (list.includes("b2")) [anchor, at] = [list.indexOf("b2"), 1];
    const places = {};
    list.forEach((k, i) => { places[k] = at + i - anchor; });
    if (share) places.b2 = places.b1;
    return places;
  };
  let share = false, places = plan(false);
  const lowest = () => Math.max(0, ...Object.values(places));
  if (lowest() > 2 && fed.b1 && fed.b2) { share = true; places = plan(true); }
  const shift = Math.max(0, lowest() - 2);  // still too low: all up
  for (const k of Object.keys(places)) places[k] -= shift;
  // the rest, where they would come and go: solar on top, the batteries at their pipes, the grid and the car below
  const top = Math.min(0, ...Object.values(places)), bottom = Math.min(2, lowest() + 1);
  const idle = Object.keys(places).length ? null : (b2Alone ? 1 : 0);
  places.solar ??= Math.max(-1, top - 1);
  places.b1 ??= 0;
  places.b2 ??= 1;
  places.grid ??= idle ?? bottom;
  places.ev ??= idle ?? bottom;
  return { places, share };
}

// 6 December to 6 January
export function christmasSeason(time) {
  const day = new Date(time ?? Date.now()), md = (day.getMonth() + 1) * 100 + day.getDate();
  return md >= 1206 || md <= 106;
}

export const DEFAULTS = {
  solar: { show: true, name: "Solar", color: "#d6a62c" },
  home: { name: "Home" },
  ev: { name: "EV", color: "#9b7bea" },
  grid: { name: "Grid", color: "#cfd3d6" },
  battery1: { show: true, name: "Battery 1", color: "#4dbd80", face: "#eeeeee" },
  battery2: { show: true, name: "Battery 2", color: "#4aa5f2", face: "#4b4e54" },
  look: { glass: "#2d334d", roof: "#333333", wall: "#0a0a0a", window: "#d6d3ca", background: "#17181a" },
};
// Light mode: what replaces a default colour the owner left as it is. The house's own light colours are in the
// svg's .ef-light rule; these are the ones the card itself sets.
export const LIGHT = { grid: { color: "#8a9097" }, look: { background: "#e8e9eb" } };
// The colour a part is drawn in: the owner's, or in light mode the light one where theirs is the default.
export function themed(cfg, part, key) {
  const value = cfg[part]?.[key];
  return cfg.light && LIGHT[part]?.[key] && (!value || value.toLowerCase() === DEFAULTS[part][key]) ? LIGHT[part][key] : value;
}

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
// A light wall tinted by moonlight as the sky darkens (see .ef-light in the svg), where the browser has color-mix.
const DUSK = typeof CSS !== "undefined" && CSS.supports?.("color", "color-mix(in srgb, red, blue 10%)");
const dusk = (c) => (DUSK ? `color-mix(in srgb, ${c}, var(--ef-n-wall, #8e9cc4) calc(var(--ef-darkness, 0) * var(--ef-n-wall-p, 26%)))` : c);

// Every colour the picture takes from the config, as the SVG's custom properties. Only colours that differ from
// the drawing's own are set, so an untouched card looks exactly as drawn (in light mode, as the .ef-light rule has it).
function colorVars(cfg) {
  const vars = {};
  const set = (part, key, fn) => {
    const value = cfg[part]?.[key];
    if (value && validColor(value) && value.toLowerCase() !== DEFAULTS[part][key]) Object.assign(vars, fn(value));
  };
  set("solar", "color", (c) => ({ "--ef-solar-color": c }));
  set("grid", "color", (c) => ({ "--ef-grid-color": c }));
  const light = !!cfg.light;
  set("ev", "color", (c) => ({ "--ef-ev-color": c, "--ef-ev-dir": mix(c, "#ffffff", .25) }));
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
  // In light mode the side walls are the wall's colour in shade, dimming after dark; dark, they take the roof's (as drawn).
  set("look", "wall", (c) => (light ? {
    "--ef-wall-1": dusk(c), "--ef-wall-2": dusk(mix(c, "#000000", .03)), "--ef-gable-1": dusk(mix(c, "#000000", .1)),
    "--ef-gable-2": dusk(mix(c, "#000000", .15)), "--ef-garage-wall": dusk(mix(c, "#000000", .11)), "--ef-jamb": dusk(mix(c, "#000000", .21)),
  } : { "--ef-wall-1": c, "--ef-wall-2": mix(c, "#ffffff", .02) }));
  set("look", "roof", (c) => (light ? {
    "--ef-roof-1": c, "--ef-roof-2": mix(c, "#000000", .14), "--ef-roof-3": mix(c, "#000000", .2),
    "--ef-roof-back-1": mix(c, "#ffffff", .03), "--ef-roof-back-2": mix(c, "#000000", .05),
    "--ef-roof-edge": mix(c, "#ffffff", .15), "--ef-roof-line": mix(c, "#000000", .12), "--ef-fascia": mix(c, "#ffffff", .18),
    "--ef-roof-ridge": mix(c, "#ffffff", .28),
  } : {
    "--ef-roof-1": c, "--ef-roof-2": mix(c, "#000000", .14), "--ef-roof-3": mix(c, "#000000", .2),
    "--ef-roof-back-1": mix(c, "#ffffff", .03), "--ef-roof-back-2": mix(c, "#000000", .05),
    "--ef-gable-1": mix(c, "#000000", .25), "--ef-gable-2": mix(c, "#000000", .45),
  }));
  return vars;
}

// Heat shimmer. The SVG displacement filter this replaces ran at about 1 fps on an iPhone: Safari computes SVG
// filters on the CPU, at full screen density, on every frame. Here the picture's still parts (.ef-bake) are
// rasterized onto a canvas behind it, and a fragment shader bends them through rising noise on the GPU. The picture
// hides its own copies of those parts (.ef-baked) only once the canvas shows them; everything that moves stays live
// on top. The snapshot is taken again when the still parts change (sky, sun, colours) and cross-faded in.
const SHIMMER_VERTEX = "attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}";
const SHIMMER_FRAGMENT = `precision highp float;
varying vec2 v;
uniform sampler2D u_a,u_b;
uniform float u_mix,u_t,u_scale;
const vec2 SIZE=vec2(1170.,1408.);
vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453)*2.-1.;}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(dot(hash(i),f),dot(hash(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
             mix(dot(hash(i+vec2(0.,1.)),f-vec2(0.,1.)),dot(hash(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){return noise(p)+.5*noise(p*2.+vec2(17.3,5.9));}
void main(){
  vec2 p=v*SIZE;
  float fade=1.-clamp((p.y-560.)/200.,0.,1.);  // only the sky and roofs shimmer: from the eaves down it fades out
  vec2 d=vec2(0.);
  if(fade>0.){
    vec2 q=vec2(p.x*.011,(p.y+u_t*75.)*.042);  // stretched sideways, rising 75 units a second
    d=u_scale*.5*fade*vec2(fbm(q),fbm(q+vec2(31.7,11.1)));
  }
  vec2 uv=clamp((p+d)/SIZE,0.,1.);
  gl_FragColor=mix(texture2D(u_a,uv),texture2D(u_b,uv),u_mix);
}`;
const SHIMMER_FADE = 600;  // ms to cross-fade a new snapshot in
// Rasterizing the picture holds up the page for a moment, which shows as a hitch in every animation. The sky
// background is sampled again only when the look changes (weather, night, decorations, colours) or after this long
// (ms): the sun, the light and the clouds move slowly enough.
const RESAMPLE = 60000;
const TRANSIENT = new Set(["ef-paused", "ef-baked", "ef-still", "ef-restart", "ef-garage-moving", "ef-relabel", "ef-swap"]);
const lookKey = (svg) => [...svg.classList].filter((c) => !TRANSIENT.has(c)).join(" ")
  + "|" + svg.getAttribute("data-weather") + "|" + svg.getAttribute("data-time");

class HeatShimmer {
  constructor(svg, view) {
    this.svg = svg;
    this.view = view;
    this.scale = 3;
    this.markup = null;
    this.busy = false;
    this.dirty = false;
    this.shown = false;
    this.raf = 0;
    this.fadeStart = -1;
    const canvas = this.canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;pointer-events:none;visibility:hidden";  // laid out even while hidden
    const gl = this.gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || !this.build()) { this.failed = true; return; }
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); this.destroy(); });
    this.frame = (now) => {
      this.raf = 0;
      this.draw(now);
      if (this.running()) this.raf = requestAnimationFrame(this.frame);
    };
    this.resizer = typeof ResizeObserver === "function" ? new ResizeObserver(() => this.place()) : null;
  }

  build() {
    const gl = this.gl;
    const shader = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, SHIMMER_VERTEX), fs = shader(gl.FRAGMENT_SHADER, SHIMMER_FRAGMENT);
    if (!vs || !fs) return false;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    this.u = Object.fromEntries(["u_a", "u_b", "u_mix", "u_t", "u_scale"].map((n) => [n, gl.getUniformLocation(program, n)]));
    gl.uniform1i(this.u.u_a, 0);
    gl.uniform1i(this.u.u_b, 1);
    this.textures = [0, 1].map(() => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
      for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR);
      return t;
    });
    return true;
  }

  // Shown above HOT; scale is how far the air bends the picture, in its own units.
  show(scale) {
    if (this.failed) return;
    this.scale = scale;
    if (!this.canvas.isConnected) {
      const host = this.svg.parentNode;
      positioned(host);
      positioned(this.svg);  // stays above the canvas
      host.insertBefore(this.canvas, this.svg);
      this.resizer?.observe(this.svg);
    }
    this.place();
    this.refresh();
  }

  hide() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.shown = false;
    this.markup = null;
    this.fadeStart = -1;
    this.svg.classList.remove("ef-baked");
    this.canvas.style.visibility = "hidden";
  }

  destroy() {
    if (this.dead) return;  // once: a lost context fires again on a renderer already gone
    this.dead = true;
    this.hide();
    this.failed = true;
    this.resizer?.disconnect();
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.canvas.remove();
  }

  running() {
    return this.shown && this.view.pulsesRun();
  }

  // Lines the canvas up with the picture's drawing area inside the svg box.
  place() {
    if (this.failed || !this.canvas.isConnected) return;
    const size = fitCanvas(this.canvas, this.svg, this.view.densityCap);
    if (!size) return;
    const { w, h } = size;
    if (w !== this.canvas.width || h !== this.canvas.height) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
      if (this.shown) { this.markup = null; this.refresh(); }
    }
  }

  // The still parts alone, as they look now, at the canvas's size.
  stillMarkup() {
    const clone = this.svg.cloneNode(true);
    clone.classList.remove("ef-baked", "ef-paused", "ef-still");
    clone.style.removeProperty("position");
    const scene = clone.querySelector("#ef-scene");
    for (const el of [...scene.children]) if (!el.classList.contains("ef-bake")) el.remove();
    for (const el of [...clone.children]) if (el.localName !== "defs" && el !== scene) el.remove();
    clone.setAttribute("width", this.canvas.width);
    clone.setAttribute("height", this.canvas.height);
    return new XMLSerializer().serializeToString(clone);
  }

  // A new snapshot, once things settle, if the still parts look any different.
  refresh() {
    if (this.failed || !this.canvas.width) return;
    if (this.markup && this.key === this.view.stillKey() && performance.now() - this.snapAt < RESAMPLE) return;
    this.dirty = true;
    if (this.busy || (this.shown && !this.running())) return;
    this.busy = true;
    setTimeout(async () => {
      try {
        while (this.dirty && !this.failed && this.svg.classList.contains("ef-hot")) {
          this.dirty = false;
          const key = this.view.stillKey();
          const markup = this.stillMarkup();
          if (markup === this.markup) { this.key = key; this.snapAt = performance.now(); continue; }
          const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
          try {
            const image = new Image();
            image.src = url;
            await image.decode();
            // drawn into a bitmap away from the frame being shown, where the browser can; the upload is then quick
            let source = image;
            if (typeof createImageBitmap === "function") source = await createImageBitmap(image).catch(() => image);
            if (this.failed || !this.svg.classList.contains("ef-hot")) break;
            this.upload(source);
            source.close?.();
            this.markup = markup;
            this.key = key;
            this.snapAt = performance.now();
          } finally {
            URL.revokeObjectURL(url);
          }
        }
      } catch {
        this.destroy();  // no shimmer where the browser cannot rasterize the picture; it keeps its own still parts
      } finally {
        this.busy = false;
      }
    }, 250);
  }

  // Snapshot again on the next update, e.g. after new colours.
  // The snapshot in use stays: one that comes out the same (a name changed, say) is not drawn and uploaded again.
  invalidate() { this.key = null; }

  upload(image) {
    const gl = this.gl;
    if (!this.shown) {
      gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      this.shown = true;
      this.canvas.style.visibility = "inherit";  // hidden with its host
      this.draw(performance.now());
      this.svg.classList.add("ef-baked");
    } else {
      if (this.fadeStart >= 0) this.draw(this.fadeStart + SHIMMER_FADE);  // finish the previous cross-fade first
      gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      this.fadeStart = performance.now();
    }
    this.sync();
  }

  // The air moves only while the picture is on screen.
  sync() {
    if (!this.shown) return;
    if (this.running()) {
      if (!this.raf) this.raf = requestAnimationFrame(this.frame);
      if (this.dirty) this.refresh();
    } else {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      if (this.fadeStart >= 0) this.draw(this.fadeStart + SHIMMER_FADE);
    }
  }

  draw(now) {
    const gl = this.gl, u = this.u;
    let blend = 0;
    if (this.fadeStart >= 0) {
      blend = Math.min(1, (now - this.fadeStart) / SHIMMER_FADE);
      if (blend >= 1) { this.textures.reverse(); this.fadeStart = -1; blend = 0; }
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
    gl.uniform1f(u.u_mix, blend);
    gl.uniform1f(u.u_t, (now / 1000) % 600);
    gl.uniform1f(u.u_scale, this.scale);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// Lines a canvas up with the picture's drawing area inside the svg box; returns its size in device pixels, at
// most cap pixels per CSS pixel.
// An element that what is laid over it is placed against. Home Assistant makes a card (and the first readings go in)
// before it is on the page, when nothing has a computed position yet: anything but a known one counts as static.
// Otherwise the canvases are placed against some element outside the card and stay behind when the card moves.
function positioned(el) {
  if (!/^(relative|absolute|fixed|sticky)$/.test(getComputedStyle(el).position)) el.style.position = "relative";
}

function fitCanvas(canvas, svg, cap = Infinity) {
  const parent = canvas.offsetParent;
  if (!parent) return null;
  const box = svg.getBoundingClientRect(), host = parent.getBoundingClientRect();
  if (!box.width || !box.height) return null;
  let width = box.width, height = box.height;
  let left = box.left - host.left - parent.clientLeft, top = box.top - host.top - parent.clientTop;
  if (width / height > 1170 / 1408) { left += (width - height * 1170 / 1408) / 2; width = height * 1170 / 1408; }
  else { top += (height - width * 1408 / 1170) / 2; height = width * 1408 / 1170; }
  // In percentages of the host, so the canvas keeps to the picture through a resize before this runs again: turning
  // an iPhone holds back the resize callbacks for the length of the turn, and pixels left the pulses behind.
  const pw = parent.clientWidth || host.width, ph = parent.clientHeight || host.height;
  const pct = (v, of) => `${(v / of * 100).toFixed(4)}%`;
  Object.assign(canvas.style, { left: pct(left, pw), top: pct(top, ph), width: pct(width, pw), height: pct(height, ph) });
  const density = Math.min(devicePixelRatio || 1, cap, 2048 / width);
  return { w: Math.round(width * density), h: Math.round(height * density) };
}

function compileProgram(gl, vertex, fragment) {
  const shader = (type, source) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

// Energy pulses on the GPU. In the svg each pulse is ~50 stacked dashes that all end at its head, so their opacities
// add up to a smooth tail; moving 918 of them by CSS made the browser restyle every one on every frame, which phones
// and tablets could not keep up with. Here each piece of a pulse is one strip along its route, and the shader works
// out the same stacked dashes per pixel from the beat. The canvas sits over the picture; what the svg draws over
// the pulses (meter box, panels, batteries, pipe edges, fog...) is rasterized into masks that cut them out again.
const DASHES = 52;  // dashes read per piece (the svg has 51)
// The stacked dashes repeat along the route, so their coverage over one period is worked out once per piece (after a
// reading, or when the canvas changes size) into a 1-pixel-high texture: each pixel then reads one value instead of
// adding up every dash. The strip's long edges are smoothed here too (a_out: -1 left edge, 1 right edge, pushed out by
// a pixel), so the canvas needs no multisampling.
const PULSE_VERTEX = `attribute vec2 a_pos,a_n,a_e;attribute float a_s,a_out;
uniform mat3 u_m;uniform float u_aa;varying float v_s;varying vec2 v_svg,v_e;
void main(){vec3 p=u_m*vec3(a_pos+a_n*a_out*u_aa,1.);v_svg=p.xy;v_s=a_s;v_e=a_e+vec2(a_out,-a_out)*u_aa;
gl_Position=vec4(p.x/585.-1.,1.-p.y/704.,0.,1.);}`;
const PULSE_FRAGMENT = `precision highp float;
uniform float u_shift,u_period,u_aa,u_alpha,u_clipOn;
uniform vec3 u_color;
uniform vec2 u_clip[4];
uniform vec4 u_box;
uniform sampler2D u_mask,u_pattern;
varying float v_s;varying vec2 v_svg,v_e;
float edge(vec2 a,vec2 b){vec2 d=normalize(b-a);return (v_svg-a).y*d.x-(v_svg-a).x*d.y;}
void main(){
  float a=texture2D(u_pattern,vec2(fract((v_s+u_shift)/u_period),.5)).a*u_alpha;
  a*=clamp(min(v_e.x,v_e.y)/u_aa+.5,0.,1.);
  if(u_clipOn>0.){
    float d=min(min(edge(u_clip[0],u_clip[1]),edge(u_clip[1],u_clip[2])),min(edge(u_clip[2],u_clip[3]),edge(u_clip[3],u_clip[0])));
    a*=clamp(d/u_aa+.5,0.,1.);
  }
  a*=1.-texture2D(u_mask,(v_svg-u_box.xy)/u_box.zw).a;
  gl_FragColor=vec4(u_color*a,a);
}`;
// One piece's dashes over one period, as alpha: what the shader worked out per pixel before (a dash of length L
// starts lead*L ahead of the beat, its ends smoothed over aa), sampled finely enough for the texture's linear filter.
export function dashPattern(lengths, opacities, lead, period, aa, size) {
  const out = new Uint8Array(size), dashes = [];
  for (let i = 0; i < lengths.length; i++) if (opacities[i] > 0) dashes.push([lengths[i], opacities[i]]);
  for (let k = 0; k < size; k++) {
    const x = (k + .5) / size * period;
    let keep = 1;
    for (const [L, o] of dashes) {
      const u = ((x + lead * L) % period + period) % period;
      const c = Math.max(Math.min(Math.max(Math.min(u, L - u) / aa + .5, 0), 1), Math.min(Math.max((u - period) / aa + .5, 0), 1));
      keep *= 1 - o * c;
    }
    out[k] = Math.round((1 - keep) * 255);
  }
  return out;
}
const PULSE_BOX = [0, 640, 1000, 520];  // x, y, width, height: where pulses can be, in the picture's units
const MASK_WAIT = 700;  // ms after a change before the masks are drawn again (lanes slide for .55 s)
const CONFIG_SETTLE = 400;  // ms without a config change before the picture is sampled again
class PulseRenderer {
  constructor(view) {
    this.view = view;
    this.svg = view.svg;
    this.ready = false;
    this.raf = 0;
    const canvas = this.canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;pointer-events:none;visibility:hidden";
    const gl = this.gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl || gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < 16 || !this.build()) { this.failed = true; return; }
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); this.destroy(); });
    this.frame = (now) => {
      this.raf = 0;
      this.draw(now);
      if (this.view.pulsesRun()) this.next();
    };
    this.pieces = this.findPieces();
    this.resizer = typeof ResizeObserver === "function" ? new ResizeObserver(() => this.place()) : null;
  }

  build() {
    const gl = this.gl, program = compileProgram(gl, PULSE_VERTEX, PULSE_FRAGMENT);
    if (!program) return false;
    gl.useProgram(program);
    this.a = {};
    for (const n of ["pos", "n", "e", "s", "out"]) { this.a[n] = gl.getAttribLocation(program, `a_${n}`); gl.enableVertexAttribArray(this.a[n]); }
    this.u = {};
    for (const n of ["u_m", "u_shift", "u_period", "u_aa", "u_alpha", "u_clipOn", "u_color", "u_clip", "u_box", "u_mask", "u_pattern"]) {
      this.u[n] = gl.getUniformLocation(program, n);
    }
    gl.uniform1i(this.u.u_mask, 0);
    gl.uniform1i(this.u.u_pattern, 1);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    this.maxPattern = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.blank = this.texture(new Uint8Array([0, 0, 0, 0]));
    return true;
  }

  texture(pixel) {
    const gl = this.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
    for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR);
    if (pixel) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return t;
  }

  // Every group of stacked dashes is one piece: same route, frame, colour and width.
  findPieces() {
    const pieces = [], levels = new Map();
    for (const flow of this.svg.querySelectorAll(".ef-flow")) {
      const groups = new Map();
      for (const dash of flow.querySelectorAll(".ef-pulse")) {
        if (!groups.has(dash.parentNode)) groups.set(dash.parentNode, []);
        groups.get(dash.parentNode).push(dash);
      }
      // Pulses at one depth in the picture share a mask: everything drawn after the first of them.
      const level = flow.closest("#ef-lines, .ef-grid-pipe, #ef-solar-drop, #ef-ev-drop, #ef-l-b1, #ef-l-b2") || flow;
      if (!levels.has(level)) levels.set(level, { first: flow, texture: null });
      for (const [group, dashes] of groups) {
        const clipHost = group.closest("[clip-path]");
        pieces.push({ group, dashes, flow, line: flow.closest(".ef-line"), level: levels.get(level),
          route: this.svg.getElementById(dashes[0].getAttribute("href").slice(1)),
          clipHost: clipHost && this.svg.contains(clipHost) ? clipHost : null });
      }
    }
    this.levels = [...levels.values()];
    for (const piece of pieces) this.measure(piece);
    return pieces;
  }

  // Fixed per piece: the route as a strip, the dashes' lengths and opacities, the clip.
  measure(piece) {
    const gl = this.gl, style = (el) => getComputedStyle(el);
    const lengths = new Float32Array(DASHES), opacities = new Float32Array(DASHES);
    piece.dashes.slice(0, DASHES).forEach((dash, i) => {
      lengths[i] = parseFloat(style(dash).getPropertyValue("--ef-length")) || 0;
      opacities[i] = parseFloat(style(dash).opacity) || 0;
    });
    piece.lengths = lengths;
    piece.opacities = opacities;
    piece.width = parseFloat(style(piece.dashes[0]).strokeWidth) || 1;
    const route = piece.route, total = route.getTotalLength(), steps = Math.max(2, Math.ceil(total / 2));
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const s = total * i / steps, p = route.getPointAtLength(s);
      points.push({ x: p.x, y: p.y, s });
    }
    // Across the stroke: its two edges, or more columns where the head turns into a face that is cut on a slant
    // (data-head-skew="offset:lead ...", offsets across the stroke on the route's left-hand normal, leads in route
    // units, reached over the last data-head-ramp units). The grid riser's head leans that way through its bend,
    // so it meets the slanted head of the top face beyond the seam without a gap.
    const half = piece.width / 2, data = [], host = piece.group.closest("[data-head-skew]");
    let columns = [{ p: -half, lead: 0 }, { p: half, lead: 0 }], ramp = 0;
    if (host) {
      columns = host.dataset.headSkew.trim().split(/\s+/).map((t) => { const [p, lead] = t.split(":").map(Number); return { p, lead }; })
        .sort((a, b) => a.p - b.p);
      ramp = Number(host.dataset.headRamp) || 0;
    }
    // per vertex: x, y, the left-hand normal (the outer columns are pushed out along it in the shader), the distance
    // to each long edge, s, and which edge it is on
    const left = columns[0].p, right = columns[columns.length - 1].p;
    const rows = points.map((p, i) => {
      const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
      const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1, nx = -dy / n, ny = dx / n;
      const turn = ramp ? smoothstep(total - ramp, total, p.s) : 0;
      return columns.map((c, j) => [p.x + nx * c.p, p.y + ny * c.p, nx, ny, c.p - left, right - c.p, p.s - c.lead * turn,
        j === 0 ? -1 : j === columns.length - 1 ? 1 : 0]);
    });
    for (let i = 0; i + 1 < rows.length; i++) {
      for (let j = 0; j + 1 < columns.length; j++) {
        const [a, b, c, d] = [rows[i][j], rows[i][j + 1], rows[i + 1][j], rows[i + 1][j + 1]];
        data.push(...a, ...b, ...c, ...b, ...d, ...c);
      }
    }
    piece.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, piece.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    piece.count = data.length / 8;
    piece.patternKey = null;  // lengths and opacities may have changed
    piece.clip = null;
    const shape = piece.clipHost && this.svg.getElementById(piece.clipHost.getAttribute("clip-path").match(/#([^)"']+)/)?.[1])?.firstElementChild;
    if (shape) {
      let corners;
      if (shape.localName === "rect") {
        const [x, y, w, h] = ["x", "y", "width", "height"].map((k) => parseFloat(shape.getAttribute(k)) || 0);
        corners = [x, y, x + w, y, x + w, y + h, x, y + h];
      } else {
        corners = (shape.getAttribute("d").match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).slice(0, 8).map(Number);
      }
      // the clip's own frame, in the picture's units
      const m = this.toPicture(piece.clipHost) || new DOMMatrix();
      const out = [];
      for (let i = 0; i < 8; i += 2) out.push(m.a * corners[i] + m.c * corners[i + 1] + m.e, m.b * corners[i] + m.d * corners[i + 1] + m.f);
      // the shader wants the corners clockwise on screen (inside on the positive side of every edge)
      let area = 0;
      for (let i = 0; i < 8; i += 2) area += out[i] * out[(i + 3) % 8] - out[(i + 2) % 8] * out[i + 1];
      if (area < 0) for (let i = 0; i < 4; i += 2) { const j = 6 - i; [out[i], out[j], out[i + 1], out[j + 1]] = [out[j], out[i], out[j + 1], out[i + 1]]; }
      piece.clip = new Float32Array(out);
    }
  }

  // An element's own units to the picture's (viewBox) units.
  toPicture(el) {
    const root = this.svg.getScreenCTM(), own = el.getScreenCTM();
    if (!root || !own) return null;
    return DOMMatrix.fromMatrix(root).inverse().multiply(DOMMatrix.fromMatrix(own));
  }

  // After each reading: which pieces run, which way, in what colour, on which beat.
  update() {
    if (this.failed || !this.svg.isConnected) return;  // off the page nothing has a computed style to read
    this.lineStates = null;  // lanes may start to slide: draw() reads them again
    const view = this.view, cd = view.cycleDistance, svg = this.svg;
    // Computed styles are read only for pieces whose flow, colours or lane changed: after the readings went in,
    // the first such read makes the browser restyle the whole picture, which on a tablet took ~350 ms every poll
    // and stalled the animation.
    const shared = [cd, [...svg.classList].filter((c) => !TRANSIENT.has(c)).join(" "),
      view.colorKeys.map((k) => svg.style.getPropertyValue(k)).join()].join("|");
    let changed = !this.canvas.isConnected;
    for (const piece of this.pieces) {
      const flow = piece.flow, way = flow.dataset.flow;
      const key = [shared, way, flow.getAttribute("style"), piece.line?.getAttribute("class"), piece.line?.getAttribute("style")].join("|");
      if (key === piece.key) continue;
      piece.key = key;
      changed = true;
      let shown = way !== "off" && !!cd;
      for (let el = piece.group; shown && el && el !== this.svg; el = el.parentNode) if (getComputedStyle(el).display === "none") shown = false;
      piece.shown = shown;
      if (!shown) continue;
      // Measured while the picture had no styles (not drawn yet): measured again now that it runs.
      if (!piece.lengths.some(Boolean)) {
        this.gl.deleteBuffer(piece.buffer);
        this.measure(piece);
        if (!piece.lengths.some(Boolean)) { piece.key = null; piece.shown = false; continue; }  // still nothing: next reading
      }
      const turns = Number(flow.style.getPropertyValue("--ef-turns")) || 1;
      piece.lead = way === "in" ? 0 : 1;
      piece.direction = way === "in" ? 1 : -1;
      piece.period = cd * turns;
      piece.fixed = -(parseFloat(getComputedStyle(piece.dashes[0]).getPropertyValue("--ef-junction")) || 0)
        + (Number(flow.style.getPropertyValue("--ef-turn")) || 0) * cd;
      piece.color = this.rgb(getComputedStyle(piece.dashes[0]).stroke);
      piece.matrix = this.toPicture(piece.group);
      if (!piece.matrix) piece.shown = false;
      // taken where the lane is now, which may be the start of its slide: drawn frames take it again (below)
      piece.moving = true;
    }
    if (!this.canvas.isConnected) {
      const host = this.svg.parentNode;
      positioned(host);
      positioned(this.svg);
      this.svg.after(this.canvas);  // over the picture
      this.resizer?.observe(this.svg);
    }
    if (changed) this.place();
    this.scheduleMasks();
    this.sync();
  }

  rgb(color) {
    this.ink ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const g = this.ink;
    g.clearRect(0, 0, 1, 1);
    g.fillStyle = "#000";
    g.fillStyle = color;
    g.fillRect(0, 0, 1, 1);
    const [r, gr, b] = g.getImageData(0, 0, 1, 1).data;
    return [r / 255, gr / 255, b / 255];
  }

  place() {
    if (this.failed || !this.canvas.isConnected) return;
    const size = fitCanvas(this.canvas, this.svg, this.view.densityCap);
    if (!size || (size.w === this.canvas.width && size.h === this.canvas.height)) return;
    this.canvas.width = size.w;
    this.canvas.height = size.h;
    this.gl.viewport(0, 0, size.w, size.h);
    this.maskKey = null;
    this.scheduleMasks();
    if (this.ready) this.draw(performance.now());
  }

  // The masks: for each depth, the alpha of everything the svg draws over its pulses (except other pulses, rain,
  // snow and the labels, which never cover a pipe), over the area the pulses can reach. Drawn again when the look
  // or the lanes change, or once a minute.
  scheduleMasks() {
    const lanes = [...this.svg.querySelectorAll(".ef-line")].map((l) => l.className.baseVal + l.style.transform).join();
    const key = `${lookKey(this.svg)}|${lanes}|${this.canvas.width}`;
    if (key === this.maskKey && performance.now() - this.maskAt < RESAMPLE) return;
    this.maskKey = key;
    // One redraw waits or runs at a time and draws the picture as it is when it runs: readings coming in meanwhile
    // (Home Assistant sends one for every state change in the house) do not put it off; one during a run asks for
    // one more after it.
    if (this.maskBusy) { this.maskAgain = true; return; }
    if (this.maskTimer) return;
    this.maskTimer = setTimeout(async () => {
      this.maskTimer = 0;
      this.maskBusy = true;
      try { await this.drawMasks(); } catch { this.destroy(); return; } finally { this.maskBusy = false; }
      if (this.maskAgain) { this.maskAgain = false; this.maskKey = null; this.scheduleMasks(); }
    }, this.ready ? MASK_WAIT : 0);
  }

  async drawMasks() {
    if (this.failed || !this.canvas.width) return;
    const run = this.maskRun = (this.maskRun || 0) + 1;  // a later run supersedes this one
    const box = this.box = PULSE_BOX, scale = this.canvas.width / 1170;
    const width = Math.max(1, Math.round(box[2] * scale)), height = Math.max(1, Math.round(box[3] * scale));
    // One copy of the picture serves every depth (a copy each was a lot of memory on a small device). The depths
    // come in the picture's own order, so each drops all that the one before dropped and more: the copy is stripped
    // further for each. What goes is settled from the elements' places in the whole copy, taken before any is gone.
    const clone = this.svg.cloneNode(true);
    clone.classList.remove("ef-baked", "ef-gl", "ef-paused", "ef-still");
    clone.style.removeProperty("position");
    clone.setAttribute("viewBox", box.join(" "));
    clone.setAttribute("width", width);
    clone.setAttribute("height", height);
    const live = [...this.svg.querySelectorAll("*")], all = [...clone.querySelectorAll("*")];
    const defs = clone.querySelector("defs");
    const used = new Set([...clone.querySelectorAll("use")].map((u) => u.getAttribute("href")?.slice(1)));
    const kept = all.map((el) => !!el.closest("defs, clipPath, mask, linearGradient, radialGradient, filter, pattern, style"));
    // what never covers a pipe (a pipe's body lies under its own pulses and never over another's)
    const never = all.map((el) => el.matches(".ef-flow, .ef-pulse, .ef-lane, #ef-rain, #ef-snow, #ef-labels, .ef-lead, #ef-flash"));
    const pulse = all.map((el) => el.matches(".ef-flow, .ef-pulse"));
    const firsts = this.levels.map((level) => {
      const at = live.indexOf(level.first), holders = new Set();
      for (let el = all[at]; el; el = el.parentNode) holders.add(el);
      return { at, holders };
    });
    const gone = new Set();
    for (const [n, level] of this.levels.entries()) {
      const { at, holders } = firsts[n];
      all.forEach((el, i) => {
        if (kept[i] || gone.has(el)) return;
        // before the pulses (and not holding any of them), or pulses themselves, or what never covers a pipe
        if (!((i < at && !holders.has(el)) || i === at || never[i])) return;
        gone.add(el);
        // something a later <use> draws stays, out of sight in <defs>
        if (el.id && used.has(el.id) && !pulse[i]) defs.append(el); else el.remove();
      });
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
      try {
        const image = new Image();
        image.src = url;
        await image.decode();
        let source = image;
        if (typeof createImageBitmap === "function") source = await createImageBitmap(image).catch(() => image);
        if (this.failed || run !== this.maskRun) return;
        const gl = this.gl;
        level.texture ??= this.texture();
        gl.bindTexture(gl.TEXTURE_2D, level.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        source.close?.();
      } finally {
        URL.revokeObjectURL(url);
      }
    }
    this.maskAt = performance.now();
    if (!this.ready) {
      this.ready = true;
      this.canvas.style.visibility = "inherit";
      this.svg.classList.add("ef-gl");
    }
    this.draw(performance.now());
    this.sync();
  }

  // The next frame: at once on high, else after a pause (a timer, so the page is not woken every screen refresh).
  next() {
    if (this.raf || this.wait) return;
    const fps = LEVELS[this.view.level]?.fps ?? Infinity;
    if (!Number.isFinite(fps)) { this.raf = requestAnimationFrame(this.frame); return; }
    this.wait = setTimeout(() => { this.wait = 0; this.raf = requestAnimationFrame(this.frame); }, Math.max(0, 1000 / fps - 8));
  }

  stopFrames() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.wait);
    this.raf = this.wait = 0;
  }

  sync() {
    if (!this.ready) return;
    if (this.view.pulsesRun()) this.next();
    else { this.stopFrames(); this.draw(performance.now()); }
  }

  destroy() {
    if (this.dead) return;  // once: a lost context fires again on a renderer already gone
    this.dead = true;
    this.stopFrames();
    clearTimeout(this.maskTimer);
    this.failed = true;
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.svg.classList.remove("ef-gl");  // the svg's own pulses again, started in step
    this.view.restartBeats();
    this.view.flushBeats();
    this.view.alignBeats();
    this.resizer?.disconnect();
    this.canvas.remove();
  }

  // Binds the piece's dash pattern, worked out again when its dashes, beat or the pixel size changed.
  pattern(piece, aa) {
    const gl = this.gl, key = `${piece.lead}|${piece.period}|${aa}`;
    piece.patternTexture ??= this.texture();
    gl.bindTexture(gl.TEXTURE_2D, piece.patternTexture);
    if (piece.patternKey === key) return;
    piece.patternKey = key;
    // two texels to a pixel at least; a power of two, so the texture can repeat
    let size = 64;
    while (size < piece.period / aa * 2 && size < this.maxPattern) size *= 2;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, size, 1, 0, gl.ALPHA, gl.UNSIGNED_BYTE,
      dashPattern(piece.lengths, piece.opacities, piece.lead, piece.period, aa, size));
  }

  draw(now) {
    if (!this.ready) return;
    const gl = this.gl, u = this.u, view = this.view;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const beat = (now - view.beatStart) * PULSE_SPEED / 1000;
    const aa = 1170 / this.canvas.width;
    gl.uniform1f(u.u_aa, aa);
    gl.uniform4f(u.u_box, ...this.box);
    // Each lane's [moving, opacity], read once after a reading and then only while it slides: a style read every
    // frame made the browser bring the picture's styles up to date every frame.
    const lines = this.lineStates ??= new Map();
    for (const piece of this.pieces) {
      if (!piece.shown) continue;
      let alpha = 1;
      if (piece.line) {
        // a lane that comes or goes fades and slides (CSS transitions): follow it while it moves, and once more
        // after a reading, as a slide that ran while no frames were drawn (tab in the background) is over by now
        if (!lines.has(piece.line) || lines.get(piece.line)[0]) {
          const ls = getComputedStyle(piece.line);
          lines.set(piece.line, [piece.line.getAnimations?.().length > 0, ls.visibility === "hidden" ? 0 : parseFloat(ls.opacity)]);
        }
        const [moving, opacity] = lines.get(piece.line);
        if (moving || piece.moving) piece.matrix = this.toPicture(piece.group) || piece.matrix;
        piece.moving = moving;
        alpha = opacity;
        if (!alpha) continue;
      }
      const m = piece.matrix;
      gl.uniformMatrix3fv(u.u_m, false, [m.a, m.b, 0, m.c, m.d, 0, m.e, m.f, 1]);
      gl.uniform1f(u.u_shift, piece.direction * (beat % piece.period) + piece.fixed);
      gl.uniform1f(u.u_period, piece.period);
      gl.uniform1f(u.u_alpha, alpha);
      gl.uniform3fv(u.u_color, piece.color);
      gl.uniform1f(u.u_clipOn, piece.clip ? 1 : 0);
      if (piece.clip) gl.uniform2fv(u.u_clip, piece.clip);
      gl.activeTexture(gl.TEXTURE1);
      this.pattern(piece, aa);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, piece.level.texture || this.blank);
      gl.bindBuffer(gl.ARRAY_BUFFER, piece.buffer);
      const at = this.a;
      gl.vertexAttribPointer(at.pos, 2, gl.FLOAT, false, 32, 0);
      gl.vertexAttribPointer(at.n, 2, gl.FLOAT, false, 32, 8);
      gl.vertexAttribPointer(at.e, 2, gl.FLOAT, false, 32, 16);
      gl.vertexAttribPointer(at.s, 1, gl.FLOAT, false, 32, 24);
      gl.vertexAttribPointer(at.out, 1, gl.FLOAT, false, 32, 28);
      gl.drawArrays(gl.TRIANGLES, 0, piece.count);
    }
  }
}

// Detail. With "auto" the view watches how evenly the picture moves while it is on screen. Where frames keep
// dropping, the GPU canvases first draw at a lower density (hard to see on a sharp screen); if that is not enough,
// the card asks which level of detail to use, trying each one out as it is picked. The lower density and the
// answer are remembered on the device. "high", "medium" and "low" fix the level for every device.
export const EFFECTS = ["auto", "high", "medium", "low"];
const LEVELS = {
  // fps: how often the pulse layer draws. The pulses move slowly, and each frame costs a phone's GPU and battery.
  high: { cap: Infinity, shimmer: true, fps: Infinity, label: "High" },
  medium: { cap: 1.5, shimmer: false, fps: 30, label: "Medium" },
  low: { cap: 1, shimmer: false, fps: 20, label: "Low" },
};
const OLD_EFFECTS = { full: "high", reduced: "low" };  // the names in 0.4.0
export const effectsLevel = (value) => OLD_EFFECTS[value] ?? (EFFECTS.includes(value) ? value : "auto");
const EFFECTS_KEY = "energy-flow-card.effects";
const WATCH_TIME = 60000;  // ms of moving picture per verdict
const LOW_DENSITY = 1.5;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Where the system's Reduce Motion switch lives, for the hint shown while it keeps the pulses still.
export function motionSettingsPath(userAgent = "", platform = "", touchPoints = 0) {
  if (/iPhone|iPad|iPod/.test(userAgent) || (platform === "MacIntel" && touchPoints > 1)) {
    return "Settings → Accessibility → Motion → Reduce Motion";  // iPadOS reports itself as a Mac
  }
  if (/Android/.test(userAgent)) return "Settings → Accessibility → Remove animations";
  if (/Mac/.test(platform) || /Macintosh/.test(userAgent)) return "System Settings → Accessibility → Display → Reduce motion";
  if (/Win/.test(platform) || /Windows/.test(userAgent)) return "Settings → Accessibility → Visual effects → Animation effects";
  return "";
}
function remembered() {
  try { return JSON.parse(localStorage.getItem(EFFECTS_KEY)) || {}; } catch { return {}; }
}
function remember(patch) {
  try { localStorage.setItem(EFFECTS_KEY, JSON.stringify({ ...remembered(), ...patch })); } catch { /* private mode */ }
  dispatchEvent(new Event(EFFECTS_KEY));  // every card on the page follows
}

// Whether frame times show a struggling page. The screen's own frame time is taken from the quickest frames, so a
// browser that caps the page at 30 fps (iPhone Low Power Mode) reads as smooth while it is even; what counts is
// time lost to frames that came late.
export function choppy(times) {
  if (times.length < 30) return false;
  const sorted = [...times].sort((a, b) => a - b);
  const base = sorted[Math.floor(sorted.length * .1)];
  let lost = 0, total = 0;
  for (const t of times) { total += t; if (t > base * 1.7) lost += t - base; }
  return base > 45 || lost / total > .2;
}

class FrameWatch {
  constructor(verdict) {
    this.verdict = verdict;
    this.raf = 0;
    this.reset();
    this.frame = (now) => {
      this.raf = requestAnimationFrame(this.frame);
      const dt = now - this.last;
      if (this.last && dt < 1000) { this.times.push(dt); this.total += dt; }  // not the gap after a pause
      this.last = now;
      if (this.total >= WATCH_TIME) { const poor = choppy(this.times); this.reset(); this.verdict(poor); }
    };
  }
  reset() { this.times = []; this.total = 0; this.last = 0; }
  start() { if (!this.raf) { this.last = 0; this.raf = requestAnimationFrame(this.frame); } }
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }
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
    this.densityCap = Infinity;
    this.level = "high";
    this.chosen = null;  // the level picked in the config or by the viewer on this device
    this.trial = null;   // the level being tried out in the question
    this.fine = 0;
    this.watch = new FrameWatch((poor) => this.frameVerdict(poor));
    this.onEffects = () => { this.applyEffects(); this.motionHint(); };
    addEventListener(EFFECTS_KEY, this.onEffects);

    const svg = this.svg;
    // Flows drawn as <use> copies of a shared pulse (the house lanes) become real copies, so that every dash is an
    // element of its own that the pulse renderer can measure.
    for (const use of [...svg.querySelectorAll("use.ef-flow")]) {
      const flow = document.createElementNS("http://www.w3.org/2000/svg", "g");
      for (const { name, value } of use.attributes) if (name !== "href") flow.setAttribute(name, value);
      const pulse = this.part(use.getAttribute("href").slice(1)).cloneNode(true);
      pulse.removeAttribute("id");
      flow.append(pulse);
      use.replaceWith(flow);
    }
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

    // The system's Reduce Motion stops the pulses; switched while the page is open, they follow.
    this.motion = matchMedia(REDUCED_MOTION);
    this.onMotion = () => {
      this.restWhenUnseen();
      if ("celsius" in this) this.temperature(this.celsius);
      this.motionHint();
    };
    this.motion.addEventListener?.("change", this.onMotion);
    this.motionHint();
  }

  // Off the page (Home Assistant keeps cards it may show again): everything pauses, and the page's events stop
  // holding on to the picture, so a card that is thrown away can go, GPU contexts and all. resume() carries on with
  // the same renderers.
  suspend() {
    if (this.suspended) return;
    this.suspended = true;
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
    removeEventListener(EFFECTS_KEY, this.onEffects);
    this.motion.removeEventListener?.("change", this.onMotion);
    this.watch.stop();
    this.paused = true;
    this.syncAnimations();
    this.shimmer?.sync();
    this.pulses?.sync();
  }

  resume() {
    if (!this.suspended) return;
    this.suspended = false;
    document.addEventListener("visibilitychange", this.onVisibility);
    this.observer?.observe(this.svg);
    addEventListener(EFFECTS_KEY, this.onEffects);
    this.motion.addEventListener?.("change", this.onMotion);
    this.applyEffects();
    this.restWhenUnseen();  // pauses again only if off screen or hidden
    this.motionHint();
  }

  destroy() {
    clearTimeout(this.garageMoving);
    clearTimeout(this.relabel);
    clearTimeout(this.settle);
    for (const timer of Object.values(this.goneTimers || {})) clearTimeout(timer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
    removeEventListener(EFFECTS_KEY, this.onEffects);
    this.motion.removeEventListener?.("change", this.onMotion);
    this.watch.stop();
    this.offer?.remove();
    this.hint?.remove();
    this.shimmer?.destroy();
    this.pulses?.destroy();
  }

  // Whether anything in the picture may move now.
  pulsesRun() {
    return !this.paused && !matchMedia(REDUCED_MOTION).matches;
  }

  // Pauses or resumes the picture's own CSS animations through the Web Animations API. A class on the svg with a
  // rule for every element did this before, and toggling it restyled the whole picture (30-60 ms on a fast PC, far
  // more on a tablet) each time the card scrolled in or out of view (issue #3). force: also animations started since.
  syncAnimations(force = false) {
    const run = this.pulsesRun();
    if (!force && run === this.animationsRun) return;
    this.animationsRun = run;
    // Without the API, the old rule on every element (slow to switch, but nothing keeps running off screen).
    if (!this.svg.getAnimations) { this.svg.classList.toggle("ef-paused", !run); return; }
    // Only the ones it paused are played again (play() would start a finished one over), and without a look at
    // playState: reading it settles the styles again for each animation in turn (30 ms).
    if (run) {
      // only those still there: CSS cancels one whose rule went while it rested (the stars when rain came)
      if (this.held) for (const a of this.svg.getAnimations({ subtree: true })) if (this.held.has(a)) a.play();
      this.held = null;
      return;
    }
    this.held ??= new Set();
    for (const a of this.svg.getAnimations({ subtree: true })) {
      if (!a.animationName || this.held.has(a)) continue;  // CSS animations only: transitions finish as they would
      a.pause();
      this.held.add(a);
    }
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
    svg.classList.toggle("ef-light", !!cfg.light);  // changes seldom: restyling the whole picture once is fine
    this.placeLabels(cfg.battery1.show && cfg.battery2.show);
    const name = (id, value) => this.text(id, String(value ?? "").toUpperCase(), null);
    name("ef-solar-name", cfg.solar.name);
    name("ef-home-name", cfg.home.name);
    name("ef-ev-name", cfg.ev.name);
    name("ef-grid-name", cfg.grid.name);
    name("ef-b1-name", cfg.battery1.name);
    name("ef-b2-name", cfg.battery2.name);
    const vars = colorVars(cfg);
    for (const key of this.colorKeys) if (!(key in vars)) svg.style.removeProperty(key);
    for (const [key, value] of Object.entries(vars)) svg.style.setProperty(key, value);
    this.colorKeys = Object.keys(vars);
    this.colors = {
      solar: cfg.solar.color, grid: themed(cfg, "grid", "color"), b1: cfg.battery1.color, b2: cfg.battery2.color, ev: cfg.ev.color,
    };
    this.alignLabels();  // names change the widths
    this.applyEffects();
    // The editor sends the config again on every keystroke, and each snapshot of the picture costs a small device
    // dearly: after the first config they are taken again only once the changes stop coming.
    clearTimeout(this.settle);
    if (this.configured) this.settle = setTimeout(() => this.resample(), CONFIG_SETTLE);
    else { this.configured = true; this.resample(); }
  }

  // The snapshots of the picture (label contrast, the shimmer's still parts) again, after new names or colours.
  resample() {
    this.contrastKey = null;
    this.scheduleLabelContrast();
    this.shimmer?.invalidate();
    if (this.svg.classList.contains("ef-hot")) this.shimmer?.refresh();
  }

  // Thrown away (off the page for good): the GPU contexts go now, not when the browser gets round to collecting
  // them. Should the picture come back after all, the renderers are made again with the next readings.
  release() {
    clearTimeout(this.settle);
    this.shimmer?.destroy();
    this.shimmer = null;
    this.pulses?.destroy();
    this.pulses = null;
  }

  // Two batteries share the bottom row: battery 1 right of its leader, battery 2 and the grid left of theirs.
  // With one battery or none there is room, so each label is centred on its leader, as solar and home are.
  // The texts stay where they are drawn and slide (a transform, so it can animate) to their centres; the slide
  // animates only when the layout changes, not when a reading changes a label's width.
  placeLabels(both) {
    this.labelPlaces ??= [...this.svg.querySelectorAll("#ef-b1-label text, #ef-b2-label text, #ef-grid-name, #ef-grid")]
      .map((el) => ({ el, x: Number(el.getAttribute("x")), anchor: el.getAttribute("text-anchor") || "start",
        centre: el.closest("#ef-b1-label") ? 388 : el.closest("#ef-b2-label") ? 495 : 895 }));
    if (this.bothBatteries !== undefined && this.bothBatteries !== both && !this.svg.classList.contains("ef-still")) {
      this.svg.classList.add("ef-relabel");
      clearTimeout(this.relabel);
      this.relabel = setTimeout(() => { this.svg.classList.remove("ef-relabel"); this.restAgain(); }, 700);
    }
    this.bothBatteries = both;
    this.alignLabels();
  }

  alignLabels() {
    for (const place of this.labelPlaces || []) {
      const { el, x, anchor, centre } = place;
      let shift = 0;
      if (!this.bothBatteries) {
        const w = el.getClientRects().length ? el.getBBox().width : 0;
        shift = anchor === "end" ? centre + w / 2 - x : anchor === "middle" ? centre - x : centre - w / 2 - x;
      }
      shift = Math.round(shift * 10) / 10;
      if (place.shift === shift) continue;
      place.shift = el.shift = shift;
      el.style.transform = shift ? `translateX(${shift}px)` : "";
    }
  }

  applyEffects() {
    const kept = remembered(), mode = effectsLevel(this.cfg.effects);
    this.chosen = mode !== "auto" ? mode : kept.level ?? OLD_EFFECTS[kept.choice] ?? null;
    if (this.chosen) this.closeOffer();
    const level = this.trial ?? this.chosen;
    this.setLevel(level ?? "high", level ? 0 : kept.density);
    this.watchFrames();
  }

  // density: the lower density "auto" settled on before asking, if any
  setLevel(level, density) {
    this.level = level;
    const cap = level === "high" && density ? density : LEVELS[level].cap;
    this.svg.classList.toggle("ef-lite", level !== "high");
    this.svg.classList.toggle("ef-low", level === "low");
    if (cap !== this.densityCap) {
      this.densityCap = cap;
      this.shimmer?.place();
      this.pulses?.place();
    }
    if ("celsius" in this) this.temperature(this.celsius);
  }

  // Watched only while there is something to judge and nothing chosen yet.
  watchFrames() {
    const on = !this.chosen && !this.offer && this.fine < 3 && this.pulsesRun();
    if (on) this.watch.start();
    else this.watch.stop();
  }

  frameVerdict(poor) {
    if (!poor) { this.fine++; this.watchFrames(); return; }
    this.fine = 0;
    if ((devicePixelRatio || 1) > LOW_DENSITY && !(this.densityCap <= LOW_DENSITY)) remember({ density: LOW_DENSITY });
    else this.offerLevels();
  }

  // The question: three levels of detail, each tried on the picture as it is picked, kept with OK.
  offerLevels() {
    if (this.offer || this.chosen) return;
    const el = (tag, css, text) => {
      const e = document.createElement(tag);
      if (css) e.style.cssText = css;
      if (text) e.textContent = text;
      return e;
    };
    const offer = this.offer = el("div", "position:absolute;left:50%;top:10px;transform:translateX(-50%);z-index:2;"
      + "width:max-content;max-width:calc(100% - 20px);box-sizing:border-box;padding:9px 10px 9px 14px;border-radius:14px;"
      + "background:rgba(18,19,21,.92);color:#f1f1f1;font:13px/1.3 system-ui,-apple-system,sans-serif;"
      + "text-align:left;box-shadow:0 3px 14px rgba(0,0,0,.45)");
    offer.setAttribute("role", "dialog");
    offer.setAttribute("aria-label", "Animation detail");
    offer.append(el("div", "margin:0 0 6px", "Animation looks choppy. Try less detail?"));
    const row = el("div", "display:flex;align-items:center;gap:12px;white-space:nowrap");
    const name = "ef-detail-" + Math.random().toString(36).slice(2);
    for (const level of ["high", "medium", "low"]) {
      const option = el("label", "display:flex;align-items:center;gap:5px;cursor:pointer");
      const radio = el("input", "margin:0;accent-color:#f1f1f1;width:15px;height:15px");
      Object.assign(radio, { type: "radio", name, value: level, checked: level === "medium" });
      option.append(radio, LEVELS[level].label);
      row.append(option);
    }
    const ok = el("button", "margin-left:4px;border:0;border-radius:12px;padding:5px 16px;"
      + "font:inherit;font-weight:600;cursor:pointer;background:#f1f1f1;color:#111", "OK");
    ok.type = "button";
    row.append(ok);
    offer.append(row);
    // its own taps: not a tap on the picture
    for (const type of ["click", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"]) {
      offer.addEventListener(type, (e) => e.stopPropagation());
    }
    offer.addEventListener("change", (e) => { this.trial = e.target.value; this.applyEffects(); });
    ok.addEventListener("click", () => {
      const level = this.trial;
      this.closeOffer();
      remember({ level });
    });
    const host = this.svg.parentNode;
    positioned(host);
    host.append(offer);
    this.trial = "medium";
    this.applyEffects();
  }

  closeOffer() {
    this.offer?.remove();
    this.offer = null;
    this.trial = null;
  }

  // While the system asks for reduced motion the pulses stand still, which looks broken unless it is said why.
  // Shown until it is dismissed on this device (every card on the page follows) or Reduce Motion is switched off.
  motionHint() {
    const wanted = this.motion?.matches && !remembered().motionHintSeen;
    if (!wanted) { this.hint?.remove(); this.hint = null; return; }
    if (this.hint) return;
    const hint = this.hint = document.createElement("div");
    hint.style.cssText = "position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:2;"
      + "width:max-content;max-width:calc(100% - 20px);box-sizing:border-box;padding:9px 10px 9px 14px;border-radius:14px;"
      + "background:rgba(18,19,21,.92);color:#f1f1f1;font:13px/1.35 system-ui,-apple-system,sans-serif;"
      + "text-align:left;box-shadow:0 3px 14px rgba(0,0,0,.45);display:flex;align-items:center;gap:12px";
    hint.setAttribute("role", "note");
    const text = document.createElement("div");
    const path = motionSettingsPath(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
    const where = document.createElement("b");
    where.textContent = path || "your device's accessibility settings";
    where.style.fontWeight = "600";
    text.append("Energy pulses are paused because Reduce Motion is on. To see them move, turn it off in ", where, ".");
    const ok = document.createElement("button");
    ok.type = "button";
    ok.textContent = "Got it";
    ok.style.cssText = "flex:none;border:0;border-radius:12px;padding:5px 14px;font:inherit;font-weight:600;"
      + "cursor:pointer;background:#f1f1f1;color:#111";
    hint.append(text, ok);
    // its own taps: not a tap on the picture
    for (const type of ["click", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"]) {
      hint.addEventListener(type, (e) => e.stopPropagation());
    }
    ok.addEventListener("click", () => remember({ motionHintSeen: true }));
    const host = this.svg.parentNode;
    positioned(host);
    host.append(hint);
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
  // stay: the lane is drawn when idle too (the batteries'), with no pulses on it. withPulse false: the caller sets
  // the lane's pulses itself (turnLanes).
  line(lane, way, place = 0, color, stay = false, withPulse = true) {
    const el = this.part(`ef-l-${lane}`), gone = !way && !stay;
    el.classList.toggle("ef-gone", gone);
    el.style.transform = `translateY(${(gone ? place - 0.5 : place) * LANE_GAP}px)`;
    if (!gone && withPulse) this.pulse(lane, way, color);
    // A lane on its way out keeps its pulses while it fades, then they stop: hidden, they would still be animated
    // (and drawn, at no opacity, on the pulse layer).
    // Armed once as the lane goes, so readings coming in while it fades do not keep putting it off.
    this.goneTimers ??= {};
    if (!gone) {
      clearTimeout(this.goneTimers[lane]);
      delete this.goneTimers[lane];
    } else if (!this.goneTimers[lane] && this.part(`ef-f-${lane}`).dataset.flow !== "off") {
      this.goneTimers[lane] = setTimeout(() => {
        delete this.goneTimers[lane];
        if (!el.classList.contains("ef-gone")) return;
        this.pulse(lane, false);
        this.pulses?.update();
        this.restAgain();
      }, LANE_FADE);
    }
  }

  // The grid pipe's sources, [way, colour] each. Up to four share the one lane by taking turns: each flow carries
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

  // A flow taking turns with others on one line: every `turns`-th pulse, shifted by `turn`.
  turnStyle(name, turns, turn) {
    const el = this.part(`ef-f-${name}`);
    if (turns > 1) { el.style.setProperty("--ef-turns", turns); el.style.setProperty("--ef-turn", turn); }
    else { el.style.removeProperty("--ef-turns"); el.style.removeProperty("--ef-turn"); }
  }

  // Something charged from several sources (the car, a battery): one flow per source (up to four), taking turns on
  // its line, in their colours.
  turnLanes(names, way, colors) {
    const flows = way ? colors.slice(0, names.length) : [];
    names.forEach((name, i) => {
      this.turnStyle(name, flows.length, i);
      this.pulse(name, i < Math.max(1, flows.length) && way, flows[i] || colors[0]);
    });
    this.turns ??= {};
    const turns = Math.max(1, flows.length);  // none or one: the same timing
    if (turns === this.turns[names[0]]) return;
    this.turns[names[0]] = turns;
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
    // Keep the pulses where they are: the beat is PULSE_SPEED units a second since beatStart. Where it is within the
    // cycle stays, and so does which cycle it is, counted up to 12 (every turn count, 2 to 4, divides it), so a pipe
    // whose sources take turns does not jump to its first colour.
    if (this.cycleDistance) {
      const beat = (now - this.beatStart) * PULSE_SPEED / 1000, cycles = Math.floor(beat / this.cycleDistance) % 12;
      const kept = cycles * distance + (beat % this.cycleDistance) % distance;
      this.beatStart = now - kept * 1000 / PULSE_SPEED;
    }
    this.svg.style.setProperty("--ef-cycle-distance", distance);
    this.svg.style.setProperty("--ef-cycle-period", `${distance / PULSE_SPEED}s`);
    // Restarted, not just retimed: iOS Safari keeps a running animation's old duration and end value when the
    // custom properties behind them change.
    this.cycleDistance = distance;
    this.restartBeats();
  }

  // The svg's own beat animations start again (see updatePulseCadence): once per update, however many asked, and
  // not at all while the pulse layer draws the pulses (each restart restyles the whole picture).
  restartBeats() { this.beatsDirty = true; }

  flushBeats() {
    if (!this.beatsDirty) return;
    this.beatsDirty = false;
    if (this.svg.classList.contains("ef-gl")) return;
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
      // a flow taking turns (the grid pipe, the car's cable, a battery's pipe, a shared house line) has its own count
      const turns = a.animationName === "ef-grid-beat" ? Number(a.effect?.target?.style.getPropertyValue("--ef-turns")) || 1 : 1;
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
    const moonlightKey = () => moon ? `${Math.round(skyX(moon.progress) / 4)},${Math.round(moon.altitude)}` : "";
    const moonlight = moon ? visibility * (1 - smoothstep(-6, HORIZON, altitude)) * smoothstep(HORIZON, 2, moon.altitude) : 0;
    const moonBrightness = moonlight * Math.min(1, fraction * 45);
    this.light("moon", moon, moonBrightness, moonlight * fraction ** 1.5 * .75);
    // Snapshots of the picture (heat shimmer, label contrast) are taken again once the sky looks different: the sun
    // or moon a few units on, or the light a step brighter or darker. Coarse enough that a live card, whose sky
    // creeps, re-takes them only every few minutes; a jump in time (the lab's slider) re-takes them at once.
    const step = (v) => Math.round(v * 40);
    this.skyKey = [step(1 - smoothstep(-13, 10, altitude)), step(twilight * visibility), step(sunlight),
      sun && sunlight ? `${Math.round(skyX(sun.progress) / 4)},${Math.round(altitude)}` : "",
      step(moonBrightness), moonBrightness ? moonlightKey() : ""].join(",");
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
  // shown, for the seasonal decorations; temperature (°C) brings heat shimmer or frost.
  update(state) {
    const cfg = this.cfg, color = this.colors;
    const b1 = cfg.battery1.show ? state.battery1 || {} : {}, b2 = cfg.battery2.show ? state.battery2 || {} : {};
    const solar = cfg.solar.show ? Math.max(0, flow(state.solar)) : 0;
    const b1w = flow(b1.power), b2w = flow(b2.power), grid = flow(state.grid);
    let home = state.home;
    // Home worked out from the others only when every part in the picture has a reading: with one sensor unavailable
    // the sum would be wrong, so home shows a dash too. The car is apart from home: what it takes (+) or gives (−)
    // is set aside first, when there is a reading for it.
    // A car with a sensor set up counts even when its reading is unavailable (then home is unknown too).
    const carIn = cfg.ev?.entity || !missing(state.ev) ? (missing(state.ev) ? null : -state.ev) : false;
    const inputs = [state.grid, cfg.solar.show && state.solar, cfg.battery1.show && b1.power, cfg.battery2.show && b2.power,
      carIn].filter((v) => v !== false);
    if (missing(home) && inputs.every((v) => !missing(v))) {
      home = Math.max(0, inputs.reduce((sum, v) => sum + v, 0));
    }
    this.text("ef-solar", kw(missing(state.solar) ? null : Math.max(0, state.solar)), !solar);
    this.text("ef-home", kw(home), !flow(home));
    this.text("ef-grid", kw(state.grid), !grid);
    // The garage is on or off in the config: on, its shutter is up and the car shows, charging or not. The EV label
    // shows whenever there is a power or charge reading for the car (0 kW still shows its charge), the garage shut
    // too: then it points at the door.
    const ev = missing(state.ev) ? 0 : flow(state.ev);
    const open = state.garage ?? cfg.garage === "open";
    this.svg.classList.toggle("ef-lights-off", state.lights === false);
    if (open !== this.svg.classList.contains("ef-garage-open") && !this.svg.classList.contains("ef-still")) {
      this.svg.classList.add("ef-garage-moving");  // drawn live while it moves (see .ef-baked)
      clearTimeout(this.garageMoving);
      this.garageMoving = setTimeout(() => {
        this.svg.classList.remove("ef-garage-moving");
        // the cable's pulses were held back while the shutter moved: the pulse layer looks again
        for (const piece of this.pulses?.pieces || []) piece.key = null;
        this.pulses?.update();
        this.alignBeats();  // the svg's own pulses, where they draw them, start in step
        this.restAgain();
      }, GARAGE_MOVES);
    }
    this.svg.classList.toggle("ef-garage-open", open);
    this.svg.classList.toggle("ef-ev-on", !(missing(state.ev) && missing(state.evSoc)));
    this.text("ef-ev", kw(state.ev), !ev);
    const evDir = this.part("ef-ev-dir"), evArrow = ev < 0 ? "▼" : "▲";  // as on the batteries: ▲ charges, ▼ gives out
    if (evDir.textContent !== evArrow) evDir.textContent = evArrow;
    this.attr(evDir, "fill-opacity", ev ? 1 : 0);  // kept in the line, so the charge doesn't jump sideways
    this.text("ef-ev-soc", missing(state.evSoc) ? "" : `${Math.round(state.evSoc)}%`, null);
    this.battery("b1", b1.power, b1.soc);
    this.battery("b2", b2.power, b2.soc);
    this.extras(state.extras || []);

    // Who feeds what: the street takes solar first, then the batteries; a charging battery takes solar first, then
    // the grid, then the other battery; the house gets what is left. A charging battery or the street takes the
    // colour of what feeds it most.
    // The car is a source too while it gives power out (vehicle-to-home or -grid).
    const evOn = !missing(state.ev) && ev !== 0;
    const left = { solar, b1: Math.max(0, b1w), b2: Math.max(0, b2w), grid: Math.max(0, grid), ev: evOn ? Math.max(0, -ev) : 0 };
    // Takes what `need` asks for from the sources in order: the colour of the one that gave most (`own`, the taker's
    // colour, when none could: readings that do not add up), and every source that gave at least FLOW_MIN, in order.
    const feed = (need, order, own) => {
      let most = null, best = 0;
      const from = [];
      for (const k of order) {
        const got = Math.min(need, left[k]);
        if (got <= 0) continue;
        left[k] -= got;
        need -= got;
        if (got > best) [most, best] = [k, got];
        if (got >= FLOW_MIN) from.push(k);
      }
      return { color: most ? color[most] : own, from };
    };
    // The house is supplied first, as a home's own loads are: solar, then the batteries, the car, the grid. Batteries
    // charging and the street then share what is left, so a picture whose readings do not quite add up still shows
    // what feeds the house. With no home reading the house gets whatever is left over at the end, as before.
    const house = { solar: 0, b1: 0, b2: 0, ev: 0, grid: 0 };
    if (!missing(home)) {
      let need = Math.max(0, home);
      for (const k of ["solar", "b1", "b2", "ev", "grid"]) {
        const got = Math.min(need, left[k]);
        left[k] -= got;
        need -= got;
        house[k] = got;
      }
    }
    const before = { ...left };
    const toGrid = feed(Math.max(0, -grid), ["solar", "b2", "b1", "ev"], color.grid).color;
    // Every source that sends at least FLOW_MIN out to the street gets its own grid lane (the biggest always does),
    // up to the four the grid pipe can carry.
    const exporters = grid < 0 ? ["solar", "b1", "b2", "ev"].filter((k) => before[k] - left[k] >= FLOW_MIN) : [];
    const toB1 = feed(Math.max(0, -b1w), ["solar", "ev", "grid", "b2"], color.b1);
    const toB2 = feed(Math.max(0, -b2w), ["solar", "ev", "grid", "b1"], color.b2);
    // The car, apart from the house: charging, it takes solar first, then the batteries, then the grid; giving power
    // out, its pulses are its own colour.
    const toEv = evOn && ev > 0 ? feed(ev, ["solar", "b1", "b2", "grid"], color.ev) : null;
    // Charging from several sources, their pulses take turns on the line, as on the grid pipe; giving power out, its
    // own colour.
    const mix = (fed) => (fed.from.length > 1 ? fed.from.map((k) => color[k]) : [fed.color]);
    // The car is like a battery: "in" charges it. Its cable shows only with the shutter up (hidden while it moves);
    // what it gives out still shows where it goes (the house, the street, a battery), the shutter down or not.
    this.turnLanes(EV_FLOWS, evOn && open && (ev > 0 ? "in" : "out"), toEv ? mix(toEv) : [false]);
    this.pulse("solar", solar && "out");
    const bWay = (w) => (w > 0 ? "out" : w < 0 && "in");
    this.line("b1", bWay(b1w), 0, null, true, false);
    this.line("b2", bWay(b2w), 0, null, true, false);
    this.turnLanes(B1_FLOWS, bWay(b1w), b1w < 0 ? mix(toB1) : [false]);
    this.turnLanes(B2_FLOWS, bWay(b2w), b2w < 0 ? mix(toB2) : [false]);
    if (grid < 0) this.gridLanes(exporters.length ? exporters.map((k) => ["out", color[k]]) : [["out", toGrid]]);
    else this.gridLanes([[grid > 0 && "in"]]);  // the grid's "in" is into the house
    // From the meter box on to the house, top to bottom: solar, battery 1, battery 2, grid, the car - one lane for
    // each that feeds it, in places -1 (above battery 1's pipe) to 2 (the lowest the box's face covers). The
    // batteries' lanes run straight through the box (battery 1 place 0, battery 2 place 1), the others stack on
    // them. With nothing feeding the house its line still shows: the grid's lane, idle.
    const used = missing(home) || home >= FLOW_MIN;
    const feeds = (k) => used && (missing(home) ? left[k] : house[k]) >= FLOW_MIN;
    const fed = Object.fromEntries(["solar", "b1", "b2", "grid", "ev"].map((k) => [k, feeds(k)]));
    const count = Object.values(fed).filter(Boolean).length;
    const { places, share } = housePlaces(fed, !b1w && !!b2w);
    // Idle and one source feeding the house swap with no fade or slide, either way.
    const swap = (this.houseCount === 0 && count === 1) || (this.houseCount === 1 && count === 0);
    this.svg.classList.toggle("ef-swap", swap && !this.svg.classList.contains("ef-still"));
    this.houseCount = count;
    // Sharing: the batteries take turns on battery 1's line, battery 2's own rail hidden. Battery 2's line keeps that
    // while it fades out, so its rail does not flash up over battery 1's.
    if (share !== this.sharedHouse) {
      this.sharedHouse = share;
      this.turnStyle("h1", share ? 2 : 1, 0);
      this.restartBeats();
    }
    if (fed.b2) {
      this.turnStyle("h3", share ? 2 : 1, 1);
      this.part("ef-l-h3").classList.toggle("ef-shared", share);
    }
    this.line("h1", fed.b1 && "out", places.b1, color.b1);
    this.line("h2", fed.solar && "out", places.solar, color.solar);
    this.line("h3", fed.b2 && "out", places.b2, color.b2);
    this.line("h4", fed.grid && "out", places.grid, color.grid, count === 0);
    this.line("h5", fed.ev && "out", places.ev, color.ev);
    this.updatePulseCadence();
    this.flushBeats();
    this.alignBeats();

    // Festive decorations from 6 December to 6 January, unless switched off in the config (festive) or by a tap.
    this.svg.classList.toggle("ef-christmas", cfg.festive !== false && christmasSeason(state.time));
    this.svg.classList.toggle("ef-xmas-off", state.decorations === false);  // fades away (see the svg)

    const weather = WEATHERS.includes(state.weather) ? state.weather : "cloudy";
    this.attr(this.svg, "data-weather", PICTURE_WEATHER[weather]);
    this.updateSky(state.sky, weather);
    this.temperature(state.temperature);
    // The pulses on the GPU where the browser can; otherwise the svg's own stay.
    // Made once the picture is on the page: Home Assistant sends the first readings before that, when the dashes have
    // no computed lengths, opacities or colours yet and the pulses would be measured as nothing (issue #1).
    if (this.svg.isConnected) this.pulses ??= typeof WebGLRenderingContext === "function" ? new PulseRenderer(this) : null;
    this.pulses?.update();
    // A new look (weather, heat) is judged afresh.
    const look = lookKey(this.svg);
    if (look !== this.watchedLook) { this.watchedLook = look; this.fine = 0; this.watchFrames(); }

    this.alignLabels();  // the readings changed the labels' widths
    if (this.svg.classList.contains("ef-swap")) {
      this.svg.getBoundingClientRect();  // the house lines swapped with transitions off
      this.svg.classList.remove("ef-swap");
    }
    if (this.svg.classList.contains("ef-still")) {
      this.svg.getBoundingClientRect();  // lays the lanes out where they are before transitions are switched on
      this.svg.classList.remove("ef-still");
    }
    this.scheduleLabelContrast();
    this.restAgain();
  }

  // Animations started while the picture rests (by readings, or by a timer below once a slide is over) pause too.
  restAgain() {
    if (!this.pulsesRun()) this.syncAnimations(true);
  }

  // Home's other loads (pool, A/C...), listed above its label: [{ name, power (W), entity }]. A load drawing less than
  // FLOW_MIN folds away and unfolds again when it starts (an unavailable one stays, with a dash). More than EXTRA_ROWS
  // scroll; scrolling past either end goes on to the page. The edge with more rows beyond it fades out.
  extras(list) {
    const box = this.part("ef-extras"), rows = box.firstElementChild;
    const key = JSON.stringify(list.map((e) => [e.name, e.entity || ""]));
    const fresh = key !== this.extrasKey;
    if (fresh) {
      this.extrasKey = key;
      rows.replaceChildren(...list.map((e) => {
        const row = document.createElement("div"), name = document.createElement("span"), value = document.createElement("span");
        row.className = "ef-extra";
        if (e.entity) row.dataset.entity = e.entity;
        name.className = "ef-extra-name";
        name.textContent = String(e.name ?? "").toUpperCase();
        name.title = String(e.name ?? "");
        value.className = "ef-extra-val";
        row.append(name, value);
        return row;
      }));
      const height = Math.min(list.length, EXTRA_ROWS) * EXTRA_ROW;
      this.attr(box, "y", EXTRA_BOTTOM - height);
      this.attr(box, "height", height);
      if (list.length) box.removeAttribute("display");
      else box.setAttribute("display", "none");
      if (!this.extrasScroll) {
        this.extrasScroll = () => this.fadeExtras();
        rows.addEventListener("scroll", this.extrasScroll, { passive: true });
        rows.addEventListener("transitionend", this.extrasScroll);
        this.scrollExtrasBy(rows);
      }
    }
    list.forEach((e, i) => {
      const value = rows.children[i].lastElementChild, text = kw(e.power);
      if (value.textContent !== text) value.textContent = text;
      rows.children[i].classList.toggle("ef-extra-off", !missing(e.power) && !flow(e.power));
    });
    // New rows start folded or not, with no animation: nothing above reads the layout before this.
    if (fresh) rows.scrollTop = 0;
    this.fadeExtras();
  }

  // The list is one label: judged against the background behind all its visible text (each row where it sits now,
  // weighted by its size), so every row gets the same ink, and a sun behind one row alone is not enough for a halo.
  inkExtras() {
    const backdrop = this.extrasBackdrop, rows = this.part("ef-extras").firstElementChild;
    const picture = this.svg.getBoundingClientRect();
    if (!backdrop || !picture.width) return;
    const units = this.svg.viewBox.baseVal.width / picture.width, list = rows.getBoundingClientRect();
    const range = document.createRange();
    let light = 0, area = 0;
    for (const row of rows.children) {
      range.selectNodeContents(row);
      const text = range.getBoundingClientRect();
      const top = Math.max(text.top, list.top), bottom = Math.min(text.bottom, list.bottom);
      if (bottom - top < 1 || !text.width) continue;
      const luminance = this.lightBehind(backdrop.context, backdrop.scale, { x: (text.left - picture.left) * units,
        y: (top - picture.top) * units, width: text.width * units, height: (bottom - top) * units });
      if (luminance === null) continue;
      light += luminance * text.width * (bottom - top);
      area += text.width * (bottom - top);
    }
    if (!area) return;
    // ink() keeps its hysteresis in the classes of the element it is given: one off the page for the list, copied to
    // every row (the list's own box would get the labels' drop shadow as well).
    const ink = this.extrasInk ??= document.createElement("span");
    this.ink(ink, light / area);
    for (const row of rows.children) {
      row.classList.toggle("ef-ink-lifted", ink.classList.contains("ef-ink-lifted"));
      row.classList.toggle("ef-ink-bright", ink.classList.contains("ef-ink-bright"));
    }
  }

  // The list is overflow:hidden (Safari draws nothing of a natively scrolling foreignObject), so wheel and touch move
  // it here. At an end the gesture goes on to the page; a touch settles on a whole row.
  scrollExtrasBy(rows) {
    const room = (dy) => dy < 0 ? rows.scrollTop > 0 : rows.scrollTop < rows.scrollHeight - rows.clientHeight - 1;
    const units = () => rows.clientHeight / (rows.getBoundingClientRect().height || rows.clientHeight || 1);
    rows.addEventListener("wheel", (e) => {
      const dy = e.deltaY * (e.deltaMode === 1 ? EXTRA_ROW : 1);
      if (!dy || !room(dy)) return;
      e.preventDefault();
      rows.scrollTop += dy * units();
    }, { passive: false });
    let lastY = null;
    rows.addEventListener("touchstart", (e) => { lastY = e.touches[0].clientY; }, { passive: true });
    rows.addEventListener("touchmove", (e) => {
      if (lastY === null) return;
      const y = e.touches[0].clientY, dy = lastY - y;
      if (!room(dy)) { lastY = null; return; }  // the rest of this touch scrolls the page
      e.preventDefault();
      lastY = y;
      rows.scrollTop += dy * units();
    }, { passive: false });
    rows.addEventListener("touchend", () => {
      lastY = null;
      rows.scrollTo?.({ top: Math.round(rows.scrollTop / EXTRA_ROW) * EXTRA_ROW, behavior: "smooth" });
    }, { passive: true });
  }

  fadeExtras() {
    this.inkExtras();
    const rows = this.part("ef-extras").firstElementChild;
    // The row cut by an edge with more beyond it fades (a mask did this, which Safari cannot draw in a foreignObject).
    // Measured on screen from the rows that are there: Safari loses a positioned list in a foreignObject (no offsetTop
    // to count from), and the folded rows' slide adds scroll room below that holds nothing.
    const box = rows.getBoundingClientRect();
    const shown = [...rows.children].map((row) => ({ row, r: row.getBoundingClientRect() })).filter((x) => x.r.height > 1);
    const above = shown.length > 0 && shown[0].r.top < box.top - 1;
    const below = shown.length > 0 && shown[shown.length - 1].r.bottom > box.bottom + 1;
    for (const row of rows.children) row.classList.remove("ef-extra-edge");
    for (const { row, r } of shown) {
      if ((above && r.top < box.top - 1) || (below && r.bottom > box.bottom + 1)) row.classList.add("ef-extra-edge");
    }
  }

  // Air temperature in °C, or nothing. The shimmer grows a little stronger with the heat.
  temperature(celsius) {
    this.celsius = celsius;
    const hot = !missing(celsius) && celsius > HOT;
    this.svg.classList.toggle("ef-hot", hot);
    const frost = missing(celsius) ? 0 : Math.max(0, Math.min(1, (FROST_START - celsius) / (FROST_START - FROST_FULL)));
    this.svg.classList.toggle("ef-frosty", frost > 0);
    this.svg.style.setProperty("--ef-frost", frost.toFixed(2));
    if (hot && LEVELS[this.level].shimmer && !matchMedia(REDUCED_MOTION).matches) {
      this.shimmer ??= new HeatShimmer(this.svg, this);
      this.shimmer.show(Math.min(8, 3 + (celsius - HOT) * .4));
    } else {
      this.shimmer?.hide();
    }
  }

  restWhenUnseen() {
    this.paused = !this.seen || document.hidden || !!this.suspended;
    this.syncAnimations();
    this.shimmer?.sync();
    this.pulses?.sync();
    this.watchFrames();
    this.alignBeats();
    this.scheduleLabelContrast();
  }

  canSampleContrast() {
    return this.svg.isConnected && this.seen && !document.hidden && !this.paused;
  }

  // Labels stay readable on any sky: each one's background is sampled, and over a bright patch it gets a dark halo.
  adaptLabel(label, context, scale) {
    // where the label ends up: solar's and the grid's slide left when there is room (see the svg)
    const box = label.getBBox(), has = (c) => this.svg.classList.contains(c);
    if (label.closest("#ef-solar-label") && !has("ef-ev-on")) box.x -= 99;
    if (label.closest("#ef-grid-label") && has("ef-no-b1")) box.x -= 135;
    box.x += label.shift || 0;  // centred on its leader (alignLabels)
    const luminance = this.lightBehind(context, scale, box);
    if (luminance === null) return;
    // In light mode a label gets its glow only where much of it sits over something very dark (the panels).
    if (this.svg.classList.contains("ef-light")) this.ink(label, luminance, this.darkShare(context, scale, box));
    else this.ink(label, luminance);
  }

  // The mean luminance of the sampled background under a box in the picture's units, or null outside it.
  lightBehind(context, scale, { x, y, width, height }) {
    const left = Math.max(0, Math.floor(x * scale)), top = Math.max(0, Math.floor(y * scale));
    const right = Math.min(context.canvas.width, Math.ceil((x + width) * scale));
    const bottom = Math.min(context.canvas.height, Math.ceil((y + height) * scale));
    if (right <= left || bottom <= top) return null;
    const pixels = context.getImageData(left, top, right - left, bottom - top).data;
    let light = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      light += .2126 * linearLight(pixels[i]) + .7152 * linearLight(pixels[i + 1]) + .0722 * linearLight(pixels[i + 2]);
    }
    return light * 4 / pixels.length;
  }

  // The share of the sampled background under a box that is very dark (the panels, a dark roof), or 0 outside it.
  darkShare(context, scale, { x, y, width, height }) {
    const left = Math.max(0, Math.floor(x * scale)), top = Math.max(0, Math.floor(y * scale));
    const right = Math.min(context.canvas.width, Math.ceil((x + width) * scale));
    const bottom = Math.min(context.canvas.height, Math.ceil((y + height) * scale));
    if (right <= left || bottom <= top) return 0;
    const pixels = context.getImageData(left, top, right - left, bottom - top).data;
    let dark = 0;
    for (let i = 0; i < pixels.length; i += 4) {
      const l = .2126 * linearLight(pixels[i]) + .7152 * linearLight(pixels[i + 1]) + .0722 * linearLight(pixels[i + 2]);
      if (l < .03) dark++;
    }
    return dark * 4 / pixels.length;
  }

  // White ink over a dark background, brighter over a lighter one, and a dark halo over a bright one. In light mode
  // the ink stays dark, day and night, with a white glow over a dark patch (ef-ink-bright).
  ink(label, luminance, share) {
    if (this.svg.classList.contains("ef-light")) {
      const on = label.classList.contains("ef-ink-bright");
      // labels: by how much of them is over something very dark; home's list (no share): by its mean light
      const dark = share === undefined ? luminance < (on ? .07 : .05) : share > (on ? .2 : .28);
      label.classList.remove("ef-ink-lifted");
      label.classList.toggle("ef-ink-bright", dark);
      return;
    }
    const threshold = label.classList.contains("ef-ink-lifted") ? .165 : .18;
    const lifted = luminance > threshold;
    label.classList.toggle("ef-ink-lifted", lifted);
    label.classList.toggle("ef-ink-bright", !lifted && luminance > .075);
  }

  async sampleLabelContrast() {
    // Rasterize the background locally at a small size, with the labels removed from the sample.
    const svg = this.svg, key = this.stillKey();
    const scene = svg.cloneNode(true);
    scene.querySelector("#ef-labels").remove();
    scene.classList.remove("ef-baked");  // the still parts the shimmer canvas draws are background too
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
      // Home's other loads move (they scroll and fold), so the background behind them is kept and each row is judged
      // where it is now.
      this.extrasBackdrop = this.part("ef-extras").getClientRects().length ? { context, scale } : null;
      this.inkExtras();
      this.contrastKey = key;
      this.contrastAt = performance.now();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  // What the still parts of the picture look like: the look (weather, night, decorations) and the sky.
  stillKey() { return `${lookKey(this.svg)}|${this.skyKey ?? ""}`; }

  scheduleLabelContrast() {
    if (!this.canSampleContrast()) return;
    if (this.contrastKey === this.stillKey() && performance.now() - this.contrastAt < RESAMPLE) return;
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
