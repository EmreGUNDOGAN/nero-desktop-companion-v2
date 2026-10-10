// All costs share a sales-return scale; staffing is never level gated.
export const STAFF_LIMIT=10;
export const workerCost=(count,role)=>Math.round((role==='cleaner'?300:400)*(1+.55*(count-1))**1.8/10)*10;
export const cashierOpenCost=index=>index===1?0:index===0?1500:3500;
export const cashierSeconds=level=>2.5*(1-.10*Math.min(5,level));
// Speed is deliberately dearer than adding the second cashier at early ranks.
export const cashierSpeedCost=(index,level)=>Math.round((2000*(level+1)**1.55)/50)*50;
export function customerFlow({level,products,cashiers,workers,stations,backlog}){
 const popularity=Math.log2(Math.max(1,level))*.45+Math.log2(Math.max(1,products/2))*.35;
 const desired=Math.max(4,22/(1+popularity));
 // Approximate prepared-item throughput, leaving 25% headroom for walking and mixed orders.
 const items=1.7,capacity=Math.max(1,Math.min(cashiers*12,workers*5,stations*4));
 const interval=Math.max(desired,60/capacity*items*1.25);
 const pressure=backlog>=cashiers*2?1.5:1;
 return{interval:+(interval*pressure).toFixed(2),desiredInterval:+desired.toFixed(2),maxCustomers:Math.min(30,6+Math.floor(popularity*4)+cashiers*2),queuePerCashier:2,popularity:+popularity.toFixed(2)};
}
export const cleanerParking=index=>({x:11.75,z:-.1+index*1.3});
export const runnerParking=index=>({x:8.6+(index%5)*.75,z:-5.25-Math.floor(index/5)*.75});
