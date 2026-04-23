# TUPS Website Migration — Design Spec

## Overview

Migrate www.tups.ee from WordPress to a static HTML/CSS/JS site. Same content structure with a visual refresh that leans into the Estonian folk pattern heritage. Deploy to static hosting (Vercel/Netlify/GitHub Pages).

## Motivation

- Eliminate WordPress hosting/plugin costs and complexity
- Full control over code without theme/plugin dependencies
- Opportunity to elevate the visual design while keeping brand identity

## Tech Stack

- Plain HTML, CSS, vanilla JavaScript
- No build tools, no dependencies, no frameworks
- Local dev via `npx serve` or opening `index.html` directly
- Static hosting deployment (Vercel/Netlify/GitHub Pages)

## File Structure

```
tups/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
└── images/
    ├── logo-tups-white.png
    ├── toode-tups-arktika.webp
    ├── tups-arktika-extra.webp
    ├── tups-xtreme.webp
    ├── tups-black.webp
    └── distributors/
        ├── alexela.png
        ├── super-alko.png
        ├── olerex.png
        ├── city-alko.png
        ├── grossi.png
        ├── r-kiosk.png
        └── terminal.png
```

## Page Sections (in order)

### 1. Sticky Navigation

- TUPS logo left
- Links: Tooted, Edasimüüjad (center-right)
- Facebook + Instagram SVG icons
- "Kontakt" button (blue pill shape)
- All links are smooth-scroll anchors
- Collapses to hamburger menu on mobile (<768px)

### 2. Hero Section

- Full-width blue gradient background: `#3b6aaf` → `#6b96d0` → `#8fb5e2`
- Estonian folk pattern as SVG overlay at 20-25% opacity — prominent, not subtle
- Headline: "Eestis toodetud nikotiinipatjade bränd" (large, bold, white)
- CTA: "Vaata meie tooteid →" link
- Product can image (tilted, right side)
- Diagonal stripe at bottom: blue → teal (`#5bb8d4`) → green (`#6dcdb1`)

### 3. Products Section (#tooted)

- White background
- 4 products in alternating zigzag layout:
  - Product 1 (Arktika Strong): image left, text right
  - Product 2 (Arktika Extra Strong): text left, image right
  - Product 3 (X-TREME): image left, text right
  - Product 4 (Black): text left, image right
- Each product shows: name, 2 paragraphs description (Estonian), bold "Maitsed:" line, bold "Patju karbis:" count
- Subtle fade-in animation on scroll (Intersection Observer)

### 4. Distributors Section (#edasimüüjad)

- Light gray background (`#f5f7fa`)
- Section heading
- 7 retailer logos in a row: Alexela, Super Alko, Olerex, City Alko, Grossi Toidukaubad, R-Kiosk, Terminal
- Logos grayscale by default, color on hover
- Each logo links to retailer website

### 5. Contact Section (#kontakt)

- White background
- Two columns side by side:
  - **Manufacturer (Nano OÜ)**: email info@nanotech.ee, website www.nanoest.com, address Suur-Sõjamäe 31 11415 Tallinn, registry 11382007, VAT EE101528818
  - **Distributor (Nordista OÜ)**: phone +372 740 4444, email info@nordista.eu, website www.nordista.eu, address Vinkli tn 2 50411 Tartu, registry 12711752, VAT EE102273421
- Google Maps iframe below, full width, showing Suur-Sõjamäe 31 Tallinn

### 6. Footer

- Minimal: copyright line, year

## Visual Design System

### Colors

| Token | Hex | Usage |
|-------|-----|-------|
| Primary blue | `#4a7abf` | Hero background base |
| Dark blue | `#2c5490` | Nav buttons, headings |
| Light blue | `#8fb5e2` | Gradient endpoints |
| Hero start | `#3b6aaf` | Hero gradient start |
| Hero mid | `#6b96d0` | Hero gradient mid |
| Green accent | `#6dcdb1` | Diagonal stripe, hover accents |
| Teal transition | `#5bb8d4` | Stripe gradient midpoint |
| White | `#ffffff` | Product sections, backgrounds |
| Dark text | `#333333` | Body copy |
| Light gray bg | `#f5f7fa` | Alternating section backgrounds |

### Typography

- Font: System font stack (`-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`)
- TUPS branding: 800 weight, wide letter-spacing (3-4px)
- Headings: 700 weight
- Body: 400 weight, line-height 1.6
- Product descriptions: comfortable reading size (~16px)

### Folk Pattern

- SVG-based geometric pattern inspired by Estonian textile traditions
- Applied as background overlay on hero section
- 20-25% opacity — prominent design feature, not wallpaper
- Potentially reused as subtle section dividers

### Signature Motif — Diagonal Stripe

- CSS `clip-path` or gradient at hero bottom
- Blue → teal → green transition
- Brand signature element

### Responsive Breakpoints

- Desktop: 1200px+ (full layout)
- Tablet: 768-1199px (stacked products, smaller hero)
- Mobile: <768px (hamburger nav, single-column)

## Interactions

- Smooth scroll for nav anchor links
- Mobile hamburger menu toggle
- Fade-in on scroll for product sections (CSS keyframes + Intersection Observer)
- Distributor logo grayscale → color on hover
- No JS dependencies — vanilla only

## Assets Required

Download from current tups.ee:
- TUPS logo (white version)
- 4 product can images (.webp)
- 7 distributor logos
- Social media icons (or inline SVG)

## Out of Scope

- E-commerce / WooCommerce functionality
- Cookie consent banner (evaluate later)
- Multi-language support
- CMS or admin panel
- Google Maps SDK (using iframe embed)
