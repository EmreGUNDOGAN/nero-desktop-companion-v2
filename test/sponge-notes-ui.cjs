const {app,BrowserWindow,protocol,net}=require('electron');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const root=path.join(__dirname,'..'),out=path.join(root,'docs/reference-rebuild/bikini-bottom'),wait=ms=>new Promise(r=>setTimeout(r,ms)),report={passed:false,actions:[],errors:[]};
const profile=path.join(root,'.test-profiles/sponge-notes-ui');fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);app.setPath('sessionData',profile);
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,corsEnabled:true,supportFetchAPI:true}}]);
app.whenReady().then(async()=>{let win;try{
 protocol.handle('nero-theme',req=>{const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));assert.ok(file.startsWith(path.join(root,'themes')+path.sep));return net.fetch(pathToFileURL(file).href);});
 win=new BrowserWindow({width:600,height:1000,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(__dirname,'all-features-preload.cjs'),sandbox:false,contextIsolation:true}});
 win.webContents.on('console-message',e=>{if(e.level==='error')report.errors.push(e.message);});const js=c=>win.webContents.executeJavaScript(c);
 await win.loadFile(path.join(root,'src/renderer/panel/index.html'));await wait(300);await js('document.querySelector(".tabs [data-tab=notes]").click();true');await js('document.fonts.ready.then(()=>true)');
 assert.ok(await js('getComputedStyle(document.getElementById("sb-note-title")).fontFamily.includes("Reference Sponge")'));
 await js('document.getElementById("sb-note-title").value="Türkçe başlık: İşler Şimdi";document.getElementById("sb-note-text").value="Küçük fikirleri kaydet.";document.getElementById("sb-note-title").dispatchEvent(new Event("input",{bubbles:true}));document.getElementById("sb-note-text").dispatchEvent(new Event("input",{bubbles:true}));true');await wait(550);
 assert.equal(await js('window.nero.__snapshot().notes.find(n=>n.id==="n1").body'),'Türkçe başlık: İşler Şimdi\nKüçük fikirleri kaydet.');assert.equal(await js('document.getElementById("sb-saved").dataset.saved'),'true');
 report.actions.push('editable title uses Turkish theme font; title and body autosave');
 await js('document.querySelector("#notes-list [data-sb-note=n2]").dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true}));true');await wait(80);
 assert.equal(await js('document.getElementById("sb-note-title").value'),'Hafta sonu planı');assert.ok(await js('!document.getElementById("notes-list-view").hidden && document.getElementById("note-editor-view").hidden'));
 await js('document.getElementById("sbf-note-format").open=true;document.getElementById("sb-note-text").focus();document.getElementById("sb-note-text").setSelectionRange(0,5);document.querySelector("#sbf-note-format .sb-format button").click();true');await wait(550);
 assert.ok(await js('window.nero.__snapshot().notes.find(n=>n.id==="n2").body.includes("**Biraz**")'));report.actions.push('keyboard selects inline notebook; format toolbar persists edits');
 await js('document.getElementById("sb-new-note").click();true');await wait(120);assert.equal(await js('window.nero.__snapshot().notes.length'),4);assert.equal(await js('document.getElementById("sb-note-title").value'),'Yeni not');
 const newest=await js('window.nero.__snapshot().notes[0].id');assert.ok(await js('!document.getElementById("sb-composer").hidden'));report.actions.push('new note opens editable notebook');
 await js('document.querySelector("#notes-list .nf-menu").click();true');assert.ok(await js('document.getElementById("nf-dialog").open'));
 await js('(()=>{const d=document.getElementById("nf-dialog");d.querySelector("input[type=checkbox]").checked=true;d.querySelector("select").value="İş";d.querySelectorAll("select")[1].value="blue";[...d.querySelectorAll("button")].find(b=>b.textContent==="Kaydet").click();return true})()');await wait(120);
 assert.ok(await js(`(()=>{const n=window.nero.__snapshot().notes.find(n=>n.id===${JSON.stringify(newest)});return n.pinned && n.tag==='İş' && n.color==='blue'})()`));
 await js('document.querySelector("#notes-list .nf-menu").click();true');await js('[...document.querySelectorAll("#nf-dialog button")].find(b=>b.textContent==="Arşivle").click();true');await wait(120);
 assert.ok(await js(`!!window.nero.__snapshot().notes.find(n=>n.id===${JSON.stringify(newest)}).archivedAt`));
 await js('document.getElementById("notes-archive").open=true;document.querySelector("#notes-archive .archive-restore").click();true');await wait(120);
 assert.equal(await js(`window.nero.__snapshot().notes.find(n=>n.id===${JSON.stringify(newest)}).archivedAt`),null);report.actions.push('native note menu saves pin, tag and paper color; archive and restore preserve note');
 for(const theme of ['scranton','stars-hollow','bikini-bottom']){await js(`window.nero.invoke('settings:set','themeId',${JSON.stringify(theme)});true`);await wait(100);}
 assert.equal(await js('document.querySelectorAll("#sb-composer .sb-format").length'),1);assert.equal(await js('document.querySelectorAll(".sbf-notes-footer").length'),1);
 for(const width of [380,600,900]){win.setContentSize(width,1000);await wait(70);assert.ok(await js('(()=>{const n=document.getElementById("view-notes");return n.scrollWidth<=n.clientWidth+2})()'));}
 await js('window.nero.__empty();true');await wait(80);assert.ok(await js('document.getElementById("sb-composer").hidden'));await js('document.getElementById("sb-new-note").click();true');await wait(100);assert.ok(await js('!document.getElementById("sb-composer").hidden'));report.actions.push('theme changes, three widths and empty-to-first-note state remain functional');
 assert.deepEqual(report.errors,[]);report.passed=true;fs.writeFileSync(path.join(out,'notes-functional-verification.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));win.destroy();app.exit(0);
 }catch(e){report.error=e.stack;fs.writeFileSync(path.join(out,'notes-functional-verification.json'),JSON.stringify(report,null,2));console.error(e.stack);win?.destroy();app.exit(1);}});
