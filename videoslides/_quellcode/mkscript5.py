import glob
N=[None,
"Hand aufs Herz: Wie viele von euch haben schon mal angefangen, programmieren zu lernen, und dann wieder aufgehört?",
"Meistens läuft das nach folgendem Muster ab:",
"Man sucht zunächst nach der besten Programmiersprache und findet dann ein Video indem ein verfechter einer beliebigen Programmiersprache euch erklären möchte warum diese oder jene die beste Programmiersprache sei.",
"Dann sucht ihr für diese Programmiersprache  ein Tutorial, installiert eine Entwicklungsumgebung und beginnt mit einem Hallo Welt in irgendeiner Programmiersprache.",
"Womöglich funktioniert das auf den ersten Anlauf gar nicht und man sucht noch ewig nach Tippfehlern.",
"Dann hat man nach 2 Stunden ein Hallo Welt Programm und absolut gar nichts gelernt.",
"Das liegt daran, dass solche Tutorials nicht bei den Grundlagen ansetzen, sondern spezifisch bei der Syntax einer Programmiersprache",
"HIER EVENTUELL NOCH EINE ERKLÄRUNG FÜR SYNTAX",
"Das ist aber der falsche Beginn in die Programmierung.",
"Versteht mich nicht falsch: Natürlich ist die Syntax wichtig, um ein Programm zu schreiben, aber es ist einfach nicht der erste Schritt.",
"So wie man im echten Leben idealerweise auch nachdenkt bevor man etwas schreibt oder sagt, so müssen wir uns auch in der Programmierung zunächst mit den Denkprozessen beschäftigen.",
"Wenn ihr einmal gelernt habt wie ein Programmierer zu denken, könnt ihr euch immer noch eine Sprache aussuchen, die dann am besten für euch passt.",
"Damit mache ich mich jetzt bei jenen, die gehofft hatten heute schon das erste Jump and Run Spiel fertig zu stellen, extrem unbeliebt, aber wenn ihr mir die Chance gebt euch diese Methode Programmierung zu lernen zu zeigen und euch auf sie einlasst werdet ihr langfristig viel weiterkommen, weil ihr wirklich lernt wie ein Programmierer zu denken und nicht nur Code aus einem Tutorial abtippt.",
"Dafür gibt es eine alte, aber richtig gute Idee: Karel the Robot.",
"Ein kleiner Roboter in einer Welt aus Kästchen, und man steuert ihn mit ein paar einfachen Befehlen.",
"Das wird an Unis schon seit Jahrzehnten für den Einstieg verwendet.",
"Es gibt davon einige Versionen, die man kompliziert herunterladen muss, was vor allem für SchülerInnen in Schulen nervig ist.",
"Ich habe euch dafür eine Alternative gebaut, die völlig kostenlos im Internet läuft."]
TITLES=[None,'Hand aufs Herz','Das typische Muster','Schritt 1 und 2','Schritt 3 bis 5','Tippfehler','Nach 2 Stunden nichts gelernt','Problem: Syntax zuerst','Erklärung Syntax (optional)','Falscher Beginn','Syntax wichtig, aber nicht zuerst','Erst denken, dann schreiben','Erst denken, dann Sprache wählen','Mein Versprechen','Karel the Robot','Roboter in der Welt aus Kästchen','An Unis seit Jahrzehnten','Download nötig','Meine Alternative im Browser']
assert len(N)==19
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.oxml.ns import qn
from docx.oxml import OxmlElement
TH=sorted(glob.glob('dbg-*.jpg'));assert len(TH)==18
def shd(el,fill,cell=False):
    pr=el._tc.get_or_add_tcPr() if cell else el._p.get_or_add_pPr()
    sh=OxmlElement('w:shd');sh.set(qn('w:val'),'clear');sh.set(qn('w:color'),'auto');sh.set(qn('w:fill'),fill);pr.append(sh)
def words(t,n,end=False):
    w=t.split();return ' '.join(w[-n:]) if end else ' '.join(w[:n])
d=Document();sec=d.sections[0];sec.left_margin=sec.right_margin=Cm(2);sec.top_margin=sec.bottom_margin=Cm(1.8)
st=d.styles['Normal'];st.font.name='Calibri';st.font.size=Pt(12)
DARK=RGBColor(0x12,0x30,0x1A);GRAY=RGBColor(0x5B,0x6B,0x50)
r=d.add_paragraph().add_run('Programmieren lernen: Denken vor Syntax');r.bold=True;r.font.size=Pt(20);r.font.color.rgb=DARK
p=d.add_paragraph();r=p.add_run('Sprechertext mit exakter Folienzuordnung · 18 Folien · cleverbox-programmieren-denken-slides.pptx');r.font.size=Pt(10.5);r.font.color.rgb=GRAY
p=d.add_paragraph('Jeder Abschnitt steht neben seiner Folie. Die Folie wird eingeblendet, sobald der erste Satz beginnt, und gewechselt, sobald der letzte Satz zu Ende ist. Jeder Folienwechsel liegt an einem Satzende. Reihenfolge: 1 bis 18, jede Folie genau einmal. Der Text ist unverändert aus deinem Skript übernommen, auch Tippfehler (zum Beispiel „verfechter“, „indem“ ohne Komma, „Programmierung zu lernen zu zeigen“). Folie 8 gehört zu deiner Notiz „HIER EVENTUELL NOCH EINE ERKLÄRUNG FÜR SYNTAX“ und ist optional: Du kannst sie weglassen oder die Notiz durch einen gesprochenen Satz ersetzen.')
p.runs[0].font.size=Pt(10.5)
t=d.add_table(rows=0,cols=2);t.autofit=False
for no in range(1,19):
    text=N[no];note=(no==8)
    row=t.add_row();c0,c1=row.cells;c0.width=Cm(6.2);c1.width=Cm(10.8)
    c0.text='';c0.paragraphs[0].add_run().add_picture(TH[no-1],width=Cm(5.8))
    cap=c0.add_paragraph();rr=cap.add_run(f'FOLIE {no} · {TITLES[no]}');rr.bold=True;rr.font.size=Pt(10);rr.font.color.rgb=DARK
    c1.text='';h=c1.paragraphs[0];rr=h.add_run(f'FOLIE {no}'+(' (optional)' if note else ''));rr.bold=True;rr.font.size=Pt(11);rr.font.color.rgb=DARK;shd(h,'B1FF37')
    if note:
        q=c1.add_paragraph();q.paragraph_format.space_after=Pt(2);x=q.add_run(text);x.italic=True
        m=c1.add_paragraph();rr=m.add_run('Notiz aus dem Skript, wird nicht gesprochen. Die Folie kann an dieser Stelle gezeigt werden, wenn du die Erklärung einfügst.');rr.font.size=Pt(9);rr.font.color.rgb=GRAY
    else:
        m=c1.add_paragraph();rr=m.add_run(f'Beginn: „{words(text,5)} …“');rr.font.size=Pt(9);rr.font.color.rgb=GRAY
        q=c1.add_paragraph(text);q.paragraph_format.space_after=Pt(2)
        e=c1.add_paragraph();rr=e.add_run(f'Ende: „… {words(text,5,True)}“');rr.font.size=Pt(9);rr.font.color.rgb=GRAY
    shd(c1,'EFFBDC',True)
    for cell in (c0,c1):
        tcPr=cell._tc.get_or_add_tcPr();mar=OxmlElement('w:tcMar')
        for side in ('top','left','bottom','right'):
            el=OxmlElement(f'w:{side}');el.set(qn('w:w'),'120');el.set(qn('w:type'),'dxa');mar.append(el)
        tcPr.append(mar)
    sp=t.add_row();sp.cells[0].merge(sp.cells[1]);sp.height=Cm(0.25)
d.save('/home/user/claudecloud/videoslides/skript-programmieren-denken-mit-folien.docx');print('ok')
