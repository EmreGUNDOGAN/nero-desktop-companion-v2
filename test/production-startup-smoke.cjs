// Exercises the real main process and production preload in an isolated profile.
// Show requests are recorded without bringing test windows onto the user's desktop.
const electron=require('electron'),{app,BrowserWindow}=electron,fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const sourceRoot=path.join(__dirname,'..'),resources=process.env.NERO_PACKAGED_RESOURCES,root=resources?path.join(resources,'app.asar'):sourceRoot,profile=path.join(app.getPath('temp'),'nero-startup-check-'+process.pid),errors=[],shown=new Set(),startupTheme=process.env.NERO_STARTUP_THEME||'bikini-bottom';
if(resources){Object.defineProperty(process,'resourcesPath',{value:resources});Object.defineProperty(app,'isPackaged',{get:()=>true});}
app.getAppPath=()=>root;
fs.mkdirSync(profile,{recursive:true});fs.writeFileSync(path.join(profile,'settings.json'),JSON.stringify({themeId:startupTheme,autoUpdate:false,quickCapture:false,panelPinned:true,panelOpen:true,hidden:false,sound:false,ambientSound:false}));
const setPath=app.setPath.bind(app);app.setPath=(key,value)=>setPath(key,key==='userData'?profile:value);
for(const method of ['show','showInactive'])BrowserWindow.prototype[method]=function(){shown.add(this.id);};
process.on('uncaughtException',e=>errors.push(e.stack));process.on('unhandledRejection',e=>errors.push(String(e?.stack||e)));
app.on('web-contents-created',(_,wc)=>wc.on('console-message',e=>{if(e.level==='error')errors.push(e.message);}));
require(path.join(root,'src/main/main.js'));
setTimeout(async()=>{try{const windows=BrowserWindow.getAllWindows(),character=windows.find(w=>w.webContents.getURL().includes('/character/')),panel=windows.find(w=>w.webContents.getURL().includes('/panel/'));
assert.ok(character,'Real startup must create the character');assert.ok(panel,'Pinned panel must reopen');assert.ok(shown.has(character.id),'Startup must request the character to be shown');assert.ok(shown.has(panel.id),'Pinned panel must request display');
const state=await panel.webContents.executeJavaScript('window.nero.invoke("state:get")');assert.ok(state.productivity);assert.equal(state.timer.status,'idle');assert.equal(state.settings.themeId,startupTheme);
await panel.webContents.executeJavaScript('window.nero.invoke("timer:start",5,"Açılış testi")');await new Promise(r=>setTimeout(r,100));const running=await panel.webContents.executeJavaScript('window.nero.invoke("state:get")');assert.equal(running.timer.status,'running');assert.equal(running.productivity.sessions[0].status,'running');await panel.webContents.executeJavaScript('window.nero.invoke("timer:cancel")');
assert.deepEqual(errors,[]);fs.writeFileSync(path.join(sourceRoot,'docs/new-features/'+(resources?'packaged-':'')+'startup-verification-'+startupTheme+'.json'),JSON.stringify({passed:true,realMainProcess:true,packaged:!!resources,isolatedProfile:true,characterCreated:true,pinnedPanelReopened:true,showRequestsRecorded:true,timerSessionStarted:true,errors},null,2));console.log('PASS: real main startup, character, pinned panel, production IPC and timer sessions');app.exit(0);
}catch(e){console.error(e.stack,errors);app.exit(1);}},8000);
