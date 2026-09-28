'use strict';
// Produces transparent, face-safe outfit layers at the exact native Nero canvas size.
const fs = require('fs');
const path = require('path');
const { ITEMS, SLEEP } = require('../src/main/wardrobe');
const palettes = {
  costume: ['#E9AE66','#B59BD4','#7FA9C2','#9D7DAA','#E7AC93','#B99670','#536FAD','#EBA57C'],
  daily: ['#7096B1','#DFB49D','#9DBD9B','#B69573','#C8A5AE','#D9CAA8','#7F9AB8','#E8BF86'],
  spring: ['#ADC99E','#C7AAD8','#DE9FAC','#D9BA8D','#A8B6DA','#95C6AE'],
  summer: ['#E4C875','#88B8C5','#DDAB78','#DF9B86','#8CB89E','#EAB19C'],
  autumn: ['#B7825D','#DAA56C','#B28376','#8DAD83','#9A7157','#C69B53'],
  winter: ['#A8BED0','#C3AFB8','#91ACC5','#DDD1BE','#A1B7C9','#AA767D'],
  sleep: ['#B9C6DF','#B6ACC9','#A9BED9','#B8CEBD','#B89B87','#A6B6D3','#C0AAB2','#88A5BE'],
  special: ['#E9A676','#C65D7E','#9CAE78','#E9B076','#DA8895','#C4656A','#A875B7','#DDA782']
};
const dark = '#4A3A36';
function motif(name, fill, index) {
  const x = 75 + (index % 3) * 32, y = 212;
  if (/yıldız|gece|gün batımı|yılbaşı|newyear/i.test(name)) return `<path d="M${x} ${y-10}l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" fill="${fill}"/>`;
  if (/çiçek|papatya|lale|bahar|kiraz|kelebek|valentine/i.test(name)) return `<g fill="${fill}"><circle cx="${x-7}" cy="${y}" r="5"/><circle cx="${x+7}" cy="${y}" r="5"/><circle cx="${x}" cy="${y-7}" r="5"/><circle cx="${x}" cy="${y+7}" r="5"/></g><circle cx="${x}" cy="${y}" r="4" fill="#E9B85D"/>`;
  if (/arı|bal|bee/i.test(name)) return `<ellipse cx="${x}" cy="${y}" rx="13" ry="8" fill="#F5CD61" stroke="${dark}" stroke-width="2"/><path d="M${x-4} ${y-6}v12m8-12v12" stroke="${dark}" stroke-width="3"/><path d="M${x-2} ${y-8}q-8-16-12-5m16-5q8-16 12-5" fill="#E4F0E7" stroke="${dark}" stroke-width="1.5"/>`;
  if (/kedi|halloween/i.test(name)) return `<path d="M${x-12} ${y+7}v-16l7 5 5-5 5 5 7-5v16z" fill="${fill}" stroke="${dark}" stroke-width="2"/><circle cx="${x-4}" cy="${y}" r="1.5"/><circle cx="${x+4}" cy="${y}" r="1.5"/>`;
  if (/kar|kış|buz|kutup|winter/i.test(name)) return `<path d="M${x-13} ${y}h26m-13-13v26m-9-22 18 18m0-18-18 18" stroke="${fill}" stroke-width="2.5" stroke-linecap="round"/>`;
  if (/yağmur|deniz|sahil|mavi/i.test(name)) return `<path d="M${x} ${y-12}q-11 16-11 20a11 11 0 0022 0q0-4-11-20z" fill="${fill}"/>`;
  if (/kakao|çikolata|kahve/i.test(name)) return `<path d="M${x-11} ${y-7}v15q11 8 22 0V${y-7}z m22 2q13-1 6 9l-6 2" fill="${fill}" stroke="${dark}" stroke-width="2"/>`;
  return `<path d="M${x} ${y-9}q9-6 10 3t-10 15q-12-9-10-15t10-3" fill="${fill}" opacity=".9"/>`;
}
function svg(name, group, index) {
  const colors = palettes[group], color = colors[index % colors.length];
  const trim = group === 'winter' ? '#F4EEE3' : group === 'sleep' ? '#F4EEE8' : '#FFF5E4';
  const coat = group === 'winter' || /ceket|hırka|trenç|pardösü|yelek|kapüşon|hoodie|yağmurluk/i.test(name);
  const hat = /şapka|bere|ponponlu uyku|gece mavisi|hasır/i.test(name) || ['special-birthday','special-newyear','special-halloween','special-bee','special-children'].includes(name);
  const sleeves = `<path d="M41 150Q16 168 26 194Q32 204 45 195L61 172Z M179 150Q204 168 194 194Q188 204 175 195L159 172Z" fill="${color}" stroke="${dark}" stroke-width="3.5"/><path d="M29 191q8 6 16 0m146 0q-8 6-16 0" fill="none" stroke="${trim}" stroke-width="4"/>`;
  const body = `<g clip-path="url(#body)"><path d="M29 185q81-9 162 0v67H29z" fill="${color}"/><path d="M42 188q68-9 136 0" fill="none" stroke="${dark}" stroke-width="3"/>${coat ? `<path d="M63 186l25-4 22 35 22-35 25 4-10 60H73z" fill="${color}" stroke="${dark}" stroke-width="2"/><path d="M89 184l21 28-12 12-20-38m53-2l-21 28 12 12 20-38" fill="${trim}" stroke="${dark}" stroke-width="1.8"/>` : `<path d="M93 185q17 19 34 0" fill="none" stroke="${trim}" stroke-width="7"/>`}${/çizgili|ekose|retro/i.test(name) ? `<path d="M42 208h136M42 225h136M56 184v58m103-58v58" stroke="${trim}" opacity=".65" stroke-width="4"/>` : ''}</g>`;
  const cap = hat ? `<path d="M58 52q-7-38 52-40 56 0 52 40-49-21-104 0z" fill="${color}" stroke="${dark}" stroke-width="3.5"/><path d="M58 51q52-22 104 0" fill="none" stroke="${trim}" stroke-width="6"/>${/ponpon|bere|gece mavisi|newyear|birthday/.test(name) ? `<circle cx="111" cy="11" r="7" fill="${trim}" stroke="${dark}" stroke-width="2"/>` : ''}` : '';
  const emblem = motif(name, trim, index);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><defs><clipPath id="body"><path d="M110 22C170 22 188 70 188 130C188 200 170 238 110 238C50 238 32 200 32 130C32 70 50 22 110 22z"/></clipPath></defs>${sleeves}${body}${emblem}<path d="M110 22C170 22 188 70 188 130C188 200 170 238 110 238C50 238 32 200 32 130C32 70 50 22 110 22z" fill="none" stroke="${dark}" stroke-width="4"/>${cap}</svg>`;
}
const entries = [...ITEMS, ...SLEEP.map((name, index) => ({ id: `sleep-${index}`, name, group: 'sleep' })), ...['birthday','newyear','valentine','april','children','bee','republic','halloween'].map((name, index) => ({ id: `special-${name}`, name, group: 'special', index }))];
for (const theme of fs.readdirSync(path.join(__dirname, '..', 'themes'))) {
  const dir = path.join(__dirname, '..', 'themes', theme);
  const themePath = path.join(dir, 'theme.json');
  if (!fs.existsSync(themePath)) continue;
  const info = JSON.parse(fs.readFileSync(themePath, 'utf8'));
  for (const [i, entry] of entries.entries()) {
    const filename = `outfit-${entry.id}.svg`;
    fs.writeFileSync(path.join(dir, 'assets', filename), svg(entry.id === 'special-bee' ? 'arı' : entry.name, entry.group, entry.index ?? i));
    info.layers.outfit[entry.id] = `assets/${filename}`;
  }
  fs.writeFileSync(themePath, JSON.stringify(info, null, 2) + '\n');
}
console.log(`Created ${entries.length} aligned wardrobe layers in every built-in theme`);
