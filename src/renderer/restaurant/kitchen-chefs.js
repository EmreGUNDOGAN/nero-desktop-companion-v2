import * as T from './vendor/three.module.min.js';
import {fish,box,cylinder,mat} from './models.js';
// One employee per physical food station. Several recipes never create duplicate chefs.
export const foodChefPositions={burger:[-10.55,-11.62],fryer:[-8.53,-11.62],oven:[2.14,-11.62],hotdog:[-1.37,-11.62],'cold-prep':[6.46,-11.62],dessert:[8,-5.95],icecream:[-1.88,-5.95],'soup-pasta-extra':[-3.15,-11.62]};
const chefNames={burger:'SpongeBob',fryer:'Sandy',oven:'Pizza aşçısı',hotdog:'Sosisli aşçısı','cold-prep':'Soğuk mutfak aşçısı',dessert:'Tatlı aşçısı',icecream:'Dondurma aşçısı','soup-pasta-extra':'Çorba aşçısı'};
function fishChef(index){const o=fish([0x90bdb7,0xc9a675,0xb6a0ca,0x91b5cf][index%4],0xefead5);box(o,.40,.40,.024,0xfff9e4,0,.53,.245,.025);cylinder(o,.22,.22,.07,0xfff9e4,0,1.4,0);for(const x of [-.11,0,.11]){const puff=new T.Mesh(new T.SphereGeometry(.12,16,12),mat(0xfff9e4));puff.position.set(x,1.48,0);o.add(puff);}return o;}
export function buildKitchenChefs(room,{sponge,sandy}){const actors=new Map([['burger',sponge],['fryer',sandy]]);let count=0;for(const [station,actor]of actors){if(actor){actor.position.set(...[foodChefPositions[station][0],0,foodChefPositions[station][1]]);actor.visible=false;}}
 function update(unlocks,running,time){for(const [station,[x,z]]of Object.entries(foodChefPositions)){const open=unlocks.has(station);let actor=actors.get(station);if(open&&!actor){actor=fishChef(count++);actor.name='chef-'+station;actor.position.set(x,0,z);room.add(actor);actors.set(station,actor);}if(!actor)continue;actor.visible=open;const cooking=running.has(station);if(station!=='burger')actor.rotation.y=cooking?Math.PI:0;if(station!=='burger')actor.userData.arms?.forEach((arm,i)=>arm.rotation.x=cooking?-.55+Math.sin(time*6+i)*.16:0);}}
 return{update,snapshot:()=>[...actors].filter(([,a])=>a?.visible).map(([station,a])=>({station,name:chefNames[station],position:a.position.toArray(),heading:a.rotation.y}))};
}
