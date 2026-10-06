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
  const NEW_THEME_TABS = { home: 'Bugün', badges: 'Rozetler', notes: 'Notlar', todos: 'İşler', timer: 'Sayaç', settings: 'Ayarlar', budget: 'Bütçe' };

  Object.assign(SKINS, {
    'radyo-aksami': { ...SKINS.cozy, tabs: NEW_THEME_TABS, tagline: '', sticky: '' },
    nero98: {
      ...SKINS.cozy,
      tabs: { home: 'Today', notes: 'Notes', todos: 'Tasks', timer: 'Timer', badges: 'Awards', settings: 'Control' },
      brandTitle: 'Nero OS',
      beeLabel: 'HIVE.EXE',
      newNote: 'NEW NOTE', newNoteSub: 'Nero Notepad',
      saved: 'SAVED', typing: 'WRITING…',
      todoPlaceholder: 'Task name...', listTitle: 'TASKMGR.EXE <span>process list</span>',
      todoLeft: (n) => `${n} task${n === 1 ? '' : 's'} remaining`, allDone: 'SYSTEM: all tasks complete.',
      timerIdle: 'STATUS: READY', timerRunning: 'STATUS: RUNNING', timerPaused: 'STATUS: PAUSED',
      timerStart: 'RUN', timerPause: 'PAUSE', timerResume: 'RESUME',
      cancel: 'ABORT', cancelNote: '', talkMax: 'MAX',
      noteBack: '‹ NOTES.EXE', noteArchive: 'ARCHIVE', noteDelete: 'DELETE',
      todoClear: 'archive completed',
      quickFocus: 'RUN 25 MIN', quickTodo: 'NEW TASK', quickNote: 'NEW NOTE',
      badgeTitle: 'ACHIEVEMENTS.EXE',
      tagline: 'Version 98.6 · system ready',
      sticky: 'C:\\NERO\\TODAY > ready',
      subs: { theme: 'desktop skin', talk: 'assistant verbosity' },
      moodPrefix: 'STATUS: ', moodLabels: null
    }
  });








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
    const FALLBACK_TABS = { home: 'Bugün', badges: 'Rozetler', notes: 'Notlar', todos: 'İşler', timer: 'Zaman', settings: 'Ayarlar', budget: 'Bütçe' };
    for (const el of document.querySelectorAll('.tl')) el.textContent = k.tabs[el.dataset.k] || FALLBACK_TABS[el.dataset.k];
    $('todo-input').placeholder = k.todoPlaceholder;
    $('list-title').innerHTML = k.listTitle;
    $('timer-cancel').textContent = k.cancel;
    $('cancel-note').textContent = k.cancelNote;
    $('talk-cok').textContent = k.talkMax;
    $('tagline').textContent = k.tagline || '';
    $('sticky-text').textContent = k.sticky || '';

    const brandTitle = document.querySelector('.brand h1');
    if (brandTitle) brandTitle.textContent = k.brandTitle || 'Nero';
    const beeLabel = document.querySelector('.bee-launch-label');
    if (beeLabel) beeLabel.textContent = k.beeLabel || 'Arıcılık';
    $('timer-start').textContent = k.timerStart || 'Başlat';
    $('timer-pause').textContent = k.timerPause || 'Duraklat';
    $('timer-resume').textContent = k.timerResume || 'Devam et';
    $('note-back').textContent = k.noteBack || '‹ Notlar';
    $('note-archive').textContent = k.noteArchive || 'Arşivle';
    $('note-delete').textContent = k.noteDelete || 'Sil';
    $('todo-clear').textContent = k.todoClear || 'Bitenleri arşivle';
    $('q-focus').textContent = k.quickFocus || '25 dk odaklan';
    $('q-todo').textContent = k.quickTodo || 'İş ekle';
    $('q-note').textContent = k.quickNote || 'Not al';
    const badgeTitle = document.querySelector('#view-badges .card-head h3');
    if (badgeTitle) badgeTitle.textContent = k.badgeTitle || 'Rozetler';
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
    if (tab === 'budget') window.neroBudget?.open();
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
    document.documentElement.style.setProperty('--radio-mood', String(Math.max(0, Math.min(100, Number(m.happiness) || 0)) / 100));
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

  let todoDrag = null;
  function beginTodoDrag(e, row) {
    if (e.button !== 0 || e.target.closest('button, input, label, form, .subtask, [contenteditable="true"]')) return;
    const startY = e.clientY, startX = e.clientX;
    const main = $('view-todos');
    let held = false, scrollFrame = null, pointerY = startY;
    const originalIds = [...$('todo-list').children].map(el => el.dataset.todoId);
    const timer = setTimeout(() => { held = true; todoDrag = row; row.classList.add('todo-dragging'); document.body.classList.add('todo-reordering'); window.getSelection()?.removeAllRanges(); scrollFrame = requestAnimationFrame(scroll); }, 280);
    const place = () => {
      const siblings = [...$('todo-list').children].filter(el => el !== row);
      const next = siblings.find(el => pointerY < el.getBoundingClientRect().top + el.getBoundingClientRect().height / 2);
      $('todo-list').insertBefore(row, next || null);
    };
    const scroll = () => {
      if (!held) return;
      const r = main.getBoundingClientRect();
      if (pointerY < r.top + 35) main.scrollTop -= 7;
      else if (pointerY > r.bottom - 35) main.scrollTop += 7;
      place(); scrollFrame = requestAnimationFrame(scroll);
    };
    const move = event => {
      pointerY = event.clientY;
      if (!held && (Math.abs(event.clientY-startY) > 8 || Math.abs(event.clientX-startX) > 8)) { clearTimeout(timer); return; }
      if (held) { event.preventDefault(); place(); }
    };
    const finish = async event => {
      clearTimeout(timer); cancelAnimationFrame(scrollFrame);
      document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', finish); document.removeEventListener('pointercancel', finish); window.removeEventListener('blur', finish); document.removeEventListener('keydown', escape);
      if (!held) return;
      held = false; todoDrag = null; row.classList.remove('todo-dragging'); document.body.classList.remove('todo-reordering');
      const ids = [...$('todo-list').children].map(el => el.dataset.todoId);
      if (event.type === 'pointerup' && JSON.stringify(ids) !== JSON.stringify(originalIds)) await api.invoke('todos:reorder', ids);
      renderTodos();
    };
    const escape = event => { if (event.key === 'Escape') finish(event); };
    document.addEventListener('pointermove', move, { passive: false }); document.addEventListener('pointerup', finish); document.addEventListener('pointercancel', finish); document.addEventListener('keydown', escape); window.addEventListener('blur', finish);
  }

  function renderTodos() {
    if (todoDrag || document.querySelector('.todo-text[contenteditable="true"], .subtask-text[contenteditable="true"], .subtask-input')) return;
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

    const sorted = activeTodos;
    for (const todo of sorted) {
      const li = document.createElement('li');
      li.classList.toggle('done', todo.done);
      li.dataset.todoId = todo.id;
      li.addEventListener('pointerdown', e => beginTodoDrag(e, li));

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
      tInput.type = 'text';
      tInput.inputMode = 'numeric';
      tInput.maxLength = 5;
      tInput.pattern = '([01][0-9]|2[0-3]):[0-5][0-9]';
      tInput.placeholder = 'ss:dd';
      tInput.setAttribute('aria-label', 'Hatırlatma saati, 24 saat biçiminde');
      tInput.title = '24 saat biçiminde yaz: 18:30';
      if (at) tInput.value = `${String(at.getHours()).padStart(2, '0')}:${String(at.getMinutes()).padStart(2, '0')}`;
      tInput.addEventListener('change', () => {
        const value = tInput.value.trim();
        if (value && !/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) {
          tInput.setCustomValidity('Saati 24 saat biçiminde yaz: 18:30');
          tInput.reportValidity();
          return;
        }
        tInput.setCustomValidity('');
        api.invoke('todos:setReminder', todo.id, value);
      });
      tInput.addEventListener('input', () => tInput.setCustomValidity(''));
      bell.appendChild(tInput);
      if (todo.done) bell.hidden = true;

      const addChild = document.createElement('button');
      addChild.type = 'button'; addChild.className = 'todo-add-child'; addChild.textContent = '+';
      addChild.title = 'Alt görev ekle'; addChild.setAttribute('aria-label', 'Alt görev ekle');
      addChild.addEventListener('click', () => {
        if (li.querySelector('.subtask-input')) return;
        const form = document.createElement('form'); form.className = 'subtask-form';
        const input = document.createElement('input'); input.className = 'subtask-input'; input.placeholder = 'Yeni alt görev'; input.maxLength = 300; input.setAttribute('aria-label', 'Yeni alt görev');
        const save = document.createElement('button'); save.type = 'submit'; save.textContent = 'Ekle';
        const cancel = document.createElement('button'); cancel.type = 'button'; cancel.textContent = '×'; cancel.setAttribute('aria-label', 'Vazgeç');
        const close = () => { form.remove(); renderTodos(); };
        cancel.addEventListener('click', close);
        input.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
        form.addEventListener('submit', async e => { e.preventDefault(); const value = input.value.trim(); if (!value) return; save.disabled = true; try { await api.invoke('todos:addSubtask', todo.id, value); close(); } finally { save.disabled = false; } });
        form.append(input, save, cancel); children.append(form); input.focus();
      });
      const children = document.createElement('div'); children.className = 'subtask-list';
      for (const child of todo.subtasks || []) {
        const row = document.createElement('div'); row.className = `subtask${child.done ? ' done' : ''}`;
        const cb = document.createElement('button'); cb.type = 'button'; cb.className = 'subtask-check'; cb.textContent = child.done ? '✓' : ''; cb.setAttribute('aria-label', child.done ? 'Alt görevi yeniden aç' : 'Alt görevi tamamla'); cb.setAttribute('aria-pressed', String(!!child.done));
        cb.addEventListener('click', () => api.invoke('todos:toggleSubtask', todo.id, child.id));
        const label = document.createElement('span'); label.className = 'subtask-text'; label.textContent = child.text; label.title = 'Düzenlemek için çift tıkla';
        label.addEventListener('dblclick', () => {
          label.contentEditable = 'true'; label.focus();
          let saved = false;
          const finish = async cancel => { if (saved) return; saved = true; const value = label.textContent.trim(); label.contentEditable = 'false'; if (!cancel && value) await api.invoke('todos:renameSubtask', todo.id, child.id, value); renderTodos(); };
          label.addEventListener('blur', () => finish(false), { once: true });
          label.onkeydown = e => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); finish(e.key === 'Escape'); } };
        });
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'subtask-remove'; remove.textContent = '×'; remove.setAttribute('aria-label', 'Alt görevi sil'); remove.addEventListener('click', () => api.invoke('todos:deleteSubtask', todo.id, child.id));
        row.append(cb, label, remove); children.append(row);
      }
      li.append(check, main, addChild, stopwatch, bell, archive, del, children);
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