"""SpongeBob-only extraction. Originals and other theme assets are immutable."""
from pathlib import Path
from PIL import Image,ImageDraw
import hashlib,json
root=Path(__file__).resolve().parents[1];source=root/'docs/spongebob/approved-concept.png'
original=Image.open(source).convert('RGBA');out=root/'themes/bikini-bottom/assets/reference';out.mkdir(parents=True,exist_ok=True)
docs=root/'docs/reference-rebuild/bikini-bottom';docs.mkdir(parents=True,exist_ok=True)
records=[]
def crop(name,page,rect):
    x,y,w,h=rect
    assert x>=0 and y>=0 and x+w<=original.width and y+h<=original.height,(name,rect)
    im=original.crop((x,y,x+w,y+h));im.save(out/(name+'.png'))
    records.append({'asset':f'themes/bikini-bottom/assets/reference/{name}.png','page':page,'source':source.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'crop':rect,'size':im.size})
assets={
 'header-original':('shared',(30,38,478,69)), 'nav-original':('shared',(30,107,478,70)),
 'brand-original':('shared',(44,44,137,55)), 'header-gear-original':('shared',(351,49,28,27)),
 'header-pin-original':('shared',(389,48,29,30)), 'header-min-original':('shared',(433,53,25,24)),
 'header-close-original':('shared',(470,52,26,26)), 'nav-selected-original':('shared',(46,109,70,57)),
 'nav-home-original':('shared',(565,114,34,35)), 'nav-notes-original':('shared',(647,114,28,36)),
 'nav-todos-original':('shared',(224,114,31,35)), 'nav-timer-original':('shared',(299,114,31,36)),
 'nav-badges-original':('shared',(374,114,31,36)), 'nav-budget-original':('shared',(449,114,32,35)),
 'home-original':('home',(30,178,478,846)), 'home-hero-original':('home',(30,178,478,269)),
 'home-bubble-original':('home',(111,258,208,90)), 'home-character-original':('home',(294,259,212,193)),
 'home-pineapple-original':('home',(46,280,92,137)), 'home-stat-original':('home',(46,446,452,81)),
 'home-stat-check':('home',(64,465,32,29)), 'home-stat-clock':('home',(211,464,31,31)),
 'home-stat-flame':('home',(377,461,33,38)), 'home-week-original':('home',(46,540,452,187)),
 'home-week-heading':('home',(63,550,138,29)), 'home-week-flower':('home',(438,551,45,47)),
 'home-jar-original':('home',(46,736,452,128)), 'home-jar-heading':('home',(62,746,93,24)),
 'home-bottle-original':('home',(65,775,86,85)), 'home-jar-jellyfish':('home',(441,744,49,49)),
 'home-jar-input-original':('home',(162,788,233,48)), 'home-jar-button-original':('home',(403,788,81,51)),
 'home-quick-original':('home',(46,873,452,67)), 'home-quick-focus-original':('home',(47,873,139,66)),
 'home-quick-todo-original':('home',(194,873,129,66)), 'home-quick-note-original':('home',(335,873,122,66)),
 'home-quick-jellyfish':('home',(66,884,38,46)), 'home-quick-todo-icon':('home',(214,884,30,42)),
 'home-quick-note-icon':('home',(354,885,32,38)), 'home-footer-original':('home',(30,940,478,84)),
 'home-patrick-original':('home',(407,855,101,153)), 'sand-texture-original':('home',(166,946,111,20)),
 'notes-original':('notes',(532,178,480,846)), 'notes-heading-original':('notes',(555,197,147,48)),
 'notes-flower-original':('notes',(721,190,75,66)), 'notes-new-button-original':('notes',(854,203,135,53)),
 'note-yellow-original':('notes',(551,272,433,132)), 'note-pink-original':('notes',(550,421,212,142)),
 'note-blue-original':('notes',(777,419,214,143)), 'note-pin-original':('notes',(566,286,29,31)),
 'note-shell-original':('notes',(563,435,34,33)), 'note-anchor-original':('notes',(792,431,32,38)),
 'note-yellow-flower':('notes',(902,316,65,60)), 'note-pink-flower':('notes',(721,518,33,38)),
 'note-blue-flower':('notes',(945,516,37,39)), 'notebook-original':('notes',(545,579,449,305)),
 'notebook-hole-original':('notes',(546,591,26,29)), 'notebook-saved-icon':('notes',(876,599,26,25)),
 'notebook-paper-original':('notes',(640,687,215,25)), 'notes-footer-original':('notes',(532,879,480,145)),
 'notes-sign-original':('notes',(850,876,110,85)), 'notes-seaweed-left':('notes',(532,884,80,132)),
 'notes-seaweed-right':('notes',(959,877,53,140)), 'notes-rock-coral':('notes',(625,933,204,69)),
 'timer-original':('timer',(1030,178,482,846)), 'timer-top-original':('timer',(1030,178,482,180)),
 'timer-heading-original':('timer',(1151,193,243,46)), 'timer-label-original':('timer',(1104,250,340,45)),
 'timer-pencil-original':('timer',(1119,260,22,24)), 'timer-preset-original':('timer',(1088,304,68,50)),
 'timer-preset-selected-original':('timer',(1236,304,68,50)), 'timer-presets-original':('timer',(1088,304,358,50)),
 'timer-porthole-original':('timer',(1107,359,338,341)), 'timer-face-original':('timer',(1140,393,271,270)),
 'timer-casing-bolt':('timer',(1254,363,33,25)), 'timer-status-original':('timer',(1211,575,142,28)),
 'timer-top-jellyfish':('timer',(1447,196,64,79)), 'timer-side-jellyfish':('timer',(1436,376,74,78)),
 'timer-bottom-jellyfish':('timer',(1036,781,68,69)), 'timer-squid-house':('timer',(1035,361,79,171)),
 'timer-pineapple-original':('timer',(1437,467,75,166)), 'timer-corals-original':('timer',(1030,580,80,135)),
 'timer-progress-original':('timer',(1115,705,316,19)), 'timer-progress-filled':('timer',(1117,706,44,16)),
 'timer-progress-empty':('timer',(1344,706,43,16)), 'timer-start-original':('timer',(1114,734,318,54)),
 'timer-start-play-original':('timer',(1222,747,30,29)), 'timer-reset-original':('timer',(1114,794,318,46)),
 'timer-stat-original':('timer',(1058,853,426,86)), 'timer-stat-clock':('timer',(1097,869,36,39)),
 'timer-stat-check':('timer',(1293,870,38,35)), 'timer-footer-original':('timer',(1030,936,482,88)),
 'timer-patrick-original':('timer',(1330,895,182,125))
}
for name,(page,rect) in assets.items():crop(name,page,rect)
(docs/'asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8')
for page in ['shared','home','notes','timer']:
    rows=[r for r in records if r['page']==page];sheet=Image.new('RGB',(1000,((len(rows)+4)//5)*150),'#d9e9dc');draw=ImageDraw.Draw(sheet)
    for i,row in enumerate(rows):
        im=Image.open(root/row['asset']);im.thumbnail((192,118));x=i%5*200;y=i//5*150;sheet.paste(im,(x+(200-im.width)//2,y),im);draw.text((x+3,y+120),Path(row['asset']).stem[:30],fill='#092747')
    sheet.save(docs/(page+'-assets.jpg'),quality=92)
print(json.dumps({'assets':len(records),'pages':4,'originalsChanged':False,'otherThemesChanged':False}))
