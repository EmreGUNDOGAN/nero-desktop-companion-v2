const {app,BrowserWindow,protocol,net,ipcMain}=require('electron');
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {ThemeManager}=require('../src/main/themes');
process.env.NERO_TEST_THEME='cizgi-roman-arasi';
const root=path.join(__dirname,'..'),out=path.join(root,'docs/cizgi-roman/screens');
const report={passed:false,viewportChecks:0,assets:[],actions:[],errors:[]};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
app.on('window-all-closed',()=>{});
app.whenReady().then(async()=>{
 let win,quick;
 try{
  fs.mkdirSync(out,{recursive:true});
  protocol.handle('nero-theme',req=>{const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));assert.ok(file.startsWith(path.join(root,'themes')+path.sep));return net.fetch(pathToFileURL(file).href);});
  win=new BrowserWindow({width:500,height:900,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(__dirname,'comic-preload.js'),contextIsolation:true,sandbox:false,nodeIntegration:false}});
  win.webContents.on('console-message',(_e,l,m)=>{if(l>=3)report.errors.push(m);});
  const js=code=>win.webContents.executeJavaScript(code);
  const select=async tab=>{await js(tab==='settings'?'document.getElementById("settings-button").click();true':`document.querySelector('.tabs [data-tab="${tab}"]').click();true`);await wait(110);};
  const capture=async name=>{await wait(240);fs.writeFileSync(path.join(out,name+'.png'),(await win.webContents.capturePage()).toPNG());};
  const change=async theme=>{await js(`window.nero.invoke('settings:set','themeId','${theme}');true`);await wait(130);};
  await win.loadFile(path.join(root,'src/renderer/panel/index.html'));win.setContentSize(500,900);await wait(600);
  assert.equal(await js('document.documentElement.dataset.skin'),'cizgi-roman-arasi');
  const tm=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:null});tm.scan();assert.deepEqual(tm.get('cizgi-roman-arasi').errors,[]);
  for(const asset of fs.readdirSync(path.join(root,'themes/cizgi-roman-arasi/assets'))){const size=await js(`new Promise(resolve=>{const i=new Image();i.onload=()=>resolve([i.naturalWidth,i.naturalHeight]);i.onerror=()=>resolve(null);i.src='nero-theme://cizgi-roman-arasi/assets/${asset}'})`);assert.ok(size?.[0]>300);report.assets.push({asset,size});}
  await js('document.fonts.ready');assert.ok(await js('document.fonts.check(\'italic 700 32px "Comic Head"\')'));
  for(const [w,h,z] of [[380,660,1],[440,820,1],[500,900,1],[900,900,1.25]]){
   win.setContentSize(w,h);win.webContents.setZoomFactor(z);await wait(160);
   for(const tab of ['home','notes','todos','timer','badges','settings']){
    await select(tab);await js(`document.getElementById('view-${tab}').scrollTop=0;true`);
    const check=await js(`(()=>{const e=document.getElementById('view-${tab}');return {overflow:e.scrollWidth-e.clientWidth,w:e.clientWidth,h:e.clientHeight,hidden:e.hidden}})()`);
    if(check.overflow>2){await capture('overflow-'+tab);console.log(await js(`(()=>{const e=document.getElementById('view-${tab}'),r=e.getBoundingClientRect();return [...e.querySelectorAll('*')].filter(n=>n.getBoundingClientRect().right>r.right).map(n=>[n.tagName,n.className,n.getBoundingClientRect().right-r.right]);})()`));console.log(await js(`(()=>{const e=document.getElementById('view-${tab}');return [...e.querySelectorAll('*')].filter(n=>n.scrollWidth>n.clientWidth+2).map(n=>[n.tagName,n.className,n.scrollWidth,n.clientWidth,getComputedStyle(n).overflow]);})()`));}
    assert.ok(check.overflow<=2&&check.w>100&&check.h>100&&!check.hidden,JSON.stringify({tab,w,h,z,...check}));report.viewportChecks++;
    assert.ok(await js('(()=>{const r=document.querySelector(".tabs").getBoundingClientRect();return [...document.querySelectorAll(".tabs [role=tab]")].every(b=>{const q=b.getBoundingClientRect();return q.width>25&&q.top>=r.top-1&&q.bottom<=r.bottom+1;});})()'));
    if(w===500||w===380)await capture(`${tab}-${w}`);
   }
  }
  win.setContentSize(500,900);win.webContents.setZoomFactor(1);await select('notes');
  await js('document.getElementById("comic-note-title").value="Çizgi roman kontrolü";document.getElementById("comic-note-title").dispatchEvent(new Event("input",{bubbles:true}));document.getElementById("comic-note-body").textContent="Türkçe: ç ğ ı ö ş ü";document.getElementById("comic-note-body").dispatchEvent(new Event("input",{bubbles:true}));true');await wait(650);
  assert.ok(await js('window.nero.__snapshot().notes.some(n=>n.body==="Çizgi roman kontrolü\\nTürkçe: ç ğ ı ö ş ü")'));
  await js('(()=>{const el=document.getElementById("comic-note-body");el.focus();const r=document.createRange();r.selectNodeContents(el);getSelection().removeAllRanges();getSelection().addRange(r);document.querySelector("[data-comic-format=bold]").click();return true;})()');await wait(650);
  assert.ok(await js('window.nero.__snapshot().notes.some(n=>n.body.includes("**Türkçe: ç ğ ı ö ş ü**"))'));
  await js('document.getElementById("comic-add-link").click();true');assert.ok(await js('document.getElementById("comic-link-dialog").open'));
  await js('document.getElementById("comic-link-url").value="https://example.com";document.getElementById("comic-link-form").requestSubmit();true');await wait(650);
  assert.ok(await js('window.nero.__snapshot().notes.some(n=>n.body.includes("https://example.com"))'));report.actions.push('inline note autosave, bold, link');await capture('notes-edited');
  await js('document.getElementById("comic-open-note").click();true');await wait(90);assert.equal(await js('document.getElementById("note-editor-view").hidden'),false);
  await js('document.getElementById("note-archive").click();true');await wait(120);assert.equal(await js('document.getElementById("notes-archive").hidden'),false);
  await js('document.getElementById("comic-new-note").click();true');await wait(120);assert.ok(await js('window.nero.__snapshot().notes.some(n=>n.body==="Yeni not\\n")'));report.actions.push('native editor, archive, new note');
  await select('todos');await js('document.getElementById("todo-input").value="Yeni kareyi tamamla";document.getElementById("todo-form").requestSubmit();true');await wait(100);
  assert.ok(await js('window.nero.__snapshot().todos.some(t=>t.text==="Yeni kareyi tamamla")'));await js('document.querySelector("#todo-list .check").click();true');await wait(90);assert.ok(await js('window.nero.__getCalls().some(c=>c.channel==="todos:toggle")'));report.actions.push('task add and complete');
  await select('timer');await js('document.querySelectorAll("#presets button")[3].click();true');assert.equal(await js('document.getElementById("timer-digits").textContent'),'45:00');
  await js('document.getElementById("comic-timer-reset").click();true');assert.equal(await js('document.getElementById("timer-digits").textContent'),'25:00');
  await js('document.querySelector(".comic-custom").open=true;document.getElementById("timer-custom").value=600;document.getElementById("timer-custom").dispatchEvent(new Event("change",{bubbles:true}));true');assert.equal(await js('document.getElementById("timer-digits").textContent'),'10:00:00');await capture('timer-long');
  await js('document.querySelector(".comic-custom").open=false;document.getElementById("comic-timer-reset").click();document.getElementById("timer-start").click();true');await wait(100);assert.equal(await js('window.nero.__snapshot().timer.status'),'running');
  await js('window.nero.__timerElapsed(.5);true');await wait(450);assert.equal(await js('document.querySelector(".lcd-bar").getAttribute("aria-valuenow")'),'50');await capture('timer-running');
  for(const [button,status] of [['pause','paused'],['resume','running'],['cancel','idle']]){await js(`document.getElementById('timer-${button}').click();true`);await wait(100);assert.equal(await js('window.nero.__snapshot().timer.status'),status);}report.actions.push('25/45/600 minute timer, progress, pause, resume, cancel');
  await select('badges');for(const rarity of ['yaygin','siradisi','nadir','efsanevi'])await js(`document.querySelector('[data-rarity=${rarity}]').click();true`);report.actions.push('badge filters');
  await select('home');const count=await js('window.nero.__snapshot().jarCount');await js('document.getElementById("jar-input").value="Güzel bir an";document.getElementById("jar-form").requestSubmit();true');await wait(100);assert.equal(await js('window.nero.__snapshot().jarCount'),count+1);
  await js('document.querySelector(".tabs [data-tab=home]").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}));true');assert.equal(await js('document.documentElement.dataset.tab'),'notes');report.actions.push('memory jar and keyboard tabs');
  await js('window.nero.invoke("settings:set","sceneBg",false);true');await wait(100);assert.ok(await js('document.body.classList.contains("comic-no-scene")'));await js('window.nero.invoke("settings:set","sceneBg",true);true');
  await change('default');assert.equal(await js('document.getElementById("timer-custom").closest(".custom").parentElement.id'),'presets');assert.equal(await js('document.getElementById("st-days").closest(".tile").parentElement.className'),'tiles');
  for(const theme of ['arcade-molasi','biletini-sakla','yorunge','serada-bir-gun','cizgi-roman-arasi','default','cizgi-roman-arasi']){await change(theme);await select('home');if(theme==='cizgi-roman-arasi'){assert.equal(await js('document.querySelector(".nero-says").parentElement.className'),'hello');assert.ok(await js('document.getElementById("timer-custom").closest(".comic-custom")!==null'));}}report.actions.push('theme switching and restored native layout');
  await select('settings');await js('document.getElementById("view-settings").scrollTop=500;true');assert.ok(await js('[...document.querySelectorAll(".wardrobe-portrait img")].every(i=>i.complete&&i.naturalWidth>0)'));await capture('settings-more');
  await js('window.nero.__empty();true');await select('notes');assert.equal(await js('document.getElementById("comic-composer").hidden'),true);await capture('notes-empty');await select('todos');assert.equal(await js('document.getElementById("todos-empty").hidden'),false);report.actions.push('empty notes and tasks');
  win.destroy();win=null;
  ipcMain.handle('theme:get',()=>({manifest:tm.get('cizgi-roman-arasi').manifest}));const records=[];
  ipcMain.handle('quick:addTodo',(_e,text)=>records.push({type:'todo',text}));ipcMain.handle('quick:addNote',(_e,text)=>records.push({type:'note',text}));ipcMain.on('quick:close',()=>{});
  quick=new BrowserWindow({width:380,height:96,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(root,'src/preload/quick-preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false}});
  await quick.loadFile(path.join(root,'src/renderer/quick/index.html'));quick.setContentSize(380,96);await wait(500);
  assert.equal(await quick.webContents.executeJavaScript('document.documentElement.dataset.skin'),'cizgi-roman-arasi');
  assert.ok(await quick.webContents.executeJavaScript('(()=>{const r=document.getElementById("input").getBoundingClientRect(),b=document.querySelector(".box").getBoundingClientRect();return r.bottom<=b.bottom-3&&r.right<=b.right&&b.bottom<=innerHeight&&document.documentElement.scrollHeight<=innerHeight;})()'));
  await quick.webContents.executeJavaScript('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Tab",bubbles:true}));document.getElementById("input").value="Hızlı not kontrolü";document.getElementById("form").requestSubmit();true');await wait(100);assert.deepEqual(records,[{type:'note',text:'Hızlı not kontrolü'}]);fs.writeFileSync(path.join(out,'quick-capture.png'),(await quick.webContents.capturePage()).toPNG());report.actions.push('production quick capture preload');quick.destroy();quick=null;
  assert.deepEqual(report.errors,[]);report.passed=true;fs.writeFileSync(path.join(root,'docs/cizgi-roman/ui-verification.json'),JSON.stringify(report,null,2));console.log('PASS: '+report.viewportChecks+' viewport checks; '+report.actions.join('; '));app.exit(0);
 }catch(e){report.error=e.stack;fs.writeFileSync(path.join(root,'docs/cizgi-roman/ui-verification.json'),JSON.stringify(report,null,2));console.error(e);win?.destroy();quick?.destroy();app.exit(1);}
});
