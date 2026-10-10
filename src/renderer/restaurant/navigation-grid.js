// Shared 2D navigation. All movement segments obey the same inflated obstacle checks.
export function createNavigation({bounds,walkAreas,obstacles=[],step=.5,radius=.45}){
 const [minX,minZ,maxX,maxZ]=bounds,cols=Math.round((maxX-minX)/step)+1,rows=Math.round((maxZ-minZ)/step)+1;
 const rectContains=(r,x,z)=>x>=r.minX&&x<=r.maxX&&z>=r.minZ&&z<=r.maxZ;
 function allowed(x,z){return walkAreas.some(r=>rectContains(r,x,z));}
 function clear(x,z){
  if(x<minX||x>maxX||z<minZ||z>maxZ||!allowed(x,z))return false;
  // Eight samples keep the body inside the allowed pedestrian surface.
  for(let i=0;i<8;i++){const a=i*Math.PI/4;if(!allowed(x+Math.cos(a)*radius,z+Math.sin(a)*radius))return false;}
  for(const o of obstacles){if(o.radius!==undefined){if((x-o.x)**2+(z-o.z)**2<=(o.radius+radius)**2)return false;}else if(x>=o.minX-radius&&x<=o.maxX+radius&&z>=o.minZ-radius&&z<=o.maxZ+radius)return false;}return true;
 }
 function segmentClear(a,b){
  const dx=b.x-a.x,dz=b.z-a.z;
  for(const o of obstacles){
   if(o.radius!==undefined){const t=Math.max(0,Math.min(1,((o.x-a.x)*dx+(o.z-a.z)*dz)/(dx*dx+dz*dz||1)));if(Math.hypot(a.x+t*dx-o.x,a.z+t*dz-o.z)<=o.radius+radius)return false;}
   else{
    let lo=0,hi=1;for(const [v,d,mn,mx]of [[a.x,dx,o.minX-radius,o.maxX+radius],[a.z,dz,o.minZ-radius,o.maxZ+radius]]){
     if(Math.abs(d)<1e-10){if(v<mn||v>mx){lo=2;break;}}
     else{let t0=(mn-v)/d,t1=(mx-v)/d;if(t0>t1)[t0,t1]=[t1,t0];lo=Math.max(lo,t0);hi=Math.min(hi,t1);}
    }if(lo<=hi)return false;
   }
  }
  const samples=Math.max(2,Math.ceil(Math.hypot(dx,dz)/(step/20)));for(let i=0;i<=samples;i++)if(!clear(a.x+dx*i/samples,a.z+dz*i/samples))return false;return true;
 }
 const points=new Uint8Array(cols*rows);for(let z=0;z<rows;z++)for(let x=0;x<cols;x++)points[z*cols+x]=clear(minX+x*step,minZ+z*step)?1:0;
 const position=id=>({x:minX+(id%cols)*step,z:minZ+Math.floor(id/cols)*step});
 const edgeCache=new Map();
 const idAt=p=>Math.round((p.z-minZ)/step)*cols+Math.round((p.x-minX)/step);
 function findPath(start,end,{avoid=[]}={}){
  const avoids=p=>avoid.some(a=>Math.hypot(p.x-a.x,p.z-a.z)<a.radius);
  function avoidSegment(a,b){const dx=b.x-a.x,dz=b.z-a.z;return !avoid.some(o=>{const t=Math.max(0,Math.min(1,((o.x-a.x)*dx+(o.z-a.z)*dz)/(dx*dx+dz*dz||1)));return Math.hypot(a.x+t*dx-o.x,a.z+t*dz-o.z)<o.radius;});}
  const segment=(a,b)=>segmentClear(a,b)&&avoidSegment(a,b);
  if(!clear(start.x,start.z)||!clear(end.x,end.z))return null;
  function attach(p){const base=idAt(p),x=base%cols,z=Math.floor(base/cols),ids=[];for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){const xx=x+dx,zz=z+dz;if(xx>=0&&xx<cols&&zz>=0&&zz<rows)ids.push(zz*cols+xx);}return ids.sort((a,b)=>Math.hypot(position(a).x-p.x,position(a).z-p.z)-Math.hypot(position(b).x-p.x,position(b).z-p.z)).find(id=>points[id]&&!avoids(position(id))&&segment(p,position(id)));}
  const s=attach(start),goal=attach(end);if(s===undefined||goal===undefined||avoids(end))return null;
  const g=new Float64Array(points.length);g.fill(Infinity);const parent=new Int32Array(points.length);parent.fill(-1);const heap=[];g[s]=0;
  function push(item){heap.push(item);let i=heap.length-1;while(i){const p=(i-1)>>1;if(heap[p].f<=item.f)break;heap[i]=heap[p];i=p;}heap[i]=item;}
  function pop(){const first=heap[0],last=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let k=i*2+1;if(k+1<heap.length&&heap[k+1].f<heap[k].f)k++;if(heap[k].f>=last.f)break;heap[i]=heap[k];i=k;}heap[i]=last;}return first;}
  const heuristic=id=>{const p=position(id);return Math.hypot(end.x-p.x,end.z-p.z);};push({id:s,g:0,f:heuristic(s)});
  while(heap.length){const current=pop();if(current.g!==g[current.id])continue;if(current.id===goal){const path=[end];let id=goal;while(id!==s){path.push(position(id));id=parent[id];}path.push(position(s),start);path.reverse();const short=[path[0],path[1]];for(let i=1;i<path.length-1;){let j=path.length-1;while(j>i+1&&!segment(path[i],path[j]))j--;short.push(path[j]);i=j;}return short;}
   const x=current.id%cols,z=Math.floor(current.id/cols);for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){
    const nx=x+dx,nz=z+dz;if(nx<0||nx>=cols||nz<0||nz>=rows)continue;const id=nz*cols+nx;if(!points[id]||avoids(position(id)))continue;
    if(dx&&dz&&(!points[z*cols+nx]||!points[nz*cols+x]))continue;
    const edgeKey=Math.min(current.id,id)*points.length+Math.max(current.id,id);
    if(!edgeCache.has(edgeKey))edgeCache.set(edgeKey,segmentClear(position(current.id),position(id)));
    if(!edgeCache.get(edgeKey)||(avoid.length&&!avoidSegment(position(current.id),position(id))))continue;
    const cost=g[current.id]+step*Math.hypot(dx,dz);if(cost<g[id]){g[id]=cost;parent[id]=current.id;push({id,g:cost,f:cost+heuristic(id)});}
   }
  }return null; // Never replace a failed path with direct movement through an obstacle.
 }
 return {clear,segmentClear,findPath,step,radius,walkableCells:points.reduce((a,b)=>a+b,0),obstacles,walkAreas,bounds};
}
