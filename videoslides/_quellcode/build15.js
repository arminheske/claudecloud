const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='EBCBE2', CARD='FBF1F8', INK='2B1027', GREEN='7A1F6B', NEON='F58AD2', DEEP='3D1636',
  GRAY='6B4A64', LINE='D3A0C6', CHIP='F3DDEC', TAB2='EFD5E7', DEEP2='55234C', DEEPLINE='8A4A7E', DSUB='E2B8D6';
const FONT='Poppins';
const THEME={name:'Cleverbox Rosa',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

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


const OUT='/home/user/claudecloud/videoslides/lingobox-erklaervideo-slides.pptx';
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


const N=[null,
"Hallo und herzlich willkommen zu diesem Video, in dem ich dir die Funktionsweise von unserem neuen komplett kostenlosen Tool Lingobox erkläre.",
"Kurz bevor wir starten. Derzeit haben 97% der Leute die unsere Videos schauen den Kanal noch nicht abonniert.",
"Wir laden hier aktuell wöchentlich zwei Lernvideos zu unterschiedlichen Fächern hoch und bieten somit kostenlosen Mehrwert für den Unterricht und fürs Lernen zu Hause.",
"Wenn ihr dieses kostenlose Angebot unterstützen wollt, lasst gerne ein kostenloses Abo hier auf YT da.",
"Lingobox ist das ultimative kostenlose Vokabeltool für den Unterricht.",
"Ihr könnt hier zum einen Vokabelsets für eure Schülerinnen anbieten oder den Schülern das Eintragen als Hausaufgabe geben, welche euch per Email direkt bestätigt wird.",
"Auch den Fortschritt können euch die Schüler jederzeit bequem und übersichtlich per Email zusenden.",
"Zudem bieten wir mit unserem neuen LiveModus, welcher sich gerade in der Beta Version befindet zum einen die Möglichkeit den Unterricht interaktiv und motivierend zu gestalten und zum anderen auch die Möglichkeit einen Vokabeltest Live über ein mobiles Endgerät abzuhalten.",
"Das alles sind Möglichkeiten, die unser Tool dir jetzt schon bietet und es wird laufend weiterentwickelt und auch du kannst deine Wünsche gerne einbringen.",
"Dafür könnt ihr gerne eine E-Mail an support@lingobox.at senden.",
"Wir wollen euch aber hier nicht mit einer stupiden Aufzählung von Funktionen verwirren, sondern euch lieber genau zeigen, wie ihr die Möglichkeiten, die euch diese völlig kostenlose Plattform bietet komplett nutzen könnt. Das ist nämlich eigentlich ganz einfach.",
"Zunächst zeige ich euch wie ihr euch ein Konto erstellt, dann wie ihr Sets anlegen oder importieren könnt.",
"Dann zeige ich euch wie ihr mit diesen Sets üben und euren Fortschritt verwalten könnt.",
"Dananch schauen wir uns den HÜ Modus an und wie ihr mit unserem Tool ganz einfach Hausaufgaben geben könnt und auch den Lernfortschritt eurer SchülerInnen im Auge behalten könnt.",
"Und am Ende zeige ich euch mit dem neuen LiveModus noch ein absolutes Highlight der Plattform."];
const mkn=(mode,i)=>mk(mode,'Folie '+i+' – Skript: '+N[i]);
function person(s,cx,y,w,o={}){const fill=o.fill||DEEP;
  s.addShape(S.ellipse,{x:cx-w*0.25,y,w:w*0.5,h:w*0.5,fill:{color:fill},line:{color:fill,width:0}});
  s.addShape(S.roundRect,{x:cx-w*0.5,y:y+w*0.58,w,h:w*0.62,rectRadius:w*0.28,fill:{color:fill},line:{color:fill,width:0}});}
function envelope(s,x,y,w,h,fill=CARD){s.addShape(S.rect,{x,y,w,h,fill:{color:fill},line:{color:DEEP,width:2.5}});s.addShape(S.triangle,{x:x+0.02,y:y+0.03,w:w-0.04,h:h*0.55,rotate:180,fill:{color:fill},line:{color:DEEP,width:2.5}});}
function agenda(c,hi,star){const items=['Konto erstellen','Sets anlegen oder importieren','Üben und Fortschritt verwalten','HÜ-Modus: Hausaufgaben und Lernfortschritt','LiveModus'];
  items.forEach((t,i)=>{const y=1.0+i*1.15,on=hi.includes(i);card(c,7.2,y,5.4,0.95);if(on)c.s.addShape(S.roundRect,{x:7.2,y,w:5.4,h:0.95,rectRadius:0.15,fill:{color:NEON},line:{color:DEEP,width:2.5}});
    circleNum(c.s,i+1,7.4,y+0.2,0.55,on?DEEP:CHIP,on?NEON:GRAY);T(c.s,t,8.2,y,4.3,0.95,{fontSize:16,bold:true,valign:'middle',color:on?INK:GRAY});
    if(star&&i===4)c.s.addShape(S.star5,{x:12.0,y:y+0.22,w:0.5,h:0.5,fill:{color:CARD},line:{color:DEEP,width:2}});});}

// 1 Willkommen
{const c=mkn('LIGHT',1);
 std(c,'Lingobox',[['Lingobox: das neue, ',0],['kostenlose',1],[' Vokabeltool.',0]],'Die Funktionsweise Schritt für Schritt erklärt.',40,5.0);
 bubble(c.s,'Hallo',7.3,1.2,2.4,1.2,CARD,INK,26);bubble(c.s,'Hello',10.0,2.0,2.5,1.2,NEON,INK,26);bubble(c.s,'Hola',8.2,3.4,2.2,1.1,CHIP,INK,24);
 c.s.addShape(S.roundRect,{x:7.2,y:5.0,w:5.4,h:1.1,rectRadius:0.25,fill:{color:DEEP},line:{color:DEEP,width:0}});T(c.s,'Lingobox',7.2,5.0,5.4,1.1,{fontSize:34,bold:true,color:NEON,align:'center',valign:'middle'});
}
// 2 97 %
{const c=mkn('LIGHT',2);
 std(c,'Kurz bevor wir starten',[['97 %',1],[' der Zuschauer:innen haben den Kanal noch nicht abonniert.',0]],null,38);
 card(c,7.2,1.2,5.4,4.6);
 T(c.s,'Wiedergabezeit von Abonnenten',7.5,1.45,4.8,0.5,{fontSize:17,bold:true});T(c.s,'Wiedergabezeit · Letzte 28 Tage',7.5,1.95,4.8,0.4,{fontSize:12,color:GRAY});
 [['Nutzer ohne Abo',97.0,'97,0 %'],['Abonnenten',3.0,'3,0 %']].forEach(([l,v,t],i)=>{const y=2.75+i*0.85;T(c.s,l,7.5,y,1.9,0.5,{fontSize:13});const w=Math.max(0.22,2.0*v/100);
   c.s.addShape(S.roundRect,{x:11.0-w,y:y+0.13,w,h:0.24,rectRadius:0.12,fill:{color:i?NEON:GREEN},line:{color:i?DEEP:GREEN,width:i?1.5:0}});T(c.s,t,11.1,y,1.3,0.5,{fontSize:14,bold:true,align:'right'});});
 c.s.addShape(S.roundRect,{x:7.5,y:4.75,w:2.4,h:0.6,rectRadius:0.3,fill:{color:CHIP},line:{color:CHIP,width:0}});T(c.s,'Mehr anzeigen',7.5,4.75,2.4,0.6,{fontSize:14,bold:true,align:'center',valign:'middle'});
}
// 3 zwei Videos pro Woche
{const c=mkn('LIGHT',3);
 std(c,'Das Angebot',[['Wöchentlich ',0],['zwei Lernvideos',1],[' zu verschiedenen Fächern.',0]],'Kostenloser Mehrwert für den Unterricht und fürs Lernen zu Hause.',36,4.8);
 ['Mo','Di','Mi','Do','Fr','Sa','So'].forEach((t,i)=>{const x=7.2+i*0.78,on=i===1||i===4;tile(c.s,x,1.2,0.7,1.2,'',on?NEON:CHIP);T(c.s,t,x,1.25,0.7,0.4,{fontSize:13,bold:true,align:'center'});
   if(on)c.s.addShape(S.triangle,{x:x+0.2,y:1.75,w:0.3,h:0.3,rotate:90,fill:{color:DEEP},line:{color:DEEP,width:0}});});
 badge(c.s,'2 Videos pro Woche',7.2,2.7,5.4,0.6,DEEP,NEON,16);
 card(c,7.2,3.7,2.6,2.3);person(c.s,8.5,4.0,0.9);T(c.s,'Unterricht',7.2,5.3,2.6,0.5,{fontSize:16,bold:true,align:'center'});
 card(c,10.0,3.7,2.6,2.3);c.s.addShape(S.triangle,{x:10.75,y:3.9,w:1.2,h:0.65,fill:{color:DEEP},line:{color:DEEP,width:0}});c.s.addShape(S.rect,{x:10.9,y:4.55,w:0.9,h:0.6,fill:{color:DEEP},line:{color:DEEP,width:0}});c.s.addShape(S.rect,{x:11.2,y:4.7,w:0.3,h:0.45,fill:{color:NEON},line:{color:NEON,width:0}});T(c.s,'Lernen zu Hause',10.0,5.3,2.6,0.5,{fontSize:16,bold:true,align:'center'});
}
// 4 Abo
{const c=mkn('LIGHT',4);
 std(c,'Unterstützen',[['Ein kostenloses ',0],['Abo',1],[' unterstützt das Angebot.',0]],'Hier auf YouTube.',40,4.9);
 c.s.addShape(S.roundRect,{x:7.3,y:2.0,w:5.2,h:1.4,rectRadius:0.7,fill:{color:DEEP},line:{color:DEEP,width:0}});dot(c.s,8.1,2.7,0.8,NEON);c.s.addShape(S.triangle,{x:7.85,y:2.45,w:0.5,h:0.45,rotate:180,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Abo',9.0,2.0,3.2,1.4,{fontSize:40,bold:true,color:NEON,valign:'middle'});
 badge(c.s,'kostenlos',8.3,3.9,3.2,0.7,NEON,INK,20);c.s.addShape(S.heart,{x:11.8,y:3.85,w:0.7,h:0.65,fill:{color:ORANGE},line:{color:DEEP,width:2}});
}
// 5 Vokabeltool
{const c=mkn('LIGHT',5);
 std(c,'Das Tool',[['Das ultimative kostenlose ',0],['Vokabeltool',1],[' für den Unterricht.',0]],null,40);
 card(c,7.3,1.3,3.1,2.3);T(c.s,'Haus',7.3,1.3,3.1,2.3,{fontSize:36,bold:true,align:'center',valign:'middle'});
 c.s.addShape(S.roundRect,{x:9.6,y:2.9,w:3.0,h:2.3,rectRadius:0.15,fill:{color:NEON},line:{color:DEEP,width:2}});T(c.s,'house',9.6,2.9,3.0,2.3,{fontSize:36,bold:true,align:'center',valign:'middle'});
 arrow(c.s,S.rightArrow,10.5,2.0,0.7,0.5,GREEN);
 badge(c.s,'Vokabeln lernen',7.3,5.5,5.3,0.7,DEEP,NEON,18);
}
// 6 Sets / Hausaufgabe
{const c=mkn('LIGHT',6);
 std(c,'Zwei Möglichkeiten',[['Sets anbieten',1],[' oder ',0],['Eintragen als Hausaufgabe.',1]],'Die Bestätigung kommt direkt per E-Mail.',36,4.9);
 card(c,7.2,1.0,5.4,2.7);T(c.s,'Vokabelsets anbieten',7.45,1.1,4.9,0.5,{fontSize:16,bold:true});person(c.s,7.95,1.85,0.8,{fill:GREEN});arrow(c.s,S.rightArrow,8.65,2.2,0.5,0.4,GREEN);
 [0,1].forEach(k=>c.s.addShape(S.roundRect,{x:9.3+k*0.15,y:1.85+k*0.15,w:1.1,h:0.8,rectRadius:0.1,fill:{color:k?NEON:CHIP},line:{color:DEEP,width:1.5}}));arrow(c.s,S.rightArrow,10.7,2.2,0.5,0.4,GREEN);[0,1,2].forEach(k=>person(c.s,11.3+k*0.4,1.85,0.4,{fill:DEEP}));T(c.s,'Schüler:innen',7.45,3.15,4.9,0.4,{fontSize:13,color:GRAY});
 card(c,7.2,4.0,5.4,2.7);T(c.s,'Eintragen als Hausaufgabe',7.45,4.1,4.9,0.5,{fontSize:16,bold:true});person(c.s,7.95,4.85,0.8,{fill:DEEP});arrow(c.s,S.rightArrow,8.65,5.2,0.5,0.4,GREEN);
 c.s.addShape(S.roundRect,{x:9.3,y:4.85,w:1.3,h:0.85,rectRadius:0.1,fill:{color:CHIP},line:{color:DEEP,width:1.5}});arrow(c.s,S.rightArrow,10.7,5.2,0.5,0.4,GREEN);envelope(c.s,11.35,4.95,1.0,0.7,NEON);T(c.s,'Bestätigung per E-Mail',7.45,6.1,4.9,0.4,{fontSize:13,color:GRAY});
}
// 7 Fortschritt per Mail
{const c=mkn('LIGHT',7);
 std(c,'Lernfortschritt',[['Der Fortschritt kommt ',0],['per E-Mail',1],[' zu euch.',0]],'Jederzeit, bequem und übersichtlich.',40,4.9);
 card(c,7.2,1.0,5.4,3.0);T(c.s,'Fortschritt (Beispiel)',7.45,1.1,4.9,0.5,{fontSize:15,bold:true,color:GRAY});
 [0.9,0.6,0.35].forEach((v,i)=>{const y=1.8+i*0.7;T(c.s,'Set '+(i+1),7.45,y,1.0,0.5,{fontSize:14,bold:true});c.s.addShape(S.roundRect,{x:8.5,y:y+0.1,w:3.8,h:0.3,rectRadius:0.15,fill:{color:CHIP},line:{color:CHIP,width:0}});c.s.addShape(S.roundRect,{x:8.5,y:y+0.1,w:3.8*v,h:0.3,rectRadius:0.15,fill:{color:i===0?GREEN:NEON},line:{color:i===0?GREEN:DEEP,width:1}});});
 person(c.s,7.9,4.6,0.9,{fill:DEEP});arrow(c.s,S.rightArrow,8.7,5.1,0.7,0.5,GREEN);envelope(c.s,9.6,4.9,1.1,0.8,NEON);arrow(c.s,S.rightArrow,10.85,5.1,0.7,0.5,GREEN);person(c.s,12.1,4.6,0.9,{fill:GREEN});T(c.s,'Schüler:in',7.2,6.2,2.0,0.4,{fontSize:13,color:GRAY});T(c.s,'Lehrkraft',11.4,6.2,1.5,0.4,{fontSize:13,color:GRAY});
}
// 8 LiveModus
{const c=mkn('LIGHT',8);
 std(c,'Neu: LiveModus',[['Interaktiv ',0],['und Vokabeltest live',1],[' auf dem Handy.',0]],'Der LiveModus ist gerade in der Beta-Version.',36,4.9);
 c.s.addShape(S.roundRect,{x:7.2,y:1.4,w:3.6,h:2.5,rectRadius:0.15,fill:{color:DEEP},line:{color:DEEP,width:0}});
 [0.8,1.4,1.1].forEach((h,i)=>c.s.addShape(S.rect,{x:7.6+i*1.0,y:3.6-h,w:0.8,h,fill:{color:i===1?NEON:CHIP},line:{color:NEON,width:0}}));badge(c.s,'LIVE',7.4,1.55,1.1,0.45,NEON,INK,14);
 T(c.s,'interaktiv und motivierend',7.2,4.05,3.6,0.7,{fontSize:15,bold:true,align:'center'});
 smallPhone(c.s,11.2,1.0,1.5,3.1);tile(c.s,11.4,1.35,1.1,0.7,'Haus?',NEON,INK,13);tile(c.s,11.4,2.2,1.1,0.55,'house',CHIP,INK,13);tile(c.s,11.4,2.85,1.1,0.55,'home',CHIP,INK,13);
 T(c.s,'Test live',11.0,4.2,1.9,0.5,{fontSize:15,bold:true,align:'center'});
 badge(c.s,'Beta',9.3,5.3,2.6,0.7,ORANGE,INK,20);
}
// 9 Weiterentwicklung
{const c=mkn('LIGHT',9);
 std(c,'Es geht weiter',[['Laufend weiterentwickelt – ',0],['deine Wünsche',1],[' zählen.',0]],'Das alles bietet das Tool schon jetzt.',38,4.9);
 [1,2,3].forEach(i=>{const h=0.9*i;c.s.addShape(S.rect,{x:7.2+(i-1)*1.8,y:5.8-h,w:1.7,h,fill:{color:i===3?NEON:CHIP},line:{color:DEEP,width:2}});});
 T(c.s,'jetzt schon',7.2,5.0,1.7,0.8,{fontSize:13,bold:true,align:'center'});T(c.s,'weiter-entwickelt',9.0,4.1,1.7,0.8,{fontSize:13,bold:true,align:'center'});T(c.s,'deine Wünsche',10.8,3.2,1.7,0.8,{fontSize:13,bold:true,align:'center'});
 bubble(c.s,'Mein Wunsch …',10.0,1.0,2.6,1.0,DEEP,NEON,15);c.s.addShape(S.star5,{x:11.3,y:2.4,w:0.6,h:0.6,fill:{color:NEON},line:{color:DEEP,width:2}});
}
// 10 Support-Mail
{const c=mkn('LIGHT',10);
 std(c,'Feedback',[['Wünsche per ',0],['E-Mail',1],[' senden.',0]],null,46);
 envelope(c.s,8.0,1.4,3.8,2.5,CARD);
 c.s.addShape(S.roundRect,{x:7.3,y:4.6,w:5.2,h:1.0,rectRadius:0.5,fill:{color:DEEP},line:{color:DEEP,width:0}});T(c.s,'support@lingobox.at',7.3,4.6,5.2,1.0,{fontSize:22,bold:true,color:NEON,align:'center',valign:'middle'});
}
// 11 nicht aufzaehlen sondern zeigen
{const c=mkn('LIGHT',11);
 std(c,'Unser Plan',[['Keine stupide Aufzählung – ',0],['genau zeigen,',1],[' wie es geht.',0]],'Das ist eigentlich ganz einfach.',38,4.9);
 card(c,7.2,1.1,2.5,3.6);[1.7,2.2,2.7,3.2].forEach((y,i)=>c.s.addShape(S.roundRect,{x:7.45,y,w:2.0-i*0.2,h:0.22,rectRadius:0.06,fill:{color:CHIP},line:{color:CHIP,width:0}}));xmark(c.s,8.15,3.7,0.8);T(c.s,'Aufzählung',7.2,1.2,2.5,0.4,{fontSize:15,bold:true,align:'center'});
 card(c,10.1,1.1,2.5,3.6);c.s.addShape(S.roundRect,{x:10.35,y:1.8,w:2.0,h:1.3,rectRadius:0.1,fill:{color:DEEP},line:{color:DEEP,width:0}});c.s.addShape(S.triangle,{x:11.05,y:2.15,w:0.6,h:0.6,rotate:90,fill:{color:NEON},line:{color:NEON,width:0}});check(c.s,11.0,3.4,0.7);T(c.s,'Zeigen',10.1,1.2,2.5,0.4,{fontSize:15,bold:true,align:'center'});
}
// 12-15 Agenda
{const c=mkn('LIGHT',12);std(c,'Das erwartet dich',[['Zuerst: ',0],['Konto',1],[' und ',0],['Sets.',1]],'Ein Konto erstellen, dann Sets anlegen oder importieren.',44,4.8);agenda(c,[0,1],false);}
{const c=mkn('LIGHT',13);std(c,'Das erwartet dich',[['Dann: ',0],['Üben',1],[' und ',0],['Fortschritt.',1]],'Mit den Sets üben und den Fortschritt verwalten.',44,4.8);agenda(c,[2],false);}
{const c=mkn('LIGHT',14);std(c,'Das erwartet dich',[['Danach: der ',0],['HÜ-Modus.',1]],'Hausaufgaben geben und den Lernfortschritt der Schüler:innen im Auge behalten.',44,4.8);agenda(c,[3],false);}
{const c=mkn('LIGHT',15);std(c,'Das erwartet dich',[['Am Ende: der ',0],['LiveModus.',1]],'Ein absolutes Highlight der Plattform.',44,4.8);agenda(c,[4],true);}
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',n);})();
