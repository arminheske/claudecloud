import json
from PIL import Image,ImageDraw,ImageFont,ImageFilter
SP='/tmp/claude-0/-home-user-claudecloud/e6fd89b8-16f1-562a-9866-3e9dc57faca6/scratchpad/'
OUTD='/home/user/claudecloud/videoslides/'
FBI='/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf';FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
NEON='B1FF37';DEEP='12301A';GREEN='26720A';GRAY='5B6B50';CARD='FBFFF4';LINE='B8D98A';CHIP='DDF3B8'
hx=lambda h:tuple(int(h[i:i+2],16) for i in (0,2,4))
dm=ImageDraw.Draw(Image.new('RGB',(10,10)));tw=lambda t,f,s:dm.textlength(t,font=ImageFont.truetype(f,s))
E=[]
def rr(n,x,y,w,h,f,l=None,lw=0,r=0.14):E.append(dict(k='rr',n=n,x=x,y=y,w=w,h=h,f=f,l=l or f,lw=lw,r=r))
def el(n,x,y,w,h,f,l=None,lw=0):E.append(dict(k='el',n=n,x=x,y=y,w=w,h=h,f=f,l=l or f,lw=lw))
def tx(n,t,x,y,w,h,px,c,fnt='b',al='left'):E.append(dict(k='tx',n=n,t=t,x=x,y=y,w=w,h=h,px=px,c=c,f=fnt,al=al))
def tri(n,x,y,w,h,f):E.append(dict(k='tri',n=n,x=x,y=y,w=w,h=h,f=f))
def img(n,p,x,y,w,h):E.append(dict(k='img',n=n,p=p,x=x,y=y,w=w,h=h))
X=50
# Titel gross über die ganze Breite
l1='SO LERNST DU RICHTIG';l2='PROGRAMMIEREN'
S1=100
while tw(l1,FBI,S1)>1170:S1-=2
S2=150
while tw(l2,FBI,S2)>1130:S2-=2
LH1=int(S1*1.1);LH2=int(S2*1.12);Y1=26
tx('Titel 1',l1,X,Y1,1200,LH1,S1,DEEP,'bi')
Y2=Y1+LH1-4;w2=tw(l2,FBI,S2)
rr('Marker-Balken',X-16,Y2+int(S2*0.08),w2+32,LH2-int(S2*0.1),NEON,r=0.18)
tx('Titel 2',l2,X,Y2,1200,LH2,S2,DEEP,'bi')
yb=Y2+LH2+22
# Unterzeile
pt='DENKEN VOR SYNTAX';PS=60;pw_=tw(pt,FBI,PS)+56
rr('Unterzeile-Fläche',X,yb,pw_,96,DEEP);tx('Unterzeile',pt,X+28,yb,pw_-28,96,PS,NEON,'bi')
y=yb+96+26
for row in (['Karel the Robot','21 Level'],['ohne Anmeldung','kostenlos']):
    x=X
    for i,t in enumerate(row):
        w=tw(t,FB,32)+36;rr('Chip '+t,x,y,w,62,DEEP);tx('Chip-Text '+t,t,x,y,w,62,32,NEON,'b','center');x+=w+14
    y+=62+16
# Fenster (skaliert)
K=0.74;WW,WH=600*K,550*K;LX=1240-WW;LY=720-30-WH
def U(v):return v*K
rr('Fenster',LX,LY,WW,WH,CARD,LINE,2,0.07)
rr('Fenster-Kopf',LX,LY,WW,U(56),DEEP,r=0.07);rr('Fenster-Kopf-Füllung',LX,LY+U(30),WW,U(26),DEEP,r=0.0)
for i,col in enumerate([NEON,'6FCF3C',LINE]):el('Fensterpunkt %d'%(i+1),LX+U(22+i*26),LY+U(20),U(16),U(16),col)
tx('Fenster-Titel','Programmieren',LX+U(130),LY,U(420),U(56),U(22),NEON,'b')
def blk(n,x,y,w,h,f,t,col,fs):
    rr(n,LX+U(x),LY+U(y),U(w),U(h),f,r=0.10);tx(n+' Text',t,LX+U(x+14),LY+U(y),U(w-20),U(h),U(fs),col,'b')
rr('Block Wiederhole 1',LX+U(24),LY+U(72),U(236),U(112),NEON,r=0.12);tx('Block Wiederhole 1 Text','Wiederhole 3 mal',LX+U(38),LY+U(74),U(200),U(40),U(20),DEEP,'b')
blk('Block Schritt 1',44,116,196,52,GREEN,'Schritt vorwärts','FFFFFF',18)
blk('Block Links',24,196,236,52,DEEP,'Links drehen','FFFFFF',18)
rr('Block Wiederhole 2',LX+U(24),LY+U(260),U(236),U(112),NEON,r=0.12);tx('Block Wiederhole 2 Text','Wiederhole 3 mal',LX+U(38),LY+U(262),U(200),U(40),U(20),DEEP,'b')
blk('Block Schritt 2',44,304,196,52,GREEN,'Schritt vorwärts','FFFFFF',18)
GX,GY,CS=LX+U(292),LY+U(80),U(76)
for r_ in range(4):
    for c_ in range(4):
        rr('Feld %d-%d'%(r_+1,c_+1),GX+c_*CS,GY+r_*CS,CS,CS,CHIP if (r_+c_)%2 else CARD,LINE,1.5,0.0)
for k,(c_,r_) in enumerate([(3,2),(3,1),(3,0),(2,0),(1,0)]):
    el('Weg %d'%(k+1),GX+c_*CS+CS/2-U(7),GY+r_*CS+CS/2-U(7),U(14),U(14),NEON,GREEN,2)
rx,ry=GX+3*CS+U(12),GY+3*CS+U(14)
rr('Roboter Körper',rx,ry,U(52),U(42),DEEP,r=0.12);el('Roboter Auge 1',rx+U(11),ry+U(10),U(10),U(10),NEON);el('Roboter Auge 2',rx+U(31),ry+U(10),U(10),U(10),NEON)
el('Antenne Punkt',rx+U(21),ry-U(10),U(10),U(10),NEON,DEEP,2)
fx,fy=GX+U(22),GY+U(10)
rr('Fahnenmast',fx,fy,U(5),U(56),DEEP,r=0.0);tri('Fahne',fx+U(5),fy,U(34),U(24),'E74C3C')
rr('Start-Knopf',LX+U(292),LY+U(WH/K-110),CS*4,U(60),GREEN,r=0.14);tx('Start-Knopf-Text','Start',LX+U(292),LY+U(WH/K-110),CS*4,U(60),U(28),'FFFFFF','b','center')
rr('Hinweis',LX+U(24),LY+U(WH/K-110),U(236),U(60),CHIP,LINE,1.5,0.12);tx('Hinweis-Text','5 Blöcke',LX+U(24),LY+U(WH/K-110),U(236),U(60),U(22),DEEP,'b','center')
# Bild
bg=Image.new('RGB',(1280,720));bd=ImageDraw.Draw(bg)
top=(232,246,210);bot=(125,172,86)
for yy in range(720):
    tt=yy/719;bd.line((0,yy,1280,yy),fill=tuple(int(top[k]+(bot[k]-top[k])*tt) for k in range(3)))
bg=bg.convert('RGBA')
words=[('Algorithmus',10,10),('Python',700,0),('Schleife',1000,40),('Wenn',20,210),('JavaScript',620,190),('Bug',1100,250),('Syntax',0,410),('Code',780,410),('Funktion',1020,440),('Debugging',20,600),('Variable',730,590),('Level',1000,640)]
lay=Image.new('RGBA',bg.size,(0,0,0,0));ld=ImageDraw.Draw(lay);WF=ImageFont.truetype(FBI,58)
for t,x,yy in words:ld.text((x,yy),t,font=WF,fill=(38,114,10,50))
bg=Image.alpha_composite(bg,lay.filter(ImageFilter.GaussianBlur(7)));bg.convert('RGB').save(SP+'bg-dbg.png')
sh=Image.new('RGBA',bg.size,(0,0,0,0));ImageDraw.Draw(sh).rounded_rectangle((LX+8,LY+10,LX+WW+8,LY+WH+10),radius=26,fill=(18,48,26,110))
bg=Image.alpha_composite(bg,sh.filter(ImageFilter.GaussianBlur(14)));d=ImageDraw.Draw(bg)
F={'bi':FBI,'b':FB}
for e in E:
    if e['k']=='rr':
        rad=int(e['r']*96);d.rounded_rectangle((e['x'],e['y'],e['x']+e['w'],e['y']+e['h']),radius=rad,fill=hx(e['f']),outline=hx(e['l']) if e['lw'] else None,width=int(e['lw']) if e['lw'] else 0)
    elif e['k']=='el':d.ellipse((e['x'],e['y'],e['x']+e['w'],e['y']+e['h']),fill=hx(e['f']),outline=hx(e['l']),width=int(e['lw']) if e['lw'] else 0)
    elif e['k']=='tri':x,yy,w,h=e['x'],e['y'],e['w'],e['h'];d.polygon([(x,yy),(x+w,yy+h/2),(x,yy+h)],fill=hx(e['f']))
    elif e['k']=='img':
        lg=Image.open(e['p']).convert('RGBA').resize((e['w'],e['h']),Image.LANCZOS);bg.alpha_composite(lg,(e['x'],e['y']));d=ImageDraw.Draw(bg)
    else:
        f=ImageFont.truetype(F[e['f']],e['px']);cy=e['y']+e['h']/2
        if e['al']=='center':d.text((e['x']+e['w']/2,cy),e['t'],font=f,fill=hx(e['c']),anchor='mm')
        else:d.text((e['x'],cy),e['t'],font=f,fill=hx(e['c']),anchor='lm')
bg.convert('RGB').save(OUTD+'cleverbox-thumbnail-programmieren-denken.png')
json.dump(E,open(SP+'el_dbg.json','w'));print('ok',S1,S2)
