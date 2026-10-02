import * as THREE from '../vendor/three.module.min.js';
import { body, box, cyl, sph, grp, at, hangSign, smoke, C, mat } from '../evler/kit.js';

// 6.5.0 — Haritada daima görünen Arıcılık Atölyesi.
// Kilitliyken bina tamamlanmış ama sessiz/kapalı görünür; Mumcu geldikten sonra
// sıcak pencere detayları, ürün sandıkları ve baca dumanı ile canlanır.
export function makeWorkshopBuilding(active = false, level = 0) {
  const g = new THREE.Group();
  const wall = active ? 0xEED9B6 : 0xD5C4A8;
  const roof = active ? 0xA95732 : 0x7C6856;
  const trim = active ? C.woodD : 0x6F6255;

  const main = body({
    w: 1.02, d: 0.78, h: 0.62,
    wall, roof, roofH: 0.42,
    door: C.woodD, shutters: active ? 0x6F8F58 : 0x756D61,
    chimney: C.brick, trim,
    windows: [-0.28, 0.28]
  });
  g.add(main);

  // Ahşap işlik çerçevesi.
  for (const x of [-0.49, -0.16, 0.16, 0.49]) g.add(box(0.035, 0.61, 0.025, trim, x, 0.305, 0.405));
  g.add(box(1.0, 0.035, 0.025, trim, 0, 0.49, 0.407));

  // Ön sundurma / tezgâh.
  const bench = grp(
    box(0.48, 0.055, 0.16, C.woodL, 0, 0.24, 0),
    box(0.04, 0.24, 0.04, C.woodD, -0.18, 0.12, 0),
    box(0.04, 0.24, 0.04, C.woodD, 0.18, 0.12, 0)
  );
  at(bench, 0.2, 0, 0.53); g.add(bench);

  // Kavanozlar, balmumu blokları ve küçük işlik malzemeleri.
  const jarMat = mat(active ? 0xE2A63D : 0xA8946E, { transparent: true, opacity: active ? 0.9 : 0.55, roughness: 0.35 });
  for (let i = 0; i < 3; i++) {
    g.add(cyl(0.035, 0.032, 0.09, jarMat, 0.05 + i * 0.085, 0.33, 0.55, 8));
    g.add(cyl(0.038, 0.038, 0.014, C.woodL, 0.05 + i * 0.085, 0.382, 0.55, 8));
  }
  g.add(box(0.16, 0.07, 0.12, active ? C.honey : 0xB8A37A, -0.28, 0.035, 0.53));
  g.add(box(0.13, 0.06, 0.11, C.woodL, -0.43, 0.03, 0.5));

  // Arı/petek tabelası: kilitliyken de bina ne işe yarayacak belli olsun.
  g.add(hangSign('🐝', -0.39, 0.64, 0.43, 0, active ? '#FFE08A' : '#DDD2BC'));

  // Yandaki balmumu kazanı; aktif olunca sıcak bal rengi görünür.
  const pot = grp(
    cyl(0.12, 0.1, 0.16, active ? 0x6C6A63 : 0x77736C, 0, 0.08, 0, 10),
    cyl(0.075, 0.075, 0.035, active ? C.honey : 0x9B8C70, 0, 0.17, 0, 10)
  );
  at(pot, -0.48, 0, -0.12); g.add(pot);

  // Seviye ilerledikçe ufak dış detaylar; ana bina aynı kalır.
  if (level >= 2) {
    g.add(box(0.2, 0.12, 0.14, C.woodL, 0.48, 0.06, -0.22));
    g.add(sph(0.045, 0x8A5A34, 0.48, 0.16, -0.22, 7));
  }
  if (level >= 3) {
    const frame = grp(
      box(0.22, 0.025, 0.16, C.woodD, 0, 0.02, 0),
      box(0.025, 0.2, 0.025, C.woodD, -0.09, 0.11, 0),
      box(0.025, 0.2, 0.025, C.woodD, 0.09, 0.11, 0),
      box(0.18, 0.025, 0.025, C.woodD, 0, 0.2, 0)
    );
    at(frame, 0.46, 0, 0.25); g.add(frame);
  }

  if (active) g.add(smoke(0.25, 1.02, -0.13));
  else {
    // Kapalı tabela: oyuncu binanın henüz açılmadığını uzaktan da anlayabilir.
    const lock = grp(
      box(0.18, 0.14, 0.025, 0x8D7960, 0, 0.08, 0),
      cyl(0.045, 0.045, 0.035, 0xB89B61, 0, 0.17, 0, 10)
    );
    at(lock, 0, 0.22, 0.416); g.add(lock);
  }

  g.userData.seasonalBuilding = true;
  return g;
}
