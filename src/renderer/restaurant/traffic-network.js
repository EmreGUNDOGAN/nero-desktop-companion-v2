import {closedRoute} from './city-roads.js';
export const transportStops=[
 {id:'market-stop',line:0,x:-102,z:23.9,direction:1,queue:{x:-100.85,z:18.8},exit:{x:-105.8,z:18.8}},
 {id:'krusty-stop',line:0,x:10,z:23.9,direction:1,queue:{x:11.15,z:18.8},exit:{x:6.2,z:18.8}},
 {id:'conch-west',line:1,x:-98,z:123.9,direction:1,queue:{x:-96.85,z:118.8},exit:{x:-101.8,z:118.8}},
 {id:'conch-east',line:1,x:92,z:28.1,direction:-1,queue:{x:90.85,z:33.8},exit:{x:88.2,z:33.8}}
];
export const transportRoutes=[closedRoute([4,5,6,2,1,0]),closedRoute([4,8,9,10,11,7,6,5])];
export function vehiclePolygon(v,p=v){const c=Math.cos(p.heading),s=Math.sin(p.heading);return[[-(v.leftWidth||v.halfWidth),-v.halfLength],[v.rightWidth||v.halfWidth,-v.halfLength],[v.rightWidth||v.halfWidth,v.halfLength],[-(v.leftWidth||v.halfWidth),v.halfLength]].map(([x,z])=>({x:p.x+c*x+s*z,z:p.z-s*x+c*z}));}
export function polygonsOverlap(a,b,padding=0){for(const polygon of [a,b])for(let i=0;i<polygon.length;i++){const p=polygon[i],q=polygon[(i+1)%polygon.length],dx=q.x-p.x,dz=q.z-p.z,len=Math.hypot(dx,dz),nx=-dz/len,nz=dx/len;const ar=a.map(v=>v.x*nx+v.z*nz),br=b.map(v=>v.x*nx+v.z*nz);if(Math.max(...ar)+padding<Math.min(...br)||Math.max(...br)+padding<Math.min(...ar))return false;}return true;}
export function nearVehicle(v,q,r=.45,p=v){const dx=q.x-p.x,dz=q.z-p.z,c=Math.cos(p.heading),s=Math.sin(p.heading),x=dx*c-dz*s,z=dx*s+dz*c;return Math.hypot(Math.max(0,-(v.leftWidth||v.halfWidth)-x,x-(v.rightWidth||v.halfWidth)),Math.max(0,Math.abs(z)-v.halfLength))<r;}
