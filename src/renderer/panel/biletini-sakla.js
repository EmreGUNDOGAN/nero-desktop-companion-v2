// Biletini Sakla: visual components around the existing Nero renderer and actions.
// User text is always assigned through textContent. No sample records enter the app.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const active = () => document.documentElement.dataset.skin === 'biletini-sakla';
  const minutes = n => Number(n || 0).toLocaleString('tr-TR') + ' dk';
  let mounted = false;
  function mount() {
    if (mounted) return;
    mounted = true;
    document.querySelector('.brand').insertAdjacentHTML('afterend', '<div class="bilet-only bs-theme-label">Biletini Sakla <span id="bs-mood-dot" role="img"></span></div>');
    document.querySelector('.nero-says').insertAdjacentHTML('afterbegin', '<span class="bilet-only bs-kicker">GÜNLÜK BİLET</span><div class="bilet-only bs-date-stub" aria-hidden="true"><b id="bs-day"></b><span id="bs-month"></span><i class="bs-barcode"></i></div>');
    document.querySelector('.nero-says').insertAdjacentHTML('beforeend', '<span class="bilet-only bs-ticket-foot">DAHA İYİ BİR SEN’E YOLCULUK</span>');
    $('notes-list-view').insertAdjacentHTML('afterbegin', '<div class="bilet-only bs-page-heading"><h2>Notlar</h2><button id="bs-new-note" class="pill primary" type="button">+ Yeni not</button></div>');
    $('notes-list-view').insertAdjacentHTML('beforeend', '<button id="bs-note-peek" class="bilet-only bs-note-peek" type="button" aria-label="Önizlenen notu aç"><span class="bs-peek-top"><strong id="bs-peek-title"></strong><small id="bs-peek-date"></small></span><span id="bs-peek-body"></span><span class="bs-saved-stamp" aria-hidden="true">SAKLANDI</span></button>');
    $('view-todos').insertAdjacentHTML('afterbegin', '<div class="bilet-only bs-page-heading"><h2>Bir sonraki adım</h2><span class="bs-heading-caption">İşler</span></div>');
    $('view-timer').insertAdjacentHTML('afterbegin', '<div class="bilet-only bs-page-heading"><h2>Odak zamanı</h2></div>');
    document.querySelector('.dial').insertAdjacentHTML('afterbegin', '<div class="bilet-only bs-timer-band"><span>ODAK BİLETİ</span><span aria-hidden="true">01 / NERO</span></div>');
    document.querySelector('.dial').insertAdjacentHTML('beforeend', '<div class="bilet-only bs-timer-meta"><span>Süre<strong id="bs-duration"></strong></span><span>Bugünkü tur<strong id="bs-turn"></strong></span></div>');
    document.querySelector('.timer-actions').insertAdjacentHTML('beforeend', '<button id="bs-timer-reset" type="button" class="bilet-only pill">Sıfırla</button>');
    $('view-timer').insertAdjacentHTML('beforeend', '<div class="bilet-only bs-journey" aria-hidden="true">' + Array.from({length:5}, (_, i) => `<span><i></i><small>${i + 1}</small></span>`).join('') + '</div><div class="bilet-only bs-timer-summaries"><div class="card bs-timer-summary"><span>Bugün odak</span><strong id="bs-focus-today"></strong></div><div class="card bs-timer-summary"><span>Tamamlanan sayaç</span><strong id="bs-completed-today"></strong></div></div><p class="bilet-only bs-farewell">Nero burada. Sen işine bak.</p>');
    $('view-settings').insertAdjacentHTML('afterbegin', '<div class="bilet-only bs-page-heading"><h2>Yolculuk ayarları</h2></div>');
    $('bs-new-note').addEventListener('click', () => document.querySelector('#notes-list .new-note')?.click());
    $('bs-note-peek').addEventListener('click', () => document.querySelector('#notes-list li:not(.new-note)')?.click());
    $('bs-timer-reset').addEventListener('click', () => document.querySelector('#presets [data-min="25"]')?.click());
    document.querySelector('.tabs').addEventListener('keydown', e => {
      if (!active() || !['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
      const buttons = [...document.querySelectorAll('.tabs [role="tab"]')];
      const index = buttons.indexOf(e.target);
      if (index < 0) return;
      const next = e.key === 'Home' ? 0 : e.key === 'End' ? buttons.length - 1 : (index + (e.key === 'ArrowLeft' ? -1 : 1) + buttons.length) % buttons.length;
      e.preventDefault(); buttons[next].click(); buttons[next].focus();
    });
  }
  function updateTimer(state, chosen = 25) {
    if (!active()) return;
    mount();
    const timer = state?.timer;
    const total = timer?.durationMs || timer?.totalMs || (timer?.remainingMs && timer.progress < 1 ? timer.remainingMs / (1 - Math.max(0, timer.progress || 0)) : 0);
    $('bs-duration').textContent = minutes(timer && timer.status !== 'idle' && total > 0 ? Math.round(total / 60000) : chosen);
    $('bs-turn').textContent = String(Number(state?.stats?.today?.timersDone || 0) + 1).padStart(2, '0');
    $('bs-timer-reset').hidden = !!timer && timer.status !== 'idle';
    const progress = Math.max(0, Math.min(1, timer?.progress || 0));
    document.querySelectorAll('.bs-journey>span').forEach((node, i) => node.classList.toggle('passed', i === 0 || progress >= i / 4));
    $('bs-focus-today').textContent = minutes(state?.stats?.today?.focus);
    $('bs-completed-today').textContent = Number(state?.stats?.today?.timersDone || 0).toLocaleString('tr-TR');
  }
  function selectTab(tab) {
    const buttons = document.querySelectorAll('.tabs [role="tab"]');
    buttons.forEach(button => { button.tabIndex = active() ? (button.dataset.tab === tab ? 0 : -1) : 0; });
  }
  function update(state, chosen = 25) {
    if (!active()) { selectTab(document.documentElement.dataset.tab); return; }
    mount();
    const now = new Date();
    $('bs-day').textContent = String(now.getDate()).padStart(2, '0');
    $('bs-month').textContent = new Intl.DateTimeFormat('tr-TR', {month:'short'}).format(now).toLocaleUpperCase('tr-TR');
    $('bs-mood-dot').setAttribute('aria-label', state?.mood?.label || "Nero’nun keyfi");
    $('bs-mood-dot').title = state?.mood?.label || '';
    const note = state?.notes?.find(n => !n.archivedAt);
    $('bs-note-peek').hidden = !note;
    if (note) {
      const lines = note.body.trim().split('\n');
      $('bs-peek-title').textContent = lines[0] || 'Boş not';
      $('bs-peek-body').textContent = lines.slice(1).join('\n') || 'Bu notu açıp yazmaya devam edebilirsin.';
      $('bs-peek-date').textContent = new Intl.DateTimeFormat('tr-TR', {day:'2-digit',month:'short'}).format(new Date(note.updatedAt)).toLocaleUpperCase('tr-TR');
    }
    $('st-today-focus').textContent = minutes(state?.stats?.today?.focus);
    updateTimer(state, chosen);
    selectTab(document.documentElement.dataset.tab);
  }
  window.NeroTicketTheme = Object.freeze({update, updateTimer, selectTab});
})();
