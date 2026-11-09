const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='FFFFFF', CARD='FFFFFF', INK='0E1F0C', GREEN='26720A', NEON='D4F77A', DEEP='12301A',
  GRAY='5B6B50', LINE='B8D98A', CHIP='DDF3B8', TAB2='D4E4F7', DEEP2='1B3D75', DEEPLINE='3B66A8', DSUB='B5CCEC';
const FONT='Poppins';
const THEME={name:'Mathebox Blau',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='Die Arbeitsmappe in Excel – Arbeitsblatt';
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
const COLS=['A','B','C','D','E'];
const SYM={'B2':'★','E3':'●','A4':'■','D5':'▲'};
const EXTRA={'C1':'X','E5':'O','A2':'+'};
const OFF=0.82;
function aufg(c,y,h,n,title,sub){card(c,X0,y,W,h);circleNum(c.s,n,X0+0.15,y+0.1,0.38,NEON,INK);T(c.s,title,X0+0.7,y+0.1,W-0.9,0.38,{fontSize:11,bold:true,color:INK,valign:'middle'});
  if(sub&&OFF>0.7)T(c.s,sub,X0+0.7,y+0.46,W-0.9,0.3,{fontSize:9.5,color:GRAY,valign:'middle'});}
function grid(c,x,y,cw,ch,showSym,showExtra){
  for(let r=0;r<=5;r++)for(let k=0;k<=5;k++){
    const hdr=(r===0||k===0);const addr=(k>0&&r>0)?COLS[k-1]+r:'';
    c.s.addShape(S.rect,{x:x+k*cw,y:y+r*ch,w:cw,h:ch,fill:{color:hdr?CHIP:'FFFFFF'},line:{color:LINE,width:1}});
    let t=hdr?(r===0&&k>0?COLS[k-1]:(k===0&&r>0?String(r):'')):'';
    let col=INK;
    if(!hdr&&showSym&&SYM[addr]){t=SYM[addr];}
    if(!hdr&&showExtra&&EXTRA[addr]){t=EXTRA[addr];col=GREEN;}
    if(t)T(c.s,t,x+k*cw,y+r*ch,cw,ch,{fontSize:hdr?10:13,bold:true,color:col,align:'center',valign:'middle',fontFace:'Poppins'});}
}
function build(ans){
 let c=mk('LIGHT',ans?'Lösungen':'Seite 1');hdr(c.s);
 kicker(c,(ans?'Lösungsblatt':'Arbeitsblatt')+' · Digitale Grundbildung',X0,1.45,7);
 head(c,[['Die ',false],['Arbeitsmappe',true],[' in Excel'+(ans?' – Lösungen':''),false]],X0,1.8,W,0.7,24);
 let y;
 if(!ans){T(c.s,'Name:',X0,2.6,0.8,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+0.8,2.9,3.0);
  T(c.s,'Datum:',X0+4.1,2.6,0.9,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+5.0,2.9,2.07);y=3.35;}
 else y=2.55;
 // Aufgabe 1
 const L1=[['Spalten verlaufen','senkrecht','und werden mit','Buchstaben','bezeichnet.'],['Zeilen verlaufen','waagrecht','und werden mit','Zahlen','bezeichnet.'],['Dort, wo sich eine Spalte und eine Zeile kreuzen, liegt eine','Zelle','.'],['Bei einer Zelladresse steht zuerst der','Spaltenbuchstabe',', dann die','Zeilennummer','.'],['Die aktive Zelle erkennst du am','dicken','Rahmen.']];
 const RH=ans?0.26:0.42,h1=OFF+0.03+RH*5+0.1;
 aufg(c,y,h1,1,'Lückentext','Ergänze die fehlenden Wörter.');
 L1.forEach((r,i)=>{const yy=y+OFF+0.03+i*RH;
  const runs=[];r.forEach((p,k)=>{const isBlank=(ans&&((k===1)||(k===3&&r.length===5)||(r.length===3&&k===1)));runs.push(p);});
  if(ans){const txt=[];r.forEach((p,k)=>{const blank=(r.length===5&&(k===1||k===3))||(r.length===3&&k===1&&i===2)||(i===4&&k===1);txt.push({text:p+' ',options:blank?{bold:true,color:GREEN}:{color:INK}});});
   T(c.s,txt,X0+0.7,yy,W-0.9,RH,{fontSize:10.5,valign:'middle'});}
  else{const line=r.map((p,k)=>{const blank=(r.length===5&&(k===1||k===3))||(i===2&&k===1)||(i===4&&k===1);return blank?'______________':p;}).join(' ');
   T(c.s,line,X0+0.7,yy,W-0.9,RH,{fontSize:10.5,color:INK,valign:'middle'});}});
 y+=h1+0.12;
 // Aufgabe 2
 const cw=0.78,chh=ans?0.28:0.4,h2=OFF+0.03+6*chh+0.6;
 aufg(c,y,h2,2,'Zelladressen ablesen','In welchen Zellen stehen die Zeichen?');
 grid(c,X0+0.7,y+OFF+0.03,cw,chh,true,false);
 const ay=y+OFF+0.03+6*chh+0.1;
 [['★','B2'],['●','E3'],['■','A4'],['▲','D5']].forEach(([s_,a],i)=>{const xx=X0+0.7+i*1.55;
  T(c.s,s_+' =',xx,ay,0.6,0.4,{fontSize:11,bold:true,color:INK,valign:'middle'});
  if(ans)T(c.s,a,xx+0.6,ay,0.8,0.4,{fontSize:11,bold:true,color:GREEN,valign:'middle'});else dl(c.s,xx+0.6,ay+0.34,0.8);});
 y+=h2+0.12;
 if(!ans){c=mk('LIGHT','Seite 2');hdr(c.s);y=1.5;}
 // Aufgabe 3
 const h3=OFF+0.03+6*0.4+0.15;
 aufg(c,y,h3,3,'Zellen eintragen','Zeichne in die Tabelle ein:');
 [['ein X in die Zelle C1'],['ein O in die Zelle E5'],['ein + in die Zelle A2']].forEach((r,i)=>T(c.s,'•  '+r[0],X0+0.7,y+OFF+0.2+i*0.45,2.6,0.4,{fontSize:10.5,color:INK,valign:'middle'}));
 grid(c,X0+3.35,y+OFF+0.03,0.6,0.4,false,false);
 y+=h3+0.12;
 // Aufgabe 4
 const rows=[['A1:C3','9'],['B2:D5','12'],['A1:A10','10'],['C2:F2','4']];
 const RH4=ans?0.3:0.5,h4=OFF+0.03+RH4*5+0.1;
 aufg(c,y,h4,4,'Bereiche','Wie viele Zellen umfassen diese Bereiche?');
 const tx=X0+0.7,tw=[2.4,3.0];
 ['Bereich','Anzahl der Zellen'].forEach((t,k)=>{const xx=tx+(k?tw[0]:0);c.s.addShape(S.rect,{x:xx,y:y+OFF+0.03,w:tw[k],h:RH4,fill:{color:CHIP},line:{color:LINE,width:1}});T(c.s,t,xx+0.1,y+OFF+0.03,tw[k]-0.2,RH4,{fontSize:10,bold:true,color:INK,valign:'middle'});});
 rows.forEach(([a,n],i)=>{const yy=y+OFF+0.03+RH4*(i+1);
  c.s.addShape(S.rect,{x:tx,y:yy,w:tw[0],h:RH4,fill:{color:'FFFFFF'},line:{color:LINE,width:1}});T(c.s,a,tx+0.1,yy,tw[0]-0.2,RH4,{fontSize:10.5,bold:true,color:INK,valign:'middle'});
  c.s.addShape(S.rect,{x:tx+tw[0],y:yy,w:tw[1],h:RH4,fill:{color:'FFFFFF'},line:{color:LINE,width:1}});
  if(ans)T(c.s,n,tx+tw[0]+0.1,yy,tw[1]-0.2,RH4,{fontSize:10.5,bold:true,color:GREEN,valign:'middle'});});
 y+=h4+0.1;return y;}
const yy=build(false);
pres.writeFile({fileName:'/home/user/claudecloud/videoslides/arbeitsblatt-excel-arbeitsmappe-a4.pptx'}).then(()=>console.log('ok',yy));
