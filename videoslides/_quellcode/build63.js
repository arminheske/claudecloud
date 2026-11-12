const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='EFFBDC', CARD='FBFFF4', INK='0E1F0C', GREEN='26720A', NEON='B1FF37', DEEP='12301A',
  GRAY='5B6B50', LINE='B8D98A', CHIP='DDF3B8', TAB2='EAF8CF', DEEP2='1B4527', DEEPLINE='2F6B3E', DSUB='A9C79A';
const FONT='Poppins';
const THEME={name:'Cleverbox Gruen',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='Die Arbeitsmappe in Excel – Videofolien';
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



const OUT='/home/user/claudecloud/videoslides/cleverbox-excel-arbeitsmappe-slides.pptx';
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

const TXT=JSON.parse(require('fs').readFileSync(__dirname+'/am.json','utf8'));
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


function cellRC(a){const m=/^([A-Z]+)(\d+)$/.exec(a);return {c:m[1].charCodeAt(0)-65,r:parseInt(m[2])};}
function xl(c,o){
  o=o||{};const s=c.s,x0=7.2,nw=0.4,cw=0.6,NC=8,rh=0.46,hh=0.38;
  const r0=o.rowStart||1,NR=8;let y0=0.9;
  const cols=o.col?String(o.col).split(','):[],rows=o.row?String(o.row).split(',').map(Number):[];
  if(o.name!==undefined){s.addShape(S.rect,{x:x0,y:y0,w:1.3,h:0.45,fill:{color:CARD},line:{color:DEEP,width:1.5}});T(s,o.name,x0+0.08,y0,1.2,0.45,{fontSize:13,bold:true,color:INK,valign:'middle'});
    s.addShape(S.rect,{x:x0+1.4,y:y0,w:4.0,h:0.45,fill:{color:CARD},line:{color:LINE,width:1}});T(s,'fx',x0+1.5,y0,0.5,0.45,{fontSize:12,italic:true,color:GRAY,valign:'middle'});
    y0+=0.6;}
  let rng=null;if(o.rng){const [a,b]=o.rng.split(':');const A=cellRC(a),B=cellRC(b);rng={c0:Math.min(A.c,B.c),c1:Math.max(A.c,B.c),r0:Math.min(A.r,B.r),r1:Math.max(A.r,B.r)};}
  const act=o.act?cellRC(o.act):null;
  s.addShape(S.rect,{x:x0,y:y0,w:nw,h:hh,fill:{color:TAB2},line:{color:LINE,width:1}});
  for(let ci=0;ci<NC;ci++){const L_=String.fromCharCode(65+ci);const on=cols.includes(L_)||(o.hdrCols);
    s.addShape(S.rect,{x:x0+nw+ci*cw,y:y0,w:cw,h:hh,fill:{color:on?NEON:TAB2},line:{color:on?DEEP:LINE,width:on?1.5:1}});T(s,L_,x0+nw+ci*cw,y0,cw,hh,{fontSize:11,bold:true,color:on?INK:GRAY,align:'center',valign:'middle'});}
  for(let ri=0;ri<NR;ri++){const r=r0+ri,y=y0+hh+ri*rh;const on=rows.includes(r)||o.hdrRows;
    s.addShape(S.rect,{x:x0,y,w:nw,h:rh,fill:{color:on?NEON:TAB2},line:{color:on?DEEP:LINE,width:on?1.5:1}});T(s,String(r),x0,y,nw,rh,{fontSize:11,bold:true,color:on?INK:GRAY,align:'center',valign:'middle'});
    for(let ci=0;ci<NC;ci++){const L_=String.fromCharCode(65+ci);
      const inRng=rng&&ci>=rng.c0&&ci<=rng.c1&&r>=rng.r0&&r<=rng.r1;
      const inLine=cols.includes(L_)||rows.includes(r);
      s.addShape(S.rect,{x:x0+nw+ci*cw,y,w:cw,h:rh,fill:{color:inRng?CHIP:(inLine?TAB2:CARD)},line:{color:LINE,width:1}});
      const key=L_+r;if(o.text&&o.text[key])T(s,o.text[key],x0+nw+ci*cw+0.04,y,cw-0.06,rh,{fontSize:10,color:INK,valign:'middle'});}}
  if(act&&act.r>=r0&&act.r<r0+NR){s.addShape(S.rect,{x:x0+nw+act.c*cw,y:y0+hh+(act.r-r0)*rh,w:cw,h:rh,fill:{color:CARD,transparency:100},line:{color:GREEN,width:3}});}
  if(rng){s.addShape(S.rect,{x:x0+nw+rng.c0*cw,y:y0+hh+(rng.r0-r0)*rh,w:(rng.c1-rng.c0+1)*cw,h:(rng.r1-rng.r0+1)*rh,fill:{color:CARD,transparency:100},line:{color:GREEN,width:3}});}
  const yb=y0+hh+NR*rh;
  if(o.tabs){o.tabs.forEach((t,i)=>{const on=i===(o.activeTab||0);s.addShape(S.roundRect,{x:x0+i*1.45,y:yb+0.15,w:1.35,h:0.45,rectRadius:0.06,fill:{color:on?NEON:TAB2},line:{color:on?DEEP:LINE,width:on?1.5:1}});T(s,t,x0+i*1.45,yb+0.15,1.35,0.45,{fontSize:11,bold:on,color:INK,align:'center',valign:'middle'});});
    if(o.plus){const px=x0+o.tabs.length*1.45;s.addShape(S.ellipse,{x:px,y:yb+0.15,w:0.45,h:0.45,fill:{color:o.hlPlus?NEON:CARD},line:{color:o.hlPlus?DEEP:LINE,width:o.hlPlus?2:1}});T(s,'+',px,yb+0.15,0.45,0.45,{fontSize:16,bold:true,color:INK,align:'center',valign:'middle'});}}
  if(o.label)badge(s,o.label,x0,yb+(o.tabs?0.8:0.2),5.4,0.5,DEEP,NEON,16);}
const xs=(kick,segs,subt,o,size=38,mode='LIGHT')=>add(mode,c=>{L(c,kick,segs,subt,size);xl(c,o);});
const card2=(kick,segs,subt,txt,fs=26,size=38)=>add('NEON',c=>{L(c,kick,segs,subt,size);card(c,7.2,1.5,5.4,3.2);T(c.s,txt,7.2,1.5,5.4,3.2,{fontSize:fs,bold:true,color:INK,align:'center',valign:'middle'});});
const chn=(kick,segs,subt,items,fills,size=38)=>add('LIGHT',c=>{L(c,kick,segs,subt,size);chain(c,items,items.length===2?1.6:1.2,1.0,0.5,fills);});
const chp=(kick,segs,subt,items,size=38)=>add('LIGHT',c=>{L(c,kick,segs,subt,size);chips(c,items,1.4,0.9,1.2);});
// 1
add('DARK',c=>{L(c,'Excel',[['Die ',false],['Arbeitsmappe',true],[' in Excel',false]],'Spalten, Zeilen, Zellen und Arbeitsblätter.',40);xl(c,{act:'B3',name:'B3'});});
// 2
add('LIGHT',c=>{L(c,'Überblick',[['Das lernst ',false],['du',true],[' im Video',false]],'Diese Grundlagen brauchst du für jede Formel und jedes Diagramm.',34);lst(c,['Spalten, Zeilen und Zellen','Die Zelladresse','Mehrere Zellen markieren','Mehrere Arbeitsblätter'],[],1.3,1.3,1.0);});
// 3
add('NEON',c=>{L(c,'Für Lehrkräfte',[['Unterrichtsmaterial ',false],['am Ende',true]],'Jetzt beginnt das eigentliche Thema.',38);card(c,7.2,1.1,5.4,3.6);tile(c.s,7.6,1.5,4.6,1.1,'Arbeitsblatt zum Video',DEEP,NEON,20);tile(c.s,7.6,2.9,4.6,1.1,'cleverbox.co.at',NEON,DEEP,20);});
// 4-9
xs('Das Arbeitsblatt',[['Die ',false],['Fläche',true],[' in der Mitte',false]],'Hier passiert die eigentliche Arbeit.',{},38);
chp('Das Arbeitsblatt',[['Das kannst du ',false],['eingeben',true]],null,['Texte','Zahlen','Datumsangaben','Formeln'],38);
xs('Das Arbeitsblatt',[['Viele kleine ',false],['Kästchen',true]],null,{},40);
xs('Das Arbeitsblatt',[['Jedes Kästchen hat eine ',false],['Position',true]],null,{act:'C4'},34);
chn('Das Arbeitsblatt',[['Excel kennt die ',false],['Position',true]],'Wo du etwas eingibst und worauf sich eine Berechnung bezieht.',['Eingabe','Position in der Tabelle','Berechnung bezieht sich darauf'],[CHIP,CHIP,NEON],34);
add('LIGHT',c=>{L(c,'Grundbegriffe',[['Drei ',false],['Begriffe',true]],'Damit verstehst du die Positionen.',40);lst(c,['Spalten','Zeilen','Zellen'],[],1.4,1.3,1.0);});
// 10-15 Spalten
xs('Spalten',[['Buchstaben ',false],['oben',true]],'A, B, C, D, E und so weiter.',{hdrCols:true},40);
xs('Spalten',[['Von oben ',false],['nach unten',true]],'Die Buchstaben bezeichnen die Spalten.',{col:'C'},40);
xs('Spalten',[['Die ',false],['Spalte B',true]],'Senkrecht durch das gesamte Arbeitsblatt.',{col:'B'},40);
xs('Spalten',[['Auch Spalte C ',false],['oder H',true]],'Die Buchstaben unterscheiden die Spalten.',{col:'C,H'},36);
chn('Spalten',[['Nach Z folgt ',false],['AA',true]],'Weiter nach rechts gibt es weitere Spalten.',['… X, Y, Z','AA, AB, AC','und so weiter'],[CHIP,NEON,CHIP],38);
card2('Merke dir',[['Spalten: ',false],['senkrecht',true]],null,'Spalten verlaufen senkrecht und werden mit Buchstaben bezeichnet.',22);
// 16-20 Zeilen
xs('Zeilen',[['Zahlen am ',false],['linken Rand',true]],'1, 2, 3, 4, 5 und viele weitere.',{hdrRows:true},40);
xs('Zeilen',[['Von links ',false],['nach rechts',true]],'Die Zahlen bezeichnen die Zeilen.',{row:'4'},40);
xs('Zeilen',[['Die ',false],['Zeile 1',true]],'Waagerecht über das gesamte Arbeitsblatt.',{row:'1'},40);
xs('Zeilen',[['Zeile 2, ',false],['Zeile 3',true],[' …',false]],'Die Zahlen zeigen dir, in welcher Zeile du bist.',{row:'2,3'},38);
card2('Merke dir',[['Zeilen: ',false],['waagerecht',true]],null,'Zeilen verlaufen waagerecht und werden mit Zahlen bezeichnet.',22);
// 21-25 Zelle
xs('Zellen',[['Die ',false],['Zelle',true]],'Der wichtigste Begriff.',{act:'B3'},44);
xs('Zellen',[['Spalte und Zeile ',false],['kreuzen sich',true]],'Dort entsteht eine Zelle.',{col:'B',row:'3',act:'B3'},36);
xs('Zellen',[['Spalte B, ',false],['Zeile 3',true]],'Am Schnittpunkt liegt eine bestimmte Zelle.',{col:'B',row:'3',act:'B3'},38);
chp('Zellen',[['Das passt in ',false],['eine Zelle',true]],null,['Ein Name','Eine Zahl','Eine Formel'],38);
xs('Zellen',[['Eine ',false],['eindeutige',true],[' Adresse',false]],'Damit Excel jede Zelle genau identifizieren kann.',{act:'B3',name:'B3'},36);
// 26-32 Zelladresse
chn('Zelladresse',[['Spalte ',false],['und Zeile',true]],'Spaltenbuchstabe und Zeilennummer.',['Spaltenbuchstabe','Zeilennummer','Zelladresse'],[CHIP,CHIP,NEON],40);
xs('Zelladresse',[['Beispiel ',false],['A1',true]],'Der Buchstabe A: Spalte A.',{col:'A',act:'A1'},44);
xs('Zelladresse',[['A1: ',false],['Zeile 1',true]],'Spalte A und Zeile 1 ergeben A1.',{col:'A',row:'1',act:'A1'},44);
xs('Zelladresse',[['Beispiel ',false],['C5',true]],'Spalte C und Zeile 5.',{col:'C',row:'5',act:'C5'},44);
xs('Zelladresse',[['C5: dritte Spalte, ',false],['fünfte Zeile',true]],null,{col:'C',row:'5',act:'C5',label:'3. Spalte · 5. Zeile'},36);
add('LIGHT',c=>{L(c,'Zelladresse',[['Die ',false],['Reihenfolge',true]],'Zuerst der Spaltenbuchstabe, danach die Zeilennummer.',38);okno(c,[['C5',true],['5C',false]],1.3,1.5,0.5);});
chp('Zelladresse',[['Weitere ',false],['Beispiele',true]],null,['B2','D10','H18'],40);
// 33-37 Aktive Zelle
xs('Die aktive Zelle',[['Der ',false],['grüne Rahmen',true]],'Er zeigt die aktive Zelle.',{act:'B3'},38);
xs('Die aktive Zelle',[['Hier arbeitest du ',false],['gerade',true]],'Hier kannst du als Nächstes Daten eingeben.',{act:'B3'},36);
xs('Die aktive Zelle',[['Der Rahmen ',false],['verschiebt sich',true]],'Die neu ausgewählte Zelle ist aktiv.',{act:'D4'},36);
xs('Die aktive Zelle',[['„Hallo“ ',false],['in D4',true]],'Der Text landet in der aktiven Zelle.',{act:'D4',text:{D4:'Hallo'}},40);
card2('Die aktive Zelle',[['Hier landet die ',false],['nächste Eingabe',true]],null,'Aktive Zelle = nächste Eingabe',24,34);
// 38-42 Namenfeld
xs('Das Namenfeld',[['Die Adresse ',false],['im Kästchen',true]],'Über dem Arbeitsblatt steht die Zelladresse.',{act:'B3',name:'B3'},36);
xs('Das Namenfeld',[['Beispiel ',false],['H18',true]],'Klick auf H18: Dort steht H18.',{act:'H18',name:'H18',rowStart:15},40);
card2('Das Namenfeld',[['Praktisch bei ',false],['großen Blättern',true]],null,'Schnell sehen, welche Zelle ausgewählt ist',22,34);
xs('Das Namenfeld',[['Direkt zu einer Zelle ',false],['springen',true]],'A20 eintippen, Eingabetaste.',{name:'A20',rowStart:17},34);
chn('Das Namenfeld',[['Excel springt zu ',false],['A20',true]],'Eine praktische Abkürzung.',['A20 eintippen','Eingabetaste','Excel springt zu A20'],[CHIP,CHIP,NEON],36);
// 43-49 Bereiche
xs('Mehrere Zellen',[['Mehrere Zellen ',false],['gleichzeitig',true]],null,{rng:'B2:D4'},36);
chn('Mehrere Zellen',[['Ziehen und ',false],['loslassen',true]],'Jetzt ist ein Zellbereich markiert.',['Zelle anklicken','Maustaste halten und ziehen','Loslassen: Bereich markiert'],[CHIP,CHIP,NEON],36);
xs('Mehrere Zellen',[['A1 ',false],['bis C3',true]],'Neun Zellen: drei Spalten und drei Zeilen.',{rng:'A1:C3'},44);
xs('Mehrere Zellen',[['Der Bereich ',false],['A1:C3',true]],null,{rng:'A1:C3',name:'A1:C3'},40);
chn('Mehrere Zellen',[['Der ',false],['Doppelpunkt',true],[' heißt „bis“',false]],'Von der ersten bis zur zweiten Zelle.',['Erste Zelle: A1','Doppelpunkt = „bis“','Letzte Zelle: C3'],[CHIP,NEON,CHIP],36);
chp('Mehrere Zellen',[['Wichtig für ',false],['später',true]],null,['Formeln','Diagramme'],38);
chp('Mehrere Zellen',[['Gemeinsam ',false],['bearbeiten',true]],null,['Formatieren','Kopieren','Löschen'],38);
// 50-54 Arbeitsblätter
xs('Mehrere Arbeitsblätter',[['Mehrere ',false],['Arbeitsblätter',true]],'Für größere Projekte.',{tabs:['Tabelle1']},38);
xs('Mehrere Arbeitsblätter',[['Auf das ',false],['Plus',true],[' klicken',false]],'Ein neues Arbeitsblatt in der Arbeitsmappe.',{tabs:['Tabelle1','Tabelle2'],plus:true,activeTab:1,hlPlus:true},38);
add('LIGHT',c=>{L(c,'Mehrere Arbeitsblätter',[['Beliebig ',false],['umbenennen',true]],null,38);two(c,'Doppelklick auf den Namen','Rechtsklick, dann Umbenennen',-1,null,null,1.5,2.0);});
chn('Mehrere Arbeitsblätter',[['Arbeitsblatt ',false],['löschen',true]],null,['Rechtsklick','Löschen'],[CHIP,NEON],40);
chn('Mehrere Arbeitsblätter',[['Per Drag and Drop ',false],['verschieben',true]],null,['Blatt mit der Maus ziehen','An die neue Position ablegen'],[CHIP,NEON],34);
// 55-57
add('NEON',c=>{L(c,'Geschafft',[['Die Arbeitsmappe ',false],['in Excel',true]],'Das wars für dieses Video.',40);lst(c,['Spalten: Buchstaben','Zeilen: Zahlen','Zelle: B3','Bereich: A1:C3','Mehrere Arbeitsblätter'],[],1.0,1.1,0.9);});
add('NEON',c=>{L(c,'Für Lehrkräfte',[['Arbeitsblatt zum ',false],['Video',false]],'Auf cleverbox.co.at, Link in der Videobeschreibung.',38);card(c,7.2,1.1,5.4,3.6);tile(c.s,7.6,1.5,4.6,1.1,'Arbeitsblatt zum Video',DEEP,NEON,20);tile(c.s,7.6,2.9,4.6,1.1,'cleverbox.co.at',NEON,DEEP,20);});
add('NEON',c=>{L(c,'Für Lehrkräfte',[['Erklärvideo zur ',false],['Plattform',true]],'Auch dieser Link steht in der Videobeschreibung.',38);card(c,7.2,1.3,5.4,3.2);tile(c.s,7.6,1.7,4.6,1.2,'Erklärvideo zur Plattform',DEEP,NEON,18);tile(c.s,7.6,3.2,4.6,0.9,'Link in der Videobeschreibung',CHIP,INK,15);});
let _i=0,_k=0;
while(_i<SL.length){const f=SL[_i];let mode='LIGHT';if(typeof SL[_i+1]==='string'){mode=SL[_i+1];_i+=2;}else _i+=1;
  const t=TXT[_k];const c=mk(mode,'Folie '+(_k+1)+' – '+t[1]+': '+t[2]);f(c);
  const ob=c.s._slideObjects.filter(o=>o.options&&o.options.x>=6.9&&o.options.y!==undefined);
  if(ob.length){const mn=Math.min(...ob.map(o=>o.options.y)),mx=Math.max(...ob.map(o=>o.options.y+(o.options.h||0)));
    let dy=4.2-(mn+mx)/2;dy=Math.max(Math.min(dy,6.85-mx),0.5-mn);if(dy>0)ob.forEach(o=>o.options.y+=dy);}
  _k++;}
if(_k!==57)throw new Error('Folienzahl '+_k);
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',_k);})();
