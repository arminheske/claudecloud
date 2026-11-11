const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='D8F2F2', CARD='F3FCFC', INK='0B2326', GREEN='0A5C66', NEON='5FE0E6', DEEP='0F3A40',
  GRAY='4A6A6E', LINE='9FCFD2', CHIP='BFE8EA', TAB2='CBEEEE', DEEP2='17525A', DEEPLINE='2F7C85', DSUB='A9D7DB';
const FONT='Poppins';
const THEME={name:'Cleverbox Teal',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='Die Abwicklung eines Kaufs – Videofolien';
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



const OUT='/home/user/claudecloud/videoslides/cleverbox-abwicklung-kauf-slides.pptx';
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

const TXT=JSON.parse(require('fs').readFileSync(__dirname+'/ak.json','utf8'));
function person(s,cx,y,w,fill){fill=fill||DEEP;s.addShape(S.ellipse,{x:cx-w*0.25,y,w:w*0.5,h:w*0.5,fill:{color:fill},line:{color:fill,width:0}});
  s.addShape(S.roundRect,{x:cx-w*0.5,y:y+w*0.58,w,h:w*0.62,rectRadius:w*0.28,fill:{color:fill},line:{color:fill,width:0}});}
function L(c,kick,segs,subt,size=38,subY=4.7){kicker(c,kick,0.7,1.2);head(c,segs,0.7,1.75,6.2,3.0,size);if(subt)sub(c,subt,0.7,subY,5.8,1.8,18);}
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
// 1
add('DARK',c=>{L(c,'Einkauf und Verkauf',[['Die ',false],['Abwicklung',true],[' eines Kaufs',false]],'Von der ersten Anfrage bis zur Bezahlung.',44);
 [['Sportgeschäft','kauft Fußbälle'],['Bäckerei','kauft Mehl'],['Schule','kauft Laptops']].forEach(([a,b],i)=>{const y=1.0+i*1.8;card(c,7.2,y,5.4,1.5,DEEP2,DEEPLINE);T(c.s,a,7.5,y+0.15,4.8,0.6,{fontSize:20,bold:true,color:NEON,valign:'middle'});T(c.s,b,7.5,y+0.8,4.8,0.5,{fontSize:15,color:CARD,valign:'middle'});});});
// 2
add('LIGHT',c=>{L(c,'Unser Beispiel',[['Ein Sportgeschäft kauft ',false],['Fußbälle',true]],'Immer derselbe Ablauf.',38);
 tile(c.s,7.2,1.2,2.2,1.4,'Sportgeschäft',NEON,DEEP,14);tile(c.s,10.4,1.2,2.2,1.4,'Großhändler',DEEP,NEON,14);arrow(c.s,S.rightArrow,9.5,1.65,0.8,0.5,GREEN);
 card(c,7.2,3.2,5.4,2.4);T(c.s,'6 Schritte',7.2,3.3,5.4,1.3,{fontSize:34,bold:true,color:GREEN,align:'center',valign:'middle'});T(c.s,'Anfrage bis Bezahlung',7.2,4.5,5.4,0.8,{fontSize:16,color:GRAY,align:'center',valign:'middle'});});
// 3-4
add('LIGHT',c=>{L(c,'Überblick',[['Sechs ',false],['Schritte',true],[', zwei Phasen',false]],'Vom Anbahnen bis zum Bezahlen.',38);lst(c,S6,[],0.9,0.95,0.8);});
add('LIGHT',c=>{L(c,'Phase 1',[['Der ',false],['Abschluss',true]],'Der Kaufvertrag wird abgeschlossen.',40);lst(c,S6,[0,1,2],0.9,0.95,0.8);});
[['Anfrage','Käufer → Verkäufer',0],['Angebot','Verkäufer → Käufer',1],['Bestellung','Käufer → Verkäufer',2]].forEach(([t,d,i])=>add('LIGHT',c=>{L(c,'Schritt '+(i+1),[[t==='Angebot'?'Das ':'Die ',false],[t,true]],d,42);lst(c,S6,[i],0.9,0.95,0.8);}));
add('LIGHT',c=>{L(c,'Phase 2',[['Die ',false],['Erfüllung',true]],'Der Kaufvertrag wird erfüllt.',40);lst(c,S6,[3,4,5],0.9,0.95,0.8);});
[['Lieferung','Verkäufer → Käufer',3],['Annahme','durch den Käufer',4],['Bezahlung','Käufer → Verkäufer',5]].forEach(([t,d,i])=>add('LIGHT',c=>{L(c,'Schritt '+(i+1),[[t==='Angebot'?'Das ':'Die ',false],[t,true]],d,42);lst(c,S6,[i],0.9,0.95,0.8);}));
// 12
add('LIGHT',c=>{L(c,'Gut zu wissen',[['Nicht ',false],['immer',true],[' nötig',false]],'Oft beginnt ein Kauf direkt mit der Bestellung.',40);lst(c,S6,[2,3,4,5],0.9,0.95,0.8);});
// 13
add('NEON',c=>{L(c,'Schriftlich',[['Sicherheit für ',false],['beide Seiten',true]],'Im Geschäftsleben meist schriftlich.',38);
 two(c,'Käufer','Verkäufer',-1,'Bekommt genau das, was er bestellt hat.','Liefert das Richtige und erhält den vereinbarten Preis.');});
// 14
add('LIGHT',c=>{L(c,'Im Unternehmen',[['Zwei ',false],['Bereiche',true],[' kümmern sich',false]],'Einkauf und Verkauf.',40);two(c,'Einkauf','Verkauf',-1,'Materialwirtschaft','Marketing');});
// 15
add('LIGHT',c=>{L(c,'Einkauf',[['Die ',false],['Materialwirtschaft',true]],'Sie klärt vier Fragen.',38);card(c,7.2,0.9,5.4,1.8,DEEP,DEEP);T(c.s,'Materialwirtschaft',7.2,0.9,5.4,1.8,{fontSize:24,bold:true,color:NEON,align:'center',valign:'middle'});chips(c,['Was soll eingekauft werden?','Wie viel?','Zu welchem Preis?','Bei wem?'],3.0,0.7,0.9);});
// 16
add('LIGHT',c=>{L(c,'Einkauf',[['Aufgaben der ',false],['Materialwirtschaft',true]],'Neben dem Preis zählt die Zuverlässigkeit.',34);lst(c,['Anfragen einholen','Angebote vergleichen','Bestellen','Ware und Rechnungen prüfen','Lieferanten bewerten','Lagerung und Transport','Entsorgung von Abfällen'],[],0.55,0.68,0.58);});
// 17
add('LIGHT',c=>{L(c,'Verkauf',[['Das ',false],['Marketing',true]],'Es klärt vier Fragen.',40);card(c,7.2,0.9,5.4,1.8,DEEP,DEEP);T(c.s,'Marketing',7.2,0.9,5.4,1.8,{fontSize:24,bold:true,color:NEON,align:'center',valign:'middle'});chips(c,['Was soll verkauft werden?','Zu welchem Preis?','Wo?','Mit welchen Argumenten?'],3.0,0.7,0.9);});
// 18
add('LIGHT',c=>{L(c,'Verkauf',[['Aufgaben des ',false],['Marketings',true]],null,38);lst(c,['Angebote erstellen','Bestellungen annehmen','Auftragsbestätigungen schreiben','Lieferscheine schreiben','Waren ausgeben oder verschicken'],[],0.9,0.95,0.8);});
// 19
add('NEON',c=>{L(c,'Zusammenarbeit',[['Eng ',false],['zusammenarbeiten',true]],'Sonst hat das Sportgeschäft keine Fußbälle mehr im Lager.',36);
 tile(c.s,7.2,1.0,2.2,1.2,'Verkauf',DEEP,NEON,18);tile(c.s,10.4,1.0,2.2,1.2,'Einkauf',DEEP,NEON,18);arrow(c.s,S.leftRightArrow,9.5,1.35,0.8,0.5,INK);
 bubble(c.s,'Wir brauchen bald neue Fußbälle!',7.2,3.0,5.4,1.4,CARD,INK,17);card(c,7.2,4.8,5.4,1.2);T(c.s,'rechtzeitig melden',7.2,4.8,5.4,1.2,{fontSize:18,bold:true,align:'center',valign:'middle'});});
// 20-24
add('LIGHT',c=>{L(c,'Geschäftsbrief',[['Immer ',false],['derselbe',true],[' Aufbau',false]],'Anfragen, Angebote und Bestellungen: Brief oder E-Mail.',36);lst(c,BR,[],0.9,1.0,0.85);});
[[['Der ',false],['Betreff',true]],[['Anlass und ',false],['Anliegen',true]],[['Die gewünschte ',false],['Reaktion',true]],[['Schluss und ',false],['Grußformel',true]]].forEach((sg,i)=>add('LIGHT',c=>{
 L(c,'Geschäftsbrief',sg,['Worum geht es?','Warum schreibe ich?','Was erwarte ich vom Empfänger?','Höflicher Abschluss, z. B. „Mit freundlichen Grüßen“'][i],40);lst(c,BR,i===3?[3,4]:[i],0.9,1.0,0.85);}));
// 25
add('LIGHT',c=>{L(c,'Schritt 1: Anfrage',[['Anfrage an ',false],['mehrere',true],[' Großhändler',false]],'Es gibt zwei Arten.',38);
 tile(c.s,7.2,2.4,2.0,1.4,'Sportgeschäft',DEEP,NEON,12);['Großhändler A','Großhändler B','Großhändler C'].forEach((t,i)=>{arrow(c.s,S.rightArrow,9.3,1.2+i*1.7+0.35,0.6,0.4,GREEN);tile(c.s,10.0,1.0+i*1.7,2.6,1.0,t,NEON,DEEP,15);});});
add('LIGHT',c=>{L(c,'Schritt 1: Anfrage',[['Die ',false],['allgemeine',true],[' Anfrage',false]],'Sortiment, Preise, Liefer- und Zahlungsbedingungen.',38);two(c,'Allgemeine Anfrage','Spezielle Anfrage',0,'gesamtes Sortiment','ein bestimmtes Produkt');});
add('LIGHT',c=>{L(c,'Schritt 1: Anfrage',[['Die ',false],['spezielle',true],[' Anfrage',false]],'Z. B. 50 Trainingsbälle in Größe 5.',38);two(c,'Allgemeine Anfrage','Spezielle Anfrage',1,'gesamtes Sortiment','ein bestimmtes Produkt');});
add('NEON',c=>{L(c,'Wichtig',[['Verpflichtet ',false],['zu nichts',true]],'Das Sportgeschäft muss nichts kaufen. Es erwartet nur ein Angebot.',36);
 card(c,7.2,1.3,5.4,2.4);T(c.s,'Anfrage',7.2,1.4,5.4,1.2,{fontSize:30,bold:true,color:INK,align:'center',valign:'middle'});T(c.s,'= keine Pflicht',7.2,2.5,5.4,0.9,{fontSize:20,color:GRAY,align:'center',valign:'middle'});
 tile(c.s,7.2,4.2,5.4,1.1,'Erwartet wird: ein Angebot',DEEP,NEON,18);});
// 29-37
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Zwei ',false],['Arten',true],[' von Angeboten',false]],'Die Großhändler antworten.',38);two(c,'Nach dem Grund','Nach der Verpflichtung',-1,'warum es erstellt wurde','was der Verkäufer damit eingeht');});
function taxo(c,a,b,hi){two(c,a,b,hi,null,null,1.4,1.7);}
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Nach dem ',false],['Grund',true]],'Warum wurde es erstellt?',40);taxo(c,'Verlangtes Angebot','Unverlangtes Angebot',-1);});
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Das ',false],['verlangte',true],[' Angebot',false]],'Die Antwort auf eine Anfrage.',40);taxo(c,'Verlangtes Angebot','Unverlangtes Angebot',0);});
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Das ',false],['unverlangte',true],[' Angebot',false]],'Der Verkäufer meldet sich von sich aus: Sortiment oder Aktionen.',36);taxo(c,'Verlangtes Angebot','Unverlangtes Angebot',1);});
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Nach der ',false],['Verpflichtung',true]],'Was geht der Verkäufer ein?',38);taxo(c,'Bindendes Angebot','Freibleibendes Angebot',-1);});
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Das ',false],['bindende',true],[' Angebot',false]],'Der Verkäufer muss zu diesen Bedingungen liefern.',36);pts(c,['An eine bestimmte Person oder ein Unternehmen gerichtet','Alle wichtigen Infos: Menge, Preis, Eigenschaften','Keine Einschränkung'],1.2,1.8,1.4);});
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Die ',false],['Bindungsfrist',true]],'Wie lange ist der Verkäufer gebunden?',38);
 two(c,'Frist im Angebot','Keine Frist',-1,'z. B. „gültig bis 31. Mai“: Diese Frist gilt.','Überlegungszeit nach Art und Preis der Ware. Mündlich: sofort annehmen.',0.9,2.6);});
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Das ',false],['freibleibende',true],[' Angebot',false]],'Der Verkäufer entscheidet frei, ob er liefert.',36);
 ['„solange der Vorrat reicht“','„freibleibend“','„unverbindlich“','„Zwischenverkauf vorbehalten“'].forEach((t,i)=>tile(c.s,7.2,1.0+i*1.3,5.4,1.0,t,i%2?CHIP:NEON,INK,17));});
add('LIGHT',c=>{L(c,'Schritt 2: Angebot',[['Wirkt ',false],['freibleibend',true]],'Sie verpflichten den Verkäufer grundsätzlich zu nichts.',38);lst(c,['Werbeprospekte','Kataloge','Werbespots','Inserate','Schaufensterangebote'],[],0.9,0.95,0.8);});
// 38-43
add('LIGHT',c=>{L(c,'Schritt 3: Bestellung',[['Das Angebot ',false],['annehmen',true]],'Das Sportgeschäft vergleicht und entscheidet sich für einen Großhändler.',36);
 ['Angebot A','Angebot B','Angebot C'].forEach((t,i)=>{const y=1.0+i*1.45,on=i===1;card(c,7.2,y,5.4,1.15,on?NEON:CARD,on?DEEP:LINE);T(c.s,t,7.5,y,3.4,1.15,{fontSize:17,bold:true,valign:'middle'});if(on)check(c.s,11.6,y+0.3,0.55,DEEP);});
 badge(c.s,'Bestellung = Annahme',7.2,5.5,5.4,0.6,DEEP,NEON,16);});
add('LIGHT',c=>{L(c,'Schritt 3: Bestellung',[['Bindendes Angebot: ',false],['Vertrag',true]],'Beide Seiten sind jetzt verpflichtet.',36);
 tile(c.s,7.2,1.2,5.4,1.1,'Bindendes Angebot + Bestellung',CHIP,INK,17);arrow(c.s,S.downArrow,9.4,2.45,1.0,0.7,GREEN);tile(c.s,7.2,3.3,5.4,1.1,'Kaufvertrag',NEON,DEEP,22);
 tile(c.s,7.2,4.8,2.6,1.0,'Verkäufer liefert',DEEP,NEON,14);tile(c.s,10.0,4.8,2.6,1.0,'Käufer zahlt',DEEP,NEON,14);});
add('LIGHT',c=>{L(c,'Schritt 3: Bestellung',[['Freibleibend ',false],['oder kein Angebot',true]],'Der Verkäufer kann die Bestellung annehmen, muss aber nicht.',36);
 tile(c.s,7.2,1.2,5.4,1.1,'Freibleibendes oder kein Angebot',CHIP,INK,17);arrow(c.s,S.downArrow,9.4,2.45,1.0,0.7,GREEN);tile(c.s,7.2,3.3,5.4,1.1,'Verkäufer entscheidet',NEON,DEEP,20);
 T(c.s,'kann annehmen, muss aber nicht',7.2,4.6,5.4,0.7,{fontSize:15,color:GRAY,align:'center',valign:'middle'});});
add('LIGHT',c=>{L(c,'Schritt 3: Bestellung',[['Die ',false],['Auftragsbestätigung',true]],'Im Onlinehandel meist automatisch per E-Mail.',34);
 card(c,7.2,0.9,5.4,4.6);T(c.s,'Auftragsbestätigung',7.5,1.1,4.8,0.7,{fontSize:20,bold:true,color:GREEN,valign:'middle'});
 [4.2,3.4,3.9,2.8].forEach((w,i)=>c.s.addShape(S.roundRect,{x:7.5,y:2.1+i*0.55,w,h:0.22,rectRadius:0.08,fill:{color:CHIP},line:{color:CHIP,width:0}}));badge(c.s,'bestätigt die Bestellung',7.5,4.6,3.2,0.55,NEON,DEEP,14);});
add('LIGHT',c=>{L(c,'Schritt 3: Bestellung',[['Der ',false],['Widerruf',true]],'Später nur aus Kulanz des Verkäufers.',38);
 two(c,'Spätestens gleichzeitig','Später',-1,'Der Widerruf kommt zugleich mit der Bestellung beim Verkäufer an.','Nur möglich, wenn der Verkäufer aus Kulanz zustimmt.',1.0,2.5);});
add('NEON',c=>{L(c,'Phase 1 geschafft',[['Der Kaufvertrag ist ',false],['abgeschlossen',true]],'Jetzt muss er erfüllt werden.',38);lst(c,S6,[3,4,5],0.9,0.95,0.8);});
// 44-47
add('LIGHT',c=>{L(c,'Schritt 4: Lieferung',[['Drei ',false],['Möglichkeiten',true],[' für den Transport',false]],'Die Fußbälle müssen zum Sportgeschäft.',36);lst(c,['Verkäufer liefert selbst','Käufer holt ab','Dritter transportiert'],[],1.4,1.5,1.2);});
add('LIGHT',c=>{L(c,'Schritt 4: Lieferung',[['Selbst liefern ',false],['oder abholen',true]],null,38);two(c,'Verkäufer liefert selbst','Käufer holt ab',-1,'mit eigenen Fahrzeugen','die Ware beim Verkäufer');});
add('LIGHT',c=>{L(c,'Schritt 4: Lieferung',[['Ein ',false],['Dritter',true],[' übernimmt',false]],'Zwei Rollen sind zu unterscheiden.',38);
 two(c,'Frachtführer','Spediteur',-1,'transportiert die Ware wirklich, z. B. Post, Paketdienst, ÖBB','organisiert den Transport und beauftragt Frachtführer',0.9,2.6);});
add('LIGHT',c=>{L(c,'Schritt 4: Lieferung',[['Der ',false],['Lieferschein',true]],'Der Nachweis, dass die Ware geliefert wurde.',38);
 card(c,7.4,0.9,5.0,4.8);T(c.s,'LIEFERSCHEIN',7.7,1.1,4.4,0.7,{fontSize:20,bold:true,color:GREEN,valign:'middle'});
 T(c.s,'50 Stk. Fußball „Training Pro“',7.7,2.0,4.4,0.6,{fontSize:14,valign:'middle'});T(c.s,'Packstücke: 5',7.7,2.6,4.4,0.6,{fontSize:14,valign:'middle'});
 c.s.addShape(S.line,{x:7.7,y:4.9,w:2.6,h:0,line:{color:INK,width:1.5}});T(c.s,'Unterschrift',7.7,4.95,2.6,0.4,{fontSize:11,color:GRAY});});
// 48-50
add('LIGHT',c=>{L(c,'Schritt 5: Annahme',[['Die ',false],['Unterschrift',true]],'Sie bestätigt: Ware in einwandfreiem Zustand übernommen. Deshalb vorher prüfen.',34);
 card(c,7.4,0.9,5.0,4.8);T(c.s,'LIEFERSCHEIN',7.7,1.1,4.4,0.7,{fontSize:20,bold:true,color:GREEN,valign:'middle'});
 c.s.addShape(S.roundRect,{x:7.65,y:4.1,w:3.2,h:1.0,rectRadius:0.1,fill:{color:NEON},line:{color:DEEP,width:2}});T(c.s,'Unterschrift',7.65,4.1,3.2,1.0,{fontSize:15,bold:true,color:INK,align:'center',valign:'middle'});});
add('LIGHT',c=>{L(c,'Schritt 5: Annahme',[['Die Ware ',false],['prüfen',true]],'Offensichtliche Mängel werden auf dem Lieferschein vermerkt.',36);
 pts(c,['Verpackung unbeschädigt?','Anzahl der Packstücke wie auf dem Lieferschein?','Offensichtliche Mängel?'],1.2,1.8,1.4);});
add('LIGHT',c=>{L(c,'Schritt 5: Annahme',[['Keine Zeit ',false],['zum Prüfen',true],['?',false]],'Dann schreibt man auf den Lieferschein:',38);
 card(c,7.2,1.6,5.4,2.6,NEON,DEEP);T(c.s,'„vorbehaltlich späterer Prüfung“',7.5,1.6,4.8,2.6,{fontSize:22,bold:true,color:INK,align:'center',valign:'middle'});});
// 51-58
add('LIGHT',c=>{L(c,'Schritt 6: Rechnung',[['Die ',false],['Rechnung',true]],'Sie muss bestimmte Angaben enthalten.',40);inv(c,[]);});
add('LIGHT',c=>{L(c,'Pflichtangaben',[['Anschrift ',false],['und Datum',true]],'Verkäufer und Käufer, Rechnungs- und Lieferdatum.',36);inv(c,['addr','date']);});
add('LIGHT',c=>{L(c,'Pflichtangaben',[['Menge und ',false],['Bezeichnung',true]],'Der gelieferten Ware.',38);inv(c,['item']);});
add('LIGHT',c=>{L(c,'Pflichtangaben',[['Die ',false],['Umsatzsteuer',true]],'Steuersatz in Prozent, Nettobetrag und Umsatzsteuerbetrag.',36);inv(c,['ust']);});
add('LIGHT',c=>{L(c,'Pflichtangaben',[['Rechnungsnummer ',false],['und UID',true]],'Die UID-Nummer kennzeichnet ein Unternehmen in der EU eindeutig.',34);inv(c,['nr','uid']);});
add('LIGHT',c=>{L(c,'Kleinbetragsrechnung',[['Unter ',false],['400 €',true]],'Einige Angaben dürfen fehlen.',42);lst(c,['Anschrift des Käufers','Umsatzsteuerbetrag','Rechnungsnummer','UID-Nummer'],[],1.2,1.2,1.0);});
add('LIGHT',c=>{L(c,'Warum wichtig?',[['Pflichtangaben ',false],['fehlen',true]],'Eine unvollständige Rechnung immer korrigieren lassen.',36);
 tile(c.s,7.2,1.1,5.4,1.1,'Pflichtangaben fehlen',CHIP,INK,17);arrow(c.s,S.downArrow,9.4,2.35,1.0,0.7,GREEN);tile(c.s,7.2,3.2,5.4,1.1,'Kein Vorsteuerabzug',NEON,DEEP,20);T(c.s,'für die enthaltene Umsatzsteuer',7.2,4.4,5.4,0.6,{fontSize:15,color:GRAY,align:'center',valign:'middle'});});
add('LIGHT',c=>{L(c,'Zwei Details',[['Rabatt ',false],['und Skonto',true]],'Skonto zeigt sich erst bei der Zahlung.',38);
 two(c,'Rabatt','Skonto',-1,'wird direkt auf der Rechnung abgezogen; die Umsatzsteuer wird vom verminderten Betrag berechnet','wird nicht abgezogen: erst bei der Zahlung zeigt sich, ob rechtzeitig gezahlt wird',0.9,2.7);});
// 59-62
add('LIGHT',c=>{L(c,'Zusammenfassung',[['Sechs ',false],['Schritte',true]],'Abschluss und Erfüllung des Kaufvertrags.',40);lst(c,S6,[],0.9,0.95,0.8);});
add('LIGHT',c=>{L(c,'Zusammenfassung',[['Anfrage und ',false],['Angebot',true]],null,38);pts(c,['Eine Anfrage verpflichtet zu nichts','Bindendes Angebot + Bestellung = Kaufvertrag','Freibleibendes Angebot: kein Vertrag'],1.0,1.8,1.4);});
add('LIGHT',c=>{L(c,'Zusammenfassung',[['Lieferung ',false],['und Rechnung',true]],null,38);pts(c,['Ware prüfen, dann den Lieferschein unterschreiben','Rechnung mit allen Pflichtangaben','Nur dann darf die Vorsteuer abgezogen werden'],1.0,1.8,1.4);});
add('DARK',c=>{L(c,'Danke fürs Zuschauen',[['Bis zum ',false],['nächsten Mal',true],['!',false]],'Cleverbox · Betriebswirtschaft',40);
 tile(c.s,7.2,2.2,5.4,1.6,'Cleverbox',NEON,DEEP,34);T(c.s,'www.cleverbox.co.at',7.2,4.2,5.4,0.7,{fontSize:18,color:NEON,align:'center',valign:'middle'});});
let _i=0,_k=0;
while(_i<SL.length){const f=SL[_i];let mode='LIGHT';if(typeof SL[_i+1]==='string'){mode=SL[_i+1];_i+=2;}else _i+=1;
  const t=TXT[_k];const c=mk(mode,'Folie '+(_k+1)+' – '+t[1]+': '+t[2]);f(c);_k++;}
if(_k!==62)throw new Error('Folienzahl '+_k);
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',_k);})();
