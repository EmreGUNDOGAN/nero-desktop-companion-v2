import {createRewardLookup} from './quest-rewards.js';
const [targetResponse,rewardResponse,modeResponse]=await Promise.all(['quest-targets.json','quest-balance-review.json','quest-rewards-policy.json'].map(file=>fetch(new URL(file,import.meta.url))));
if(!targetResponse.ok)throw Error('Quest targets could not be loaded');
const targetPolicy=await targetResponse.json();
if(targetPolicy.version!==1||targetPolicy.basis!=='opening-level')throw Error('Unsupported quest target policy');
if(!rewardResponse.ok||!modeResponse.ok)throw Error('Quest rewards could not be loaded');
const [rewardReview,rewardPolicy]=await Promise.all([rewardResponse.json(),modeResponse.json()]);
if(rewardPolicy.version!==1)throw Error('Unsupported quest reward policy');
const rewardLookup=createRewardLookup(rewardReview,rewardPolicy.mode);
export function createQuestDefinitions(catalog){
 const goals=[5,15,40,100,250,600,1200],rewards=[2,3,5,8,12,18,25],customerGoals=[3,10,30,100,300,1000],definitions=[];
 const products=[...catalog.byId.values()].sort((a,b)=>a.level-b.level||a.id.localeCompare(b.id));
 for(let tier=0;tier<goals.length;tier++){
  if(tier<customerGoals.length)definitions.push({id:'customers-'+customerGoals[tier],metric:'served',target:customerGoals[tier],reward:rewardLookup.customer(customerGoals[tier]),title:'Toplam '+customerGoals[tier]+' müşteriye sipariş teslim et',previous:tier?'customers-'+customerGoals[tier-1]:null,productId:null});
  for(const product of products){const targets=targetPolicy.products[product.id];if(!targets&&!product.stationDecisionPending)throw Error('Missing product quest targets: '+product.id);if(targets&&(targets.length!==7||targets.some((n,i)=>!Number.isInteger(n)||n<=0||(i>0&&n<=targets[i-1]))))throw Error('Invalid quest targets: '+product.id);const target=targets?.[tier]??goals[tier],reward=targets?rewardLookup.product(product.id,tier+1,target):rewards[tier];if(targets&&reward===null)throw Error('Missing quest reward: '+product.id);definitions.push({id:product.id+'-sales-tier-'+(tier+1),metric:'sales:'+product.id,target,reward,title:product.name+' · toplam '+target+' adet sat',previous:tier?product.id+'-sales-tier-'+tier:null,productId:product.id,targetBasis:targets?'opening-level':'special-decision-pending',rewardBasis:targets?rewardPolicy.mode:'special-decision-pending'});}
 }
 if(definitions.length!==1000||new Set(definitions.map(d=>d.id)).size!==1000)throw Error('Invalid quest catalogue');
 return definitions.map(d=>Object.freeze(d));
}

export class QuestBoard{
 constructor(definitions,{isUnlocked,readProgress=null,credit}){this.definitions=definitions;this.byId=new Map(definitions.map(d=>[d.id,d]));this.isUnlocked=isUnlocked;this.readProgress=readProgress;this.credit=credit;this.active=[];this.claimed=new Set();this.claiming=new Set();this.counters=new Map();this.caps=new Map();for(const d of definitions)this.caps.set(d.metric,Math.max(this.caps.get(d.metric)||0,d.target));this.fill();}
 eligible(d){return !this.claimed.has(d.id)&&!this.active.includes(d.id)&&(!d.previous||this.claimed.has(d.previous))&&(!d.productId||this.isUnlocked(d.productId));}
 fill(){for(const d of this.definitions){if(this.active.length>=2)break;if(this.eligible(d))this.active.push(d.id);}}
 record(metric,amount=1){const cap=this.caps.get(metric);if(cap===undefined||!Number.isInteger(amount)||amount<=0)return false;const previous=this.counters.get(metric)||0;if(previous>=cap)return false;this.counters.set(metric,Math.min(cap,previous+amount));return true;}
 progress(d){const value=this.readProgress?this.readProgress(d.metric):(this.counters.get(d.metric)||0);return Number.isFinite(value)?Math.min(this.caps.get(d.metric),Math.max(0,Math.floor(value))):0;}
 claim(id){if(this.claiming.has(id)||this.claimed.has(id)||!this.active.includes(id))return false;const d=this.byId.get(id);if(this.progress(d)<d.target)return false;this.claiming.add(id);try{if(this.credit(d.reward,id)!==true)return false;this.claimed.add(id);this.active=this.active.filter(active=>active!==id);this.fill();return true;}finally{this.claiming.delete(id);}}
 exportState(){return{version:1,counters:Object.fromEntries(this.counters),claimed:[...this.claimed],active:[...this.active]};}
 restore(state){
  if(this.readProgress||!state||state.version!==1||!state.counters||Array.isArray(state.counters)||!Array.isArray(state.claimed)||!Array.isArray(state.active)||state.active.length>2)return false;
  const counters=new Map(Object.entries(state.counters)),claimed=new Set(state.claimed),active=new Set(state.active);
  if(claimed.size!==state.claimed.length||active.size!==state.active.length)return false;
  for(const [metric,n]of counters)if(!this.caps.has(metric)||!Number.isInteger(n)||n<0||n>this.caps.get(metric))return false;
  for(const id of claimed){const d=this.byId.get(id);if(!d||(d.previous&&!claimed.has(d.previous))||(counters.get(d.metric)||0)<d.target)return false;}
  for(const id of active){const d=this.byId.get(id);if(!d||claimed.has(id)||(d.previous&&!claimed.has(d.previous))||(d.productId&&!this.isUnlocked(d.productId)))return false;}
  this.counters=counters;this.claimed=claimed;this.active=[...state.active];this.fill();return true;
 }
 snapshot(){this.fill();return{version:1,total:this.definitions.length,counters:Object.fromEntries(this.counters),caps:Object.fromEntries(this.caps),claimed:[...this.claimed],active:this.active.map(id=>{const d=this.byId.get(id),current=this.progress(d);return{...d,current,progress:Math.min(current,d.target),ready:current>=d.target};}),remaining:this.definitions.length-this.claimed.size};}
}
