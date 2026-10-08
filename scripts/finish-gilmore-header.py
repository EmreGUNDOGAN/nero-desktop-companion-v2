"""Recover complete source navigation glyphs without their printed captions."""
from pathlib import Path
from PIL import Image, ImageDraw
import json, hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/stars-hollow/assets/reference';records=[]
preview=Image.new('RGB',(600,130),'#f6ecdb');d=ImageDraw.Draw(preview)
for i,name in enumerate(['home','notes','todos','timer','badges','budget']):
    src=a/('nav-'+name+'.png');im=Image.open(src).convert('RGBA')
    # Each complete glyph ends before this source gap; caption pixels are excluded.
    end={'home':36,'notes':35,'todos':35,'timer':39,'badges':36,'budget':36}[name]
    crop=im.crop((0,0,im.width,end));alpha=Image.new('L',crop.size)
    alpha.putdata([max(0,min(255,int((190-min(px[:3]))*5)))for px in crop.getdata()])
    crop.putalpha(alpha);bounds=alpha.getbbox();assert bounds
    glyph=crop.crop(bounds);padded=Image.new('RGBA',(glyph.width+6,glyph.height+6));padded.paste(glyph,(3,3))
    padded.save(a/('nav-'+name+'-cutout.png'))
    records.append(dict(asset=f'themes/stars-hollow/assets/reference/nav-{name}-cutout.png',source=src.relative_to(root).as_posix(),sourceSha256=hashlib.sha256(src.read_bytes()).hexdigest(),crop=[0,0,im.width,end],inkBounds=bounds,padding=3,method='complete original glyph with transparent padding; all printed caption pixels excluded'))
    enlarged=padded.resize((84,90));preview.paste(enlarged,(i*100,0),enlarged);d.text((i*100,100),name,fill='#142b43')
docs=root/'docs/reference-rebuild/stars-hollow';preview.save(docs/'final-nav-glyphs.png')
(docs/'final-nav-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(len(records),'complete source glyphs saved')
