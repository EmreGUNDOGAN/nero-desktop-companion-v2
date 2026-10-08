"""Individually extract the approved task design; retain source art outside live areas."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import json,hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/bikini-bottom/assets/reference';docs=root/'docs/reference-rebuild/bikini-bottom'
source=docs/'concepts/todos-proposal-v1.png';raw=Image.open(source).convert('RGBA');sample=Image.open(a/'work-cleanup-sample.png').convert('RGBA').resize(raw.size,Image.Resampling.LANCZOS);master=raw.copy();records=[]
def save(name,im,rect,method):
 im.save(a/(name+'.png'));records.append({'asset':f'themes/bikini-bottom/assets/reference/{name}.png','source':source.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'crop':rect,'method':method})
def replace(rect):master.paste(sample.crop(rect),rect[:2])
fields=[(121,563,681,596),(153,597,642,624),(109,645,368,680),(411,645,568,681),(642,645,783,681),(73,730,677,768),(95,791,367,823),(56,902,824,1532),(146,1585,664,1630),(151,830,241,901),(641,830,723,901)]
for rect in fields:replace(rect)
# Decorative flowers are original pixels, outside changing task text.
for rect in [(350,900,410,963),(746,900,810,964),(770,1380,811,1422)]:master.paste(raw.crop(rect),rect[:2])
save('work-live-master',master,[0,0,*raw.size],{'liveFields':fields,'outsideFields':'original approved pixels'})
for name,rect in {'work-header':(0,0,874,110),'work-nav':(0,110,874,212),'work-hero':(0,212,874,547),'work-capture':(0,547,874,844),'work-board-frame':(20,854,857,1563),'work-archive':(20,1565,855,1649),'work-footer':(0,1649,874,1799)}.items():save(name,master.crop(rect),rect,'source surface with only live fields cleared')
for name,rect in {'work-clock':(57,564,103,613),'work-info':(121,596,150,624),'work-search':(70,646,106,681),'work-add':(737,716,828,788),'work-chevron':(583,653,600,671),'work-capture-arrow':(67,795,92,819),'work-blue-flower':(350,900,410,963),'work-yellow-flower':(746,900,810,964),'work-green-flower':(770,1380,811,1422),'work-archive-folder':(74,1586,116,1625),'work-archive-chevron':(775,1593,805,1618),'work-sign':(626,1650,779,1766)}.items():save(name,raw.crop(rect),rect,'complete original icon/ornament')
for i,rect in enumerate([(151,830,241,901),(641,830,723,901)],1):
 im=raw.crop(rect);mask=Image.new('L',im.size);d=ImageDraw.Draw(mask);w,h=im.size
 d.polygon([(w*.35,0),(w*.65,0),(w*.76,h*.2),(w*.72,h*.57),(w*.92,h*.59),(w*.97,h*.94),(w*.02,h*.94),(w*.05,h*.59),(w*.3,h*.57),(w*.26,h*.2)],fill=255)
 im.putalpha(mask.filter(ImageFilter.GaussianBlur(.6)));save(f'work-clip-{i}',im,rect,'separate brass clip with transparent silhouette')
cards={'blue':((66,967,429,1112),(79,1061,120,1100)),'cream':((66,1118,429,1239),(78,1179,130,1225)),'yellow':((454,970,813,1096),(465,1032,510,1081)),'pink':((454,1100,813,1228),(466,1166,511,1217)),'done':((66,1423,813,1479),(420,1432,530,1470))}
for color,(rect,tile) in cards.items():
 im=raw.crop(rect);paper=raw.crop(tile).resize((im.width-16,im.height-16),Image.Resampling.LANCZOS);im.paste(paper,(8,8));save('work-card-'+color,im,rect,'original 8-pixel paper edge/shadow; changing contents cleared')
for color,rect in {'priority':(131,1010,217,1043),'work':(224,1010,271,1043),'personal':(519,1016,591,1048),'planning':(597,1016,689,1048)}.items():
 im=raw.crop(rect);w,h=im.size;fill=Image.new('RGBA',(w-12,h-8),im.getpixel((4,h//2)));im.paste(fill,(6,4));mask=Image.new('L',im.size);ImageDraw.Draw(mask).rounded_rectangle((0,0,w-1,h-1),radius=h//2,fill=255);im.putalpha(mask);save('work-label-'+color,im,rect,'original colored tag; words replaced by native labels')
for name,rect in {'work-check-empty':(83,984,119,1020),'work-check-done':(97,1433,131,1469),'work-play':(327,991,368,1033),'work-menu':(379,996,410,1028),'work-drag-arrow':(244,1491,267,1526)}.items():
 im=raw.crop(rect);mask=Image.new('L',im.size,255);seen=set();q=[(x,y)for x in range(im.width)for y in [0,im.height-1]]+[(x,y)for y in range(im.height)for x in [0,im.width-1]]
 while q:
  x,y=q.pop()
  if (x,y)in seen:continue
  seen.add((x,y));r,g,b,_=im.getpixel((x,y))
  if not (r>130 and g>150 and b>150):continue
  mask.putpixel((x,y),0)
  for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
   if 0<=nx<im.width and 0<=ny<im.height:q.append((nx,ny))
 im.putalpha(mask);save(name,im,rect,'original control with border-connected paper removed')
save('work-progress-empty',raw.crop((131,1076,330,1098)),[131,1076,330,1098],'source segmented progress strip')
(docs/'work-asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
sheet=Image.new('RGB',(1000,((len(records)+4)//5)*150),'#f6e8b8');d=ImageDraw.Draw(sheet)
for i,row in enumerate(records):
 im=Image.open(root/row['asset']);im.thumbnail((192,118));x=i%5*200;y=i//5*150;sheet.paste(im,(x+(200-im.width)//2,y),im);d.text((x+3,y+123),Path(row['asset']).stem,fill='#082747')
sheet.save(docs/'work-assets.jpg',quality=92);print(len(records),'task design assets extracted')
