// Approved visual themes layered on Nero's existing, live records and actions.
// No demo records are created here. User content is always assigned as text.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const names = {'arcade-molasi':'Arcade Molası',yorunge:'Yörünge','serada-bir-gun':'Serada Bir Gün'};
  const active = () => Object.hasOwn(names,document.documentElement.dataset.skin);
  const skin = () => document.documentElement.dataset.skin;
  const mins = n => Number(n||0).toLocaleString('tr-TR')+' dk';
  let mounted = false, currentState = null, previewId = null;
  const moves = new Map();
  const icon = (index,cls='') => `<i class="nt-icon ${cls}" style="--ix:${index%4};--iy:${Math.floor(index/4)}" aria-hidden="true"></i>`;
  function move(node, parent, before=null) {
    if(!moves.has(node)){const marker=document.createComment('theme-trio original position');node.before(marker);moves.set(node,marker);}
    parent.insertBefore(node,before);
  }
  function restore(node){const marker=moves.get(node);if(marker)marker.after(node);}
  function mount(){
    if(mounted)return;mounted=true;
    document.querySelector('.shell').insertAdjacentHTML('beforeend','<div class="nt-only nt-frame" aria-hidden="true"></div><footer class="nt-only nt-footer" id="nt-footer"></footer>');
    document.querySelector('.brand').insertAdjacentHTML('beforeend',icon(7,'nt-brand-icon'));
    document.querySelector('.brand').insertAdjacentHTML('afterend','<p class="nt-only nt-theme-name" id="nt-theme-name"></p>');
    document.querySelectorAll('.tabs [data-tab]').forEach((b,i)=>b.insertAdjacentHTML('afterbegin',icon(i)));
    const headings={notes:['Notlar','Düşüncelerini kaydet. İyi fikirler hep yanında kalsın.'],todos:['Bir sonraki adım','Küçük işler, büyük bir gün.'],timer:['Odak zamanı','Dikkatini topla. Bir adım daha ilerle.'],settings:['Ayarlar','Nero ile kendi ritmini bul.']};
    for(const [tab,[title,caption]] of Object.entries(headings)){
      const parent=tab==='notes'?$('notes-list-view'):$('view-'+tab);
      parent.insertAdjacentHTML('afterbegin',`<div class="nt-only nt-heading"><div><h2>${title}</h2><p>${caption}</p></div>${tab==='notes'?'<button id="nt-new-note" class="pill primary" type="button">+ Yeni not</button>':''}</div>`);
    }
    $('notes-list-view').insertAdjacentHTML('beforeend','<button class="nt-only nt-note-peek" id="nt-note-peek" type="button" aria-label="Önizlenen notu düzenle"><span class="nt-peek-head"><span><strong id="nt-peek-title"></strong><small id="nt-peek-date"></small></span><span class="nt-saved">Saklandı</span></span><span id="nt-peek-body"></span></button>');
    $('nt-new-note').addEventListener('click',()=>document.querySelector('#notes-list .new-note')?.click());
    $('nt-note-peek').addEventListener('click',()=>[...document.querySelectorAll("#notes-list [data-nt-note]")].find(n=>n.dataset.ntNote===previewId)?.click());
    document.querySelector('.nero-says').insertAdjacentHTML('beforeend','<small class="nt-only nt-hero-sub">HER İYİ GÜN BİR ADIMLA BAŞLAR.</small>');
    const tileNodes=[...document.querySelectorAll('.tiles .tile')];
    tileNodes.slice(0,3).forEach((tile,i)=>tile.insertAdjacentHTML('afterbegin',icon([8,9,10][i])));
    tileNodes[2].insertAdjacentHTML('beforeend','<span class="nt-only nt-streak-route" aria-hidden="true">'+Array.from({length:6},()=>'<i></i>').join('')+'</span>');
    document.querySelector('.jar .section-heading').insertAdjacentHTML('afterbegin',icon(6));
    document.querySelectorAll('.quick>button').forEach((b,i)=>b.insertAdjacentHTML('afterbegin',icon([3,11,1][i])));
    document.querySelector('.dial').insertAdjacentHTML('afterbegin','<span class="nt-only nt-console-kicker">+ ODAK MODU<span>LEVEL 01 »</span></span>');
    document.querySelector('.dial').insertAdjacentHTML('beforeend','<div class="nt-only nt-timer-meta"><span>'+icon(9)+'<small>Süre</small><strong id="nt-duration"></strong></span><span>'+icon(14)+'<small>Tur</small><strong id="nt-turn"></strong></span></div><div class="nt-only nt-progress" role="progressbar" aria-label="Odak ilerlemesi" aria-valuemin="0" aria-valuemax="100">'+Array.from({length:5},(_,i)=>'<i data-step="'+i+'"></i>').join('')+'</div><i class="nt-only nt-orbit-point" aria-hidden="true"></i>');
    document.querySelector('.timer-actions').insertAdjacentHTML('beforeend','<button id="nt-timer-reset" class="nt-only pill" type="button">'+icon(14)+'Sıfırla</button>');
    $('nt-timer-reset').addEventListener('click',()=>document.querySelector('#presets [data-min="25"]').click());
    $('view-timer').insertAdjacentHTML('beforeend','<div class="nt-only nt-timer-summaries"><div>'+icon(15)+'<span>Bugün odak<strong id="nt-focus-today"></strong></span></div><div>'+icon(12)+'<span>Tamamlanan sayaç<strong id="nt-completed"></strong></span></div></div><p class="nt-only nt-farewell">Nero burada. Sen işine bak.</p>');
    $('timer-setup').insertAdjacentHTML('beforeend','<details class="nt-only nt-custom"><summary>Özel süre ve odak başlığı</summary></details>');
    document.querySelector('.tabs').addEventListener('keydown',e=>{
      if(!active()||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
      const buttons=[...document.querySelectorAll('.tabs [role=tab]')],i=buttons.indexOf(e.target);if(i<0)return;
      const j=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowLeft'?-1:1)+buttons.length)%buttons.length;
      e.preventDefault();buttons[j].click();buttons[j].focus();
    });
  }
  function selectTab(tab){
    if(!active())return;
    document.querySelectorAll('.tabs [role=tab]').forEach(b=>b.tabIndex=b.dataset.tab===tab?0:-1);
    if($('nt-footer'))$('nt-footer').textContent=skin()==='arcade-molasi'?(tab==='notes'?'NOTLAR DA BİRER SEVİYE':'INSERT A BETTER DAY'):'Küçük adımlar, güzel günler.';
  }
  function updateTimer(state,chosen=25){
    if(!active())return;mount();
    const t=state?.timer, progress=t?.status==='idle'?0:Math.max(0,Math.min(1,Number(t?.progress)||0));
    $('nt-duration').textContent=mins(t?.status!=='idle'&&t?.durationMs?Math.round(t.durationMs/60000):chosen);
    $('nt-turn').textContent=String(Number(state?.stats?.today?.timersDone||0)+1).padStart(2,'0');
    $('nt-timer-reset').hidden=t?.status!=='idle';
    $('nt-focus-today').textContent=mins(state?.stats?.today?.focus);
    $('nt-completed').textContent=Number(state?.stats?.today?.timersDone||0).toLocaleString('tr-TR');
    document.querySelector('.nt-progress').setAttribute('aria-valuenow',String(Math.round(progress*100)));
    document.querySelectorAll('.nt-progress i').forEach((i,n)=>i.classList.toggle('passed',n===0||progress>=n/4));
    document.querySelector('.nt-orbit-point').style.setProperty('--angle',`${progress*360}deg`);
    $('timer-digits').classList.toggle('nt-long-digits',$('timer-digits').textContent.length>5);
  }
  function updateBadges(){
    if(!active())return;
    document.querySelectorAll('.badge-icon').forEach((el,i)=>{
      if(el.querySelector('.nt-icon'))return;
      const text=el.textContent;el.textContent='';el.insertAdjacentHTML('afterbegin',icon([8,3,2,4,10,1,7,6][i%8]));
      if(/^\d/.test(text)){const value=document.createElement('small');value.textContent=text;el.append(value);}
    });
  }
  function update(state,chosen=25){
    currentState=state;
    document.body.classList.toggle('nt-theme',active());
    if(!active()){
      if(mounted){restore(document.querySelector('.tiles .tile')?.parentNode?.querySelector('#st-days')?.closest('.tile')||$('st-days').closest('.tile'));restore(document.querySelector('.nero-says'));restore($('timer-label'));restore(document.querySelector('#timer-custom').closest('.custom'));}
      return;
    }
    mount();
    $('nt-theme-name').textContent=names[skin()];
    document.querySelectorAll('.quick>button').forEach((b,i)=>{if(!b.querySelector('.nt-icon'))b.insertAdjacentHTML('afterbegin',icon([3,11,1][i]));});
    document.body.classList.toggle('nt-no-scene',state?.settings?.sceneBg===false);
    const fourth=$('st-days').closest('.tile');move(fourth,document.querySelector('.home-grid'),document.querySelector('.quick').nextSibling);
    const says=document.querySelector('.nero-says');
    if(skin()==='yorunge')move(says,document.querySelector('.hello'));else restore(says);
    const custom=document.querySelector('.nt-custom');move($('timer-label'),custom);move($('timer-custom').closest('.custom'),custom);
    const activeNotes=(state?.notes||[]).filter(n=>!n.archivedAt);
    const note=activeNotes.find(n=>String(n.id)===previewId)||activeNotes[0];previewId=note?String(note.id):null;
    $('nt-note-peek').hidden=!note;
    const cards=[...document.querySelectorAll('#notes-list>li:not(.new-note)')];
    cards.forEach((card,i)=>{
      card.dataset.ntNote=String(activeNotes[i].id);
      card.classList.toggle('nt-selected',String(activeNotes[i].id)===previewId);
      card.style.setProperty('--botany-x',`${(i%3)*50}%`);
      let art=card.querySelector('.nt-note-art');
      if(!art){art=document.createElement('span');art.className='nt-only nt-note-art';art.setAttribute('aria-hidden','true');card.prepend(art);}
      art.textContent=String(i+1).padStart(2,'0');
      card.addEventListener('click',()=>{previewId=String(activeNotes[i].id);});
    });
    if(note){
      const lines=String(note.body||'').trim().split('\n');
      $('nt-peek-title').textContent=lines[0]||'Boş not';$('nt-peek-body').textContent=lines.slice(1).join('\n')||'Bu notu açıp yazmaya devam edebilirsin.';
      $('nt-peek-date').textContent=new Intl.DateTimeFormat('tr-TR',{day:'numeric',month:'long',year:'numeric'}).format(new Date(note.updatedAt||note.createdAt));
    }
    $('st-today-focus').textContent=mins(state?.stats?.today?.focus);
    document.querySelectorAll('.nt-streak-route i').forEach((el,i)=>el.classList.toggle('passed',i<Number(state?.stats?.streak||0)));
    document.querySelectorAll('#week-bars .bar').forEach(bar=>{let label=bar.querySelector('.nt-bar-value');if(!label){label=document.createElement('small');label.className='nt-only nt-bar-value';bar.prepend(label);}label.textContent=bar.dataset.focus;});
    updateBadges();updateTimer(state,chosen);selectTab(document.documentElement.dataset.tab);
  }
  function skins(base){
    const make=(id,extra)=>({...base,tabs:{home:'Bugün',notes:'Notlar',todos:'İşler',timer:'Sayaç',badges:'Rozetler',settings:'Ayarlar'},newNote:'yeni not',timerIdle:'Bir adım daha ilerle.',timerRunning:'Bir adım daha ilerle.',timerPaused:'Kısa bir mola…',...extra});
    return {'arcade-molasi':make('arcade-molasi',{timerIdle:'Bir durak daha ilerle.',timerRunning:'Bir durak daha ilerle.',todoPlaceholder:'Sıradaki görev ne?',timerPaused:'Oyun duraklatıldı…'}),yorunge:make('yorunge',{todoPlaceholder:'Sıradaki hedefin ne?',timerIdle:'Bir yörünge daha ilerle.',timerRunning:'Bir yörünge daha ilerle.'}),'serada-bir-gun':make('serada-bir-gun',{todoPlaceholder:'Bugün neyi büyütüyoruz?',timerPaused:'Bir nefeslik mola…'})};
  }
  window.NeroThemeTrio=Object.freeze({update,updateTimer,updateBadges,selectTab,skins});
})();
