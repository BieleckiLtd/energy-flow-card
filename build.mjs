// Builds dist/energy-flow-card.js: the card, its renderer, the sky maths and the picture in one file, which is what
// Home Assistant (and HACS) load. Also copies it next to the lab page in docs/. No dependencies: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const pkg = JSON.parse(readFileSync("package.json", "utf8"));
// Build the same release bytes from Windows and Unix checkouts.
const readText = (file) => readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const src = (name) => readText(`src/${name}`)
  .replace(/^import .*;\r?\n/gm, "")
  .replace(/^export (?=(const|function|class|async) )/gm, "");
const svg = readText("src/energy-flow.svg")
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/<style><!\[CDATA\[[\s\S]*?\]\]><\/style>/, (css) => css.replace(/\/\*[\s\S]*?\*\//g, ""))
  .replace(/\n\s*\n/g, "\n");

const out = `/*! energy-flow-card ${pkg.version} | MIT License | https://github.com/BieleckiLtd/energy-flow-card */
(() => {
"use strict";
const VERSION = ${JSON.stringify(pkg.version)};
const SVG = ${JSON.stringify(svg)};
${src("sky.js")}
${src("view.js")}
${src("card.js")}
})();
`;
mkdirSync("dist", { recursive: true });
writeFileSync("dist/energy-flow-card.js", out);
writeFileSync("docs/energy-flow-card.js", out);
console.log(`dist/energy-flow-card.js ${(out.length / 1024).toFixed(0)} KB`);

// Cache-busting: the lab page loads its files with a hash of their contents, so a browser (or GitHub Pages' cache)
// never mixes a new page with an old script.
const { createHash } = await import("node:crypto");
const hash = (file) => createHash("sha256").update(readText(file)).digest("hex").slice(0, 10);
let page = readFileSync("docs/index.html", "utf8");
for (const file of ["energy-flow-card.js", "lab.js", "lab.css"]) {
  const pattern = new RegExp('"' + file.replace(".", "\\.") + '(\\?v=[0-9a-f]+)?"', "g");
  page = page.replace(pattern, `"${file}?v=${hash(`docs/${file}`)}"`);
}
writeFileSync("docs/index.html", page);
