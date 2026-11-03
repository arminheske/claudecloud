const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='FFFFFF', CARD='FFFFFF', INK='0B1E3A', GREEN='14459A', NEON='BCD6F5', DEEP='0F2A52',
  GRAY='4A5F7A', LINE='8DBBF2', CHIP='E3EEFB', TAB2='D4E4F7', DEEP2='1B3D75', DEEPLINE='3B66A8', DSUB='B5CCEC';
const FONT='Poppins';
const THEME={name:'Mathebox Blau',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='Einfache Textgleichungen – Arbeitsblatt';
pres.author='Armin Heske';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Cleverbox · Mathematik · Arbeitsblatt',options:{x:0.6,y:11.3,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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



function tile(s,x,y,w,h,label,fill=CHIP,color=INK,size=14){
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.12,fill:{color:fill},line:{color:fill,width:0}});
  if(label)T(s,label,x,y,w,h,{fontSize:size,bold:true,color,align:'center',valign:'middle'});
}
function check(s,x,y,d=0.42,fill=NEON,col=INK){
  s.addShape(S.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,width:0}});
  T(s,'✓',x,y,d,d,{fontSize:16,bold:true,color:col,align:'center',valign:'middle'});
}
function textCard(c,x,y,w,h,title,body,num){
  card(c,x,y,w,h);
  if(num!==undefined)circleNum(c.s,num,x+0.3,y+0.3,0.6,NEON,INK);
  const ox=num!==undefined?1.1:0.35;
  T(c.s,title,x+ox,y+(num!==undefined?0.3:0.2),w-ox-0.3,num!==undefined?0.6:0.5,{fontSize:20,bold:true,color:c.P.text,valign:'middle'});
  T(c.s,body,x+0.35,num!==undefined?y+1.05:y+0.85,w-0.7,h-(num!==undefined?1.2:1.0),{fontSize:num!==undefined?15:14,color:c.P.sub,lineSpacingMultiple:1.2});
}
function stat(c,x,y,w,h,big,label,sub_){
  card(c,x,y,w,h,CARD,LINE);
  T(c.s,big,x+0.3,y+0.3,w-0.6,1.0,{fontSize:30,bold:true,color:GREEN});
  T(c.s,label,x+0.3,y+1.4,w-0.6,0.5,{fontSize:18,bold:true,color:INK});
  if(sub_)T(c.s,sub_,x+0.3,y+1.9,w-0.6,0.6,{fontSize:14,color:GRAY});
}
function mathTiles(s,x,y,list,d=1.0){
  list.forEach((t,i)=>{const col=i%3,row=Math.floor(i/3);
    tile(s,x+col*(d+0.15),y+row*(d+0.15),d,d,t,i%2?DEEP2:NEON,i%2?NEON:INK,28);});
}




const X0=0.6,W=7.07;
const QR=__dirname+'/qr.png';const LOGO_R=0.3709;
function hdr(s){
  s.addImage({path:__dirname+'/cleverbox-logo.png',x:X0,y:0.22,w:2.55,h:2.55*LOGO_R,altText:'cleverbox – modern. kostenlos. lehrreich.'});
  s.addImage({path:QR,x:X0+W-0.95,y:0.25,w:0.95,h:0.95,altText:'QR-Code zu www.cleverbox.co.at'});
  T(s,'Mehr Material:\nwww.cleverbox.co.at',X0+W-3.55,0.3,2.5,0.85,{fontSize:10,color:GRAY,align:'right',valign:'middle',lineSpacingMultiple:1.2});
  s.addShape(S.line,{x:X0,y:1.3,w:W,h:0,line:{color:LINE,width:1.25}});
}

const TASKS=[
'Vergrößert man 33 um eine Zahl, so erhält man 54. Wie lautet die Zahl?',
'Verkleinert man 33 um eine Zahl, so erhält man 17. Wie lautet die Zahl?',
'Verkleinert man eine Zahl um 33, so erhält man 17. Wie lautet die Zahl?',
'Das Doppelte einer Zahl ist 48. Wie lautet die Zahl?',
'Das Dreifache einer Zahl ist 81. Wie lautet die Zahl?',
'Das Doppelte einer Zahl ist 7 kleiner als 43. Wie lautet die Zahl?',
'Das Dreifache einer Zahl ist um 11 größer als 76. Wie lautet die Zahl?',
'Zieht man vom 11fachen einer Zahl das Dreifache dieser Zahl ab, so erhält man 56. Wie lautet die Zahl?',
'Vermindert man das Dreifache einer Zahl um 9, so erhält man 27. Wie lautet die Zahl?',
'Die Hälfte einer Zahl ist um 25 kleiner als das um 10 vermehrte Doppelte dieser Zahl. Wie lautet die Zahl?',
'Verena ist um 8 Jahre älter als ihr Bruder Roman. Beide zusammen sind 32 Jahre alt. Wie alt ist Roman?',
'Petra, Konrad und Leon sind zusammen 42 Jahre alt. Leon ist um 5 Jahre älter als Petra und Konrad ist um 7 Jahre älter als Petra. Wie alt ist Leon?',
'Anja, Armin und Alina sind zusammen 32 Jahre alt. Anja ist um 10 Jahre älter als Alina und Armin ist um 6 Jahre jünger als Anja. Wie alt ist Armin?',
'In einem rechtwinkeligen Dreieck ist α viermal so groß wie β.|a) Wie groß ist der rechte Winkel?|b) Wie groß ist α?',
'Georg, Nicole und Carina sind zusammen 43 Jahre alt. Georg ist um 7 Jahre älter als Nicole und Carina ist um 9 Jahre älter als Nicole. Wie alt ist Nicole?',
'Pia, Johannes und Elisabeth sind zusammen 39 Jahre alt. Pia ist um 4 Jahre älter als Elisabeth und Johannes ist um 2 Jahre jünger als Pia. Wie alt ist Pia?'];
const SOL=[['33 + x = 54','x = 21'],['33 − x = 17','x = 16'],['x − 33 = 17','x = 50'],['2 · x = 48','x = 24'],['3 · x = 81','x = 27'],['2 · x = 43 − 7','x = 18'],['3 · x = 76 + 11','x = 29'],['11 · x − 3 · x = 56','x = 7'],['3 · x − 9 = 27','x = 12'],['x : 2 = 2 · x + 10 − 25','x = 10'],['Roman x: x + (x + 8) = 32','Roman: 12 Jahre'],['Petra x: x + (x + 7) + (x + 5) = 42','Leon: 15 Jahre'],['Alina x: x + (x + 10) + (x + 4) = 32','Armin: 10 Jahre'],['β = x: x + 4 · x = 90','a) 90°  b) α = 72°'],['Nicole x: x + (x + 7) + (x + 9) = 43','Nicole: 9 Jahre'],['Elisabeth x: x + (x + 4) + (x + 2) = 39','Pia: 15 Jahre']];
function dline(s,x,y,w){s.addShape(S.line,{x,y,w,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});}

const CW=3.45,GAP=0.17;
function nl(p,cpl=32){return Math.ceil(p.length/cpl);}
function cardH(t){const parts=t.split('|');const lines=parts.reduce((a,p)=>a+nl(p),0);const multi=parts.length>1;return 0.18+lines*0.225+0.12+(multi?1.1:0.72)+0.06;}
function dl(s,x,y,w){s.addShape(S.line,{x,y,w,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});}
function task2(c,x,y,i,txt,h){
  const parts=txt.split('|');const lines=parts.reduce((a,p)=>a+nl(p),0);const th=lines*0.225;const multi=parts.length>1;
  card(c,x,y,CW,h);circleNum(c.s,i,x+0.14,y+0.14,0.42,NEON,INK);
  T(c.s,parts.map((p,k)=>({text:p,options:{breakLine:k<parts.length-1}})),x+0.7,y+0.14,CW-0.85,th,{fontSize:11.5,color:INK,valign:'top',lineSpacingMultiple:1.1});
  const wy=y+0.18+th+0.1;
  T(c.s,'Gleichung:',x+0.2,wy,1.0,0.3,{fontSize:9,color:GRAY,valign:'middle'});dl(c.s,x+1.1,wy+0.27,CW-1.3);
  if(multi){T(c.s,'a)',x+0.2,wy+0.33,0.4,0.3,{fontSize:9.5,bold:true,color:GRAY,valign:'middle'});dl(c.s,x+0.6,wy+0.6,CW-0.8);
    T(c.s,'b)',x+0.2,wy+0.66,0.4,0.3,{fontSize:9.5,bold:true,color:GRAY,valign:'middle'});dl(c.s,x+0.6,wy+0.93,CW-0.8);}
  else{T(c.s,'Lösung:',x+0.2,wy+0.33,1.0,0.3,{fontSize:9,color:GRAY,valign:'middle'});dl(c.s,x+1.1,wy+0.6,CW-1.3);}
}
{let pg=1,c=mk('LIGHT','Seite 1');hdr(c.s);
 kicker(c,'Arbeitsblatt · Mathematik',X0,1.45,6);head(c,[['Einfache ',false],['Textgleichungen',true]],X0,1.8,W,0.7,26);
 T(c.s,'Name:',X0,2.6,0.8,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+0.8,2.9,3.0);
 T(c.s,'Datum:',X0+4.1,2.6,0.9,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+5.0,2.9,2.07);
 T(c.s,'Stelle zu jeder Aufgabe eine Gleichung auf und löse sie.',X0,3.0,W,0.35,{fontSize:10,color:GRAY,valign:'middle'});
 let y=3.45;
 for(let i=0;i<TASKS.length;i+=2){
  const pair=TASKS.slice(i,i+2);const h=Math.max(...pair.map(cardH));
  if(y+h>11.2){pg++;c=mk('LIGHT','Seite '+pg);hdr(c.s);y=1.5;}
  pair.forEach((t,k)=>task2(c,X0+k*(CW+GAP),y,i+k+1,t,h));
  y+=h+0.12;}
 pres.writeFile({fileName:'/home/user/claudecloud/videoslides/arbeitsblatt-textgleichungen-a4.pptx'}).then(()=>console.log('AB ok',pg));}
