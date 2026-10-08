"""Keep every original pixel outside replaceable data fields.

The generated clean samples are used only under letters and live values, never
as replacements for the entire approved scene. All crops are recorded below.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import hashlib, json
root=Path(__file__).resolve().parents[1]
a=root/'themes/scranton/assets/reference'
source=root/'docs/tv-themes/concepts/scranton/home.png'
original=Image.open(source).convert('RGBA')
records=[]
def cleaned(name,rect,sample_name,boxes,polygons=()):
    image=original.crop(rect)
    sample_file=a/(sample_name+'.png')
    sample=Image.open(sample_file).convert('RGBA').resize(image.size,Image.Resampling.LANCZOS)
    mask=Image.new('L',image.size)
    draw=ImageDraw.Draw(mask)
    for box in boxes:draw.rectangle(box,fill=255)
    for polygon in polygons:draw.polygon(polygon,fill=255)
    image=Image.composite(sample,image,mask)
    image.save(a/(name+'.png'))
    records.append({'asset':name+'.png','sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sourceCrop':rect,'cleanupSample':sample_name+'.png','cleanupSha256':hashlib.sha256(sample_file.read_bytes()).hexdigest(),'replaceableRectangles':boxes,'replaceablePolygons':polygons,'outsideMask':'unchanged original pixels'})
    return image
cleaned('home-report-exact',(0,489,734,727),'home-report-generated',[(286,55,456,100),(52,102,687,219)])
icon=original.crop((75,968,103,1006)).convert('RGB')
alpha=Image.new('L',icon.size)
alpha.putdata([max(0,min(255,(min(p)-140)*5)) for p in icon.getdata()])
cutout=Image.new('RGBA',icon.size,'white');cutout.putalpha(alpha);cutout.save(a/'home-quick-clock-cutout.png')
records.append({'asset':'home-quick-clock-cutout.png','sourceCrop':[75,968,103,1006],'method':'original white clock shape isolated from blue button'})
middle_boxes=[(323,61,485,228)]
middle_boxes += [(508,264,632,287)]
middle_boxes += [(48,295,634,400)]
middle_boxes += [(253,431,602,471),(198,504,588,665)]
middle=cleaned('home-middle-exact',(0,1021,734,1730),'home-middle-generated',middle_boxes)
# A changing month can have five or six date rows. Only the live cell region
# receives blank source paper; native solid rules adapt to the actual month.
paper=original.crop((198,1700,524,1709))
for y in range(504,666,9):
    for x in range(198,589,326):
        w=min(326,589-x);h=min(9,666-y)
        middle.paste(paper.crop((0,0,w,h)),(x,y))
middle.save(a/'home-middle-exact.png')
legend_file=a/'home-legend-updated.png'
legend=Image.open(legend_file).convert('RGBA').resize((110,73),Image.Resampling.LANCZOS)
legend.save(a/'home-legend-final.png')
middle.paste(legend,(533,646))
middle.save(a/'home-middle-exact.png')
records.append({'asset':'home-legend-final.png','sourceAsset':'home-legend-original.png','edit':'user wording: Kötü, İdare eder, İyi','cleanupSample':'home-legend-updated.png','size':[110,73]})
for name,box in [('home-total-exact',(0,0,734,242)),('home-desk-exact',(0,242,734,409)),('home-calendar-exact',(0,409,734,709))]:
    middle.crop(box).save(a/(name+'.png'))
    records.append({'asset':name+'.png','sourceAsset':'home-middle-exact.png','crop':box})
# Only the four rows and extra-count field are erased; the original archive
# heading, tabbed folders, ruled paper and all scene objects are unchanged.
lower_boxes=[(75,70+i*31,413,94+i*31) for i in range(4)]
lower_boxes += [(203,200,273,219),(382,28,416,53),(25,275,314,347)]
lower=cleaned('home-lower-exact',(0,1730,734,2141),'home-lower-generated',lower_boxes,[[(482,56),(674,35),(691,206),(501,230)]])
lower.crop((0,0,734,260)).save(a/'home-archive-scene-exact.png')
lower.crop((0,260,734,411)).save(a/'home-footer-exact.png')
# Source question mark and padlock together, retaining their actual shapes.
icon=original.crop((199,1334,227,1395)).convert('RGBA')
alpha=Image.new('L',icon.size)
alpha.putdata([255 if min(p[:3])>160 or max(p[:3])<95 else 0 for p in icon.getdata()])
icon.putalpha(alpha.filter(ImageFilter.GaussianBlur(.25)))
icon.save(a/'home-desk-lock-exact.png')
records.append({'asset':'home-desk-lock-exact.png','sourceCrop':[199,1334,227,1395],'method':'retain source light question mark and dark padlock shapes'})
slot=original.crop((177,1317,228,1405))
sample=Image.open(a/'home-middle-generated.png').convert('RGBA').resize((734,709),Image.Resampling.LANCZOS)
slot.paste(sample.crop((187,385,218,399)),(10,69))
slot.save(a/'home-desk-locked-slot-exact.png')
records.append({'asset':'home-desk-locked-slot-exact.png','sourceCrop':[177,1317,228,1405],'method':'retain full original question, padlock and metal slot; erase only source number 3'})
(root/'docs/reference-rebuild/scranton/home-exact-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
print('Original scene preserved outside',len(middle_boxes)+len(lower_boxes),'live data rectangles')
