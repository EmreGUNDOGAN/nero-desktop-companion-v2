"""OFL derivative: preserve Latin outlines and add matching Turkish accents."""
from pathlib import Path
import sys,copy,json,hashlib
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root/'.font-tools'))
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib.tables._g_l_y_f import Glyph
from fontTools.ttLib.tables._g_l_y_f import GlyphCoordinates
source=root/'src/renderer/fonts/reference-lilita-one.ttf';f=TTFont(source);glyf=f['glyf'];cmap=f.getBestCmap();order=f.getGlyphOrder()
def add(name,glyph,metric):
    glyf[name]=glyph;f['hmtx'].metrics[name]=metric
    if name not in order:order.append(name)
def bounds(name):
    glyf[name].recalcBounds(glyf);g=glyf[name];return g.xMin,g.yMin,g.xMax,g.yMax
# The original i dot is retained, rather than borrowing a different font.
base=glyf[cmap[ord('i')]];coords,ends,flags=base.getCoordinates(glyf);start=0;contours=[]
for end in ends:
    points=coords[start:end+1]
    if min(y for x,y in points)>bounds(cmap[ord('x')])[3]:contours.append((points,list(flags[start:end+1])))
    start=end+1
assert contours,'original i dot contour missing'
dot=Glyph();dot.numberOfContours=len(contours);dot.coordinates=GlyphCoordinates();dot.flags=[];dot.endPtsOfContours=[]
from array import array
for points,fl in contours:
    dot.coordinates.extend(points);dot.flags.extend(fl);dot.endPtsOfContours.append(len(dot.coordinates)-1)
dot.flags=array('B',dot.flags);dot.program=copy.deepcopy(base.program);add('neroDotAbove',dot,(300,0))
pen=TTGlyphPen(None);pen.moveTo((-135,120));pen.qCurveTo((-100,0),(0,0));pen.qCurveTo((100,0),(135,120));pen.lineTo((70,120));pen.qCurveTo((45,60),(0,60));pen.qCurveTo((-45,60),(-70,120));pen.closePath();add('neroBreve',pen.glyph(),(300,0))
for code,name,base_name,accent in [(0x130,'NeroIdot','I','neroDotAbove'),(0x15f,'NeroScedilla','s','cedilla'),(0x15e,'NeroSCedilla','S','cedilla'),(0x11f,'NeroGbreve','g','neroBreve'),(0x11e,'NeroGBreve','G','neroBreve')]:
    b=cmap[ord(base_name)];bx0,by0,bx1,by1=bounds(b);ax0,ay0,ax1,ay1=bounds(accent);dx=round((bx0+bx1-ax0-ax1)/2);dy=round(by1+32-ay0) if accent!='cedilla' else 0
    pen=TTGlyphPen(f.getGlyphSet());pen.addComponent(b,(1,0,0,1,0,0));pen.addComponent(accent,(1,0,0,1,dx,dy));add(name,pen.glyph(),f['hmtx'].metrics[b])
    for table in f['cmap'].tables:
        if table.isUnicode():table.cmap[code]=name
f.setGlyphOrder(order)
for n in f['name'].names:
    if n.nameID in [1,4,6,16]:
        value='NeroSpongeTR-Regular' if n.nameID==6 else 'Nero Sponge TR'
        n.string=value.encode(n.getEncoding())
if 'DSIG' in f:del f['DSIG']
dest=root/'src/renderer/fonts/reference-sponge-tr.ttf';f.save(dest)
check=TTFont(dest);assert all(code in check.getBestCmap() for code in [0x130,0x131,0x15f,0x15e,0x11f,0x11e,0xe7,0xc7,0xf6,0xd6,0xfc,0xdc])
(root/'docs/reference-rebuild/bikini-bottom/font-modifications.json').write_text(json.dumps({'source':str(source.relative_to(root)),'sourceSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'output':str(dest.relative_to(root)),'family':'Nero Sponge TR','license':'OFL-1.1; original OFL-LilitaOne.txt retained','addedCodepoints':['U+0130','U+015E','U+015F','U+011E','U+011F'],'latinOutlines':'unchanged'},indent=2),encoding='utf-8')
print('Turkish glyph coverage verified; original Latin outlines retained')
