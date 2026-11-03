import json
from PIL import Image,ImageDraw,ImageFont
OUTD='/home/user/claudecloud/videoslides/'
FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf';FR='/usr/share/fonts/opentype/inter/Inter-Regular.otf'
BG='ECEEF8';CARD='FAFAFA';WHITE='FFFFFF';DARK='36448A';MAIN='475BA6';LINE='D3D8EE';CYAN='60C0F0';TXT='333333';HEAD2='E3E7F6';TINT='E3F4FD'
hx=lambda h:tuple(int(h[i:i+2],16) for i in (0,2,4))
cols=['','A','B','C','D','E','F','G','H'];cw=[70,290,170,170,170,170,170,170,285]
rows=[['1','Haushaltsplaner'],
 ['2','Kosten','Jänner','Februar','März','April','Mai','Juni','Gesamtsumme'],
 ['3','Miete']+['700 €']*6,['4','Internet']+['35 €']*6,
 ['5','Lebensmittel','350 €','370 €','320 €','390 €','340 €','360 €'],
 ['6','Versicherung']+['75 €']*6,
 ['7','Benzin','110 €','130 €','125 €','95 €','150 €','145 €'],['8','Gesamtsumme']]
RH=92;TX=125;TY=126;CX=TX-35;CY=TY-30;W=sum(cw);H=RH*9
cells=[]
x=TX
for c,w in zip(cols,cw):
    cells.append(dict(r=0,c=cols.index(c),x=x,y=TY,w=w,h=RH,t=c,fill=DARK,col=CYAN,bold=True));x+=w
for ri,row in enumerate(rows,1):
    x=TX;y=TY+ri*RH
    for ci,w in enumerate(cw):
        t=row[ci] if ci<len(row) else ''
        if ri==1 and ci in (2,3):  # verbunden A1:C1
            x+=w;continue
        if ri==1 and ci==1:cw_=sum(cw[1:4])
        else:cw_=w
        if ci==0:fill,col,bold=LINE,DARK,True
        elif ri==2:fill,col,bold=HEAD2,DARK,True
        elif ci==1 and ri>2:fill,col,bold=WHITE,TXT,True
        elif (ci==8 and 3<=ri<=7) or (ri==8 and ci>=2):fill,col,bold=TINT,TXT,False
        else:fill,col,bold=WHITE,TXT,False
        if ri==8 and ci==1:fill,col,bold=HEAD2,DARK,True
        if ri==1 and ci==1:fill,col,bold=WHITE,DARK,True
        cells.append(dict(r=ri,c=ci,x=x,y=y,w=cw_,h=RH,t=t,fill=fill,col=col,bold=bold,size=(48 if (ri==1 and ci==1) else 32)));x+=w
spec=dict(cells=cells,card=[CX,CY,W+70,H+60],cw=cw,TX=TX,TY=TY,RH=RH)
json.dump(spec,open('tab.json','w'))
im=Image.new('RGB',(1920,1080),hx(BG));d=ImageDraw.Draw(im)
d.rounded_rectangle((CX,CY,CX+W+70,CY+H+60),radius=26,fill=hx(CARD),outline=hx(LINE),width=3)
for c in cells:
    d.rectangle((c['x'],c['y'],c['x']+c['w'],c['y']+c['h']),fill=hx(c['fill']),outline=hx(LINE),width=2)
    if c['t']:
        d.text((c['x']+22,c['y']+c['h']/2),c['t'],font=ImageFont.truetype(FB if c['bold'] else FR,c.get('size',32)),fill=hx(c['col']),anchor='lm')
im.save(OUTD+'excel-haushaltsplaner-tabelle.png');print('ok')
