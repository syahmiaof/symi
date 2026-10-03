"""Build-time masks from the supplied original photography; no runtime imaging dependencies.
Requires Pillow, numpy and OpenCV. Original files are never modified.
"""
from pathlib import Path
import json
import cv2
import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/images/symi'
OUT.mkdir(parents=True, exist_ok=True)

def extract(number, name, points, crop, refine=True):
    im = Image.open(ROOT / f'{number}.png').convert('RGB')
    a = np.array(im)
    polygon = np.zeros(a.shape[:2], np.uint8)
    cv2.fillPoly(polygon, [np.array(points, np.int32)], 255)
    if refine:
        mask = np.zeros(a.shape[:2], np.uint8)
        outer = cv2.dilate(polygon, np.ones((15,15), np.uint8))
        inner = cv2.erode(polygon, np.ones((19,19), np.uint8))
        mask[outer > 0] = cv2.GC_PR_BGD
        mask[polygon > 0] = cv2.GC_PR_FGD
        mask[inner > 0] = cv2.GC_FGD
        cv2.grabCut(cv2.cvtColor(a,cv2.COLOR_RGB2BGR),mask,None,np.zeros((1,65)),np.zeros((1,65)),3,cv2.GC_INIT_WITH_MASK)
        alpha = np.where((mask==1)|(mask==3),255,0).astype('uint8')
    else:
        alpha = polygon
    result=im.convert('RGBA')
    result.putalpha(Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(.55)))
    result=result.crop(crop)
    result.save(OUT/f'{name}.webp',quality=92,method=6)
    return result

kiwi=[(558,373),(582,377),(604,401),(628,445),(651,469),(669,513),(686,538),(716,551),(723,580),(735,602),(742,626),(755,651),(766,688),(783,716),(805,708),(823,745),(829,787),(818,817),(831,822),(832,838),(812,849),(772,1175),(704,1190),(551,1197),(450,1191),(375,1173),(334,844),(320,838),(320,820),(340,815),(311,802),(328,768),(347,721),(353,674),(376,615),(399,578),(433,591),(443,557),(446,533),(470,537),(481,509),(506,508),(511,470),(531,459),(549,417),(559,389)]
full=extract(2,'kiwi-cup',kiwi,(280,350,860,1220))
swirl=full.copy(); alpha=swirl.getchannel('A'); aa=np.array(alpha); aa[478:]=0; swirl.putalpha(Image.fromarray(aa)); swirl.save(OUT/'kiwi-swirl.webp',quality=92,method=6)
cup=full.copy(); aa=np.array(cup.getchannel('A')); aa[:475]=0; cup.putalpha(Image.fromarray(aa)); cup.save(OUT/'kiwi-vessel.webp',quality=92,method=6)
extract(3,'mango-cup',[(553,280),(579,279),(610,306),(638,364),(659,363),(682,421),(693,438),(718,445),(723,476),(736,497),(757,535),(758,562),(782,572),(793,610),(810,649),(802,670),(826,676),(839,718),(847,751),(835,772),(850,778),(850,788),(833,797),(783,1149),(750,1168),(644,1178),(468,1178),(387,1170),(340,1146),(296,794),(278,787),(279,773),(297,768),(272,741),(289,699),(307,674),(329,681),(347,653),(325,640),(337,576),(373,573),(378,549),(402,536),(399,490),(418,458),(450,447),(448,413),(485,406),(491,379),(522,387),(545,335),(558,301)],(245,250,880,1190))
extract(4,'berry-cup',[(532,266),(528,249),(541,232),(559,229),(584,240),(614,270),(637,310),(669,351),(693,401),(719,410),(750,438),(781,459),(790,499),(802,543),(789,564),(821,567),(834,599),(863,604),(889,620),(901,651),(893,681),(874,697),(892,728),(899,761),(884,799),(859,825),(811,1129),(790,1164),(732,1194),(647,1211),(533,1216),(439,1203),(367,1179),(340,1147),(283,825),(262,803),(249,768),(241,735),(233,704),(232,661),(244,619),(252,593),(284,576),(287,550),(310,536),(346,538),(360,503),(385,452),(408,430),(414,402),(448,398),(471,374),(496,368),(498,342),(520,317),(537,289),(543,257)],(210,205,920,1240))
extract(5,'choco-cup',[(652,278),(656,264),(674,262),(694,274),(711,298),(737,354),(754,382),(777,418),(786,457),(812,470),(820,501),(851,514),(862,544),(877,556),(868,589),(882,612),(907,611),(918,637),(910,659),(943,666),(952,695),(972,720),(971,756),(964,783),(979,791),(980,805),(960,818),(908,1180),(877,1206),(765,1223),(555,1229),(441,1211),(405,1187),(346,818),(326,809),(327,791),(342,784),(332,757),(341,727),(352,711),(356,686),(379,675),(367,645),(408,608),(441,584),(442,548),(467,534),(466,507),(479,481),(507,471),(516,433),(541,425),(558,438),(568,407),(587,380),(591,358),(617,325),(642,301)],(300,235,1005,1245))
extract(2,'kiwi-slice',[(16,1058),(35,1023),(72,997),(116,980),(168,984),(214,1002),(253,1038),(275,1082),(280,1124),(263,1153),(225,1173),(174,1178),(121,1165),(73,1140),(37,1105)],(7,969,290,1188),False)
extract(2,'granola',[(349,1196),(359,1182),(354,1170),(367,1169),(377,1156),(389,1166),(408,1159),(419,1173),(443,1176),(442,1192),(460,1204),(464,1220),(450,1230),(429,1224),(414,1229),(396,1220),(377,1225),(361,1212)],(340,1145,475,1240))
extract(3,'mango-piece',[(268,1120),(366,1106),(385,1185),(300,1190),(266,1171)],(255,1095,395,1200),False)
extract(4,'berry-piece',[(222,1218),(237,1179),(264,1151),(293,1150),(324,1169),(351,1204),(355,1240),(333,1255),(280,1253),(241,1241)],(210,1135,365,1270))
photos={1:'staff-serve',6:'staff-machine',7:'flavors-flatlay',8:'handheld',15:'store-lifestyle'}
manifest=[]
for n,name in photos.items():
    src=ROOT/f'{n}.{ "jpg" if n>=14 else "png"}'
    im=Image.open(src); im.thumbnail((1600,1600)); im.save(OUT/f'{name}.webp',quality=85,method=6)
    manifest.append({'original':src.name,'production':f'{name}.webp','size':list(im.size),'role':'production photograph'})
for n in range(9,14): manifest.append({'original':f'{n}.png','role':'reference only; never deployed'})
for n,name in [(2,'kiwi'),(3,'mango'),(4,'berry'),(5,'choco')]: manifest.append({'original':f'{n}.png','role':f'extracted {name} cup and ingredient layers only'})
manifest.append({'original':'16.jpg','role':'service photograph inspected; alternate to asset 6, not duplicated in production'})
manifest.append({'original':'14.jpg','role':'launch artwork inspected; not shipped because its opening copy differs from Launching 2027'})
(ROOT/'data').mkdir(exist_ok=True)
(ROOT/'data/assets.json').write_text(json.dumps(manifest,indent=2)+'\n')
print('Prepared',len(list(OUT.glob('*.webp'))),'optimized production assets.')
