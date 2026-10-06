const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'src/renderer/bee/index.html'),'utf8');
const js=fs.readFileSync(path.join(root,'src/renderer/bee/bee.js'),'utf8');
const css=fs.readFileSync(path.join(root,'src/renderer/bee/bee.css'),'utf8');

test('arıcının evi tek sabit oyun içi kesit oda olarak açılır',()=>{
  assert.match(html,/id="house-modal"/);
  assert.match(js,/openHouseInterior\(\)/);
  assert.match(css,/assets\/house\/room\.svg/);
  assert.equal(fs.existsSync(path.join(root,'src/renderer/bee/assets/house/room.svg')),true);
  assert.doesNotMatch(html,/house-stage-note|data-stage=/);
});
test('ev içi büyük dashboard etiketleri yerine hover hotspot kullanır',()=>{
  assert.match(html,/data-tip="Turnuva Kupaları"/);
  assert.match(html,/data-tip="Bal Rafı"/);
  assert.match(html,/data-tip="Mektuplar"/);
  assert.match(html,/data-tip="Arıcının Defteri"/);
  assert.doesNotMatch(html,/house-hotspot-label/);
  assert.match(css,/\.house-hotspot:hover:after/);
});
test('ev verileri mevcut gerçek kayıtlardan beslenir',()=>{
  assert.match(js,/view\.festival\?\.cups/);
  assert.match(js,/view\.ledger\?\.honey/);
  assert.match(js,/view\.letters/);
  assert.match(js,/view\.milestones\?\.koy_seviye_1/);
  assert.match(js,/houseFirstHoney/);
});