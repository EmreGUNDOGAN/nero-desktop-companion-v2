'use strict';
const { randomUUID } = require('node:crypto');
const CURRENCIES = ['TRY','USD','EUR','GBP','CHF','CAD','AUD'];
const MAX = 1000000000000;
const clean = (v, n = 300) => String(v ?? '').trim().slice(0, n);
function invariant(ok, message) { if (!ok) throw new Error(message); }
function dateKey(date = new Date()) { return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`; }
function validDate(value) {
  const s = clean(value, 10);
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
], budgets:[], plans:[], goals:[], deleted:[], audit:[], receipts:[], notified:[] }; }
class Budget {
  constructor(store) { this.store=store; this.state={...defaults(),...store.get()}; this.validate(this.state); }
  validate(s) {
    invariant(s && s.version===1 && CURRENCIES.includes(s.baseCurrency), 'Bütçe yedeği veya para birimi geçersiz.');
    for (const key of ['accounts','transactions','categories','budgets','plans','goals','deleted','audit','receipts','notified']) invariant(Array.isArray(s[key]), 'Bütçe yedeğinin alanları eksik: '+key);
    for (const key of ['accounts','transactions','categories','budgets','plans','goals']) {
      invariant(new Set(s[key].map(x=>x.id)).size===s[key].length, 'Yedekte yinelenen kayıt kimliği var.');
      for (const x of s[key]) invariant(x && typeof x.id==='string' && x.id.length<=100, 'Yedek kayıt kimliği geçersiz.');
    }
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
    for(const r of s.receipts)invariant(typeof r.data==='stri