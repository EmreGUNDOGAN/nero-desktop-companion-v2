const NAMES=Object.freeze(['laugh','think','peek','balance','victory','tap','cross','glance','pet','shy','yawn','nod','dance']);
function canPlay({name,manual=false,now,lastMotionAt=0,enabled=true,hidden=false,asleep=false,dragging=false,compatible=true,petAngryUntil=0}) {
 if(!NAMES.includes(name)||!enabled||hidden||asleep||dragging||!compatible)return false;
 if(['pet','shy'].includes(name)&&now<petAngryUntil)return false;
 return manual || now-lastMotionAt>=30000;
}
function forCategory(category){
 if(/^peek_/.test(category))return 'peek';
 if(['pet_too_much','poke_spam','angry'].includes(category))return 'cross';
 if(['todo_all_done','birthday','anniversary'].includes(category))return 'dance';
 if(['timer_done','todo_done'].includes(category))return 'victory';
 if(['wake','nap_wake','pajama_on'].includes(category))return 'yawn';
 if(['sulky','lonely','bored'].includes(category))return 'glance';
 if(['remark','rare_event'].includes(category))return 'laugh';
 return null;
}
module.exports={NAMES,canPlay,forCategory};
