import math,sys
from pptx import Presentation
from pptx.util import Emu
E=914400
src=sys.argv[1];dst=sys.argv[2]
p=Presentation(src);rep=[]
def lines_of(tf,pt,w):
    cpl=int(w/(0.0067*pt));n=0
    for para in tf.paragraphs:
        txt=''.join(r.text for r in para.runs).replace('\x0b','\n')
        for seg in txt.split('\n'):
            l=1;cur=0
            for wd in seg.split(' '):
                if cur and cur+1+len(wd)>cpl:l+=1;cur=len(wd)
                else:cur+=len(wd)+(1 if cur else 0)
            n+=l
    return max(n,1)
for i,s in enumerate(p.slides,1):
    tb=[sh for sh in s.shapes if sh.shape_type==17 and sh.left/E<9]
    head=[sh for sh in tb if abs(sh.top/E-2.52)<0.05]
    sub=[sh for sh in tb if sh.top/E>2.6]
    if head:
        h=head[0];r=[r for pa in h.text_frame.paragraphs for r in pa.runs][0];pt=r.font.size.pt
        ln=lines_of(h.text_frame,pt,h.width/E)
        full=''.join(r.text for pa in h.text_frame.paragraphs for r in pa.runs)
        if ln==1 and len(h.text_frame.paragraphs)==1 and len(full)>=20 and '\x0b' not in full:
            import copy
            from pptx.oxml.ns import qn
            pa=h.text_frame.paragraphs[0];runs=pa.runs;acc=0;best=min([k for k,c in enumerate(full) if c==' '],key=lambda k:abs(k-len(full)/2),default=None)
            if best is not None:
                for r in runs:
                    e=acc+len(r.text)
                    if acc<=best<e:
                        o=best-acc;l,rt=r.text[:o],r.text[o+1:]
                        r2=copy.deepcopy(r._r);r.text=l
                        br=r._r.makeelement(qn('a:br'),{});rp=r._r.find(qn('a:rPr'))
                        if rp is not None:br.append(copy.deepcopy(rp))
                        r._r.addnext(br);br.addnext(r2)
                        from pptx.text.text import _Run
                        _Run(r2,pa).text=rt
                        ln=2;rep.append((i,'break',full));break
                    acc=e
        for sb in sub:
            new=2.52+ln*0.0195*pt-0.05
            rep.append((i,'sub',round(sb.top/E,2),round(new,2),ln));sb.top=Emu(int(new*E))
    right=[sh for sh in s.shapes if sh.left/E>=9.5]
    if right:
        mn=min(x.top for x in right)/E;mx=max(x.top+x.height for x in right)/E
        dy=6.3-(mn+mx)/2;dy=max(min(dy,10.28-mx),0.75-mn)
        if dy>0:
            for x in right:x.top=Emu(int(x.top+dy*E))
            rep.append((i,'right',round(mn,2),round(mx,2),round(dy,2)))
p.save(dst)
for r in rep[:200]:print(r)
