import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder} from './models.js';

function surface(base,grain=false){
 const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d');x.fillStyle=base;x.fillRect(0,0,512,256);
 for(let i=0;i<(grain?90:3500);i++){
  if(grain){x.beginPath();for(let k=0;k<=64;k++){const px=k*8,y=i*3+Math.sin(k*.19+i)*1.3+Math.sin(k*.41+i)*.6;k?x.lineTo(px,y):x.moveTo(px,y);}x.strokeStyle=i%4?'rgba(51,26,12,.13)':'rgba(255,209,133,.12)';x.lineWidth=i%6?.6:1.1;x.stroke();}
  else{x.fillStyle=i%2?'rgba(255,255,255,.08)':'rgba(60,55,66,.06)';x.fillRect((i*73)%512,(i*41+i%7)%256,1,1);}
 }
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;
 return new T.MeshStandardMaterial({map,roughness:grain?.77:.59});
}
const oak=surface('#a97037',true),frame=surface('#855127',true),inset=surface('#94602e',true),stone=surface('#d3d0ca'),lip=surface('#a9aca9');
export function shackCounter(width=4.3,depth=1.33,{cabinet=false}={}){
 const g=new T.Group();g.name='oak-stone-counter';
 box(g,width,.91,depth-.14,frame,0,.50,0,.025);
 const sections=Math.max(1,Math.round(width/1.1)),sectionWidth=width/sections;
 for(let i=0;i<sections;i++){
  const x=-width/2+sectionWidth*(i+.5);
  for(const side of [-1,1]){
   box(g,sectionWidth-.095,.67,.027,inset,x,.52,side*(depth/2-.048),.012);
   for(const y of [.36,.67])box(g,sectionWidth-.13,.285,.018,oak,x,y,side*(depth/2-.025),.009);
  }
 }
 for(const side of [-1,1]){
  for(const y of [.14,.89])box(g,width,.088,.063,frame,0,y,side*(depth/2-.013),.014);
  for(let i=0;i<=sections;i++)box(g,.072,.78,.066,frame,-width/2+i*sectionWidth,.51,side*(depth/2-.012),.011);
 }
 for(const side of [-1,1])box(g,.038,.70,depth-.22,oak,side*(width/2+.002),.52,0,.012);
 box(g,width+.12,.045,depth+.03,lip,0,.963,0,.012);
 box(g,width+.16,.085,depth+.09,stone,0,1.0175,0,.027);
 if(cabinet)for(let i=0;i<sections;i++)ball(g,.027,0xc5a06a,-width/2+(i+.5)*sectionWidth,.73,depth/2+.015,[1,1,.45]);
 g.userData.footprint={width:width+.16,depth:depth+.09};return g;
}
export const shackCashCounter=()=>shackCounter(2.30,.90);
export const shackDrinkBench=()=>shackCounter(2.25,1.0,{cabinet:true});
export const shackPickupCounter=()=>shackCounter(4.30,1.25);
export function flatPass(){const g=new T.Group();g.name='flat-service-pass';box(g,2.4,.022,.74,0x859f9e,0,0,0,.012);return g;}
export function counterCondiments(){const g=new T.Group();for(const [i,color]of [0xc54a32,0xe8b638,0x368894].entries()){const x=(i-1)*.13;cylinder(g,.052,.047,.23,color,x,.115,0,20);cylinder(g,.022,.033,.06,color,x,.26,0,16);}return g;}
