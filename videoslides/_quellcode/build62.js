const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='EFFBDC', CARD='FBFFF4', INK='0E1F0C', GREEN='26720A', NEON='B1FF37', DEEP='12301A',
  GRAY='5B6B50', LINE='B8D98A', CHIP='DDF3B8', TAB2='EAF8CF', DEEP2='1B4527', DEEPLINE='2F6B3E', DSUB='A9C79A';
const FONT='Poppins';
const THEME={name:'Cleverbox Gruen',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='Excel Zellbezüge – Videofolien';
pres.author='Cleverbox';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Cleverbox · Excel',options:{x:0.7,y:7.05,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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



const OUT='/home/user/claudecloud/videoslides/cleverbox-excel-zellbezuege-slides.pptx';
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

const TXT=JSON.parse(require('fs').readFileSync(__dirname+'/zb.json','utf8'));
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

const MON=['Jänner','Februar','März','April','Mai','Juni'];
const DATA=[['Miete',700,700,700,700,700,700],['Internet',35,35,35,35,35,35],['Lebensmittel',350,370,320,390,340,360],['Versicherung',75,75,75,75,75,75],['Benzin',110,130,125,95,150,145]];
function parseRef(t){ // -> set of 'C,R' keys (C 0..6 = A..G, R 1..7)
  const set=new Set();const add=(c,r)=>set.add(c+','+r);
  t.split(';').forEach(p=>{const m=p.split(':');
    const pa=x=>{const mm=/^([A-G]?)(\d*)$/.exec(x);return {c:mm[1]?mm[1].charCodeAt(0)-65:null,r:mm[2]?parseInt(mm[2]):null};};
    const a=pa(m[0]),b=pa(m[m.length-1]);
    const c0=a.c===null?0:Math.min(a.c,b.c),c1=a.c===null?6:Math.max(a.c,b.c),r0=a.r===null?1:Math.min(a.r,b.r),r1=a.r===null?7:Math.max(a.r,b.r);
    for(let c=c0;c<=c1;c++)for(let r=r0;r<=r1;r++)add(c,r);});
  return set;}
function sheet(c,hl,hl2,label,labelOn){
  const s=c.s,x0=7.2,y0=0.9,rh=0.5,cw=[1.35,0.67,0.67,0.67,0.67,0.67,0.67],hh=0.4,nw=0.35;
  const H1=parseRef(hl||'A0'),H2=hl2?parseRef(hl2):new Set();
  // Spaltenkoepfe
  let cx=x0+nw;['A','B','C','D','E','F','G'].forEach((l,ci)=>{const on=[...H1,...H2].some(k=>k.split(',')[0]==ci);s.addShape(S.rect,{x:cx,y:y0,w:cw[ci],h:hh,fill:{color:on?CHIP:TAB2},line:{color:LINE,width:1}});T(s,l,cx,y0,cw[ci],hh,{fontSize:11,bold:true,color:GRAY,align:'center',valign:'middle'});cx+=cw[ci];});
  for(let r=1;r<=7;r++){const y=y0+hh+(r-1)*rh;
    s.addShape(S.rect,{x:x0,y,w:nw,h:rh,fill:{color:TAB2},line:{color:LINE,width:1}});T(s,String(r),x0,y,nw,rh,{fontSize:11,bold:true,color:GRAY,align:'center',valign:'middle'});
    let xx=x0+nw;
    for(let ci=0;ci<7;ci++){let txt='';
      if(r===1&&ci===0)txt='Haushaltsplaner';
      else if(r===2)txt=ci===0?'Kosten':MON[ci-1];
      else if(r>=3){const row=DATA[r-3];txt=ci===0?row[0]:row[ci]+' €';}
      const k=ci+','+r;const on1=H1.has(k),on2=H2.has(k);
      s.addShape(S.rect,{x:xx,y,w:cw[ci],h:rh,fill:{color:on1?NEON:(on2?CHIP:(r<=2?TAB2:CARD))},line:{color:on1?DEEP:LINE,width:on1?1.5:1}});
      if(txt&&!(r===1&&ci>0))T(s,txt,xx+0.04,y,cw[ci]-0.06,rh,{fontSize:r>=3&&ci>0?10:9.5,bold:r<=2||ci===0||on1,color:INK,valign:'middle',align:(ci===0||r===1)?'left':'right'});
      xx+=cw[ci];}}
  if(label)badge(s,label,7.2,y0+hh+7*rh+0.3,5.4,0.55,DEEP,NEON,18);}
const sh=(kick,segs,subt,hl,hl2,label,size=40,mode='LIGHT')=>add(mode,c=>{L(c,kick,segs,subt,size);sheet(c,hl,hl2,label);});
const bub=(kick,segs,subt,quote,tag,size=38)=>add('LIGHT',c=>{L(c,kick,segs,subt,size);bubble(c.s,quote,7.2,1.3,5.4,2.2,NEON,DEEP,18);if(tag)tile(c.s,7.2,4.2,5.4,1.1,tag,CHIP,INK,17);});
// 1
add('DARK',c=>{L(c,'Excel',[['Zellbezüge: ',false],['Zellen referenzieren',true]],'Zellen, Bereiche, Spalten, Zeilen und andere Blätter genau ansprechen.',40);
 sheet(c,'B5:G5',null,'B5:G5');});
// 2
add('LIGHT',c=>{L(c,'Überblick',[['Das lernst ',false],['du',true],[' im Video',false]],'Zellen genau ansprechen.',38);lst(c,['Einzelne Zellen','Bereiche','Nicht zusammenhängende Zellen','Ganze Spalten und Zeilen','Zellen auf anderen Blättern'],[],1.0,1.1,0.9);});
// 3
sh('Beispiel',[['Ein ',false],['Haushaltsplaner',true]],'Zeilen 3 bis 7: Miete, Internet, Lebensmittel, Versicherung, Benzin.','A3:A7',null,null,40);
// 4
sh('Beispiel',[['Die ',false],['Monate',true]],'Spalten B bis G: Jänner bis Juni.','B2:G2',null,null,40);
// 5
bub('Gemeinsam planen',[['Eine Tabelle, ',false],['zwei Personen',true]],'Du und deine Partnerin arbeitet an derselben Tabelle.','„Schau dir mal die Lebensmittelkosten von Jänner bis Juni an.“','Lebensmittel · Jänner bis Juni',36);
// 6
add('LIGHT',c=>{L(c,'Warum Zellbezüge?',[['Kürzer ',false],['und eindeutig',true]],'Besonders bei umfangreichen Tabellen.',38);two(c,'Ohne Zellbezug','Mit Zellbezug',1,'„Lebensmittelkosten von Jänner bis Juni“ umständlich und ungenau','„Schau dir den Bereich B5:G5 an.“',1.0,2.6);});
// 7
add('NEON',c=>{L(c,'Definition',[['Der ',false],['Zellbezug',true]],'Die Adresse einer Zelle oder eines Bereichs.',40);card(c,7.2,1.5,5.4,3.2);T(c.s,'Zellbezug = Adresse',7.2,1.5,5.4,3.2,{fontSize:26,bold:true,color:INK,align:'center',valign:'middle'});});
// 8
add('LIGHT',c=>{L(c,'Einzelne Zelle',[['Spalte ',false],['und Zeile',true]],'Erst quer (Spalte), dann runter (Zeile). Ohne Leerzeichen.',36);chain(c,['Spalte (quer): B','Zeile (runter): 3','Adresse: B3'],1.2,1.0,0.5,[CHIP,CHIP,NEON]);});
// 9
sh('Einzelne Zelle',[['B3 ',false],['und F7',true]],'B3: Miete im Jänner. F7: Benzin im Mai.','B3;F7',null,'B3 · F7',40);
// 10
bub('Im Alltag',[['„Bei ',false],['F7',true],[' stimmt etwas nicht“',false]],'Die Partnerin findet die Zelle sofort.','„Ich glaube, bei F7 stimmt etwas nicht, 150 € Benzin im Mai ist viel.“','F7 = Benzin im Mai: 150 €',36);
// 11
sh('Bereich',[['Mehrere zusammenhängende ',false],['Zellen',true]],'Das nennt man einen Bereich.','B3:D5',null,null,34);
// 12
add('LIGHT',c=>{L(c,'Bereich',[['Der ',false],['Doppelpunkt',true],[' heißt „bis“',false]],'Erste und letzte Zelle des Bereichs.',36);chain(c,['Erste Zelle: B5','Doppelpunkt = „bis“','Letzte Zelle: G5'],1.2,1.0,0.5,[CHIP,NEON,CHIP]);});
// 13
sh('Bereich',[['B5:G5: ',false],['eine Zeile',true]],'Lebensmittel von Jänner bis Juni.','B5:G5',null,'B5:G5',38);
// 14
sh('Bereich',[['B3:B7: ',false],['eine Spalte',true]],'Alle Kosten im Jänner.','B3:B7',null,'B3:B7',38);
// 15
bub('Im Alltag',[['„Schau dir ',false],['B5:G5',true],[' an“',false]],'Zeile 5, von Spalte B bis Spalte G: Lebensmittel im ganzen Halbjahr.','„Schau dir B5:G5 an.“','Schwanken die Kosten oder bleiben sie gleich?',36);
// 16
sh('Bereich',[['Ein rechteckiger ',false],['Block',true]],'B3 links oben und G7 rechts unten sind die Eckpunkte.','B3;G7','B3:G7','B3:G7',36);
// 17
sh('Nicht zusammenhängend',[['Einzelne ',false],['Zellen',true],[' ansprechen',false]],'Zellen, die nicht nebeneinander liegen.','B3;D5;G7',null,null,34);
// 18
add('LIGHT',c=>{L(c,'Nicht zusammenhängend',[['Der ',false],['Strichpunkt',true],[' heißt „und“',false]],'Trennt Zellen, die nicht nebeneinander liegen.',36);chain(c,['B3','; = „und“','B7'],1.2,1.0,0.5,[CHIP,NEON,CHIP]);});
// 19
sh('Nicht zusammenhängend',[['B3;B7 ',false],['und B5;G5',true]],'Miete und Benzin im Jänner. Lebensmittel im Jänner und im Juni.','B3;B7','B5;G5','B3;B7 · B5;G5',36);
// 20
sh('Nicht zusammenhängend',[['B5:D5;F5',true]],'Lebensmittel von Jänner bis März und im Mai.','B5:D5;F5',null,'B5:D5;F5',40);
// 21
bub('Im Alltag',[['„Vergleich mal ',false],['B5;G5',true],['“',false]],'Nur der erste und der letzte Monat.','„Vergleich mal B5;G5.“','Nicht alles dazwischen',36);
// 22
add('LIGHT',c=>{L(c,'Ganze Spalten und Zeilen',[['Ganze ',false],['Spalten',true],[' und Zeilen',false]],'Vier Beispiele folgen.',36);chips(c,['B:B','B:G','5:5','3:7'],1.2,0.9,1.2);});
// 23
sh('Ganze Spalte',[['B:B: ',false],['die ganze Spalte B',true]],'Alles im Jänner.','B:B',null,'B:B',34);
// 24
sh('Ganze Spalten',[['B:G: ',false],['alle Monate',true]],'Die Spalten B bis G.','B:G',null,'B:G',38);
// 25
sh('Ganze Zeilen',[['5:5 ',false],['und 3:7',true]],'Zeile 5: Lebensmittel. Zeilen 3 bis 7: alle Kostenarten.','5:5','3:7','5:5 · 3:7',40);
// 26
add('LIGHT',c=>{L(c,'Praktisch',[['Die Tabelle ',false],['wächst mit',true]],'Neue Kostenart oder weitere Monate.',38);chain(c,['Neue Kostenart','Weitere Monate','Der Bezug passt weiter'],1.2,1.0,0.5,[CHIP,CHIP,NEON]);});
// 27
add('LIGHT',c=>{L(c,'Andere Blätter',[['Mehrere ',false],['Blätter',true],[' pro Mappe',false]],'Blattname, Ausrufezeichen, Adresse.',38);
 tile(c.s,7.2,1.3,1.9,1.0,'Tabelle1',CHIP,INK,14);tile(c.s,9.2,1.3,1.9,1.0,'Tabelle2',CHIP,INK,14);tile(c.s,11.2,1.3,1.4,1.0,'…',CHIP,INK,14);
 tile(c.s,7.2,3.2,1.9,1.1,'Blattname',NEON,DEEP,15);tile(c.s,9.2,3.2,1.0,1.1,'!',DEEP,NEON,26);tile(c.s,10.3,3.2,2.3,1.1,'Adresse',CHIP,INK,15);});
// 28
add('LIGHT',c=>{L(c,'Andere Blätter',[['Tabelle1!B5',true]],'Zelle B5 auf dem Blatt Tabelle 1.',44);card(c,7.2,1.6,5.4,2.4,NEON,DEEP);T(c.s,'Tabelle1!B5',7.2,1.6,5.4,2.4,{fontSize:32,bold:true,color:INK,align:'center',valign:'middle'});});
// 29
add('LIGHT',c=>{L(c,'Andere Blätter',[['Leerzeichen ',false],['im Blattnamen',true]],'Dann steht er in Hochkommas.',38);card(c,7.2,1.6,5.4,2.4,NEON,DEEP);T(c.s,"'Haushalt 2025'!B5",7.2,1.6,5.4,2.4,{fontSize:26,bold:true,color:INK,align:'center',valign:'middle'});});
// 30
bub('Im Alltag',[['Das ',false],['Vorjahr',true]],'Ein Blatt pro Jahr.','„Die Lebensmittel vom Vorjahr findest du auf ‘Haushalt 2025’!B5:G5.“',"'Haushalt 2025'!B5:G5",40);
// 31
add('NEON',c=>{L(c,'Geschafft',[['Zellbezüge ',false],['in Excel',true]],'Das war das Video zu Zellbezügen.',40);lst(c,['Zelle: B3','Bereich: B5:G5','Mehrere: B3;B7','Spalten und Zeilen: B:G, 3:7','Anderes Blatt: Tabelle1!B5'],[],1.0,1.1,0.9);});
// 32
add('NEON',c=>{L(c,'Für Lehrkräfte',[['Arbeitsblatt zum ',false],['Video',false]],'Auf cleverbox.co.at, Link in der Videobeschreibung.',38);
 card(c,7.2,1.1,5.4,3.6);tile(c.s,7.6,1.5,4.6,1.1,'Arbeitsblatt zum Video',DEEP,NEON,20);tile(c.s,7.6,2.9,4.6,1.1,'cleverbox.co.at',NEON,DEEP,20);});
// 33
add('NEON',c=>{L(c,'Für Lehrkräfte',[['Erklärvideo zur ',false],['Plattform',true]],'Auch dieser Link steht in der Videobeschreibung.',38);card(c,7.2,1.3,5.4,3.2);tile(c.s,7.6,1.7,4.6,1.2,'Erklärvideo zur Plattform',DEEP,NEON,18);tile(c.s,7.6,3.2,4.6,0.9,'Link in der Videobeschreibung',CHIP,INK,15);});
let _i=0,_k=0;
while(_i<SL.length){const f=SL[_i];let mode='LIGHT';if(typeof SL[_i+1]==='string'){mode=SL[_i+1];_i+=2;}else _i+=1;
  const t=TXT[_k];const c=mk(mode,'Folie '+(_k+1)+' – '+t[1]+': '+t[2]);f(c);
  const ob=c.s._slideObjects.filter(o=>o.options&&o.options.x>=6.9&&o.options.y!==undefined);
  if(ob.length){const mn=Math.min(...ob.map(o=>o.options.y)),mx=Math.max(...ob.map(o=>o.options.y+(o.options.h||0)));
    let dy=4.2-(mn+mx)/2;dy=Math.max(Math.min(dy,6.85-mx),0.5-mn);if(dy>0)ob.forEach(o=>o.options.y+=dy);}
  _k++;}
if(_k!==33)throw new Error('Folienzahl '+_k);
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',_k);})();
