/* Cynevor Group – Main JavaScript */
(function () {
  'use strict';

  /* ---- Dynamic copyright year ---- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---- Mobile navigation toggle ---- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu   = document.getElementById('nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    /* Close menu when a link is clicked */
    navMenu.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener('click', function (e) {
      if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        navMenu.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---- Highlight active nav link on scroll ---- */
  const sections  = document.querySelectorAll('main section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  const navHeight = parseInt(
    getComputedStyle(document.documentElement).getPropertyValue('--nav-height'),
    10
  ) || 70;

  function setActiveLink() {
    let currentId = '';
    sections.forEach(function (section) {
      if (window.scrollY >= section.offsetTop - navHeight - 10) {
        currentId = section.id;
      }
    });
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', setActiveLink, { passive: true });
  setActiveLink();

  /* ---- Contact form (client-side validation & feedback) ---- */
  const form     = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');

  if (form && feedback) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      feedback.className = 'form-feedback';
      feedback.textContent = '';

      const name    = form.elements['name'].value.trim();
      const email   = form.elements['email'].value.trim();
      const message = form.elements['message'].value.trim();

      if (!name || !email || !message) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please fill in all required fields.';
        return;
      }

      /* Basic e-mail format check */
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        feedback.className = 'form-feedback error';
        feedback.textContent = 'Please enter a valid email address.';
        return;
      }

      /* Simulate submission (replace with real endpoint as needed) */
      feedback.className = 'form-feedback success';
      feedback.textContent = 'Thank you! Your message has been received. We\'ll be in touch shortly.';
      form.reset();
    });
  }

})();
