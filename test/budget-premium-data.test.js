'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {inBase,dailyFlow,scheduledFlow}=require('../src/renderer/panel/premium/data');
test('Canvas savings convert integer rates, round symmetrically and exclude missing rates',()=>{
 assert.equal(inBase(101,'USD','TRY',{USD:1550000}),157);assert.equal(inBase(-101,'USD','TRY',{USD:1550000}),-157);assert.equal(inBase(100,'USD','TRY',{}),null);assert.equal(inBase(100,'TRY','TRY',{}),100);
});
test('Daily canvas series use recorded amounts, subtract refunds and exclude future dates and transfers',()=>{
 const view={today:'2026-10-03',transactions:[{date:'2026-10-01',type:'income',baseAmount:10000},{date:'2026-10-02',type:'expense',baseAmount:5000},{date:'2026-10-02',type:'refund',baseAmount:1000},{date:'2026-10-02',type:'transfer',baseAmount:7000},{date:'2026-10-04',type:'expense',baseAmount:9000}]};
 const rows=dailyFlow(view,'2026-10');assert.equal(rows.length,3);assert.equal(rows[0].income,10000);assert.equal(rows[1].netExpense,4000);assert.equal(rows[2].netExpense,0);
});
test('Empty data produces zero samples rather than a decorative invented curve',()=>{
 const rows=dailyFlow({today:'2026-10-02',transactions:[]},'2026-10');assert.equal(rows.length,2);assert.ok(rows.every(r=>r.income===0&&r.netExpense===0));
});
test('Scheduled bars use the occurrence rate and do not count own-account transfers as income or expense',()=>{
 const view={baseCurrency:'TRY',rates:{USD:40000000},calendar:[{date:'2026-10-01',type:'expense',amount:1000,currency:'USD',rate:30000000},{date:'2026-10-09',type:'income',amount:50000,currency:'TRY'},{date:'2026-10-09',type:'transfer',amount:999999,currency:'TRY'},{date:'2026-11-01',type:'expense',amount:50000,currency:'TRY'}]};
 const rows=scheduledFlow(view,'2026-10');assert.equal(rows.length,5);assert.equal(rows[0].expense,30000);assert.equal(rows[1].income,50000);assert.equal(rows[1].expense,0);
 assert.deepEqual(scheduledFlow({...view,calendar:[]},'2026-02').map(r=>r.name),['1–7','8–14','15–21','22–28']);
});
