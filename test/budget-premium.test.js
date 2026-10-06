'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {Budget,defaults}=require('../src/main/budget');
function setup(){let state=defaults();return new Budget({get:()=>state,set:v=>state=structuredClone(v)});}
test('Premium Black survives export, restart and restore without changing financial records',()=>{
 const b=setup(),a=b.act('account',{name:'Banka',type:'bank',opening:'5000'});
 b.act('transaction',{type:'expense',accountId:a.id,categoryId:'expense-0',amount:'150',date:'2026-10-06',payee:'Netflix'});
 const before=structuredClone(b.state.transactions),balance=b.accountBalance(a.id);
 b.act('preferences',{financeTheme:'premium-black'});
 const restored=setup();restored.replace(b.export());assert.equal(restored.view().preferences.financeTheme,'premium-black');assert.deepEqual(restored.state.transactions,before);assert.equal(restored.accountBalance(a.id),balance);
});
test('All four finance looks are reversible preferences, independent of accounts and plans',()=>{
 const b=setup(),a=b.act('account',{name:'Nakit',type:'cash',opening:'2000'});
 b.act('plan',{name:'Netflix',accountId:a.id,categoryId:'expense-0',amount:'150',frequency:'monthly',start:'2026-11-01',auto:false});
 const accounts=structuredClone(b.state.accounts),plans=structuredClone(b.state.plans);
 for(const financeTheme of ['nero','modern','cards','premium-black','modern']){b.act('preferences',{financeTheme});assert.equal(b.view().preferences.financeTheme,financeTheme);assert.deepEqual(b.state.accounts,accounts);assert.deepEqual(b.state.plans,plans);assert.equal(b.state.transactions.length,0);}
});
test('Unknown finance themes reject preference changes and imported backups',()=>{
 const b=setup();b.act('preferences',{financeTheme:'premium-black'});assert.throws(()=>b.act('preferences',{financeTheme:'missing'}),/Finans teması/);assert.equal(b.state.preferences.financeTheme,'premium-black');
 const backup=b.export();backup.preferences.financeTheme='missing';assert.throws(()=>b.replace(backup),/Finans teması/);assert.equal(b.state.preferences.financeTheme,'premium-black');
});
