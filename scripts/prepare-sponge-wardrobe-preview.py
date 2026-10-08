"""Package real production wardrobe layers into the chat fitting controls."""
from pathlib import Path
from PIL import Image
import base64,json,re,hashlib,argparse
root=Path(__file__).resolve().parents[1];out=root/'docs/wardrobe-sponge';out.mkdir(exist_ok=True)
prototypes=json.loads((out/'costume-prototypes.json').read_text(encoding='utf8'))
parser=argparse.ArgumentParser();parser.add_argument('--focus',choices=list(prototypes),default='sponge');parser.add_argument('--combined',action='store_true');parser.add_argument('--inline-directory',type=Path);args=parser.parse_args()
title='nero-bikini-costumes' if args.combined else 'nero-costume-fitting' if args.focus=='sponge' else 'nero-'+args.focus+'-fitting'
fragment=(args.inline_directory or out)/(title+'.html')
for spec in prototypes.values():
    Image.open(out/spec['generated']).convert('RGBA').resize((220,260),Image.Resampling.LANCZOS).save(out/spec['body'])
def uri(file):
    mime='image/svg+xml' if file.suffix=='.svg' else 'image/png'
    return 'data:'+mime+';base64,'+base64.b64encode(file.read_bytes()).decode()
def svg_uri(text):return 'data:image/svg+xml;base64,'+base64.b64encode(text.encode()).decode()
def face_profile(file):
    im=Image.open(file).convert('RGBA')
    def green(x,y):
        r,g,b,a=im.getpixel((x,y));return a>220 and r>95 and g>r+4 and g>b+3
    start=None;best=(0,0)
    for y in range(205):
        if sum(green(x,y)for x in range(103,118))>=9:
            if start is None:start=y
        elif start is not None:
            if y-start>best[1]-best[0]:best=(start,y)
            start=None
    if start is not None and 205-start>best[1]-best[0]:best=(start,205)
    h=best[1]-best[0];assert h>=60
    ey=round(best[0]+h*.47);my=best[0]+h*.81;l=r=110
    while l>0 and green(l-1,ey):l-=1
    while r<219 and green(r+1,ey):r+=1
    scale=max(.65,min(1.04,(r-l)/147));skin='#'+''.join(f'{v:02x}'for v in im.getpixel((110,ey))[:3]);return dict(x=(l+r)/2-110*scale,y=ey-108*scale,mouthY=my-172*scale,scale=scale,headRows=best,skin=skin)
catalog=json.loads((root/'themes/default/assets/wardrobe/catalog.json').read_text())
layers=catalog['daily-kot-ceket']['layers'];denim={key:{name:uri(root/'themes/default/assets/wardrobe/daily-kot-ceket'/file)for name,file in variants.items()}for key,variants in layers.items()}
variants={'denim':{'layers':denim}};labels={'denim':'Mevcut kot ceket'}
profiles={}
for name,spec in prototypes.items():
    costume={key:dict(items)for key,items in denim.items()};costume['body']={'default':uri(out/spec['body'])};variants[name]={'layers':costume};labels[name]=spec['label']
    if spec.get('fitFace'):
        profile=face_profile(out/spec['body']);profiles[name]=profile
        for key,items in layers.items():
            if key=='body':continue
            for variant,file in items.items():
                text=(root/'themes/default/assets/wardrobe/daily-kot-ceket'/file).read_text()
                y=profile['mouthY'] if key=='mouth' else profile['y']
                transform=f'translate({profile["x"]} {y}) scale({profile["scale"]})'
                text=re.sub(r'<g transform="[^"]+"','<g transform="'+transform+'"',text,count=1)
                if key=='lids':text=text.replace('#c4d8be',profile['skin'])
                costume[key][variant]=svg_uri(text)
(out/'prototype-face-profiles.json').write_text(json.dumps(profiles,indent=2),encoding='utf8')
theme=json.loads((root/'themes/default/theme.json').read_text())
base={key:{name:uri(root/'themes/default'/file)for name,file in theme['layers'][key].items()}for key in layers}
payload=json.dumps({'base':base,'catalog':variants,'labels':labels},separators=(',',':'))
engine=(root/'src/renderer/character/wardrobe-renderer.js').read_text(encoding='utf8').split("if (typeof module")[0]
template=out/'fitting-preview-template.html'
if not template.exists():
    original=fragment.read_text(encoding='utf8')
    original=re.sub(r'(?<=id="nero-fitting-assets">).*?(?=</script>)','ASSET_PAYLOAD',original,flags=re.S)
    original=original.replace(engine,'RENDERER_SOURCE')
    template.write_text(original,encoding='utf8')
revision=hashlib.sha256(''.join(spec['generated'] for spec in prototypes.values()).encode()).hexdigest()[:8]
html=template.read_text(encoding='utf8').replace('ASSET_PAYLOAD',payload).replace('RENDERER_SOURCE',engine).replace('REVIEW_COSTUME',args.focus).replace('PREVIEW_VERSION',('bikini-five-' if args.combined else args.focus+'-')+revision)
if title!='nero-costume-fitting':html=html.replace('nero-costume-fitting',title).replace('nero-fitting-assets',title+'-assets')
assert len(html.encode())<1000000
fragment.write_text(html,encoding='utf8')
(out/('bikini-costumes-fragment.html' if args.combined else 'fitting-preview-fragment.html' if args.focus=='sponge' else args.focus+'-fitting-fragment.html')).write_text(html,encoding='utf8')
spec=prototypes[args.focus];generated=out/spec['generated']
meta=dict(status=spec['status'],characterRenderer='src/renderer/character/wardrobe-renderer.js',garmentBody=spec['body'],garmentSource=generated.name,garmentSourceSha256=hashlib.sha256(generated.read_bytes()).hexdigest(),nativeFaceLayers='themes/default/assets/wardrobe/daily-kot-ceket',alignment=('220x260; face fitted to measured helmet opening' if spec.get('fitFace') else '220x260; original denim face transforms retained')+'; generated body uniformly resized only',productionIntegration=('bikini-sandy' if args.focus=='sandy' else 'bikini-spongebob' if args.focus=='sponge' else 'bikini-mr-krabs' if args.focus=='mrkrabs' else 'bikini-'+args.focus) in catalog)
(out/('prototype-manifest.json' if args.focus=='sponge' else args.focus+'-prototype-manifest.json')).write_text(json.dumps(meta,ensure_ascii=False,indent=2),encoding='utf8')
print('Fitting preview bytes:',len(html.encode()))
