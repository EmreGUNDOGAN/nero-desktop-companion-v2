// One source of truth for the visible roads, vehicle lanes and placement exclusions.
export const citySize={width:360,depth:300};
export const nodes=[];
for(const [row,z]of [-94,26,126].entries())for(const [col,x]of [-148,-48,48,148].entries())nodes.push({id:row*4+col,x,z});
export const edges=[];
for(const a of nodes)for(const b of nodes){if(b.id<=a.id)continue;const horizontal=a.z===b.z&&b.id-a.id===1,vertical=a.x===b.x&&b.id-a.id===4;if(!horizontal&&!vertical)continue;edges.push({id:edges.length,a:a.id,b:b.id,width:vertical&&Math.abs(a.x)===48?8:12,horizontal});}
export const rect=(x,z,w,d)=>({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
export const roadAreas=edges.map(e=>{const a=nodes[e.a],b=nodes[e.b];return{...rect((a.x+b.x)/2,(a.z+b.z)/2,e.horizontal?b.x-a.x+e.width:e.width,e.horizontal?e.width:b.z-a.z+e.width),id:'road-'+e.id};});
export const overlaps=(a,b,pad=0)=>a.minX<b.maxX+pad&&a.maxX>b.minX-pad&&a.minZ<b.maxZ+pad&&a.maxZ>b.minZ-pad;
export const roadConflict=(r,pad=0)=>roadAreas.some(a=>overlaps(r,a,pad));
export const sidewalks=edges.flatMap(e=>{const a=nodes[e.a],b=nodes[e.b],x=(a.x+b.x)/2,z=(a.z+b.z)/2;return[-1,1].map(side=>e.horizontal?rect(x,z+side*(e.width/2+1),b.x-a.x+e.width+4,2):rect(x+side*(e.width/2+1),z,2,b.z-a.z+e.width+4));});
export const crossings=[{x:0,z:26,w:3,d:16},{x:-97,z:126,w:3,d:16},{x:-97,z:26,w:3,d:16},{x:98,z:26,w:3,d:16},{x:-48,z:-32,w:12,d:3},{x:48,z:-32,w:12,d:3},{x:-48,z:78,w:12,d:3},{x:48,z:78,w:12,d:3}];
export function nextNodes(id,previous=-1){return edges.filter(e=>e.a===id||e.b===id).map(e=>e.a===id?e.b:e.a).filter(n=>n!==previous);}
const lane=2.1,trim=9;
const distance=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
const direction=(a,b)=>{const d=distance(a,b);return{x:(b.x-a.x)/d,z:(b.z-a.z)/d};};
const add=(a,d,t,right=lane)=>({x:a.x+d.x*t+d.z*right,z:a.z+d.z*t-d.x*right});
// Outgoing straight plus a rounded connector through the following junction.
export function laneChunk(from,to,next){const a=nodes[from],b=nodes[to],c=nodes[next],u=direction(a,b),v=direction(b,c),start=add(a,u,trim),incoming=add(b,u,-trim),end=add(b,v,trim),points=[start,incoming];
 const control={x:b.x+(u.z+v.z)*lane,z:b.z-(u.x+v.x)*lane};
 for(let i=1;i<=40;i++){const t=i/40;if(u.x===v.x&&u.z===v.z)points.push({x:incoming.x+(end.x-incoming.x)*t,z:incoming.z+(end.z-incoming.z)*t});else points.push({x:(1-t)**2*incoming.x+2*(1-t)*t*control.x+t*t*end.x,z:(1-t)**2*incoming.z+2*(1-t)*t*control.z+t*t*end.z});}
 return sampledRoute(points,{from,to,next});
}
function sampledRoute(points,extra={}){const cumulative=[0];for(let i=1;i<points.length;i++)cumulative.push(cumulative[i-1]+distance(points[i-1],points[i]));const length=cumulative.at(-1);return{...extra,length,points,cumulative,point(s){s=Math.max(0,Math.min(length,s));let lo=1,hi=points.length-1;while(lo<hi){const m=(lo+hi)>>1;if(cumulative[m]<s)lo=m+1;else hi=m;}const a=points[lo-1],b=points[lo],t=(s-cumulative[lo-1])/(cumulative[lo]-cumulative[lo-1]||1);return{x:a.x+(b.x-a.x)*t,z:a.z+(b.z-a.z)*t,heading:Math.atan2(b.x-a.x,b.z-a.z)};}};}
export function closedRoute(ids){const chunks=ids.map((id,i)=>laneChunk(id,ids[(i+1)%ids.length],ids[(i+2)%ids.length])),points=[];for(const chunk of chunks)points.push(...(points.length?chunk.points.slice(1):chunk.points));const r=sampledRoute(points),base=r.point.bind(r);r.point=s=>base(((s%r.length)+r.length)%r.length);r.stopDistance=stop=>{let best=Infinity,s=0;for(let i=1;i<r.points.length;i++){const a=r.points[i-1],b=r.points[i],dx=b.x-a.x,dz=b.z-a.z,t=Math.max(0,Math.min(1,((stop.x-a.x)*dx+(stop.z-a.z)*dz)/(dx*dx+dz*dz||1))),d=Math.hypot(a.x+t*dx-stop.x,a.z+t*dz-stop.z);if(d<best){best=d;s=r.cumulative[i-1]+t*(r.cumulative[i]-r.cumulative[i-1]);}}return s;};return r;}
