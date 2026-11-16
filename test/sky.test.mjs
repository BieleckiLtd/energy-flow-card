// Checks the card's own Sun/Moon maths against reference values from Astronomy Engine (test/sky-reference.json).
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { energySky } from "../src/sky.js";

const cases = JSON.parse(readFileSync(new URL("./sky-reference.json", import.meta.url)));
const angle = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

test("sun and moon follow Astronomy Engine closely", () => {
  const worst = { sunAlt: 0, sunProg: 0, moonAlt: 0, moonProg: 0, lit: 0, tilt: 0 };
  for (const c of cases) {
    const got = energySky(c.lat, c.lon, c.ts * 1000), want = c.sky;
    worst.sunAlt = Math.max(worst.sunAlt, Math.abs(got.sun.altitude - want.sun.altitude));
    worst.sunProg = Math.max(worst.sunProg, Math.abs(got.sun.progress - want.sun.progress));
    worst.moonAlt = Math.max(worst.moonAlt, Math.abs(got.moon.altitude - want.moon.altitude));
    worst.moonProg = Math.max(worst.moonProg, Math.abs(got.moon.progress - want.moon.progress));
    worst.lit = Math.max(worst.lit, Math.abs(got.moon.illuminated - want.moon.illuminated));
    if (want.moon.altitude > 0 && want.moon.illuminated > .05 && want.moon.illuminated < .95)
      worst.tilt = Math.max(worst.tilt, angle(got.moon.tilt, want.moon.tilt));
  }
  console.log(worst);
  assert.ok(worst.sunAlt < 0.2, `sun altitude off by ${worst.sunAlt}`);
  assert.ok(worst.sunProg < 0.005, `sun progress off by ${worst.sunProg}`);
  assert.ok(worst.moonAlt < 0.3, `moon altitude off by ${worst.moonAlt}`);
  assert.ok(worst.moonProg < 0.005, `moon progress off by ${worst.moonProg}`);
  assert.ok(worst.lit < 0.005, `moon phase off by ${worst.lit}`);
  assert.ok(worst.tilt < 1, `moon tilt off by ${worst.tilt}`);
});
