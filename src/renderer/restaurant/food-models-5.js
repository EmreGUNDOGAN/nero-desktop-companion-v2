import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,ring,add,mat,label} from './models.js';
import {foodCatalog} from './food-models.js';
const cream=0xffefd1;
const group=name=>{const p=new T.Group();p.name=name;p.userData.visualStatus='game-design-draft';return p;};
function tube(p,points,color,r=.007){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),24,r,8,false),mat(color));}
function plate(p,r=.32){cylinder(p,r,r*.88,.024,cream,0,.022,0);const rim=ring(p,r*.94,.008,0xa1baa8,0,.043,0);rim.rotation.x=Math.PI/2;}
function base(id){return foodCatalog.find(v=>v[0]==='food-'+id)[2]();}
function plain(){const p=group('Plain Patty');cylinder(p,.251,.254,.057,0xdda355,0,.043,0);cylinder(p,.249,.249,.065,0x7f5034,0,.102,0);ball(p,.28,0xe1a75c,0,.19,0,[1,.43,1]);seeds(p,.19,0xf2dab0);return p;}
function seeds(p,y,color){for(let i=0;i<24;i++){const a=i*2.4,r=.23*Math.sqrt((i+.5)/24);const s=ball(p,.011,color,Math.cos(a)*r,y+.126*Math.sqrt(1-r*r/.081),Math.sin(a)*r,[.6,.35,1.5]);s.rotation.y=a;}}
function allBun(){const p=group('All-Bun Patty');cylinder(p,.26,.26,.063,0xd9a264,0,.046,0);for(let i=0;i<2;i++)cylinder(p,.251,.257,.073,0xe9bf7c,0,.124+i*.084,0);ball(p,.28,0xdca45c,0,.286,0,[1,.43,1]);seeds(p,.286,0xffe5b4);return p;}
function decker(){const p=group('Triple Decker');let y=.048;cylinder(p,.26,.26,.063,0xd6a05c,0,y,0);for(let i=0;i<3;i++){y+=.073;cylinder(p,.25,.25,.064,0x805037,0,y,0);y+=.043;const cheese=box(p,.46,.014,.44,0xeec55e,0,y,0,.005);cheese.rotation.y=i*.19;for(let j=0;j<9;j++){const a=j*Math.PI*2/9;ball(p,.05,0x86a454,Math.sin(a)*.235,y+.023,Math.cos(a)*.235,[1,.24,1]);}y+=.055;if(i<2){cylinder(p,.253,.253,.048,0xe8bc7b,0,y,0);y+=.020;}}ball(p,.28,0xe0a653,0,y+.071,0,[1,.43,1]);seeds(p,y+.071,0xffe6b3);return p;}
function greasy(){const p=base(1);p.name='Greasy Deluxe Patty';p.traverse(o=>{if(o.isMesh){o.material=o.material.clone();o.material.roughness=.23;}});for(let i=0;i<6;i++){const a=i*Math.PI/3;ball(p,.018,mat(0xd3a452,{roughness:.18}),Math.sin(a)*.25,.113+(i%2)*.055,Math.cos(a)*.25,[.6,1.6,.6]);}return p;}
function pretty(){const p=base(1);p.name='Pretty Patty';p.traverse(o=>{if(!o.isMesh)return;const c=o.material.color.getHex();o.material=o.material.clone();if(c===0xe1a052)o.material.color.setHex(0x9b78bf);else if(c===0x75452c)o.material.color.setHex(0x684b8e);});return p;}
function relish(){const p=base(8);for(let i=0;i<9;i++){const a=i*Math.PI*2/9;const bit=box(p,.024,.022,.020,0x75a14d,Math.sin(a)*.253,.132,Math.cos(a)*.253,.004);bit.rotation.y=a;}return p;}
function fritters(){const p=group('Kelp Fritters');plate(p);for(let i=0;i<6;i++){const a=i*2.4,r=.20*Math.sqrt((i+.5)/6);const x=Math.cos(a)*r,z=Math.sin(a)*r;ball(p,.074,0xad9d58,x,.085,z,[1,.56,.8]);for(let j=0;j<3;j++)tube(p,[[x-.038,.125,z-.026+j*.020],[x,.134,z-.013+j*.020],[x+.034,.125,z-.026+j*.020]],0x6d8846,.003);}return p;}
function coral(){const p=group('Cream-filled Coral');plate(p);for(let i=0;i<4;i++){const a=i*Math.PI/2+.4,x=Math.cos(a)*.145,z=Math.sin(a)*.145;ball(p,.067,0xd9a879,x,.097,z,[.85,.83,1.3]);const fill=ring(p,.027,.009,cream,x,.101,z+.078);fill.scale.y=.87;cylinder(p,.020,.020,.055,cream,x,.098,z+.070).rotation.x=Math.PI/2;}return p;}
function nachoShells(){const p=group('Nacho Oyster Skins');plate(p);for(let i=0;i<9;i++){const a=i*2.4,r=.23*Math.sqrt((i+.5)/9);const shell=ball(p,.06,0xd1aa69,Math.cos(a)*r,.066+(i%3)*.012,Math.sin(a)*r,[1.3,.22,1]);shell.rotation.y=a;}for(let i=0;i<5;i++)tube(p,[[-.16,.101,-.13+i*.06],[-.06,.122,-.11+i*.06],[.03,.113,-.14+i*.06],[.15,.107,-.12+i*.06]],0xf0bf59,.008);for(let i=0;i<4;i++){const r=ring(p,.023,.006,0x7d9950,-.12+i*.077,.125,-.035+(i%2)*.08);r.rotation.x=Math.PI/2;}return p;}
function popcorn(kelp=false){const p=group(kelp?'Pop Kelp':'Popcorn');box(p,.23,.25,.18,kelp?0x91aa66:0xe8c67a,0,.146,0,.015);for(let i=0;i<5;i++)box(p,.022,.22,.004,kelp?0x6c8850:0xc6694b,-.09+i*.045,.152,.093,.002);for(let i=0;i<22;i++){const x=-.09+(i%5)*.045,z=-.063+Math.floor(i/5)*.035,y=.286+(i%3)*.014;ball(p,.028,kelp?0xadbd7c:0xefdcac,x,y,z,[1,.95,.9]);for(let j=0;j<3;j++)ball(p,.014,kelp?0xbed094:0xffedc8,x+Math.sin(j*2.1)*.022,y+.011,z+Math.cos(j*2.1)*.017,[1,.7,1]);}return p;}
function chips(){const p=group('Barnacle Chips');plate(p);for(let i=0;i<10;i++){const a=i*2.4,r=.215*Math.sqrt((i+.5)/10);const chip=ball(p,.066,0xdbb26d,Math.cos(a)*r,.054+(i%3)*.012,Math.sin(a)*r,[1.2,.12,.80]);chip.rotation.y=a;chip.rotation.z=(i%3-1)*.13;for(let j=0;j<3;j++)ball(p,.0035,0xb98e55,Math.cos(a)*r+(j-1)*.025,.067+(i%3)*.012,Math.sin(a)*r,[1,.2,1]);}return p;}
function mudPie(){const p=group('Fried Mud Pie');plate(p);cylinder(p,.235,.204,.073,0x9c7a4d,0,.084,0);cylinder(p,.208,.208,.015,0x725b43,0,.13,0);const crust=ring(p,.219,.020,0xb18c53,0,.130,0);crust.rotation.x=Math.PI/2;for(let i=0;i<14;i++){const a=i*Math.PI/7;ball(p,.015,0xc5a56c,Math.sin(a)*.22,.139,Math.cos(a)*.22,[1,.60,1]);}for(let i=0;i<7;i++)ball(p,.007,0x947657,Math.sin(i*2.4)*.13,.145,Math.cos(i*2.4)*.13,[1.5,.3,1]);return p;}
const records=[
 [12,'Greasy Deluxe Patty','burger',greasy],[19,'Plain Patty','burger',plain],
 [20,'Adult Sized Krabby Patty','burger',()=>{const p=base(1);p.scale.setScalar(1.12);return p;}],
 [23,'All-Bun Patty','burger',allBun],[26,'Triple Decker','burger',decker],
 [108,'Jelly Relish Patty','burger',relish],
 [109,'Junior Krabby Patty','burger',()=>{const p=base(1);p.scale.setScalar(.68);return p;}],
 [132,'Pretty Patty','burger',pretty],
 [106,'Kelp Fritters','fryer',fritters],[107,'Cream-filled Coral','fryer',coral],
 [112,'Nacho Oyster Skins','fryer',nachoShells],
 [114,'Chili Kelp Fries','fryer',()=>{const p=base(111);p.scale.set(.83,1,.83);return p;}],
 [118,'Popcorn','fryer',()=>popcorn()],[131,'Pop Kelp','fryer',()=>popcorn(true)],
 [140,'Barnacle Chips','fryer',chips],[159,'Fried Mud Pie','fryer',mudPie]
];
export const foodCatalog5=records.map(([sourceId,title,station,factory])=>['food-'+sourceId,title,()=>{const p=factory();p.name='food-'+sourceId;p.userData.sourceId=sourceId;p.userData.stationProposal=station;p.userData.visualStatus='game-design-draft';return p;},'menu-food']);
export const foodManifest5=records.map(([sourceId,title,station])=>({sourceId,id:'food-'+sourceId,title,station,appearance:'game-design-draft',ingredientsVerified:false}));
