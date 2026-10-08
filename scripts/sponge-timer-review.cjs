const {app,BrowserWindow,protocol,net}=require('electron');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
process.env.NERO_SPONGE_TIMER_REVIEW='1';
const root=path.join(__dirname,'..'),out=path.join(root,'docs/reference-rebuild/bikini-bottom/review-timer-r1'),wait=ms=>new Promise(r=>setTimeout(r,ms));
const profile=path.join(root,'.test-profiles/sponge-timer-review');fs.mkdirSync(profile,{recursive:true});app.setPath('userData',profile);app.setPath('sessionData',profile);
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,corsEnabled:true,supportFetchAPI:true}}]);
app.whenReady().then(async()=>{let win;try{
 fs.mkdirSync(out,{recursive:true});protocol.handle('nero-theme',req=>{const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));assert.ok(file.startsWith(path.join(root,'themes')+path.sep));return net.fetch(pathToFileURL(file).href);});
 win=new BrowserWindow({width:600,height:800,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(root,'test/all-features-preload.cjs'),sandbox:false,contextIsolation:true}});
 const js=code=>win.webContents.executeJavaScript(code),errors=[];win.webContents.on('console-message',e=>{if(e.level==='error')errors.push(e.message);});
 await win.loadFile(path.join(root,'src/renderer/panel/index.html'));await wait(300);await js('document.querySelector(".tabs [data-tab=timer]").click();true');await js('document.fonts.ready.then(()=>true)');
 const report=[];
 for(const [width,height]of [[380,660],[600,800],[900,900]]){
  win.setContentSize(width,height);await wait(100);await js('document.getElementById("view-timer").scrollTop=0;true');
  if(width===600){const full=await js('document.getElementById("view-timer").scrollHeight+200');win.setContentSize(width,Math.min(5000,full));await wait(100);}
  report.push(await js(`(()=>{const root=document.getElementById('view-timer');const nodes=['timer-status','timer-digits','timer-label'].map(id=>{const n=document.getElementById(id),r=n.getBoundingClientRect(),s=getComputedStyle(n);return {id,text:n.textContent,inline:n.getAttribute('style'),rect:{x:r.x,y:r.y,width:r.width,height:r.height},maxWidth:s.maxWidth,font:s.font,display:s.display}});return {width:${width},overflow:root.scrollWidth-root.clientWidth,digits:document.getElementById('timer-digits').textContent,resetVisible:document.getElementById('sb-timer-reset').getBoundingClientRect().width>0,nodes}})()`));
  fs.writeFileSync(path.join(out,'timer-'+width+'.png'),(await win.webContents.capturePage()).toPNG());
  if(width===600){const rect=await js('(()=>{const r=document.getElementById("sbf-timer-stage").getBoundingClientRect();return {x:0,y:0,width:600,height:Math.ceil(r.bottom)}})()');fs.writeFileSync(path.join(out,'timer-reference-600.png'),(await win.webContents.capturePage(rect)).toPNG());}
 }
 win.setContentSize(600,1250);await js('document.getElementById("timer-start").click();true');await wait(80);await js('window.nero.__timerElapsed(.7);true');await wait(80);fs.writeFileSync(path.join(out,'timer-running-600.png'),(await win.webContents.capturePage()).toPNG());await js('document.getElementById("sb-timer-reset").click();true');await wait(100);
 assert.ok(report.every(r=>r.overflow<=2&&r.resetVisible));assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'layout-review.json'),JSON.stringify({report,errors},null,2));console.log(JSON.stringify({layouts:report.length,errors}));win.destroy();app.exit(0);
 }catch(e){console.error(e.stack);win?.destroy();app.exit(1);}});
