// Where the Sun and Moon stand for a place and moment, as the picture needs them: how far along their arc across
// the sky (0 = rising in the east, 1 = setting in the west), their altitude, the Moon's lit fraction and the angle
// of its lit side. Low-precision formulas (a few arc-minutes for the Sun, a fraction of a degree for the Moon),
// plenty for a picture and small enough to ship inside a card.

const RAD = Math.PI / 180;
const sinD = (x) => Math.sin(x * RAD);
const cosD = (x) => Math.cos(x * RAD);
const wrap360 = (x) => ((x % 360) + 360) % 360;

// Atmospheric refraction in degrees for a geometric altitude, fading out below the horizon.
function refraction(altitude) {
  if (altitude < -90 || altitude > 90) return 0;
  const h = Math.max(-1, altitude);
  let r = 1.02 / Math.tan((h + 10.3 / (h + 5.11)) * RAD) / 60;
  if (altitude < -1) r *= (altitude + 90) / 89;
  return r;
}

function sunEcliptic(d) {
  const w = 282.9404 + 4.70935e-5 * d;
  const M = wrap360(356.047 + 0.9856002585 * d);
  const e = 0.016709 - 1.151e-9 * d;
  const E = M + (e / RAD) * sinD(M) * (1 + e * cosD(M));
  const x = cosD(E) - e, y = Math.sqrt(1 - e * e) * sinD(E);
  return { lon: wrap360(Math.atan2(y, x) / RAD + w), lat: 0, dist: Math.hypot(x, y) * 23455, M, L: wrap360(M + w) };
}

function moonEcliptic(d, sun) {
  const N = 125.1228 - 0.0529538083 * d, i = 5.1454, w = 318.0634 + 0.1643573223 * d;
  const a = 60.2666, e = 0.0549, M = wrap360(115.3654 + 13.0649929509 * d);
  let E = M + (e / RAD) * sinD(M) * (1 + e * cosD(M));
  for (let k = 0; k < 5; k++) E -= (E - (e / RAD) * sinD(E) - M) / (1 - e * cosD(E));
  const xv = a * (cosD(E) - e), yv = a * Math.sqrt(1 - e * e) * sinD(E);
  const v = Math.atan2(yv, xv) / RAD, r = Math.hypot(xv, yv);
  const xh = r * (cosD(N) * cosD(v + w) - sinD(N) * sinD(v + w) * cosD(i));
  const yh = r * (sinD(N) * cosD(v + w) + cosD(N) * sinD(v + w) * cosD(i));
  const zh = r * sinD(v + w) * sinD(i);
  let lon = Math.atan2(yh, xh) / RAD, lat = Math.atan2(zh, Math.hypot(xh, yh)) / RAD, dist = r;
  const Ms = sun.M, Lm = M + w + N, D = Lm - sun.L, F = Lm - N;
  lon += -1.274 * sinD(M - 2 * D) + 0.658 * sinD(2 * D) - 0.186 * sinD(Ms) - 0.059 * sinD(2 * M - 2 * D)
    - 0.057 * sinD(M - 2 * D + Ms) + 0.053 * sinD(M + 2 * D) + 0.046 * sinD(2 * D - Ms) + 0.041 * sinD(M - Ms)
    - 0.035 * sinD(D) - 0.031 * sinD(M + Ms) - 0.015 * sinD(2 * F - 2 * D) + 0.011 * sinD(M - 4 * D);
  lat += -0.173 * sinD(F - 2 * D) - 0.055 * sinD(M - F - 2 * D) - 0.046 * sinD(M + F - 2 * D)
    + 0.033 * sinD(F + 2 * D) + 0.017 * sinD(2 * M + F);
  dist += -0.58 * cosD(M - 2 * D) - 0.46 * cosD(2 * D);
  return { lon: wrap360(lon), lat, dist };
}

function equatorial({ lon, lat }, obliquity) {
  const x = cosD(lon) * cosD(lat);
  const y = cosD(obliquity) * sinD(lon) * cosD(lat) - sinD(obliquity) * sinD(lat);
  const z = sinD(obliquity) * sinD(lon) * cosD(lat) + cosD(obliquity) * sinD(lat);
  return { ra: wrap360(Math.atan2(y, x) / RAD), dec: Math.atan2(z, Math.hypot(x, y)) / RAD };
}

export function energySky(latitude, longitude, ms) {
  const jd = ms / 86400000 + 2440587.5;
  const d = jd - 2451543.5;  // days from 2000 Jan 0.0, the formulas' epoch
  const obliquity = 23.4393 - 3.563e-7 * d;
  const sidereal = wrap360(280.46061837 + 360.98564736629 * (jd - 2451545)) + longitude;

  const sunEcl = sunEcliptic(d);
  const moonEcl = moonEcliptic(d, sunEcl);

  function position({ ra, dec }, parallax = 0) {
    let hourAngle = wrap360(sidereal - ra + 180) - 180;
    if (parallax) {
      // Seen from the ground, not the Earth's centre (matters for the Moon only).
      const sp = sinD(parallax);
      const shift = Math.atan2(-cosD(latitude) * sp * sinD(hourAngle), cosD(dec) - cosD(latitude) * sp * cosD(hourAngle)) / RAD;
      dec = Math.atan2((sinD(dec) - sinD(latitude) * sp) * cosD(shift), cosD(dec) - cosD(latitude) * sp * cosD(hourAngle)) / RAD;
      hourAngle -= shift;
    }
    const sinAlt = sinD(latitude) * sinD(dec) + cosD(latitude) * cosD(dec) * cosD(hourAngle);
    const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt))) / RAD;
    const azimuth = wrap360(Math.atan2(sinD(hourAngle), cosD(hourAngle) * sinD(latitude) - Math.tan(dec * RAD) * cosD(latitude)) / RAD + 180);
    // Project the visible arc from east to west. A circumpolar body uses a full rotation.
    // -0.83° accounts for typical horizon refraction and the radius of the Sun or Moon.
    const horizon = (sinD(-0.83) - sinD(latitude) * sinD(dec)) / Math.max(1e-9, cosD(latitude) * cosD(dec));
    const halfArc = Math.max(1, Math.acos(Math.max(-1, Math.min(1, horizon))) / RAD);
    const progress = Math.max(0, Math.min(1, (hourAngle / halfArc + 1) / 2));
    return { progress, altitude: altitude + refraction(altitude), geometric: altitude, azimuth };
  }

  const sun = position(equatorial(sunEcl, obliquity));
  const moon = position(equatorial(moonEcl, obliquity), Math.asin(1 / moonEcl.dist) / RAD);

  // Project the direction to the Sun onto the Moon's disk, relative to the local vertical.
  const dAz = (sun.azimuth - moon.azimuth) * RAD;
  const sa = sun.geometric * RAD, ma = moon.geometric * RAD;
  const right = Math.cos(sa) * Math.sin(dAz);
  const up = Math.sin(sa) * Math.cos(ma) - Math.cos(sa) * Math.sin(ma) * Math.cos(dAz);
  const elongation = Math.acos(cosD(moonEcl.lon - sunEcl.lon) * cosD(moonEcl.lat));
  const phaseAngle = Math.atan2(Math.sin(elongation), moonEcl.dist / 23455 - Math.cos(elongation));
  const round = (x, n) => Math.round(x * 10 ** n) / 10 ** n;
  return {
    sun: { progress: round(sun.progress, 5), altitude: round(sun.altitude, 3) },
    moon: {
      progress: round(moon.progress, 5), altitude: round(moon.altitude, 3),
      tilt: round(Math.atan2(-up, right) / RAD, 2),
      illuminated: round((1 + Math.cos(phaseAngle)) / 2, 5),
    },
  };
}
