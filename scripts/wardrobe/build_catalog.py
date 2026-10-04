"""Deterministic vector wardrobe. Garments use the approved shoulder/hem pattern."""
from pathlib import Path
import json,re,html
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'src/shared'
STROKE='#4A3A36'
SHAPE='M33 153 Q110 217 187 153 L184 229 Q151 242 110 242 Q69 242 36 229 Z'
def path(d,fill='none',sw=2.5,stroke=STROKE):return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round"/>'
def circle(x,y,r,c,sw=1.5):return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{c}" stroke="{STROKE}" stroke-width="{sw}"/>'
def star(x,y,size,c):return f'<g transform="translate({x} {y}) scale({size/10})">'+path('M0 -10 L3 -3 L10 -3 L5 2 L7 10 L0 6 L-7 10 L-5 2 L-10 -3 L-3 -3Z',c,1.2)+'</g>'
def badge(kind,c):
 if kind=='star':return star(147,211,8,c)
 if kind=='moon':return path('M149 201 C133 202 133 223 149 222 Q139 216 149 201',c,1.2)
 if kind=='flower':return ''.join(circle(x,y,3,c,0) for x,y in [(147,204),(143,207),(145,212),(151,211),(152,206)])+circle(148,208,2,'#edd297',0)+path('M148 213v9 M148 218l-5 -3','none',1.5,'#6e8a68')
 if kind=='planet':return circle(148,211,7,c)+path('M137 216 Q130 207 146 204 Q167 205 157 211 Q142 223 137 216','none',1.5,'#dec888')
 if kind=='atom':return ''.join(f'<ellipse cx="148" cy="211" rx="11" ry="4" transform="rotate({a} 148 211)" fill="none" stroke="{c}" stroke-width="1.4"/>' for a in [0,60,120])+circle(148,211,2,c,0)
 if kind=='heart':return path('M148 221 L137 210 C131 199 146 198 148 205 C152 197 165 201 158 211Z',c,1.3)
 if kind=='leaf':return path('M140 221 Q132 200 158 201 Q160 219 140 221Z',c,1.3)+path('M141 220l12 -14','none',1)
 if kind=='cup':return path('M138 204 h17 v12 q-8 7 -17 0Z',c,1.5)+path('M155 206q10 -3 8 6q-2 4 -8 1 M142 200q-3 -3 0 -5 M150 200q-3 -3 0 -5','none',1.3)
 if kind=='clock':return circle(148,211,9,'#eee1c4')+path('M148 205v7l5 2','none',1.5)
 if kind=='book':return path('M137 202q7 -2 11 2q6 -4 12 -2v17q-6 -2 -12 2q-6 -4 -11 -2Z',c,1.5)+path('M148 204v15','none',1)
 if kind=='bee':return f'<ellipse cx="148" cy="212" rx="9" ry="6" fill="{c}" stroke="{STROKE}" stroke-width="1.5"/>'+path('M144 207v10 M150 207v10','none',2)+circle(143,204,4,'#e6eadd',1)+circle(151,204,4,'#e6eadd',1)
 if kind=='flask':return path('M144 200h8 M146 200v8l-7 12q10 6 18 0l-7 -12v-8',c,1.5)
 return path('M137 204h22v15h-22Z',c,1.5)+path('M141 208h13 M141 213h9','none',1)
def hat(kind,c,trim):
 if kind=='none':return ''
 if kind=='wizard':return path('M72 35 Q84 11 107 1 Q126 12 145 33Z',c,3.5)+path('M65 33 Q109 44 151 32 L148 43 Q110 50 68 43Z',trim,3)+star(108,21,5,'#e5c579')
 if kind=='crown':return path('M72 38 L70 13 L90 28 L108 7 L127 28 L150 13 L148 38Z',c,3)+path('M73 37h74v8H73Z',trim,2)+circle(110,32,4,'#b86c73')
 if kind=='beret':return path('M63 37 Q57 13 100 12 Q145 3 155 28 L147 40Z',c,3)+path('M102 13l3 -8','none',3)
 if kind=='cap':return path('M65 38 Q72 13 110 16 Q144 18 150 36Z',c,3)+path('M65 36 Q110 31 159 38 Q170 47 136 46Z',trim,3)
 if kind=='night':return path('M68 35 Q86 4 113 12 Q144 10 154 35 L141 30 Q110 33 85 44Z',c,3)+circle(154,35,7,trim,2)+path('M67 33Q109 46 142 34l-1 10Q110 52 70 43Z',trim,2)
 if kind=='antenna':return path('M72 39 Q110 23 148 39','none',4,c)+path('M110 30V9','none',3,c)+circle(110,6,5,trim,2)
 if kind=='goggles':return path('M69 39Q110 28 151 39','none',6,c)+f'<rect x="81" y="29" width="24" height="14" rx="5" fill="{trim}" stroke="{STROKE}" stroke-width="2.5"/><rect x="114" y="29" width="24" height="14" rx="5" fill="{trim}" stroke="{STROKE}" stroke-width="2.5"/>'+path('M105 35h9','none',2)
 return path('M72 34L79 14h58l10 21Z',c,3)+path('M62 37q48 -12 99 0q-2 9 -49 9q-45 0 -50 -9Z',trim,3)
CATEGORIES=[('retro','Retro Gardırop'),('fairy','Masal Dünyası'),('cozy','Cozy Ev Hayatı'),('space','Uzay ve Bilim'),('absurd','Nero’ya Özel Absürt Şıklık')]
# Each row defines a distinct silhouette, trim, motif, head accessory and palette.
DATA={
'retro':[
('Bal Rengi Süveter','vest','argyle','book','none'),('Kadife Kitapçı','jacket','cord','book','beret'),('Kolej Günleri','varsity','letter','star','none'),('Çizgili Denizci','shirt','stripe','clock','cap'),('Eski Tren Yolcusu','coat','buttons','clock','fedora'),('Disko Akşamı','shirt','chevron','star','none'),('Kot Ceket','jacket','seams','label','cap'),('Pötikare Piknik','shirt','check','flower','none'),('Daktilo Başında','vest','pinstripe','label','none'),('Klasik Papyon','formal','plain','clock','fedora'),('Retro Bowling','shirt','panels','star','none'),('Kaset Koleksiyoncusu','hoodie','cassette','label','cap'),('Patchwork Hırka','cardigan','patch','flower','none'),('Eski Fotoğrafçı','jacket','camera','label','beret'),('Kahverengi Deri','jacket','zip','star','none'),('Pazar Gazetesi','robe','check','cup','none'),('Yetmişler Örgüsü','sweater','cable','leaf','none'),('Retro Eşofman','sport','stripe','star','none'),('Cep Saatli Yelek','vest','chain','clock','fedora'),('Vintage Postacı','coat','satchel','label','cap')],
'fairy':[
('Gece Yıldızcısı','robe','constellation','star','wizard'),('Orman Büyücüsü','cape','vines','leaf','wizard'),('Huysuz Kral','cape','ermine','star','crown'),('Şato Şövalyesi','armor','plates','star','none'),('Ay Muhafızı','robe','moon','moon','none'),('Mantar Köyü','tunic','spots','flower','beret'),('Ejderha Çırağı','hoodie','scales','star','none'),('Gezgin Ozan','vest','lacing','book','beret'),('Şifa Ustası','robe','vines','flask','none'),('Peri Postacısı','coat','satchel','leaf','cap'),('Kum Saati Bekçisi','formal','chain','clock','fedora'),('Deniz Sarayı','cape','waves','planet','crown'),('Buz Sarayı','robe','diamonds','star','crown'),('Ejderha Kütüphanesi','cardigan','scales','book','none'),('Çay Büyücüsü','robe','steam','cup','wizard'),('Kristal Gezgin','tunic','diamonds','planet','none'),('Masal Terzisi','vest','patch','label','beret'),('Güneş Rahibi','cape','sun','star','crown'),('Gizli Bahçe','cardigan','flowers','flower','none'),('Uyuyan Şatonun Bekçisi','coat','lacing','moon','cap')],
'cozy':[
('Krem Çiçekli Hırka','cardigan','plain','flower','none'),('Battaniye Pelerin','cape','check','heart','none'),('Kahve Molası','sweater','cable','cup','none'),('Limonlu Ev Önlüğü','apron','lemons','leaf','none'),('Kitap Akşamı','cardigan','pockets','book','none'),('Yumuşak Bornoz','robe','belt','heart','none'),('Bulut Sweatshirt','hoodie','clouds','moon','none'),('Tarçınlı Kurabiye','apron','spots','cup','cap'),('Lavanta Sabahı','shirt','flowers','flower','none'),('Yün Ev Yeleği','vest','cable','leaf','none'),('Çilek Reçeli','apron','berries','heart','none'),('Yağmuru İzlerken','sweater','drops','cup','none'),('Peluş Ev Takımı','sport','patch','heart','none'),('Saksı Bakımı','apron','vines','leaf','none'),('Papatyalı Triko','sweater','flowers','flower','none'),('Çay Saati','cardigan','steam','cup','none'),('Kedi Cepli Hırka','cardigan','cat','heart','none'),('Müzik Dinlerken','hoodie','notes','star','none'),('Örgü Sepeti','sweater','cable','flower','none'),('Pazar Rahatlığı','shirt','stripe','cup','none')],
'space':[
('Ay Görevi','suit','panels','planet','none'),('Laboratuvar Günü','lab','buttons','flask','goggles'),('Gözlemevi','coat','constellation','star','cap'),('Robot Arkadaş','armor','circuits','label','antenna'),('Uzay Kaptanı','formal','rank','planet','none'),('Yıldız Haritacısı','robe','constellation','moon','none'),('Roket Tamircisi','overall','tools','star','goggles'),('Mars Botanikçisi','suit','vines','leaf','none'),('Kuantum Profesörü','lab','atom','atom','none'),('Gezegen Koleksiyoncusu','sweater','orbit','planet','none'),('Derin Uzay Pilotu','suit','rank','star','cap'),('Kimya Kulübü','apron','bubbles','flask','goggles'),('Uzay Postacısı','coat','satchel','planet','cap'),('Meteor Araştırmacısı','jacket','rocks','star','none'),('Galaksi Mühendisi','overall','circuits','atom','goggles'),('Astronot Dinlenmede','hoodie','moon','moon','none'),('Uydu Operatörü','sport','signal','planet','none'),('Zaman Gezgini','formal','chain','clock','goggles'),('Bilim Fuarı','vest','atom','flask','none'),('Kozmik Kütüphaneci','cardigan','constellation','book','none')],
'absurd':[
('Emekli Amca','vest','argyle','cup','cap'),('Pazara Çıkan Teyze','cardigan','flowers','flower','none'),('Uykusuz Ofis Çalışanı','formal','looseTie','cup','none'),('Fazla Ciddi Müdür','formal','pinstripe','label','none'),('Huysuz Turist','shirt','palms','clock','cap'),('Gösterişli Ev Sahibi','robe','diamonds','star','fedora'),('Apartman Yöneticisi','vest','keys','label','none'),('Kargo Bekçisi','hoodie','parcel','clock','none'),('Çay Denetçisi','lab','steam','cup','none'),('Piknik Komutanı','jacket','rank','leaf','cap'),('Koltuk Filozofu','robe','moon','book','none'),('Toplantı Mağduru','formal','looseTie','clock','none'),('Komşu Dedektifi','coat','check','label','fedora'),('İndirim Avcısı','sport','tickets','star','cap'),('Balkon Bahçıvanı','apron','vines','flower','none'),('Kahvaltı Bakanı','formal','egg','cup','none'),('Kumanda Sahibi','cardigan','remote','label','none'),('Dramatik Şair','cape','notes','book','beret'),('Mesai Bitti','shirt','looseTie','heart','none'),('Mahalle Gurmesi','apron','check','cup','cap')]
}
PALETTES=[('#b98441','#eee2c6','#667769'),('#815e4a','#d8bb91','#b0bd9c'),('#5d7980','#e1d9bd','#bf7f68'),('#d6dcc8','#f0e5cc','#7e9883'),('#7e7466','#d6bd8e','#839391'),('#a47678','#e8c7a0','#647688'),('#637a91','#d1d9d0','#b8876a'),('#a89775','#f1e0bd','#8ba082'),('#797668','#ded3b8','#b68f58'),('#5b6774','#e9dbc2','#aa7371'),('#769a94','#e9d6bd','#b78b57'),('#ad8066','#e5d7c1','#73938d'),('#9a8499','#eee0cb','#8aa084'),('#80725f','#e4d1b3','#758994'),('#765547','#ccb995','#8c9a7a'),('#839087','#ede2ca','#aa7c70'),('#a77f52','#efd9af','#7a8970'),('#758aab','#ece0c5','#b97e70'),('#7a6b80','#decea9','#9caa87'),('#6c8474','#e6d4b2','#b08873')]
def pattern(kind,base,trim,accent,idx):
 p=''
 if kind in ['argyle','diamonds','scales','chevron']:
  for x in [68,96,124,152]:p+=path(f'M{x} 209l10 -10 10 10 -10 10Z',accent,1)+path(f'M{x-5} 220l15 -15 15 15','none',1.2,trim)
 elif kind in ['stripe','pinstripe','cord','check','patch']:
  for y in [204,216,228]:p+=path(f'M43 {y} Q110 {y+12} 178 {y}','none',4 if kind=='stripe' else 1.4,trim)
  if kind!='stripe':
   for x in range(51,179,18):p+=path(f'M{x} 194v40','none',4 if kind=='patch' else 1.3,accent)
 elif kind in ['vines','flowers','berries','lemons','palms','drops','bubbles','rocks','spots']:
  for i,x in enumerate([62,88,116,144,163]):
   y=208+(i%2)*15
   if kind in ['flowers','berries','lemons']:p+=f'<g transform="translate({x-148} {y-211}) scale(1)">'+badge('flower' if kind=='flowers' else 'leaf',trim)+'</g>'
   elif kind in ['vines','palms']:p+=path(f'M{x} 228v-25m0 10l-6 -5m6 0l6 -5','none',1.8,trim)
   else:p+=circle(x,y,3+(i%2),trim,0)
 elif kind in ['constellation','orbit','moon','sun','signal','circuits','atom']:
  p+=path('M58 215L75 206L91 224L126 214','none',1.4,trim)
  for x,y in [(58,215),(75,206),(91,224),(126,214)]:p+=circle(x,y,2,trim,0)
  p+=badge('atom' if kind=='atom' else 'moon' if kind=='moon' else 'planet' if kind=='orbit' else 'star',trim)
 elif kind=='cable':
  for x in [63,84,105,126,147,168]:p+=path(f'M{x} 202q-8 7 0 14q8 7 0 15 M{x+3} 202q8 7 0 14q-8 7 0 15','none',1.4,trim)
 elif kind=='waves':
  for y in [205,217,229]:p+=path(f'M47 {y}q15 -10 30 0t30 0t30 0t30 0','none',2,trim)
 elif kind=='lacing':p+=path('M102 201l16 8 -16 8 16 8 -16 8 M118 201l-16 8 16 8 -16 8 16 8','none',1.8,trim)
 elif kind in ['chain','keys']:p+=path('M72 200q-2 40 42 15','none',2.4,trim)+badge('clock',accent)
 elif kind=='ermine':p+=''.join(path(f'M{x} 226l-3 5m3 -5l3 5','none',1.5) for x in range(52,178,13))
 elif kind in ['looseTie','rank','zip','buttons']:
  if kind=='looseTie':p+=path('M105 192l10 0 -2 6 6 28 -7 7 -7 -8 4 -27Z',accent,1.5)
  elif kind=='rank':p+=path('M55 195l16 7 -6 5 -16 -7 M150 202l16 -7 6 5 -16 7','none',3,trim)
  else:p+=path('M110 194v42','none',2,trim)+''.join(circle(110,y,2,accent,1) for y in [203,216,229])
 elif kind in ['camera','cassette','parcel','remote','egg','tickets','notes','tools','cat','clouds','steam','letter','label']:
  if kind=='cat':p+=path('M64 225v-17l7 4 7 -4v17Z',accent,1.4)+circle(69,217,1,trim,0)+circle(74,217,1,trim,0)
  elif kind=='clouds':p+=path('M60 222q-10 -8 1 -12q1 -15 14 -8q15 -5 16 7q13 8 0 13Z',trim,1.4)
  elif kind=='egg':p+=f'<ellipse cx="80" cy="215" rx="14" ry="10" fill="{trim}"/>'+circle(80,215,5,'#e0bc62',1)
  elif kind=='notes':p+=path('M67 222v-19l14 -4v19 M67 215l14 -4','none',2,trim)+circle(64,222,3,accent,1)+circle(78,218,3,accent,1)
  elif kind=='steam':p+=badge('cup',trim)
  else:
   p+=path('M60 202h31v22H60Z',accent,2)+circle(70,213,4,trim,1)+circle(82,213,4,trim,1)
 elif kind=='pockets':p+=path('M54 206h27v18q-15 5 -27 0Z M139 206h27v18q-15 5 -27 0Z',trim,2)
 return p

def garment(model,base,trim,accent):
 b=path(SHAPE,base,4)
 if model=='vest':b=path(SHAPE,trim,4)+path('M57 170 Q110 218 163 170 L174 229 Q110 249 46 229Z',base,3.5)+path('M67 174L96 185L110 190L98 202L86 191Z M153 174L124 185L110 190L122 202L134 191Z',trim,2.5)
 elif model in ['jacket','coat','formal','lab']:
  b+=path('M83 181L110 190L137 181L127 239H94Z',trim,2)+path('M78 179L100 203L89 211L105 236 M142 179L120 203L131 211L115 236',base,2.5)
  b+=path('M52 211h26v13H52Z M142 211h26v13h-26Z',accent,2)
 elif model=='cardigan':b+=path('M79 181L110 190L141 181L128 239H92Z',accent,2)+path('M78 181Q92 207 102 215V240 M142 181Q125 207 114 215V240','none',5,trim)+''.join(circle(108,y,2.6,'#a77953',1.2) for y in [215,225,235])+path('M53 210h26v15q-12 5 -26 0Z M141 210h26v15q-12 5 -26 0Z',trim,2)
 elif model in ['robe','cape']:
  b+=path('M35 155Q110 219 185 155','none',7,trim)+path('M110 188L107 238 M42 229Q110 249 178 229','none',2.5,trim)+circle(110,190,4,accent,1.5)
  if model=='robe':b+=path('M44 219Q110 231 177 219','none',6,accent)
 elif model in ['apron','overall']:
  b+=path('M76 181L83 202H137L144 181 M76 197H144L158 234Q110 247 62 234Z',trim,3)+path('M85 212h49v17H85Z',accent,2)
 elif model=='armor':b+=path('M73 179L110 190L147 179L143 222L110 236L77 222Z',trim,3)+path('M77 206h66 M79 214h61 M110 193v37','none',2,accent)
 elif model in ['suit','sport','varsity']:b+=path('M44 190L77 205V237 M176 190L143 205V237','none',6,trim)+path('M110 192V237','none',3,accent)
 elif model=='hoodie':b+=path('M35 155Q110 219 185 155','none',9,trim)+path('M73 184v19 M146 184v19','none',3,accent)+path('M76 216H144L153 232Q110 240 67 232Z',trim,2.5)
 else:b+=path('M35 155Q110 219 185 155','none',3,trim)
 return b
items=[]
for cat,catname in CATEGORIES:
 for i,(name,model,pat,motif,head) in enumerate(DATA[cat]):
  base,trim,accent=PALETTES[(i+CATEGORIES.index((cat,catname))*3)%20]
  if cat=='space':base=['#c8d5d4','#e2dcc8','#5e6887','#84918e'][i%4]
  if cat=='fairy':base=['#424969','#698675','#866879','#a6afb0','#79749a'][i%5]
  ident=f'{cat}-{i+1:02}'
  l=path('M36 153Q25 165 20 181L41 193L53 172Z',trim if model=='vest' else base,3.5)+path('M23 177L44 187L41 194L20 183Z',accent,2.5)
  body=garment(model,base,trim,accent)
  body+=f'<defs><clipPath id="clip-{ident}">'+path('M45 202Q110 217 176 202L176 232Q110 247 44 232Z','#fff',0)+'</clipPath></defs>'
  body+=f'<g clip-path="url(#clip-{ident})">'+pattern(pat,base,trim,accent,i)+'</g>'
  body+=badge(motif,accent)+path('M40 230Q110 251 180 230','none',2.5,STROKE)
  item={'id':ident,'category':cat,'name':name,'model':model,'pattern':pat,'body':body,'hat':hat(head,base,trim),'left':l,'right':'<g transform="translate(220 0) scale(-1 1)">'+l+'</g>','crossColor':trim if model=='vest' else base}
  items.append(item)
# Preserve the exact user-approved sample as retro-01, not a generated approximation.
approved=ROOT/'scripts/wardrobe/approved-retro.json'
if approved.exists():
 sample=json.loads(approved.read_text());items[0].update({k:sample[k] for k in ['body','hat','left','right','crossColor']})
# Approved fitted cream cardigan: same neckline/shoulder boundary, all layers preserved.
items[40]['name']='Krem Çiçekli Hırka';items[40]['body']=garment('cardigan','#eadbc2','#bfab8c','#8da492')+badge('flower','#cf9f8e');items[40]['crossColor']='#eadbc2';l=path('M36 153Q25 165 20 181L41 193L53 172Z','#eadbc2',3.5)+path('M23 177L44 187L41 194L20 183Z','#bfab8c',2.5);items[40]['left']=l;items[40]['right']='<g transform="translate(220 0) scale(-1 1)">'+l+'</g>'
catalog={'version':1,'categories':[{'id':k,'name':n} for k,n in CATEGORIES],'items':items}
OUT.mkdir(exist_ok=True,parents=True)
(OUT/'wardrobe-catalog.js').write_text('(function(root,factory){if(typeof module==="object"&&module.exports)module.exports=factory();else root.NeroWardrobe=factory();})(typeof globalThis!=="undefined"?globalThis:this,function(){return '+json.dumps(catalog,ensure_ascii=False,separators=(',',':'))+';});\n')
assetdir=ROOT/'src/renderer/character/wardrobe';assetdir.mkdir(exist_ok=True)
for x in items:
 # Export transparent clothing-only vector references; live renderer uses the same catalog pieces.
 (assetdir/(x['id']+'.svg')).write_text('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 260">'+x['left']+x['right']+x['body']+x['hat']+'</svg>')
(ROOT/'docs/WARDROBE-100.md').write_text('# 100 yeni kıyafet\n\n'+ '\n'.join('## '+n+'\n\n'+'\n'.join(f'- `{x["id"]}` — {x["name"]}' for x in items if x['category']==k)+'\n' for k,n in CATEGORIES))
print('Generated',len(items),'outfits')
