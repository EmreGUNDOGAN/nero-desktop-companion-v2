'use strict';
/* Local SVG components; currentColor follows the selected finance theme. */
(() => {
  const paths = {
    overview:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/>',
    transactions:'<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/>',
    accounts:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 15h4"/>',
    budgets:'<path d="M4 21V13h4v8M10 21V7h4v14M16 21V3h4v18"/>',
    plans:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18m-7 4 2 2 4-4"/>',
    reports:'<path d="M3 3v18h18M7 15l4-5 4 3 5-7"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 11h18M7 15h2m4 0h2m-8 3h2"/>',
    handbook:'<path d="m2 9 10-5 10 5-10 5-10-5Zm4 2v6c4 3 8 3 12 0v-6m4-2v8"/>',
    income:'<path d="M6 18 18 6M6 6h12v12"/>',
    expense:'<path d="M6 6l12 12M6 18h12V6"/>',
    transfer:'<path d="M3 7h18l-4-4M21 17H3l4 4"/>',
    northeast:'<path d="M6 18 18 6M6 6h12v12"/>',
    plus:'<path d="M12 4v16M4 12h16"/>',
    wallet:'<path d="M20 8V5H6a3 3 0 0 0 0 6h15v9H6a3 3 0 0 1-3-3V8m18 5h-5v4h5"/>',
    card:'<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M3 9h18M7 15h4"/>',
    bank:'<path d="m3 8 9-5 9 5H3Zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18"/>',
    category:'<path d="m4 4 8 0 9 9-8 8-9-9V4Z"/><circle cx="8" cy="8" r="1"/>',
    settings:'<path d="m10 3-1 3-3 1-3-1-1 4 3 2v3l-2 2 3 3 3-1 3 1 1 3 4-1v-3l3-2 3 1 1-4-3-2v-3l2-2-3-3-3 1-3-1-1-3Z" transform="translate(0 -1) scale(.95)"/><circle cx="12" cy="12" r="3"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>',
  };
  window.NeroFinanceIcons = Object.freeze({svg(name){return `<svg class="finance-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.category}</svg>`;}});
})();
