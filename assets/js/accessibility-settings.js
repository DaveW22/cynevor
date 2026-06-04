(function applySavedAccessibilitySettings() {
  const STORAGE_KEY = "cynevorAccessibilitySettings";
  const root = document.documentElement;

  const defaults = {
    textSize: "default",
    contrast: "default",
    motion: "system",
    readingWidth: "default",
    spacing: "default",
    linkStyle: "default"
  };

  const allowedValues = {
    textSize: ["default", "large", "x-large"],
    contrast: ["default", "high", "soft"],
    motion: ["system", "reduced"],
    readingWidth: ["default", "comfortable"],
    spacing: ["default", "increased"],
    linkStyle: ["default", "underline"]
  };

  const attrMap = {
    textSize: "data-text-size",
    contrast: "data-contrast",
    motion: "data-motion",
    readingWidth: "data-reading-width",
    spacing: "data-spacing",
    linkStyle: "data-link-style"
  };

  const shouldRemoveAttribute = (key, value) => {
    if (value === undefined || value === null || value === "") {
      return true;
    }

    if (key === "motion") {
      return value === "system";
    }

    return value === "default";
  };

  const applyToRoot = (settings) => {
    Object.keys(attrMap).forEach((key) => {
      const attr = attrMap[key];
      const value = settings[key];
      if (shouldRemoveAttribute(key, value)) {
        root.removeAttribute(attr);
      } else {
        root.setAttribute(attr, value);
      }
    });
  };

  const sanitizeSettings = (settings) => {
    const source = settings && typeof settings === "object" ? settings : {};
    return Object.keys(defaults).reduce((result, key) => {
      const value = source[key];
      result[key] = allowedValues[key].includes(value) ? value : defaults[key];
      return result;
    }, {});
  };

  const readStoredSettings = () => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...defaults };
      }
      const parsed = JSON.parse(raw);
      return sanitizeSettings(parsed);
    } catch (_error) {
      return { ...defaults };
    }
  };

  applyToRoot(readStoredSettings());
})();

document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "cynevorAccessibilitySettings";
  const root = document.documentElement;

  const defaults = {
    textSize: "default",
    contrast: "default",
    motion: "system",
    readingWidth: "default",
    spacing: "default",
    linkStyle: "default"
  };

  const allowedValues = {
    textSize: ["default", "large", "x-large"],
    contrast: ["default", "high", "soft"],
    motion: ["system", "reduced"],
    readingWidth: ["default", "comfortable"],
    spacing: ["default", "increased"],
    linkStyle: ["default", "underline"]
  };

  const attrMap = {
    textSize: "data-text-size",
    contrast: "data-contrast",
    motion: "data-motion",
    readingWidth: "data-reading-width",
    spacing: "data-spacing",
    linkStyle: "data-link-style"
  };

  const trigger = document.querySelector("[data-a11y-trigger]");
  const panel = document.querySelector("[data-a11y-panel]");
  const form = document.querySelector("[data-a11y-form]");
  const closeBtn = document.querySelector("[data-a11y-close]");
  const resetBtn = document.querySelector("[data-a11y-reset]");

  if (!trigger || !panel || !form) {
    return;
  }

  const canUseStorage = (() => {
    try {
      const probeKey = "__cynevor_a11y_probe__";
      window.localStorage.setItem(probeKey, "1");
      window.localStorage.removeItem(probeKey);
      return true;
    } catch (_error) {
      return false;
    }
  })();

  let sessionSettings = { ...defaults };

  const sanitizeSettings = (settings) => {
    const source = settings && typeof settings === "object" ? settings : {};
    return Object.keys(defaults).reduce((result, key) => {
      const value = source[key];
      result[key] = allowedValues[key].includes(value) ? value : defaults[key];
      return result;
    }, {});
  };

  const shouldRemoveAttribute = (key, value) => {
    if (value === undefined || value === null || value === "") {
      return true;
    }

    if (key === "motion") {
      return value === "system";
    }

    return value === "default";
  };

  const readStoredSettings = () => {
    if (!canUseStorage) {
      return { ...sessionSettings };
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return { ...defaults };
      }
      const parsed = JSON.parse(raw);
      return sanitizeSettings(parsed);
    } catch (_error) {
      return { ...defaults };
    }
  };

  const saveSettings = (settings) => {
    const safeSettings = sanitizeSettings(settings);
    sessionSettings = { ...safeSettings };
    if (!canUseStorage) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(safeSettings));
    } catch (_error) {
      // Ignore storage errors and keep session-only behavior.
    }
  };

  const clearSettings = () => {
    sessionSettings = { ...defaults };
    if (!canUseStorage) {
      return;
    }

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_error) {
      // Ignore storage errors.
    }
  };

  const applyToRoot = (settings) => {
    Object.keys(attrMap).forEach((key) => {
      const attr = attrMap[key];
      const value = settings[key];
      if (shouldRemoveAttribute(key, value)) {
        root.removeAttribute(attr);
      } else {
        root.setAttribute(attr, value);
      }
    });
  };

  const collectFromForm = () => {
    const data = new FormData(form);
    return sanitizeSettings({
      textSize: String(data.get("text-size") || defaults.textSize),
      contrast: String(data.get("contrast") || defaults.contrast),
      motion: String(data.get("motion") || defaults.motion),
      readingWidth: String(data.get("reading-width") || defaults.readingWidth),
      spacing: String(data.get("spacing") || defaults.spacing),
      linkStyle: String(data.get("link-style") || defaults.linkStyle)
    });
  };

  const syncForm = (settings) => {
    const safeSettings = sanitizeSettings(settings);
    const mapping = [
      ["text-size", safeSettings.textSize],
      ["contrast", safeSettings.contrast],
      ["motion", safeSettings.motion],
      ["reading-width", safeSettings.readingWidth],
      ["spacing", safeSettings.spacing],
      ["link-style", safeSettings.linkStyle]
    ];

    mapping.forEach(([name, value]) => {
      const control = form.elements.namedItem(name);
      if (control && "value" in control) {
        control.value = value;
      }
    });
  };

  const setPanelOpen = (open, returnFocusToTrigger) => {
    panel.hidden = !open;
    trigger.setAttribute("aria-expanded", String(open));

    if (open) {
      const firstControl = form.querySelector("input, button");
      if (firstControl) {
        firstControl.focus();
      }
    } else if (returnFocusToTrigger) {
      trigger.focus();
    }
  };

  trigger.addEventListener("click", () => {
    const isOpen = trigger.getAttribute("aria-expanded") === "true";
    setPanelOpen(!isOpen, false);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      setPanelOpen(false, true);
    });
  }

  form.addEventListener("change", () => {
    const settings = collectFromForm();
    applyToRoot(settings);
    saveSettings(settings);
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      clearSettings();
      applyToRoot(defaults);
      syncForm(defaults);
      setPanelOpen(false, true);
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && trigger.getAttribute("aria-expanded") === "true") {
      setPanelOpen(false, true);
    }
  });

  document.addEventListener("click", (event) => {
    if (trigger.getAttribute("aria-expanded") !== "true") {
      return;
    }

    const target = event.target;
    if (!target.closest("[data-a11y-panel]") && !target.closest("[data-a11y-trigger]")) {
      setPanelOpen(false, false);
    }
  });

  const initial = readStoredSettings();
  applyToRoot(initial);
  syncForm(initial);
  setPanelOpen(false, false);
});
