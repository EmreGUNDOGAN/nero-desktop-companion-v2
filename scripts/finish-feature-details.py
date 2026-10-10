from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'src/renderer/panel/panel.js'
s=p.read_text(encoding='utf-8')
block="""    for (const name of ['Pzt','Sal','Çar','Per','Cum','Cmt','Paz']) {
      const header = document.createElement('small');
      header.className = 'nf-weekday'; header.textContent = name; container.append(header);
    }
"""
s=s.replace(block,'',1)
start=s.index('  function renderMoodCalendar(')
pos=s.index("    container.textContent = '';",start)+len("    container.textContent = '';\n")
s=s[:pos]+block+s[pos:];p.write_text(s,encoding='utf-8')
p=r/'src/renderer/panel/productivity-ui.js';s=p.read_text(encoding='utf-8')
s=s.replace("[['today','Bugün'],['later','Sonra'],['done','Bugün tamamlananlar']]","[['today','Bugün'],['later','Sonra'],['done','Bugün tamamlananlar'],['older','Önceki günlerde tamamlananlar']]")
s=s.replace("return key==='done'?t?.done:t&&!t.done&&(t.bucket||'today')===key;","const finishedToday=t?.doneAt&&new Date(t.doneAt).toDateString()===new Date().toDateString();return key==='done'?t?.done&&finishedToday:key==='older'?t?.done&&!finishedToday:t&&!t.done&&(t.bucket||'today')===key;")
s=s.replace("if(key==='done'){","if(key==='done'||key==='older'){")
s=s.replace("for(const b of calendar.querySelectorAll('button'))","for(const b of calendar.querySelectorAll('.mood-day'))")
p.write_text(s,encoding='utf-8')
p=r/'src/renderer/panel/budget.js';s=p.read_text(encoding='utf-8')
s=s.replace("select('accountId','Hesap',accounts,source,'Hesap seç')+field('date','Tarih',t?.date||view.today,'date','required')+","select('accountId','Hesap',accounts,source,'Hesap seç')+field('date','Gerçek işlem tarihi',t?.date||view.today,'date','required')+(t?.occurrence||t?.partialOccurrence?'<p class=\"budget-muted\">Planın vadesi: '+esc(when(t.occurrence||t.partialOccurrence))+' · Bakiyeye ve rapora gerçek işlem tarihinde yansır.</p>':'')+")
# Legacy SVG dots support both mouse and keyboard through the shared action dispatcher.
s=s.replace('class="income-point"><title>','class="income-point" data-budget-action="chart-records" data-id="${r.month}" tabindex="0" role="button"><title>')
s=s.replace('class="expense-point"><title>','class="expense-point" data-budget-action="chart-records" data-id="${r.month}" tabindex="0" role="button"><title>')
s=s.replace("    'copy-transaction':", "    'chart-records':period=>{const rows=view.transactions.filter(t=>t.date.startsWith(period));dialog(period+' · İlgili işlemler',null,rows.map(transactionRow).join('')||'<p>Bu dönemde kayıt yok.</p>');},\n    'copy-transaction':")
p.write_text(s,encoding='utf-8')
p=r/'src/renderer/panel/premium/index.jsx';s=p.read_text(encoding='utf-8')
s=s.replace("    <div className=\"px-flow-footer\"><Legend", "    {rows[index] && <Button action=\"chart-records\" id={rows[index].month} className=\"px-link\">{rows[index].month} · İlgili işlemleri aç</Button>}\n    <div className=\"px-flow-footer\"><Legend")
p.write_text(s,encoding='utf-8')
p=r/'src/renderer/panel/premium/charts.js';s=p.read_text(encoding='utf-8')
s=s.replace("  canvas.dataset.chartReady = 'true'; canvas.dataset.chartKind = kind;", "  canvas.dataset.chartReady = 'true'; canvas.dataset.chartKind = kind;\n  const empty=kind==='bar'&&data.datasets.every(d=>d.data.every(v=>!v));\n  canvas.style.display=empty?'none':'';\n  canvas.parentElement.querySelector('.nf-chart-empty')?.remove();\n  if(empty){const caption=document.createElement('p');caption.className='nf-chart-empty';caption.textContent='Bu dönemde gösterilecek gelir veya ödeme yok.';canvas.after(caption);}")
p.write_text(s,encoding='utf-8')
print('Remaining feature details applied.')
