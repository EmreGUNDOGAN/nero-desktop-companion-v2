from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import json,hashlib
root=Path(__file__).resolve().parents[1];assets=root/'themes/stars-hollow/assets/reference';docs=root/'docs/reference-rebuild/stars-hollow'
polygons={
 'badge-library-tag':[(44,7),(68,9),(72,0),(90,1),(103,16),(111,27),(120,58),(134,78),(113,87),(101,59),(98,42),(91,66),(71,158),(54,158),(3,145),(0,137),(24,55)],
 'badge-dragonfly-tag':[(0,1),(39,0),(59,9),(86,1),(130,1),(129,16),(114,34),(120,45),(117,92),(29,103),(18,99),(16,48),(4,47),(0,33),(18,28),(2,12)],
 'badge-cassette':[(15,44),(106,27),(115,32),(138,105),(136,117),(31,131),(17,124),(1,59)],
 'badge-cup':[(13,7),(41,3),(75,4),(98,12),(98,24),(112,24),(121,37),(119,58),(99,77),(94,98),(71,109),(20,105),(12,91)],
 'home-memory-jar':[(13,2),(111,1),(119,8),(119,21),(115,29),(132,47),(142,157),(120,175),(16,175),(0,155),(0,70),(4,52),(15,37),(13,25)],
 'note-clip':[(27,0),(42,2),(42,20),(24,74),(17,78),(4,78),(0,63),(15,12)],
 'todo-keyring':[(5,29),(98,5),(141,6),(156,18),(247,33),(281,69),(277,97),(252,109),(171,82),(142,62),(100,60),(80,44),(29,68),(0,57)]
}
report=[]
for name,points in polygons.items():
    file=assets/(name+'.png');im=Image.open(file).convert('RGBA');mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon(points,fill=255);mask=mask.filter(ImageFilter.GaussianBlur(.35));im.putalpha(mask)
    dest=assets/(name+'-cutout.png');im.save(dest)
    report.append({'asset':dest.relative_to(root).as_posix(),'sourceAsset':file.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(file.read_bytes()).hexdigest(),'method':'traced polygon, original pixels retained','polygon':points,'size':list(im.size)})
# Clear only the date field on the library stamp; keep its lettering and border.
im=Image.open(assets/'yale-stamp.png').convert('RGBA');ImageDraw.Draw(im).rectangle((8,36,131,62),fill=im.getpixel((12,70)));im.save(assets/'yale-stamp-live.png')
report.append({'asset':'themes/stars-hollow/assets/reference/yale-stamp-live.png','sourceAsset':'themes/stars-hollow/assets/reference/yale-stamp.png','liveDateArea':[8,36,123,26]})
# Empty colored label shapes, retaining the rounded original borders.
for name in ['tag-green','tag-wine','tag-blue']:
    im=Image.open(assets/(name+'.png')).convert('RGBA');w,h=im.size
    ImageDraw.Draw(im).rounded_rectangle((3,3,w-4,h-4),radius=4,fill=im.getpixel((6,6)))
    im.save(assets/(name+'-live.png'));report.append({'asset':f'themes/stars-hollow/assets/reference/{name}-live.png','liveLabelArea':[3,3,w-7,h-7]})
(docs/'cutout-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(len(report),'Gilmore objects/date/label fields prepared')
