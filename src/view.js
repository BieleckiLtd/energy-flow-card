// The picture of the house and what it does: readings in, moving pulses, labels, sky and weather out.
// One view per card. It owns the inlined SVG and updates it in place, so its animations run on between updates.

const FLOW_MIN = 50;  // watts: less than this reads as "0 kW" and draws no flow
const PULSE_SPEED = 125;  // SVG units per second on every wire
const SHORTEST_CYCLE = 275;  // very short routes should not flash rapidly
const LANE_GAP = 19;  // between neighbouring lanes on the wall, in the picture's own units
const MOON_RADIUS = 22;
const HORIZON = -.27;  // the apparent centre is just below the horizon when the upper edge rises
const GRID_FLOWS = ["grid", "grid2", "grid3"];
const HOT = 30;  // °C: above this the air shimmers
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
const TRANSIENT = new Set(["ef-paused", "ef-baked", "ef-still", "ef-restart"]);
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
      if (getComputedStyle(host).position === "static") host.style.position = "relative";
      if (getComputedStyle(this.svg).position === "static") this.svg.style.position = "relative";  // stays above the canvas
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
    this.hide();
    this.failed = true;
    this.resizer?.disconnect();
    this.canvas.remove();
  }

  running() {
    return this.shown && !this.svg.classList.contains("ef-paused") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    if (this.markup && this.key === lookKey(this.svg) && performance.now() - this.snapAt < RESAMPLE) return;
    this.dirty = true;
    if (this.busy || (this.shown && !this.running())) return;
    this.busy = true;
    setTimeout(async () => {
      try {
        while (this.dirty && !this.failed && this.svg.classList.contains("ef-hot")) {
          this.dirty = false;
          const key = lookKey(this.svg);
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
  invalidate() { this.markup = null; }

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
function fitCanvas(canvas, svg, cap = Infinity) {
  const parent = canvas.offsetParent;
  if (!parent) return null;
  const box = svg.getBoundingClientRect(), host = parent.getBoundingClientRect();
  if (!box.width || !box.height) return null;
  let width = box.width, height = box.height;
  let left = box.left - host.left - parent.clientLeft, top = box.top - host.top - parent.clientTop;
  if (width / height > 1170 / 1408) { left += (width - height * 1170 / 1408) / 2; width = height * 1170 / 1408; }
  else { top += (height - width * 1408 / 1170) / 2; height = width * 1408 / 1170; }
  Object.assign(canvas.style, { left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` });
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
const DASHES = 52;  // dash slots in the shader, a multiple of 4 (the svg has 51)
const PULSE_VERTEX = `attribute vec2 a_pos;attribute float a_s;
uniform mat3 u_m;varying float v_s;varying vec2 v_svg;
void main(){vec3 p=u_m*vec3(a_pos,1.);v_svg=p.xy;v_s=a_s;gl_Position=vec4(p.x/585.-1.,1.-p.y/704.,0.,1.);}`;
const PULSE_FRAGMENT = `precision highp float;
uniform vec4 u_len[${DASHES / 4}],u_op[${DASHES / 4}];
uniform float u_lead,u_shift,u_period,u_aa,u_alpha,u_clipOn;
uniform vec3 u_color;
uniform vec2 u_clip[4];
uniform vec4 u_box;
uniform sampler2D u_mask;
varying float v_s;varying vec2 v_svg;
float cover(float L,float o){
  if(o<=0.)return 1.;
  float u=mod(v_s+u_lead*L+u_shift,u_period);
  float c=max(clamp(min(u,L-u)/u_aa+.5,0.,1.),clamp((u-u_period)/u_aa+.5,0.,1.));
  return 1.-o*c;
}
float edge(vec2 a,vec2 b){vec2 d=normalize(b-a);return (v_svg-a).y*d.x-(v_svg-a).x*d.y;}
void main(){
  float keep=1.;
  for(int i=0;i<${DASHES / 4};i++){
    keep*=cover(u_len[i].x,u_op[i].x)*cover(u_len[i].y,u_op[i].y)*cover(u_len[i].z,u_op[i].z)*cover(u_len[i].w,u_op[i].w);
  }
  float a=(1.-keep)*u_alpha;
  if(u_clipOn>0.){
    float d=min(min(edge(u_clip[0],u_clip[1]),edge(u_clip[1],u_clip[2])),min(edge(u_clip[2],u_clip[3]),edge(u_clip[3],u_clip[0])));
    a*=clamp(d/u_aa+.5,0.,1.);
  }
  a*=1.-texture2D(u_mask,(v_svg-u_box.xy)/u_box.zw).a;
  gl_FragColor=vec4(u_color*a,a);
}`;
const PULSE_BOX = [300, 640, 700, 520];  // x, y, width, height: where pulses can be, in the picture's units
const MASK_WAIT = 700;  // ms after a change before the masks are drawn again (lanes slide for .55 s)

class PulseRenderer {
  constructor(view) {
    this.view = view;
    this.svg = view.svg;
    this.ready = false;
    this.raf = 0;
    const canvas = this.canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;pointer-events:none;visibility:hidden";
    const gl = this.gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: true, depth: false, stencil: false });
    if (!gl || gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < DASHES / 2 + 12 || !this.build()) { this.failed = true; return; }
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); this.destroy(); });
    this.frame = (now) => {
      this.raf = 0;
      this.draw(now);
      if (this.view.pulsesRun()) this.raf = requestAnimationFrame(this.frame);
    };
    this.pieces = this.findPieces();
    this.resizer = typeof ResizeObserver === "function" ? new ResizeObserver(() => this.place()) : null;
  }

  build() {
    const gl = this.gl, program = compileProgram(gl, PULSE_VERTEX, PULSE_FRAGMENT);
    if (!program) return false;
    gl.useProgram(program);
    this.a = { pos: gl.getAttribLocation(program, "a_pos"), s: gl.getAttribLocation(program, "a_s") };
    this.u = {};
    for (const n of ["u_m", "u_len", "u_op", "u_lead", "u_shift", "u_period", "u_aa", "u_alpha", "u_clipOn", "u_color", "u_clip", "u_box", "u_mask"]) {
      this.u[n] = gl.getUniformLocation(program, n);
    }
    gl.uniform1i(this.u.u_mask, 0);
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
      const level = flow.closest("#ef-lines, .ef-grid-pipe, #ef-solar-drop") || flow;
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
    const half = piece.width / 2, data = [];
    points.forEach((p, i) => {
      const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
      const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1;
      const nx = -dy / n * half, ny = dx / n * half;
      data.push(p.x + nx, p.y + ny, p.s, p.x - nx, p.y - ny, p.s);
    });
    piece.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, piece.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    piece.count = points.length * 2;
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
    if (this.failed) return;
    const view = this.view, cd = view.cycleDistance;
    for (const piece of this.pieces) {
      const flow = piece.flow, way = flow.dataset.flow;
      let shown = way !== "off" && !!cd;
      for (let el = piece.group; shown && el && el !== this.svg; el = el.parentNode) if (getComputedStyle(el).display === "none") shown = false;
      piece.shown = shown;
      if (!shown) continue;
      const turns = Number(flow.style.getPropertyValue("--ef-turns")) || 1;
      piece.lead = way === "in" ? 0 : 1;
      piece.direction = way === "in" ? 1 : -1;
      piece.period = cd * turns;
      piece.fixed = -(parseFloat(getComputedStyle(piece.dashes[0]).getPropertyValue("--ef-junction")) || 0)
        + (Number(flow.style.getPropertyValue("--ef-turn")) || 0) * cd;
      piece.color = this.rgb(getComputedStyle(piece.dashes[0]).stroke);
      piece.matrix = this.toPicture(piece.group);
      if (!piece.matrix) piece.shown = false;
    }
    if (!this.canvas.isConnected) {
      const host = this.svg.parentNode;
      if (getComputedStyle(host).position === "static") host.style.position = "relative";
      if (getComputedStyle(this.svg).position === "static") this.svg.style.position = "relative";
      this.svg.after(this.canvas);  // over the picture
      this.resizer?.observe(this.svg);
    }
    this.place();
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
    clearTimeout(this.maskTimer);
    this.maskTimer = setTimeout(() => this.drawMasks().catch(() => this.destroy()), this.ready ? MASK_WAIT : 0);
  }

  async drawMasks() {
    if (this.failed || !this.canvas.width) return;
    const box = this.box = PULSE_BOX, scale = this.canvas.width / 1170;
    const width = Math.max(1, Math.round(box[2] * scale)), height = Math.max(1, Math.round(box[3] * scale));
    const ids = (el) => { const all = [...this.svg.querySelectorAll("*")]; return all.indexOf(el); };
    for (const level of this.levels) {
      const clone = this.svg.cloneNode(true);
      clone.classList.remove("ef-baked", "ef-gl", "ef-paused", "ef-still");
      clone.style.removeProperty("position");
      const all = [...clone.querySelectorAll("*")], first = all[ids(level.first)];
      const drop = [], defs = clone.querySelector("defs");
      const used = new Set([...clone.querySelectorAll("use")].map((u) => u.getAttribute("href")?.slice(1)));
      for (const el of all) {
        if (el.closest("defs, clipPath, mask, linearGradient, radialGradient, filter, pattern, style")) continue;
        const position = el.compareDocumentPosition(first);
        // before the pulses (and not holding any of them), or pulses themselves, or what never covers a pipe
        if ((position & Node.DOCUMENT_POSITION_FOLLOWING && !(position & Node.DOCUMENT_POSITION_CONTAINED_BY)) || el === first
          // (a pipe's body lies under its own pulses and never over another's)
          || el.matches(".ef-flow, .ef-pulse, .ef-lane, #ef-rain, #ef-snow, #ef-labels, .ef-lead, #ef-flash")) drop.push(el);
      }
      // something a later <use> draws stays, out of sight in <defs>
      for (const el of drop) { if (el.id && used.has(el.id) && !el.matches(".ef-flow, .ef-pulse")) defs.append(el); else el.remove(); }
      clone.setAttribute("viewBox", box.join(" "));
      clone.setAttribute("width", width);
      clone.setAttribute("height", height);
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
      try {
        const image = new Image();
        image.src = url;
        await image.decode();
        let source = image;
        if (typeof createImageBitmap === "function") source = await createImageBitmap(image).catch(() => image);
        if (this.failed) return;
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

  sync() {
    if (!this.ready) return;
    if (this.view.pulsesRun()) { if (!this.raf) this.raf = requestAnimationFrame(this.frame); }
    else { cancelAnimationFrame(this.raf); this.raf = 0; this.draw(performance.now()); }
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.maskTimer);
    this.failed = true;
    this.svg.classList.remove("ef-gl");  // the svg's own pulses again
    this.resizer?.disconnect();
    this.canvas.remove();
  }

  draw(now) {
    if (!this.ready) return;
    const gl = this.gl, u = this.u, view = this.view;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    const beat = (now - view.beatStart) * PULSE_SPEED / 1000;
    gl.uniform1f(u.u_aa, 1170 / this.canvas.width);
    gl.uniform4f(u.u_box, ...this.box);
    gl.activeTexture(gl.TEXTURE0);
    for (const piece of this.pieces) {
      if (!piece.shown) continue;
      let alpha = 1;
      if (piece.line) {
        // a lane that comes or goes fades and slides (CSS transitions): follow it while it moves
        const moving = piece.line.getAnimations?.().length > 0;
        if (moving || piece.moving) piece.matrix = this.toPicture(piece.group) || piece.matrix;
        piece.moving = moving;
        const ls = getComputedStyle(piece.line);
        alpha = ls.visibility === "hidden" ? 0 : parseFloat(ls.opacity);
        if (!alpha) continue;
      }
      const m = piece.matrix;
      gl.uniformMatrix3fv(u.u_m, false, [m.a, m.b, 0, m.c, m.d, 0, m.e, m.f, 1]);
      gl.uniform4fv(u.u_len, piece.lengths);
      gl.uniform4fv(u.u_op, piece.opacities);
      gl.uniform1f(u.u_lead, piece.lead);
      gl.uniform1f(u.u_shift, piece.direction * (beat % piece.period) + piece.fixed);
      gl.uniform1f(u.u_period, piece.period);
      gl.uniform1f(u.u_alpha, alpha);
      gl.uniform3fv(u.u_color, piece.color);
      gl.uniform1f(u.u_clipOn, piece.clip ? 1 : 0);
      if (piece.clip) gl.uniform2fv(u.u_clip, piece.clip);
      gl.bindTexture(gl.TEXTURE_2D, piece.level.texture || this.blank);
      gl.bindBuffer(gl.ARRAY_BUFFER, piece.buffer);
      gl.enableVertexAttribArray(this.a.pos);
      gl.vertexAttribPointer(this.a.pos, 2, gl.FLOAT, false, 12, 0);
      gl.enableVertexAttribArray(this.a.s);
      gl.vertexAttribPointer(this.a.s, 1, gl.FLOAT, false, 12, 8);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, piece.count);
    }
  }
}

// Detail. With "auto" the view watches how evenly the picture moves while it is on screen. Where frames keep
// dropping, the GPU canvases first draw at a lower density (hard to see on a sharp screen); if that is not enough,
// the card asks which level of detail to use, trying each one out as it is picked. The lower density and the
// answer are remembered on the device. "high", "medium" and "low" fix the level for every device.
export const EFFECTS = ["auto", "high", "medium", "low"];
const LEVELS = {
  high: { cap: Infinity, shimmer: true, label: "High" },
  medium: { cap: 1.5, shimmer: false, label: "Medium" },
  low: { cap: 1, shimmer: false, label: "Low" },
};
const OLD_EFFECTS = { full: "high", reduced: "low" };  // the names in 0.4.0
export const effectsLevel = (value) => OLD_EFFECTS[value] ?? (EFFECTS.includes(value) ? value : "auto");
const EFFECTS_KEY = "energy-flow-card.effects";
const WATCH_TIME = 60000;  // ms of moving picture per verdict
const LOW_DENSITY = 1.5;
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
    this.onEffects = () => this.applyEffects();
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
  }

  destroy() {
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
    removeEventListener(EFFECTS_KEY, this.onEffects);
    this.watch.stop();
    this.offer?.remove();
    this.shimmer?.destroy();
    this.pulses?.destroy();
  }

  // Whether anything in the picture may move now.
  pulsesRun() {
    return !this.svg.classList.contains("ef-paused") && !matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    this.contrastKey = null;
    this.applyEffects();
    this.shimmer?.invalidate();
    this.scheduleLabelContrast();
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
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    host.append(offer);
    this.trial = "medium";
    this.applyEffects();
  }

  closeOffer() {
    this.offer?.remove();
    this.offer = null;
    this.trial = null;
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
  // shown, for the seasonal decorations; temperature (°C) brings heat shimmer or frost.
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
    // The pulses on the GPU where the browser can; otherwise the svg's own stay.
    this.pulses ??= typeof WebGLRenderingContext === "function" ? new PulseRenderer(this) : null;
    this.pulses?.update();
    // A new look (weather, heat) is judged afresh.
    const look = lookKey(this.svg);
    if (look !== this.watchedLook) { this.watchedLook = look; this.fine = 0; this.watchFrames(); }

    if (this.svg.classList.contains("ef-still")) {
      this.svg.getBoundingClientRect();  // lays the lanes out where they are before transitions are switched on
      this.svg.classList.remove("ef-still");
    }
    this.scheduleLabelContrast();
  }

  // Air temperature in °C, or nothing. The shimmer grows a little stronger with the heat.
  temperature(celsius) {
    this.celsius = celsius;
    const hot = !missing(celsius) && celsius > HOT;
    this.svg.classList.toggle("ef-hot", hot);
    const frost = missing(celsius) ? 0 : Math.max(0, Math.min(1, (FROST_START - celsius) / (FROST_START - FROST_FULL)));
    this.svg.classList.toggle("ef-frosty", frost > 0);
    this.svg.style.setProperty("--ef-frost", frost.toFixed(2));
    if (hot && LEVELS[this.level].shimmer && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.shimmer ??= new HeatShimmer(this.svg, this);
      this.shimmer.show(Math.min(8, 3 + (celsius - HOT) * .4));
    } else {
      this.shimmer?.hide();
    }
  }

  restWhenUnseen() {
    this.svg.classList.toggle("ef-paused", !this.seen || document.hidden);
    this.shimmer?.sync();
    this.pulses?.sync();
    this.watchFrames();
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
    const svg = this.svg, key = lookKey(svg);
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
      this.contrastKey = key;
      this.contrastAt = performance.now();
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  scheduleLabelContrast() {
    if (!this.canSampleContrast()) return;
    if (this.contrastKey === lookKey(this.svg) && performance.now() - this.contrastAt < RESAMPLE) return;
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
