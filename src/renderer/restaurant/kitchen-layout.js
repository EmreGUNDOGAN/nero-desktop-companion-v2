import * as T from './vendor/three.module.min.js';
import * as B from './models-v2.js';
import * as K from './kitchen-models.js';
import {box,mat,label,ring,cylinder} from './models.js';
await document.fonts.ready;
const canvas=document.getElementById('scene'),renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.4));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
const scene=new T.Scene();scene.background=new T.Color(0xdce8e4);scene.add(new T.HemisphereLight(0xfff6df,0x8aa5af,1.8));const light=new T.DirectionalLight(0xfff4df,2.6);light.position.set(-9,18,14);light.castShadow=true;light.shadow.mapSize.set(2048,2048);Object.assign(light.shadow.camera,{left:-15,right:15,top:13,bottom:-13,near:.1,far:50});light.shadow.normalBias=.015;light.shadow.bias=-.0002;scene.add(light);const fill=new T.DirectionalLight(0xcbe6e8,.7);fill.position.set(12,8,-9);scene.add(fill);
const camera=new T.OrthographicCamera(-15,15,10,-10,.1,100),world=new T.Group();scene.add(world);const placements=[];
const floor=box(world,22,.20,12,0xb7a37c,0,-.12,0,.05);const tileGeo=new T.BoxGeometry(.984,.025,.984),tileMat=[mat(0xe1d7b7),mat(0xd8ccaa)];for(let tone=0;tone<2;tone++){const m=new T.InstancedMesh(tileGeo,tileMat[tone],132);let n=0;for(let x=0;x<22;x++)for(let z=0;z<12;z++)if((x+z)%2===tone)m.setMatrixAt(n++,new T.Matrix4().makeTranslation(-10.5+x,.013,-5.5+z));m.receiveShadow=true;world.add(m);}
box(world,22,2.55,.20,0xcbbd91,0,1.275,-5.90,.018);box(world,22,.12,.26,0x946137,0,2.59,-5.90,.018);box(world,22,.20,.16,0xa77846,0,.20,-5.765,.009);
for(let i=0;i<31;i++)box(world,.009,2.28,.018,0xb5a681,-10.5+i*.7,1.38,-5.786,.002);
for(const x of [-9.8,-.7,8.4]){const p=new T.Group();world.add(p);p.position.set(x,1.9,-5.76);ring(p,.26,.041,0x527888);const glass=cylinder(p,.215,.215,.014,0x91c8d0);glass.rotation.x=Math.PI/2;}
function place(id,fn,x,z,y=0,rotation=0){const object=fn();object.position.set(x,y,z);object.rotation.y=rotation;world.add(object);object.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(object);placements.push({id,x,z,y,rotation,bounds:{min:bounds.min.toArray(),max:bounds.max.toArray()}});return object;}
// Kitchen equipment backs meet the rear wall; working fronts face the clear aisle.
const row=[['grill',B.grill,-8.60],['fryer',K.fryer,-6.53],['fish-station',K.fishStation,-4.72],['warmer',K.warmer,-2.99],['hotdog-station',K.hotdogStation,-1.46],['dough-bench',K.doughBench,.26],['oven',K.oven,2.13],['prep',B.prep,4.25],['cold-prep',K.coldPrep,6.44],['sink',B.sink,8.30]];
for(const [id,fn,x]of row)place(id,fn,x,-5.20);
place('hood',B.hood,-8.60,-5.42,1.54);place('hood-fryer',()=>{const m=B.hood();m.scale.x=.75;return m;},-6.53,-5.42,1.54);
// Depot stays to the left and feeds the prep area through a wide staff aisle.
place('fridge',B.fridge,-9.94,-2.75,0,Math.PI/2);place('freezer',K.freezer,-9.94,-.83,0,Math.PI/2);place('storage-rack',K.storageRack,-9.94,1.35,0,Math.PI/2);place('ingredient-crate',K.ingredientCrate,-9.5,3.18);
// Drinks share a continuous counter: no machines standing on random floor positions.
for(const [i,x]of [-5.95,-3.60,-1.25,1.10,3.45,5.80].entries())place('drink-bench-'+i,K.drinkBench,x,.0);
place('coffee-machine',K.coffeeMachine,-6.3,.0,1.06);place('coffee-grinder',K.coffeeGrinder,-5.43,.0,1.06);place('tea-boiler',K.teaBoiler,-3.87,.0,1.06);place('shake-machine',K.shakeMachine,-2.79,.0,1.06);place('icecream-machine',K.icecreamMachine,-1.1,.0,1.06);place('juice-machine',K.juiceMachine,.83,.0,1.06);place('drink-machine',()=>{const m=B.sodaMachine();m.scale.setScalar(.62);return m;},3.28,.0,1.06);
// Soda prototype includes its base cabinet; here its entire assembly is scaled to countertop height.
place('tableware',K.tableware,5.90,.0,1.06);place('dessert-case',K.dessertCase,8.21,.0);
// Separate transfer shelf and packing zone, with openings at both ends.
place('pickup-counter-left',()=>B.counter('TESLİM',4.6),-4.75,3.5);place('pass',B.passShelf,-4.75,3.50,.36);
place('pickup-counter-right',()=>B.counter('TESLİM',4.6),.10,3.5);place('service-tray',K.serviceTray,.10,3.50,1.07);place('takeaway-box',K.takeawayBox,1.33,3.50,1.07);place('packing-bench',K.packingBench,4.40,3.50);place('takeaway-bag',K.takeawayBag,4.5,3.5,1.02);
function zone(text,w,x,z,color){const s=label(text,w,.30,color,'#365564');s.rotation.x=-Math.PI/2;s.position.set(x,.046,z);world.add(s);}
zone('SICAK MUTFAK',3.3,-1.2,-3.90,'#e2caa1');zone('PERSONEL KORİDORU',4.1,.0,-2.18,'#e7dfc8');zone('İÇECEK VE TATLI',3.5,.0,1.28,'#cae0d2');zone('DEPO',1.3,-9.03,4.56,'#cddbe4');zone('KOMİ / TESLİM HATTI',4.0,-2.0,4.89,'#edd1a9');
let mode='perspective';
function render(){const usableHeight=Math.max(250,innerHeight-230),ratio=innerWidth/usableHeight;renderer.setSize(innerWidth,innerHeight,false);renderer.setViewport(0,80,innerWidth,usableHeight);const target=new T.Vector3(-.4,.5,-.1);camera.position.copy(target).add(mode==='top'?new T.Vector3(0,30,.001):new T.Vector3(7,19,25));camera.lookAt(target);camera.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(world);let extent=1;for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){const p=new T.Vector3(x,y,z).applyMatrix4(camera.matrixWorldInverse);extent=Math.max(extent,Math.abs(p.y)*1.10,Math.abs(p.x)/ratio*1.10);}camera.left=-extent*ratio;camera.right=extent*ratio;camera.top=extent;camera.bottom=-extent;camera.updateProjectionMatrix();renderer.render(scene,camera);}
document.getElementById('perspective').addEventListener('click',()=>{mode='perspective';render();});document.getElementById('top').addEventListener('click',()=>{mode='top';render();});addEventListener('resize',render);render();
window.__neroKitchenLayout={ready:true,placements,view:m=>{mode=m;render();},metrics:()=>({drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,placements:placements.length,mode})};
