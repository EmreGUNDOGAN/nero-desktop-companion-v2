'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Budget,defaults,money,rate,converted,shiftMonth,dateKey}=require('../src/main/budget');
const {parseCSV,exportCSV,previewCSV,importCSV}=require('../src/main/budget-csv');
const {registerBudgetIPC,validateReceipt}=require('../src/main/budget-ipc');
const {reportHTML}=require('../src/main/budget-report');
function setup(){let saved=defaults();const b=new Budget({get:()=>saved,set:s=>{saved=structuredClone(s);}});const bank=b.act('account',{name:'Banka',type:'bank',currency:'TRY',opening:'10000'}),cash=b.act('account',{name:'Cüzdan',type:'cash',currency:'TRY',opening:'500'}),card=b.act('account',{name:'Kart',type:'credit',currency:'TRY',opening:'0',limit:'20000',cutDay:1,dueDay:10});return {b,bank,cash,card,saved:()=>saved};}
function tx(b,a,type,amount,extra={}){return b.act('transaction',{accountId:a.id,type,amount,date:'2026-10-05',categoryId:type==='income'?'income-0':'expense-0',...extra});}
test('Kuruş hassasiyeti, Türkçe tutarlar, tarihi kur ve ay sonları',()=>{
 assert.equal(money('1.250,51'),125051);assert.equal(money('1,250.51'),125051);assert.equal(money('-12,25',true),-1225);assert.equal(converted(1,rate('0.5')),1);assert.equal(converted(-1,rate('0.5')),-1);
 assert.throws(()=>money('2.001'));assert.throws(()=>rate('0'));assert.throws(()=>money('90071992547409'));
 assert.equal(shiftMonth('2026-01-31',1),'2026-02-28');assert.equal(shiftMonth('2024-01-31',1),'2024-02-29');assert.equal(shiftMonth('2026-01-31',2),'2026-03-31');
});
test('Gelir, bölünmüş gider, iade ve kart transferi aynı harcamayı iki kere saymaz',()=>{
 const {b,bank,card}=setup();tx(b,bank,'income','1000');const purchase=tx(b,card,'expense','300',{splits:[{categoryId:'expense-0',amount:'100'},{categoryId:'expense-1',amount:'200'}]});tx(b,card,'refund','50',{refundOf:purchase.id});tx(b,bank,'transfer','250',{toAccountId:card.id});
 const s=b.summary('2026-10-01','2026-10-31');assert.equal(s.income,100000);assert.equal(s.netExpense,25000);assert.equal(s.net,75000);assert.equal(b.accountBalance(card.id),0);assert.equal(s.categories['expense-0'],5000);assert.equal(s.categories['expense-1'],20000);assert.equal(b.view('2026-10').netWorth,1125000);
 assert.throws(()=>tx(b,card,'refund','251',{refundOf:purchase.id}));assert.throws(()=>b.act('remove',{id:purchase.id}));assert.throws(()=>tx(b,card,'expense','10',{splits:[{categoryId:'expense-0',amount:'9'}]}));
});
test('Döviz transferi her hesabın tutarını korur; kur değişince eski rapor değişmez',()=>{
 const {b,bank}=setup();const usd=b.act('account',{name:'Dolar',type:'bank',currency:'USD',opening:'0'});b.act('rate',{currency:'USD',rate:'40'});tx(b,bank,'transfer','400',{toAccountId:usd.id,toAmount:'10'});tx(b,usd,'expense','2.50',{rate:'40'});b.act('rate',{currency:'USD',rate:'45'});
 assert.equal(b.accountBalance(usd.id),750);assert.equal(b.summary('2026-10-01','2026-10-31').netExpense,10000);assert.equal(b.view('2026-10').netWorth,1043750);assert.throws(()=>b.act('account',{...usd,opening:'0',currency:'EUR'}));
});
test('Ana para değişimi eski kurları siler ve kayıt sonrası engellenir',()=>{
 const {b,bank}=setup();b.act('rate',{currency:'USD',rate:'40'});b.act('settings',{baseCurrency:'EUR'});assert.deepEqual(b.state.rates,{EUR:1000000});assert.deepEqual(b.view().missingRates,['TRY','TRY','TRY']);tx(b,bank,'income','1',{rate:'0.02'});assert.throws(()=>b.act('settings',{baseCurrency:'TRY'}));
});
test('Gelecek tarihli işlemler bakiyeye henüz girmez ve hedefler gelecekteki geliri ayıramaz',()=>{
 const {b,bank}=setup();tx(b,bank,'income','50000',{date:'2199-01-01'});b.act('goal',{name:'Tatil',accountId:bank.id,target:'60000'});const g=b.state.goals[0];assert.throws(()=>b.act('fund',{goalId:g.id,amount:'20000'}));b.act('fund',{goalId:g.id,amount:'9000'});assert.equal(b.view().accounts.find(a=>a.id===bank.id).reserved,900000);assert.equal(b.view().accounts.find(a=>a.id===bank.id).balance,1000000);assert.throws(()=>b.act('fund',{goalId:g.id,amount:'2000'}));b.act('fund',{goalId:g.id,amount:'1000',withdraw:true});assert.equal(b.view().goals[0].saved,800000);assert.throws(()=>b.act('fund',{goalId:g.id,amount:'8001',withdraw:true}));
});
test('Kart taksitinde alışveriş bir kez giderdir, üç ödemede kuruş kaybolmaz',()=>{
 const {b,bank,card}=setup();const p=b.act('plan',{name:'Bilgisayar',type:'expense',accountId:card.id,fundingAccountId:bank.id,categoryId:'expense-0',amount:'1000.01',rate:'1',frequency:'monthly',start:'2026-01-31',purchaseDate:'2026-01-20',installments:3});
 const due=b.occurrences('2026-01-01','2026-04-01');assert.deepEqual(due.map(o=>o.date),['2026-01-31','2026-02-28','2026-03-31']);assert.deepEqual(due.map(o=>o.amount),[33334,33334,33333]);assert.equal(b.summary('2026-01-01','2026-12-31').netExpense,100001);
 for(const o of due)b.act('pay',{planId:p.id,occurrence:o.date});assert.equal(b.accountBalance(card.id),0);assert.equal(b.summary('2026-01-01','2026-12-31').netExpense,100001);assert.throws(()=>b.act('pay',{planId:p.id,occurrence:due[0].date}));assert.equal(b.occurrences('2026-01-01','2026-04-01').length,0);
});
test('Banka taksitleri gerçekleşene kadar gider sayılmaz, tekrar ödenemez',()=>{
 const {b,bank}=setup();const p=b.act('plan',{name:'Kurs',accountId:bank.id,categoryId:'expense-7',amount:'100',frequency:'monthly',start:'2026-01-31',installments:3});assert.equal(b.state.transactions.length,0);
 const t=b.act('pay',{planId:p.id,occurrence:'2026-02-28'});assert.equal(t.amount,3333);assert.throws(()=>b.act('pay',{planId:p.id,occurrence:'2026-02-27'}));assert.throws(()=>b.act('plan',{...p,amount:'120',installments:3}));
 b.act('remove',{id:t.id});const again=b.act('pay',{planId:p.id,occurrence:'2026-02-28'});assert.throws(()=>b.act('undo',{id:t.id}));assert.equal(b.state.transactions[0].id,again.id);
});
test('Uzun süredir kullanılan günlük planlarda güncel tarihler ve tek bildirim',()=>{
 const {b,bank}=setup();b.act('notificationSettings',{enabled:true,days:[0],time:'00:00'});const today=dateKey();const p=b.act('plan',{name:'Günlük',accountId:bank.id,categoryId:'expense-0',amount:'1',frequency:'daily',start:'1900-01-01'});assert.equal(b.occurrences(today,today)[0].date,today);assert.equal(b.reminders(today).length,1);assert.equal(b.reminders(today).length,0);b.act('skip',{planId:p.id,occurrence:today});assert.equal(b.occurrences(today,today).length,0);b.act('pausePlan',{id:p.id});assert.equal(b.occurrences('2026-01-01','2026-01-31').length,0);
});
test('Bütçe devri ve alt kategori toplamı',()=>{
 const {b,bank}=setup();const sub=b.act('category',{name:'Sebze',type:'expense',parentId:'expense-0',color:'#112233'});tx(b,bank,'expense','300',{categoryId:sub.id,date:'2026-09-05'});b.act('budget',{month:'2026-09',categoryId:'expense-0',amount:'500'});b.act('budget',{month:'2026-10',categoryId:'expense-0',amount:'500',rollover:true});const v=b.view('2026-10');assert.equal(v.budgets[0].limit,70000);assert.equal(b.spent('expense-0','2026-09'),30000);assert.throws(()=>b.act('category',{id:'expense-0',name:'Market',type:'income'}));assert.throws(()=>b.act('category',{id:'expense-0',name:'Market',type:'expense',parentId:'expense-1'}));
});
test('Silinen bağlı iade, ana harcama yokken geri alınamaz; yedek atomik doğrulanır',()=>{
 const {b,bank}=setup();const expense=tx(b,bank,'expense','100'),refund=tx(b,bank,'refund','20',{refundOf:expense.id});b.act('remove',{id:refund.id});b.act('remove',{id:expense.id});assert.throws(()=>b.act('undo',{id:refund.id}));b.act('undo',{id:expense.id});b.act('undo',{id:refund.id});const good=b.export();b.replace(good);assert.equal(b.state.transactions.length,2);const bad=b.export();bad.transactions[0].baseAmount++;assert.throws(()=>b.replace(bad));assert.equal(b.state.transactions[0].baseAmount,10000);const orphan=b.export();orphan.transactions=orphan.transactions.filter(t=>t.id!==expense.id);assert.throws(()=>b.validate(orphan));
});
test('CSV çok satırlı metin, bölünmüş kategori, tekrar kontrolü, formül güvenliği',()=>{
 const {b,bank}=setup();tx(b,bank,'expense','150',{note:'Kahve; süt\n"Özel"',splits:[{categoryId:'expense-0',amount:'50'},{categoryId:'expense-1',amount:'100'}]});const csv=exportCSV(b);assert.equal(parseCSV(csv).length,2);assert.equal(previewCSV(b,csv).duplicates,1);const empty=setup().b;empty.state.accounts=structuredClone(b.state.accounts);const preview=previewCSV(empty,csv);assert.equal(preview.errors.length,0);assert.equal(importCSV(empty,preview),1);assert.equal(importCSV(empty,preview),0);assert.equal(empty.state.transactions[0].note,'Kahve; süt\n"Özel"');assert.equal(empty.state.transactions[0].splits.length,2);tx(b,bank,'expense','2',{note:'-CMD()'});assert.ok(exportCSV(b).includes("'-CMD()"));assert.throws(()=>parseCSV('"incomplete'));
});
test('CSV hatalı satırları bildirir, farklı döviz kurları tekrar sayılmaz',()=>{
 const {b}=setup();const usd=b.act('account',{name:'USD',type:'bank',currency:'USD',opening:'100'});tx(b,usd,'expense','1',{rate:'40'});tx(b,usd,'expense','1',{rate:'41'});const csv=exportCSV(b);assert.equal(previewCSV(b,csv).duplicates,2);const preview=previewCSV(b,'tarih;tur;hesap;kategori;tutar\n2026-02-30;gider;USD;Market;10\n2026-01-01;gider;Yok;Market;10');assert.equal(preview.errors.length,2);assert.equal(preview.valid.length,0);
});
test('IPC yalnız paneli kabul eder, fiş gerçek formatı ve rapor kaçışını kontrol eder',async()=>{
 const {b}=setup(),handlers={},panel={webContents:{}};registerBudgetIPC({ipcMain:{handle:(k,f)=>handlers[k]=f},budget:b,getPanel:()=>panel});assert.equal((await handlers['budget:get']({sender:{}},'2026-10')).ok,false);assert.equal((await handlers['budget:get']({sender:panel.webContents},'2026-10')).ok,true);assert.equal((await handlers['budget:act']({sender:panel.webContents},'unknown',{},'2026-10')).ok,false);assert.throws(()=>validateReceipt('.pdf',Buffer.from('fake')));assert.throws(()=>validateReceipt('.exe',Buffer.from('%PDF-')));assert.doesNotThrow(()=>validateReceipt('.pdf',Buffer.from('%PDF-1.7')));b.state.accounts[0].name='<script>bad</script>';assert.ok(reportHTML(b.view('2026-10')).includes('&lt;script&gt;'));assert.doesNotMatch(reportHTML(b.view('2026-10')),/<script>/);
});
