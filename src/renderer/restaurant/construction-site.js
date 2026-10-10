import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,mat,add} from './models.js';

function beam(p,a,b,color,width=.10){const start=new T.Vector3(...a),end=new T.Vector3(...b),v=end.clone().sub(start);const m=box(p,width,v.length(),width,color,0,0,0,.008);m.position.copy(start.add(end).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),v.normalize());return m;}
function boardTexture(){
 const c=document.createElement('canvas');c.width=1024;c.height=320;const x=c.getContext('2d');
 x.fillStyle='#203f50';x.fillRect(0,0,1024,320);x.strokeStyle='#a8c6c6';x.lineWidth=8;x.strokeRect(14,14,996,292);
 x.fillStyle='#f0c362';x.beginPath();x.roundRect(50,47,125,158,18);x.fill();
 // Construction pictogram is drawn as part of the sign, not an external bitmap.
 x.strokeStyle='#203f50';x.lineWidth=17;x.lineCap='round';x.beginPath();x.moveTo(94,158);x.lineTo(137,103);x.stroke();x.lineWidth=23;x.beginPath();x.moveTo(113,84);x.lineTo(151,113);x.stroke();
 x.textAlign='left';x.textBaseline='middle';x.fillStyle='#fff3d4';x.font='900 61px Nunito, Arial';x.fillText('UNDER',217,89);x.font='900 65px Nunito, Arial';x.fillText('CONSTRUCTION',217,166);
 x.save();x.beginPath();x.rect(28,254,968,40);x.clip();x.fillStyle='#f0c362';x.fillRect(28,254,968,40);x.fillStyle='#344c55';for(let i=-1;i<20;i++){x.beginPath();x.moveTo(i*70,254);x.lineTo(i*70+32,254);x.lineTo(i*70+70,294);x.lineTo(i*70+38,294);x.fill();}x.restore();
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;return t;
}

export function buildConstructionSite(outside){
 const p=new T.Group();p.position.set(31,-.25,-40);outside.add(p);
 box(p,22,.06,18,0xc9b384,0,-.014,0,.06);
 // Real perimeter panels, with a two-panel gap for the site entrance.
 for(const side of [-1,1])for(let i=0;i<8;i++){
  const z=-7.8+i*2.22;box(p,.12,1.40,2.1,0x71999c,side*10.85,.70,z,.02);
  cylinder(p,.065,.065,1.55,0x4f7079,side*10.85,.77,z-1.07);
 }
 for(const side of [-1,1])for(let i=0;i<10;i++){
  if(side===1&&(i===4||i===5))continue;
  const x=-9.7+i*2.15;box(p,2.03,1.4,.12,i%2?0x82a8a5:0x749b9e,x,.7,side*8.75,.02);cylinder(p,.065,.065,1.55,0x4f7079,x-1.03,.77,side*8.75);
 }
 // Half-built foundation and timber frame.
 box(p,9.5,.32,6.8,0xadb8b0,-1,.14,-1,.03);
 for(const x of [-5.6,3.6])for(const z of [-4.2,-1,2.2]){box(p,.21,3.4,.21,0xbe935e,x,1.9,z,.01);ball(p,.095,0xcbbca0,x,.42,z);}
 for(const z of [-4.2,2.2])beam(p,[-5.6,3.52,z],[3.6,3.52,z],0xb08651,.18);
 for(const x of [-5.6,3.6])beam(p,[x,3.52,-4.2],[x,3.52,2.2],0xb08651,.18);
 beam(p,[-5.6,.4,-4.2],[-5.6,3.5,2.2],0x67899a,.075);
 for(let i=0;i<4;i++)box(p,1.7,.44,.28,0xc1c8b7,-4.6+i*2.25,.52,-4.2,.02);
 // Small lattice crane: restrained scale keeps the restaurant as the focus.
 const cx=7.0,cz=-5.1;box(p,2.8,.32,2.5,0x74858c,cx,.16,cz,.05);
 for(const dx of [-.50,.50])for(const dz of [-.50,.50])beam(p,[cx+dx,.3,cz+dz],[cx+dx,7.4,cz+dz],0xd0a344,.09);
 for(let y=.5;y<7.3;y+=1.05){for(const dz of [-.5,.5]){beam(p,[cx-.5,y,cz+dz],[cx+.5,y+1,cz+dz],0xc59b43,.055);beam(p,[cx+.5,y,cz+dz],[cx-.5,y+1,cz+dz],0xc59b43,.055);}for(const dx of [-.5,.5])beam(p,[cx+dx,y,cz-.5],[cx+dx,y+1,cz+.5],0xc59b43,.055);}
 beam(p,[cx-6.3,7.40,cz],[cx+2.6,7.40,cz],0xd4ab4b,.16);beam(p,[cx-6.3,8.05,cz],[cx+2.6,8.05,cz],0xd4ab4b,.13);
 for(let i=0;i<9;i++)beam(p,[cx-6.3+i,7.4,cz],[cx-5.3+i,8.05,cz],0xd4ab4b,.065);
 box(p,1.35,.65,1.35,0x7b8c91,cx+2.1,7.5,cz,.03);beam(p,[cx-5.5,7.40,cz],[cx-5.5,4.3,cz],0x4e6673,.025);const hook=add(p,new T.TorusGeometry(.15,.045,8,16,Math.PI*1.5),mat(0x4e6673),cx-5.5,4.2,cz);hook.rotation.z=-.3;
 // Materials, pallet and cable spools add a readable construction silhouette.
 for(let i=0;i<5;i++)box(p,3.2,.12,.22,0xc39961,-6.6,.18+(i%3)*.13,4.4+Math.floor(i/3)*.40,.02);
 for(let level=0;level<3;level++)for(let col=0;col<3;col++)box(p,.64,.28,.46,0xb97f65,4.9+col*.67,.15+level*.30,4.6,.025);
 for(const x of [4.6,6.2]){const pipe=cylinder(p,.20,.20,1.8,0x8eabb1,x,.25,6.2,16);pipe.rotation.z=Math.PI/2;}
 for(const [x,z]of [[-2,8.6],[2,8.6],[4.5,7.5],[-4.7,7.5]]){box(p,.62,.08,.62,0x7c8175,x,.04,z,.04);cylinder(p,.025,.23,.65,0xe49e49,x,.39,z,16);cylinder(p,.065,.14,.09,0xf6eed8,x,.44,z,16);}
 // Mounted game-style sign with raised frame, bolts and safety stripe.
 for(const x of [-3.65,3.65])box(p,.14,2.5,.14,0x536c76,x,1.25,8.5,.018);
 box(p,7.65,2.50,.24,0x4f6770,0,2.48,8.5,.13);
 const sign=add(p,new T.PlaneGeometry(7.32,2.30),new T.MeshStandardMaterial({map:boardTexture(),roughness:.8}),0,2.5,8.64);sign.castShadow=false;
 for(const x of [-3.55,3.55])for(const y of [1.47,3.51])ball(p,.045,0xdde7d8,x,y,8.68,[1,1,.30]);
 p.updateMatrixWorld(true);const b=new T.Box3().setFromObject(p);
 return {id:'north-east-construction',x:31,z:-40,width:22,depth:18,label:'UNDER CONSTRUCTION',min:b.min.toArray(),max:b.max.toArray(),placeholder:true};
}
