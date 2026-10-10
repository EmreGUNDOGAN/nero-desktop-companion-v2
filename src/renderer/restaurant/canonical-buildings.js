import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,ring,mat,add} from './models.js';
function tube(p,points,c,r=.045){return add(p,new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),24,r,8,false),mat(c));}
function words(p,lines,w,h,x,y,z,color='#783037'){
 const c=document.createElement('canvas');c.width=2048;c.height=Math.max(128,Math.round(c.width*h/w));
 const ctx=c.getContext('2d');ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=color;
 let fontSize=Math.floor(c.height*.82/lines.length);ctx.font=`900 ${fontSize}px Nunito, Arial`;
 const measured=Math.max(...lines.map(s=>ctx.measureText(s).width));fontSize=Math.floor(fontSize*Math.min(1,c.width*.94/measured));ctx.font=`900 ${fontSize}px Nunito, Arial`;
 lines.forEach((s,i)=>ctx.fillText(s,c.width/2,c.height*(i+.5)/lines.length));
 const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;
 const m=add(p,new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({map:t,transparent:true,depthWrite:false,toneMapped:false,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),x,y,z);
 m.castShadow=m.receiveShadow=false;m.userData.signText=true;return m;
}
function scroll(p,lines,x,y,z,w=6.4,h=1.25,bg=0xe9ddb2,color='#753037'){
 const s=new T.Shape();for(let i=0;i<=30;i++){const a=-w/2+i*w/30,b=h/2+.06*Math.sin(i*.8);if(!i)s.moveTo(a,b);else s.lineTo(a,b);}for(let i=30;i>=0;i--)s.lineTo(-w/2+i*w/30,-h/2+.07*Math.sin(i*.73));s.closePath();add(p,new T.ExtrudeGeometry(s,{depth:.04,bevelEnabled:true,bevelSize:.02,bevelThickness:.015,bevelSegments:2}),mat(bg),x,y,z);words(p,lines,w*.94,h*.90,x,y,z+.09,color);for(const dx of [-w/2,w/2])cylinder(p,.11,.11,h+.3,0xd4bd8b,x+dx,y,z);
}
function porthole(p,x,y,z,r=.28){ring(p,r,.07,0x386787,x,y,z);ball(p,r*.82,0x8cc8d8,x,y,z+.012,[1,1,.15]);}
function shell(p,x,y,z){const shape=new T.Shape();shape.moveTo(0,-.2);shape.lineTo(-.38,0);for(let i=0;i<=16;i++){const a=Math.PI-i*Math.PI/16;shape.lineTo(Math.cos(a)*.39,Math.sin(a)*.4);}shape.lineTo(0,-.2);const g=new T.Group();g.position.set(x,y,z);p.add(g);add(g,new T.ExtrudeGeometry(shape,{depth:.06,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:2}),mat(0xe298b5));for(let i=0;i<5;i++){const a=i*Math.PI/4;tube(g,[[0,-.13,.10],[Math.cos(a)*.20,Math.sin(a)*.20,.1],[Math.cos(a)*.34,Math.sin(a)*.35,.1]],0xb36d97,.012);}return g;}
export function canonicalMarket(){
 const p=new T.Group();box(p,6.4,3.3,4.5,0x8c4d42,0,1.65,0,.03);
 for(let i=0;i<9;i++){box(p,6.35,.30,.08,i%2?0x9b5549:0x7c4140,0,.25+i*.35,2.28,.025);for(const x of [-3.22,3.22])box(p,.08,.30,4.45,i%2?0x945045:0x7d4540,x,.25+i*.35,0,.02);}
 const roofShape=new T.Shape();roofShape.moveTo(-2.25,0);roofShape.lineTo(2.25,0);for(let i=0;i<=24;i++){const a=i*Math.PI/24;roofShape.lineTo(Math.cos(a)*2.25,Math.sin(a)*.85);}roofShape.closePath();const roofGeo=new T.ExtrudeGeometry(roofShape,{depth:6.4,bevelEnabled:false});roofGeo.translate(0,0,-3.2);roofGeo.rotateY(Math.PI/2);add(p,roofGeo,mat(0x773f40),0,3.3,0);
 for(const x of [-2.1,2.1]){box(p,.46,3.4,.13,0xe1ad35,x,1.66,2.36,.02);tube(p,Array.from({length:25},(_,i)=>{const a=i*Math.PI/24;return [x,3.32+Math.sin(a)*.87,Math.cos(a)*2.3];}),0xd09a2d,.21);for(const y of [.4,1.2,2.0,2.8])ball(p,.13,0xffcb52,x,y,2.45,[1,1,.5]);}
 for(const x of [-3.2,3.2])for(const z of [-2.2,2.2])ball(p,.29,0xddb24b,x,3.3,z,[1,.8,1]);
 // Skull-and-crossbones are actual geometry mounted above the arched doors.
 for(const slope of [-1,1]){tube(p,[[-.88,2.20,2.48],[0,2.72,2.48],[.88,3.24,2.48]].map(([x,y,z])=>[x,2.72+(y-2.72)*slope,z]),0xc7d4e4,.066);for(const side of [-1,1]){const x=side*.87,y=2.72+side*.51*slope;ball(p,.11,0xc7d4e4,x,y+.075,2.48);ball(p,.11,0xc7d4e4,x,y-.075,2.48);}}
 ball(p,.62,0xbdcde0,0,2.85,2.48,[.90,1.0,.26]);for(const x of [-.23,.23])ball(p,.16,0x293e59,x,2.93,2.65,[.88,1,.25]);ball(p,.095,0x293e59,0,2.66,2.66,[.7,1.1,.2]);for(const x of [-.23,-.08,.08,.23])box(p,.115,.24,.10,0xbdcde0,x,2.43,2.58,.02);
 box(p,1.37,1.70,.13,0x593931,0,.80,2.36,.30);for(const x of [-.12,.12])box(p,.048,.25,.05,0xe2b752,x,.64,2.48,.008);
 for(const x of [-2.2,2.2]){cylinder(p,.065,.08,3.1,0x82694a,x,4.76,.15);cylinder(p,.14,.12,.16,0xdbd1ac,x,6.40,.15);}scroll(p,["BARG'N-MART"],0,5.79,.15,6.2,1.25);
 for(const x of [-3.22,3.22]){const port=new T.Group();port.position.set(x,1.65,.2);port.rotation.y=x>0?Math.PI/2:-Math.PI/2;p.add(port);box(port,1.25,.91,.10,0x3f5884,0,0,0,.13);tube(port,[[-.33,.12,.10],[-.33,-.2,.10],[.27,-.2,.10],[.27,.29,.10]],0x7187b0,.046);}
 for(const x of [-2.9,-2.5,2.4,2.9])ball(p,.17,0x90acd0,x,.16,2.44,[.5,1.8,.7]);return p;
}
export function canonicalBank(){
 const p=new T.Group();const barrel=cylinder(p,2.15,2.15,6.35,0x80624c,0,2.15,0,40);barrel.rotation.z=Math.PI/2;
 for(let i=0;i<20;i++){const a=i*Math.PI/10;box(p,6.38,.028,.028,0x594c41,0,2.15+Math.sin(a)*2.17,Math.cos(a)*2.17,.006);}
 for(const x of [-2.52,2.52]){const hoop=ring(p,2.18,.19,0xa36f38,x,2.15,0);hoop.rotation.y=Math.PI/2;}
 for(const x of [-.49,.49]){box(p,.92,1.65,.15,0x2b7297,x,.79,2.10,.035);box(p,.76,1.45,.10,0x70becd,x,.82,2.19,.025);box(p,.07,.40,.10,0xdbbb65,x+(x<0?.28:-.28),.79,2.27,.006);}box(p,1.15,.11,.77,0xabaa83,0,.025,2.43,.02);
 for(const x of [-2.73,2.73]){cylinder(p,.075,.1,4.6,0x796040,x,3.7,-.2);shell(p,x,5.43,.08);}scroll(p,['FIRST NAUTICAL','BANK'],0,5.44,0,4.7,1.42,0xf0cc55,'#a13b3d');return p;
}
export function canonicalPostOffice(){
 const p=new T.Group();box(p,6.8,3.45,4.4,0xc9b99a,0,1.72,0,.06);box(p,6.95,.11,4.55,0xabb5aa,0,3.49,0,.025);
 for(const x of [-3.20,3.20])for(const y of [.25,1.1,2,2.9,3.3])ball(p,.055,0x637e89,x,y,2.23,[1,1,.40]);for(let i=0;i<8;i++)ball(p,.048,0x718590,-2.8+i*.8,3.29,2.24,[1,1,.4]);
 for(const x of [-2.2,2.2])porthole(p,x,1.82,2.27,.37);box(p,.95,2,.10,0x33789b,0,.93,2.26,.09);ball(p,.049,0xe3d0a3,.26,.9,2.34);
 words(p,['POST OFFICE'],5.9,1.1,0,2.84,2.47,'#426789');
 for(const [x,z,a]of [[-1.9,-.6,-.2],[0,.2,.12],[1.9,-.3,.3]]){const e=new T.Group();e.position.set(x,3.63,z);e.rotation.y=a;p.add(e);box(e,1.48,.12,.91,0xe9e7d2,0,0,0,.01);for(const side of [-1,1])tube(e,[[side*.65,.08,-.35],[0,.08,.13]],0x899ba1,.014);}
 const arrow=new T.Shape();arrow.moveTo(-.13,0);arrow.lineTo(.13,0);arrow.lineTo(.13,.60);arrow.lineTo(.31,.60);arrow.lineTo(0,1.0);arrow.lineTo(-.31,.60);arrow.lineTo(-.13,.60);arrow.closePath();const o=add(p,new T.ExtrudeGeometry(arrow,{depth:.05,bevelEnabled:false}),mat(0xb15653));o.position.set(3.42,1.95,1.6);o.rotation.y=Math.PI/2;return p;
}
