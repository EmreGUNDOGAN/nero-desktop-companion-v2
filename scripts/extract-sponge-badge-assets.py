"""Extract every surface, collectible and ornament from the approved badge concept."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
from collections import deque
import hashlib, json

root=Path(__file__).resolve().parents[1]
docs=root/'docs/reference-rebuild/bikini-bottom'
dest=root/'themes/bikini-bottom/assets/reference'
source=docs/'concepts/badges-proposal-v1.png'
raw=Image.open(source).convert('RGBA')
clean=Image.open(dest/'badges-cleanup-sample.png').convert('RGBA').resize(raw.size)
master=raw.copy(); records=[]
def save(name, im, rect, method):
    im.save(dest/(name+'.png'))
    records.append(dict(asset=f'themes/bikini-bottom/assets/reference/{name}.png',source=source.relative_to(root).as_posix(),sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),crop=rect,method=method))
def replace(rect): master.paste(clean.crop(rect),rect[:2])
fields=[(607,582,715,618),(55,626,708,688),(129,708,232,750),(330,708,424,750),(518,708,610,750),(702,708,819,750),(61,841,208,887),(716,843,813,885)]
for rect in fields: replace(rect)
master.paste(clean.crop((260,841,650,887)).resize((97,42)),(716,843))
for rect in [(139,779,204,791),(674,779,738,791)]:master.paste(raw.crop((250,779,315,791)).resize((rect[2]-rect[0],rect[3]-rect[1])),rect[:2])
# Preserve the approved category flower, rather than the cleanup variant.
master.paste(raw.crop((208,841,245,886)),(208,841))
save('badges-live-master',master,[0,0,*raw.size],dict(liveFields=fields,outsideFields='original approved pixels'))
for name,rect in {'badges-header':(0,0,875,111),'badges-nav':(0,111,875,214),'badges-hero':(0,214,875,561),'badges-overview':(0,561,875,791),'badges-footer':(0,1623,875,1798)}.items():
    save(name,master.crop(rect),rect,'original scene; only designated live fields cleared')
# Source wood grain is reused underneath the native scrollable collection.
woodrect=(58,903,135,919); wood=raw.crop(woodrect)
save('badges-wood-tile',wood,woodrect,'original wood grain between source cards')
frame=master.crop((20,798,858,1623))
for rect in [(139,798,204,839),(674,798,738,839)]:frame.paste(clean.crop((260,798,325,839)).resize((rect[2]-rect[0],rect[3]-rect[1])),(rect[0]-20,rect[1]-798))
ImageDraw.Draw(frame).rectangle((23,120,814,799),fill=(0,0,0,0))
save('badges-board-frame',frame,[20,798,858,1623],'original wood edges, category paper and brass clips; transparent dynamic card interior')
cardrects=[(46,929,304,1239),(314,930,567,1239),(575,929,834,1239),(45,1264,304,1596),(313,1264,567,1596),(574,1264,835,1596)]
for i,rect in enumerate(cardrects,1):
    im=raw.crop(rect); inset=12
    im.paste(clean.crop((rect[0]+inset,rect[1]+inset,rect[2]-inset,rect[3]-inset)),(inset,inset))
    statusrect=[(247,935,290,979),(508,935,552,978),(774,935,817,979),(247,1267,290,1311),(508,1267,552,1311),(764,1267,819,1320)][i-1]
    im.paste(clean.crop(statusrect),(statusrect[0]-rect[0],statusrect[1]-rect[1]))
    # Remove only connected brown surroundings, keeping the complete source paper edge.
    mask=Image.new('L',im.size,255); seen=set(); q=deque([(x,y)for x in range(im.width)for y in (0,im.height-1)]+[(x,y)for y in range(im.height)for x in (0,im.width-1)])
    while q:
        x,y=q.popleft()
        if (x,y) in seen: continue
        seen.add((x,y)); r,g,b,_=im.getpixel((x,y))
        if not (45<r<205 and 20<g<155 and b<110 and r>g*1.12): continue
        mask.putpixel((x,y),0)
        for nx,ny in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
            if 0<=nx<im.width and 0<=ny<im.height:q.append((nx,ny))
    im.putalpha(mask)
    save(f'badges-paper-{i}',im,rect,'original 12-pixel paper perimeter; clean live interior; outside wood made transparent')
def polygon(name,rect,points):
    im=raw.crop(rect); mask=Image.new('L',im.size)
    ImageDraw.Draw(mask).polygon([(x-rect[0],y-rect[1])for x,y in points],fill=255)
    im.putalpha(mask.filter(ImageFilter.GaussianBlur(.45)))
    save(name,im,rect,'complete original object with hand-traced transparent silhouette')
polygon('badges-medal',(96,948,251,1096),[(174,953),(183,960),(199,988),(235,997),(244,1005),(243,1017),(221,1040),(226,1074),(221,1085),(209,1089),(175,1075),(141,1088),(128,1087),(122,1077),(126,1042),(103,1021),(101,1009),(107,999),(148,989),(163,959)])
polygon('badges-orderpad',(370,946,522,1116),[(375,972),(384,962),(401,960),(402,954),(409,950),(416,953),(418,959),(432,955),(433,949),(442,947),(449,953),(464,952),(475,950),(483,953),(487,969),(513,1083),(517,1092),(510,1099),(407,1113),(397,1107)])
polygon('badges-patty',(602,950,801,1097),[(645,962),(668,955),(696,953),(721,964),(744,981),(757,1003),(757,1009),(772,1023),(777,1038),(782,1048),(792,1057),(794,1069),(782,1081),(753,1092),(681,1093),(638,1089),(616,1078),(608,1065),(611,1053),(627,1044),(629,1036),(623,1030),(628,1016),(642,1007),(642,992)])
polygon('badges-porthole',(87,1273,257,1466),[(172,1277),(183,1280),(192,1293),(186,1307),(210,1316),(237,1343),(249,1380),(250,1412),(237,1438),(211,1458),(177,1464),(142,1460),(114,1441),(96,1414),(90,1380),(98,1349),(121,1323),(157,1308),(153,1297),(155,1283)])
polygon('badges-calendar',(345,1289,534,1466),[(373,1317),(398,1307),(402,1298),(412,1296),(420,1306),(441,1302),(445,1295),(454,1295),(465,1304),(485,1300),(493,1295),(503,1302),(509,1313),(530,1440),(522,1452),(402,1461),(379,1440),(351,1434),(350,1421),(361,1322)])
polygon('badges-notebook',(608,1298,787,1474),[(638,1324),(665,1307),(697,1303),(710,1307),(718,1320),(730,1381),(750,1330),(761,1326),(774,1333),(778,1342),(741,1440),(736,1447),(708,1466),(695,1470),(620,1428),(613,1420),(613,1405),(621,1396),(613,1369),(614,1348)])
def circle(name,rect):
    im=raw.crop(rect);mask=Image.new('L',im.size);ImageDraw.Draw(mask).ellipse((1,1,im.width-2,im.height-2),fill=255);im.putalpha(mask);save(name,im,rect,'whole source circular control with transparent surroundings')
circle('badges-check',(248,936,289,977));circle('badges-lock',(765,1267,817,1318))
circle('badges-fastener',(161,913,187,941))
for name,rect in {'badges-date':(137,1194,162,1221),'badges-progress-trough':(57,626,706,651),'badges-progress-fill':(60,629,104,648),'badges-blue-flower':(208,841,245,886),'badges-overview-flower':(725,570,832,680),'badges-sign':(618,1632,777,1758),'badges-clip-left':(139,779,204,839),'badges-clip-right':(674,779,738,839),'badges-star-tab':(80,708,125,752),'badges-shell-tab':(276,708,320,752),'badges-diamond-tab':(483,708,517,751),'badges-crown-tab':(662,708,707,751),'badges-sponge':(155,308,452,562),'badges-patrick':(417,350,647,562),'badges-speech':(504,260,735,379)}.items():
    if name not in ['badges-clip-left','badges-clip-right']:save(name,raw.crop(rect),rect,'complete original source ornament/control/character')
polygon('badges-clip-left',(139,779,204,839),[(163,781),(176,782),(185,793),(182,806),(179,816),(199,820),(199,834),(142,834),(142,820),(156,816),(153,806),(150,798),(152,788)])
polygon('badges-clip-right',(674,779,738,839),[(698,781),(711,782),(720,793),(717,806),(714,816),(734,820),(734,834),(677,834),(677,820),(691,816),(688,806),(685,798),(687,788)])
# Reusable category buttons: baked word is cleared but source icon and paper stay.
for i,rect in enumerate([(46,692,242,766),(251,692,434,766),(443,692,627,766),(636,692,829,766)],1):
    save(f'badges-tab-{i}',master.crop(rect),rect,'original category surface and icon; native word area cleared')
save('badges-tab-neutral',master.crop((251,692,434,766)),[251,692,434,766],'native category selection uses source cream material')
for name,rect,iconrect,tile in [('badges-button-selected',(46,692,242,766),(76,704,129,756),(133,706,225,752)),('badges-button-plain',(251,692,434,766),(274,704,324,756),(329,706,418,752))]:
    im=master.crop(rect);im.paste(master.crop(tile).resize((iconrect[2]-iconrect[0],iconrect[3]-iconrect[1])),(iconrect[0]-rect[0],iconrect[1]-rect[1]));save(name,im,rect,'source button with native icon and word area blank')
polygon('badges-star-icon',(80,708,125,752),[(101,709),(108,724),(123,727),(114,738),(115,750),(103,744),(90,750),(91,737),(82,728),(96,724)])
polygon('badges-shell-icon',(276,708,320,752),[(279,718),(285,716),(289,711),(296,709),(302,714),(309,714),(316,719),(317,729),(303,747),(295,751),(289,748),(278,730)])
polygon('badges-diamond-icon',(483,708,517,751),[(500,711),(515,729),(501,747),(486,730)])
polygon('badges-crown-icon',(662,708,707,751),[(670,714),(677,730),(686,715),(690,715),(696,729),(704,719),(705,724),(700,744),(676,745),(670,724)])
(docs/'badge-asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
sheet=Image.new('RGB',(1000,((len(records)+4)//5)*155),'#f6e8b8');d=ImageDraw.Draw(sheet)
for i,row in enumerate(records):
    im=Image.open(root/row['asset']);im.thumbnail((190,118));x=i%5*200;y=i//5*155
    sheet.paste(im,(x+(200-im.width)//2,y),im);d.text((x+3,y+123),Path(row['asset']).stem,fill='#082747')
sheet.save(docs/'badge-assets.jpg',quality=94)
print(len(records),'badge assets extracted from',raw.size)
