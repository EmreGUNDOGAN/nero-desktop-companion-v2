'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..'),w=require('../../src/main/wardrobe'),added=require('../../src/main/wardrobe-additions.json'),catalog=require('../../themes/default/assets/wardrobe/catalog.json');
assert.equal(require('../../package.json').version,'9.6.7');assert.equal(w.LEGACY_ITEMS.length,72);assert.equal(added.length,100,'New wardrobe collection incomplete');
assert.equal(Object.keys(catalog).length,188);assert.equal(w.ITEMS.length,172);
for(const group of ['retro','fairy','cozy','space','absurd'])assert.equal(added.filter(x=>x.group===group).length,20,group);
for(const [id,{layers}]of Object.entries(catalog)){assert.ok(fs.existsSync(path.join(root,'themes/default/assets/wardrobe',`outfit-${id}.png`)));for(const variants of Object.values(layers))for(const file of Object.values(variants))assert.ok(fs.existsSync(path.join(root,'themes/default/assets/wardrobe',id,file)),id+'/'+file);}
console.log('Release assets complete: 88 preserved + 100 new, all animated layers present.');
