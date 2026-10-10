import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,ring,mat,add} from './models.js';
function tube(p,points,color,r=.045){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),24,r,8,false),mat(color));}
function port(p,x,y,z,r=.32,color=0x567fbb){ring(p,r,.065,color,x,y,z);ball(p,r*.80,0x85c4de,x,y,z+.02,[1,1,.13]);for(let i=0;i<6;i++){const a=i*Math.PI/3;ball(p,.027,0xb8c8c8,x+Math.sin(a)*r,y+Math.cos(a)*r,z+.07,[1,1,.4]);}}
function door(p,x,y,z,color=0x987044,w=.95,h=1.8){box(p,w,h,.10,color,x,y,z,.15);for(let i=0;i<5;i++)box(p,.016,h*.83,.015,0x654d38,x-w*.38+i*w*.19,y,z+.055,.002);ball(p,.047,0xe2bf6a,x+w*.27,y-.15,z+.08);}
function caption(p,lines,w,h,x,y,z,bg='#a68050',fg='#fff2cf'){
 const c=document.createElement('canvas');c.width=2048;c.height=Math.round(2048*h/w);const ctx=c.getContext('2d');ctx.fillStyle=bg;ctx.fillRect(0,0,c.width,c.height);ctx.strokeStyle='#70512f';ctx.lineWidth=12;ctx.strokeRect(8,8,c.width-16,c.height-16);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=fg;let size=Math.floor(c.height*.8/lines.length);ctx.font=`900 ${size}px Nunito`;size=Math.floor(size*Math.min(1,c.width*.90/Math.max(...lines.map(s=>ctx.measureText(s).width))));ctx.font=`900 ${size}px Nunito`;lines.forEach((s,i)=>ctx.fillText(s,c.width/2,c.height*(i+.5)/lines.length));const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;const m=add(p,new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map,toneMapped:false}),x,y,z);m.castShadow=false;return m;
}
function fence(p,w,d,color=0xe4ecda){for(const side of [-1,1]){for(let i=0;i<Math.round(d/.55);i++){const z=-d/2+i*.55;box(p,.12,.78,.20,color,side*w/2,.40,z,.025);const top=cylinder(p,0,.16,.18,color,side*w/2,.88,z,4);top.rotation.y=Math.PI/4;}for(const y of [.26,.61])box(p,.10,.075,d,color,side*w/2,y,0,.005);}for(const side of [-1,1]){for(let i=0;i<Math.round(w/.55);i++){const x=-w/2+i*.55;if(side===1&&Math.abs(x)<1)continue;box(p,.20,.78,.12,color,x,.4,side*d/2,.02);const top=cylinder(p,0,.16,.18,color,x,.88,side*d/2,4);top.rotation.y=Math.PI/4;}for(const y of [.26,.61])if(side<0)box(p,w,.075,.10,color,0,y,side*d/2,.005);else for(const x of [-w/4-.5,w/4+.5])box(p,w/2-1,.075,.10,color,x,y,d/2,.005);}}
function garden(p,w=9,d=9,fenceColor=0xe4ecda){box(p,w,.06,d,0x8db565,0,.025,0,.01);fence(p,w,d,fenceColor);for(let i=0;i<6;i++)cylinder(p,.24,.30,.045,0xc6c6a9,0,.076,1.25+i*.58,12);}
function scallops(p,r,y,color,n=18,size=.30,cx=0,cz=0){for(let i=0;i<n;i++){const a=i*Math.PI*2/n;ball(p,size,color,cx+Math.sin(a)*r,y,cz+Math.cos(a)*r,[1,1.55,.38]).rotation.y=a;}}
function flowers(p,x,y,z){cylinder(p,.31,.25,.45,0xb28644,x,y,z);for(let i=0;i<5;i++){const a=i*2.4;tube(p,[[x,y+.2,z],[x+Math.sin(a)*.12,y+.56,z+Math.cos(a)*.12]],0x648e48,.018);for(let j=0;j<5;j++){const b=j*Math.PI*2/5;ball(p,.038,0xe9d5e2,x+Math.sin(a)*.12+Math.cos(b)*.065,y+.58+Math.sin(b)*.065,z+Math.cos(a)*.12,[1,1,.4]);}}}

export function shadyShoals(){
 const p=new T.Group();const profile=[[2.0,0],[2.02,.4],[1.88,2.1],[1.78,4.1],[1.42,6.5],[1.40,7.0],[0,7.08]].map(v=>new T.Vector2(...v));add(p,new T.LatheGeometry(profile,24),mat(0x7d9eb1,{metalness:.15}));
 for(const y of [2.0,4.0,6.3]){const r=y<3?1.9:y<5?1.78:1.45;ring(p,r,.022,0x506e89,0,y,0).rotation.x=Math.PI/2;for(let i=0;i<10;i++){const a=i*Math.PI/5;ball(p,.035,0xb7c2c4,Math.sin(a)*r,y+.1,Math.cos(a)*r);}}
 for(const [x,y,z,r]of [[-.9,1.3,1.72,.30],[.95,1.08,1.69,.4],[-.9,3.8,1.48,.30],[.8,4.5,1.32,.36],[-.7,6.2,1.20,.3]])port(p,x,y,z,r);
 door(p,0,.93,2.13,0x6f91ba,.78,1.65);for(let i=0;i<10;i++)box(p,1.35,.075,.27,0xb4976a,0,.08,2.12+i*.30,.008);for(const x of [-.7,.7])for(const z of [2.3,3.4,4.6]){cylinder(p,.065,.08,.65,0x998559,x,.33,z);ball(p,.1,0xc2ad7c,x,.66,z,[1,.42,1]);}for(const x of [-.7,.7])tube(p,[[x,.57,2.3],[x,.57,4.6]],0x9d8d60,.034);
 tube(p,[[0,6.9,0],[-.25,7.55,0],[.1,8.2,0],[.1,8.7,.2]],0x966b57,.24);tube(p,[[-1.8,1.5,0],[-2.6,1.5,0],[-2.95,2.0,0],[-2.95,3.4,0]],0x99674f,.25);
 tube(p,[[1.48,4.0,0],[2.18,4.1,0],[2.40,5.3,0],[2.8,5.5,0]],0x7c95a8,.18);const mouth=cylinder(p,.26,.22,.15,0x577a91,2.83,5.50,0);mouth.rotation.z=Math.PI/2;
 tube(p,[[1.6,3,.15],[2.45,5.0,.15],[3.6,6.9,.15],[4.7,7.7,.15]],0x405a70,.045);ring(p,.12,.027,0x63737c,4.7,7.64,.15);tube(p,[[4.7,7.64,.15],[4.7,6.7,.15]],0x8e8765,.018);box(p,2.95,2.1,.11,0x87623f,4.65,5.55,.20,.05);caption(p,['SHADY','SHOALS','REST HOME'],2.80,1.92,4.65,5.55,.28);return p;
}
export function puffHome(){
 const p=new T.Group();garden(p,9.7,9.2);const b=new T.Group();b.position.z=-.9;p.add(b);const body=cylinder(b,1.65,1.23,5.3,0x9853a4,0,2.70,0,24);body.rotation.z=-.07;scallops(b,1.65,5.23,0xf2d064);port(b,.68,3.07,1.40,.40,0xe4ba52);
 for(const [points,r]of [[[[0,5.3,0],[0,6.35,0],[-.15,6.9,0]],.23],[[[-1.5,3.2,0],[-2.5,3.2,0],[-2.5,4.2,0]],.19],[[[1.35,1.8,0],[2.0,1.8,0],[2.2,2.5,0]],.15]]){tube(b,points,0x9c56aa,r);const end=points.at(-1);cylinder(b,r*1.45,r*1.45,.13,0xefd368,...end);scallops(b,r*1.45,end[1]-.10,0xebc552,8,.075,end[0],end[2]);}
 box(b,1.15,1.8,.09,0x8a449a,0,.85,1.38,.13);for(const x of [-.63,.63])box(b,.13,1.9,.10,0xe8c254,x,.91,1.4,.04);for(let i=0;i<7;i++){const a=box(b,.20,.10,.9,i%2?0xefc160:0xf4e4c9,-.6+i*.2,1.88,1.60,.008);a.rotation.x=.18;}ring(b,.11,.035,0xedd273,0,.79,1.46);
 tube(p,[[-3,.1,-1.8],[-3,1.4,-1.8],[-3.35,2.0,-1.8]],0x9a7250,.12);for(let i=0;i<7;i++)ball(p,.38,0xb85543,-3+Math.sin(i*2.4)*.65,2+Math.cos(i*1.7)*.25,-1.8+Math.cos(i*2.4)*.48,[1,.62,.62]);return p;
}
function moai(p,y,r,h,color){const profile=[[r,0],[r*1.05,.3],[r*.91,h*.9],[r*.90,h],[0,h]].map(v=>new T.Vector2(...v));add(p,new T.LatheGeometry(profile,12),mat(color),0,y,0);for(const x of [-r*.41,r*.41]){port(p,x,y+h*.73,r*.85,r*.23,0x8790bd);box(p,r*.60,.18,.1,color,x,y+h*.93,r*.88,.02);}box(p,.46,h*.31,.60,color,0,y+h*.55,r*.89,.04);for(const x of [-r*1.03,r*1.03])box(p,.30,h*.20,.50,color,x,y+h*.65,0,.03);door(p,0,y+.85,r*1.10,0xa17b47,.9,1.65);}
export function squilliamTower(){
 const p=new T.Group();moai(p,0,1.73,4.9,0x476b80);cylinder(p,1.84,1.90,.29,0x3c6074,0,5.06,0,24);moai(p,5.2,1.33,4.4,0x496e85);
 box(p,.8,1.1,.11,0x2e3a62,0,6.95,1.45,.20);for(const x of [-.34,.34]){const curtain=ball(p,.44,0x7c4f9b,x,7.20,1.49,[.4,1.4,.25]);curtain.rotation.z=x<0?-.16:.16;}
 function rail(y,r,n=16){ring(p,r,.065,0xd2e2df,0,y+.63,0).rotation.x=Math.PI/2;cylinder(p,r,r,.16,0xa0c1d0,0,y,0,32);for(let i=0;i<n;i++){const a=i*Math.PI*2/n;cylinder(p,.045,.066,.57,0xc3dadd,Math.sin(a)*r,y+.35,Math.cos(a)*r);}}
 rail(6.35,1.66,12);cylinder(p,1.40,1.1,.40,0x6689a1,0,9.9,0,24);rail(10.12,2.15);
 for(let i=0;i<8;i++){const a=i*Math.PI/4;cylinder(p,.095,.13,1.72,0xb8d3dc,Math.sin(a)*1.68,11.08,Math.cos(a)*1.68);}
 cylinder(p,1.78,1.78,.2,0x93bdd2,0,12.02,0);const dome=add(p,new T.SphereGeometry(1.82,32,16,0,Math.PI*2,0,Math.PI/2),mat(0x884c96),0,12.13,0);dome.scale.y=1.3;
 for(let i=0;i<8;i++){const a=i*Math.PI/4;tube(p,Array.from({length:16},(_,j)=>{const q=j*Math.PI/30;return [Math.cos(a)*1.84*Math.cos(q),12.13+2.36*Math.sin(q),Math.sin(a)*1.84*Math.cos(q)];}),0xbdd9df,.065);}
 rail(14.42,.75,8);cylinder(p,.48,.61,1.18,0x77a6bc,0,15.16,0,16);for(const x of [-.27,0,.27])box(p,.16,.65,.07,0x263d61,x,15.19,.5,.07);cylinder(p,.73,.70,.12,0xc2dfe4,0,15.83,0);ball(p,.68,0x874c99,0,16.13,0,[1,.65,1]);cylinder(p,.035,.05,2.15,0xa1bfc8,0,17.20,0);box(p,1.5,.69,.045,0xe5cf80,.77,17.68,0,.02);box(p,1.49,.16,.05,0xb77465,.77,17.68,.025,.005);ball(p,.20,0x6f9995,.77,17.70,.058,[.7,1,.22]);ball(p,.043,0x273e48,.7,17.75,.11,[1,.7,.3]);ball(p,.043,0x273e48,.84,17.75,.11,[1,.7,.3]);box(p,.24,.04,.04,0x263d48,.77,17.88,.09,.008);return p;
}
export function parentsHome(){
 const p=new T.Group();cylinder(p,2.25,2.2,3.7,0xd5a743,0,1.85,0,32);cylinder(p,2.50,2.48,.13,0xe8ead6,0,3.71,0);scallops(p,2.28,3.51,0xe5ecd7,24,.27);scallops(p,2.40,3.75,0xf4f1de,24,.26);
 for(const [x,y,z]of [[-1.23,1.22,1.87],[1.20,2.40,1.90]])port(p,x,y,z,.36);const side=new T.Group();side.rotation.y=-Math.PI/2;side.position.x=-2.12;p.add(side);port(side,0,2.25,.10,.29);
 box(p,1.02,1.64,.12,0x30668f,0,.79,2.30,.17);ring(p,.14,.04,0x80b8cb,0,.69,2.40);for(const x of [-.9,.9]){cylinder(p,.16,.13,.3,0xa06240,x,.15,2.37);for(let i=0;i<4;i++)ball(p,.07,0x5d9653,x+Math.sin(i*2)*.09,.39+i*.1,2.37);}
 tube(p,[[-1,3.71,-.5],[-1.08,4.35,-.5],[-.91,4.65,-.5]],0x547c8e,.17);box(p,.75,.02,.53,0xbd7a88,0,.035,2.76,.01);return p;
}
export function grandmaHome(){
 const p=new T.Group();garden(p,9,8.4,0xaf8a4d);cylinder(p,1.85,1.67,3.1,0x77aeb6,0,1.56,-.55,24);
 const roof=add(p,new T.SphereGeometry(2.28,32,16,0,Math.PI*2,0,Math.PI/2),mat(0xcac051),0,3.08,-.55);roof.scale.y=.88;
 for(let i=0;i<52;i++){const a=i*Math.PI*2/52;const points=[];for(let j=0;j<9;j++){const q=.10+j*.16;points.push([Math.cos(a)*2.31*Math.sin(q),3.08+2*Math.cos(q),-.55+Math.sin(a)*2.31*Math.sin(q)]);}tube(p,points,i%2?0x9fac44:0xd8c75b,.040);}scallops(p,2.22,3.08,0xc2b647,32,.16);
 door(p,0,1.02,1.40,0xa07742,1.05,1.9);for(const x of [-1.06,1.06]){port(p,x,1.76,1.03,.34,0x7e85b2);flowers(p,x,1.03,1.35);}tube(p,[[1.1,4.23,-.8],[1.23,4.95,-.8],[1.10,5.42,-.8]],0x9c7056,.18);return p;
}
export function tentaclesHome(){
 const p=new T.Group();moai(p,0,1.65,5.2,0x4d7188);box(p,.89,2.0,.12,0xa1773d,0,.95,1.88,.19);
 for(const [x,y,z,r]of [[-1.07,5.13,.2,.58],[-.75,5.64,.1,.61],[0,5.83,.1,.64],[.78,5.55,.1,.61],[1.16,5.08,.1,.58],[-.42,5.20,.85,.62],[.43,5.20,.85,.62]]){ball(p,r,0x607f95,x,y,z,[1,1,.58]);const pts=[];for(let i=0;i<34;i++){const a=i*.16,r2=.32*(1-i/40);pts.push([x+Math.cos(a)*r2,y+Math.sin(a)*r2,z+r*.59]);}tube(p,pts,0x2f4d66,.020);}
 box(p,2.35,.22,.18,0x6c89a1,0,4.93,1.24,.02);for(const x of [-1.73,1.73])ball(p,.27,0xe3c158,x,2.14,.20);return p;
}
export const buildingCatalog2=[['building-shady-shoals','Shady Shoals',shadyShoals,'building'],['building-puff-home','Mrs. Puff’ın evi',puffHome,'building'],['building-squilliam','Squilliam’ın kulesi',squilliamTower,'building'],['building-parents','SpongeBob’un ailesinin evi',parentsHome,'building'],['building-grandma','Büyükanne SquarePants’ın evi',grandmaHome,'building'],['building-tentacles','Mrs. Tentacles’ın evi',tentaclesHome,'building']];
export function addBuildingDistrict(outside){const buildings=[];for(const [id,f,x,z,parcel]of [['building-shady-shoals',shadyShoals,-37,-40,'north-west'],['building-squilliam',squilliamTower,-24,-40,'north-west'],['building-puff-home',puffHome,-45,46,'south-west'],['building-grandma',grandmaHome,40,46,'south-east'],['building-parents',parentsHome,50,44,'south-east'],['building-tentacles',tentaclesHome,-45,38,'south-west']]){const o=f();o.name=id;o.position.set(x,-.25,z);outside.add(o);o.updateMatrixWorld(true);const b=new T.Box3().setFromObject(o);buildings.push({id,x,z,parcel,min:b.min.toArray(),max:b.max.toArray()});}return buildings;}
