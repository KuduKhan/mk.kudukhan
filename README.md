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
