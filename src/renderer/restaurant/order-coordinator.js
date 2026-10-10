// Atomic reservations shared by every runner. Navigation must succeed before commit.
export class OrderCoordinator{
 constructor(){this.tasks=new Map();this.products=new Map();}
 reserve(worker,orders,stock,canRoute){if(worker.job)return null;for(const order of orders){if(order.canceled||order.collected||!['to-pickup','wait-pickup'].includes(order.customer.state))continue;for(const kind of order.needed){const key=order.id+':'+kind;if(this.tasks.has(key)||order.received.some(p=>p.kind===kind))continue;const product=stock[kind]?.find(p=>!this.products.has(p.id)&&(!p.backedOrderId||p.backedOrderId===order.id));if(!product||!canRoute(kind))continue;stock[kind].splice(stock[kind].indexOf(product),1);const job={key,owner:worker.id,order,product,stage:'to-source',timer:0};this.tasks.set(key,job);this.products.set(product.id,key);product.state='reserved';return job;}}return null;}
 release(job){if(!job||this.tasks.get(job.key)!==job)return false;this.tasks.delete(job.key);this.products.delete(job.product.id);return true;}
 snapshot(){return[...this.tasks.values()].map(j=>({key:j.key,owner:j.owner,product:j.product.id,stage:j.stage}));}
}
