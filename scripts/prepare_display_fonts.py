"""Instance Bodoni Moda weights for consistent Chromium/WebKit rendering."""
from pathlib import Path
from urllib.request import urlopen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset

root = Path(__file__).resolve().parents[1]
out = root / 'app/fonts'
cache = root / '.work/fonts'
cache.mkdir(parents=True, exist_ok=True)
base = 'https://raw.githubusercontent.com/google/fonts/main/ofl/bodonimoda/'
(out / 'Bodoni-OFL.txt').write_bytes(urlopen(base + 'OFL.txt').read())
for style, name, weights in [
    ('normal', 'BodoniModa%5Bopsz,wght%5D.ttf', [400, 700, 900]),
    ('italic', 'BodoniModa-Italic%5Bopsz,wght%5D.ttf', [400]),
]:
    source = cache / f'bodoni-{style}.ttf'
    source.write_bytes(urlopen(base + name).read())
    for weight in weights:
        font = instantiateVariableFont(TTFont(source), {'wght': weight, 'opsz': 11}, inplace=True)
        options = subset.Options()
        options.flavor = 'woff2'
        options.name_IDs = ['*']
        subsetter = subset.Subsetter(options=options)
        subsetter.populate(unicodes=list(range(0x20, 0x100)) + list(range(0x2000, 0x2070)))
        subsetter.subset(font)
        font.flavor = 'woff2'
        destination = out / f'bodoni-{weight}-{style}.woff2'
        font.save(destination)
        print(destination.name, destination.stat().st_size)
