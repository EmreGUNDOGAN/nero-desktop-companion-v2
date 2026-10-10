import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,line,ring,mat,add,contact,label} from './models.js';
const ink=0x493f36,white=0xfff8e8,mint=0xb9d4b5;
function named(obj,name){obj.name=name;return obj;}
function outline(mesh,size=1.024){const edge=new T.Mesh(mesh.geometry,new T.MeshBasicMaterial({color:ink,side:T.BackSide}));edge.scale.setScalar(size);mesh.add(edge);return mesh;}
function ell(g,r,c,x,y,z,s,edge=false){const m=ball(g,r,c,x,y,z,s);if(edge)outline(m);return m;}
function stroke(g,points,color=ink,width=.013){const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)));return add(g,new T.TubeGeometry(curve,Math.max(32,points.length*2),width,8,false),mat(color));}
function shape(g,points,depth,color,bevel=.018){const s=new T.Shape();s.moveTo(...points[0]);for(let i=1;i<points.length;i++)s.lineTo(...points[i]);s.closePath();const geo=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:3,bevelSize:bevel,bevelThickness:bevel,curveSegments:12});geo.translate(0,0,-depth/2);const m=add(g,geo,mat(color));return m;}
function sleeve(g,x,y,color,len=.44,r=.055){const p=named(new T.Group(),x<0?'arm-left':'arm-right');p.position.set(x,y,0);g.add(p);cylinder(p,r,r*1.08,len,color,0,-len/2,0,20);ell(p,r*1.18,color,0,-len,0,[1,1.05,1]);return p;}
function hand(p,c,y,side=1){ell(p,.069,c,0,y,0,[1.1,.92,.65]);for(let i=0;i<3;i++){const f=ell(p,.024,c,(i-1)*.035,y-.056,.009,[.65,1.65,.7]);f.rotation.z=(i-1)*-.13;}ell(p,.026,c,side*.068,y,.015,[1.2,.65,.7]);}
function anchorHat(g,y){const h=named(new T.Group(),'hat');g.add(h);h.position.y=y;cylinder(h,.15,.155,.055,0xf7f5e8,0,0,0);cylinder(h,.159,.16,.035,0x263b5b,0,-.012,0);const cap=box(h,.26,.20,.11,white,0,.11,-.01,.055);cap.rotation.z=-.12;stroke(h,[[0,.17,.061],[0,.075,.061]],0x255783,.009);stroke(h,[[-.04,.12,.061],[.04,.12,.061]],0x255783,.008);stroke(h,[[-.05,.084,.061],[-.031,.061,.061],[0,.052,.061],[.031,.061,.061],[.05,.084,.061]],0x255783,.008);return h;}
function tie(g,y,z,scale=1){const t=shape(g,[[-.04,.10],[.04,.10],[.045,.04],[.021,-.005],[.075,-.22],[0,-.28],[-.075,-.22],[-.021,-.005],[-.045,.04]],.024,0xe94837,.008);t.scale.setScalar(scale);t.position.set(0,y,z);return t;}
function collar(g,y,z,w=.32){for(const side of [-1,1]){const c=shape(g,[[0,.08],[side*w,.08],[side*w*.77,-.10],[side*.07,-.03]],.022,white,.009);c.position.set(0,y,z);}}
function sleepyEye(g,x,y,z,rx=.13,ry=.19){const socket=new T.Group();socket.position.set(x,y,z);g.add(socket);const loop=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*2;loop.push([Math.cos(a)*rx,Math.sin(a)*ry,0]);}stroke(socket,loop,ink,.016);ell(socket,.1,mint,0,0,-.009,[rx/.1,ry/.1,.15]);stroke(socket,[[-rx*.78,-.012,.016],[-rx*.4,-.037,.018],[0,-.046,.019],[rx*.4,-.037,.018],[rx*.78,-.012,.016]],ink,.015);return socket;}
function shoe(g,x,y,z,s=[1,1,1]){const foot=ell(g,.12,0x403c38,x,y,z,[1.35*s[0],.60*s[1],1.75*s[2]],true);ell(foot,.11,0x736e60,-.02,.05,.025,[.64,.15,.7]);return foot;}
function baseRig(g,arms,legs){g.userData.arms=arms;g.userData.legs=legs;g.userData.assetVersion=2;g.userData.animationNodes=arms.concat(legs).map(o=>o.name);return g;}

export function nero(){
 const g=named(new T.Group(),'nero');
 // Continuous bean silhouette: the reference's head and body are one shape.
 const profile=[[0,.65],[.27,.66],[.46,.73],[.54,.91],[.565,1.17],[.545,1.48],[.48,1.73],[.35,1.91],[.15,2.00],[0,2.015]].map(p=>new T.Vector2(...p));
 const beanCurve=new T.SplineCurve(profile);const beanProfile=beanCurve.getPoints(56).map(p=>new T.Vector2(Math.max(0,p.x),p.y));const bean=add(g,new T.LatheGeometry(beanProfile,64),mat(mint,{roughness:.88}));bean.scale.z=.70;outline(bean,1.018);bean.name='bean-body';
 // Shirt follows the bottom of the bean; no separate narrow humanoid torso.
 const shirt=ell(g,.51,white,0,.62,0,[1,.50,.70],true);
 const shorts=box(g,.80,.25,.52,0x9b6c3f,0,.365,0,.065);outline(shorts,1.02);
 box(g,.80,.047,.54,0x544737,0,.45,.004,.008);box(g,.13,.068,.018,0xefc865,0,.45,.282,.009);box(g,.077,.029,.02,0x74532f,0,.45,.293,.004);
 collar(g,.75,.332,.27);tie(g,.67,.371,.75);
 for(const x of [-.155,.155])sleepyEye(g,x,1.425,.394,.135,.185);
 for(const side of [-1,1])stroke(g,[[side*.285,1.674,.337],[side*.155,1.688,.366],[side*.045,1.674,.382]],ink,.019);
 stroke(g,[[-.14,1.005,.387],[0,1.025,.40],[.14,1.005,.387]],ink,.016);
 // Short limbs and mint feet preserve Nero's original mascot proportions.
 const arms=[sleeve(g,-.52,.83,mint,.36,.071),sleeve(g,.52,.83,mint,.36,.071)];
 arms.forEach((a,i)=>{const cuff=box(a,.17,.16,.20,white,0,-.04,0,.035);cuff.rotation.z=i?.22:-.22;hand(a,mint,-.36,i?1:-1);});
 const legs=[];for(const x of [-.235,.235]){const p=named(new T.Group(),x<0?'leg-left':'leg-right');p.position.set(x,.25,0);g.add(p);cylinder(p,.056,.068,.15,mint,0,-.075,0);ell(p,.15,mint,0,-.17,.055,[1,.44,.80],true);legs.push(p);}
 anchorHat(g,2.04);
 const tray=named(new T.Group(),'carry-tray');tray.position.set(0,.72,.62);g.add(tray);cylinder(tray,.30,.30,.024,mat(0xb2c4c3,{metalness:.55,roughness:.32}));const rim=ring(tray,.30,.012,0xe1e7db);rim.rotation.x=Math.PI/2;const food=burger();food.scale.setScalar(.8);food.position.y=.018;tray.add(food);tray.visible=false;g.userData.tray=tray;
 contact(g,.68,.20);return baseRig(g,arms,legs);
}

export function sponge(){
 const g=named(new T.Group(),'spongebob'),yellow=0xffd949;
 // Scalloped sponge perimeter, rather than a plain rectangular block.
 const pts=[[-.58,.98],[-.61,1.14],[-.585,1.29],[-.61,1.47],[-.585,1.63],[-.61,1.80],[-.57,1.96],[-.42,1.99],[-.27,1.96],[-.12,2.0],[.04,1.967],[.19,2.0],[.35,1.968],[.52,1.994],[.59,1.92],[.575,1.76],[.61,1.61],[.579,1.45],[.61,1.29],[.582,1.12],[.60,.99],[.47,.959],[.29,.976],[.11,.95],[-.08,.979],[-.27,.951],[-.46,.977]];
 const body=shape(g,pts,.43,yellow,.034);body.name='sponge-body';outline(body,1.012);
 // Face pores are modelled inset disks, with shaded rims, on front and back.
 const pores=[[-.47,1.81,.058],[-.47,1.60,.035],[-.49,1.08,.062],[.46,1.83,.06],[.48,1.54,.045],[.46,1.10,.037],[-.32,1.90,.025],[.30,1.03,.025],[.41,1.30,.027],[-.41,1.33,.025]];
 for(const z of [-.266,.266])for(const [x,y,r]of pores){ell(g,r,0xddae31,x,y,z,[1,.70,.11]);const poreRing=ring(g,r,.006,0xf4c642,x,y,z+.002*(z>0?1:-1));poreRing.scale.y=.7;}
 for(const side of [-1,1]){
  ell(g,.225,white,side*.232,1.626,.273,[1,1.09,.41],true);
  ell(g,.099,0x61b4e4,side*.232,1.613,.368,[1,1,.17]);const iris=ring(g,.096,.008,0x307fb1,side*.232,1.613,.384);
  ell(g,.055,0x283437,side*.232,1.613,.397,[1,1,.16]);ell(g,.021,white,side*.232-.026,1.645,.41,[1,1,.12]);
  for(const a of [-.6,0,.6])stroke(g,[[side*.232+Math.sin(a)*.15,1.73+Math.cos(a)*.075,.295],[side*.232+Math.sin(a)*.215,1.75+Math.cos(a)*.14,.295]],ink,.014);
  ell(g,.136,0xffdc57,side*.38,1.332,.257,[1,.72,.26]);ell(g,.082,0xefab6f,side*.405,1.338,.294,[1,.65,.12]);
  for(let i=0;i<3;i++)ell(g,.011,0xc96849,side*(.368+i*.032),1.346+(i%2)*.027,.307,[1,1,.2]);
 }
 // Nose, smile and teeth have their own silhouette and rounded edges.
 ell(g,.083,yellow,0,1.469,.378,[.74,.88,1.53],true);
 const mouth=shape(g,[[-.265,1.303],[-.14,1.27],[0,1.262],[.14,1.27],[.265,1.303],[.20,1.159],[.11,1.10],[0,1.075],[-.11,1.10],[-.20,1.159]],.018,0x773e28,.016);mouth.position.z=.25;
 stroke(g,[[-.42,1.356,.283],[-.29,1.313,.291],[0,1.278,.294],[.29,1.313,.291],[.42,1.356,.283]],0x775234,.014);
 ell(g,.09,0xe88367,0,1.136,.286,[1.5,.45,.16]);for(const x of [-.062,.062])box(g,.107,.135,.055,white,x,1.234,.305,.017);
 box(g,1.11,.145,.46,white,0,.903,0,.025);collar(g,.916,.251,.24);tie(g,.842,.271,.56);
 box(g,1.10,.235,.48,0x9b7148,0,.722,0,.026);box(g,1.1,.055,.5,0x725136,0,.82,0,.009);
 for(const x of [-.36,-.16,.16,.36])box(g,.095,.031,.014,0x403c33,x,.823,.265,.004);
 const legs=[];for(const x of [-.30,.30]){const p=named(new T.Group(),x<0?'leg-left':'leg-right');p.position.set(x,.62,0);g.add(p);cylinder(p,.041,.041,.23,yellow,0,-.12,0);cylinder(p,.054,.051,.215,white,0,-.335,0);for(const [y,c] of [[-.269,0xe64b40],[-.30,0x537aaa]])cylinder(p,.056,.056,.019,c,0,y,0);shoe(p,x<0?-.03:.03,-.49,.06);legs.push(p);}
 const arms=[sleeve(g,-.66,1.033,yellow,.46,.038),sleeve(g,.66,1.033,yellow,.46,.038)];arms.forEach((a,i)=>{box(a,.17,.15,.22,white,0,-.025,0,.033);hand(a,yellow,-.46,i?1:-1);});
 const spat=named(new T.Group(),'spatula');arms[1].add(spat);spat.position.set(.025,-.42,.055);box(spat,.038,.26,.032,0x554039,0,-.12,0,.005);box(spat,.035,.17,.025,0xb6c0c3,0,-.32,0,.005);box(spat,.20,.24,.033,0xbac4c9,0,-.52,0,.025);for(const x of [-.055,0,.055])box(spat,.014,.16,.04,0x6d7d84,x,-.52,.022,.005);
 anchorHat(g,2.075);contact(g,.78,.17);return baseRig(g,arms,legs);
}

export function squid(){
 const g=named(new T.Group(),'squidward'),skin=0x91c3b5,shade=0x77ad9e;
 // Broad bulbous cranium and long tapered neck are recognisable from every angle.
 ell(g,.41,skin,0,1.91,0,[1.13,.76,.79],true);ell(g,.21,skin,0,1.59,.10,[.78,1.43,.85]);
 const neck=add(g,new T.LatheGeometry([[.105,.84],[.115,1.02],[.11,1.26],[.13,1.50]].map(v=>new T.Vector2(...v)),32),mat(skin));
 for(const side of [-1,1]){
  ell(g,.147,0xffefb5,side*.14,1.818,.283,[.88,1.4,.37],true);
  ell(g,.034,0xb33d32,side*.14,1.731,.341,[.65,1.15,.16]);
  ell(g,.148,skin,side*.14,1.912,.292,[.90,.66,.38]);
  stroke(g,[[side*.14-.12,1.829,.34],[side*.14,1.817,.349],[side*.14+.12,1.829,.34]],shade,.012);
  stroke(g,[[side*.06,2.008,.253],[side*.19,2.011,.260],[side*.27,1.988,.236]],shade,.012);
 }
 const nose=ell(g,.114,skin,0,1.575,.351,[.90,1.83,1.30],true);nose.rotation.x=-.16;
 ell(g,.122,skin,0,1.425,.373,[1,.61,1.17]);stroke(g,[[-.17,1.388,.235],[0,1.365,.282],[.17,1.388,.235]],0x476e5e,.012);
 ell(g,.23,0xb38143,0,1.02,0,[1,.88,.77],true);for(const x of [-.07,.07]){const c=shape(g,[[0,.045],[.15,.045],[.11,-.075],[.025,-.02]],.014,0xc18e4d,.006);c.position.set(x<0?-.13:.015,1.144,.190);c.rotation.z=x<0?-.15:.15;}
 for(const y of [.95,1.04])ell(g,.012,0x6a542d,0,y,.179,[1,1,.2]);
 const arms=[];for(const side of [-1,1]){const p=named(new T.Group(),side<0?'arm-left':'arm-right');p.position.set(side*.235,1.14,0);g.add(p);box(p,.16,.16,.22,0xb38143,0,-.045,0,.027);stroke(p,[[0,-.09,0],[side*.045,-.29,0],[side*.11,-.45,.02],[side*.08,-.56,.075]],skin,.046);ell(p,.066,skin,side*.08,-.56,.075,[1,.6,1]);for(let i=0;i<3;i++)ell(p,.015,0xc4e2b8,side*.08+(i-1)*.027,-.589,.08,[1,.25,1]);arms.push(p);}
 const legs=[];for(const side of [-1,1]){const leg=named(new T.Group(),side<0?'leg-left':'leg-right');leg.position.set(side*.12,.84,0);g.add(leg);for(const back of [-1,1]){stroke(leg,[[0,0,back*.047],[side*.018,-.32,back*.078],[side*.074,-.57,back*.11],[side*.15,-.685,back*.14],[side*.24,-.68,back*.14]],skin,.053);ell(leg,.087,skin,side*.23,-.67,back*.14,[1.45,.49,.77],true);for(let i=0;i<3;i++)ell(leg,.018,0xcde2bc,side*(.15+i*.047),-.713,back*.14,[1,.20,.9]);}legs.push(leg);}
 anchorHat(g,2.23);contact(g,.7,.17);return baseRig(g,arms,legs);
}

// Equipment is modular: backs align with the kitchen wall, front faces the cook aisle.
const steel=()=>mat(0xa9bec3,{metalness:.52,roughness:.38});
function feet(g,w,d,h=.12){for(const x of [-w/2+.12,w/2-.12])for(const z of [-d/2+.12,d/2-.12])cylinder(g,.045,.06,h,0x4b5c63,x,h/2,z);}
function handle(g,x,y,z,w=.32){for(const a of [-w/2,w/2])cylinder(g,.022,.022,.08,0x667b84,x+a,y,z);stroke(g,[[x-w/2,y,z],[x-w/2,y,z+.09],[x+w/2,y,z+.09],[x+w/2,y,z]],0xdce2d9,.026);}
export function grill(){const g=named(new T.Group(),'burger-grill');feet(g,2.25,1.0);box(g,2.25,.77,1,steel(),0,.51,0,.025);box(g,2.36,.065,1.08,steel(),0,.923,0,.015);box(g,2.08,.036,.80,0x3b464c,0,.973,.015,.008);for(let i=0;i<15;i++)box(g,.018,.012,.74,0x899497,-.96+i*.137,.999,.01,.003);box(g,2.27,.26,.055,steel(),0,1.078,-.51,.014);box(g,2.07,.32,.022,0x617981,0,.61,.515,.005);for(const x of [-.77,-.26,.26,.77]){const k=cylinder(g,.064,.064,.037,0x303d46,x,.77,.559);k.rotation.x=Math.PI/2;box(g,.014,.04,.018,0xf2c268,x,.794,.586,.003);}handle(g,0,.43,.538,.63);const patty=cylinder(g,.16,.17,.055,0x78462d,-.47,1.036,.12);for(const x of [-.55,-.43])stroke(g,[[x-.035,1.065,.03],[x+.035,1.065,.21]],0x483024,.006);cylinder(g,.16,.17,.055,0x845031,.40,1.036,-.05);return g;}
export function hood(){const g=named(new T.Group(),'ventilation-hood');const shell=shape(g,[[-1.22,0],[1.22,0],[.94,.40],[-.94,.40]],.85,0x92a8b0,.018);shell.position.y=.07;box(g,1.76,.65,.46,steel(),0,.78,-.11,.022);for(let i=0;i<12;i++)box(g,.043,.012,.55,0x415966,-.80+i*.145,.045,0,.002);for(const x of [-.77,.77])box(g,.22,.016,.24,0xffe5a2,x,.031,.07,.018);return g;}
export function fridge(){const g=named(new T.Group(),'cold-fridge');feet(g,1.17,1.0);box(g,1.17,1.97,1.0,0x648fa6,0,1.075,0,.055);box(g,1.065,1.195,.065,steel(),0,1.452,.53,.027);box(g,1.065,.52,.065,steel(),0,.57,.53,.027);for(const y of [.61,1.52]){stroke(g,[[.377,y+.18,.57],[.40,y+.18,.66],[.40,y-.18,.66],[.377,y-.18,.57]],0xe3e8da,.029);}box(g,.80,.13,.018,0x344e60,0,.245,.57,.009);for(let i=0;i<10;i++)box(g,.014,.084,.022,0x74949f,-.35+i*.077,.247,.589,.002);const note=label('STOK',.40,.13,'#e6ddbd','#345e74');note.position.set(-.22,1.69,.575);g.add(note);return g;}
export function prep(){const g=named(new T.Group(),'preparation-bench');feet(g,2.25,1.0);box(g,2.25,.78,.98,steel(),0,.53,0,.025);box(g,2.36,.09,1.10,0xcdd5ca,0,.98,0,.023);box(g,2.30,.16,.04,steel(),0,1.10,-.52,.009);for(const x of [-.57,.57]){box(g,1.035,.57,.035,0x8babb8,x,.52,.509,.008);handle(g,x,.725,.545,.34);}box(g,1.03,.035,.61,0xc49b69,-.45,1.055,.10,.025);const knife=shape(g,[[0,0],[.38,0],[.36,-.08],[.08,-.10]],.012,0xbfd2d8,.004);knife.rotation.x=-Math.PI/2;knife.position.set(-.69,1.09,.07);g.add(knife);box(g,.20,.025,.05,0x51473c,-.78,1.087,.07,.009);for(let i=0;i<3;i++)ell(g,.055,0xd54e32,-.37+i*.085,1.096,.13,[1,.3,1]);for(let i=0;i<3;i++){box(g,.30,.02,.31,0x80a848,.46+i*.16,1.054,-.24,.023);cylinder(g,.125,.125,.05,0xf1cf84,.55+i*.18,1.059,.21);}return g;}
export function sink(){const g=named(new T.Group(),'washing-bench');feet(g,1.65,1);box(g,1.65,.80,1,steel(),0,.54,0,.025);box(g,1.76,.07,1.08,0xc7d7d8,0,.98,0,.014);box(g,1.24,.017,.66,0x55747f,0,1.025,.015,.065);box(g,1.08,.015,.50,0x809fa6,0,1.034,.015,.065);const faucet=stroke(g,[[.47,1.02,-.38],[.47,1.38,-.38],[.43,1.48,-.33],[.32,1.49,-.23],[.25,1.41,-.08],[.25,1.35,-.01]],0xd0dedc,.028);for(const x of [.36,.57]){cylinder(g,.022,.022,.08,0x7e979a,x,1.06,-.40);box(g,.10,.025,.035,0xb7c8c9,x,1.12,-.40,.006);}return g;}
function wood(g,w,h,d,x,y,z){const m=box(g,w,h,d,0x9d652e,x,y,z,.012);for(let i=0;i<3;i++)stroke(g,[[x-w*.4,y+h*(i/5-.2),z+d/2+.005],[x,y+h*(i/5-.2)+.012,z+d/2+.006],[x+w*.39,y+h*(i/5-.2),z+d/2+.005]],0x805223,.0025);return m;}
export function counter(text='TESLİM',w=3){const g=named(new T.Group(),text==='KASA'?'cash-counter':'pickup-counter');box(g,w,.90,.78,0x805128,0,.49,0,.015);for(let i=0;i<Math.ceil(w/.26);i++)wood(g,.246,.77,.055,-w/2+.13+i*.26,.51,.403);box(g,w+.14,.10,.99,0xcba675,0,1.015,0,.032);box(g,w+.04,.045,.06,0x754b28,0,.958,.485,.008);const s=label(text,Math.min(w*.60,1.35),.28,'#e7d5a5','#385f64');s.position.set(0,.69,.448);g.add(s);for(const x of [-w/2+.13,w/2-.13]){const bolt=cylinder(g,.022,.022,.01,0xc4af74,x,.84,.455);bolt.rotation.x=Math.PI/2;}return g;}
export function cashRegister(){const g=named(new T.Group(),'cash-register');box(g,.52,.13,.41,0x325266,0,.08,0,.025);box(g,.47,.11,.08,0x55778b,0,.12,.23,.009);handle(g,0,.13,.274,.23);const body=box(g,.40,.27,.25,0x4b798d,0,.265,-.035,.025);body.rotation.x=-.20;box(g,.32,.14,.018,0x243d47,0,.34,.135,.009);const digits=label('035',.27,.095,'#b2cfaa','#294841');digits.position.set(0,.34,.147);g.add(digits);for(let row=0;row<3;row++)for(let col=0;col<4;col++)box(g,.054,.017,.035,col===3?0xdeac55:0xf1dfaf,-.11+col*.075,.181+row*.018,.19-row*.047,.007);cylinder(g,.077,.077,.03,0xe9cb7b,.13,.153,.195);return g;}
export function sodaMachine(){const g=named(new T.Group(),'drink-machine');box(g,1.24,.82,.80,0x3c8198,0,.49,0,.045);box(g,1.28,.35,.91,0xefa341,0,1.075,0,.045);const sign=label('SODA',.87,.19,'#f5cc65','#31536c');sign.position.set(0,1.072,.465);g.add(sign);box(g,1.14,.38,.031,0x264b5c,0,.735,.412,.012);for(const [i,x]of [-.34,0,.34].entries()){box(g,.20,.12,.095,[0xe56349,0xe6bd4b,0x88ae60][i],x,.86,.444,.022);box(g,.075,.105,.11,0x384a53,x,.715,.456,.011);cylinder(g,.037,.037,.045,0xbcc7c0,x,.635,.49);}box(g,1.20,.045,.79,steel(),0,.516,.065,.009);for(let i=0;i<15;i++)box(g,.018,.01,.49,0x50656c,-.52+i*.074,.545,.10,.002);const cup=soda();cup.position.set(0,.55,.25);g.add(cup);return g;}
export function passShelf(){const g=named(new T.Group(),'service-pass');for(const x of [-1.08,1.08]){box(g,.10,1.48,.11,0x385667,x,.78,-.18,.012);box(g,.43,.08,.45,steel(),x,.06,-.18,.013);}box(g,2.4,.08,.74,steel(),0,1.43,0,.023);for(const x of [-.76,0,.76]){const shade=add(g,new T.CylinderGeometry(.085,.18,.18,24,1,true),mat(0xd5b684));shade.position.set(x,1.25,0);const ready=box(g,.58,.036,.58,0xeddbc0,x,.69,0,.033);cylinder(g,.22,.22,.024,white,x,.72,0);}box(g,2.34,.05,.74,steel(),0,.655,0,.015);return g;}
export function barrel(seat=true){const g=named(new T.Group(),'barrel-seat');const profile=[[.29,0],[.34,.08],[.375,.34],[.35,.59],[.30,.66]].map(v=>new T.Vector2(...v));const body=add(g,new T.LatheGeometry(profile,32),mat(0xaf7c42));for(let i=0;i<16;i++){const a=i*Math.PI/8;stroke(g,[[Math.sin(a)*.305,.05,Math.cos(a)*.305],[Math.sin(a)*.374,.34,Math.cos(a)*.374],[Math.sin(a)*.323,.61,Math.cos(a)*.323]],0x855c30,.005);}for(const y of [.13,.54]){const r=ring(g,.349,.024,0x517480,0,y,0);r.rotation.x=Math.PI/2;}cylinder(g,.303,.303,.032,0xc49c60,0,.67,0);for(const x of [-.14,0,.14])box(g,.005,.003,.48,0x896131,x,.69,0,.001);return g;}
export function table(){const g=named(new T.Group(),'dining-table');cylinder(g,.21,.31,.71,0x95632c,0,.38,0);cylinder(g,.77,.77,.10,0xa96532,0,.77,0);cylinder(g,.744,.744,.025,0xc89955,0,.834,0);for(const z of [-.42,-.14,.14,.42])stroke(g,[[-Math.sqrt(.70*.70-z*z),.85,z],[0,.85,z+.004],[Math.sqrt(.70*.70-z*z),.85,z]],0x9c713d,.003);const rim=ring(g,.746,.028,0x855127,0,.83,0);rim.rotation.x=Math.PI/2;const tray=cylinder(g,.25,.25,.024,0xf0dcaa,.15,.864,-.15);const bottle=box(g,.095,.20,.075,0xc9513d,-.35,.94,.08,.025);cylinder(g,.028,.032,.065,0xe5daca,-.35,1.065,.08);box(g,.23,.07,.13,0xe0c99a,.33,.90,.25,.015);for(let i=0;i<4;i++)box(g,.18,.003,.11,white,.33,.94+i*.003,.25,.005);return g;}
export function burger(){const g=named(new T.Group(),'krabby-patty');const bun=mat(0xe2a251,{roughness:.8});ell(g,.27,bun,0,.245,0,[1,.48,1]);cylinder(g,.251,.264,.064,0xe0a95d,0,.045,0);cylinder(g,.256,.257,.072,0x774628,0,.104,0);for(let i=0;i<12;i++){const a=i*Math.PI/6;ell(g,.065,0x77a749,Math.sin(a)*.225,.161,Math.cos(a)*.225,[1,.32,1]);}for(const y of [.185,.203])cylinder(g,.23,.23,.023,0xcf5034,0,y,0);const cheese=box(g,.455,.015,.44,0xf2ca56,0,.149,0,.007);cheese.rotation.y=.3;for(let i=0;i<28;i++){const a=i*2.399,r=.225*Math.sqrt((i+.5)/28);const seed=ell(g,.012,0xffecc4,Math.cos(a)*r,.245+.127*Math.sqrt(1-r*r/.078),Math.sin(a)*r,[.55,.38,1.8]);seed.rotation.y=-a;}return g;}
export function soda(){const g=named(new T.Group(),'soda-cup');cylinder(g,.090,.065,.24,0xe46b48,0,.13,0);for(const y of [.06,.13,.20])cylinder(g,.065+(y/.24)*.026,.065+(y/.24)*.026,.027,white,0,y,0);cylinder(g,.099,.095,.020,white,0,.26,0);cylinder(g,.079,.079,.012,0xc9d7cd,0,.276,0);cylinder(g,.014,.014,.24,0x58a6bd,.037,.39,0,12);const band=cylinder(g,.019,.019,.015,white,.037,.40,0,12);return g;}

export const catalog=[
 ['nero','Nero · komi',nero,'character'],['spongebob','SpongeBob · aşçı',sponge,'character'],['squidward','Squidward · kasiyer',squid,'character'],
 ['grill','Burger ızgarası',grill,'equipment'],['hood','Davlumbaz',hood,'equipment'],['fridge','Soğuk dolap',fridge,'equipment'],['prep','Hazırlama tezgâhı',prep,'equipment'],['sink','Yıkama tezgâhı',sink,'equipment'],['pass','Ürün teslim rafı',passShelf,'equipment'],['cash-counter','Kasa tezgâhı',()=>counter('KASA',2.15),'equipment'],['pickup-counter','Teslim tezgâhı',()=>counter('TESLİM',3.4),'equipment'],['register','Kasa',cashRegister,'equipment'],['drink-machine','İçecek makinesi',sodaMachine,'equipment'],['table','Restoran masası',table,'equipment'],['seat','Fıçı oturak',barrel,'equipment'],['burger','Yengeç Burger',burger,'food'],['soda','İçecek bardağı',soda,'food']
];
