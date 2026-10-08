"""Extract the approved timer scene without baking live values into it."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter,ImageChops
import json,hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/bikini-bottom/assets/reference';docs=root/'docs/reference-rebuild/bikini-bottom'
source=root/'docs/spongebob/approved-concept.png';raw=Image.open(a/'timer-original.png').convert('RGBA');live=raw.copy();records=[]
def save(name,im,method):
 im.save(a/(name+'.png'));records.append({'asset':f'themes/bikini-bottom/assets/reference/{name}.png','source':source.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'method':method})
def tile(image,box,sample):
 x1,y1,x2,y2=box
 for y in range(y1,y2,sample.height):
  for x in range(x1,x2,sample.width):image.paste(sample.crop((0,0,min(sample.width,x2-x),min(sample.height,y2-y))),(x,y))
# Only the changing digits/status are replaced inside the original glass.
region=raw.crop((112,294,382,435)).convert('RGB');weights=Image.new('L',region.size)
weights.putdata([255 if 70<r<220 and g>210 and b>240 else 0 for r,g,b in region.getdata()]);denom=weights.filter(ImageFilter.GaussianBlur(24))
channels=[ImageChops.multiply(c,weights).filter(ImageFilter.GaussianBlur(24)) for c in region.split()]
glass=Image.new('RGB',region.size);glass.putdata([tuple(round(min(255,c*255/max(1,w))) for c in values) for values,w in zip(zip(*(c.getdata() for c in channels)),denom.getdata())])
glass=glass.filter(ImageFilter.GaussianBlur(3))
fields=[(133,311,359,391),(157,396,332,423)]
for box in fields:
 patch=live.copy();patch.paste(glass.crop((box[0]-112,box[1]-294,box[2]-112,box[3]-294)),box[:2]);mask=Image.new('L',raw.size);ImageDraw.Draw(mask).rectangle((box[0]+2,box[1]+2,box[2]-2,box[3]-2),fill=255);live=Image.composite(patch,live,mask.filter(ImageFilter.GaussianBlur(1.2)))
# Input, presets, action captions, progress and statistical values remain native.
tile(live,(124,87,336,105),raw.crop((124,79,340,86)))
tile(live,(56,125,424,177),raw.crop((45,122,54,179)))
tile(live,(84,526,404,548),raw.crop((209,548,300,555)))
tile(live,(180,566,290,600),raw.crop((110,566,158,600)))
tile(live,(178,626,290,651),raw.crop((111,625,158,651)))
for box in [(114,715,203,754),(336,715,395,754)]:tile(live,box,raw.crop((248,721,263,749)))
save('timer-live-master',live,{'glassFields':fields,'otherFields':['input','presets','progress','action captions','stat values'],'outsideLiveFields':'original scene/casing/flowers/houses/jellyfish/seabed/Patrick unchanged'})
for kind in ['preset','preset-selected']:
 im=Image.open(a/f'timer-{kind}-original.png').convert('RGBA');tile(im,(17,9,53,40),im.crop((8,8,15,40)));save('timer-'+kind+'-live',im,'original rounded button edge/shadow; changing number cleared')
for kind in ['empty','filled']:
 im=Image.open(a/f'timer-progress-{kind}.png').convert('RGBA').resize((40,16),Image.Resampling.LANCZOS);strip=Image.new('RGBA',(316,19))
 for i in range(7):strip.paste(im,(3+i*45,1))
 save('timer-progress-'+kind+'-strip',strip,'seven individually extracted original glass progress capsules')
(docs/'timer-live-asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8');print(len(records),'timer source assets prepared')
