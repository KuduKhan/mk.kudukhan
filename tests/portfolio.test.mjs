import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const files = new URL("../", import.meta.url);

test("metadata, language, landmark and identity are present", () => {
  assert.match(html, /<!doctype html>/i);
  assert.match(html, /<html[^>]+lang="en"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /rel="canonical" href="https:\/\/mufasakhan\.vercel\.app\/"/);
  assert.match(html, /<main id="main">/);
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /Mufasa Khan/);
  assert.match(html, /KuduKhan/);
});

test("anchor targets are valid and element IDs unique", () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
  assert.equal(new Set(ids).size, ids.length, "Duplicate id attribute found");
  const targets = [...html.matchAll(/\bhref="#([^"]+)"/g)].map((m) => m[1]);
  for (const target of targets) {
    assert.ok(ids.includes(target), "Missing in-page target #" + target);
  }
});

test("real projects are featured without dead external links", () => {
  const slugs = [
    "khanhomes", "khaniversity-platform", "mysoft-office",
    "kudupray-frontend", "amanah-giving-Frontend", "islamtok",
    "music-world", "pukka-gen"
  ];
  for (const slug of slugs) {
    assert.ok(html.includes("https://github.com/KuduKhan/" + slug), "Missing project: " + slug);
  }
  assert.equal((html.match(/data-category="(?:platform|tools|experience)"/g) || []).length, 8);
  assert.doesNotMatch(html, /href=["'](?:#|#!|javascript:)/i);
});

test("external new-tab links are protected", () => {
  const links = [...html.matchAll(/<a\b[^>]*\btarget="_blank"[^>]*>/g)];
  for (const link of links) {
    assert.match(link[0], /\brel="noopener noreferrer"/, link[0]);
  }
});

test("all linked local assets exist", () => {
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    assert.ok(existsSync(new URL("." + match[1], files)), "Missing asset " + match[1]);
  }
});

test("responsive, accessibility and reduced-motion features remain intact", () => {
  assert.match(css, /@media\(max-width:420px\)/);
  assert.match(css, /@media\(max-width:720px\)/);
  assert.match(css, /@media\(max-width:980px\)/);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /id="project-filter-status" role="status"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(js, /setMenu\(false\)/);
  assert.match(js, /aria-pressed/);
});

test("script parses and CSS braces are balanced", () => {
  assert.doesNotThrow(() => new Function(js));
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
});
