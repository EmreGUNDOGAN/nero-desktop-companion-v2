// Actual Electron renderer, real theme manifests/artwork and real Timer; temporary test records only.
const {app,BrowserWindow,protocol,net,ipcMain}=require('electron');
const path=require('node:path');
const fs=require('node:fs');
const assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const root=path.join(__dirname,'..');
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
app.whenReady().then(async()=>{
 let win;const errors=[];
 try{
  protocol.handle('nero-theme',req=>{const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));assert.ok(file.startsWith(path.join(root,'themes')+path.sep));return net.fetch(pathToFileURL(file).href);});
  win=new BrowserWindow({width:480,height:850,show:true,frame:false,transparent:true,webPreferences:{preload:path.join(__dirname,'biletini-sakla-preload.js'),contextIsolation:true,sandbox:false,nodeIntegration:false}});
  win.webContents.on('console-message',(_event,level,message)=>{if(level>=3){errors.push(message);console.error('RENDERER',message);}});
  const js=code=>win.webContents.executeJavaScript(code);
  await win.loadFile(path.join(root,'src/renderer/panel/index.html'));await wait(300);
  assert.equal(await js('document.documentElement.dataset.skin'),'biletini-sakla');
  assert.equal(await js('document.getElementById("set-theme").selectedOptions[0].textContent'),'Biletini Sakla');
  const art=await js(`new Promise(resolve=>{const i=new Image();i.onload=()=>resolve({width:i.naturalWidth,height:i.naturalHeight});i.onerror=()=>resolve(null);i.src='nero-theme://biletini-sakla/assets/railway-panorama.png';})`);
  assert.ok(art?.width>500,'Local illustration failed to load');
  for(const asset of ['paper-grain','station-panorama'])assert.ok(await js(`new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(i.naturalWidth>500);i.onerror=()=>resolve(false);i.src='nero-theme://biletini-sakla/assets/${asset}.png';})`),`${asset} failed to load`);
  const screenshots=path.join(root,'docs','biletini-sakla-screens');fs.mkdirSync(screenshots,{recursive:true});
  const select=async tab=>{await js(`document.querySelector('.tabs [data-tab="${tab}"]').click();true`);await wait(250);};
  const check=async tab=>{const result=await js(`(()=>{const e=document.getElementById('view-${tab}');return {overflow:e.scrollWidth-e.clientWidth,w:e.clientWidth,h:e.clientHeight,hidden:e.hidden};})()`);assert.ok(result.overflow<=2,JSON.stringify({tab,...result}));assert.ok(result.w>100&&result.h>100&&!result.hidden);};
  for(const [w,h,scale] of [[380,660,1],[440,820,1],[480,850,1],[900,900,1.25]]){
   win.setSize(w,h);win.webContents.setZoomFactor(scale);await wait(100);
   for(const tab of ['home','notes','todos','timer','badges','settings']){
    if(tab==='settings'){await js('document.getElementById("settings-button").click();true');await wait(40);}else await select(tab);
    await check(tab);await wait(250);
    if(w===480||w===900)fs.writeFileSync(path.join(screenshots,tab+(w===900?'-125':'')+'.png'),(await win.webContents.capturePage()).toPNG());
   }
  }
  win.webContents.setZoomFactor(1);win.setSize(480,850);
  for(const tab of ['home','settings']){if(tab==='settings')await js('document.getElementById("settings-button").click();true');else await select(tab);await js(`document.getElementById('view-${tab}').scrollTop=550;true`);await wait(250);fs.writeFileSync(path.join(screenshots,tab+'-more.png'),(await win.webContents.capturePage()).toPNG());await js(`document.getElementById('view-${tab}').scrollTop=0;true`);}
  await select('notes');await js('document.getElementById("bs-new-note").click();true');
  assert.equal(await js('document.getElementById("note-editor-view").hidden'),false);
  await js('document.getElementById("note-body").value="Tema kayıt testi\\nTürkçe karakterler: ç ğ ı ö ş ü";document.getElementById("note-body").dispatchEvent(new Event("input",{bubbles:true}));true');await wait(850);
  assert.ok(await js('window.nero.__snapshot().notes.some(n=>n.body.startsWith("Tema kayıt testi"))'));
  fs.writeFileSync(path.join(screenshots,'note-editor.png'),(await win.webContents.capturePage()).toPNG());
  await js('document.getElementById("note-back").click();true');await wait(60);
  assert.equal(await js('document.getElementById("notes-list-view").hidden'),false);
  assert.equal(await js('document.getElementById("bs-peek-title").textContent'),'Tema kayıt testi');
  await js('document.getElementById("bs-note-peek").click();true');assert.equal(await js('document.getElementById("note-body").value.startsWith("Tema kayıt testi")'),true);
  await js('document.getElementById("note-archive").click();true');await wait(60);
  assert.ok(await js('!document.getElementById("notes-archive").hidden'));
  await select('todos');await js('document.getElementById("todo-input").value="Bilet temasını kontrol et";document.getElementById("todo-form").requestSubmit();true');await wait(60);
  assert.ok(await js('window.nero.__snapshot().todos.some(t=>t.text==="Bilet temasını kontrol et")'));
  await js('document.querySelector("#todo-list .check").click();true');await wait(50);
  assert.ok(await js('window.nero.__snapshot().todos[0].done'));
  await select('timer');await js('document.querySelectorAll("#presets button")[3].click();true');
  assert.equal(await js('document.getElementById("timer-digits").textContent'),'45:00');
  assert.equal(await js('document.getElementById("bs-duration").textContent'),'45 dk');
  await js('document.getElementById("bs-timer-reset").click();true');assert.equal(await js('document.getElementById("timer-digits").textContent'),'25:00');
  await js('document.getElementById("timer-start").click();true');await wait(70);assert.equal(await js('window.nero.__snapshot().timer.status'),'running');
  assert.equal(await js('document.getElementById("bs-timer-reset").hidden'),true);
  await js('document.getElementById("timer-pause").click();true');await wait(50);assert.equal(await js('window.nero.__snapshot().timer.status'),'paused');
  fs.writeFileSync(path.join(screenshots,'timer-paused.png'),(await win.webContents.capturePage()).toPNG());
  await js('document.getElementById("timer-resume").click();true');await wait(30);assert.equal(await js('window.nero.__snapshot().timer.status'),'running');
  await js('document.getElementById("timer-cancel").click();true');await wait(30);assert.equal(await js('window.nero.__snapshot().timer.status'),'idle');
  await select('home');await js('document.querySelector(".week .section-help").click();true');assert.equal(await js('document.getElementById("section-tooltip-layer").hidden'),false);
  await js('document.querySelector(".week .section-help").click();document.getElementById("jar-input").value="Tema hazır";document.getElementById("jar-form").requestSubmit();true');await wait(60);
  assert.equal(await js('window.nero.__snapshot().jarCount'),4);
  await js('document.querySelector(".tabs [data-tab=home]").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}));true');assert.equal(await js('document.documentElement.dataset.tab'),'notes');
  await js('document.getElementById("settings-button").click();document.getElementById("set-theme").value="default";document.getElementById("set-theme").dispatchEvent(new Event("change",{bubbles:true}));true');await wait(60);
  assert.equal(await js('document.documentElement.dataset.skin'),'cozy');assert.equal(await js('document.getElementById("bs-new-note").offsetWidth'),0);
  await js('document.getElementById("set-theme").value="biletini-sakla";document.getElementById("set-theme").dispatchEvent(new Event("change",{bubbles:true}));true');await wait(60);assert.equal(await js('document.documentElement.dataset.skin'),'biletini-sakla');
  assert.equal(await js('document.querySelectorAll("#bs-new-note").length'),1);
  await js('window.nero.__empty();true');await select('notes');assert.equal(await js('document.getElementById("bs-note-peek").hidden'),true);assert.ok(await js('document.getElementById("bs-new-note").offsetWidth>0'));
  await select('todos');assert.equal(await js('document.getElementById("todos-empty").hidden'),false);
  const {ThemeManager}=require('../src/main/themes');
  const tm=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:null});tm.scan();let quickTheme='biletini-sakla';const quickRecords=[];let closeCalls=0;
  ipcMain.handle('theme:get',()=>({manifest:tm.get(quickTheme).manifest}));
  ipcMain.handle('quick:addTodo',(_e,text)=>quickRecords.push({type:'todo',text}));
  ipcMain.handle('quick:addNote',(_e,text)=>quickRecords.push({type:'note',text}));ipcMain.on('quick:close',()=>closeCalls++);
  win.close();win=null;
  const quick=new BrowserWindow({width:380,height:96,show:true,frame:false,transparent:true,webPreferences:{preload:path.join(root,'src/preload/quick-preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false}});
  quick.webContents.on('console-message',(_event,level,message)=>{if(level>=3)errors.push(message);});
  const qjs=code=>quick.webContents.executeJavaScript(code);
  await quick.loadFile(path.join(root,'src/renderer/quick/index.html'));quick.setContentSize(380,96);quick.webContents.setZoomFactor(1);await wait(500);
  assert.equal(await qjs('document.documentElement.dataset.skin'),'biletini-sakla');
  const qb=await qjs('(()=>{const b=document.querySelector(".box").getBoundingClientRect(),i=document.getElementById("input").getBoundingClientRect();return {bottom:i.bottom,bottomBox:b.bottom,width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,innerWidth,innerHeight};})()');assert.ok(qb.bottom<=qb.bottomBox&&qb.width<=380&&qb.height<=qb.innerHeight,JSON.stringify({qb,bounds:quick.getBounds(),content:quick.getContentBounds(),zoom:quick.webContents.getZoomFactor()}));
  fs.writeFileSync(path.join(screenshots,'quick-capture.png'),(await quick.webContents.capturePage()).toPNG());
  await qjs('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Tab",bubbles:true}));document.getElementById("input").value="Bir yolculuk notu";document.getElementById("form").requestSubmit();true');await wait(70);assert.deepEqual(quickRecords,[{type:'note',text:'Bir yolculuk notu'}]);assert.equal(closeCalls,1);
  quickTheme='default';quick.webContents.send('theme',{manifest:tm.get(quickTheme).manifest});await wait(50);assert.equal(await qjs('document.documentElement.dataset.skin'),'cozy');
  quick.close();
  assert.deepEqual(errors,[]);console.log('Biletini Sakla UI passed: 6 screens × 4 sizes/scales; local artwork, theme selection, notes/save/archive, tasks, real timer/start/pause/resume/reset, jar, help, keyboard, empty data, theme switching and real quick-capture preload/theme/save/keyboard.');app.exit(0);
 }catch(e){console.error(e);app.exit(1);}
});
