import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,add,mat} from './models.js';
import {burger} from './models-v2.js';
export const dinerPalettes={krusty:{body:0x399d95,door:0x8cc8b1,accent:0xe27756},mint:{body:0x3f9f9b,door:0x91c7b3,accent:0xdb7352},coral:{body:0xcf6750,door:0xeaa780,accent:0x319d9b},blue:{body:0x397caa,door:0x91bfd2,accent:0xe7ad45}};
export function cartoonBurgerStation(style='mint'){
 const g=new T.Group();g.name='cartoon-burger-station';const nautical=style==='krusty';g.userData.nautical=nautical;g.userData.stationDesign='krusty-nautical';const p=dinerPalettes[style],cream=mat(0xffe8b4,{roughness:.65}),body=mat(p.body,{roughness:.48}),door=mat(p.door,{roughness:.60}),brass=mat(0xd8ab57,{metalness:.3,roughness:.45});
 for(const x of [-.92,.92])for(const z of [-.36,.36]){cylinder(g,.052,.066,.19,brass,x,.10,z,20);ball(g,.062,0x365e61,x,.043,z,[1,.45,1]);}
 box(g,2.25,.75,1.02,body,0,.55,0,nautical?.085:.055);
 box(g,2.29,.07,1.06,cream,0,.21,0,.023);
 for(const x of [-.54,.54]){box(g,1.015,.40,.045,cream,x,.50,.529,.025);box(g,.927,.322,.015,door,x,.50,.557,.025);box(g,nautical?.22:.28,.045,.068,brass,x,nautical?.647:.55,.582,.018);
 if(nautical){const port=add(g,new T.TorusGeometry(.116,.021,12,48),brass,x,.467,.588);port.name='brass-porthole';const glass=cylinder(g,.099,.099,.018,new T.MeshStandardMaterial({color:0x326d79,roughness:.22,metalness:.1}),x,.467,.583,40);glass.rotation.x=Math.PI/2;ball(g,.041,0x9edfd7,x-.025,.497,.60,[.3,1,.15]);for(let i=0;i<6;i++){const a=i*Math.PI/3;ball(g,.011,0xffe9a8,x+Math.cos(a)*.116,.467+Math.sin(a)*.116,.61,[1,1,.5]);}}
 }
 box(g,2.25,.165,.08,cream,0,.824,.537,.034);
 for(const x of [-.76,-.26,.26,.76]){const knob=cylinder(g,.061,.061,.048,p.accent,x,.834,.594,32);knob.rotation.x=Math.PI/2;box(g,.013,.035,.012,0xfff5cf,x,.849,.624,.004);}
 box(g,2.40,.092,1.14,cream,0,.963,0,.036);
 box(g,1.61,.028,.83,0x28434a,-.18,1.024,.018,.018);
 for(let i=0;i<15;i++)box(g,.022,.012,.74,0x557074,-.87+i*.104,1.045,.018,.006);
 box(g,.40,.024,.82,0xe0bd78,.93,1.023,0,.024);
 const ready=burger();ready.scale.setScalar(.66);ready.position.set(.93,1.045,.11);ready.userData.displayFood=true;g.add(ready);
 for(const [x,z]of [[-.55,-.10],[.18,.16]]){cylinder(g,.17,.175,.045,0x945331,x,1.066,z,32).userData.cookingFood=true;for(let i=0;i<3;i++)box(g,.015,.003,.22,0x5e3722,x-.07+i*.06,1.091,z,.002).userData.cookingFood=true;}
 box(g,2.27,.23,.075,body,0,1.15,-.505,.023);box(g,2.27,.036,.084,brass,0,1.278,-.505,.009);
 // Integrated rounded enamel hood: broad canopy and a compact chimney.
 box(g,1.30,.68,.43,body,0,2.34,-.26,.06);
 box(g,2.40,.22,.94,cream,0,1.99,-.13,.060);
 box(g,2.21,.066,.038,p.accent,0,1.958,.355,.025);
 for(let i=0;i<11;i++)box(g,.065,.13,.026,0x4a7775,-.64+i*.128,2.34,-.031,.015);
 for(const x of [-.72,.72]){ball(g,.11,new T.MeshStandardMaterial({color:0xffdf92,emissive:0xffb957,emissiveIntensity:.45}),x,1.876,-.04,[1,.19,1]);}
 const lamp=new T.PointLight(0xffd48d,1.1,3);lamp.position.set(0,1.85,0);g.add(lamp);
 // Small burger emblem; the front does not need an oversized text plaque.
 const c=document.createElement('canvas');c.width=128;c.height=128;const ctx=c.getContext('2d');ctx.fillStyle='#fff0c9';ctx.beginPath();ctx.roundRect(4,4,120,120,24);ctx.fill();ctx.strokeStyle='#d5a652';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#eda845';ctx.beginPath();ctx.ellipse(64,52,38,22,0,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#79ad66';ctx.fillRect(27,55,74,8);ctx.fillStyle='#7b4a2d';ctx.fillRect(28,65,72,10);ctx.fillStyle='#edaa52';ctx.beginPath();ctx.roundRect(29,78,70,13,6);ctx.fill();for(const [x,y]of [[44,40],[61,36],[77,43],[88,47]]){ctx.fillStyle='#fff3d2';ctx.fillRect(x,y,3,2);}const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;
 if(nautical){ctx.clearRect(0,0,128,128);ctx.fillStyle='#ffe8b3';ctx.beginPath();ctx.roundRect(3,3,122,122,26);ctx.fill();ctx.strokeStyle='#d59f45';ctx.lineWidth=5;ctx.stroke();ctx.fillStyle='#e5a33f';ctx.beginPath();ctx.ellipse(64,50,34,21,0,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#79a850';ctx.fillRect(30,53,68,7);ctx.fillStyle='#72442a';ctx.fillRect(31,62,66,8);ctx.fillStyle='#e6a451';ctx.fillRect(32,73,64,9);ctx.fillStyle='#1e7279';ctx.textAlign='center';ctx.font='bold 13px Georgia';ctx.fillText('KRABBY PATTY',64,105);map.needsUpdate=true;}
 if(nautical)box(g,.46,.35,.038,brass,0,2.025,.394,.035);
 add(g,new T.PlaneGeometry(nautical?.43:.25,nautical?.32:.25),new T.MeshStandardMaterial({map,roughness:.8,transparent:true,alphaTest:.05}),0,nautical?2.025:2.009,.420);
 if(nautical){
 const anchor=new T.Group();anchor.name='nautical-anchor';anchor.position.set(1.154,.58,-.02);anchor.rotation.y=Math.PI/2;g.add(anchor);
 add(anchor,new T.TorusGeometry(.035,.009,8,24),brass,0,.12,.01);box(anchor,.02,.17,.025,brass,0,.018,.01,.007);box(anchor,.16,.016,.025,brass,0,.035,.01,.006);
 const points=[[-.105,-.025,0],[-.07,-.065,0],[0,-.09,0],[.07,-.065,0],[.105,-.025,0]].map(v=>new T.Vector3(...v));add(anchor,new T.TubeGeometry(new T.CatmullRomCurve3(points),24,.012,8),brass,0,0,.01);
 for(const x of [-.105,.105]){const tip=box(anchor,.033,.045,.025,brass,x,-.021,.01,.006);tip.rotation.z=x<0?-.6:.6;}
 const glow=box(g,1.52,.001,.73,new T.MeshStandardMaterial({color:0xf29d40,emissive:0xeb7d24,emissiveIntensity:.35,transparent:true,opacity:.22,depthWrite:false}),-.18,1.039,.018,.005);glow.name='warm-grill-glow';
 }

 const tool=new T.Group();tool.position.set(-1.18,.88,.18);g.add(tool);box(tool,.055,nautical?.48:.35,.038,0x996232,0,.05,0,.012);box(tool,nautical?.16:.13,nautical?.22:.19,.024,cream,0,nautical?-.27:-.19,0,.025);for(const x of [-.035,0,.035])box(tool,.015,.12,.008,0x608e90,x,nautical?-.265:-.185,.018,.004);
 for(let i=0;i<3;i++){const points=[];for(let k=0;k<=12;k++)points.push(new T.Vector3(Math.sin(k*.42+i)*.022,k*.028,0));const steam=add(g,new T.TubeGeometry(new T.CatmullRomCurve3(points),20,.012,6),new T.MeshBasicMaterial({color:0xfff6dd,transparent:true,opacity:.20,depthWrite:false}),-.48+i*.31,1.12,-.04);steam.userData.steam=i;steam.castShadow=false;}
 return g;
}
