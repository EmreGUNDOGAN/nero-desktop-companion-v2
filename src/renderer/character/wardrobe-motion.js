'use strict';
(function(root){
root.createWardrobeMotion=function({host,onPose,onGaze}){
 const motion=document.createElement('div'),torso=document.createElement('div');motion.className='wardrobe-motion-root';torso.className='wardrobe-motion-torso';
 while(host.firstChild)torso.append(host.firstChild);motion.append(torso);host.append(motion);
 const canvas=document.createElement('canvas');canvas.width=520;canvas.height=600;canvas.className='wardrobe-motion-body';canvas.style.cssText='display:none;left:-9.090909%;top:-7.692308%;width:118.181818%;height:115.384615%;right:auto;bottom:auto';torso.prepend(canvas);
 let deform;try{deform=root.createWardrobeDeform(canvas);}catch(_){deform=null;}
 // Hidden animation drivers preserve the player's timing, cancellation and expression rules.
 const drivers={};for(const key of ['leftArm','rightArm','leftFoot','rightFoot','crossArms']){const el=document.createElement('i');el.style.cssText='position:absolute;visibility:hidden;pointer-events:none';el.style.opacity=key==='crossArms'?'0':'1';drivers[key]=el;torso.append(el);}
 let source=null,active=false,ready=false,frame=0;const loadBody=()=>{ready=!!(source&&deform?.setImage(source));};
 const matrix=el=>{const value=getComputedStyle(el).transform;return value==='none'?new DOMMatrix():new DOMMatrix(value);};
 function draw(){if(!active)return;const l=matrix(drivers.leftArm),r=matrix(drivers.rightArm),lf=matrix(drivers.leftFoot),rf=matrix(drivers.rightFoot),cross=Number(getComputedStyle(drivers.crossArms).opacity)||0;
  const clamp=v=>Math.max(-.48,Math.min(.48,v));
  if(ready&&deform?.draw(clamp(Math.atan2(l.b,l.a)-cross*.45),clamp(Math.atan2(r.b,r.a)+cross*.45),lf.f,rf.f)){canvas.style.display='';if(source)source.style.visibility='hidden';}
  else{canvas.style.display='none';if(source)source.style.visibility='';}
  frame=requestAnimationFrame(draw);
 }
 const player=root.createNeroMotionPlayer({node:id=>id==='motion'?motion:id==='torso'?torso:drivers[id],onPose,onGaze,onActive:value=>{active=value;host.classList.toggle('motion-active',value);cancelAnimationFrame(frame);canvas.style.display='none';if(source)source.style.visibility='';if(value)draw();}});
 canvas.addEventListener('webglcontextlost',()=>{ready=false;player.reset();});
 function syncBody(img){if(source===img)return;if(source){source.style.visibility='';source.removeEventListener('load',loadBody);}source=img;ready=false;player.reset();if(img){if(img.complete&&img.naturalWidth)loadBody();else img.addEventListener('load',loadBody,{once:true});}}
 return {syncBody,play:player.play,reset:player.reset,get active(){return active;},dispose(){player.reset();source?.removeEventListener('load',loadBody);deform?.dispose();canvas.remove();Object.values(drivers).forEach(el=>el.remove());if(source)source.style.visibility='';while(torso.firstChild)host.append(torso.firstChild);motion.remove();host.classList.remove('motion-active');}};
};
})(window);
