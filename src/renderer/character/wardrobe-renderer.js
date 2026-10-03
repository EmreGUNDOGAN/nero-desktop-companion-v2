'use strict';
// Atomic outfit changes: retain the current complete character until every new layer loads.
// All layers stay inside char-inner, sharing the original breathing/dragging/peek animations.
class NeroWardrobeRenderer {
  constructor({ catalog, scale, slots, base, changed, makeImage = () => new Image() }) {
    Object.assign(this, { catalog: catalog || {}, scale, slots, base, changed, makeImage });
    this.selected = null; this.active = null; this.generation = 0; this.disposed = false;
  }
  select(id) {
    id = this.catalog[id] ? id : null;
    if (id === this.selected || this.disposed) return;
    this.selected = id;
    const generation = ++this.generation;
    if (!id) { this.install(this.base, null); return; }
    const layers = this.catalog[id].layers;
    const bundle = {};
    const pending = [];
    for (const [layer, variants] of Object.entries(layers)) {
      bundle[layer] = {};
      for (const [variant, url] of Object.entries(variants)) {
        const img = this.makeImage();
        img.crossOrigin = 'anonymous'; img.draggable = false; img.alt = '';
        img.className = `layer layer-${layer}`; img.dataset.variant = variant;
        Object.assign(img.style, { left:'0px', top:'0px', width:`${220*this.scale}px`, height:`${260*this.scale}px` });
        pending.push(new Promise((resolve,reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error(`Kıyafet katmanı yüklenemedi: ${url}`));
          img.src = url;
        }));
        bundle[layer][variant] = img;
      }
    }
    Promise.all(pending).then(() => {
      if (!this.disposed && generation === this.generation) this.install(bundle,id);
    }).catch(err => {
      if (!this.disposed && generation === this.generation) {
        console.error(err);
        this.install(this.base,null);
      }
    });
  }
  install(bundle,id) {
    for (const layer of Object.keys(this.base)) {
      const variants = bundle[layer] || {};
      this.slots[layer].replaceChildren(...Object.values(variants));
    }
    this.active = id;
    this.changed(bundle,id);
  }
  dispose() { this.disposed = true; ++this.generation; }
}
if (typeof module !== 'undefined' && module.exports) module.exports = NeroWardrobeRenderer;
else window.NeroWardrobeRenderer = NeroWardrobeRenderer;
