import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,ring,add,mat} from './models.js';
import {buildBurgerModel,foodCatalog} from './food-models.js';
const cream=0xffefd1;
const group=name=>{const p=new T.Group();p.name=name;p.userData.visualStatus='game-design-draft';return p;};
function tube(p,points,color,r=.007){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),28,r,8,false),mat(color));}
function plate(p,r=.32){cylinder(p,r,r*.88,.024,cream,0,.022,0);const rim=ring(p,r*.94,.009,0xa4baa7,0,.043,0);rim.rotation.x=Math.PI/2;}
function burger(layers=1,scale=1,deluxe=false){return buildBurgerModel({name:'burger-variant',layers,scale,deluxe});}
function recolor(p,map,roughness){p.traverse(o=>{if(!o.isMesh)return;const color=o.material.color?.getHex();o.material=o.material.clone();if(map[color]!==undefined)o.material.color.setHex(map[color]);if(roughness!==undefined)o.material.roughness=roughness;});return p;}
function iceBurger(){const p=burger(3);const y=new T.Box3().setFromObject(p).max.y;for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ball(p,.071,[0xe9d7b3,0xd7aa9b,0xbda176,0xd4cf9f,0xe2bfb2][i],Math.sin(a)*.12,y+.036,Math.cos(a)*.12,[1,.88,1]);}return p;}
function onionBurger(){const p=burger(1,1,true);for(let i=0;i<3;i++){const a=i*2.1;const onion=ring(p,.070,.011,0xdec5d9,Math.cos(a)*.21,.135,Math.sin(a)*.21);onion.rotation.x=Math.PI/2;}return p;}
function turkey(){const p=burger(3,1,false);recolor(p,{[0x75452c]:0xb29470,[0x9f6742]:0xd6b992});return p;}
function oldBurger(nasty=false){const p=burger();recolor(p,{[0xe1a052]:nasty?0x859650:0xaa9a65,[0x75452c]:0x6c6847,[0x8bad50]:0x71854b,[0xcd5437]:0x9b7750});const y=new T.Box3().setFromObject(p).max.y;for(let i=0;i<11;i++){const a=i*2.4,r=.21*Math.sqrt((i+.5)/11);ball(p,.021,i%2?0x789275:0x9db29a,Math.cos(a)*r,y-.06+r*.08,Math.sin(a)*r,[1,.27,1]);}if(nasty){for(let i=0;i<3;i++){const a=i*2.1;tube(p,[[Math.cos(a)*.25,.15,Math.sin(a)*.25],[Math.cos(a+.1)*.28,.09,Math.sin(a+.1)*.28],[Math.cos(a+.24)*.29,.07,Math.sin(a+.24)*.29]],0x9b897a,.009);}ball(p,.045,0x978356,.12,y+.02,0,[.20,1,.20]);ball(p,.068,0x9c7870,.12,y+.049,0,[1,.33,1]);}return p;}
function faceBurger(sad=false){const p=burger();for(const x of [-.087,.087]){ball(p,.041,cream,x,.357,.267,[1,1,.24]);ball(p,.016,0x56614e,x,.354,.279,[1,1,.3]);}tube(p,sad?[[-.073,.291,.274],[0,.314,.292],[.073,.291,.274]]:[[-.073,.312,.274],[0,.289,.292],[.073,.312,.274]],0x67543e,.008);return p;}
function cakeBurger(){const p=group('Patty Kake');cylinder(p,.29,.29,.045,0xc79257,0,.048,0);cylinder(p,.282,.282,.050,0x815339,0,.098,0);cylinder(p,.29,.29,.035,0xe3ba78,0,.147,0);cylinder(p,.285,.285,.022,0xe9cfaa,0,.179,0);for(let i=0;i<14;i++){const a=i*Math.PI/7;ball(p,.022,cream,Math.sin(a)*.265,.199,Math.cos(a)*.265,[1,.65,1]);}for(const x of [-.085,0,.085]){cylinder(p,.007,.007,.075,0x9db6ad,x,.235,0,8);ball(p,.011,0xf0b859,x,.282,0,[.55,1.3,.55]);}return p;}
function flabby(){const p=burger(2);p.scale.set(1.24,.63,1.13);recolor(p,{},.29);for(let i=0;i<8;i++){const a=i*Math.PI/4;ball(p,.034,0xc9a66f,Math.sin(a)*.253,.159,Math.cos(a)*.253,[.8,1.25,.65]);}return p;}
function secret(){const p=burger(1,1,false);const cover=group('secret-paper-sleeve');box(cover,.17,.26,.59,0xd2bf96,0,.173,0,.012);tube(cover,[[-.037,.295,.23],[0,.291,.255],[.037,.295,.23]],0x4e6b69,.004);p.add(cover);return p;}
function wooden(powder=false){const p=group(powder?'Powdered Driftwood':'Fried Flotsam');plate(p);for(let i=0;i<5;i++){const item=group('driftwood-piece');item.position.set(-.15+(i%3)*.145,.075+(i%2)*.015,-.085+Math.floor(i/3)*.145);item.rotation.y=i*.65;p.add(item);box(item,.075,.055,.22,powder?0xb59469:0xa77c4d,0,0,0,.013);for(const x of [-.02,.02])tube(item,[[x,.028,-.089],[x+.006,.029,0],[x-.003,.028,.089]],0x826744,.002);if(powder)for(let j=0;j<10;j++)ball(item,.005,cream,(j%3-1)*.02,.034,-.08+Math.floor(j/3)*.05,[1,.4,1]);}return p;}
function butterBarnacles(){const p=group('Buttered Barnacles');plate(p);for(let i=0;i<6;i++){const a=i*2.4,r=.20*Math.sqrt((i+.5)/6);const x=Math.cos(a)*r,z=Math.sin(a)*r;cylinder(p,.028,.068,.073,0xc2ae86,x,.077,z,8);cylinder(p,.025,.025,.006,0x69715c,x,.117,z,8);ball(p,.030,0xe8c765,x,.096,z+.025,[1,.32,.75]);}return p;}
function oyster(large=false){const p=foodCatalog.find(v=>v[0]==='food-124')[2]();if(large)p.scale.setScalar(1.23);return p;}
function bruschetta(){const p=group('Barnacle Bruschetta');plate(p,.35);for(const x of [-.115,.115]){ball(p,.11,0xc79a5d,x,.083,0,[.83,.36,1.45]);ball(p,.095,0xebcf99,x,.11,0,[.83,.10,1.45]);for(let i=0;i<5;i++){const bit=box(p,.033,.022,.032,0xc76b4c,x+(i%2-.5)*.06,.128,-.088+Math.floor(i/2)*.077,.005);bit.rotation.y=i*.5;}for(let i=0;i<3;i++)ball(p,.014,0x789a58,x+(i%2-.5)*.044,.148,-.07+i*.064,[1,.4,1]);}return p;}
function barnacleLoaf(){const p=group('Barnacle Loaf');plate(p,.36);const log=cylinder(p,.102,.102,.37,0x8a5b53,0,.147,-.040);log.rotation.x=Math.PI/2;for(let i=0;i<3;i++){const z=.19+i*.04;const slice=cylinder(p,.101,.101,.025,0xb98c78,0,.091,z);slice.rotation.x=Math.PI/2;for(let j=0;j<6;j++){const a=j*2.4;ball(p,.012,0xe0c5a3,Math.cos(a)*.061,.091+Math.sin(a)*.061,z+.014,[1,1,.15]);}}return p;}
function bran(){const p=group('Bran Flakes');const profile=[[0,.020],[.12,.02],[.245,.14],[.235,.155],[.221,.14],[.104,.037],[0,.037]].map(v=>new T.Vector2(...v));add(p,new T.LatheGeometry(profile,28),mat(cream));cylinder(p,.213,.213,.008,0xe7d9b9,0,.13,0);for(let i=0;i<27;i++){const a=i*2.4,r=.193*Math.sqrt((i+.5)/27);const flake=ball(p,.026,0xc49e61,Math.cos(a)*r,.142+(i%3)*.009,Math.sin(a)*r,[1.25,.15,.72]);flake.rotation.y=a;}return p;}
function cannedBread(){const p=group('Canned Bread');const steel=mat(0xadc1b6,{metalness:.45,roughness:.38});cylinder(p,.135,.135,.25,steel,0,.142,0);cylinder(p,.137,.137,.135,0xb99c6b,0,.143,0);for(const y of [.021,.27]){const r=ring(p,.132,.007,0xcbd2be,0,y,0);r.rotation.x=Math.PI/2;}cylinder(p,.12,.115,.034,0xbf955b,0,.275,0);for(let i=0;i<13;i++){const a=i*2.4;ball(p,.003,0xe1bc78,Math.sin(a)*.077,.294,Math.cos(a)*.077,[1,.3,1]);}const lid=cylinder(p,.134,.134,.010,steel,0,.342,-.109);lid.rotation.x=-.70;return p;}
function hologram(){const p=group('Holographic Meatloaf');plate(p,.34);const loaf=box(p,.38,.16,.24,mat(0x83c9c7,{transparent:true,opacity:.58,emissive:0x386563,emissiveIntensity:.28,depthWrite:false}),0,.126,0,.035);const edges=new T.EdgesGeometry(loaf.geometry);const wireGeometry=new T.BufferGeometry();wireGeometry.setAttribute('position',edges.getAttribute('position').clone());edges.dispose();const wire=new T.LineSegments(wireGeometry,new T.LineBasicMaterial({color:0x98efde,transparent:true,opacity:.8}));wire.position.copy(loaf.position);p.add(wire);for(let i=0;i<6;i++)box(p,.36,.002,.23,mat(0xa4e1d7,{transparent:true,opacity:.45}),0,.066+i*.022,0,.0005);return p;}
function jerky(){const p=group('Kelp Jerky');plate(p);for(let i=0;i<6;i++){const strip=group('kelp-strip');strip.position.set(-.15+(i%3)*.15,.062+Math.floor(i/3)*.024,-.05+Math.floor(i/3)*.09);strip.rotation.y=.15+(i%3-1)*.27;p.add(strip);box(strip,.058,.020,.26,0x748355,0,0,0,.009);for(const x of [-.017,.017])tube(strip,[[x,.012,-.10],[x+.004,.013,0],[x-.003,.012,.1]],0xa0a26d,.002);}return p;}
function kazook(){const p=group('Kazook Fruit');plate(p,.30);ball(p,.135,0xcb9b74,0,.176,0,[1,1.02,.82]);for(let i=0;i<8;i++){const a=i*Math.PI/4;const rib=ball(p,.048,0xe0b38a,Math.sin(a)*.102,.174,Math.cos(a)*.084,[.30,2.1,.22]);rib.rotation.y=a;}tube(p,[[0,.293,0],[.01,.34,0],[.047,.354,.005]],0x7d7550,.010);const leaf=ball(p,.046,0x849858,-.026,.325,0,[1.35,.24,.59]);leaf.rotation.z=.24;return p;}
const records=[
 [4,'Ultra Krabby Supreme','burger',()=>burger(4,1,true)],
 [5,'King Size Krabby Supreme','burger',()=>burger(4,1.32,true)],
 [6,'Double Triple Bossy Deluxe','burger',()=>burger(6,1,true)],
 [7,'Ice Cream Triple Patty','burger',iceBurger],
 [9,'Crying Johnny','burger',onionBurger],
 [11,'Monster Krabby Patty','burger',()=>burger(3,1.52,false)],
 [16,'Triple Turkey Patty','burger',turkey],
 [18,'Nasty Patty','burger',()=>oldBurger(true)],
 [22,'Sad Patty','burger',()=>faceBurger(true)],
 [24,'Patty Face','burger',()=>faceBurger()],
 [28,'Patty Kake','burger',cakeBurger],
 [69,'Double Patty Patty','burger',()=>burger(2,.92,true)],
 [70,'Krabby Junior Junior','burger',()=>burger(1,.52,false)],
 [74,'Super Double Triple Patty','burger',()=>burger(6,1.16,false)],
 [75,'Jumbo Patty Super Jumbo','burger',()=>burger(2,1.45,true)],
 [80,'Krusty Deluxe','burger',()=>burger(2,1.10,true)],
 [92,'Bubble Bass Special','burger',()=>{const p=burger(3,1.15,true);for(let i=0;i<6;i++)cylinder(p,.029,.029,.013,0x8b9a4d,-.11+(i%3)*.11,.389,-.09+Math.floor(i/3)*.18);return p;}],
 [146,'Flabby Patty','burger',flabby],
 [156,'Aged Patty','burger',()=>oldBurger()],
 [157,'Secret Patty','burger',secret],
 [51,'Buttered Barnacles','fryer',butterBarnacles],
 [52,'Powdered Driftwood','fryer',()=>wooden(true)],
 [54,'Fried Flotsam','fryer',()=>wooden()],
 [63,'Barnacle Bruschetta','oven',bruschetta],
 [94,'Oyster Skins','fryer',()=>oyster()],
 [102,'Large Oyster Skins','fryer',()=>oyster(true)],
 [120,'Barnacle Loaf','oven',barnacleLoaf],
 [121,'Bran Flakes','cold-prep',bran],
 [122,'Canned Bread','oven',cannedBread],
 [125,'Holographic Meatloaf','oven',hologram],
 [127,'Kelp Jerky','cold-prep',jerky],
 [142,'Kazook Fruit','cold-prep',kazook]
];
export const foodCatalog6=records.map(([sourceId,title,station,factory])=>['food-'+sourceId,title,()=>{const p=factory();p.name='food-'+sourceId;p.userData.sourceId=sourceId;p.userData.stationProposal=station;p.userData.visualStatus='game-design-draft';return p;},'menu-food']);
export const foodManifest6=records.map(([sourceId,title,station])=>({sourceId,id:'food-'+sourceId,title,station,appearance:'game-design-draft',ingredientsVerified:false}));
