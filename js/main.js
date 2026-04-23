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

  // --- Seller Locations Map ---
  var ALL_PRODUCTS = ['arktika', 'arktika-eriti-kange', 'xtreme', 'black'];

  var PRODUCT_LABELS = {
    'arktika': 'Arktika',
    'arktika-eriti-kange': 'Arktika eriti kange',
    'xtreme': 'X-TREME',
    'black': 'Black'
  };

  // Google Sheets published CSV URL — replace SHEET_ID with your sheet's ID
  // To get this URL: File → Share → Publish to web → Sheet1 → CSV → Publish
  var SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1LcnkW2Ke73EhaRKInpGiN1NZDmD_WcqHMSpcg995yKg/export?format=csv';

  // Fallback to local JSON if Sheets URL is not configured
  var useSheets = SHEETS_CSV_URL.indexOf('docs.google.com') !== -1;

  function parseCSV(text) {
    var lines = text.split('\n');
    var stores = [];
    // Skip header row
    for (var i = 1; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      var fields = parseCSVLine(line);
      if (fields.length < 5) continue;

      var name = fields[0].trim();
      var chain = fields[1] ? fields[1].trim() : '';
      var address = fields[2] ? fields[2].trim() : '';
      var lat = parseFloat(fields[3]);
      var lng = parseFloat(fields[4]);

      if (!name || isNaN(lat) || isNaN(lng)) continue;

      // Product columns: indices 5-8 (Arktika, Arktika eriti kange, X-TREME, Black)
      var products = [];
      var productSlugs = ALL_PRODUCTS;
      for (var p = 0; p < productSlugs.length; p++) {
        var val = fields[5 + p] ? fields[5 + p].trim().toLowerCase() : '';
        if (val === 'x' || val === '1' || val === 'yes' || val === 'jah' || val === 'true') {
          products.push(productSlugs[p]);
        }
      }

      // If no products marked, default to all products
      if (products.length === 0) {
        products = ALL_PRODUCTS.slice();
      }

      stores.push({
        name: name,
        chain: chain,
        address: address,
        lat: lat,
        lng: lng,
        products: products
      });
    }
    return stores;
  }

  function parseCSVLine(line) {
    var fields = [];
    var current = '';
    var inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          fields.push(current);
          current = '';
        } else {
          current += ch;
        }
      }
    }
    fields.push(current);
    return fields;
  }

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

    function loadStores(stores) {
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
    }

    // Fetch store data from Google Sheets (CSV) or fall back to local JSON
    if (useSheets) {
      fetch(SHEETS_CSV_URL)
        .then(function (response) {
          if (!response.ok) throw new Error('Failed to load sheet');
          return response.text();
        })
        .then(function (csv) {
          loadStores(parseCSV(csv));
        })
        .catch(function (err) {
          console.warn('Seller map: Google Sheets failed, falling back to local data.', err);
          fetch('data/stores.json')
            .then(function (r) { return r.json(); })
            .then(loadStores);
        });
    } else {
      fetch('data/stores.json')
        .then(function (response) {
          if (!response.ok) throw new Error('Failed to load store data');
          return response.json();
        })
        .then(loadStores)
        .catch(function (err) {
          console.warn('Seller map: could not load store data.', err);
        });
    }
  }
})();
