import * as T from './vendor/three.module.min.js';
import {box,ball,add} from './models.js';
const texture=await new T.TextureLoader().loadAsync(new URL('./assets/ezgis-painted-sign-v1.png',import.meta.url).href);
texture.colorSpace=T.SRGBColorSpace;texture.anisotropy=8;
// UV framing excludes the white export margin without editing the source image.
texture.repeat.set(1,460/683);texture.offset.set(0,101/683);
const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#925c2c';ctx.fillRect(0,0,512,128);
for(let i=0;i<62;i++){ctx.beginPath();for(let x=0;x<=512;x+=8){const y=i*2.2+Math.sin(x*.017+i)*1.4;x?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle=i%3?'#7f502833':'#c7945055';ctx.lineWidth=.8;ctx.stroke();}
const woodMap=new T.CanvasTexture(c);woodMap.colorSpace=T.SRGBColorSpace;
const wood=new T.MeshStandardMaterial({map:woodMap,roughness:.78});
export function paintedBrandSign(width=5.8){
 const g=new T.Group();g.name='ezgis-painted-brand-sign';const height=width/(2048/460);
 box(g,width+.25,height+.25,.20,wood,0,0,-.075,.065);
 box(g,width+.07,height+.07,.07,0x177981,0,0,.028,.045);
 add(g,new T.PlaneGeometry(width,height),new T.MeshStandardMaterial({map:texture,roughness:.74}),0,0,.069);
 for(const x of [-width/2+.085,width/2-.085])for(const y of [-height/2+.07,height/2-.07])ball(g,.026,0xe4b767,x,y,.087,[1,1,.42]);
 return g;
}
