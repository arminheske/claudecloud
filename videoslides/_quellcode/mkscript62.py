import glob,json
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
D=json.load(open('zb.json'));TH=sorted(glob.glob('zb3/t-*.jpg'));assert len(TH)==len(D)==33
def shd(el,fill,cell=False):
    pr=el._tc.get_or_add_tcPr() if cell else el._p.get_or_add_pPr()
    sh=OxmlElement('w:shd');sh.set(qn('w:val'),'clear');sh.set(qn('w:color'),'auto');sh.set(qn('w:fill'),fill);pr.append(sh)
def words(t,n,end=False):
    w=t.split();return ' '.join(w[-n:]) if end else ' '.join(w[:n])
d=Document();sec=d.sections[0];sec.left_margin=sec.right_margin=Cm(2);sec.top_margin=sec.bottom_margin=Cm(1.8)
st=d.styles['Normal'];st.font.name='Calibri';st.font.size=Pt(12)
DARK=RGBColor(0x0F,0x3A,0x40);GRAY=RGBColor(0x4A,0x6A,0x6E)
r=d.add_paragraph().add_run('Excel: Zellbezüge – Zellen referenzieren');r.bold=True;r.font.size=Pt(20);r.font.color.rgb=DARK
p=d.add_paragraph();r=p.add_run('Sprechertext mit exakter Folienzuordnung · 33 Folien · cleverbox-excel-zellbezuege-slides.pptx');r.font.size=Pt(10.5);r.font.color.rgb=GRAY
p=d.add_paragraph('Jeder Abschnitt steht neben seiner Folie. Die Folie wird eingeblendet, sobald der erste Satz beginnt, und gewechselt, sobald der letzte Satz zu Ende ist. Jeder Folienwechsel liegt an einem Satzende.');p.runs[0].font.size=Pt(10.5)
t=d.add_table(rows=0,cols=2);t.autofit=False
last=None
for no,(ab,ti,text) in enumerate(D,1):
    if ab!=last:
        hr=t.add_row();m_=hr.cells[0].merge(hr.cells[1]);m_.text='';rr=m_.paragraphs[0].add_run(ab.upper());rr.bold=True;rr.font.size=Pt(11);rr.font.color.rgb=DARK;shd(m_,'B1FF37',True);last=ab
    row=t.add_row();c0,c1=row.cells;c0.width=Cm(6.2);c1.width=Cm(10.8)
    c0.text='';c0.paragraphs[0].add_run().add_picture(TH[no-1],width=Cm(5.8))
    cap=c0.add_paragraph();rr=cap.add_run(f'FOLIE {no} · {ti}');rr.bold=True;rr.font.size=Pt(10);rr.font.color.rgb=DARK
    c1.text='';h=c1.paragraphs[0];rr=h.add_run(f'FOLIE {no}');rr.bold=True;rr.font.size=Pt(11);rr.font.color.rgb=DARK;shd(h,'B1FF37')
    m=c1.add_paragraph();rr=m.add_run(f'Abschnitt: {ab} · Beginn: „{words(text,5)} …“');rr.font.size=Pt(9);rr.font.color.rgb=GRAY
    q=c1.add_paragraph(text);q.paragraph_format.space_after=Pt(2)
    e=c1.add_paragraph();rr=e.add_run(f'Ende: „… {words(text,5,True)}“');rr.font.size=Pt(9);rr.font.color.rgb=GRAY
    shd(c1,'EFFBDC',True)
    for cell in (c0,c1):
        tcPr=cell._tc.get_or_add_tcPr();mar=OxmlElement('w:tcMar')
        for side in ('top','left','bottom','right'):
            el=OxmlElement(f'w:{side}');el.set(qn('w:w'),'120');el.set(qn('w:type'),'dxa');mar.append(el)
        tcPr.append(mar)
    sp=t.add_row();sp.cells[0].merge(sp.cells[1]);sp.height=Cm(0.25)
d.save('/home/user/claudecloud/videoslides/skript-excel-zellbezuege-mit-folien.docx');print('ok')
