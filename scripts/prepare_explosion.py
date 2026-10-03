"""Partition the approved alpha photograph into independently animated, lossless-position layers.
Every visible source pixel belongs to one layer; recomposition preserves the approved keyframe.
Requires Pillow, NumPy and OpenCV only at asset-preparation time.
"""
from pathlib import Path
import json
import cv2
import numpy as np
from PIL import Image
root=Path(__file__).resolve().parents[1]
im=Image.open(root/'public/images/symi/exploded-kiwi.webp').convert('RGBA')
a=np.array(im);h,w=a.shape[:2];remaining=a[:,:,3]>0
out=root/'public/images/symi/explosion';out.mkdir(exist_ok=True)
parts=[]
def save(name,kind,mask):
 global remaining
 mask=mask&remaining
 if not mask.any():return
 remaining[mask]=False
 yy,xx=np.where(mask);box=(int(xx.min()),int(yy.min()),int(xx.max()+1),int(yy.max()+1))
 pixels=a.copy();pixels[:,:,3]=np.where(mask,a[:,:,3],0)
 image=Image.fromarray(pixels).crop(box);image.save(out/f'{name}.webp',quality=94,method=6)
 x,y,r,b=box
 parts.append(dict(id=name,kind=kind,x=x/w*100,y=y/h*100,width=(r-x)/w*100,height=(b-y)/h*100,pixelWidth=r-x,pixelHeight=b-y))
def polygon(name,kind,points):
 mask=np.zeros((h,w),np.uint8);cv2.fillPoly(mask,[np.array(points,np.int32)],1);save(name,kind,mask.astype(bool))
# Separate disconnected floating fruit/leaves/granola first, including their alpha edges.
n,labels,stats,centroids=cv2.connectedComponentsWithStats((a[:,:,3]>80).astype('uint8'),8)
main=1+np.argmax(stats[1:,4])
for i,stat in enumerate(stats):
 if i==0 or i==main or stat[4]<220:continue
 x,y,pw,ph,area=map(int,stat)
 kind='kiwi' if 710<x<810 and y<100 else 'leaf' if (x<70 and 280<y<380) or (x>800 and 420<y<540) or (500<x<650 and y<80) else 'granola' if area>1800 else 'droplet'
 save(f'{kind}-{i}',kind,cv2.dilate((labels==i).astype('uint8'),np.ones((9,9),np.uint8)).astype(bool))
# Split attached fruit along the source silhouettes. Coordinates are in the source photograph.
polygon('kiwi-left','kiwi',[(90,444),(143,440),(213,478),(285,532),(357,574),(347,616),(302,650),(228,670),(160,652),(108,607),(90,540)])
polygon('kiwi-right','kiwi',[(722,606),(752,612),(806,651),(866,709),(925,754),(929,793),(875,819),(797,814),(733,773),(703,712),(702,653)])
polygon('sauce-upper','sauce',[(555,129),(609,122),(678,143),(718,189),(719,245),(690,291),(641,334),(607,316),(640,270),(660,216),(639,177),(584,169),(556,183)])
polygon('sauce-right','sauce',[(831,690),(868,682),(909,644),(932,583),(965,576),(975,613),(955,648),(946,708),(920,749),(967,761),(994,783),(990,821),(945,812),(906,781),(853,749)])
polygon('cup','cup',[(0,676),(405,676),(466,675),(548,685),(638,730),(701,775),(762,811),(826,866),(829,957),(870,1176),(753,1320),(619,1365),(259,1370),(0,1080)])
# Retain residual lower particles separately so yogurt transforms around its own silhouette.
polygon('dust-lower','granola',[(0,940),(994,940),(994,1454),(0,1454)])
# Remaining pixels form the yogurt/sauce core. Keep all pixels.
save('yogurt','yogurt',remaining.copy())
(root/'data/explosion-layers.json').write_text(json.dumps(parts,indent=2)+'\n')
print(f'{len(parts)} photographic layers; complete alpha partition; {sum(p.stat().st_size for p in out.glob("*.webp")):,} bytes')
