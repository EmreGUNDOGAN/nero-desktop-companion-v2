'use strict';
// Official, redistributable Google Fonts, saved locally for offline rendering.
const fs=require('node:fs/promises'),path=require('node:path');
const out=path.join(__dirname,'../src/renderer/fonts');
const files={
 'reference-lilita-one.ttf':'ofl/lilitaone/LilitaOne-Regular.ttf',
 'reference-office-condensed.ttf':'ofl/robotocondensed/RobotoCondensed[wght].ttf',
 'OFL-LilitaOne.txt':'ofl/lilitaone/OFL.txt',
 'OFL-RobotoCondensed.txt':'ofl/robotocondensed/OFL.txt'
};
(async()=>{for(const [file,source] of Object.entries(files)){const response=await fetch('https://raw.githubusercontent.com/google/fonts/main/'+encodeURI(source));if(!response.ok)throw new Error(source+': '+response.status);const buffer=Buffer.from(await response.arrayBuffer());if(file.endsWith('.ttf')&&buffer.readUInt32BE(0)!==0x00010000)throw new Error('Invalid font: '+file);await fs.writeFile(path.join(out,file),buffer);console.log(file+': '+buffer.length+' bytes');}})().catch(e=>{console.error(e.message);process.exitCode=1;});
