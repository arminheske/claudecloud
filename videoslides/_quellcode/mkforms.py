import json,os,re
from PIL import Image,ImageDraw,ImageFont
OUT='/home/user/claudecloud/videoslides/flaecheninhalt-bilder/'
os.makedirs(OUT+'formen',exist_ok=True);os.makedirs(OUT+'formeln',exist_ok=True)
FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
FILL=(141,187,242);OUTL=(15,42,82);LAB=(20,69,154);PILL=(15,42,82);ACC=(141,187,242)
def hexc(c):return '%02X%02X%02X'%c
# --- Formen: poly, dashed lines, right-angle squares, labels
F=[
 ('rechteck','Rechteck',[(400,250),(1200,250),(1200,650),(400,650)],[],[],[('a',800,730,''),('b',1275,450,'')]),
 ('quadrat','Quadrat',[(550,200),(1050,200),(1050,700),(550,700)],[],[],[('a',800,780,''),('a',1125,450,'')]),
 ('rechtwinkliges-dreieck','Rechtwinkliges Dreieck',[(400,700),(1200,700),(400,250)],[],[],[('a',800,780,''),('b',320,475,'')]),
 ('parallelogramm-a','Parallelogramm (Grundseite a)',[(350,650),(1050,650),(1250,250),(550,250)],[((550,250),(550,650))],[],[('a',700,730,''),('h',600,450,'a')]),
 ('parallelogramm-b','Parallelogramm (Grundseite b)',[(450,720),(950,720),(1250,250),(750,250)],[((750,250),(750,720))],[],[('b',700,800,''),('h',800,485,'b')]),
 ('raute-a-h','Raute (Seite a, Höhe h)',[(350,650),(850,650),(1150,250),(650,250)],[((650,250),(650,650))],[],[('a',600,730,''),('h',695,450,'')]),
 ('raute-e-f','Raute (Diagonalen e, f)',[(350,450),(800,200),(1250,450),(800,700)],[((350,450),(1250,450)),((800,200),(800,700))],[],[('e',1060,415,''),('f',840,300,'')]),
 ('trapez','Trapez',[(300,700),(1300,700),(1050,250),(550,250)],[((550,250),(550,700))],[],[('a',800,780,''),('c',800,185,''),('h',505,475,'')]),
 ('deltoid','Deltoid',[(800,150),(1150,350),(800,750),(450,350)],[((800,150),(800,750)),((450,350),(1150,350))],[],[('e',840,580,''),('f',1000,305,'')]),
 ('dreieck-c','Allgemeines Dreieck (Grundseite c)',[(350,700),(1250,700),(850,230)],[((850,230),(850,700))],[],[('c',800,780,''),('h',805,480,'c')]),
 ('dreieck-a','Allgemeines Dreieck (Grundseite a)',[(350,700),(1250,700),(1000,230)],[((1000,230),(1000,700))],[],[('a',800,780,''),('h',955,480,'a')]),
 ('dreieck-b','Allgemeines Dreieck (Grundseite b)',[(350,700),(1250,700),(600,230)],[((600,230),(600,700))],[],[('b',800,780,''),('h',555,480,'b')]),
]
def font(s):return ImageFont.truetype(FB,s)
def label(d,t,x,y,sub,sz=72):
    f=font(sz);w=d.textlength(t,font=f)
    fs=font(int(sz*0.62));ws=d.textlength(sub,font=fs) if sub else 0
    x0=x-(w+ws)/2;d.text((x0,y),t,font=f,fill=LAB,anchor='lm')
    if sub:d.text((x0+w+2,y+sz*0.28),sub,font=fs,fill=LAB,anchor='lm')
spec={'formen':[],'formeln':[]}
for i,(slug,name,poly,dash,ra,labs) in enumerate(F,1):
    im=Image.new('RGBA',(1600,900),(0,0,0,0));d=ImageDraw.Draw(im)
    d.polygon(poly,fill=FILL+(255,));d.line(poly+[poly[0]],fill=OUTL+(255,),width=10,joint='curve')
    for p in poly:d.ellipse((p[0]-5,p[1]-5,p[0]+5,p[1]+5),fill=OUTL+(255,))
    for a,b in dash:
        L=((b[0]-a[0])**2+(b[1]-a[1])**2)**.5;n=int(L//28)
        for k in range(0,n,2):
            t0=k/n;t1=min((k+1)/n,1);d.line((a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0,a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1),fill=LAB+(255,),width=7)
    ra=[]
    for t,x,y,sub in labs:label(d,t,x,y,sub)
    fn=f'{i:02d}-{slug}-form.png';bb=im.getbbox();im=im.crop((max(bb[0]-40,0),max(bb[1]-40,0),min(bb[2]+40,1600),min(bb[3]+40,900)));im.save(OUT+'formen/'+fn)
    spec['formen'].append(dict(nr=i,slug=slug,name=name,poly=poly,dash=dash,ra=ra,labs=[list(l) for l in labs],file=fn))
# --- Formeln
FM=[('rechteck','Rechteck','A = a · b'),('quadrat','Quadrat','A = a · a'),('rechtwinkliges-dreieck','Rechtwinkliges Dreieck','A = a · b : 2'),
 ('parallelogramm-a','Parallelogramm (Grundseite a)','A = a · h_a'),('parallelogramm-b','Parallelogramm (Grundseite b)','A = b · h_b'),
 ('raute-a-h','Raute (Seite a, Höhe h)','A = a · h'),('raute-e-f','Raute (Diagonalen e, f)','A = e · f : 2'),
 ('trapez','Trapez','A = (a + c) · h : 2'),('deltoid','Deltoid','A = e · f : 2'),
 ('dreieck-c','Allgemeines Dreieck (Grundseite c)','A = c · h_c : 2'),('dreieck-a','Allgemeines Dreieck (Grundseite a)','A = a · h_a : 2'),('dreieck-b','Allgemeines Dreieck (Grundseite b)','A = b · h_b : 2')]
def tokens(s):
    out=[]
    for p in re.split(r'(h_[abc])',s):
        if not p:continue
        m=re.match(r'h_([abc])$',p)
        if m:out+= [('t','h'),('s',m.group(1))]
        else:out.append(('t',p))
    return out
SZ=120;SS=76
dm=ImageDraw.Draw(Image.new('RGBA',(10,10)))
for i,(slug,name,s) in enumerate(FM,1):
    tk=tokens(s);W=sum(dm.textlength(t,font=font(SZ if k=='t' else SS)) for k,t in tk)
    pw,ph=int(W+150),230
    im=Image.new('RGBA',(pw,ph),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rounded_rectangle((0,0,pw-1,ph-1),radius=44,fill=PILL+(255,))
    x=75
    for k,t in tk:
        f=font(SZ if k=='t' else SS);d.text((x,ph/2+(0 if k=='t' else 30)),t,font=f,fill=ACC+(255,),anchor='lm');x+=d.textlength(t,font=f)
    fn=f'{i:02d}-{slug}-formel.png';im.save(OUT+'formeln/'+fn)
    spec['formeln'].append(dict(nr=i,slug=slug,name=name,s=s,file=fn,pw=pw,ph=ph))
json.dump(spec,open('forms.json','w'),ensure_ascii=False);print('ok')
