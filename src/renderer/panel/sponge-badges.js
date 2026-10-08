// Approved illustrated collection around the existing achievement records.
(()=>{'use strict';const $=id=>document.getElementById(id),active=()=>document.documentElement.dataset.skin==='bikini-bottom';let state,mounted=false;const positions=new Map();
 const node=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
 const pic=(name,cls)=>{const n=node('img',undefined,cls);n.src='nero-theme://bikini-bottom/assets/reference/'+name+'.png';n.alt='';n.setAttribute('aria-hidden','true');return n;};
 function move(n,p){if(!n||n.parentNode===p)return;if(!positions.has(n)){const mark=document.createComment('Sponge badge original');n.before(mark);positions.set(n,mark);}p.append(n);}
 function restore(){for(const [n,mark]of positions)if(mark.parentNode){mark.after(n);mark.remove();}positions.clear();$('badge-grid').removeAttribute('tabindex');$('badge-grid').removeAttribute('aria-label');}
 function mount(){if(mounted)return;mounted=true;const card=document.querySelector('#view-badges>.badges');
  const overview=node('section',undefined,'sbf-only sbb-overview');overview.id='sbb-overview';const progress=node('div',undefined,'sbb-progress');progress.id='sbb-progress';progress.setAttribute('role','progressbar');progress.setAttribute('aria-label','Kazanılan rozetler');progress.setAttribute('aria-valuemin','0');progress.setAttribute('aria-valuemax','100');progress.append(node('i'));overview.append(progress);const caption=node('span',undefined,'sbb-progress-caption');caption.id='sbb-progress-caption';overview.append(caption);card.append(overview);
  const board=node('section',undefined,'sbf-only sbb-board');board.id='sbb-board';board.append(pic('badges-clip-left','sbb-clip sbb-clip-left'),pic('badges-clip-right','sbb-clip sbb-clip-right'));card.append(board,pic('badges-footer','sbf-only sbb-footer'));
  const icons={yaygin:'star',siradisi:'shell',nadir:'diamond',efsanevi:'crown',gizli:'star'};for(const tab of $('badge-rarity-tabs').children){const word=node('span',tab.textContent,'sbb-rarity-name');tab.replaceChildren(pic('badges-'+icons[tab.dataset.rarity]+'-icon','sbf-only sbb-rarity-icon'),word);}
 }
 function assemble(){const card=document.querySelector('#view-badges>.badges');move(card.querySelector('.card-head')||$('badge-count').parentNode,$('sbb-overview'));move($('badge-rarity-tabs'),$('sbb-overview'));move(document.querySelector('.badge-category-meta'),$('sbb-board'));move($('badge-grid'),$('sbb-board'));$('badge-grid').tabIndex=0;$('badge-grid').setAttribute('aria-label','Rozet koleksiyonu; diğer rozetler için aşağı kaydır');}
 function collectible(a){const exact={ilk_is:'medal',is_10:'orderpad',gunde_5:'patty',ilk_sayac:'porthole',seri_3:'calendar',ilk_not:'notebook'};if(exact[a.id])return exact[a.id];
  // Keep a stable illustration per achievement when category or sort order changes.
  const description=(a.id+' '+a.title+' '+a.desc).toLocaleLowerCase('tr-TR');if(/not|yaz|fikir/.test(description))return 'notebook';if(/odak|sayaç|dakika|saat|timer/.test(description))return 'porthole';if(/gün|seri|hafta|ay|yıl|takvim/.test(description))return 'calendar';if(/iş|görev|tamamla/.test(description))return 'orderpad';if(/mola|kahve|yemek/.test(description))return 'patty';return 'medal';
 }
 function badges(){if(!active()||!mounted||!state)return;const normal=state.achievements.filter(a=>a.rarity!=='gizli'),got=normal.filter(a=>a.unlockedAt).length,value=Math.round(got/100*100),progress=$('sbb-progress');progress.setAttribute('aria-valuenow',String(got));progress.setAttribute('aria-valuetext',got+' / 100 rozet');progress.firstElementChild.style.width=Math.min(100,value)+'%';$('sbb-progress-caption').textContent='%'+value+' tamamlandı';
  for(const card of $('badge-grid').children){const a=state.achievements.find(a=>a.id===card.dataset.badgeId);if(!a)continue;card.querySelectorAll('.sbb-status,.sbb-fastener,.sbb-date').forEach(n=>n.remove());const unlocked=!!a.unlockedAt,kind=collectible(a),icon=card.querySelector('.badge-icon');card.dataset.sbbArt=kind;card.dataset.sbbPaper=unlocked?(['porthole','orderpad'].includes(kind)?'blue':'cream'):'muted';icon.replaceChildren(pic('badges-'+kind,'sbb-collectible'));card.querySelector('.badge-desc').textContent=unlocked?(a.completedDesc||a.desc):a.desc;
   card.append(pic(unlocked?'badges-check':'badges-lock','sbb-status'),pic('badges-fastener','sbb-fastener'));
   if(unlocked){const date=node('time',new Date(a.unlockedAt).toLocaleDateString('tr-TR',{day:'numeric',month:'short'}),'sbb-date');date.dateTime=new Date(a.unlockedAt).toISOString();date.prepend(pic('badges-date','sbb-date-icon'));card.append(date);}
   card.tabIndex=0;card.setAttribute('aria-label',a.title+'. '+(unlocked?(a.completedDesc||a.desc)+' Kazanıldı.':a.desc+' Kilitli.'));
  }
 }
 function update(next){state=next;if(!active()){if(mounted)restore();return;}mount();assemble();badges();}
 function leave(next){if(next!=='bikini-bottom'&&mounted)restore();}
 window.NeroSpongeBadges={update,badges,leave};
})();
