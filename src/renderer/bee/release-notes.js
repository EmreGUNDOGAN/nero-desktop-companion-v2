// Sürüm yenilikleri yalnızca GitHub Releases sayfasındaki yayımlanmış sürümlerden gelir.
// Bu dosyada statik sürüm listesi tutulmaz; böylece release olmayan geliştirme sürümleri oyunda görünmez.

export const RELEASES_PAGE_URL = 'https://github.com/EmreGUNDOGAN/nero-desktop-companion-v2/releases';

export function normalizeReleaseVersion(release) {
  const raw = String(release?.tag_name || release?.name || '');
  const match = raw.match(/\d+\.\d+\.\d+/);
  return match ? match[0] : null;
}

function plain(text) {
  return String(text || '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`>#]/g, '')
    .replace(/^[-+•]\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function clip(text, max = 330) {
  const clean = plain(text);
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + '…';
}

function iconFor(title) {
  const s = String(title || '').toLocaleLowerCase('tr');
  if (/düzelt|fix|hata|kararl/.test(s)) return '🛠️';
  if (/arı|kovan|bal|çiftlik/.test(s)) return '🐝';
  if (/köy|yerleş|ev/.test(s)) return '🏡';
  if (/görsel|tema|arayüz|tasarım/.test(s)) return '🎨';
  if (/ses|müzik/.test(s)) return '🔊';
  if (/yeni|özellik|eklen/.test(s)) return '✨';
  return '📝';
}

function releaseSections(body) {
  const lines = String(body || '').replace(/\r\n?/g, '\n').split('\n');
  const sections = [];
  let current = null;
  for (const raw of lines) {
    const line = raw.trim();
    const h = line.match(/^#{2,3}\s+(.+)$/);
    if (h) {
      if (current && current.lines.length) sections.push(current);
      current = { title: plain(h[1]), lines: [] };
      continue;
    }
    if (current && line && !/^#\s+/.test(line) && !/^\*\*[^*]+\*\*$/.test(line)) current.lines.push(line);
  }
  if (current && current.lines.length) sections.push(current);
  return sections;
}

export function releaseToNote(release) {
  const version = normalizeReleaseVersion(release);
  if (!version) return null;
  const body = String(release?.body || '');
  const lines = body.replace(/\r\n?/g, '\n').split('\n').map((x) => x.trim()).filter(Boolean);
  const boldLead = lines.find((x) => /^\*\*.+\*\*$/.test(x));
  const title = clip(boldLead ? boldLead.replace(/^\*\*|\*\*$/g, '') : (release?.name || `Nero ${version}`), 120);

  let items = releaseSections(body)
    .filter((s) => s.title && s.lines.length)
    .slice(0, 6)
    .map((s) => ({ icon: iconFor(s.title), title: clip(s.title, 90), text: clip(s.lines.join(' ')) }));

  if (!items.length) {
    const paragraphs = body.replace(/\r\n?/g, '\n').split(/\n\s*\n/)
      .map((p) => clip(p))
      .filter((p) => p && !/^Nero\s+\d+\.\d+\.\d+$/i.test(p))
      .slice(0, 5);
    items = paragraphs.map((text, i) => ({ icon: i === 0 ? '✨' : '📝', title: i === 0 ? 'Sürüm özeti' : 'Detay', text }));
  }

  return {
    version,
    title: title || `Nero ${version}`,
    items,
    releaseUrl: String(release?.html_url || '')
  };
}
