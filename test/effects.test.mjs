import test from "node:test";
import assert from "node:assert/strict";
import { choppy } from "../src/view.js";

const frames = (pattern, n = 600) => Array.from({ length: n }, (_, i) => pattern(i));

test("even frames are smooth, at any rate the browser allows", () => {
  assert.equal(choppy(frames(() => 16.7)), false);
  assert.equal(choppy(frames(() => 8.3)), false);
  assert.equal(choppy(frames(() => 33.3)), false);  // capped at 30 fps
  assert.equal(choppy(frames((i) => (i % 40 ? 16.7 : 33.4))), false);  // the odd dropped frame
});

test("frequently dropped or very slow frames are choppy", () => {
  assert.equal(choppy(frames((i) => (i % 3 ? 16.7 : 50))), true);
  assert.equal(choppy(frames((i) => (i % 2 ? 16.7 : 33.4))), true);
  assert.equal(choppy(frames(() => 60)), true);
});
