import * as THREE from '../vendor/three.module.min.js';
import { box, gable, mat, C } from '../evler/kit.js';

export function makeStorage(baseCap, fullness) {
  const stage = baseCap < 400 ? 0 : baseCap < 2500 ? 1 : 2;
  const t = Math.min(1, Math.max(0, baseCap / 10000));
  const width = [0.62, 0.78, 0.92][stage], depth = [0.52, 0.62, 0.75][stage];
  const h = [0.38, 0.5, 0.58][stage];
  const g = new THREE.Group();
  g.add(box(width, h, depth, stage === 2 ? 0xB8B1A4 : 0xB58B60, 0, h / 2, 0));
  for (let i = 0; i < 2 + stage; i++) {
    const x = -width / 2 + (i + 0.5) * width / (2 + stage);
    g.add(box(0.025, h, 0.03, stage === 2 ? 0x898275 : C.woodD, x, h / 2, depth / 2 + 0.01));
  }
  const roof = gable(width, depth, 0.22 + t * 0.12, stage === 2 ? 0x715E55 : 0x825634);
  roof.position.y = h; roof.userData.seasonalRoof = true; g.add(roof);
  g.add(box(0.19 + stage * 0.03, h * 0.57, 0.035, C.woodD, 0, h * 0.29, depth / 2 + 0.03));
  g.add(box(0.22 + stage * 0.04, 0.025, 0.045, C.woodL, 0, h * 0.6, depth / 2 + 0.04));
  if (stage > 0) for (let i = 0; i < stage; i++) g.add(box(0.12, 0.11, 0.13, C.woodL, width / 2 - 0.11, 0.055 + i * 0.1, depth / 2 + 0.12));
  if (fullness >= 0.9) for (let i = 0; i < 3; i++) g.add(box(0.13, 0.1, 0.13, i % 2 ? C.wood : C.woodL, -width / 2 + 0.08 + i * 0.1, 0.05, depth / 2 + 0.16));
  return g;
}
