export function createRewardLookup(review,mode){
 if(!['sales','effort'].includes(mode)||!Array.isArray(review.tasks))throw Error('Invalid quest reward policy');
 const lookup=new Map();
 for(const row of review.tasks){const key=row.product_id+':'+row.tier,reward=mode==='sales'?row.sale_reward:row.reward_proposal;if(lookup.has(key)||!Number.isInteger(row.target)||row.target<=0||!Number.isInteger(reward)||reward<2)throw Error('Invalid quest reward row: '+key);lookup.set(key,{target:row.target,reward});}
 const customers=new Map((review.customer_tasks||[]).map(row=>[row.target,row]));
 for(const row of customers.values())if(!Number.isInteger(row.target)||row.target<=0||!Number.isInteger(row.reward_proposal)||row.reward_proposal<2)throw Error('Invalid customer reward');
 return Object.freeze({mode,product:(id,tier,target)=>{const row=lookup.get(id+':'+tier);if(!row)return null;if(row.target!==target)throw Error('Quest target/reward mismatch: '+id);return row.reward;},customer:target=>{const row=customers.get(target);if(!row)throw Error('Missing customer reward: '+target);return mode==='sales'?row.sale_reward:row.reward_proposal;},size:lookup.size});
}
