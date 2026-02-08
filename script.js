(function () {
  'use strict';

  // Year in footer
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Theme: init from localStorage or system preference
  var html = document.documentElement;
  var themeKey = 'portfolio-theme';
  var saved = localStorage.getItem(themeKey);
  var themeMeta = document.querySelector('meta[name="theme-color"]');
  function applyTheme(next) {
    html.setAttribute('data-theme', next);
    localStorage.setItem(themeKey, next);
    if (themeMeta) {
      themeMeta.setAttribute('content', next === 'light' ? '#F6F8FA' : '#0B1214');
    }
  }
  if (saved === 'light' || saved === 'dark') {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  }

  var themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      var current = html.getAttribute('data-theme') || 'dark';
      var next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  // Mobile nav
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  function closeNav() {
    if (!navLinks || !navLinks.classList.contains('open')) return;
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        closeNav();
      });
    });
    document.addEventListener('click', function (event) {
      if (!navLinks.classList.contains('open')) return;
      if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) closeNav();
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });
  }

  // Header scroll state
  var header = document.querySelector('.header');
  function onScroll() {
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Profile photo: show fallback when image fails or missing
  function initProfilePhoto(wrap, imgClass) {
    var wrapEl = document.querySelector(wrap);
    if (!wrapEl) return;
    var img = wrapEl.querySelector(imgClass || '.profile-photo, .about-photo');
    if (!img || !img.src) return;
    img.addEventListener('load', function () {
      wrapEl.classList.add('profile-photo-loaded');
    });
    img.addEventListener('error', function () {
      this.classList.add('error');
    });
    if (img.complete && img.naturalWidth) wrapEl.classList.add('profile-photo-loaded');
  }
  initProfilePhoto('.profile-photo-wrap');
  initProfilePhoto('.about-photo-wrap');

  // Reveal on scroll
  var revealSelectors = [
    '.section-title',
    '.hero-inner-starter',
    '.stats-strip',
    '.about-grid',
    '.expertise-grid',
    '.products-grid',
    '.timeline-item',
    '.tech-grid',
    '.tech-languages',
    '.achievements-grid',
    '.contact-intro',
    '.contact-links'
  ];
  var revealEls = document.querySelectorAll(revealSelectors.join(', '));
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add('revealed');
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );
    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      if (el.classList.contains('timeline-item')) el.style.setProperty('--i', i);
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('revealed');
    });
  }
})();
