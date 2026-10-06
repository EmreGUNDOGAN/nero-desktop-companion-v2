'use strict';
const { randomUUID } = require('node:crypto');
const CURRENCIES = ['TRY','USD','EUR','GBP','CHF','CAD','AUD'];
const MAX = 1000000000000;
const clean = (v, n = 300) => String(v ?? '').trim().slice(0, n);
function invariant(ok, message) { if (!ok) throw new Error(message); }
function dateKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
function validDate(value) {
  const s = clean(value, 30);
  invariant(/^\d{4}-\d{2}-\d{2}$/.test(s) && s >= '1900-01-01' && s <= '2200-12-31' && Number.isFinite(new Date(s+'T12:00:00Z').getTime()) && new Date(s+'T12:00:00Z').toISOString().slice(0,10) === s, 'Geçerli bir tarih seç.'); return s;
}
function money(value, signed = false) {
  let s = clean(value, 30).replace(/\s/g,'');
  if (s.includes(',') && s.includes('.')) s = s.lastIndexOf(',') > s.lastIndexOf('.') ? s.replace(/\./g,'').replace(',','.') : s.replace(/,/g,'');
  else if (s.includes(',')) s = s.replace(',','.');
  invariant((signed ? /^-?\d+(?:\.\d{1,2})?$/ : /^\d+(?:\.\d{1,2})?$/).test(s), 'Tutarı en fazla iki ondalıkla yaz (örnek: 1250,50).');
  const negative = s.startsWith('-'); s = s.replace('-',''); const [whole, fraction = ''] = s.split('.');
  const n = Number(whole)*100 + Number(fraction.padEnd(2,'0'));
  invariant(Number.isSafeInteger(n) && n <= MAX, 'Tutar izin verilen aralığın dışında.'); return negative ? -n : n;
}
function rate(value) {
  const s = clean(value, 30).replace(',','.'); invariant(/^\d+(?:\.\d{1,6})?$/.test(s), 'Kuru en fazla altı ondalıkla yaz.');
  const [whole, fraction = ''] = s.split('.'); const n = Number(whole)*1000000 + Number(fraction.padEnd(6,'0'));
  invariant(Number.isSafeInteger(n) && n > 0 && n <= MAX, 'Kur sıfırdan büyük olmalı.'); return n;
}
function converted(cents, ppm) {
  invariant(Number.isSafeInteger(cents) && Math.abs(cents) <= MAX && Number.isSafeInteger(ppm) && ppm > 0, 'Tutar veya kur geçersiz.');
  const sign = cents < 0 ? -1 : 1; const n = Number((BigInt(Math.abs(cents))*BigInt(ppm)+500000n)/1000000n)*sign;
  invariant(Number.isSafeInteger(n) && Math.abs(n) <= MAX, 'Dönüştürülmüş tutar çok büyük.'); return n;
}
function shiftMonth(date, count, anchor = Number(date.slice(8))) {
  const [y,m] = date.split('-').map(Number); const d = new Date(Date.UTC(y,m-1+count,1,12));
  const last = new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+1,0)).getUTCDate();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(Math.min(anchor,last)).padStart(2,'0')}`;
}
function nextDate(plan, index) {
  if (plan.frequency === 'monthly') return shiftMonth(plan.start, index);
  if (plan.frequency === 'yearly') return shiftMonth(plan.start, index*12);
  const d = new Date(plan.start+'T12:00:00Z'); d.setUTCDate(d.getUTCDate()+index*(plan.frequency === 'weekly' ? 7 : 1)); return d.toISOString().slice(0,10);
}
function defaults() { return { version: 1, baseCurrency:'TRY', rates:{TRY:1000000}, accounts:[], transactions:[], categories:[
  ...['Market','Yemek','Ulaşım','Ev & Faturalar','Sağlık','Alışveriş','Eğlence','Eğitim','Diğer'].map((name,i)=>({id:'expense-'+i,name,type:'expense',color:['#9fae88','#d2a080','#bd9bb7','#8faaba'][i%4]})),
  ...['Maaş','Serbest Çalışma','Diğer Gelir'].map((name,i)=>({id:'income-'+i,name,type:'income',color:'#8faaba'}))
], budgets:[], plans:[], goals:[], templates:[], learning:{read:[],bookmarks:[]}, preferences:{textSize:"comfortable"}, notifications:{enabled:true,days:[7,1,0],time:"09:00"}, deleted:[], audit:[], receipts:[], notified:[] }; }
class Budget {
  constructor(store) { this.store=store; this.state={...defaults(),...store.get()}; this.validate(this.state); }
  validate(s) {
    invariant(s && s.version===1 && CURRENCIES.includes(s.baseCurrency), 'Bütçe yedeği veya para birimi geçersiz.');
    for (const key of ['accounts','transactions','categories','budgets','plans','goals','deleted','audit','receipts','notified']) invariant(Array.isArray(s[key]), 'Bütçe yedeğinin alanları eksik: '+key);
    for (const key of ['accounts','transactions','categories','budgets','plans','goals']) {
      invariant(new Set(s[key].map(x=>x.id)).size===s[key].length, 'Yedekte yinelenen kayıt kimliği var.');
      for (const x of s[key]) invariant(x && typeof x.id==='string' && x.id.length<=100, 'Yedek kayıt kimliği geçersiz.');
    }
    if(s.templates!==undefined){
      invariant(Array.isArray(s.templates)&&s.templates.length<=200&&new Set(s.templates.map(t=>t.id)).size===s.templates.length,'Şablon yedeği geçersiz.');
      for(const t of s.templates){const i=t.input;invariant(typeof t.id==='string'&&typeof t.name==='string'&&i&&['income','expense','refund','transfer'].includes(i.type)&&s.accounts.some(a=>a.id===i.accountId),'Şablon hesabı geçersiz.');const amount=money(i.amount);invariant(amount>0&&rate(i.rate)>0&&Array.isArray(i.splits),'Şablon tutarı geçersiz.');
        if(i.type==='transfer')invariant(s.accounts.some(a=>a.id===i.toAccountId)&&i.accountId!==i.toAccountId&&money(i.toAmount)>0,'Şablon transferi geçersiz.');
        else invariant(i.splits.length>0&&i.splits.reduce((n,p)=>n+money(p.amount),0)===amount&&i.splits.every(p=>s.categories.some(c=>c.id===p.categoryId&&c.type===(i.type==='income'?'income':'expense'))),'Şablon kategorisi geçersiz.');
      }
    }
    if(s.undoChange)invariant(typeof s.undoChange.action==='string'&&Array.isArray(s.undoChange.patches)&&s.undoChange.patches.length<=200&&s.undoChange.patches.every(p=>p.collection?['accounts','categories','budgets','goals','plans','templates'].includes(p.collection)&&typeof p.id==='string'&&(!p.before||p.before.id===p.id):['rates','baseCurrency'].includes(p.key)),'Geri alma kaydı geçersiz.');
    if(s.learning)invariant(Array.isArray(s.learning.read)&&Array.isArray(s.learning.bookmarks),'El kitabı kaydı geçersiz.');
    if(s.preferences)invariant(['comfortable','large'].includes(s.preferences.textSize),'Yazı boyutu geçersiz.');
    for (const a of s.accounts) invariant(CURRENCIES.includes(a.currency) && ['cash','bank','credit'].includes(a.type) && Number.isSafeInteger(a.opening) && Math.abs(a.opening)<=MAX,'Yedekte hesap geçersiz.');
    for(const c of s.categories){invariant(['expense','income'].includes(c.type)&&typeof c.name==='string'&&/^#[0-9a-f]{6}$/i.test(c.color),'Yedekte kategori geçersiz.');if(c.parentId)invariant(s.categories.some(p=>p.id===c.parentId&&p.id!==c.id&&!p.parentId&&p.type===c.type),'Yedekte alt kategori geçersiz.');}
    for (const t of s.transactions) {
      validDate(t.date); invariant(['expense','income','refund','transfer'].includes(t.type) && Number.isSafeInteger(t.amount) && t.amount>0 && t.amount<=MAX && s.accounts.some(a=>a.id===t.accountId), 'Yedekte işlem geçersiz.');
      invariant(Number.isSafeInteger(t.baseAmount) && t.baseAmount>0 && Number.isSafeInteger(t.rate) && t.rate>0 && converted(t.amount,t.rate)===t.baseAmount,'Yedekte işlem kuru geçersiz.');
      invariant(t.currency===s.accounts.find(a=>a.id===t.accountId).currency&&typeof t.note==='string'&&typeof t.payee==='string'&&typeof t.tags==='string'&&typeof t.createdAt==='string'&&Array.isArray(t.receiptIds),'Yedekte işlem alanları geçersiz.');
      if(t.refundOf){const original=s.transactions.find(x=>x.id===t.refundOf);invariant(t.type==='refund'&&original?.type==='expense'&&original.currency===t.currency&&s.transactions.filter(x=>x.refundOf===original.id).reduce((n,x)=>n+x.amount,0)<=original.amount,'Yedekte bağlı iade geçersiz.');}
      if(t.planId)invariant(s.plans.some(p=>p.id===t.planId)&&!s.transactions.some(x=>x.id!==t.id&&x.planId===t.planId&&x.occurrence===t.occurrence),'Yedekte yinelenen veya sahipsiz plan ödemesi var.');
      if(t.type==='transfer') invariant(t.toAccountId!==t.accountId && s.accounts.some(a=>a.id===t.toAccountId) && Number.isSafeInteger(t.toAmount) && t.toAmount>0,'Yedekte transfer geçersiz.');
      else invariant(Array.isArray(t.splits) && t.splits.reduce((sum,x)=>sum+x.amount,0)===t.amount && t.splits.every(x=>Number.isSafeInteger(x.amount)&&x.amount>0&&s.categories.some(c=>c.id===x.categoryId&&c.type===(t.type==='income'?'income':'expense'))), 'Yedekte işlem kategorisi geçersiz.');
    }
    for(const p of s.plans){
      validDate(p.start);if(p.end)validDate(p.end);
      invariant(['daily','weekly','monthly','yearly','once'].includes(p.frequency)&&['expense','income','transfer'].includes(p.type)&&Number.isSafeInteger(p.amount)&&p.amount>0&&p.amount<=MAX&&Number.isSafeInteger(p.rate)&&p.rate>0&&s.accounts.some(a=>a.id===p.accountId)&&Array.isArray(p.skipped),'Yedekte plan geçersiz.');
      invariant(!p.count||(Number.isInteger(p.count)&&p.count>=2&&p.count<=120&&p.frequency==='monthly'),'Yedekte taksit sayısı geçersiz.');
      if(p.type==='transfer')invariant(s.accounts.some(a=>a.id===p.toAccountId)&&p.toAccountId!==p.accountId&&Number.isSafeInteger(p.toAmount)&&p.toAmount>0,'Yedekte plan transferi geçersiz.');
      else invariant(s.categories.some(c=>c.id===p.categoryId&&c.type===(p.type==='income'?'income':'expense')),'Yedekte plan kategorisi geçersiz.');
    }
    for(const g of s.goals)invariant(s.accounts.some(a=>a.id===g.accountId&&a.type!=='credit')&&Number.isSafeInteger(g.target)&&g.target>0&&Array.isArray(g.contributions)&&g.contributions.every(c=>Number.isSafeInteger(c.amount)&&Math.abs(c.amount)<=MAX)&&g.contributions.reduce((n,c)=>n+c.amount,0)>=0,'Yedekte hedef geçersiz.');
    for(const b of s.budgets){validDate(b.month+'-01');invariant(Number.isSafeInteger(b.amount)&&b.amount>0&&(b.categoryId==='all'||s.categories.some(c=>c.id===b.categoryId&&c.type==='expense')),'Yedekte bütçe geçersiz.');}
    for(const r of s.receipts)invariant(typeof r.data==='string'&&r.data.length<=12*1024*1024&&['.pdf','.png','.jpg','.jpeg'].includes(r.ext),'Yedekte belge geçersiz.');
    invariant(s.rates&&s.rates[s.baseCurrency]===1000000,'Yedekte ana para birimi kuru geçersiz.');
    for (const ppm of Object.values(s.rates||{})) invariant(Number.isSafeInteger(ppm)&&ppm>0&&ppm<=MAX,'Yedekte kur geçersiz.');
    return true;
  }
  save(action, id) {
    this.state.audit.push({id:randomUUID(),at:new Date().toISOString(),action,recordId:id}); this.state.audit=this.state.audit.slice(-500); this.store.set(this.state);
  }
  getAccount(id, archived = false) { const a=this.state.accounts.find(x=>x.id===id && (archived||!x.archived)); invariant(a,'Önce geçerli bir hesap seç.'); return a; }
  accountBalance(id, until='2200-12-31') {
    const a=this.getAccount(id,true); let balance=a.opening;
    for (const t of this.state.transactions.filter(t=>t.date<=until)) {
      if(t.accountId===id) balance += ['income','refund'].includes(t.type) ? t.amount : -t.amount;
      if(t.type==='transfer'&&t.toAccountId===id) balance+=t.toAmount;
    }
    return balance;
  }
  account(input) {
    const old=input.id ? this.getAccount(input.id,true) : null;
    const currency=clean(input.currency)||this.state.baseCurrency; invariant(CURRENCIES.includes(currency),'Para birimi desteklenmiyor.');
    const type=clean(input.type); invariant(['cash','bank','credit'].includes(type),'Hesap türünü seç.');
    const name=clean(input.name,80); invariant(name,'Hesap adı gerekli.');
    if(old && (this.state.transactions.some(t=>t.accountId===old.id||t.toAccountId===old.id)||this.state.plans.some(p=>p.accountId===old.id||p.toAccountId===old.id)||this.state.templates.some(t=>t.input.accountId===old.id||t.input.toAccountId===old.id)||this.state.goals.some(g=>g.accountId===old.id))) invariant(old.currency===currency&&old.type===type,'İşlem bulunan hesabın türü veya para birimi değiştirilemez.');
    const a={id:old?.id||randomUUID(),name,type,currency,opening:money(input.opening||'0',true),limit:money(input.limit||'0'),cutDay:Number(input.cutDay)||1,dueDay:Number(input.dueDay)||10,remind:input.remind===undefined?(old?.remind!==false):!!input.remind,archived:!!input.archived};
    invariant(Number.isInteger(a.cutDay)&&a.cutDay>=1&&a.cutDay<=31&&Number.isInteger(a.dueDay)&&a.dueDay>=1&&a.dueDay<=31,'Kart günleri 1–31 arasında olmalı.');
    if(type==='credit') a.opening=-Math.abs(a.opening);
    const i=this.state.accounts.findIndex(x=>x.id===a.id); if(i<0)this.state.accounts.push(a);else this.state.accounts[i]=a;
    this.save(old?'account.edit':'account.add',a.id); return a;
  }
  category(input) {
    const old=this.state.categories.find(c=>c.id===input.id); const name=clean(input.name,60); invariant(name,'Kategori adı gerekli.');
    invariant(['expense','income'].includes(input.type),'Kategori türü geçersiz.');
    const parent=this.state.categories.find(c=>c.id===input.parentId);
    invariant(!input.parentId||(parent&&parent.type===input.type&&!parent.parentId&&parent.id!==old?.id),'Alt kategori için aynı türde bir ana kategori seç.');
    invariant(!parent||!old||!this.state.categories.some(c=>c.parentId===old.id),'Alt kategorileri olan kategori başka kategori altına taşınamaz.');
    if(old&&old.type!==input.type) invariant(!this.state.transactions.some(t=>t.splits?.some(s=>s.categoryId===old.id))&&!this.state.plans.some(p=>p.categoryId===old.id)&&!this.state.budgets.some(b=>b.categoryId===old.id)&&!this.state.categories.some(c=>c.parentId===old.id),'Kullanılan kategorinin türü değiştirilemez.');
    const c={id:old?.id||randomUUID(),name,type:input.type,parentId:parent?.id||null,color:/^#[0-9a-f]{6}$/i.test(input.color)?input.color:'#9fae88',archived:!!input.archived};
    const i=this.state.categories.findIndex(x=>x.id===c.id); if(i<0)this.state.categories.push(c);else this.state.categories[i]=c;
    this.save(old?'category.edit':'category.add',c.id);return c;
  }
  buildTransaction(input) {
    const old=input.id?this.state.transactions.find(t=>t.id===input.id):null; invariant(!input.id||old,'İşlem bulunamadı.');
    const a=this.getAccount(input.accountId,!!old), type=input.type; invariant(['income','expense','refund','transfer'].includes(type),'İşlem türü geçersiz.');
    const amount=money(input.amount); invariant(amount>0,'Tutar sıfırdan büyük olmalı.'); const date=validDate(input.date);
    const ppm=a.currency===this.state.baseCurrency?1000000:rate(input.rate); const baseAmount=converted(amount,ppm); invariant(baseAmount>0,'Ana para birimindeki tutar çok küçük.');
    const t={id:old?.id||randomUUID(),type,accountId:a.id,currency:a.currency,amount,baseAmount,rate:ppm,date,note:clean(input.note),payee:clean(input.payee,100),tags:clean(input.tags,150),createdAt:old?.createdAt||new Date().toISOString(),updatedAt:new Date().toISOString(),receiptIds:old?.receiptIds||[],planId:old?.planId||null,occurrence:old?.occurrence||null,brandId:clean(input.brandId||old?.brandId,60)||null};
    if(old?.planId)invariant(type===old.type&&a.id===old.accountId&&amount===old.amount&&(!input.toAccountId||input.toAccountId===old.toAccountId),'Planlı ödemenin tutarını/hesabını değiştirmek için önce Ödemeyi geri al kullan.');
    if(old&&this.state.plans.some(p=>p.purchaseId===old.id))invariant(type===old.type&&a.id===old.accountId&&amount===old.amount,'Taksitli alışverişin toplamı ödeme planına bağlıdır.');
    if(type==='transfer') {
      const to=this.getAccount(input.toAccountId,!!old); invariant(to.id!==a.id,'Kaynak ve hedef hesap farklı olmalı.');
      t.toAccountId=to.id;t.toAmount=to.currency===a.currency?amount:money(input.toAmount); invariant(t.toAmount>0,'Hedef hesaba geçen tutarı yaz.'); t.splits=[];
    } else {
      const parts=Array.isArray(input.splits)&&input.splits.length?input.splits:[{categoryId:input.categoryId,amount:input.amount}];
      invariant(parts.length<=20,'En fazla 20 kategoriye bölebilirsin.');
      t.splits=parts.map(part=>{ const c=this.state.categories.find(c=>c.id===part.categoryId); invariant(c&&(old||!c.archived)&&c.type===(type==='income'?'income':'expense'),'İşleme uygun bir kategori seç.'); return {categoryId:c.id,amount:money(part.amount)}; });
      invariant(t.splits.every(x=>x.amount>0)&&t.splits.reduce((sum,x)=>sum+x.amount,0)===amount,'Kategori tutarlarının toplamı işlem tutarıyla aynı olmalı.');
      if(type==='refund'&&input.refundOf) {
        const original=this.state.transactions.find(x=>x.id===input.refundOf&&x.type==='expense');
        invariant(original&&original.currency===a.currency,'İade için aynı para biriminde bir harcama seç.');
        const refunded=this.state.transactions.filter(x=>x.refundOf===original.id&&x.id!==old?.id).reduce((s,x)=>s+x.amount,0);
        invariant(refunded+amount<=original.amount,'İade toplamı ilk harcamayı aşamaz.');t.refundOf=original.id;
      }
    }
    if(old?.type==='expense') invariant(this.state.transactions.filter(x=>x.refundOf===old.id).reduce((s,x)=>s+x.amount,0)<=amount && (!this.state.transactions.some(x=>x.refundOf===old.id)||(type==='expense'&&old.currency===a.currency)),'İadeler bağlıyken ilk harcama tutarı veya türü geçersiz değiştirilemez.');
    return t;
  }
  transaction(input) { const t=this.buildTransaction(input);const i=this.state.transactions.findIndex(x=>x.id===t.id);if(i<0)this.state.transactions.push(t);else this.state.transactions[i]=t;this.save(i<0?'transaction.add':'transaction.edit',t.id);return t; }
  remove(id) {
    const t=this.state.transactions.find(t=>t.id===id); invariant(t,'İşlem bulunamadı.');
    invariant(!this.state.plans.some(p=>p.purchaseId===id),'Bu alışveriş taksit planına bağlı. Taksit ödemelerini Ödemeler bölümünden geri alabilirsin.');
    invariant(!this.state.transactions.some(x=>x.refundOf===id),'Önce bu işleme bağlı iadeleri kaldır.');
    this.state.transactions=this.state.transactions.filter(x=>x.id!==id); this.state.deleted.unshift({record:t,deletedAt:new Date().toISOString()});this.state.deleted=this.state.deleted.slice(0,50);this.save('transaction.delete',id);
  }
  undo(id) {
    const d=this.state.deleted.find(x=>x.record.id===id);invariant(d,'Silinen işlem bulunamadı.');invariant(!this.state.transactions.some(x=>x.id===id),'İşlem zaten geri alındı.');
    if(d.record.planId) invariant(!this.state.transactions.some(t=>t.planId===d.record.planId&&t.occurrence===d.record.occurrence),'Bu ödeme tekrar kaydedilmiş.');
    const candidate=this.export();candidate.transactions.push(d.record);this.validate(candidate);
    this.state.transactions.push(d.record);this.state.deleted=this.state.deleted.filter(x=>x!==d);this.save('transaction.undo',id);
  }
  setBudget(input) {
    invariant(/^\d{4}-\d{2}$/.test(input.month),'Bütçe ayını seç.');validDate(input.month+'-01');
    invariant(input.categoryId==='all'||this.state.categories.some(c=>c.id===input.categoryId&&c.type==='expense'),'Bütçe kategorisi geçersiz.');
    const amount=money(input.amount);invariant(amount>0,'Bütçe sıfırdan büyük olmalı.');
    const old=this.state.budgets.find(b=>b.month===input.month&&b.categoryId===input.categoryId);const b={id:old?.id||randomUUID(),month:input.month,categoryId:input.categoryId,amount,rollover:!!input.rollover};
    this.state.budgets=this.state.budgets.filter(x=>x.id!==b.id);this.state.budgets.push(b);this.save('budget.set',b.id);return b;
  }
  plan(input) {
    const old=this.state.plans.find(p=>p.id===input.id); const name=clean(input.name,100);invariant(name,'Ödeme adı gerekli.');
    invariant(['daily','weekly','monthly','yearly','once'].includes(input.frequency),'Tekrar sıklığı geçersiz.');
    const amount=money(input.amount);invariant(amount>0,'Tutar sıfırdan büyük olmalı.');
    const start=validDate(input.start),end=input.end?validDate(input.end):null;invariant(!end||end>=start,'Bitiş tarihi başlangıçtan önce olamaz.');
    const type=input.type||'expense', account=this.getAccount(input.accountId);
    invariant(['expense','income','transfer'].includes(type),'Plan türü geçersiz.');
    const count=input.installments?Number(input.installments):null;invariant(count===null||(Number.isInteger(count)&&count>=2&&count<=120&&input.frequency==='monthly'),'Taksit sayısı 2–120, sıklık aylık olmalı.');
    invariant(!count||amount>=count,'Her taksit en az bir kuruş olmalı.');
    invariant(!old||!this.state.transactions.some(t=>t.planId===old.id),'Ödenmiş kaydı bulunan planı değiştirmek yerine duraklatıp yeni plan oluştur.');
    const prototype=this.buildTransaction({type,accountId:account.id,toAccountId:input.toAccountId,toAmount:input.toAmount,amount:input.amount,date:start,categoryId:input.categoryId,rate:input.rate});
    const p={id:old?.id||randomUUID(),name,type,accountId:account.id,categoryId:input.categoryId||null,toAccountId:prototype.toAccountId||null,toAmount:prototype.toAmount||null,amount,rate:prototype.rate,start,end,frequency:input.frequency,count,paused:!!input.paused,skipped:old?.skipped||[],purchaseId:old?.purchaseId||null,auto:!!input.auto,brandId:clean(input.brandId||old?.brandId,60)||null,manualOverrides:old?.manualOverrides||[],revisions:old?.revisions||[]};
    if(count&&account.type==='credit') {
      invariant(type==='expense','Kart taksit planı alışveriş gideri olmalı.');
      invariant(!old,'Kart taksit planı yeniden oluşturulmalı.');const funding=this.getAccount(input.fundingAccountId);invariant(funding.type!=='credit'&&funding.currency===account.currency,'Kart taksitleri için aynı para biriminde bir nakit/banka hesabı seç.');
      const purchase=this.buildTransaction({type:'expense',accountId:account.id,amount:input.amount,date:input.purchaseDate||start,categoryId:input.categoryId,rate:input.rate,note:name+' · taksitli alışveriş'});
      this.state.transactions.push(purchase);p.purchaseId=purchase.id;p.type='transfer';p.accountId=funding.id;p.toAccountId=account.id;p.toAmount=amount;
    }
    this.state.plans=this.state.plans.filter(x=>x.id!==p.id);this.state.plans.push(p);this.save('plan.set',p.id);return p;
  }
  occurrences(from, to) {
    const out=[];
    for(const p of this.state.plans.filter(p=>!p.paused)) {
      const start=new Date(p.start+'T12:00:00Z'),begin=new Date(from+'T12:00:00Z');
      const months=(begin.getUTCFullYear()-start.getUTCFullYear())*12+begin.getUTCMonth()-start.getUTCMonth();
      const index=p.frequency==='monthly'?months:p.frequency==='yearly'?Math.floor(months/12):p.frequency==='weekly'?Math.floor((begin-start)/604800000):p.frequency==='daily'?Math.floor((begin-start)/86400000):0;
      for(let i=Math.max(0,index-1);i<(p.count||1000000);i++) {
        if(p.frequency==='once'&&i>0)break;
        const date=nextDate(p,i);if(date>to||(p.end&&date>p.end))break;if(date<from)continue;
        const paid=this.state.transactions.find(t=>t.planId===p.id&&t.occurrence===date);if(paid||p.skipped.includes(date))continue;
        const amount=p.count?Math.floor(p.amount/p.count)+(i<p.amount%p.count?1:0):p.amount;
        const toAmount=p.count&&p.toAmount?Math.floor(p.toAmount/p.count)+(i<p.toAmount%p.count?1:0):p.toAmount;
        out.push({planId:p.id,name:p.name,date,type:p.type,accountId:p.accountId,toAccountId:p.toAccountId,categoryId:p.categoryId,amount,toAmount,rate:p.rate,index:i+1,count:p.count,currency:this.getAccount(p.accountId,true).currency});
      }
    }
    return out.sort((a,b)=>a.date.localeCompare(b.date));
  }
  pay(input) {
    const p=this.state.plans.find(p=>p.id===input.planId);invariant(p&&!p.paused,'Plan bulunamadı veya duraklatıldı.');
    const occurrence=this.occurrences(input.occurrence,input.occurrence).find(o=>o.planId===p.id);invariant(occurrence,'Bu ödeme zaten kaydedilmiş veya tarih geçersiz.');
    const amount=(occurrence.amount/100).toFixed(2);
    const t=this.buildTransaction({type:p.type,accountId:p.accountId,toAccountId:p.toAccountId,toAmount:((occurrence.toAmount||0)/100).toFixed(2),categoryId:p.categoryId,amount,rate:input.rate||String(p.rate/1000000),date:input.date||input.occurrence,brandId:p.brandId,payee:p.name,note:p.name+(p.count?` · ${occurrence.index}/${p.count}`:'')});
    t.planId=p.id;t.occurrence=input.occurrence;this.state.transactions.push(t);this.save('plan.pay',t.id);return t;
  }
  pausePlan(id) {const p=this.state.plans.find(p=>p.id===id);invariant(p,'Plan bulunamadı.');p.paused=!p.paused;this.save('plan.pause',id);}
  skip(input) {const p=this.state.plans.find(p=>p.id===input.planId);invariant(p,'Plan bulunamadı.');invariant(this.occurrences(input.occurrence,input.occurrence).some(o=>o.planId===p.id),'Plan tarihi geçersiz.');p.skipped.push(input.occurrence);this.save('plan.skip',p.id);}
  goal(input) {
    const old=this.state.goals.find(g=>g.id===input.id);const account=this.getAccount(input.accountId);invariant(account.type!=='credit','Birikim için nakit/banka hesabı seç.');
    const name=clean(input.name,100),target=money(input.target);invariant(name&&target>0,'Hedef adı ve tutarı gerekli.');const deadline=input.deadline?validDate(input.deadline):null;
    invariant(!old||old.accountId===account.id||!old.contributions.length,'Birikim ayrılmış hedefin hesabı değiştirilemez.');
    const g={id:old?.id||randomUUID(),name,target,deadline,accountId:account.id,contributions:old?.contributions||[],archived:!!input.archived};this.state.goals=this.state.goals.filter(x=>x.id!==g.id);this.state.goals.push(g);this.save('goal.set',g.id);
  }
  fund(input) {
    const g=this.state.goals.find(g=>g.id===input.goalId&&!g.archived);invariant(g,'Hedef bulunamadı.');const amount=money(input.amount);invariant(amount>0,'Tutar sıfırdan büyük olmalı.');
    const total=g.contributions.reduce((s,c)=>s+c.amount,0), reserve=this.state.goals.filter(x=>x.accountId===g.accountId&&!x.archived).reduce((s,x)=>s+x.contributions.reduce((n,c)=>n+c.amount,0),0);
    if(input.withdraw)invariant(total>=amount,'Ayrılandan fazlası geri alınamaz.');else invariant(this.accountBalance(g.accountId,dateKey())-reserve>=amount,'Bu hesapta ayrılabilecek bakiye yeterli değil.');
    g.contributions.push({id:randomUUID(),amount:input.withdraw?-amount:amount,date:dateKey()});this.save('goal.fund',g.id);
  }
  setRate(input) {invariant(CURRENCIES.includes(input.currency)&&input.currency!==this.state.baseCurrency,'Yabancı para birimi seç.');this.state.rates[input.currency]=rate(input.rate);this.save('rate.set',input.currency);}
  settings(input) {invariant(CURRENCIES.includes(input.baseCurrency),'Para birimi geçersiz.');invariant(!this.state.transactions.length&&!this.state.budgets.length&&!this.state.plans.length,'İşlem/bütçe kayıtlarından sonra ana para birimi değiştirilemez.');if(this.state.baseCurrency!==input.baseCurrency)this.state.rates={[input.baseCurrency]:1000000};this.state.baseCurrency=input.baseCurrency;this.save('settings.set','base');}
  allocations(t) {
    let remaining=t.baseAmount;return t.splits.map((s,i)=>{const n=i===t.splits.length-1?remaining:Math.min(remaining,converted(s.amount,t.rate));remaining-=n;return {...s,baseAmount:n};});
  }
  summary(from,to) {
    const tx=this.state.transactions.filter(t=>t.date>=from&&t.date<=to), categories={};let income=0,expense=0,refund=0;
    for(const t of tx) {if(t.type==='income')income+=t.baseAmount;if(t.type==='expense')expense+=t.baseAmount;if(t.type==='refund')refund+=t.baseAmount;
      if(t.type==='expense'||t.type==='refund')for(const s of this.allocations(t))categories[s.categoryId]=(categories[s.categoryId]||0)+(t.type==='refund'?-s.baseAmount:s.baseAmount);}
    return {income,expense,refund,netExpense:expense-refund,net:income-expense+refund,categories,count:tx.length};
  }
  spent(categoryId,month) {const today=dateKey(),end=month+'-31',summary=this.summary(month+'-01',end<today?end:today);if(categoryId==='all')return summary.netExpense;const ids=new Set([categoryId,...this.state.categories.filter(c=>c.parentId===categoryId).map(c=>c.id)]);return Object.entries(summary.categories).filter(([id])=>ids.has(id)).reduce((s,[,n])=>s+n,0);}
  budgetLimit(b,depth=0) { if(!b.rollover||depth>=24)return b.amount;const priorMonth=shiftMonth(b.month+'-01',-1).slice(0,7),prior=this.state.budgets.find(x=>x.month===priorMonth&&x.categoryId===b.categoryId);return b.amount+(prior?Math.max(0,this.budgetLimit(prior,depth+1)-this.spent(prior.categoryId,prior.month)):0); }
  cardStatement(a, today) {
    if(a.type!=='credit')return null;
    const month=today.slice(0,7)+'-01',cut=shiftMonth(month,0,a.cutDay),latest=today>=cut?cut:shiftMonth(month,-1,a.cutDay);
    const previous=shiftMonth(latest,-1,a.cutDay), startDate=new Date(previous+'T12:00:00Z');startDate.setUTCDate(startDate.getUTCDate()+1);const start=startDate.toISOString().slice(0,10);
    let due=shiftMonth(latest,0,a.dueDay);if(due<=latest)due=shiftMonth(latest,1,a.dueDay);
    const period=this.state.transactions.filter(t=>t.accountId===a.id&&t.date>=start&&t.date<=latest);
    const billed=period.reduce((s,t)=>s+(t.type==='expense'?t.amount:t.type==='refund'?-t.amount:0),0);
    const payments=this.state.transactions.filter(t=>t.type==='transfer'&&t.toAccountId===a.id&&t.date>latest&&t.date<=today).reduce((s,t)=>s+t.toAmount,0);
    return {cut:latest,due,billed,estimatedDue:Math.max(0,billed-payments),debt:Math.max(0,-this.accountBalance(a.id,today)),available:Math.max(0,a.limit+this.accountBalance(a.id,today))};
  }
  cardDates(month, today=dateKey()) {
    validDate(month+'-01');
    return this.state.accounts.filter(a=>a.type==='credit'&&!a.archived).map(a=>({id:a.id,name:a.name,date:shiftMonth(month+'-01',0,a.dueDay),cut:shiftMonth(month+'-01',0,a.cutDay),currency:a.currency,debt:Math.max(0,-this.accountBalance(a.id,today)),remind:a.remind!==false}));
  }
  duplicate(input) {
    const t=this.buildTransaction(input);
    return this.state.transactions.filter(x=>x.id!==input.id&&x.accountId===t.accountId&&x.type===t.type&&x.date===t.date&&x.amount===t.amount&&(t.type!=='transfer'||x.toAccountId===t.toAccountId)).map(x=>({id:x.id,note:x.note,payee:x.payee,date:x.date,amount:x.amount}));
  }
  template(input) {
    invariant(this.state.templates.length<200||input.id,'En fazla 200 şablon saklanabilir.');
    const name=clean(input.name,80);invariant(name,'Şablon adı gerekli.');
    const draft={...input.input,date:dateKey()};delete draft.id;const t=this.buildTransaction(draft);
    const record={id:input.id||randomUUID(),name,input:{type:t.type,accountId:t.accountId,toAccountId:t.toAccountId,toAmount:t.toAmount?String(t.toAmount/100):'',categoryId:t.splits[0]?.categoryId,amount:String(t.amount/100),rate:String(t.rate/1000000),note:t.note,payee:t.payee,tags:t.tags,splits:t.splits.map(x=>({categoryId:x.categoryId,amount:String(x.amount/100)}))}};
    this.state.templates=this.state.templates.filter(t=>t.id!==record.id);this.state.templates.push(record);this.save('template.save',record.id);
  }
  learning(input) {
    const {chapters}=require('../renderer/panel/budget-handbook');
    invariant(chapters.some(c=>c.id===input.id),'El kitabı bölümü bulunamadı.');invariant(['read','bookmarks'].includes(input.kind),'Okuma işlemi geçersiz.');
    const list=this.state.learning[input.kind];this.state.learning[input.kind]=list.includes(input.id)?list.filter(id=>id!==input.id):[...list,input.id];this.save('learning.'+input.kind,input.id);
  }
  preferences(input) {
    if(input.textSize!==undefined){invariant(['comfortable','large'].includes(input.textSize),'Yazı boyutu geçersiz.');this.state.preferences.textSize=input.textSize;}
    if(input.financeTheme!==undefined){invariant(['modern','nero'].includes(input.financeTheme),'Finans teması geçersiz.');this.state.preferences.financeTheme=input.financeTheme;}
    this.save('preferences.set','budget');
  }
  view(month = dateKey().slice(0,7)) {
    invariant(/^\d{4}-\d{2}$/.test(month),'Ay geçersiz.');validDate(month+'-01');const today=dateKey(), state=this.state;
    const accounts=state.accounts.map(a=>({...a,balance:this.accountBalance(a.id,today),statement:this.cardStatement(a,today),reserved:state.goals.filter(g=>g.accountId===a.id&&!g.archived).reduce((s,g)=>s+g.contributions.reduce((v,c)=>v+c.amount,0),0)}));
    const missingRates=accounts.filter(a=>a.currency!==state.baseCurrency&&!state.rates[a.currency]).map(a=>a.currency);
    const netWorth=accounts.reduce((sum,a)=>sum+(state.rates[a.currency]?converted(a.balance,state.rates[a.currency]):0),0);
    const current=this.summary(month+'-01',month+'-31'), previous=this.summary(shiftMonth(month+'-01',-1).slice(0,7)+'-01',shiftMonth(month+'-01',-1).slice(0,7)+'-31');
    return {version:1,today,month,baseCurrency:state.baseCurrency,currencies:CURRENCIES,rates:state.rates,accounts,categories:state.categories,transactions:state.transactions,netWorth,missingRates,summary:current,previous,
      budgets:state.budgets.filter(b=>b.month===month).map(b=>{const limit=this.budgetLimit(b),spent=this.spent(b.categoryId,month);return {...b,limit,spent,remaining:limit-spent};}),
      canUndoChange:!!state.undoChange,templates:state.templates,learning:state.learning,preferences:state.preferences,cardDates:this.cardDates(month,today),calendar:this.occurrences(month+"-01",shiftMonth(month+"-01",1)),plans:state.plans,upcoming:this.occurrences(shiftMonth(today,-24),shiftMonth(today,3)),
      goals:state.goals.map(g=>({...g,saved:g.contributions.reduce((s,c)=>s+c.amount,0),currency:this.getAccount(g.accountId,true).currency})),
      trend:Array.from({length:12},(_,i)=>{const m=shiftMonth(month+'-01',i-11).slice(0,7);return {month:m,...this.summary(m+'-01',m+'-31')};}),
      deleted:state.deleted.map(d=>({id:d.record.id,note:d.record.note,amount:d.record.amount,currency:d.record.currency,deletedAt:d.deletedAt})),audit:state.audit.slice(-100).reverse(),receipts:state.receipts.map(({data,...r})=>r)};
  }
  reminders(today=dateKey()) {
    const out=this.occurrences(today,today).map(o=>({...o,key:o.planId+':'+o.date,kind:'plan'}));
    for(const c of this.cardDates(today.slice(0,7),today))if(c.remind&&c.date===today&&c.debt>0)out.push({...c,key:'card:'+c.id+':'+today,kind:'card'});
    const fresh=out.filter(o=>!this.state.notified.includes(o.key));if(fresh.length){this.state.notified.push(...fresh.map(o=>o.key));this.state.notified=this.state.notified.slice(-1000);this.store.set(this.state);}return fresh;
  }
  undoChange() {
    const change=this.state.undoChange;invariant(change,'Geri alınabilecek düzenleme yok.');
    invariant(!change.patches.some(p=>p.key==='baseCurrency')||(!this.state.transactions.length&&!this.state.plans.length&&!this.state.budgets.length),'Kayıtlardan sonra ana para birimi geri alınamaz.');
    const candidate=this.export();
    for(const patch of change.patches){if(patch.collection){candidate[patch.collection]=candidate[patch.collection].filter(x=>x.id!==patch.id);if(patch.before)candidate[patch.collection].push(patch.before);}else candidate[patch.key]=patch.before;}
    this.validate(candidate);candidate.undoChange=null;this.state=candidate;this.save('change.undo',change.action);
  }
  act(action,input={}) {
    const handlers={notificationSettings:()=>this.notificationSettings(input),unpay:()=>this.unpay(input),revisePlan:()=>this.revisePlan(input),scheduleTransaction:()=>this.scheduleTransaction(input),quiz:()=>this.quiz(input),resumeLesson:()=>{const h=require('../renderer/panel/budget-handbook');invariant(h.chapters.some(c=>c.id===input.id),'Ders bulunamadı.');this.state.learning.last=input.id;this.save('learning.resume',input.id);},undoChange:()=>this.undoChange(),template:()=>this.template(input),removeTemplate:()=>{this.state.templates=this.state.templates.filter(t=>t.id!==input.id);this.save('template.delete',input.id);},learning:()=>this.learning(input),preferences:()=>this.preferences(input),account:()=>this.account(input),category:()=>this.category(input),transaction:()=>this.transaction(input),remove:()=>this.remove(input.id),undo:()=>this.undo(input.id),budget:()=>this.setBudget(input),plan:()=>this.plan(input),pay:()=>this.pay(input),pausePlan:()=>this.pausePlan(input.id),skip:()=>this.skip(input),goal:()=>this.goal(input),fund:()=>this.fund(input),rate:()=>this.setRate(input),settings:()=>this.settings(input),removeBudget:()=>{this.state.budgets=this.state.budgets.filter(b=>b.id!==input.id);this.save('budget.delete',input.id);}};
    invariant(handlers[action],'Bütçe işlemi desteklenmiyor.');const before=structuredClone(this.state);
    try{const result=handlers[action]();
      if(['account','category','budget','removeBudget','goal','fund','rate','settings','plan','pausePlan','skip','template','removeTemplate'].includes(action)){
        const patches=[];
        for(const collection of ['accounts','categories','budgets','goals','plans','templates']){
          const old=new Map(before[collection].map(x=>[x.id,x])),next=new Map(this.state[collection].map(x=>[x.id,x]));
          for(const id of new Set([...old.keys(),...next.keys()]))if(JSON.stringify(old.get(id))!==JSON.stringify(next.get(id)))patches.push({collection,id,before:old.get(id)||null});
        }
        for(const key of ['rates','baseCurrency'])if(JSON.stringify(before[key])!==JSON.stringify(this.state[key]))patches.push({key,before:before[key]});
        // A card installment creates a real purchase too. Its transaction has its own delete/undo flow.
        this.state.undoChange=this.state.transactions.length===before.transactions.length&&patches.length?{action,patches}:null;this.store.set(this.state);
      }
      return result;
    }catch(e){this.state=before;this.store.set(this.state);throw e;}
  }
  export() { return structuredClone(this.state); }
  replace(state) {this.validate(state);this.state={...defaults(),...structuredClone(state)};this.save('backup.import','budget');}
}
require('./budget-finance')(Budget,{dateKey,validDate,shiftMonth,converted,money,nextDate});
module.exports={Budget,money,rate,converted,dateKey,validDate,shiftMonth,nextDate,defaults,CURRENCIES};
