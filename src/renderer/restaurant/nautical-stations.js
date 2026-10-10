import * as T from './vendor/three.module.min.js';
import * as B from './models-v2.js';
import * as K from './kitchen-models.js';
import {soupStation} from './food-models-3.js';
import {box,ball,add,mat} from './models.js';
import {cartoonBurgerStation} from './cartoon-burger-station.js';

const factories={fryer:K.fryer,fish:K.fishStation,warmer:K.warmer,soup:soupStation,hotdog:K.hotdogStation,dough:K.doughBench,oven:K.oven,prep:B.prep,'cold-prep':K.coldPrep,sink:B.sink,fridge:B.fridge,freezer:K.freezer,storage:K.storageRack,coffee:K.coffeeMachine,grinder:K.coffeeGrinder,tea:K.teaBoiler,shake:K.shakeMachine,icecream:K.icecreamMachine,juice:K.juiceMachine,soda:B.sodaMachine,dessert:K.dessertCase,packing:K.packingBench};
const colors={fryer:0x469d98,fish:0x559cac,warmer:0x70a79e,soup:0x538f98,hotdog:0x42a2a0,dough:0x6ba49b,oven:0x377d94,prep:0x6eaa9c,'cold-prep':0x59a995,sink:0x68a8a4,fridge:0x438fa8,freezer:0x62a5a9,storage:0x638d83,coffee:0x397e91,grinder:0x658b91,tea:0x63a0a0,shake:0xb688a6,icecream:0x7eb1a6,juice:0x66a996,soda:0x459a9c,dessert:0x76a69b,packing:0x729d90};
const foodStations=new Set(['fryer','fish','warmer','soup','hotdog','dough','oven','prep','cold-prep','sink','freezer','packing']);
const iconColors={fryer:'#efbd4f',fish:'#56a7ad',soup:'#dc9560',hotdog:'#c67445',oven:'#e0b449',dough:'#e5c773',prep:'#91b66c','cold-prep':'#88b55a',coffee:'#855337',tea:'#83a77b',shake:'#d994ae',icecream:'#e2b495',juice:'#e9b649',soda:'#d48147',dessert:'#cb87a4',packing:'#c79d61'};
function badge(type){
 const c=document.createElement('canvas');c.width=c.height=192;const x=c.getContext('2d');x.clearRect(0,0,192,192);x.fillStyle='#ffedbf';x.beginPath();x.roundRect(5,5,182,182,38);x.fill();x.strokeStyle='#d3a858';x.lineWidth=7;x.stroke();x.fillStyle=iconColors[type]||'#59a2a0';
 if(['fryer','hotdog'].includes(type)){x.beginPath();x.roundRect(57,85,78,64,12);x.fill();x.fillStyle='#efc559';for(let i=0;i<5;i++)x.fillRect(61+i*14,47+i%2*7,9,56);}
 else if(['oven','dough'].includes(type)){x.beginPath();x.arc(96,96,54,0,Math.PI*2);x.fill();x.fillStyle='#c96543';for(let i=0;i<6;i++){const a=i*Math.PI/3;x.beginPath();x.arc(96+Math.cos(a)*32,96+Math.sin(a)*32,8,0,Math.PI*2);x.fill();}}
 else if(['cold-prep','prep'].includes(type)){for(let i=0;i<7;i++){const a=i*2.4;x.beginPath();x.ellipse(96+Math.cos(a)*26,80+Math.sin(a)*22,21,14,a,0,Math.PI*2);x.fill();}x.fillStyle='#55a09b';x.beginPath();x.arc(96,96,50,0,Math.PI);x.fill();}
 else if(['coffee','tea','shake','juice','soda','icecream'].includes(type)){x.beginPath();x.roundRect(64,54,65,84,12);x.fill();x.strokeStyle='#d3a858';x.lineWidth=9;x.beginPath();x.arc(134,92,19,-Math.PI/2,Math.PI/2);x.stroke();x.fillStyle='#fff6d8';x.fillRect(76,66,7,47);}
 else{x.beginPath();x.arc(96,88,48,0,Math.PI);x.fill();x.strokeStyle='#478e92';x.lineWidth=9;x.beginPath();x.moveTo(54,139);x.quadraticCurveTo(96,158,138,139);x.stroke();}
 const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;return new T.MeshStandardMaterial({map,transparent:true,alphaTest:.06,roughness:.8});
}
export function nauticalStation(type){
 if(type==='burger'){const g=cartoonBurgerStation('krusty');g.name='burger-grill';g.scale.set(.97,1,.94);return g;}
 const g=factories[type]?.();if(!g)throw Error('Unknown nautical station '+type);g.updateMatrixWorld(true);
 const bounds=new T.Box3().setFromObject(g),w=bounds.max.x-bounds.min.x,d=bounds.max.z-bounds.min.z,top=bounds.max.y;
 // Preserve the functional geometry and recipe props; recolor only painted metal panels.
 const hsl={};g.traverse(o=>{if(!o.isMesh)return;if(o.geometry.type==='PlaneGeometry'&&o.material.map?.isCanvasTexture){o.visible=false;return;}
  const materials=Array.isArray(o.material)?o.material:[o.material];const cloned=materials.map(m=>{const copy=m.clone();if(!copy.color||copy.transparent||copy.map)return copy;copy.color.getHSL(hsl);if(hsl.l>.27&&hsl.s<.32){const y=o.getWorldPosition(new T.Vector3()).y;copy.color.setHex(y>.89&&y<1.1?0xf9e4bc:y<.20?0xd8ae61:colors[type]);copy.metalness=.08;copy.roughness=.57;}else if(hsl.l<.30&&o.geometry.type==='CylinderGeometry'&&o.position.z>.25){copy.color.setHex(0xdc7655);copy.metalness=.08;}return copy;});o.material=Array.isArray(o.material)?cloned:cloned[0];});
 const front=foodStations.has(type)?Math.min(.58,d/2+.015):bounds.max.z+.012;
 if(foodStations.has(type)&&w>1.3){
  box(g,w*.92,.052,.028,0xffe9bc,0,.24,front,.013);
  for(const side of [-1,1]){const port=add(g,new T.TorusGeometry(.080,.017,10,40),mat(0xd8ad63,{metalness:.28,roughness:.5}),side*w*.23,.55,front+.032);port.name='station-porthole';const pane=add(g,new T.CircleGeometry(.063,32),mat(0x307983,{roughness:.28}),side*w*.23,.55,front+.029);ball(g,.022,0xb4e9de,side*w*.23-.018,.575,front+.037,[.5,1,.2]);for(let i=0;i<4;i++){const a=i*Math.PI/2;ball(g,.008,0xffe6ad,side*w*.23+Math.cos(a)*.08,.55+Math.sin(a)*.08,front+.05,[1,1,.5]);}}
 }
 const y=foodStations.has(type)?.79:Math.max(.20,Math.min(top*.8,top-.08));const size=foodStations.has(type)?.19:Math.min(.17,w*.21);
 add(g,new T.PlaneGeometry(size,size),badge(type),0,y,front+.045);
 g.userData.design='krusty-nautical';return g;
}
export function nauticalHood(){const g=B.hood();g.traverse(o=>{if(!o.isMesh)return;o.material=o.material.clone();if(o.position.y>.40)o.material.color.setHex(0x429c98);else if(o.position.y>.06)o.material.color.setHex(0xffe6b1);});box(g,2.25,.055,.036,0xdf7657,0,.10,.452,.014);return g;}
export const nauticalFactories=Object.fromEntries(['burger',...Object.keys(factories)].map(type=>[type,()=>nauticalStation(type)]));
