# Seller Locations Map — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an interactive Leaflet map to the distributors section showing filterable seller locations across Estonia, with multi-select product filtering and rich popups.

**Architecture:** Leaflet.js + OpenStreetMap tiles loaded via CDN, store data in a separate JSON file fetched at runtime, marker clustering via Leaflet.markercluster plugin. All vanilla JS, no build tools — consistent with existing site.

**Tech Stack:** Leaflet.js 1.9.4, Leaflet.markercluster 1.5.3, OpenStreetMap tiles, vanilla JS/CSS/HTML

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `data/stores.json` | **Create** | Sample store location data (1-2 per chain, 7 chains) |
| `index.html` | **Modify** | Add CDN links, expand distributors section, remove contact map |
| `css/style.css` | **Modify** | Filter pills, map container, popup, cluster, divider styles |
| `js/main.js` | **Modify** | Map init, data fetch, filtering, popup rendering |

---

### Task 1: Create sample store data

**Files:**
- Create: `data/stores.json`

- [ ] **Step 1: Create the data directory**

```bash
mkdir -p /Users/stevenmaasi/WebstormProjects/tups/data
```

- [ ] **Step 2: Create `data/stores.json` with sample entries**

Write 14 sample stores (2 per chain) with real Estonian coordinates, addresses, and varied product availability:

```json
[
  {
    "name": "Alexela Ülemiste",
    "chain": "Alexela",
    "address": "Suur-Sõjamäe 4, Tallinn",
    "lat": 59.4209,
    "lng": 24.7799,
    "products": ["arktika", "arktika-eriti-kange", "xtreme", "black"]
  },
  {
    "name": "Alexela Tartu mnt",
    "chain": "Alexela",
    "address": "Tartu mnt 101, Tallinn",
    "lat": 59.4195,
    "lng": 24.7870,
    "products": ["arktika", "xtreme"]
  },
  {
    "name": "Super Alko Rocca al Mare",
    "chain": "Super Alko",
    "address": "Paldiski mnt 102, Tallinn",
    "lat": 59.4268,
    "lng": 24.6548,
    "products": ["arktika", "arktika-eriti-kange", "xtreme", "black"]
  },
  {
    "name": "Super Alko Tartu Lõunakeskus",
    "chain": "Super Alko",
    "address": "Ringtee 75, Tartu",
    "lat": 58.3594,
    "lng": 26.6950,
    "products": ["arktika", "black"]
  },
  {
    "name": "Olerex Laagri",
    "chain": "Olerex",
    "address": "Pärnu mnt 232, Laagri",
    "lat": 59.3563,
    "lng": 24.6322,
    "products": ["arktika", "arktika-eriti-kange"]
  },
  {
    "name": "Olerex Pärnu",
    "chain": "Olerex",
    "address": "Riia mnt 131, Pärnu",
    "lat": 58.3706,
    "lng": 24.5136,
    "products": ["arktika", "xtreme", "black"]
  },
  {
    "name": "City Alko Viru Keskus",
    "chain": "City Alko",
    "address": "Viru väljak 4, Tallinn",
    "lat": 59.4364,
    "lng": 24.7536,
    "products": ["arktika", "arktika-eriti-kange", "xtreme", "black"]
  },
  {
    "name": "City Alko Narva",
    "chain": "City Alko",
    "address": "Tallinna mnt 41, Narva",
    "lat": 59.3775,
    "lng": 28.1578,
    "products": ["arktika", "xtreme"]
  },
  {
    "name": "Grossi Toidukaubad Mustamäe",
    "chain": "Grossi Toidukaubad",
    "address": "Tammsaare tee 104a, Tallinn",
    "lat": 59.4067,
    "lng": 24.6741,
    "products": ["arktika", "arktika-eriti-kange", "black"]
  },
  {
    "name": "Grossi Toidukaubad Rakvere",
    "chain": "Grossi Toidukaubad",
    "address": "Laada 16, Rakvere",
    "lat": 59.3467,
    "lng": 26.3562,
    "products": ["arktika"]
  },
  {
    "name": "R-Kiosk Kristiine",
    "chain": "R-Kiosk",
    "address": "Endla 45, Tallinn",
    "lat": 59.4270,
    "lng": 24.7136,
    "products": ["arktika", "arktika-eriti-kange", "xtreme", "black"]
  },
  {
    "name": "R-Kiosk Viljandi",
    "chain": "R-Kiosk",
    "address": "Tallinna 23, Viljandi",
    "lat": 58.3639,
    "lng": 25.5897,
    "products": ["arktika", "xtreme"]
  },
  {
    "name": "Terminal Öismäe",
    "chain": "Terminal",
    "address": "Ehitajate tee 109, Tallinn",
    "lat": 59.4013,
    "lng": 24.6345,
    "products": ["arktika", "arktika-eriti-kange", "xtreme", "black"]
  },
  {
    "name": "Terminal Jõhvi",
    "chain": "Terminal",
    "address": "Narva mnt 8, Jõhvi",
    "lat": 59.3589,
    "lng": 27.4175,
    "products": ["arktika", "black"]
  }
]
```

- [ ] **Step 3: Verify JSON is valid**

```bash
python3 -c "import json; json.load(open('data/stores.json')); print('Valid JSON, ' + str(len(json.load(open('data/stores.json')))) + ' stores')"
```

Expected: `Valid JSON, 14 stores`

- [ ] **Step 4: Commit**

```bash
git add data/stores.json
git commit -m "feat: add sample store location data for seller map"
```

---

### Task 2: Add Leaflet CDN links to HTML head

**Files:**
- Modify: `index.html:8` (after the existing stylesheet link)

- [ ] **Step 1: Add Leaflet CSS and JS CDN links**

In `index.html`, after line 8 (`<link rel="stylesheet" href="css/style.css">`), add:

```html
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="">
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css" crossorigin="">
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css" crossorigin="">
```

- [ ] **Step 2: Add Leaflet JS before the closing `</body>` tag**

In `index.html`, before line 188 (`<script src="js/main.js"></script>`), add:

```html
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script src="https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js" crossorigin=""></script>
```

- [ ] **Step 3: Open `index.html` in browser, check DevTools console for no errors**

Open in browser. Check Network tab — Leaflet CSS and JS should load with 200 status. Console should show no errors.

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add Leaflet and markercluster CDN links"
```

---

### Task 3: Expand distributors section HTML with map markup

**Files:**
- Modify: `index.html:112-139` (distributors section)

- [ ] **Step 1: Replace the distributors section**

Replace the entire distributors section (lines 112-139) with the expanded version that includes logos, divider, filter pills, count, and map container:

```html
  <!-- Distributors + Seller Map -->
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

      <hr class="distributors__divider">

      <div class="sellers-map" id="muugikohad">
        <h3 class="sellers-map__title">Leia lähim müügikoht</h3>
        <div class="map-filters" id="mapFilters">
          <button class="map-filter map-filter--reset" data-filter="all">Kõik tooted</button>
          <button class="map-filter" data-filter="arktika">Arktika</button>
          <button class="map-filter" data-filter="arktika-eriti-kange">Arktika eriti kange</button>
          <button class="map-filter" data-filter="xtreme">X-TREME</button>
          <button class="map-filter" data-filter="black">Black</button>
        </div>
        <p class="sellers-map__count" id="mapCount"></p>
        <div class="sellers-map__container" id="sellersMap"></div>
      </div>
    </div>
  </section>
```

- [ ] **Step 2: Open in browser to verify structure renders**

Open `index.html`. The distributors section should show logos, then a divider, title, filter buttons (unstyled), empty count text, and an empty map container. No console errors.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: expand distributors section with map markup and filter pills"
```

---

### Task 4: Remove contact section Google Maps iframe

**Files:**
- Modify: `index.html` (contact section, the `<div class="contact__map">...</div>` block)

- [ ] **Step 1: Remove the contact map div**

Delete the entire `contact__map` div (the `<div class="contact__map">` through its closing `</div>`, which contains the iframe). This is the block that starts with `<div class="contact__map">` and ends with `</iframe>` + `</div>`.

After removal, the contact section should end with:

```html
      </div>
    </div>
  </section>
```

(The closing `</div>` for `contact__columns`, then `</div>` for `container`, then `</section>`.)

- [ ] **Step 2: Verify in browser**

Open `index.html`. The contact section should show only the two-column text (Tootja + Edasimüüja), no map iframe below.

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: remove Google Maps iframe from contact section"
```

---

### Task 5: Add CSS for map section

**Files:**
- Modify: `css/style.css` (add after the `.distributors__item img` block ending at line 351, before the `/* === Contact === */` comment at line 353)

- [ ] **Step 1: Add the divider, map container, filter pill, and popup styles**

Insert the following CSS block between the distributors styles and the contact styles (after line 351, before line 353):

```css
/* === Seller Map === */
.distributors__divider {
  border: none;
  border-top: 1px solid #ddd;
  margin: 48px 0;
}

.sellers-map__title {
  color: var(--color-dark-blue);
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.map-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.map-filter {
  background: #f0f0f0;
  color: var(--color-text);
  border: 1px solid #ddd;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
}

.map-filter:hover {
  border-color: var(--color-primary);
}

.map-filter--active {
  background: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.sellers-map__count {
  text-align: center;
  font-size: 0.85rem;
  color: #888;
  margin-bottom: 16px;
  min-height: 1.4em;
}

.sellers-map__container {
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Leaflet popup overrides */
.store-popup {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.4;
}

.store-popup__name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-dark-blue);
  margin-bottom: 2px;
}

.store-popup__address {
  display: block;
  font-size: 0.8rem;
  color: #666;
  margin-bottom: 8px;
}

.store-popup__products {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.store-popup__product {
  background: #e8f0f8;
  color: var(--color-dark-blue);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.store-popup__directions {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--color-primary);
  font-weight: 500;
}

.store-popup__directions:hover {
  color: var(--color-dark-blue);
}

/* Cluster overrides to match site blue palette */
.marker-cluster-small {
  background-color: rgba(74, 122, 191, 0.3);
}

.marker-cluster-small div {
  background-color: rgba(74, 122, 191, 0.7);
  color: var(--color-white);
}

.marker-cluster-medium {
  background-color: rgba(44, 84, 144, 0.3);
}

.marker-cluster-medium div {
  background-color: rgba(44, 84, 144, 0.7);
  color: var(--color-white);
}

.marker-cluster-large {
  background-color: rgba(30, 63, 110, 0.3);
}

.marker-cluster-large div {
  background-color: rgba(30, 63, 110, 0.7);
  color: var(--color-white);
}
```

- [ ] **Step 2: Add responsive styles for the map**

In the tablet media query (`@media (max-width: 1199px)`, currently ending around line 431), add before the closing `}`:

```css
  .sellers-map__container {
    height: 400px;
  }
```

In the mobile media query (`@media (max-width: 767px)`, currently ending around line 537), add before the closing `}`:

```css
  /* Mobile seller map */
  .sellers-map__container {
    height: 350px;
  }

  .distributors__divider {
    margin: 36px 0;
  }
```

- [ ] **Step 3: Also remove the now-unused `.contact__map` CSS rules**

Delete the `.contact__map` and `.contact__map iframe` rule blocks (lines 391-399 in the original file):

```css
.contact__map {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.contact__map iframe {
  display: block;
}
```

And delete the mobile `.contact__map iframe` rule in the mobile media query (lines 534-536 in the original file):

```css
  .contact__map iframe {
    height: 300px;
  }
```

- [ ] **Step 4: Open in browser and verify styling**

Open `index.html`. The distributors section should show:
- Logos row with grayscale effect
- A subtle gray divider line
- "Leia lähim müügikoht" heading (centered, dark blue)
- Filter pills (horizontal row of gray rounded buttons)
- Empty map container (500px tall, rounded corners, subtle shadow)

Contact section should show text only, no broken layout from removed CSS.

- [ ] **Step 5: Commit**

```bash
git add css/style.css
git commit -m "feat: add seller map, filter pill, popup, and cluster styles"
```

---

### Task 6: Add map initialization and data loading JavaScript

**Files:**
- Modify: `js/main.js` (add new code block inside the existing IIFE, after the Intersection Observer block ending at line 61)

- [ ] **Step 1: Add the product label mapping and map initialization code**

Insert the following code in `js/main.js` after the Intersection Observer block (after line 61, before the closing `})();` on line 62):

```javascript

  // --- Seller Locations Map ---
  var PRODUCT_LABELS = {
    'arktika': 'Arktika',
    'arktika-eriti-kange': 'Arktika eriti kange',
    'xtreme': 'X-TREME',
    'black': 'Black'
  };

  var mapContainer = document.getElementById('sellersMap');
  if (mapContainer && typeof L !== 'undefined') {
    var map = L.map('sellersMap', {
      center: [58.8, 25.5],
      zoom: 7,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18
    }).addTo(map);

    // Enable scroll zoom only after clicking the map (avoids hijacking page scroll)
    map.once('click', function () {
      map.scrollWheelZoom.enable();
    });

    var clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false
    });

    var allStores = [];
    var allMarkers = [];
    var activeFilters = [];

    function buildPopupHtml(store) {
      var productsHtml = store.products.map(function (slug) {
        return '<span class="store-popup__product">' + (PRODUCT_LABELS[slug] || slug) + '</span>';
      }).join('');

      var directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + store.lat + ',' + store.lng;

      return '<div class="store-popup">' +
        '<strong class="store-popup__name">' + store.name + '</strong>' +
        '<span class="store-popup__address">' + store.address + '</span>' +
        '<div class="store-popup__products">' + productsHtml + '</div>' +
        '<a class="store-popup__directions" href="' + directionsUrl + '" target="_blank" rel="noopener">\uD83D\uDCCD Ava Google Maps \u2192</a>' +
        '</div>';
    }

    function updateCount(count) {
      var countEl = document.getElementById('mapCount');
      if (countEl) {
        countEl.textContent = 'Kuvatakse ' + count + ' müügikohta';
      }
    }

    function applyFilters() {
      clusterGroup.clearLayers();
      var visibleCount = 0;

      allMarkers.forEach(function (item) {
        var show = false;
        if (activeFilters.length === 0) {
          show = true;
        } else {
          show = activeFilters.some(function (slug) {
            return item.store.products.indexOf(slug) !== -1;
          });
        }

        if (show) {
          clusterGroup.addLayer(item.marker);
          visibleCount++;
        }
      });

      updateCount(visibleCount);
    }

    function initFilters() {
      var filtersContainer = document.getElementById('mapFilters');
      if (!filtersContainer) return;

      filtersContainer.addEventListener('click', function (e) {
        var btn = e.target.closest('.map-filter');
        if (!btn) return;

        var filter = btn.getAttribute('data-filter');

        if (filter === 'all') {
          // Reset: clear all active filters
          activeFilters = [];
          filtersContainer.querySelectorAll('.map-filter').forEach(function (b) {
            b.classList.remove('map-filter--active');
          });
        } else {
          // Toggle this product filter
          var idx = activeFilters.indexOf(filter);
          if (idx === -1) {
            activeFilters.push(filter);
            btn.classList.add('map-filter--active');
          } else {
            activeFilters.splice(idx, 1);
            btn.classList.remove('map-filter--active');
          }

          // Remove active from "Kõik tooted" when a product is selected
          var resetBtn = filtersContainer.querySelector('.map-filter--reset');
          if (resetBtn) {
            resetBtn.classList.remove('map-filter--active');
          }
        }

        applyFilters();
      });
    }

    // Fetch store data and initialize markers
    fetch('data/stores.json')
      .then(function (response) {
        if (!response.ok) throw new Error('Failed to load store data');
        return response.json();
      })
      .then(function (stores) {
        allStores = stores;

        stores.forEach(function (store) {
          var marker = L.marker([store.lat, store.lng]);
          marker.bindPopup(buildPopupHtml(store), { maxWidth: 260 });
          allMarkers.push({ marker: marker, store: store });
          clusterGroup.addLayer(marker);
        });

        map.addLayer(clusterGroup);
        updateCount(stores.length);
        initFilters();
      })
      .catch(function (err) {
        console.warn('Seller map: could not load store data.', err);
      });
  }
```

- [ ] **Step 2: Serve locally and test the full map**

```bash
cd /Users/stevenmaasi/WebstormProjects/tups && npx serve . -l 3000
```

Open `http://localhost:3000` in the browser. Verify:
1. Map renders centered on Estonia with OpenStreetMap tiles
2. 14 blue markers appear (some clustered in Tallinn area)
3. Clicking a cluster zooms in and reveals individual markers
4. Clicking a marker shows popup with: name (bold, dark blue), address (gray), product pills (blue), "Ava Google Maps →" link
5. Clicking the directions link opens Google Maps in a new tab
6. Filter pills appear above the map
7. Clicking "Arktika" highlights it blue and shows all 14 stores (all have Arktika)
8. Clicking "Black" too shows stores that have Arktika OR Black
9. Clicking "Kõik tooted" resets all filters, shows all 14
10. Count text updates correctly (e.g. "Kuvatakse 14 müügikohta")
11. Scroll wheel doesn't zoom map until you click on it first
12. No console errors

- [ ] **Step 3: Test responsive behavior**

In DevTools, toggle mobile view (375px wide):
- Map height should be 350px
- Filter pills wrap to multiple rows
- Popups still readable
- Map is fully functional with touch interactions

- [ ] **Step 4: Commit**

```bash
git add js/main.js
git commit -m "feat: add seller map with Leaflet, clustering, filtering, and rich popups"
```

---

### Task 7: Final cleanup and verification

**Files:**
- Review: all modified files

- [ ] **Step 1: Verify the complete page flow**

Serve locally and walk through the full page:
1. Hero section — unchanged, working
2. Products section — unchanged, fade-in animations work
3. Distributors section — logos (grayscale → color hover), divider, "Leia lähim müügikoht" heading, filter pills, count, interactive map
4. Contact section — text only, no iframe, layout intact
5. Footer — unchanged

- [ ] **Step 2: Check mobile navigation**

Open hamburger menu on mobile. "Edasimüüjad" link should scroll to the section (which now includes the map).

- [ ] **Step 3: Validate HTML**

```bash
# Quick check for common HTML issues
python3 -c "
with open('index.html') as f:
    html = f.read()
print('DOCTYPE:', '<!DOCTYPE html>' in html)
print('Leaflet CSS:', 'leaflet.css' in html)
print('Leaflet JS:', 'leaflet.js' in html)
print('MarkerCluster JS:', 'leaflet.markercluster.js' in html)
print('sellersMap div:', 'id=\"sellersMap\"' in html)
print('mapFilters div:', 'id=\"mapFilters\"' in html)
print('No iframe:', 'iframe' not in html)
"
```

Expected: all True

- [ ] **Step 4: Commit final state (if any cleanup was needed)**

Only if changes were made in cleanup:

```bash
git add -A
git commit -m "chore: final cleanup for seller locations map"
```
