// Shared wardrobe renderer for Nero's full-character clothing illustrations.
// It keeps the approved clothing artwork, rebuilds it on Nero's canonical
// body.svg silhouette, and leaves the face empty for the live expression layers.
(() => {
  const cache = new Map();

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.alt = '';
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error(`Wardrobe image could not load: ${src}`));
      image.src = src;
    });
  }

  function collectComponents(mask, width, height) {
    const seen = new Uint8Array(mask.length);
    const components = [];
    const stack = [];
    for (let start = 0; start < mask.length; start += 1) {
      if (!mask[start] || seen[start]) continue;
      let area = 0, minX = width, maxX = -1, minY = height, maxY = -1, sumX = 0, sumY = 0;
      const pixels = [];
      stack.push(start);
      seen[start] = 1;
      while (stack.length) {
        const i = stack.pop();
        const x = i % width;
        const y = Math.floor(i / width);
        pixels.push(i);
        area += 1; sumX += x; sumY += y;
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
        if (x > 0) { const q = i - 1; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
        if (x + 1 < width) { const q = i + 1; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
        if (y > 0) { const q = i - width; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
        if (y + 1 < height) { const q = i + width; if (mask[q] && !seen[q]) { seen[q] = 1; stack.push(q); } }
      }
      components.push({
        area, pixels, minX, maxX, minY, maxY,
        width: maxX - minX + 1, height: maxY - minY + 1,
        cx: sumX / area, cy: sumY / area
      });
    }
    return components;
  }

  function dilate(mask, width, height, radius) {
    if (radius <= 0) return new Uint8Array(mask);
    const horizontal = new Uint8Array(mask.length);
    const out = new Uint8Array(mask.length);
    for (let y = 0; y < height; y += 1) {
      let count = 0;
      for (let x = -radius; x < width + radius; x += 1) {
        const addX = x + radius;
        const remX = x - radius - 1;
        if (addX >= 0 && addX < width && mask[y * width + addX]) count += 1;
        if (remX >= 0 && remX < width && mask[y * width + remX]) count -= 1;
        if (x >= 0 && x < width && count > 0) horizontal[y * width + x] = 1;
      }
    }
    for (let x = 0; x < width; x += 1) {
      let count = 0;
      for (let y = -radius; y < height + radius; y += 1) {
        const addY = y + radius;
        const remY = y - radius - 1;
        if (addY >= 0 && addY < height && horizontal[addY * width + x]) count += 1;
        if (remY >= 0 && remY < height && horizontal[remY * width + x]) count -= 1;
        if (y >= 0 && y < height && count > 0) out[y * width + x] = 1;
      }
    }
    return out;
  }

  function medianChannel(data, pixels, channel) {
    const hist = new Uint32Array(256);
    for (const p of pixels) hist[data[p * 4 + channel]] += 1;
    const target = Math.floor(pixels.length / 2);
    let sum = 0;
    for (let i = 0; i < 256; i += 1) {
      sum += hist[i];
      if (sum > target) return i;
    }
    return 0;
  }

  function sourceCanvas(image) {
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth || image.width || 220;
    canvas.height = image.naturalHeight || image.height || 260;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  function extractGarmentAndHeadwear(source) {
    const width = source.width;
    const height = source.height;
    const sourceCtx = source.getContext('2d', { willReadFrequently: true });
    const frame = sourceCtx.getImageData(0, 0, width, height);
    const data = frame.data;
    const count = width * height;

    const green = new Uint8Array(count);
    for (let p = 0; p < count; p += 1) {
      const o = p * 4;
      const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      if (a > 100 && r > 130 && g > 145 && b > 120 && g >= r - 5 && g >= b - 5 && spread < 90) green[p] = 1;
    }
    const head = collectComponents(green, width, height)
      .filter((c) => c.area > 900 && Math.abs(c.cx - width / 2) < 40 && c.minY < height * 0.6)
      .sort((a, b) => b.area - a.area)[0];
    if (!head) throw new Error('Wardrobe head silhouette could not be detected');

    const headMask = new Uint8Array(count);
    for (const p of head.pixels) headMask[p] = 1;

    const outside = new Uint8Array(count);
    const stack = [];
    const pushOutside = (p) => {
      if (!headMask[p] && !outside[p]) { outside[p] = 1; stack.push(p); }
    };
    for (let x = 0; x < width; x += 1) {
      pushOutside(x);
      pushOutside((height - 1) * width + x);
    }
    for (let y = 0; y < height; y += 1) {
      pushOutside(y * width);
      pushOutside(y * width + width - 1);
    }
    while (stack.length) {
      const i = stack.pop();
      const x = i % width;
      const y = Math.floor(i / width);
      if (x > 0) pushOutside(i - 1);
      if (x + 1 < width) pushOutside(i + 1);
      if (y > 0) pushOutside(i - width);
      if (y + 1 < height) pushOutside(i + width);
    }
    const filledHead = new Uint8Array(count);
    for (let p = 0; p < count; p += 1) filledHead[p] = headMask[p] || !outside[p] ? 1 : 0;

    const skin = [
      medianChannel(data, head.pixels, 0),
      medianChannel(data, head.pixels, 1),
      medianChannel(data, head.pixels, 2)
    ];
    const skinLike = new Uint8Array(count);
    for (let p = 0; p < count; p += 1) {
      const o = p * 4;
      const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
      const spread = Math.max(r, g, b) - Math.min(r, g, b);
      const dr = r - skin[0], dg = g - skin[1], db = b - skin[2];
      const dist = Math.sqrt(dr * dr + dg * dg + db * db);
      if (a > 50 && dist < 50 && g >= r - 10 && g >= b - 14 && spread < 95) skinLike[p] = 1;
    }

    const limbMask = new Uint8Array(count);
    for (const component of collectComponents(skinLike, width, height)) {
      if (component.area < 25) continue;
      let overlap = 0;
      for (const p of component.pixels) if (headMask[p]) overlap += 1;
      if (overlap > component.area * 0.2) continue;
      if (component.cy > 165 && (component.cx < 85 || component.cx > 135 || component.cy > 220)) {
        for (const p of component.pixels) limbMask[p] = 1;
      }
    }

    const headwearMask = new Uint8Array(count);
    if (head.minY > 35) {
      const nonSkin = new Uint8Array(count);
      for (let y = 0; y < Math.min(height, 175); y += 1) {
        for (let x = 0; x < width; x += 1) {
          const p = y * width + x;
          if (data[p * 4 + 3] > 20 && !skinLike[p]) nonSkin[p] = 1;
        }
      }
      for (const component of collectComponents(nonSkin, width, height)) {
        if (component.area < 18 || component.minY >= head.minY + 10) continue;
        for (const p of component.pixels) headwearMask[p] = 1;
      }
      for (let y = head.minY + 11; y < Math.min(145, height); y += 1) {
        for (let x = 61; x < Math.min(160, width); x += 1) headwearMask[y * width + x] = 0;
      }
    }

    const remove = new Uint8Array(filledHead);
    for (let p = 0; p < count; p += 1) if (limbMask[p]) remove[p] = 1;

    const headDilated = dilate(filledHead, width, height, 6);
    const limbDilated = dilate(limbMask, width, height, 2);
    const protectSeed = new Uint8Array(count);
    for (let p = 0; p < count; p += 1) {
      const o = p * 4;
      const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
      const bright = (r + g + b) / 3;
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (a > 0 && !skinLike[p] && ((chroma > 30 && bright > 85) || bright > 200)) protectSeed[p] = 1;
    }
    const protect = dilate(protectSeed, width, height, 1);

    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        const p = y * width + x;
        const o = p * 4;
        if (headDilated[p] && y < 145 && data[o + 3] > 0) remove[p] = 1;
        const onHeadSide = ((x >= head.minX - 10 && x <= head.minX + 10) ||
          (x >= head.maxX - 10 && x <= head.maxX + 10)) && y < head.maxY + 10;
        const bright = (data[o] + data[o + 1] + data[o + 2]) / 3;
        if (onHeadSide && data[o + 3] > 0 && bright < 185) remove[p] = 1;
        if (x >= head.minX && x <= head.maxX && y >= head.minY && y < 132 && data[o + 3] > 0) remove[p] = 1;
        if (limbDilated[p] && data[o + 3] > 0 && bright < 165 && !protect[p]) remove[p] = 1;
      }
    }

    const garment = new ImageData(new Uint8ClampedArray(data), width, height);
    const headwear = new ImageData(new Uint8ClampedArray(data), width, height);
    for (let p = 0; p < count; p += 1) {
      if (remove[p]) garment.data[p * 4 + 3] = 0;
      if (!headwearMask[p]) headwear.data[p * 4 + 3] = 0;
    }
    return { garment, headwear };
  }

  function warpCollar(imageData, width, height) {
    const src = imageData.data;
    const out = new Uint8ClampedArray(src.length);
    const cx = (width - 1) / 2;
    for (let y = 0; y < height; y += 1) {
      let amplitude = 0;
      if (y >= 120 && y <= 190) {
        if (y <= 150) amplitude = 16 * (y - 120) / 30;
        else amplitude = 16 * (1 - (y - 150) / 40);
        if (amplitude < 0) amplitude = 0;
      }
      for (let x = 0; x < width; x += 1) {
        const absX = Math.abs(x - cx);
        const ratio = (absX - 55) / 24;
        const weight = Math.exp(-(ratio * ratio));
        const sign = x < cx ? -1 : (x > cx ? 1 : 0);
        const sourceX = x - amplitude * weight * sign;
        const x0 = Math.max(0, Math.min(width - 1, Math.floor(sourceX)));
        const x1 = Math.max(0, Math.min(width - 1, x0 + 1));
        const t = Math.max(0, Math.min(1, sourceX - x0));
        const dst = (y * width + x) * 4;
        const a = (y * width + x0) * 4;
        const b = (y * width + x1) * 4;
        for (let c = 0; c < 4; c += 1) out[dst + c] = Math.round(src[a + c] * (1 - t) + src[b + c] * t);
      }
    }
    return new ImageData(out, width, height);
  }

  async function build(outfitSrc, bodySrc) {
    const key = `${outfitSrc}|${bodySrc}`;
    if (cache.has(key)) return cache.get(key);
    const promise = Promise.all([loadImage(outfitSrc), loadImage(bodySrc)]).then(([outfit, body]) => {
      const source = sourceCanvas(outfit);
      const width = source.width;
      const height = source.height;
      const { garment, headwear } = extractGarmentAndHeadwear(source);
      const warpedGarment = warpCollar(garment, width, height);

      const garmentCanvas = document.createElement('canvas');
      garmentCanvas.width = width; garmentCanvas.height = height;
      garmentCanvas.getContext('2d').putImageData(warpedGarment, 0, 0);
      const headwearCanvas = document.createElement('canvas');
      headwearCanvas.width = width; headwearCanvas.height = height;
      headwearCanvas.getContext('2d').putImageData(headwear, 0, 0);

      const result = document.createElement('canvas');
      result.width = width; result.height = height;
      const ctx = result.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(body, 0, 0, width, height);
      ctx.drawImage(garmentCanvas, 0, 0);
      ctx.drawImage(headwearCanvas, 0, 0);
      return result.toDataURL('image/png');
    }).catch((error) => {
      cache.delete(key);
      throw error;
    });
    cache.set(key, promise);
    return promise;
  }

  async function renderInto(outfitSrc, bodySrc, target) {
    const src = await build(outfitSrc, bodySrc);
    const image = new Image();
    image.alt = '';
    image.draggable = false;
    image.src = src;
    target.replaceChildren(image);
    return image;
  }

  window.NeroWardrobeCanonical = Object.freeze({ build, renderInto });
})();