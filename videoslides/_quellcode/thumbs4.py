import json
from PIL import Image,ImageDraw,ImageFont,ImageFilter
SP='/tmp/claude-0/-home-user-claudecloud/e6fd89b8-16f1-562a-9866-3e9dc57faca6/scratchpad/'
OUTD='/home/user/claudecloud/videoslides/'
bg0=Image.open('/tmp/claude-0/-home-user-claudecloud/e6fd89b8-16f1-562a-9866-3e9dc57faca6/images/10.png').convert('RGBA').resize((1280,720))
p=Image.open(OUTD+'figur-freigestellt.png').convert('RGBA')
sc=720/(p.height*0.78);pw,ph=int(p.width*sc),int(p.height*sc);px_,py_=-int(pw*0.10),18
p2=p.resize((pw,ph),Image.LANCZOS)
FONT='/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf';FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
DARK=(18,48,26,255);NEON=(177,255,55,255);CARD=(251,255,244,255);GREEN=(38,114,10,255);LINEC=(184,217,138,255)
bg=bg0.copy()
sh=Image.new('RGBA',bg.size,(0,0,0,0));sh.paste(Image.new('RGBA',p2.size,(18,48,26,150)),(px_+10,py_+10),p2.split()[3])
bg=Image.alpha_composite(bg,sh.filter(ImageFilter.GaussianBlur(14)));bg.alpha_composite(p2,(px_,py_))
d=ImageDraw.Draw(bg)
lines=['PRIMÄR &','FREMD-','SCHLÜSSEL'];tag='Datenbanken · Teil 3'
size=140
while True:
    F=ImageFont.truetype(FONT,size)
    if max(d.textlength(t,font=F) for t in lines)<=640:break
    size-=2
LH=int(size*1.13);X=605;Y=(720-3*LH)//2+6
spec=dict(size=size,LH=LH,X=X,Y=Y,lines=lines,fig=[px_,py_,pw,ph],tag=tag)
TF=ImageFont.truetype(FB,26);tw=d.textlength(tag,font=TF)
d.rounded_rectangle((X,46,X+tw+44,98),radius=14,fill=NEON);d.text((X+22,54),tag,font=TF,fill=DARK);spec['tagbox']=[X,46,int(tw+44),52]
for i,t in enumerate(lines):
    yy=Y+i*LH
    if i==2:
        w=d.textlength(t,font=F);d.rounded_rectangle((X-16,yy+int(size*0.10),X+w+16,yy+LH-int(size*0.02)),radius=18,fill=NEON)
        spec['bar']=[X-16,yy+int(size*0.10),int(w+32),LH-int(size*0.12)]
    d.text((X,yy),t,font=F,fill=DARK)
# key chips
CF=ImageFont.truetype(FB,28);y=Y+3*LH+14;x=X;chips=[]
for t,kc in [('Primär',NEON),('Fremd',(95,200,60,255))]:
    w=d.textlength(t,font=CF)+96;d.rounded_rectangle((x,y,x+w,y+54),radius=14,fill=DARK)
    kx,ky=x+14,y+27
    d.ellipse((kx,ky-10,kx+20,ky+10),fill=kc);d.rectangle((kx+20,ky-2,kx+46,ky+2),fill=kc);d.rectangle((kx+36,ky,kx+40,ky+10),fill=kc);d.rectangle((kx+44,ky,kx+48,ky+8),fill=kc)
    d.text((x+68,y+9),t,font=CF,fill=NEON)
    chips.append(dict(t=t,x=x,y=y,w=int(w),h=54,k=kc[:3]));x+=w+14
spec['chips']=chips
# mini table top right: Ausleihe
AX,AY=948,34;cw=[70,110,120];rh=36
rows=[['ID','Buch','Schüler'],['1','3','1'],['2','1','1']];HF=ImageFont.truetype(FB,20);cells=[]
for ri,r in enumerate(rows):
    cx=AX
    for ci,tx in enumerate(r):
        x0,y0,x1,y1=cx,AY+ri*rh,cx+cw[ci],AY+(ri+1)*rh
        fill=DARK if ri==0 else (NEON if ci==2 else CARD)
        if ri==0 and ci==2:fill=GREEN
        d.rectangle((x0,y0,x1,y1),fill=fill,outline=LINEC,width=2)
        col=NEON if ri==0 else DARK;tw_=d.textlength(tx,font=HF);d.text((x0+(cw[ci]-tw_)/2,y0+6),tx,font=HF,fill=col)
        cells.append(dict(t=tx,x=x0,y=y0,w=cw[ci],h=rh,fill=('0F' if False else '%02X%02X%02X'%tuple(fill[:3])),hdr=ri==0));cx+=cw[ci]
spec['table']=cells
bg.convert('RGB').save(OUTD+'cleverbox-thumbnail-schluessel.png')
json.dump(spec,open(SP+'spec_sk.json','w'));print('ok')
