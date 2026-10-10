const fs=require('node:fs'),path=require('node:path'),root=path.join(__dirname,'..');
for(const name of ['bee-game-v6.6.0.test.js','bee-game-v6.6.1.test.js','bee-game-v6.6.2.test.js']){const f=path.join(root,'test',name);fs.writeFileSync(f,fs.readFileSync(f,'utf8').replaceAll("'9.6.8'","'6.9.13'"));}
const f=path.join(root,'scripts/extract-tv-assets.cjs');let s=fs.readFileSync(f,'utf8');s=s.replace("laminate:[.015,.666,.065,.035,'timer']","laminate:[.005,.52,.025,.035,'timer']");s=s.replace("fs.writeFileSync(path.join(root,'docs/tv-themes/asset-extraction.json')","const clean=path.join(root,'docs/tv-themes/clean-assets/scranton-home.png');if(fs.existsSync(clean))fs.copyFileSync(clean,path.join(root,'themes/scranton/assets/home.png'));fs.writeFileSync(path.join(root,'docs/tv-themes/asset-extraction.json')");fs.writeFileSync(f,s);
const tv=path.join(root,'src/renderer/panel/tv-themes.js');s=fs.readFileSync(tv,'utf8');s=s.replace("state,selected", "state,selected");
// Flush an edited draft when leaving either family member, including to the sibling theme.
s=s.replace("if(!themes.includes(next)&&mounted){save();restore();}","if(mounted&&next!==which()){save();if(!themes.includes(next))restore();}");
fs.writeFileSync(tv,s);
