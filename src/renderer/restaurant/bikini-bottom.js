import {pineappleHome,patrickHome,moaiHome,sandyDome,chumBucket,anchorHouse,boatingSchool,cityBuilding} from './buildings-5.js';
export {pineappleHome,patrickHome,moaiHome,sandyDome,chumBucket,anchorHouse,boatingSchool} from './buildings-5.js';
import {reefCinema} from './buildings-3.js';
import * as T from './vendor/three.module.min.js';
import {ball,box,cylinder,ring,mat,add,label,instancedCopies} from './models.js';
function tube(p,points,c,r=.05){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),24,r,8,false),mat(c));}
function sign(p,value,w,h,x,y,z,bg='#f0dd9b',fg='#36465c'){const o=label(value,w,h,bg,fg);o.position.set(x,y,z);p.add(o);return o;}
function window(p,x,y,z,r=.35){ring(p,r,.065,0x376e99,x,y,z);ball(p,r*.83,0x9ddeec,x,y,z+.015,[1,1,.12]);ball(p,r*.23,0xe4fcf5,x-r*.24,y+r*.28,z+.08,[1,.45,.12]);}
export function buildBikiniBottom(outside){
 const buildings=[];
 function place(id,f,x,z,rotation=0){const p=f();p.position.set(x,-.25,z);p.rotation.y=rotation;outside.add(p);p.updateMatrixWorld(true);const b=new T.Box3().setFromObject(p);buildings.push({id,x,z,min:b.min.toArray(),max:b.max.toArray()});return p;}
 place('patrick-home',patrickHome,-14,44);place('squidward-home',moaiHome,0,44);place('spongebob-home',pineappleHome,14,44);
 place('sandy-treedome',sandyDome,-61,-34);place('chum-bucket',chumBucket,-9,-42);place('mr-krabs-anchor-home',anchorHouse,65,36);place('boating-school',boatingSchool,-82,30);
 place('reef-cinema',reefCinema,8,-61);
 for(const [i,x]of [-60,-45,-30,-15,24,39,54].entries())place('city-home-'+i,()=>cityBuilding([0x9abdc8,0xad95bd,0xd8ae73,0x80b7b1][i%4],3+(i%3)*.7,3.3+(i%4)*.7),x,-61+(i%2)*3);
 // Conch Street and connecting roads: independent geometry, no horizon plane.
 function road(x,z,w,d){box(outside,w,.025,d,0x8c9b99,x,-.264,z,.002);if(w>d){box(outside,w,.036,.17,0xd4d2b4,x,-.256,z-d/2,.001);box(outside,w,.036,.17,0xd4d2b4,x,-.256,z+d/2,.001);for(let a=-w/2+2;a<w/2;a+=4)box(outside,1.55,.015,.09,0xe9d9a4,x+a,-.242,z,.001);}else{for(const side of [-1,1])box(outside,.17,.036,d,0xd4d2b4,x+side*w/2,-.256,z,.001);for(let a=-d/2+2;a<d/2;a+=4)box(outside,.09,.015,1.55,0xe9d9a4,x,-.242,z+a,.001);}}
 road(0,26,140,6);road(0,55,56,6);road(27,18,6,74);road(0,-32,6,49);road(13.5,-18,27,6);road(0,-54,140,6);
 // Front garden stepping stones for all three Conch Street homes.
 const stone=new T.Group();cylinder(stone,.44,.48,.06,0xaec0ba,0,-.21,0,12);
 outside.add(instancedCopies(stone,[-14,0,14].flatMap(x=>Array.from({length:4},(_,i)=>({x,z:47+i*1.4})))));
 for(const x of [-22,22]){cylinder(outside,.075,.10,2.8,0x607f91,x,1.1,61.5);box(outside,1.65,.55,.12,0xd8dcc1,x,2.53,61.5);sign(outside,'CONCH ST.',1.58,.45,x,2.53,61.58,'#d8dcc1','#36607b');}
 for(const [x,z]of [[-28,20.7],[28,20.7],[-30,-49],[30,-49],[-22,61.8],[22,61.8]]){cylinder(outside,.075,.1,3.7,0x54798e,x,1.5,z);tube(outside,[[x,3.3,z],[x+.4,3.7,z],[x+.85,3.55,z]],0x54798e,.07);ball(outside,.28,0xf2df99,x+.85,3.5,z,[1,.50,1]);}
 // The jellyfish meadow is a recognizable underwater landmark, not a sky backdrop.
 const meadow=new T.Group();meadow.position.set(-13,-.25,-23);outside.add(meadow);
 for(let i=0;i<9;i++){const x=Math.sin(i*2.4)*5,z=Math.cos(i*2.4)*2.8;ball(meadow,.55,0x8eb183,x,-.14,z,[2.3,.28,1.8]);const j=new T.Group();j.position.set(x,1.5+(i%3)*.6,z);meadow.add(j);add(j,new T.SphereGeometry(.30,16,8,0,Math.PI*2,0,Math.PI/2),mat(0xeb8dc3));cylinder(j,.29,.23,.09,0xd76fa8,0,.015,0,16);for(let k=0;k<4;k++){const a=k*Math.PI/2;tube(j,[[Math.cos(a)*.18,0,Math.sin(a)*.18],[Math.cos(a)*.21,-.27,Math.sin(a)*.18],[Math.cos(a)*.1,-.46,Math.sin(a)*.2]],0xd890be,.021);}}
 for(const x of [31,35])cylinder(outside,.08,.09,2.7,0x89714d,x,1.1,20.0);sign(outside,'BIKINI BOTTOM',4.9,.85,33,2.4,20.2,'#e5c677','#36709b');
 return {buildings,landmarks:8,layout:'Stylized game layout; not a canonical distance map'};
}
