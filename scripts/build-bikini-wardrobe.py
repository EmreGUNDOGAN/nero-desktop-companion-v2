"""Install the five fitted costume bodies and independent native face variants."""
from pathlib import Path
import json,base64,re,hashlib
root=Path(__file__).resolve().parents[1];a=root/'themes/default/assets/wardrobe';docs=root/'docs/wardrobe-sponge'
items=json.loads((root/'src/main/wardrobe-bikini.json').read_text());prototypes=json.loads((docs/'costume-prototypes.json').read_text());profiles=json.loads((docs/'prototype-face-profiles.json').read_text())
catalog=json.loads((a/'catalog.json').read_text());reference=catalog['daily-kot-ceket']['layers'];report=[]
for item,key in zip(items,['sponge','squidward','patrick','mrkrabs','sandy']):
    spec=prototypes[key];out=a/item['id'];out.mkdir(exist_ok=True);body=(docs/spec['body']).read_bytes()
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="220" height="260" viewBox="0 0 220 260"><image width="220" height="260" href="data:image/png;base64,'+base64.b64encode(body).decode()+'"/></svg>'
    (out/'body.svg').write_text(svg,encoding='utf8');layers={'body':{'default':'body.svg'}}
    for layer,variants in reference.items():
        if layer=='body':continue
        layers[layer]={}
        for variant,file in variants.items():
            text=(a/'daily-kot-ceket'/file).read_text(encoding='utf8')
            if key in profiles:
                profile=profiles[key];y=profile['mouthY'] if layer=='mouth' else profile['y']
                transform=f'translate({profile["x"]} {y}) scale({profile["scale"]})'
                text=re.sub(r'<g transform="[^"]+"','<g transform="'+transform+'"',text,count=1)
                if layer=='lids':text=text.replace('#c4d8be',profile['skin'])
            (out/file).write_text(text,encoding='utf8');layers[layer][variant]=file
    catalog[item['id']]={'layers':layers};report.append(dict(id=item['id'],source=spec['generated'],sourceSha256=hashlib.sha256((docs/spec['generated']).read_bytes()).hexdigest(),body=spec['body'],faceProfile=profiles.get(key,'unchanged approved denim face transforms'),layers=sum(len(v)for v in layers.values())))
(a/'catalog.json').write_text(json.dumps(catalog,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
(docs/'installed-asset-manifest.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8');print('Installed',len(report),'complete layered costumes')
