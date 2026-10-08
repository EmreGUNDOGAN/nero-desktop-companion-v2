from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'src/renderer/panel/productivity-ui.js';s=p.read_text(encoding='utf-8')
old="const list=$('todo-list');list.querySelectorAll('.nf-group').forEach(n=>n.remove());const rows=[...list.children].filter(r=>r.dataset.todoId);"
new="const list=$('todo-list');const rows=[...list.querySelectorAll('[data-todo-id]')];for(const row of rows)list.append(row);list.querySelectorAll('.nf-group,.gg-work-page').forEach(n=>n.remove());"
assert old in s;s=s.replace(old,new)
needle="list.append(heading,...matches);}\n }\n function renderSessions"
assert needle in s;s=s.replace(needle,"list.append(heading,...matches);}\n  window.NeroGilmoreFidelity?.todos();\n }\n function renderSessions")
needle="dialog('Kavanozdaki anılar',d=>{"
assert needle in s;s=s.replace(needle,"dialog('Kavanozdaki anılar',d=>{d.dataset.kind='memories';")
p.write_text(s,encoding='utf-8')
p=root/'src/renderer/panel/panel.js';s=p.read_text(encoding='utf-8')
needle="li.className = `badge badge-${a.rarity}${a.unlockedAt ? ' on' : ''}`;"
assert needle in s;s=s.replace(needle,needle+"\n      li.dataset.badgeId=a.id;")
needle="window.NeroThemeTrio?.updateBadges();\n  }\n\n  $('badge-rarity-tabs')"
assert needle in s;s=s.replace(needle,"window.NeroThemeTrio?.updateBadges();\n    window.NeroGilmoreFidelity?.badges();\n  }\n\n  $('badge-rarity-tabs')")
needle="window.NeroTVThemes?.timer(state?.timer||{status:'idle'});"
assert needle in s;s=s.replace(needle,needle+"\n    window.NeroGilmoreFidelity?.timer(state?.timer||{status:'idle'});")
p.write_text(s,encoding='utf-8')
print('Native hooks preserve handlers, grouped task filtering and live badge categories.')
