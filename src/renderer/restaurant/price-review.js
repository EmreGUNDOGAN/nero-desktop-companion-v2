const rows=[...document.querySelectorAll('#products tbody tr')],search=document.getElementById('search'),group=document.getElementById('group');
function filter(){const q=search.value.toLocaleLowerCase('tr-TR').trim();let shown=0;for(const row of rows){row.hidden=Boolean(group.value&&row.dataset.group!==group.value)||!row.textContent.toLocaleLowerCase('tr-TR').includes(q);if(!row.hidden)shown++;}document.getElementById('count').textContent=shown+' / '+rows.length+' ürün';}
search.addEventListener('input',filter);group.addEventListener('change',filter);
