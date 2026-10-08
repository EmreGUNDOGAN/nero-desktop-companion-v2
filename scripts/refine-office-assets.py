"""Trim generated cleanup matte and isolate source logos; preserve original props."""
from pathlib import Path
from PIL import Image,ImageDraw,ImageFilter
import json,hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/scranton/assets/reference';report=[]
for raw,name in [('home-tray-generated','home-tray-clean'),('home-jar-generated','home-jar-clean')]:
    file=a/(raw+'.png');im=Image.open(file).convert('RGBA');rgb=im.convert('RGB');rows=[]
    for y in range(im.height):
        row=list(rgb.crop((0,y,im.width,y+1)).getdata());fraction=sum(max(p)>25 for p in row)/len(row)
        if fraction>.22:rows.append(y)
    crop=(0,min(rows),im.width,max(rows)+1) if rows else (0,0,im.width,im.height)
    im=im.crop(crop);im.save(a/(name+'.png'));report.append({'asset':f'themes/scranton/assets/reference/{name}.png','sourceAsset':file.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(file.read_bytes()).hexdigest(),'method':'trim surrounding black matte from text-cleaned reference','crop':crop,'size':im.size})
file=a/'home-tray-clean.png';tray=Image.open(file).convert('RGBA');w,h=tray.size
# Only the tray is an overlay. The surrounding shirts and nameplate belong to
# the hero scene and would otherwise be printed a second time.
points=[(.022,.42),(.09,.17),(.122,.095),(.247,.10),(.337,.12),(.434,.10),(.661,.11),(.858,.095),(.92,.355),(.965,.445),(.974,.91),(.954,.952),(.03,.935),(.022,.91)]
polygon=[(round(x*w),round(y*h)) for x,y in points];mask=Image.new('L',tray.size);ImageDraw.Draw(mask).polygon(polygon,fill=255);tray.putalpha(mask.filter(ImageFilter.GaussianBlur(.5)));tray.save(a/'home-tray-cutout.png')
report.append({'asset':'themes/scranton/assets/reference/home-tray-cutout.png','sourceAsset':file.relative_to(root).as_posix(),'sourceSha256':hashlib.sha256(file.read_bytes()).hexdigest(),'method':'trace tray silhouette; exclude duplicate hero/nameplate pixels','polygon':polygon})
file=root/'docs/tv-themes/concepts/scranton/notes.png';im=Image.open(file).crop((549,482,635,543));im.save(a/'note-composer-logo-clean.png');report.append({'asset':'themes/scranton/assets/reference/note-composer-logo-clean.png','source':file.relative_to(root).as_posix(),'crop':[549,482,635,543],'method':'complete company logo and tagline; excludes adjacent note title'})
file=root/'docs/tv-themes/concepts/scranton/timer.png';im=Image.open(file).crop((646,951,899,1220));im.save(a/'timer-stat-raw.png');report.append({'asset':'themes/scranton/assets/reference/timer-stat-raw.png','source':file.relative_to(root).as_posix(),'crop':[646,951,899,1220],'method':'full standing folded stats paper before text cleaning'})
source=Image.open(file).convert('RGB')
for name,rect in {'home':(54,88,83,119),'notes':(240,88,270,120),'todos':(415,87,448,120),'timer':(584,85,622,120),'badges':(776,87,807,120),'budget':(976,87,1010,120)}.items():
    crop=source.crop(rect);alpha=Image.new('L',crop.size)
    alpha.putdata([max(0,min(255,int((max(pixel)-150)*4 if name=='timer' else (210-min(pixel))*6))) for pixel in crop.getdata()])
    icon=Image.new('RGBA',crop.size,'#475268');icon.putalpha(alpha);bounds=alpha.getbbox()
    if bounds:icon=icon.crop(bounds)
    padded=Image.new('RGBA',(icon.width+6,icon.height+6));padded.paste(icon,(3,3));padded.save(a/('nav-'+name+'-cutout.png'))
    report.append({'asset':f'themes/scranton/assets/reference/nav-{name}-cutout.png','source':file.relative_to(root).as_posix(),'crop':rect,'method':'isolate complete original menu glyph; source alpha shape with neutral ink, three-pixel padding'})
(root/'docs/reference-rebuild/scranton/refined-asset-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False))
