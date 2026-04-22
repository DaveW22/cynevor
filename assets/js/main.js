document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.getElementById("site-nav");
  const dropdownItems = nav ? Array.from(nav.querySelectorAll(".nav-item--dropdown")) : [];

  const closeDropdowns = () => {
    dropdownItems.forEach((item) => {
      item.classList.remove("is-open");
      const trigger = item.querySelector(".nav-trigger");
      if (trigger) {
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  };

  if (menuButton && nav) {
    const setMenu = (isOpen) => {
      document.body.classList.toggle("nav-open", isOpen);
      menuButton.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) {
        closeDropdowns();
      }
    };

    menuButton.addEventListener("click", () => {
      const currentlyOpen = document.body.classList.contains("nav-open");
      setMenu(!currentlyOpen);
    });

    dropdownItems.forEach((item) => {
      const trigger = item.querySelector(".nav-trigger");
      if (!trigger) {
        return;
      }

      trigger.addEventListener("click", () => {
        const currentlyOpen = item.classList.contains("is-open");
        closeDropdowns();
        if (!currentlyOpen) {
          item.classList.add("is-open");
          trigger.setAttribute("aria-expanded", "true");
        }
      });
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeDropdowns();
        setMenu(false);
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeDropdowns();
        setMenu(false);
        menuButton.focus();
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!target.closest(".nav-wrap")) {
        closeDropdowns();
        if (document.body.classList.contains("nav-open")) {
          setMenu(false);
        }
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeDropdowns();
      }
    });
  }

  const yearSpan = document.querySelector("[data-year]");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  const servicesCatalog = document.getElementById("services-catalog");
  const trackerLinks = servicesCatalog
    ? Array.from(servicesCatalog.querySelectorAll(".services-tracker-link"))
    : [];
  const categorySections = servicesCatalog
    ? Array.from(servicesCatalog.querySelectorAll("[data-service-category]"))
    : [];
  const servicesTracker = servicesCatalog
    ? servicesCatalog.querySelector(".services-tracker")
    : null;

  if (servicesCatalog && servicesTracker && trackerLinks.length && categorySections.length) {
    const setTrackerProgress = () => {
      const firstSection = categorySections[0];
      const lastSection = categorySections[categorySections.length - 1];
      if (!firstSection || !lastSection) {
        return;
      }

      const viewportAnchor = window.scrollY + window.innerHeight * 0.3;
      const start = firstSection.offsetTop;
      const end = lastSection.offsetTop + lastSection.offsetHeight;
      const distance = Math.max(1, end - start);
      const progress = Math.max(0, Math.min(1, (viewportAnchor - start) / distance));
      servicesTracker.style.setProperty("--services-scroll-progress", progress.toFixed(3));
    };

    const activateTrackerLink = (id) => {
      trackerLinks.forEach((link) => {
        const isMatch = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isMatch);
        link.setAttribute("aria-current", isMatch ? "true" : "false");
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length) {
          activateTrackerLink(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.45, 0.7],
        rootMargin: "-18% 0px -52% 0px"
      }
    );

    categorySections.forEach((section) => observer.observe(section));
    activateTrackerLink(categorySections[0].id);
    setTrackerProgress();

    window.addEventListener("scroll", setTrackerProgress, { passive: true });
    window.addEventListener("resize", setTrackerProgress);
  }

  // ── Academy carousel ────────────────────────────────
  const carousel = document.querySelector(".academy-carousel");
  if (carousel) {
    const track   = carousel.querySelector(".academy-carousel-track");
    const slides  = Array.from(carousel.querySelectorAll(".academy-carousel-slide"));
    const dots    = Array.from(carousel.querySelectorAll(".academy-carousel-dot"));
    const prevBtn = carousel.querySelector(".academy-carousel-prev");
    const nextBtn = carousel.querySelector(".academy-carousel-next");

    if (!track || !slides.length || !dots.length || !prevBtn || !nextBtn) {
      return;
    }

    let current   = 0;
    let timer     = null;

    // Safari fallback: force carousel layering/visibility in JS in case
    // class-based CSS is not fully applied due caching or parser differences.
    const applySlideState = () => {
      slides.forEach((slide, index) => {
        const isActive = index === current;
        slide.style.position = "absolute";
        slide.style.top = "0";
        slide.style.left = "0";
        slide.style.width = "100%";
        slide.style.height = "100%";
        slide.style.opacity = isActive ? "1" : "0";
        slide.style.pointerEvents = isActive ? "auto" : "none";
      });
    };

    track.style.position = "relative";
    track.style.height = "100%";
    applySlideState();

    const goTo = (index) => {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (index + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
      applySlideState();
    };

    const advance = () => goTo(current + 1);

    const start = () => {
      clearInterval(timer);
      // 6 s visible + 1 s fade = each image is fully on-screen for 6 s
      timer = setInterval(advance, 7000);
    };

    // Manual navigation — resets the auto-advance so it doesn't
    // cut in immediately after the user navigates
    prevBtn.addEventListener("click", () => { goTo(current - 1); start(); });
    nextBtn.addEventListener("click", () => { goTo(current + 1); start(); });
    dots.forEach((dot) => {
      dot.addEventListener("click", () => {
        goTo(parseInt(dot.dataset.index, 10));
        start();
      });
    });

    start();

    // Pause while the tab is hidden, resume on return
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        start();
      }
    });
  }

  // ── Contact form ────────────────────────────────────
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    const successPanel = document.getElementById("form-success");

    // Field definitions: id suffix, validation function, error message
    const fields = [
      {
        id: "field-name",
        inputId: "contact-name",
        validate: (v) => v.trim().length >= 2,
        error: "Please enter your name."
      },
      {
        id: "field-email",
        inputId: "contact-email",
        validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
        error: "Please provide a valid email address."
      },
      {
        id: "field-enquiry-type",
        inputId: "contact-type",
        validate: (v) => v !== "",
        error: "Please select an enquiry type."
      },
      {
        id: "field-message",
        inputId: "contact-message",
        validate: (v) => v.trim().length >= 20,
        error: "Please tell us a little more about your enquiry."
      }
    ];

    const setFieldValidity = (field, isValid) => {
      const wrap = document.getElementById(field.id);
      if (!wrap) return;
      wrap.classList.toggle("is-invalid", !isValid);
    };

    // Live validation: clear error as soon as field becomes valid
    fields.forEach((field) => {
      const input = document.getElementById(field.inputId);
      if (!input) return;
      const eventType = input.tagName === "SELECT" ? "change" : "input";
      input.addEventListener(eventType, () => {
        if (field.validate(input.value)) {
          setFieldValidity(field, true);
        }
      });
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // ── Honeypot check ──────────────────────────────
      const trap = contactForm.querySelector('[name="trap"]');
      if (trap && trap.value !== "") {
        // Bot detected — silently discard
        return;
      }

      // ── Validate required fields ────────────────────
      let isFormValid = true;
      let firstInvalidInput = null;

      fields.forEach((field) => {
        const input = document.getElementById(field.inputId);
        if (!input) return;
        const valid = field.validate(input.value);
        setFieldValidity(field, valid);
        if (!valid) {
          isFormValid = false;
          if (!firstInvalidInput) firstInvalidInput = input;
        }
      });

      if (!isFormValid) {
        if (firstInvalidInput) firstInvalidInput.focus();
        return;
      }

      // ── Submit ──────────────────────────────────────
      //
      // BACKEND INTEGRATION POINT
      // ─────────────────────────
      // Replace the block below with a real fetch() call once a backend
      // endpoint is available.
      //
      // Example (Formspree):
      //   const data = new FormData(contactForm);
      //   fetch("https://formspree.io/f/YOUR_FORM_ID", {
      //     method: "POST",
      //     body: data,
      //     headers: { Accept: "application/json" }
      //   })
      //     .then((res) => { if (res.ok) showSuccess(); else showError(); })
      //     .catch(() => showError());
      //
      // Example (Netlify Forms — no JS needed; just ensure data-netlify="true"):
      //   const data = new FormData(contactForm);
      //   fetch("/", { method: "POST", body: data })
      //     .then(() => showSuccess())
      //     .catch(() => showError());
      //
      // Until a backend is connected, we show the success state directly.

      showSuccess();
    });

    const showSuccess = () => {
      contactForm.style.display = "none";
      if (successPanel) {
        successPanel.classList.add("is-visible");
        successPanel.focus();
      }
      // Scroll the success message into view smoothly
      if (successPanel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        successPanel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    };
  }
});