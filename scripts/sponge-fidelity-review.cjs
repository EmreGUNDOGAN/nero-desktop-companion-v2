const {app,BrowserWindow,protocol,net}=require('electron');
const fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
process.env.NERO_SPONGE_REVIEW='1';
const root=path.join(__dirname,'..'),out=path.join(root,'docs/reference-rebuild/bikini-bottom/review-r4'),wait=ms=>new Promise(r=>setTimeout(r,ms));
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,corsEnabled:true,supportFetchAPI:true}}]);
app.whenReady().then(async()=>{let win;try{
 fs.mkdirSync(out,{recursive:true});protocol.handle('nero-theme',req=>{const u=new URL(req.url);return net.fetch(pathToFileURL(path.join(root,'themes',u.hostname,decodeURIComponent(u.pathname))).href);});
 win=new BrowserWindow({width:600,height:800,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(root,'test/all-features-preload.cjs'),sandbox:false,contextIsolation:true}});
 const js=code=>win.webContents.executeJavaScript(code),errors=[];win.webContents.on('console-message',e=>{if(e.level==='error')errors.push(e.message);});
 await win.loadFile(path.join(root,'src/renderer/panel/index.html'));await wait(300);await js('window.nero.invoke("settings:set","themeId","bikini-bottom");true');await wait(150);await js('document.querySelector(".tabs [data-tab=home]").click();true');await js('document.fonts.ready.then(()=>true)');
 const report=[];
 for(const [width,height]of [[380,660],[600,800],[900,900]]){
  win.setContentSize(width,height);await wait(120);await js('document.getElementById("view-home").scrollTop=0;true');
  report.push(await js(`(()=>{const n=document.getElementById('view-home');return {width:${width},overflow:n.scrollWidth-n.clientWidth,headingFont:getComputedStyle(document.getElementById('hello')).fontFamily,counter:document.getElementById('st-today-focus').textContent}})()`));
  if(width===600){const full=await js('document.getElementById("view-home").scrollHeight+160');win.setContentSize(600,Math.min(5000,full));await wait(100);}
  fs.writeFileSync(path.join(out,'home-'+width+'.png'),(await win.webContents.capturePage()).toPNG());
  if(width===600){const rect=await js('(()=>{const r=document.getElementById("sbf-home-footer").getBoundingClientRect();return {x:0,y:0,width:600,height:Math.ceil(r.bottom)}})()');fs.writeFileSync(path.join(out,'home-reference-600.png'),(await win.webContents.capturePage(rect)).toPNG());
   const lower=await js('(()=>{const t=document.querySelector(".totals").getBoundingClientRect(),b=document.getElementById("sbf-final-footer").getBoundingClientRect();return {x:Math.floor(t.x),y:Math.floor(t.y),width:Math.ceil(t.width),height:Math.ceil(b.bottom-t.y)}})()');fs.writeFileSync(path.join(out,'home-lower-600.png'),(await win.webContents.capturePage(lower)).toPNG());
   const mood=await js('(()=>{const r=document.getElementById("moodboards-card").getBoundingClientRect();return {x:Math.floor(r.x),y:Math.floor(r.y),width:Math.ceil(r.width),height:Math.ceil(r.height)}})()');fs.writeFileSync(path.join(out,'moodboard-600.png'),(await win.webContents.capturePage(mood)).toPNG());
   await js('document.querySelector(".sbf-read-memories").click();true');const dialog=await js('document.getElementById("nf-dialog").open && document.getElementById("nf-dialog").dataset.kind==="memories"');if(!dialog)throw Error('memory dialog did not open');fs.writeFileSync(path.join(out,'memories-600.png'),(await win.webContents.capturePage()).toPNG());await js('document.getElementById("nf-dialog").close();true');
  }
 }
 if(errors.length)throw Error(errors.join('\n'));if(report.some(r=>r.overflow>2))throw Error('horizontal overflow');fs.writeFileSync(path.join(out,'home-layout-review.json'),JSON.stringify({report,errors},null,2));console.log(JSON.stringify({layouts:report.length,errors}));win.destroy();app.exit(0);
 }catch(e){console.error(e.stack);win?.destroy();app.exit(1);}});
