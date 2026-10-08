"""Final source crops: isolated menu glyphs and collection objects, no baked dates."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import json, hashlib
root=Path(__file__).resolve().parents[1]
a=root/'themes/stars-hollow/assets/reference'
records=[]
def save(name,im,src,method):
    im.save(a/(name+'.png'))
    records.append({'asset':f'themes/stars-hollow/assets/reference/{name}.png','source':str(src.relative_to(root)).replace('\\','/'),'sourceSha256':hashlib.sha256(src.read_bytes()).hexdigest(),'method':method})
for page in ['home','notes','todos','timer','badges','budget']:
    src=a/('nav-'+page+'.png');im=Image.open(src).convert('RGBA').crop((0,0,Image.open(src).width,28))
    alpha=Image.new('L',im.size);alpha.putdata([max(0,min(255,int((190-min(px[:3]))*5))) for px in im.getdata()]);im.putalpha(alpha)
    save('nav-'+page+'-cutout',im,src,'isolate original header glyph; paper removed by luminance mask, labels excluded')
src=a/'badge-gazebo-photo.png';im=Image.open(src).convert('RGBA').crop((0,0,139,114));save('badge-gazebo-photo-cutout',im,src,'exclude baked date beneath the photo')
for name in ['badge-signpost-sketch','badge-books-sketch','badge-headphones-sketch','badge-road-sketch']:
    src=a/(name+'.png');im=Image.open(src).convert('RGBA');alpha=Image.new('L',im.size)
    alpha.putdata([max(0,min(255,int((220-sum(px[:3])/3)*3))) for px in im.getdata()]);im.putalpha(alpha)
    save(name+'-cutout',im,src,'retain original pencil lines; remove pale paper matte')
src=root/'docs/tv-themes/concepts/stars-hollow/home.png';im=Image.open(src).crop((534,616,589,620));save('home-chalk-texture-clean',im,src,'blank chalk texture sampled between chart gridlines')
original=Image.open(src).convert('RGBA');im=original.crop((0,722,743,950));sample=original.crop((364,804,485,812));blank=Image.new('RGBA',(390,147))
for y in range(0,blank.height,sample.height):
    for x in range(0,blank.width,sample.width):blank.paste(sample,(x,y))
im.paste(blank,(141,57));save('home-jar-scene-live',im,src,'retain original flowers, jar, bell and keyring; replace only live text/control area')
im=original.crop((646,1280,743,1362));save('home-desk-snowglobe',im,src,'original snowglobe prop')
src=root/'docs/tv-themes/concepts/stars-hollow/badges.png';im=Image.open(src).crop((307,752,322,887));save('badge-cork-texture',im,src,'cork gap between cards; excludes paper edge')
(root/'docs/reference-rebuild/stars-hollow/refined-asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(len(records),'Gilmore source details refined')
