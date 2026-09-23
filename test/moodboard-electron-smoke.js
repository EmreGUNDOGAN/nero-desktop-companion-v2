// Electron altında gerçek Chromium renderer -> capturePage -> PNG akışının smoke testi.
const { app } = require('electron');
const { userMonth, renderMoodboardSvg } = require('../src/main/moodboard');
const { svgToPng } = require('../src/main/moodboard-image');

app.whenReady().then(async () => {
  const key = '2026-09';
  const user = userMonth(
    { days: { '2026-09-01': 'green', '2026-09-02': 'yellow', '2026-09-03': 'red' } },
    key,
    new Date(2026, 9, 1)
  );
  const nero = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    date: `2026-09-${String(i + 1).padStart(2, '0')}`,
    cls: i % 5 === 0 ? 'c5' : null,
    label: i % 5 === 0 ? 'keyifli bir gündü' : null
  }));

  const svg = renderMoodboardSvg({ key, userDays: user, neroDays: nero });
  const png = await svgToPng(svg, { width: 1080, height: 900 });
  if (!png || png.length < 100 || png[0] !== 0x89 || png.toString('ascii', 1, 4) !== 'PNG') {
    throw new Error('Moodboard PNG çıktısı geçersiz.');
  }
  console.log(`moodboard-electron-smoke: ok (${png.length} bytes)`);
  app.exit(0);
}).catch((err) => {
  console.error(err);
  app.exit(1);
});
