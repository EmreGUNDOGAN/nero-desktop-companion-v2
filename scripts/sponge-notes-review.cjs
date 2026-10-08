const {app,BrowserWindow,protocol,net}=require('electron');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
process.env.NERO_SPONGE_NOTES_REVIEW='1';
const root=path.join(__dirname,'..'),out=path.join(root,'docs/reference-rebuild/bikini-bottom/review-notes-r1'),wait=ms=>new Promise(r=>setTimeout(r,ms));
const profile=path.join(root,'.test-profiles/sponge-notes-review');fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);app.setPath('sessionData',profile);
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,corsEnabled:true,supportFetchAPI:true}}]);
app.whenReady().then(async()=>{let win;try{
 fs.mkdirSync(out,{recursive:true});protocol.handle('nero-theme',req=>{const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));assert.ok(file.startsWith(path.join(root,'themes')+path.sep));return net.fetch(pathToFileURL(file).href);});
 win=new BrowserWindow({width:600,height:800,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(root,'test/all-features-preload.cjs'),sandbox:false,contextIsolation:true}});
 const js=code=>win.webContents.executeJavaScript(code),errors=[];win.webContents.on('console-message',e=>{if(e.level==='error')errors.push(e.message);});
 await win.loadFile(path.join(root,'src/renderer/panel/index.html'));await wait(300);await js('document.querySelector(".tabs [data-tab=notes]").click();true');await js('document.fonts.ready.then(()=>true)');
 const report=[];
 for(const [width,height]of [[380,660],[600,800],[900,900]]){
  win.setContentSize(width,height);await wait(100);await js('document.getElementById("view-notes").scrollTop=0;true');
  if(width===600){const full=await js('document.getElementById("view-notes").scrollHeight+200');win.setContentSize(width,Math.min(5000,full));await wait(100);}
  report.push(await js(`(()=>{const root=document.getElementById('view-notes'),editor=document.getElementById('sb-composer'),r=editor.getBoundingClientRect();return {width:${width},overflow:root.scrollWidth-root.clientWidth,notes:document.querySelectorAll('#notes-list [data-sb-note]').length,bodyOverflow:document.getElementById('sb-note-text').scrollHeight-document.getElementById('sb-note-text').clientHeight,editor:{width:r.width,height:r.height}}})()`));
  fs.writeFileSync(path.join(out,'notes-'+width+'.png'),(await win.webContents.capturePage()).toPNG());
 }
 assert.ok(report.every(r=>r.overflow<=2));assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'layout-review.json'),JSON.stringify({report,errors},null,2));console.log(JSON.stringify({layouts:report.length,errors}));win.destroy();app.exit(0);
 }catch(e){console.error(e.stack);win?.destroy();app.exit(1);}});
