// Page fade transitions + loader with selective hard reload on back/forward
(function () {
  const DOC = document;
  const BODY = DOC.body;
  let loader;

  const hardReloadPages = ["/login", "/dashboard", "/register", "/doctor_dashboard"];

  // --- Utility: add/remove classes ---
  const add = cls => BODY.classList.add(cls);
  const remove = cls => BODY.classList.remove(cls);

  // --- Ensure loader exists ---
  function ensureLoader() {
    if (!loader) {
      loader = DOC.createElement("div");
      loader.id = "page-loader-overlay";
      loader.className = "page-loader-overlay";
      loader.innerHTML = `
        <div class="page-loader-content">
          <div class="page-loader-ring"></div>
          <div class="page-loader-mark">🌿</div>
          <div class="page-loader-name">AyurCare</div>
        </div>`;
      DOC.documentElement.appendChild(loader);
    }
    return loader;
  }

  // --- Show / Hide loader ---
  function showLoader() {
    ensureLoader().classList.add("visible");
  }
  function hideLoader() {
    ensureLoader().classList.remove("visible");
  }

  // --- Page entry animation ---
  function reveal() {
    hideLoader();
    add("page-fade-enter");
    void BODY.offsetHeight; // force reflow
    add("page-fade-enter-active");
    setTimeout(() => {
      remove("page-fade-enter");
      remove("page-fade-enter-active");
    }, 420);
  }

  // --- Navigate with fade ---
  function navigateWithFade(url) {
    if (!url) return;
    add("is-transitioning");
    add("page-fade-exit");
    showLoader();
    setTimeout(() => {
      window.location.href = url;
    }, 280);
  }

  // --- Determine if link should be intercepted ---
  function shouldIntercept(anchor) {
    if (!anchor || !anchor.href) return false;
    const href = anchor.getAttribute("href") || "";
    const target = anchor.getAttribute("target");
    if (target === "_blank" || href.startsWith("#")) return false;
    try {
      const u = new URL(anchor.href, window.location.href);
      if (u.origin !== window.location.origin) return false;
    } catch {
      return false;
    }
    return true;
  }

  // --- Intercept link clicks ---
  function bindLinkIntercepts() {
    DOC.addEventListener("click", e => {
      const a = e.target.closest("a");
      if (!a) return;
      if (!shouldIntercept(a)) return;
      e.preventDefault();
      navigateWithFade(a.href);
    });
  }

  // --- Intercept form submissions ---
  function bindFormIntercepts() {
    DOC.addEventListener("submit", e => {
      const form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      if (form.hasAttribute("data-no-transition")) return;
      if (!form.checkValidity || form.checkValidity()) {
        e.preventDefault();
        add("is-transitioning");
        add("page-fade-exit");
        showLoader();
        setTimeout(() => form.submit(), 280);
      }
    });
  }

  // --- Expose API globally ---
  window.PageTransitions = {
    reveal,
    navigateWithFade,
    showLoader,
    hideLoader
  };

  // --- Initialization ---
  function init() {
    setTimeout(() => reveal(), 80);
    bindLinkIntercepts();
    bindFormIntercepts();
  }

  if (DOC.readyState === "loading") {
    DOC.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // --- Handle back/forward navigation ---
  window.addEventListener("popstate", () => {
    const path = window.location.pathname;
    if (hardReloadPages.includes(path)) {
      // Hard reload for specific pages to avoid stuck content
      window.location.reload();
    } else {
      // Normal page transition for other pages
      reveal();
    }
  });

  window.addEventListener("pageshow", e => {
    const path = window.location.pathname;
    if (e.persisted && hardReloadPages.includes(path)) {
      // bfcache restore on hard reload pages
      window.location.reload();
    }
  });

})();
