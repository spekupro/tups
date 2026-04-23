# TUPS Website Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild tups.ee as a static HTML/CSS/JS site with Heritage Elevated visual style — bold Estonian folk patterns, blue/white/green palette, clean modern typography.

**Architecture:** Single-page static site. One HTML file, one CSS file, one JS file. Images downloaded from current WordPress site. No build tools, no frameworks. Served locally via `npx serve`.

**Tech Stack:** HTML5, CSS3 (custom properties, flexbox, grid, clip-path), vanilla JavaScript (Intersection Observer, smooth scroll)

**Spec:** `docs/superpowers/specs/2026-04-22-tups-migration-design.md`

---

## File Structure

```
tups/
├── index.html          — All page content and structure
├── css/
│   └── style.css       — All styles: reset, custom properties, layout, responsive
├── js/
│   └── main.js         — Smooth scroll, mobile nav, scroll animations
└── images/
    ├── logo-tups-white.png
    ├── logo-tups-black.png
    ├── tups-rahvusmuster.webp        — Folk pattern background
    ├── toode-tups-arktika.webp       — Arktika (kange) product
    ├── tups-arktika-uli-kange.webp   — Arktika (eriti kange) product
    ├── tups-xtreme.png               — X-TREME product
    ├── tups-black.png                — Black product
    └── distributors/
        ├── alexela.webp
        ├── superalko.webp
        ├── olerex.webp
        ├── city-alko.webp
        ├── grossi.webp
        ├── rkiosk.webp
        └── terminal.webp
```

---

### Task 1: Download Assets from Current Site

**Files:**
- Create: `images/` directory and all image files
- Create: `images/distributors/` directory and all distributor logos

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p images/distributors
```

- [ ] **Step 2: Download logos**

```bash
curl -o images/logo-tups-white.png "https://tups.ee/wp-content/uploads/2021/02/logo-tups-web-white.png"
curl -o images/logo-tups-black.png "https://tups.ee/wp-content/uploads/2021/02/logo-tups-web-black.png"
```

- [ ] **Step 3: Download folk pattern background**

```bash
curl -o images/tups-rahvusmuster.webp "https://tups.ee/wp-content/uploads/2021/01/tups-rahvusmuster.webp"
```

- [ ] **Step 4: Download product images**

```bash
curl -o images/toode-tups-arktika.webp "https://tups.ee/wp-content/uploads/2021/03/tups-artika-kange.webp"
curl -o images/tups-arktika-uli-kange.webp "https://tups.ee/wp-content/uploads/2021/03/tups-artika-uli-kange.webp"
curl -o images/tups-xtreme.png "https://tups.ee/wp-content/uploads/2026/04/Mockup_Tups_X-treme-1-scaled.png"
curl -o images/tups-black.png "https://tups.ee/wp-content/uploads/2026/04/Tups_Must-4-scaled.png"
```

- [ ] **Step 5: Download distributor logos**

```bash
curl -o images/distributors/alexela.webp "https://tups.ee/wp-content/uploads/2021/02/logo-alexela-web.webp"
curl -o images/distributors/superalko.webp "https://tups.ee/wp-content/uploads/2021/02/logo-superalko-web.webp"
curl -o images/distributors/olerex.webp "https://tups.ee/wp-content/uploads/2021/02/logo-olerex-web.webp"
curl -o images/distributors/city-alko.webp "https://tups.ee/wp-content/uploads/2021/02/logo-City-Alko-web.webp"
curl -o images/distributors/grossi.webp "https://tups.ee/wp-content/uploads/2021/02/logo-Grossi-Toidukaubad-web-copy.webp"
curl -o images/distributors/rkiosk.webp "https://tups.ee/wp-content/uploads/2021/03/rkiosk-logo-korporatiiv-scaled-e1616688137155.webp"
curl -o images/distributors/terminal.webp "https://tups.ee/wp-content/uploads/2021/02/logo-Tartu-Teriminal-web.webp"
```

- [ ] **Step 6: Verify all files downloaded**

```bash
find images -type f | sort
```

Expected: 14 files (2 logos, 1 pattern, 4 products, 7 distributor logos).

---

### Task 2: CSS Foundation — Reset, Custom Properties, Typography

**Files:**
- Create: `css/style.css`

- [ ] **Step 1: Create CSS file with reset and custom properties**

```css
/* === Reset === */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-white);
  overflow-x: hidden;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

/* === Custom Properties === */
:root {
  --color-primary: #4a7abf;
  --color-dark-blue: #2c5490;
  --color-light-blue: #8fb5e2;
  --color-hero-start: #3b6aaf;
  --color-hero-mid: #6b96d0;
  --color-green: #6dcdb1;
  --color-teal: #5bb8d4;
  --color-white: #ffffff;
  --color-text: #333333;
  --color-bg-light: #f5f7fa;
  --font-brand: 800;
  --letter-spacing-brand: 3px;
  --max-width: 1200px;
  --nav-height: 70px;
}

/* === Typography === */
h1, h2, h3, h4 {
  font-weight: 700;
  line-height: 1.2;
}

h1 {
  font-size: clamp(2rem, 5vw, 3.5rem);
}

h2 {
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  color: var(--color-dark-blue);
}

h3 {
  font-size: 1.3rem;
}

/* === Utility === */
.container {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 24px;
}

section {
  padding: 80px 0;
}
```

- [ ] **Step 2: Verify file created**

```bash
ls -la css/style.css
```

---

### Task 3: HTML Scaffold + Sticky Navigation

**Files:**
- Create: `index.html`

- [ ] **Step 1: Create index.html with head and navigation**

```html
<!DOCTYPE html>
<html lang="et">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TUPS — Eestis toodetud nikotiinipatjade bränd</title>
  <meta name="description" content="TUPS on Eestis toodetud nikotiinipatjade bränd. Kvaliteetsed nikotiinipadjad igapäevasele tarvitajale.">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

  <!-- Navigation -->
  <nav class="nav" id="nav">
    <div class="nav__inner container">
      <a href="#" class="nav__logo">
        <img src="images/logo-tups-white.png" alt="TUPS" class="nav__logo-img">
      </a>
      <button class="nav__hamburger" id="navHamburger" aria-label="Ava menüü" aria-expanded="false">
        <span></span>
        <span></span>
        <span></span>
      </button>
      <div class="nav__links" id="navLinks">
        <a href="#tooted" class="nav__link">Tooted</a>
        <a href="#edasimuujad" class="nav__link">Edasimüüjad</a>
        <div class="nav__social">
          <a href="https://www.facebook.com" target="_blank" rel="noopener" aria-label="Facebook">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="https://www.instagram.com" target="_blank" rel="noopener" aria-label="Instagram">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
        </div>
        <a href="#kontakt" class="nav__btn">Kontakt</a>
      </div>
    </div>
  </nav>

  <!-- Sections will be added in subsequent tasks -->

  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Add navigation styles to style.css**

Append to `css/style.css`:

```css
/* === Navigation === */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-height);
  z-index: 100;
  transition: background 0.3s ease;
}

.nav--scrolled {
  background: rgba(44, 84, 144, 0.95);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav__logo-img {
  height: 36px;
  width: auto;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav__link {
  color: var(--color-white);
  font-size: 0.95rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.nav__link:hover {
  opacity: 0.8;
}

.nav__social {
  display: flex;
  gap: 12px;
  color: var(--color-white);
}

.nav__social a {
  transition: opacity 0.2s;
}

.nav__social a:hover {
  opacity: 0.7;
}

.nav__btn {
  background: var(--color-dark-blue);
  color: var(--color-white);
  padding: 8px 24px;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  transition: background 0.2s;
}

.nav__btn:hover {
  background: #1e3f6e;
}

/* Hamburger (hidden on desktop) */
.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-white);
  transition: transform 0.3s, opacity 0.3s;
}
```

- [ ] **Step 3: Verify by opening in browser**

```bash
npx serve . -l 3000
```

Open `http://localhost:3000`. Should see the sticky nav with TUPS logo, links, social icons, and Kontakt button. Transparent background (will show over hero later).

---

### Task 4: Hero Section

**Files:**
- Modify: `index.html` — add hero HTML after nav
- Modify: `css/style.css` — add hero styles

- [ ] **Step 1: Add hero HTML to index.html**

Insert after the closing `</nav>` tag and before `<!-- Sections will be added -->`:

```html
  <!-- Hero -->
  <section class="hero" id="hero">
    <div class="hero__pattern"></div>
    <div class="hero__content container">
      <div class="hero__text">
        <h1>Eestis toodetud<br>nikotiinipatjade bränd</h1>
        <a href="#tooted" class="hero__cta">Vaata meie tooteid <span>&rsaquo;</span></a>
      </div>
      <div class="hero__image">
        <img src="images/toode-tups-arktika.webp" alt="TUPS Arktika nikotiinipadjad">
      </div>
    </div>
    <div class="hero__stripe"></div>
  </section>
```

- [ ] **Step 2: Add hero styles to style.css**

Append to `css/style.css`:

```css
/* === Hero === */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--color-hero-start) 0%, var(--color-hero-mid) 50%, var(--color-light-blue) 100%);
  overflow: hidden;
  padding-top: var(--nav-height);
}

.hero__pattern {
  position: absolute;
  inset: 0;
  background-image: url('../images/tups-rahvusmuster.webp');
  background-size: 400px;
  background-repeat: repeat;
  opacity: 0.22;
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  width: 100%;
}

.hero__text {
  flex: 1;
  max-width: 600px;
}

.hero__text h1 {
  color: var(--color-white);
  margin-bottom: 24px;
}

.hero__cta {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding-bottom: 2px;
}

.hero__cta:hover {
  color: var(--color-white);
  border-bottom-color: rgba(255, 255, 255, 0.6);
}

.hero__cta span {
  font-size: 1.3rem;
}

.hero__image {
  flex: 0 0 auto;
  max-width: 400px;
}

.hero__image img {
  transform: rotate(-15deg);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.3));
  transition: transform 0.3s ease;
}

.hero__stripe {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(165deg, transparent 40%, var(--color-teal) 40%, var(--color-green) 70%);
  z-index: 2;
}
```

- [ ] **Step 3: Verify in browser**

Refresh `http://localhost:3000`. Should see full-height hero with blue gradient, folk pattern overlay at ~22% opacity, headline, CTA link, product image tilted, and the diagonal blue-to-green stripe at the bottom.

---

### Task 5: Products Section

**Files:**
- Modify: `index.html` — add products HTML after hero
- Modify: `css/style.css` — add product styles

- [ ] **Step 1: Add products HTML to index.html**

Insert after the closing `</section>` of the hero, replacing `<!-- Sections will be added in subsequent tasks -->`:

```html
  <!-- Products -->
  <section class="products" id="tooted">
    <div class="container">

      <div class="product product--img-left fade-in">
        <div class="product__image">
          <img src="images/toode-tups-arktika.webp" alt="TUPS Arktika kange">
        </div>
        <div class="product__text">
          <h3>TUPS Arktika (kange)</h3>
          <p>TUPS Arktika (kange) nikotiinipadjad on Eestis toodetud! Arktika nimi viitab jahedusele ja seda TUPS Arktika ka pakub, kombineerides nii piparmünti, münti ja mentooli. Padjad on väga hea kvaliteediga ning tagavad parima kasutajakogemuse.</p>
          <p>TUPS Arktika (kange) sobib eelkõige kogenud ja igapäevasele nikotiinipatjade tarvitajale, kes hindab kvaliteeti, neutraalset maitset ja tugevat nikotiinikogust.</p>
          <p class="product__meta"><strong>Maitsed: Piparmünt, münt, mentool</strong></p>
          <p class="product__meta"><strong>Patju karbis: 21</strong></p>
        </div>
      </div>

      <div class="product product--img-right fade-in">
        <div class="product__text">
          <h3>TUPS Arktika (eriti kange)</h3>
          <p>TUPS Arktika (eriti kange) nikotiinipadjad on Eestis toodetud! Arktika nimi viitab jahedusele ja seda TUPS Arktika ka pakub, kombineerides nii piparmünti, münti ja mentooli. Padjad on väga hea kvaliteediga ning tagavad parima kasutajakogemuse.</p>
          <p>TUPS Arktika (eriti kange) sobib eelkõige väga kogenud ja igapäevasele nikotiinipatjade tarvitajale, kes hindab kvaliteeti, neutraalset maitset ja väga tugevat nikotiinikogust.</p>
          <p class="product__meta"><strong>Maitsed: Piparmünt, münt, mentool</strong></p>
          <p class="product__meta"><strong>Patju karbis: 21</strong></p>
        </div>
        <div class="product__image">
          <img src="images/tups-arktika-uli-kange.webp" alt="TUPS Arktika eriti kange">
        </div>
      </div>

      <div class="product product--img-left fade-in">
        <div class="product__image">
          <img src="images/tups-xtreme.png" alt="TUPS X-TREME">
        </div>
        <div class="product__text">
          <h3>TUPS X-TREME</h3>
          <p>TUPS X-TREME nikotiinipadjad on Eestis toodetud! Kombineerides piparmünti ja münti on maitse jahe aga magus. Padjad on väga hea kvaliteediga ning tagavad parima kasutajakogemuse.</p>
          <p class="product__meta"><strong>Maitsed: Piparmünt, münt, mentool</strong></p>
          <p class="product__meta"><strong>Patju karbis: 27</strong></p>
        </div>
      </div>

      <div class="product product--img-right fade-in">
        <div class="product__text">
          <h3>TUPS Black</h3>
          <p>TUPS Black nikotiinipadjad on Eestis toodetud! Kombineerides piparmünti ja münti on maitse jahe aga magus. Padjad on väga hea kvaliteediga ning tagavad parima kasutajakogemuse.</p>
          <p class="product__meta"><strong>Maitsed: Piparmünt, münt</strong></p>
          <p class="product__meta"><strong>Patju karbis: 20</strong></p>
        </div>
        <div class="product__image">
          <img src="images/tups-black.png" alt="TUPS Black">
        </div>
      </div>

    </div>
  </section>
```

- [ ] **Step 2: Add product styles to style.css**

Append to `css/style.css`:

```css
/* === Products === */
.products {
  background: var(--color-white);
}

.product {
  display: flex;
  align-items: center;
  gap: 60px;
  padding: 60px 0;
}

.product + .product {
  border-top: 1px solid #eee;
}

.product__image {
  flex: 0 0 360px;
}

.product__image img {
  max-width: 360px;
}

.product__text {
  flex: 1;
}

.product__text h3 {
  color: var(--color-dark-blue);
  margin-bottom: 16px;
}

.product__text p {
  margin-bottom: 12px;
  color: var(--color-text);
}

.product__meta {
  margin-top: 8px;
}

/* Zigzag: img-right reverses order */
.product--img-right {
  flex-direction: row-reverse;
}

/* Fade-in animation */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in--visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 3: Verify in browser**

Refresh page. Should see 4 products in alternating zigzag layout — image/text, text/image, image/text, text/image. Products won't animate yet (JS not added).

---

### Task 6: Distributors Section

**Files:**
- Modify: `index.html` — add distributors HTML after products
- Modify: `css/style.css` — add distributor styles

- [ ] **Step 1: Add distributors HTML to index.html**

Insert after the closing `</section>` of products:

```html
  <!-- Distributors -->
  <section class="distributors" id="edasimuujad">
    <div class="container">
      <h2>Edasimüüjad</h2>
      <div class="distributors__grid">
        <a href="https://www.alexela.ee" target="_blank" rel="noopener" class="distributors__item">
          <img src="images/distributors/alexela.webp" alt="Alexela">
        </a>
        <a href="https://www.superalko.ee" target="_blank" rel="noopener" class="distributors__item">
          <img src="images/distributors/superalko.webp" alt="Super Alko">
        </a>
        <a href="https://www.olerex.ee" target="_blank" rel="noopener" class="distributors__item">
          <img src="images/distributors/olerex.webp" alt="Olerex">
        </a>
        <a href="https://www.cityalko.ee" target="_blank" rel="noopener" class="distributors__item">
          <img src="images/distributors/city-alko.webp" alt="City Alko">
        </a>
        <a href="https://www.grossi.ee" target="_blank" rel="noopener" class="distributors__item">
          <img src="images/distributors/grossi.webp" alt="Grossi Toidukaubad">
        </a>
        <a href="https://www.rkiosk.ee" target="_blank" rel="noopener" class="distributors__item">
          <img src="images/distributors/rkiosk.webp" alt="R-Kiosk">
        </a>
        <a href="https://www.terminal.ee" target="_blank" rel="noopener" class="distributors__item">
          <img src="images/distributors/terminal.webp" alt="Terminal">
        </a>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add distributor styles to style.css**

Append to `css/style.css`:

```css
/* === Distributors === */
.distributors {
  background: var(--color-bg-light);
}

.distributors h2 {
  text-align: center;
  margin-bottom: 48px;
}

.distributors__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 40px;
}

.distributors__item {
  flex: 0 0 auto;
  max-width: 140px;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: filter 0.3s, opacity 0.3s;
}

.distributors__item:hover {
  filter: grayscale(0%);
  opacity: 1;
}

.distributors__item img {
  max-height: 60px;
  width: auto;
}
```

- [ ] **Step 3: Verify in browser**

Refresh page. Should see light gray section with 7 distributor logos in a row, grayscale by default, coloring on hover.

---

### Task 7: Contact Section + Google Maps Iframe

**Files:**
- Modify: `index.html` — add contact HTML after distributors
- Modify: `css/style.css` — add contact styles

- [ ] **Step 1: Add contact HTML to index.html**

Insert after the closing `</section>` of distributors:

```html
  <!-- Contact -->
  <section class="contact" id="kontakt">
    <div class="container">
      <h2>Kontakt</h2>
      <div class="contact__columns">
        <div class="contact__col">
          <h3>Tootja</h3>
          <p class="contact__company">Nano OÜ</p>
          <p>E-post: <a href="mailto:info@nanotech.ee">info@nanotech.ee</a></p>
          <p>Veeb: <a href="https://www.nanoest.com" target="_blank" rel="noopener">www.nanoest.com</a></p>
          <p>Aadress: Suur-Sõjamäe 31, 11415 Tallinn</p>
          <p>Reg. nr: 11382007</p>
          <p>KMKR: EE101528818</p>
        </div>
        <div class="contact__col">
          <h3>Edasimüüja</h3>
          <p class="contact__company">Nordista OÜ</p>
          <p>Tel: <a href="tel:+3727404444">+372 740 4444</a></p>
          <p>E-post: <a href="mailto:info@nordista.eu">info@nordista.eu</a></p>
          <p>Veeb: <a href="https://www.nordista.eu" target="_blank" rel="noopener">www.nordista.eu</a></p>
          <p>Aadress: Vinkli tn 2, 50411 Tartu</p>
          <p>Reg. nr: 12711752</p>
          <p>KMKR: EE102273421</p>
        </div>
      </div>
      <div class="contact__map">
        <iframe
          src="https://maps.google.com/maps?q=Suur-S%C3%B5jam%C3%A4e+31,+11415+Tallinn,+Estonia&t=&z=15&ie=UTF8&iwloc=&output=embed"
          width="100%"
          height="400"
          style="border:0;"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Nano OÜ asukoht kaardil">
        </iframe>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Add contact styles to style.css**

Append to `css/style.css`:

```css
/* === Contact === */
.contact h2 {
  text-align: center;
  margin-bottom: 48px;
}

.contact__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  margin-bottom: 48px;
}

.contact__col h3 {
  color: var(--color-dark-blue);
  margin-bottom: 12px;
}

.contact__company {
  font-weight: 600;
  font-size: 1.1rem;
  margin-bottom: 12px;
}

.contact__col p {
  margin-bottom: 6px;
  color: var(--color-text);
}

.contact__col a {
  color: var(--color-primary);
  transition: color 0.2s;
}

.contact__col a:hover {
  color: var(--color-dark-blue);
}

.contact__map {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.contact__map iframe {
  display: block;
}
```

- [ ] **Step 3: Verify in browser**

Refresh page. Should see two-column contact info with both companies, and a Google Maps iframe below. Verify the map loads and shows Tallinn area.

---

### Task 8: Footer

**Files:**
- Modify: `index.html` — add footer after contact
- Modify: `css/style.css` — add footer styles

- [ ] **Step 1: Add footer HTML to index.html**

Insert after the closing `</section>` of contact, before the `<script>` tag:

```html
  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p>&copy; 2026 TUPS. Kõik õigused kaitstud.</p>
    </div>
  </footer>
```

- [ ] **Step 2: Add footer styles to style.css**

Append to `css/style.css`:

```css
/* === Footer === */
.footer {
  background: var(--color-dark-blue);
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  padding: 24px 0;
  font-size: 0.85rem;
}
```

- [ ] **Step 3: Verify in browser**

Refresh page. Should see dark blue footer with white copyright text at the bottom.

---

### Task 9: JavaScript — Smooth Scroll, Mobile Nav, Scroll Animations

**Files:**
- Create: `js/main.js`

- [ ] **Step 1: Create main.js with all interactivity**

```javascript
(function () {
  'use strict';

  // --- Sticky nav background on scroll ---
  const nav = document.getElementById('nav');

  function updateNav() {
    if (window.scrollY > 50) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  // --- Mobile hamburger toggle ---
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('nav__links--open');
    hamburger.classList.toggle('nav__hamburger--open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Close mobile menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('nav__links--open');
      hamburger.classList.remove('nav__hamburger--open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // --- Fade-in on scroll (Intersection Observer) ---
  var fadeElements = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    fadeElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: just show everything
    fadeElements.forEach(function (el) {
      el.classList.add('fade-in--visible');
    });
  }
})();
```

- [ ] **Step 2: Verify in browser**

Refresh page. Test:
1. Scroll down — nav should gain a semi-transparent dark blue background
2. Products should fade in as they enter the viewport
3. Click nav links — should smooth scroll to sections
4. Resize browser to <768px — hamburger should appear (after responsive CSS is added in next task)

---

### Task 10: Responsive Styles — Tablet and Mobile

**Files:**
- Modify: `css/style.css` — add responsive media queries

- [ ] **Step 1: Add responsive styles to style.css**

Append to `css/style.css`:

```css
/* === Responsive: Tablet (768-1199px) === */
@media (max-width: 1199px) {
  .hero__content {
    gap: 30px;
  }

  .hero__image {
    max-width: 300px;
  }

  .product {
    gap: 40px;
  }

  .product__image {
    flex: 0 0 280px;
  }

  .product__image img {
    max-width: 280px;
  }
}

/* === Responsive: Mobile (<768px) === */
@media (max-width: 767px) {
  :root {
    --nav-height: 60px;
  }

  section {
    padding: 60px 0;
  }

  /* Mobile nav */
  .nav__hamburger {
    display: flex;
  }

  .nav__links {
    position: fixed;
    top: var(--nav-height);
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(44, 84, 144, 0.97);
    flex-direction: column;
    justify-content: center;
    gap: 32px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .nav__links--open {
    transform: translateX(0);
  }

  .nav__link {
    font-size: 1.2rem;
  }

  .nav__hamburger--open span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .nav__hamburger--open span:nth-child(2) {
    opacity: 0;
  }

  .nav__hamburger--open span:nth-child(3) {
    transform: rotate(-45deg) translate(5px, -5px);
  }

  /* Mobile hero */
  .hero {
    min-height: auto;
    padding: 120px 0 100px;
  }

  .hero__content {
    flex-direction: column;
    text-align: center;
  }

  .hero__image {
    max-width: 250px;
  }

  .hero__stripe {
    height: 50px;
  }

  /* Mobile products */
  .product,
  .product--img-right {
    flex-direction: column;
    gap: 24px;
    padding: 40px 0;
  }

  .product__image {
    flex: none;
    text-align: center;
  }

  .product__image img {
    max-width: 260px;
    margin: 0 auto;
  }

  /* Mobile distributors */
  .distributors__grid {
    gap: 24px;
  }

  .distributors__item {
    max-width: 100px;
  }

  /* Mobile contact */
  .contact__columns {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact__map iframe {
    height: 300px;
  }
}
```

- [ ] **Step 2: Verify in browser at multiple widths**

Test at:
- Desktop (1200px+): Full side-by-side layouts
- Tablet (900px): Slightly compressed but still side-by-side
- Mobile (375px): Stacked layout, hamburger nav, single-column products and contact

---

### Task 11: Final Visual Verification and Polish

**Files:**
- Possibly modify: `index.html`, `css/style.css` — minor tweaks

- [ ] **Step 1: Serve and do a full visual walkthrough**

```bash
npx serve . -l 3000
```

Open `http://localhost:3000` and check every section at desktop width:
1. Nav is sticky and transparent, gains background on scroll
2. Hero has folk pattern, gradient, headline, tilted product image, diagonal stripe
3. Products alternate zigzag, all text present, fade-in works
4. Distributors show 7 logos, grayscale → color on hover
5. Contact has two columns, map loads
6. Footer shows copyright

- [ ] **Step 2: Test mobile**

Open browser DevTools, toggle device mode (375px width):
1. Hamburger appears, menu slides in
2. Hero stacks vertically
3. Products stack vertically
4. Contact stacks to single column

- [ ] **Step 3: Fix any visual issues found**

Address any spacing, alignment, or layout issues discovered during the walkthrough. This is the polish pass.

---

## Summary

| Task | What it builds | Files |
|------|---------------|-------|
| 1 | Download all images from current site | `images/*` |
| 2 | CSS foundation — reset, custom properties, typography | `css/style.css` |
| 3 | HTML scaffold + sticky nav | `index.html`, `css/style.css` |
| 4 | Hero with folk pattern + diagonal stripe | `index.html`, `css/style.css` |
| 5 | Products section (4 products, zigzag layout) | `index.html`, `css/style.css` |
| 6 | Distributors section (7 logos, grayscale hover) | `index.html`, `css/style.css` |
| 7 | Contact section + Google Maps iframe | `index.html`, `css/style.css` |
| 8 | Footer | `index.html`, `css/style.css` |
| 9 | JavaScript — scroll, mobile nav, animations | `js/main.js` |
| 10 | Responsive styles — tablet + mobile | `css/style.css` |
| 11 | Final visual verification and polish | All files |
