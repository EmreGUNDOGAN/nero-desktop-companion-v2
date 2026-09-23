// Moodboard SVG'sini Electron'ın gerçek Chromium renderer'ında PNG'ye dönüştürür.
// nativeImage SVG data URL'lerini bazı Windows/Electron sürümlerinde boş döndürebildiği için
// burada gizli/offscreen BrowserWindow + capturePage kullanılır.

const { BrowserWindow } = require('electron');

async function svgToPng(svg, { width = 1080, height = 900 } = {}) {
  const w = Math.max(1, Math.round(Number(width) || 1080));
  const h = Math.max(1, Math.round(Number(height) || 900));
  const win = new BrowserWindow({
    show: false,
    width: w,
    height: h,
    frame: false,
    transparent: false,
    resizable: false,
    webPreferences: {
      offscreen: true,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      backgroundThrottling: false
    }
  });

  try {
    const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<style>
  html, body { margin: 0; width: ${w}px; height: ${h}px; overflow: hidden; background: #fff; }
  svg { display: block; width: ${w}px; height: ${h}px; }
</style>
</head>
<body>${String(svg || '')}</body>
</html>`;

    await win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    await win.webContents.executeJavaScript(
      'document.fonts && document.fonts.ready ? document.fonts.ready.then(() => true) : true',
      true
    );
    // Offscreen compositorün ilk frame'i çizmesine fırsat ver.
    await new Promise((resolve) => setTimeout(resolve, 60));

    const image = await win.webContents.capturePage({ x: 0, y: 0, width: w, height: h });
    if (!image || image.isEmpty()) throw new Error('Moodboard capturePage boş görüntü döndürdü.');
    const png = image.toPNG();
    if (!png || png.length < 100 || png[0] !== 0x89 || png.toString('ascii', 1, 4) !== 'PNG') {
      throw new Error('Moodboard PNG çıktısı geçersiz.');
    }
    return png;
  } finally {
    if (!win.isDestroyed()) win.destroy();
  }
}

module.exports = { svgToPng };
