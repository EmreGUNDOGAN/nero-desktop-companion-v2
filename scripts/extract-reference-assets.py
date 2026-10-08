"""Deterministic extraction requested by the user. Approved originals remain immutable.
Every crop has a source hash and rectangle. Blank frames retain the original edges;
only their replaceable live-data area is filled with a sampled paper texture.
"""
from pathlib import Path
from PIL import Image,ImageDraw,ImageOps,ImageChops,ImageFilter,ImageStat
import hashlib,json,shutil,sys
root=Path(__file__).resolve().parents[1]
docs=root/'docs/reference-rebuild';docs.mkdir(parents=True,exist_ok=True)
manifest=[]
selected=sys.argv[1] if len(sys.argv)>1 else None
def seamless_paper(tile):
    rgb=tile.convert('RGB');mean=ImageStat.Stat(rgb).mean
    detail=ImageChops.subtract(rgb,rgb.filter(ImageFilter.GaussianBlur(12)),offset=128)
    channels=[c.point(lambda v,level=mean[i]:round(v+level-128)) for i,c in enumerate(detail.split())]
    return Image.merge('RGB',channels).convert('RGBA')
def source(theme,page):
    return root/('docs/spongebob/approved-concept.png' if theme=='bikini-bottom' else f'docs/tv-themes/concepts/{theme}/{page}.png')
def extract(theme,name,page,rect,blank=None,sample=None):
    if selected and theme!=selected:return None
    file=source(theme,page);original=Image.open(file).convert('RGBA')
    x,y,w,h=map(int,rect);assert x>=0 and y>=0 and x+w<=original.width and y+h<=original.height,(name,rect,original.size)
    im=original.crop((x,y,x+w,y+h))
    if blank:
        bx,by,bw,bh=blank
        tile=seamless_paper(original.crop(sample)) if sample else Image.new('RGBA',(1,1),im.getpixel((max(2,bx),max(2,by))))
        area=Image.new('RGBA',(bw,bh))
        for yy in range(0,bh,tile.height):
            for xx in range(0,bw,tile.width):area.paste(tile,(xx,yy))
        im.paste(area,(bx,by))
    out=root/f'themes/{theme}/assets/reference';out.mkdir(parents=True,exist_ok=True)
    dest=out/(name+'.png');im.save(dest)
    manifest.append({'theme':theme,'asset':dest.relative_to(root).as_posix(),'source':file.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(file.read_bytes()).hexdigest(),'rect':[x,y,w,h],'liveArea':blank,'textureSample':sample,'size':[w,h]})
    return im
def frame(t,n,p,r,insets,sample):
    if selected and t!=selected:return None
    l,top,right,bottom=insets
    if t=='stars-hollow':
        # Reviewed blank regions; never sample an arbitrary area containing glyphs.
        if n=='note-green':sample=(85,907,327,920)
        elif n=='note-pink':sample=(620,911,799,920)
        elif n in ('note-yellow','note-book','notes-archive-strip','home-calendar'):
            sample=(210,1370,480,1400)
            original=Image.open(source(t,'notes')).convert('RGBA')
            file=source(t,p);im=Image.open(file).convert('RGBA').crop((r[0],r[1],r[0]+r[2],r[1]+r[3]))
            l=76 if n=='note-book' else min(l,22);top=10;right=20;bottom=12
            tile=seamless_paper(original.crop(sample));area=Image.new('RGBA',(r[2]-l-right,r[3]-top-bottom))
            for yy in range(0,area.height,tile.height):
                for xx in range(0,area.width,tile.width):area.paste(tile,(xx,yy))
            im.paste(area,(l,top));out=root/f'themes/{t}/assets/reference';out.mkdir(parents=True,exist_ok=True);dest=out/(n+'.png');im.save(dest)
            manifest.append({'theme':t,'asset':dest.relative_to(root).as_posix(),'source':file.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(file.read_bytes()).hexdigest(),'rect':list(r),'liveArea':[l,top,area.width,area.height],'textureSource':'docs/tv-themes/concepts/stars-hollow/notes.png','textureSample':list(sample),'size':list(im.size)})
            return im
        elif p=='timer':sample=(171,747,292,757)
        else:
            # Use the same reviewed blank parchment, with the original frame untouched.
            original=Image.open(source(t,'timer')).convert('RGBA');tile=seamless_paper(original.crop((171,747,292,757)))
            file=source(t,p);im=Image.open(file).convert('RGBA').crop((r[0],r[1],r[0]+r[2],r[1]+r[3]))
            l=min(l,22);top=10;right=20;bottom=12;area=Image.new('RGBA',(r[2]-l-right,r[3]-top-bottom))
            for yy in range(0,area.height,tile.height):
                for xx in range(0,area.width,tile.width):area.paste(tile,(xx,yy))
            im.paste(area,(l,top));out=root/f'themes/{t}/assets/reference';out.mkdir(parents=True,exist_ok=True);dest=out/(n+'.png');im.save(dest)
            manifest.append({'theme':t,'asset':dest.relative_to(root).as_posix(),'source':file.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(file.read_bytes()).hexdigest(),'rect':list(r),'liveArea':[l,top,area.width,area.height],'textureSource':'docs/tv-themes/concepts/stars-hollow/timer.png','textureSample':[171,747,292,757],'size':list(im.size)})
            return im
        l=min(l,22);top=10;right=min(right,20);bottom=min(bottom,12)
    return extract(t,n,p,r,[l,top,r[2]-l-right,r[3]-top-bottom],sample)

t='stars-hollow'
for p,r in {'home':(0,113,743,313),'notes':(0,134,887,383),'todos':(0,134,887,389),'timer':(0,134,887,343),'badges':(0,134,887,317)}.items():extract(t,p+'-hero',p,r)
extract(t,'timer-table','timer',(0,474,887,1300))
extract(t,'timer-footer','timer',(0,1598,887,176))
extract(t,'timer-receipt','timer',(710,941,176,374))
extract(t,'timer-coffee-raw','timer',(189,755,526,410))
extract(t,'timer-coffee-tag','timer',(319,753,239,80))
extract(t,'wood','timer',(9,887,165,157))
extract(t,'paper','notes',(300,1291,190,82))
extract(t,'coffee-icon','timer',(206,490,61,51))
extract(t,'dragonfly','todos',(406,482,85,35))
extract(t,'notes-footer','notes',(0,1491,887,283))
extract(t,'todos-footer','todos',(0,1584,887,190))
extract(t,'yale-stamp','notes',(666,608,139,94))
extract(t,'yale-ribbon','notes',(778,1041,58,158))
extract(t,'gazebo-photo','home',(54,1060,223,152))
frame(t,'note-yellow','notes',(43,513,802,220),(38,30,29,24),(450,525,580,546))
frame(t,'note-green','notes',(38,746,397,211),(28,13,22,20),(79,889,318,902))
frame(t,'note-pink','notes',(447,744,413,210),(27,13,24,21),(501,848,657,866))
frame(t,'note-book','notes',(14,1036,849,507),(76,26,28,21),(210,1370,480,1400))
frame(t,'timer-setup','timer',(128,475,631,309),(28,17,30,27),(280,571,591,583))
frame(t,'timer-sessions','timer',(108,1285,678,215),(29,25,30,25),(360,1327,570,1344))
frame(t,'timer-stat','timer',(173,1503,268,96),(14,13,15,14),(202,1518,425,1529))
frame(t,'todo-paper','todos',(33,710,826,531),(32,45,30,24),(80,980,285,999))
frame(t,'todo-later','todos',(37,1244,821,241),(31,34,32,26),(325,1311,544,1330))
frame(t,'todo-capture','todos',(26,521,836,183),(26,20,24,20),(49,574,308,588))
frame(t,'title-paper','todos',(278,410,337,110),(25,18,25,17),(301,468,348,478))
frame(t,'home-stat','home',(29,439,220,91),(19,22,18,18),(120,456,158,465))
frame(t,'home-newspaper','home',(21,1019,672,208),(22,21,22,19),(293,1105,581,1115))
frame(t,'home-jar-paper','home',(88,727,558,198),(28,40,27,22),(340,802,460,817))
frame(t,'home-calendar','home',(9,1372,706,268),(66,26,49,25),(207,1457,300,1477))
frame(t,'home-archive','home',(29,1651,603,194),(31,27,26,26),(219,1740,593,1751))
extract(t,'home-bottom','home',(0,1843,743,273))
extract(t,'home-desk','home',(0,1229,743,143))
extract(t,'home-chalkboard','home',(18,531,700,187))
extract(t,'badges-footer','badges',(0,1458,887,316))
frame(t,'badge-frame','badges',(84,701,230,262),(22,90,20,22),(108,862,281,877))

t='scranton'
for p,r in {'home':(0,56,734,310),'notes':(0,82,1122,349),'todos':(0,126,1122,247),'timer':(0,139,1122,295),'badges':(43,124,1038,234)}.items():extract(t,p+'-hero',p,r)
extract(t,'timer-clock-raw','timer',(493,469,544,338))
extract(t,'timer-table','timer',(0,433,1122,969))
extract(t,'timer-footer','timer',(0,1209,1122,193))
extract(t,'notes-footer','notes',(0,1103,1122,299))
extract(t,'todos-footer','todos',(0,1105,1122,297))
extract(t,'office-logo','notes',(841,7,109,74))
extract(t,'scranton-stamp','notes',(874,1140,226,122))
extract(t,'paper','notes',(725,994,194,78))
extract(t,'desk-texture','timer',(752,932,155,51))
extract(t,'clock-label','timer',(685,502,182,33))
extract(t,'blue-tray','notes',(18,402,444,703))
extract(t,'note-pin-red','notes',(64,480,30,59))
extract(t,'note-pin-grey','notes',(75,663,28,61))
extract(t,'note-sticky','notes',(704,318,124,117))
extract(t,'timer-sticky','timer',(914,974,208,193))
frame(t,'note-yellow','notes',(40,478,400,192),(38,20,17,18),(126,483,309,501))
frame(t,'note-green','notes',(39,670,404,161),(29,24,20,20),(229,800,393,820))
frame(t,'note-book','notes',(470,427,643,677),(65,60,26,24),(621,958,1035,1000))
frame(t,'timer-sessions','timer',(20,977,637,252),(48,47,22,19),(351,1190,590,1205))
frame(t,'timer-stat','timer',(646,951,253,269),(36,25,35,26),(715,1164,865,1202))
frame(t,'whiteboard','todos',(14,371,1098,734),(37,40,37,36),(674,857,1061,889))
frame(t,'todo-white','todos',(62,581,501,126),(25,21,20,15),(344,608,431,638))
frame(t,'todo-yellow','todos',(590,579,474,136),(23,19,19,18),(879,660,1027,697))
frame(t,'home-report','home',(22,488,690,230),(28,26,25,22),(216,550,464,569))
frame(t,'home-total','home',(25,1029,684,225),(33,26,26,24),(402,1180,478,1202))
extract(t,'home-tray','home',(58,347,618,132))
extract(t,'home-jar-scene','home',(0,727,734,205))
extract(t,'home-desk','home',(0,1262,734,165))
extract(t,'home-calendar-scene','home',(0,1430,734,300))
extract(t,'home-bottom','home',(0,1877,734,264))
extract(t,'badges-cabinet','badges',(52,421,1015,740))
extract(t,'badges-footer','badges',(0,1155,1122,247))

t='bikini-bottom'
extract(t,'home-scene','home',(30,242,478,208))
extract(t,'timer-scene','timer',(1029,181,482,671))
extract(t,'timer-porthole-raw','timer',(1107,359,338,341))
extract(t,'notes-background','notes',(532,181,481,843))
extract(t,'notes-footer','notes',(531,881,483,143))
extract(t,'timer-footer','timer',(1028,937,485,87))
extract(t,'sand-paper','notes',(623,710,160,70))
extract(t,'nav-background','home',(31,109,478,66))
for name,r in {'home':(65,115,35,34),'notes':(149,115,28,34),'todos':(222,114,32,35),'timer':(297,114,35,35),'badges':(371,114,36,36),'budget':(448,114,36,35),'pin':(566,280,32,36),'shell':(562,432,36,33),'anchor':(791,429,34,39)}.items():extract(t,'icon-'+name,'home',r)
frame(t,'note-yellow','notes',(548,272,436,131),(18,16,20,19),(683,376,824,390))
frame(t,'note-pink','notes',(550,421,212,142),(16,13,16,16),(582,539,685,551))
frame(t,'note-blue','notes',(777,418,214,143),(16,13,17,16),(818,534,910,548))
frame(t,'notebook','notes',(546,578,446,309),(49,20,20,20),(621,743,913,771))
extract(t,'flower','notes',(720,190,74,68))
extract(t,'patrick','timer',(1325,894,185,117))

(docs/'asset-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
cols=5;cellw=220;cellh=170
sheet=Image.new('RGB',(cols*cellw,((len(manifest)+cols-1)//cols)*cellh),'#e1ded3');draw=ImageDraw.Draw(sheet)
for i,item in enumerate(manifest):
    im=Image.open(root/item['asset']);im.thumbnail((207,140));x=(i%cols)*cellw;y=(i//cols)*cellh
    sheet.paste(im,(x+(cellw-im.width)//2,y),im)
    draw.text((x+4,y+142),item['theme']+'/'+Path(item['asset']).stem,fill='#172b46')
sheet.save(docs/'extracted-assets-contact-sheet.jpg',quality=90)
print(json.dumps({'assets':len(manifest),'themes':sorted(set(i['theme'] for i in manifest)),'originalsChanged':False}))
