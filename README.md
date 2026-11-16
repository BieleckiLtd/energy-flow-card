# Energy Flow Card

An animated house for Home Assistant dashboards. Solar, up to two batteries, the grid and the home, with power
pulses running along the pipes, the sun and moon where they really are for your location, and the weather outside
(clear, cloud, fog, rain, snow, storm). Labels stay readable on any sky.

**[Live demo](https://bieleckiltd.github.io/energy-flow-card/)**: pick a place, date, time and weather, play the
built-in cases, rename parts, change colours, hide a battery, then copy the YAML.

[![Energy Flow Card in Home Assistant: solar, two batteries, home and grid at dusk](https://raw.githubusercontent.com/BieleckiLtd/energy-flow-card/main/assets/screenshot.webp)](https://bieleckiltd.github.io/energy-flow-card/)

## Install

**HACS**: HACS → ⋮ → *Custom repositories* → add `https://github.com/BieleckiLtd/energy-flow-card` with type
*Dashboard* → download *Energy Flow Card* → reload the browser.

**By hand**: copy `dist/energy-flow-card.js` to `/config/www/`, then Settings → Dashboards → ⋮ → Resources →
add `/local/energy-flow-card.js` as a *JavaScript module*.

## Configure

Add the card from the dashboard editor (it has a visual editor), or in YAML:

```yaml
type: custom:energy-flow-card
weather: weather.forecast_home    # see Weather below
solar: sensor.solar_power              # a plain entity id is fine
grid:
  entity: sensor.grid_power            # + import, − export
home:
  entity: sensor.home_power            # optional: worked out from the others when left out
battery1:
  power: sensor.battery_power          # + discharging, − charging
  soc: sensor.battery_level
  name: Garage
  color: "#4dbd80"                     # flow colour
  face: "#eeeeee"                      # front colour
battery2:
  charge: sensor.battery2_charging     # two always-positive sensors work as well
  discharge: sensor.battery2_discharging
  soc: sensor.battery2_level
```

| Option | For | Meaning |
| --- | --- | --- |
| `entity` | solar, grid, home | Power sensor (W, kW or MW) |
| `import` / `export` | grid | Two positive sensors instead of one signed one |
| `power`, `soc` | battery1, battery2 | Signed power sensor and charge (%) |
| `discharge` / `charge` | battery1, battery2 | Two positive sensors instead of one signed one |
| `invert` | grid, batteries | Flip the sign if your sensor counts the other way |
| `name` | any part | Label in the picture |
| `color` | solar, grid, batteries | Flow colour, `#rrggbb` |
| `face` | batteries | Front colour, `#rrggbb` |
| `show` | solar, batteries | `false` hides the part (a battery without sensors is hidden anyway) |
| `weather` | card | A `weather.*` entity; without one the sky is clear |
| `latitude`, `longitude` | card | Sky location, if not Home Assistant's own |
| `title` | card | Optional heading |
| `christmas` | card | Tree in the window and lights under the eaves from 6 December to 6 January; `false` turns them off (on by default) |
| `look` | card | `glass`, `roof`, `wall`, `window`, `background` colours |

Tap a label to open that sensor's details.

## Weather

The sky follows any `weather.*` entity. Most Home Assistant installs already have one: the Met.no integration is
added during first-time setup, needs no account or API key, works worldwide and gives `weather.forecast_home`. Look
under Settings → Devices & services → Entities and search for `weather.` to see what you have; the card's editor
picks the first one it finds.

No weather entity yet? Settings → Devices & services → Add integration → *Meteorologisk institutt (Met.no)*, and use
your home location. Any other weather integration (OpenWeatherMap, Pirate Weather, AccuWeather, …) works the same way.

Rain, snow, fog and storms come from the entity's state. The sun and moon are worked out from Home Assistant's
location (or `latitude`/`longitude`), so they need nothing.

## Develop

No dependencies. `node build.mjs` bundles `src/` (renderer, sky maths, card and the picture) into
`dist/energy-flow-card.js` and `docs/energy-flow-card.js`; `npm test` builds and runs the tests. The lab is
`docs/index.html` (GitHub Pages serves `docs/`). `test/ha/` has a throwaway Home Assistant with slider-driven fake
sensors: `docker compose -f test/ha/docker-compose.yml up -d`, then http://localhost:8123.

## Licence

MIT
