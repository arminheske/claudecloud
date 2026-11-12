import fitz,re,json,hashlib,sys,os
n=sys.argv[1];doc=fitz.open(f's{n}.pdf');os.makedirs(f'img{n}',exist_ok=True)
END=('.','?','!',':','“','"','”')
tasks=[];warn=[];bad=set()
ptxt=[pg.get_text() for pg in doc]
cont={};contpages=set()
for i in range(len(doc)):
    if not re.search(r'(^|\n)1\. \S',ptxt[i]):
        contpages.add(i);j=i-1
        while j>=0 and j in contpages:j-=1
        cont.setdefault(j,'');cont[j]+=' '+ptxt[i];warn.append((i+1,'Fortsetzungsseite, Seite '+str(j+1)))
for pn,pg in enumerate(doc):
    txt=ptxt[pn]
    if pn in contpages:continue
    lv=re.search(r'Schulstufe:\s*(\d+),\s*Level:\s*(\d+)',txt)
    if not lv:continue
    txt=txt+cont.get(pn,'')
    level=int(lv.group(2))
    boxes=sorted([x['rect'] for x in pg.get_drawings() if x['rect'].width>450 and x['rect'].height>100],key=lambda r:r.y0)
    m=re.search(r'Ergebnisse:\s*(.*)',txt,re.S);res=m.group(1).replace('\n',' ').strip() if m else ''
    ans=[re.sub(r'^\d\.\s*','',p).strip() for p in re.split(r'\s*/\s*(?=\d\.\s)',res)]
    merged_from=None
    if len(ans)>len(boxes):
        merged_from=max(range(len(boxes)),key=lambda i:boxes[i].height);warn.append((pn+1,f'verschmolzene Box ab {merged_from+1}, ab dort ausgeschlossen'))
    elif len(ans)<len(boxes):bad.add(pn)
    if len(boxes)!=len(ans):warn.append((pn+1,f'Boxen {len(boxes)} <> Ergebnisse {len(ans)}'))
    d=pg.get_text('dict')
    imgs=[(r,im[0]) for im in pg.get_images(full=True) for r in pg.get_image_rects(im[0]) if r.y0>140]
    for bi,b in enumerate(boxes):
        lines=[]
        for blk in d['blocks']:
            if blk['type']!=0:continue
            for l in blk['lines']:
                x0,y0,x1,y1=l['bbox']
                if x0>=b.x0-1 and y0>=b.y0-1 and y1<=b.y1+1:
                    t=''.join(s['text'] for s in l['spans']).strip()
                    if t:lines.append((round(y0,1),x0,x1,t))
        lines.sort()
        if not lines:warn.append((pn+1,bi+1,'leere Box'));continue
        title=re.sub(r'^\d\.\s*','',lines[0][3]);body=lines[1:]
        maxx=max([l[2] for l in body],default=0)
        paras=[];cur=''
        for (y0,x0,x1,t) in body:
            cur=(cur+' '+t).strip()
            if x1>=maxx-4 and not t.endswith(END):continue
            paras.append(cur);cur=''
        if cur:paras.append(cur)
        files=[]
        for k,(r,xr) in enumerate([(r,x) for r,x in imgs if b.y0-2<=r.y0<=b.y1]):
            fn=f'img{n}/p{pn+1:02d}_{bi+1}_{k}.png'
            pm=pg.get_pixmap(clip=r,dpi=220);pm.save(fn)
            files.append(dict(file=fn,w=round(r.width/72,3),h=round(r.height/72,3)))
        a=ans[bi] if bi<len(ans) else ''
        a=re.sub(r'(\d)\s\?$',r'\1 €',a)
        t=dict(page=pn+1,idx=bi+1,level=level,title=title,paras=paras,img=files,ans=a)
        full=title+' '+' '.join(paras)+' '+a
        if (not a or a=='?') and not t.get('buggy'):warn.append((pn+1,bi+1,title,'Antwort fehlt'))
        if re.search(r'[�□■▯]|\?\?',full):warn.append((pn+1,bi+1,title,'Zeichenfehler'))
        if not paras:warn.append((pn+1,bi+1,title,'kein Text'))
        if re.search(r'abgebildet|Bild|Grafik|Figur|siehe|Skizze|Tabelle|Diagramm',full) and not files:warn.append((pn+1,bi+1,title,'Bezug auf Bild, aber kein Bild'))
        t['buggy']=(merged_from is not None and bi>=merged_from);t['_pn']=pn
        tasks.append(t)
for t in tasks:
    if t['_pn'] in bad:t['buggy']=True
seen=set();U=[]
for t in tasks:
    key=re.sub(r'\W+','',t['title']+''.join(t['paras']))
    k2=key+(hashlib.md5(open(t['img'][0]['file'],'rb').read()).hexdigest() if t['img'] else '')
    if k2 in seen:continue
    seen.add(k2);U.append(t)
U=[t for t in U if not t['buggy']]
json.dump(tasks,open(f'tasks{n}.json','w'),ensure_ascii=False,indent=1);json.dump(U,open(f'unique{n}.json','w'),ensure_ascii=False,indent=1)
import collections
print('S'+n,len(tasks),'Aufgaben,',len(U),'eindeutig und fehlerfrei',dict(collections.Counter(t['level'] for t in U)))
for w in warn:print('  WARN',w)
