// scripts/build-widget.mjs
import { build } from "esbuild";
import { statSync } from "node:fs";

const targets = [
  { in: "widget-src/widget.js", out: "public/widget.js", budgetKB: 10 },
];

for (const t of targets) {
  await build({
    entryPoints: [t.in],
    bundle: true,
    minify: true,
    format: "iife",
    target: "es2019",
    outfile: t.out,
  });
  const sizeKB = statSync(t.out).size / 1024;
  console.log(`✅ ${t.out}: ${sizeKB.toFixed(2)} KB`);
  if (sizeKB > t.budgetKB) {
    console.warn(`⚠️  ${t.out} exceeds ${t.budgetKB}KB budget!`);
  }
}
