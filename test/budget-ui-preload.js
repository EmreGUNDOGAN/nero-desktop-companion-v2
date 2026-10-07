'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {ipcRenderer}=require('electron');
let fixture=fs.readFileSync(path.join(__dirname,'panel-integration-preload.js'),'utf8');
fixture=fixture.replace(/version: '4\.3\.0'/g, "version: '6.9.11'");
fixture=fixture.replace('const calls = [];','const calls = []; const listeners = {};');
fixture=fixture.replace("if (channel === 'state:get')", "if(channel.startsWith('budget:'))return require('electron').ipcRenderer.invoke(channel,...args); if (channel === 'state:get')");
fixture=fixture.replace('on: () => () => {},',"on: (name,fn) => {listeners[name]=fn;return ()=>{};}, __theme: (ui) => listeners.theme?.({manifest:{ui}}),");
vm.runInThisContext(`(function(require,__dirname){${fixture}\n})`)(require,__dirname);
