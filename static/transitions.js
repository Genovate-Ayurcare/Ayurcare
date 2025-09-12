// Page fade transitions across navigations
(function () {
  var DOC = document;
  var BODY = DOC.body;
  var loader;

  function add(cls) { BODY.classList.add(cls); }
  function remove(cls) { BODY.classList.remove(cls); }

  function ensureLoader() {
    loader = DOC.getElementById('page-loader-overlay');
    if (!loader) {
      loader = DOC.createElement('div');
      loader.id = 'page-loader-overlay';
      loader.className = 'page-loader-overlay';
      loader.innerHTML = '\n        <div class="page-loader-content">\n          <div class="page-loader-ring"></div>\n          <div class="page-loader-mark">🌿</div>\n          <div class="page-loader-name">AyurCare</div>\n        </div>\n      ';
      DOC.documentElement.appendChild(loader);
    }
    return loader;
  }

  function showLoader() {
    ensureLoader();
    loader.classList.add('visible');
  }

  function hideLoader() {
    if (ensureLoader()) loader.classList.remove('visible');
  }

  function reveal() {
    hideLoader();
    // Enter animation on load
    add('page-fade-enter');
    // Force reflow to ensure transition applies
    void BODY.offsetHeight;
    add('page-fade-enter-active');
    // Cleanup after animation
    setTimeout(function () {
      remove('page-fade-enter');
      remove('page-fade-enter-active');
    }, 420);
  }

  function navigateWithFade(url) {
    if (!url) return;
    // Exit animation
    add('is-transitioning');
    add('page-fade-exit');
    showLoader();
    setTimeout(function () {
      window.location.href = url;
    }, 280);
  }

  function shouldIntercept(anchor) {
    if (!anchor || !anchor.href) return false;
    // External links, targets and hash-only should not be intercepted
    var target = anchor.getAttribute('target');
    var href = anchor.getAttribute('href') || '';
    if (target === '_blank') return false;
    if (href.startsWith('#')) return false;
    // Different origin
    try {
      var u = new URL(anchor.href, window.location.href);
      if (u.origin !== window.location.origin) return false;
    } catch (_) { return false; }
    return true;
  }

  function bindLinkIntercepts() {
    DOC.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a) return;
      if (!shouldIntercept(a)) return;
      e.preventDefault();
      navigateWithFade(a.href);
    });
  }

  function bindFormIntercepts() {
    DOC.addEventListener('submit', function (e) {
      var form = e.target;
      if (!(form instanceof HTMLFormElement)) return;
      // Skip forms explicitly opting out (e.g., AJAX forms)
      if (form.hasAttribute('data-no-transition')) return;
      // Allow native validation first
      if (!form.checkValidity || form.checkValidity()) {
        e.preventDefault();
        // Prefer action attribute; fallback to current URL
        var action = form.getAttribute('action') || window.location.href;
        // Simulate brief exit then submit via normal navigation
        add('is-transitioning');
        add('page-fade-exit');
        showLoader();
        setTimeout(function () {
          // Create a temporary form to submit with same method and data
          form.submit();
        }, 280);
      }
    });
  }

  window.PageTransitions = {
    reveal: reveal,
    navigateWithFade: navigateWithFade,
    showLoader: showLoader,
    hideLoader: hideLoader
  };

  // Kick off on DOM ready
  if (DOC.readyState === 'loading') {
    DOC.addEventListener('DOMContentLoaded', function () {
      showLoader();
      // Hide loader after a tick and reveal content
      setTimeout(function(){ reveal(); }, 80);
      bindLinkIntercepts();
      bindFormIntercepts();
      injectGlobalThemeToggle();
    });
  } else {
    showLoader();
    setTimeout(function(){ reveal(); }, 80);
    bindLinkIntercepts();
    bindFormIntercepts();
    injectGlobalThemeToggle();
  }
})();

// Global theme toggle injected once per page
function injectGlobalThemeToggle(){
  if (document.getElementById('theme-toggle-global')) return;
  var btn = document.createElement('button');
  btn.id = 'theme-toggle-global';
  btn.className = 'theme-toggle-btn';
  btn.type = 'button';
  btn.title = 'Toggle theme';
  btn.setAttribute('aria-label', 'Toggle dark mode');
  btn.textContent = '🌗';
  // If a slot exists in navbar on this page, mount there; else fixed in body
  var slot = document.getElementById('theme-toggle-slot');
  if (slot) {
    slot.innerHTML = '';
    slot.appendChild(btn);
  } else {
    btn.style.position = 'fixed';
    btn.style.top = '14px';
    btn.style.right = '14px';
    document.body.appendChild(btn);
  }

  btn.addEventListener('click', function(){
    document.body.classList.toggle('dark-mode');
    try{ localStorage.setItem('ayur_theme_dark', document.body.classList.contains('dark-mode')); }catch(e){}
  });

  try{
    var pref = localStorage.getItem('ayur_theme_dark');
    if(pref==='true') document.body.classList.add('dark-mode');
  }catch(e){}
}


