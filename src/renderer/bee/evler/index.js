// Köy evleri v2 · 78 yapının listesi ve kurucu
// buildHouse(n, resident) → THREE.Group (model + isim etiketi). resident: village-data kaydı ({ n, name, type })
import * as THREE from '../vendor/three.module.min.js';
import { nameLabel } from './kit.js';
import h1 from './01-ayse-teyze.js';
import h2 from './02-mehmet-usta.js';
import h3 from './03-kucuk-elif.js';
import h4 from './04-hacer-nine.js';
import h5 from './05-muhtar-riza.js';
import h6 from './06-bakkal.js';
import h7 from './07-cicekci-ezgi.js';
import h8 from './08-balikci-kemal.js';
import h9 from './09-firin.js';
import h10 from './10-ogretmen-selin.js';
import h11 from './11-doktor-asli.js';
import h12 from './12-pastane.js';
import h13 from './13-cay-bahcesi.js';
import h14 from './14-bal-dukk-ni.js';
import h15 from './15-postane.js';
import h16 from './16-arici-hasan.js';
import h17 from './17-ressam-deniz.js';
import h18 from './18-muhtarlik.js';
import h19 from './19-kahveci.js';
import h20 from './20-degirmenci-osman.js';
import h21 from './21-coban-yusuf.js';
import h22 from './22-okul.js';
import h23 from './23-terzi-gulsum.js';
import h24 from './24-postaci-murat.js';
import h25 from './25-kasabali-cem.js';
import h26 from './26-marangoz-ismail.js';
import h27 from './27-bahcivan-zehra.js';
import h28 from './28-kutuphane.js';
import h29 from './29-hemsire-canan.js';
import h30 from './30-mumcu.js';
import h31 from './31-kaptan-rustem.js';
import h32 from './32-muzisyen-efe.js';
import h33 from './33-meydan-cesmesi.js';
import h34 from './34-veteriner-klinigi.js';
import h35 from './35-asci-fatma.js';
import h36 from './36-fotografci-can.js';
import h37 from './37-dondurmaci.js';
import h38 from './38-yazar-melike.js';
import h39 from './39-bisikletci-tolga.js';
import h40 from './40-pazar-yeri.js';
import h41 from './41-seramikci-nazli.js';
import h42 from './42-genc-balikci-kerem.js';
import h43 from './43-eczaci-burak.js';
import h44 from './44-eczane.js';
import h45 from './45-sutcu-hatice.js';
import h46 from './46-dokumaci-sevim.js';
import h47 from './47-degirmen.js';
import h48 from './48-ciftci-recep.js';
import h49 from './49-saatci-nihat.js';
import h50 from './50-recelci.js';
import h51 from './51-kuafor-sule.js';
import h52 from './52-oduncu-bayram.js';
import h53 from './53-aricilar-dernegi.js';
import h54 from './54-botanikci-defne.js';
import h55 from './55-kavalci-mahmut-dede.js';
import h56 from './56-kumesci-emine.js';
import h57 from './57-marangoz-atolyesi.js';
import h58 from './58-gokbilimci-arda.js';
import h59 from './59-ebru-sanatcisi-pelin.js';
import h60 from './60-su-kulesi.js';
import h61 from './61-gezgin-umut.js';
import h62 from './62-hirdavatci-erol.js';
import h63 from './63-ikizler-ada-ve-ela.js';
import h64 from './64-saat-kulesi.js';
import h65 from './65-minik-bora.js';
import h66 from './66-simitci-hamdi.js';
import h67 from './67-lokumcu.js';
import h68 from './68-profesor-nevzat.js';
import h69 from './69-dans-hocasi-irmak.js';
import h70 from './70-calgi-kosku.js';
import h71 from './71-biyolog-sinem.js';
import h72 from './72-kerim-dede-ve-kedileri.js';
import h73 from './73-koy-serasi.js';
import h74 from './74-mimar-kaan.js';
import h75 from './75-yoruk-gulizar.js';
import h76 from './76-fener-kulesi.js';
import h77 from './77-muhabir-bige.js';
import h78 from './78-bal-muzesi.js';

export const HOUSES = { 1: h1, 2: h2, 3: h3, 4: h4, 5: h5, 6: h6, 7: h7, 8: h8, 9: h9, 10: h10, 11: h11, 12: h12, 13: h13, 14: h14, 15: h15, 16: h16, 17: h17, 18: h18, 19: h19, 20: h20, 21: h21, 22: h22, 23: h23, 24: h24, 25: h25, 26: h26, 27: h27, 28: h28, 29: h29, 30: h30, 31: h31, 32: h32, 33: h33, 34: h34, 35: h35, 36: h36, 37: h37, 38: h38, 39: h39, 40: h40, 41: h41, 42: h42, 43: h43, 44: h44, 45: h45, 46: h46, 47: h47, 48: h48, 49: h49, 50: h50, 51: h51, 52: h52, 53: h53, 54: h54, 55: h55, 56: h56, 57: h57, 58: h58, 59: h59, 60: h60, 61: h61, 62: h62, 63: h63, 64: h64, 65: h65, 66: h66, 67: h67, 68: h68, 69: h69, 70: h70, 71: h71, 72: h72, 73: h73, 74: h74, 75: h75, 76: h76, 77: h77, 78: h78 };

// ---------------------------------------------------------------------------
// Yapıyı kur: model + isim etiketi. resident = { n, name, type } (village-data.js kaydı)
// ---------------------------------------------------------------------------
export function buildHouse(n, resident, { label = true } = {}) {
  const b = HOUSES[n];
  if (!b) return null;
  const g = b();
  const anims = [];
  g.traverse((o) => { if (o !== g && o.userData && typeof o.userData.animate === 'function') anims.push(o.userData.animate); });
  const own = g.userData.animate;
  g.userData.animate = (t) => { if (own) own(t); anims.forEach((f) => f(t)); };
  if (label && resident) {
    const top = new THREE.Box3().setFromObject(g).max.y;
    const l = nameLabel(resident.name, resident.type);
    l.position.set(0, Math.min(top, 1.6) + 0.22, 0);
    g.add(l);
    g.userData.label = l;
  }
  return g;
}
