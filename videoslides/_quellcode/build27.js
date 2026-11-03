const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='EFFBDC', CARD='FBFFF4', INK='0E1F0C', GREEN='26720A', NEON='B1FF37', DEEP='12301A',
  GRAY='5B6B50', LINE='B8D98A', CHIP='DDF3B8', TAB2='EAF8CF', DEEP2='1B4527', DEEPLINE='2F6B3E', DSUB='A9C79A';
const FONT='Poppins';
const THEME={name:'Cleverbox Gruen',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='Farben im Computer: dezimal und hexadezimal';
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



const OUT='/home/user/claudecloud/videoslides/cleverbox-farben-hex-slides.pptx';

const RR='FF0000',GG='00FF00',BB='0000FF',YY='FFFF00',MM='FF00FF',CC='00FFFF',AC='C0392B';
function sw(s,x,y,w,h,color,r=0.12){s.addShape(S.roundRect,{x,y,w,h,rectRadius:r,fill:{color},line:{color:DEEP,width:2}});}
function mono(s,t,x,y,w,h,size,color=INK,al='left'){T(s,t,x,y,w,h,{fontSize:size,fontFace:'Courier New',bold:true,color,valign:'middle',align:al});}
function L(c,kick,segs,subt,size=38,subY=4.9){kicker(c,kick,0.7,1.2);head(c,segs,0.7,1.75,6.2,3.0,size);if(subt)sub(c,subt,0.7,subY,5.8,1.6,18);}
function eqRow(c,y,a,b,r,lab,ca,cb,cr){
  sw(c.s,7.3,y,0.9,0.9,ca);T(c.s,'+',8.25,y,0.5,0.9,{fontSize:28,bold:true,color:c.P.text,align:'center',valign:'middle'});
  sw(c.s,8.8,y,0.9,0.9,cb);T(c.s,'=',9.75,y,0.5,0.9,{fontSize:28,bold:true,color:c.P.text,align:'center',valign:'middle'});
  sw(c.s,10.3,y,0.9,0.9,cr);T(c.s,lab,11.3,y,1.7,0.9,{fontSize:15,bold:true,color:c.P.text,valign:'middle'});}
function bar3(c,x,y,w,vals){ // R G B Balken
  [['R',RR],['G',GG],['B',BB]].forEach(([l,col],i)=>{const yy=y+i*0.8;T(c.s,l,x,yy,0.5,0.55,{fontSize:18,bold:true,color:c.P.text,valign:'middle'});
   c.s.addShape(S.roundRect,{x:x+0.6,y:yy+0.05,w:w,h:0.45,rectRadius:0.1,fill:{color:CHIP},line:{color:LINE,width:1}});
   c.s.addShape(S.roundRect,{x:x+0.6,y:yy+0.05,w:Math.max(0.15,w*vals[i]/255),h:0.45,rectRadius:0.1,fill:{color:col},line:{color:DEEP,width:1.5}});
   T(c.s,String(vals[i]),x+0.6+w+0.15,yy,0.9,0.55,{fontSize:16,bold:true,color:c.P.text,valign:'middle'});});}
function boxes(c,x,y,items,w,h,gap,fills,size=18,color){items.forEach((t,i)=>{const f=fills?(Array.isArray(fills)?fills[i]:fills):CHIP;tile(c.s,x+i*(w+gap),y,w,h,t,f,color||INK,size);});}
function resRows(c,rows,x=7.2,y0=1.4){rows.forEach((r,i)=>{const y=y0+i*1.35;card(c,x,y,5.4,1.15);T(c.s,r,x+0.3,y,4.8,1.15,{fontSize:17,bold:true,valign:'middle',color:c.P.text});});}
const SL=[];
// 1
SL.push(c=>{L(c,'Willkommen',[['Farben im ',false],['Computer',true]],'Dezimal und hexadezimal',44);
 sw(c.s,7.4,1.2,5.0,3.4,AC,0.2);mono(c.s,'#c0392b',7.4,1.2,5.0,3.4,40,'FFFFFF','center');
 bubble(c.s,'Was ist das?',9.4,5.0,3.0,0.9,CARD,INK,16);},'DARK');
// 2
SL.push(c=>{L(c,'Der Farbcode',[['Was soll das ',false],['bedeuten?',true]],'Eine Raute, Zahlen und Buchstaben bunt gemischt.',40);
 ['#','c0','39','2b'].forEach((t,i)=>tile(c.s,7.2+i*1.4,1.6,1.25,1.6,t,i?CHIP:'E8E8E8',INK,28));
 ['?','?','?','?'].forEach((t,i)=>T(c.s,t,7.2+i*1.4,3.35,1.25,0.8,{fontSize:34,bold:true,color:ORANGE,align:'center',valign:'middle'}));
 sw(c.s,8.6,4.7,3.9,1.3,AC);},'LIGHT');
// 3
SL.push(c=>{L(c,'Das lernst du',[['Drei ',false],['Fragen',true],[', ein Video',false]],null,42);
 ['Wie speichert ein Computer Farben?','Warum gibt es genau 16,7 Millionen?','Wie lese und rechne ich Farbcodes um?'].forEach((t,i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);circleNum(c.s,i+1,7.5,y+0.45,0.65,NEON,DEEP);T(c.s,t,8.4,y,4.0,1.55,{fontSize:17,bold:true,valign:'middle'});});},'LIGHT');
// 4
SL.push(c=>{L(c,'Vorwissen',[['Binärsystem: ',false],['kleiner Vorsprung',true]],'Mitmachen geht auch ohne Vorwissen.',38);
 card(c,7.2,1.3,5.4,3.2);T(c.s,'Video zum Binärsystem',7.5,1.4,4.8,0.7,{fontSize:16,bold:true,color:GREEN,valign:'middle'});
 ['0','1','1','0','1','0','0','1'].forEach((t,i)=>tile(c.s,7.5+i*0.62,2.4,0.55,0.8,t,i%2?NEON:CHIP,INK,18));
 badge(c.s,'ohne Vorwissen auch ok',7.5,3.6,3.4,0.55,DEEP,NEON,14);},'LIGHT');
// 5
SL.push(c=>{L(c,'Wie entsteht Farbe?',[['Millionen winzige ',false],['Pixel',true]],'Dein Bildschirm besteht aus Punkten.',40);
 const cols=['E74C3C','F1C40F','2ECC71','3498DB','9B59B6','E67E22','1ABC9C','ECF0F1'];
 for(let r=0;r<5;r++)for(let k=0;k<8;k++)c.s.addShape(S.rect,{x:7.2+k*0.68,y:1.2+r*0.68,w:0.68,h:0.68,fill:{color:cols[(r*3+k*5)%8]},line:{color:CARD,width:1}});
 badge(c.s,'Pixel',9.0,5.0,1.8,0.55,DEEP,NEON,16);},'LIGHT');
// 6
SL.push(c=>{L(c,'Die Überraschung',[['Drei ',false],['Lichtpunkte',true],[' pro Pixel',false]],'Ein roter, ein grüner und ein blauer.',38);
 card(c,7.2,1.1,5.4,4.6,DEEP,DEEP);
 [[RR,'Rot'],[GG,'Grün'],[BB,'Blau']].forEach(([col,l],i)=>{c.s.addShape(S.roundRect,{x:7.6+i*1.6,y:1.6,w:1.3,h:2.9,rectRadius:0.15,fill:{color:col},line:{color:CARD,width:1.5}});T(c.s,l,7.6+i*1.6,4.65,1.3,0.5,{fontSize:15,bold:true,color:CARD,align:'center',valign:'middle'});});},'LIGHT');
// 7
SL.push(c=>{L(c,'Mit der Lupe',[['Mit bloßem Auge ',false],['unsichtbar',true]],'Mit Lupe oder Handy-Zoom manchmal zu erkennen.',38);
 c.s.addShape(S.ellipse,{x:7.6,y:1.1,w:4.2,h:4.2,fill:{color:CARD},line:{color:DEEP,width:8}});
 [[RR],[GG],[BB]].forEach(([col],i)=>c.s.addShape(S.roundRect,{x:8.35+i*1.0,y:1.7,w:0.8,h:3.0,rectRadius:0.12,fill:{color:col},line:{color:DEEP,width:1.5}}));
 c.s.addShape(S.roundRect,{x:11.55,y:5.0,w:1.4,h:0.4,rectRadius:0.1,rotate:45,fill:{color:DEEP},line:{color:DEEP,width:0}});},'LIGHT');
// 8
SL.push(c=>{L(c,'RGB',[['Aus drei Lichtfarben: ',false],['RGB',true]],null,42);
 [['R','Red · Rot',RR],['G','Green · Grün',GG],['B','Blue · Blau',BB]].forEach(([l,t,col],i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);sw(c.s,7.5,y+0.3,0.95,0.95,col);T(c.s,l,8.7,y,0.9,1.55,{fontSize:36,bold:true,valign:'middle'});T(c.s,t,9.6,y,3.0,1.55,{fontSize:17,bold:true,valign:'middle'});});},'NEON');
// 9
SL.push(c=>{L(c,'Licht ist anders',[['Licht mischt sich ',false],['anders',true],[' als Malfarbe',false]],null,38);
 card(c,7.2,1.1,5.4,2.4);T(c.s,'Malkasten',7.5,1.2,3,0.5,{fontSize:15,bold:true,color:GREEN});
 sw(c.s,7.5,1.85,1.2,1.2,RR);T(c.s,'+',8.8,1.85,0.5,1.2,{fontSize:26,bold:true,align:'center',valign:'middle'});sw(c.s,9.4,1.85,1.2,1.2,'00A000');T(c.s,'=',10.7,1.85,0.5,1.2,{fontSize:26,bold:true,align:'center',valign:'middle'});sw(c.s,11.3,1.85,1.2,1.2,'7A5230');
 card(c,7.2,3.9,5.4,2.4,DEEP,DEEP);T(c.s,'Licht',7.5,4.0,3,0.5,{fontSize:15,bold:true,color:NEON});
 sw(c.s,7.5,4.65,1.2,1.2,RR);T(c.s,'+',8.8,4.65,0.5,1.2,{fontSize:26,bold:true,color:CARD,align:'center',valign:'middle'});sw(c.s,9.4,4.65,1.2,1.2,GG);T(c.s,'=',10.7,4.65,0.5,1.2,{fontSize:26,bold:true,color:CARD,align:'center',valign:'middle'});sw(c.s,11.3,4.65,1.2,1.2,YY);},'LIGHT');
// 10
SL.push(c=>{L(c,'Lichtmischung',[['Rot + Grün = ',false],['Gelb',true]],'Rot + Blau = Magenta, Grün + Blau = Cyan.',40);
 eqRow(c,1.2,0,0,0,'Gelb',RR,GG,YY);eqRow(c,2.8,0,0,0,'Magenta',RR,BB,MM);eqRow(c,4.4,0,0,0,'Cyan',GG,BB,CC);},'LIGHT');
// 11
SL.push(c=>{L(c,'Weiß und Schwarz',[['Alles an: ',false],['Weiß',true],['. Alles aus: Schwarz.',false]],null,38);
 sw(c.s,7.3,1.4,0.9,0.9,RR);T(c.s,'+',8.2,1.4,0.5,0.9,{fontSize:26,bold:true,align:'center',valign:'middle'});sw(c.s,8.7,1.4,0.9,0.9,GG);T(c.s,'+',9.6,1.4,0.5,0.9,{fontSize:26,bold:true,align:'center',valign:'middle'});sw(c.s,10.1,1.4,0.9,0.9,BB);T(c.s,'= Weiß',11.0,1.4,1.8,0.9,{fontSize:16,bold:true,valign:'middle'});
 sw(c.s,7.3,2.4,5.5,0.9,'FFFFFF');
 sw(c.s,7.3,4.2,5.5,0.9,'000000');T(c.s,'kein Licht = Schwarz',7.3,5.2,5.5,0.6,{fontSize:16,bold:true,align:'center',valign:'middle'});},'LIGHT');
// 12
SL.push(c=>{L(c,'Additiv',[['Additive ',false],['Farbmischung',true]],'Es kommt Licht dazu: je mehr Licht, desto heller.',40);
 for(let i=0;i<8;i++){const v=Math.round(i*255/7).toString(16).padStart(2,'0');sw(c.s,7.2+i*0.68,1.6,0.62,2.6,(v+v+v).toUpperCase(),0.05);}
 arrow(c.s,S.rightArrow,7.2,4.6,5.4,0.6,GREEN);T(c.s,'mehr Licht',9.2,5.3,3.2,0.5,{fontSize:15,bold:true,color:BG,align:'right'});},'DARK');
// 13
SL.push(c=>{L(c,'Wie hell?',[['Stufen von ',false],['0 bis 255',true]],'Von ganz aus bis volle Helligkeit.',40);
 for(let i=0;i<9;i++){const v=Math.round(i*255/8);sw(c.s,7.2+i*0.6,1.5,0.56,2.4,v.toString(16).padStart(2,'0').toUpperCase()+'0000',0.05);}
 T(c.s,'0',7.2,4.1,0.8,0.5,{fontSize:22,bold:true});T(c.s,'255',11.8,4.1,0.9,0.5,{fontSize:22,bold:true,align:'right'});
 T(c.s,'ganz aus',7.2,4.6,1.6,0.4,{fontSize:13,color:GRAY});T(c.s,'volle Helligkeit',10.4,4.6,2.3,0.4,{fontSize:13,color:GRAY,align:'right'});},'LIGHT');
// 14
SL.push(c=>{L(c,'Warum 255?',[['Ein ',false],['Byte',true],[' pro Farbanteil',false]],'Ein Byte sind 8 Bits.',40);
 ['0','1','1','0','1','0','0','1'].forEach((t,i)=>tile(c.s,7.2+i*0.68,1.8,0.62,1.0,t,i%2?NEON:CHIP,INK,22));
 c.s.addShape(S.rect,{x:7.2,y:3.0,w:5.36,h:0.06,fill:{color:DEEP},line:{color:DEEP,width:0}});T(c.s,'1 Byte = 8 Bit',7.2,3.2,5.4,0.7,{fontSize:22,bold:true,align:'center',valign:'middle'});},'LIGHT');
// 15
SL.push(c=>{L(c,'Wie viele Werte?',[['2 hoch 8 = ',false],['256 Werte',true]],'Die Zahlen von 0 bis 255.',44);
 card(c,7.2,1.4,5.4,3.6,DEEP,DEEP);
 T(c.s,[{text:'2',options:{color:NEON}},{text:'8',options:{color:NEON,superscript:true}},{text:' = 256',options:{color:CARD}}],7.2,1.6,5.4,1.8,{fontSize:54,bold:true,align:'center',valign:'middle'});
 T(c.s,'0 bis 255',7.2,3.6,5.4,0.9,{fontSize:22,bold:true,color:DSUB,align:'center',valign:'middle'});},'LIGHT');
// 16
SL.push(c=>{L(c,'Alle Farben',[['16,7 Millionen ',true],['Farben',false]],'Mehr, als das Auge unterscheiden kann.',42);
 card(c,7.2,1.2,5.4,4.6);T(c.s,'256 × 256 × 256',7.2,1.5,5.4,1.2,{fontSize:30,bold:true,align:'center',valign:'middle'});
 T(c.s,'=',7.2,2.8,5.4,0.6,{fontSize:26,bold:true,align:'center',valign:'middle',color:GREEN});T(c.s,'16.777.216',7.2,3.5,5.4,1.1,{fontSize:42,bold:true,color:GREEN,align:'center',valign:'middle'});
 badge(c.s,'rund 16,7 Millionen',8.2,4.9,3.4,0.6,NEON,INK,16);},'NEON');
// 17
SL.push(c=>{L(c,'Schreibweise 1: dezimal',[['rgb(255, 0, 0)',true]],'Drei normale Zahlen: Rot, Grün, Blau. Hier: reines Rot.',40);
 card(c,7.2,1.1,5.4,3.0,DEEP,DEEP);mono(c.s,'rgb(255, 0, 0)',7.2,1.3,5.4,1.1,26,NEON,'center');
 [['Rot','255',RR],['Grün','0',GG],['Blau','0',BB]].forEach(([l,v,col],i)=>{T(c.s,l,7.5+i*1.75,2.6,1.6,0.4,{fontSize:14,bold:true,color:CARD,align:'center'});T(c.s,v,7.5+i*1.75,3.0,1.6,0.6,{fontSize:22,bold:true,color:col==BB?'7FA7FF':col,align:'center',valign:'middle'});});
 sw(c.s,8.4,4.5,3.0,1.4,RR);},'LIGHT');
// 18
SL.push(c=>{L(c,'Beispiele',[['Probieren wir ',false],['Farben',true]],null,42);
 [['rgb(0, 0, 255)','reines Blau',BB],['rgb(255, 255, 0)','Gelb',YY]].forEach(([t,l,col],i)=>{const y=1.5+i*2.2;card(c,7.2,y,5.4,1.8);sw(c.s,7.5,y+0.4,1.0,1.0,col);mono(c.s,t,8.7,y+0.2,3.8,0.8,19);T(c.s,l,8.7,y+0.95,3.8,0.6,{fontSize:15,color:GRAY,valign:'middle'});});},'LIGHT');
// 19
SL.push(c=>{L(c,'Beispiele',[['Schwarz, Weiß ',false],['und Grau',true]],null,42);
 [['rgb(0, 0, 0)','Schwarz','000000'],['rgb(255, 255, 255)','Weiß','FFFFFF'],['rgb(128, 128, 128)','Grau','808080']].forEach(([t,l,col],i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);sw(c.s,7.5,y+0.3,0.95,0.95,col);mono(c.s,t,8.7,y+0.1,3.9,0.8,17);T(c.s,l,8.7,y+0.8,3.8,0.5,{fontSize:15,color:GRAY,valign:'middle'});});},'LIGHT');
// 20
SL.push(c=>{L(c,'Praktischer Trick',[['Drei gleiche Zahlen: ',false],['Grauton',true]],'Je höher die Zahlen, desto heller das Grau.',40);
 [0,64,128,192,255].forEach((v,i)=>{const h=v.toString(16).padStart(2,'0').toUpperCase();sw(c.s,7.2+i*1.1,1.5,1.0,2.4,h+h+h,0.05);mono(c.s,String(v),7.2+i*1.1,4.0,1.0,0.5,13,INK,'center');});
 mono(c.s,'rgb(v, v, v)',7.2,5.0,5.4,0.8,22,GREEN,'center');},'LIGHT');
// 21
SL.push(c=>{L(c,'Unsere Farbe',[['rgb(192, 57, 43)',true]],'Viel Rot, wenig Grün, wenig Blau: ein kräftiges Rot.',40);
 sw(c.s,7.2,1.0,5.4,1.7,AC);bar3(c,7.2,3.1,3.2,[192,57,43]);},'LIGHT');
// 22
SL.push(c=>{L(c,'Schreibweise 2: hexadezimal',[['Dieselbe Farbe, ',false],['anders geschrieben',true]],'Das Hexadezimalsystem.',38);
 card(c,7.2,1.1,5.4,1.5);mono(c.s,'rgb(192, 57, 43)',7.2,1.1,5.4,1.5,20,CARD,'center');
 T(c.s,'=',7.2,2.7,5.4,0.7,{fontSize:30,bold:true,align:'center',color:GREEN,valign:'middle'});
 card(c,7.2,3.5,5.4,1.5,DEEP,DEEP);mono(c.s,'#c0392b',7.2,3.5,5.4,1.5,34,NEON,'center');sw(c.s,9.0,5.3,1.8,0.9,AC);},'DARK');
// 23
SL.push(c=>{L(c,'Dezimalsystem',[['Zehn Ziffern: ',false],['0 bis 9',true]],'Nach 9 kommt 10: rechts die Einer, links die Zehner.',40);
 for(let i=0;i<10;i++)tile(c.s,7.2+(i%5)*1.1,1.1+Math.floor(i/5)*1.1,1.0,1.0,String(i),CHIP,INK,22);
 T(c.s,'9 → 10',7.2,3.5,5.4,0.8,{fontSize:26,bold:true,align:'center',valign:'middle'});
 [['Zehner','1'],['Einer','0']].forEach(([l,v],i)=>{tile(c.s,8.1+i*1.7,4.4,1.5,0.9,v,i?CHIP:NEON,INK,30);T(c.s,l,8.1+i*1.7,5.35,1.5,0.5,{fontSize:14,bold:true,color:GRAY,align:'center'});});},'LIGHT');
// 24
SL.push(c=>{L(c,'Hexadezimalsystem',[['Sechzehn Ziffern: ',false],['0 bis f',true]],'Für zehn bis fünfzehn nimmt man Buchstaben.',38);
 const d='0123456789abcdef'.split('');
 d.forEach((t,i)=>{const x=7.2+(i%4)*1.38,y=1.0+Math.floor(i/4)*1.45;tile(c.s,x,y,1.28,0.8,t,i>9?NEON:CHIP,INK,24);T(c.s,String(i),x,y+0.8,1.28,0.4,{fontSize:13,bold:true,color:GRAY,align:'center'});});},'LIGHT');
// 25
SL.push(c=>{L(c,'Hexadezimal zählen',[['Nach f kommt 10 – das ist ',false],['sechzehn',true]],'Die linke Stelle zählt die Sechzehner.',36);
 '0123456789abcdef'.split('').forEach((t,i)=>tile(c.s,7.2+(i%8)*0.68,1.2+Math.floor(i/8)*0.78,0.62,0.7,t,i>9?NEON:CHIP,INK,18));
 [['Sechzehner','1'],['Einer','0']].forEach(([l,v],i)=>{tile(c.s,7.8+i*2.4,3.5,2.0,1.1,v,i?CHIP:NEON,INK,34);T(c.s,l,7.8+i*2.4,4.65,2.0,0.5,{fontSize:14,bold:true,color:GRAY,align:'center'});});
 T(c.s,'10 (hex) = 16',7.2,5.4,5.4,0.7,{fontSize:24,bold:true,align:'center',color:GREEN,valign:'middle'});},'LIGHT');
// 26
SL.push(c=>{L(c,'Hex → dezimal',[['Linke Ziffer × 16, ',false],['plus rechte Ziffer',true]],'So rechnest du eine zweistellige Hex-Zahl um.',38);
 card(c,7.2,1.4,5.4,3.8,DEEP,DEEP);T(c.s,'link × 16 + rechts',7.2,1.7,5.4,1.2,{fontSize:26,bold:true,color:NEON,align:'center',valign:'middle'});
 tile(c.s,8.2,3.2,1.5,1.3,'c',NEON,INK,40);tile(c.s,10.1,3.2,1.5,1.3,'0',CHIP,INK,40);},'LIGHT');
// 27
SL.push(c=>{L(c,'#c0392b',[['Drei Paare: ',false],['Rot, Grün, Blau',true]],null,40);
 mono(c.s,'#',7.2,1.3,0.7,1.3,40,GRAY,'center');
 [['c0','Rot',RR],['39','Grün','00C000'],['2b','Blau',BB]].forEach(([t,l,col],i)=>{const x=8.0+i*1.55;tile(c.s,x,1.3,1.4,1.3,t,CHIP,INK,32);T(c.s,l,x,2.7,1.4,0.5,{fontSize:15,bold:true,color:col==BB?'3050FF':col,align:'center'});});
 sw(c.s,8.5,4.0,3.8,1.6,AC);},'LIGHT');
// 28-30
function calc(n){return c=>{const R=[['c0','c = 12\n12 × 16 = 192, plus 0','192'],['39','3 × 16 = 48\n48 plus 9','57'],['2b','2 × 16 = 32\nplus b = 11','43']];
 const kk=['c0','39','2b'][n];L(c,'Hex → dezimal',[[kk,true],[' umrechnen',false]],null,44);
 for(let i=0;i<=n;i++){const y=1.1+i*1.85,on=i===n;card(c,7.2,y,5.4,1.55);if(on)c.s.addShape(S.roundRect,{x:7.2,y,w:5.4,h:1.55,rectRadius:0.15,fill:{color:NEON},line:{color:DEEP,width:2.5}});
  mono(c.s,R[i][0],7.4,y,1.0,1.55,24);T(c.s,R[i][1],8.5,y,3.1,1.55,{fontSize:15,bold:true,valign:'middle',lineSpacingMultiple:1.2});T(c.s,R[i][2],11.6,y,0.9,1.55,{fontSize:26,bold:true,color:on?DEEP:GREEN,valign:'middle',align:'center'});}};}
SL.push(calc(0),calc(1),calc(2));
// 31
SL.push(c=>{L(c,'Ergebnis',[['Dieselbe ',false],['Farbe',true]],null,46);
 card(c,7.2,1.1,5.4,1.4,DEEP,DEEP);mono(c.s,'#c0392b',7.2,1.1,5.4,1.4,32,NEON,'center');
 T(c.s,'=',7.2,2.6,5.4,0.7,{fontSize:30,bold:true,align:'center',color:GREEN,valign:'middle'});
 card(c,7.2,3.4,5.4,1.4,CARD,LINE);mono(c.s,'rgb(192, 57, 43)',7.2,3.4,5.4,1.4,24,INK,'center');sw(c.s,9.0,5.1,1.8,0.9,AC);},'LIGHT');
// 32
SL.push(c=>{L(c,'Höchster Wert',[['ff = ',false],['255',true]],'Der Höchstwert eines Farbanteils.',50);
 card(c,7.2,1.4,5.4,3.6,DEEP,DEEP);mono(c.s,'ff',7.2,1.6,5.4,1.2,48,NEON,'center');T(c.s,'15 × 16 = 240',7.2,3.0,5.4,0.7,{fontSize:22,bold:true,color:CARD,align:'center',valign:'middle'});T(c.s,'240 + 15 = 255',7.2,3.8,5.4,0.7,{fontSize:22,bold:true,color:NEON,align:'center',valign:'middle'});},'LIGHT');
// 33
SL.push(c=>{L(c,'Dezimal → hex',[['Durch 16 teilen: ',false],['Ergebnis und Rest',true]],'Ergebnis = linke Ziffer, Rest = rechte Ziffer.',38);
 tile(c.s,7.2,1.3,5.4,1.2,'Dezimalzahl : 16',NEON,INK,22);arrow(c.s,S.downArrow,9.65,2.6,0.5,0.6,GREEN);
 tile(c.s,7.2,3.4,2.6,1.3,'Ergebnis',CHIP,INK,20);tile(c.s,10.0,3.4,2.6,1.3,'Rest',CHIP,INK,20);
 T(c.s,'linke Ziffer',7.2,4.8,2.6,0.5,{fontSize:14,bold:true,color:GRAY,align:'center'});T(c.s,'rechte Ziffer',10.0,4.8,2.6,0.5,{fontSize:14,bold:true,color:GRAY,align:'center'});},'LIGHT');
// 34
SL.push(c=>{L(c,'Beispiel 192',[['192 → ',false],['c0',true]],null,48);
 card(c,7.2,1.2,5.4,4.4);T(c.s,'192 : 16 = 12  Rest 0',7.2,1.5,5.4,1.0,{fontSize:24,bold:true,align:'center',valign:'middle'});
 T(c.s,'12 = c',7.2,2.7,5.4,0.9,{fontSize:26,bold:true,color:GREEN,align:'center',valign:'middle'});tile(c.s,8.3,3.9,1.5,1.2,'c',NEON,INK,40);tile(c.s,10.0,3.9,1.5,1.2,'0',CHIP,INK,40);},'LIGHT');
// 35
SL.push(c=>{L(c,'Beispiel 57',[['57 → ',false],['39',true]],null,48);
 card(c,7.2,1.2,5.4,4.4);T(c.s,'57 : 16 = 3  Rest 9',7.2,1.5,5.4,1.0,{fontSize:24,bold:true,align:'center',valign:'middle'});
 T(c.s,'3 und 9',7.2,2.7,5.4,0.9,{fontSize:26,bold:true,color:GREEN,align:'center',valign:'middle'});tile(c.s,8.3,3.9,1.5,1.2,'3',NEON,INK,40);tile(c.s,10.0,3.9,1.5,1.2,'9',CHIP,INK,40);},'LIGHT');
// 36
SL.push(c=>{L(c,'Warum hexadezimal?',[['Warum so ',false],['kompliziert',true],['?',false]],'Die Antwort ist wieder das Byte.',40);
 bubble(c.s,'Es geht doch auch mit normalen Zahlen?',7.2,1.2,5.4,1.5,CARD,INK,17);
 ['0','1','1','0','1','0','0','1'].forEach((t,i)=>tile(c.s,7.2+i*0.68,3.7,0.62,1.0,t,i%2?NEON:CHIP,INK,22));T(c.s,'1 Byte',7.2,4.85,5.4,0.6,{fontSize:18,bold:true,color:NEON,align:'center'});},'DARK');
// 37
SL.push(c=>{L(c,'Hex und das Byte',[['Zwei Hex-Ziffern = ',false],['ein Byte',true]],'Jeder Farbanteil passt in genau zwei Zeichen: 00 bis ff.',38);
 card(c,7.2,1.1,5.4,1.5);T(c.s,'1 Hex-Ziffer = 4 Bit',7.4,1.1,5.0,1.5,{fontSize:22,bold:true,valign:'middle',align:'center'});
 card(c,7.2,2.9,5.4,1.5);T(c.s,'2 Hex-Ziffern = 1 Byte',7.4,2.9,5.0,1.5,{fontSize:22,bold:true,valign:'middle',align:'center'});
 card(c,7.2,4.7,5.4,1.5,DEEP,DEEP);T(c.s,'hex: immer 2 Stellen\ndezimal: 1, 2 oder 3',7.4,4.7,5.0,1.5,{fontSize:17,bold:true,color:NEON,valign:'middle',align:'center'});},'LIGHT');
// 38
SL.push(c=>{L(c,'Zahl 192 binär',[['1100 0000 ',false],['= c0',true]],'Zwei Vierergruppen ergeben zwei Hex-Ziffern.',42);
 ['1','1','0','0','0','0','0','0'].forEach((t,i)=>tile(c.s,7.2+i*0.68+(i>3?0.25:0),1.4,0.62,0.9,t,i<4?NEON:CHIP,INK,22));
 arrow(c.s,S.downArrow,8.3,2.5,0.5,0.6,GREEN);arrow(c.s,S.downArrow,10.9,2.5,0.5,0.6,GREEN);
 tile(c.s,7.8,3.3,1.5,1.2,'c',NEON,INK,40);tile(c.s,10.4,3.3,1.5,1.2,'0',CHIP,INK,40);
 T(c.s,'1100 = c    0000 = 0',7.2,4.8,5.4,0.6,{fontSize:18,bold:true,align:'center'});},'LIGHT');
// 39
SL.push(c=>{L(c,'Kurz und lesbar',[['Hex: eine ',false],['kurze',true],[' Schreibweise für Binärzahlen',false]],'Nicht nur für Farben.',36);
 card(c,7.2,1.3,5.4,1.4);mono(c.s,'1100 0000',7.2,1.3,5.4,1.4,28,INK,'center');T(c.s,'⇅',7.2,2.8,5.4,0.8,{fontSize:34,bold:true,color:GREEN,align:'center',valign:'middle'});
 card(c,7.2,3.7,5.4,1.4,DEEP,DEEP);mono(c.s,'c0',7.2,3.7,5.4,1.4,36,NEON,'center');},'LIGHT');
// 40
SL.push(c=>{L(c,'Farbcodes im Alltag',[['Hier begegnen dir ',false],['Farbcodes',true]],null,40);
 ['HTML und CSS: Webseiten gestalten','Bildbearbeitung und Design-Tools','Word und PowerPoint: „Weitere Farben“'].forEach((t,i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);circleNum(c.s,i+1,7.5,y+0.45,0.65,NEON,DEEP);T(c.s,t,8.4,y,4.0,1.55,{fontSize:16,bold:true,valign:'middle'});});},'LIGHT');
// 41
SL.push(c=>{L(c,'Praktisch',[['Überall ',false],['dieselbe Farbe',true]],'Einfach den Farbcode notieren.',40);
 ['Folie','Plakat','Webseite'].forEach((t,i)=>{const x=7.2+i*1.85;card(c,x,1.5,1.7,3.0);sw(c.s,x+0.2,1.7,1.3,1.5,AC);T(c.s,t,x,3.35,1.7,0.5,{fontSize:15,bold:true,align:'center'});mono(c.s,'#c0392b',x,3.85,1.7,0.5,12,GREEN,'center');});},'LIGHT');
// 42
SL.push(c=>{L(c,'Jetzt bist du dran',[['Welche Farbe ist ',false],['#ff8000',true],['?',false]],'Pausiere das Video und rechne um.',40);
 card(c,7.2,1.2,5.4,3.0,DEEP,DEEP);mono(c.s,'#ff8000',7.2,1.3,5.4,1.2,34,NEON,'center');
 [['ff','Rot'],['80','Grün'],['00','Blau']].forEach(([t,l],i)=>{tile(c.s,7.6+i*1.6,2.7,1.4,0.9,t,CHIP,INK,24);T(c.s,l,7.6+i*1.6,3.65,1.4,0.4,{fontSize:13,bold:true,color:DSUB,align:'center'});});
 bubble(c.s,'rgb( ? , ? , ? )',8.6,4.8,3.4,0.9,CARD,INK,18);},'NEON');
// 43
SL.push(c=>{L(c,'Lösung',[['#ff8000 = ',false],['kräftiges Orange',true]],null,40);
 const rows=[['ff = 15 × 16 + 15','255'],['80 = 8 × 16','128'],['00','0']];rows.forEach((r,i)=>{const y=1.1+i*1.2;card(c,7.2,y,5.4,1.0);T(c.s,r[0],7.5,y,3.6,1.0,{fontSize:16,bold:true,valign:'middle'});T(c.s,r[1],11.2,y,1.2,1.0,{fontSize:26,bold:true,color:GREEN,valign:'middle',align:'center'});});
 mono(c.s,'rgb(255, 128, 0)',7.2,4.8,5.4,0.7,22,INK,'center');sw(c.s,8.8,5.6,2.2,0.9,'FF8000');},'LIGHT');
// 44
SL.push(c=>{L(c,'Noch eine Frage',[['Welche Farbe ist ',false],['#333333',true],['?',false]],'Zum Nachdenken.',40);
 card(c,7.2,1.4,5.4,3.6,DEEP,DEEP);mono(c.s,'#333333',7.2,1.6,5.4,1.4,36,NEON,'center');
 [['33','Rot'],['33','Grün'],['33','Blau']].forEach(([t,l],i)=>{tile(c.s,7.6+i*1.6,3.2,1.4,0.9,t,CHIP,INK,24);T(c.s,l,7.6+i*1.6,4.15,1.4,0.4,{fontSize:13,bold:true,color:DSUB,align:'center'});});},'LIGHT');
// 45
SL.push(c=>{L(c,'Lösung',[['#333333 = ',false],['dunkles Grau',true]],'Drei gleiche Paare: ein Grauton.',40);
 card(c,7.2,1.2,5.4,2.4);T(c.s,'33 = 3 × 16 + 3',7.2,1.3,5.4,1.1,{fontSize:22,bold:true,align:'center',valign:'middle'});T(c.s,'= 51',7.2,2.4,5.4,1.0,{fontSize:34,bold:true,color:GREEN,align:'center',valign:'middle'});
 mono(c.s,'rgb(51, 51, 51)',7.2,3.9,5.4,0.7,22,INK,'center');sw(c.s,8.8,4.8,2.2,1.2,'333333');},'LIGHT');
// 46
SL.push(c=>{L(c,'Zusammenfassung',[['Pixel, Byte und ',false],['16,7 Millionen',true],[' Farben',false]],null,38);
 ['Jedes Pixel mischt Rot, Grün und Blau Licht','Jeder Anteil: ein Byte, Wert 0 bis 255','Über 16,7 Millionen Farben'].forEach((t,i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);check(c.s,7.5,y+0.45,0.65,NEON);T(c.s,t,8.5,y,4.0,1.55,{fontSize:16,bold:true,valign:'middle'});});},'LIGHT');
// 47
SL.push(c=>{L(c,'Zusammenfassung',[['Dezimal und ',false],['hexadezimal',true]],'Beides ist dieselbe Farbe.',40);
 card(c,7.2,1.1,5.4,1.4);mono(c.s,'rgb(192, 57, 43)',7.2,1.1,5.4,1.4,22,INK,'center');card(c,7.2,2.8,5.4,1.4,DEEP,DEEP);mono(c.s,'#c0392b',7.2,2.8,5.4,1.4,30,NEON,'center');
 T(c.s,'Hex: 16 Ziffern, 0 bis f\n2 Hex-Ziffern = 1 Byte',7.2,4.5,5.4,1.4,{fontSize:17,bold:true,align:'center',valign:'middle'});},'LIGHT');
// 48
SL.push(c=>{L(c,'Merksatz',[['Jede Farbe sind ',false],['drei Zahlen',false]],null,40);
 card(c,7.2,1.2,5.4,4.8,DEEP,DEEP);T(c.s,'Rot, Grün, Blau',7.2,1.5,5.4,1.0,{fontSize:28,bold:true,color:NEON,align:'center',valign:'middle'});
 T(c.s,'dezimal',7.2,2.8,5.4,0.5,{fontSize:15,color:DSUB,align:'center'});mono(c.s,'0 bis 255',7.2,3.2,5.4,0.8,28,CARD,'center');
 T(c.s,'hexadezimal',7.2,4.2,5.4,0.5,{fontSize:15,color:DSUB,align:'center'});mono(c.s,'00 bis ff',7.2,4.6,5.4,0.8,28,NEON,'center');},'NEON');
// 49
SL.push(c=>{L(c,'Bis zum nächsten Mal',[['Lass gerne ein ',false],['Abo',true],[' da',false]],null,44);
 card(c,8.2,1.5,3.6,3.6,DEEP,DEEP);T(c.s,'Abo',8.2,1.8,3.6,1.4,{fontSize:44,bold:true,color:NEON,align:'center',valign:'middle'});badge(c.s,'kostenlos',9.0,3.6,2.0,0.55,NEON,INK,16);},'DARK');
// 50
SL.push(c=>{L(c,'Dein Auftrag',[['Deine ',false],['Lieblingsfarbe',true],[' umrechnen',false]],'Bis zum nächsten Mal!',42);
 ['Lieblingsfarbe im Farbwähler aussuchen','Hex-Code notieren','Selbst in RGB-Werte umrechnen'].forEach((t,i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);circleNum(c.s,i+1,7.5,y+0.45,0.65,NEON,DEEP);T(c.s,t,8.5,y,4.0,1.55,{fontSize:16,bold:true,valign:'middle'});});},'LIGHT');
const TXT=JSON.parse(require('fs').readFileSync(__dirname+'/farben.json','utf8'));
// Reihenfolge: SL und Modus
let _i=0,_k=0;
while(_i<SL.length){const f=SL[_i];let mode='LIGHT';if(typeof SL[_i+1]==='string'){mode=SL[_i+1];_i+=2;}else _i+=1;
  const t=TXT[_k];const c=mk(mode,'Folie '+(_k+1)+' – '+t[1]+': '+t[2]);f(c);_k++;}
if(_k!==50)throw new Error('Folienzahl '+_k);
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',n);})();
