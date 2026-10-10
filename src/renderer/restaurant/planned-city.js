import {sandMaterial,roadMaterial,sandyVerge} from './seafloor-materials.js';
import * as T from './vendor/three.module.min.js';
import {box,ball,cylinder,mat,add,label,instancedCopies} from './models.js';
import * as B2 from './buildings-2.js';import * as B3 from './buildings-3.js';import * as B4 from './buildings-4.js';import * as B5 from './buildings-5.js';import * as B6 from './buildings-6.js';
import {canonicalMarket,canonicalBank,canonicalPostOffice} from './canonical-buildings.js';
import {buildConstructionSite} from './construction-site.js';
import {nodes,edges,roadAreas,sidewalks,crossings,roadConflict,overlaps,rect,citySize} from './city-roads.js';
export function buildPlannedCity(outside){
 const buildings=[],parcels=[],walkAreas=[...sidewalks,...crossings.map(c=>rect(c.x,c.z,c.w,c.d))],placementIssues=[];
 const publicConflict=b=>roadConflict(b,2.3);
 // Clear old local decorations that intersect the new reserved road corridor.
 let removedDecorations=0;const m=new T.Matrix4();
 for(const root of [...outside.children]){root.updateMatrixWorld(true);if(root.isInstancedMesh){root.geometry.computeBoundingBox();for(let i=0;i<root.count;i++){root.getMatrixAt(i,m);const b=root.geometry.boundingBox.clone().applyMatrix4(new T.Matrix4().multiplyMatrices(root.matrixWorld,m));if(publicConflict({minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z})){m.makeScale(0,0,0);root.setMatrixAt(i,m);removedDecorations++;}}root.instanceMatrix.needsUpdate=true;root.computeBoundingSphere();}else{const b=new T.Box3().setFromObject(root);if(b.max.y<-.30||b.getSize(new T.Vector3()).x>500||b.min.y>4)continue;if(publicConflict({minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z})){outside.remove(root);removedDecorations++;}}}
 const street=new T.Group();street.name='planned-road-network';outside.add(street);
 for(const e of edges){const a=nodes[e.a],b=nodes[e.b],x=(a.x+b.x)/2,z=(a.z+b.z)/2,w=e.horizontal?b.x-a.x+e.width:e.width,d=e.horizontal?e.width:b.z-a.z+e.width;
  box(street,w+(e.horizontal?4:4),.028,d+4,sandMaterial,x,-.268,z,.006);box(street,w,.028,d,roadMaterial,x,-.246,z,.006);
  // Keep sand borders outside every junction: reserve seven metres at each end.
  const vergeLength=(e.horizontal?b.x-a.x:b.z-a.z)-14;
  if(vergeLength>0)sandyVerge(street,x,z,vergeLength,e.horizontal,e.width);
  const length=e.horizontal?b.x-a.x:b.z-a.z;for(let t=14;t<length-12;t+=7)box(street,e.horizontal?2.6:.12,.006,e.horizontal?.12:2.6,0xe5dec0,e.horizontal?a.x+t:a.x,-.228,e.horizontal?a.z:a.z+t,.001);
 }
 // Junction squares cover intersecting markings; no circular turn platforms.
 for(const n of nodes)box(street,12,.032,12,roadMaterial,n.x,-.242,n.z,.003);
 for(const c of crossings){const horizontal=c.w>c.d,length=(horizontal?c.w:c.d)-4;for(let i=0;i<8;i++){const t=-length/2+(i+.5)*length/8;box(street,horizontal?.55:c.w,.009,horizontal?c.d:.55,0xe9e7d0,c.x+(horizontal?t:0),-.219,c.z+(horizontal?0:t),.002);}}
 function pathToRoad(x,z,endX,endZ,width=2.3){const r=rect((x+endX)/2,(z+endZ)/2,Math.abs(x-endX)+width,Math.abs(z-endZ)+width);walkAreas.push(r);box(outside,r.maxX-r.minX,.021,r.maxZ-r.minZ,sandMaterial,(r.maxX+r.minX)/2,-.271,(r.maxZ+r.minZ)/2,.008);return r;}
 function place(id,fn,x,z,{rotation=0,y=-.25,roadZ=null,roadX=null,district=''}={}){const o=fn();o.name=id;o.position.set(x,y,z);o.rotation.y=rotation;outside.add(o);o.updateMatrixWorld(true);const b=new T.Box3().setFromObject(o),foot={id,minX:b.min.x,maxX:b.max.x,minZ:b.min.z,maxZ:b.max.z};if(publicConflict(foot))placementIssues.push({id,type:'public-space'});const parcel={...foot,minX:foot.minX-2.2,maxX:foot.maxX+2.2,minZ:foot.minZ-2.2,maxZ:foot.maxZ+2.2};if(parcels.some(p=>overlaps(p,parcel)))placementIssues.push({id,type:'parcel-overlap'});parcels.push(parcel);buildings.push({id,x,z,district,min:b.min.toArray(),max:b.max.toArray()});if(roadZ!==null){const side=roadZ>z?1:-1;pathToRoad(x,side>0?b.max.z+.5:b.min.z-.5,x,roadZ-side*7.0);}if(roadX!==null){const side=roadX>x?1:-1;pathToRoad(side>0?b.max.x+.5:b.min.x-.5,z,roadX-side*5,z);}return o;}
 // West commercial block. Three shops share the same paved plaza.
 place('market',canonicalMarket,-119,-14,{roadZ:26,district:'centre'});place('bank',canonicalBank,-99,-14,{roadZ:26,district:'centre'});place('post-office',canonicalPostOffice,-78,-14,{roadZ:26,district:'centre'});
 place('reef-cinema',B3.reefCinema,-80,-64,{roadZ:-94,rotation:Math.PI,district:'centre'});place('building-sea-needle',B3.seaNeedle,-120,-60,{roadZ:-94,district:'centre'});
 const plaza=rect(-99,9,66,11);walkAreas.push(plaza);box(outside,66,.021,11,sandMaterial,-99,-.272,9,.012);
 // Restaurant stays at the origin so its approved interior and service points are untouched.
 parcels.push({id:'restaurant',...rect(0,0,30,30)});pathToRoad(0,14.8,0,19,5.8);
 place('building-goofy',B3.goofyGoobers,91,-62,{roadZ:-94,rotation:Math.PI,district:'shopping'});place('building-stinky',B3.stinkyBurgers,82,-10,{roadZ:26,district:'shopping'});place('building-wash',B3.wash,117,-10,{roadZ:26,district:'shopping'});
 // Conch Street: recognizable three neighbours, aligned entrances facing the same street.
 place('patrick-home',B5.patrickHome,-125,105,{roadZ:126,district:'conch'});place('squidward-home',B5.moaiHome,-98,105,{roadZ:126,district:'conch'});place('spongebob-home',B5.pineappleHome,-71,105,{roadZ:126,district:'conch'});
 for(let i=0;i<4;i++)place('city-home-'+i,()=>B5.cityBuilding([0x92b8c2,0xbc9ec5,0xd4b475,0x7eb1ab][i],3.3,4.1),-125+i*18,50,{roadZ:26,rotation:Math.PI,district:'conch'});
 place('chum-bucket',B5.chumBucket,-18,49,{roadZ:26,rotation:Math.PI,district:'community'});place('sandy-treedome',B5.sandyDome,22,58,{roadX:48,district:'community'});
 place('mr-krabs-anchor-home',B5.anchorHouse,-23,104,{roadZ:126,district:'community'});place('building-puff-home',B2.puffHome,8,103,{roadZ:126,district:'community'});place('building-mama-krabs',B3.mamaKrabsHome,30,104,{roadZ:126,district:'community'});
 place('building-glove-world',B4.gloveWorld,84,65,{roadZ:26,district:'entertainment'});place('building-glove-universe',B4.gloveUniverse,115,104,{roadZ:126,district:'entertainment'});
 // Outer plots are large enough for modelled parking, parks and industrial grounds.
 place('building-airport',B3.airport,-131,-125,{roadZ:-94,district:'outer'});place('building-outlet',B3.outlet,-95,-131,{roadZ:-94,district:'outer'});place('building-race',B3.raceArena,-58,-130,{roadZ:-94,district:'outer'});place('building-service',B3.serviceStation,-166,-49,{roadX:-148,rotation:Math.PI/2,district:'outer'});
 place('boating-school',B5.boatingSchool,-13,-123,{roadZ:-94,district:'outer'});place('building-shady-shoals',B2.shadyShoals,27,-125,{roadZ:-94,district:'outer'});place('building-industrial',B4.industrialPark,130,-126,{roadZ:-94,district:'outer'});
 place('building-tentacles',B2.tentaclesHome,-133,147,{roadZ:126,rotation:Math.PI,district:'expansion'});place('building-grandma',B2.grandmaHome,-109,147,{roadZ:126,rotation:Math.PI,district:'expansion'});place('building-parents',B2.parentsHome,-83,147,{roadZ:126,rotation:Math.PI,district:'expansion'});place('building-squilliam',B2.squilliamTower,-59,147,{roadZ:126,rotation:Math.PI,district:'expansion'});
 place('building-bottom-hill',B6.bottomHill,-166,69,{roadX:-148,rotation:Math.PI/2,district:'outer'});place('building-sunny-shore',B6.sunnyShore,0,147,{roadZ:126,rotation:Math.PI,district:'outer'});place('building-dutchman',B4.dutchmanShip,171,-62,{y:14,district:'outer'});
 const constructionGroup=new T.Group();outside.add(constructionGroup);const old=buildConstructionSite(constructionGroup);const constructionOffset={x:52,z:-87};constructionGroup.position.set(constructionOffset.x,0,constructionOffset.z);constructionGroup.updateMatrixWorld(true);const cb=new T.Box3().setFromObject(constructionGroup);const construction={...old,x:old.x+constructionOffset.x,z:old.z+constructionOffset.z,min:cb.min.toArray(),max:cb.max.toArray()};parcels.push({id:'construction',minX:cb.min.x-3,maxX:cb.max.x+3,minZ:cb.min.z-3,maxZ:cb.max.z+3});pathToRoad(construction.x,cb.max.z+.5,construction.x,-101);
 const expansionZones=[{id:'new-entertainment',x:119,z:60,width:23,depth:24},{id:'new-business',x:16,z:-58,width:43,depth:28},{id:'new-harbour',x:91,z:149,width:60,depth:26},{id:'new-conch',x:-101,z:77,width:42,depth:23},{id:'new-shopping',x:97,z:-35,width:54,depth:18},{id:'new-community',x:0,z:84,width:30,depth:16}];for(const p of expansionZones){const area={id:p.id,...rect(p.x,p.z,p.width,p.depth)};if(publicConflict(area)||parcels.some(q=>overlaps(q,area)))placementIssues.push({id:p.id,type:'expansion-overlap'});parcels.push(area);}
 // Scatter in clusters only after all public corridors and building plots are reserved.
 const reed=new T.Group(),reef=new T.Group(),rock=new T.Group();for(let i=0;i<5;i++){const path=new T.CatmullRomCurve3([new T.Vector3(i*.22,0,0),new T.Vector3(i*.22+.24,.8,.1),new T.Vector3(i*.22-.12,1.8+(i%2)*.55,.15)]);add(reed,new T.TubeGeometry(path,10,.065,5),mat(i%2?0x68a887:0x91b592));}for(let i=0;i<3;i++){ball(reef,.55,0x9cb8bd,i*.5,.03,i%2*.4,[1.35,.6,1]);const path=new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3((i-1)*.38,.6,.06),new T.Vector3((i-1)*.55,1.2+i*.18,.1)]);add(reef,new T.TubeGeometry(path,8,.10,6),mat([0xb987b5,0x96a9c8,0xc8bd87][i]));}ball(rock,1,0x9bafb4,0,-.1,0,[1.8,.6,1.2]);ball(rock,.58,0xb5c2ba,1.2,.03,.65,[1,.65,1]);
 const poses={reed:[],reef:[],rock:[]},decorBoxes=[];let seed=731;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<1600;i++){const x=-178+random()*356,z=-147+random()*304,s=.7+random()*.95,b=rect(x,z,5*s,5*s);if(publicConflict(b)||walkAreas.some(a=>overlaps(a,b,1))||parcels.some(a=>overlaps(a,b,1)))continue;const kind=i%5===0?'rock':i%2?'reed':'reef';poses[kind].push({x,z,scale:s});decorBoxes.push(b);}
 for(const [kind,prototype]of Object.entries({reed,reef,rock}))outside.add(instancedCopies(prototype,poses[kind]));
 const report={worldArea:citySize,expansionZones,roadSegments:edges.length,junctions:nodes.length,buildingCount:buildings.length,decorClusters:decorBoxes.length,removedDecorations,placementIssues,roadConflicts:buildings.filter(b=>publicConflict({minX:b.min[0],maxX:b.max[0],minZ:b.min[2],maxZ:b.max[2]})).map(b=>b.id)};
 return {buildings,construction,walkAreas,parcels,report,roadAreas,crossings,landmarks:8,layout:'Approved city plan: connected road graph and reserved parcels'};
}
