import * as T from './vendor/three.module.min.js';
import {ball,box,cylinder,mat,add,instancedCopies} from './models.js';
import {transportRoutes,nearVehicle} from './traffic-network.js';

// Empty land is intentional: future buildings may occupy these parcels.
export const expansionZones=[
 {id:'west',x:-45,z:0,width:25,depth:27},
 {id:'east',x:45,z:0,width:25,depth:27},
 {id:'north-west',x:-31,z:-40,width:25,depth:20},
 {id:'north-east',x:31,z:-40,width:25,depth:20},
 {id:'south-west',x:-45,z:46,width:22,depth:20},
 {id:'south-east',x:45,z:46,width:22,depth:20}
];
export const worldArea={width:220,depth:200};
export function extendNeighborhood(outside){
 const points=[];
 // Curving outer reefs surround the reserved land rather than filling it.
 for(let i=0;i<64;i++){
  const a=i*Math.PI*2/64;
  const x=Math.cos(a)*(65+4*Math.sin(i*1.9));
  const z=Math.sin(a)*(58+4*Math.cos(i*1.3));
  if(transportRoutes.some(route=>{for(let s=0;s<route.length;s+=1)if(nearVehicle({halfWidth:1.7,halfLength:3.1},{x,z},5.5,route.point(s)))return true;return false;}))continue;
  if(expansionZones.some(p=>Math.abs(x-p.x)<p.width/2+4&&Math.abs(z-p.z)<p.depth/2+4))continue;
  points.push({x,z,scale:.9+(i%4)*.18});
 }
 const reef=new T.Group();
 for(let i=0;i<3;i++)ball(reef,.36,0x99abb3,i*.45,.01,(i%2)*.3,[1.45,.52,1]);
 for(let i=0;i<5;i++){
  const curve=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3((i-2)*.13,.45,0),new T.Vector3((i-2)*.28,.9+(i%2)*.4,.07)]);
  add(reef,new T.TubeGeometry(curve,10,.055,5,false),mat(0xae88b4));
 }
 outside.add(instancedCopies(reef,points));
 const grass=new T.Group();
 for(let i=0;i<4;i++){
  const curve=new T.CatmullRomCurve3([new T.Vector3(i*.15,0,0),new T.Vector3(i*.15+.15,.65,.08),new T.Vector3(i*.15-.08,1.6+(i%2)*.2,0)]);
  add(grass,new T.TubeGeometry(curve,10,.045,5,false),mat(i%2?0x7fba91:0x569f88));
 }
 outside.add(instancedCopies(grass,points.map((p,i)=>({x:p.x+1.8,z:p.z+1.4,scale:.8+(i%3)*.2}))));
 const rock=new T.Group();ball(rock,1,0xa6b7b5,0,-.12,0,[1.6,.38,1.1]);
 outside.add(instancedCopies(rock,points.filter((_,i)=>i%4===0).map(p=>({x:p.x-2,z:p.z+1,scale:1.3}))));
 // Small sand islands soften the long empty spans without obstructing parcels.
 const mound=new T.Group();ball(mound,1,0xccd1b1,0,-.42,0,[3,.3,2]);
 outside.add(instancedCopies(mound,[[-58,18],[58,18],[-57,-24],[57,-24],[-16,65],[17,65]].map(([x,z])=>({x,z,scale:1.3}))));
 return {worldArea,expansionZones,outerReefClusters:points.length,outerReefPositions:points};
}
