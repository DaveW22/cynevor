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
});