from pathlib import Path
r=Path(__file__).resolve().parents[1]
p=r/'test/all-features-ui.cjs';s=p.read_text(encoding='utf-8')
anchor=" await tab('timer');"
addition=""" await js('document.querySelector("#todo-list [data-todo-id=t1]").scrollIntoView({block:"center"});true');
 const source=await js('(()=>{const r=document.querySelector("#todo-list [data-todo-id=t1] .todo-text").getBoundingClientRect();return {x:Math.round(r.x+30),y:Math.round(r.y+8)}})()');
 win.webContents.sendInputEvent({type:'mouseDown',...source,button:'left',clickCount:1});win.webContents.sendInputEvent({type:'mouseMove',x:source.x+15,y:source.y+15});await wait(60);
 const target=await js('(()=>{const r=document.querySelector(".nf-dropzone[data-bucket=later]").getBoundingClientRect();return {x:Math.round(r.x+r.width/2),y:Math.round(r.y+r.height/2)}})()');
 win.webContents.sendInputEvent({type:'mouseMove',...target});win.webContents.sendInputEvent({type:'mouseUp',...target,button:'left',clickCount:1});await wait(150);
 assert.equal(await js('window.nero.__snapshot().todos.find(t=>t.id==="t1").bucket'),'later');await js('window.nero.invoke("features:todo",{id:"t1",bucket:"today"});true');await wait(150);report.actions.push('real pointer drag Today to Later');
"""
assert anchor in s;s=s.replace(anchor,addition+anchor,1);p.write_text(s,encoding='utf-8')
p=r/'test/new-features-finance-ui.cjs';s=p.read_text(encoding='utf-8')
anchor="    const extraPlan=budget.act('plan'"
addition="""    await tab('transactions');const original=budget.state.transactions.find(t=>t.type==='expense');await click('copy-transaction',original.id);assert.equal(await js('document.querySelector("#budget-fields [name=type]").value'),'expense');assert.equal(await js('document.querySelector("#budget-fields [name=amount]").value'),(original.amount/100).toFixed(2).replace('.',','));await close();
    await tab('reports');await click('chart-records',today.slice(0,7));assert.equal(await js('document.getElementById("budget-editor").open'),true);assert.ok(await js('document.getElementById("budget-fields").querySelectorAll(".budget-transaction").length>0'));await close();
"""
assert anchor in s;s=s.replace(anchor,addition+anchor,1);p.write_text(s,encoding='utf-8')
p=r/'test/comic-character-smoke.cjs';s=p.read_text(encoding='utf-8').replace("['cizgi-roman-arasi']","['bikini-bottom']").replace("tm.get('cizgi-roman-arasi')","tm.get('bikini-bottom')").replace("),'cizgi-roman-arasi');", "),'bikini-bottom');").replace('docs/cizgi-roman','docs/new-features').replace('comic character skin','SpongeBob character skin')
(r/'test/sponge-character-smoke.cjs').write_text(s,encoding='utf-8')
print('Interaction checks added.')
