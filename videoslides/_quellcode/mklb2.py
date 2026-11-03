import json
from PIL import Image,ImageDraw,ImageFont,ImageFilter
SP='/tmp/claude-0/-home-user-claudecloud/e6fd89b8-16f1-562a-9866-3e9dc57faca6/scratchpad/'
OUTD='/home/user/claudecloud/videoslides/'
FBI='/usr/share/fonts/opentype/inter/InterDisplay-BlackItalic.otf';FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
DARK='3D1636';MARK='F58AD2';CARD='FBF1F8';LINE='D3A0C6';GREEN='7A1F6B';CHIP='F3DDEC';INK='2B1027'
hx=lambda h:tuple(int(h[i:i+2],16) for i in (0,2,4))
dm=ImageDraw.Draw(Image.new('RGB',(10,10)))
tw=lambda t,f,s:dm.textlength(t,font=ImageFont.truetype(f,s))
E=[]
def rr(n,x,y,w,h,f,l=None,lw=0,r=0.14):E.append(dict(k='rr',n=n,x=x,y=y,w=w,h=h,f=f,l=l or f,lw=lw,r=r))
def el(n,x,y,w,h,f,l=None,lw=0):E.append(dict(k='el',n=n,x=x,y=y,w=w,h=h,f=f,l=l or f,lw=lw))
def tx(n,t,x,y,w,h,px,c,fnt='b',al='left'):E.append(dict(k='tx',n=n,t=t,x=x,y=y,w=w,h=h,px=px,c=c,f=fnt,al=al))
def ar(n,x,y,w,h,f):E.append(dict(k='ar',n=n,x=x,y=y,w=w,h=h,f=f))
X=60
t='So geht\'s';w=tw(t,FB,28)+44
rr('Tag-Fläche',X,70,w,56,MARK);tx('Tag',t,X,70,w,56,28,DARK,'b','center')
size=118
lines=['PDF-IMPORT','IN DIE','LINGOBOX']
while max(tw(l,FBI,size) for l in lines)>570:size-=2
LH=int(size*1.13);Y=160
for i,l in enumerate(lines):
    yy=Y+i*LH
    if i==2:
        w=tw(l,FBI,size);rr('Marker-Balken',X-16,yy+int(size*0.10),w+32,LH-int(size*0.12),MARK,r=0.18)
    tx('Titel '+str(i+1),l,X,yy,640,LH,size,DARK,'bi')
y=Y+3*LH+30;x=X
for i,t in enumerate(['Schritt für Schritt','kostenlos']):
    w=tw(t,FB,28)+32;rr('Chip %d'%(i+1),x,y,w,52,DARK);tx('Chip-Text %d'%(i+1),t,x,y,w,52,28,MARK,'b','center');x+=w+12
# PDF page
PX,PY,PW,PH=640,140,235,380
rr('PDF-Seite',PX,PY,PW,PH,CARD,LINE,2,0.06)
rr('PDF-Badge',PX+18,PY+18,96,46,DARK,r=0.12);tx('PDF-Badge-Text','PDF',PX+18,PY+18,96,46,26,MARK,'b','center')
pairs=[('Haus','house'),('Hund','dog'),('Buch','book'),('Schule','school'),('Freund','friend')]
for i,(a_,b_) in enumerate(pairs):
    yy=PY+90+i*56
    tx('PDF-Wort %d'%(i+1),a_,PX+18,yy,90,40,22,INK,'b');rr('PDF-Strich %d'%(i+1),PX+112,yy+18,14,4,LINE,r=0.02)
    tx('PDF-Übersetzung %d'%(i+1),b_,PX+134,yy,96,40,22,GREEN,'b')
# Lingobox window
LX,LY,LW,LH2=925,90,325,490
rr('Lingobox-Fenster',LX,LY,LW,LH2,CARD,LINE,2,0.08);rr('Fenster-Kopf',LX,LY,LW,64,DARK,r=0.08)
E.append(dict(k='rr',n='Fenster-Kopf-Füllung',x=LX,y=LY+36,w=LW,h=28,f=DARK,l=DARK,lw=0,r=0.0))
tx('Fenster-Titel','Lingobox',LX+24,LY,200,64,28,MARK,'b')
for i,(a_,b_) in enumerate(pairs[:4]):
    yy=LY+84+i*80
    rr('Karte %d'%(i+1),LX+20,yy,LW-40,66,CHIP,LINE,1.5,0.1)
    tx('Karte %d Wort'%(i+1),a_,LX+38,yy,100,66,24,INK,'b');tx('Karte %d Übersetzung'%(i+1),b_,LX+162,yy,120,66,24,GREEN,'b')
rr('Neu-Marker',LX+LW-130,LY+LH2-58,114,38,MARK,r=0.1);tx('Neu-Text','importiert',LX+LW-130,LY+LH2-58,114,38,18,DARK,'b','center')
# Pfeil (zuletzt, liegt oben)
el('Pfeil-Kreis',838,305,96,96,MARK,DARK,4);ar('Pfeil',856,332,60,40,DARK)
# render PNG
bg=Image.open(SP+'bg-pink.png').convert('RGBA');d=ImageDraw.Draw(bg)
sh=Image.new('RGBA',bg.size,(0,0,0,0));sd=ImageDraw.Draw(sh)
for e in E:
    if e['k']=='rr' and e['n'] in('PDF-Seite','Lingobox-Fenster'):sd.rounded_rectangle((e['x']+8,e['y']+10,e['x']+e['w']+8,e['y']+e['h']+10),radius=22,fill=(61,22,54,100))
bg=Image.alpha_composite(bg,sh.filter(ImageFilter.GaussianBlur(14)));d=ImageDraw.Draw(bg)
F={'bi':FBI,'b':FB}
for e in E:
    if e['k']=='rr':
        rad=int(e['r']*96) if e['r']>0 else 0;d.rounded_rectangle((e['x'],e['y'],e['x']+e['w'],e['y']+e['h']),radius=rad,fill=hx(e['f']),outline=hx(e['l']) if e['lw'] else None,width=max(1,int(e['lw'])) if e['lw'] else 0)
    elif e['k']=='el':d.ellipse((e['x'],e['y'],e['x']+e['w'],e['y']+e['h']),fill=hx(e['f']),outline=hx(e['l']),width=int(e['lw']))
    elif e['k']=='ar':
        x,y,w,h=e['x'],e['y'],e['w'],e['h'];d.rectangle((x,y+h*0.3,x+w*0.55,y+h*0.7),fill=hx(e['f']));d.polygon([(x+w*0.5,y),(x+w,y+h/2),(x+w*0.5,y+h)],fill=hx(e['f']))
    else:
        f=ImageFont.truetype(F[e['f']],e['px']);cy=e['y']+e['h']/2
        if e['al']=='center':d.text((e['x']+e['w']/2,cy),e['t'],font=f,fill=hx(e['c']),anchor='mm')
        else:d.text((e['x'],cy),e['t'],font=f,fill=hx(e['c']),anchor='lm')
bg.convert('RGB').save(OUTD+'cleverbox-thumbnail-lingobox-pdf-import.png')
json.dump(E,open(SP+'el_lb2.json','w'));print('ok',size)
