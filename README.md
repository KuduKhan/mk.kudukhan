# Mufasa Khan — Portfolio 2.0

A design-led, accessible static portfolio for **Mufasa Khan / KuduKhan**.

## What's new
- Rebuilt around verified projects in the KuduKhan GitHub account.
- Responsive, editorial dark/light UI with glass navigation, CSS-generated illustrations, restrained motion, and mobile navigation.
- Dynamic project filters, section-active navigation, scroll progress, copy-email action, and reduced-motion support.
- Honest project descriptions distinguishing current work and simulated workflows; no fictitious testimonials, awards, live demos or dead placeholder links.
- No JavaScript framework or runtime dependency; static HTML/CSS/JS deploys directly on Vercel.

## Structure
- `index.html`: semantic page structure and project content.
- `assets/styles.css`: responsive design system and visual treatments.
- `assets/app.js`: theme persistence, filters, navigation, and lightweight enhancements.
- `assets/favicon.svg`: scalable monogram.

## Local development
Open `index.html` with any static server, for example `python -m http.server 8000`. Test accessibility, keyboard navigation, the mobile menu, project links and mailto links before release.

## Deployment
The Vercel project `mk-kudukhan` uses the GitHub repository `KuduKhan/mk.kudukhan`. Keep the project framework preset set to Other and the output directory unset (root static site). Vercel Git integration builds previews from non-production branches and production from the configured production branch.

## Content accuracy
Product visuals are illustrative compositions made with CSS, not screenshots or claims of tested production readiness. The public contact email and social links were retained from the previous portfolio. Update biographies and project labels as releases evolve.

## Quality gate

The portfolio runs without a package manager. With Node.js 22+, run `node --check assets/app.js` and `node --test tests/portfolio.test.mjs`. GitHub Actions runs these on pull requests and commits to `main`. Tests check navigation integrity, known projects, local assets, link security, responsive styling, accessibility affordances and script parsing. These static checks supplement (but do not replace) a browser/device QA pass.

## Deployment status

Production releases depend on access to the existing Vercel `mk-kudukhan` project and available build capacity. Verify that the served deployment's Git commit matches `main`; GitHub merge completion alone is not deployment evidence.

## Premium UX v2.2

A layered UI enhancement adds assets/premium.css and assets/experience.js. The new discovery surface includes searchable projects, category filters, accessible project briefs, command navigation (Ctrl/Command+K or /), a floating top shortcut, and motion-aware reveals. Responsive styling covers narrow phones, tablets, laptops and widescreen monitors. No runtime libraries are required.

Verify with node --check assets/app.js, node --check assets/experience.js and node --test tests/portfolio.test.mjs. CI static checks do not replace physical device visual verification.

## Atelier polish — v2.3 (October 2026)

The site now includes a self-hosted, reusable outline SVG sprite with consistent icons for navigation, contact, source links, engineering skills and eight project visuals. The hero's circuit diagram represents interconnected systems and is decorative. The overlay concept illustrations do not represent real customer metrics.

`assets/atelier.css` adds spacing/alignment refinements, vector sizing, focus and hover responses, lightweight card spotlighting, navigation indicators and narrow-phone adjustments. `assets/atelier.js` adds restrained pointer parallax and a persistent pause/resume control for decorative motion; reduced-motion system settings take precedence. Email copying has a fallback and user-visible success feedback. The UI has no new runtime dependencies.

CI validates SVG references and geometry, 8 responsive viewport widths, project navigation and filters, popups, theme controls and motion on/off. Review device screenshots separately before considering cosmetic quality subjective claims final.

## Portfolio v2.4 — Reliability & responsive baseline

The v2.4 release consolidates all three authored CSS layers into one deployable `assets/portfolio.css` while retaining `assets/styles.css`, `assets/premium.css`, and `assets/atelier.css` as the editable source layers in the same cascade order. `node scripts/build-css.mjs` regenerates the bundle deterministically; `node scripts/build-css.mjs --check` prevents a stale bundle from reaching deployment. The static quality workflow enforces this check.

The responsive stylesheet adds component-level minimum-width safeguards, mobile header visibility invariants, consistent touch-target rules, project action wrapping, light-theme focus clarity, and reduced-motion-respecting filter behavior. Chromium tests cover widths from 320 to 2560px, check document overflow and icon geometry, and validate interactions and theme behavior.

### Production release gate

Do **not** assume a GitHub merge publishes production. The existing Vercel project `mk-kudukhan` and alias `mufasakhan.vercel.app` must point to the exact merged main commit. Vercel's currently connected integration can list/inspect this project and deploy previews, but a previous production API call returned HTTP 403. An authorized Vercel team member must verify the project Git Settings, production branch `main`, whether automatic production deployments are paused/disabled, and Git integration write permissions. Use the Vercel dashboard to deploy the reviewed `main` commit if automation is not authorized. Avoid creating a duplicate project or moving the existing domain until those permissions are resolved.

## v2.5 — Evidence-first case studies, verified captures and résumé (October 2026)

Four standalone, source-backed pages now exist under `/case-studies/`: KhanHomes, KHANIVERSITY, MySoft Office, and KuduPray. Each describes the user problem, implementation decisions, source proof, documented boundaries and next engineering gates, and links to its project repository. The homepage adds direct case-study links and a gallery of **authentic automated captures** from public KhanHomes, KuduPray and Amanah Giving landing pages, with exact source URLs and viewport metadata in `assets/showcase/manifest.json` (captured 28 October 2026). The public KhanHomes UI contains illustrative metrics; its screenshot is not evidence of real live tenancy statistics. Amanah's payment flows remain frontend simulations.

The listed `khaniversity-platform.vercel.app` URL returned HTTP 404 in the capture job. No screenshot or live-app claim is made for KHANIVERSITY. MySoft Office does not have a verified public capture in this release; its case study uses repository evidence, not a fabricated image.

`/resume.html` is a responsive project-based résumé with an accessible Print / Save as PDF button and A4 print CSS. It contains **no invented job titles, employers, degrees, certifications or visitor/financial metrics**. It is designed to work without a backend.

Production content is still a static portfolio: `assets/case-studies.css` and `assets/case-studies.js` serve the case studies and résumé, while `assets/atelier.css` is the source of the new homepage styles and `assets/portfolio.css` remains the deterministic single-file build. Tests cover case-study structure, screenshot provenance, real image loading, page overflow, keyboard interaction, and printing. Verify deployment by matching the live Vercel domain to the exact merged main commit.
