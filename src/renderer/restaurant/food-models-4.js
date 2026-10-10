import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,ring,add,mat,label} from './models.js';
const cream=0xffefd1;
const group=name=>{const p=new T.Group();p.name=name;p.userData.visualStatus='game-design-draft';return p;};
function tube(p,points,color,r=.007){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),28,r,8,false),mat(color));}
function sign(p,text,x,y,z,w=.15,h=.07,bg='#e8d398'){const s=label(text,w,h,bg,'#3e5661');s.position.set(x,y,z);p.add(s);return s;}
function plate(p){cylinder(p,.30,.27,.022,cream,0,.022,0);const rim=ring(p,.282,.008,0xa4b9a6,0,.036,0);rim.rotation.x=Math.PI/2;}
function carton(name,sausage=false){const p=group(name);box(p,.19,.30,.16,sausage?0xd36b48:0xeac36a,0,.166,0,.010);const roof=box(p,.19,.066,.16,cream,0,.346,0,.010);box(p,.025,.067,.17,sausage?0xd36b48:0x93b872,0,.397,0,.005);sign(p,sausage?'SAUSAGE':'JUICE',0,.222,.085,.165,.066,sausage?'#eacb72':'#a7bc78');if(sausage){ball(p,.029,0xa8583d,0,.118,.085,[2.0,.65,.14]);tube(p,[[-.035,.123,.091],[0,.129,.091],[.035,.122,.091]],0xf0c96b,.003);}else{ball(p,.037,0xe99d4b,0,.120,.085,[1,.95,.10]);ball(p,.018,0x74a15b,.020,.162,.085,[1.4,.5,.13]);}tube(p,[[.058,.341,0],[.058,.466,0],[.105,.483,0]],0x92b2a8,.008);return p;}
function shake(name,patty=false){const p=group(name);cylinder(p,.11,.077,.275,0xd7b3a0,0,.151,0);cylinder(p,.111,.097,.07,patty?0xcaab6d:0x88adb1,0,.218,0);cylinder(p,.118,.112,.021,cream,0,.296,0);for(let i=0;i<6;i++)ball(p,.095-i*.012,patty?0xd6be89:0xf0ddbc,0,.327+i*.024,0,[1,.60,1]);tube(p,[[.043,.324,-.01],[.059,.464,-.01],[.10,.485,-.01]],0xcc6e59,.009);if(patty)for(let i=0;i<10;i++){const a=i*2.4;ball(p,.006,0x805b40,Math.sin(a)*.055,.366+(i%3)*.017,Math.cos(a)*.055,[1,.6,1]);}else ball(p,.023,0xc15d49,0,.475,0);return p;}
function fountain(){const p=group('Large Fountain Drink');cylinder(p,.132,.084,.347,0x77aaa8,0,.184,0);for(const y of [.102,.231])cylinder(p,.084+y*.14,.084+y*.14,.042,cream,0,y,0);cylinder(p,.143,.136,.023,0xe6debe,0,.371,0);const r=ring(p,.138,.007,0x527b81,0,.380,0);r.rotation.x=Math.PI/2;tube(p,[[.038,.381,0],[.040,.571,0],[.080,.594,0]],0xc86a52,.010);return p;}
function bottle(name,color,cap,exercise=false,milk=false){const p=group(name);const profile=[[0,0],[.084,0],[.100,.025],[.10,.255],[.06,.310],[.040,.327],[.040,.387],[0,.387]].map(v=>new T.Vector2(...v));add(p,new T.LatheGeometry(profile,28),mat(color));cylinder(p,.050,.050,.039,cap,0,.403,0);for(let i=0;i<12;i++){const a=i*Math.PI/6;box(p,.006,.025,.006,0xcacfb5,Math.cos(a)*.05,.403,Math.sin(a)*.05,.001);}cylinder(p,.101,.101,.091,exercise?0x88a691:0xe3d1ac,0,.193,0);if(exercise){tube(p,[[-.033,.213,.101],[.009,.213,.101],[-.012,.181,.102],[.035,.181,.101]],0xeec967,.004);}if(milk){ball(p,.021,0x8faeaa,0,.205,.104,[1.4,1.0,.15]);tube(p,[[-.015,.206,.108],[-.021,.219,.107],[-.014,.233,.105]],0x8faeaa,.003);}return p;}
function fizzy(){const p=group('Fizzy Fang');cylinder(p,.097,.097,.292,0x8b6d9a,0,.158,0);for(const y of [.018,.299]){const r=ring(p,.094,.007,0xc3d0c9,0,y,0);r.rotation.x=Math.PI/2;}cylinder(p,.090,.090,.008,0xa7b9b7,0,.309,0);const tab=ring(p,.025,.006,0x6c8b8e,0,.321,.008);tab.scale.x=.55;tab.rotation.x=Math.PI/2;for(const x of [-.032,.032]){const s=new T.Shape();s.moveTo(-.014,.018);s.lineTo(.014,.018);s.lineTo(0,-.028);s.closePath();add(p,new T.ExtrudeGeometry(s,{depth:.005,bevelEnabled:false}),mat(cream),x,.158,.094);}return p;}
function brittle(){const p=group('Seanut Brittle');plate(p);for(let i=0;i<5;i++){const piece=group('brittle-piece');piece.position.set(-.145+(i%3)*.13,.052+Math.floor(i/3)*.028,-.07+Math.floor(i/3)*.11);piece.rotation.y=(i-2)*.37;p.add(piece);const s=new T.Shape();s.moveTo(-.067,-.064);s.lineTo(.065,-.055);s.lineTo(.072,.031);s.lineTo(.021,.066);s.lineTo(-.053,.05);s.closePath();const geo=new T.ExtrudeGeometry(s,{depth:.022,bevelEnabled:true,bevelThickness:.003,bevelSize:.003,bevelSegments:1});geo.rotateX(-Math.PI/2);add(piece,geo,mat(0xc89b4e));for(let j=0;j<3;j++)ball(piece,.018,0xe6c28d,(j-1)*.039,.027,(j%2-.5)*.049,[1.4,.40,.66]);}return p;}
function nougat(){const p=group('Kelp Nougat Crunch');plate(p);for(let i=0;i<3;i++){const z=-.11+i*.11;box(p,.36,.049,.079,0x9ba164,0,.062,z,.012);box(p,.34,.029,.075,0xddc493,0,.099,z,.008);box(p,.36,.013,.079,0xb8ac75,0,.122,z,.007);for(let j=0;j<6;j++)ball(p,.007,0x786b49,-.135+j*.052,.132,z+(j%2-.5)*.036,[1,.4,1]);}return p;}
function candy(){const p=group('Candy Bar');box(p,.37,.049,.145,0x81533a,0,.044,0,.013);for(let i=0;i<5;i++)box(p,.052,.022,.12,0x98714d,-.133+i*.066,.077,0,.008);box(p,.185,.025,.162,0xcf9caa,-.078,.093,0,.004);for(const x of [-.176,.01])box(p,.006,.018,.162,0xf0d39b,x,.115,0,.002);return p;}
function yummy(){const p=group('Yummy Stuff');box(p,.29,.17,.22,0xbbcfb8,0,.10,0,.020);box(p,.31,.028,.24,0x86a596,0,.199,0,.009);sign(p,'YUMMY',0,.107,.117,.22,.075,'#e6d6a3');for(const x of [-.127,.127])box(p,.020,.041,.025,0x4e8075,x,.176,.128,.004);return p;}
const records=[
 [38,'Milkshake','shake',()=>shake('Milkshake')],
 [42,'Juice Box','juice',()=>carton('Juice Box')],
 [55,'Patty Whip','dessert',()=>shake('Patty Whip',true)],
 [128,'Kelp Nougat Crunch','dessert',nougat],
 [135,'Seanut Brittle','dessert',brittle],
 [138,'Yummy Stuff','dessert',yummy],
 [151,'Candy Bar','dessert',candy],
 [161,'Drinkable Sausage','shake',()=>carton('Drinkable Sausage',true)],
 [162,'Seahorse Milk','shake',()=>bottle('Seahorse Milk',0xe3ddbc,0x88ada8,false,true)],
 [163,'Exercise Shake','shake',()=>bottle('Exercise Shake',0xab9984,0x5f8c7a,true)],
 [164,'Large Fountain Drink','soda',fountain],
 [165,'Fizzy Fang','soda',fizzy],
 [166,'Sugar Squeeze','juice',()=>bottle('Sugar Squeeze',0xe8b965,0xc77c55)],
 [167,'Sleepy Squeeze','juice',()=>bottle('Sleepy Squeeze',0xa594ba,0x7f84a1)]
];
export const foodCatalog4=records.map(([sourceId,title,station,factory])=>['food-'+sourceId,title,()=>{const p=factory();p.name='food-'+sourceId;p.userData.sourceId=sourceId;p.userData.stationProposal=station;return p;},'menu-food']);
export const foodManifest4=records.map(([sourceId,title,station])=>({sourceId,id:'food-'+sourceId,title,station,appearance:'game-design-draft',ingredientsVerified:false}));
