import json
from PIL import Image,ImageDraw,ImageFont,ImageFilter
SP='/tmp/claude-0/-home-user-claudecloud/e6fd89b8-16f1-562a-9866-3e9dc57faca6/scratchpad/'
OUTD='/home/user/claudecloud/videoslides/'
FONT='/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf';FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
DARK=(61,22,54,255);MARK=(245,138,210,255);CARD=(251,241,248,255);LINEC=(211,160,198,255);GREEN=(122,31,107,255);CHIP=(243,221,236,255)
# background: pink vertical gradient + blurred vocab words
top=(246,226,240);mid=(235,203,226);bot=(200,140,184)
bg=Image.new('RGB',(1280,720))
bd=ImageDraw.Draw(bg)
for y in range(720):
    t=y/719
    c=tuple(int(top[i]+(mid[i]-top[i])*t/0.5) for i in range(3)) if t<0.5 else tuple(int(mid[i]+(bot[i]-mid[i])*(t-0.5)/0.5) for i in range(3))
    bd.line((0,y,1280,y),fill=c)
bg=bg.convert('RGBA')
words=[('Hallo = Hello',10,10),('Haus',700,10),('Hola',1060,50),('house',30,200),('Vokabeln',640,180),('Bonjour',1040,230),('Schule',20,410),('Hund = dog',700,390),('Gracias',1080,430),('Buch = book',30,600),('Merci',690,590),('Freund',1030,640)]
lay=Image.new('RGBA',bg.size,(0,0,0,0));ld=ImageDraw.Draw(lay);WF=ImageFont.truetype(FONT,64)
for t,x,y in words: ld.text((x,y),t,font=WF,fill=(150,60,130,70))
bg=Image.alpha_composite(bg,lay.filter(ImageFilter.GaussianBlur(7)))
p=Image.open(OUTD+'figur-freigestellt.png').convert('RGBA')
sc=720/(p.height*0.78);pw,ph=int(p.width*sc),int(p.height*sc);px_,py_=-int(pw*0.10),18
p2=p.resize((pw,ph),Image.LANCZOS)
sh=Image.new('RGBA',bg.size,(0,0,0,0));sh.paste(Image.new('RGBA',p2.size,(61,22,54,150)),(px_+10,py_+10),p2.split()[3])
bg=Image.alpha_composite(bg,sh.filter(ImageFilter.GaussianBlur(14)));bg.alpha_composite(p2,(px_,py_))
d=ImageDraw.Draw(bg)
lines=['VOKABELN','LERNEN MIT','LINGOBOX'];tag='Gratis Vokabeltool'
size=140
while True:
    F=ImageFont.truetype(FONT,size)
    if max(d.textlength(t,font=F) for t in lines)<=640:break
    size-=2
LH=int(size*1.13);X=605;Y=(720-3*LH)//2+6
spec=dict(size=size,LH=LH,X=X,Y=Y,lines=lines,fig=[px_,py_,pw,ph],tag=tag)
TF=ImageFont.truetype(FB,26);tw=d.textlength(tag,font=TF)
d.rounded_rectangle((X,46,X+tw+44,98),radius=14,fill=MARK);d.text((X+22,54),tag,font=TF,fill=DARK);spec['tagbox']=[X,46,int(tw+44),52]
for i,t in enumerate(lines):
    yy=Y+i*LH
    if i==2:
        w=d.textlength(t,font=F);d.rounded_rectangle((X-16,yy+int(size*0.10),X+w+16,yy+LH-int(size*0.02)),radius=18,fill=MARK)
        spec['bar']=[X-16,yy+int(size*0.10),int(w+32),LH-int(size*0.12)]
    d.text((X,yy),t,font=F,fill=DARK)
CF=ImageFont.truetype(FB,28);x=X;y=Y+3*LH+14;extras=[]
for t in ['Sets','Hausaufgabe','LiveModus']:
    w=d.textlength(t,font=CF)+32;d.rounded_rectangle((x,y,x+w,y+52),radius=14,fill=DARK);d.text((x+16,y+9),t,font=CF,fill=MARK);extras.append(dict(t=t,x=x,y=y,w=int(w),h=52));x+=w+12
spec['extras']=extras
# flashcard top right
AX,AY,AW,AH=948,34,300,124
d.rounded_rectangle((AX,AY,AX+AW,AY+AH),radius=12,fill=CARD,outline=LINEC,width=2)
d.rounded_rectangle((AX,AY,AX+AW,AY+40),radius=12,fill=DARK);d.rectangle((AX,AY+24,AX+AW,AY+40),fill=DARK)
AF=ImageFont.truetype(FB,21);d.text((AX+14,AY+7),'Vokabelkarte',font=AF,fill=MARK)
BF=ImageFont.truetype(FONT,34);d.text((AX+20,AY+56),'Haus',font=BF,fill=DARK)
ax=AX+135;d.rectangle((ax,AY+76,ax+30,AY+80),fill=GREEN);d.polygon([(ax+30,AY+66),(ax+44,AY+78),(ax+30,AY+90)],fill=GREEN)
d.text((AX+190,AY+56),'house',font=BF,fill=GREEN)
spec['ad']=[AX,AY,AW,AH]
bg.convert('RGB').save(OUTD+'cleverbox-thumbnail-lingobox.png')
json.dump(spec,open(SP+'spec_lb.json','w'));print('ok',size)
