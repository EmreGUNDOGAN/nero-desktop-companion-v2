'use strict';
(async () => {
  const { manifest, outfit, minutes } = await window.focusNotice.get();
  document.documentElement.dataset.skin = manifest.ui?.skin || "cozy";
  document.getElementById('duration').textContent = `${minutes} dakika tamamlandı`;
  const portrait = document.getElementById('portrait');
  const scale = Math.min(100 / manifest.canvas.width, 120 / manifest.canvas.height);
  const layers = {}, slots = {}, base = {};
  const expression = manifest.expressions.normal || {};
  let renderer;
  function draw() {
    for (const [name, variants] of Object.entries(layers)) {
      let wanted = expression[name];
      if (['body', 'eyes', 'pupils'].includes(name)) wanted = wanted || 'default';
      if (name === 'effects' || name === 'outfit') wanted = null;
      if (wanted && !variants[wanted]) wanted = Object.keys(variants)[0];
      for (const [variant, img] of Object.entries(variants)) img.classList.toggle('on', variant === wanted);
    }
  }
  for (const name of manifest.layerOrder) {
    const slot = document.createElement('div'); slot.className = 'character-layer-slot'; portrait.append(slot);
    const variants = {};
    for (const [variant, spec] of Object.entries(manifest.layers[name] || {})) {
      const img = new Image(); img.className = 'layer'; img.alt = '';
      Object.assign(img.style, { left: `${spec.x * scale}px`, top: `${spec.y * scale}px`, width: `${spec.w * scale}px`, height: `${spec.h * scale}px` });
      img.src = spec.url; variants[variant] = img; slot.append(img);
    }
    layers[name] = variants;
    if (['body','eyes','pupils','lids','brows','mouth'].includes(name)) { slots[name] = slot; base[name] = variants; }
  }
  renderer = new window.NeroWardrobeRenderer({ catalog: manifest.wardrobe, scale, slots, base, changed(bundle) { Object.assign(layers, bundle); draw(); } });
  draw(); renderer.select(outfit);
  document.querySelectorAll('button').forEach(b => b.addEventListener('click', () => window.focusNotice.close()));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.focusNotice.close(); });
})();
