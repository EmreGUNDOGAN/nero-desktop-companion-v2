// Real character renderer and production preload; isolated from user data.
const {app,BrowserWindow,protocol,net,ipcMain}=require('electron');
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const {pathToFileURL}=require('node:url');
const {ThemeManager}=require('../src/main/themes');
const root=path.join(__dirname,'..'),wait=ms=>new Promise(r=>setTimeout(r,ms));
const report={passed:false,themes:[],rendererErrors:[]};
protocol.registerSchemesAsPrivileged([{scheme:'nero-theme',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
app.whenReady().then(async()=>{let win;try{
 protocol.handle('nero-theme',req=>{const u=new URL(req.url),file=path.resolve(root,'themes',u.hostname,'.'+decodeURIComponent(u.pathname));assert.ok(file.startsWith(path.join(root,'themes')+path.sep));return net.fetch(pathToFileURL(file).href);});
 const tm=new ThemeManager({builtinDir:path.join(root,'themes'),userDir:null});tm.scan();
 let ready=false;ipcMain.on('char:ready',()=>ready=true);
 win=new BrowserWindow({width:280,height:444,show:true,frame:false,transparent:true,webPreferences:{preload:path.join(root,'src/preload/preload.js'),contextIsolation:true,sandbox:true,nodeIntegration:false}});
 win.webContents.on('console-message',(_e,l,m)=>{if(l>=3)report.rendererErrors.push(m);});
 await win.loadFile(path.join(root,'src/renderer/character/index.html'));win.setContentSize(280,444);await wait(200);assert.ok(ready);
 for(const theme of ['arcade-molasi','yorunge','serada-bir-gun']){
  const manifest=tm.get(theme).manifest,s=220/manifest.canvas.width,charW=220,charH=manifest.canvas.height*s;
  const layout={width:280,height:150+charH+34,scale:s,charW,charH,charX:30,charY:150,bubbleZone:150,bubbleWidth:260,badgeZone:34};
  win.setContentSize(280,Math.ceil(layout.height));
  win.webContents.send('theme',{manifest,layout});win.webContents.send('settings',{sound:false,ambientSound:false,characterAnimations:false,showTimerBadge:true});win.webContents.send('baseline',{expr:'normal',asleep:false,outfit:null});
  win.webContents.send('timer',{status:'running',remainingMs:750000});win.webContents.send('say',{id:'qa',text:'Küçük bir adım yeter.',expr:'normal'});await wait(800);
  const check=await win.webContents.executeJavaScript(`(()=>{const b=document.getElementById('bubble').getBoundingClientRect();return {skin:document.documentElement.dataset.skin,bubble:document.getElementById('bubble').classList.contains('show'),badge:document.getElementById('badge').textContent,inside:b.left>=0&&b.right<=innerWidth,images:[...document.querySelectorAll('.layer')].every(i=>i.complete&&i.naturalWidth>0)}})()`);
  assert.equal(check.skin,theme);assert.ok(check.bubble&&check.inside&&check.images);assert.equal(check.badge,'12:30');report.themes.push({theme,...check});
  fs.writeFileSync(path.join(root,'docs/theme-trio/screens',theme+'-character.png'),(await win.webContents.capturePage()).toPNG());
 }
 assert.deepEqual(report.rendererErrors,[]);report.passed=true;fs.writeFileSync(path.join(root,'docs/theme-trio/character-verification.json'),JSON.stringify(report,null,2)+'\n');console.log('PASS: three character skins, real speech, timer badge and all inherited image layers.');win.close();app.exit(0);
}catch(e){report.error=e.stack;fs.writeFileSync(path.join(root,'docs/theme-trio/character-verification.json'),JSON.stringify(report,null,2)+'\n');console.error(e);win?.destroy();app.exit(1);}});
