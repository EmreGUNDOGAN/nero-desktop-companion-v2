const {app,BrowserWindow,protocol,net}=require('electron');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const root=path.join(__dirname,'..'),out=path.join(root,'docs/reference-rebuild/bikini-bottom'),wait=ms=>new Promise(r=>setTimeout(r,ms)),report={passed:false,actions:[],errors:[]};
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,corsEnabled:true,supportFetchAPI:true}}]);
app.whenReady().then(async()=>{let win;try{
 protocol.handle('nero-theme',req=>{const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));assert.ok(file.startsWith(path.join(root,'themes')+path.sep));return net.fetch(pathToFileURL(file).href);});
 win=new BrowserWindow({width:600,height:1000,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(__dirname,'all-features-preload.cjs'),sandbox:false,contextIsolation:true}});
 win.webContents.on('console-message',e=>{if(e.level==='error')report.errors.push(e.message);});const js=c=>win.webContents.executeJavaScript(c);
 await win.loadFile(path.join(root,'src/renderer/panel/index.html'));await wait(300);await js('document.fonts.ready.then(()=>true)');await js('document.querySelector(".tabs [data-tab=home]").click();true');
 assert.equal(await js('document.getElementById("st-today-focus").textContent'),'75 dk');
 assert.ok(await js('document.getElementById("sbf-final-footer").contains(document.getElementById("st-days"))'));
 await js('document.querySelector("#user-mood-calendar button.mood-day").click();true');
 assert.deepEqual(await js('[...document.querySelectorAll("#user-mood-calendar .mood-picker:not([hidden]) .mood-choice")].map(n=>n.title)'),['İyi','İdare eder','Kötü']);
 await js('document.querySelector("#user-mood-calendar .mood-picker:not([hidden]) .mood-yellow").click();true');await wait(100);
 assert.equal(await js('window.nero.__snapshot().moodboard.user.find(d=>d.day===1).value'),'yellow');
 await js('document.querySelector(".nf-mood-modes button:nth-child(2)").click();true');assert.ok(await js('document.querySelector(".user-mood-board").hidden && !document.querySelector(".nero-mood-board").hidden'));
 await js('document.querySelector(".nf-mood-modes button:first-child").click();true');
 await js('document.getElementById("mood-history-toggle").click();true');assert.ok(await js('!document.getElementById("mood-history-popover").hidden'));
 await js(`document.querySelector('#mood-history-years [data-month-key="2026-08"]').click();true`);await wait(100);assert.ok(await js('document.getElementById("moodboard-month").textContent.includes("Ağustos")'));
 assert.equal(await js('document.querySelectorAll("#user-mood-calendar .mood-day").length'),31);
 await js('document.getElementById("moodboard-current").click();true');await wait(100);
 report.actions.push('saved mood choice, user/Nero switch, past month and current month');
 assert.equal(await js('document.querySelectorAll("#archive-list>li").length'),4);await js('document.getElementById("archive-more").open=true;true');assert.equal(await js('document.querySelectorAll("#archive-more-list>li").length'),2);
 assert.ok(await js('(()=>{const a=document.getElementById("archive-more-list").getBoundingClientRect(),q=document.querySelector(".quote").getBoundingClientRect();return a.bottom<=q.top})()'));await js('document.getElementById("archive-more").open=false;true');
 report.actions.push('all archive records accessible and expanded rows stay above quote');
 await js('document.querySelector(".sbf-read-memories").click();true');assert.ok(await js('document.getElementById("nf-dialog").open && document.getElementById("nf-dialog").dataset.kind==="memories"'));assert.equal(await js('window.nero.__snapshot().jarCount'),3);await js('document.getElementById("nf-dialog").close();true');
 report.actions.push('memory dialog does not submit jar form');
 for(const theme of ['scranton','bikini-bottom','stars-hollow','bikini-bottom']){await js(`window.nero.invoke('settings:set','themeId',${JSON.stringify(theme)});true`);await wait(130);}
 assert.ok(await js('document.getElementById("sbf-final-footer").contains(document.getElementById("st-days"))'));assert.equal(await js('document.querySelectorAll(".nf-mood-modes").length'),1);
 for(const width of [380,600,900]){win.setContentSize(width,1000);await wait(80);assert.ok(await js('(()=>{const n=document.getElementById("view-home");return n.scrollWidth<=n.clientWidth+2})()'));assert.equal(await js('new Set([...document.getElementById("desk-grid").children].map(n=>Math.round(n.getBoundingClientRect().top))).size'),1);}
 report.actions.push('theme switching restores native controls; ten shelf objects stay in one row at three widths');
 assert.deepEqual(report.errors,[]);report.passed=true;fs.writeFileSync(path.join(out,'home-functional-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));win.destroy();app.exit(0);
 }catch(e){report.error=e.stack;fs.writeFileSync(path.join(out,'home-functional-verification.json'),JSON.stringify(report,null,2));console.error(e.stack);win?.destroy();app.exit(1);}});
