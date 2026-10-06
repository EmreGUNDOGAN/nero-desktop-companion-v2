'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Budget,defaults}=require('../src/main/budget');
const {calculate}=require('../src/renderer/panel/budget-calculators');
const handbook=require('../src/renderer/panel/budget-handbook');
function setup(){let saved=defaults();const b=new Budget({get:()=>saved,set:v=>saved=structuredClone(v)});return b;}
test('Kart vade bildirimi ay sonunda, bir kez, borç ve kullanıcı tercihine bağlıdır',()=>{
 const b=setup(),card=b.act('account',{name:'Kart',type:'credit',currency:'TRY',opening:'100',dueDay:31,remind:true});
 assert.equal(b.reminders('2026-02-27').length,0);assert.equal(b.reminders('2026-02-28')[0].kind,'card');assert.equal(b.reminders('2026-02-28').length,0);assert.equal(b.reminders('2028-02-29').length,1);
 b.act('account',{...card,opening:'100',remind:false});assert.equal(b.reminders('2026-03-31').length,0);b.act('account',{...card,opening:'0',remind:true});assert.equal(b.reminders('2026-04-30').length,0);b.act('account',{...card,opening:'100',archived:true});assert.equal(b.reminders('2026-05-31').length,0);
});
test('Takvim seçilen aya aittir, vade kaydı bugünkü gerçek kart borcunu kullanır',()=>{
 const b=setup();b.act('account',{name:'Kart',type:'credit',currency:'TRY',opening:'100',dueDay:10});const v=b.view('2026-12');assert.equal(v.cardDates[0].date,'2026-12-10');assert.equal(v.cardDates[0].debt,10000);
});
test('İşlem şablonu gelir yaratmaz; kullanımı bağımsız yeni işleme dönüşür',()=>{
 const b=setup(),a=b.act('account',{name:'Banka',type:'bank',opening:'0'});const input={type:'income',accountId:a.id,amount:'123.45',date:'2026-10-06',categoryId:'income-0',note:'İş geliri'};b.act('template',{name:'İş ödemesi',input});assert.equal(b.state.transactions.length,0);const t=b.act('transaction',{...b.state.templates[0].input,date:'2026-10-07'});assert.equal(t.amount,12345);assert.equal(b.state.templates.length,1);assert.throws(()=>b.act('account',{...a,opening:'0',currency:'USD'}));b.act('removeTemplate',{id:b.state.templates[0].id});assert.equal(b.state.transactions.length,1);
});
test('Benzer kayıt uyarısı aynı gün hesap tür ve tutarı arar; düzenlenen kendisini bulmaz',()=>{
 const b=setup(),a=b.act('account',{name:'Nakit',type:'cash',opening:'0'}),input={type:'expense',accountId:a.id,amount:'10',date:'2026-10-06',categoryId:'expense-0'};const t=b.act('transaction',input);assert.equal(b.duplicate(input).length,1);assert.equal(b.duplicate({...input,id:t.id}).length,0);assert.equal(b.duplicate({...input,date:'2026-10-07'}).length,0);assert.equal(b.duplicate({...input,type:'income',categoryId:'income-0'}).length,0);
});
test('Eski 6.9.1 yedeği şablon, okuma ve yazı tercihi olmadan yüklenir',()=>{
 const b=setup(),old=defaults();delete old.templates;delete old.learning;delete old.preferences;b.replace(old);assert.deepEqual(b.view().templates,[]);assert.equal(b.view().preferences.textSize,'comfortable');assert.deepEqual(b.view().learning.read,[]);
});
test('El kitabı ilerlemesi, kaydedilenler ve yazı tercihi yedekte korunur',()=>{
 const b=setup();b.act('learning',{id:'inflation',kind:'read'});b.act('learning',{id:'inflation',kind:'bookmarks'});b.act('preferences',{textSize:'large'});const c=setup();c.replace(b.export());assert.deepEqual(c.view().learning,{read:['inflation'],bookmarks:['inflation']});assert.equal(c.view().preferences.textSize,'large');c.act('learning',{id:'inflation',kind:'read'});assert.deepEqual(c.state.learning.read,[]);assert.throws(()=>c.act('learning',{id:'missing',kind:'read'}));
});
test('Finansal senaryolar: sıfır/negatif getiri, katkı, reel kayıp ve sınırlar',()=>{
 assert.equal(calculate('goal',{target:'20000',saved:'5000',months:'10'}).monthly,1500);assert.equal(calculate('goal',{target:'100',saved:'200',months:'1'}).monthly,0);assert.equal(calculate('emergency',{expense:'15000',months:'2'}).target,30000);assert.ok(Math.abs(calculate('real',{nominal:'15',inflation:'20'}).real+4.1666666667)<1e-8);
 const r=calculate('compound',{initial:'10000',monthly:'0',years:'2',annual:'10'});assert.ok(Math.abs(r.total-12100)<1e-8);assert.equal(r.paid,10000);assert.equal(calculate('compound',{initial:'100',monthly:'10',years:'1',annual:'0'}).total,220);assert.ok(calculate('compound',{initial:'10000',monthly:'0',years:'1',annual:'-10'}).growth<0);assert.throws(()=>calculate('goal',{target:'1',saved:'0',months:'0'}));assert.throws(()=>calculate('real',{nominal:'10',inflation:'-100'}));assert.throws(()=>calculate('compound',{initial:'10',monthly:'1',years:'1.5',annual:'10'}));assert.throws(()=>calculate('compound',{initial:'10000000000',monthly:'100000000',years:'50',annual:'100'}));
});
test('El kitabında bağlantılar, ilgili bölümler ve uygulama araçları tutarlıdır',()=>{
 const ids=new Set(handbook.chapters.map(c=>c.id));assert.equal(ids.size,handbook.chapters.length);assert.ok(handbook.chapters.length>=25);assert.ok(handbook.terms.length>=30);for(const c of handbook.chapters){assert.ok(c.sections.length>=3);assert.ok(c.example.length>100);assert.ok(c.steps.length>=3);for(const id of c.sources)assert.ok(handbook.sources[id]);for(const id of c.related)assert.ok(ids.has(id));}for(const s of Object.values(handbook.sources))assert.match(s.url,/^https:\/\/(www\.)?(files\.consumerfinance\.gov|consumerfinance\.gov|investor\.gov|tcmb\.gov\.tr)\//);
});
test('Bütçe/hesap düzenlemesini geri alma işlem bağımlılığını bozmaz',()=>{
 const b=setup(),a=b.act('account',{name:'Banka',type:'bank',opening:'100'});b.act('account',{...a,opening:'200'});assert.equal(b.accountBalance(a.id),20000);b.act('undoChange');assert.equal(b.accountBalance(a.id),10000);b.act('budget',{month:'2026-10',categoryId:'all',amount:'1000'});b.act('undoChange');assert.equal(b.state.budgets.length,0);
 const newAccount=b.act('account',{name:'Yeni',type:'cash',opening:'0'});b.act('transaction',{accountId:newAccount.id,type:'income',amount:'1',date:'2026-10-06',categoryId:'income-0'});assert.throws(()=>b.act('undoChange'));assert.ok(b.getAccount(newAccount.id));
});
