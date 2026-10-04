'use strict';
const fs=require('node:fs'),path=require('node:path'),sharp=require('sharp');
const root=path.resolve(__dirname,'../..'),dir=path.join(root,'themes/default/assets/wardrobe'),base=path.dirname(dir);
const designs=require('./designs.json'),theme=require('../../themes/default/theme.json');
const catalog=JSON.parse(fs.readFileSync(path.join(dir,'catalog.json'))),profiles={},ready=[];
const wrap=s=>`<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">${s}</svg>`;
(async()=>{for(const d of designs){
 const out=path.join(dir,d.id),raw=path.join(root,'artwork-v665',d.id+'.png'),cached=path.join(out,'original-blank.png');
 if(!fs.existsSync(raw)&&!fs.existsSync(cached))continue;
 fs.mkdirSync(out,{recursive:true});let png;
 if(fs.existsSync(cached))png=fs.readFileSync(cached);else{
  const {data,info}=await sharp(raw).ensureAlpha().raw().toBuffer({resolveWithObject:true});let minX=info.width,minY=info.height,maxX=0,maxY=0;
  for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if(data[(y*info.width+x)*4+3]>16){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}
  const resized=await sharp(raw).extract({left:minX,top:minY,width:maxX-minX+1,height:maxY-minY+1}).resize(202,242,{fit:'inside'}).png().toBuffer();const m=await sharp(resized).metadata();
  png=await sharp({create:{width:220,height:260,channels:4,background:'#00000000'}}).composite([{input:resized,left:Math.round((220-m.width)/2),top:250-m.height}]).png().toBuffer();fs.writeFileSync(cached,png);
 }
 const {data}=await sharp(png).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 const green=(x,y)=>{const i=(y*220+x)*4;return data[i+3]>220&&data[i]>95&&data[i+1]>data[i]+4&&data[i+1]>data[i+2]+3;};
 let start=0,best=[0,0];for(let y=0;y<205;y++){let n=0;for(let x=103;x<=117;x++)n+=green(x,y);if(n>=9){if(!start)start=y;}else{if(y-start>best[1]-best[0]&&start)best=[start,y];start=0;}}
 if(start&&205-start>best[1]-best[0])best=[start,205];
 const h=best[1]-best[0];if(h<60)throw Error('Cannot measure head '+d.id);
 const ey=Math.round(best[0]+h*.47),my=best[0]+h*.81;let l=110,r=110;while(l>0&&green(l-1,ey))l--;while(r<219&&green(r+1,ey))r++;
 const scale=Math.max(.72,Math.min(1.04,(r-l)/147)),x=(l+r)/2-110*scale,y=ey-108*scale,mouthY=my-172*scale;
 const i=(ey*220+110)*4,skin='#'+[...data.subarray(i,i+3)].map(v=>v.toString(16).padStart(2,'0')).join('');
 profiles[d.id]={x,y,mouthY,scale,skin};
 const body=wrap(`<image width="220" height="260" href="data:image/png;base64,${png.toString('base64')}"/>`);fs.writeFileSync(path.join(out,'body.svg'),body);
 const layers={body:{default:'body.svg'}};
 for(const key of ['eyes','pupils','lids','brows','mouth']){layers[key]={};for(const [variant,spec]of Object.entries(theme.layers[key])){
  const src=typeof spec==='string'?spec:spec.src;let drawing=fs.readFileSync(path.join(base,path.basename(src)),'utf8').replace(/^[\s\S]*?<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
  if(key==='lids')drawing=drawing.replaceAll('#A0B595',skin);
  const file=`${key}-${variant}.svg`;fs.writeFileSync(path.join(out,file),wrap(`<g transform="translate(${x} ${key==='mouth'?mouthY:y}) scale(${scale})">${drawing}</g>`));layers[key][variant]=file;
 }}
 catalog[d.id]={layers};
 const files=['eyes-default.svg','pupils-default.svg','lids-heavy.svg','brows-normal.svg','mouth-neutral.svg'];
 await sharp(Buffer.from(body)).composite(files.filter(f=>fs.existsSync(path.join(out,f))).map(f=>({input:path.join(out,f)}))).png().toFile(path.join(dir,`outfit-${d.id}.png`));ready.push({id:d.id,name:d.name,group:d.group});
}
fs.writeFileSync(path.join(__dirname,'generated-manifest.json'),JSON.stringify(ready.map(d=>({...d,source:'themes/default/assets/wardrobe/'+d.id+'/original-blank.png',method:'built-in image generation; independent native animated face layers'})),null,2)+'\n');
fs.writeFileSync(path.join(dir,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');fs.writeFileSync(path.join(root,'src/main/wardrobe-additions.json'),JSON.stringify(ready,null,2)+'\n');fs.writeFileSync(path.join(__dirname,'new-profiles.json'),JSON.stringify(profiles,null,2)+'\n');console.log('Built '+ready.length+' new outfits; catalog '+Object.keys(catalog).length);
})().catch(e=>{console.error(e);process.exitCode=1});
