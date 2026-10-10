import * as T from './vendor/three.module.min.js';
import * as M from './models.js';
await document.fonts.ready;
const $=id=>document.getElementById(id);
const renderer=new T.WebGLRenderer({canvas:$('scene'),antialias:true,alpha:false});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
const scene=new T.Scene();scene.background=new T.Color(0x78bdd0);scene.fog=new T.Fog(0x78bdd0,36,80);
const camera=new T.OrthographicCamera(-10,10,7,-7,.1,90);
const target=new T.Vector3(-.65,.6,0),offset=new T.Vector3(10,13,16);let viewSize=6.9;
scene.add(new T.HemisphereLight(0xfff9e0,0x829fb5,2.4));
const sun=new T.DirectionalLight(0xffefce,3.4);sun.position.set(-8,14,10);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=14;sun.shadow.camera.bottom=-14;sun.shadow.camera.near=.1;sun.shadow.camera.far=40;sun.shadow.normalBias=.018;sun.shadow.bias=-.00025;sun.shadow.radius=3;scene.add(sun);
const fill=new T.DirectionalLight(0xdef4fa,1.0);fill.position.set(6,7,-4);scene.add(fill);
const world=new T.Group();scene.add(world);
M.box(world,24,.20,23,0xe1c88a,0,-.28,0,.05);
const sea=new T.Mesh(new T.PlaneGeometry(130,130),M.mat(0x6bbac8));sea.rotation.x=-Math.PI/2;sea.position.y=-.48;scene.add(sea);
let restaurant=M.room(12,10);world.add(restaurant);
const kitchen=new T.Group();world.add(kitchen);
const grill=M.grill();grill.position.set(-1.4,0,-2.75);kitchen.add(grill);
const fridge=M.fridge();fridge.position.set(-4.45,0,-3.9);kitchen.add(fridge);
const freezer=M.fridge();freezer.scale.set(.80,.65,.9);freezer.position.set(-3.2,0,-3.9);kitchen.add(freezer);
const foodCounter=M.counter('',2.35);foodCounter.position.set(1.12,0,-2.75);kitchen.add(foodCounter);foodCounter.children.find(o=>o.isMesh&&o.geometry.type==='PlaneGeometry').visible=false;
const shelf=M.box(kitchen,2.4,.075,.80,0xc7cdc0,1.12,1.33,-2.79);M.box(kitchen,.07,.45,.07,0x818f84,.05,1.10,-3.03);M.box(kitchen,.07,.45,.07,0x818f84,2.20,1.10,-3.03);
for(let i=0;i<3;i++)M.cylinder(kitchen,.18,.18,.024,0xf6e5b9,.44+i*.62,1.38,-2.73);
const pickup=M.counter('TESLİM',2.8);pickup.position.set(2.1,0,-.38);world.add(pickup);
const cashier=M.counter('KASA',2.15);cashier.position.set(-4.1,0,.04);world.add(cashier);
const register=M.cashRegister();register.position.set(-4.2,.965,.07);world.add(register);
const dispenser=M.sodaMachine();dispenser.position.set(4.65,0,-2.55);world.add(dispenser);
const drinkCup=M.soda();drinkCup.position.set(3.11,.99,-.30);world.add(drinkCup);
const dining=M.table();dining.position.set(.2,0,2.35);world.add(dining);
const sponge=M.sponge();sponge.position.set(-2.82,0,-2.97);sponge.scale.setScalar(1.08);sponge.rotation.y=.55;world.add(sponge);
const squid=M.squid();squid.position.set(-4.1,0,-.80);world.add(squid);
const nero=M.nero();nero.position.set(1.85,0,-1.35);world.add(nero);
const customer=M.fish(0xbca0c8,0x6b98ab);customer.position.set(-4.12,0,1.23);world.add(customer);
const queueCustomer=M.fish(0xe39b73,0xeac877);queueCustomer.position.set(-4.32,0,2.19);world.add(queueCustomer);
const onTrayBurger=M.burger();onTrayBurger.position.set(1.91,.998,-.26);onTrayBurger.visible=false;world.add(onTrayBurger);
const tableBurger=M.burger();tableBurger.position.set(-.25,.838,2.35);tableBurger.visible=false;world.add(tableBurger);
const readyBurger=M.burger();readyBurger.position.set(.44,1.393,-2.70);readyBurger.visible=false;world.add(readyBurger);

// Decorative rope, wall signs, equipment and queue posts are genuine 3D objects.
const galley=M.label('GALLEY GRUB',2.6,.75,'#264d55','#ffe9b0');galley.position.set(.7,1.97,-4.60);world.add(galley);
const roomSign=M.label('KRUSTY KRAB',1.5,.48,'#efd9a3','#a84c40');roomSign.position.set(-5.96,1.72,3.85);roomSign.rotation.y=.8;world.add(roomSign);
for(let i=0;i<3;i++){const x=-.1+i*.32;const pan=M.ring(kitchen,.10,.021,0x4d6769,x,1.94,-4.83);M.box(kitchen,.028,.13,.029,0x4d6769,x,2.10,-4.83,.003);}
for(const z of [1.0,1.9,2.8])for(const x of [-5.05,-3.16]){M.cylinder(world,.035,.046,.65,0xba8d49,x,.34,z);M.ball(world,.075,0xe9bd65,x,.70,z);}for(const x of [-5.05,-3.16])M.line(world,[[x,.62,1],[x,.49,1.45],[x,.62,1.9],[x,.49,2.3],[x,.62,2.8]],0xefe0b5,.025);
for(const x of [-5.10,5.15]){const crate=new T.Group();M.box(crate,.7,.49,.6,0xbd8b51,0,.25,0);for(const sx of [-.25,.25])M.box(crate,.055,.50,.03,0x986535,sx,.25,.316);crate.position.set(x,0,-4);world.add(crate);}
for(let i=0;i<17;i++){const angle=i*2.4,r=7+(i%3)*.65;const p=new T.Group();p.position.set(Math.cos(angle)*r,-.13,Math.sin(angle)*r*.8);for(let j=0;j<3;j++){const leaf=M.ball(p,.18,[0x78a76a,0x7bc095,0x8ca8ca][i%3],(j-1)*.15,.30+j*.07,0,[.55,2.5,.65]);leaf.rotation.z=(j-1)*.42;}world.add(p);}
const steam=new T.Group();steam.position.set(-1.4,1.08,-2.75);world.add(steam);const particles=[];for(let i=0;i<8;i++){const p=M.ball(steam,.065,new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.3,depthWrite:false}),0,0,0);p.castShadow=p.receiveShadow=false;particles.push(p);}
const hotPatty=M.cylinder(grill,.17,.17,.05,0x805239,-.42,1.033,.08);M.cylinder(grill,.17,.17,.05,0x805239,.17,1.033,-.12);
const burnerLight=new T.PointLight(0xffba5b,0,2);burnerLight.position.set(-1.4,1.2,-2.7);scene.add(burnerLight);

let paused=false,running=false,phase=0,phaseTime=0,globalTime=0,delivered=0,coins=250,claimed=false,crowded=false,crowdGroup=null,crowdFigures=[];
const phaseDurations=[3.0,2.0,.75,2.2,.70,4.1,.80,3.0,2.8,3.1];
const descriptions=[
 ['Burger hazırlanıyor.','SpongeBob ızgarada çalışıyor. Nero hazır ürünü bekliyor.','cook'],
 ['Nero mutfağa gidiyor.','Hazır burgeri almak için istasyona yürüyor.','carry'],
 ['Ürün tepsiye alınıyor.','Hazır burger şimdi Nero’nun taşıdığı tepside.','carry'],
 ['Sipariş taşınıyor.','Nero burgeri ayrı teslim tezgâhına götürüyor.','carry'],
 ['Teslim tezgâhı hazır.','Burger tezgâha bırakılıyor; müşteri kasadan geliyor.','deliver'],
 ['Müşteri siparişini alıyor.','Kasadan teslim alanına gerçek bir yol boyunca yürüyor.','deliver'],
 ['Sipariş teslim edildi.','Burger müşteriye ulaştı. Görev ilerlemesi şimdi sayılıyor.','deliver'],
 ['Müşteri masaya geçiyor.','Bu sipariş içeride yemek için. İkinci örnek paket servis olacak.','deliver'],
 ['Afiyet olsun!','Müşteri oturuyor, Nero yeni sipariş için mutfağa dönüyor.','deliver'],
 ['Bir sonraki siparişe hazırız.','Müşteri çıkışa yürüyor; masa ve istasyon yeniden hazır.','deliver']
];
const paths={
 neroGo:[[1.85,-1.35],[.45,-1.35]],
 neroCarry:[[.45,-1.35],[1.85,-1.35]],
 customerPickup:[[-4.12,1.23],[-2.35,1.23],[.3,1.23],[2.05,.52]],
 customerTable:[[2.05,.52],[1.65,1.25],[-.82,2.35]],
 customerLeave:[[-.82,2.35],[-2.7,3.6],[-5.35,4.65]],
 customerTakeaway:[[2.05,.52],[1,1.4],[-2.6,3.5],[-5.35,4.65]]
};
function walkPose(fig,walking,carrying=false){if(fig.userData.legs)for(let i=0;i<fig.userData.legs.length;i++){const leg=fig.userData.legs[i];if(leg.geometry)leg.position.z=.065+(walking?Math.sin(globalTime*7+i*Math.PI)*.047:0);else leg.rotation.x=walking?Math.sin(globalTime*7+i*Math.PI)*.36:0;}if(fig.userData.arms)for(let i=0;i<fig.userData.arms.length;i++){fig.userData.arms[i].rotation.x=carrying?-.95:walking?Math.sin(globalTime*7+i*Math.PI)*.28:Math.sin(globalTime*1.2)*.035;}fig.position.y=walking?Math.abs(Math.sin(globalTime*7))*.012:0;}
function move(fig,points,p,carry=false){p=Math.max(0,Math.min(1,p));let lengths=[],sum=0;for(let i=1;i<points.length;i++){const len=Math.hypot(points[i][0]-points[i-1][0],points[i][1]-points[i-1][1]);lengths.push(len);sum+=len;}let distance=p*sum,idx=0;while(idx<lengths.length-1&&distance>lengths[idx])distance-=lengths[idx++];const a=points[idx],b=points[idx+1],alpha=Math.min(1,distance/lengths[idx]);fig.position.x=T.MathUtils.lerp(a[0],b[0],alpha);fig.position.z=T.MathUtils.lerp(a[1],b[1],alpha);const facing=Math.atan2(b[0]-a[0],b[1]-a[1]);let delta=facing-fig.rotation.y;while(delta>Math.PI)delta-=Math.PI*2;while(delta< -Math.PI)delta+=Math.PI*2;fig.rotation.y+=delta*.15;walkPose(fig,p<.995,carry);}
function updateHud(){const d=descriptions[phase];$('status-title').textContent=d[0];$('status-detail').textContent=d[1];document.querySelectorAll('[data-stage]').forEach(el=>{const index=['cook','carry','deliver'].indexOf(el.dataset.stage),current=['cook','carry','deliver'].indexOf(d[2]);el.classList.toggle('active',index===current);el.classList.toggle('done',index<current);});}
function enterPhase(n){phase=n;phaseTime=0;updateHud();if(n===1)readyBurger.visible=true;if(n===2){readyBurger.visible=false;nero.userData.tray.visible=true;nero.rotation.y=Math.PI;}if(n===4){nero.userData.tray.visible=false;onTrayBurger.visible=true;}if(n===6){onTrayBurger.visible=false;customer.userData.bag.visible=true;delivered++;coins+=35;$('coins').textContent=coins;$('quest-count').textContent=Math.min(delivered,3)+' / 3';$('quest-progress').style.width=Math.min(100,delivered/3*100)+'%';if(delivered>=3&&!claimed){$('claim').disabled=false;$('claim').textContent='Ödülü al';}}if(n===8&&delivered%2===1){customer.userData.bag.visible=false;tableBurger.visible=true;}if(n===9)tableBurger.visible=false;}
function startOrder(){if(running)return;running=true;paused=false;$('pause').textContent='Ⅱ';$('start').disabled=true;$('start').textContent='Sipariş hazırlanıyor…';customer.visible=true;customer.position.set(-4.12,0,1.23);customer.rotation.y=Math.PI;customer.userData.bag.visible=false;onTrayBurger.visible=readyBurger.visible=tableBurger.visible=false;nero.position.set(1.85,0,-1.35);nero.userData.tray.visible=false;nero.rotation.y=0;enterPhase(0);}
function reset(){running=false;paused=false;phase=phaseTime=0;nero.userData.tray.visible=false;onTrayBurger.visible=readyBurger.visible=tableBurger.visible=false;nero.position.set(1.85,0,-1.35);nero.rotation.y=0;walkPose(nero,false);customer.position.set(-4.12,0,1.23);customer.rotation.y=Math.PI;customer.visible=true;customer.userData.bag.visible=false;walkPose(customer,false);$('pause').textContent='Ⅱ';$('status-title').textContent='Restoran hazır.';$('status-detail').textContent='Bir burger hazırlayalım. Nero onu alıp teslim tezgâhına taşısın.';$('start').disabled=false;$('start').innerHTML='Siparişi başlat <span>→</span>';document.querySelectorAll('[data-stage]').forEach(el=>el.classList.remove('active','done'));}
$('start').addEventListener('click',startOrder);$('replay').addEventListener('click',reset);$('pause').addEventListener('click',()=>{paused=!paused;$('pause').textContent=paused?'▶':'Ⅱ';});$('claim').addEventListener('click',()=>{if(delivered<3||claimed)return;claimed=true;coins+=20;$('coins').textContent=coins;$('claim').textContent='Alındı';$('claim').disabled=true;});
function positionCamera(){const ratio=innerWidth/innerHeight;camera.left=-viewSize*ratio;camera.right=viewSize*ratio;camera.top=viewSize;camera.bottom=-viewSize;camera.updateProjectionMatrix();camera.position.copy(target).add(offset);camera.lookAt(target);}
function resize(){renderer.setSize(innerWidth,innerHeight,false);positionCamera();}addEventListener('resize',resize);resize();
$('zoom-in').addEventListener('click',()=>{viewSize=Math.max(3,viewSize*.88);positionCamera();});$('zoom-out').addEventListener('click',()=>{viewSize=Math.min(15,viewSize*1.12);positionCamera();});$('close-view').addEventListener('click',()=>{target.set(-.3,.85,-1.2);viewSize=3.7;positionCamera();});
function setCrowd(enabled){crowded=enabled;$('crowd').textContent=enabled?'Tek masa görünümü':'20 masa testi';$('crowd').classList.toggle('on',enabled);if(!crowdGroup){const poses=[];for(let row=0;row<4;row++)for(let col=0;col<5;col++)poses.push({x:-5.4+col*2.7,z:.4+row*2.15,scale:.83});crowdGroup=M.instancedCopies(M.table(),poses);world.add(crowdGroup);for(let i=0;i<25;i++){const fig=M.fish([0x88b5b8,0xe0ae79,0xc399b3,0x8bbda0][i%4],[0x648cac,0xd3b957,0x897d9f][i%3]);fig.scale.setScalar(.83);world.add(fig);crowdFigures.push(fig);}}
 dining.visible=!enabled;crowdGroup.visible=enabled;crowdFigures.forEach(f=>f.visible=enabled);restaurant.visible=!enabled;
 if(enabled){if(!world.userData.bigRoom){world.userData.bigRoom=M.room(15,15);world.userData.bigRoom.position.z=2.1;world.add(world.userData.bigRoom);}world.userData.bigRoom.visible=true;target.set(-.5,.8,2.0);viewSize=9.1;}else{if(world.userData.bigRoom)world.userData.bigRoom.visible=false;target.set(-.65,.6,0);viewSize=6.9;}positionCamera();}
$('crowd').addEventListener('click',()=>setCrowd(!crowded));
let drag=null;const canvas=$('scene');canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointermove',e=>{if(drag){const dx=e.clientX-drag.x,dy=e.clientY-drag.y;target.x-=dx*viewSize/innerHeight*1.5;target.z-=dy*viewSize/innerHeight*1.8;drag={x:e.clientX,y:e.clientY};positionCamera();return;}const rect=canvas.getBoundingClientRect(),v=new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),ray=new T.Raycaster();ray.setFromCamera(v,camera);const hit=ray.intersectObjects([grill,dispenser],true)[0];if(hit){let obj=hit.object;while(obj&&!obj.userData.tip)obj=obj.parent;const info=obj?.userData.tip;if(info){$('item-tip').innerHTML='<strong>'+info.title+'</strong>'+info.body;$('item-tip').style.left=Math.min(innerWidth-260,e.clientX+15)+'px';$('item-tip').style.top=Math.min(innerHeight-120,e.clientY+15)+'px';$('item-tip').hidden=false;return;}}$('item-tip').hidden=true;});canvas.addEventListener('wheel',e=>{e.preventDefault();viewSize=T.MathUtils.clamp(viewSize*Math.exp(e.deltaY*.001),3,15);positionCamera();},{passive:false});
let previous=performance.now(),frames=0,fps=0,lastFps=previous,frameTime=0;
function frame(now){const dt=Math.min((now-previous)/1000,.06);frameTime=now-previous;previous=now;if(!paused){globalTime+=dt;walkPose(queueCustomer,false);squid.userData.arms[0].rotation.x=-.3+Math.sin(globalTime)*.05;squid.userData.arms[1].rotation.x=-.2+Math.sin(globalTime*.8)*.04;sponge.userData.arms[1].rotation.x=running&&phase===0?-.8+Math.sin(globalTime*4)*.27:-.25;steam.visible=running&&phase===0;burnerLight.intensity=steam.visible?.8:0;for(let i=0;i<particles.length;i++){const p=particles[i],life=(globalTime*.62+i*.13)%1;p.position.set(Math.sin(i*3)*.42,.15+life*.85,Math.cos(i*2)*.20);p.scale.setScalar(.45+life*.75);p.material.opacity=.22*(1-life);}if(running){phaseTime+=dt;const p=phaseTime/phaseDurations[phase];if(phase===1)move(nero,paths.neroGo,p);else if(phase===3)move(nero,paths.neroCarry,p,true);else if(phase===5)move(customer,paths.customerPickup,p);else if(phase===7)move(customer,delivered%2===1?paths.customerTable:paths.customerTakeaway,p);else if(phase===8&&delivered%2===1){customer.position.set(-.82,.27,2.35);customer.rotation.y=Math.PI/2;customer.userData.legs.forEach(l=>l.rotation.x=-.8);customer.userData.arms.forEach((a,i)=>a.rotation.x=-.7+Math.sin(globalTime*2+i)*.08);}else if(phase===9)move(customer,delivered%2===1?paths.customerLeave:paths.customerTakeaway,p);if(p>=1){if(phase<9)enterPhase(phase+1);else{running=false;$('status-title').textContent='Sipariş tamamlandı.';$('status-detail').textContent='Nero ürünü taşıdı, müşteri siparişini aldı. Yeni siparişle paket servis akışını görebilirsin.';$('start').disabled=false;$('start').innerHTML='Yeni sipariş <span>→</span>';customer.visible=false;}}}else walkPose(nero,false);if(crowded)for(let i=0;i<crowdFigures.length;i++){const fig=crowdFigures[i];fig.position.x=-5.3+(i%5)*2.7+Math.sin(globalTime*.3+i)*.35;fig.position.z=.7+Math.floor(i/5)*1.35+Math.cos(globalTime*.28+i)*.35;fig.rotation.y=globalTime*.15+i;walkPose(fig,true);}}
 renderer.render(scene,camera);frames++;if(now-lastFps>1000){fps=Math.round(frames*1000/(now-lastFps));frames=0;lastFps=now;}requestAnimationFrame(frame);}
requestAnimationFrame(frame);
window.__neroPrototype={ready:true,start:startOrder,reset,pause:()=>{$('pause').click();},crowd:setCrowd,metrics:()=>({threeRevision:T.REVISION,fps,frameTimeMs:Math.round(frameTime*100)/100,crowded,tables:crowded?20:1,characters:crowded?30:5,running,paused,phase,delivered,coins,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,memory:renderer.info.memory,canvas:{width:canvas.width,height:canvas.height},neroPosition:nero.position.toArray(),customerPosition:customer.position.toArray(),trayVisible:nero.userData.tray.visible})};
window.addEventListener('error',e=>{$('error').hidden=false;$('error').textContent='Örnek başlatılamadı: '+e.message;});
