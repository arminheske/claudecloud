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

// 1 Hook
{const c=mk('LIGHT','Szene 1 – Hook (0:00)');
 kicker(c,'Digitale Grundbildung',0.7,1.2);
 head(c,[['Woher weiß TikTok eigentlich, was ',0],['du magst?',1]],0.7,1.75,6.2,3.3,40);
 sub(c,'Schon nach drei Videos wirkt der Feed, als würde er dich kennen.',0.7,5.3,6,1.2);
 [['Lenas Feed',7.2,0.8],['Jonas’ Feed',7.7,1.75],['Dein Feed',8.2,2.7]].forEach(([t,x,y])=>{
   win(c.s,x,y,4.4,4.0,{bar:'Für dich',tabs:[t]});});
 T(c.s,'Dein Feed',8.4,3.85,3.9,0.5,{fontSize:22,bold:true});
 badge(c.s,'Katzen',8.4,4.5,1.3,0.5);badge(c.s,'Minecraft',9.85,4.5,1.8,0.5);badge(c.s,'Kochrezepte',8.4,5.15,2.1,0.5);
 T(c.s,'Was zeigt dir die App – und warum?',8.4,5.95,3.9,0.5,{fontSize:14,color:GRAY});
}
// 2 Gedankenexperiment
{const c=mk('LIGHT','Szene 2 – Gedankenexperiment (0:20)');
 kicker(c,'Gedankenexperiment',0.7,1.2);
 head(c,[['Zwei Handys. Dieselbe App. ',0],['Zwei völlig verschiedene Feeds.',1]],0.7,1.75,6.2,3.3,38);
 sub(c,'Kein Zufall: Ein Algorithmus stellt jeden Feed einzeln zusammen.',0.7,5.3,6,1.2);
 const mk2=(x,y,label,tiles,shape)=>{
   smallPhone(c.s,x,y,2.5,4.7);
   tiles.forEach((t,i)=>{const ty=y+0.35+i*1.4;
     tile(c.s,x+0.25,ty,2.0,1.2,'',i===0?NEON:CHIP);
     if(shape==='heart')c.s.addShape(S.heart,{x:x+0.4,y:ty+0.2,w:0.5,h:0.45,fill:{color:i===0?DEEP:GREEN},line:{color:i===0?DEEP:GREEN,width:0}});
     else dot(c.s,x+0.65,ty+0.42,0.5,i===0?DEEP:GREEN);
     T(c.s,t,x+0.35,ty+0.68,1.8,0.45,{fontSize:14,bold:true,valign:'middle'});});
   T(c.s,label,x,y+4.85,2.5,0.4,{fontSize:16,bold:true,align:'center'});};
 mk2(7.2,0.9,'Handy A',['Tanz-Challenge','Choreo lernen','Duett-Tanz'],'heart');
 mk2(10.1,1.5,'Handy B',['Elfmeter-Highlights','Tor des Monats','Fußball-Tricks'],'ball');
 dot(c.s,9.85,3.5,0.7,DEEP);T(c.s,'≠',9.5,3.15,0.7,0.7,{fontSize:26,bold:true,color:NEON,align:'center',valign:'middle'});
}
// 3 Algorithmus = Rezept
{const c=mk('LIGHT','Szene 3 – Was ist ein Algorithmus? (0:45)');
 kicker(c,'Begriffsklärung',0.7,1.2);
 head(c,[['Ein Algorithmus ist ein ',0],['Rezept',1],[' – Schritt für Schritt.',0]],0.7,1.75,6.2,3.3,40);
 sub(c,'Das Besondere: Er lernt ständig dazu. Darum spricht man von einem Empfehlungssystem.',0.7,5.3,6,1.5,18);
 tile(c.s,8.0,0.95,1.8,0.7,'Infos über dich',NEON,INK,14);
 tile(c.s,10.0,0.95,1.8,0.7,'Millionen Videos',NEON,INK,14);
 arrow(c.s,S.downArrow,8.7,1.75,0.4,0.6);arrow(c.s,S.downArrow,10.7,1.75,0.4,0.6);
 c.s.addShape(S.roundRect,{x:8.1,y:2.45,w:3.6,h:0.3,rectRadius:0.1,fill:{color:DEEP},line:{color:DEEP,width:0}});
 c.s.addShape(S.roundRect,{x:8.3,y:2.65,w:3.2,h:1.7,rectRadius:0.5,fill:{color:DEEP},line:{color:DEEP,width:0}});
 c.s.addShape(S.roundRect,{x:7.75,y:2.9,w:0.55,h:0.25,rectRadius:0.1,fill:{color:DEEP},line:{color:DEEP,width:0}});
 c.s.addShape(S.roundRect,{x:11.5,y:2.9,w:0.55,h:0.25,rectRadius:0.1,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Algorithmus',8.3,2.65,3.2,1.7,{fontSize:22,bold:true,color:NEON,align:'center',valign:'middle'});
 arrow(c.s,S.downArrow,9.7,4.45,0.4,0.5);
 [1,2,3].forEach((k,i)=>{const x=7.45+i*1.75;tile(c.s,x,5.05,1.5,0.95,'',CARD);
   c.s.addShape(S.roundRect,{x,y:5.05,w:1.5,h:0.95,rectRadius:0.12,fill:{color:CARD},line:{color:LINE,width:1.5}});
   circleNum(c.s,k,x+0.1,5.15,0.4);T(c.s,'Video',x+0.55,5.15,0.9,0.4,{fontSize:14,bold:true,valign:'middle'});});
 T(c.s,'Deine Reihenfolge',7.45,6.15,5.0,0.4,{fontSize:16,bold:true,color:GREEN,align:'center'});
}
// 4a Geld
{const c=mk('LIGHT','Szene 4 – Das Ziel: Geld (1:20)');
 kicker(c,'Das Ziel');
 head(c,[['TikTok ist kostenlos. Bezahlt wird mit ',0],['deiner Zeit.',1]],0.7,1.25,11.9,1.7,44);
 sub(c,'Geld verdient TikTok vor allem mit Werbung.',0.7,3.0,11.9,0.5);
 // clock
 dot(c.s,2.45,4.7,1.9,CARD,DEEP);ln(c.s,2.45,3.95,0,0.75,DEEP,4);ln(c.s,2.45,4.7,0.55,0,DEEP,4);dot(c.s,2.45,4.7,0.18,GREEN);
 T(c.s,'Du bleibst länger',0.7,5.85,3.5,0.5,{fontSize:20,bold:true,align:'center'});
 arrow(c.s,S.rightArrow,4.4,4.45,0.6,0.5);
 // ads
 [0,1,2].forEach(i=>{const y=3.85+i*0.68;tile(c.s,5.35,y,2.6,0.55,'',CHIP);badge(c.s,'Anzeige',5.45,y+0.09,1.1,0.37,NEON,INK,12);T(c.s,'Werbung',6.7,y,1.2,0.55,{fontSize:14,valign:'middle',color:GRAY});});
 T(c.s,'Mehr Werbung',4.9,5.85,3.5,0.5,{fontSize:20,bold:true,align:'center'});
 arrow(c.s,S.rightArrow,8.6,4.45,0.6,0.5);
 // coins
 [3,2,1,0].forEach(i=>{c.s.addShape(S.ellipse,{x:10.0,y:4.95-i*0.38,w:1.7,h:0.6,fill:{color:NEON},line:{color:DEEP,width:2}});});
 T(c.s,'€',10.0,3.81,1.7,0.6,{fontSize:22,bold:true,align:'center',valign:'middle',color:DEEP});
 T(c.s,'Mehr Geld für TikTok',9.1,5.85,3.5,0.5,{fontSize:20,bold:true,align:'center'});
}
// 4b Endlos
{const c=mk('DARK','Szene 4 – Das Design (1:35)');
 kicker(c,'Das Design',0.7,1.2);
 head(c,[['Der Feed hat ',0],['kein Ende.',1]],0.7,1.75,6.2,2.5,46);
 sub(c,'Genau darauf ist die ganze App ausgelegt.',0.7,4.5,6,1.2);
 smallPhone(c.s,7.1,0.6,2.7,7.2);
 [0,1,2,3,4].forEach(i=>{tile(c.s,7.35,1.0+i*1.4,2.2,1.2,'',i===0?NEON:CHIP);dot(c.s,7.8,1.4+i*1.4,0.4,i===0?DEEP:GREEN);});
 // slot machine
 c.s.addShape(S.roundRect,{x:10.2,y:0.9,w:2.4,h:1.9,rectRadius:0.2,fill:{color:DEEP2},line:{color:NEON,width:2}});
 [0,1,2].forEach(i=>tile(c.s,10.4+i*0.7,1.2,0.6,0.9,'?',CARD,DEEP,24));
 T(c.s,'Spielautomat',10.2,2.2,2.4,0.4,{fontSize:15,color:NEON,bold:true,align:'center'});
 T(c.s,'Ungewissheit hält dich beim Wischen',10.2,2.9,2.4,0.9,{fontSize:15,color:BG,align:'center'});
 // push
 bubble(c.s,'Neues Video für dich!',10.2,4.2,2.4,0.9,NEON,INK,15);
 T(c.s,'Push-Mitteilungen',10.2,5.35,2.4,0.4,{fontSize:15,color:BG,align:'center'});
 // autoplay
 c.s.addShape(S.roundRect,{x:10.2,y:6.0,w:2.4,h:0.8,rectRadius:0.4,fill:{color:DEEP2},line:{color:NEON,width:2}});
 c.s.addShape(S.triangle,{x:10.45,y:6.2,w:0.4,h:0.4,rotate:90,fill:{color:NEON},line:{color:NEON,width:0}});
 T(c.s,'Autoplay',11.0,6.0,1.5,0.8,{fontSize:16,bold:true,color:NEON,valign:'middle'});
}
// 4c EU
{const c=mk('DARK','Szene 4 – EU-Kommission (2:00)');
 kicker(c,'Anfang 2026',0.7,1.2);
 head(c,[['Die EU-Kommission sieht einen ',0],['Verstoß',1],[' gegen EU-Recht.',0]],0.7,1.75,6.2,3.3,38);
 sub(c,'Vorläufige Feststellung. TikTok weist die Vorwürfe zurück.',0.7,5.3,6,1.2);
 const cx=9.9,cy=3.0,R=2.1;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;c.s.addShape(S.star5,{x:cx+R*Math.sin(a)-0.2,y:cy-R*Math.cos(a)-0.2,w:0.4,h:0.4,fill:{color:NEON},line:{color:NEON,width:0}});}
 c.s.addShape(S.roundRect,{x:cx-1.5,y:cy-1.05,w:3.0,h:2.1,rectRadius:0.2,fill:{color:CARD},line:{color:CARD,width:0}});
 c.s.addShape(S.triangle,{x:cx-0.3,y:cy-0.85,w:0.6,h:0.55,fill:{color:NEON},line:{color:DEEP,width:2}});
 T(c.s,'!',cx-0.3,cy-0.78,0.6,0.5,{fontSize:18,bold:true,color:DEEP,align:'center',valign:'middle'});
 T(c.s,'Vorläufig: Verstoß gegen EU-Recht',cx-1.35,cy-0.15,2.7,1.1,{fontSize:16,bold:true,color:INK,align:'center',valign:'middle'});
 ['Endloses Scrollen','Autoplay','Push-Mitteilungen','Empfehlungssystem'].forEach((t,i)=>{
   const x=7.2+(i%2)*2.75,y=5.5+Math.floor(i/2)*0.55;
   c.s.addShape(S.roundRect,{x,y,w:2.6,h:0.45,rectRadius:0.2,fill:{color:DEEP2},line:{color:NEON,width:1.5}});
   T(c.s,t,x,y,2.6,0.45,{fontSize:14,bold:true,color:NEON,align:'center',valign:'middle'});});
}
// 4d Waehrung
{const c=mk('DARK','Szene 4 – Aufmerksamkeit ist die Währung (2:25)');
 kicker(c,'Das Ziel');
 head(c,[['Das Ziel ist nicht, dass du dich gut fühlst. ',0],['Das Ziel ist, dass du bleibst.',1]],0.7,1.3,8.2,3.4,42);
 c.s.addShape(S.roundRect,{x:0.7,y:5.0,w:8.2,h:1.0,rectRadius:0.2,fill:{color:NEON},line:{color:NEON,width:0}});
 T(c.s,'Deine Aufmerksamkeit ist die Währung.',0.7,5.0,8.2,1.0,{fontSize:24,bold:true,color:INK,align:'center',valign:'middle'});
 // eye
 c.s.addShape(S.ellipse,{x:9.2,y:2.2,w:3.5,h:2.2,fill:{color:CARD},line:{color:NEON,width:3}});
 dot(c.s,10.95,3.3,1.6,NEON);dot(c.s,10.95,3.3,0.75,DEEP);dot(c.s,11.2,3.05,0.22,CARD);
 [[9.8,1.7],[10.9,1.45],[12.0,1.7]].forEach(([x,y],i)=>ln(c.s,x+0.1,y,0,0.35,NEON,3));
}
// 5 Signale
{const c=mk('LIGHT','Szene 5 – Die Signale (1:50)');
 kicker(c,'Die Signale');
 head(c,[['TikTok sammelt ',0],['drei Arten',1],[' von Signalen.',0]],0.7,1.2,11.9,1.0,40);
 const cols=[['Deine Aktionen',['Liken & Teilen','Kommentieren & Folgen','Wie lange du schaust','Was du wegwischst']],['Infos zum Video',['Beschreibung','Hashtags','Der verwendete Sound']],['Gerät & Konto',['Sprache','Land','Handymodell']]];
 cols.forEach(([t,items],i)=>{const x=0.7+i*4.05;card(c,x,2.4,3.8,3.4);
   dot(c.s,x+0.75,3.15,1.0,DEEP);
   if(i===0)c.s.addShape(S.heart,{x:x+0.5,y:2.95,w:0.5,h:0.45,fill:{color:NEON},line:{color:NEON,width:0}});
   if(i===1)T(c.s,'#',x+0.25,2.65,1.0,1.0,{fontSize:36,bold:true,color:NEON,align:'center',valign:'middle'});
   if(i===2){c.s.addShape(S.roundRect,{x:x+0.6,y:2.85,w:0.3,h:0.6,rectRadius:0.06,fill:{color:NEON},line:{color:NEON,width:0}});}
   T(c.s,t,x+1.45,2.7,2.2,0.9,{fontSize:20,bold:true,valign:'middle'});
   T(c.s,items.map((it,k)=>({text:it,options:{bullet:true,breakLine:k<items.length-1}})),x+0.3,3.95,3.3,1.75,{fontSize:16,paraSpaceAfter:5});});
 c.s.addShape(S.roundRect,{x:0.7,y:6.0,w:11.9,h:0.8,rectRadius:0.4,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Daraus berechnet TikTok für jedes Video: Wie wahrscheinlich gefällt es dir?',0.7,6.0,11.9,0.8,{fontSize:18,bold:true,color:NEON,align:'center',valign:'middle'});
}
// 6 Gewichtung = Waage
{const c=mk('LIGHT','Szene 6 – Gewichtung (2:50)');
 kicker(c,'Gewichtung',0.7,1.2);
 head(c,[['Nicht jedes Signal zählt ',0],['gleich viel.',1]],0.7,1.75,6.0,2.8,42);
 sub(c,'Du musst nichts liken: Zuschauen ist quasi ein stilles Like.',0.7,4.8,5.8,1.5);
 const cx=9.8;
 c.s.addShape(S.rect,{x:cx-0.08,y:2.2,w:0.16,h:4.2,fill:{color:DEEP},line:{color:DEEP,width:0}});
 c.s.addShape(S.roundRect,{x:cx-1.0,y:6.4,w:2.0,h:0.3,rectRadius:0.1,fill:{color:DEEP},line:{color:DEEP,width:0}});
 c.s.addShape(S.roundRect,{x:cx-2.1,y:2.11,w:4.2,h:0.18,rectRadius:0.08,rotate:352,fill:{color:DEEP},line:{color:DEEP,width:0}});
 dot(c.s,cx,2.2,0.4,NEON,DEEP);
 const a=8*Math.PI/180,lx=cx-2.1*Math.cos(a),ly=2.2+2.1*Math.sin(a),rx=cx+2.1*Math.cos(a),ry=2.2-2.1*Math.sin(a);
 ln(c.s,lx,ly,0,2.0,DEEP,2);ln(c.s,rx,ry,0,1.4,DEEP,2);
 const py=ly+2.0,pry=ry+1.4;
 c.s.addShape(S.roundRect,{x:lx-1.0,y:py,w:2.0,h:0.16,rectRadius:0.07,fill:{color:DEEP},line:{color:DEEP,width:0}});
 c.s.addShape(S.roundRect,{x:rx-1.0,y:pry,w:2.0,h:0.16,rectRadius:0.07,fill:{color:DEEP},line:{color:DEEP,width:0}});
 dot(c.s,lx,py-0.8,1.6,GREEN);T(c.s,'Video bis zum Ende',lx-0.7,py-1.35,1.4,1.1,{fontSize:14,bold:true,color:CARD,align:'center',valign:'middle'});
 dot(c.s,rx,pry-0.3,0.6,LINE);
 badge(c.s,'stark',lx-0.6,py+0.3,1.2,0.4,NEON,INK,14);
 badge(c.s,'schwach',rx-0.7,pry+0.3,1.4,0.4,CHIP,INK,14);
 T(c.s,'Gleiches Land',rx-1.0,pry+0.8,2.0,0.4,{fontSize:14,color:GRAY,align:'center'});
}
// 7 Kreislauf = Ring
{const c=mk('LIGHT','Szene 7 – Der Kreislauf (3:25)');
 kicker(c,'Der Kreislauf',0.7,1.2);
 head(c,[['Das passiert bei ',0],['jedem einzelnen',1],[' Video.',0]],0.7,1.75,6.0,2.8,40);
 sub(c,'Darum wirkt der Feed schon nach kurzer Zeit so, als würde er dich richtig gut kennen.',0.7,4.8,5.8,1.8,18);
 const cx=9.9,cy=3.6,r=1.95,d=1.75;
 c.s.addShape(S.ellipse,{x:cx-r,y:cy-r,w:2*r,h:2*r,line:{color:GREEN,width:3,dashType:'dash'}});
 [[45,135],[135,225],[225,315],[315,45]].forEach(([ang,rot])=>{const a=ang*Math.PI/180;
   c.s.addShape(S.triangle,{x:cx+r*Math.sin(a)-0.2,y:cy-r*Math.cos(a)-0.2,w:0.4,h:0.4,rotate:rot,fill:{color:GREEN},line:{color:GREEN,width:0}});});
 const nodes=[['Video sehen',0,-1],['Reagieren – oder nicht',1,0],['Vorhersage anpassen',0,1],['Nächstes Video wählen',-1,0]];
 nodes.forEach(([t,dx,dy],i)=>{const x=cx+dx*r,y=cy+dy*r;
   dot(c.s,x,y,d,i%2===0?NEON:CARD,DEEP);
   T(c.s,t,x-d/2+0.15,y-d/2,d-0.3,d,{fontSize:14,bold:true,align:'center',valign:'middle'});
   circleNum(c.s,i+1,x-d/2+0.05,y-d/2+0.05,0.45,DEEP,NEON);});
 T(c.s,'wieder und wieder',cx-0.9,cy-0.45,1.8,0.9,{fontSize:16,bold:true,color:GREEN,align:'center',valign:'middle'});
}
// 8 Start = Weggabelung
{const c=mk('LIGHT','Szene 8 – Der Start (4:00)');
 kicker(c,'Der Start',0.7,1.2);
 head(c,[['Und ganz am ',0],['Anfang',1],[', wenn TikTok noch nichts weiß?',0]],0.7,1.75,6.2,3.3,40);
 dot(c.s,7.9,3.6,1.6,DEEP);T(c.s,'Neues Konto',7.1,3.6-0.8,1.6,1.6,{fontSize:15,bold:true,color:NEON,align:'center',valign:'middle'});
 ln(c.s,8.7,3.6,0.5,0,GREEN,3);ln(c.s,9.2,2.3,0,2.6,GREEN,3);
 ln(c.s,9.2,2.3,0.5,0,GREEN,3,{endArrowType:'triangle'});ln(c.s,9.2,4.9,0.5,0,GREEN,3,{endArrowType:'triangle'});
 card(c,9.8,1.35,2.85,1.9);T(c.s,'Interessen wählen',10.0,1.5,2.5,0.5,{fontSize:17,bold:true});
 badge(c.s,'Tiere',10.0,2.2,1.1,0.5,NEON,INK,15);badge(c.s,'Reisen',11.25,2.2,1.2,0.5,NEON,INK,15);
 card(c,9.8,3.95,2.85,1.9);T(c.s,'Nichts wählen',10.0,4.1,2.5,0.5,{fontSize:17,bold:true});
 T(c.s,'Zuerst beliebte Videos – TikTok beobachtet, wie du reagierst.',10.0,4.65,2.5,1.1,{fontSize:15});
}
// 9 Schattenseiten
{const c=mk('DARK','Szene 9 – Die Schattenseiten (4:25)');
 kicker(c,'Die Schattenseiten',0.7,0.65);
 head(c,[['Klingt praktisch – hat aber ',0],['große Schattenseiten.',1]],0.7,1.1,11.9,1.4,38);
 const items=[['Filterblase','Immer mehr vom Gleichen. Andere Themen und Meinungen tauchen kaum noch auf.'],['Rabbit Hole','Die Videos werden einseitiger, extremer – oder ziehen die Stimmung runter.'],['Zeitgefühl weg','Weil der Feed nie endet, merkst du kaum, wie viel Zeit vergeht.']];
 items.forEach(([t,d],i)=>{const x=0.7+i*4.05;card(c,x,2.7,3.8,3.15);
   const gx=x+1.9;
   if(i===0){dot(c.s,gx,3.35,1.1,DEEP2,NEON);[[-0.2,-0.15],[0.15,-0.2],[0.2,0.15],[-0.15,0.2],[0,0]].forEach(([dx,dy])=>dot(c.s,gx+dx,3.35+dy,0.15,NEON));
     [[-0.95,-0.3],[1.0,0.35],[0.9,-0.45]].forEach(([dx,dy])=>dot(c.s,gx+dx,3.35+dy,0.15,DEEPLINE));}
   if(i===1){[[1.9,0.55],[1.45,0.42],[1.0,0.3],[0.55,0.2]].forEach(([w,h],k)=>c.s.addShape(S.ellipse,{x:gx-w/2,y:3.0+k*0.12,w,h,fill:{color:k===3?INK2:DEEP2},line:{color:NEON,width:2}}));}
   if(i===2){dot(c.s,gx,3.35,1.1,DEEP2,NEON);ln(c.s,gx,2.9,0,0.45,NEON,3);ln(c.s,gx,3.35,0.3,0.15,NEON,3);T(c.s,'?',gx+0.55,2.75,0.6,0.5,{fontSize:22,bold:true,color:NEON});}
   T(c.s,t,x+0.3,4.0,3.2,0.5,{fontSize:22,bold:true,color:NEON});T(c.s,d,x+0.3,4.55,3.2,1.25,{fontSize:15,color:BG});});
 c.s.addShape(S.roundRect,{x:0.7,y:6.05,w:11.9,h:0.8,rectRadius:0.4,fill:{color:NEON},line:{color:NEON,width:0}});
 T(c.s,'Der Algorithmus prüft nicht, ob dir ein Video guttut. Er berechnet nur, ob du weiterschaust.',0.9,6.05,11.5,0.8,{fontSize:15,bold:true,color:INK,align:'center',valign:'middle'});
}
// 10 Gegenmassnahmen
{const c=mk('LIGHT','Szene 10 – Gegenmaßnahmen (5:15)');
 kicker(c,'Gegenmaßnahmen',0.7,1.2);
 head(c,[['TikTok sagt: Wir ',0],['steuern dagegen.',1]],0.7,1.75,6.2,2.6,42);
 sub(c,'Ob das reicht, wird viel diskutiert.',0.7,4.8,6,1.2);
 card(c,7.2,1.0,5.4,2.6);
 tile(c.s,7.5,1.4,1.5,0.8,'Sound A',CHIP);tile(c.s,9.1,1.4,1.5,0.8,'Sound A',CHIP);tile(c.s,10.7,1.4,1.5,0.8,'Sound B',NEON);
 c.s.addShape(S.mathMultiply,{x:10.1,y:1.05,w:0.65,h:0.65,fill:{color:ORANGE},line:{color:ORANGE,width:0}});
 T(c.s,'Derselbe Sound oder Account nie direkt hintereinander.',7.5,2.45,4.8,1.0,{fontSize:18,bold:true});
 card(c,7.2,3.95,5.4,2.6);
 tile(c.s,7.5,4.35,1.5,0.8,'Katzen',CHIP);tile(c.s,9.1,4.35,1.5,0.8,'Minecraft',CHIP);tile(c.s,10.7,4.35,1.5,0.8,'Segeln?',NEON);
 c.s.addShape(S.star5,{x:11.95,y:4.15,w:0.5,h:0.5,fill:{color:DEEP},line:{color:NEON,width:2}});
 T(c.s,'Ab und zu absichtlich: Videos, die nicht zu deinen Interessen passen.',7.5,5.4,4.8,1.0,{fontSize:18,bold:true});
}
// 11 Werkzeuge = Mischpult
{const c=mk('LIGHT','Szene 11 – Deine Werkzeuge (5:40)');
 kicker(c,'Deine Werkzeuge',0.7,1.2);
 head(c,[['Du kannst ',0],['mitsteuern.',1]],0.7,1.75,6.2,1.7,46);
 T(c.s,['„Nicht interessiert“ – lange tippen','Wörter & Hashtags filtern','Themen verwalten','Feed zurücksetzen','Teilen-Menü: „Warum sehe ich das?“','Feed ohne Personalisierung (EU)'].map((t,k)=>({text:t,options:{bullet:{type:'number'},breakLine:k<5}})),0.7,3.7,6.0,3.0,{fontSize:17,paraSpaceAfter:6});
 c.s.addShape(S.roundRect,{x:7.2,y:0.9,w:5.4,h:5.9,rectRadius:0.25,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Themen verwalten',7.5,1.1,4.8,0.5,{fontSize:18,bold:true,color:NEON});
 [['Tanz',0.35],['Fußball',1.6],['Katzen',0.2],['Kochen',1.0]].forEach(([t,pos],i)=>{const x=7.9+i*1.2;
   c.s.addShape(S.roundRect,{x:x-0.06,y:1.75,w:0.12,h:2.6,rectRadius:0.05,fill:{color:DEEPLINE},line:{color:DEEPLINE,width:0}});
   c.s.addShape(S.roundRect,{x:x-0.3,y:1.75+pos,w:0.6,h:0.35,rectRadius:0.1,fill:{color:NEON},line:{color:NEON,width:0}});
   T(c.s,t,x-0.55,4.45,1.1,0.4,{fontSize:14,color:BG,align:'center'});});
 c.s.addShape(S.roundRect,{x:7.45,y:5.05,w:2.45,h:0.55,rectRadius:0.27,fill:{color:DEEP2},line:{color:NEON,width:1.5}});
 T(c.s,'Nicht interessiert',7.45,5.05,2.45,0.55,{fontSize:14,bold:true,color:NEON,align:'center',valign:'middle'});
 c.s.addShape(S.roundRect,{x:10.05,y:5.05,w:2.35,h:0.55,rectRadius:0.27,fill:{color:NEON},line:{color:NEON,width:0}});
 T(c.s,'Feed zurücksetzen',10.05,5.05,2.35,0.55,{fontSize:14,bold:true,color:INK,align:'center',valign:'middle'});
 T(c.s,'Ohne Personalisierung',7.45,5.95,3.5,0.55,{fontSize:15,color:BG,valign:'middle'});
 c.s.addShape(S.roundRect,{x:11.3,y:6.0,w:1.0,h:0.5,rectRadius:0.25,fill:{color:NEON},line:{color:NEON,width:0}});dot(c.s,12.05,6.25,0.4,DEEP);
}
// 12 Check
{const c=mk('LIGHT','Szene 12 – Kurzer Check (6:45) – 3–5 Sekunden Pause');
 kicker(c,'Kurzer Check');
 head(c,[['Pausiere das Video und ',0],['überlege kurz.',1]],0.7,1.2,9.6,1.5,44);
 dot(c.s,11.8,1.6,1.5,DEEP);c.s.addShape(S.roundRect,{x:11.5,y:1.3,w:0.2,h:0.6,rectRadius:0.04,fill:{color:NEON},line:{color:NEON,width:0}});c.s.addShape(S.roundRect,{x:11.9,y:1.3,w:0.2,h:0.6,rectRadius:0.04,fill:{color:NEON},line:{color:NEON,width:0}});
 ['Welches Signal ist stärker: ein Video bis zum Ende schauen oder im selben Land wohnen?','Warum ist TikTok kostenlos – und was hat das mit deinem Feed zu tun?','Was kannst du tun, wenn dein Feed dir nicht guttut?'].forEach((q,i)=>{
   const x=0.7+i*4.05;card(c,x,3.2,3.8,3.5);T(c.s,'?',x+2.3,3.1,1.4,1.9,{fontSize:110,bold:true,color:CHIP,align:'center'});
   circleNum(c.s,i+1,x+0.3,3.5,0.6);T(c.s,q,x+0.3,4.4,3.25,2.1,{fontSize:20,bold:true});});
}
// 13 Outro
{const c=mk('NEON','Szene 13 – Outro (7:10)');
 dot(c.s,12.4,1.4,3.2,NEON,DEEP);dot(c.s,12.4,1.4,1.8,NEON,DEEP);dot(c.s,12.4,1.4,0.5,DEEP);
 kicker(c,'Merk dir');
 head(c,[['Dein Feed ist kein Zufall und kein Spiegel der Welt.',0]],0.7,1.25,9.2,2.6,48);
 sub(c,'Er ist eine Berechnung aus deinem Verhalten. Wer das weiß, kann bewusster scrollen.',0.7,4.0,8.6,1.4,24);
 c.s.addShape(S.roundRect,{x:0.7,y:5.6,w:8.4,h:0.95,rectRadius:0.2,fill:{color:DEEP},line:{color:DEEP,width:0}});
 T(c.s,'Mehr Videos zur Digitalen Grundbildung auf Cleverbox',0.7,5.6,8.4,0.95,{fontSize:20,bold:true,color:NEON,align:'center',valign:'middle'});
}
(async()=>{const f='/home/user/claudecloud/videoslides/cleverbox-tiktok-slides.pptx';
 await pres.writeFile({fileName:f});await applyTheme(f,THEME);console.log('ok',n);})();
