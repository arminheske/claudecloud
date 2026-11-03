const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='EFFBDC', CARD='FBFFF4', INK='0E1F0C', GREEN='26720A', NEON='B1FF37', DEEP='12301A',
  GRAY='5B6B50', LINE='B8D98A', CHIP='DDF3B8', TAB2='EAF8CF', DEEP2='1B4527', DEEPLINE='2F6B3E', DSUB='A9C79A';
const FONT='Poppins';
const THEME={name:'Cleverbox Gruen',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='TikTok-Algorithmus – Erklärvideo Slides';
pres.author='Cleverbox';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Cleverbox · Digitale Grundbildung',options:{x:0.7,y:7.05,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
});
const PAL={
  LIGHT:{text:INK,acc:GREEN,sub:GRAY,card:CARD,line:LINE,chip:CHIP,hl:true},
  DARK:{text:BG,acc:NEON,sub:DSUB,card:DEEP2,line:DEEPLINE,chip:DEEP,hl:false},
  NEON:{text:DEEP,acc:DEEP,sub:DEEP,card:CARD,line:DEEP,chip:CHIP,hl:false}};

let n=0;
function mk(mode,label){
  n++;const s=pres.addSlide({masterName:mode});s.addNotes(label);return {s,P:PAL[mode],mode};
}
function T(s,text,x,y,w,h,o={}){
  s.addText(text,Object.assign({x,y,w,h,fontFace:FONT,fontSize:16,color:INK,margin:0,valign:'top',isTextBox:true},o));
}
function kicker(c,text,x=0.7,y=0.75,w=8){T(c.s,text,x,y,w,0.4,{fontSize:18,color:c.mode==='DARK'?NEON:GREEN,bold:true});}
function head(c,segs,x,y,w,h,size=40){
  const runs=segs.map(([t,a])=>({text:t,options:{color:a?c.P.acc:c.P.text,highlight:(a&&c.P.hl)?NEON:undefined}}));
  T(c.s,runs,x,y,w,h,{fontSize:size,lineSpacingMultiple:1.05});
}
function sub(c,text,x,y,w,h,size=20){T(c.s,text,x,y,w,h,{fontSize:size,color:c.P.sub,lineSpacingMultiple:1.2});}
function card(c,x,y,w,h,fill,line){
  c.s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.15,fill:{color:fill||c.P.card},line:{color:line||c.P.line,width:1.25}});
}
function badge(s,text,x,y,w,h=0.4,fill=NEON,color=INK,size=14){
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.08,fill:{color:fill},line:{color:fill,width:0}});
  T(s,text,x,y,w,h,{fontSize:size,bold:true,color,align:'center',valign:'middle'});
}
function circleNum(s,num,x,y,d=0.6,fill=NEON,color=INK){
  s.addShape(S.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,width:0}});
  T(s,String(num),x,y,d,d,{fontSize:d>0.55?20:16,bold:true,color,align:'center',valign:'middle'});
}
function arrow(s,type,x,y,w,h,color=GREEN){s.addShape(type,{x,y,w,h,fill:{color},line:{color,width:0}});}
function win(s,x,y,w,h,o){
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:CARD},line:{color:LINE,width:1.25}});
  s.addShape(S.roundRect,{x,y,w,h:0.9,rectRadius:0.12,fill:{color:DEEP},line:{color:DEEP,width:0}});
  s.addShape(S.rect,{x:x+0.01,y:y+0.45,w:w-0.02,h:0.5,fill:{color:CHIP},line:{color:CHIP,width:0}});
  T(s,o.bar||'',x+w-2.4,y+0.06,2.2,0.34,{fontSize:13,color:CARD,align:'right',valign:'middle'});
  (o.tabs||[]).forEach((t,i)=>{
    const tw=2.1,tx=x+0.2+i*(tw+0.1),act=i===(o.active||0);
    s.addShape(S.roundRect,{x:tx,y:y+0.5,w:tw,h:0.45,rectRadius:0.08,fill:{color:act?CARD:TAB2},line:{color:act?CARD:TAB2,width:0}});
    s.addShape(S.roundRect,{x:tx+0.14,y:y+0.64,w:0.16,h:0.16,rectRadius:0.03,fill:{color:CHIP},line:{color:LINE,width:0.5}});
    T(s,t,tx+0.4,y+0.5,tw-0.45,0.45,{fontSize:13,color:INK,valign:'middle'});
  });
  return y+1.05;
}
function phone(s,x,y,w,h,label,tiles){
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.3,fill:{color:DEEP},line:{color:DEEP,width:0}});
  s.addShape(S.roundRect,{x:x+0.1,y:y+0.1,w:w-0.2,h:h-0.2,rectRadius:0.22,fill:{color:CARD},line:{color:CARD,width:0}});
  T(s,'Für dich',x+0.1,y+0.3,w-0.2,0.35,{fontSize:14,bold:true,align:'center',color:INK});
  tiles.forEach((t,i)=>{
    const ty=y+0.85+i*1.25;
    s.addShape(S.roundRect,{x:x+0.25,y:ty,w:w-0.5,h:1.05,rectRadius:0.12,fill:{color:i===0?NEON:CHIP},line:{color:i===0?NEON:CHIP,width:0}});
    T(s,t,x+0.4,ty,w-0.8,1.05,{fontSize:14,bold:true,valign:'middle',color:INK});
  });
  T(s,label,x,y+h+0.15,w,0.4,{fontSize:16,bold:true,align:'center',color:INK});
}


const ORANGE='FF7A45', INK2='0A1C10';
function tile(s,x,y,w,h,label,fill=CHIP,color=INK,size=14){
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:fill},line:{color:fill,width:0}});
  if(label)T(s,label,x,y,w,h,{fontSize:size,bold:true,color,align:'center',valign:'middle'});
}
function dot(s,cx,cy,d,fill,line){s.addShape(S.ellipse,{x:cx-d/2,y:cy-d/2,w:d,h:d,fill:{color:fill},line:{color:line||fill,width:line?2:0}});}
function ln(s,x,y,w,h,color,width=3,extra={}){s.addShape(S.line,{x,y,w,h,line:Object.assign({color,width},extra)});}
function bubble(s,text,x,y,w,h,fill,color=INK,size=18){
  s.addShape(S.wedgeRoundRectCallout,{x,y,w,h,rectRadius:0.2,fill:{color:fill},line:{color:fill,width:0}});
  T(s,text,x,y,w,h,{fontSize:size,bold:true,color,align:'center',valign:'middle'});
}
function smallPhone(s,x,y,w,h,bleed){
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.3,fill:{color:DEEP},line:{color:DEEP,width:0}});
  s.addShape(S.roundRect,{x:x+0.1,y:y+0.1,w:w-0.2,h:h-0.2,rectRadius:0.22,fill:{color:CARD},line:{color:CARD,width:0}});
}


const OUT='/home/user/claudecloud/videoslides/cleverbox-datentypen-slides.pptx';
function xmark(s,x,y,d){s.addShape(S.mathMultiply,{x,y,w:d,h:d,fill:{color:ORANGE},line:{color:ORANGE,width:0}});}
function check(s,x,y,d,color=DEEP){
  const bar=(cx,cy,len,rot)=>s.addShape(S.roundRect,{x:cx-len/2,y:cy-0.04,w:len,h:0.08,rectRadius:0.03,rotate:rot,fill:{color},line:{color,width:0}});
  bar(x+0.30*d,y+0.62*d,0.34*d,45);bar(x+0.62*d,y+0.48*d,0.7*d,315);
}
function std(c,kick,segs,subtext,size=40,subY=5.0,headH=3.0,subSize=18){
  kicker(c,kick,0.7,1.2);head(c,segs,0.7,1.75,6.2,headH,size);if(subtext)sub(c,subtext,0.7,subY,6,1.8,subSize);}
function table(s,x,y,colW,rows,o={}){
  const rh=o.rh||0.62;
  rows.forEach((r,ri)=>{let cx=x;r.forEach((t,ci)=>{
    const hdr=ri===0;let fill=hdr?DEEP:CARD;
    if(!hdr&&o.hiCol===ci)fill=CHIP;if(!hdr&&o.hiRow===ri)fill=o.hiCol===ci?NEON:'EAF8CF';
    if(hdr&&o.hiCol===ci)fill=o.hiHdr||DEEP;
    s.addShape(S.rect,{x:cx,y:y+ri*rh,w:colW[ci],h:rh,fill:{color:fill},line:{color:LINE,width:1}});
    T(s,t,cx+0.1,y+ri*rh,colW[ci]-0.2,rh,{fontSize:o.size||15,bold:hdr,color:hdr?CARD:INK,valign:'middle',align:o.align||'left'});
    cx+=colW[ci];});});
}

// 1 Einstieg
{const c=mk('LIGHT','Einstieg');
 std(c,'Digitale Grundbildung',[['Deine Schule speichert alle ',0],['Schüler:innen',1],[' in einer Liste.',0]],'Aber welche Art von Information steckt in jedem Feld?',36,5.1);
 [['Name','Anna Huber'],['Geburtsdatum','12.03.2012'],['Klasse','2b'],['Körpergröße','1,65 m'],['Skiwoche angemeldet','ja']].forEach(([l,v],i)=>{
   const y=1.0+i*1.15;card(c,7.2,y,5.4,1.0);T(c.s,l,7.45,y,2.6,1.0,{fontSize:14,color:GRAY,valign:'middle'});tile(c.s,10.0,y+0.15,2.4,0.7,v,i===4?NEON:CHIP,INK,17);});
}
// 2 Datentypen
{const c=mk('LIGHT','Was sind Datentypen?');
 std(c,'Datentypen',[['Diese Arten nennt man ',0],['Datentypen.',1]],'Eine Telefonnummer ist etwas anderes als ein Gewicht – und ein Datum etwas anderes als ein Name.',40,4.6);
 [['0664 1234567','Telefonnummer'],['48,7 kg','Gewicht'],['12.03.2012','Datum'],['Anna','Name']].forEach(([v,l],i)=>{
   const x=7.2+(i%2)*2.8,y=1.0+Math.floor(i/2)*2.85;card(c,x,y,2.6,2.6);tile(c.s,x+0.2,y+0.35,2.2,1.0,v,i%2?NEON:CHIP,INK,16);T(c.s,l,x+0.2,y+1.65,2.2,0.6,{fontSize:17,bold:true,align:'center'});});
}
// 3 Wiederholung Datenbank
{const c=mk('LIGHT','Kurze Wiederholung: Was ist eine Datenbank?');
 std(c,'Wiederholung',[['Eine Datenbank ist eine ',0],['geordnete Sammlung',1],[' von Informationen.',0]],'Sie sieht oft aus wie eine Tabelle.',36);
 table(c.s,7.3,1.2,[1.0,1.7,2.4],[['ID','Nachname','Geburtsdatum'],['1','Huber','12.03.2012'],['2','Maier','05.11.2011'],['3','Gruber','28.07.2012']],{hiCol:1,hiRow:2,rh:0.75,size:16});
 badge(c.s,'Zeile = Datensatz',7.3,4.7,2.5,0.55,NEON,INK,15);badge(c.s,'Spalte = Feld (Attribut)',10.0,4.7,2.6,0.55,CHIP,INK,14);
}
// 4 Datentyp pro Spalte
{const c=mk('LIGHT','Für jede Spalte legen wir den Datentyp fest');
 std(c,'Der Datentyp',[['Für jede Spalte legen wir fest, ',0],['welche Daten erlaubt sind.',1]],'Das ist der Datentyp.',36,4.8);
 [['ID','Ganzzahl'],['Nachname','Text'],['Geburtsdatum','Datum']].forEach(([h,t],i)=>{const x=7.2+i*1.85;
   tile(c.s,x,1.4,1.7,0.8,h,DEEP,CARD,14);arrow(c.s,S.downArrow,x+0.65,2.3,0.4,0.45);badge(c.s,t,x,2.9,1.7,0.7,NEON,INK,15);
   [0,1].forEach(r=>tile(c.s,x,3.9+r*0.75,1.7,0.6,'',CHIP));});
 T(c.s,'erlaubt: nur Werte dieses Typs',7.2,5.6,5.4,0.5,{fontSize:15,color:GRAY});
}
// 5 Warum Datentypen
{const c=mk('LIGHT','Warum brauchen wir Datentypen?');
 kicker(c,'Warum Datentypen?');
 head(c,[['Warum nicht ',0],['alles als Text',1],['?',0]],0.7,1.2,11.9,1.1,42);
 [['Rechnen','Als Text ist „165“ nur ein Wort – wie „Haus“.'],['Sortieren','Als Text wird nach dem ersten Zeichen sortiert.'],['Fehler vermeiden','Ein Textfeld akzeptiert alles – auch „Banane“.']].forEach(([t,d],i)=>{
   const x=0.7+i*4.05;card(c,x,2.5,3.8,3.3);dot(c.s,x+0.8,3.3,1.0,DEEP);
   if(i===0){T(c.s,'+',x+0.3,2.8,1.0,1.0,{fontSize:44,bold:true,color:NEON,align:'center',valign:'middle'});}
   if(i===1){arrow(c.s,S.upArrow,x+0.5,2.95,0.28,0.7,NEON);arrow(c.s,S.downArrow,x+0.85,2.95,0.28,0.7,NEON);}
   if(i===2)xmark(c.s,x+0.5,3.0,0.6);
   T(c.s,t,x+0.3,4.0,3.2,0.5,{fontSize:22,bold:true});T(c.s,d,x+0.3,4.6,3.2,1.1,{fontSize:16,color:GRAY});});
 c.s.addShape(S.roundRect,{x:0.7,y:6.05,w:11.9,h:0.8,rectRadius:0.4,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Der richtige Datentyp spart Platz, verhindert Fehler und ermöglicht Berechnungen.',0.7,6.05,11.9,0.8,{fontSize:17,bold:true,color:NEON,align:'center',valign:'middle'});
}
// 6 Rechnen
{const c=mk('LIGHT','Warum Datentypen: Rechnen');
 std(c,'Rechnen',[['Als Text kann der Computer ',0],['nicht rechnen.',1]],'Für ihn ist „165“ dann nur ein Wort – so wie „Haus“.',38);
 card(c,7.2,1.0,5.4,2.5);T(c.s,'Als Text gespeichert',7.45,1.15,4.9,0.5,{fontSize:16,bold:true,color:GRAY});
 ['„165“','„172“','„158“'].forEach((t,i)=>tile(c.s,7.45+i*1.65,1.8,1.5,0.7,t,CHIP,INK,17));
 badge(c.s,'Durchschnitt: nicht berechenbar',7.45,2.75,4.9,0.55,ORANGE,INK,15);
 card(c,7.2,3.8,5.4,2.5);T(c.s,'Als Zahl gespeichert',7.45,3.95,4.9,0.5,{fontSize:16,bold:true,color:GRAY});
 ['165','172','158'].forEach((t,i)=>tile(c.s,7.45+i*1.65,4.6,1.5,0.7,t,NEON,INK,17));
 badge(c.s,'Durchschnitt = 165',7.45,5.55,4.9,0.55,DEEP,NEON,15);
}
// 7 Sortieren
{const c=mk('LIGHT','Warum Datentypen: Sortieren');
 std(c,'Sortieren',[['Als Text wird ',0],['falsch sortiert.',1]],'Nach dem ersten Zeichen: „10“ beginnt wie „1“. Für Text ist das korrekt.',40);
 card(c,7.2,1.0,5.4,2.4);T(c.s,'Als Text sortiert',7.45,1.15,4.9,0.5,{fontSize:16,bold:true,color:GRAY});
 ['1','10','100','2','20','3'].forEach((t,i)=>tile(c.s,7.4+i*0.85,1.9,0.75,0.8,t,i===1||i===2?'FFD9C7':CHIP,INK,18));
 T(c.s,'sieht falsch aus',7.45,2.85,4.9,0.4,{fontSize:14,color:GRAY});
 card(c,7.2,3.8,5.4,2.4);T(c.s,'Als Zahl sortiert',7.45,3.95,4.9,0.5,{fontSize:16,bold:true,color:GRAY});
 ['1','2','3','10','20','100'].forEach((t,i)=>tile(c.s,7.4+i*0.85,4.7,0.75,0.8,t,NEON,INK,16));
 T(c.s,'so erwartest du es',7.45,5.65,4.9,0.4,{fontSize:14,color:GRAY});
}
// 8 Fehler vermeiden
{const c=mk('LIGHT','Warum Datentypen: Fehler vermeiden');
 std(c,'Fehler vermeiden',[['Der richtige Typ ',0],['verhindert Unsinn.',1]],'Ein Datumsfeld lässt kein „31. Februar“ zu. Ein Textfeld nimmt alles.',40);
 T(c.s,'Datumsfeld',7.2,1.0,4,0.4,{fontSize:15,bold:true});
 c.s.addShape(S.roundRect,{x:7.2,y:1.5,w:3.2,h:0.85,rectRadius:0.1,fill:{color:CARD},line:{color:ORANGE,width:3}});T(c.s,'31. Februar',7.4,1.5,2.8,0.85,{fontSize:18,valign:'middle'});
 bubble(c.s,'ungültig!',10.6,1.5,2.0,0.85,ORANGE,INK,16);
 T(c.s,'Textfeld',7.2,3.2,4,0.4,{fontSize:15,bold:true});
 c.s.addShape(S.roundRect,{x:7.2,y:3.7,w:3.2,h:0.85,rectRadius:0.1,fill:{color:CARD},line:{color:LINE,width:3}});T(c.s,'Banane',7.4,3.7,2.8,0.85,{fontSize:18,valign:'middle'});
 bubble(c.s,'wird akzeptiert',10.6,3.7,2.0,0.85,CHIP,INK,14);
 T(c.s,'Beim Datumsfeld prüft die Datenbank, ob das Datum existiert.',7.2,5.2,5.4,1.0,{fontSize:16,color:GRAY});
}
// 9 Text
{const c=mk('LIGHT','1. Text');
 std(c,'1 · Text',[['Text speichert Buchstaben, Ziffern und ',0],['Sonderzeichen.',1]],'Auch genannt: String oder Zeichenkette.',36);
 c.s.addShape(S.roundRect,{x:7.2,y:1.0,w:5.4,h:2.0,rectRadius:0.15,fill:{color:DEEP},line:{color:DEEP,width:0}});T(c.s,'„Anna Huber“',7.2,1.0,5.4,2.0,{fontSize:36,bold:true,color:NEON,align:'center',valign:'middle'});
 [['Namen',0],['Adressen',1],['E-Mail-Adressen',2],['Beschreibungen',3]].forEach(([t,i])=>tile(c.s,7.2+(i%2)*2.8,3.4+Math.floor(i/2)*1.1,2.6,0.9,t,i%3===0?NEON:CHIP,INK,16));
 T(c.s,'geeignet für',7.2,3.0,5.4,0.4,{fontSize:13,color:GRAY});
}
// 10 Telefonnummer
{const c=mk('LIGHT','Auch Telefonnummern sind Text');
 std(c,'1 · Text',[['Auch Telefonnummern sind ',0],['Text.',1]],'Du rechnest nicht damit. Bei Postleitzahlen ist es genauso.',40);
 card(c,7.2,1.0,5.4,1.9);badge(c.s,'Als Text',7.45,1.2,1.6,0.45,NEON,INK,14);T(c.s,'0664 1234567',7.45,1.8,4.9,0.9,{fontSize:34,bold:true,valign:'middle'});
 c.s.addShape(S.roundRect,{x:7.2,y:3.2,w:5.4,h:1.9,rectRadius:0.15,fill:{color:CARD},line:{color:ORANGE,width:3}});badge(c.s,'Als Zahl',7.45,3.4,1.6,0.45,ORANGE,INK,14);T(c.s,'664 1234567',7.45,4.0,4.9,0.9,{fontSize:34,bold:true,valign:'middle',color:GRAY});
 T(c.s,'die führende Null geht verloren',9.3,3.4,3.2,0.45,{fontSize:13,color:GRAY,align:'right'});
 c.s.addShape(S.roundRect,{x:7.2,y:5.4,w:5.4,h:0.85,rectRadius:0.4,fill:{color:DEEP},line:{color:DEEP,width:0}});T(c.s,'Rechnest du nicht damit? Dann meist Text.',7.2,5.4,5.4,0.85,{fontSize:16,bold:true,color:NEON,align:'center',valign:'middle'});
}
// 11 Ganzzahl
{const c=mk('LIGHT','2. Ganzzahl');
 std(c,'2 · Ganzzahl',[['Ganzzahlen',1],[' haben kein Komma.',0]],'Englisch: Integer. Mit ihnen kannst du rechnen, vergleichen und sortieren.',42);
 ln(c.s,7.3,2.4,5.2,0,DEEP,4,{endArrowType:'triangle'});
 [0,1,2,3,4,5].forEach(i=>{const x=7.5+i*0.9;ln(c.s,x,2.3,0,0.2,DEEP,3);dot(c.s,x,2.4,i===3?0.4:0.2,i===3?NEON:DEEP,i===3?DEEP:null);T(c.s,String(i),x-0.3,2.7,0.6,0.4,{fontSize:15,bold:true,align:'center'});});
 [['3','Geschwister'],['17','Jahre alt'],['5','Tore']].forEach(([v,l],i)=>{const y=3.7+i*0.95;tile(c.s,7.2,y,1.5,0.75,v,NEON,INK,22);T(c.s,l,8.95,y,3.5,0.75,{fontSize:18,valign:'middle'});});
}
// 12 Kommazahl
{const c=mk('LIGHT','3. Kommazahl');
 std(c,'3 · Kommazahl',[['Kommazahlen',1],[' haben Nachkommastellen.',0]],'Englisch: Float oder Double.',38);
 [['1,65','Körpergröße in Metern'],['48,7','Gewicht in Kilogramm'],['2,3','Durchschnittsnote']].forEach(([v,l],i)=>{const y=1.0+i*1.1;card(c,7.2,y,5.4,0.95);tile(c.s,7.4,y+0.12,1.5,0.7,v,NEON,INK,20);T(c.s,l,9.1,y,3.4,0.95,{fontSize:16,valign:'middle'});});
 T(c.s,'Achtung beim Komma',7.2,4.45,5.4,0.4,{fontSize:15,bold:true});
 card(c,7.2,4.95,2.6,1.35);T(c.s,'Programme & Datenbanken',7.3,5.0,2.4,0.6,{fontSize:12,color:GRAY,align:'center'});T(c.s,'1.65',7.2,5.55,2.6,0.6,{fontSize:26,bold:true,align:'center'});
 card(c,10.0,4.95,2.6,1.35);T(c.s,'Deutsches Excel',10.1,5.0,2.4,0.6,{fontSize:12,color:GRAY,align:'center'});T(c.s,'1,65',10.0,5.55,2.6,0.6,{fontSize:26,bold:true,align:'center'});
}
// 13 Waehrung
{const c=mk('LIGHT','Kommazahl: Währung');
 std(c,'3 · Kommazahl',[['Für Geld gibt es ',0],['einen eigenen Typ.',1]],'Währung: genau auf zwei Nachkommastellen – damit bei Cent-Beträgen keine kleinen Fehler entstehen.',40,4.8);
 ['1','2',',','5','0'].forEach((t,i)=>tile(c.s,7.4+i*1.0,2.0,0.9,1.3,t,i>=3?NEON:CHIP,INK,i===2?36:40));
 T(c.s,'€',12.4,2.0,0.5,1.3,{fontSize:32,bold:true,valign:'middle'});
 ln(c.s,10.4,3.55,1.9,0,GREEN,4);T(c.s,'genau 2 Nachkommastellen',9.6,3.7,3.4,0.5,{fontSize:15,bold:true,color:GREEN,align:'center'});
 card(c,7.2,4.7,5.4,1.4);T(c.s,'Beispiel: 12,50 € – ohne Rundungsfehler bei den Cent.',7.45,4.7,4.9,1.4,{fontSize:17,valign:'middle'});
}
// 14 Datum
{const c=mk('LIGHT','4. Datum und Uhrzeit');
 std(c,'4 · Datum und Uhrzeit',[['Die Datenbank kennt ',0],['den Kalender.',1]],'Englisch: Date und Time. Sie rechnet Tage aus und berechnet dein Alter automatisch.',38);
 c.s.addShape(S.roundRect,{x:7.2,y:1.0,w:5.4,h:5.1,rectRadius:0.15,fill:{color:CARD},line:{color:LINE,width:1.25}});
 c.s.addShape(S.roundRect,{x:7.2,y:1.0,w:5.4,h:0.8,rectRadius:0.15,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Februar',7.45,1.0,3,0.8,{fontSize:20,bold:true,color:NEON,valign:'middle'});
 for(let d=1;d<=28;d++){const i=d-1,x=7.35+(i%7)*0.75,y=2.0+Math.floor(i/7)*0.72;tile(c.s,x,y,0.66,0.6,String(d),d===28?NEON:CHIP,INK,13);}
 c.s.addShape(S.roundRect,{x:7.35,y:4.95,w:0.66,h:0.6,rectRadius:0.12,fill:{color:CARD},line:{color:GREEN,width:2,dashType:'dash'}});T(c.s,'29?',7.35,4.95,0.66,0.6,{fontSize:13,bold:true,color:GREEN,align:'center',valign:'middle'});
 T(c.s,'28 oder 29 Tage – das weiß die Datenbank.',8.2,4.95,4.3,0.6,{fontSize:15,valign:'middle'});
}
// 15 Ja/Nein
{const c=mk('LIGHT','5. Ja/Nein');
 std(c,'5 · Ja/Nein',[['Ja/Nein kennt nur ',0],['zwei Werte.',1]],'Englisch: Boolean – auch Kontrollkästchen genannt. Fast kein Speicherplatz, ideal zum Filtern.',40);
 T(c.s,'Gebühr bezahlt?',7.2,0.9,5.4,0.5,{fontSize:18,bold:true});
 [['Anna',true],['Ben',false],['Clara',true],['David',false]].forEach(([n,ok],i)=>{const y=1.5+i*0.95;
   c.s.addShape(S.roundRect,{x:7.2,y,w:5.4,h:0.8,rectRadius:0.12,fill:{color:ok?CARD:'FFEBDD'},line:{color:ok?LINE:ORANGE,width:2}});
   c.s.addShape(S.roundRect,{x:7.45,y:y+0.15,w:0.5,h:0.5,rectRadius:0.08,fill:{color:ok?NEON:CARD},line:{color:DEEP,width:2.5}});if(ok)check(c.s,7.5,y+0.18,0.4);
   T(c.s,n,8.25,y,3,0.8,{fontSize:18,valign:'middle'});});
 c.s.addShape(S.roundRect,{x:7.2,y:5.4,w:5.4,h:0.85,rectRadius:0.4,fill:{color:DEEP},line:{color:DEEP,width:0}});T(c.s,'Zeige mir alle, die noch nicht bezahlt haben.',7.2,5.4,5.4,0.85,{fontSize:15,bold:true,color:NEON,align:'center',valign:'middle'});
}
// 16 Weitere
{const c=mk('LIGHT','6. Weitere Datentypen');
 std(c,'6 · Weitere Datentypen',[['Je nach Programm gibt es ',0],['noch mehr.',1]],'Zum Beispiel für Links, Bilder, feste Auswahl und automatische Zähler.',40);
 [['Hyperlink','Internetadressen zum Anklicken','www'],['Anlage / Bild','Fotos oder Dokumente','IMG'],['Auswahlliste','nur 1a, 1b oder 1c erlaubt','1a'],['AutoWert','zählt automatisch hoch','+1']].forEach(([t,d,g],i)=>{
   const x=7.2+(i%2)*2.8,y=1.0+Math.floor(i/2)*2.85;card(c,x,y,2.6,2.65);dot(c.s,x+0.7,y+0.75,0.9,DEEP);T(c.s,g,x+0.25,y+0.45,0.9,0.6,{fontSize:15,bold:true,color:NEON,align:'center',valign:'middle'});
   T(c.s,t,x+0.25,y+1.4,2.2,0.45,{fontSize:17,bold:true});T(c.s,d,x+0.25,y+1.85,2.2,0.75,{fontSize:13,color:GRAY});});
}
// 17 Primaerschluessel
{const c=mk('LIGHT','Der Primärschlüssel');
 std(c,'Der Primärschlüssel',[['Jeder Datensatz bekommt ',0],['eine eigene ID.',1]],'Es kann zwei „Anna Huber“ geben – die ID 17 gehört nur einer von beiden.',38);
 table(c.s,7.3,2.1,[1.2,2.0,2.0],[['ID','Vorname','Nachname'],['17','Anna','Huber'],['24','Anna','Huber'],['25','Ben','Maier']],{hiCol:0,hiHdr:GREEN,rh:0.8,size:17});
 dot(c.s,7.65,1.5,0.5,NEON,DEEP);ln(c.s,7.9,1.5,0.7,0,DEEP,3);ln(c.s,8.35,1.5,0,0.2,DEEP,3);ln(c.s,8.55,1.5,0,0.15,DEEP,3);
 T(c.s,'Primärschlüssel',8.8,1.25,3.8,0.5,{fontSize:16,bold:true,color:GREEN});
 badge(c.s,'Meist: Ganzzahl, automatisch hochgezählt',7.3,5.5,5.2,0.6,CHIP,INK,14);
}
// 18 Mitdenken
{const c=mk('LIGHT','Zum Mitdenken – Video pausieren');
 std(c,'Zum Mitdenken',[['Welche ',0],['Datentypen',1],[' passen?',0]],'Pausiere das Video und probiere es selbst.',44,4.6);
 ['ID','Vor- und Nachname','Geburtsdatum','Klasse (z. B. „2b“)','Körpergröße in Metern','Anzahl der Geschwister','Telefonnummer der Eltern','Angemeldet zur Skiwoche'].forEach((t,i)=>{
   const y=0.85+i*0.72;card(c,7.2,y,5.4,0.62);T(c.s,t,7.4,y,3.4,0.62,{fontSize:14,valign:'middle'});
   c.s.addShape(S.roundRect,{x:10.9,y:y+0.09,w:1.5,h:0.44,rectRadius:0.1,fill:{color:NEON},line:{color:DEEP,width:1.5,dashType:'dash'}});T(c.s,'?',10.9,y+0.09,1.5,0.44,{fontSize:16,bold:true,align:'center',valign:'middle'});});
}
// 19 Aufloesung
{const c=mk('LIGHT','Auflösung');
 std(c,'Auflösung',[['Hast du bei der Telefonnummer ',0],['richtig gelegen?',1]],'Text – denn du rechnest nicht damit.',38,4.6);
 [['ID','Ganzzahl (AutoWert)'],['Vor- und Nachname','Text'],['Geburtsdatum','Datum'],['Klasse','Text / Auswahlliste'],['Körpergröße (m)','Kommazahl'],['Geschwister','Ganzzahl'],['Telefon der Eltern','Text'],['Skiwoche angemeldet','Ja/Nein']].forEach(([t,ty],i)=>{
   const y=0.85+i*0.72,hot=i===6;c.s.addShape(S.roundRect,{x:7.2,y,w:5.4,h:0.62,rectRadius:0.12,fill:{color:CARD},line:{color:hot?GREEN:LINE,width:hot?3:1.25}});
   T(c.s,t,7.4,y,2.7,0.62,{fontSize:14,valign:'middle'});badge(c.s,ty,10.0,y+0.08,2.45,0.46,hot?NEON:CHIP,INK,13);});
}
// 20 Fehler
{const c=mk('LIGHT','Häufige Fehler');
 std(c,'Häufige Fehler',[['Drei typische ',0],['Fehler.',1]],null,46);
 [['Alles als Text speichern','Später klappen Sortieren, Filtern und Rechnen nicht richtig.'],['Zahl statt Text wählen','Zum Beispiel bei der Telefonnummer.'],['Das Datum als Text schreiben','„5. März“: Die Datenbank kann nicht ausrechnen, was davor oder danach liegt.']].forEach(([t,d],i)=>{
   const y=1.0+i*1.95;card(c,7.2,y,5.4,1.75);dot(c.s,7.75,y+0.6,0.7,DEEP);xmark(c.s,7.55,y+0.4,0.4);T(c.s,t,8.3,y+0.2,4.2,0.55,{fontSize:17,bold:true});T(c.s,d,8.3,y+0.85,4.2,0.85,{fontSize:14,color:GRAY});});
}
// 21 Zusammenfassung
{const c=mk('DARK','Zusammenfassung');
 std(c,'Zusammenfassung',[['Das hast du ',0],['gelernt.',1]],'Der richtige Datentyp verhindert Fehler und ermöglicht Rechnen, Sortieren und Filtern.',46,4.4);
 [['Text','Anna · 0664 1234567'],['Ganzzahl','3 · 17 · 2025'],['Kommazahl','1,65 · 48,7'],['Datum / Uhrzeit','12.03.2012'],['Ja/Nein','angemeldet: ja']].forEach(([t,e],i)=>{
   const y=0.9+i*1.2;card(c,7.2,y,5.4,1.0);badge(c.s,t,7.4,y+0.2,2.3,0.6,NEON,INK,15);T(c.s,e,9.9,y,2.6,1.0,{fontSize:15,color:BG,valign:'middle'});});
}
// 22 Merksatz
{const c=mk('NEON','Merksatz');
 kicker(c,'Merk dir');
 head(c,[['Rechnest du damit? Dann ist es eine Zahl. Rechnest du nicht damit? Dann meist Text.',0]],0.7,1.4,11.9,3.0,46);
 tile(c.s,0.7,5.0,3.6,1.1,'1,65 → Zahl',DEEP,NEON,24);tile(c.s,4.6,5.0,3.6,1.1,'0664 → Text',CARD,INK,24);
}
// 23 Outro
{const c=mk('NEON','Outro');
 dot(c.s,12.4,1.4,3.2,NEON,DEEP);dot(c.s,12.4,1.4,1.8,NEON,DEEP);dot(c.s,12.4,1.4,0.5,DEEP);
 kicker(c,'Bis zum nächsten Mal');
 head(c,[['Hat dir das Video gefallen? Lass gern ein Abo da.',0]],0.7,1.25,9.2,2.6,48);
 sub(c,'Im nächsten Video bauen wir gemeinsam eine kleine Datenbank auf.',0.7,4.0,8.6,1.4,24);
 c.s.addShape(S.roundRect,{x:0.7,y:5.6,w:8.4,h:0.95,rectRadius:0.2,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Mehr Videos auf Cleverbox',0.7,5.6,8.4,0.95,{fontSize:22,bold:true,color:NEON,align:'center',valign:'middle'});
}
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',n);})();
