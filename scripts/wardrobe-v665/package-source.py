from pathlib import Path
import subprocess
import zipfile
import hashlib
import json
import shutil

root = Path(__file__).resolve().parents[2]
subprocess.run(['node', 'scripts/wardrobe-v665/check-release.js'], cwd=root, check=True)
npm = shutil.which('npm') or shutil.which('npm.cmd')
result = subprocess.run([npm, 'test'], cwd=root, text=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
(root/'docs/6.6.5-test-report.txt').write_text(result.stdout)
if result.returncode:
    raise SystemExit(result.stdout)
for relative in ['src/main/main.js','src/main/wardrobe.js','src/main/motion-rules.js','src/renderer/character/character.js','src/renderer/character/motion-player.js','src/renderer/character/wardrobe-motion.js','src/renderer/character/wardrobe-deform.js','src/renderer/panel/panel.js']:
    subprocess.run(['node','--check',relative],cwd=root,check=True)
p=root/'CHANGELOG-6.6.5.md'
s=p.read_text().replace('# Nero 6.6.5 — çalışma taslağı','# Nero 6.6.5')
s=s.replace('Bu kayıt geliştirme paketine aittir; koleksiyonun tamamlanması ve son paket kontrolü bekleniyor.','Kaynak paketi: mevcut 88 kıyafet korunarak 100 yeni kıyafet eklendi. Beş yeni temanın her birinde 20 kıyafet bulunur. Toplam katalog: 188; kullanıcı tarafından seçilebilir kıyafet: 172.')
s=s.replace('Hedef: her temada 20 yeni çizim.','Her temada 20 yeni çizim bulunur.').replace('Kod testleri ve durağan görsel kontrolleri yapılmaktadır.','273 kod testi geçti; 100 yeni kıyafet toplu durağan önizlemelerde kontrol edildi. Eski görsel dosyalarının aynı kaldığı SHA-256 karşılaştırmasıyla doğrulandı.')
p.write_text(s)
(root/'docs/6.6.5-VALIDATION.md').write_text('''# 6.6.5 doğrulama kaydı

- 88 eski kıyafet + 100 yeni kıyafet; her yeni grupta 20 tasarım.
- Önceki koleksiyonun katalog dışındaki tüm dosyaları SHA-256 ile aynı.
- Katman dosyaları, kapalı göz ve konuşma varyantları mevcut.
- 273 Node testi geçti. Ayrıntılı çıktı: 6.6.5-test-report.txt.
- Beş yeni koleksiyonun durağan önizlemeleri görsel olarak incelendi.
- Bağlı hareket yüzeyinin örnek durağan pozları karşılaştırıldı.
- Canlı Windows/Electron/WebGL görünümü ve kurulum EXE'si bu ortamda test edilmedi. Tarayıcı indirmesi başarısız oldu.
- Kıyafetli kol hareketleri çizim sürekliliği için yaklaşık ±27 dereceyle sınırlandırılır. Eski geniş açılı vektör kol pozları birebir korunmaz.
- Grafik desteği başarısız olursa mevcut gövde kaybolmaz; yüz ve bütün gövde hareketleri devam eder.
''')
excluded={'scripts/wardrobe-v665/integrate.py','scripts/wardrobe-v665/checkpoint.py','docs/6.6.5-WORK-STATUS.md'}
out=root.parent/'Nero-6.6.5-source.zip'
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for p in sorted(root.rglob('*')):
        if not p.is_file(): continue
        rel=p.relative_to(root)
        if rel.as_posix() in excluded or '__pycache__' in rel.parts or p.suffix in ['.zip','.gz','.pyc']: continue
        if rel.parts[0] in ['src','themes','build','docs','test','scripts','.github'] or (len(rel.parts)==1 and p.suffix in ['.json','.md']):
            archive.write(p,Path('Nero-6.6.5-source')/rel)
with zipfile.ZipFile(out) as archive:
    assert archive.testzip() is None
    print('Files:',len(archive.namelist()))
print('Path:',out)
print('Bytes:',out.stat().st_size)
print('SHA256:',hashlib.sha256(out.read_bytes()).hexdigest())
print(result.stdout[-400:])
