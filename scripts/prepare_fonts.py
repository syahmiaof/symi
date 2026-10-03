from pathlib import Path
from urllib.request import urlopen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools import subset
root=Path(__file__).resolve().parents[1]
out=root/'app/fonts';out.mkdir(exist_ok=True)
source=root/'.work/Manrope.ttf'
source.write_bytes(urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/Manrope%5Bwght%5D.ttf').read())
(out/'OFL.txt').write_bytes(urlopen('https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt').read())
for weight in [400,500,600,800]:
 font=instantiateVariableFont(TTFont(source),{'wght':weight},inplace=True)
 options=subset.Options();options.flavor='woff2';options.name_IDs=['*']
 sub=subset.Subsetter(options=options);sub.populate(unicodes=list(range(0x20,0x100))+list(range(0x2000,0x2070)))
 sub.subset(font);font.flavor='woff2';font.save(out/f'manrope-{weight}.woff2')
 print(weight,(out/f'manrope-{weight}.woff2').stat().st_size)
