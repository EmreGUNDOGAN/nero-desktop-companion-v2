// Integration QA: actual Electron renderer, ThemeManager, Timer and production quick preload.
// All sample data is isolated in theme-trio-preload.js; never touches the user's records.
const {app,BrowserWindow,protocol,net,ipcMain}=require('electron');
const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {ThemeManager}=require('../src/main/themes');
const root=path.join(__dirname,'..'),out=path.join(root,'docs/theme-trio/screens');
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const themes=['arcade-molasi','yorunge','serada-bir-gun'];
const report={passed:false,viewportChecks:0,assets:[],actions:{},rendererErrors:[]};
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
app.whenReady().then(async()=>{
 let win,quick;
 try{
  fs.mkdirSync(out,{recursive:true});
  protocol.handle('nero-theme',req=>{
   const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));
   assert.ok(file.startsWith(path.join(root,'themes')+path.sep));
   return net.fetch(pathToFileURL(file).href);
  });
  win=new BrowserWindow({width:500,height:900,show:true,frame:false,webPreferences:{preload:path.join(__dirname,'theme-trio-preload.js'),contextIsolation:true,sandbox:false,nodeIntegration:false}});
  win.webContents.on('console-message',(_e,l,m)=>{if(l>=3)report.rendererErrors.push(m);});
  const js=async code=>{try{return await win.webContents.executeJavaScript(code);}catch(error){console.error("Renderer script failed:",code);throw error;}};
  await win.loadFile(path.join(root,'src/renderer/panel/index.html'));win.setContentSize(500,900);await wait(550);
  const select=async tab=>{await js(tab==='settings'?'document.getElementById("settings-button").click();true':`document.querySelector('.tabs [data-tab="${tab}"]').click();true`);await wait(90);};
  const capture=async name=>{await wait(230);fs.writeFileSync(path.join(out,name+'.png'),(await win.webContents.capturePage()).toPNG());};
  const change=async theme=>{await js(`window.nero.invoke('settings:set','themeId','${theme}');true`);await wait(100);assert.equal(await js('document.documentElement.dataset.skin'),theme==='default'?'cozy':theme);};
  for(const theme of themes){
   await change(theme);
   const tm=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:null});tm.scan();assert.deepEqual(tm.get(theme).errors,[]);
   for(const asset of fs.readdirSync(path.join(root,'themes',theme,'assets')).filter(n=>n.endsWith('.png'))){
    const size=await js(`new Promise(resolve=>{const i=new Image();i.onload=()=>resolve([i.naturalWidth,i.naturalHeight]);i.onerror=()=>resolve(null);i.src='nero-theme://${theme}/assets/${asset}'})`);
    assert.ok(size?.[0]>300,`${theme}/${asset} failed to load`);report.assets.push({theme,asset,size});
   }
   for(const [w,h,z] of [[380,660,1],[440,820,1],[500,900,1],[900,900,1.25]]){
    win.setContentSize(w,h);win.webContents.setZoomFactor(z);await wait(150);
    for(const tab of ['home','notes','todos','timer','badges','settings']){
     await select(tab);await js(`document.getElementById('view-${tab}').scrollTop=0;true`);
     const check=await js(`(()=>{const e=document.getElementById('view-${tab}');return {skin:document.documentElement.dataset.skin,overflow:e.scrollWidth-e.clientWidth,w:e.clientWidth,h:e.clientHeight,hidden:e.hidden}})()`);
     assert.ok(check.overflow<=2&&check.w>100&&check.h>100&&!check.hidden,JSON.stringify({theme,tab,w,h,z,...check}));report.viewportChecks++;
     assert.ok(await js('(()=>{const nav=document.querySelector(".tabs").getBoundingClientRect();return [...document.querySelectorAll(".tabs [role=tab]")].every(b=>{const r=b.getBoundingClientRect();return r.top>=nav.top-1&&r.bottom<=nav.bottom+1&&r.width>25&&r.height>20;});})()'),`${theme}: main tabs must fit one row`);
     if(w===500||w===900)await capture(theme+'-'+tab+(w===900?'-125':''));
    }
   }
   win.setContentSize(500,900);win.webContents.setZoomFactor(1);await wait(150);
   await select('notes');await js('document.getElementById("nt-new-note").click();true');
   assert.equal(await js('document.getElementById("note-editor-view").hidden'),false);
   const body=JSON.stringify(`Kontrol: ${theme}\nTürkçe: ç ğ ı ö ş ü\nBu kayıt yalnızca test ortamına aittir.`);
   await js(`document.getElementById('note-body').value=${body};document.getElementById('note-body').dispatchEvent(new Event('input',{bubbles:true}));true`);await wait(850);
   assert.ok(await js(`window.nero.__snapshot().notes.some(n=>n.body===${body})`));await capture(theme+'-note-editor');
   await js('document.getElementById("note-back").click();true');await wait(90);
   await js(`document.querySelectorAll('#notes-list [data-nt-note]')[0].click();true`);
   await js('document.getElementById("note-archive").click();true');await wait(100);
   assert.equal(await js('document.getElementById("notes-archive").hidden'),false);
   await select('todos');
   await js(`document.getElementById('todo-input').value='Kontrol işi ${theme}';document.getElementById('todo-form').requestSubmit();true`);await wait(100);
   assert.ok(await js(`window.nero.__snapshot().todos.some(t=>t.text==='Kontrol işi ${theme}')`));
   const todoBefore=await js('(()=>{const id=document.querySelector("#todo-list>li[data-todo-id]").dataset.todoId;const t=window.nero.__snapshot().todos.find(t=>t.id===id);return {id:t.id,done:t.done}})()');
   await js(`document.querySelector('#todo-list>li[data-todo-id=${JSON.stringify(todoBefore.id)}] .check').click();true`);await wait(100);
   assert.equal(await js(`window.nero.__snapshot().todos.find(t=>t.id===${JSON.stringify(todoBefore.id)}).done`),!todoBefore.done);
   await select('timer');await js(`document.querySelector('#presets [data-min="45"]').click();true`);
   assert.equal(await js('document.getElementById("timer-digits").textContent'),'45:00');
   assert.equal(await js('document.getElementById("nt-duration").textContent'),'45 dk');
   await js('document.getElementById("nt-timer-reset").click();true');assert.equal(await js('document.getElementById("timer-digits").textContent'),'25:00');
   await js('document.querySelector(".nt-custom").open=true;document.getElementById("timer-custom").value=600;document.getElementById("timer-custom").dispatchEvent(new Event("change",{bubbles:true}));true');
   assert.equal(await js('document.getElementById("timer-digits").textContent'),'10:00:00');await capture(theme+'-timer-custom');
   await js('document.querySelector(".nt-custom").open=false;document.getElementById("nt-timer-reset").click();document.getElementById("timer-start").click();true');await wait(90);
   assert.equal(await js('window.nero.__snapshot().timer.status'),'running');
   await js('window.nero.__timerElapsed(.5);true');await wait(500);
   assert.equal(await js('document.querySelector(".nt-progress").getAttribute("aria-valuenow")'),'50');
   assert.equal(await js('document.querySelectorAll(".nt-progress .passed").length'),3);await capture(theme+'-timer-progress');
   await js('document.getElementById("timer-pause").click();true');await wait(100);assert.equal(await js('window.nero.__snapshot().timer.status'),'paused');await capture(theme+'-timer-paused');
   await js('document.getElementById("timer-resume").click();true');await wait(80);assert.equal(await js('window.nero.__snapshot().timer.status'),'running');
   await js('document.getElementById("timer-cancel").click();true');await wait(80);assert.equal(await js('window.nero.__snapshot().timer.status'),'idle');
   for(const rarity of ['yaygin','siradisi','nadir','efsanevi']){
    await select('badges');await js(`document.querySelector('[data-rarity=${rarity}]').click();true`);
    assert.ok(await js('document.querySelectorAll(".badge-icon .nt-icon").length===document.querySelectorAll(".badge-icon").length'));
   }
   await select('home');await js('document.querySelector(".week .section-help").click();true');assert.equal(await js('document.getElementById("section-tooltip-layer").hidden'),false);
   await js('document.querySelector(".week .section-help").click();true');const jar=await js('window.nero.__snapshot().jarCount');
   await js('document.getElementById("jar-input").value="Güzel bir an";document.getElementById("jar-form").requestSubmit();true');await wait(80);assert.equal(await js('window.nero.__snapshot().jarCount'),jar+1);
   await js('document.querySelector(".tabs [data-tab=home]").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}));true');assert.equal(await js('document.documentElement.dataset.tab'),'notes');
   for(const tab of ['home','settings']){await select(tab);await js(`document.getElementById('view-${tab}').scrollTop=650;true`);await capture(theme+'-'+tab+'-more');}
   await js(`window.nero.invoke('settings:set','sceneBg',false);true`);await wait(80);assert.ok(await js('document.body.classList.contains("nt-no-scene")&&getComputedStyle(document.querySelector(".hello")).backgroundImage==="none"'));
   await js(`window.nero.invoke('settings:set','sceneBg',true);true`);await wait(80);assert.equal(await js('document.body.classList.contains("nt-no-scene")'),false);
   report.actions[theme]={notes:true,todos:true,timer:true,badges:true,jar:true,keyboard:true,sceneSetting:true};
  }
  await change('default');assert.equal(await js('document.body.classList.contains("nt-theme")'),false);
  assert.equal(await js('document.getElementById("timer-custom").closest(".custom").parentElement.id'),'presets');
  assert.equal(await js('document.getElementById("st-days").closest(".tile").parentElement.className'),'tiles');
  await change('biletini-sakla');await select('notes');assert.ok(await js('document.getElementById("bs-new-note").offsetWidth>0'));
  for(const theme of [...themes,...themes]){await change(theme);assert.equal(await js('document.querySelectorAll("#nt-new-note").length'),1);}
  for(const theme of themes){
   await change(theme);await select('home');
   await js('(()=>{const snapshot=window.nero.__snapshot();window.NeroThemeTrio.update(snapshot,25);window.NeroThemeTrio.update(snapshot,25);return true;})()');
   assert.ok(await js('[...document.querySelectorAll("#notes-list>li:not(.new-note)")].every(n=>n.querySelectorAll(".nt-note-art").length===1)'));
   assert.ok(await js('[...document.querySelectorAll("#week-bars .bar")].every(n=>n.querySelectorAll(".nt-bar-value").length===1)'));
  }
  report.themeSwitching=true;
  await js('window.nero.__empty();true');
  for(const theme of themes){await change(theme);await select('notes');assert.equal(await js('document.getElementById("nt-note-peek").hidden'),true);await capture(theme+'-notes-empty');await select('todos');assert.equal(await js('document.getElementById("todos-empty").hidden'),false);}
  report.emptyData=true;win.close();win=null;
  const tm=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:null});tm.scan();let quickTheme=themes[0],records=[];
  ipcMain.handle('theme:get',()=>({manifest:tm.get(quickTheme).manifest}));
  ipcMain.handle('quick:addTodo',(_e,text)=>records.push({type:'todo',text}));ipcMain.handle('quick:addNote',(_e,text)=>records.push({type:'note',text}));ipcMain.on('quick:close',()=>{});
  quick=new BrowserWindow({width:380,height:96,show:true,frame:false,webPreferences:{preload:path.join(root,'src/preload/quick-preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false}});
  await quick.loadFile(path.join(root,'src/renderer/quick/index.html'));quick.setContentSize(380,96);await wait(500);
  const qjs=code=>quick.webContents.executeJavaScript(code);
  for(const theme of themes){quickTheme=theme;quick.webContents.send('theme',{manifest:tm.get(theme).manifest});await wait(150);
   assert.equal(await qjs('document.documentElement.dataset.skin'),theme);
   assert.ok(await qjs('document.documentElement.scrollWidth<=380&&document.documentElement.scrollHeight<=96'));
   assert.ok(await qjs('(()=>{const r=document.getElementById("input").getBoundingClientRect(),b=document.querySelector(".box").getBoundingClientRect();return r.bottom<=b.bottom-4&&r.right<=b.right&&r.height>=27&&b.bottom<=innerHeight})()')); 
   fs.writeFileSync(path.join(out,theme+'-quick-capture.png'),(await quick.webContents.capturePage()).toPNG());
  }
  await qjs('document.dispatchEvent(new KeyboardEvent("keydown",{key:"Tab",bubbles:true}));document.getElementById("input").value="Hızlı not kontrolü";document.getElementById("form").requestSubmit();true');await wait(100);assert.deepEqual(records,[{type:'note',text:'Hızlı not kontrolü'}]);report.quickCapture=true;quick.close();quick=null;
  assert.equal(report.assets.length,19);assert.equal(report.viewportChecks,72);assert.deepEqual(report.rendererErrors,[]);report.passed=true;
  fs.writeFileSync(path.join(root,'docs/theme-trio/ui-verification.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS: 72 viewport checks, 19 local assets, notes/tasks/real timer, theme switching, empty data and quick capture.');app.exit(0);
 }catch(e){report.error=e.stack;fs.writeFileSync(path.join(root,'docs/theme-trio/ui-verification.json'),JSON.stringify(report,null,2)+'\n');console.error(e);win?.destroy();quick?.destroy();app.exit(1);}
});
