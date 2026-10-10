'use strict';
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs'), path = require('node:path'), os = require('node:os'), assert = require('node:assert/strict');
const source = path.join(__dirname, '..');
const root = process.env.NERO_PACKAGED_RESOURCES ? path.join(process.env.NERO_PACKAGED_RESOURCES, 'app.asar') : source;
app.setPath('userData', fs.mkdtempSync(path.join(os.tmpdir(), 'nero-700-restaurant-')));
app.commandLine.appendSwitch('use-angle', 'swiftshader');
app.commandLine.appendSwitch('enable-unsafe-swiftshader');
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const watchdog = setTimeout(() => { console.error('Restaurant runtime test timed out'); app.exit(1); }, 300000);
app.whenReady().then(async () => {
  let controller, restaurant;
  const errors = [], failedRequests = [], created = [];
  try {
    const GameWindow = process.env.NERO_HEADLESS ? class extends BrowserWindow {
      constructor(options) { super({ ...options, show: false, webPreferences: { ...options.webPreferences, offscreen: true } }); }
    } : BrowserWindow;
    const game = require(path.join(root, 'src/main/restaurant-window.js')).setupRestaurant({ app, BrowserWindow: GameWindow, ipcMain });
    controller = new BrowserWindow({ show: false, webPreferences: { offscreen: true, contextIsolation: true, sandbox: true, preload: path.join(root, 'src/preload/preload.js') } });
    await controller.loadURL('data:text/html,<title>Restaurant IPC test</title>');
    const open = () => controller.webContents.executeJavaScript("window.nero.invoke('restaurant:open')");
    // Observe production windows before their modules load.
    app.on('browser-window-created', (_event, window) => {
      if (window === controller) return;
      created.push(window.id);
      window.webContents.on('console-message', event => { if (event.level === 'error') errors.push(event.message); });
      window.webContents.on('did-fail-load', (_e, code, description) => failedRequests.push({ code, description }));
    });
    assert.deepEqual(await controller.webContents.executeJavaScript("Promise.all([window.nero.invoke('restaurant:open'),window.nero.invoke('restaurant:open')])"), [true, true]); restaurant = game.getWindow();
    assert.equal(created.length, 1);
    const firstId = restaurant.id;
    assert.equal(await open(), true); assert.equal(game.getWindow().id, firstId);
    const js = code => restaurant.webContents.executeJavaScript(code);
    const ready = async () => {
      const deadline = Date.now() + 180000;
      while (Date.now() < deadline) {
        if (await js('Boolean(window.__neroRestaurantLayout?.ready && document.querySelector(".hud-dock"))')) {
          await js('window.__neroRestaurantLayout.setMotion(false);true'); return;
        }
        assert.deepEqual(errors, []); await wait(100);
      }
      throw Error('Restaurant scene/HUD failed to become ready: ' + JSON.stringify(errors));
    };
    await ready(); console.log('Restaurant production IPC and WebGL scene ready');
    const initial = await js('window.__neroRestaurantService.snapshot()');
    // Native/software rendering can take long enough for customer prepayments.
    // Verify the real opening transaction, then reconcile current cash with its ledger.
    const openingGold = initial.ledger.find(entry => entry.kind === 'opening-budget')?.amount;
    assert.equal(openingGold, 60);
    assert.equal(initial.gold, Math.round(initial.ledger.reduce((sum, entry) => sum + entry.amount, 0) * 100) / 100);
    assert.equal(initial.level, 1); assert.equal(initial.xp, 0);
    assert.equal(initial.activeTables, 1); assert.equal(initial.cleaners.length, 1);
    const report = await js('window.__neroRestaurantLayout.report()');
    assert.equal(report.finite, true); assert.ok(report.drawCalls > 0); assert.ok(report.triangles > 0);
    const tabs = ['Siparişler', 'Mutfak', 'Tarifler', 'Depo', 'Araştırmalar', 'Ekip'];
    for (const tab of tabs) {
      await js(`(()=>{const b=[...document.querySelectorAll('.hud-dock button')].find(b=>b.textContent.includes(${JSON.stringify(tab)}));if(!b)throw Error('Missing tab');b.click();return true;})()`);
      await wait(100);
      assert.equal(await js(`Boolean(document.querySelector('.hud-popup[aria-label=${JSON.stringify(tab)}]'))`), true, tab);
      await js("document.querySelector('.hud-popup .hud-close').click();true"); await wait(50);
    }
    // Change progress through the game's actual production code, then reopen the native window.
    const purchase = await js('window.__neroRestaurantService.orderSupplies({bun: 1})');
    // Material IDs vary by recipe; a valid unlocked ingredient is chosen from the actual inventory.
    if (!purchase.allowed) await js("(()=>{const s=window.__neroRestaurantService.snapshot();const m=s.inventory.materials.find(m=>m.unlocked&&m.unitGold>0&&m.unitGold<s.availableGold);if(!m)throw Error('No affordable supply');const r=window.__neroRestaurantService.orderSupplies({[m.id]:1});if(!r.allowed)throw Error(JSON.stringify(r));return true;})()");
    assert.equal(await js('window.__neroRestaurantService.save()'), true);
    const saved = await js('window.__neroRestaurantService.exportCheckpoint()');
    const output = path.join(source, 'docs/restaurant-integration'); fs.mkdirSync(output, { recursive: true });
    fs.writeFileSync(path.join(output, process.env.NERO_PACKAGED_RESOURCES ? 'packaged-runtime.png' : 'runtime-7.0.0.png'), (await restaurant.webContents.capturePage()).toPNG());
    game.close(); while (game.getWindow()) await wait(50);
    assert.equal(await open(), true); restaurant = game.getWindow(); assert.notEqual(restaurant.id, firstId);
    await ready();
    const restored = await js('window.__neroRestaurantService.exportCheckpoint()');
    assert.equal(restored.gold, saved.gold); assert.equal(restored.level, saved.level); assert.equal(restored.xp, saved.xp);
    assert.equal(restored.cleanerCount, saved.cleanerCount); assert.deepEqual(restored.inventory, saved.inventory);
    assert.equal(await js('window.__neroRestaurantLayout.report().clock.manualPaused'), true);
    assert.deepEqual(errors, []); assert.deepEqual(failedRequests, []);
    fs.writeFileSync(path.join(output, process.env.NERO_PACKAGED_RESOURCES ? 'packaged-runtime-verification.json' : 'runtime-verification.json'), JSON.stringify({ passed: true, version: '7.0.0', packaged: Boolean(process.env.NERO_PACKAGED_RESOURCES), realIpc: true, reusedWindow: true, concurrentClicks: true, webgl: true, finiteGeometry: true, tabs, initial: { gold: openingGold, currentGold: initial.gold, level: initial.level, xp: initial.xp, tables: initial.activeTables, cleaners: initial.cleaners.length }, saveRestored: true, errors, failedRequests }, null, 2));
    console.log('PASS: restaurant production IPC, window reuse, WebGL, six HUD tabs, real supply purchase and save/reopen restore');
    clearTimeout(watchdog); restaurant.destroy(); controller.destroy(); app.exit(0);
  } catch (error) { console.error(error.stack); console.error(JSON.stringify({ errors, failedRequests })); clearTimeout(watchdog); restaurant?.destroy(); controller?.destroy(); app.exit(1); }
});
