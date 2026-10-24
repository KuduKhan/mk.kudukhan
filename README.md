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
