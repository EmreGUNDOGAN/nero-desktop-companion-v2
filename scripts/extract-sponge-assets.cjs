// Deterministic extraction of the approved, existing artwork. No image generation.
const {app,nativeImage}=require('electron'),fs=require('node:fs'),path=require('node:path');
app.whenReady().then(()=>{const root=path.join(__dirname,'..'),source=nativeImage.createFromPath(path.join(root,'docs/spongebob/approved-concept.png')),size=source.getSize(),dest=path.join(root,'themes/bikini-bottom/assets');fs.mkdirSync(dest,{recursive:true});const scale=size.width/1536;
 const crops={ 'sponge-character':[300,251,208,200], 'sponge-texture':[182,40,140,58], 'home-scene':[30,251,478,200], 'note-yellow-frame':[548,272,436,131], 'note-pink-frame':[550,421,212,142], 'note-blue-frame':[773,421,214,142], 'notebook-frame':[548,580,442,308], 'seabed':[531,888,483,136], 'porthole':[1135,359,310,311], 'bottle':[80,776,81,92], 'sea-flower':[744,196,54,51]};
 for(const [name,rect] of Object.entries(crops)){const [x,y,w,h]=rect.map(n=>Math.round(n*scale));fs.writeFileSync(path.join(dest,name+'.png'),source.crop({x,y,width:w,height:h}).toPNG());}console.log(size,Object.keys(crops));app.exit(0);
});
