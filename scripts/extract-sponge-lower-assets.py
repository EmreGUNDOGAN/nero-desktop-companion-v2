from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import json,hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/bikini-bottom/assets/reference';docs=root/'docs/reference-rebuild/bikini-bottom'
source=docs/'concepts/home-lower-proposal-v1.png';raw=Image.open(source).convert('RGBA');sample_file=a/'home-bottom-cleanup-sample.png';sample=Image.open(sample_file).convert('RGBA').resize(raw.size,Image.Resampling.LANCZOS)
mask=Image.new('L',raw.size);d=ImageDraw.Draw(mask)
boxes=[(660,75,818,310),(694,356,869,399),(121,501,846,536),(400,580,567,627),(626,580,812,628),(102,628,549,682),(137,683,808,981),(824,1062,866,1100),(110,1103,860,1290),(247,1325,715,1393),(317,1428,416,1504)]
for b in boxes:d.rectangle(b,fill=255)
centers=[141,218,294,370,445,521,598,674,750,825]
for x in centers:d.ellipse((x-30,425,x+30,490),fill=255)
clean=Image.composite(sample,raw,mask);records=[]
def save(name,im,rect,kind):
    im.save(a/(name+'.png'));records.append({'asset':f'themes/bikini-bottom/assets/reference/{name}.png','source':source.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'crop':rect,'method':kind})
save('bottom-live-master',clean,[0,0,*raw.size],{'liveBoxes':boxes,'glassInnerCenters':centers,'outsideMask':'unchanged approved source pixels'})
for name,rect in {
 'bottom-totals-live':(0,0,959,335),'bottom-desk-live':(0,335,959,552),
 'bottom-mood-live':(0,552,959,1040),'bottom-archive-live':(0,1040,959,1306),
 'bottom-quote-live':(0,1306,959,1409),'bottom-footer-live':(0,1409,959,1639)
}.items():save(name,clean.crop(rect),rect,'approved scene crop, live fields cleaned')
for i,x in enumerate(centers,1):
    rect=(x-39,417,x+39,497)
    save(f'desk-glass-{i:02d}-empty',clean.crop(rect),rect,'individual empty original sea-glass compartment')
    save(f'desk-glass-{i:02d}-original',raw.crop(rect),rect,'individual approved cup/book or question/lock, no slot number')
for name,rect in {'bottom-total-flower':(799,17,868,89),'bottom-reset':(731,20,785,75),'bottom-mood-flower':(823,568,883,635),'bottom-archive-check':(115,1109,146,1143),'bottom-note-left-flower':(83,1324,156,1396),'bottom-note-right-flower':(805,1324,876,1394),'bottom-sign':(710,1416,870,1639)}.items():save(name,raw.crop(rect),rect,'approved ornament, complete bounds')
# A complete reusable empty circle retains its exact subtle paper rim/grain.
circle=raw.crop((150,763,205,819));tile=raw.crop((165,770,191,780));circle.paste(tile.resize((24,29)),(16,14))
save('mood-day-empty-source',circle,[150,763,205,819],'original circular paper day, only numeral cleared')
(docs/'lower-asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
sheet=Image.new('RGB',(1000,((len(records)+4)//5)*150),'#f6e8b8');draw=ImageDraw.Draw(sheet)
for i,row in enumerate(records):
    im=Image.open(root/row['asset']);im.thumbnail((192,118));x=i%5*200;y=i//5*150;sheet.paste(im,(x+(200-im.width)//2,y),im);draw.text((x+4,y+122),Path(row['asset']).stem[:29],fill='#092747')
sheet.save(docs/'lower-assets.jpg',quality=92);print(len(records),'approved lower-section assets extracted')
