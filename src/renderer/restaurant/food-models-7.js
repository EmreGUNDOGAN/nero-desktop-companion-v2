import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,ring,add,mat,label} from './models.js';
import {buildBurgerModel,foodCatalog} from './food-models.js';
import {foodCatalog2} from './food-models-2.js';
const cream=0xffefd1;
const group=name=>{const p=new T.Group();p.name=name;p.userData.visualStatus='game-design-draft';return p;};
function tube(p,points,color,r=.007){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),24,r,8,false),mat(color));}
function plate(p,r=.34){cylinder(p,r,r*.88,.022,cream,0,.022,0);const rim=ring(p,r*.94,.009,0xa4baa7,0,.041,0);rim.rotation.x=Math.PI/2;}
function burger(layers=1,scale=1,deluxe=false){return buildBurgerModel({name:'burger-variant',layers,scale,deluxe});}
function put(p,o,x,y,z,scale=1){o.position.set(x,y,z);o.scale.multiplyScalar(scale);p.add(o);return o;}
function pattyBun(){const p=burger();p.traverse(o=>{if(o.isMesh&&o.material.color.getHex()===0xe1a052){o.material=o.material.clone();o.material.color.setHex(0x815337);}});return p;}
function wordy(){const p=burger();const points=[[-.09,.407,.071],[-.066,.437,-.03],[-.037,.422,.068],[.009,.414,.059],[.009,.440,-.025],[.054,.431,-.013],[.096,.400,.06]];tube(p,points,0xf0cb65,.005);return p;}
function pal(){const p=burger();p.scale.setScalar(.68);const face=group('toy-face');for(const x of [-.088,.088]){ball(face,.035,cream,x,.34,.268,[1,1,.22]);ball(face,.012,0x526157,x,.339,.278,[1,1,.22]);}tube(face,[[-.06,.305,.277],[0,.285,.289],[.06,.305,.277]],0x6d583f,.006);p.add(face);for(const x of [-.24,.24]){tube(p,[[x,.175,0],[x*1.23,.15,.01],[x*1.30,.11,.025]],0x83a383,.014);ball(p,.025,0x83a383,x*1.30,.10,.025);}for(const x of [-.095,.095]){tube(p,[[x,.045,0],[x,-.028,.020]],0x83a383,.014);ball(p,.037,0x749074,x,-.041,.04,[1.4,.40,1]);}p.userData.productRole='toy-not-food';p.position.y=.070;return p;}
function yummyBunz(){const p=group('Yummy Bunz');plate(p);for(const x of [-.12,.12]){ball(p,.11,mat(0xd5a15a,{roughness:.22}),x,.100,0,[1,.56,1.25]);for(let i=0;i<7;i++){const a=i*2.4;ball(p,.007,cream,x+Math.sin(a)*.065,.15,Math.cos(a)*.060,[.6,.3,1.4]);}}return p;}
function kabobs(){const p=group('Cubed Ketchup Kabobs');plate(p);for(let row=0;row<2;row++){const stick=cylinder(p,.003,.003,.48,0xb7925e,-.09+row*.18,.092,0,8);stick.rotation.x=Math.PI/2;for(let i=0;i<4;i++){const cube=box(p,.062,.065,.062,0xc5694b,-.09+row*.18,.094,-.13+i*.084,.012);cube.rotation.y=i*.23;}}return p;}
function fish(p,x=0,z=0,scale=1){const f=group('fish-portion');ball(f,.14,0xd4a16d,0,.075,0,[.73,.37,1.65]);const shape=new T.Shape();shape.moveTo(-.075,-.10);shape.lineTo(.075,-.10);shape.lineTo(0,.015);shape.closePath();const tail=add(f,new T.ExtrudeGeometry(shape,{depth:.018,bevelEnabled:false}),mat(0xba8b58));tail.rotation.x=-Math.PI/2;tail.position.set(0,.05,-.23);for(let i=0;i<5;i++)tube(f,[[-.075,.12,-.13+i*.06],[.075,.12,-.115+i*.06]],0xa7774a,.003);put(p,f,x,.03,z,scale);}
function breakfast(){const p=group('Skipper Breakfast');plate(p,.39);box(p,.19,.040,.19,0xc59a62,-.12,.064,-.06,.015);box(p,.17,.012,.17,0xe9c98f,-.12,.090,-.06,.009);ball(p,.115,cream,.09,.064,.035,[1.1,.18,.86]);ball(p,.042,0xeec65c,.09,.095,.035,[1,.45,1]);for(let i=0;i<2;i++)tube(p,[[-.21,.057,.115+i*.045],[-.12,.069,.13+i*.045],[-.02,.056,.114+i*.045]],0xb98269,.018);return p;}
function spread(){const p=group('Smorgasbord');plate(p,.42);put(p,burger(),-.16,.04,.02,.50);put(p,foodCatalog2.find(v=>v[0]==='food-43')[2](),.10,.04,-.13,.48);put(p,foodCatalog.find(v=>v[0]==='food-34')[2](),.16,.04,.15,.48);return p;}
function olaf(){const p=group('Captain Olaf Special');plate(p,.39);fish(p,-.105,-.025,.85);for(let i=0;i<6;i++)box(p,.024,.028,.19,0xe6bd71,.12+(i%3)*.041,.062+(i%2)*.01,-.07+Math.floor(i/3)*.12,.005);const lemon=cylinder(p,.046,.046,.011,0xe4c966,-.22,.065,.20);return p;}
function surprise(){const p=group('Sailors Surprise');plate(p,.38);for(let i=0;i<5;i++){const a=i*2.4,r=.21*Math.sqrt((i+.5)/5);const shell=group('shell-portion');shell.position.set(Math.cos(a)*r,.058,Math.sin(a)*r);shell.rotation.y=a;p.add(shell);ball(shell,.067,0x9badaa,0,0,0,[1.15,.28,1]);const top=ball(shell,.060,0xbbc2ab,0,.044,-.02,[1.15,.25,1]);top.rotation.x=.7;ball(shell,.028,0xc3a27a,0,.016,.013,[1,.35,.7]);}return p;}
function special(){const p=group('Krusty Special');plate(p,.42);put(p,burger(2,1,true),-.11,.04,0,.62);put(p,foodCatalog.find(v=>v[0]==='food-32')[2](),.19,.04,.03,.45);return p;}
function snacks(){const p=group('Happy Snacks');box(p,.23,.21,.19,0xe6c276,0,.13,0,.018);for(let i=0;i<12;i++){const a=i*2.4,r=.073*Math.sqrt((i+.5)/12);ball(p,.025,0xc99d63,Math.cos(a)*r,.243+(i%3)*.011,Math.sin(a)*r,[1,.7,1]);}const smile=label('SNACK',.17,.055,'#e6c276','#5d7770');smile.position.set(0,.137,.102);p.add(smile);return p;}
function kerg(){const p=group('Kerglooginpfiefer');plate(p,.36);for(let i=0;i<6;i++){const a=i*2.4,r=.20*Math.sqrt((i+.5)/6);const scrap=box(p,.08,.023,.09,[0xb4b39b,0xc6baa0,0x929f8d][i%3],Math.cos(a)*r,.061+(i%2)*.024,Math.sin(a)*r,.005);scrap.rotation.y=a; scrap.rotation.z=(i%3-1)*.25;}const can=cylinder(p,.043,.043,.09,0x8fa8a1,.11,.107,-.07);can.rotation.z=.8;for(let i=0;i<3;i++)tube(p,[[-.12+i*.085,.068,-.14],[-.10+i*.08,.112,-.04],[-.16+i*.085,.067,.12]],0x9a9667,.007);return p;}
const records=[
 [21,'Patty Bun Burger','burger',pattyBun],
 [27,'Wordyburger','burger',wordy],
 [48,'Yummy Bunz','oven',yummyBunz],
 [59,'Smorgasbord','manual-review',spread],
 [60,'Skipper Breakfast','manual-review',breakfast],
 [62,'Cubed Ketchup Kabobs','cold-prep',kabobs],
 [71,'Jumbo Small Patty','burger',()=>burger(2,.75,false)],
 [72,'Junior Senior Patty','burger',()=>burger(3,.82,true)],
 [73,'Quarter Double Pounder','burger',()=>burger(2,1.19,false)],
 [76,'Captain Olaf Special','manual-review',olaf],
 [90,'Sailors Surprise','manual-review',surprise],
 [98,'Super Patty','burger',()=>burger(3,1.27,true)],
 [101,'Krusty Special','manual-review',special],
 [110,'Krusty Supreme','burger',()=>burger(3,1.06,true)],
 [115,'Happy Snacks','fryer',snacks],
 [119,'Krabby Supreme','burger',()=>burger(2,1.05,true)],
 [129,'Kerglooginpfiefer','manual-review',kerg]
];
export const foodCatalog7=records.map(([sourceId,title,station,factory])=>['food-'+sourceId,title,()=>{const p=factory();p.name='food-'+sourceId;p.userData.sourceId=sourceId;p.userData.stationProposal=station;p.userData.visualStatus='game-design-draft';return p;},'menu-food']);
export const toyCatalog=[['patty-pal','Patty Pal · oyuncak',pal,'toy']];
export const foodManifest7=records.map(([sourceId,title,station])=>({sourceId,id:'food-'+sourceId,title,station,appearance:'game-design-draft',ingredientsVerified:false}));
