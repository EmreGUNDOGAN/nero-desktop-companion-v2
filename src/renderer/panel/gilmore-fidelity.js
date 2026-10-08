// Single-theme assembly from individually documented approved-source assets.
// Native state, inputs, event handlers, autosave and drag targets remain intact.
(()=>{'use strict';
 const $=id=>document.getElementById(id),active=()=>document.documentElement.dataset.skin==='stars-hollow';
 let mounted=false,state=null;const positions=new Map();
 const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const asset=name=>'nero-theme://stars-hollow/assets/reference/'+name+'.png';
 function move(n,parent,before=null){if(!n||n.parentNode===parent)return;if(!positions.has(n)){const marker=document.createComment('Gilmore original');n.before(marker);positions.set(n,marker);}parent.insertBefore(n,before);}
 function picture(name,cls){const img=el('img',undefined,'gg-only gg-art '+(cls||''));img.src=asset(name);img.alt='';img.setAttribute('aria-hidden','true');return img;}
 function restore(){for(const [n,marker]of positions){if(marker.parentNode){marker.after(n);marker.remove();}}positions.clear();}
 function stage(id,parent,cls){let n=$(id);if(!n){n=el('div',undefined,'gg-only '+cls);n.id=id;parent.append(n);}return n;}
 function mount(){if(mounted)return;mounted=true;
  const timer=$('view-timer'),body=stage('gg-timer-body',timer,'gg-timer-body'),setup=stage('gg-timer-paper',body,'gg-timer-paper');
  setup.append(el('p','Kahven hazır. Bir küçük adım daha.','gg-only gg-timer-subtitle'));
  setup.append(picture('coffee-icon','gg-paper-cup gg-paper-cup-left'),picture('coffee-icon','gg-paper-cup gg-paper-cup-right'));
  body.append(picture('timer-receipt','gg-receipt'),picture('timer-sugar-left','gg-sugar'),picture('timer-napkin-right','gg-napkins'));
  stage('gg-timer-stat-papers',body,'gg-timer-stat-papers');
  body.append(picture('timer-footer','gg-footer gg-timer-footer'));
  const custom=el('details',undefined,'gg-only gg-custom');custom.id='gg-custom';custom.append(el('summary','Özel ⌄'));$('presets').append(custom);
  const todoCapture=stage('gg-todo-capture',$('view-todos'),'gg-todo-capture');
  todoCapture.append(el('p','Küçük işleri sıraya koyalım.','gg-todo-caption'));
  const notesFooter=stage('gg-notes-footer',$('notes-list-view'),'gg-notes-footer');notesFooter.append(picture('notes-footer','gg-footer'));
  $('view-todos').append(picture('todos-footer','gg-footer gg-todo-footer'));
  $('view-badges').append(picture('badges-footer','gg-footer gg-badge-footer'));
  const nextBadge=stage('gg-badge-next',$('view-badges'),'gg-badge-next');nextBadge.append(el('h3','Sıradaki hatıra'),picture('home-archive-photo','gg-next-badge-photo'),el('p','','gg-next-badge-title'));
  const progress=el('div',undefined,'gg-next-badge-progress');progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','Sıradaki rozet ilerlemesi');progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax','100');progress.append(el('i'),el('span'));nextBadge.append(progress);
  nextBadge.append(picture('badge-festival-ticket','gg-festival-ticket'),picture('badge-coffee-card','gg-coffee-card'));
  const intro=el('p','Bir kahve, küçük bir adım.','gg-only gg-home-caption');document.querySelector('.hello').append(intro);
  document.querySelector('.totals').append(picture('gazebo-photo','gg-gazebo-photo'));
  document.querySelector('.archive').append(picture('home-archive-photo','gg-archive-photo'));
  document.querySelector('.desk').append(picture('home-desk-snowglobe','gg-snowglobe'));
  const footer=stage('gg-home-footer',document.querySelector('.home-grid'),'gg-home-footer');footer.append(picture('home-footer-live','gg-footer'));
  document.querySelector('.moodboards').append(picture('home-calendar-yale','gg-calendar-ribbon'));
  for(const button of document.querySelectorAll('.tabs [data-tab]')){if(['home','notes','todos','timer','badges','budget'].includes(button.dataset.tab))button.append(picture('nav-'+button.dataset.tab+'-cutout','gg-nav-icon'));}
  const summary=el('header',undefined,'gg-only gg-badge-summary');summary.id='gg-badge-summary';summary.append(el('h2','Rozetler'),el('p','Küçük adımların hatıraları.'),picture('badge-header-gazebo','gg-badge-gazebo'));
  document.querySelector('.badges').prepend(summary);
 }
 function assemble(){
  const body=$('gg-timer-body'),setup=$('gg-timer-paper');
  move(document.querySelector('[data-tv-page=timer] .tv-page-scene'),$('view-timer'),body);
  move(document.querySelector('[data-tv-page=timer] h2'),setup,setup.firstChild);
  move($('timer-setup'),setup);move(document.querySelector('.dial'),body);
  move(document.querySelector('.lcd-bar'),body);move(document.querySelector('.timer-actions'),body);
  move($('nf-sessions'),body);move($('tv-timer-info'),$('gg-timer-stat-papers'));
  body.append(setup,document.querySelector('.dial'),document.querySelector('.lcd-bar'),document.querySelector('.timer-actions'),$('nf-sessions'),$('gg-timer-stat-papers'),body.querySelector('.gg-timer-footer'));
  move(document.querySelector('#presets .custom'),$('gg-custom'));
  const capture=$('gg-todo-capture');move($('nf-plan'),capture);move($('nf-todo-filters'),capture);move($('todo-form'),capture);
  document.querySelector('[data-tv-page=todos]').after(capture);
  const notes=$('notes-list-view');move($('notes-archive'),notes,$('tv-composer'));move($('gg-notes-footer'),notes);
  const read=[...document.querySelectorAll('.jar .nf-button')].find(b=>b.textContent==='Anıları oku');
  if(read){read.type='button';move(read,document.querySelector('.jar-form'));read.classList.add('gg-read-memories');}
  document.querySelector('.tv-jar').src=asset('home-memory-jar-cutout');
  $('view-badges').append($('gg-badge-next'),document.querySelector('.gg-badge-footer'));document.querySelector('.gg-badge-footer').src=asset('badges-footer-decor');
  move($('badge-count').closest('.card-head'),$('gg-badge-summary'));move($('badge-rarity-tabs'),$('gg-badge-summary'));
  move(document.querySelector('.quote'),$('gg-home-footer'));move($('st-days').closest('.tile'),$('gg-home-footer'));
  const legend=document.querySelector('.nf-mood-modes small');if(legend)move(legend,document.querySelector('.moodboards'));
 }
 function notes(){
  for(const card of $('notes-list').querySelectorAll('[data-tv-note]')){
   const n=state.notes.find(n=>n.id===card.dataset.tvNote);if(!n)continue;
   card.classList.toggle('gg-selected-note',card.dataset.tvNote===document.querySelector('#notes-list .gg-selected-note')?.dataset.tvNote);
   if(!card.querySelector('.gg-card-clip')&&(n.pinned||card.classList.contains('tv-wide-note')))card.append(picture('note-clip-cutout','gg-card-clip'));
   if(card.classList.contains('tv-wide-note')&&!card.querySelector('.gg-library-stamp')){
    const stamp=el('span',undefined,'gg-only gg-library-stamp');stamp.append(picture('yale-stamp-live'));
    const date=el('time',new Date(n.updatedAt||n.createdAt).toLocaleDateString('en-US',{month:'short',day:'2-digit',year:'numeric'}).toUpperCase());date.dateTime=new Date(n.updatedAt||n.createdAt).toISOString();stamp.append(date);card.append(stamp);
   }
  }
 }
 function todos(){
  if(!active()||!mounted||!state)return;
  const rows=$('todo-list');let bucket='today';
  const original=[...rows.querySelectorAll('[data-todo-id],.nf-group')];
  for(const row of original){
   if(row.classList.contains('nf-group')){const name=row.querySelector('strong')?.textContent||'';bucket=name==='Sonra'?'later':name.startsWith('Önceki')?'older':name.includes('tamamlanan')?'done':'today';row.dataset.ggBucket=bucket;continue;}
   if(!row.dataset.todoId)continue;const t=state.todos.find(t=>t.id===row.dataset.todoId);if(!t)continue;
   row.dataset.ggBucket=t.done?(new Date(t.doneAt).toDateString()===new Date().toDateString()?'done':'older'):t.bucket||'today';
   const meta=row.querySelector('.nf-task-meta');if(meta){meta.replaceChildren();for(const label of window.NeroTaskLabels.entries(t)){const chip=el('span',label.text,'nf-label');chip.dataset.labelKind=label.kind;meta.append(chip);}if(t.subtasks?.length)meta.append(el('span',`${t.subtasks.filter(x=>x.done).length}/${t.subtasks.length} adım`));}
  }
  const headers=original.filter(n=>n.classList.contains('nf-group')),items=original.filter(n=>n.dataset.todoId);
  rows.replaceChildren();
  for(const key of ['today','later']){
   const page=el('li',undefined,'gg-work-page nf-dropzone');page.dataset.ggPaper=key;page.dataset.bucket=key;
   const list=el('ul',undefined,'gg-work-rows');
   let heading=headers.find(n=>n.dataset.ggBucket===key);if(!heading){heading=el('li',undefined,'nf-group');heading.dataset.ggBucket=key;heading.append(el('strong',key==='today'?'Bugün':'Sonra'));}
   list.append(heading,...items.filter(n=>n.dataset.ggBucket===key));
   if(!items.some(n=>n.dataset.ggBucket===key&&!n.hidden))list.append(el('li',key==='today'?'Bugün için sırada iş yok.':'Sonraya bıraktığın işler burada.','gg-empty-work'));
   if(key==='today')for(const h of headers.filter(n=>['done','older'].includes(n.dataset.ggBucket)))list.append(h,...items.filter(n=>n.dataset.ggBucket===h.dataset.ggBucket));
   page.append(list);rows.append(page);
  }
 }
 function sessions(){
  const root=$('nf-sessions');if(!root)return;
  const date=new Date().toLocaleDateString('en-CA'),items=(state.productivity?.sessions||[]).filter(s=>s.day===date);
  if(items.length&&!root.querySelector('.gg-session-columns')){const h=el('div',undefined,'gg-only gg-session-columns');for(const text of ['İş','Süre','Durum','Saat'])h.append(el('span',text));root.querySelector('h3').after(h);}
  [...root.querySelectorAll('.nf-session')].forEach((row,i)=>{if(!row.querySelector('time')&&items[i]?.startedAt){const tm=el('time',new Date(items[i].startedAt).toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'}));tm.dateTime=new Date(items[i].startedAt).toISOString();row.append(tm);}row.dataset.ggStatus=items[i]?.status||'';});
 }
 function stats(){
  const info=$('tv-timer-info');if(!info)return;const children=[...info.children];if(children.length!==4||children[0].classList.contains('gg-stat-paper'))return;
  const first=el('div',undefined,'gg-stat-paper'),second=el('div',undefined,'gg-stat-paper');first.append(children[0],children[1]);second.append(children[2],children[3]);info.replaceChildren(first,second);
 }
 function bars(){
  const root=$('week-bars');if(!root)return;const height=Math.max(70,Math.min(138,root.clientWidth*.19));
  const max=Math.max(30,...[...root.children].map(n=>Number(n.dataset.focus)||0));
  for(const n of root.children){const fill=n.querySelector('i');if(fill){const focus=Number(n.dataset.focus)||0;fill.style.height=Math.round(focus/max*height)+'px';fill.style.borderWidth=focus?'1px':'0';}}
  let axis=document.getElementById('gg-week-axis');if(!axis){axis=el('div',undefined,'gg-only gg-week-axis');axis.id='gg-week-axis';root.before(axis);}axis.replaceChildren();for(let i=0;i<4;i++)axis.append(el('span',String(Math.round(max*(3-i)/3))));
 }
 function badges(){if(!active()||!mounted)return;
  const names=['badge-cup-cutout','badge-library-tag-cutout','badge-dragonfly-tag-cutout','badge-gazebo-photo-cutout','badge-cassette-cutout','badge-signpost-sketch-cutout','badge-books-sketch-cutout','badge-headphones-sketch-cutout','badge-road-sketch-cutout'];
  [...$('badge-grid').children].forEach((card,i)=>{const icon=card.querySelector('.badge-icon');if(!icon)return;icon.replaceChildren(picture(names[i%names.length],'gg-badge-object'));card.dataset.ggObject=String(i%names.length);const a=state?.achievements.find(a=>a.id===card.dataset.badgeId);if(a){card.querySelector('.badge-desc').textContent=a.unlockedAt?(a.completedDesc||a.desc):a.desc;if(a.unlockedAt&&!card.querySelector('.gg-badge-date')){const date=el('time',new Date(a.unlockedAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short'}),'gg-badge-date');date.dateTime=new Date(a.unlockedAt).toISOString();card.append(date);}}});
  const pending=(state?.achievements||[]).filter(a=>!a.unlockedAt&&a.rarity!=='gizli'&&typeof a.progress==='number').sort((a,b)=>b.progress-a.progress)[0];const box=$('gg-badge-next');box.hidden=!pending;if(pending){box.querySelector('.gg-next-badge-title').textContent=pending.title;const p=Math.round(Math.max(0,Math.min(1,pending.progress))*100),bar=box.querySelector('.gg-next-badge-progress');bar.setAttribute('aria-valuenow',String(p));bar.querySelector('i').style.width=p+'%';bar.querySelector('span').textContent=Number.isFinite(pending.progressTarget)?pending.progressCurrent+' / '+pending.progressTarget:p+'%';}
 }
 function timer(t){if(!active()||!mounted)return;const length=$('timer-digits').textContent.length;$('timer-digits').style.setProperty('--gg-timer-size',length>7?'6cqw':length>5?'8cqw':'10cqw');$('gg-timer-paper').classList.toggle('gg-timer-running',t.status!=='idle');}
 function update(next){state=next;if(!active()){if(mounted)restore();return;}mount();assemble();notes();todos();sessions();stats();bars();badges();timer(next.timer);$('st-today-focus').textContent=(next.stats?.today?.focus||0)+' dk';}
 function leave(next){if(next!=='stars-hollow')restore();}
 window.addEventListener('resize',()=>{if(active()&&mounted)bars();});
 window.NeroGilmoreFidelity={update,leave,timer,badges,todos};
})();
