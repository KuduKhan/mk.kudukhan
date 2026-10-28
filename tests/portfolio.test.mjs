import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { test } from "node:test";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readFileSync(new URL("../assets/styles.css", import.meta.url), "utf8");
const js = readFileSync(new URL("../assets/app.js", import.meta.url), "utf8");
const experience = readFileSync(new URL("../assets/experience.js", import.meta.url), "utf8");
const premiumCss = readFileSync(new URL("../assets/premium.css", import.meta.url), "utf8");
const atelierCss = readFileSync(new URL("../assets/atelier.css", import.meta.url), "utf8");
const atelierJs = readFileSync(new URL("../assets/atelier.js", import.meta.url), "utf8");
const icons = readFileSync(new URL("../assets/icons.svg", import.meta.url), "utf8");
const consolidatedCss = readFileSync(new URL("../assets/portfolio.css", import.meta.url), "utf8");
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
  assert.doesNotMatch(html, /href=["'](?:#['"]|#!|javascript:)/i);
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
  assert.match(experience, /aria-pressed/);
});

test("script parses and CSS braces are balanced", () => {
  assert.doesNotThrow(() => new Function(js));
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
});

test("premium navigation, mobile experience and dialogs",()=>{
 assert.match(html,/id="command-dialog"[^>]*aria-labelledby=/);
 assert.match(html,/id="project-dialog"[^>]*aria-labelledby=/);
 assert.match(html,/id="quick-nav-trigger"[^>]*aria-label=/);
 assert.match(html,/id="project-search" type="search"/);
 assert.match(html,/id="floating-top"[^>]*aria-label="Back to top"/);
 assert.match(experience,/event.key.toLowerCase\(\)==="k"/);
 assert.match(experience,/event.key==="ArrowDown"/);
 assert.match(experience,/projectSearch.addEventListener\("input",filter\)/);
});
test("eight searchable project briefs map to real repositories",()=>{
 const slugs=["khanhomes","khaniversity-platform","mysoft-office","kudupray-frontend","amanah-giving-Frontend","islamtok","music-world","pukka-gen"];
 for(const slug of slugs){assert.ok(html.includes('data-project="'+slug+'"'));assert.ok(experience.includes('slug:"'+slug+'"'));assert.ok(experience.includes("https://github.com/KuduKhan/"+slug));}
});
test("premium layout adapts to phones, tablets and widescreen",()=>{
 for(const width of [360,480,720,980,1250,1800])assert.ok(premiumCss.includes("width:"+width+"px"),"Breakpoint missing "+width);
 assert.match(premiumCss,/safe-area-inset-right/);
 assert.match(premiumCss,/prefers-reduced-motion:reduce/);
 assert.match(premiumCss,/prefers-contrast:more/);
 assert.equal((premiumCss.match(/\{/g)||[]).length,(premiumCss.match(/\}/g)||[]).length);
 assert.doesNotThrow(()=>new Function(experience));
});

test("vector icons are meaningful, self-hosted and referenced consistently",()=>{
 const symbols=[...icons.matchAll(/<symbol id="icon-([a-z0-9-]+)"/g)].map(match=>match[1]);
 assert.equal(new Set(symbols).size,symbols.length,"Duplicate sprite IDs");
 assert.ok(symbols.length>=20,"Missing core SVG icons");
 const literal=[...html.matchAll(/\/assets\/icons\.svg#icon-([a-z0-9-]+)/g)].map(match=>match[1]);
 for(const id of literal)assert.ok(symbols.includes(id),"Unresolved SVG reference "+id);
 for(const id of ["code","cloud","shield","house","graduate","files","moon-star","heart","video","music","spark","network","search","github","linkedin","mail"]){
  assert.ok(literal.includes(id),"Missing visible icon for "+id);
 }
 assert.match(html,/class="expertise-symbol sym-code" aria-hidden="true"><svg/);
 assert.match(html,/id="motion-control"[^>]+aria-label=/);
 assert.match(html,/class="hero-circuit" viewBox="0 0 600 600"/);
 assert.equal((html.match(/class="compact-icon /g)||[]).length,5);
 assert.doesNotMatch(html,/<div class="compact-icon [^"]*">[^<]+<\/div>/);
});
test("decorative motion remains optional and browser scripts parse",()=>{
 assert.match(atelierCss,/@media\(prefers-reduced-motion:reduce\)/);
 assert.match(atelierCss,/:root\.motion-paused/);
 assert.match(atelierJs,/localStorage\.setItem/);
 assert.match(atelierJs,/reduced\.matches/);
 assert.match(atelierJs,/pointermove/);
 assert.match(experience,/svgIcon\("arrow-up-right"\)/);
 assert.doesNotThrow(()=>new Function(atelierJs));
 assert.equal((atelierCss.match(/\{/g)||[]).length,(atelierCss.match(/\}/g)||[]).length);
});

test("v2.4 serves a single deterministic CSS bundle with unmodified cascade order",()=>{
 const files=["styles.css","premium.css","atelier.css"];
 const expected=files.map(name=>{
   const source=readFileSync(new URL("../assets/"+name,import.meta.url),"utf8").trimEnd();
   return "/* SOURCE: assets/"+name+" — generated; edit original source */\n"+source+"\n";
 }).join("\n");
 assert.equal(consolidatedCss,expected,"Stale built CSS; run node scripts/build-css.mjs");
 assert.equal((html.match(/<link rel="stylesheet" href="\/assets\/[^"]+"[^>]*>/g)||[]).length,1);
 assert.match(html,/href="\/assets\/portfolio\.css"/);
 assert.doesNotMatch(html,/href="\/assets\/(?:styles|premium|atelier)\.css"/);
 for(const selector of [".site-header .header-cta",".hero-glow",".mobile-nav",".project-card",".contact-email",".footer-main"]){
   assert.ok(consolidatedCss.includes(selector),"Missing selector "+selector);
 }
});
test("v2.4 accessible touch-target and container rules are retained",()=>{
 assert.match(atelierCss,/--tap-target:44px/);
 assert.match(atelierCss,/\.project-card \.project-foot\{flex-wrap:wrap/);
 assert.match(atelierCss,/scroll-snap-type:x proximity/);
 assert.match(atelierCss,/prefers-reduced-motion:reduce/);
 assert.match(atelierCss,/max-width:360px/);
});


test("v2.5 stories use source-backed case studies, an authentic screenshot manifest and an honest résumé",()=>{
 const pages=["khanhomes","khaniversity","mysoft-office","kudupray"];
 for(const slug of pages){
  const filename="../case-studies/"+slug+".html";
  const detail=readFileSync(new URL(filename,import.meta.url),"utf8");
  assert.match(html,new RegExp("href=\\"/case-studies/"+slug+"\\\\.html\\""),"Missing homepage case link for "+slug);
  assert.match(detail,/class="case-story"/);
  assert.match(detail,/id="challenge"/);
  assert.match(detail,/id="approach"/);
  assert.match(detail,/id="evidence"/);
  assert.match(detail,/id="boundaries"/);
  assert.match(detail,/id="next"/);
  assert.ok(detail.includes("https://github.com/KuduKhan/"),"Source missing from "+slug);
  assert.doesNotMatch(detail,/\b(?:10k users|million customers|99\.9% uptime)\b/i);
 }
 const manifest=JSON.parse(readFileSync(new URL("../assets/showcase/manifest.json",import.meta.url),"utf8"));
 assert.equal(manifest.kind,"verified-website-captures");
 assert.ok(manifest.screenshots.length>=6);
 for(const image of manifest.screenshots){
  assert.match(image.source,/^https:\/\/(?:khanhomes|kudupray|amanahgiving)\.vercel\.app\/$/);
  assert.match(image.file,/^\/assets\/showcase\/[a-z-]+\.jpg$/);
  assert.ok(existsSync(new URL(".."+image.file,import.meta.url)),"Missing actual screenshot "+image.file);
  assert.ok(image.viewport.width>0);
 }
 const résumé=readFileSync(new URL("../resume.html",import.meta.url),"utf8");
 assert.match(résumé,/id="print-resume"/);
 assert.match(résumé,/independent project experience/i);
 assert.doesNotMatch(résumé,/B\.Sc\.|Master of Science|worked at Google/i);
 const capture=readFileSync(new URL("../assets/case-studies.css",import.meta.url),"utf8");
 assert.match(capture,/@media print/);
 assert.equal((capture.match(/\{/g)||[]).length,(capture.match(/\}/g)||[]).length);
 const sites=readFileSync(new URL("../case-studies/index.html",import.meta.url),"utf8");
 for(const slug of pages)assert.ok(sites.includes("/case-studies/"+slug+".html"));
 assert.match(html,/id="screenshots"/);
 assert.match(html,/id="resume"/);
 assert.match(html,/src="\/assets\/showcase\/khanhomes-desktop\.jpg"/);
});
