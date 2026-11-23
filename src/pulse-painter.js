export const PULSE_SPEED = 125;  // SVG units per second on every wire
export function compileProgram(gl, vertex, fragment) {
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
// The stacked dashes repeat along the route, so their coverage over one period is worked out once per piece (after a
// reading, or when the canvas changes size) into a 1-pixel-high texture: each pixel then reads one value instead of
// adding up every dash. The strip's long edges are smoothed here too (a_out: -1 left edge, 1 right edge, pushed out by
// a pixel), so the canvas needs no multisampling.
const PULSE_VERTEX = `attribute vec2 a_pos,a_n,a_e;attribute float a_s,a_out;
uniform mat3 u_m;uniform float u_aa;varying float v_s;varying vec2 v_svg,v_e;
void main(){float o=u_aa;vec3 p=u_m*vec3(a_pos+a_n*a_out*o,1.);v_svg=p.xy;v_s=a_s;v_e=a_e+vec2(a_out,-a_out)*o;
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
export const PULSE_BOX = [0, 640, 1000, 520];  // x, y, width, height: where pulses can be, in the picture's units
// The GPU receives the same route geometry, masks and scene on either thread.
export class PulsePainter {
  constructor(canvas, profile) {
    this.canvas = canvas;
    this.profile = profile;
    this.routes = [];
    this.masks = [];
    const gl = this.gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl || gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < 16 || !this.build()) throw new Error("Pulse WebGL unavailable");
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

  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }

  geometry(id, data) {
    const gl = this.gl, buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    this.routes[id] = { buffer, count: data.length / 8 };
  }

  mask(id, image) {
    const gl = this.gl;
    if (!image) {
      if (this.masks[id]) gl.deleteTexture(this.masks[id]);
      this.masks[id] = null;
      return;
    }
    this.masks[id] ??= this.texture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.masks[id]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  // Binds the piece's dash pattern, worked out again when its dashes, beat or the pixel size changed.
  pattern(piece, resource, aa) {
    const gl = this.gl, key = `${piece.lead}|${piece.period}|${aa}`;
    resource.patternTexture ??= this.texture();
    gl.bindTexture(gl.TEXTURE_2D, resource.patternTexture);
    if (resource.patternKey === key) return;
    resource.patternKey = key;
    // two texels to a pixel at least; a power of two, so the texture can repeat
    let size = 64;
    while (size < piece.period / aa * 2 && size < this.maxPattern) size *= 2;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, size, 1, 0, gl.ALPHA, gl.UNSIGNED_BYTE,
      dashPattern(this.profile.lengths, this.profile.opacities, piece.lead, piece.period, aa, size));
  }

  paint(pieces, beat) {
    const gl = this.gl, u = this.u, aa = 1170 / this.canvas.width;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.u_aa, aa);
    gl.uniform4f(u.u_box, ...PULSE_BOX);
    for (const piece of pieces) {
      const resource = this.routes[piece.id];
      gl.uniformMatrix3fv(u.u_m, false, piece.matrix);
      gl.uniform1f(u.u_shift, piece.direction * (beat % piece.period) + piece.fixed);
      gl.uniform1f(u.u_period, piece.period);
      gl.uniform1f(u.u_alpha, piece.alpha);
      gl.uniform3fv(u.u_color, piece.color);
      gl.uniform1f(u.u_clipOn, piece.clip ? 1 : 0);
      if (piece.clip) gl.uniform2fv(u.u_clip, piece.clip);
      gl.activeTexture(gl.TEXTURE1);
      this.pattern(piece, resource, aa);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.masks[piece.level] || this.blank);
      gl.bindBuffer(gl.ARRAY_BUFFER, resource.buffer);
      const at = this.a;
      gl.vertexAttribPointer(at.pos, 2, gl.FLOAT, false, 32, 0);
      gl.vertexAttribPointer(at.n, 2, gl.FLOAT, false, 32, 8);
      gl.vertexAttribPointer(at.e, 2, gl.FLOAT, false, 32, 16);
      gl.vertexAttribPointer(at.s, 1, gl.FLOAT, false, 32, 24);
      gl.vertexAttribPointer(at.out, 1, gl.FLOAT, false, 32, 28);
      gl.drawArrays(gl.TRIANGLES, 0, resource.count);
    }
  }
}
