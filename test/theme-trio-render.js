// Development capture of the real renderer with isolated sample records.
const {app,BrowserWindow,protocol,net}=require('electron');
const path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const root=path.join(__dirname,'..'),wait=ms=>new Promise(r=>setTimeout(r,ms));
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
app.whenReady().then(async()=>{
 try{
 protocol.handle('nero-theme',req=>{const u=new URL(req.url);return net.fetch(pathToFileURL(path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname))).href);});
 for(const theme of ['arcade-molasi','yorunge','serada-bir-gun']){
  process.env.NERO_TEST_THEME=theme;
  const win=new BrowserWindow({width:500,height:900,show:true,frame:false,webPreferences:{preload:path.join(__dirname,'theme-trio-preload.js'),contextIsolation:true,sandbox:false}});
  win.webContents.on('console-message',(_e,l,m)=>{if(l>=3)console.error('RENDERER',m)});
  await win.loadFile(path.join(root,'src/renderer/panel/index.html'));win.setContentSize(500,900);win.webContents.setZoomFactor(1);await wait(600);
  const out=path.join(root,'docs/theme-trio/screens');fs.mkdirSync(out,{recursive:true});
  for(const tab of ['home','notes','todos','timer','badges','settings']){
   await win.webContents.executeJavaScript(tab==='settings'?'document.getElementById("settings-button").click();true':`document.querySelector('.tabs [data-tab=${tab}]').click();true`);await wait(300);
   fs.writeFileSync(path.join(out,`${theme}-${tab}.png`),(await win.webContents.capturePage()).toPNG());
  }
  console.log('CAPTURED',theme,await win.webContents.executeJavaScript('JSON.stringify({skin:document.documentElement.dataset.skin,w:innerWidth,h:innerHeight})'));
  win.close();
 }
 app.exit(0);
 }catch(e){console.error(e);app.exit(1);}
});
