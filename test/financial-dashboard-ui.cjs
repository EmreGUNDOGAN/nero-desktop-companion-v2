'use strict';
const { app, BrowserWindow, ipcMain, protocol, net } = require('electron');
const fs = require('node:fs'), path = require('node:path'), assert = require('node:assert/strict');
const { pathToFileURL } = require('node:url');
const { Budget, defaults, dateKey } = require('../src/main/budget');
const { registerBudgetIPC } = require('../src/main/budget-ipc');
const root = path.join(__dirname, '..'), output = path.join(root, 'docs/financial-dashboard-screens');
const temp = path.join(app.getPath('temp'), 'nero-financial-dashboard-' + process.pid);
fs.mkdirSync(temp, { recursive: true }); fs.mkdirSync(output, { recursive: true }); app.setPath('userData', temp);
protocol.registerSchemesAsPrivileged([{ scheme: 'nero-theme', privileges: { standard: true, secure: true, corsEnabled: true, supportFetchAPI: true } }]);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
app.whenReady().then(async () => {
  let panel; const errors = [], checks = [];
  try {
    const budget = new Budget({ get: () => defaults(), set: () => {} }), today = dateKey(), month = today.slice(0, 7);
    protocol.handle('nero-theme', request => { const u = new URL(request.url); return net.fetch(pathToFileURL(path.join(root, 'themes', u.hostname, decodeURIComponent(u.pathname))).href); });
    panel = new BrowserWindow({ width: 440, height: 660, show: false, frame: false, webPreferences: { preload: path.join(__dirname, 'budget-ui-preload.js'), contextIsolation: true, sandbox: false, offscreen: true } });
    panel.webContents.on('console-message', event => { if (event.level === 'error') errors.push(event.message); });
    registerBudgetIPC({ ipcMain, BrowserWindow, budget, getPanel: () => panel, backup: () => {}, shell: { openPath: async () => '', openExternal: async () => {} }, dialog: { showOpenDialog: async () => ({ canceled: true }), showSaveDialog: async () => ({ canceled: true }), showMessageBox: async () => ({ response: 0 }) } });
    await panel.loadFile(path.join(root, 'src/renderer/panel/index.html')); panel.setSize(440, 660); await wait(160);
    const js = code => panel.webContents.executeJavaScript(code);
    const click = async (action, id) => { const selector = `[data-budget-action="${action}"]${id ? `[data-id="${id}"]` : ''}`; assert.ok(await js(`!!document.querySelector(${JSON.stringify(selector)})`), 'Missing action ' + action); await js(`document.querySelector(${JSON.stringify(selector)}).click();true`); await wait(80); };
    const tab = async name => { await js(`document.querySelector('[data-budget-tab="${name}"]').click();true`); await wait(220); assert.equal(await js(`document.querySelector('[data-budget-tab="${name}"]').getAttribute('aria-selected')`), 'true'); };
    const close = async () => { await js("document.getElementById('budget-editor').close();true"); await wait(30); };
    const fill = async values => { await js(`(()=>{const form=document.getElementById('budget-form');for(const [key,value] of Object.entries(${JSON.stringify(values)})){const field=form.elements[key];if(!field)throw new Error('Missing field '+key);if(field.type==='checkbox')field.checked=!!value;else field.value=value;field.dispatchEvent(new Event('change',{bubbles:true}));}form.requestSubmit();return true;})()`); await wait(100); assert.equal(await js("document.getElementById('budget-form-error').hidden"), true, await js("document.getElementById('budget-form-error').textContent")); };
    await js("document.querySelector('[data-tab=budget]').click();true"); await wait(100);
    await js("document.getElementById('budget-settings').click();true");
    assert.equal(await js("[...document.getElementById('budget-form').elements.financeTheme.options].find(o=>o.value==='financial-dashboard').textContent"), 'Finans Merkezi');
    await js("const theme=document.getElementById('budget-form').elements.financeTheme;theme.value='financial-dashboard';theme.dispatchEvent(new Event('change',{bubbles:true}));true"); await wait(100); await close();
    assert.equal(budget.state.preferences.financeTheme, 'financial-dashboard');
    assert.equal(await js("getComputedStyle(document.querySelector('.fd-quick')).color"),'rgb(250, 250, 250)');
    assert.equal(await js("getComputedStyle(document.querySelector('.fd-quick .fd-icon')).backgroundColor"),'rgb(38, 38, 38)');
    const names = ['overview', 'transactions', 'accounts', 'budgets', 'plans', 'reports', 'calendar', 'handbook'];
    for (const name of names) { await tab(name); assert.equal(await js("document.querySelector('.fd-screen').dataset.renderer"), 'react-financial-dashboard'); assert.ok(await js("document.getElementById('budget-content').textContent.length")); fs.writeFileSync(path.join(output, name + '-empty.png'), (await panel.webContents.capturePage()).toPNG()); }
    // Writes go through the same visible forms and IPC as a user's clicks.
    await tab('accounts'); await click('new-account'); await fill({ name: 'Günlük hesabım', type: 'bank', opening: '18450' });
    await tab('overview'); await click('new-income'); await fill({ amount: '28000', categoryId: 'income-0', payee: 'Maaş', date: today.split('-').reverse().join('.') });
    await tab('overview'); await click('new-expense'); await fill({ amount: '189.90', categoryId: 'expense-0', payee: 'Netflix', brandId: 'netflix', date: today.split('-').reverse().join('.') });
    assert.equal(budget.state.transactions.length, 2);
    const bank = budget.state.accounts[0];
    budget.act('account', { name: 'Cüzdanım', type: 'cash', opening: '1500' });
    budget.act('account', { name: 'Kredi kartım', type: 'credit', opening: '-2600', limit: '25000', cutDay: '10', dueDay: '20' });
    for (const [payee, amount, categoryId, brandId] of [['YouTube Premium', '119', 'expense-1', 'youtube'], ['ChatGPT', '850', 'expense-2', 'openai'], ['Market alışverişi', '1320', 'expense-0', '']]) budget.act('transaction', { type: 'expense', accountId: bank.id, categoryId, amount, date: today, payee, brandId });
    budget.act('transaction', { type: 'expense', accountId: bank.id, categoryId: 'expense-0', amount: '12', date: today, note: '<img src=x onerror="window.__injected=true">' });
    budget.act('budget', { month, categoryId: 'all', amount: '15000' });
    budget.act('budget', { month, categoryId: 'expense-0', amount: '3500' });
    budget.act('goal', { name: 'Yeni bilgisayar', accountId: bank.id, target: '35000', deadline: month + '-28' });
    budget.act('fund', { goalId: budget.state.goals[0].id, amount: '8200' });
    budget.act('goal', { name: 'Tatil planı', accountId: bank.id, target: '18000' });
    budget.act('fund', { goalId: budget.state.goals[1].id, amount: '3200' });
    budget.act('plan', { name: 'Netflix', accountId: bank.id, categoryId: 'expense-0', amount: '189.90', frequency: 'monthly', start: month + '-20', brandId: 'netflix' });
    budget.act('plan', { name: 'İnternet', accountId: bank.id, categoryId: 'expense-3', amount: '550', frequency: 'monthly', start: month + '-15' });
    for (let i = 1; i <= 5; i++) { const d = new Date(Number(month.slice(0, 4)), Number(month.slice(5)) - 1 - i, 3), day = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-03'; budget.act('transaction', { type: 'income', accountId: bank.id, categoryId: 'income-0', amount: String(20000 + i * 1200), date: day, payee: 'Maaş' }); budget.act('transaction', { type: 'expense', accountId: bank.id, categoryId: 'expense-0', amount: String(6000 + i * 850), date: day, payee: 'Aylık giderler' }); }
    await js('window.neroBudget.open()');
    await tab('overview');
    await js("document.getElementById('finance-centre-search').focus();document.getElementById('finance-centre-search').value='Netflix';Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.getElementById('finance-centre-search'),'Netflix');document.getElementById('finance-centre-search').dispatchEvent(new Event('input',{bubbles:true}));true");
    // Use native typing events through DevTools for controlled React input.
    await js("Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(document.getElementById('finance-centre-search'),'');document.getElementById('finance-centre-search').dispatchEvent(new Event('input',{bubbles:true}));true");
    panel.webContents.sendInputEvent({ type: 'char', keyCode: 'N' }); panel.webContents.sendInputEvent({ type: 'char', keyCode: 'e' }); panel.webContents.sendInputEvent({ type: 'char', keyCode: 't' }); panel.webContents.sendInputEvent({ type: 'char', keyCode: 'f' }); panel.webContents.sendInputEvent({ type: 'char', keyCode: 'l' }); panel.webContents.sendInputEvent({ type: 'char', keyCode: 'i' }); panel.webContents.sendInputEvent({ type: 'char', keyCode: 'x' });
    await wait(60); await js("document.querySelector('.fd-search').requestSubmit();true"); await wait(80);
    assert.equal(await js("document.querySelector('[data-budget-tab=transactions]').getAttribute('aria-selected')"), 'true');
    assert.equal(await js("document.querySelector('[data-budget-filter=search]').value"), 'Netflix');
    assert.ok(await js("document.getElementById('budget-transaction-results').textContent.includes('Netflix')"));
    await js("const search=document.querySelector('[data-budget-filter=search]');search.value='';search.dispatchEvent(new Event('input',{bubbles:true}));true");
    assert.equal(await js('!!window.__injected'), false); assert.equal(await js("document.getElementById('budget-transaction-results').querySelectorAll('img[src=x]').length"), 0);
    const injectedRecord=budget.state.transactions.find(t=>t.note.startsWith('<img'));
    budget.remove(injectedRecord.id);await js('window.neroBudget.open()');
    await tab('overview'); await js("document.dispatchEvent(new KeyboardEvent('keydown',{key:'k',ctrlKey:true,bubbles:true}));true"); assert.equal(await js('document.activeElement.id'), 'finance-centre-search');
    await click('new-transfer'); await fill({ accountId: bank.id, toAccountId: budget.state.accounts[1].id, amount: '300', date: today.split('-').reverse().join('.') });
    await tab('overview'); const beforeNav = await js("document.querySelector('[data-budget-tab=plans]').getBoundingClientRect().top"); await js("document.querySelector('.finance-main').scrollTop=1000;true"); assert.equal(await js("document.querySelector('[data-budget-tab=plans]').getBoundingClientRect().top"), beforeNav);
    await tab('budgets'); await click('fund-goal', budget.state.goals[0].id); await fill({ amount: '100' }); assert.equal(budget.view().goals[0].saved, 830000);
    await tab('plans'); await click('pay-plan'); await fill({}); const paid = budget.state.transactions.find(t => t.planId); assert.ok(paid); await click('unpay-plan', paid.planId + '|' + paid.occurrence); assert.ok(!budget.state.transactions.some(t => t.id === paid.id));
    await tab('calendar'); const originalMonth = await js("document.getElementById('budget-month').value"); await js("document.getElementById('budget-next-month').click();true"); await wait(60); assert.notEqual(await js("document.getElementById('budget-month').value"), originalMonth); await js("document.getElementById('budget-prev-month').click();true"); await wait(70); await click('calendar-day', today); await close();
    await tab('handbook'); await click('academy-module'); await click('read-chapter'); assert.equal(await js("document.getElementById('budget-editor').open"), true); fs.writeFileSync(path.join(output, 'lesson.png'), (await panel.webContents.capturePage()).toPNG()); await close(); await click('academy-back');
    await click('academy-area', 'dictionary'); assert.ok(await js("document.querySelectorAll('.term-entry').length > 0")); await click('academy-area', 'tools'); await click('calculator'); assert.ok(await js("document.getElementById('budget-calc-result').textContent.length > 0")); await close(); await click('academy-area', 'learn');
    // Every editor family is checked in the selected appearance, including help over an editor.
    for (const [page, action, id] of [['overview','new-income'],['overview','new-expense'],['accounts','new-account'],['accounts','edit-account',bank.id],['accounts','card-payment',budget.state.accounts[2].id],['accounts','categories'],['accounts','rates'],['budgets','new-goal'],['budgets','new-budget'],['budgets','edit-goal',budget.state.goals[0].id],['plans','new-plan'],['plans','new-installment'],['plans','notification-settings'],['plans','installments']]) {
      await tab(page); await click(action,id);
      assert.equal(await js("document.getElementById('budget-editor').open"),true,action);
      const geometry=await js("(()=>{const d=document.getElementById('budget-editor');return {overflow:d.scrollWidth-d.clientWidth,width:d.getBoundingClientRect().width,height:d.getBoundingClientRect().height,background:getComputedStyle(d).backgroundColor}})()");
      assert.ok(geometry.overflow<=2,action+JSON.stringify(geometry));assert.equal(geometry.background,'rgb(23, 23, 23)');
      fs.writeFileSync(path.join(output,'dialog-'+action+'.png'),(await panel.webContents.capturePage()).toPNG());
      if(action==='new-expense'){await click('pick-brand');await wait(120);assert.equal(await js("[...document.querySelectorAll('#brand-grid img')].filter(i=>i.complete&&i.naturalWidth>0).length"),100);fs.writeFileSync(path.join(output,'brand-picker.png'),(await panel.webContents.capturePage()).toPNG());await js("document.getElementById('budget-help-editor').close();true");}
      await close();
    }
    await tab('overview');await click('help','balance');assert.equal(await js("document.getElementById('budget-help-editor').open"),true);await js("document.getElementById('budget-help-editor').close();true");
    const skins = ['mum', 'arcade-molasi', 'yorunge', 'serada-bir-gun', 'nero-os-98'].filter(name => fs.existsSync(path.join(root, 'themes', name, 'theme.json')));
    const layout = async (size, zoom, textSize) => { panel.setSize(...size); panel.webContents.setZoomFactor(zoom); budget.act('preferences', { textSize }); await js('window.neroBudget.open()'); await wait(80); for (const name of names) { await tab(name); const result = await js(`(()=>{const view=document.getElementById('view-budget'),main=document.querySelector('.finance-main'),side=document.querySelector('.finance-sidebar');return {overflow:Math.max(view.scrollWidth-view.clientWidth,main.scrollWidth-main.clientWidth,side.scrollWidth-side.clientWidth),missing:[...document.querySelectorAll('#budget-content img')].filter(i=>!i.complete||i.naturalWidth===0).length,title:document.querySelector('.fd-page-intro h2').textContent};})()`); if (result.overflow > 2) { console.log('OVERFLOW', JSON.stringify({ size, zoom, textSize, name, ...result })); console.log(await js(`(()=>{const main=document.querySelector('.finance-main'),r=main.getBoundingClientRect();return [...main.querySelectorAll('*')].filter(e=>e.getBoundingClientRect().right>r.right+2).map(e=>({tag:e.tagName,cls:e.className,text:e.textContent.slice(0,50),rect:e.getBoundingClientRect().toJSON()})).slice(0,12)})()`)); fs.writeFileSync(path.join(output, 'overflow.png'), (await panel.webContents.capturePage()).toPNG()); } assert.ok(result.overflow <= 2, JSON.stringify({ size, zoom, textSize, name, ...result })); assert.equal(result.missing, 0, name + ' missing image'); for (const chart of await js('window.NeroFinancialUI.inspectCharts()')) { assert.ok(chart.width > 0 && chart.height > 0); assert.ok(Math.abs(chart.bitmapWidth - chart.width * chart.dpr) <= 2); } checks.push({ size, zoom, textSize, page: name }); if (size[0] === 440 && zoom === 1 && textSize === 'comfortable') fs.writeFileSync(path.join(output, name + '.png'), (await panel.webContents.capturePage()).toPNG()); if (size[0] === 1100 && textSize === 'comfortable') fs.writeFileSync(path.join(output, name + '-wide.png'), (await panel.webContents.capturePage()).toPNG()); } };
    for (const size of [[380, 600], [440, 660], [700, 850], [1100, 900]]) for (const textSize of ['comfortable', 'large']) await layout(size, 1, textSize);
    await layout([900, 900], 1.25, 'comfortable'); await layout([900, 900], 1.25, 'large');
    for (const skin of skins) { await js(`window.nero.__theme(${JSON.stringify(JSON.parse(fs.readFileSync(path.join(root, 'themes', skin, 'theme.json'))).ui)});true`); await layout([440, 660], 1, 'comfortable'); }
    await js(`window.nero.__theme(${JSON.stringify(JSON.parse(fs.readFileSync(path.join(root, 'themes/default/theme.json'))).ui)});true`);
    await layout([440, 660], 1, 'comfortable');
    panel.setSize(1100,1700);for(const name of names){await tab(name);await wait(250);console.log('CHART PIXELS',name,await js("[...document.querySelectorAll('.fd-chart canvas')].map(c=>({w:c.width,h:c.height,painted:[...c.getContext('2d').getImageData(0,0,c.width,c.height).data].filter((v,i)=>i%4===3&&v>0).length}))"));fs.writeFileSync(path.join(output,name+'-showcase.png'),(await panel.webContents.capturePage()).toPNG());}
    for (const name of ['overview', 'accounts', 'reports', 'budgets']) { await tab(name); panel.setSize(440, 1040); await wait(80); fs.writeFileSync(path.join(output, name + '-tall.png'), (await panel.webContents.capturePage()).toPNG()); }
    panel.setSize(440, 660); await tab('overview'); await click('new-expense'); assert.equal(await js("getComputedStyle(document.getElementById('budget-editor')).backgroundColor"), 'rgb(23, 23, 23)'); fs.writeFileSync(path.join(output, 'expense-form.png'), (await panel.webContents.capturePage()).toPNG()); await close();
    await js("document.getElementById('budget-settings').click();true"); fs.writeFileSync(path.join(output, 'settings.png'), (await panel.webContents.capturePage()).toPNG()); await close();
    await js("document.querySelector('[data-budget-tab=overview]').dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true}));true"); assert.equal(await js("document.querySelector('[data-budget-tab=transactions]').getAttribute('aria-selected')"), 'true');
    const records = JSON.stringify(budget.state.transactions), balances = budget.state.accounts.map(a => budget.accountBalance(a.id));
    for (const financeTheme of ['premium-black', 'modern', 'nero', 'cards', 'financial-dashboard']) { budget.act('preferences', { financeTheme }); await js('window.neroBudget.open()'); await wait(60); await tab('overview'); assert.equal(await js("document.getElementById('view-budget').dataset.financeTheme"), financeTheme); assert.equal(await js("!!document.querySelector('.fd-screen')"), financeTheme === 'financial-dashboard'); assert.equal(JSON.stringify(budget.state.transactions), records); assert.deepEqual(budget.state.accounts.map(a => budget.accountBalance(a.id)), balances); }
    const restored = new Budget({ get: () => defaults(), set: () => {} }); restored.replace(budget.export()); assert.equal(restored.state.preferences.financeTheme, 'financial-dashboard'); assert.deepEqual(restored.state.transactions, budget.state.transactions);
    await js("document.querySelector('[data-tab=notes]').click();true"); assert.equal(await js("document.documentElement.dataset.tab"), 'notes');
    assert.deepEqual(errors, []);
    const report = { status: 'passed', layouts: checks.length, checks, functional: ['theme selection', 'empty pages', 'income/expense/transfer forms', 'overview search', 'Ctrl+K', 'sticky navigation', 'fund goal', 'pay/unpay', 'calendar months and day dialog', 'academy lesson/dictionary/calculator', 'no HTML injection', 'five appearances reversible', 'backup restore'], screenshotsUseTemporaryTestRecords: true, errors };
    fs.writeFileSync(path.join(output, 'validation.json'), JSON.stringify(report, null, 2)); console.log(JSON.stringify({ status: report.status, layouts: checks.length, errors, output }));
    panel.destroy(); app.exit(0);
  } catch (error) { console.error(error.stack); if (panel) fs.writeFileSync(path.join(output, 'failed.png'), (await panel.webContents.capturePage()).toPNG()); app.exit(1); }
});
