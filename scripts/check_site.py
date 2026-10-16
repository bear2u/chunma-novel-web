"""Validate deployable files without requiring private DOCX manuscripts."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import zipfile
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / 'dist'

class Page(HTMLParser):
    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key not in ('href', 'src') or not value:
                continue
            parsed = urlsplit(value)
            if parsed.scheme or parsed.netloc or not parsed.path:
                continue
            target = (SITE / unquote(parsed.path)).resolve()
            assert target.is_relative_to(SITE.resolve()), f'Outside site: {value}'
            assert target.is_file(), f'Missing resource: {value}'

assert (SITE / 'index.html').is_file()
chapters = sorted(SITE.glob('chapter-*.html'))
assert len(chapters) == 25, f'Expected 25 chapters, found {len(chapters)}'
for page in SITE.glob('*.html'):
    Page().feed(page.read_text(encoding='utf-8'))
for path in SITE.rglob('*'):
    assert path.suffix.lower() not in ('.doc', '.docx'), f'Private manuscript: {path}'
with zipfile.ZipFile(SITE / 'cheonma-vol-1.epub') as archive:
    assert archive.read('mimetype') == b'application/epub+zip'
    assert archive.infolist()[0].compress_type == zipfile.ZIP_STORED
    for name in archive.namelist():
        if name.endswith(('.xml', '.opf', '.xhtml')):
            ET.fromstring(archive.read(name))
print('PASS: 25 chapters, local links, EPUB XML, no DOC/DOCX in published site.')
