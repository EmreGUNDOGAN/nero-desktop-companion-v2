"""Office-only extraction of the approved five pages. Originals are immutable."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import runpy,sys,json,hashlib
root=Path(__file__).resolve().parents[1]
sys.argv=[str(root/'scripts/extract-reference-assets.py'),'scranton'];ns=runpy.run_path(sys.argv[0]);extract=ns['extract'];frame=ns['frame'];manifest=ns['manifest'];t='scranton';a=root/'themes/scranton/assets/reference'
def crop(n,p,r):return extract(t,n,p,r)
def paper(n,p,r,blank,sample):return extract(t,n,p,r,blank,sample)
crop('brand-logo','notes',(38,4,156,65));crop('brand-company','notes',(840,4,111,74))
crop('home-background','home',(0,56,734,433));crop('home-hero-raw','home',(0,56,734,310))
crop('home-counter-clip','home',(196,350,22,34));crop('home-report-clip','home',(34,493,37,57));crop('home-report-logo','home',(94,510,75,53));crop('home-report-label','home',(598,516,90,38))
crop('home-paper-texture','home',(482,535,84,18));crop('home-stat-icon-check','home',(156,398,24,22));crop('home-stat-icon-clock','home',(319,397,27,24));crop('home-stat-icon-fire','home',(495,397,27,25))
crop('home-jar','home',(141,777,125,155));crop('home-jar-note','home',(179,841,56,37));crop('home-jar-sticky','home',(496,742,86,145));crop('home-jello','home',(582,845,140,91));crop('home-jar-plant','home',(0,737,90,179))
crop('home-quick-clock','home',(75,968,28,38));crop('home-quick-add','home',(339,970,27,31));crop('home-quick-note','home',(565,970,24,31))
crop('home-total-stamp','home',(504,1107,178,138));crop('home-total-logo','home',(580,1195,102,52));crop('home-total-title','home',(520,1057,94,17));crop('home-total-reset','home',(642,1047,22,23))
crop('home-desk-cup','home',(45,1320,66,91));crop('home-desk-book','home',(118,1321,57,83));crop('home-desk-bobble','home',(632,1266,102,155));crop('home-desk-slot','home',(177,1317,51,88))
crop('home-moodboard-photo','home',(22,1516,147,193));crop('home-moodboard-sticky','home',(631,1497,91,172));crop('home-moodboard-plant','home',(658,1645,76,139));crop('home-pin-blue','home',(0,1444,24,26))
crop('home-archive-check','home',(87,1793,23,22));crop('home-footer-paper-box','home',(351,1987,297,124));crop('home-footer-stapler','home',(572,2045,162,95));crop('home-footer-phone','home',(662,1871,72,216))
crop('note-tray-empty-slot','notes',(21,437,433,49));crop('note-tray-label','notes',(58,413,208,47));crop('note-clip','notes',(610,423,327,68));crop('note-composer-logo','notes',(551,486,66,76));crop('note-composer-pen','notes',(1038,621,69,424));crop('note-title-sticky','notes',(711,328,119,117));crop('note-footer-stapler','notes',(819,1260,303,142));crop('note-footer-mug','notes',(306,1199,187,155));crop('note-footer-phone','notes',(0,1105,289,271))
frame(t,'note-pink','notes',(39,846,405,218),(24,16,19,18),(252,1017,366,1028))
frame(t,'archive-tab','notes',(57,1040,397,65),(20,15,20,13),(154,1046,217,1057))
paper('note-heading-strip','notes',(462,344,660,83),(18,6,219,71),(833,370,880,398))
crop('todo-header-raw','todos',(0,128,1122,244));crop('todo-pin-red','todos',(300,574,31,31));crop('todo-pin-blue','todos',(478,714,32,29));crop('todo-pin-yellow','todos',(803,574,34,33));crop('todo-bobble','todos',(69,1088,107,285));crop('todo-board-border','todos',(15,372,1096,37));crop('todo-archive-binder','todos',(237,1113,393,93));crop('todo-stapler','todos',(410,1246,178,105));crop('todo-schrute-bowl','todos',(583,1218,201,149));crop('todo-policy-binder','todos',(781,1196,341,184));crop('todo-pen','todos',(418,1344,243,58))
frame(t,'todo-capture','todos',(38,397,1050,127),(13,11,14,10),(533,405,594,415))
frame(t,'todo-done-paper','todos',(89,1000,978,47),(15,11,13,10),(282,1007,349,1013))
frame(t,'todo-archive-paper','todos',(665,1116,404,73),(14,16,15,16),(917,1129,1019,1140))
crop('timer-title-raw','timer',(42,448,438,95));crop('timer-label-name','timer',(60,590,331,25));crop('timer-label-duration','timer',(63,773,327,25));crop('timer-label-custom','timer',(61,865,373,25));crop('timer-clock-label','timer',(683,500,184,33))
frame(t,'timer-setup','timer',(39,567,438,396),(17,17,17,17),(63,766,94,772))
frame(t,'button-start','timer',(501,849,288,84),(13,13,14,13),(515,866,561,893));frame(t,'button-reset','timer',(793,849,297,84),(13,13,13,13),(1062,868,1074,909))
crop('timer-session-binding','timer',(29,974,624,45));crop('timer-sessions-paper','timer',(29,1020,612,191));crop('timer-navy-mug','timer',(0,1176,200,226));crop('timer-phone','timer',(897,1162,225,240));crop('timer-egg-clock','timer',(747,1220,160,149));crop('timer-crossword','timer',(129,1271,668,131));crop('timer-pen','timer',(209,1326,124,76))
crop('badge-cabinet-sign','badges',(380,428,376,43));crop('badge-cabinet-rim','badges',(50,422,1016,60));crop('badge-shelf-front','badges',(81,690,956,25));crop('badge-trophy','badges',(208,479,113,156));crop('badge-certificate','badges',(467,499,213,133));crop('badge-best-mug','badges',(785,515,158,117));crop('badge-in-tray','badges',(151,763,244,96));crop('badge-dwight','badges',(519,719,83,143));crop('badge-printer','badges',(159,965,190,117));crop('badge-monitor','badges',(490,964,143,120));crop('badge-phone','badges',(782,958,150,126));crop('badge-base','badges',(136,630,258,71))
frame(t,'badge-base-live','badges',(135,631,260,69),(12,10,13,11),(150,649,176,672))
crop('badge-wall-texture','badges',(393,495,37,176));crop('badge-locked-mug','badges',(791,741,141,120));crop('badge-right-trophy','badges',(1015,920,106,338));crop('badge-next-folder','badges',(152,1154,670,229));crop('badge-bow-tie','badges',(796,1189,195,93));crop('badge-note','badges',(845,1248,213,126))
frame(t,'badge-next-paper','badges',(180,1174,610,179),(35,32,32,25),(239,1364,612,1370))
# Retain the exact physical tray, clips and paper borders. Only live values change.
im=Image.open(a/'home-tray.png').convert('RGBA');d=ImageDraw.Draw(im)
for box in [(87,35,220,115),(233,35,385,115),(413,35,560,115)]:d.rectangle(box,fill='#eeede7')
im.save(a/'home-tray-live.png')
im=Image.open(root/'docs/tv-themes/concepts/scranton/home.png').convert('RGBA');j=im.crop((0,737,734,205+737));d=ImageDraw.Draw(j);d.rectangle((73,4,229,28),fill='#e9e1cf');d.rectangle((287,52,491,180),fill='#e9e1cf');d.rectangle((166,116,240,140),fill='#e4d3a1');j.save(a/'home-jar-scene-live.png')
# The count remains native in a paper label on top of the original jar.
# Individual extraction manifest and atlas include every page and its props.
out=root/'docs/reference-rebuild/scranton';out.mkdir(parents=True,exist_ok=True)
(out/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
for page in ['home','notes','todos','timer','badges']:
    rows=[m for m in manifest if m['source'].endswith('/'+page+'.png')];sheet=Image.new('RGB',(1100,((len(rows)+4)//5)*175),'#d7d9d7');d=ImageDraw.Draw(sheet)
    for i,item in enumerate(rows):
        im=Image.open(root/item['asset']);im.thumbnail((209,141));x=i%5*220;y=i//5*175;sheet.paste(im,(x+(220-im.width)//2,y),im);d.text((x+3,y+147),Path(item['asset']).stem,fill='#132d51')
    sheet.save(out/(page+'-assets.jpg'),quality=94)
print(json.dumps({'theme':t,'assets':len(manifest),'otherThemesTouched':False}))
