import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const svg = readFileSync(new URL("../src/energy-flow.svg", import.meta.url), "utf8");
const ridge = -.215;
const rake = 1.33;

function points(path) {
  return Array.from(path.matchAll(/(-?[\d.]+)\s+(-?[\d.]+)/g), ([, x, y]) => [Number(x), Number(y)]);
}

function parallel([x, y], [xx, yy], slope) {
  assert.notEqual(x, xx);
  assert.ok(Math.abs(yy - y - slope * (xx - x)) < 1e-6,
    `Edge from (${x}, ${y}) to (${xx}, ${yy}) must have slope ${slope}`);
}

test("both roofs and both module grids follow the same dimetric axes", () => {
  for (const fill of ["ef-roof", "ef-roof-back"]) {
    const path = svg.match(new RegExp(`<path d="([^"]+)" fill="url\\(#${fill}\\)"`))[1];
    const [a, b, c, d] = points(path);
    parallel(a, b, ridge);
    parallel(b, c, rake);
    parallel(c, d, ridge);
    if (fill === "ef-roof") parallel(a, d, rake);
  }
  const field = svg.match(/<use href="#ef-pv-field" transform="matrix\(([^)]+)\) scale\(([^)]+)\)"/);
  const [xx, xy, yx, yy] = field[1].split(" ").map(Number);
  const [width, height] = field[2].split(" ").map(Number);
  parallel([0, 0], [xx * width, xy * width], ridge);
  parallel([0, 0], [yx * height, yy * height], rake);
});

test("window rails in both themes and wall pipes follow the ridge", () => {
  const paneGroups = [...svg.matchAll(/<g fill="url\(#ef-pane\)">([\s\S]*?)<\/g>/g)];
  assert.equal(paneGroups.length, 2);
  for (const [, group] of paneGroups) {
    const panes = [...group.matchAll(/<path d="([^"]+)"/g)];
    assert.equal(panes.length, 4);
    for (const [, path] of panes) {
      const [a, b, c, d] = points(path);
      parallel(a, b, ridge);
      parallel(c, d, ridge);
    }
  }
  for (const id of ["ef-rail-b1", "ef-rail-b2", "ef-rail-house", "ef-tap-window"]) {
    const path = svg.match(new RegExp(`<path id="${id}"[^>]*? d="([^"]+)"`))[1];
    const [a, b] = points(path);
    parallel(a, b, ridge);
  }
});

test("the rear array repeats the entire front assembly at the same ridge offset", () => {
  const front = points(svg.match(/<path d="([^"]+)" fill="url\(#ef-roof\)"/)[1]);
  const back = points(svg.match(/<path d="([^"]+)" fill="url\(#ef-roof-back\)"/)[1]);
  const instances = [...svg.matchAll(/<use id="ef-(front|back)-pv" href="#ef-pv-array"\/>/g)];
  assert.deepEqual(instances.map(m => m[1]), ["back", "front"]);
  const position = svg.match(/<g transform="translate\(([^)]+)\)">\s*<use href="#ef-pv-cast-shadow"\/>\s*<use id="ef-back-pv"/);
  const [dx, dy] = position[1].split(" ").map(Number);
  assert.ok(Math.abs(back[1][0] - front[1][0] - dx) < 1e-6);
  assert.ok(Math.abs(back[1][1] - front[1][1] - dy) < 1e-6);
  const face = points(svg.match(/<path d="([^"]+)" fill="url\(#ef-frost-sheet\)"/)[1]);
  const depthBelowRidge = ([x, y]) => y + dy - (front[0][1] + (x + dx - front[0][0]) * ridge);
  // At the rear array's right side, the ridge cuts through the last row.
  assert.ok(depthBelowRidge(face[1]) < 0 && depthBelowRidge(face[2]) > 0);
  assert.ok(instances[0].index < svg.indexOf('fill="url(#ef-roof)"', instances[0].index));
});

test("the live solar cable clips at the underside of the front frame", () => {
  const rim = points(svg.match(/<g id="ef-pv-array">\s*<path d="([^"]+)"/)[1]);
  const exit = points(svg.match(/<clipPath id="ef-solar-exit"><path d="([^"]+)"/)[1]);
  assert.deepEqual(exit.slice(0, 2), [rim[4], rim[3]]);
  assert.match(svg, /<g id="ef-solar-drop" clip-path="url\(#ef-solar-exit\)">/);
});
