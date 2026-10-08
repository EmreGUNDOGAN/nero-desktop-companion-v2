// Shared labels for stored task metadata and all native/theme renderers.
((root,factory)=>{const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.NeroTaskLabels=api;})(globalThis,()=>{
 'use strict';
 const key=text=>String(text).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const normalize=value=>{const raw=Array.isArray(value)?value:String(value??'').split(/[,;]/),seen=new Set(),out=[];for(const item of raw){if(typeof item!=='string')continue;const text=item.replace(/[\u0000-\u001f\u007f]/g,' ').trim().slice(0,40),id=key(text);if(text&&!seen.has(id)){seen.add(id);out.push(text);}}return out.slice(0,8);};
 const tags=todo=>normalize(Array.isArray(todo?.tags)?todo.tags:todo?.tag);
 function entries(todo){const out=[];if(todo?.priority==='high')out.push({text:'Öncelikli',kind:'priority'});if(todo?.priority==='low')out.push({text:'Düşük öncelik',kind:'low'});for(const text of tags(todo)){const id=key(text);out.push({text:id==='is'?'İş':id==='kisisel'?'Kişisel':id==='planlama'?'Planlama':text,kind:id==='is'?'work':id==='kisisel'?'personal':id==='planlama'?'planning':'custom'});}return out;}
 return {normalize,tags,entries};
});
