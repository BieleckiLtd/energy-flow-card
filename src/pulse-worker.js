// The page supplies route changes. This clock keeps the last scene moving while Lovelace handles other work.
import { PulsePainter, PULSE_SPEED } from "./pulse-painter.js";

let painter, scene, raf = 0, nextFrame = 0;
function paint(now) {
  const beat = (performance.timeOrigin + now - scene.origin) * PULSE_SPEED / 1000;
  painter.paint(scene.pieces, beat);
}
function frame(now) {
  raf = 0;
  if (!scene?.fps) return;
  if (now >= nextFrame - 1) {
    paint(now);
    const interval = 1000 / scene.fps;
    if (now - nextFrame >= interval) nextFrame = now;
    nextFrame += interval;
  }
  raf = requestAnimationFrame(frame);
}
self.onmessage = ({ data }) => {
  switch (data.type) {
    case "init":
      if (typeof requestAnimationFrame !== "function") throw new Error("Worker animation frames unavailable");
      painter = new PulsePainter(data.surface, data.profile);
      data.surface.addEventListener("webglcontextlost", () => postMessage("lost"));
      break;
    case "resize": painter.resize(data.w, data.h); break;
    case "geometry": painter.geometry(data.id, data.vertices); break;
    case "mask":
      painter.mask(data.id, data.image);
      data.image?.close();
      break;
    case "scene":
      scene = data;
      if (scene.fps) {
        if (!raf) { nextFrame = 0; raf = requestAnimationFrame(frame); }
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        paint(performance.now());
      }
      break;
  }
};
