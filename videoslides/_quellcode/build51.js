const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='FFFFFF', CARD='FFFFFF', INK='0E1F0C', GREEN='26720A', NEON='D4F77A', DEEP='12301A',
  GRAY='5B6B50', LINE='B8D98A', CHIP='DDF3B8', TAB2='D4E4F7', DEEP2='1B3D75', DEEPLINE='3B66A8', DSUB='B5CCEC';
const FONT='Poppins';
const THEME={name:'Mathebox Blau',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='Zellbezüge in Excel – Arbeitsblatt';
pres.author='Armin Heske';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Cleverbox · Digitale Grundbildung · Arbeitsblatt',options:{x:0.6,y:11.3,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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

function dline(s,x,y,w){s.addShape(S.line,{x,y,w,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});}




function dl(s,x,y,w){s.addShape(S.line,{x,y,w,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});}
const OFFW=0.78;
function aufg(c,x,y,w,h,n,title,sub,off){card(c,x,y,w,h);circleNum(c.s,n,x+0.15,y+0.1,0.38,NEON,INK);T(c.s,title,x+0.7,y+0.1,w-0.9,0.38,{fontSize:11,bold:true,color:INK,valign:'middle'});
  if(sub&&off>0.7)T(c.s,sub,x+0.7,y+0.44,w-0.9,0.3,{fontSize:9.5,color:GRAY,valign:'middle'});}
function tb(c,x,y,cw,rows,RH,ans,answers){ // rows: [[a,b]...] erste Zeile Kopf; answers: Werte der 2. Spalte (nur ans)
  rows.forEach((r,ri)=>{r.forEach((t,ci)=>{const xx=x+cw.slice(0,ci).reduce((a,b)=>a+b,0);
    const hd=ri===0;c.s.addShape(S.rect,{x:xx,y:y+ri*RH,w:cw[ci],h:RH,fill:{color:hd?CHIP:'FFFFFF'},line:{color:LINE,width:1}});
    let txt=t,col=INK;if(!hd&&ci===r.length-1&&ans){txt=answers[ri-1];col=GREEN;}
    if(txt)T(c.s,txt,xx+0.08,y+ri*RH,cw[ci]-0.12,RH,{fontSize:9.5,bold:hd||ci===0||(ans&&ci===r.length-1),color:col,valign:'middle'});});});}
const PLAN=[['','A','B','C','D','E','F','G'],['2','Kosten','Jänner','Februar','März','April','Mai','Juni'],['3','Miete','700 €','700 €','700 €','700 €','700 €','700 €'],['4','Internet','35 €','35 €','35 €','35 €','35 €','35 €'],['5','Lebensmittel','350 €','370 €','320 €','390 €','340 €','360 €'],['6','Versicherung','75 €','75 €','75 €','75 €','75 €','75 €'],['7','Benzin','110 €','130 €','125 €','95 €','150 €','145 €']];
function plan(c,x,y,RH){const cw=[0.35,1.15,0.8,0.8,0.8,0.8,0.8,0.8];
  PLAN.forEach((r,ri)=>r.forEach((t,ci)=>{const xx=x+cw.slice(0,ci).reduce((a,b)=>a+b,0);const hd=(ri===0||ci===0);
   c.s.addShape(S.rect,{x:xx,y:y+ri*RH,w:cw[ci],h:RH,fill:{color:hd?CHIP:'FFFFFF'},line:{color:LINE,width:1}});
   if(t)T(c.s,t,xx+0.06,y+ri*RH,cw[ci]-0.1,RH,{fontSize:9,bold:hd||ci===1,color:INK,valign:'middle'});}));}
const A2=[['D5','320 €'],['F7','150 €'],['C4','35 €'],['E7','95 €'],['G5','360 €']];
const A3=[['Benzin im März','D7'],['Lebensmittel von Februar bis April','C5:E5'],['Alle Kosten im Mai','F3:F7'],['Miete im Jänner und im Juni','B3;G3'],['Die gesamte Spalte für März','D:D'],['Die Zeilen von Internet bis Versicherung','4:6'],['Alle Kosten von Jänner bis März','B3:D7']];
const A4=[['B4:G4','Internet von Jänner bis Juni (Zeile 4, 6 Zellen)'],['C3;C7','Die zwei Zellen C3 und C7 (Miete und Benzin im Februar)'],['E:E','Die gesamte Spalte E (alle Werte im April)'],['B6:D6;F6','Versicherung von Jänner bis März und im Mai'],["'Haushalt 2025'!B3",'Zelle B3 (Miete im Jänner) auf dem Blatt „Haushalt 2025“']];
const A5=[['B3:G7','30'],['C3:C7','5'],['B3;G3','2'],['B5:D5;F5','4']];
const A6=[['5B','B5'],['B5-G5','B5:G5'],['B 5','B5'],['Haushalt 2025!B5',"'Haushalt 2025'!B5"]];
function build(ans){
 let c=mk('LIGHT',ans?'Lösungen':'Seite 1');hdr(c.s);
 kicker(c,(ans?'Lösungsblatt':'Arbeitsblatt')+' · Digitale Grundbildung',X0,1.45,7);
 head(c,[['Zellbezüge',true],[' in Excel'+(ans?' – Lösungen':''),false]],X0,1.8,W,0.7,24);
 let y;
 if(!ans){T(c.s,'Name:',X0,2.6,0.8,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+0.8,2.9,3.0);
  T(c.s,'Datum:',X0+4.1,2.6,0.9,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+5.0,2.9,2.07);y=3.3;
  // Haushaltsplaner
  card(c,X0,y,W,2.48);T(c.s,'Für alle Aufgaben verwendest du diesen Haushaltsplaner:',X0+0.2,y+0.1,W-0.4,0.35,{fontSize:10.5,bold:true,color:INK,valign:'middle'});
  plan(c,X0+0.25,y+0.52,0.27);y+=2.6;}
 else y=2.5;
 const OF=ans?0.5:OFFW;
 // Aufgabe 1
 const t1=ans?['Ein Zellbezug ist die Adresse einer Zelle oder eines Bereichs. Zuerst steht der Spaltenbuchstabe, dann die Zeilennummer.','Der Doppelpunkt bedeutet „bis“, der Strichpunkt bedeutet „und“.','Beim Blatt setzt du den Blattnamen und ein Ausrufezeichen vor die Adresse.']:
  ['Ein Zellbezug ist die ____________ einer Zelle oder eines Bereichs. Zuerst steht der ____________, dann die ____________.','Der Doppelpunkt in einem Bezug bedeutet „____________“, der Strichpunkt bedeutet „____________“.','Willst du eine Zelle auf einem anderen Blatt ansprechen, setzt du den ____________ und ein ____________ vor die Adresse.'];
 const lh=ans?0.34:0.5,h1=OF+0.05+3*lh+0.08;
 aufg(c,X0,y,W,h1,1,'Lückentext','Ergänze die fehlenden Wörter.',OF);
 t1.forEach((t,i)=>T(c.s,t,X0+0.7,y+OF+0.05+i*lh,W-0.9,lh,{fontSize:10,color:ans?GREEN:INK,bold:ans,valign:'middle'}));
 y+=h1+0.12;
 // Aufgabe 2
 const RH2=ans?0.26:0.26;const h2=ans?OF+0.05+0.3+0.08:OF+0.05+RH2*6+0.1;
 aufg(c,X0,y,W,h2,2,'Welcher Wert steht dort?','',OF);
 if(ans)T(c.s,A2.map(([a,v],i)=>({text:a+' = '+v+(i<4?'   ·   ':''),options:{bold:true,color:GREEN}})),X0+0.7,y+OF+0.05,W-0.9,0.3,{fontSize:10,valign:'middle'});
 else tb(c,X0+0.7,y+OF+0.05,[1.5,2.0],[['Bezug','Wert'],...A2.map(a=>[a[0],''])],RH2,false,[]);
 y+=h2+0.12;
 if(!ans){c=mk('LIGHT','Seite 2');hdr(c.s);y=1.5;}
 // Aufgabe 3
 const RH3=ans?0.26:0.31;const h3=ans?OF+0.05+RH3*4+0.08:OF+0.05+RH3*8+0.1;
 aufg(c,X0,y,W,h3,3,'Schreibe den passenden Bezug','',OF);
 if(ans){const colw=3.3;A3.forEach(([q,a],i)=>{const col=i%2,r=Math.floor(i/2);T(c.s,[{text:q+' ',options:{color:INK}},{text:a,options:{bold:true,color:GREEN}}],X0+0.7+col*3.3,y+OF+0.05+r*RH3,3.2,RH3,{fontSize:9,valign:'middle'});});}
 else tb(c,X0+0.7,y+OF+0.05,[3.6,2.2],[['Gesucht','Bezug'],...A3.map(a=>[a[0],''])],RH3,false,[]);
 y+=h3+0.12;
 // Aufgabe 4
 const RH4=ans?0.26:0.38;const h4=ans?OF+0.05+RH4*5+0.08:OF+0.05+RH4*6+0.1;
 aufg(c,X0,y,W,h4,4,'Was beschreibt der Bezug?','',OF);
 if(ans)A4.forEach(([q,a],i)=>T(c.s,[{text:q+'  ',options:{bold:true,color:INK}},{text:a,options:{color:GREEN}}],X0+0.7,y+OF+0.05+i*RH4,W-0.9,RH4,{fontSize:9,valign:'middle'}));
 else tb(c,X0+0.7,y+OF+0.05,[1.7,4.3],[['Bezug','Bedeutung'],...A4.map(a=>[a[0],''])],RH4,false,[]);
 y+=h4+0.12;
 // Aufgabe 5 und 6
 const RH5=ans?0.26:0.33;const hh=ans?OF+0.05+RH5*4+0.08:OF+0.05+RH5*5+0.1;const wh=3.45;
 if(ans){
  aufg(c,X0,y,wh,hh,5,'Wie viele Zellen sind gemeint?','',OF);A5.forEach(([q,a],i)=>T(c.s,[{text:q+' = ',options:{bold:true,color:INK}},{text:a,options:{bold:true,color:GREEN}}],X0+0.7,y+OF+0.05+i*RH5,2.6,RH5,{fontSize:9.5,valign:'middle'}));
  aufg(c,X0+3.62,y,wh,hh,6,'Finde den Fehler','',OF);A6.forEach(([q,a],i)=>T(c.s,[{text:q+' → ',options:{color:INK}},{text:a,options:{bold:true,color:GREEN}}],X0+3.62+0.7,y+OF+0.05+i*RH5,2.7,RH5,{fontSize:9,valign:'middle'}));
 } else {
  aufg(c,X0,y,wh,hh,5,'Wie viele Zellen sind gemeint?','',OF);tb(c,X0+0.2,y+OF+0.05,[1.7,1.3],[['Bezug','Anzahl'],...A5.map(a=>[a[0],''])],RH5,false,[]);
  aufg(c,X0+3.62,y,wh,hh,6,'Finde den Fehler','Jeder Bezug enthält einen Fehler. Schreibe ihn richtig auf.',OF);tb(c,X0+3.62+0.2,y+OF+0.05,[1.5,1.5],[['Falsch','Richtig'],...A6.map(a=>[a[0],''])],RH5,false,[]);
 }
 y+=hh+0.1;return y;}
const yy=build(false);
pres.writeFile({fileName:'/home/user/claudecloud/videoslides/arbeitsblatt-excel-zellbezuege-a4.pptx'}).then(()=>console.log('ok',yy));
