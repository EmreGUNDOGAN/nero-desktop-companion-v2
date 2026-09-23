const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const skins = ['latte','pazartesi','gece','disket','kasaba','yagmur','kar','cilek','mum','ege'];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ensure = (condition, message) => { if (!condition) throw new Error(message); };

app.whenReady().then(async () => {
  let win;
  try {
    win = new BrowserWindow({
      width: 480,
      height: 820,
      show: false,
      frame: false,
      transparent: true,
      webPreferences: {
        preload: path.join(__dirname, 'panel-integration-preload.js'),
        contextIsolation: true,
        sandbox: false,
        nodeIntegration: false
      }
    });
    await win.loadFile(path.join(__dirname, '../src/renderer/panel/index.html'));
    await wait(400);

    for (const skin of skins) {
      const result = await win.webContents.executeJavaScript(`
        (() => {
          document.documentElement.dataset.skin = ${JSON.stringify(skin)};
          document.querySelector('[data-tab="home"]').click();
          const cal = document.getElementById('user-mood-calendar');
          const days = [...cal.querySelectorAll('.mood-day')];
          const one = days.find(x => x.textContent.trim() === '1').getBoundingClientRect();
          const seven = days.find(x => x.textContent.trim() === '7').getBoundingClientRect();
          const rowDistance = Math.round((seven.top + seven.height / 2) - (one.top + one.height / 2));

          for (const picker of document.querySelectorAll('.mood-picker')) picker.hidden = true;
          const current = cal.querySelector('button.mood-day:not(:disabled)');
          current?.click();
          const labels = [...document.querySelectorAll('.mood-picker:not([hidden]) .mood-choice')].map(x => ({
            title:x.title,
            aria:x.getAttribute('aria-label')
          }));

          return {
            count:days.length,
            rowDistance,
            dayHeight:one.height,
            calWidth:cal.getBoundingClientRect().width,
            scrollWidth:cal.scrollWidth,
            labels
          };
        })()
      `);

      ensure(result.count === 30, `${skin}: Eylül 30 gün değil.`);
      ensure(result.rowDistance >= result.dayHeight * .95, `${skin}: moodboard satırları üst üste biniyor: ${JSON.stringify(result)}`);
      ensure(result.rowDistance <= result.dayHeight * 1.4, `${skin}: moodboard satırları hâlâ fazla açık: ${JSON.stringify(result)}`);
      ensure(result.scrollWidth <= result.calWidth + 2, `${skin}: moodboard yatay taşıyor.`);
      ensure(result.labels.map(x => x.title).join('|') === 'Muhteşem|İdare eder|Kötü',
        `${skin}: mood picker dili yanlış: ${JSON.stringify(result.labels)}`);
      ensure(result.labels.every(x => /olarak işaretle/.test(x.aria || '')),
        `${skin}: mood picker aria-label eksik.`);

      await win.webContents.executeJavaScript(`
        for (const picker of document.querySelectorAll('.mood-picker')) picker.hidden = true;
        true;
      `);
    }

    console.log('moodboard-checkpoint-c-electron-smoke: ok');
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (win && !win.isDestroyed()) win.destroy();
    app.quit();
  }
});
