// Electron altında SVG -> nativeImage -> PNG akışının gerçek smoke testi.
const { app, nativeImage } = require('electron');
const { userMonth, renderMoodboardSvg } = require('../src/main/moodboard');

app.whenReady().then(() => {
  const key = '2026-09';
  const user = userMonth({ days: { '2026-09-01': 'green', '2026-09-02': 'yellow', '2026-09-03': 'red' } }, key, new Date(2026, 9, 1));
  const nero = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: `2026-09-${String(i + 1).padStart(2, '0')}`,
    cls: i % 5 === 0 ? 'c5' : null,
    label: i % 5 === 0 ? 'keyifli bir gündü' : null
  }));
  const svg = renderMoodboardSvg({ key, userDays: user, neroDays: nero });
  const image = nativeImage.createFromDataURL(`data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`);
  if (image.isEmpty()) throw new Error('SVG nativeImage olarak oluşturulamadı.');
  const png = image.toPNG();
  if (!png || png.length < 100 || png[0] !== 0x89 || png.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error('Moodboard PNG çıktısı geçersiz.');
  }
  console.log(`moodboard-electron-smoke: ok (${png.length} bytes)`);
  app.quit();
}).catch((err) => {
  console.error(err);
  process.exitCode = 1;
  app.quit();
});
