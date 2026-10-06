'use strict';
// Educational scenarios only; decimal inputs are converted and checked before calculation.
(function(root){
  const number=(value,min,max)=>{const n=Number(String(value).replace(',','.'));if(!Number.isFinite(n)||n<min||n>max)throw new Error('Değeri belirtilen aralıkta gir.');return n;};
  function calculate(kind,input){
    if(kind==='goal'){const target=number(input.target,0,1e10),saved=number(input.saved,0,1e10),months=number(input.months,1,1200);if(!Number.isInteger(months))throw new Error('Ay sayısı tam sayı olmalı.');return {monthly:Math.max(0,target-saved)/months,remaining:Math.max(0,target-saved)};}
    if(kind==='emergency'){const expense=number(input.expense,0,1e10),months=number(input.months,0,120);return {target:expense*months};}
    if(kind==='real'){const nominal=number(input.nominal,-99.99,1000),inflation=number(input.inflation,-99.99,1000);return {real:((1+nominal/100)/(1+inflation/100)-1)*100};}
    if(kind==='compound'){const initial=number(input.initial,0,1e10),monthly=number(input.monthly,0,1e8),years=number(input.years,1,50),annual=number(input.annual,-99,100);if(!Number.isInteger(years))throw new Error('Yıl sayısı tam sayı olmalı.');const rate=Math.pow(1+annual/100,1/12)-1;let total=initial;for(let i=0;i<years*12;i++)total=total*(1+rate)+monthly;const paid=initial+monthly*12*years;if(!Number.isFinite(total)||total>1e13)throw new Error('Bu senaryo gösterilebilir aralığı aşıyor.');return {total,paid,growth:total-paid};}
    throw new Error('Hesaplayıcı bulunamadı.');
  }
  const api={calculate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.NeroCalculators=api;
})(typeof window!=='undefined'?window:globalThis);
