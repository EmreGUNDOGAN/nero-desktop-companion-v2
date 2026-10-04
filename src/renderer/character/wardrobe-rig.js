/* The live character uses original face layers in the approved articulated SVG body. */
(function(root){
const NS='http://www.w3.org/2000/svg';
root.createNeroRig=function({host,manifest,onPose}){
 const svg=document.createElementNS(NS,'svg');svg.setAttribute('viewBox','0 0 220 260');svg.classList.add('nero-live-rig');svg.innerHTML=root.NeroRigTemplate;host.appendChild(svg);
 const node=id=>svg.querySelector(`[data-rig="${id}"]`);
 const crossOriginal=node('crossArms').innerHTML;
 let outfitKey=null,gaze=null,active=false;
 const proxies={};
 for(const layer of ['eyes','pupils','lids','brows','mouth','front','effects']){
  let parent=node(layer);if(!parent){parent=document.createElementNS(NS,'g');parent.dataset.rig=layer;node('torso').appendChild(parent);}
  proxies[layer]={};for(const [key,spec] of Object.entries(manifest.layers[layer]||{})){
   const image=document.createElementNS(NS,'image');image.setAttribute('href',spec.url);for(const [a,v] of Object.entries({x:spec.x,y:spec.y,width:spec.w,height:spec.h}))image.setAttribute(a,String(v));image.style.display='none';if(layer==='effects')image.classList.add('fx','fx-'+key);parent.appendChild(image);proxies[layer][key]=image;
  }
 }
 const player=root.createNeroMotionPlayer({node,onPose,onGaze:p=>{gaze=p;},onActive:v=>{active=v;host.classList.toggle('motion-active',v);}});
 function dress(key){if(key===outfitKey)return;outfitKey=key;player.reset();const c=root.NeroWardrobe.items.find(x=>x.id===key);
  node('costumeBody').innerHTML=c?.body||'';node('costumeHat').innerHTML=c?.hat||'';node('leftArmCloth').innerHTML=c?.left||'';node('rightArmCloth').innerHTML=c?.right||'';
  node('crossArms').innerHTML=c?crossOriginal.replaceAll('#BCCDB3',c.crossColor):crossOriginal;
  const legacy=node('legacyOutfit');legacy.replaceChildren();if(!c&&manifest.layers.outfit?.[key]){const spec=manifest.layers.outfit[key];const image=document.createElementNS(NS,'image');image.setAttribute('href',spec.url);for(const [a,v] of Object.entries({x:spec.x,y:spec.y,width:spec.w,height:spec.h}))image.setAttribute(a,String(v));legacy.appendChild(image);}
  const belly=node('torso').querySelector(':scope > ellipse');if(belly)belly.style.display=c?'none':'';
 }
 function sync(layerImgs){for(const [layer,variants] of Object.entries(proxies))for(const [key,img] of Object.entries(variants)){const visible=!!layerImgs[layer]?.[key]?.classList.contains('on');img.style.display=visible?'':'none';img.classList.toggle('on',visible);}}
 function pupils(x,y){node('pupils').setAttribute('transform',`translate(${gaze?.x??x} ${gaze?.y??y})`);}
 function hitTest(x,y){
  const pt=new DOMPoint(x,y);
  for(const el of svg.querySelectorAll('path,ellipse,circle,rect,polygon')){
   if(el.closest('defs'))continue;
   let visible=true;for(let p=el;p&&p!==svg;p=p.parentElement){const st=getComputedStyle(p);if(st.display==='none'||st.visibility==='hidden'||Number(st.opacity)===0){visible=false;break;}}
   if(!visible)continue;const matrix=el.getScreenCTM();if(!matrix)continue;const local=pt.matrixTransform(matrix.inverse());
   if((getComputedStyle(el).fill!=='none'&&el.isPointInFill(local))||(getComputedStyle(el).stroke!=='none'&&el.isPointInStroke(local)))return true;
  }return false;
 }
 return {dress,sync,pupils,hitTest,play:player.play,reset:player.reset,get active(){return active;},destroy(){player.reset();svg.remove();host.classList.remove('rig-mode','motion-active');}};
};
})(globalThis);
