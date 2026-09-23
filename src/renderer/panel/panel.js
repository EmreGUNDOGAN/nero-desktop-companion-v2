// Nero paneli: notlar, yapılacaklar, zamanlayıcı ve ayarlar.

(() => {
  const api = window.nero;
  const $ = (id) => document.getElementById(id);

  let state = null;
  let currentTab = 'notes';
  let lastHomeDialogueId = null;
  let lastSeenHomeDialogueId = null;
  let homeJabFadeTimer = null;
  let viewedMoodboard = null;

  // ---------------------------------------------------------------------------
  // Tema renkleri
  // ---------------------------------------------------------------------------
  const UI_VARS = {
    paper: '--paper', surface: '--surface', ink: '--ink', muted: '--muted', accent: '--accent',
    accentInk: '--accent-ink', secondary: '--secondary', danger: '--danger', line: '--line'
  };
  const DEFAULT_NOTE_COLORS = ['#FBEBC2', '#F8D9D4', '#DDE7D4', '#E6DEF1', '#D9E8EF'];
  let noteColors = DEFAULT_NOTE_COLORS;

  // Her temanın arayüz "kılığı" (skin): yerleşim süsleri ve Nero'nun ağzından yazılar.
  const SKINS = {
    cozy: {
      tabs: { home: 'Bugün', notes: 'Notlar', todos: 'İşler', timer: 'Zaman', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Bugün ne yapıyoruz?', listTitle: '',
      todoLeft: (n) => `${n} iş kaldı`, allDone: 'hepsi bitti ♡',
      timerIdle: 'hazır olduğunda', timerRunning: 'odaklan, Nero izliyor', timerPaused: 'mola…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      subs: {},
      moodPrefix: '', moodLabels: null
    },
    latte: {
      tabs: { home: 'Bugün', notes: 'Notlar', todos: 'İşler', timer: 'Zaman', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Bugün ne yapıyoruz?', listTitle: 'bugünün listesi',
      todoLeft: (n) => `${n} iş kaldı`, allDone: 'hepsi bitti, bir kahveyi hak ettin',
      timerIdle: 'bir kahve boyu odak', timerRunning: 'Nero izliyor. kaçmak yok.', timerPaused: 'kahve molası…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      subs: {},
      moodPrefix: '', moodLabels: null
    },
    kasaba: {
      tabs: { home: 'Manşet', notes: 'Notlar', todos: 'İşler', timer: 'Zaman', settings: 'Ayarlar' },
      newNote: 'yeni kart', newNoteSub: '',
      saved: 'arşive kaldırıldı', typing: 'daktilo tıkırdıyor…',
      todoPlaceholder: 'Siparişini söyle...', listTitle: 'SİPARİŞ FİŞİ <span>Garson: Nero (isteksiz)</span>',
      todoLeft: (n) => `TOPLAM: ${n} iş, bahşiş yok`, allDone: 'TOPLAM: 0 iş. Mutfak kapandı.',
      timerIdle: 'ocak hazır', timerRunning: 'demleniyor', timerPaused: 'kahve molası',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok hızlı',
      subs: {},
      moodPrefix: '',
      moodLabels: {
        content: "Nero'nun keyfi yerinde", happy: 'Nero bugün neşeli, kaynaklar doğruladı', bored: 'Nero sıkıldı, kasaba sessiz',
        sulky: 'Nero küstü, açıklama yapmıyor', lonely: 'Nero yalnız, okurlar endişeli', asleep: 'Nero uyuyor, yarın devam'
      }
    },
    ege: {
      tabs: { home: 'Bugün', badges: 'Rozetler', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Güzel bir gün için ne bitecek?', listTitle: '',
      todoLeft: (n) => `${n} iş kaldı. güneş batmadan.`, allDone: 'hepsi bitti. şimdi limonata zamanı.',
      timerIdle: 'daha iyi bir sen mümkün', timerRunning: 'daha iyi bir sen mümkün', timerPaused: 'deniz molası…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      tagline: 'daha yavaş, daha bilinçli.', sticky: 'good days ahead',
      subs: {}, moodPrefix: 'şu an: ', moodLabels: null
    },
    cilek: {
      tabs: { home: 'Bugün', badges: 'Rozetler', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Piknikten önce ne bitecek?', listTitle: '',
      todoLeft: (n) => `${n} iş kaldı. çilekler bekliyor.`, allDone: 'hepsi bitti. çilek zamanı.',
      timerIdle: 'bugün yine güzel şeyler mümkün', timerRunning: 'bugün yine güzel şeyler mümkün', timerPaused: 'kısa bir mola…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      tagline: 'küçük molalar, büyük huzur.', sticky: 'good days ahead',
      subs: {}, moodPrefix: 'şu an: ', moodLabels: null
    },
    mum: {
      tabs: { home: 'Bugün', badges: 'Rozetler', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Mum sönmeden ne bitecek?', listTitle: '',
      todoLeft: (n) => `${n} iş kaldı. mumlar dayanır mı?`, allDone: 'hepsi bitti. mumları söndürebilirsin.',
      timerIdle: 'aynı rüyalara, daha sakin günlere', timerRunning: 'aynı rüyalara, daha sakin günlere', timerPaused: 'mum molası…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      tagline: 'küçük molalar, büyük huzur.', sticky: 'good things take time',
      subs: {}, moodPrefix: 'şu an: ', moodLabels: null
    },
    yagmur: {
      tabs: { home: 'Bugün', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Yağmur dinerken ne bitecek?', listTitle: '',
      todoLeft: (n) => `${n} iş kaldı, yağmur da bitmedi`, allDone: 'hepsi bitti. yağmuru dinle biraz.',
      timerIdle: 'bir kahve, bir plan, daha iyi bir sen', timerRunning: 'bir kahve, bir plan, daha iyi bir sen', timerPaused: 'cama bakma molası…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      tagline: 'yağmur yağar, iş biter.', sticky: 'küçük adımlar büyük günler',
      subs: {}, moodPrefix: 'şu an: ', moodLabels: null
    },
    kar: {
      tabs: { home: 'Bugün', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Kar yağarken ne bitecek?', listTitle: '',
      todoLeft: (n) => `${n} iş kaldı, kar da durmadı`, allDone: 'hepsi bitti. sıcak çikolata zamanı.',
      timerIdle: 'aynı gökyüzü altında, daha iyi bir sen mümkün', timerRunning: 'aynı gökyüzü altında, daha iyi bir sen mümkün', timerPaused: 'kar tanelerini sayma molası…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      tagline: 'küçük adımlar, büyük huzur.', sticky: 'sıcak çay, sakin kalp',
      subs: {}, moodPrefix: 'şu an: ', moodLabels: null
    },
    disket: {
      tabs: { home: 'Bugün', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayar' },
      newNote: '+ YENİ.TXT', newNoteSub: '',
      saved: 'kaydedildi (A:)', typing: 'yazılıyor...',
      todoPlaceholder: 'yeni görev yaz...', listTitle: 'YAPILACAK.LST',
      todoLeft: (n) => `${n} görev açık`, allDone: 'tüm görevler tamam. sistem şaşkın.',
      timerIdle: '> hazır_', timerRunning: '> odaklanma modu aktif_', timerPaused: '> duraklatıldı_',
      cancel: 'İptal', cancelNote: '', talkMax: 'Çok',
      delayLabel: (p) => `Yükleniyor: işler %${p} tamam`, delayMode: 'done',
      delayNote: (p) => (p >= 100 ? 'tahmini bitiş: şimdi. vay.' : p >= 50 ? 'tahmini bitiş: bugün, belki' : 'tahmini bitiş: belki yarın'),
      subs: {},
      moodPrefix: 'C:\\NERO> ruh_hali: ',
      moodLabels: {
        content: 'keyfi_yerinde', happy: 'keyifli.exe', bored: 'sıkılıyor...',
        sulky: 'küs (hata 404: ilgi)', lonely: 'bağlantı_koptu', asleep: 'uyku_modu'
      }
    },
    gece: {
      tabs: { home: 'Bugün', badges: 'Rozetler', notes: 'Notlar', todos: 'İşler', timer: 'Zaman', settings: 'Ayarlar' },
      newNote: 'yeni not', newNoteSub: '',
      saved: 'kaydedildi', typing: 'yazılıyor…',
      todoPlaceholder: 'Bu gece ne bitiyor?', listTitle: '',
      todoLeft: (n) => `${n} iş kaldı, gece uzun`, allDone: 'hepsi bitti. artık uyu.',
      timerIdle: 'gece odak modu', timerRunning: 'gece odak modu', timerPaused: 'yıldızlara bakma molası…',
      cancel: 'Bırak', cancelNote: '', talkMax: 'Çok',
      subs: {},
      moodPrefix: '', moodLabels: null
    },
    pazartesi: {
      tabs: { home: 'Bugün', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayarlar' },
      newNote: 'bir not daha', newNoteSub: '(okuyacak mısın?)',
      saved: 'otomatik kaydedildi, sen unutsan da', typing: 'yazıyorsun, izliyorum…',
      todoPlaceholder: 'Yine ne sözü veriyoruz?', listTitle: 'Yapılacaklar <span>(iddialı)</span>',
      todoLeft: (n) => `${n} iş kaldı. Nero şüpheli.`, allDone: 'hepsi bitti?! kontrol edeceğim.',
      timerIdle: 'hadi bakalım', timerRunning: 'kaçarsan görürüm', timerPaused: 'mola mı? hemen mi?',
      cancel: 'Pes et', cancelNote: '(Nero kırılır)', talkMax: 'Çenesi düştü',
      subs: {
        theme: 'kılık değiştirmek serbest',
        talk: '',
        muted: 'Nero susar. Küser ama susar.',
        badge: 'sayaç hep gözünün önünde',
        sound: 'bitince zil çalar, sen de kalkarsın',
        top: 'kaçış yok',
        startup: 'sabah ilk o karşılar',
        lock: 'kıpırdamaz. inatçı.',
        stay: 'masaüstünü gösterince de kaçmaz',
        name: 'roast ederken lazım',
        desk: 'uzun süre yoksan pusuda bekler',
        peek: 'arada bir ekranın ortasında belirir. bö!',
        scene: 'kapatırsan düz renk kalır',
        ambient: 'yağmur, rüzgar, mum çıtırtısı gibi çok kısık sesler',
        quick: 'antivirüs bazı sistemlerde buna şüpheyle bakabilir',
        break: 'omurgan teşekkür edecek',
        summary: 'akşam 7\'den sonra karne verir',
        bday: 'o gün parti şapkası takar',
        reset: '(hafızası silinir, kini kalır)'
      },
      moodPrefix: 'şu an: ',
      moodLabels: {
        content: 'katlanılabilir.', happy: 'neşeli. geçer.', bored: 'sıkılıyor.',
        sulky: 'küs. yüzüne bakmıyor.', lonely: 'terk edilmiş hissediyor.', asleep: 'uyuyor. sessiz ol.'
      }
    }
  };
  let skinName = 'cozy';
  const skin = () => SKINS[skinName] || SKINS.cozy;

  function applyUi(ui = {}) {
    for (const [key, cssVar] of Object.entries(UI_VARS)) {
      if (ui[key]) document.documentElement.style.setProperty(cssVar, ui[key]);
    }
    noteColors = Array.isArray(ui.noteColors) && ui.noteColors.length ? ui.noteColors : DEFAULT_NOTE_COLORS;
    const next = SKINS[ui.skin] ? ui.skin : 'cozy';
    if (next !== skinName || !document.documentElement.dataset.skin) {
      skinName = next;
      document.documentElement.dataset.skin = skinName;
      applySkinText();
      if (state) { renderNotes(); renderTodos(); renderTimer(state.timer); renderMood(state.mood); }
    }
  }

  function applySkinText() {
    const k = skin();
    const FALLBACK_TABS = { home: 'Bugün', badges: 'Rozetler', notes: 'Notlar', todos: 'İşler', timer: 'Zaman', settings: 'Ayarlar' };
    for (const el of document.querySelectorAll('.tl')) el.textContent = k.tabs[el.dataset.k] || FALLBACK_TABS[el.dataset.k];
    $('todo-input').placeholder = k.todoPlaceholder;
    $('list-title').innerHTML = k.listTitle;
    $('timer-cancel').textContent = k.cancel;
    $('cancel-note').textContent = k.cancelNote;
    $('talk-cok').textContent = k.talkMax;
    $('tagline').textContent = k.tagline || '';
    $('sticky-text').textContent = k.sticky || '';
    for (const el of document.querySelectorAll('.sub')) el.textContent = k.subs[el.dataset.sub] || '';
  }

  // Her not kimliğine göre hep aynı renk ve eğimi alır.
  function noteStyle(id) {
    let h = 0;
    for (const ch of String(id)) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
    return {
      color: noteColors[h % noteColors.length],
      tilt: `${((h >> 4) % 5) - 2}deg`
    };
  }

  // ---------------------------------------------------------------------------
  // Sekmeler
  // ---------------------------------------------------------------------------
  const tabButtons = [...document.querySelectorAll('.tabs [role="tab"]')];
  function selectTab(tab) {
    currentTab = tab;
    document.documentElement.dataset.tab = tab;
    for (const b of tabButtons) b.setAttribute('aria-selected', String(b.dataset.tab === tab));
    $('settings-button').setAttribute('aria-pressed', String(tab === 'settings'));
    for (const v of document.querySelectorAll('.view')) v.hidden = v.id !== `view-${tab}`;
    if (tab === 'todos') setTimeout(() => $('todo-input').focus(), 30);
    if (tab === 'home') setTimeout(markHomeDialogueSeen, 60);
  }
  tabButtons.forEach((b) => b.addEventListener('click', () => selectTab(b.dataset.tab)));
  $('settings-button').addEventListener('click', () => selectTab('settings'));
  $('close').addEventListener('click', () => api.invoke('panel:hide'));
  $('minimize').addEventListener('click', () => api.invoke('panel:minimize'));
  $('pin').addEventListener('click', () => set('panelPinned', !(state && state.settings.panelPinned)));

  // Panel sürükleme: Windows native app-region yerine açık pointer gesture.
  // Kayıp pointerup olsa bile bir sonraki gesture eski state'i önce temizler.
  const panelDragZone = document.querySelector('.panel-drag-zone');
  let panelDragActive = false;

  function endPanelDrag(pointerId = null) {
    if (!panelDragActive) return;
    panelDragActive = false;
    panelDragZone.classList.remove('dragging');
    if (pointerId != null) {
      try { panelDragZone.releasePointerCapture(pointerId); } catch (_) { /* yoksay */ }
    }
    api.send('panel:dragEnd');
  }

  panelDragZone.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || state?.settings?.lockPosition) return;
    if (panelDragActive) endPanelDrag(e.pointerId);
    panelDragActive = true;
    panelDragZone.classList.add('dragging');
    try { panelDragZone.setPointerCapture(e.pointerId); } catch (_) { /* yoksay */ }
    api.send('panel:dragStart');
  });
  panelDragZone.addEventListener('pointermove', (e) => {
    if (panelDragActive && (e.buttons & 1) === 0) endPanelDrag(e.pointerId);
  });
  panelDragZone.addEventListener('pointerup', (e) => {
    if (e.button === 0) endPanelDrag(e.pointerId);
  });
  panelDragZone.addEventListener('pointercancel', (e) => endPanelDrag(e.pointerId));
  panelDragZone.addEventListener('lostpointercapture', () => endPanelDrag());
  window.addEventListener('blur', () => endPanelDrag());
  api.on('interaction:reset', () => {
    panelDragActive = false;
    panelDragZone.classList.remove('dragging');
  });

  // Köşe tutamaçlarından boyutlandırma
  for (const grip of document.querySelectorAll('.grip')) {
    grip.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      grip.setPointerCapture(e.pointerId);
      api.send('panel:resizeStart', grip.dataset.side);
    });
    const end = (e) => {
      try { grip.releasePointerCapture(e.pointerId); } catch (_) { /* yoksay */ }
      api.send('panel:resizeEnd');
    };
    grip.addEventListener('pointerup', end);
    grip.addEventListener('lostpointercapture', () => api.send('panel:resizeEnd'));
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!$('note-editor-view').hidden) closeEditor();
      else api.invoke('panel:hide');
    }
  });

  // ---------------------------------------------------------------------------
  // Ruh hali satırı
  // ---------------------------------------------------------------------------
  const SVGNS = 'http://www.w3.org/2000/svg';
  const HEART = 'M7 12.5S1.2 8.9 1.2 5.1A2.9 2.9 0 0 1 7 3.8a2.9 2.9 0 0 1 5.8 1.3C12.8 8.9 7 12.5 7 12.5z';

  function renderMeter(happiness) {
    const box = $('meter');
    box.textContent = '';
    box.setAttribute('aria-valuenow', String(happiness));

    if (skinName === 'latte') {
      // Keyif kadar dolan bir kahve fincanı
      const level = 23.5 - 11 * (happiness / 100);
      box.innerHTML = `<svg class="cup" viewBox="0 0 30 30" aria-hidden="true">
        <defs><clipPath id="cupclip"><path d="M6.5 11h14.5v7a6.5 6.5 0 0 1-6.5 6.5h-1.5A6.5 6.5 0 0 1 6.5 18z"/></clipPath></defs>
        <path class="steam-line" d="M11 3c-1 2 1 3 0 5M16 3c-1 2 1 3 0 5"/>
        <path class="cup-body" d="M5 10h17v8a7 7 0 0 1-7 7h-3a7 7 0 0 1-7-7z"/>
        <rect class="cup-fill" x="5" y="${level.toFixed(1)}" width="17" height="20" clip-path="url(#cupclip)"/>
        <path class="cup-handle" d="M22 13h2.5a3 3 0 0 1 0 6H22"/>
      </svg><span class="cup-text">keyif %${happiness}</span>`;
      return;
    }

    if (['yagmur', 'kar', 'cilek', 'mum', 'ege'].includes(skinName)) return; // bu temalarda gösterge yok, başlık sahneye ait

    if (skinName === 'kasaba') {
      const up = happiness >= 50;
      box.innerHTML = `<span class="index">keyif endeksi <b class="${up ? 'up' : 'down'}">${up ? '▲' : '▼'}</b> %${happiness}</span>`;
      return;
    }

    if (skinName === 'disket') {
      // Piksel blok çubuk
      const on = Math.round(happiness / 10);
      const blocks = Array.from({ length: 10 }, (_, i) => `<i${i < on ? '' : ' class="off"'}></i>`).join('');
      box.innerHTML = `<span class="px-label">KEYİF</span><span class="px-blocks">${blocks}</span><span class="px-label">%${happiness}</span>`;
      return;
    }

    if (skinName === 'gece') {
      // Keyif arttıkça dolunaya dönen ay
      const shift = (1 - happiness / 100) * 20;
      box.innerHTML = `<svg class="moon" viewBox="0 0 24 24" aria-hidden="true">
        <defs><mask id="moonmask"><rect width="24" height="24" fill="#fff"/><circle cx="${(12 - 20 + shift).toFixed(1)}" cy="10" r="10" fill="#000"/></mask></defs>
        <circle class="moon-bg" cx="12" cy="12" r="10"/>
        <circle class="moon-fg" cx="12" cy="12" r="10" mask="url(#moonmask)"/>
      </svg><span class="moon-text">keyif %${happiness}</span>`;
      return;
    }

    if (skinName === 'pazartesi') {
      // Huysuzluk ölçer: keyif düştükçe ibre kırmızıya döner
      const grump = 100 - happiness;
      const a = Math.PI * (1 - grump / 100);
      const x = 40 + 27 * Math.cos(a);
      const y = 40 - 27 * Math.sin(a);
      box.innerHTML = `<svg class="gauge" viewBox="0 0 80 46" aria-hidden="true">
        <path d="M8 40 A32 32 0 0 1 29 10" stroke="#8EDDC4" stroke-width="9" fill="none"/>
        <path d="M29 10 A32 32 0 0 1 51 10" stroke="#FFFDF6" stroke-width="9" fill="none"/>
        <path d="M51 10 A32 32 0 0 1 72 40" stroke="#FF6F59" stroke-width="9" fill="none"/>
        <path d="M8 40 A32 32 0 0 1 72 40" stroke="var(--ink)" stroke-width="2.5" fill="none"/>
        <path d="M40 40 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="var(--ink)" stroke-width="3.5" stroke-linecap="round"/>
        <circle cx="40" cy="40" r="4.5" fill="var(--ink)"/>
      </svg><span class="gauge-text">huysuzluk ölçer</span>`;
      return;
    }

    const filled = happiness / 20; // 0-5 kalp
    for (let i = 0; i < 5; i++) {
      const part = Math.max(0, Math.min(1, filled - i));
      const svg = document.createElementNS(SVGNS, 'svg');
      svg.setAttribute('viewBox', '0 0 14 14');
      svg.classList.add('heart');
      const clipId = `hc${i}`;
      svg.innerHTML = `<defs><clipPath id="${clipId}"><rect x="0" y="0" width="${(14 * part).toFixed(1)}" height="14"/></clipPath></defs>`
        + `<path class="h-bg" d="${HEART}"/><path class="h-fg" d="${HEART}" clip-path="url(#${clipId})"/>`;
      box.appendChild(svg);
    }
  }

  function renderMood(m) {
    if (!m) return;
    renderMeter(m.happiness);
    const k = skin();
    const key = m.asleep ? 'asleep' : (m.stage === 'content' && m.happiness >= 80 ? 'happy' : m.stage);
    $('mood-label').textContent = k.moodLabels ? `${k.moodPrefix}${k.moodLabels[key]}` : `${k.moodPrefix || ''}${m.label.toLowerCase()}.`;
    let detail = '';
    if (m.asleep) detail = 'sen uzaktayken kestiriyor.';
    else if (m.ignoredMinutes >= 60) {
      const h = Math.floor(m.ignoredMinutes / 60);
      const min = m.ignoredMinutes % 60;
      detail = `${h} saat${min ? ` ${min} dakika` : ''}dır kimse ilgilenmedi.`;
    } else if (m.ignoredMinutes >= 5) detail = `${m.ignoredMinutes} dakikadır sessiz.`;
    else detail = 'az önce ilgilendin, memnun. belli etmiyor.';
    $('mood-detail').textContent = detail;
  }

  // ---------------------------------------------------------------------------
  // Notlar + aylık arşivler
  // ---------------------------------------------------------------------------
  let editingId = null;
  let editingArchived = false;
  let saveTimer = null;
  const dateFmt = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  const archiveMonthFmt = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' });

  function monthKeyFromTime(value) {
    const d = new Date(Number(value) || Date.now());
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  function archiveMonthTitle(value) {
    const d = new Date(Number(value) || Date.now());
    const text = archiveMonthFmt.format(d);
    return text ? text.charAt(0).toLocaleUpperCase('tr-TR') + text.slice(1) : '';
  }

  function groupByArchiveMonth(items, getTime) {
    const groups = new Map();
    for (const item of items) {
      const time = getTime(item) || Date.now();
      const key = monthKeyFromTime(time);
      if (!groups.has(key)) groups.set(key, { key, title: archiveMonthTitle(time), items: [] });
      groups.get(key).items.push(item);
    }
    return [...groups.values()].sort((a, b) => b.key.localeCompare(a.key));
  }

  function renderMonthlyArchive(container, items, { getTime, renderItem }) {
    const openMonths = new Set([...container.querySelectorAll('details[open][data-month]')].map((el) => el.dataset.month));
    container.textContent = '';
    const groups = groupByArchiveMonth(items, getTime);
    for (const group of groups) {
      group.items.sort((a, b) => (getTime(b) || 0) - (getTime(a) || 0));
      const details = document.createElement('details');
      details.className = 'archive-month';
      details.dataset.month = group.key;
      details.open = openMonths.has(group.key);
      const summary = document.createElement('summary');
      const title = document.createElement('strong');
      title.textContent = group.title;
      const count = document.createElement('span');
      count.textContent = `${group.items.length}`;
      summary.append(title, count);
      const body = document.createElement('div');
      body.className = 'archive-month-body';
      for (const item of group.items) body.appendChild(renderItem(item));
      details.append(summary, body);
      container.appendChild(details);
    }
  }

  function renderNotes() {
    const list = $('notes-list');
    list.textContent = '';
    const notes = state.notes || [];
    const activeNotes = notes.filter((note) => !note.archivedAt);
    const archivedNotes = notes.filter((note) => note.archivedAt);

    const add = document.createElement('li');
    add.className = 'new-note';
    add.tabIndex = 0;
    add.innerHTML = '<span class="plus">+</span><span class="nn"></span><span class="nn-sub"></span>';
    add.querySelector('.nn').textContent = skin().newNote;
    add.querySelector('.nn-sub').textContent = skin().newNoteSub;
    add.addEventListener('click', () => openEditor(null));
    add.addEventListener('keydown', (e) => { if (e.key === 'Enter') openEditor(null); });
    list.appendChild(add);

    for (const note of activeNotes) {
      const lines = note.body.trim().split('\n');
      const look = noteStyle(note.id);
      const li = document.createElement('li');
      li.tabIndex = 0;
      li.style.setProperty('--note', look.color);
      li.style.setProperty('--tilt', look.tilt);
      const title = document.createElement('div');
      title.className = 'note-title';
      title.textContent = lines[0] || 'boş not';
      const preview = document.createElement('div');
      preview.className = 'note-preview';
      preview.textContent = lines.slice(1).join(' ').trim();
      const date = document.createElement('div');
      date.className = 'note-date';
      date.textContent = dateFmt.format(new Date(note.updatedAt));
      li.insertAdjacentHTML('afterbegin',
        '<svg class="clip" viewBox="0 0 16 34" aria-hidden="true"><path d="M5 10V26a4 4 0 0 0 8 0V6a3 3 0 0 0-6 0v19"/></svg>'
        + '<svg class="pin" viewBox="0 0 22 22" aria-hidden="true"><circle cx="11" cy="9" r="7"/><path d="M11 16v5"/></svg>');
      const fname = document.createElement('div');
      fname.className = 'fname';
      fname.textContent = `${fileName(lines[0])}.TXT`;
      li.append(fname, title);
      if (preview.textContent) li.append(preview);
      li.append(date);
      if (Date.now() - note.updatedAt > 3 * 24 * 3600 * 1000) {
        li.insertAdjacentHTML('beforeend', '<span class="stamp note-stamp" aria-hidden="true">OKUNMADI</span>');
      }
      li.addEventListener('click', () => openEditor(note));
      li.addEventListener('keydown', (e) => { if (e.key === 'Enter') openEditor(note); });
      list.appendChild(li);
    }

    const drawer = $('notes-archive');
    drawer.hidden = archivedNotes.length === 0;
    $('notes-archive-count').textContent = archivedNotes.length ? `${archivedNotes.length} not` : '';
    if (archivedNotes.length) {
      renderMonthlyArchive($('notes-archive-months'), archivedNotes, {
        getTime: (note) => note.archivedAt || note.updatedAt || note.createdAt,
        renderItem: (note) => {
          const row = document.createElement('div');
          row.className = 'archive-entry note-archive-entry';
          const lines = String(note.body || '').trim().split('\n');
          const main = document.createElement('button');
          main.type = 'button';
          main.className = 'archive-entry-main';
          const title = document.createElement('strong');
          title.textContent = lines[0] || 'boş not';
          const meta = document.createElement('span');
          meta.textContent = dateFmt.format(new Date(note.updatedAt || note.createdAt));
          main.append(title, meta);
          main.addEventListener('click', () => openEditor(note));
          const restore = document.createElement('button');
          restore.type = 'button';
          restore.className = 'chip archive-restore';
          restore.textContent = 'Geri al';
          restore.addEventListener('click', () => api.invoke('notes:archive', note.id, false));
          row.append(main, restore);
          return row;
        }
      });
    }
  }

  // Disket teması için not başlığından 8 harflik dosya adı
  function fileName(title) {
    const map = { ç: 'C', ğ: 'G', ı: 'I', i: 'I', ö: 'O', ş: 'S', ü: 'U' };
    const clean = String(title || 'NOT').toLocaleLowerCase('tr-TR').replace(/[çğıiöşü]/g, (c) => map[c])
      .toUpperCase().replace(/[^A-Z0-9]/g, '');
    return (clean || 'NOT').slice(0, 8);
  }

  function openEditor(note) {
    editingId = note ? note.id : null;
    editingArchived = !!note?.archivedAt;
    $('note-body').value = note ? note.body : '';
    $('note-paper').style.setProperty('--note', noteStyle(note ? note.id : `yeni-${Date.now()}`).color);
    $('note-save-state').textContent = note ? skin().saved : '';
    $('note-archive').hidden = !note;
    $('note-archive').textContent = editingArchived ? 'Arşivden çıkar' : 'Arşivle';
    updateFormHead(note ? note.body : '', note ? note.updatedAt : Date.now());
    $('notes-list-view').hidden = true;
    $('note-editor-view').hidden = false;
    $('note-body').focus();
  }

  const shortDate = new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit' });
  function updateFormHead(body, at) {
    $('form-subject').textContent = (body.trim().split('\n')[0] || '…').slice(0, 40);
    $('form-date').textContent = shortDate.format(new Date(at));
  }

  async function saveNote() {
    clearTimeout(saveTimer);
    const body = $('note-body').value;
    if (!editingId && !body.trim()) return null;
    const saved = await api.invoke('notes:save', { id: editingId, body });
    editingId = saved.id;
    editingArchived = !!saved.archivedAt;
    $('note-save-state').textContent = skin().saved;
    $('note-archive').hidden = false;
    $('note-archive').textContent = editingArchived ? 'Arşivden çıkar' : 'Arşivle';
    return saved;
  }

  async function closeEditor({ save = true } = {}) {
    if (save) await saveNote();
    $('note-editor-view').hidden = true;
    $('notes-list-view').hidden = false;
    editingId = null;
    editingArchived = false;
  }

  $('note-back').addEventListener('click', () => closeEditor());
  $('note-body').addEventListener('input', () => {
    $('note-save-state').textContent = skin().typing;
    updateFormHead($('note-body').value, Date.now());
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveNote, 700);
  });
  $('note-archive').addEventListener('click', async () => {
    const saved = await saveNote();
    if (!saved?.id) return;
    await api.invoke('notes:archive', saved.id, !editingArchived);
    await closeEditor({ save: false });
  });
  $('note-delete').addEventListener('click', async () => {
    clearTimeout(saveTimer);
    if (editingId) await api.invoke('notes:delete', editingId);
    await closeEditor({ save: false });
  });

  // ---------------------------------------------------------------------------
  // Yapılacaklar + kullanıcı kontrollü aylık arşivler
  // ---------------------------------------------------------------------------
  const CHECK_SVG = '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6.5l2.6 2.6L10 3.5"/></svg>';
  const ARCHIVE_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 6h12v10H4zM3 3.5h14V7H3zM8 10h4"/></svg>';
  const PLAY_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5l8 5-8 5z"/></svg>';
  const PAUSE_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10M13 5v10"/></svg>';

  function todoElapsedMs(todo, now = Date.now()) {
    const base = Math.max(0, Number(todo?.actualDurationMs) || 0);
    const started = Number(todo?.stopwatchStartedAt) || 0;
    return started ? base + Math.max(0, now - started) : base;
  }

  function todoStopwatchText(ms) {
    const totalSec = Math.max(0, Math.floor(Number(ms || 0) / 1000));
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${m}:${String(s).padStart(2, '0')}`;
  }

  function updateTodoStopwatchClocks() {
    if (!state?.todos) return;
    const byId = new Map(state.todos.map((todo) => [String(todo.id), todo]));
    for (const el of document.querySelectorAll('[data-todo-elapsed]')) {
      const todo = byId.get(el.dataset.todoElapsed);
      if (!todo) continue;
      const ms = todoElapsedMs(todo);
      el.textContent = todo.stopwatchStartedAt ? `⏱ ${todoStopwatchText(ms)}` : `Gerçek: ${minutesText(Math.max(1, Math.round(ms / 60000)))}`;
    }
  }

  setInterval(updateTodoStopwatchClocks, 1000);

  function renderTodos() {
    if (document.querySelector('.todo-text[contenteditable="true"]')) return;
    const list = $('todo-list');
    list.textContent = '';
    const todos = state.todos || [];
    const activeTodos = todos.filter((todo) => !todo.archivedAt);
    const archivedTodos = todos.filter((todo) => todo.archivedAt);
    $('todos-empty').hidden = activeTodos.length > 0;
    $('todo-footer').hidden = activeTodos.length === 0;
    const open = activeTodos.filter((t) => !t.done).length;
    $('todo-count').textContent = open ? skin().todoLeft(open) : skin().allDone;
    const k = skin();
    $('delay').hidden = activeTodos.length === 0;
    if (k.delayMode === 'done') {
      const done = activeTodos.length ? Math.round(((activeTodos.length - open) / activeTodos.length) * 100) : 0;
      $('delay-label').textContent = k.delayLabel(done);
      $('delay-pct').textContent = '';
      $('delay-fill').style.width = `${done}%`;
      $('delay-note').textContent = k.delayNote(done);
    } else {
      const pct = activeTodos.length ? Math.max(3, Math.min(97, Math.round((open / activeTodos.length) * 100) - 3)) : 0;
      $('delay-label').textContent = 'Erteleme ihtimali';
      $('delay-pct').textContent = `%${pct}`;
      $('delay-fill').style.width = `${pct}%`;
      $('delay-note').textContent = '';
    }
    $('todo-clear').hidden = !activeTodos.some((t) => t.done);

    const sorted = [...activeTodos].sort((a, b) => Number(a.done) - Number(b.done));
    for (const todo of sorted) {
      const li = document.createElement('li');
      li.classList.toggle('done', todo.done);

      const check = document.createElement('button');
      check.className = 'check';
      check.type = 'button';
      check.setAttribute('aria-label', todo.done ? 'Bitmedi olarak işaretle' : 'Bitti olarak işaretle');
      check.innerHTML = CHECK_SVG;
      check.addEventListener('click', () => api.invoke('todos:toggle', todo.id));

      const main = document.createElement('div');
      main.className = 'todo-main';

      const text = document.createElement('span');
      text.className = 'todo-text';
      text.textContent = todo.text;
      text.title = 'Düzenlemek için çift tıkla';
      text.addEventListener('dblclick', () => startRename(text, todo));
      main.appendChild(text);

      const elapsed = todoElapsedMs(todo);
      if (todo.plannedDurationMin || elapsed > 0 || todo.stopwatchStartedAt) {
        const meta = document.createElement('div');
        meta.className = 'todo-meta';
        if (todo.plannedDurationMin) {
          const plan = document.createElement('span');
          plan.textContent = `Plan: ${minutesText(todo.plannedDurationMin)}`;
          meta.appendChild(plan);
        }
        if (elapsed > 0 || todo.stopwatchStartedAt) {
          const actual = document.createElement('span');
          actual.dataset.todoElapsed = String(todo.id);
          actual.className = todo.stopwatchStartedAt ? 'todo-actual running' : 'todo-actual';
          actual.textContent = todo.stopwatchStartedAt
            ? `⏱ ${todoStopwatchText(elapsed)}`
            : `Gerçek: ${minutesText(Math.max(1, Math.round(elapsed / 60000)))}`;
          meta.appendChild(actual);
        }
        main.appendChild(meta);
      }

      const stopwatch = document.createElement('button');
      stopwatch.type = 'button';
      stopwatch.className = `todo-stopwatch${todo.stopwatchStartedAt ? ' running' : ''}`;
      stopwatch.hidden = !!todo.done;
      stopwatch.setAttribute('aria-label', todo.stopwatchStartedAt ? 'İş kronometresini duraklat' : (elapsed > 0 ? 'İş kronometresine devam et' : 'İş kronometresini başlat'));
      stopwatch.title = todo.stopwatchStartedAt ? 'Kronometreyi duraklat' : (elapsed > 0 ? 'Kronometreye devam et' : 'Kronometreyi başlat');
      stopwatch.innerHTML = todo.stopwatchStartedAt ? PAUSE_SVG : PLAY_SVG;
      stopwatch.addEventListener('click', () => api.invoke(todo.stopwatchStartedAt ? 'todos:stopwatchPause' : 'todos:stopwatchStart', todo.id));

      const del = document.createElement('button');
      del.className = 'todo-del';
      del.type = 'button';
      del.setAttribute('aria-label', 'Sil');
      del.textContent = '×';
      del.addEventListener('click', () => api.invoke('todos:delete', todo.id));

      const archive = document.createElement('button');
      archive.className = 'todo-archive';
      archive.type = 'button';
      archive.setAttribute('aria-label', 'Arşivle');
      archive.title = 'Arşivle';
      archive.innerHTML = ARCHIVE_SVG;
      archive.hidden = !todo.done;
      archive.addEventListener('click', () => api.invoke('todos:archive', todo.id, true));

      const bell = document.createElement('label');
      bell.className = `todo-bell${todo.remindAt ? ' set' : ''}`;
      bell.title = todo.remindAt ? 'Hatırlatmayı kaldırmak için saati sil' : 'Hatırlatma ekle';
      const at = todo.remindAt ? new Date(todo.remindAt) : null;
      bell.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="11" r="6.5"/><path d="M10 7.5V11l2.2 1.6"/></svg>';
      const tInput = document.createElement('input');
      tInput.type = 'time';
      tInput.setAttribute('aria-label', 'Hatırlatma saati');
      if (at) tInput.value = `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`;
      tInput.addEventListener('change', () => api.invoke('todos:setReminder', todo.id, tInput.value));
      bell.appendChild(tInput);
      if (todo.done) bell.hidden = true;

      li.append(check, main, stopwatch, bell, archive, del);
      if (todo.done) li.insertAdjacentHTML('beforeend', '<span class="stamp todo-stamp" aria-hidden="true">OLDU BU İŞ</span>');
      list.appendChild(li);
    }

    const drawer = $('todos-archive');
    drawer.hidden = archivedTodos.length === 0;
    $('todos-archive-count').textContent = archivedTodos.length ? `${archivedTodos.length} iş` : '';
    if (archivedTodos.length) {
      renderMonthlyArchive($('todos-archive-months'), archivedTodos, {
        getTime: (todo) => todo.doneAt || todo.archivedAt,
        renderItem: (todo) => {
          const row = document.createElement('div');
          row.className = 'archive-entry todo-archive-entry';
          const main = document.createElement('div');
          main.className = 'archive-entry-main';
          const title = document.createElement('strong');
          title.textContent = todo.text;
          const meta = document.createElement('span');
          const parts = [new Date(todo.doneAt || todo.archivedAt).toLocaleDateString('tr-TR')];
          if (todo.plannedDurationMin) parts.push(`Plan: ${minutesText(todo.plannedDurationMin)}`);
          const actualMs = Math.max(0, Number(todo.actualDurationMs) || 0);
          if (actualMs > 0) parts.push(`Gerçek: ${minutesText(Math.max(1, Math.round(actualMs / 60000)))}`);
          meta.textContent = parts.join(' · ');
          main.append(title, meta);
          const restore = document.createElement('button');
          restore.type = 'button';
          restore.className = 'chip archive-restore';
          restore.textContent = 'Geri al';
          restore.addEventListener('click', () => api.invoke('todos:archive', todo.id, false));
          row.append(main, restore);
          return row;
        }
      });
    }
  }

  function startRename(el, todo) {
    el.contentEditable = 'true';
    el.focus();
    document.getSelection().selectAllChildren(el);
    const finish = (commit) => {
      el.contentEditable = 'false';
      el.removeEventListener('blur', onBlur);
      el.removeEventListener('keydown', onKey);
      const value = el.textContent.trim();
      if (commit && value && value !== todo.text) api.invoke('todos:rename', todo.id, value);
      else el.textContent = todo.text;
    };
    const onBlur = () => finish(true);
    const onKey = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); finish(true); }
      if (e.key === 'Escape') { e.stopPropagation(); finish(false); }
    };
    el.addEventListener('blur', onBlur);
    el.addEventListener('keydown', onKey);
  }

  $('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('todo-input');
    const text = input.value.trim();
    if (!text) return;
    const time = $('todo-time').value;
    const planned = $('todo-duration').value;
    input.value = '';
    $('todo-time').value = '';
    $('todo-duration').value = '';
    await api.invoke('todos:add', text, time, planned);
  });
  $('todo-clear').addEventListener('click', () => api.invoke('todos:archiveDone'));

  // ---------------------------------------------------------------------------
  // Zamanlayıcı
  // ---------------------------------------------------------------------------
  const RING = 2 * Math.PI * 86;
  let chosenMinutes = 25;

  function fmt(ms) {
    const total = Math.ceil(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  }

  function renderTimer(t) {
    if (!t) return;
    const idle = t.status === 'idle';
    $('timer-setup').hidden = !idle;
    $('timer-start').hidden = !idle;
    $('timer-pause').hidden = t.status !== 'running';
    $('timer-resume').hidden = t.status !== 'paused';
    $('timer-cancel').hidden = idle;
    $('cancel-note').hidden = idle;

    if (idle) {
      $('timer-digits').textContent = fmt(chosenMinutes * 60000);
      $('timer-status').textContent = skin().timerIdle;
      $('ring-fill').style.strokeDashoffset = String(RING);
      $('lcd-fill').style.width = '0%';
    } else {
      $('lcd-fill').style.width = `${Math.round(Math.min(1, t.progress) * 100)}%`;
      $('timer-digits').textContent = fmt(t.remainingMs);
      $('timer-status').textContent = t.status === 'paused'
        ? skin().timerPaused
        : (t.label || skin().timerRunning);
      $('ring-fill').style.strokeDashoffset = String(RING * (1 - Math.min(1, t.progress)));
    }
  }

  function choose(minutes) {
    chosenMinutes = Math.max(1, Math.min(600, Math.round(Number(minutes) || 25)));
    $('timer-custom').value = chosenMinutes;
    for (const b of document.querySelectorAll('#presets button')) {
      b.classList.toggle('on', Number(b.dataset.min) === chosenMinutes);
    }
    if (!state || state.timer.status === 'idle') $('timer-digits').textContent = fmt(chosenMinutes * 60000);
  }

  document.querySelectorAll('#presets button').forEach((b) => b.addEventListener('click', () => choose(b.dataset.min)));
  $('timer-custom').addEventListener('change', (e) => choose(e.target.value));
  $('timer-start').addEventListener('click', () => api.invoke('timer:start', chosenMinutes, $('timer-label').value.trim()));
  $('timer-pause').addEventListener('click', () => api.invoke('timer:pause'));
  $('timer-resume').addEventListener('click', () => api.invoke('timer:resume'));
  $('timer-cancel').addEventListener('click', () => api.invoke('timer:cancel'));

  // ---------------------------------------------------------------------------
  // Ayarlar
  // ---------------------------------------------------------------------------
  const set = (key, value) => api.invoke('settings:set', key, value);

  function renderSettings() {
    const s = state.settings;
    const select = $('set-theme');
    select.textContent = '';
    for (const t of state.themes) {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.name}${t.source === 'user' ? ' (eklenen)' : ''}${t.broken ? ' - bozuk' : ''}`;
      opt.disabled = t.broken;
      opt.selected = t.id === state.currentThemeId;
      select.appendChild(opt);
    }
    const current = state.themes.find((t) => t.id === state.currentThemeId);
    const errors = current?.errors || [];
    $('theme-errors').hidden = errors.length === 0;
    $('theme-errors').textContent = errors.length ? `Bu temada sorun var:\n${errors.join('\n')}` : '';

    const pct = Math.round(s.scale * 100);
    $('set-scale').value = pct;
    $('scale-out').textContent = `${pct}%`;
    for (const b of document.querySelectorAll('#set-talk button')) {
      b.setAttribute('aria-checked', String(b.dataset.value === s.talkativeness));
    }
    $('set-muted').checked = s.muted;
    $('set-badge').checked = s.showTimerBadge;
    $('set-sound').checked = s.sound;
    $('set-top').checked = s.alwaysOnTop;
    $('set-lock').checked = s.lockPosition;
    $('set-stay').checked = s.stayVisible !== false;
    $('set-desk').checked = s.desktopJokes !== false;
    $('set-peek').checked = s.peekVisits !== false;
    $('set-fx').checked = s.weatherFx !== false;
    $('set-scene').checked = s.sceneBg !== false;
    $('set-ambient').checked = !!s.ambientSound;
    $('set-quick').checked = !!s.quickCapture;
    $('quick-hint').textContent = s.quickCapture ? 'Ctrl + Alt + Boşluk ile aç' : 'Açtığında Ctrl + Alt + Boşluk ile bir not ya da iş ekleyebilirsin.';
    document.documentElement.classList.toggle('no-scene', s.sceneBg === false);
    document.documentElement.classList.toggle('no-fx', s.weatherFx === false);
    $('set-water').value = String(s.waterEvery || 0);
    $('set-break').value = String(s.breakEvery || 0);
    $('set-summary').checked = s.daySummary !== false;
    $('set-autoupdate').checked = s.autoUpdate !== false;
    const [bm, bd] = (s.birthday || '-').split('-');
    $('set-bday-month').value = bm || '';
    $('set-bday-day').value = bd || '';
    if (document.activeElement !== $('set-name')) $('set-name').value = s.userName || '';
    $('pin').setAttribute('aria-pressed', String(!!s.panelPinned));
    $('pin').title = s.panelPinned ? 'Sabitlemeyi kaldır' : 'Sabitle: Nero\'ya tıklayınca kapanmasın';
    $('set-startup').checked = s.launchAtStartup;
    $('char-hide').textContent = s.hidden ? 'Nero\'yu göster' : 'Nero\'yu gizle';
    $('app-version').textContent = `v${state.version}`;
    $('version').textContent = `Nero ${state.version}, Stenwick'ten sevgilerle`;
  }

  $('set-theme').addEventListener('change', (e) => set('themeId', e.target.value));
  $('set-scale').addEventListener('input', (e) => { $('scale-out').textContent = `${e.target.value}%`; });
  $('set-scale').addEventListener('change', (e) => set('scale', Number(e.target.value) / 100));
  document.querySelectorAll('#set-talk button').forEach((b) => b.addEventListener('click', () => set('talkativeness', b.dataset.value)));
  $('set-muted').addEventListener('change', (e) => set('muted', e.target.checked));
  $('set-badge').addEventListener('change', (e) => set('showTimerBadge', e.target.checked));
  $('set-sound').addEventListener('change', (e) => set('sound', e.target.checked));
  $('set-top').addEventListener('change', (e) => set('alwaysOnTop', e.target.checked));
  $('set-lock').addEventListener('change', (e) => set('lockPosition', e.target.checked));
  $('set-stay').addEventListener('change', (e) => set('stayVisible', e.target.checked));
  $('set-desk').addEventListener('change', (e) => set('desktopJokes', e.target.checked));
  $('set-peek').addEventListener('change', (e) => set('peekVisits', e.target.checked));
  $('set-fx').addEventListener('change', (e) => set('weatherFx', e.target.checked));
  $('set-scene').addEventListener('change', (e) => set('sceneBg', e.target.checked));
  $('set-ambient').addEventListener('change', (e) => set('ambientSound', e.target.checked));
  $('set-quick').addEventListener('change', (e) => set('quickCapture', e.target.checked));
  $('set-water').addEventListener('change', (e) => set('waterEvery', Number(e.target.value)));
  $('set-break').addEventListener('change', (e) => set('breakEvery', Number(e.target.value)));
  $('set-summary').addEventListener('change', (e) => set('daySummary', e.target.checked));
  $('set-autoupdate').addEventListener('change', (e) => set('autoUpdate', e.target.checked));
  const saveBday = () => {
    const m = $('set-bday-month').value;
    const d = $('set-bday-day').value;
    set('birthday', m && d ? `${m}-${d}` : '');
  };
  $('set-bday-month').addEventListener('change', saveBday);
  $('set-bday-day').addEventListener('change', saveBday);
  $('set-name').addEventListener('change', (e) => set('userName', e.target.value));
  $('set-startup').addEventListener('change', (e) => set('launchAtStartup', e.target.checked));
  $('themes-reload').addEventListener('click', () => api.invoke('themes:reload'));
  $('themes-folder').addEventListener('click', () => api.invoke('themes:openFolder'));
  $('themes-guide').addEventListener('click', () => api.invoke('themes:openGuide'));
  $('mood-reset').addEventListener('click', () => api.invoke('mood:reset'));
  $('char-hide').addEventListener('click', () => set('hidden', !state.settings.hidden));
  $('app-quit').addEventListener('click', () => api.invoke('app:quit'));

  // ---------------------------------------------------------------------------
  // Ana sayfa
  // ---------------------------------------------------------------------------
  const WEEKDAYS = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const longDate = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' });

  function minutesText(min) {
    if (min < 60) return `${min} dk`;
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m ? `${h} sa ${m} dk` : `${h} saat`;
  }

  const BADGE_RARITY_LABELS = {
    yaygin: 'Yaygın',
    siradisi: 'Sıradışı',
    nadir: 'Nadir',
    efsanevi: 'Efsanevi',
    gizli: 'Gizli'
  };
  let activeBadgeRarity = 'yaygin';

  function renderBadgeRarityTabs(list) {
    const tabs = [...document.querySelectorAll('#badge-rarity-tabs [data-rarity]')];
    const discoveredHidden = list.some((a) => a.rarity === 'gizli' && a.unlockedAt);
    for (const tab of tabs) {
      const rarity = tab.dataset.rarity;
      if (rarity === 'gizli') tab.hidden = !discoveredHidden;
      const selected = rarity === activeBadgeRarity && !tab.hidden;
      tab.setAttribute('aria-selected', selected ? 'true' : 'false');
      tab.tabIndex = selected ? 0 : -1;
    }
    if (activeBadgeRarity === 'gizli' && !discoveredHidden) {
      activeBadgeRarity = 'yaygin';
      return renderBadgeRarityTabs(list);
    }
  }

  function renderBadges() {
    const list = state.achievements || [];
    const normal = list.filter((a) => a.rarity !== 'gizli');
    const got = normal.filter((a) => a.unlockedAt).length;
    $('badge-count').textContent = `${got} / 100`;
    renderBadgeRarityTabs(list);

    const filtered = list.filter((a) => a.rarity === activeBadgeRarity);
    const unlockedInCategory = filtered.filter((a) => a.unlockedAt).length;
    $('badge-category-title').textContent = BADGE_RARITY_LABELS[activeBadgeRarity] || 'Rozetler';
    $('badge-category-count').textContent = activeBadgeRarity === 'gizli'
      ? `${unlockedInCategory} keşfedildi`
      : `${unlockedInCategory} / ${filtered.length}`;

    const grid = $('badge-grid');
    grid.textContent = '';
    // Seçili nadirlikte kazanılanlar önce, en yeni en başta.
    const sorted = [...filtered].sort((a, b) => {
      const unlockedDiff = Number(Boolean(b.unlockedAt)) - Number(Boolean(a.unlockedAt));
      if (unlockedDiff) return unlockedDiff;
      return (b.unlockedAt || 0) - (a.unlockedAt || 0);
    });
    for (const a of sorted) {
      const li = document.createElement('li');
      li.className = `badge badge-${a.rarity}${a.unlockedAt ? ' on' : ''}`;
      const icon = document.createElement('span');
      icon.className = 'badge-icon';
      icon.textContent = a.unlockedAt ? a.icon : '?';
      const name = document.createElement('span');
      name.className = 'badge-name';
      name.textContent = a.title;
      const desc = document.createElement('span');
      desc.className = 'badge-desc';
      desc.textContent = a.unlockedAt ? new Date(a.unlockedAt).toLocaleDateString('tr-TR') : a.desc;
      li.append(icon, name, desc);
      if (a.unlockedAt) {
        li.tabIndex = 0;
        li.setAttribute('aria-label', `${a.title}. ${a.completedDesc || a.desc}`);
        const tip = document.createElement('span');
        tip.className = 'badge-tooltip';
        tip.setAttribute('role', 'tooltip');
        tip.textContent = a.completedDesc || a.desc;
        li.appendChild(tip);
      }
      grid.appendChild(li);
    }
  }

  $('badge-rarity-tabs').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-rarity]');
    if (!tab || tab.hidden) return;
    activeBadgeRarity = tab.dataset.rarity;
    renderBadges();
  });

  $('badge-rarity-tabs').addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    const tabs = [...document.querySelectorAll('#badge-rarity-tabs [data-rarity]:not([hidden])')];
    const current = tabs.findIndex((tab) => tab.dataset.rarity === activeBadgeRarity);
    if (current < 0 || !tabs.length) return;
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const next = tabs[(current + delta + tabs.length) % tabs.length];
    activeBadgeRarity = next.dataset.rarity;
    renderBadges();
    next.focus();
  });

  function renderUpdate() {
    const u = state.update || {};
    const banner = $('update-banner');
    const showBanner = (u.status === 'ready' && !u.dismissed) || u.status === 'onquit';
    banner.hidden = !showBanner;
    if (u.status === 'ready') {
      $('update-text').textContent = `Yeni sürüm hazır: v${u.version}`;
      $('update-now').hidden = false; $('update-onquit').hidden = false; $('update-dismiss').hidden = false;
    } else if (u.status === 'onquit') {
      $('update-text').textContent = `Nero kapanınca v${u.version} kurulacak.`;
      $('update-now').hidden = false; $('update-onquit').hidden = true; $('update-dismiss').hidden = true;
    }
    const labels = {
      dev: 'Geliştirme sürümünde güncelleme yok.',
      idle: 'Henüz denetlenmedi.',
      checking: 'Denetleniyor…',
      latest: `En güncel sürümdesin (v${state.version}).`,
      downloading: `v${u.version} indiriliyor… %${u.percent || 0}`,
      ready: `v${u.version} hazır, kurulmayı bekliyor.`,
      onquit: `v${u.version} Nero kapanınca kurulacak.`,
      error: 'Denetlenemedi. İnternet bağlantını kontrol et.',
      mismatch: 'İndirilen dosya doğrulanamadı. Yayındaki kurulum dosyası ile latest.yml aynı sürüme ait değil.'
    };
    $('update-status').textContent = labels[u.status] || '';
  }

  $('update-now').addEventListener('click', () => api.invoke('update:install'));
  $('update-onquit').addEventListener('click', () => api.invoke('update:onQuit'));
  $('update-dismiss').addEventListener('click', () => api.invoke('update:dismiss'));
  $('update-check').addEventListener('click', () => api.invoke('update:check'));
  $('data-export').addEventListener('click', () => api.invoke('data:export'));
  $('data-import').addEventListener('click', () => api.invoke('data:import'));
  $('data-backups').addEventListener('click', () => api.invoke('data:openBackups'));

  function renderRitual() {
    const done = !!state.dayMode;
    $('ritual').hidden = done;
    if (done) {
      const label = { sakin: 'sakin', uretken: 'üretken', kendime: 'kendine iyi davrandığın' }[state.dayMode];
      $('hello-date').textContent = `${longDate.format(new Date()).toLocaleLowerCase('tr-TR')} · ${label} bir gün`;
    }
  }

  for (const b of document.querySelectorAll('.ritual-opts .pill')) {
    b.addEventListener('click', async () => renderAll(await api.invoke('day:mode', b.dataset.mode)));
  }

  function renderRest() {
    const on = !!state.rest;
    $('rest-screen').hidden = !on;
    if (!on) return;
    const st = state.stats;
    $('rest-summary').textContent = st
      ? `Bugün ${st.today.todos} iş bitirdin ve ${minutesText(st.today.focus)} odaklandın. Gerisi yarının sorunu.`
      : 'Gerisi yarının sorunu.';
  }

  $('rest-night').addEventListener('click', () => api.invoke('rest:goodnight'));
  $('rest-continue').addEventListener('click', async () => renderAll(await api.invoke('rest:exit')));

  function renderDesk() {
    const d = state.desk;
    if (!d) return;
    $('desk-next').textContent = d.next ? `sıradaki: ${d.next.hoursLeft} saat kaldı` : 'hepsi açıldı';
    const grid = $('desk-grid');
    grid.textContent = '';
    for (const item of d.items) {
      const li = document.createElement('li');
      li.className = `desk-item${item.unlockedAt ? ' on' : ''}`;
      li.title = item.unlockedAt ? item.title : `${item.title} — ${item.hours} saat odaklanınca açılır`;
      li.textContent = item.unlockedAt ? item.icon : '?';
      grid.appendChild(li);
    }
  }

  function renderLetter() {
    const letter = state.home?.letter;
    $('letter-card').hidden = !letter || letter.week === dismissedLetterWeek;
    if (letter) $('letter-text').textContent = letter.text;
  }
  // Kapatma bilgisi bellekte tutulur; bir sonraki açılışta mektup tekrar görünse de zararsız.
  let dismissedLetterWeek = null;
  $('letter-close').addEventListener('click', () => { dismissedLetterWeek = state.home?.letter?.week || null; renderLetter(); });

  function moodDateLabel(date) {
    return new Date(`${date}T12:00:00`).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
  }

  function renderMoodCalendar(container, days, mode, editable = false) {
    container.textContent = '';
    for (const day of days || []) {
      const wrap = document.createElement('div');
      wrap.className = 'mood-day-wrap';
      if (day.day === 1 && day.date) {
        const weekday = new Date(`${day.date}T12:00:00`).getDay();
        wrap.style.gridColumnStart = String(((weekday + 6) % 7) + 1);
      }

      const interactive = mode === 'user' && editable && !day.future;
      const dot = document.createElement(interactive ? 'button' : 'span');
      dot.className = `mood-day ${mode === 'user' ? 'user-day' : 'nero-day'}`;
      dot.textContent = day.day;
      dot.dataset.date = day.date;

      if (mode === 'user') {
        if (day.value) dot.classList.add(`mood-${day.value}`);
        else dot.classList.add('empty');
        if (day.future) dot.classList.add('future');
        const moodName = day.value === 'green' ? 'iyi' : day.value === 'yellow' ? 'orta' : day.value === 'red' ? 'zor' : 'seçilmedi';
        const stateLabel = day.future ? 'gelecek gün' : moodName;
        dot.title = `${moodDateLabel(day.date)}: ${stateLabel}`;
        dot.setAttribute('aria-label', `${moodDateLabel(day.date)} ruh hali: ${stateLabel}`);

        if (interactive) {
          dot.type = 'button';
          const picker = document.createElement('div');
          picker.className = 'mood-picker';
          picker.hidden = true;
          for (const [value, label] of [['green', 'İyi'], ['yellow', 'Orta'], ['red', 'Zor']]) {
            const choice = document.createElement('button');
            choice.type = 'button';
            choice.className = `mood-choice mood-${value}`;
            choice.setAttribute('aria-label', `${label} olarak işaretle`);
            choice.title = label;
            choice.addEventListener('click', async (event) => {
              event.stopPropagation();
              picker.hidden = true;
              await api.invoke('moodboard:set', day.date, value);
            });
            picker.appendChild(choice);
          }
          dot.addEventListener('click', () => {
            const wasHidden = picker.hidden;
            for (const other of document.querySelectorAll('.mood-picker')) other.hidden = true;
            picker.hidden = !wasHidden;
          });
          wrap.append(dot, picker);
          container.appendChild(wrap);
          continue;
        }
      } else {
        if (day.cls) dot.classList.add(day.cls);
        else dot.classList.add('empty');
        if (day.future) dot.classList.add('future');
        dot.title = `${moodDateLabel(day.date)}: ${day.label || 'kayıt yok'}`;
        dot.setAttribute('aria-label', `${moodDateLabel(day.date)} Nero ruh hali: ${day.label || 'kayıt yok'}`);
      }

      wrap.appendChild(dot);
      container.appendChild(wrap);
    }
  }

  function closeMoodHistory() {
    $('mood-history-popover').hidden = true;
    $('mood-history-toggle').setAttribute('aria-expanded', 'false');
  }

  async function showMoodboardMonth(key) {
    const currentKey = state?.moodboard?.currentKey;
    if (!key || !currentKey) return;
    closeMoodHistory();
    if (key === currentKey) {
      viewedMoodboard = null;
      renderMoodboards();
      return;
    }
    const board = await api.invoke('moodboard:get', key);
    if (!board) return;
    viewedMoodboard = board;
    renderMoodboards();
  }

  function renderMoodHistory(board) {
    const current = state?.moodboard;
    const months = current?.availableMonths || board.availableMonths || [];
    const years = new Map();
    for (const month of [...months].sort((a, b) => b.key.localeCompare(a.key))) {
      const year = month.key.slice(0, 4);
      if (!years.has(year)) years.set(year, []);
      years.get(year).push(month);
    }

    const root = $('mood-history-years');
    root.textContent = '';
    for (const [year, items] of years) {
      const group = document.createElement('div');
      group.className = 'mood-history-year';
      const title = document.createElement('strong');
      title.textContent = year;
      const buttons = document.createElement('div');
      buttons.className = 'mood-history-months';
      for (const item of items) {
        const button = document.createElement('button');
        button.type = 'button';
        button.dataset.monthKey = item.key;
        button.className = 'mood-history-month';
        if (item.key === board.key) button.classList.add('active');
        button.textContent = item.label.replace(/\s+\d{4}$/, '');
        button.addEventListener('click', () => showMoodboardMonth(item.key));
        buttons.appendChild(button);
      }
      group.append(title, buttons);
      root.appendChild(group);
    }

    const pastCount = months.filter((month) => month.key !== current?.currentKey).length;
    const toggle = $('mood-history-toggle');
    toggle.disabled = pastCount === 0;
    toggle.title = pastCount ? 'Geçmiş moodboard ayları' : 'Henüz geçmiş moodboard kaydı yok';
  }

  function renderMoodboardNav(board) {
    const months = state?.moodboard?.availableMonths || board.availableMonths || [];
    const keys = months.map((month) => month.key).sort();
    const currentKey = state?.moodboard?.currentKey || board.currentKey;
    const index = keys.indexOf(board.key);
    let prevKey = null;
    let nextKey = null;

    if (index >= 0) {
      prevKey = keys[index - 1] || null;
      nextKey = keys[index + 1] || null;
    } else if (board.key === currentKey && keys.length) {
      prevKey = keys[keys.length - 1];
    }

    const prev = $('moodboard-prev');
    const next = $('moodboard-next');
    prev.disabled = !prevKey;
    next.disabled = !nextKey;
    prev.dataset.monthKey = prevKey || '';
    next.dataset.monthKey = nextKey || '';
    $('moodboard-current').hidden = board.key === currentKey;
  }

  function renderMoodboards() {
    const board = viewedMoodboard || state.moodboard;
    if (!board) return;
    $('moodboard-month').textContent = board.label || '';
    $('user-mood-hint').textContent = board.editable ? 'güne dokun, rengini seç' : 'geçmiş kayıt · salt okunur';
    renderMoodCalendar($('user-mood-calendar'), board.user, 'user', !!board.editable);
    renderMoodCalendar($('nero-mood-calendar'), board.nero, 'nero', false);
    renderMoodHistory(board);
    renderMoodboardNav(board);
  }

  $('mood-history-toggle').addEventListener('click', (event) => {
    event.stopPropagation();
    const popover = $('mood-history-popover');
    if ($('mood-history-toggle').disabled) return;
    popover.hidden = !popover.hidden;
    $('mood-history-toggle').setAttribute('aria-expanded', popover.hidden ? 'false' : 'true');
  });
  $('moodboard-prev').addEventListener('click', () => showMoodboardMonth($('moodboard-prev').dataset.monthKey));
  $('moodboard-next').addEventListener('click', () => showMoodboardMonth($('moodboard-next').dataset.monthKey));
  $('moodboard-current').addEventListener('click', () => showMoodboardMonth(state?.moodboard?.currentKey));
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.user-mood-board')) closeMoodHistory();
    if (!event.target.closest('.section-help')) closeSectionHelp();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMoodHistory();
      closeSectionHelp();
      if (!$('stats-reset-modal').hidden) closeStatsResetModal();
    }
  });

  function renderArchive() {
    const a = state.home?.archive;
    $('archive-card').hidden = !a || a.total === 0;
    if (!a) return;
    $('archive-count').textContent = `${a.total} iş`;
    const list = $('archive-list');
    const more = $('archive-more');
    const moreList = $('archive-more-list');
    const wasOpen = more.open;
    list.textContent = '';
    moreList.textContent = '';
    const items = a.recent || [];
    const visible = items.slice(0, 5);
    const rest = items.slice(5);
    for (const item of visible) {
      const li = document.createElement('li');
      li.textContent = item.text;
      list.appendChild(li);
    }
    for (const item of rest) {
      const li = document.createElement('li');
      li.textContent = item.text;
      moreList.appendChild(li);
    }
    more.hidden = rest.length === 0;
    more.open = rest.length > 0 && wasOpen;
    $('archive-more-summary').textContent = rest.length ? `${rest.length} iş daha` : '';
  }

  $('jar-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = $('jar-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    await api.invoke('jar:add', text);
  });
  function renderJar() { $('jar-count').textContent = `${state.jarCount || 0} anı`; }

  function markHomeDialogueSeen() {
    const id = state?.home?.dialogueId;
    if (currentTab !== 'home' || !id || !state.home?.jab) return;
    if (lastSeenHomeDialogueId === id) return;
    lastSeenHomeDialogueId = id;
    api.invoke('home:seen', id).catch(() => {});
  }

  function renderHomeJab() {
    const el = $('home-jab');
    const id = state?.home?.dialogueId || null;
    const text = state?.home?.jab || '';
    if (id === lastHomeDialogueId && el.textContent === text) {
      markHomeDialogueSeen();
      return;
    }
    clearTimeout(homeJabFadeTimer);
    el.classList.add('home-jab-fade');
    homeJabFadeTimer = setTimeout(() => {
      el.textContent = text;
      lastHomeDialogueId = id;
      requestAnimationFrame(() => el.classList.remove('home-jab-fade'));
      markHomeDialogueSeen();
    }, 140);
  }

  function renderHome() {
    const st = state.stats;
    if (!st) return;
    const h = new Date().getHours();
    const greet = h >= 5 && h < 12 ? 'Günaydın' : h >= 12 && h < 17 ? 'İyi günler' : h >= 17 && h < 22 ? 'İyi akşamlar' : 'İyi geceler';
    const name = (state.settings.userName || '').trim();
    $('hello').textContent = name ? `${greet}, ${name}` : greet;
    $('mm-issue').textContent = `Sayı ${st.daysTogether}`;
    $('mm-date').textContent = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }).format(new Date());
    $('hello-date').textContent = longDate.format(new Date()).toLocaleLowerCase('tr-TR');

    if (state.home) {
      renderHomeJab();
      $('quote-t').textContent = state.home.quote?.t || '';
      $('quote-nero').textContent = state.home.quote?.nero || '';
    }

    $('st-today-todos').textContent = st.today.todos;
    $('st-today-focus').textContent = minutesText(st.today.focus);
    $('st-streak').textContent = st.streak;
    $('st-days').textContent = st.daysTogether;

    const max = Math.max(30, ...st.week.map((d) => d.focus));
    const bars = $('week-bars');
    bars.textContent = '';
    st.week.forEach((d, i) => {
      const bar = document.createElement('div');
      bar.className = `bar${i === st.week.length - 1 ? ' today' : ''}`;
      bar.title = `${d.focus} dk odak, ${d.todos} iş`;
      const col = document.createElement('i');
      col.style.height = `${Math.max(4, Math.round((d.focus / max) * 86))}px`;
      const label = document.createElement('span');
      label.textContent = WEEKDAYS[d.weekday];
      bar.append(col, label);
      bars.appendChild(bar);
    });
    $('week-total').textContent = minutesText(st.week.reduce((a, d) => a + d.focus, 0));

    const display = st.display || { totals: st.totals, bestStreak: st.bestStreak, baselineAt: null };
    const totals = display.totals || st.totals;
    $('tt-todos').textContent = totals.todos || 0;
    $('tt-focus').textContent = minutesText(totals.focusMin || 0);
    $('tt-done').textContent = totals.timersDone || 0;
    $('tt-quit').textContent = totals.timersQuit || 0;
    $('tt-notes').textContent = totals.notes || 0;
    $('tt-best').textContent = `${display.bestStreak || 0} gün`;
    $('tt-pets').textContent = `${totals.pets || 0} kere`;
    $('stats-reset').classList.toggle('has-baseline', !!display.baselineAt);
    $('stats-reset').title = display.baselineAt ? 'Bu başlangıç noktasını yeniden sıfırla' : 'Yeni bir başlangıç';
    $('q-focus').textContent = `${state.settings.lastTimerMinutes || 25} dk odaklan`;
  }

  function closeSectionHelp(except = null) {
    for (const button of document.querySelectorAll('.section-help.open')) {
      if (button === except) continue;
      button.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  }

  for (const button of document.querySelectorAll('.section-help')) {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const opening = !button.classList.contains('open');
      closeSectionHelp(button);
      button.classList.toggle('open', opening);
      button.setAttribute('aria-expanded', opening ? 'true' : 'false');
    });
  }

  function closeStatsResetModal() {
    $('stats-reset-modal').hidden = true;
    $('stats-reset').focus();
  }

  $('stats-reset').addEventListener('click', () => {
    closeSectionHelp();
    $('stats-reset-modal').hidden = false;
    requestAnimationFrame(() => $('stats-reset-cancel').focus());
  });
  $('stats-reset-cancel').addEventListener('click', closeStatsResetModal);
  $('stats-reset-confirm').addEventListener('click', async () => {
    $('stats-reset-confirm').disabled = true;
    try {
      await api.invoke('stats:resetDisplay');
      $('stats-reset-modal').hidden = true;
    } finally {
      $('stats-reset-confirm').disabled = false;
      $('stats-reset').focus();
    }
  });
  $('stats-reset-modal').addEventListener('click', (event) => {
    if (event.target === $('stats-reset-modal')) closeStatsResetModal();
  });

  $('q-focus').addEventListener('click', () => {
    api.invoke('timer:start', state?.settings.lastTimerMinutes || 25, '');
    selectTab('timer');
  });
  $('q-todo').addEventListener('click', () => selectTab('todos'));
  $('q-note').addEventListener('click', () => { selectTab('notes'); openEditor(null); });

  // ---------------------------------------------------------------------------
  // Durum
  // ---------------------------------------------------------------------------
  function renderAll(next) {
    state = next;
    applyUi(state.ui);
    renderMood(state.mood);
    renderNotes();
    renderTodos();
    renderTimer(state.timer);
    renderSettings();
    renderHome();
    renderBadges();
    renderUpdate();
    renderRitual();
    renderRest();
    renderDesk();
    renderLetter();
    renderMoodboards();
    renderArchive();
    renderJar();
  }

  api.on('state', renderAll);
  api.on('timer', (t) => { if (state) state.timer = t; renderTimer(t); });
  api.on('panel:tab', (tab) => selectTab(tab));
  api.on('theme', (payload) => applyUi(payload.manifest.ui));

  document.documentElement.dataset.skin = skinName;
  applySkinText();
  api.invoke('state:get').then(renderAll);
  choose(25);
  selectTab('home');
})();
