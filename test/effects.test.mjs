import test from "node:test";
import assert from "node:assert/strict";
import { choppy, effectsLevel, motionSettingsPath } from "../src/view.js";

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

test("detail levels, with the names 0.4.0 used", () => {
  assert.equal(effectsLevel(undefined), "auto");
  assert.equal(effectsLevel("medium"), "medium");
  assert.equal(effectsLevel("full"), "high");
  assert.equal(effectsLevel("reduced"), "low");
  assert.equal(effectsLevel("nonsense"), "auto");
});

test("the Reduce Motion switch is named for each system", () => {
  const ios = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15";
  assert.equal(motionSettingsPath(ios, "iPhone", 5), "Settings → Accessibility → Motion → Reduce Motion");
  assert.equal(motionSettingsPath("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel", 5),
    "Settings → Accessibility → Motion → Reduce Motion");  // an iPad
  assert.equal(motionSettingsPath("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "MacIntel", 0),
    "System Settings → Accessibility → Display → Reduce motion");
  assert.equal(motionSettingsPath("Mozilla/5.0 (Linux; Android 14)", "Linux armv8l", 5),
    "Settings → Accessibility → Remove animations");
  assert.equal(motionSettingsPath("Mozilla/5.0 (Windows NT 10.0; Win64; x64)", "Win32", 0),
    "Settings → Accessibility → Visual effects → Animation effects");
  assert.equal(motionSettingsPath("Mozilla/5.0 (X11; Linux x86_64)", "Linux x86_64", 0), "");
});
