// Çizgi Roman Arası — live panels around Nero's existing state, IPC and timer.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const active = () => document.documentElement.dataset.skin === 'cizgi-roman-arasi';
  let mounted = false, state = null, selectedNote = null, saving = null, dirty = false;
  const positions = new Map();
  const paths = {
    home:'<path fill="currentColor" d="m3 10 9-7 9 7v11H6V10m4 11v-7h5v7"/>',
    notes:'<path d="M5 3h14v18H5zM8 7h8M8 11h8M8 15h5"/>',
    todos:'<rect x="3" y="3" width="18" height="18" rx="1"/><path d="m7 11 4 4 7-8"/>',
    timer:'<circle cx="12" cy="13" r="8"/><path d="M9 2h6M12 2v3M18 5l2 2M12 8v5l3 2"/>',
    badges:'<path d="m12 2 3 2 4 1 1 4 2 3-2 3-1 4-4 1-3 2-3-2-4-1-1-4-2-3 2-3 1-4 4-1z"/><circle cx="12" cy="12" r="4"/>',
    budget:'<rect x="3" y="6" width="18" height="15" rx="1"/><path d="m5 6 12-4 2 4M15 11h6v5h-6z"/>',
    flame:'<path fill="currentColor" d="M12 2c2 6 7 7 7 13a7 7 0 0 1-14 0c0-3 2-5 4-7 0 4 1 4 2 5 1-3 2-6 1-11z"/>',
    play:'<path d="m6 3 15 9-15 9z"/>',
    plus:'<path d="M12 3v18M3 12h18"/>',
    reset:'<path d="M5 7a9 9 0 1 1-1 9M4 3v6h6"/>',
    link:'<path d="m9 15 6-6M9 8 7 8a4 4 0 0 0-6 6l4 4a4 4 0 0 0 6 0l2-2M15 16l2 0a4 4 0 0 0 6-6l-4-4a4 4 0 0 0-6 0l-2 2"/>',
    list:'<path d="M8 5h13M8 12h13M8 19h13M2 5h1M2 12h1M2 19h1"/>',
    comment:'<path d="M3 3h18v14H9l-6 4zM7 8h1m3 0h1m3 0h1"/>'
  };
  const icon = name => `<svg class="comic-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round">${paths[name] || paths.notes}</svg>`;
  function move(node, parent, before = null) { if(node.parentNode===parent&&(before?node.nextSibling===before:node===parent.lastChild))return; if (!positions.has(node)) { const mark = document.createComment('comic original'); node.before(mark); positions.set(node, mark); } parent.insertBefore(node, before); }
  function restore() { for (const [node, mark] of positions) {mark.after(node);mark.remove();}positions.clear(); }
  function leave(next){if(next!=='cizgi-roman-arasi'&&mounted){commit();restore();const bar=document.querySelector('.lcd-bar');bar.setAttribute('aria-hidden','true');for(const attr of ['role','aria-label','aria-valuenow','aria-valuemin','aria-valuemax'])bar.removeAttribute(attr);}} 
  function number(node, value) { node.classList.add('comic-panel'); node.dataset.comicNumber = String(value).padStart(2, '0'); }
  function mount() {
    if (mounted) return;
    mounted = true;
    document.querySelector('.brand').insertAdjacentHTML('afterend','<span class="comic-only comic-theme-name">Çizgi Roman Arası</span>');
    document.querySelectorAll('.tabs [data-tab]').forEach(button => button.insertAdjacentHTML('afterbegin', `<span class="comic-only comic-nav-icon">${icon(button.dataset.tab)}</span>`));
    const hello = document.querySelector('.hello');
    hello.insertAdjacentHTML('afterbegin','<span class="comic-only comic-corner" aria-hidden="true">01</span>');
    const tiles = [...document.querySelectorAll('.tiles>.tile')];
    tiles.slice(0,3).forEach((tile,i) => { number(tile, i+2); tile.insertAdjacentHTML('afterbegin',`<span class="comic-only comic-tile-icon">${icon(['todos','timer','flame'][i])}</span>`); });
    number(document.querySelector('.week'),5); number(document.querySelector('.jar'),6);
    document.querySelector('.jar').insertAdjacentHTML('afterbegin','<div class="comic-only comic-jar-art" aria-hidden="true"><span>KÜÇÜK<br>MUTLULUKLAR<br>DA BİRİKİR.</span></div>');
    number(document.querySelector('.quick'),7);
    for (const [tab,title] of Object.entries({notes:'Notlar',todos:'İşler',timer:'Odak zamanı',settings:'Ayarlar'})) {
      const parent = tab === 'notes' ? $('notes-list-view') : $('view-'+tab);
      parent.insertAdjacentHTML('afterbegin',`<header class="comic-only comic-heading comic-${tab}-heading"><h2>${title}</h2>${tab==='notes'?'<button type="button" id="comic-new-note">+ Yeni not</button>':''}</header>`);
    }
    $('comic-new-note').addEventListener('click', async () => { await commit(); const note = await window.nero.invoke('notes:save',{id:null,body:'Yeni not\n'}); selectedNote=String(note.id); renderComposer(note,true); $('comic-note-title').focus(); $('comic-note-title').select(); });
    $('notes-list-view').insertAdjacentHTML('beforeend',`<section class="comic-only comic-composer comic-panel" data-comic-number="04" id="comic-composer"><header><input id="comic-note-title" aria-label="Not başlığı"><span id="comic-note-status" role="status">Kaydedildi</span></header><div class="comic-format" role="toolbar" aria-label="Not biçimlendirme"><button type="button" data-comic-format="bold" aria-label="Kalın"><b>B</b></button><button type="button" data-comic-format="italic" aria-label="İtalik"><i>I</i></button><button type="button" data-comic-format="insertUnorderedList" aria-label="Madde işaretli liste">${icon('list')}</button><button type="button" id="comic-add-link" aria-label="Bağlantı ekle">${icon('link')}</button><button type="button" id="comic-open-note" aria-label="Not ayrıntıları">${icon('comment')}</button></div><div id="comic-note-body" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Not metni" spellcheck="true"></div></section><dialog id="comic-link-dialog" class="comic-only"><form method="dialog" id="comic-link-form"><h3>Bağlantı ekle</h3><label>Adres<input id="comic-link-url" type="url" placeholder="https://" required></label><div><button type="button" id="comic-link-cancel">Vazgeç</button><button type="submit">Ekle</button></div></form></dialog>`);
    $('notes-list').addEventListener('click', selectNote, true);
    $('notes-list').addEventListener('keydown', event => { if(active() && event.key==='Enter') selectNote(event); }, true);
    $('comic-open-note').addEventListener('click', async () => { await commit(); const card = [...$('notes-list').children].find(n=>n.dataset.comicNote===selectedNote); if(card) { bypass=true; card.click(); bypass=false; } });
    document.querySelectorAll('[data-comic-format]').forEach(b=>{b.addEventListener('mousedown',e=>e.preventDefault());b.addEventListener('click',()=>{ $('comic-note-body').focus(); document.execCommand(b.dataset.comicFormat,false); schedule(); });});
    $('comic-note-body').addEventListener('paste',event=>{event.preventDefault();document.execCommand('insertText',false,event.clipboardData.getData('text/plain'));schedule();});
    $('comic-note-body').addEventListener('input',schedule);$('comic-note-title').addEventListener('input',schedule);
    $('comic-note-body').addEventListener('blur',()=>{if(!$('comic-link-dialog').open)commit();});
    let linkSelection=null;
    $('comic-add-link').addEventListener('mousedown',e=>e.preventDefault());
    $('comic-add-link').addEventListener('click',()=>{const selection=window.getSelection();linkSelection=selection.rangeCount?selection.getRangeAt(0).cloneRange():null;$('comic-link-url').value='https://';$('comic-link-dialog').showModal();$('comic-link-url').focus();});
    $('comic-link-cancel').addEventListener('click',()=>$('comic-link-dialog').close());
    $('comic-link-form').addEventListener('submit',e=>{e.preventDefault();const url=$('comic-link-url').value;if(!/^https?:\/\//i.test(url)){$('comic-link-url').setCustomValidity('http:// veya https:// adresi kullan.');$('comic-link-url').reportValidity();return;}try{new URL(url);}catch{return;}$('comic-link-dialog').close();$('comic-note-body').focus();if(linkSelection){const selection=window.getSelection();selection.removeAllRanges();selection.addRange(linkSelection);}if(window.getSelection().isCollapsed)document.execCommand('insertText',false,url);else document.execCommand('createLink',false,url);schedule();});
    $('comic-link-url').addEventListener('input',()=>$('comic-link-url').setCustomValidity(''));
    $('comic-note-body').addEventListener('click',e=>{if(e.target.closest('a'))e.preventDefault();});
    $('view-timer').insertAdjacentHTML('beforeend','<div class="comic-only comic-timer-stats"><div class="comic-panel" data-comic-number="06"><span>Bugün odak</span><strong id="comic-focus"></strong></div><div class="comic-panel" data-comic-number="07"><span>Tamamlanan sayaç</span><strong id="comic-timers"></strong></div></div>');
    document.querySelector('.dial').insertAdjacentHTML('afterbegin','<span class="comic-only comic-timer-label">ODAK MODU</span>');
    number(document.querySelector('.dial'),3);
    document.querySelector('.lcd-bar').insertAdjacentHTML('beforebegin','<h3 class="comic-only comic-progress-heading">04 · İlerleme</h3>');
    document.querySelector('.timer-actions').insertAdjacentHTML('beforeend',`<button type="button" class="comic-only pill" id="comic-timer-reset">${icon('reset')}Sıfırla</button>`);
    $('comic-timer-reset').addEventListener('click',()=>document.querySelector('#presets [data-min="25"]').click());
    $('timer-setup').insertAdjacentHTML('beforeend','<details class="comic-only comic-custom"><summary>Özel süre ve odak başlığı</summary></details>');
    document.querySelector('.tabs').addEventListener('keydown',e=>{if(!active()||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;const buttons=[...document.querySelectorAll('.tabs [role=tab]')],i=buttons.indexOf(e.target);if(i<0)return;e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowLeft'?-1:1)+buttons.length)%buttons.length;buttons[j].click();buttons[j].focus();});
    window.addEventListener('beforeunload',commit);
  }
  let bypass=false;
  async function selectNote(event){if(!active()||bypass||event.target.closest('button,input,label'))return;const card=event.target.closest('#notes-list>li:not(.new-note)');if(!card)return;event.preventDefault();event.stopImmediatePropagation();await commit();selectedNote=card.dataset.comicNote;[...$('notes-list').children].forEach(n=>n.classList.toggle('comic-note-selected',n===card));const note=state.notes.find(n=>String(n.id)===selectedNote);if(note)renderComposer(note,true);}
  function serialize(node){if(node.nodeType===Node.TEXT_NODE)return node.textContent;const body=[...node.childNodes].map(serialize).join('');const name=node.nodeName;if(name==='BR')return '\n';if(name==='B'||name==='STRONG')return '**'+body+'**';if(name==='I'||name==='EM')return '_'+body+'_';if(name==='A'&&/^https?:\/\//i.test(node.getAttribute('href')||''))return '['+body+']('+node.getAttribute('href')+')';if(name==='LI')return '- '+body+'\n';if(['DIV','P','UL','OL'].includes(name))return body+'\n';return body;}
  function richText(text){const fragment=document.createDocumentFragment();let list=null;for(const line of text.split('\n')){const p=document.createElement(line.startsWith('- ')?'li':'div');const plain=line.startsWith('- ')?line.slice(2):line;const re=/\*\*([^*\n]+)\*\*|_([^_\n]+)_|\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g;let previous=0,m;while((m=re.exec(plain))){p.append(document.createTextNode(plain.slice(previous,m.index)));const el=document.createElement(m[1]?'strong':m[2]?'em':'a');el.textContent=m[1]||m[2]||m[3];if(m[4])el.setAttribute('href',m[4]);p.append(el);previous=re.lastIndex;}p.append(document.createTextNode(plain.slice(previous)));if(!plain)p.append(document.createElement('br'));if(line.startsWith('- ')){if(!list){list=document.createElement('ul');fragment.append(list);}list.append(p);}else{list=null;fragment.append(p);}}return fragment;}
  function renderComposer(note,force=false){const box=$('comic-composer');box.hidden=!note;if(!note)return;if(!force&&(box.contains(document.activeElement)||$('comic-link-dialog').open||dirty))return;const lines=String(note.body||'').split('\n');$('comic-note-title').value=lines[0]||'Boş not';$('comic-note-body').replaceChildren(richText(lines.slice(1).join('\n')));$('comic-note-status').textContent='✓ Kaydedildi';dirty=false;}
  function schedule(){dirty=true;$('comic-note-status').textContent='Yazılıyor…';clearTimeout(saving);saving=setTimeout(commit,400);}
  async function commit(){clearTimeout(saving);if(!dirty||!selectedNote||!$('comic-note-body'))return;dirty=false;const id=selectedNote,body=$('comic-note-title').value+'\n'+serialize($('comic-note-body')).trimEnd();try{await window.nero.invoke('notes:save',{id,body});$('comic-note-status').textContent='✓ Kaydedildi';}catch{$('comic-note-status').textContent='Kaydedilemedi';dirty=true;}}
  function updateTimer(next,chosen=25){if(!active())return;mount();const quick=$('q-focus');if(quick.textContent!=='Odaklan'){quick.textContent='Odaklan';quick.insertAdjacentHTML('afterbegin',icon('play'));}quick.setAttribute('aria-label',chosen+' dakika odaklan');const t=next?.timer;const progress=t?.status==='idle'?0:Math.max(0,Math.min(1,t?.progress||0));document.querySelector('.lcd-bar').removeAttribute('aria-hidden');document.querySelector('.lcd-bar').setAttribute('role','progressbar');document.querySelector('.lcd-bar').setAttribute('aria-label','Odak ilerlemesi');document.querySelector('.lcd-bar').setAttribute('aria-valuenow',String(Math.round(progress*100)));document.querySelector('.lcd-bar').setAttribute('aria-valuemin','0');document.querySelector('.lcd-bar').setAttribute('aria-valuemax','100');$('comic-timer-reset').hidden=t?.status!=='idle';$('comic-focus').textContent=(next?.stats?.today?.focus||0)+' dk';$('comic-timers').textContent=next?.stats?.today?.timersDone||0;$('timer-digits').classList.toggle('comic-long-time',$('timer-digits').textContent.length>5);}
  function update(next,chosen=25){state=next;if(!active()){if(mounted){commit();restore();}return;}mount();document.body.classList.toggle('comic-no-scene',next?.settings?.sceneBg===false);move(document.querySelector('.nero-says'),document.querySelector('.hello'));move($('st-days').closest('.tile'),document.querySelector('.home-grid'));move(document.querySelector('.quick'),document.querySelector('.home-grid'),document.querySelector('.jar').nextSibling);move($('timer-label'),document.querySelector('.comic-custom'));move($('timer-custom').closest('.custom'),document.querySelector('.comic-custom'));document.querySelectorAll('.quick>button').forEach((b,i)=>{if(!b.querySelector('.comic-icon'))b.insertAdjacentHTML('afterbegin',icon(['play','plus','notes'][i]));});
    move($('comic-composer'),$('notes-list-view'),$('notes-archive'));
    const notes=(next?.notes||[]).filter(n=>!n.archivedAt);const note=notes.find(n=>String(n.id)===selectedNote)||notes[0];selectedNote=note?String(note.id):null;
    [...$('notes-list').children].filter(n=>!n.classList.contains('new-note')).forEach((card,i)=>{card.dataset.comicNote=String(notes[i]?.id);card.dataset.comicNumber=String(i+1).padStart(2,'0');card.classList.add('comic-panel');const preview=card.querySelector('.note-preview');if(preview)preview.textContent=String(notes[i]?.body||'').split('\n').slice(1,5).join('\n');card.classList.toggle('comic-note-selected',card.dataset.comicNote===selectedNote);});renderComposer(note);
    document.querySelectorAll('#week-bars .bar').forEach(bar=>{let n=bar.querySelector('.comic-bar-value');if(!n){n=document.createElement('small');n.className='comic-only comic-bar-value';bar.prepend(n);}n.textContent=bar.dataset.focus+' dk';bar.classList.toggle('comic-zero',Number(bar.dataset.focus)===0);});updateTimer(next,chosen);}
  function selectTab(){if(active()){commit();document.querySelectorAll('.tabs [role=tab]').forEach(b=>b.tabIndex=b.dataset.tab===document.documentElement.dataset.tab?0:-1);}}
  function skins(base){return {'cizgi-roman-arasi':{...base,tabs:{home:'Bugün',notes:'Notlar',todos:'İşler',timer:'Sayaç',badges:'Rozetler',settings:'Ayarlar',budget:'Bütçe'},newNote:'+ Yeni not',newNoteSub:'',saved:'Kaydedildi',typing:'Yazılıyor…',todoPlaceholder:'Sıradaki kareye ne yazıyoruz?',listTitle:'',todoLeft:n=>n+' iş kaldı',allDone:'TAMAM! Bugünün işleri bitti.',timerIdle:'Bir adım daha ileri.',timerRunning:'Bir adım daha ileri.',timerPaused:'Kısa bir ara…',timerStart:'Başlat',timerPause:'Duraklat',timerResume:'Devam et',quickFocus:'Odaklan',quickTodo:'İş ekle',quickNote:'Not al',tagline:'',sticky:'',subs:{},moodPrefix:'',moodLabels:null}};}
  window.NeroComicTheme=Object.freeze({update,updateTimer,selectTab,skins,commit,leave});
})();
