// İş bazlı kronometre için saf yardımcılar.
// Renderer/main sürecinden bağımsız tutulur ki süre biriktirme ve migration test edilebilsin.

function finiteMs(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? Math.round(n) : 0;
}

function finiteMin(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.max(1, Math.min(10080, Math.round(n)));
}

function normalizeTodoTiming(todo = {}) {
  return {
    ...todo,
    plannedDurationMin: finiteMin(todo.plannedDurationMin),
    actualDurationMs: finiteMs(todo.actualDurationMs),
    stopwatchStartedAt: Number.isFinite(Number(todo.stopwatchStartedAt)) ? Number(todo.stopwatchStartedAt) : null,
    focusCreditedMin: Math.max(0, Math.round(Number(todo.focusCreditedMin) || 0))
  };
}

function elapsedMs(todo, now = Date.now()) {
  const t = normalizeTodoTiming(todo);
  if (!t.stopwatchStartedAt) return t.actualDurationMs;
  return t.actualDurationMs + Math.max(0, Number(now) - t.stopwatchStartedAt);
}

function start(todo, now = Date.now()) {
  const t = normalizeTodoTiming(todo);
  if (t.stopwatchStartedAt || t.done) return t;
  return { ...t, stopwatchStartedAt: Number(now) };
}

function pause(todo, now = Date.now()) {
  const t = normalizeTodoTiming(todo);
  if (!t.stopwatchStartedAt) return t;
  return {
    ...t,
    actualDurationMs: elapsedMs(t, now),
    stopwatchStartedAt: null
  };
}

function focusCredit(todo, { final = false, now = Date.now() } = {}) {
  const t = normalizeTodoTiming(todo);
  const total = elapsedMs(t, now);
  const target = final ? Math.round(total / 60000) : Math.floor(total / 60000);
  return Math.max(0, target - t.focusCreditedMin);
}

function applyCredit(todo, minutes) {
  const t = normalizeTodoTiming(todo);
  return {
    ...t,
    focusCreditedMin: t.focusCreditedMin + Math.max(0, Math.round(Number(minutes) || 0))
  };
}

function formatDuration(ms) {
  const totalMin = Math.max(0, Math.round(finiteMs(ms) / 60000));
  if (totalMin < 60) return `${totalMin} dk`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m ? `${h} sa ${m} dk` : `${h} sa`;
}

module.exports = {
  finiteMin,
  normalizeTodoTiming,
  elapsedMs,
  start,
  pause,
  focusCredit,
  applyCredit,
  formatDuration
};
