const { app, BrowserWindow } = require('electron');
const path = require('node:path');

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const skins = ['latte','pazartesi','gece','disket','kasaba','yagmur','kar','cilek','mum','ege'];

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

app.whenReady().then(async () => {
  let win;
  const rendererErrors = [];
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

    win.webContents.on('console-message', (_event, level, message) => {
      if (level >= 3) rendererErrors.push(message);
    });

    await win.loadFile(path.join(__dirname, '../src/renderer/panel/index.html'));
    await wait(450);

    const init = await win.webContents.executeJavaScript(`
      (() => ({
        tab: document.documentElement.dataset.tab,
        version: document.getElementById('app-version')?.textContent,
        helpCount: document.querySelectorAll('.section-help').length,
        moodDays: document.querySelectorAll('#user-mood-calendar .mood-day').length,
        todoDuration: document.getElementById('todo-duration')?.value,
        bodyWidth: document.body.clientWidth
      }))()
    `);
    ensure(init.tab === 'home', 'Panel home sekmesinde açılmadı.');
    ensure(init.version === 'v4.3.0', '4.3.0 sürüm etiketi render edilmedi.');
    ensure(init.helpCount === 7, `Yardım ikonu sayısı 7 değil: ${init.helpCount}`);
    ensure(init.moodDays === 30, `Eylül moodboard 30 gün değil: ${init.moodDays}`);

    for (const skin of skins) {
      await win.webContents.executeJavaScript(`
        document.documentElement.dataset.skin = ${JSON.stringify(skin)};
        document.querySelector('[data-tab="home"]').click();
        true;
      `);
      await wait(90);

      const home = await win.webContents.executeJavaScript(`
        (() => {
          const shell = document.querySelector('.shell').getBoundingClientRect();
          const help = document.querySelector('.week .section-help');
          help.click();
          const tip = help.querySelector('.section-tooltip').getBoundingClientRect();
          const reset = document.getElementById('stats-reset');
          const dialogue = document.querySelector('.nero-says');
          const dialogueStyle = getComputedStyle(dialogue);
          const totals = document.querySelector('.totals').getBoundingClientRect();
          return {
            shell: { left: shell.left, right: shell.right, width: shell.width },
            tip: { left: tip.left, right: tip.right, width: tip.width, height: tip.height },
            resetVisible: reset.getBoundingClientRect().width > 0,
            totalsWidth: totals.width,
            dialogueAlign: dialogueStyle.alignItems,
            dialogueBgPos: dialogueStyle.backgroundPosition,
            scrollOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
          };
        })()
      `);

      ensure(home.resetVisible, `${skin}: reset ikonu görünmüyor.`);
      ensure(home.totalsWidth > 180, `${skin}: Şimdiye kadar kartı çökmüş.`);
      ensure(home.tip.width > 40 && home.tip.height > 20, `${skin}: yardım tooltip'i görünmüyor.`);
      ensure(home.tip.left >= home.shell.left - 2 && home.tip.right <= home.shell.right + 2, `${skin}: yardım tooltip'i yatayda shell dışına taşıyor.`);
      ensure(home.scrollOverflow <= 2, `${skin}: ana panel yatay overflow üretiyor: ${home.scrollOverflow}px`);

      if (['yagmur','kar','cilek','mum','ege'].includes(skin)) {
        ensure(/50%|center/.test(home.dialogueBgPos), `${skin}: konuşma ikonu dikey merkezde değil: ${home.dialogueBgPos}`);
      } else if (skin !== 'kasaba') {
        ensure(home.dialogueAlign === 'center', `${skin}: Nero konuşma içeriği dikey merkezde değil: ${home.dialogueAlign}`);
      }

      await win.webContents.executeJavaScript(`
        document.querySelector('.section-help.open')?.click();
        document.querySelector('[data-tab="todos"]').click();
        true;
      `);
      await wait(90);

      const todos = await win.webContents.executeJavaScript(`
        (() => {
          const targets = [
            ['todo-input', document.getElementById('todo-input')],
            ['todo-duration-control', document.querySelector('.todo-duration')],
            ['todo-time-control', document.querySelector('.todo-time')]
          ];
          const rects = targets.map(([id, el]) => {
            const r = el.getBoundingClientRect();
            return { id, left:r.left, right:r.right, top:r.top, bottom:r.bottom, width:r.width, height:r.height };
          });
          const durationInput = document.getElementById('todo-duration').getBoundingClientRect();
          const timeInput = document.getElementById('todo-time').getBoundingClientRect();
          const add = document.querySelector('#todo-form .add').getBoundingClientRect();
          const composer = document.getElementById('todo-form').getBoundingClientRect();
          const stamp = [...document.querySelectorAll('.todo-meta')].map((el) => el.textContent.trim()).join(' | ');
          return {
            rects,
            innerInputs:{
              duration:{width:durationInput.width,height:durationInput.height},
              time:{width:timeInput.width,height:timeInput.height}
            },
            add:{left:add.left,right:add.right,top:add.top,bottom:add.bottom,width:add.width,height:add.height},
            composer:{left:composer.left,right:composer.right,width:composer.width},
            stamp,
            stopwatchCount:document.querySelectorAll('.todo-stopwatch').length,
            overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth
          };
        })()
      `);

      ensure(todos.rects.every((r) => r.width > 70 && r.height >= 40), `${skin}: todo süre/hatırlatma kontrol yüzeylerinden biri görünmüyor: ${JSON.stringify(todos.rects)}`);
      ensure(todos.innerInputs.duration.width > 20 && todos.innerInputs.duration.height > 8, `${skin}: süre inputu kullanılamaz boyutta.`);
      ensure(todos.innerInputs.time.width > 35 && todos.innerInputs.time.height > 8, `${skin}: hatırlatma inputu kullanılamaz boyutta.`);
      ensure(todos.add.width > 20 && todos.add.height > 20, `${skin}: Ekle butonu görünmüyor.`);
      ensure(todos.stamp.includes('Plan: 1 sa 5 dk'), `${skin}: planlanan süre damgası eksik: ${todos.stamp}`);
      ensure(todos.stamp.includes('Gerçek: 1 sa 2 dk'), `${skin}: gerçek süre damgası eksik: ${todos.stamp}`);
      ensure(todos.stopwatchCount >= 2, `${skin}: görev kronometre kontrolleri render edilmedi.`);
      ensure(todos.overflow <= 2, `${skin}: İşler ekranı yatay overflow üretiyor: ${todos.overflow}px`);

      await win.webContents.executeJavaScript(`
        document.querySelector('[data-tab="home"]').click();
        true;
      `);
      await wait(60);
    }

    // Reset modalı iki adımlı olmalı ve onay gerçek IPC çağrısını yapmalı.
    await win.webContents.executeJavaScript(`
      document.documentElement.dataset.skin = 'kar';
      document.getElementById('stats-reset').click();
      true;
    `);
    await wait(60);
    const modalOpen = await win.webContents.executeJavaScript(`
      (() => {
        const modal = document.getElementById('stats-reset-modal');
        const r = modal.querySelector('.confirm-card').getBoundingClientRect();
        return { hidden: modal.hidden, w:r.width, h:r.height, title:document.getElementById('stats-reset-title').textContent };
      })()
    `);
    ensure(!modalOpen.hidden && modalOpen.w > 200 && modalOpen.h > 100, 'Stats reset modalı açılmadı.');
    ensure(/Yeni bir sayfa/.test(modalOpen.title), 'Stats reset Nero onay metni kayıp.');

    await win.webContents.executeJavaScript(`
      document.getElementById('stats-reset-confirm').click();
      true;
    `);
    await wait(80);
    const resetResult = await win.webContents.executeJavaScript(`
      (() => ({
        hidden: document.getElementById('stats-reset-modal').hidden,
        calls: window.nero.__getCalls().filter((x) => x.channel === 'stats:resetDisplay').length
      }))()
    `);
    ensure(resetResult.hidden, 'Reset onayından sonra modal kapanmadı.');
    ensure(resetResult.calls === 1, `stats:resetDisplay IPC çağrısı beklenen 1 değil: ${resetResult.calls}`);

    // Moodboard geçmişi yalnız dolu ayı göstermeli, geçmişte salt okunur olmalı.
    await win.webContents.executeJavaScript(`
      document.getElementById('mood-history-toggle').click();
      true;
    `);
    await wait(60);
    const history = await win.webContents.executeJavaScript(`
      (() => ({
        hidden: document.getElementById('mood-history-popover').hidden,
        months: [...document.querySelectorAll('.mood-history-month')].map((x) => x.dataset.monthKey),
        labels: [...document.querySelectorAll('.mood-history-month')].map((x) => x.textContent)
      }))()
    `);
    ensure(!history.hidden, 'Moodboard geçmiş popover açılmadı.');
    ensure(history.months.length === 2 && history.months.includes('2026-08') && history.months.includes('2026-09'), `Moodboard geçmiş ay filtresi hatalı: ${history.months.join(',')}`);

    await win.webContents.executeJavaScript(`
      document.querySelector('.mood-history-month[data-month-key="2026-08"]').click();
      true;
    `);
    await wait(90);
    const past = await win.webContents.executeJavaScript(`
      (() => ({
        month: document.getElementById('moodboard-month').textContent,
        userDays: document.querySelectorAll('#user-mood-calendar .mood-day').length,
        userButtons: document.querySelectorAll('#user-mood-calendar button.mood-day').length,
        hint: document.getElementById('user-mood-hint').textContent,
        currentVisible: !document.getElementById('moodboard-current').hidden
      }))()
    `);
    ensure(past.month === 'Ağustos 2026', `Geçmiş moodboard ayı yanlış: ${past.month}`);
    ensure(past.userDays === 31, `Ağustos 31 gün render edilmedi: ${past.userDays}`);
    ensure(past.userButtons === 0, 'Geçmiş user moodboard salt okunur değil.');
    ensure(/salt okunur/.test(past.hint), 'Geçmiş moodboard salt-okunur ipucu yok.');
    ensure(past.currentVisible, 'Geçmiş moodboardda Bugün kontrolü görünmüyor.');

    ensure(rendererErrors.length === 0, `Renderer console error bulundu: ${rendererErrors.join(' | ')}`);

    console.log('panel-integration-electron-smoke: ok');
  } catch (err) {
    console.error(err);
    if (rendererErrors.length) console.error('renderer errors:', rendererErrors);
    process.exitCode = 1;
  } finally {
    if (win && !win.isDestroyed()) win.destroy();
    app.quit();
  }
});
