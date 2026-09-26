// Nero Arıcılık · Karakter figürleri (kodla çizilen 3D modeller, resim dosyası gerekmez)
// buildVillager({ skin, shirt, pants, hat, role }) ve buildNero() bir THREE.Group döndürür.
// Yürüme/animasyon için: group.userData.walk(t) ve group.userData.idle(t)
import * as THREE from './vendor/three.module.min.js';
const M = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.85, flatShading: true });
const mesh = (g, m, x = 0, y = 0, z = 0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = true; return o; };

// Meslek → kıyafet/şapka önayarları
export const ROLE_LOOKS = {
  koylu:     { shirt: 0x6FA3D9, pants: 0x4A3A22, hat: null },
  balikci:   { shirt: 0x3F7FBF, pants: 0x5A4A3A, hat: 'kasket', hatColor: 0x2E4B6B },
  firinci:   { shirt: 0xF6F1E7, pants: 0x8A7A5E, hat: 'asci', hatColor: 0xFFFFFF, apron: 0xFFFFFF },
  ciftci:    { shirt: 0xC94A3A, pants: 0x3F5E8A, hat: 'hasir', hatColor: 0xE8C86A },
  ogretmen:  { shirt: 0x9C7BD6, pants: 0x4A3A22, hat: null, hair: 0x5A3A22 },
  doktor:    { shirt: 0xFFFFFF, pants: 0x6FA3D9, hat: null },
  nine:      { shirt: 0xB95A42, pants: 0x6E4526, hat: 'basortu', hatColor: 0xE0626A },
  cocuk:     { shirt: 0xF2C94C, pants: 0x3F7FBF, hat: null, scale: 0.75 }
};

export function buildVillager(opts = {}) {
  const look = { ...ROLE_LOOKS[opts.role || 'koylu'], ...opts };
  const g = new THREE.Group();
  const skin = M(look.skin || 0xF2C9A0);
  const legs = [-0.035, 0.035].map((x) => mesh(new THREE.BoxGeometry(0.04, 0.12, 0.04), M(look.pants), x, 0.06, 0));
  const body = mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.16, 8), M(look.shirt), 0, 0.2, 0);
  const arms = [-0.08, 0.08].map((x) => mesh(new THREE.BoxGeometry(0.03, 0.12, 0.03), M(look.shirt), x, 0.2, 0));
  const head = mesh(new THREE.SphereGeometry(0.055, 10, 8), skin, 0, 0.33, 0);
  g.add(...legs, body, ...arms, head);
  const eyes = [-0.02, 0.02].map((x) => mesh(new THREE.SphereGeometry(0.008, 6, 4), M(0x2A2018), x, 0.34, 0.05));
  g.add(...eyes);
  if (look.apron) g.add(mesh(new THREE.BoxGeometry(0.1, 0.12, 0.01), M(look.apron), 0, 0.18, 0.068));
  if (look.hair) g.add(mesh(new THREE.SphereGeometry(0.058, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), M(look.hair), 0, 0.345, -0.005));
  const hc = M(look.hatColor || 0x6B4A2B);
  if (look.hat === 'hasir') g.add(mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.012, 14), hc, 0, 0.375, 0), mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.04, 10), hc, 0, 0.395, 0));
  if (look.hat === 'kasket') g.add(mesh(new THREE.SphereGeometry(0.06, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), hc, 0, 0.35, 0), mesh(new THREE.BoxGeometry(0.07, 0.008, 0.05), hc, 0, 0.36, 0.05));
  if (look.hat === 'asci') g.add(mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.08, 10), hc, 0, 0.41, 0));
  if (look.hat === 'basortu') g.add(mesh(new THREE.SphereGeometry(0.062, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.62), hc, 0, 0.335, -0.005));
  // Elde taşınan kavanoz (teslimatta gösterilir)
  const jar = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.045, 8), M(0xF2B33D), 0.09, 0.15, 0.03);
  jar.visible = false;
  g.add(jar);
  g.scale.setScalar(look.scale || 1);
  g.userData.jar = jar;
  g.userData.walk = (stride) => {
    const s = Math.sin(stride);
    legs[0].rotation.x += (s * 0.48 - legs[0].rotation.x) * 0.25;
    legs[1].rotation.x += (-s * 0.48 - legs[1].rotation.x) * 0.25;
    arms[0].rotation.x += (-s * 0.35 - arms[0].rotation.x) * 0.25;
    arms[1].rotation.x += (s * 0.35 - arms[1].rotation.x) * 0.25;
    body.position.y = 0.2 + Math.abs(s) * 0.007;
    head.rotation.y *= 0.88;
  };
  g.userData.idle = (t) => {
    legs.forEach((l) => { l.rotation.x *= 0.84; });
    arms.forEach((a) => { a.rotation.x *= 0.84; });
    body.position.y += (0.2 - body.position.y) * 0.2;
    head.rotation.y += (Math.sin(t * 0.7) * 0.14 - head.rotation.y) * 0.09;
  };
  return g;
}

// Adadaki Nero: mevcut oval, yarı uykulu karakterin düşük poligonlu 3D karşılığı.
export function buildNero() {
  const g = new THREE.Group();
  const green = M(0xB8C5B1);
  const body = mesh(new THREE.SphereGeometry(0.16, 16, 12), green, 0, 0.24, 0);
  body.scale.set(1.16, 0.96, 0.95);
  const feet = [-0.06, 0.06].map((x) => { const f = mesh(new THREE.SphereGeometry(0.045, 10, 6), M(0xA3B899), x, 0.03, 0.02); f.scale.set(1.2, 0.5, 1.4); return f; });
  const eyeW = M(0xFFFBF4), pupilM = M(0x4A3A36);
  const eyes = [-0.05, 0.05].map((x) => { const e = mesh(new THREE.SphereGeometry(0.034, 12, 10), eyeW, x, 0.295, 0.145); e.scale.set(1, 0.52, 0.6); return e; });
  const pupils = [-0.05, 0.05].map((x) => mesh(new THREE.SphereGeometry(0.012, 8, 6), pupilM, x, 0.287, 0.164));
  const lids = [-0.05, 0.05].map((x) => mesh(new THREE.BoxGeometry(0.071, 0.014, 0.018), green, x, 0.308, 0.167));
  const brows = [-0.05, 0.05].map((x, i) => { const b = mesh(new THREE.BoxGeometry(0.043, 0.009, 0.01), pupilM, x, 0.333, 0.15); b.rotation.z = i ? -0.13 : 0.13; return b; });
  const mouth = mesh(new THREE.BoxGeometry(0.05, 0.008, 0.01), pupilM, 0, 0.22, 0.15);
  g.add(body, ...feet, ...eyes, ...pupils, ...lids, ...brows, mouth);
  g.userData.walk = (stride) => { const s = Math.sin(stride); feet[0].position.z += (0.02 + s * 0.03 - feet[0].position.z) * 0.25; feet[1].position.z += (0.02 - s * 0.03 - feet[1].position.z) * 0.25; body.position.y = 0.24 + Math.abs(s) * 0.007; body.rotation.z = s * 0.025; };
  g.userData.idle = (t) => { body.position.y = 0.24 + Math.sin(t * 2) * 0.004; pupils.forEach((p, i) => { p.position.x = (i ? 0.05 : -0.05) + Math.sin(t * 0.5) * 0.006; }); };
  g.userData.sleep = (t) => { body.scale.y = 0.94 + Math.sin(t * 1.5) * 0.02; eyes.forEach((e) => { e.scale.y = 0.1; }); pupils.forEach((p) => { p.visible = false; }); };
  g.userData.wake = () => { eyes.forEach((e) => { e.scale.y = 0.52; }); pupils.forEach((p) => { p.visible = true; }); body.scale.y = 0.96; };
  return g;
}
