// Scranton: approved source objects around the existing native controls and data.
(()=>{'use strict';const $=id=>document.getElementById(id),active=()=>document.documentElement.dataset.skin==='scranton';let mounted=false,state=null;const positions=new Map();
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const asset=n=>'nero-theme://scranton/assets/reference/'+n+'.png';
 function pic(n,cls){const i=el('img',undefined,'oc-only oc-art '+(cls||''));i.src=asset(n);i.alt='';i.setAttribute('aria-hidden','true');return i;}
 function move(n,parent,before=null){if(!n||n.parentNode===parent)return;if(!positions.has(n)){const marker=document.createComment('Office original');n.before(marker);positions.set(n,marker);}parent.insertBefore(n,before);}
 function restore(){for(const [n,m]of positions){if(m.parentNode){m.after(n);m.remove();}}positions.clear();}
 function box(id,parent,cls){let n=$(id);if(!n){n=el('div',undefined,'oc-only '+cls);n.id=id;parent.append(n);}return n;}
 function mount(){if(mounted)return;mounted=true;
  document.querySelector('.hello').append(el('p','Küçük bir iş. Sonra kahve.','oc-only oc-home-caption'));
  for(const button of document.querySelectorAll('.tabs [data-tab]'))if(['home','notes','todos','timer','badges','budget'].includes(button.dataset.tab))button.append(pic('nav-'+button.dataset.tab+'-cutout','oc-nav-icon'));
  document.querySelector('.week').append(pic('home-report-logo','oc-report-logo'),pic('home-report-clip','oc-report-clip'),pic('home-report-label','oc-report-label'));
  document.querySelector('.totals').append(pic('home-total-stamp','oc-total-stamp'),pic('home-total-title','oc-quarter-label'));
  document.querySelector('.moodboards').append(pic('home-legend-final','oc-mood-legend'));
  for(const [id,name]of [['q-focus','home-quick-clock-cutout'],['q-todo','home-quick-add'],['q-note','home-quick-note']])$(id).prepend(pic(name,'oc-quick-icon'));
  // The approved desk background already contains the single Dwight figurine.
  const lower=box('oc-home-lower',document.querySelector('.home-grid'),'oc-home-lower'),footer=box('oc-home-footer',document.querySelector('.home-grid'),'oc-home-footer');footer.append(pic('home-footer-live','oc-footer'));
  const notes=$('notes-list-view');notes.append(pic('notes-footer','oc-footer oc-notes-footer'));$('tv-composer').append(pic('note-composer-logo-clean','oc-composer-logo'),pic('note-composer-pen','oc-composer-pen'),pic('note-clip','oc-composer-clip'));
  const work=box('oc-whiteboard',$('view-todos'),'oc-whiteboard'),capture=box('oc-work-capture',work,'oc-work-capture');
  $('view-todos').append(pic('todos-footer','oc-footer oc-todo-footer'));
  const timer=box('oc-timer-body',$('view-timer'),'oc-timer-body'),setup=box('oc-timer-setup',timer,'oc-timer-setup');setup.append(el('p','Bu toplantı sessiz geçsin.','oc-timer-caption'));box('oc-timer-console',timer,'oc-timer-console');
  const label=el('p','Bugün listesinden iş seç','oc-only oc-task-caption'),duration=el('p','Süre seç (dakika)','oc-only oc-duration-caption');$('nf-timer-task').before(label);$('presets').before(duration);
  const custom=$('timer-custom').closest('label');custom?.prepend(el('span','Özel süre (dakika)','oc-only oc-custom-caption'));
  timer.append(pic('timer-sticky','oc-timer-sticky'),pic('timer-footer','oc-footer oc-timer-footer'));
  const next=box('oc-badge-next',$('view-badges'),'oc-badge-next');next.append(el('h3','Sıradaki rozet'),el('p','','oc-next-title'));
  const progress=el('div',undefined,'oc-next-progress');progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','Sıradaki rozet ilerlemesi');progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax','100');progress.append(el('i'),el('span'));next.append(progress);
  $('view-badges').append(pic('badges-footer','oc-footer oc-badge-footer'));
 }
 function assemble(){
  const lower=$('oc-home-lower'),footer=$('oc-home-footer');move(document.querySelector('.archive'),lower);move(document.querySelector('.quote'),lower);move($('st-days').closest('.tile'),footer);
  const read=[...document.querySelectorAll('.jar .nf-button')].find(b=>b.textContent==='Anıları oku');if(read){read.type='button';move(read,document.querySelector('.jar-form'));read.classList.add('oc-read-memories');}
  const legend=document.querySelector('.nf-mood-modes small');if(legend)move(legend,document.querySelector('.moodboards'));
  move($('mood-history-toggle'),document.querySelector('.moodboard-nav'));
  const capture=$('oc-work-capture');for(const n of [$('nf-plan'),$('nf-todo-filters'),$('todo-form')])move(n,capture);
  move(document.querySelector('#view-todos .list-card'),$('oc-whiteboard'));move(document.querySelector('.todo-footer'),$('oc-whiteboard'));
  document.querySelector('[data-tv-page=todos]').after($('oc-whiteboard'));
  const notes=$('notes-list-view');notes.append(document.querySelector('.oc-notes-footer'));move($('notes-archive'),notes,document.querySelector('.oc-notes-footer'));
  const body=$('oc-timer-body'),setup=$('oc-timer-setup');move(document.querySelector('[data-tv-page=timer] .tv-page-scene'),$('view-timer'),body);move(document.querySelector('[data-tv-page=timer] h2'),setup,setup.firstChild);move($('timer-setup'),setup);
  const console=$('oc-timer-console');for(const n of [document.querySelector('.dial'),document.querySelector('.lcd-bar'),document.querySelector('.timer-actions')])move(n,console);
  for(const n of [$('nf-sessions'),$('tv-timer-info')])move(n,body);
  body.append(setup,console,$('nf-sessions'),$('tv-timer-info'),document.querySelector('.oc-timer-sticky'),document.querySelector('.oc-timer-footer'));
 }
 function todos(){if(!active()||!mounted||!state)return;const root=$('todo-list'),headers=[...root.querySelectorAll('.nf-group')],items=[...root.querySelectorAll('[data-todo-id]')];root.replaceChildren();
  for(const key of ['today','later','done','older']){const matches=items.filter(row=>{const t=state.todos.find(t=>t.id===row.dataset.todoId);if(!t)return false;const finishedToday=new Date(t.doneAt).toDateString()===new Date().toDateString();return key==='done'?t.done&&finishedToday:key==='older'?t.done&&!finishedToday:!t.done&&(t.bucket||'today')===key;});if(!matches.length&&['done','older'].includes(key))continue;
   const page=el('li',undefined,'oc-work-page'),list=el('ul',undefined,'oc-work-rows');page.dataset.ocBucket=key;if(['today','later'].includes(key)){page.classList.add('nf-dropzone');page.dataset.bucket=key;}
   const title={today:'Bugün',later:'Sonra',done:'Bugün tamamlananlar',older:'Önceki günlerde tamamlananlar'}[key];let heading=headers.find(n=>n.querySelector('strong')?.textContent===title);if(!heading){heading=el('li',undefined,'nf-group');heading.append(el('strong',title));}list.append(heading,...matches);
   if(!matches.some(n=>!n.hidden)&&['today','later'].includes(key))list.append(el('li',key==='today'?'Bugün için sırada iş yok.':'Sonraya bıraktığın işler burada.','oc-empty-work'));
   for(const row of matches){row.dataset.ocBucket=key;const t=state.todos.find(t=>t.id===row.dataset.todoId),meta=row.querySelector('.nf-task-meta');if(meta){row.querySelector('.todo-text')?.after(meta);meta.replaceChildren();for(const label of window.NeroTaskLabels.entries(t)){const chip=el('span',label.text,'nf-label');chip.dataset.labelKind=label.kind;meta.append(chip);}if(t.subtasks?.length)meta.append(el('span',`${t.subtasks.filter(x=>x.done).length}/${t.subtasks.length} adım`));}}
   page.append(list);root.append(page);
  }
 }
 function notes(){$('notes-list').dataset.ocNotesCount=String(state.notes.filter(n=>!n.archivedAt).length);for(const [i,card]of [...$('notes-list').querySelectorAll('[data-tv-note]')].entries()){card.classList.remove('tv-wide-note');if(!card.querySelector('.oc-note-pin'))card.append(pic(i%2?'note-pin-grey':'note-pin-red','oc-note-pin'));}}
 function sessions(){const root=$('nf-sessions'),today=new Date().toLocaleDateString('en-CA'),items=(state.productivity?.sessions||[]).filter(s=>s.day===today);if(items.length&&!root.querySelector('.oc-session-head')){const head=el('div',undefined,'oc-only oc-session-head');for(const word of ['İş','Süre','Durum','Saat'])head.append(el('span',word));root.querySelector('h3').after(head);}for(const [i,row]of [...root.querySelectorAll('.nf-session')].entries()){row.dataset.ocStatus=items[i]?.status||'';if(items[i]?.startedAt&&!row.querySelector('time')){const time=el('time',new Date(items[i].startedAt).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}));time.dateTime=new Date(items[i].startedAt).toISOString();row.append(time);}}}
 function bars(){const root=$('week-bars'),max=Math.max(120,Math.ceil(Math.max(0,...[...root.children].map(n=>Number(n.dataset.focus)||0))/30)*30),height=root.clientHeight;for(const n of root.children){const value=Number(n.dataset.focus)||0,fill=n.querySelector('i');if(fill){const pixels=Math.round(value/max*height);fill.style.height=pixels+'px';fill.style.borderWidth='0';n.style.setProperty('--oc-bar-height',pixels+'px');}let label=n.querySelector('.oc-bar-value');if(!label){label=el('small','','oc-only oc-bar-value');n.append(label);}label.textContent=value>=60?Math.floor(value/60)+' sa'+(value%60?' '+value%60+' dk':''):value+' dk';}let axis=$('oc-week-axis');if(!axis){axis=el('div',undefined,'oc-only oc-week-axis');axis.id='oc-week-axis';root.before(axis);}axis.replaceChildren();for(let i=0;i<5;i++)axis.append(el('span',Math.round(max*(4-i)/4)+' dk'));}
 function badges(){if(!active()||!mounted||!state)return;const names=['badge-trophy-cutout','badge-certificate-cutout','badge-best-mug-cutout','badge-in-tray-cutout','badge-dwight-cutout'];for(const [i,card]of [...$('badge-grid').children].entries()){const a=state.achievements.find(a=>a.id===card.dataset.badgeId),icon=card.querySelector('.badge-icon');if(!a||!icon)continue;icon.replaceChildren(pic(names[i%names.length],'oc-badge-prop'));card.querySelector('.badge-desc').textContent=a.unlockedAt?(a.completedDesc||a.desc):a.desc;let caption=card.querySelector('.oc-badge-caption');if(!caption){caption=el('div',undefined,'oc-badge-caption');caption.append(card.querySelector('.badge-name'),card.querySelector('.badge-desc'));card.append(caption);}if(a.unlockedAt&&!card.querySelector('.oc-badge-date'))caption.append(el('time',new Date(a.unlockedAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short'}),'oc-badge-date'));}
  const pending=state.achievements.filter(a=>!a.unlockedAt&&a.rarity!=='gizli'&&typeof a.progress==='number').sort((a,b)=>b.progress-a.progress)[0],box=$('oc-badge-next');box.hidden=!pending;if(pending){box.querySelector('.oc-next-title').textContent=pending.title;const value=Math.round(Math.min(1,Math.max(0,pending.progress))*100),bar=box.querySelector('.oc-next-progress');bar.setAttribute('aria-valuenow',String(value));bar.querySelector('i').style.width=value+'%';bar.querySelector('span').textContent=Number.isFinite(pending.progressTarget)?pending.progressCurrent+' / '+pending.progressTarget:value+'%';}
 }
 function timer(t){if(!active()||!mounted)return;$('timer-digits').style.setProperty('--oc-digits',$('timer-digits').textContent.length>5?'7cqw':'10cqw');$('oc-timer-setup').classList.toggle('oc-running',t.status!=='idle');}
 function home(){if(!active()||!mounted||!state)return;
  for(const [i,n]of [...$('desk-grid').children].entries())n.dataset.ocDeskIndex=String(i+1);
  for(const calendar of document.querySelectorAll('.mood-calendar')){const days=[...calendar.querySelectorAll('.mood-day')];const first=days[0]?.dataset.date;const offset=first?(new Date(first+'T12:00:00').getDay()+6)%7:0;calendar.style.setProperty('--oc-date-rows',Math.max(5,Math.ceil((offset+days.length)/7)));}
  const rows=[$('archive-list'),$('archive-more-list')].flatMap(list=>[...list.children]);
  for(const [i,row]of rows.entries()){const item=state.home?.archive?.recent?.[i];if(!item)continue;row.replaceChildren(el('span',item.text,'oc-archive-text'));if(item.doneAt){const time=el('time',new Date(item.doneAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short'}));time.dateTime=new Date(item.doneAt).toISOString();row.append(time);}}
 }
 function update(next){state=next;if(!active()){if(mounted)restore();return;}mount();assemble();notes();todos();sessions();bars();badges();timer(next.timer);$('st-today-focus').textContent=(next.stats?.today?.focus||0)+' dk';const focus=$('tv-timer-info').querySelector('strong');if(focus)focus.textContent=(next.stats?.today?.focus||0)+' dk';home();}
 function leave(next){if(next!=='scranton')restore();}
 window.addEventListener('resize',()=>{if(active()&&mounted)bars();});window.NeroOfficeFidelity={update,leave,timer,todos,badges,home};
})();
