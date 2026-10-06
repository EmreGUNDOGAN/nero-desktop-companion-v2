'use strict';
const {money,rate,converted,validDate}=require('./budget');
function parseCSV(text) {
  text=String(text).replace(/^\uFEFF/,'');
  if(text.length>8*1024*1024)throw new Error('CSV en fazla 8 MB olabilir.');
  const first=text.split(/\r?\n/)[0],delimiter=first.includes(';')?';':',';
  const rows=[];let row=[],field='',quoted=false;
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(c==='"'){if(quoted&&text[i+1]==='"'){field+='"';i++;}else if(quoted)quoted=false;else if(!field)quoted=true;else throw new Error('CSV tırnakları geçersiz.');}
    else if(c===delimiter&&!quoted){row.push(field);field='';}
    else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&text[i+1]==='\n')i++;row.push(field);if(row.some(x=>x.trim()))rows.push(row);row=[];field='';}
    else field+=c;
  }
  if(quoted)throw new Error('CSV içinde kapanmamış tırnak var.');
  row.push(field);if(row.some(x=>x.trim()))rows.push(row);
  if(rows.length>5001)throw new Error('Bir aktarımda en fazla 5000 işlem olabilir.');return rows;
}
const HEADERS=['tarih','tur','hesap','kategori','tutar','para_birimi','kur','aciklama','alici','etiketler','hedef_hesap','hedef_tutar','bolunmus_kategoriler'];
const typeNames={expense:'gider',income:'gelir',transfer:'transfer',refund:'iade'};
function quote(s){s=String(s??'');if(/^[=+@\t\r-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
function exportCSV(budget,from,to) {
  const state=budget.state;const name=(list,id)=>list.find(x=>x.id===id)?.name||'';
  const rows=state.transactions.filter(t=>(!from||t.date>=from)&&(!to||t.date<=to)).sort((a,b)=>a.date.localeCompare(b.date)).map(t=>[
    t.date,typeNames[t.type],name(state.accounts,t.accountId),name(state.categories,t.splits?.[0]?.categoryId),(t.amount/100).toFixed(2),t.currency,String(t.rate/1000000),t.note,t.payee,t.tags,name(state.accounts,t.toAccountId),t.toAmount?(t.toAmount/100).toFixed(2):'',
    t.splits?.length>1?JSON.stringify(t.splits.map(s=>({kategori:name(state.categories,s.categoryId),tutar:(s.amount/100).toFixed(2)}))):''
  ]);
  return '\uFEFF'+[HEADERS,...rows].map(row=>row.map(quote).join(';')).join('\r\n');
}
function previewCSV(budget,text) {
  const rows=parseCSV(text);if(rows.length<2)throw new Error('CSV boş.');const header=rows.shift().map(x=>x.trim().toLowerCase());
  for(const key of ['tarih','tur','hesap','kategori','tutar'])if(!header.includes(key))throw new Error('CSV sütunu eksik: '+key);
  const valid=[],errors=[],fingerprints=new Set(budget.state.transactions.map(fingerprint));let duplicates=0;
  rows.forEach((row,index)=>{try {
    const r=Object.fromEntries(header.map((h,i)=>[h,row[i]||''])),type=Object.keys(typeNames).find(k=>typeNames[k]===r.tur)||r.tur;
    if(!Object.keys(typeNames).includes(type))throw new Error('Tür gelir/gider/transfer/iade olmalı.');
    const a=budget.state.accounts.find(a=>a.name===r.hesap&&!a.archived);if(!a)throw new Error('Hesap bulunamadı: '+r.hesap);
    if(r.para_birimi&&r.para_birimi!==a.currency)throw new Error('Para birimi hesapla uyuşmuyor.');
    const category=budget.state.categories.find(c=>c.name===r.kategori&&c.type===(type==='income'?'income':'expense')&&!c.archived);
    const to=budget.state.accounts.find(a=>a.name===r.hedef_hesap&&!a.archived);
    const splits=r.bolunmus_kategoriler?JSON.parse(r.bolunmus_kategoriler).map(s=>{const c=budget.state.categories.find(c=>c.name===s.kategori&&c.type===(type==='income'?'income':'expense'));if(!c)throw new Error('Bölünmüş kategori bulunamadı.');return {categoryId:c.id,amount:s.tutar};}):null;
    const input={type,accountId:a.id,toAccountId:to?.id,categoryId:category?.id,amount:r.tutar,date:r.tarih,rate:r.kur||String((budget.state.rates[a.currency]||0)/1000000),toAmount:r.hedef_tutar,note:r.aciklama,payee:r.alici,tags:r.etiketler,splits};
    const t=budget.buildTransaction(input);const f=fingerprint(t);if(fingerprints.has(f)){duplicates++;return;}fingerprints.add(f);valid.push(input);
  }catch(e){errors.push({line:index+2,message:e.message});}});
  return {valid,errors,duplicates,total:rows.length};
}
function fingerprint(t){return JSON.stringify([t.date,t.type,t.accountId,t.toAccountId||null,t.amount,t.toAmount||null,t.note,t.payee||'',t.tags||'',t.currency,t.rate,t.splits||[]]);}
function importCSV(budget,preview) {
  const old=structuredClone(budget.state);try {for(const input of preview.valid){const t=budget.buildTransaction(input);if(!budget.state.transactions.some(x=>fingerprint(x)===fingerprint(t)))budget.state.transactions.push(t);}budget.save('csv.import','batch');return budget.state.transactions.length-old.transactions.length;}catch(e){budget.state=old;throw e;}
}
module.exports={parseCSV,exportCSV,previewCSV,importCSV,fingerprint,HEADERS};
