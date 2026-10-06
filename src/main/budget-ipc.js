'use strict';
const fs=require('node:fs'),path=require('node:path'),os=require('node:os'),{randomUUID}=require('node:crypto');
const {reportHTML}=require('./budget-report');
const {exportCSV,previewCSV,importCSV}=require('./budget-csv');
function registerBudgetIPC({ipcMain,dialog,shell,BrowserWindow,budget,getPanel,backup}) {
  let pending=null;
  const handle=(channel,fn)=>ipcMain.handle(channel,async(e,...args)=>{
    if(e.sender!==getPanel()?.webContents)return {ok:false,error:'Bütçe yalnız Nero panelinden açılabilir.'};
    try{return await fn(...args);}catch(err){return {ok:false,error:err.message};}
  });
  handle('budget:duplicate',input=>({ok:true,duplicates:budget.duplicate(input)}));
  handle('budget:sourceOpen',async id=>{const {sources,books}=require('../renderer/panel/budget-handbook');const source=sources[id]||books.find(b=>b.id===id);if(!source)throw new Error('Kaynak bulunamadı.');await shell.openExternal(source.url);return {ok:true};});
  handle('budget:get',month=>({ok:true,view:budget.view(month)}));
  handle('budget:act',(action,input,month)=>{budget.act(action,input);return {ok:true,view:budget.view(month)};});
  handle('budget:csvExport',async(from,to)=>{
    const r=await dialog.showSaveDialog(getPanel(),{title:'Bütçe işlemlerini CSV olarak kaydet',defaultPath:`Nero-Butce-${from||'tum'}.csv`,filters:[{name:'CSV',extensions:['csv']}]});
    if(r.canceled)return {ok:false,canceled:true};fs.writeFileSync(r.filePath,exportCSV(budget,from,to),'utf8');return {ok:true};
  });
  handle('budget:csvPreview',async()=>{
    const r=await dialog.showOpenDialog(getPanel(),{title:'Bütçe CSV dosyası',filters:[{name:'CSV',extensions:['csv']}],properties:['openFile']});
    if(r.canceled)return {ok:false,canceled:true};if(fs.statSync(r.filePaths[0]).size>8*1024*1024)throw new Error('CSV en fazla 8 MB olabilir.');
    const preview=previewCSV(budget,fs.readFileSync(r.filePaths[0],'utf8'));pending={token:randomUUID(),preview};
    return {ok:true,token:pending.token,count:preview.valid.length,errors:preview.errors.slice(0,100),duplicates:preview.duplicates,total:preview.total,rows:preview.valid.slice(0,8)};
  });
  handle('budget:csvImport',(token,month)=>{if(!pending||pending.token!==token)throw new Error('CSV önizlemesini yeniden aç.');backup();const count=importCSV(budget,pending.preview);pending=null;return {ok:true,count,view:budget.view(month)};});
  handle('budget:receiptAdd',async(id,month)=>{
    const t=budget.state.transactions.find(t=>t.id===id);if(!t)throw new Error('Önce işlemi kaydet.');
    const r=await dialog.showOpenDialog(getPanel(),{title:'Fiş veya belge ekle',filters:[{name:'Fiş',extensions:['png','jpg','jpeg','pdf']}],properties:['openFile']});if(r.canceled)return {ok:false,canceled:true};
    const file=r.filePaths[0];if(fs.statSync(file).size>8*1024*1024)throw new Error('Bir belge en fazla 8 MB olabilir.');const bytes=fs.readFileSync(file);if(bytes.length>8*1024*1024)throw new Error('Bir belge en fazla 8 MB olabilir.');
    const ext=path.extname(file).toLowerCase();validateReceipt(ext,bytes);
    const receipt={id:randomUUID(),transactionId:id,name:path.basename(file).slice(0,150),ext,data:bytes.toString('base64'),size:bytes.length};
    budget.state.receipts.push(receipt);t.receiptIds.push(receipt.id);budget.save('receipt.add',id);return {ok:true,view:budget.view(month)};
  });
  handle('budget:receiptOpen',async(id)=>{
    const r=budget.state.receipts.find(r=>r.id===id);if(!r)throw new Error('Belge bulunamadı.');const bytes=Buffer.from(r.data,'base64');validateReceipt(r.ext,bytes);
    const dir=path.join(os.tmpdir(),'nero-budget-receipts');fs.mkdirSync(dir,{recursive:true});
    const target=path.join(dir,randomUUID()+r.ext);fs.writeFileSync(target,bytes);const error=await shell.openPath(target);if(error)throw new Error(error);return {ok:true};
  });
  handle('budget:receiptRemove',(id,month)=>{const r=budget.state.receipts.find(r=>r.id===id);if(!r)throw new Error('Belge bulunamadı.');budget.state.receipts=budget.state.receipts.filter(r=>r.id!==id);for(const t of budget.state.transactions)t.receiptIds=t.receiptIds.filter(x=>x!==id);budget.save('receipt.delete',id);return {ok:true,view:budget.view(month)};});
  handle('budget:reportPDF',async(month)=>{
    const view=budget.view(month),r=await dialog.showSaveDialog(getPanel(),{title:'Aylık bütçe raporu',defaultPath:`Nero-Butce-${month}.pdf`,filters:[{name:'PDF',extensions:['pdf']}]});
    if(r.canceled)return {ok:false,canceled:true};
    const win=new BrowserWindow({show:false,webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,offscreen:true}});
    try{await win.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent(reportHTML(view)));const data=await win.webContents.printToPDF({printBackground:true,pageSize:'A4'});fs.writeFileSync(r.filePath,data);return {ok:true};}finally{win.destroy();}
  });
  handle('budget:backup',async()=>{
    const r=await dialog.showSaveDialog(getPanel(),{title:'Bütçe yedeği',defaultPath:'Nero-Butce.json',filters:[{name:'Bütçe yedeği',extensions:['json']}]});if(r.canceled)return {ok:false,canceled:true};fs.writeFileSync(r.filePath,JSON.stringify({app:'NeroBudget',version:1,budget:budget.export()},null,2),'utf8');return {ok:true};
  });
  handle('budget:restore',async(month)=>{
    const r=await dialog.showOpenDialog(getPanel(),{title:'Bütçe yedeğini aç',filters:[{name:'Bütçe yedeği',extensions:['json']}],properties:['openFile']});if(r.canceled)return {ok:false,canceled:true};
    const parsed=JSON.parse(fs.readFileSync(r.filePaths[0],'utf8'));if(parsed.app!=='NeroBudget')throw new Error('Bu bir Nero Bütçe yedeği değil.');budget.validate(parsed.budget);
    for(const receipt of parsed.budget.receipts)validateReceipt(receipt.ext,Buffer.from(receipt.data,'base64'));
    const answer=await dialog.showMessageBox(getPanel(),{type:'question',title:'Bütçe yedeğini geri yükle',message:'Mevcut bütçe bu yedekle değiştirilecek.',detail:'Mevcut kayıtlar önce yedeklenir. Notlar ve görevler değişmez.',buttons:['Geri yükle','Vazgeç'],defaultId:1,cancelId:1});if(answer.response!==0)return {ok:false,canceled:true};
    backup();budget.replace(parsed.budget);return {ok:true,view:budget.view(month)};
  });
}
function validateReceipt(ext,bytes){if(bytes.length>8*1024*1024)throw new Error('Belge çok büyük.');const okay=ext==='.pdf'?bytes.subarray(0,5).toString()==='%PDF-':ext==='.png'?bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])):['.jpg','.jpeg'].includes(ext)?bytes[0]===255&&bytes[1]===216&&bytes[2]===255:false;if(!okay)throw new Error('Yalnız geçerli PNG, JPEG veya PDF belgeleri kabul edilir.');}
module.exports={registerBudgetIPC,validateReceipt};
