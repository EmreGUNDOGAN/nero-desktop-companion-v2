"""User-requested extraction: original art outside live fields is unchanged."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageStat,ImageChops
import hashlib,json
root=Path(__file__).resolve().parents[1];a=root/'themes/bikini-bottom/assets/reference';docs=root/'docs/reference-rebuild/bikini-bottom'
source=root/'docs/spongebob/approved-concept.png';original=Image.open(source).convert('RGBA');records=[]
def save(name,im,method):
    im.save(a/(name+'.png'));records.append({'asset':f'themes/bikini-bottom/assets/reference/{name}.png','source':source.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'method':method})
def patch(image,box,sample):
    x1,y1,x2,y2=box
    for y in range(y1,y2,sample.height):
        for x in range(x1,x2,sample.width):image.paste(sample.crop((0,0,min(sample.width,x2-x),min(sample.height,y2-y))),(x,y))
home=original.copy();areas=[]
# Greeting lettering only: preserve all other source art. Sample the clear
# water directly below this word area, before the speech balloon starts.
box=(60,186,445,253);mask=Image.new('L',original.size);ImageDraw.Draw(mask).rectangle(box,fill=255);mask=mask.filter(ImageFilter.GaussianBlur(2))
region=original.crop((40,171,465,271)).convert('RGB');weight=Image.new('L',region.size)
weight.putdata([255 if p[0]<130 and p[1]>140 and p[2]>155 else 0 for p in region.getdata()])
denominator=weight.filter(ImageFilter.GaussianBlur(14));channels=[]
for channel in region.split():channels.append(ImageChops.multiply(channel,weight).filter(ImageFilter.GaussianBlur(14)))
water=Image.new('RGB',region.size);water.putdata([tuple(round(min(255,v*255/max(1,w))) for v in rgb) for rgb,w in zip(zip(*(c.getdata() for c in channels)),denominator.getdata())])
fill=original.copy();fill.paste(water.crop((20,15,405,82)),(box[0],box[1]));home=Image.composite(fill,home,mask)
areas.append({'rect':box,'method':'blank live heading field sampled from surrounding original clear cyan water; source illustrations outside the field unchanged','sample':[40,171,465,271]})
# The cream balloon itself is kept. Only its replaceable words are removed.
box=(139,277,283,328);sample=original.crop((151,265,227,275));patch(home,box,sample);areas.append({'rect':box,'sample':[151,265,227,275]})
for box in [(121,458,168,495),(243,458,320,495),(435,458,477,495)]:
    sample=original.crop((175,455,188,480));patch(home,box,sample);areas.append({'rect':box,'sample':[175,455,188,480]})
box=(62,590,483,713);sample=original.crop((73,576,415,589));patch(home,box,sample);areas.append({'rect':box,'sample':[73,576,415,589]})
home.paste(original.crop((438,551,488,602)),(438,551))
box=(178,800,365,827);sample=original.crop((177,793,365,800));patch(home,box,sample);areas.append({'rect':box,'sample':[177,793,365,800]})
save('home-live-master',home.crop((30,178,508,1024)),{'liveAreas':areas,'outsideLiveAreas':'unchanged original pixels'})
for name,rect in {
 'home-hero-live':(30,178,508,447),'home-stats-live':(46,446,498,527),
 'home-week-live':(46,540,498,727),'home-jar-live':(46,736,498,864),
 'home-quick-live':(30,864,508,944),'home-footer-live':(30,944,508,1024),
 'home-lower-live':(30,736,508,1024)
}.items():save(name,home.crop(rect),{'crop':rect,'sourceMaster':'home-live-master.png'})
# Native navigation uses original glyphs and a source coral pill, with no
# second set of icons/words baked into the cream navigation background.
nav=original.crop((30,107,508,177));sample=original.crop((130,112,144,151))
for box in [(14,2,86,60),(108,2,161,60),(187,2,240,60),(260,2,316,60),(335,2,393,60),(409,2,466,60)]:patch(nav,box,sample)
save('nav-live',nav,'original scalloped cream strip; only replaceable icon/label fields cleared')
selected=original.crop((46,109,116,166));sample=original.crop((50,115,57,153));patch(selected,(7,5,64,52),sample);save('nav-selected-live',selected,'original coral rounded edge and shadow with source coral interior')
for name in ['home','notes','todos','timer','badges','budget']:
    file=a/('nav-'+name+'-original.png');im=Image.open(file).convert('RGBA');alpha=Image.new('L',im.size)
    # Clear only border-connected background. Preserve the closed glyph's
    # original yellow/blue/pink interiors and remove rectangular coral/paper.
    alpha=Image.new('L',im.size,255);seen=set();queue=[(x,y) for x in range(im.width) for y in [0,im.height-1]]+[(x,y) for y in range(im.height) for x in [0,im.width-1]]
    while queue:
        x,y=queue.pop()
        if (x,y) in seen:continue
        seen.add((x,y));r,g,b,_=im.getpixel((x,y));background=(r>170 and g>155 and b>135) or (r>180 and 55<g<185 and b<160)
        if not background:continue
        alpha.putpixel((x,y),0)
        for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
            if 0<=nx<im.width and 0<=ny<im.height and (nx,ny) not in seen:queue.append((nx,ny))
    im.putalpha(alpha);save('nav-'+name+'-cutout',im,'isolate original navy ink and colored interior from pale navigation paper')
save('header-live',original.crop((30,38,508,107)),'unchanged original sponge header, brand lettering and control glyphs')
# Additional native sections use genuine source parchment grain.
paper=original.crop((75,577,390,590));save('sand-paper-tile',paper,'blank source parchment grain')
(docs/'home-live-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print(len(records),'source-derived home and shared assets; other theme files untouched')
