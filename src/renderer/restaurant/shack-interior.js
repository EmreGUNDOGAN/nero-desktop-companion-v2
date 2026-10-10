import * as T from './vendor/three.module.min.js';
import {box,add} from './models.js';

// Reference study: painted timber dining floor, pale kitchen tile and ship windows.
function timber(base,seed){
 const c=document.createElement('canvas');c.width=1024;c.height=128;const ctx=c.getContext('2d');
 let n=seed;const rnd=()=>{n=(Math.imul(n,1664525)+1013904223)>>>0;return n/4294967296;};
 ctx.fillStyle=base;ctx.fillRect(0,0,c.width,c.height);
 for(let i=0;i<100;i++){const y=rnd()*128;ctx.beginPath();for(let x=0;x<=1024;x+=8){const py=y+Math.sin(x*.013+i)*1.8+Math.sin(x*.031+i)*.7;x?ctx.lineTo(x,py):ctx.moveTo(x,py);}ctx.strokeStyle=i%4?'rgba(24,45,24,.11)':'rgba(255,234,162,.16)';ctx.lineWidth=.5+rnd();ctx.stroke();}
 for(let i=0;i<3;i++){const x=100+rnd()*824,y=20+rnd()*88;for(let r=1;r<5;r++){ctx.beginPath();ctx.ellipse(x,y,r*7,r*1.5,.02,0,Math.PI*2);ctx.strokeStyle='rgba(30,40,19,.11)';ctx.stroke();}}
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;
 return new T.MeshStandardMaterial({map,roughness:.78});
}
export function buildShackInterior(room){
 const g=new T.Group();g.name='reference-shack-interior';room.add(g);
 const wood=timber('#a87335',22),dark=timber('#77502b',14);
 box(g,26,.28,28,dark,0,-.16,0,.03);
 const colors=['#68875a','#718f60','#648257','#7b9565','#6e895b','#80966b'];
 const geo=new T.BoxGeometry(3.23,.026,.64);
 for(let tone=0;tone<colors.length;tone++){
  const transforms=[];
  for(let row=0;row<43;row++)for(let col=0;col<9;col++){
   if((row*7+col*3)%6!==tone)continue;
   const left=Math.max(-12.8,-14.45+col*3.26+(row%3)*1.08),right=Math.min(12.8,-11.22+col*3.26+(row%3)*1.08);
   if(right<=left)continue;
   transforms.push(new T.Matrix4().compose(new T.Vector3((left+right)/2,.008,-13.55+row*.65),new T.Quaternion(),new T.Vector3((right-left)/3.23,1,1)));
  }
  const mesh=new T.InstancedMesh(geo,timber(colors[tone],tone+50),transforms.length);transforms.forEach((m,i)=>mesh.setMatrixAt(i,m));mesh.receiveShadow=true;g.add(mesh);
 }
 // Kitchen overlay preserves the existing walkable coordinates and station heights.
 box(g,25.6,.025,9.3,0xb8b6ad,0,.035,-9.25,.002);
 for(let row=0;row<9;row++)for(let col=0;col<25;col++){
  const tile=box(g,1.012,.008,1.012,[0xe9e5da,0xe4e1d7,0xeee9df][(row*3+col)%3],-12.27+col*1.023,.053,-13.38+row*1.023,.001);tile.receiveShadow=true;
 }
 // Tiled back wall with structural oak beams.
 box(g,26,3.2,.20,0xb6c3c3,0,1.6,-13.9,.01);
 for(let row=0;row<5;row++)for(let col=0;col<41;col++)box(g,.622,.622,.014,[0xd2dddd,0xcbd7d7,0xd8e1dd][(row+col)%3],-12.65+col*.633,.32+row*.633,-13.787,.001);
 for(const x of [-12.9,-6.45,0,6.45,12.9])box(g,.24,3.48,.36,wood,x,1.68,-13.9,.024);
 box(g,26.4,.26,.40,wood,0,3.36,-13.9,.025);
 const glass=new T.MeshStandardMaterial({color:0xb9e4e3,transparent:true,opacity:.32,roughness:.24,side:T.DoubleSide,depthWrite:false});
 const shine=new T.MeshBasicMaterial({color:0xf5fff1,transparent:true,opacity:.18,side:T.DoubleSide,depthWrite:false});
 // Full wall on the far side; near-side rail keeps the restaurant readable in cutaway view.
 for(let i=0;i<7;i++){
  const z=-11.8+i*3.9;
  const pane=box(g,.024,2.30,3.50,glass,-12.9,1.86,z,.001);pane.castShadow=false;
  const stripe=add(g,new T.PlaneGeometry(.18,2.6),shine,-12.873,1.88,z-.55);stripe.rotation.y=Math.PI/2;stripe.rotation.z=-.40;stripe.castShadow=false;
 }
 for(let i=0;i<=7;i++)box(g,.42,3.50,.28,wood,-12.9,1.70,-13.75+i*3.9,.025);
 for(const y of [.23,.67,3.34])box(g,.43,.25,27.7,wood,-12.9,y,-.1,.025);
 box(g,.24,.42,27.7,wood,12.9,.20,-.1,.02);
 // Low front timber wall, with a clear entrance matching the existing path.
 for(const x of [-7.6,7.6]){box(g,10.25,.44,.24,wood,x,.22,13.8,.025);box(g,10.25,.08,.30,dark,x,.46,13.8,.01);}
 return g;
}
