// Source illustrations and real native state. No baked example records.
(()=>{'use strict';const $=id=>document.getElementById(id),active=()=>document.documentElement.dataset.skin==='bikini-bottom';let mounted=false,state=null;const positions=new Map(),disabled=new Map();let jarPlaceholder,timerPlaceholder,lastTimer;
 const el=(tag,value,cls)=>{const n=document.createElement(tag);if(value!==undefined)n.textContent=value;if(cls)n.className=cls;return n;};
 const asset=n=>'nero-theme://bikini-bottom/assets/reference/'+n+'.png';
 function pic(name,cls){const n=el('img',undefined,'sbf-only sbf-art '+(cls||''));n.src=asset(name);n.alt='';n.setAttribute('aria-hidden','true');return n;}
 function move(n,p){if(!n||n.parentNode===p)return;if(!positions.has(n)){const m=document.createComment('Sponge fidelity original');n.before(m);positions.set(n,m);}p.append(n);}
 function restore(){for(const [n,m]of positions){if(m.parentNode){m.after(n);m.remove();}}positions.clear();for(const [n,value]of disabled)n.disabled=value;disabled.clear();if(jarPlaceholder!==undefined)$('jar-input').placeholder=jarPlaceholder;if(timerPlaceholder!==undefined)$('timer-label').placeholder=timerPlaceholder;}
 function mount(){if(mounted)return;mounted=true;jarPlaceholder=$('jar-input').placeholder;timerPlaceholder=$('timer-label').placeholder;
  for(const b of document.querySelectorAll('.tabs [data-tab]'))if(['home','notes','todos','timer','badges','budget'].includes(b.dataset.tab))b.append(pic('nav-'+b.dataset.tab+'-cutout','sbf-nav-icon'));
  const footer=el('div',undefined,'sbf-only sbf-home-footer');footer.id='sbf-home-footer';footer.append(pic('home-footer-live','sbf-footer'));document.querySelector('.home-grid').append(footer);
  const lower=el('div',undefined,'sbf-only sbf-home-lower');lower.id='sbf-home-lower';document.querySelector('.home-grid').append(lower);
  const final=el('div',undefined,'sbf-only sbf-final-footer');final.id='sbf-final-footer';document.querySelector('.home-grid').append(final);
  const notesFooter=pic('notes-footer-live','sbf-notes-footer');$('notes-list-view').append(notesFooter);
  const format=el('details',undefined,'sbf-only sbf-note-format');format.id='sbf-note-format';const summary=el('summary','Aa');summary.setAttribute('aria-label','Not metni biçimlendirme araçları');format.append(summary);$('sb-composer').append(format);
  const stage=el('section',undefined,'sbf-only sbf-timer-stage');stage.id='sbf-timer-stage';$('view-timer').append(stage);
  const reset=el('button','Sıfırla','sbf-only sbf-timer-reset');reset.id='sb-timer-reset';reset.type='button';reset.addEventListener('click',async()=>{try{await window.nero.invoke('timer:cancel');}catch(e){$('nf-status').textContent=e.message;}});document.querySelector('.timer-actions').append(reset);
  const stats=el('section',undefined,'sbf-only sbf-timer-stats');stats.id='sbf-timer-stats';for(const [name,id]of [['Bugün odak','sb-today-focus'],['Tamamlanan sayaç','sb-timers-done']]){const group=el('div');group.append(el('span',name));const value=el('strong');value.id=id;group.append(value);stats.append(group);}stage.append(stats);
  const extras=el('section',undefined,'sbf-only sbf-timer-extras');extras.id='sbf-timer-extras';extras.append(el('label','Bugün listesinden iş seç'));const custom=el('div',undefined,'sbf-custom-duration');custom.id='sbf-custom-duration';custom.append(el('span','Özel süre (dakika)'));extras.append(custom);$('view-timer').append(extras);
  const observer=new ResizeObserver(()=>timer(lastTimer||state?.timer));observer.observe(document.querySelector('.lcd-bar'));
 }
 function assembleTimer(){const stage=$('sbf-timer-stage');$('timer-label').placeholder='Neye odaklanıyorsun?';for(const n of [document.querySelector('#view-timer>.sb-heading'),$('timer-setup'),document.querySelector('.dial'),document.querySelector('.lcd-bar'),document.querySelector('.timer-actions')])move(n,stage);
  const extras=$('sbf-timer-extras');move($('nf-timer-task'),extras.querySelector('label'));move($('timer-custom').closest('label'),$('sbf-custom-duration'));$('sb-today-focus').textContent=(state.stats?.today?.focus||0)+' dk';$('sb-timers-done').textContent=String(state.stats?.today?.timersDone||0);
 }
 function timer(t){if(!active()||!mounted||!t)return;lastTimer=t;$('timer-setup').hidden=false;$('sbf-timer-extras').hidden=t.status!=='idle';for(const n of document.querySelectorAll('#timer-setup input,#presets button,#sbf-timer-extras input,#sbf-timer-extras select')){if(!disabled.has(n))disabled.set(n,n.disabled);n.disabled=t.status!=='idle';}
  $('timer-digits').style.setProperty('--sbf-clock-size',$('timer-digits').textContent.length>7?'10.8cqw':$('timer-digits').textContent.length>5?'12cqw':'17cqw');
  const bar=document.querySelector('.lcd-bar');bar.style.setProperty('--sbf-progress-width',bar.getBoundingClientRect().width+'px');
 }
 function notes(){if(!active()||!mounted||!state)return;
  const footer=document.querySelector('.sbf-notes-footer');move($('notes-archive'),$('notes-list-view'));footer.before($('sb-composer'));footer.after($('notes-archive'));
  move(document.querySelector('#sb-composer .sb-format'),$('sbf-note-format'));
  for(const card of $('notes-list').querySelectorAll('[data-sb-note]')){const note=state.notes.find(n=>n.id===card.dataset.sbNote);card.classList.toggle('sbf-tagged',!!(note?.tag||note?.pinned));const title=card.querySelector('.note-title');if(title)card.title=title.textContent;const preview=card.querySelector('.note-preview');if(preview&&note)preview.textContent=String(note.body||'').split('\n').slice(1).join('\n');}
 }
 function home(){if(!active()||!mounted||!state)return;
  for(const [i,n]of [...$('desk-grid').children].entries()){
   const number=String(i+1).padStart(2,'0'),illustrated=!n.classList.contains('on')||i<2;
   n.dataset.sbfIllustrated=String(illustrated);n.style.backgroundImage=`url("${asset('desk-glass-'+number+(illustrated?'-original':'-empty'))}")`;
   n.dataset.sbfNumber=String(i+1);
  }
  for(const calendar of document.querySelectorAll('.mood-calendar')){
   calendar.querySelectorAll('.sbf-calendar-blank').forEach(n=>n.remove());
   const days=[...calendar.querySelectorAll('.mood-day')],first=days[0]?.dataset.date,offset=first?(new Date(first+'T12:00:00').getDay()+6)%7:0;
   const weeks=Math.max(5,Math.ceil((offset+days.length)/7));calendar.style.setProperty('--sbf-date-rows',weeks);
   for(const [i,day]of days.entries()){const cell=offset+i;day.parentElement.style.gridColumnStart=String(cell%7+1);day.parentElement.style.gridRowStart=String(Math.floor(cell/7)+2);day.classList.toggle('sbf-today',day.dataset.date===new Date().toLocaleDateString('en-CA'));}
  }
  const rows=[$('archive-list'),$('archive-more-list')].flatMap(list=>[...list.children]);
  for(const [i,row]of rows.entries()){
   const item=state.home?.archive?.recent?.[i];if(!item)continue;row.replaceChildren(el('span',item.text,'sbf-archive-text'));
   if(item.doneAt){const time=el('time',new Date(item.doneAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short'}));time.dateTime=new Date(item.doneAt).toISOString();row.append(time);}
  }
  $('st-days').style.setProperty('--sbf-days-size',String($('st-days').textContent).length>2?'6.9cqw':'10.5cqw');
 }
 function bars(){if(!active()||!state)return;const root=$('week-bars'),max=Math.max(120,Math.ceil(Math.max(0,...[...root.children].map(n=>Number(n.dataset.focus)||0))/60)*60),height=root.clientHeight;
  for(const bar of root.children){const value=Number(bar.dataset.focus)||0;bar.querySelector('i').style.height=Math.round(value/max*height)+'px';}
  let axis=$('sbf-week-axis');if(!axis){axis=el('div',undefined,'sbf-only sbf-week-axis');axis.id='sbf-week-axis';root.before(axis);}axis.replaceChildren();for(let i=0;i<3;i++)axis.append(el('span',max*(2-i)/2+' dk'));
 }
 function update(next){state=next;if(!active()){if(mounted)restore();return;}mount();$('jar-input').placeholder='Güzel bir anını bırak…';
  // Assemble after the base theme has moved its nodes, so leave() restores in reverse order.
  move($('st-days').closest('.tile'),$('sbf-final-footer'));
  const modes=document.querySelector('.nf-mood-modes');if(modes)move(modes,document.querySelector('.moodboard-card-head'));
  $('st-today-focus').textContent=(next.stats?.today?.focus||0)+' dk';
  const lower=$('sbf-home-lower');move(document.querySelector('.jar'),lower);move(document.querySelector('.quick'),lower);move($('sbf-home-footer'),lower);
  const read=[...document.querySelectorAll('.jar .nf-button')].find(n=>n.textContent==='Anıları oku');if(read){read.type='button';read.classList.add('sbf-read-memories');move(read,document.querySelector('.jar'));}
  home();notes();assembleTimer();timer(next.timer);bars();
 }
 function leave(next){if(next!=='bikini-bottom')restore();}
 window.addEventListener('resize',bars);window.NeroSpongeFidelity={update,leave,home,timer};
})();
