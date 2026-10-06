'use strict';
/* Small, local outline icons. No remote fonts, images or runtime dependencies. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.NeroFinanceIcons=factory();})(typeof window==='undefined'?globalThis:window,()=>{
  const paths={
    pie:'<path d="M12 3v9h9A9 9 0 0 0 12 3Z"/><path d="M8.8 3.6A9 9 0 1 0 20.4 15.2"/>',
    ledger:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    bank:'<path d="m3 8 9-5 9 5H3ZM5 11v7M10 11v7M14 11v7M19 11v7M3 21h18"/>',
    card:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18M7 15h4"/>',
    wallet:'<path d="M20 8V6a2 2 0 0 0-2-2H6a3 3 0 0 0 0 6h15v10H6a3 3 0 0 1-3-3V7"/><path d="M21 12h-5v4h5"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M9 15h6M12 12v6"/>',
    chart:'<rect x="3" y="13" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/>',
    academy:'<path d="m2 9 10-5 10 5-10 5-10-5ZM6 11v7c4 3 8 3 12 0v-7M22 9v8"/>',
    settings:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3H9Z"/><circle cx="12" cy="12" r="3"/>',
    help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5L12 12v1M12 17h.01"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    northeast:'<path d="M6 18 18 6M8 6h10v10"/>',
    up:'<path d="M12 20V4M6 10l6-6 6 6"/>',
    down:'<path d="M12 4v16M6 14l6 6 6-6"/>',
    transfer:'<path d="M3 8h17m-5-5 5 5-5 5M21 16H4m5-5-5 5 5 5"/>',
    basket:'<path d="m8 3-4 7M16 3l4 7M3 10h18l-3 10H6L3 10ZM9 14v3M15 14v3"/>',
    food:'<path d="M4 3v6a3 3 0 0 0 6 0V3M7 3v18M17 3v18M17 3c-3 3-3 8 0 9h3V3"/>',
    bus:'<rect x="5" y="3" width="14" height="16" rx="3"/><path d="M5 10h14M8 19v2M16 19v2M8 15h.01M16 15h.01M9 6h6"/>',
    home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-7h6v7"/>',
    health:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M9 5V3h6v2M12 10v6M9 13h6"/>',
    bag:'<path d="M5 8h14l1 13H4L5 8ZM9 8V6a3 3 0 0 1 6 0v2"/>',
    play:'<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
    book:'<path d="M12 6C8 3 5 3 3 4v15c3-1 6 0 9 2 3-2 6-3 9-2V4c-2-1-5-1-9 2ZM12 6v15"/>',
    folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Z"/>'
  };
  const categories=['basket','food','bus','home','health','bag','play','book','folder'];
  function icon(name){return `<svg class="finance-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]||paths.folder}</svg>`;}
  function category(id){const match=/^expense-(\d+)$/.exec(id);return icon(match?(categories[Number(match[1])]||'folder'):'folder');}
  return {icon,category};
});
