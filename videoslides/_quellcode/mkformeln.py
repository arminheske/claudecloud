import json,re,os,glob
from PIL import Image,ImageDraw,ImageFont
OUT='/home/user/claudecloud/videoslides/flaecheninhalt-bilder/formeln/'
for f in glob.glob(OUT+'*.png'):os.remove(f)
FB='/usr/share/fonts/opentype/inter/Inter-Bold.otf'
PILL=(15,42,82);ACC=(141,187,242)
SZ=112;SS=70;PH=340;CY=PH/2
def font(s):return ImageFont.truetype(FB,s)
dm=ImageDraw.Draw(Image.new('RGBA',(10,10)))
def tokens(s):
    out=[]
    for p in re.split(r'(h_[abc])',s):
        if not p:continue
        m=re.match(r'h_([abc])$',p)
        if m:out+=[('t','h'),('s',m.group(1))]
        else:out.append(('t',p))
    return out
def tw(tk):return sum(dm.textlength(t,font=font(SZ if k=='t' else SS)) for k,t in tk)
FM=[('rechteck','Rechteck','a · b',None),('quadrat','Quadrat','a · a',None),('rechtwinkliges-dreieck','Rechtwinkliges Dreieck','a · b','2'),
 ('parallelogramm-a','Parallelogramm (Grundseite a)','a · h_a',None),('parallelogramm-b','Parallelogramm (Grundseite b)','b · h_b',None),
 ('raute-a-h','Raute (Seite a, Höhe h)','a · h',None),('raute-e-f','Raute (Diagonalen e, f)','e · f','2'),
 ('trapez','Trapez','(a + c) · h','2'),('deltoid','Deltoid','e · f','2'),
 ('dreieck-c','Allgemeines Dreieck (Grundseite c)','c · h_c','2'),('dreieck-a','Allgemeines Dreieck (Grundseite a)','a · h_a','2'),('dreieck-b','Allgemeines Dreieck (Grundseite b)','b · h_b','2')]
res=[]
for i,(slug,name,num,den) in enumerate(FM,1):
    els=[];PAD=80
    lead=tokens('A = ');lw=tw(lead)
    if den:
        nt=tokens(num);nw=tw(nt);fw=max(nw,tw(tokens(den)))+50
        W=lw+fw;pw=int(W+2*PAD)
        els.append(dict(k='row',tk=lead,x=PAD,cy=CY,w=lw))
        fx=PAD+lw
        els.append(dict(k='row',tk=nt,x=fx+(fw-nw)/2,cy=CY-66,w=nw))
        dw=tw(tokens(den));els.append(dict(k='row',tk=tokens(den),x=fx+(fw-dw)/2,cy=CY+70,w=dw))
        els.append(dict(k='line',x=fx,y=CY-4,w=fw,h=8))
    else:
        tk=lead+tokens(num);W=tw(tk);pw=int(W+2*PAD);els.append(dict(k='row',tk=tk,x=PAD,cy=CY,w=W))
    im=Image.new('RGBA',(pw,PH),(0,0,0,0));d=ImageDraw.Draw(im)
    d.rounded_rectangle((0,0,pw-1,PH-1),radius=48,fill=PILL+(255,))
    for e in els:
        if e['k']=='line':d.rectangle((e['x'],e['y'],e['x']+e['w'],e['y']+e['h']),fill=ACC+(255,))
        else:
            x=e['x']
            for k,t in e['tk']:
                f=font(SZ if k=='t' else SS);d.text((x,e['cy']+(0 if k=='t' else 30)),t,font=f,fill=ACC+(255,),anchor='lm');x+=d.textlength(t,font=f)
    fn=f'{i:02d}-{slug}-formel.png';im.save(OUT+fn)
    res.append(dict(nr=i,slug=slug,name=name,file=fn,pw=pw,ph=PH,els=els))
sp=json.load(open('forms.json'));sp['formeln']=res;json.dump(sp,open('forms.json','w'),ensure_ascii=False)
print([(r['file'],r['pw']) for r in res])
