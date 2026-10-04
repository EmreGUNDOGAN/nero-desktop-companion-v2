from pathlib import Path
import re,json
ROOT=Path(__file__).resolve().parents[2]
# Canonical approved motion definitions are embedded as a build input.
preview=(ROOT/'scripts/wardrobe/approved-motion.html').read_text()
body=re.search(r'<g id="motion">(.*?)</svg>',preview,re.S)[1]
# Replace IDs with scoped data attributes; the live layer render remains driven by original manifests.
body=re.sub(r'id="([^"]+)"',r'data-rig="\1"',body)
body=body.replace('<g data-rig="crossArms"','<g data-rig="costumeBody"></g><g data-rig="costumeHat"></g><g data-rig="crossArms"',1)
for key in ['leftArm','rightArm']:
 body=re.sub(r'(<g data-rig="'+key+r'">.*?)(</g>)',lambda m:m[1]+'<g data-rig="'+key+'Cloth"></g>'+m[2],body,count=1)
for key in ['eyes','pupils','lids','brows','mouth']:
 # eyes and pupils contain direct primitives in the approved source.
 body=re.sub(r'<g data-rig="'+key+r'">.*?</g>', '<g data-rig="'+key+'"></g>',body,count=1,flags=re.S)
body=body.replace('<g data-rig="costumeBody">','<g data-rig="legacyOutfit"></g><g data-rig="costumeBody">')
body=body.replace('</g></g>', '</g></g>',1)
# Face expression variants come from the theme, not a second face drawing.
(ROOT/'src/shared/nero-rig-template.js').write_text('(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else root.NeroRigTemplate=factory();})(typeof globalThis!=="undefined"?globalThis:this,()=>'+json.dumps('<g data-rig="motion">'+body,ensure_ascii=False)+');\n')
start=preview.index(" if(name==='laugh')")
end=preview.index(" timers.push(setTimeout(()=>{reset(true);",start)
code=preview[start:end]
# Desktop window peek already positions the window at the monitor edge; local movement must stay inside it.
code=code.replace("$('stage').classList.add('peeking');const shift=Math.max(65,($('stage').clientWidth/2-15)/1.1);", "const shift=12;")
code=code.replace('shift-45','shift-8').replace('shift-55','shift-10')
code=code.replace("[", "[",1)
(ROOT/'src/renderer/character/motion-player.js').write_text('''// Shared playback: same SVG limb pivots as the approved preview.
(function(root){
root.createNeroMotionPlayer=function({node, onPose, onGaze, onActive, setTimeoutFn=setTimeout, clearTimeoutFn=clearTimeout}){
 const $=node;let clips=[],timers=[],gaze=null,expression='normal';
 const faces={normal:['heavy','normal','neutral'],laugh:['heavy','happy','smirk'],think:[null,'curious','flat'],peek:[null,'curious','flat'],balance:[null,'surprised','surprised'],victory:[null,'happy','smile'],tap:['half','normal','flat'],cross:['half','angry','flat'],glance:['heavy','curious','flat'],pet:['half','happy','smile'],shy:['heavy','normal','smirk'],yawn:['half','sleepy','sleepy'],nod:['half','sleepy','sleepy'],dance:['heavy','happy','smirk']};
 const durations={laugh:2600,think:3000,peek:4400,balance:2000,victory:2000,tap:3000,cross:3400,glance:2900,pet:2800,shy:3100,yawn:4300,nod:3600,dance:6200};
 const setTimeout=(fn,ms)=>setTimeoutFn(()=>{fn();onGaze(gaze);},ms);
 function render(){onPose(faces[expression]);}
 function reset(){clips.forEach(a=>a.cancel());clips=[];timers.forEach(clearTimeoutFn);timers=[];gaze=null;expression='normal';faces.yawn=['half','sleepy','sleepy'];faces.nod=['half','sleepy','sleepy'];onPose(null);onGaze(null);onActive(false);}
 function anim(id,frames,duration,options={}){const a=$(id).animate(frames,{duration,easing:'ease-in-out',fill:'none',...options});clips.push(a);return a;}
 const rotation=values=>values.map(v=>({transform:`rotate(${v}deg)`}));
 function play(name){if(!Object.prototype.hasOwnProperty.call(durations,name))return false;reset();expression=name;render();onActive(true);const d=durations[name];
'''+code+'''
 onGaze(gaze);timers.push(setTimeout(()=>reset(),d+50));return true;
 }
 return {play,reset,durations};
};
if(typeof module==='object'&&module.exports)module.exports=root.createNeroMotionPlayer;
})(typeof globalThis!=='undefined'?globalThis:this);
''')
