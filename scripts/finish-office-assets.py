from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import json,hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/scranton/assets/reference';original=root/'docs/tv-themes/concepts/scranton';records=[]
def save(n,im,source,method):
    im.save(a/(n+'.png'));records.append({'asset':f'themes/scranton/assets/reference/{n}.png','source':source.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'method':method})
def clear(n,p,r,areas,color):
    src=original/(p+'.png');im=Image.open(src).convert('RGBA').crop((r[0],r[1],r[0]+r[2],r[1]+r[3]));d=ImageDraw.Draw(im)
    for box in areas:d.rectangle(box,fill=color)
    save(n,im,src,{'crop':r,'clearedLiveAreas':areas,'fill':color})
clear('home-report-live','home',(22,488,690,230),[(9,10,680,220)],'#ecebe8')
clear('home-total-live','home',(25,1029,684,225),[(9,10,674,216)],'#ecebe5')
clear('notes-tray-live','notes',(18,402,444,703),[(20,77,422,650),(32,8,247,64)],'#244d76')
clear('note-composer-live','notes',(470,427,643,677),[(25,59,625,657)],'#eff0ee')
clear('todo-board-live','todos',(14,371,1098,734),[(28,38,1064,697)],'#e9e9e8')
clear('home-calendar-live','home',(0,1430,734,300),[(183,16,608,275),(532,251,636,299)],'#efeee8')
clear('home-archive-live','home',(19,1740,436,243),[(10,9,426,232)],'#f3f1e9')
clear('home-footer-live','home',(0,1982,734,159),[(10,18,350,118)],'#e8d8ba')
clear('home-quote-live','home',(467,1743,245,259),[(12,15,231,241)],'#f7dd7d')
clear('home-desk-live','home',(0,1262,734,165),[(22,6,625,153)],'#a9aaa7')
clear('badge-cabinet-live','badges',(52,421,1015,740),[(28,65,985,270),(28,298,985,506),(28,531,985,710)],'#918575')
clear('badge-next-live','badges',(152,1154,670,229),[(66,59,596,186)],'#eee4d1')
clear('timer-sessions-live','timer',(20,977,637,252),[(31,38,607,232)],'#efede6')
clear('timer-stat-live','timer',(646,951,253,269),[(23,25,225,243)],'#ebe5d6')
clear('badge-base-live','badges',(135,631,260,69),[(8,7,252,62)],'#e8e1d4')
src=original/'home.png';im=Image.open(src).convert('RGBA').crop((58,347,676,479));d=ImageDraw.Draw(im)
# Keep the paper clips and the source's check/clock/flame symbols; digits and
# subtitles are exclusively live native UI. Different totals cannot be baked in.
for box in [(132,47,186,78),(101,80,213,100),(296,48,365,79),(270,80,359,99),(473,48,525,79),(447,80,536,99)]:d.rectangle(box,fill='#eeede7')
save('home-tray-live',im,src,'exact blue physical tray, digit/label replacement regions only')
for n,p,r,color in [('note-yellow','notes',(40,478,400,192),'#f7e7ba'),('note-green','notes',(39,670,404,161),'#dce5de'),('note-pink','notes',(39,846,405,218),'#f6e6a1'),('todo-white','todos',(62,581,501,126),'#edeeee'),('todo-yellow','todos',(590,579,474,136),'#f0df9e')]:
    clear(n,p,r,[(8,8,r[2]-8,r[3]-8)],color)
src=original/'timer.png';im=Image.open(src).crop((494,941,634,967));save('desk-texture-clean',im,src,{'crop':[494,941,140,26],'method':'blank tabletop sample, no folded paper objects'})
src=original/'home.png';im=Image.open(src).convert('RGBA').crop((0,737,734,942));d=ImageDraw.Draw(im);d.rectangle((71,3,215,36),fill='#e9e1cf');d.rectangle((288,47,490,180),fill='#e9e1cf');d.rectangle((163,117,245,142),fill='#e3d2a0');save('home-jar-scene-live',im,src,'clear native heading, form and jar count, preserve all surrounding objects')
src=original/'home.png';im=Image.open(src).convert('RGBA').crop((177,1317,228,1405));d=ImageDraw.Draw(im);d.rectangle((9,10,41,57),fill='#858782');d.rectangle((9,65,41,85),fill='#a3a6a1');save('home-desk-slot-live',im,src,'original deep metal slot, with question mark and slot number cleared')
polygons={
 'badge-trophy':[(41,0),(68,1),(82,30),(88,82),(105,130),(111,152),(0,155),(11,123),(21,108),(27,59)],
 'badge-certificate':[(1,15),(168,7),(176,0),(184,1),(180,12),(210,12),(213,132),(0,132)],
 'badge-best-mug':[(20,0),(126,1),(127,15),(142,16),(155,32),(157,65),(145,91),(126,97),(121,114),(22,116),(9,99),(8,24)],
 'badge-in-tray':[(0,32),(94,13),(99,0),(191,0),(193,15),(240,25),(242,95),(0,95)],
 'badge-dwight':[(20,3),(44,0),(61,6),(79,38),(69,62),(76,76),(69,123),(81,138),(1,142),(4,132),(9,126),(12,80),(10,59),(5,42)],
 'badge-printer':[(39,0),(108,0),(111,15),(168,16),(171,35),(188,36),(189,111),(164,117),(15,115),(0,108),(0,56),(17,30),(32,27)],
 'badge-monitor':[(5,2),(138,1),(139,91),(87,91),(96,113),(121,113),(122,119),(24,118),(25,113),(52,112),(57,89),(3,89)],
 'badge-phone':[(42,0),(85,3),(95,15),(133,39),(146,89),(149,124),(0,125),(0,70),(3,29),(18,8)]
}
for n,poly in polygons.items():
    src=a/(n+'.png');im=Image.open(src).convert('RGBA');mask=Image.new('L',im.size);ImageDraw.Draw(mask).polygon(poly,fill=255);im.putalpha(mask.filter(ImageFilter.GaussianBlur(.35)))
    if n in ['badge-printer','badge-monitor','badge-phone']:
        # Locked source prop includes a printed lock. Keep it as a locked prop,
        # never use this image for a newly unlocked collection object.
        suffix='-locked-cutout'
    else:suffix='-cutout'
    save(n+suffix,im,src,{'method':'traced source polygon, original pixels retained','polygon':poly})
(root/'docs/reference-rebuild/scranton/finished-asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8');print(len(records),'Office live surfaces and extracted objects prepared')
