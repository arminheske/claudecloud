import json
from PIL import Image,ImageDraw,ImageFont,ImageFilter
SP='/tmp/claude-0/-home-user-claudecloud/e6fd89b8-16f1-562a-9866-3e9dc57faca6/scratchpad/'
OUTD='/home/user/claudecloud/videoslides/'
FBI='/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf';FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
MAIN='475BA6';DARK='36448A';CYAN='60C0F0';CARD='FAFAFA';LINE='D3D8EE';CHIP='ECEEF8';INK='1F2A5C';VIOL='6048A8'
hx=lambda h:tuple(int(h[i:i+2],16) for i in (0,2,4))
dm=ImageDraw.Draw(Image.new('RGB',(10,10)));tw=lambda t,f,s:dm.textlength(t,font=ImageFont.truetype(f,s))
E=[]
def rr(n,x,y,w,h,f,l=None,lw=0,r=0.14):E.append(dict(k='rr',n=n,x=x,y=y,w=w,h=h,f=f,l=l or f,lw=lw,r=r))
def el(n,x,y,w,h,f,l=None,lw=0):E.append(dict(k='el',n=n,x=x,y=y,w=w,h=h,f=f,l=l or f,lw=lw))
def tx(n,t,x,y,w,h,px,c,fnt='b',al='left'):E.append(dict(k='tx',n=n,t=t,x=x,y=y,w=w,h=h,px=px,c=c,f=fnt,al=al))
def tri(n,x,y,w,h,f):E.append(dict(k='tri',n=n,x=x,y=y,w=w,h=h,f=f))
def img(n,p,x,y,w,h):E.append(dict(k='img',n=n,p=p,x=x,y=y,w=w,h=h))
X=60
t='Für Lehrkräfte';w=tw(t,FB,28)+44
rr('Tag-Fläche',X,70,w,56,CYAN);tx('Tag',t,X,70,w,56,28,INK,'b','center')
lines=['GRATIS','UNTERRICHTS-','MATERIAL'];size=120
while max(tw(l,FBI,size) for l in lines)>560:size-=2
LH=int(size*1.13);Y=160
for i,l in enumerate(lines):
    yy=Y+i*LH
    if i==0:
        w=tw(l,FBI,size);rr('Marker-Balken',X-16,yy+int(size*0.10),w+32,LH-int(size*0.12),CYAN,r=0.18)
    tx('Titel '+str(i+1),l,X,yy,640,LH,size,DARK,'bi')
y=Y+3*LH+30;x=X
for i,t in enumerate(['Quiz','Arbeitsblätter','Lösungen']):
    w=tw(t,FB,28)+32;rr('Chip %d'%(i+1),x,y,w,52,DARK);tx('Chip-Text %d'%(i+1),t,x,y,w,52,28,CYAN,'b','center');x+=w+12
# Browserfenster
LX,LY,LW,LH2=650,80,590,550
rr('Browser-Fenster',LX,LY,LW,LH2,CARD,LINE,2,0.07)
rr('Browser-Kopf',LX,LY,LW,56,DARK,r=0.07);rr('Browser-Kopf-Füllung',LX,LY+30,LW,26,DARK,r=0.0)
for i,col in enumerate([CYAN,'7C8FD0','D3D8EE']):el('Fensterpunkt %d'%(i+1),LX+22+i*26,LY+20,16,16,col)
rr('Adressfeld',LX+120,LY+10,LW-150,36,CHIP,r=0.1);tx('Adresse','www.cleverbox.co.at',LX+140,LY+10,LW-170,36,20,DARK,'b')
img('Cleverbox-Logo',SP+'cleverbox-logo.png',LX+24,LY+72,190,int(190*0.3709))
rows=[('Erklärvideo','play'),('Interaktives Quiz','q'),('Arbeitsblätter','doc')]
for i,(lab,ic) in enumerate(rows):
    yy=LY+150+i*98
    rr('Material-Karte %d'%(i+1),LX+24,yy,LW-48,84,CARD,LINE,2,0.12)
    el('Icon-Kreis %d'%(i+1),LX+44,yy+12,60,60,MAIN)
    if ic=='play':tri('Play-Dreieck',LX+63,yy+26,26,32,'FFFFFF')
    elif ic=='q':tx('Quiz-Zeichen','?',LX+44,yy+12,60,60,40,'FFFFFF','b','center')
    else:
        rr('Blatt',LX+61,yy+23,26,34,'FFFFFF',r=0.04)
        for k in range(3):rr('Blatt-Zeile %d'%(k+1),LX+66,yy+30+k*8,16,3,MAIN,r=0.01)
    tx('Material %d'%(i+1),lab,LX+124,yy,300,84,28,INK,'b')
    rr('Gratis-Marker %d'%(i+1),LX+LW-48-110,yy+24,100,36,CYAN,r=0.1);tx('Gratis-Text %d'%(i+1),'gratis',LX+LW-48-110,yy+24,100,36,20,INK,'b','center')
rr('Konto-Button',LX+24,LY+LH2-84,LW-48,58,MAIN,r=0.14);tx('Konto-Button-Text','Kostenloses Konto erstellen',LX+24,LY+LH2-84,LW-48,58,26,'FFFFFF','b','center')
# Bild
bg=Image.new('RGB',(1280,720));bd=ImageDraw.Draw(bg)
top=(236,238,248);bot=(150,164,214)
for yy in range(720):
    tt=yy/719;bd.line((0,yy,1280,yy),fill=tuple(int(top[k]+(bot[k]-top[k])*tt) for k in range(3)))
bg=bg.convert('RGBA')
words=[('Mathematik',20,10),('Quiz',690,0),('Lösungen',1000,30),('Arbeitsblatt',10,210),('Betriebswirtschaft',620,190),('Videos',1060,250),('Digitale Grundbildung',0,410),('Unterricht',760,410),('Lobby',1070,440),('Gleichungen',20,600),('Konto',730,590),('Flächeninhalt',900,640)]
lay=Image.new('RGBA',bg.size,(0,0,0,0));ld=ImageDraw.Draw(lay);WF=ImageFont.truetype(FBI,58)
for t,x,yy in words:ld.text((x,yy),t,font=WF,fill=(71,91,166,50))
bg=Image.alpha_composite(bg,lay.filter(ImageFilter.GaussianBlur(7)));bg.convert('RGB').save(SP+'bg-cb.png')
sh=Image.new('RGBA',bg.size,(0,0,0,0));ImageDraw.Draw(sh).rounded_rectangle((LX+8,LY+10,LX+LW+8,LY+LH2+10),radius=26,fill=(30,40,90,110))
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
bg.convert('RGB').save(OUTD+'cleverbox-thumbnail-unterrichtsmaterial.png')
json.dump(E,open(SP+'el_cb.json','w'));print('ok',size)
