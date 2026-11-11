const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='D8F2F2', CARD='F3FCFC', INK='0B2326', GREEN='0A5C66', NEON='5FE0E6', DEEP='0F3A40',
  GRAY='4A6A6E', LINE='9FCFD2', CHIP='BFE8EA', TAB2='CBEEEE', DEEP2='17525A', DEEPLINE='2F7C85', DSUB='A9D7DB';
const FONT='Poppins';
const THEME={name:'Cleverbox Teal',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='Probleme beim Kauf – Videofolien';
pres.author='Cleverbox';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Cleverbox · Betriebswirtschaft',options:{x:0.7,y:7.05,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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
  const runs=segs.map(([t,a,br])=>({text:t,options:{color:a?c.P.acc:c.P.text,highlight:(a&&c.P.hl)?NEON:undefined,breakLine:!!br}}));
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



const OUT='/home/user/claudecloud/videoslides/cleverbox-probleme-kauf-slides.pptx';
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

const TXT=JSON.parse(require('fs').readFileSync(__dirname+'/pk.json','utf8'));
function person(s,cx,y,w,fill){fill=fill||DEEP;s.addShape(S.ellipse,{x:cx-w*0.25,y,w:w*0.5,h:w*0.5,fill:{color:fill},line:{color:fill,width:0}});
  s.addShape(S.roundRect,{x:cx-w*0.5,y:y+w*0.58,w,h:w*0.62,rectRadius:w*0.28,fill:{color:fill},line:{color:fill,width:0}});}
function L(c,kick,segs,subt,size=38,subY){kicker(c,kick,0.7,1.2);
  const full=segs.map(x=>x[0]).join('');let lines=1;
  if(full.length>=20){ // deterministischer Umbruch nahe der Mitte
    let pos=0,best=-1,bd=1e9;for(let k=0;k<full.length;k++){if(full[k]===' '){const d=Math.abs(k-full.length/2);if(d<bd){bd=d;best=k;}}}
    const ns=[];let acc=0;
    segs.forEach(([t,a])=>{const e=acc+t.length;
      if(best>=acc&&best<e){const o=best-acc;const l=t.slice(0,o),r=t.slice(o+1);if(l)ns.push([l,a,true]);else if(ns.length)ns[ns.length-1][2]=true;if(r)ns.push([r,a]);}
      else ns.push([t,a]);acc=e;});
    segs=ns;lines=2;}
  head(c,segs,0.7,1.75,6.2,3.0,size);
  if(subt)sub(c,subt,0.7,subY||(1.75+lines*0.0165*size+0.03),5.8,1.8,18);}
function lst(c,items,hi,y0=0.7,gap=0.68,h=0.58){steps(c,hi,items,7.2,y0,gap,h,5.4);}


const S6=['Anfrage','Angebot','Bestellung','Lieferung','Annahme','Bezahlung'];
const BR=['Betreff','Anlass und Anliegen','Gewünschte Reaktion','Schluss','Grußformel'];
const SL=[];
const add=(mode,fn)=>{SL.push(fn);SL.push(mode);};
function two(c,a,b,hi,subA,subB,y0=1.2,h=2.3){[[a,subA],[b,subB]].forEach(([t,s_],i)=>{const y=y0+i*(h+0.4),on=hi===i;card(c,7.2,y,5.4,h,on?NEON:CARD,on?DEEP:LINE);
 T(c.s,t,7.5,y+0.15,4.8,0.8,{fontSize:20,bold:true,color:INK,valign:'middle'});if(s_)T(c.s,s_,7.5,y+0.95,4.8,h-1.1,{fontSize:14,color:on?INK:GRAY,valign:'top'});});}
function chips(c,items,y0=3.4,h=0.7,gap=0.85){items.forEach((t,i)=>tile(c.s,7.2,y0+i*gap,5.4,h,t,i%2?CHIP:NEON,INK,17));}
function flow(c,a,b,y=0.9){tile(c.s,7.2,y,2.2,1.2,a,NEON,DEEP,17);tile(c.s,10.4,y,2.2,1.2,b,DEEP,NEON,17);arrow(c.s,S.rightArrow,9.5,y+0.35,0.8,0.5,GREEN);}
function pts(c,items,y0=1.0,gap=1.2,h=1.0,ico=true){items.forEach((t,i)=>{const y=y0+i*gap;card(c,7.2,y,5.4,h);if(ico)check(c.s,7.5,y+(h-0.5)/2,0.5,DEEP);T(c.s,t,8.3,y,4.2,h,{fontSize:15,bold:true,valign:'middle'});});}
function inv(c,hi){
  card(c,7.0,0.6,5.8,6.1);
  const row=(key,y,txt,r,b)=>{const on=hi.includes(key);if(on)c.s.addShape(S.roundRect,{x:7.2,y:y-0.04,w:5.4,h:0.52,rectRadius:0.08,fill:{color:NEON},line:{color:DEEP,width:1.5}});
    T(c.s,txt,7.35,y,3.9,0.44,{fontSize:12,bold:!!b,color:INK,valign:'middle'});if(r)T(c.s,r,10.7,y,1.75,0.44,{fontSize:12,bold:!!b,color:INK,align:'right',valign:'middle'});};
  row('addr',0.8,'Ballsport Großhandel GmbH, Linz');row('addr',1.35,'An: Sport Huber, Steyr');
  row('nr',2.05,'RECHNUNG','Nr. 2025-0142',true);row('date',2.6,'Rechnungs- und Lieferdatum','3. Juli');
  row('item',3.3,'50 Stk. Fußball „Training Pro“','600,00 €');row('ust',3.85,'Nettobetrag','600,00 €');row('ust',4.4,'+ 20 % Umsatzsteuer','120,00 €');row('ust',4.95,'Rechnungsbetrag','720,00 €',true);row('uid',5.65,'UID-Nr. des Verkäufers: ATU …');}

function chain(c,items,y0=1.0,h=1.0,gap=0.45,fills){items.forEach((t,i)=>{const y=y0+i*(h+gap);tile(c.s,7.2,y,5.4,h,t,(fills&&fills[i])||(i%2?NEON:CHIP),INK,16);if(i<items.length-1)arrow(c.s,S.downArrow,9.5,y+h+0.05,0.8,gap-0.1,GREEN);});}
function okno(c,items,y0=1.3,h=1.5,gap=0.5){items.forEach(([t,ok],i)=>{const y=y0+i*(h+gap);card(c,7.2,y,5.4,h);if(ok)check(c.s,7.5,y+(h-0.55)/2,0.55,DEEP);else xmark(c.s,7.5,y+(h-0.55)/2,0.55);T(c.s,t,8.4,y,4.0,h,{fontSize:17,bold:true,valign:'middle'});});}
const OPT=['Nachfrist setzen','Vom Vertrag zurücktreten','Schadensersatz fordern'];
const MOEG=['Nacherfüllung','Minderung','Rücktritt vom Vertrag','Schadensersatz'];
// 1
add('DARK',c=>{L(c,'Betriebswirtschaft',[['Probleme ',false],['beim Kauf',true]],'Wenn bei der Abwicklung etwas schiefgeht.',44);
 ['Lieferverzug','Mangelhafte Ware','Zahlungsverzug'].forEach((a,i)=>{const y=1.0+i*1.8;card(c,7.2,y,5.4,1.5,DEEP2,DEEPLINE);T(c.s,a,7.5,y,4.8,1.5,{fontSize:20,bold:true,color:NEON,valign:'middle'});});});
// 2
add('NEON',c=>{L(c,'Für Lehrkräfte',[['Arbeitsblatt zum ',false],['Video',false]],'Auf cleverbox.co.at, plus Anleitung zur Lehrerplattform im verlinkten Video.',38);
 card(c,7.2,1.1,5.4,4.4);tile(c.s,7.6,1.5,4.6,1.1,'Arbeitsblatt zum Video',DEEP,NEON,20);tile(c.s,7.6,2.9,4.6,1.1,'cleverbox.co.at',NEON,DEEP,20);tile(c.s,7.6,4.3,4.6,0.9,'Anleitung im Video (Beschreibung)',CHIP,INK,15);});
// 3
add('LIGHT',c=>{L(c,'Im letzten Video',[['Moritz schließt einen ',false],['Kaufvertrag',true],[' ab',false]],'Erfolgreich abgeschlossen.',38);flow(c,'Moritz','Verkäufer',1.2);
 card(c,7.2,3.1,5.4,1.6,NEON,DEEP);check(c.s,7.6,3.65,0.55,DEEP);T(c.s,'Kaufvertrag abgeschlossen',8.4,3.1,4.0,1.6,{fontSize:17,bold:true,valign:'middle'});});
// 4
add('LIGHT',c=>{L(c,'Komplikationen',[['Es kann immer ',false],['Probleme',true],[' geben',false]],'Einige davon sehen wir uns heute an.',38);chain(c,['Ware kommt zu spät','Ware ist mangelhaft','Zahlung bleibt aus'],1.0,1.1,0.4);});
// 5
add('LIGHT',c=>{L(c,'Lieferverzug',[['Was ist ein ',false],['Lieferverzug',true],['?',false]],'Eine bestellte Ware wird nicht rechtzeitig geliefert.',38);chain(c,['Ware bestellt','Lieferung bis 10. März','Ware kommt nicht rechtzeitig'],1.2,1.0,0.5,[CHIP,CHIP,NEON]);});
// 6
add('LIGHT',c=>{L(c,'Lieferverzug',[['Nicht jede Verspätung ist ',false],['Verzug',true]],'Es gibt bestimmte Voraussetzungen.',38);lst(c,['Lieferung ist fällig','Verkäufer ist schuld','Käufer mahnt (wenn kein fester Termin)'],[],1.4,1.3,1.0);});
// 7
add('LIGHT',c=>{L(c,'Voraussetzung 1',[['Die Lieferung muss ',false],['fällig',true],[' sein',false]],null,38);lst(c,['Lieferung ist fällig','Verkäufer ist schuld','Käufer mahnt (wenn kein fester Termin)'],[0],1.4,1.3,1.0);});
// 8
add('LIGHT',c=>{L(c,'Voraussetzung 1',[['Ein ',false],['festes',true],[' Lieferdatum',false]],'Z. B. „Lieferung bis zum 10. März“.',38);two(c,'Festes Lieferdatum','Kein festes Datum',0,'z. B. „Lieferung bis zum 10. März“','Mahnung und Nachfrist nötig',1.3,2.2);});
// 9
add('LIGHT',c=>{L(c,'Voraussetzung 1',[['Kein ',false],['festes',true],[' Datum',false]],'Der Käufer muss mahnen und eine Nachfrist setzen.',38);two(c,'Festes Lieferdatum','Kein festes Datum',1,'z. B. „Lieferung bis zum 10. März“','Mahnung und Nachfrist nötig',1.3,2.2);});
// 10
add('LIGHT',c=>{L(c,'Voraussetzung 2',[['Der Verkäufer muss ',false],['schuld',true],[' sein',false]],null,38);lst(c,['Lieferung ist fällig','Verkäufer ist schuld','Käufer mahnt (wenn kein fester Termin)'],[1],1.4,1.3,1.0);});
// 11
add('LIGHT',c=>{L(c,'Voraussetzung 2',[['Nicht schuld: ',false],['kein Verzug',true]],'Z. B. Streik oder Naturkatastrophen.',38);two(c,'Verkäufer ist schuld','Verkäufer ist nicht schuld',1,'Lieferverzug möglich','z. B. Streik, Naturkatastrophe: kein Verzug',1.3,2.2);});
// 12
add('LIGHT',c=>{L(c,'Voraussetzung 3',[['Der Käufer muss ',false],['mahnen',true]],'Falls kein fester Termin vereinbart wurde.',38);lst(c,['Lieferung ist fällig','Verkäufer ist schuld','Käufer mahnt (wenn kein fester Termin)'],[2],1.4,1.3,1.0);});
// 13
add('LIGHT',c=>{L(c,'Beispiel',[['Schuhe ',false],['bestellt',true]],'Nachfrist z. B. 7 Tage.',40);chain(c,['Schuhe bestellt','Keine Versandbestätigung','E-Mail an den Händler: Nachfrist 7 Tage'],1.2,1.0,0.5,[CHIP,CHIP,NEON]);});
// 14
add('LIGHT',c=>{L(c,'Lieferverzug',[['Was kann der ',false],['Käufer',true],[' tun?',false]],'Drei Möglichkeiten.',38);lst(c,OPT,[],1.4,1.3,1.0);});
// 15-17
['Du gibst dem Verkäufer noch etwas Zeit.','Wenn die Ware nicht kommt, kannst du stornieren.','Bei finanziellen Nachteilen kannst du eine Entschädigung verlangen.'].forEach((sb,i)=>add('LIGHT',c=>{
 L(c,'Lieferverzug',[[['Nachfrist setzen','Rücktritt vom Vertrag','Schadensersatz'][i],true]],sb,40);lst(c,OPT,[i],1.4,1.3,1.0);}));
// 18
add('LIGHT',c=>{L(c,'Beispiel',[['Moritz kauft ein ',false],['Geschenk',true]],'Für eine Geburtstagsfeier.',38);chain(c,['Geschenk bestellt','Geburtstagsfeier','Geschenk kommt zu spät'],1.2,1.0,0.5,[CHIP,CHIP,NEON]);});
// 19
add('LIGHT',c=>{L(c,'Beispiel',[['Das ',false],['Ersatzgeschenk',true]],'Der Händler könnte für den zusätzlichen Preis haften.',38);chain(c,['Ersatzgeschenk kaufen','Kostet mehr','Händler haftet für den Mehrpreis'],1.2,1.0,0.5,[CHIP,CHIP,NEON]);});
// 20
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Rechtzeitig, aber ',false],['mangelhaft',true]],'Moritz erhält seine Ware.',38);okno(c,[['Rechtzeitig geliefert',true],['Aber mangelhaft',false]]);});
// 21
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Was heißt ',false],['mangelhaft',true],['?',false]],null,40);card(c,7.2,1.5,5.4,3.6);T(c.s,'?',7.2,1.5,5.4,3.6,{fontSize:96,bold:true,color:GREEN,align:'center',valign:'middle'});});
// 22
add('LIGHT',c=>{L(c,'Definition',[['Der ',false],['Sachmangel',true]],'Die Ware entspricht nicht den Erwartungen.',40);okno(c,[['Nicht die vereinbarte Qualität',false],['Nicht für den vorgesehenen Zweck geeignet',false]],1.4,1.6,0.5);});
// 23
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Arten von ',false],['Mängeln',true]],null,40);two(c,'Offene Mängel','Versteckte Mängel',-1,null,null,1.5,2.0);});
// 24
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Offene ',false],['Mängel',true]],'Sofort sichtbar.',40);two(c,'Offene Mängel','Versteckte Mängel',0,'z. B. ein zerbrochenes Display','z. B. ein Akku, der nach einer Woche nicht mehr lädt',1.3,2.2);});
// 25
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Versteckte ',false],['Mängel',true]],'Erst später erkennbar.',40);two(c,'Offene Mängel','Versteckte Mängel',1,'z. B. ein zerbrochenes Display','z. B. ein Akku, der nach einer Woche nicht mehr lädt',1.3,2.2);});
// 26
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Die Lösung hängt vom ',false],['Mangel',true],[' ab',false]],'Man unterscheidet mehrere Arten von Mängeln.',36);chips(c,['offen / versteckt','wesentlich / nicht wesentlich','reparierbar / nicht reparierbar'],1.6,0.9,1.3);});
// 27
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Wesentlich ',false],['oder nicht',true]],null,40);two(c,'Unwesentlicher Mangel','Wesentlicher Mangel',-1,'eventuell auf einen Rabatt einigen','muss auf jeden Fall korrigiert werden',1.3,2.2);});
// 28
add('LIGHT',c=>{L(c,'Mangelhafte Ware',[['Vier ',false],['Möglichkeiten',true],[' für den Käufer',false]],'Je nach Mangel.',36);lst(c,MOEG,[],1.1,1.3,1.0);});
// 29-32
['Der Verkäufer muss die Ware reparieren oder ersetzen.','Du kannst einen Teil des Kaufpreises zurückverlangen.','Du gibst die Ware zurück und bekommst dein Geld wieder.','Wenn der Mangel dich Geld kostet, kann der Verkäufer dafür haften.'].forEach((sb,i)=>add('LIGHT',c=>{
 L(c,'Mangelhafte Ware',[[['Die ','Die ','Der ','Der '][i],false],[['Nacherfüllung','Minderung','Rücktritt','Schadensersatz'][i],true]],sb,40);lst(c,MOEG,[i],1.1,1.3,1.0);}));
// 33
add('LIGHT',c=>{L(c,'Beispiel',[['Ein neues ',false],['Fahrrad',true]],'Die Bremsen funktionieren nicht.',40);chain(c,['Moritz kauft ein neues Fahrrad','Die Bremsen funktionieren nicht'],1.6,1.2,0.6,[CHIP,NEON]);});
// 34
add('LIGHT',c=>{L(c,'Beispiel',[['Der ',false],['Händler',true],[' muss handeln',false]],null,38);two(c,'Nachbessern','Neues Rad geben',-1,null,null,1.5,2.0);});
// 35
add('LIGHT',c=>{L(c,'Beispiel',[['Sogar ',false],['Schadensersatz',true]],'Für das kaputte Handy.',40);chain(c,['Sturz wegen defekter Bremsen','Handy kaputt','Schadensersatz fordern'],1.2,1.0,0.5,[CHIP,CHIP,NEON]);});
// 36
add('NEON',c=>{L(c,'Und jetzt?',[['Auch Käufer machen ',false],['Fehler',true]],'Damit kommen wir zum Zahlungsverzug.',38);tile(c.s,7.2,2.0,5.4,2.4,'Zahlungsverzug',DEEP,NEON,28);});
// 37
add('LIGHT',c=>{L(c,'Zusammenfassung',[['Der ',false],['Lieferverzug',true]],'Die Ware kommt zu spät.',40);pts(c,OPT,1.4,1.5,1.2);});
// 38
add('LIGHT',c=>{L(c,'Zusammenfassung',[['Die ',false],['Mängel',true]],'Die Ware ist defekt.',40);pts(c,['Anspruch auf Reparatur','Anspruch auf Ersatz','Anspruch auf Erstattung'],1.4,1.5,1.2);});
let _i=0,_k=0;
while(_i<SL.length){const f=SL[_i];let mode='LIGHT';if(typeof SL[_i+1]==='string'){mode=SL[_i+1];_i+=2;}else _i+=1;
  const t=TXT[_k];const c=mk(mode,'Folie '+(_k+1)+' – '+t[1]+': '+t[2]);f(c);
  const ob=c.s._slideObjects.filter(o=>o.options&&o.options.x>=6.9&&o.options.y!==undefined);
  if(ob.length){const mn=Math.min(...ob.map(o=>o.options.y)),mx=Math.max(...ob.map(o=>o.options.y+(o.options.h||0)));
    let dy=4.2-(mn+mx)/2;dy=Math.max(Math.min(dy,6.85-mx),0.5-mn);if(dy>0)ob.forEach(o=>o.options.y+=dy);}
  _k++;}
if(_k!==38)throw new Error('Folienzahl '+_k);
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',_k);})();
