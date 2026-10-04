// Shared playback: same SVG limb pivots as the approved preview.
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
 if(name==='laugh'){
 anim('torso',[{transform:'translateY(0)'},{transform:'translateY(-2px) rotate(-1deg)'},{transform:'translateY(0)'},{transform:'translateY(-2px) rotate(1deg)'},{transform:'translateY(0)'},{transform:'translateY(0)'}],d);
 anim('rightArm',rotation([0,28,28,18,0,0]),d);
 }
 if(name==='think'){anim('torso',rotation([0,-6,-6,-6,2,0]),d);}
 if(name==='peek'){
 const shift=12;
 anim('motion',[{transform:'translateX(0)'},{transform:`translateX(${shift}px)`},{transform:`translateX(${shift-8}px) rotate(-12deg)`},{transform:`translateX(${shift}px)`},{transform:`translateX(${shift-10}px) rotate(-8deg)`},{transform:'translateX(0)'}],d);
 }
 if(name==='balance'){anim('motion',[{transform:'translateX(0) rotate(0)'},{transform:'translateX(12px) rotate(11deg)'},{transform:'translateX(-5px) rotate(-6deg)'},{transform:'translateX(2px) rotate(2deg)'},{transform:'translateX(0) rotate(0)'}],d);anim('leftArm',rotation([0,65,30,10,0]),d);anim('rightArm',rotation([0,-45,-65,-10,0]),d);}
 if(name==='victory'){anim('motion',[{transform:'translateY(0)'},{transform:'translateY(2px)'},{transform:'translateY(-13px)'},{transform:'translateY(0)'},{transform:'translateY(-3px)'},{transform:'translateY(0)'}],d);anim('leftArm',rotation([0,0,105,85,25,0]),d);anim('rightArm',rotation([0,0,-105,-85,-25,0]),d);}
 if(name==='tap'){anim('rightFoot',[{transform:'translateY(0) rotate(0)'},{transform:'translateY(-4px) rotate(-9deg)'},{transform:'translateY(0) rotate(0)'}],420,{iterations:6});anim('torso',rotation([0,-1,-1,0]),d);}

 if(name==='cross'){
 anim('crossArms',[{opacity:0},{opacity:1,offset:.22},{opacity:1,offset:.78},{opacity:0}],d);
 for(const id of ['leftArm','rightArm'])anim(id,[{opacity:1},{opacity:0,offset:.22},{opacity:0,offset:.78},{opacity:1}],d);
 gaze={x:0,y:-5};timers.push(setTimeout(()=>gaze={x:5,y:-3},1100),setTimeout(()=>gaze=null,2400));
 anim('torso',rotation([0,-2,-2,0]),d);
 }
 if(name==='glance'){gaze={x:6,y:0};anim('torso',rotation([0,0,3,3,0]),d);timers.push(setTimeout(()=>gaze=null,2100));}
 if(name==='pet'){anim('torso',rotation([0,-5,-5,-3,0]),d);anim('motion',[{transform:'translateY(0)'},{transform:'translateY(2px)'},{transform:'translateY(0)'}],d);}
 if(name==='shy'){anim('torso',rotation([0,-3,-3,1,0]),d);gaze={x:-3,y:2};timers.push(setTimeout(()=>{expression='victory';render();},550),setTimeout(()=>{expression='normal';gaze=null;render();},2000));}
 if(name==='yawn'){
 anim('leftArm',rotation([0,10,90,110,90,20,0]),d);anim('rightArm',rotation([0,-10,-90,-110,-90,-20,0]),d);
 anim('torso',[{transform:'translateY(0)'},{transform:'translateY(-3px)'},{transform:'translateY(-5px)'},{transform:'translateY(0)'}],d);
 timers.push(setTimeout(()=>{faces.yawn=['closed','sleepy','surprised'];render();},650),setTimeout(()=>{faces.yawn=['half','sleepy','sleepy'];render();},2800));
 }
 if(name==='nod'){anim('torso',[{transform:'translateY(0) rotate(0)'},{transform:'translateY(2px) rotate(3deg)',offset:.35},{transform:'translateY(6px) rotate(7deg)',offset:.66},{transform:'translateY(-2px) rotate(-3deg)',offset:.73},{transform:'translateY(0) rotate(0)'}],d);timers.push(setTimeout(()=>{faces.nod=['closed','sleepy','sleepy'];render();},950),setTimeout(()=>{faces.nod=[null,'surprised','surprised'];render();},2600),setTimeout(()=>{faces.nod=['half','sleepy','sleepy'];render();},3150));}
 if(name==='dance'){
 const steps=[0,-8,0,8,0,-8,0,8,0,-6,0,6,0];
 anim('motion',steps.map((v,i)=>({transform:`translate(${v}px,${i%2?-3:0}px) rotate(${v/3}deg)`})),d);
 anim('leftArm',rotation([0,20,45,15,0,35,65,20,0,35,15,10,0]),d);
 anim('rightArm',rotation([0,-45,-20,0,-30,-60,-20,0,-35,-15,-30,-10,0]),d);
 anim('leftFoot',steps.map((v,i)=>({transform:`translateY(${i%4===1?-5:0}px) rotate(${i%4===1?-9:0}deg)`})),d);
 anim('rightFoot',steps.map((v,i)=>({transform:`translateY(${i%4===3?-5:0}px) rotate(${i%4===3?9:0}deg)`})),d);
 }

 onGaze(gaze);timers.push(setTimeout(()=>reset(),d+50));return true;
 }
 return {play,reset,durations};
};
if(typeof module==='object'&&module.exports)module.exports=root.createNeroMotionPlayer;
})(typeof globalThis!=='undefined'?globalThis:this);
