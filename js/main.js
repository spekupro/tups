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
})();
