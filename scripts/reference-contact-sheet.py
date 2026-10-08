from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
root=Path(__file__).resolve().parents[1]
source=Path.home()/'.codex/generated_images/01a11632-aa61-74c2-a524-405a7afcabb2'
files=sorted(source.glob('*.png'))
out=root/'docs/reference-rebuild';out.mkdir(parents=True,exist_ok=True)
sheet=Image.new('RGB',(1200,((len(files)+5)//6)*230),'#eeeeee');d=ImageDraw.Draw(sheet)
for i,file in enumerate(files):
    im=Image.open(file);im.thumbnail((190,195));x=(i%6)*200;y=(i//6)*230
    sheet.paste(im,(x+(190-im.width)//2,y))
    d.text((x+3,y+197),str(i)+' '+file.name[5:19],fill='black')
sheet.save(out/'originals-contact-sheet.jpg',quality=88)
(out/'originals-index.txt').write_text('\n'.join(str(i)+' '+str(p) for i,p in enumerate(files)),encoding='utf-8')
print(len(files),'original images indexed')
