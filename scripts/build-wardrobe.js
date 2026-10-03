'use strict';
// Rebuild native SVG layers from the supplied illustrations and measured face profiles.
// The source PNGs are never rescaled/cropped/repainted. Facial features stay independent.
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..', 'themes', 'default', 'assets');
const dir = path.join(root, 'wardrobe');
const profiles = JSON.parse(fs.readFileSync(path.join(dir, 'profiles.json'), 'utf8'));
const theme = JSON.parse(fs.readFileSync(path.join(root, '..', 'theme.json'), 'utf8'));
const wrap = body => `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260">${body}</svg>`;
const content = name => fs.readFileSync(path.join(root, name), 'utf8').replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
const edge = '<filter id="edge" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB"><feComponentTransfer in="SourceAlpha" result="cleanAlpha"><feFuncA type="linear" slope="1.5" intercept="-.5"/></feComponentTransfer><feMorphology in="cleanAlpha" operator="erode" radius=".4" result="inside"/><feFlood flood-color="#281b16"/><feComposite in2="cleanAlpha" operator="in" result="outline"/><feComposite in="SourceGraphic" in2="inside" operator="in" result="interior"/><feMerge><feMergeNode in="outline"/><feMergeNode in="interior"/></feMerge></filter>';
const catalog = {};
for (const [id,p] of Object.entries(profiles)) {
  const output = path.join(dir,id);fs.mkdirSync(output,{recursive:true});
  const png = fs.readFileSync(path.join(dir,`outfit-${id}.png`)).toString('base64');
  let defs=edge, blank='';
  if(p.approvedWinter){
    defs+='<radialGradient id="fade"><stop offset=".94" stop-color="white"/><stop offset="1" stop-color="black"/></radialGradient><mask id="eyes"><ellipse cx="110" cy="89" rx="62" ry="44" fill="url(#fade)"/></mask><mask id="mouth"><ellipse cx="110" cy="138" rx="29" ry="11" fill="url(#fade)"/></mask>';
    blank='<rect x="45" y="43" width="130" height="91" fill="#c7e1c3" mask="url(#eyes)"/><rect x="79" y="126" width="62" height="24" fill="#c7e1c3" mask="url(#mouth)"/>';
  }else{
    defs+='<filter id="soft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation=".65"/></filter>';
    for(const [key,box] of [['eyes',p.eraseEyes],['mouth',p.eraseMouth]]){
      const [x,y,x2,y2]=box;
      defs+=`<mask id="${key}" maskUnits="userSpaceOnUse" x="0" y="0" width="220" height="260"><rect x="${x}" y="${y}" width="${x2-x}" height="${y2-y}" rx="5" fill="white" filter="url(#soft)"/></mask>`;
      blank+=`<rect width="220" height="260" fill="${p.skin}" mask="url(#${key})"/>`;
    }
  }
  // The previously accepted contour repair; deliberately excludes the rejected texture clone.
  const repair=p.approvedWinter?'<path d="M16 173 Q12.2 180.8 15.5 190.5 L17 189.5 Q15 182 17.5 174 Z" fill="#9db8d1"/><path d="M16 173 Q12.2 180.8 15.5 190.5" fill="none" stroke="#201c18" stroke-width="2.1" stroke-linecap="round"/>':'';
  const body=`<defs>${defs}</defs><image width="220" height="260" href="data:image/png;base64,${png}" filter="url(#edge)"/>${repair}${blank}`;
  fs.writeFileSync(path.join(output,'body.svg'),wrap(body));
  const layers={body:{default:'body.svg'}};
  for(const key of ['eyes','pupils','lids','brows','mouth']){
    layers[key]={};
    for(const [variant,spec] of Object.entries(theme.layers[key])){
      const name=path.basename(typeof spec==='string'?spec:spec.src);
      let drawing=content(name);
      if(key==='lids')drawing=drawing.replaceAll('#A0B595',p.skin);
      const transformed=`<g transform="translate(${p.x} ${key==='mouth'?p.mouthY:p.y}) scale(${p.scale})">${drawing}</g>`;
      const filename=`${key}-${variant}.svg`;
      fs.writeFileSync(path.join(output,filename),wrap(transformed));
      layers[key][variant]=filename;
    }
  }
  catalog[id]={layers};
}
fs.writeFileSync(path.join(dir,'catalog.json'),JSON.stringify(catalog,null,2)+'\n');
console.log(`Built ${Object.keys(catalog).length} animated wardrobe bodies and independent face layers.`);
