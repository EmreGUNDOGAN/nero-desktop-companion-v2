'use strict';
// Civil dates are deliberately calculated without elapsed-hour/DST arithmetic.
module.exports = function installFinance(Budget, {dateKey, validDate, shiftMonth, converted, money, nextDate}) {
  const check=(ok,msg)=>{if(!ok)throw new Error(msg);};
  const addDays=(s,n)=>{const d=new Date(s+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return d.toISOString().slice(0,10);};
  const last=m=>addDays(shiftMonth(m+'-01',1),-1);
  const baseView=Budget.prototype.view, baseValidate=Budget.prototype.validate;
  Budget.prototype.validate=function(s){
    baseValidate.call(this,s);
    if(s.preferences?.financeTheme!==undefined)check(['modern','nero','cards','premium-black','financial-dashboard'].includes(s.preferences.financeTheme),'Finans teması geçersiz.');
    if(s.notifications){const n=s.notifications;check(typeof n.enabled==='boolean'&&Array.isArray(n.days)&&n.days.every(d=>[0,1,7].includes(d))&&new Set(n.days).size===n.days.length&&/^([01]\d|2[0-3]):[0-5]\d$/.test(n.time),'Bildirim ayarları geçersiz.');}
    for(const p of s.plans){if(p.auto!==undefined)check(typeof p.auto==='boolean','Otomatik kayıt ayarı geçersiz.');if(p.manualOverrides)check(Array.isArray(p.manualOverrides)&&p.manualOverrides.every(d=>validDate(d)),'Ödeme geri alma kaydı geçersiz.');if(p.revisions)check(Array.isArray(p.revisions)&&p.revisions.every(r=>validDate(r.effective)&&Number.isSafeInteger(r.amount)&&r.amount>0&&r.amount<=1000000000000),'Plan tutar geçmişi geçersiz.');if(p.purchaseId)check(s.transactions.some(t=>t.id===p.purchaseId&&t.type==='expense'),'Taksitli alışveriş kaydı eksik.');}
    if(s.learning?.answers){
      check(typeof s.learning.answers==='object'&&!Array.isArray(s.learning.answers),'Eğitim cevapları geçersiz.');
      const h=require('../renderer/panel/budget-handbook');
      for(const [id,a] of Object.entries(s.learning.answers)){const c=h.chapters.find(c=>c.id===id);check(c&&a&&Number.isInteger(a.answer)&&a.answer>=0&&a.answer<c.quiz.options.length&&a.correct===(a.answer===c.quiz.correct),'Eğitim cevabı geçersiz.');}
    }
    return true;
  };
  Budget.prototype.notificationSettings=function(input){
    const settings={enabled:!!input.enabled,days:[...new Set((input.days||[]).map(Number))].sort((a,b)=>b-a),time:String(input.time||'09:00')};
    this.validate({...this.state,notifications:settings});this.state.notifications=settings;this.save('notifications.set','budget');
  };
  Budget.prototype.unpay=function(input){
    const t=this.state.transactions.find(t=>t.planId===input.planId&&t.occurrence===input.occurrence);check(t,'Geri alınacak ödeme bulunamadı.');
    const p=this.state.plans.find(p=>p.id===t.planId);check(p,'Ödeme planı bulunamadı.');
    this.remove(t.id);p.manualOverrides=[...new Set([...(p.manualOverrides||[]),t.occurrence])];
    // An undone automatic payment waits for a deliberate manual confirmation.
    this.save('plan.unpay',t.id);
  };
  Budget.prototype.autoPost=function(today=dateKey()){
    validDate(today);if(!this.state.plans.some(p=>p.auto&&!p.paused&&p.start<=today))return {posted:0,errors:[]};
    const before=this.export(),results=[],errors=[];
    try{
      for(const p of this.state.plans.filter(p=>p.auto&&!p.paused)){
        if(this.getAccount(p.accountId,true).archived||(p.toAccountId&&this.getAccount(p.toAccountId,true).archived))continue;
        // A bounded batch prevents a mistakenly ancient daily schedule blocking the app.
        const due=this.occurrences(p.start,today).filter(o=>o.planId===p.id&&!(p.manualOverrides||[]).includes(o.date)).slice(0,250);
        for(const o of due){try{results.push(this.act('pay',{planId:p.id,occurrence:o.date,date:o.date,rate:String(o.rate/1000000)}));}catch(e){errors.push({planId:p.id,message:e.message});break;}}
      }
      return {posted:results.length,errors};
    }catch(e){this.state=before;this.store.set(this.state);throw e;}
  };
  Budget.prototype.installmentDetails=function(today=dateKey()){
    return this.state.plans.filter(p=>p.count).map(p=>{
      const recorded=this.state.transactions.filter(t=>t.planId===p.id),paid=recorded.filter(t=>t.date<=today),paidAmount=paid.reduce((n,t)=>n+t.amount,0);
      const all=Array.from({length:p.count},(_,i)=>({index:i+1,date:nextDate(p,i),amount:Math.floor(p.amount/p.count)+(i<p.amount%p.count?1:0)}));
      return {...p,currency:this.getAccount(p.accountId,true).currency,paidAmount,remaining:Math.max(0,p.amount-paidAmount),paidCount:paid.length,remainingCount:p.count-paid.length,
        next:all.find(o=>!paid.some(t=>t.occurrence===o.date)&&!p.skipped.includes(o.date))||null,
        rows:all.map(o=>({...o,transaction:recorded.find(t=>t.occurrence===o.date)||null,skipped:p.skipped.includes(o.date)}))};
    });
  };
  Budget.prototype.cardStatement=function(a,today){
    if(a.type!=='credit')return null;
    const cut=shiftMonth(today.slice(0,7)+'-01',0,a.cutDay),latest=today>=cut?cut:shiftMonth(cut,-1,a.cutDay),start=addDays(shiftMonth(latest,-1,a.cutDay),1);
    let due=shiftMonth(latest,0,a.dueDay);if(due<=latest)due=shiftMonth(latest,1,a.dueDay);
    const installments=this.installmentDetails(today).filter(p=>p.toAccountId===a.id),purchases=new Set(installments.map(p=>p.purchaseId));
    const billed=this.state.transactions.filter(t=>t.accountId===a.id&&t.date>=start&&t.date<=latest&&!purchases.has(t.id)).reduce((n,t)=>n+(t.type==='expense'?t.amount:t.type==='refund'?-t.amount:0),0);
    const installmentDue=installments.flatMap(p=>p.rows).filter(o=>o.date>latest&&o.date<=due&&!o.transaction&&!o.skipped).reduce((n,o)=>n+o.amount,0);
    const scheduledIds=new Set(installments.map(p=>p.id));
    const payments=this.state.transactions.filter(t=>t.type==='transfer'&&t.toAccountId===a.id&&t.date>latest&&t.date<=today&&!scheduledIds.has(t.planId)).reduce((n,t)=>n+t.toAmount,0);
    return {cut:latest,due,billed,installmentDue,estimatedDue:Math.max(0,billed-payments)+installmentDue,debt:Math.max(0,-this.accountBalance(a.id,today)),available:Math.max(0,a.limit+this.accountBalance(a.id,today))};
  };
  Budget.prototype.cashFlow=function(month,today=dateKey()){
    const end=last(month),due=this.occurrences(month+'-01',end),inBase=(n,c,r)=>converted(n,r||this.state.rates[c]);
    let available=0,reserved=0;for(const a of this.state.accounts.filter(a=>a.type!=='credit'&&!a.archived))if(this.state.rates[a.currency]){available+=inBase(this.accountBalance(a.id,today),a.currency);reserved+=inBase(this.state.goals.filter(g=>g.accountId===a.id&&!g.archived).reduce((n,g)=>n+g.contributions.reduce((v,c)=>v+c.amount,0),0),a.currency);}
    let expected=0,payable=0;for(const o of due){const a=this.getAccount(o.accountId,true);if(a.archived||!this.state.rates[a.currency])continue;
      if(o.type==='income'&&a.type!=='credit')expected+=inBase(o.amount,a.currency,o.rate);
      if(o.type==='expense'&&a.type!=='credit'||o.type==='transfer'&&a.type!=='credit'&&this.getAccount(o.toAccountId,true).type==='credit')payable+=inBase(o.amount,a.currency,o.rate);
    }
    for(const t of this.state.transactions.filter(t=>t.date>today&&t.date.startsWith(month))){
      const a=this.getAccount(t.accountId,true);if(a.archived)continue;
      if(t.type==='income'&&a.type!=='credit')expected+=t.baseAmount;
      if(t.type==='expense'&&a.type!=='credit'||t.type==='transfer'&&a.type!=='credit'&&this.getAccount(t.toAccountId,true).type==='credit')payable+=t.baseAmount;
    }
    // Transfers between cash/bank accounts never count as income or spending.
    const tx=this.state.transactions.filter(t=>t.date.startsWith(month)&&t.date<=today);
    const cashOut=tx.reduce((n,t)=>{const a=this.getAccount(t.accountId,true);return n+((t.type==='expense'&&a.type!=='credit'||t.type==='transfer'&&a.type!=='credit'&&this.getAccount(t.toAccountId,true).type==='credit')?t.baseAmount:0);},0);
    const installmentDebt=this.installmentDetails(today).reduce((n,p)=>n+(this.state.rates[p.currency]?inBase(p.remaining,p.currency):0),0);
    return {available,reserved,expected,payable,afterPayments:available-payable,installmentDebt,cashOut};
  };
  Budget.prototype.view=function(month){const v=baseView.call(this,month),current=v.today.slice(0,7),end=last(shiftMonth(current+'-01',1).slice(0,7));
    v.upcoming=this.occurrences(current+'-01',end);
    // Older unpaid obligations remain visible separately, never labelled upcoming.
    v.overdue=this.occurrences(this.state.plans.reduce((d,p)=>p.start<d?p.start:d,v.today),addDays(current+'-01',-1));
    v.installments=this.installmentDetails(v.today);v.cashFlow=this.cashFlow(v.month,v.today);
    const previous=shiftMonth(v.month+'-01',-1).slice(0,7),until=m=>last(m)<v.today?last(m):v.today;
    v.summary=this.summary(v.month+'-01',until(v.month));v.previous=this.summary(previous+'-01',until(previous));
    v.trend=v.trend.map(t=>({...t,...this.summary(t.month+'-01',until(t.month))}));
    v.notifications=this.state.notifications||{enabled:true,days:[7,1,0],time:'09:00'};
    v.learning={answers:{},last:null,...v.learning};
    v.calendar=this.occurrences(v.month+'-01',last(v.month));return v;
  };
  Budget.prototype.reminders=function(today=dateKey(),at=new Date()){
    validDate(today);const n=this.state.notifications||{enabled:true,days:[7,1,0],time:'09:00'},clock=String(at.getHours()).padStart(2,'0')+':'+String(at.getMinutes()).padStart(2,'0');
    if(!n.enabled||clock<n.time)return [];
    const out=[];for(const lead of n.days){const target=addDays(today,lead);
      for(const o of this.occurrences(target,target))out.push({...o,lead,kind:'plan',key:o.planId+':'+o.date+':'+lead});
      for(const c of this.cardDates(target.slice(0,7),today))if(c.remind&&c.date===target&&c.debt>0)out.push({...c,lead,kind:'card',key:'card:'+c.id+':'+target+':'+lead});
    }
    const fresh=out.filter(o=>!this.state.notified.includes(o.key)&&!(o.lead===0&&this.state.notified.includes(o.kind==='card'?'card:'+o.id+':'+today:o.planId+':'+today)));
    if(fresh.length){this.state.notified.push(...fresh.map(o=>o.key));this.state.notified=this.state.notified.slice(-2000);this.store.set(this.state);}return fresh;
  };
  Budget.prototype.revisePlan=function(input){
    const p=this.state.plans.find(p=>p.id===input.id);check(p&&!p.count,'Abonelik veya düzenli gelir seç.');const amount=money(input.amount);check(amount>0,'Tutar sıfırdan büyük olmalı.');
    const effective=validDate(input.effective||dateKey());
    check(!this.state.transactions.some(t=>t.planId===p.id&&t.occurrence>=effective),'Kaydedilmiş dönemi değiştirmek yerine daha sonraki bir başlangıç seç.');
    p.revisions=(p.revisions||[]).filter(r=>r.effective!==effective);p.revisions.push({effective,amount});p.revisions.sort((a,b)=>a.effective.localeCompare(b.effective));
    if(input.auto!==undefined)p.auto=!!input.auto;this.save('plan.revise',p.id);
  };
  const baseOccurrences=Budget.prototype.occurrences;
  Budget.prototype.occurrences=function(from,to){return baseOccurrences.call(this,from,to).map(o=>{const p=this.state.plans.find(p=>p.id===o.planId),revision=(p.revisions||[]).filter(r=>r.effective<=o.date).at(-1);return revision?{...o,amount:revision.amount,toAmount:p.type==='transfer'&&p.toAmount===p.amount?revision.amount:o.toAmount}:o;});};
  Budget.prototype.scheduleTransaction=function(input){
    check(['income','expense'].includes(input.type),'Gelir veya gider seç.');
    const draft=this.buildTransaction(input);
    check(draft.splits.length===1,'Düzenli işlemlerde tek kategori seç.');
    const planned=input.status==='planned',repeat=!!input.repeat,frequency=repeat?input.frequency||'monthly':'once';
    check(planned||repeat,'Beklenen veya tekrarlayan işlem seç.');
    const p=this.plan({name:input.payee||input.note|| (input.type==='income'?'Düzenli gelir':'Düzenli gider'),type:input.type,accountId:input.accountId,categoryId:draft.splits[0].categoryId,amount:input.amount,rate:input.rate,start:input.date,frequency,auto:!!input.auto,brandId:input.brandId});
    if(!planned){const t=this.pay({planId:p.id,occurrence:input.date,date:input.date});t.payee=draft.payee;t.tags=draft.tags;t.note=draft.note;t.brandId=draft.brandId;this.save('schedule.first',p.id);}
    return p;
  };
  Budget.prototype.quiz=function(input){const h=require('../renderer/panel/budget-handbook'),c=h.chapters.find(c=>c.id===input.id);check(c&&c.quiz&&Number.isInteger(Number(input.answer))&&Number(input.answer)>=0&&Number(input.answer)<c.quiz.options.length,'Cevap geçersiz.');this.state.learning.answers={...this.state.learning.answers,[c.id]:{answer:Number(input.answer),correct:Number(input.answer)===c.quiz.correct}};this.save('learning.answer',c.id);}
};
