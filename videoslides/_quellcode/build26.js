const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='EFFBDC', CARD='FBFFF4', INK='0E1F0C', GREEN='26720A', NEON='B1FF37', DEEP='12301A',
  GRAY='5B6B50', LINE='B8D98A', CHIP='DDF3B8', TAB2='EAF8CF', DEEP2='1B4527', DEEPLINE='2F6B3E', DSUB='A9C79A';
const FONT='Poppins';
const THEME={name:'Cleverbox Gruen',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='Programmieren lernen – Denken vor Syntax';
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



const OUT='/home/user/claudecloud/videoslides/cleverbox-programmieren-denken-slides.pptx';
const N={};
function robot(s,x,y,sz,o={}){ // x,y = links oben, sz = Breite
  const b=o.body||DEEP,e=o.eye||NEON;
  s.addShape(S.line,{x:x+sz*0.5,y:y-sz*0.12,w:0,h:sz*0.14,line:{color:b,width:3}});
  dot(s,x+sz*0.5,y-sz*0.14,sz*0.12,e,b);
  s.addShape(S.roundRect,{x,y,w:sz,h:sz*0.78,rectRadius:sz*0.18,fill:{color:b},line:{color:b,width:0}});
  dot(s,x+sz*0.3,y+sz*0.34,sz*0.18,e);dot(s,x+sz*0.7,y+sz*0.34,sz*0.18,e);
  s.addShape(S.roundRect,{x:x+sz*0.28,y:y+sz*0.56,w:sz*0.44,h:sz*0.08,rectRadius:0.03,fill:{color:e},line:{color:e,width:0}});
}
function grid(s,x,y,cols,rows,cs,o={}){
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)s.addShape(S.rect,{x:x+c*cs,y:y+r*cs,w:cs,h:cs,fill:{color:(r+c)%2?(o.a||CHIP):(o.b||CARD)},line:{color:LINE,width:1}});
}
function codeWin(s,x,y,w,h,title,lines,o={}){
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:DEEP},line:{color:DEEP,width:0}});
  [0,1,2].forEach(i=>dot(s,x+0.3+i*0.28,y+0.3,0.16,[NEON,'6FCF3C',LINE][i]));
  T(s,title,x+1.3,y+0.1,w-1.5,0.4,{fontSize:12,color:DSUB,valign:'middle'});
  lines.forEach((l,i)=>T(s,l[0],x+0.4,y+0.85+i*0.62,w-0.8,0.5,{fontSize:o.size||18,fontFace:'Courier New',bold:true,color:l[1]||NEON,valign:'middle'}));
}
function steps(c,hi,items,x=7.2,y0=1.0,gap=1.15,h=0.95,w=5.4){
  items.forEach((t,i)=>{const y=y0+i*gap,on=hi.includes(i);card(c,x,y,w,h);
    if(on)c.s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.15,fill:{color:NEON},line:{color:DEEP,width:2.5}});
    circleNum(c.s,i+1,x+0.2,y+(h-0.55)/2,0.55,on?DEEP:CHIP,on?NEON:GRAY);
    T(c.s,t,x+1.0,y,w-1.15,h,{fontSize:16,bold:true,valign:'middle',color:on?INK:GRAY});});
}
const MUSTER=['Beste Programmiersprache suchen','Video eines Verfechters ansehen','Tutorial für diese Sprache suchen','Entwicklungsumgebung installieren','Mit „Hallo Welt“ beginnen'];
function brow(c,y,txt,tx,fill=CARD){card(c,7.2,y,5.4,1.05,fill);}
// 1
{const c=mk('DARK','Folie 1');
 kicker(c,'Hand aufs Herz',0.7,1.2);head(c,[['Programmieren lernen angefangen – ',false],['und wieder aufgehört?',true]],0.7,1.75,6.2,3.2,40);
 sub(c,'Wie viele von euch kennen das?',0.7,5.2,6,0.8,20);
 card(c,7.6,1.0,4.9,5.2,DEEP2,DEEPLINE);
 dot(c.s,10.05,3.1,2.4,NEON);T(c.s,'?',8.85,1.9,2.4,2.4,{fontSize:100,bold:true,color:DEEP,align:'center',valign:'middle'});
 bubble(c.s,'Und dann wieder aufgehört?',8.1,4.9,3.9,0.95,CARD,INK,16);
}
// 2
{const c=mk('LIGHT','Folie 2');
 kicker(c,'Das typische Muster',0.7,1.2);head(c,[['Immer dasselbe ',false],['Muster',true]],0.7,1.75,6.2,2.4,42);
 sub(c,'So beginnen die meisten – und hören bald wieder auf.',0.7,4.3,5.8,1.2,20);
 steps(c,[],MUSTER,7.2,0.7,1.2,1.0);
}
// 3
{const c=mk('LIGHT','Folie 3');
 kicker(c,'Schritt 1 und 2',0.7,1.2);head(c,[['Welche Sprache ist ',false],['die beste?',true]],0.7,1.75,6.2,2.4,42);
 sub(c,'Ein Verfechter erklärt, warum seine Sprache die beste sei.',0.7,4.3,5.8,1.2,20);
 steps(c,[0,1],MUSTER,7.2,0.7,1.2,1.0);
}
// 4
{const c=mk('LIGHT','Folie 4');
 kicker(c,'Schritt 3 bis 5',0.7,1.2);head(c,[['Tutorial, ',false],['Installation',true],[', Hallo Welt',false]],0.7,1.75,6.2,2.6,40);
 sub(c,'Dann folgt das Tutorial dieser Sprache.',0.7,4.5,5.8,1.2,20);
 steps(c,[2,3,4],MUSTER,7.2,0.7,1.2,1.0);
}
// 5
{const c=mk('LIGHT','Folie 5');
 kicker(c,'Der erste Anlauf',0.7,1.2);head(c,[['Ewig nach ',false],['Tippfehlern',true],[' suchen',false]],0.7,1.75,5.9,2.6,38);
 sub(c,'Womöglich funktioniert es gar nicht auf Anhieb.',0.7,4.5,5.8,1.2,20);
 codeWin(c.s,7.0,1.2,5.6,3.4,'hallo.py',[['print("Hallo Welt)',NEON],['',NEON],['Fehler in Zeile 1',ORANGE]],{size:20});
 bubble(c.s,'Wo ist der Fehler?',8.6,5.0,3.6,0.9,CARD,INK,16);
}
// 6
{const c=mk('NEON','Folie 6');
 kicker(c,'Das Ergebnis',0.7,1.2);head(c,[['Nach 2 Stunden: ',false],['absolut nichts gelernt',false]],0.7,1.75,6.2,3.0,40);
 tile(c.s,7.2,1.1,5.4,1.4,'2 Stunden vergangen',CARD,INK,20);
 tile(c.s,7.2,2.8,5.4,1.4,'Ein „Hallo Welt“-Programm',CARD,INK,20);
 tile(c.s,7.2,4.5,5.4,1.4,'Gelernt: gar nichts',DEEP,NEON,22);
 arrow(c.s,S.downArrow,9.65,2.55,0.5,0.25,DEEP);arrow(c.s,S.downArrow,9.65,4.25,0.5,0.25,DEEP);
}
// 7
{const c=mk('LIGHT','Folie 7');
 kicker(c,'Das Problem',0.7,1.2);head(c,[['Tutorials starten bei der ',false],['Syntax',true]],0.7,1.75,6.2,2.8,40);
 sub(c,'Nicht bei den Grundlagen, sondern bei der Schreibweise einer bestimmten Programmiersprache.',0.7,4.7,5.8,1.6,18);
 tile(c.s,7.2,1.0,5.4,1.5,'Syntax einer Programmiersprache',NEON,INK,20);
 c.s.addShape(S.roundRect,{x:7.2,y:3.9,w:5.4,h:1.5,rectRadius:0.12,fill:{color:CARD},line:{color:ORANGE,width:2.5,dashType:'dash'}});
 T(c.s,'Grundlagen: das Denken dahinter',7.4,3.9,5.0,1.5,{fontSize:20,bold:true,color:GRAY,valign:'middle',align:'center'});
 arrow(c.s,S.downArrow,9.65,2.65,0.5,0.9,GREEN);badge(c.s,'wird übersprungen',9.0,5.6,1.8,0.45,ORANGE,'FFFFFF',13);
}
// 8 optional
{const c=mk('LIGHT','Folie 8 (optional) – Erklärung Syntax');
 kicker(c,'Optional: Erklärung',0.7,1.2);head(c,[['Was ist ',false],['Syntax',true],['?',false]],0.7,1.75,6.2,2.2,44);
 sub(c,'Die Regeln der Schreibweise einer Programmiersprache, vergleichbar mit der Grammatik einer Sprache.',0.7,4.3,5.8,2.0,18);
 card(c,7.2,1.0,5.4,2.3);T(c.s,'Grammatik',7.5,1.15,4.8,0.5,{fontSize:14,bold:true,color:GREEN});T(c.s,'Ich gehe nach Hause.',7.5,1.8,4.8,1.2,{fontSize:22,bold:true,valign:'middle'});
 codeWin(c.s,7.2,3.6,5.4,2.3,'Syntax',[['print("Hallo Welt")',NEON]],{size:20});
}
// 9
{const c=mk('LIGHT','Folie 9');
 kicker(c,'Falscher Beginn',0.7,1.2);head(c,[['Das ist der ',false],['falsche',true],[' Beginn',false]],0.7,1.75,6.2,2.6,44);
 sub(c,'Mit der Syntax einer Sprache in die Programmierung einzusteigen.',0.7,4.5,5.8,1.6,20);
 card(c,7.2,1.3,5.4,3.6);tile(c.s,7.6,1.8,4.6,1.4,'Mit Syntax starten',CHIP,INK,22);xmark(c.s,9.2,3.3,1.4);
}
// 10
{const c=mk('LIGHT','Folie 10');
 kicker(c,'Natürlich wichtig',0.7,1.2);head(c,[['Syntax ist wichtig – aber ',false],['nicht der erste Schritt',true]],0.7,1.75,6.2,3.2,38);
 steps(c,[0],['Denkprozesse verstehen','Syntax einer Sprache lernen'],7.2,1.6,1.5,1.1);
 arrow(c.s,S.downArrow,9.65,2.7,0.5,0.45,GREEN);
}
// 11
{const c=mk('DARK','Folie 11');
 kicker(c,'Wie im echten Leben',0.7,1.2);head(c,[['Erst ',false],['denken',true],[', dann schreiben',false]],0.7,1.75,6.2,2.6,42);
 sub(c,'So wie man nachdenkt, bevor man etwas schreibt oder sagt.',0.7,4.5,5.8,1.6,20);
 bubble(c.s,'Was will ich sagen?',7.4,1.2,4.8,1.3,CARD,INK,20);
 arrow(c.s,S.downArrow,9.65,2.75,0.5,0.8,NEON);
 tile(c.s,7.4,3.7,4.8,1.2,'Schreiben / Sagen',NEON,INK,20);
 T(c.s,'In der Programmierung: erst die Denkprozesse',7.4,5.2,4.8,0.9,{fontSize:15,color:DSUB,align:'center',valign:'middle'});
}
// 12
{const c=mk('LIGHT','Folie 12');
 kicker(c,'Danach',0.7,1.2);head(c,[['Erst wie ein Programmierer ',false],['denken',true]],0.7,1.75,6.2,2.8,40);
 sub(c,'Dann kannst du dir die Sprache aussuchen, die am besten zu dir passt.',0.7,4.7,5.8,1.6,20);
 tile(c.s,7.2,1.1,5.4,1.4,'Denken wie ein Programmierer',NEON,INK,20);arrow(c.s,S.downArrow,9.65,2.6,0.5,0.6,GREEN);
 tile(c.s,7.2,3.3,5.4,1.4,'Sprache aussuchen',CHIP,INK,20);arrow(c.s,S.downArrow,9.65,4.8,0.5,0.6,GREEN);
 tile(c.s,7.2,5.5,5.4,1.0,'Passt am besten zu dir',DEEP,NEON,18);
}
// 13
{const c=mk('NEON','Folie 13');
 kicker(c,'Mein Versprechen',0.7,1.2);head(c,[['Kein Jump and Run heute, ',false],['dafür langfristig weiter',false]],0.7,1.75,6.2,3.4,38);
 card(c,7.2,1.0,5.4,2.5);xmark(c.s,7.5,1.25,0.7);T(c.s,'Heute noch kein fertiges Jump-and-Run-Spiel',8.4,1.0,4.0,2.5,{fontSize:17,bold:true,valign:'middle'});
 card(c,7.2,3.9,5.4,2.7,DEEP,DEEP);check(c.s,7.5,4.2,0.8,NEON);T(c.s,'Langfristig lernen, wie ein Programmierer zu denken, statt Code abzutippen',8.5,3.9,3.9,2.7,{fontSize:17,bold:true,color:CARD,valign:'middle'});
}
// 14
{const c=mk('DARK','Folie 14');
 kicker(c,'Die Idee',0.7,1.2);head(c,[['Karel ',false],['the Robot',true]],0.7,1.75,6.2,2.2,48);
 sub(c,'Eine alte, aber richtig gute Idee.',0.7,4.2,5.8,1.2,22);
 grid(c.s,7.4,1.5,5,4,1.0,{a:DEEP2,b:'1F5230'});robot(c.s,8.55,2.75,0.8,{body:NEON,eye:DEEP});
}
// 15
{const c=mk('LIGHT','Folie 15');
 kicker(c,'So funktioniert es',0.7,1.2);head(c,[['Ein Roboter in einer ',false],['Welt aus Kästchen',true]],0.7,1.75,6.2,2.8,40);
 sub(c,'Gesteuert mit ein paar einfachen Befehlen.',0.7,4.7,5.8,1.2,20);
 grid(c.s,7.2,0.9,5,4,0.95);robot(c.s,7.25+0.95*1+0.07,0.9+0.95*2+0.18,0.8);
 c.s.addShape(S.star5,{x:7.2+0.95*4+0.18,y:0.9+0.95*0+0.18,w:0.6,h:0.6,fill:{color:NEON},line:{color:DEEP,width:2}});
 ['vorwärts','links','rechts'].forEach((t,i)=>badge(c.s,t,7.2+i*1.85,5.3,1.7,0.55,DEEP,NEON,15));
}
// 16
{const c=mk('LIGHT','Folie 16');
 kicker(c,'Bewährt',0.7,1.2);head(c,[['An Unis seit ',false],['Jahrzehnten',true]],0.7,1.75,6.2,2.6,44);
 sub(c,'Der klassische Einstieg in die Programmierung.',0.7,4.5,5.8,1.2,20);
 c.s.addShape(S.triangle,{x:7.6,y:1.0,w:4.6,h:1.2,fill:{color:DEEP},line:{color:DEEP,width:0}});
 c.s.addShape(S.rect,{x:7.8,y:2.2,w:4.2,h:0.3,fill:{color:NEON},line:{color:DEEP,width:2}});
 [0,1,2,3].forEach(i=>c.s.addShape(S.rect,{x:8.1+i*1.0,y:2.6,w:0.5,h:2.2,fill:{color:CHIP},line:{color:DEEP,width:2}}));
 c.s.addShape(S.rect,{x:7.6,y:4.8,w:4.6,h:0.4,fill:{color:DEEP},line:{color:DEEP,width:0}});
 badge(c.s,'Uni · Einstieg · seit Jahrzehnten',7.6,5.6,4.6,0.55,NEON,INK,15);
}
// 17
{const c=mk('LIGHT','Folie 17');
 kicker(c,'Das Problem',0.7,1.2);head(c,[['Download nötig – ',false],['kompliziert',true]],0.7,1.75,6.2,2.6,42);
 sub(c,'Vor allem für SchülerInnen in Schulen nervig.',0.7,4.5,5.8,1.2,20);
 c.s.addShape(S.roundRect,{x:7.2,y:1.1,w:5.4,h:3.6,rectRadius:0.12,fill:{color:CARD},line:{color:LINE,width:2}});
 c.s.addShape(S.roundRect,{x:7.2,y:1.1,w:5.4,h:0.7,rectRadius:0.12,fill:{color:DEEP},line:{color:DEEP,width:0}});c.s.addShape(S.rect,{x:7.21,y:1.5,w:5.38,h:0.3,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Installer',7.5,1.1,3,0.7,{fontSize:15,bold:true,color:NEON,valign:'middle'});
 T(c.s,'Version herunterladen und installieren …',7.5,2.2,4.8,0.8,{fontSize:16,color:INK,valign:'middle'});
 c.s.addShape(S.roundRect,{x:7.5,y:3.3,w:4.8,h:0.4,rectRadius:0.1,fill:{color:CHIP},line:{color:LINE,width:1}});
 c.s.addShape(S.roundRect,{x:7.5,y:3.3,w:2.0,h:0.4,rectRadius:0.1,fill:{color:GREEN},line:{color:GREEN,width:0}});
 badge(c.s,'nervig in der Schule',8.6,5.2,3.4,0.6,ORANGE,'FFFFFF',15);
}
// 18
{const c=mk('DARK','Folie 18');
 kicker(c,'Meine Alternative',0.7,1.2);head(c,[['Kostenlos ',false],['im Browser',true]],0.7,1.75,6.2,2.4,44);
 sub(c,'Läuft völlig kostenlos im Internet, ohne Download.',0.7,4.3,5.8,1.4,20);
 c.s.addShape(S.roundRect,{x:7.2,y:1.0,w:5.4,h:4.9,rectRadius:0.12,fill:{color:CARD},line:{color:LINE,width:2}});
 c.s.addShape(S.roundRect,{x:7.2,y:1.0,w:5.4,h:0.7,rectRadius:0.12,fill:{color:DEEP2},line:{color:DEEPLINE,width:1.5}});
 [0,1,2].forEach(i=>dot(c.s,7.5+i*0.28,1.35,0.16,[NEON,'6FCF3C',LINE][i]));
 c.s.addShape(S.roundRect,{x:8.6,y:1.15,w:3.8,h:0.4,rectRadius:0.1,fill:{color:CHIP},line:{color:LINE,width:1}});
 grid(c.s,8.0,2.0,4,3,0.95);robot(c.s,8.0+0.95*0+0.07,2.0+0.95*1+0.18,0.8);
 badge(c.s,'kostenlos',10.2,5.05,2.0,0.5,NEON,INK,15);
}
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',n);})();
