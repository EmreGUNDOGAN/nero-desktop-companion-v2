'use strict';
// Reuse the existing panel fixture, adding nested tasks and state events.
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
const electron = require('electron');
let fixture = fs.readFileSync(path.join(__dirname, 'panel-integration-preload.js'), 'utf8');
fixture = fixture.replace("const calls = [];", "const calls = []; const listeners = {};");
fixture = fixture.replace("ui: { skin: 'cozy' }", `ui: ${JSON.stringify(require('../themes/radyo-aksami/theme.json').ui)}`);
fixture = fixture.replace("id: 't1', text:", "subtasks: [{id:'c1',text:'İlk sayfayı boya',done:false},{id:'c2',text:'İkinci sayfayı boya',done:true}], id: 't1', text:");
fixture = fixture.replace("if (channel === 'state:get')", `if (channel === 'todos:reorder') { state.todos = args[0].map(id => state.todos.find(t => t.id === id)); listeners.state?.(structuredClone(state)); return true; }
    if (channel === 'todos:addSubtask') { state.todos.find(t=>t.id===args[0]).subtasks.push({id:'new-child',text:args[1],done:false}); listeners.state?.(structuredClone(state)); return true; }
    if (channel === 'theme:get') return null;
    if (channel === 'state:get')`);
fixture = fixture.replace("on: () => () => {},", "on: (name, fn) => { listeners[name] = fn; return () => {}; },");
vm.runInThisContext(`(function(require,__dirname){${fixture}\n})`)(require, __dirname);
