import * as T from './vendor/three.module.min.js';
import {box,ball,add} from './models.js';
function plaque(title,width=1.5,height=.30){
 const g=new T.Group();g.name='service-sign-'+title.toLowerCase().replaceAll(' ','-');
 box(g,width+.08,height+.075,.055,0x986334,0,0,0,.03);
 const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*height/width);const x=c.getContext('2d');x.fillStyle='#fff0c6';x.beginPath();x.roundRect(5,5,c.width-10,c.height-10,22);x.fill();x.strokeStyle='#247f84';x.lineWidth=13;x.stroke();x.strokeStyle='#dbb066';x.lineWidth=3;x.beginPath();x.roundRect(17,17,c.width-34,c.height-34,17);x.stroke();
 x.fillStyle='#236f78';x.textAlign='center';x.textBaseline='middle';let size=c.height*.43;x.font=`1000 ${size}px Nunito`;while(x.measureText(title).width>c.width*.76){size-=1;x.font=`1000 ${size}px Nunito`;}x.fillText(title,c.width*.52,c.height*.53);
 // Small painted anchor, so the sign belongs to the nautical station family.
 const cx=c.width*.075,cy=c.height*.50,r=c.height*.11;x.strokeStyle='#d47854';x.lineWidth=c.height*.033;x.lineCap='round';x.beginPath();x.arc(cx,cy-r*1.45,r*.4,0,Math.PI*2);x.moveTo(cx,cy-r);x.lineTo(cx,cy+r*1.5);x.moveTo(cx-r,cy);x.lineTo(cx+r,cy);x.moveTo(cx-r*1.4,cy+r*.5);x.quadraticCurveTo(cx,cy+r*2.3,cx+r*1.4,cy+r*.5);x.stroke();
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;add(g,new T.PlaneGeometry(width,height),new T.MeshStandardMaterial({map,transparent:true,alphaTest:.05,roughness:.78}),0,0,.035);
 for(const a of [-width/2+.045,width/2-.045])ball(g,.012,0xe4bf74,a,0,.043,[1,1,.4]);return g;
}
export function installNauticalServiceSigns(room){
 for(const o of room.children){const id=o.userData.placementId||'';if(id.startsWith('cash-counter-')||id.startsWith('pickup-')){const cash=id.startsWith('cash'),title=cash?'ORDER & PAY':id==='pickup-left'?'READY TO SERVE':'PICK UP',p=plaque(title,cash?1.55:2.1,cash?.29:.32);p.position.set(0,.51,cash?.505:.679);o.add(p);}}
 const ready=plaque('READY FOOD',1.58,.27);ready.position.set(5.05,.50,-6.897);room.add(ready);
}
