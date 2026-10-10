import * as T from './vendor/three.module.min.js';
import {sandyChef} from './sandy-model.js';
import {box,ball,cylinder,ring,line,mat,add} from './models.js';
export function sandyFryer(){const g=sandyChef();g.name='sandy-fryer-prototype';box(g,.48,.48,.026,0x9ad4cf,0,.82,.31,.05);line(g,[[-.18,1.05,.32],[0,1.09,.35],[.18,1.05,.32]],0xfaf4d8,.025);box(g,.22,.13,.03,0xeff8e2,0,.78,.335,.015);const hand=g.userData.arms[1];const handle=cylinder(hand,.022,.022,.48,0x727d7b,0,-.44,.14);handle.rotation.x=.8;const basket=box(hand,.23,.14,.25,new T.MeshStandardMaterial({color:0xb8c5bf,wireframe:true}),0,-.61,.33,.015);for(let i=0;i<5;i++){const chip=box(hand,.035,.15,.035,0xefc46a,-.09+i*.045,-.54,.33,.01);chip.rotation.z=(i-2)*.07;}return g;}
export function krabsCleaner(){
 const g=new T.Group();g.name='mr-krabs-cleaner-prototype';const red=0xf03e35,ink=0x433b38,shirt=0xa8daed,pants=0x8a9bd1;
 function outlined(o,scale=1.025){const edge=new T.Mesh(o.geometry,new T.MeshBasicMaterial({color:ink,side:T.BackSide}));edge.scale.setScalar(scale);o.add(edge);return o;}
 function ell(parent,r,c,x,y,z,scale){return outlined(ball(parent,r,c,x,y,z,scale),1.018);}
 function shape(parent,path,color,x,y,z,depth=.055){const geom=new T.ExtrudeGeometry(path,{depth,bevelEnabled:true,bevelSize:.014,bevelThickness:.014,bevelSegments:3,curveSegments:32});geom.translate(0,0,-depth/2);return outlined(add(parent,geom,mat(color,{roughness:.65}),x,y,z),1.025);}
 function stroke(parent,points,c,r=.013){return line(parent,points,c,r);}
 const profile=[[0,.18],[.39,.18],[.60,.29],[.68,.54],[.68,.81],[.60,.94],[0,.94]].map(v=>new T.Vector2(...v));const trousers=outlined(add(g,new T.LatheGeometry(profile,64),mat(pants),0,0,0));trousers.scale.z=.68;
 for(const side of [-1,1]){const cuff=outlined(cylinder(g,.19,.20,.18,pants,side*.35,.18,0,40));cuff.scale.z=.8;const foot=outlined(cylinder(g,.085,0,.20,red,side*.35,.075,.045,32));}
 // Broad high waistband and rectangular gold buckle follow the reference.
 const belt=outlined(cylinder(g,.70,.715,.13,ink,0,.84,0,64));belt.scale.z=.7;box(g,.20,.17,.06,0xf5c34b,-.19,.84,.515,.026);box(g,.126,.092,.025,ink,-.19,.84,.553,.012);stroke(g,[[-.21,.69,.452],[-.23,.40,.447],[-.14,.28,.431],[-.06,.30,.447]],0x606b99,.012);
 const shirtProfile=[[.60,.90],[.60,.96],[.50,1.21],[.38,1.39],[0,1.39]].map(v=>new T.Vector2(...v));const torso=outlined(add(g,new T.LatheGeometry(shirtProfile,64),mat(shirt),0,0,0));torso.scale.z=.72;
 const collar=new T.Shape();collar.moveTo(-.17,.06);collar.lineTo(.15,.06);collar.lineTo(.05,-.17);collar.closePath();for(const side of [-1,1]){const o=shape(g,collar,shirt,side*.17,1.33,.329,.022);o.rotation.z=side*.20;}
 const head=ell(g,.43,red,0,1.51,.015,[1.06,.68,.72]);
 // The face is broad, with a clear open smile, rather than a tiny mouth on a sphere.
 const smile=new T.Shape();smile.moveTo(-.36,.055);smile.bezierCurveTo(-.28,.13,-.12,.01,0,.015);smile.bezierCurveTo(.17,.015,.28,.12,.36,.07);smile.bezierCurveTo(.43,-.05,.25,-.24,0,-.24);smile.bezierCurveTo(-.24,-.24,-.43,-.08,-.36,.055);shape(g,smile,0xfffcf0,0,1.51,.333,.040);
 stroke(g,[[-.34,1.515,.371],[-.22,1.46,.388],[0,1.43,.393],[.22,1.46,.388],[.34,1.52,.369]],ink,.012);for(const x of [-.25,-.12,0,.12,.25])stroke(g,[[x,1.46+(Math.abs(x)*.12),.391],[x+.009,1.42+(Math.abs(x)*.12),.392]],ink,.009);
 const nose=ell(g,.071,red,-.035,1.65,.335,[1.8,.55,.54]);stroke(g,[[-.035,1.657,.365],[-.115,1.73,.345],[-.235,1.745,.305],[-.285,1.795,.29]],0x99462e,.022);
 const arms=[],legs=[];
 // Tall tapered pale-green eyes are Mr. Krabs' strongest identifying feature.
 for(const side of [-1,1]){const eye=new T.Group();eye.position.set(side*.16,1.71,0);eye.rotation.z=-side*.055;g.add(eye);const ep=[[.045,0],[.062,.08],[.092,.40],[.10,.72],[.082,.94],[.045,1.035],[0,1.055]].map(v=>new T.Vector2(...v));const globe=outlined(add(eye,new T.LatheGeometry(ep,48),mat(0xc8e88f),0,0,0),1.04);globe.scale.z=.73;ell(eye,.050,ink,0,.40,.075,[.72,1.28,.35]);ball(eye,.022,0xfffcf0,-.007,.432,.093,[.72,.8,.30]);for(let i=0;i<3;i++)stroke(eye,[[0,1.07,0],[(i-1)*.043,1.155,.006],[(i-1)*.068,1.20+(i===1?.04:0),.01]],0x93412a,.015);
 const arm=new T.Group();arm.name='krabs-arm-'+side;arm.position.set(side*.46,1.25,0);g.add(arm);const cuff=outlined(cylinder(arm,.105,.115,.13,shirt,side*.04,0,0));cuff.rotation.z=Math.PI/2;const raised=side<0,pts=raised?[[0,0,0],[-.36,0,0],[-.45,.20,.01],[-.49,.45,.02]]:[[0,0,0],[.35,-.06,0],[.25,-.30,.035],[.17,-.44,.05]];stroke(arm,pts,red,.047);
 const claw=new T.Shape();claw.moveTo(.04,-.31);claw.bezierCurveTo(-.40,-.34,-.46,.04,-.30,.36);claw.bezierCurveTo(-.09,.62,.24,.52,.25,.27);claw.quadraticCurveTo(.24,.20,.14,.22);claw.quadraticCurveTo(.025,.18,.08,.09);claw.quadraticCurveTo(.19,.035,.085,-.045);claw.quadraticCurveTo(.04,-.135,.145,-.10);claw.quadraticCurveTo(.24,-.055,.235,.04);claw.quadraticCurveTo(.26,.18,.36,.115);claw.bezierCurveTo(.59,-.03,.43,-.37,.04,-.31);const hand=new T.Group();const end=pts.at(-1);hand.position.set(...end);arm.add(hand);const mesh=shape(hand,claw,red,0,.04,0,.22);if(!raised)mesh.rotation.z=-.65;
 const shine=ell(hand,.12,0xffaaa1,-.22,.25,.128,[.48,1.45,.13]);shine.rotation.z=-.6;if(!raised){hand.scale.setScalar(.91);}arms.push(arm);
 const leg=new T.Group();leg.name='krabs-leg-'+side;g.add(leg);legs.push(leg);}
 // Cleaning equipment is separate from the character silhouette in this review model.
 const mop=new T.Group();mop.position.set(-1.12,.22,.50);g.add(mop);cylinder(mop,.023,.023,1.20,0xc99c62,0,.49,0);box(mop,.34,.075,.21,0x6ba6aa,0,-.13,0,.025);for(let i=0;i<8;i++)stroke(mop,[[(i-3.5)*.037,-.16,-.075],[(i-3.5)*.039,-.23,.12]],0xe8ead4,.017);const bucket=new T.Group();bucket.position.set(.95,0,.42);g.add(bucket);cylinder(bucket,.15,.11,.25,0x6ba6aa,0,.125,0);ring(bucket,.139,.013,0xc2e2d3,0,.25,0).rotation.x=Math.PI/2;stroke(bucket,[[-.13,.21,0],[-.11,.38,0],[.11,.38,0],[.13,.21,0]],0x687d7e,.012);
 g.userData={arms,legs,mop,animationNodes:arms.concat(legs).map(o=>o.name),assetVersion:4};return g;
}
export const cozyCatalog=[['sandy','Sandy · patates aşçısı',sandyFryer],['krabs','Bay Yengeç · temizlikçi',krabsCleaner]];
