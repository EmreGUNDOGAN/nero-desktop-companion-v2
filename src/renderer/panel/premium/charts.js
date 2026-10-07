import Chart from 'chart.js/auto';

const charts = new Map();
const moneyDefault = n => (n / 100).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + ' TL';
const palette = ['#b8f562', '#b6a6f7', '#ee8078', '#e7c568', '#7cbac9', '#d79cc2'];
const font = 'system-ui, -apple-system, "Segoe UI", sans-serif';
Chart.defaults.font.family = font;

// Sizes are CSS pixels; Chart.js independently manages the canvas backing bitmap / DPR.
export function createChart(canvas, spec) {
  charts.get(canvas)?.destroy();
  const { kind, rows = [], selected = rows.length - 1, format = moneyDefault, focus = 'all' } = spec;
  const palette = spec.palette || ['#b8f562', '#b6a6f7', '#ee8078', '#e7c568', '#7cbac9', '#d79cc2'];
  const grid = spec.grid || '#25262a', muted = spec.muted || '#9a9ba0';
  let data, options, type;
  if (kind === 'ring') {
    type = 'doughnut';
    const positive = rows.map((r, i) => ({ ...r, color: r.color || palette[i % palette.length] })).filter(r => r.amount > 0);
    data = { labels: positive.length ? positive.map(r => r.name) : ['Henüz kayıt yok'], datasets: [{ data: positive.length ? positive.map(r => r.amount) : [1], backgroundColor: positive.length ? positive.map(r => r.color) : [spec.track || '#232428'], borderWidth: 0, borderRadius: positive.length > 1 ? 12 : 0, spacing: positive.length > 1 ? 5 : 0, hoverOffset: 2 }] };
    options = { cutout: '77%', rotation: -4, circumference: positive.length === 1 ? 352 : 360, plugins: { tooltip: { enabled: !!positive.length, callbacks: { label: item => `${item.label}: ${format(item.raw)}` } } } };
  } else if (kind === 'bar') {
    type = 'bar';
    const keys = spec.keys || ['amount'];
    data = { labels: rows.map(r => r.name), datasets: keys.map((key, i) => ({ label: key === 'income' ? 'Gelir' : key === 'expense' ? 'Ödeme' : 'Tutar', data: rows.map(r => r[key] || 0), backgroundColor: palette[i], borderRadius: 6, maxBarThickness: 25, borderSkipped: false })) };
    options = { indexAxis: spec.horizontal ? 'y' : 'x', scales: { x: { grid: { display: !!spec.horizontal, color: grid }, border: { display: false }, ticks: { color: muted, font: { size: 10 }, maxRotation: 0, callback: spec.horizontal ? n => compact(n) : function(n) { return this.getLabelForValue(n); } } }, y: { beginAtZero: true, grid: { display: !spec.horizontal, color: grid }, border: { display: false }, ticks: { color: muted, font: { size: 10 }, callback: spec.horizontal ? function(n) { return this.getLabelForValue(n); } : n => compact(n) } } }, plugins: { tooltip: { callbacks: { label: item => format(spec.horizontal ? item.parsed.x : item.parsed.y) } } } };
  } else {
    type = 'line';
    const keys = focus === 'income' ? ['income'] : focus === 'expense' ? ['netExpense'] : ['income', 'netExpense'];
    data = { labels: rows.map(r => r.label), datasets: keys.map(key => ({ label: key === 'income' ? 'Gelir' : 'Net gider', data: rows.map(r => r[key] || 0), borderColor: key === 'income' ? palette[0] : palette[1], backgroundColor: key === 'income' ? palette[0] : palette[1], borderWidth: 1.8, pointRadius: 0, pointHoverRadius: 4, cubicInterpolationMode: 'monotone', tension: .4 })) };
    const amounts = data.datasets.flatMap(d => d.data);
    options = { layout: { padding: { top: 29, right: 10, left: 8 } }, interaction: { mode: 'index', intersect: false }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: muted, font: { size: 10 }, maxRotation: 0, autoSkip: true, maxTicksLimit: 8 } }, y: { display: false, min: Math.min(0, ...amounts), suggestedMax: Math.max(1, ...amounts) * 1.15 } }, plugins: { tooltip: { enabled: false } }, onClick: (_, elements) => { if (elements.length) spec.onSelect?.(elements[0].index); }, onHover: (_, elements, chart) => { chart.$hoverIndex = elements[0]?.index; chart.draw(); } };
  }
  const readout = {
    id: 'premiumReadout',
    afterDraw(chart) {
      if (kind !== 'line' || !rows.some(r => r.income || r.netExpense)) return;
      const i = Math.max(0, Math.min(rows.length - 1, chart.$hoverIndex ?? selected));
      const which = chart.data.datasets.findIndex(d => d.data[i] !== 0);
      const datasetIndex = which < 0 ? 0 : which;
      const point = chart.getDatasetMeta(datasetIndex).data[i];
      if (!point) return;
      const value = chart.data.datasets[datasetIndex].data[i];
      const color = chart.data.datasets[datasetIndex].borderColor;
      const { ctx, chartArea } = chart;
      ctx.save();
      ctx.strokeStyle = '#8c8d9138'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(point.x, chartArea.top); ctx.lineTo(point.x, chartArea.bottom); ctx.stroke();
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(point.x, point.y, 3, 0, Math.PI * 2); ctx.fill();
      ctx.font = `500 11px ${font}`;
      const text = format(value), width = Math.min(chart.width - 16, ctx.measureText(text).width + 18), height = 22;
      const x = Math.max(8, Math.min(chart.width - width - 8, point.x - width / 2));
      const y = Math.max(1, point.y - height - 10);
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(x, y, width, height, 11); ctx.fill();
      ctx.fillStyle = spec.readoutInk || '#111313'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, x + width / 2, y + height / 2, width - 12);
      ctx.restore();
    }
  };
  const chart = new Chart(canvas, { type, data, options: { responsive: true, maintainAspectRatio: false, animation: false, ...options, font: { family: font }, plugins: { legend: { display: false }, ...options.plugins } }, plugins: [readout] });
  charts.set(canvas, chart);
  canvas.dataset.chartReady = 'true'; canvas.dataset.chartKind = kind;
  return () => { chart.destroy(); charts.delete(canvas); };
}
function compact(n) { return Math.abs(n) >= 100000 ? `${Math.round(n / 100000)}k` : (n / 100).toLocaleString('tr-TR', { maximumFractionDigits: 0 }); }
export function refreshLegacyCharts(root) {
  for (const [node, chart] of charts) if (!node.isConnected) { chart.destroy(); charts.delete(node); }
  root.querySelectorAll('canvas[data-legacy-ring]').forEach(node => {
    if (charts.has(node)) return;
    createChart(node, { kind: 'ring', rows: JSON.parse(node.dataset.legacyRing) });
  });
}
export function inspectCharts() { return [...charts].filter(([node]) => node.isConnected).map(([node, chart]) => ({ kind: node.dataset.chartKind, width: chart.width, height: chart.height, bitmapWidth: node.width, bitmapHeight: node.height, dpr: chart.currentDevicePixelRatio, datasets: chart.data.datasets.map(d => d.data), labels: chart.data.labels })); }
export { palette };
