'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {smooth,series,segments,inBase}=require('../src/renderer/panel/budget-premium-charts');
test('Smooth curves interpolate every recorded sample and never overshoot adjacent values',()=>{
 const points=[{x:10,y:110},{x:78,y:22},{x:146,y:70},{x:214,y:16},{x:282,y:90},{x:350,y:30}],path=smooth(points);
 assert.equal(path.split(' C').length-1,points.length-1);
 const curves=path.split(' C').slice(1).map(s=>s.split(/[ ,]+/).map(Number));
 curves.forEach(([x1,y1,x2,y2,x3,y3],i)=>{
  assert.equal(x3,points[i+1].x);assert.equal(y3,points[i+1].y);
  for(let j=0;j<=100;j++){const t=j/100,u=1-t,y=u*u*u*points[i].y+3*u*u*t*y1+3*u*t*t*y2+t*t*t*y3;assert.ok(y>=Math.min(points[i].y,y3)-.001&&y<=Math.max(points[i].y,y3)+.001);}
 });
});
test('Empty, constant, one sample and refund series have truthful, finite geometry',()=>{
 assert.equal(smooth([]),'');assert.equal(smooth([{x:10,y:0}]),'M10,0');
 for(const rows of [[],[{month:'2026-01',income:0,netExpense:0}],[{income:100,netExpense:-30},{income:100,netExpense:0}]]){
  const chart=series(rows);assert.ok(Number.isFinite(chart.zero));for(const line of chart.lines){assert.ok(!/NaN|Infinity/.test(line.path));line.points.forEach(p=>assert.ok(p.y>=16&&p.y<=116));}
 }
 assert.equal(series([{income:0,netExpense:0}]).lines[0].points[0].y,116);
});
test('Rounded segments preserve positive amounts, proportions and visible gaps',()=>{
 const result=segments([320000,180000,0,-100]);assert.equal(result.total,500000);assert.equal(result.arcs.length,2);assert.equal(result.arcs[0].share,.64);
 const a=result.arcs;assert.ok(a[1].start-a[0].end>=18);assert.ok(a[0].start+360-a[1].end>=18);
 assert.ok(Math.abs((a[0].end-a[0].start)/(a[1].end-a[1].start)-320/180)<1e-8);
 assert.deepEqual(segments([0,-5]),{total:0,arcs:[]});
});
test('Savings totals use integer exchange rates, symmetric rounding and missing-rate exclusions',()=>{
 assert.equal(inBase(100,'TRY','TRY',{}),100);assert.equal(inBase(101,'USD','TRY',{USD:1550000}),157);
 assert.equal(inBase(-101,'USD','TRY',{USD:1550000}),-157);assert.equal(inBase(100,'USD','TRY',{}),null);
 assert.equal(inBase(100,'USD','TRY',{USD:0}),null);
});
