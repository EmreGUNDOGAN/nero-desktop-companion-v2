'use strict';
/* Accurate SVG geometry. Smooth lines pass through real samples without overshoot. */
(function(factory){if(typeof module==='object'&&module.exports)module.exports=factory();else window.NeroPremiumCharts=factory();})(()=>{
 const number=n=>Number.isFinite(Number(n))?Number(n):0;
 const fmt=n=>Number(number(n).toFixed(3));
 function smooth(points){
  if(!points.length)return '';
  if(points.length===1)return `M${fmt(points[0].x)},${fmt(points[0].y)}`;
  const slopes=points.slice(1).map((p,i)=>(p.y-points[i].y)/(p.x-points[i].x)),m=points.map((p,i)=>i===0?slopes[0]:i===points.length-1?slopes.at(-1):slopes[i-1]*slopes[i]<=0?0:2*slopes[i-1]*slopes[i]/(slopes[i-1]+slopes[i]));
  return `M${fmt(points[0].x)},${fmt(points[0].y)}`+points.slice(1).map((p,i)=>{const a=points[i],h=(p.x-a.x)/3;return ` C${fmt(a.x+h)},${fmt(a.y+m[i]*h)} ${fmt(p.x-h)},${fmt(p.y-m[i+1]*h)} ${fmt(p.x)},${fmt(p.y)}`;}).join('');
 }
 function series(rows,keys=['income','netExpense']){
  const values=rows.flatMap(r=>keys.map(k=>number(r[k]))),low=Math.min(0,...values),high=Math.max(1,...values),range=high-low;
  const x=i=>rows.length>1?10+i*340/(rows.length-1):180,y=v=>116-(number(v)-low)/range*88;
  return {low,high,zero:y(0),lines:keys.map(key=>({key,points:rows.map((r,i)=>({x:x(i),y:y(r[key]),value:number(r[key]),label:r.month})),path:smooth(rows.map((r,i)=>({x:x(i),y:y(r[key])})))}))};
 }
 function segments(values){
  const items=values.map((value,index)=>({index,value:Math.max(0,number(value))})).filter(s=>s.value>0),total=items.reduce((n,s)=>n+s.value,0),gap=items.length?Math.min(18,180/items.length):0,available=360-items.length*gap;
  let angle=-90+gap/2;
  const point=a=>({x:110+86*Math.cos(a*Math.PI/180),y:110+86*Math.sin(a*Math.PI/180)});
  const arcs=items.map(item=>{const length=item.value/total*available,start=angle,end=angle+length,a=point(start),b=point(end);angle=end+gap;return {...item,share:item.value/total,start,end,path:`M${fmt(a.x)},${fmt(a.y)} A86,86 0 ${length>180?1:0} 1 ${fmt(b.x)},${fmt(b.y)}`};});
  return {total,arcs};
 }
 function inBase(amount,currency,base,rates){if(currency===base)return number(amount);const rate=rates[currency];if(!Number.isSafeInteger(rate)||rate<=0)return null;const product=BigInt(Math.round(number(amount)))*BigInt(rate);return Number((product+(product<0n?-500000n:500000n))/1000000n);}
 return Object.freeze({smooth,series,segments,inBase});
});
