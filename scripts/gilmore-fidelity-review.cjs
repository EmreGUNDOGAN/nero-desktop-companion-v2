const {app,BrowserWindow,protocol,net}=require('electron'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const root=path.join(__dirname,'..'),out=path.join(root,'docs/reference-rebuild/stars-hollow/screens'),wait=ms=>new Promise(r=>setTimeout(r,ms));
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,corsEnabled:true,supportFetchAPI:true}}]);app.on('window-all-closed',()=>{});
app.whenReady().then(async()=>{try{fs.mkdirSync(out,{recursive:true});protocol.handle('nero-theme',req=>{const u=new URL(req.url);return net.fetch(pathToFileURL(path.join(root,'themes',u.hostname,decodeURIComponent(u.pathname))).href);});
const win=new BrowserWindow({width:600,height:1500,show:false,frame:false,webPreferences:{offscreen:true,backgroundThrottling:false,preload:path.join(root,'test/all-features-preload.cjs'),sandbox:false,contextIsolation:true}}),js=c=>win.webContents.executeJavaScript(c);
await win.loadFile(path.join(root,'src/renderer/panel/index.html'));await wait(350);await js('window.nero.invoke("settings:set","themeId","stars-hollow");true');await wait(150);
const report=[];
for(const [width,height]of [[380,660],[600,800],[900,900]]){win.setContentSize(width,height);for(const page of ['home','notes','todos','timer','badges']){await js(`document.querySelector('.tabs [data-tab=${page}]').click();document.getElementById('view-${page}').scrollTop=0;true`);await wait(120);
 const data=await js(`(()=>{const view=document.getElementById('view-${page}'),r=view.getBoundingClientRect();return {page:'${page}',width:${width},overflow:view.scrollWidth-view.clientWidth,offenders:[...view.querySelectorAll('*')].filter(n=>n.getBoundingClientRect().right>r.right+1).map(n=>({tag:n.tagName,cls:n.className,text:n.textContent.slice(0,50),right:n.getBoundingClientRect().right,width:n.getBoundingClientRect().width})).slice(0,10),font:getComputedStyle(view).fontFamily,heading:(()=>{const n=document.getElementById('hello'),s=getComputedStyle(n);return {background:s.background,top:s.top,font:s.font,position:s.position,height:s.height}})()}})()`);report.push(data);
 if(width===600){const full=await js(`document.getElementById('view-${page}').scrollHeight+130`);win.setContentSize(600,Math.min(4500,Math.max(1000,full)));await wait(100);}
 fs.writeFileSync(path.join(out,page+'-'+width+'.png'),(await win.webContents.capturePage()).toPNG());if(width===600)win.setContentSize(width,height);
}}
fs.writeFileSync(path.join(out,'layout-review.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report.filter(r=>r.overflow>2)));win.destroy();app.exit(0);
}catch(e){console.error(e);app.exit(1);}});
