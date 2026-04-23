# Seller Locations Map — Design Spec

## Overview

Add an interactive map of TUPS seller locations across Estonia to the website. The map replaces the simple distributor logos section with an expanded section that includes both logos and a filterable Leaflet map. Users can filter locations by product to find stores that carry specific TUPS products. The existing Google Maps iframe in the contact section is removed.

## Motivation

- The original tups.ee had a Google My Maps showing 100+ retail locations — this was lost in the static site migration
- Customers need to find where to buy specific TUPS products near them
- Different stores carry different products, so filtering is essential

## Tech Stack

- **Leaflet.js v1.9+** via CDN — open-source map library (~40KB)
- **Leaflet.markercluster** via CDN — groups nearby markers into numbered clusters (~8KB)
- **OpenStreetMap** tiles — free, no API key, no usage limits
- **Vanilla JavaScript** — consistent with existing site, no build tools
- **JSON data file** — store locations stored separately from code

## Data Structure

### `data/stores.json`

Flat array of store objects:

```json
[
  {
    "name": "R-Kiosk Kristiine",
    "chain": "R-Kiosk",
    "address": "Endla 45, Tallinn",
    "lat": 59.4270,
    "lng": 24.7136,
    "products": ["arktika", "arktika-eriti-kange", "xtreme", "black"]
  }
]
```

**Field definitions:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | yes | Display name of the store (e.g. "R-Kiosk Kristiine") |
| `chain` | string | yes | Parent chain name (e.g. "R-Kiosk", "Alexela", "Olerex") |
| `address` | string | yes | Street address for display and directions |
| `lat` | number | yes | Latitude coordinate |
| `lng` | number | yes | Longitude coordinate |
| `products` | string[] | yes | Array of product slugs available at this location |

**Product slugs:** `arktika`, `arktika-eriti-kange`, `xtreme`, `black`

**Initial data:** Ship with a handful of sample entries per chain (1-2 each) to validate the framework. Full location data will be populated incrementally by the client.

## Page Changes

### Expanded Edasimüüjad Section

The existing distributors section transforms into a two-part layout:

1. **Distributor logos** — existing logo row (grayscale → color hover), unchanged
2. **Horizontal divider** — subtle `<hr>` separating logos from map
3. **Subheading** — "Leia lähim müügikoht" (Find the nearest sales point)
4. **Product filter pills** — horizontal row of toggle buttons:
   - "Kõik tooted" (reset button — clears all selections)
   - "Arktika"
   - "Arktika eriti kange"
   - "X-TREME"
   - "Black"
5. **Location count** — "Kuvatakse X müügikohta" (Showing X locations)
6. **Leaflet map** — interactive map of Estonia with clustered markers

### Filter Pill Behavior

- **Multi-select:** Each product pill toggles independently on/off
- **No pills active** = show all locations (equivalent to "Kõik tooted")
- **"Kõik tooted" clicked** = deselect all product pills, show all locations
- **One or more products active** = show stores that carry **any** of the selected products (union logic)
- Active pills use filled blue style (`#4a7abf` background, white text)
- Inactive pills use outlined/light gray style
- Location count updates in real-time as filters change

### Map Configuration

- **Center:** Estonia (lat ~58.8, lng ~25.5)
- **Default zoom:** 7 (shows all of Estonia)
- **Height:** 500px desktop, 350px mobile
- **Width:** Full section width with border-radius matching site style (12px)
- **Tiles:** OpenStreetMap standard (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`)
- **Attribution:** Required OSM attribution in bottom-right corner

### Marker Clustering

- Nearby markers group into numbered circle clusters
- Clusters expand on click/zoom
- Cluster styling: blue circles matching the site's primary color palette
- Spiderfies on click when markers overlap at max zoom

### Marker Popup Content

When a user clicks a marker, a popup appears with:

1. **Store name** — bold, dark blue (`#2c5490`)
2. **Address** — gray text
3. **Product pills** — small blue pills showing which TUPS products are available
4. **Directions link** — "📍 Ava Google Maps →" opens `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}` in a new tab

### Contact Section

- **Remove** the Google Maps iframe (`<div class="contact__map">` and its contents)
- **Keep** all text content (Nano OÜ and Nordista OÜ details) unchanged

### Navigation

- Keep the existing "Edasimüüjad" nav link — it already anchors to `#edasimuujad` which is the section containing both logos and the map
- No additional nav link needed since the map is part of the same section
- The map sub-area gets an `id="muugikohad"` anchor for direct linking if needed later, but no nav entry for it now

## Files Changed/Added

| File | Action | Description |
|------|--------|-------------|
| `data/stores.json` | **New** | Store location data (JSON array) |
| `index.html` | **Edit** | Expand distributors section with map markup, add Leaflet/markercluster CDN links in `<head>`, remove contact map iframe, update nav |
| `css/style.css` | **Edit** | Add styles for map container, filter pills, location count, popup customization, divider |
| `js/main.js` | **Edit** | Add map initialization, data fetching, filtering logic, marker/popup rendering, cluster setup |

## CSS Additions

### Filter Pills

```
.map-filters         — flex container, gap 8px, wraps on mobile
.map-filter           — pill button base (border-radius 20px, padding 6px 16px)
.map-filter--active   — active state (#4a7abf bg, white text)
```

### Map Container

```
.sellers-map          — border-radius 12px, overflow hidden, box-shadow matching site style
.sellers-map__count   — small text showing filtered count
```

### Popup

Custom Leaflet popup styles to match site typography and colors. Product pills inside popup use smaller font size (11px).

## JavaScript Logic

### Initialization Flow

1. Page loads → fetch `data/stores.json`
2. Initialize Leaflet map centered on Estonia
3. Create MarkerClusterGroup
4. Create markers for all stores, add to cluster group
5. Add cluster group to map
6. Bind click handlers to filter pills
7. Display initial count

### Filtering Flow

1. User clicks product pill → toggle its active state
2. Collect all active product slugs
3. If none active (or "Kõik tooted" clicked), show all markers
4. Otherwise, filter stores where `store.products` includes any selected slug
5. Clear cluster group, re-add matching markers
6. Update count text

### Popup Rendering

Each marker gets a popup built from the store data:

```
<div class="store-popup">
  <strong class="store-popup__name">{name}</strong>
  <span class="store-popup__address">{address}</span>
  <div class="store-popup__products">{product pills}</div>
  <a class="store-popup__directions" href="..." target="_blank">📍 Ava Google Maps →</a>
</div>
```

## Responsive Behavior

- **Desktop (1200px+):** Map 500px tall, pills in single row
- **Tablet (768-1199px):** Map 400px tall, pills may wrap to second row
- **Mobile (<768px):** Map 350px tall, pills wrap freely, full-width layout

## Out of Scope

- Geolocation ("find stores near me") — can be added later
- Search by address/city — can be added later
- Store hours or phone numbers in popups
- Custom map tile styling
- Server-side data management / admin panel
