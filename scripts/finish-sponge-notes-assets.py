"""Keep the approved notes artwork outside the live text fields."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import json,hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/bikini-bottom/assets/reference';docs=root/'docs/reference-rebuild/bikini-bottom'
original=root/'docs/spongebob/approved-concept.png';records=[]
def save(name,im,source,boxes):
 im.save(a/(name+'.png'));records.append({'asset':f'themes/bikini-bottom/assets/reference/{name}.png','source':source,'sourceSha256':hashlib.sha256(original.read_bytes()).hexdigest(),'liveFields':boxes,'outsideLiveFields':'original approved pixels preserved'})
page=Image.open(a/'notes-original.png').convert('RGBA')
save('notes-heading-live',page.crop((0,0,480,94)),'notes-original.png',[ ])
for color,boxes in {'yellow':[(43,14,326,45),(18,56,345,111)],'pink':[(49,15,196,46),(12,57,197,106),(12,106,169,128)],'blue':[(46,15,208,48),(13,59,195,111)]}.items():
 raw=Image.open(a/f'note-{color}-original.png').convert('RGBA');blank=Image.open(a/f'note-{color}.png').convert('RGBA').resize(raw.size,Image.Resampling.LANCZOS)
 mask=Image.new('L',raw.size);draw=ImageDraw.Draw(mask)
 for b in boxes:draw.rectangle(b,fill=255)
 live=Image.composite(blank,raw,mask)
 # The body fields never erase the upper petals of the lower flower.
 if color in ('pink','blue'):
  flower=(155,86,209,139) if color=='pink' else (157,80,211,139)
  if color=='pink':
   # Trace only the connected purple flower, excluding nearby original words.
   points=set()
   for y in range(flower[1],flower[3]):
    for x in range(flower[0],flower[2]):
     r,g,b,_=raw.getpixel((x,y))
     if b>r+8 and b>g+12:points.add((x,y))
   groups=[]
   while points:
    seed=points.pop();group={seed};stack=[seed]
    while stack:
     x,y=stack.pop()
     for p in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)]:
      if p in points:points.remove(p);group.add(p);stack.append(p)
    groups.append(group)
   outline=Image.new('L',raw.size)
   for p in max(groups,key=len):outline.putpixel(p,255)
   live=Image.composite(raw,live,outline.filter(ImageFilter.MaxFilter(3)))
  else:live.paste(raw.crop(flower),flower[:2])
 save(f'note-{color}-live',live,f'note-{color}-original.png',boxes)
raw=Image.open(a/'notebook-original.png').convert('RGBA');blank=Image.open(a/'notebook.png').convert('RGBA').resize(raw.size,Image.Resampling.LANCZOS)
boxes=[(48,13,309,46),(326,12,441,46),(48,59,418,78)];mask=Image.new('L',raw.size);draw=ImageDraw.Draw(mask)
paper=raw.crop((65,85,425,104))
for b in boxes:
 draw.rectangle(b,fill=255)
 blank.paste(paper.resize((b[2]-b[0]+1,b[3]-b[1]+1),Image.Resampling.LANCZOS),b[:2])
save('notebook-live',Image.composite(blank,raw,mask),'notebook-original.png',boxes)
save('notes-footer-live',page.crop((0,706,480,846)),'notes-original.png',[])
# The background sample has no notes or baked text; it preserves the page grain.
paper=page.crop((277,10,311,66));paper.resize((480,94),Image.Resampling.LANCZOS).save(a/'notes-paper-live.png')
(docs/'notes-live-asset-manifest.json').write_text(json.dumps(records,ensure_ascii=False,indent=2),encoding='utf-8');print(len(records),'notes source surfaces prepared')
