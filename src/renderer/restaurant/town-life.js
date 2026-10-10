import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,ring,mat,add,label,fish} from './models.js';
import {createNavigation} from './navigation-grid.js';
import {transportStops} from './traffic-network.js';
import {canonicalMarket,canonicalBank,canonicalPostOffice} from './canonical-buildings.js';
const rect=(x,z,w,d)=>({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
function sign(p,text,w,h,x,y,z,bg,fg){const o=label(text,w,h,bg,fg);o.position.set(x,y,z);p.add(o);}
function bench(){const p=new T.Group();for(const x of [-.95,.95]){box(p,.11,.66,.62,0x587582,x,.32,0,.02);}for(let i=0;i<3;i++)box(p,2.25,.085,.16,0xbd9964,0,.63,-.22+i*.20,.018);for(let i=0;i<3;i++)box(p,2.25,.15,.085,0xbd9964,0,.83+i*.18,-.31,.018);return p;}
function boat(){const p=new T.Group();ball(p,1.2,0xf4e9c9,0,.56,0,[1.6,.35,.68]);box(p,1.25,.36,.85,0xb9655d,0,.85,0,.1);box(p,.65,.35,.10,0x97c9d2,-.2,1.1,-.35,.02);for(const x of [-.95,.95])for(const z of [-.52,.52]){const wheel=cylinder(p,.25,.25,.14,0x395460,x,.27,z,16);wheel.rotation.x=Math.PI/2;ball(p,.11,0xc3d4cf,x,.27,z+(z<0?-.08:.08),[1,1,.3]);}return p;}

export function buildTownLife(outside,{town,construction,environmentProps,placements,tables,seats,city}){
 const existingSceneChildren=[...outside.children];
 const buildings=[],props=[],walkAreas=[],actors=[];
 function obstacle(id,o){o.updateMatrixWorld(true);const b=new T.Box3().setFromObject(o);props.push({id,minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z});return b;}
 function place(id,f,x,z){const o=f();o.position.set(x,-.22,z);outside.add(o);const b=obstacle(id,o);return {o,b};}
 walkAreas.push(...city.walkAreas);
 const benches=[];
 for(const stop of transportStops){const doorZ=stop.z-stop.direction*1.35;walkAreas.push(rect(stop.queue.x,(stop.queue.z+doorZ)/2,4.8,Math.abs(stop.queue.z-doorZ)+2.3));const x=stop.x-4,z=stop.queue.z-stop.direction*1.7;const {o}=place('bus-stop-bench',bench,x,z);benches.push({x,z,o});const p=new T.Group();cylinder(p,.055,.06,2.5,0x628997,0,1.2,0);sign(p,'BUS',.85,.40,0,2.2,.075,'#f1d78c','#345b79');place('bus-stop-post',()=>p,x-1.5,z);}
 const obstacles=[...props,...town.buildings.filter(b=>b.min[1]<4).map(b=>({id:b.id,minX:b.min[0],maxX:b.max[0],minZ:b.min[2],maxZ:b.max[2]})),{id:'construction',minX:construction.min[0],maxX:construction.max[0],minZ:construction.min[2],maxZ:construction.max[2]},...environmentProps.filter(p=>!city.roadAreas.some(a=>p.x+p.radius>a.minX&&p.x-p.radius<a.maxX&&p.z+p.radius>a.minZ&&p.z-p.radius<a.maxZ)).map(p=>({...p})),{id:'restaurant-envelope',...rect(0,0,26.2,28.2)},...tables.map(p=>({...p})),...seats.map(p=>({...p})),...placements.filter(p=>!p.id.includes('customer')&&!['nero','squidward','spongebob'].includes(p.id)).map(p=>({id:p.id,minX:p.min[0],maxX:p.max[0],minZ:p.min[2],maxZ:p.max[2]}))];
 // Include the actual bounds of pre-existing ground-level decoration near sidewalks.
 // Instanced reefs need per-instance bounds; their combined world box would block the town.
 let sceneBoxes=0;
 function addSceneBox(b){if(b.min.y>.4||b.max.y<.15)return;if(!walkAreas.some(a=>b.min.x-.45<a.maxX&&b.max.x+.45>a.minX&&b.min.z-.45<a.maxZ&&b.max.z+.45>a.minZ))return;obstacles.push({id:'scene-decoration-'+sceneBoxes++,minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z});}
 const instanceMatrix=new T.Matrix4();
 for(const root of existingSceneChildren){root.updateMatrixWorld(true);let instanced=false;root.traverse(o=>{if(!o.isInstancedMesh)return;instanced=true;o.geometry.computeBoundingBox();for(let i=0;i<o.count;i++){o.getMatrixAt(i,instanceMatrix);addSceneBox(o.geometry.boundingBox.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(o.matrixWorld,instanceMatrix)));}});if(!instanced)addSceneBox(new T.Box3().setFromObject(root));}
 const nav=createNavigation({bounds:[-185,-160,185,165],walkAreas,obstacles,step:1,radius:.45});
 const candidates=[...transportStops.flatMap(s=>[s.queue,s.exit]),...city.walkAreas.filter(a=>a.maxX-a.minX>10||a.maxZ-a.minZ>10).map(a=>({x:(a.minX+a.maxX)/2,z:(a.minZ+a.maxZ)/2}))].filter(p=>nav.clear(p.x,p.z));
 if(candidates.length<12)throw Error('Not enough safe city pedestrian destinations');
 const colors=[[0xb49aca,0x619db4],[0xc5a66d,0xb07669],[0x7eb9ad,0xc69ab0],[0x94b5cf,0xd1b657]];
 const violations=[],routeStats={completed:0,unreachable:0,yields:0};let trafficGuard=()=>true;
 for(let i=0;i<20;i++){const o=fish(...colors[i%4]);const start=candidates[i%candidates.length];o.position.set(start.x,-.205,start.z);outside.add(o);if(i%3===0)o.userData.bag.visible=true;actors.push({id:i,o,x:start.x,z:start.z,speed:.75+(i%4)*.12,target:(i*3+4)%candidates.length,path:null,next:1,idle:i*.22,phase:i*.72,state:'waiting'});}
 // Two seated residents add a quiet pause to the street scene.
 for(let i=0;i<2;i++){const b=benches[i],o=fish(...colors[(i+1)%4]);for(const leg of o.userData.legs)leg.rotation.x=-1.1;o.position.set(b.x,-.205+.42,b.z+.10);outside.add(o);}
 function route(a){for(let tries=0;tries<candidates.length;tries++){const goal=candidates[a.target++%candidates.length];if(Math.hypot(goal.x-a.x,goal.z-a.z)<1)continue;const path=nav.findPath({x:a.x,z:a.z},goal);if(path){a.path=path;a.next=1;a.state='walking';return;}routeStats.unreachable++;}a.state='waiting';a.idle=3;}
 function snapshot(){return {actors:actors.map(a=>({id:a.id,x:a.x,z:a.z,state:a.state,next:a.path?.[a.next],destination:a.path?.[a.path.length-1],ride:a.ride?{...a.ride}:null,legAngle:a.o.userData.legs[0].rotation.x})),routeStats:{...routeStats},violations:[...violations]};}
 function assignPath(a,end,state){const path=nav.findPath(a,end);if(!path)return false;a.path=path;a.next=1;a.idle=0;a.state=state;return true;}
 const transit={
  people:()=>actors.filter(a=>a.state!=='onbus').map(a=>({id:a.id,x:a.x,z:a.z,state:a.state,busId:a.ride?.busId,next:a.path?.[a.next],speed:a.speed})),
  queue:(stop)=>actors.filter(a=>a.ride?.stopId===stop.id&&['to-stop','stop-wait'].includes(a.state)).map(a=>a.id),
  request:(stop)=>{if(actors.filter(a=>a.ride).length>=4)return null;const queue=actors.filter(a=>a.ride?.stopId===stop.id&&['to-stop','stop-wait','boarding'].includes(a.state));if(queue.length>=1)return null;for(const a of actors.filter(a=>!a.ride&&Math.hypot(a.x-stop.queue.x,a.z-stop.queue.z)<30).sort((a,b)=>Math.hypot(a.x-stop.queue.x,a.z-stop.queue.z)-Math.hypot(b.x-stop.queue.x,b.z-stop.queue.z))){const end={x:stop.queue.x,z:stop.queue.z};if(assignPath(a,end,'to-stop')){a.ride={stopId:stop.id,slot:0};return a.id;}}return null;},
  waiting:(stop)=>{const first=actors.filter(a=>a.ride?.stopId===stop.id&&['to-stop','stop-wait'].includes(a.state)).sort((a,b)=>a.ride.slot-b.ride.slot)[0];return first?.state==='stop-wait'?[first.id]:[];},
  state:id=>actors.find(a=>a.id===id)?.state,
  boardTime:(id,door)=>{const a=actors.find(a=>a.id===id);return a?Math.hypot(a.x-door.x,a.z-door.z)/a.speed+.20:Infinity;},
  board:(id,busId,door)=>{const a=actors.find(a=>a.id===id);if(!a||a.state!=='stop-wait')return false;if(!assignPath(a,door,'boarding'))return false;a.ride.busId=busId;return true;},
  alight:(id,stop,busId,door)=>{const a=actors.find(a=>a.id===id);if(!a||a.state!=='onbus')return false;const gate={x:door.x-1.8,z:door.z-stop.direction*.75},tail=nav.findPath(gate,stop.exit);if(!tail||!nav.segmentClear(door,gate)||actors.some(b=>b!==a&&b.state!=='onbus'&&Math.hypot(b.x-door.x,b.z-door.z)<.90))return false;a.x=door.x;a.z=door.z;a.o.position.set(a.x,-.205,a.z);a.o.visible=true;a.ride={stopId:stop.id,busId};a.path=[door,gate,...tail.slice(1)];a.next=1;a.idle=0;a.state='alighting';return true;},
  cancelTransfer:(id,stop)=>{const a=actors.find(a=>a.id===id);if(!a||!stop)return false;a.x=stop.exit.x;a.z=stop.exit.z;a.o.position.set(a.x,-.205,a.z);a.o.visible=true;a.ride=null;a.path=null;a.state='waiting';a.idle=1;return true;},
  guard:fn=>{trafficGuard=fn;}
 };
 function update(dt,time){
  for(const a of actors){
   a.repathDelay=Math.max(0,(a.repathDelay||0)-dt);
   if(a.state==='onbus'||a.state==='stop-wait'){a.o.userData.legs.forEach(l=>l.rotation.x=0);continue;}
   if(a.idle>0){a.idle-=dt;a.o.userData.legs.forEach(l=>l.rotation.x=0);continue;}if(!a.path)route(a);if(!a.path)continue;
   const p=a.path[a.next],dx=p.x-a.x,dz=p.z-a.z,dist=Math.hypot(dx,dz),travel=Math.min(dist,a.speed*dt);let candidate={x:a.x+dx/(dist||1)*travel,z:a.z+dz/(dist||1)*travel};
   if(!nav.segmentClear(a,candidate)&&a.repathDelay===0){a.repathDelay=1.2;const goal=a.path[a.path.length-1],path=nav.findPath(a,goal);if(path){a.path=path;a.next=1;continue;}}
   function free(q){return nav.segmentClear({x:a.x,z:a.z},q)&&trafficGuard(q,a)&&actors.every(b=>b===a||b.state==='onbus'||Math.hypot(q.x-b.x,q.z-b.z)>.83);}
   if(!free(candidate)&&a.repathDelay===0){a.repathDelay=1.2;const goal=a.path[a.path.length-1],avoid=actors.filter(b=>b!==a&&b.state!=='onbus').map(b=>({x:b.x,z:b.z,radius:.835})),path=nav.findPath(a,goal,{avoid});if(path){a.path=path;a.next=1;continue;}}
   if(!free(candidate)){let moved=false;for(const side of [a.id%2?1:-1,a.id%2?-1:1]){const q={x:a.x-dz/(dist||1)*travel*side,z:a.z+dx/(dist||1)*travel*side};if(free(q)){candidate=q;moved=true;break;}}if(!moved){routeStats.yields++;a.blockedFor=(a.blockedFor||0)+dt;if(a.blockedFor>1.2){a.blockedFor=0;const target=a.path[a.path.length-1],avoid=actors.filter(b=>b!==a&&b.state!=='onbus').map(b=>({x:b.x,z:b.z,radius:.835})),path=nav.findPath(a,target,{avoid});if(path){a.path=path;a.next=1;}}continue;}}a.blockedFor=0;
   a.stallTime=Math.hypot(p.x-candidate.x,p.z-candidate.z)<dist-.0001?0:(a.stallTime||0)+dt;
   if(a.stallTime>.7){a.stallTime=0;const goal=a.path[a.path.length-1],avoid=actors.filter(b=>b!==a&&b.state!=='onbus').map(b=>({x:b.x,z:b.z,radius:.835})),path=nav.findPath(a,goal,{avoid});if(path){a.path=path;a.next=1;continue;}}
   if(!nav.clear(candidate.x,candidate.z)){violations.push({id:a.id,...candidate});a.path=null;a.idle=3;continue;}
   a.x=candidate.x;a.z=candidate.z;a.o.position.set(a.x,-.205+Math.sin(time*5+a.phase)*.012,a.z);a.o.rotation.y=Math.atan2(dx,dz);a.o.userData.legs.forEach((l,i)=>l.rotation.x=Math.sin(time*5+a.phase+i*Math.PI)*.36);a.o.userData.arms.forEach((l,i)=>l.rotation.x=Math.sin(time*5+a.phase+i*Math.PI)*-.20);
   if(Math.hypot(p.x-a.x,p.z-a.z)<.04){a.next++;if(a.next>=a.path.length){a.path=null;routeStats.completed++;if(a.state==='to-stop'){a.state='stop-wait';a.idle=0;}else if(a.state==='boarding'){a.state='onbus';a.o.visible=false;a.idle=0;}else{if(a.state==='alighting')a.ride=null;a.idle=2+(a.id%4);a.state=a.target%2?'looking':'waiting';}}}
  }
 }
 function audit(seconds){const distances=actors.map(()=>0);let minSeparation=Infinity;for(let tick=0;tick<seconds*30;tick++){const before=actors.map(a=>({x:a.x,z:a.z}));update(1/30,tick/30);for(let i=0;i<actors.length;i++){distances[i]+=Math.hypot(actors[i].x-before[i].x,actors[i].z-before[i].z);if(!nav.segmentClear(before[i],actors[i]))violations.push({type:'segment',id:i});for(let j=i+1;j<actors.length;j++)minSeparation=Math.min(minSeparation,Math.hypot(actors[i].x-actors[j].x,actors[i].z-actors[j].z));}}return {seconds,distances,minSeparation,...snapshot()};}
 return {nav,transit,update,snapshot,audit,report:()=>({buildings,props,sceneDecorationBoxes:sceneBoxes,residents:22,walkingResidents:20,seatedResidents:2,targets:candidates.length,walkableCells:nav.walkableCells,radius:nav.radius,...snapshot()}),preview:(seconds)=>{for(let t=0;t<seconds;t+=1/30)update(1/30,t);return snapshot();}};
}
