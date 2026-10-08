const fs=require('node:fs'),path=require('node:path');const root=path.join(__dirname,'..'),file=path.join(root,'src/main/productivity.js'),text=fs.readFileSync(file,'utf8'),start=text.indexOf(' meta(kind,input){'),end=text.indexOf('\n reorder(ids,bucket)',start);if(start<0||end<0)throw Error('Metadata method missing');
const replacement=` meta(kind,input){
  check(input&&typeof input==='object','Kayıt bilgisi geçersiz.');
  const source=kind==='note'?this.notes:this.todos,rows=source.get(),index=rows.findIndex(r=>r.id===input.id);check(index>=0,'Kayıt bulunamadı.');const row={...rows[index]};
  if(kind==='note'){
   if('pinned' in input)row.pinned=!!input.pinned;
   if('tag' in input)row.tag=clean(input.tag,40);
   if('color' in input){check(['paper','yellow','pink','blue','green'].includes(input.color),'Renk geçersiz.');row.color=input.color;}
  }else{
   if('bucket' in input){check(['today','later'].includes(input.bucket),'Bölüm geçersiz.');row.bucket=input.bucket;}
   if('priority' in input){check(['normal','high','low'].includes(input.priority),'Öncelik geçersiz.');row.priority=input.priority;}
   if('tags' in input||'tag' in input){
    if('tags' in input)check(Array.isArray(input.tags)&&input.tags.length<=8&&input.tags.every(t=>typeof t==='string'),'Etiketler geçersiz.');
    row.tags=TaskLabels.normalize('tags' in input?input.tags:input.tag);row.tag=clean(row.tags.join(', '),40);
   }
   if('plannedDurationMin' in input){const n=Number(input.plannedDurationMin);check(Number.isInteger(n)&&n>=0&&n<=10080,'Süre geçersiz.');row.plannedDurationMin=n||null;}
  }
  // Commit only after all fields have passed validation.
  source.set(rows.map((current,i)=>i===index?row:current));this.changed();return structuredClone(row);
 }`;
fs.writeFileSync(file,text.slice(0,start)+replacement+text.slice(end));console.log('Task metadata validates before persisting');
