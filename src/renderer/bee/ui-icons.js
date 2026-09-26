// Nero Arıcılık · özel simge seti (ui-v2) (24x24, 2px çizgi, yuvarlak uçlar; kahve çizgi + bal sarısı dolgu)
const S = '#6B4A2B', H = '#F2B33D', C = '#FFF6E0', G = '#7FB069';
const wrap = (body) => `<svg viewBox="0 0 24 24" fill="none" stroke="${S}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
export const ICONS = {
  coin: wrap(`<circle cx="12" cy="12" r="8.5" fill="${H}"/><circle cx="12" cy="12" r="5" stroke-width="1.6"/><path d="M12 9.5v5" stroke-width="1.6"/>`),
  jar: wrap(`<path d="M8 5h8v2.5c1.8.8 3 2.6 3 4.7V17a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3v-4.8c0-2.1 1.2-3.9 3-4.7Z" fill="${H}"/><path d="M7.5 5h9" /><path d="M5 13h14" stroke-width="1.6"/>`),
  book: wrap(`<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H11v16H5.5A1.5 1.5 0 0 1 4 18.5Z" fill="${C}"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H13v16h5.5a1.5 1.5 0 0 0 1.5-1.5Z" fill="${H}"/><path d="M6.5 8h2M6.5 11h2M15.5 8h2"/>`),
  hive: wrap(`<path d="M7 4h10l2 4H5Z" fill="${H}"/><rect x="4.5" y="8" width="15" height="5" rx="1.5" fill="${H}"/><rect x="5.5" y="13" width="13" height="7" rx="1.5" fill="${H}"/><path d="M10 17h4"/>`),
  trophy: wrap(`<path d="M8 4h8v5a4 4 0 0 1-8 0Z" fill="${H}"/><path d="M8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v3M9 20h6M10 16h4v4h-4Z"/>`),
  menu: wrap(`<path d="M5 7h14M5 12h14M5 17h14"/>`),
  camera: wrap(`<rect x="3.5" y="7" width="17" height="12" rx="2.5" fill="${C}"/><path d="M8.5 7l1.5-2.5h4L15.5 7"/><circle cx="12" cy="13" r="3.3" fill="${H}"/>`),
  stats: wrap(`<path d="M4 20h16"/><rect x="5.5" y="12" width="3" height="6" rx="1" fill="${G}"/><rect x="10.5" y="8" width="3" height="10" rx="1" fill="${H}"/><rect x="15.5" y="5" width="3" height="13" rx="1" fill="${G}"/>`),
  gear: wrap(`<circle cx="12" cy="12" r="3" fill="${H}"/><path d="M12 3.5v2.5M12 18v2.5M3.5 12H6M18 12h2.5M6 6l1.8 1.8M16.2 16.2 18 18M6 18l1.8-1.8M16.2 7.8 18 6"/><circle cx="12" cy="12" r="6"/>`),
  shop: wrap(`<path d="M4 9.5 5.5 5h13L20 9.5" fill="${C}"/><path d="M4 9.5c0 1.4 1.1 2.5 2.7 2.5S9.3 10.9 9.3 9.5c0 1.4 1.2 2.5 2.7 2.5s2.7-1.1 2.7-2.5c0 1.4 1.1 2.5 2.6 2.5S20 10.9 20 9.5" fill="${H}"/><path d="M5.5 12v8h13v-8M10 20v-4.5h4V20"/>`),
  market: wrap(`<path d="M7 8h10l1.5 11a1.8 1.8 0 0 1-1.8 2H7.3a1.8 1.8 0 0 1-1.8-2Z" fill="${H}"/><path d="M8 8c0-2.5 1.8-4.5 4-4.5s4 2 4 4.5"/><path d="M9.5 14c1 .8 4 .8 5 0"/>`),
  basket: wrap(`<path d="M3.5 10h17l-1.8 8.5a2 2 0 0 1-2 1.5H7.3a2 2 0 0 1-2-1.5Z" fill="${H}"/><path d="M8 10 11 4.5M16 10 13 4.5M9 13.5v3.5M12 13.5v3.5M15 13.5v3.5"/>`),
  scroll: wrap(`<path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H9" fill="${C}"/><path d="M7 4a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2ZM9 20a2 2 0 0 1-2-2V8" /><path d="M11 9h5M11 12.5h5M11 16h3" stroke="${H}"/>`),
  guide: wrap(`<path d="M12 6.5C10 5 7 4.5 4 5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V5c-3-.5-6 0-8 1.5Z" fill="${C}"/><path d="M12 6.5v13" /><path d="M14.5 9.5c1-.3 2.2-.4 3.5-.3" stroke="${H}"/>`),
  bell: wrap(`<path d="M6.5 16V11a5.5 5.5 0 0 1 11 0v5l1.5 2H5Z" fill="${H}"/><path d="M10 20.5a2 2 0 0 0 4 0"/>`),
  tasks: wrap(`<rect x="5" y="4.5" width="14" height="16" rx="2.5" fill="${C}"/><path d="M9 4.5h6v2.5H9Z" fill="${H}"/><path d="m8.5 12 1.5 1.5 2.5-3M14 12.5h2M8.5 17h7"/>`),
  plus: wrap(`<path d="M12 6v12M6 12h12"/>`),
  minus: wrap(`<path d="M6 12h12"/>`),
  target: wrap(`<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.3" fill="${H}"/><path d="M12 2.5V5M12 19v2.5M2.5 12H5M19 12h2.5"/>`),
  pause: wrap(`<path d="M9 6.5v11M15 6.5v11" stroke-width="2.6"/>`),
  flower: wrap(`<circle cx="12" cy="12" r="2.5" fill="${H}"/><circle cx="12" cy="6.5" r="2.6" fill="#F5B8C6"/><circle cx="17.2" cy="10.3" r="2.6" fill="#F5B8C6"/><circle cx="15.2" cy="16.4" r="2.6" fill="#F5B8C6"/><circle cx="8.8" cy="16.4" r="2.6" fill="#F5B8C6"/><circle cx="6.8" cy="10.3" r="2.6" fill="#F5B8C6"/><circle cx="12" cy="12" r="2.5" fill="${H}"/>`),
  leaf: wrap(`<path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14Z" fill="#E9822E"/><path d="M5 19 13 11"/>`),
  snow: wrap(`<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9.5 4.5 12 6.5l2.5-2M9.5 19.5 12 17.5l2.5 2" stroke="#6FA3D9"/>`),
  sun: wrap(`<circle cx="12" cy="12" r="4.2" fill="${H}"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4"/>`)
};

// Yardımcı: <span class="ico">…svg…</span>
export const icon = (name, cls = 'ico') => `<span class="${cls}">${ICONS[name] || ''}</span>`;
