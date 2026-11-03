import json
from PIL import Image,ImageDraw,ImageFont,ImageFilter
SP='/tmp/claude-0/-home-user-claudecloud/e6fd89b8-16f1-562a-9866-3e9dc57faca6/scratchpad/'
OUTD='/home/user/claudecloud/videoslides/'
FONT='/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf';FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf';FR='/usr/share/fonts/opentype/inter/Inter-Regular.otf'
DARK=(18,48,26,255);NEON=(177,255,55,255);CARD=(251,255,244,255);GREEN=(38,114,10,255);LINEC=(184,217,138,255);CHIP=(221,243,184,255)
top=(208,224,188);mid=(232,246,210);bot=(125,172,86)
bg=Image.new('RGB',(1280,720));bd=ImageDraw.Draw(bg)
for y in range(720):
    t=y/719
    c=tuple(int(top[i]+(mid[i]-top[i])*t/0.45) for i in range(3)) if t<0.45 else tuple(int(mid[i]+(bot[i]-mid[i])*(t-0.45)/0.55) for i in range(3))
    bd.line((0,y,1280,y),fill=c)
bg=bg.convert('RGBA')
words=[('=SUMME(A1:A9)',0,10),('Tabelle',690,5),('WENN',1090,40),('Zelle',30,200),('=A1+B1',660,190),('Diagramm',1000,250),('SVERWEIS',10,410),('Filter',700,400),('Formel',1060,440),('=MITTELWERT',0,600),('Spalte',690,590),('Zeile',1040,640)]
lay=Image.new('RGBA',bg.size,(0,0,0,0));ld=ImageDraw.Draw(lay);WF=ImageFont.truetype(FONT,60)
for t,x,y in words: ld.text((x,y),t,font=WF,fill=(38,114,10,60))
bg=Image.alpha_composite(bg,lay.filter(ImageFilter.GaussianBlur(7)))
bg.convert('RGB').save(SP+'bg-excel.png')
d=ImageDraw.Draw(bg)
lines=['EXCEL','GRUNDKURS'];tag='Für Einsteiger'
size=150
while True:
    F=ImageFont.truetype(FONT,size)
    if max(d.textlength(t,font=F) for t in lines)<=560:break
    size-=2
LH=int(size*1.15);X=60;Y=170
spec=dict(size=size,LH=LH,X=X,Y=Y,lines=lines,tag=tag)
TF=ImageFont.truetype(FB,28);tw=d.textlength(tag,font=TF)
d.rounded_rectangle((X,70,X+tw+44,126),radius=14,fill=NEON);d.text((X+22,79),tag,font=TF,fill=DARK);spec['tagbox']=[X,70,int(tw+44),56]
for i,t in enumerate(lines):
    yy=Y+i*LH
    if i==1:
        w=d.textlength(t,font=F);d.rounded_rectangle((X-16,yy+int(size*0.10),X+w+16,yy+LH-int(size*0.02)),radius=18,fill=NEON)
        spec['bar']=[X-16,yy+int(size*0.10),int(w+32),LH-int(size*0.12)]
    d.text((X,yy),t,font=F,fill=DARK)
CF=ImageFont.truetype(FB,28);x=X;y=Y+2*LH+34;extras=[]
for t in ['Zellen','Formeln','Diagramme']:
    w=d.textlength(t,font=CF)+32;d.rounded_rectangle((x,y,x+w,y+52),radius=14,fill=DARK);d.text((x+16,y+9),t,font=CF,fill=NEON);extras.append(dict(t=t,x=x,y=y,w=int(w),h=52));x+=w+12
spec['extras']=extras
# spreadsheet window
WX,WY,WW,WH=690,70,540,580
sh=Image.new('RGBA',bg.size,(0,0,0,0));ImageDraw.Draw(sh).rounded_rectangle((WX+8,WY+10,WX+WW+8,WY+WH+10),radius=22,fill=(18,48,26,110))
bg=Image.alpha_composite(bg,sh.filter(ImageFilter.GaussianBlur(14)));d=ImageDraw.Draw(bg)
d.rounded_rectangle((WX,WY,WX+WW,WY+WH),radius=20,fill=CARD,outline=LINEC,width=3)
d.rounded_rectangle((WX,WY,WX+WW,WY+64),radius=20,fill=DARK);d.rectangle((WX,WY+40,WX+WW,WY+64),fill=DARK)
for k,cx in enumerate((26,52,78)):d.ellipse((WX+cx-8,WY+24,WX+cx+8,WY+40),fill=[NEON,(95,200,60,255),LINEC][k])
d.text((WX+110,WY+17),'Mappe1.xlsx',font=ImageFont.truetype(FB,24),fill=NEON)
# formula bar
FY=WY+78;d.rounded_rectangle((WX+20,FY,WX+WW-20,FY+48),radius=10,fill=CHIP)
d.text((WX+34,FY+10),'fx',font=ImageFont.truetype(FB,24),fill=GREEN);d.text((WX+80,FY+10),'=SUMME(B2:B4)',font=ImageFont.truetype(FB,24),fill=DARK)
# grid
GX,GY=WX+20,FY+66;cw=[70,150,150,130];rh=62
cols=['','A','B','C'];data=[['','Artikel','Preis','Menge'],['2','Heft','2,50','4'],['3','Stift','1,20','10'],['4','Block','3,80','2'],['5','Summe','=SUMME()','16'],]
HF=ImageFont.truetype(FB,26);cells=[]
for ri in range(6):
    cx=GX
    for ci in range(4):
        x0,y0,x1,y1=cx,GY+ri*rh,cx+cw[ci],GY+(ri+1)*rh
        if ri==0:fill=DARK;txt=cols[ci];col=NEON
        else:
            r=data[ri-1] if ri<=4 else None
            txt=(['1','Artikel','Preis','Menge'] if ri==1 else [str(ri),*data[ri-1][1:]])[ci] if ri<=5 else ''
            fill=CHIP if ci==0 else CARD;col=DARK
        if ri==5 and ci==2:fill=NEON;txt='7,50 €'
        if ri==1 and ci>0:fill=(221,243,184,255);txt=['','Artikel','Preis','Menge'][ci]
        d.rectangle((x0,y0,x1,y1),fill=fill,outline=LINEC,width=2)
        if ri==5 and ci==2:d.rectangle((x0,y0,x1,y1),outline=GREEN,width=5)
        tw_=d.textlength(txt,font=HF);d.text((x0+(cw[ci]-tw_)/2 if ci in (0,3) else x0+14,y0+16),txt,font=HF,fill=col)
        cells.append(dict(t=txt,x=x0,y=y0,w=cw[ci],h=rh,fill='%02X%02X%02X'%tuple(fill[:3]),col='%02X%02X%02X'%tuple(col[:3]),hdr=ri==0,sel=(ri==5 and ci==2)));cx=x1
spec['grid']=cells;spec['win']=[WX,WY,WW,WH]
# Sigma bubble
bx,by=WX-95,WY+WH-120
d.ellipse((bx,by,bx+120,by+120),fill=NEON,outline=DARK,width=5);d.text((bx+60,by+58),'Σ',font=ImageFont.truetype(FONT,86),fill=DARK,anchor='mm')
spec['sigma']=[bx,by,120]
bg.convert('RGB').save(OUTD+'cleverbox-thumbnail-excel.png')
json.dump(spec,open(SP+'spec_ex.json','w'));print('ok',size)
