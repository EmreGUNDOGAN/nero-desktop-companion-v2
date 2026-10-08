const { contextBridge } = require('electron');
const path = require('node:path');
const {ThemeManager}=require('../src/main/themes');
const {Timer}=require('../src/main/timer');
const manager=new ThemeManager({builtinDir:path.join(__dirname,'../themes'),userDir:null});manager.scan();
const listeners=new Map();
const emit=(name,value)=>{for(const callback of listeners.get(name)||[])callback(structuredClone(value));};

const calls = [];
const initialTheme = process.env.NERO_TEST_THEME || 'bikini-bottom';
const now = Date.now();
const currentKey = '2026-09';
const day = (n) => ({
  day: n,
  date: `2026-09-${String(n).padStart(2, '0')}`,
  value: n === 2 ? 'green' : n === 7 ? 'yellow' : n === 12 ? 'red' : null,
  future: n > 23
});
const neroDay = (n) => ({
  day: n,
  date: `2026-09-${String(n).padStart(2, '0')}`,
  cls: n % 6 === 0 ? 'c5' : null,
  label: n % 6 === 0 ? 'keyifli bir gündü' : null,
  future: n > 23
});
const pastDay = (n) => ({
  day: n,
  date: `2026-08-${String(n).padStart(2, '0')}`,
  value: n === 3 ? 'green' : null,
  future: false
});
const pastNeroDay = (n) => ({
  day: n,
  date: `2026-08-${String(n).padStart(2, '0')}`,
  cls: n % 8 === 0 ? 'c4' : null,
  label: n % 8 === 0 ? 'iyi bir gündü' : null,
  future: false
});

const state = {
  notes: [
    { id: 'n1', body: 'Aklımda kalanlar\nKüçük fikirleri burada saklıyorum.\nBazen en iyi fikir, sıradan bir yolculukta gelir.', createdAt: now-100000,updatedAt:now-50000,archivedAt:null },
    { id:'n2',body:'Hafta sonu planı\nBiraz dinlenme, biraz keşif.',createdAt:now-86400000,updatedAt:now-86400000,archivedAt:null },
    { id:'n3',body:'Bir sonraki adım\nÖnce en küçük işi bitir.',createdAt:now-172800000,updatedAt:now-172800000,archivedAt:null }
  ],
  todos: [
    {
      id: 't1', text: 'Strateji sunumunu bitir', done: false, createdAt: now - 10000, doneAt: null,
      priority:'high',tag:'İş',tags:['İş'],
      remindAt: null, reminded: false, archivedAt: null,
      plannedDurationMin: 65, actualDurationMs: 3720000, stopwatchStartedAt: null, focusCreditedMin: 62
    },
    {
      id: 't2', text: 'Maili gönder', done: true, createdAt: now - 200000, doneAt: now - 5000,
      remindAt: null, reminded: false, archivedAt: null,
      plannedDurationMin: 15, actualDurationMs: 1080000, stopwatchStartedAt: null, focusCreditedMin: 18
    },
    {id:'t3',text:'Hafta sonunu planla',done:false,createdAt:now-12000,doneAt:null,archivedAt:null,bucket:'later',priority:'normal',tag:'Kişisel, Planlama',tags:['Kişisel','Planlama'],plannedDurationMin:20,actualDurationMs:0}
  ],
  settings: {
    themeId: initialTheme, scale: 1, talkativeness: 'normal', muted: false, showTimerBadge: true,
    sound: true, alwaysOnTop: true, lockPosition: false, stayVisible: true, desktopJokes: true,
    peekVisits: true, weatherFx: true, sceneBg: true, ambientSound: false, quickCapture: false,
    waterEvery: 0, breakEvery: 60, daySummary: true, autoUpdate: false, birthday: '',
    userName: 'Emre', panelPinned: false, launchAtStartup: false, hidden: false, lastTimerMinutes: 25
  },
  mood: { happiness: 82, stage: 'content', asleep: false, ignoredMinutes: 2, label: 'Keyfi yerinde' },
  timer: { status: 'idle', remainingMs: 1500000, progress: 0, label: '' },
  themes: manager.list(),
  currentThemeId: initialTheme,
  ui: manager.get(initialTheme).manifest.ui,
  stats: {
    today: { todos: 2, focus: 75, timersDone: 1, timersQuit: 0, notes: 1, pets: 2, todosCreated: 3 },
    week: [
      { day: '2026-09-17', weekday: 4, focus: 30, todos: 1 },
      { day: '2026-09-18', weekday: 5, focus: 45, todos: 2 },
      { day: '2026-09-19', weekday: 6, focus: 0, todos: 0 },
      { day: '2026-09-20', weekday: 0, focus: 60, todos: 2 },
      { day: '2026-09-21', weekday: 1, focus: 25, todos: 1 },
      { day: '2026-09-22', weekday: 2, focus: 90, todos: 3 },
      { day: '2026-09-23', weekday: 3, focus: 75, todos: 2 }
    ],
    totals: { todos: 123, todoCreated: 160, focusMin: 4320, timersDone: 88, timersQuit: 9, notes: 64, pets: 241 },
    display: {
      baselineAt: now - 86400000,
      totals: { todos: 4, todoCreated: 5, focusMin: 180, timersDone: 3, timersQuit: 1, notes: 2, pets: 6 },
      bestStreak: 2
    },
    streak: 7, bestStreak: 21, daysTogether: 140, daysActive: 120
  },
  dayMode: 'sakin',
  rest: false,
  achievements: JSON.parse(JSON.stringify(require('../src/data/achievements'))).map((a,i)=>({...a,unlocked:i<5,unlockedAt:i<5?now:null,progress:i<5?1:.2})),
  desk: { items: ['fincan','defter','saksi1','kitaplar','lamba','cerceve','plak','saat','saksi2','gramofon'].map((id,i)=>({id,icon:['☕','📓','🌱','📚','💡','🖼️','🎵','🕰️','🌸','📻'][i],title:id,hours:(i+1)*.5,unlockedAt:i<2?now:null})), next: {title:'Küçük saksı',minutesLeft:26} },
  jarCount: 3,
  moodboard: {
    key: currentKey, label: 'Eylül 2026',
    user: Array.from({ length: 30 }, (_, i) => day(i + 1)),
    nero: Array.from({ length: 30 }, (_, i) => neroDay(i + 1)),
    editable: true, currentKey,
    availableMonths: [
      { key: '2026-08', label: 'Ağustos 2026' },
      { key: '2026-09', label: 'Eylül 2026' }
    ]
  },
  update: { status: 'latest', version: require('../package.json').version, dismissed: false },
  home: {
    jab: 'Bugün küçük bir adım yeter.',
    dialogueId: 'test-jab', quote: { t: 'Bir şeyler yavaşça da tamamlanabilir.', nero: 'Nero' },
    archive: { total: 6, recent: Array.from({ length: 6 }, (_, i) => ({ text: `Tamamlanan iş ${i + 1}` })) },
    letter: { week: '2026-W39', text: 'Bu hafta fena değildin. Bunu çok büyütmeyeceğim.' }
  },
  wardrobe: require('../src/main/wardrobe').ITEMS,
  version: require('../package.json').version
};

// Capture-only sample records; production and default functional fixtures are unchanged.
if(process.env.NERO_SPONGE_REVIEW==='1'){
 state.stats.display={totals:{todos:20,focusMin:64,timersDone:6,timersQuit:10,notes:8,pets:121},bestStreak:17};state.stats.daysTogether=16;
 state.moodboard={...state.moodboard,key:'2026-10',currentKey:'2026-10',label:'Ekim 2026',availableMonths:[...state.moodboard.availableMonths,{key:'2026-10',label:'Ekim 2026'}],user:Array.from({length:31},(_,i)=>({day:i+1,date:`2026-10-${String(i+1).padStart(2,'0')}`,value:['red','red','yellow','green'][i]||null,future:i+1>8})),nero:Array.from({length:31},(_,i)=>({day:i+1,date:`2026-10-${String(i+1).padStart(2,'0')}`,cls:i<7?'c5':null,future:i+1>8}))};
 state.home.archive={total:6,recent:['Steam profili hazırlandı','Reviews güncellendi','Oyun videosu çekildi','Kitap bölümü okundu','Dosyalar düzenlendi','E-postalar yanıtlandı'].map((text,i)=>({text,doneAt:new Date(`2026-10-0${[6,6,5,4,3,2][i]}T12:00:00`).getTime()}))};
 state.home.quote={t:'Plan yapmak iyidir, uygulamak daha iyi.',nero:'Küçük bir adım daha ilerledin.'};state.home.letter=null;
}
if(process.env.NERO_SPONGE_NOTES_REVIEW==='1'){
 state.notes[0].body='Aklımda kalanlar\nKüçük fikirleri burada saklıyorum.\nBelki bir gün büyük bir şeye dönüşür.';
 state.notes[1].body='Hafta sonu\nDeniz, güneş, biraz dinlenme.\nYeni haftaya daha enerjik başlamak.';
 state.notes[2].body='Bir sonraki adım\nProjeyi gözden geçir.\nEksikleri not al.';
}
if(process.env.NERO_SPONGE_TIMER_REVIEW==='1'){state.stats.today.focus=45;state.stats.today.timersDone=2;}
if(process.env.NERO_SPONGE_WORK_REVIEW==='1'){
 const item=(id,text,options={})=>({id,text,done:false,archivedAt:null,createdAt:now-10000,doneAt:null,actualDurationMs:0,plannedDurationMin:0,bucket:'today',priority:'normal',tags:[],...options});
 state.todos=[item('t1','Sunumu bitir',{plannedDurationMin:45,actualDurationMs:1200000,priority:'high',tags:['İş'],subtasks:[{id:'s1',text:'Taslağı hazırla',done:true},{id:'s2',text:'Görselleri ekle',done:true},{id:'s3',text:'Kontrol et',done:false},{id:'s4',text:'Gönder',done:false}]}),item('t2','Kitap bölümünü oku',{plannedDurationMin:35,tags:['Kişisel']}),item('t3','E-postaları yanıtla',{tags:['İş']}),item('t4','Hafta sonunu planla',{plannedDurationMin:20,bucket:'later',tags:['Kişisel','Planlama']}),item('t5','Kitapçıya uğra',{plannedDurationMin:30,bucket:'later',tags:['Kişisel']}),item('t6','Dosyaları düzenle',{done:true,doneAt:now,plannedDurationMin:25,tags:['İş']}),item('t7','Eski dosyaları yedekle',{done:true,doneAt:now-86400000,archivedAt:now-86400000}),item('t8','Takvimi düzenle',{done:true,doneAt:now-172800000,archivedAt:now-172800000})];
}
const timer=new Timer();
timer.on('tick',t=>{state.timer=t;emit('timer',t);});
let featureService;const rerender=()=>{state.productivity=featureService?.snapshot();emit('state',state);};
const memory={data:{sessions:[],preferences:{}},get(){return this.data},set(v){this.data=v}};
const rowStore=key=>({get:()=>state[key],set:v=>{state[key]=v}});
const jarMemory={data:{items:[{id:'a',text:'Birinci anı',createdAt:Date.now()},{id:'b',text:'İkinci anı',createdAt:Date.now()}]},get(){return this.data},set(v){this.data=v}};
featureService=new (require('../src/main/productivity').Productivity)({store:memory,notes:rowStore('notes'),todos:rowStore('todos'),jar:jarMemory,timer,changed:rerender});
state.productivity=featureService.snapshot();
const pastBoard = {
  key: '2026-08', label: 'Ağustos 2026',
  user: Array.from({ length: 31 }, (_, i) => pastDay(i + 1)),
  nero: Array.from({ length: 31 }, (_, i) => pastNeroDay(i + 1)),
  editable: false, currentKey,
  availableMonths: state.moodboard.availableMonths
};

contextBridge.exposeInMainWorld('nero', {
  invoke: async (channel, ...args) => {
    calls.push({ channel, args });
    if(channel==='features:get')return featureService.snapshot();
    if(channel==='features:note')return featureService.meta('note',args[0]);
    if(channel==='features:todo')return featureService.meta('todo',args[0]);
    if(channel==='features:reorder')return featureService.reorder(...args);
    if(channel==='features:preference')return featureService.preference(...args);
    if(channel==='jar:list')return featureService.snapshot().jar;
    if(channel==='jar:random')return featureService.randomMemory();
    if (channel === 'state:get') return structuredClone(state);
    if (channel === 'moodboard:get') return args[0] === '2026-08' ? structuredClone(pastBoard) : null;
    if (channel === 'stats:resetDisplay') return structuredClone(state.stats);
    if (channel === 'themes:reload') return structuredClone(state.themes);
    if (channel === 'settings:set') {
      state.settings[args[0]] = args[1];
      if(args[0]==='themeId'){state.currentThemeId=args[1];state.ui=manager.get(args[1]).manifest.ui;emit('theme',{manifest:manager.get(args[1]).manifest});}
      rerender();return structuredClone(state.settings);
    }
    if(channel==='notes:save'){const input=args[0];let note=state.notes.find(n=>n.id===input.id);if(!note){note={id:'note-'+Date.now(),createdAt:Date.now(),archivedAt:null};state.notes.unshift(note);}note.body=input.body;note.updatedAt=Date.now();rerender();return structuredClone(note);}
    if(channel==='notes:archive'){const note=state.notes.find(n=>n.id===args[0]);note.archivedAt=args[1]?Date.now():null;rerender();return true;}
    if(channel==='notes:delete'){state.notes=state.notes.filter(n=>n.id!==args[0]);rerender();return true;}
    if(channel==='todos:add'){state.todos.push({id:'todo-'+Date.now(),text:args[0],done:false,createdAt:Date.now(),archivedAt:null,actualDurationMs:0,plannedDurationMin:Number(args[2])||0,bucket:'today'});rerender();return true;}
    if(channel==='todos:toggle'){const todo=state.todos.find(t=>t.id===args[0]);todo.done=!todo.done;todo.doneAt=todo.done?Date.now():null;rerender();return true;}
    if(channel==='todos:rename'){state.todos.find(t=>t.id===args[0]).text=args[1];rerender();return true;}
    if(channel==='todos:archive'){state.todos.find(t=>t.id===args[0]).archivedAt=args[1]?Date.now():null;rerender();return true;}
    if(channel==='todos:archiveDone'){for(const t of state.todos)if(t.done&&!t.archivedAt)t.archivedAt=Date.now();rerender();return true;}
    if(channel==='todos:delete'){state.todos=state.todos.filter(t=>t.id!==args[0]);rerender();return true;}
    if(channel==='todos:setReminder'){state.todos.find(t=>t.id===args[0]).remindAt=args[1]?Date.now()+3600000:null;rerender();return true;}
    if(channel==='todos:addSubtask'){const t=state.todos.find(t=>t.id===args[0]);(t.subtasks||(t.subtasks=[])).push({id:'s'+Date.now(),text:args[1],done:false});rerender();return true;}
    if(channel==='todos:toggleSubtask'){const s=state.todos.find(t=>t.id===args[0]).subtasks.find(s=>s.id===args[1]);s.done=!s.done;rerender();return true;}
    if(channel==='todos:renameSubtask'){state.todos.find(t=>t.id===args[0]).subtasks.find(s=>s.id===args[1]).text=args[2];rerender();return true;}
    if(channel==='todos:deleteSubtask'){const t=state.todos.find(t=>t.id===args[0]);t.subtasks=t.subtasks.filter(s=>s.id!==args[1]);rerender();return true;}
    if(channel==='timer:start'){featureService.prepare(args[2]);timer.start(args[0],args[1]);return timer.snapshot();}
    if(channel==='timer:pause'){timer.pause();return timer.snapshot();}
    if(channel==='timer:resume'){timer.resume();return timer.snapshot();}
    if(channel==='timer:cancel'){timer.cancel();return timer.snapshot();}
    if(channel==='jar:add'){state.jarCount++;rerender();return true;}
    if(channel==='moodboard:set'){state.moodboard.user.find(d=>d.date===args[0]).value=args[1];rerender();return true;}
    if (channel === 'home:seen') return true;
    if(channel==='todos:stopwatchStart'){const t=state.todos.find(t=>t.id===args[0]);t.stopwatchStartedAt=Date.now();rerender();return structuredClone(t);}
    if(channel==='todos:stopwatchPause'){const t=state.todos.find(t=>t.id===args[0]);t.actualDurationMs=(t.actualDurationMs||0)+(t.stopwatchStartedAt?Date.now()-t.stopwatchStartedAt:0);t.stopwatchStartedAt=null;rerender();return structuredClone(t);}
    return true;
  },
  send: (channel, ...args) => { calls.push({ channel, args }); },
  on: (name,callback) => {const list=listeners.get(name)||[];list.push(callback);listeners.set(name,list);return ()=>listeners.set(name,list.filter(f=>f!==callback));},
  __snapshot: ()=>structuredClone(state),
  __empty: ()=>{state.notes=[];state.todos=[];state.home.jab='Bir sonraki adım seninle başlar.';rerender();},
  __timerElapsed: (progress)=>{timer.endsAt=Date.now()+timer.durationMs*(1-progress);state.timer=timer.snapshot();emit('timer',state.timer);},
  __getCalls: () => structuredClone(calls)
});
