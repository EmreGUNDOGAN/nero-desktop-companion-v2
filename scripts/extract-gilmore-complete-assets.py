"""Single-theme extraction, with individual assets and a reviewable provenance atlas."""
from pathlib import Path
from PIL import Image,ImageDraw
import runpy,sys,json
root=Path(__file__).resolve().parents[1]
sys.argv=[str(root/'scripts/extract-reference-assets.py'),'stars-hollow']
ns=runpy.run_path(sys.argv[0]);extract=ns['extract'];frame=ns['frame'];manifest=ns['manifest'];t='stars-hollow'

# Shared chrome and controls, each taken from the same approved page.
extract(t,'brand-logo','timer',(392,6,109,34))
extract(t,'brand-subtitle','timer',(366,40,157,19))
extract(t,'chrome-paper','timer',(75,7,181,41))
for name,r in {'home':(110,67,40,45),'notes':(236,69,42,42),'todos':(360,69,42,42),'timer':(483,66,42,46),'badges':(606,68,42,44),'budget':(732,69,42,42)}.items():extract(t,'nav-'+name,'timer',r)
frame(t,'input-frame','timer',(165,633,561,43),(8,7,8,7),(405,647,688,664))
frame(t,'select-frame','timer',(165,585,561,42),(8,7,30,7),(442,597,648,610))
frame(t,'button-light','timer',(164,691,83,50),(10,10,10,10),(182,696,214,701))
frame(t,'button-wine','timer',(351,691,90,50),(10,10,10,10),(362,697,397,703))
frame(t,'button-start','timer',(140,1203,375,70),(12,12,12,12),(162,1212,221,1218))
frame(t,'button-reset','timer',(523,1203,224,70),(12,12,12,12),(649,1212,716,1218))
extract(t,'icon-play','timer',(279,1230,27,31))
extract(t,'icon-reset','timer',(577,1226,34,36))
extract(t,'icon-check','timer',(153,1359,34,34))
extract(t,'icon-pause','timer',(153,1416,34,34))
frame(t,'progress-paper','timer',(176,1149,534,39),(13,7,13,7),(470,1165,680,1170))
extract(t,'timer-teapot-left','timer',(0,1280,137,491))
extract(t,'timer-sugar-left','timer',(0,551,129,318))
extract(t,'timer-napkin-right','timer',(758,547,129,365))
extract(t,'timer-milk-right','timer',(811,1374,76,400))
extract(t,'timer-note-bottom','timer',(340,1611,440,155))
extract(t,'coffee-icon-small','timer',(141,1300,45,40))

# Notebook and individual library objects; no generic replacement frames.
extract(t,'note-clip','notes',(81,509,43,79))
extract(t,'note-border-top','notes',(40,514,805,35))
extract(t,'note-border-bottom','notes',(46,711,793,24))
extract(t,'note-ring-binding','notes',(14,1040,70,504))
extract(t,'note-pen-right','notes',(844,1150,42,444))
extract(t,'note-library-mug','notes',(0,1476,184,270))
extract(t,'note-books-bottom','notes',(506,1491,381,277))
extract(t,'note-return-slip','notes',(143,1567,203,207))
extract(t,'note-pencil-bottom','notes',(265,1659,430,115))
extract(t,'note-ivy-left','notes',(0,686,42,340))
frame(t,'notes-archive-strip','notes',(36,965,822,59),(18,12,18,12),(537,988,775,1002))
extract(t,'tag-green','notes',(303,761,64,28))
extract(t,'tag-wine','notes',(733,761,58,27))
extract(t,'tag-blue','notes',(675,549,66,27))

# Dragonfly Inn paperwork and accessories.
extract(t,'todo-clip','todos',(342,669,193,76))
extract(t,'todo-paper-flower','todos',(755,731,73,102))
extract(t,'todo-later-flower','todos',(714,1244,93,77))
extract(t,'todo-pin-gold','todos',(426,1228,23,36))
extract(t,'todo-dragonfly-stamp','todos',(410,757,73,37))
extract(t,'todo-inn-heading','todos',(570,755,190,40))
extract(t,'todo-mug-left','todos',(0,1478,142,268))
extract(t,'todo-keyring','todos',(211,1585,362,120))
extract(t,'todo-sookie-note','todos',(622,1546,265,220))
extract(t,'todo-towel-left','todos',(0,1627,193,147))
extract(t,'todo-ivy-right','todos',(845,782,42,766))
frame(t,'todo-archive-strip','todos',(128,1495,638,92),(22,15,22,15),(420,1501,699,1508))
extract(t,'todo-drag-icon','todos',(267,1454,18,20))

# Home desk, newspaper, corkboard and individual nostalgic objects.
extract(t,'home-stars-hollow-plaque','home',(288,397,154,28))
extract(t,'home-stat-clip','home',(120,424,26,34))
extract(t,'home-stat-cup','home',(44,459,52,42))
extract(t,'home-stat-takeaway','home',(286,462,31,47))
extract(t,'home-stat-steaming-cup','home',(528,462,40,48))
extract(t,'home-lukes-stamp','home',(193,491,47,36))
extract(t,'home-chalkboard-frame-top','home',(17,531,700,18))
extract(t,'home-chalkboard-frame-bottom','home',(17,700,701,22))
extract(t,'home-chalk-texture','home',(369,580,65,24))
extract(t,'home-chalk-cup','home',(636,550,53,55))
extract(t,'home-memory-jar','home',(506,751,143,175))
extract(t,'home-jar-bell','home',(57,812,32,112))
extract(t,'home-jar-daisies-left','home',(0,724,97,147))
extract(t,'home-jar-daisies-right','home',(659,730,84,105))
extract(t,'home-jar-keyring','home',(611,868,127,65))
extract(t,'home-desk-mug','home',(47,1280,65,74))
extract(t,'home-desk-book','home',(121,1280,53,77))
extract(t,'home-desk-snowglobe','home',(646,1280,97,82))
extract(t,'home-newspaper-photo','home',(54,1060,223,152))
extract(t,'home-newspaper-heading','home',(431,1036,216,31))
extract(t,'home-calendar-rings','home',(8,1380,56,256))
extract(t,'home-calendar-yale','home',(650,1398,82,162))
extract(t,'home-archive-photo','home',(54,1681,162,146))
extract(t,'home-archive-pin','home',(137,1651,28,29))
extract(t,'home-autumn-leaves','home',(57,1774,106,72))
extract(t,'home-footer-mug','home',(0,1853,108,175))
extract(t,'home-footer-newspaper','home',(531,2020,212,96))

# Festival collection: each unlocked object, locked sketch, pin, frame and ticket.
extract(t,'badge-corkboard','badges',(8,646,875,715))
extract(t,'badge-cork-texture','badges',(315,945,12,117))
extract(t,'badge-header-gazebo','badges',(344,455,223,110))
extract(t,'badge-cup','badges',(171,744,122,111))
extract(t,'badge-library-tag','badges',(429,725,135,164))
extract(t,'badge-dragonfly-tag','badges',(703,747,145,146))
extract(t,'badge-gazebo-photo','badges',(158,973,139,137))
extract(t,'badge-cassette','badges',(426,968,141,139))
extract(t,'badge-signpost-sketch','badges',(727,1009,126,110))
extract(t,'badge-books-sketch','badges',(169,1218,123,89))
extract(t,'badge-headphones-sketch','badges',(446,1233,119,93))
extract(t,'badge-road-sketch','badges',(660,1245,197,85))
for name,r in {'red':(146,662,34,33),'blue':(426,662,34,34),'green':(693,662,34,34),'gold':(700,900,38,42)}.items():extract(t,'badge-pin-'+name,'badges',r)
frame(t,'badge-paper','badges',(43,675,260,224),(18,17,16,17),(128,843,182,864))
frame(t,'badge-header-paper','badges',(28,451,835,190),(27,17,25,17),(304,565,618,572))
frame(t,'badge-next-paper','badges',(26,1364,666,210),(29,22,29,23),(334,1530,569,1549))
extract(t,'badge-festival-ticket','badges',(617,1340,270,150))
extract(t,'badge-coffee-card','badges',(611,1486,247,102))
extract(t,'badge-bottom-book','badges',(0,1590,380,115))
extract(t,'badge-bottom-cassette','badges',(52,1649,344,100))
extract(t,'badge-bottom-photo','badges',(478,1577,351,197))
extract(t,'badge-bottom-leaves','badges',(363,1623,149,141))

out=root/'docs/reference-rebuild/stars-hollow';out.mkdir(parents=True,exist_ok=True)
(out/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
pages=['home','notes','todos','timer','badges']
for page in pages:
    rows=[m for m in manifest if m['source'].endswith('/'+page+'.png')]
    sheet=Image.new('RGB',(1100,((len(rows)+4)//5)*175),'#e1ded3');draw=ImageDraw.Draw(sheet)
    for i,item in enumerate(rows):
        im=Image.open(root/item['asset']);im.thumbnail((208,145));x=(i%5)*220;y=(i//5)*175
        sheet.paste(im,(x+(220-im.width)//2,y),im);draw.text((x+3,y+148),Path(item['asset']).stem,fill='#182d48')
    sheet.save(out/(page+'-assets.jpg'),quality=94)
html='<!doctype html><meta charset="utf-8"><title>Gilmore asset review</title><style>body{background:#eadcca;color:#192d3b;font:17px Georgia;padding:25px}article{display:inline-block;vertical-align:top;width:240px;margin:12px;padding:10px;background:#fff8e9}img{width:240px;height:190px;object-fit:contain}code{font:11px monospace;word-break:break-all}</style><h1>Gilmore Girls: individual source assets</h1><p>Extracted originals. Live-data areas and final cleaning still require visual review.</p>'
for item in manifest:html+='<article><img src="../../../'+item['asset']+'"><p>'+Path(item['asset']).stem+'</p><code>'+str(item['rect'])+'</code></article>'
(out/'asset-review.html').write_text(html,encoding='utf-8')
print(json.dumps({'theme':t,'assets':len(manifest),'reviewStatus':'individual visual review required','otherThemesTouched':False}))
