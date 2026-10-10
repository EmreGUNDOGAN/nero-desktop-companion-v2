const rows=[...document.querySelectorAll('.scroll tbody tr')],filter=document.getElementById('filter');
filter.addEventListener('input',()=>{const q=filter.value.trim().toLocaleLowerCase('tr-TR');let count=0;for(const row of rows){row.hidden=!row.textContent.toLocaleLowerCase('tr-TR').includes(q);if(!row.hidden)count++;}document.getElementById('count').textContent=count+' hedef';});
