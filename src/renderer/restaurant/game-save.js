
export function connectGameSave(service,{storage=localStorage,now=()=>Date.now(),runtime=()=>({}),disabled=false,key='ezgis-krab-shack-save-v1'}={}){
 const KEY=key,BACKUP=KEY+'-backup';
 let revision=0,status='Yeni oyun',failed=false,loadedRuntime={};
 const valid=record=>record&&record.version===1&&Number.isInteger(record.revision)&&record.revision>0&&Number.isFinite(record.savedAt)&&record.game;
 function parse(key){try{const value=storage.getItem(key);if(!value)return null;const record=JSON.parse(value);return valid(record)?record:null;}catch{return null;}}
 if(!disabled){for(const key of [KEY,BACKUP]){const record=parse(key);if(record&&service.restoreCheckpoint(record.game)){revision=record.revision;loadedRuntime=record.runtime||{};const remaining=loadedRuntime.hidden?Math.max(0,3600-(loadedRuntime.backgroundUsed||0)):3600;const elapsed=loadedRuntime.manualPaused?0:Math.min(remaining,Math.max(0,(now()-record.savedAt)/1000));service.resumeTimers(elapsed);status=key===KEY?'İlerleme yüklendi':'Yedekten kurtarıldı';break;}}}
 if(!disabled&&revision===0){try{if(storage.getItem(KEY)||storage.getItem(BACKUP)){failed=true;status='Kayıt doğrulanamadı; eski kayıt korunuyor';}}catch{status='Kayıt alanına erişilemiyor';failed=true;}}
 function save(){if(disabled||failed)return false;const existing=parse(KEY);if(existing&&existing.revision>revision){status='Başka pencere kaydı güncelledi; bu pencere yazmıyor';failed=true;return false;}const record={version:1,revision:revision+1,savedAt:now(),runtime:runtime(),game:service.exportCheckpoint()};try{if(existing)storage.setItem(BACKUP,JSON.stringify(existing));storage.setItem(KEY,JSON.stringify(record));revision=record.revision;status='Kaydedildi';return true;}catch{status='Kayıt yazılamadı; mevcut ilerleme bu pencerede korunuyor';return false;}}
 return{save,loadedRuntime,snapshot:()=>({revision,status,disabled,failed}),stop:()=>{failed=true;}};
}
