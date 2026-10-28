/* Build the one-request portfolio stylesheet from the three readable source layers.
   Run: node scripts/build-css.mjs    or    node scripts/build-css.mjs --check */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve, dirname } from "node:path";
const base = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sources = ["styles.css", "premium.css", "atelier.css"];
const bundle = sources.map(name => {
  const content = readFileSync(resolve(base, "assets", name), "utf8").trimEnd();
  return "/* SOURCE: assets/" + name + " — generated; edit original source */\n" + content + "\n";
}).join("\n");
const output = resolve(base, "assets/portfolio.css");
if (process.argv.includes("--check")) {
  let current = "";
  try { current = readFileSync(output, "utf8"); } catch { /* Missing bundle fails the check. */ }
  if (current !== bundle) {
    console.error("assets/portfolio.css is stale. Run node scripts/build-css.mjs and commit it.");
    process.exitCode = 1;
  } else {
    console.log("PASS: consolidated CSS exactly matches all three source layers.");
  }
} else {
  writeFileSync(output, bundle, "utf8");
  console.log("Built assets/portfolio.css (" + Buffer.byteLength(bundle) + " bytes)");
}
