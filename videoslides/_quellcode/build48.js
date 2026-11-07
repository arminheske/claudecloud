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
    {text:{text:'Cleverbox · Mathematik · Lösungen',options:{x:0.6,y:11.3,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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




const N1=[['45','50'],['32','30'],['62','60'],['154','150'],['328','330'],['21','20'],['9','10'],['127','130'],['38','40'],['251','250']];
const N2=[['156','200'],['3 214','3 200'],['421','400'],['6 312','6 300'],['2 843','2 800'],['532','500'],['982','1 000'],['681','700'],['134','100'],['4 643','4 600']];
const N3=[['498 753 ≈ 499 000','Tausender (T)'],['643 974 ≈ 643 970','Zehner (Z)'],['578 427 ≈ 580 000','Zehntausender (ZT)'],['288 670 ≈ 300 000','Hunderttausender (HT)'],['832 643 ≈ 833 000','Tausender (T)'],['532 788 ≈ 532 790','Zehner (Z)']];
const N4=[['78 638',['78 640','78 600','79 000','80 000']],['43 982',['43 980','44 000','44 000','40 000']],['21 834',['21 830','21 800','22 000','20 000']],['65 932',['65 930','65 900','66 000','70 000']],['345 924',['345 920','345 900','346 000','350 000']]];
function dl(s,x,y,w){s.addShape(S.line,{x,y,w,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});}
function two(c,y,n,title,lcol,rcol,unit,RH,ans){ // zwei Spalten mit je 5 Zeilen: q unit = ___
  const rows=5,OFF=0.62,h=OFF+0.05+rows*RH+0.1;card(c,X0,y,W,h);circleNum(c.s,n,X0+0.15,y+0.1,0.38,NEON,INK);
  T(c.s,title,X0+0.7,y+0.1,W-0.9,0.38,{fontSize:10.5,bold:true,color:INK,valign:'middle'});
  [[X0+0.2,lcol],[X0+3.65,rcol]].forEach(([x,items])=>items.forEach(([q,a],i)=>{const yy=y+OFF+i*RH;
    T(c.s,q+' '+unit+' ≈',x,yy,2.0,RH,{fontSize:10.5,bold:true,color:INK,valign:'middle'});
    if(ans)T(c.s,a+' '+unit,x+2.0,yy,1.2,RH,{fontSize:10.5,bold:true,color:GREEN,valign:'middle'});
    else dl(c.s,x+2.0,yy+RH-0.06,1.1);}));
  return h;}
function three(c,y,n,RH,ans){
  const OFF=0.62,h=OFF+0.05+3*RH+0.1;card(c,X0,y,W,h);circleNum(c.s,n,X0+0.15,y+0.1,0.38,NEON,INK);
  T(c.s,'Auf welche dekadische Einheit wurde gerundet?',X0+0.7,y+0.1,W-0.9,0.38,{fontSize:10.5,bold:true,color:INK,valign:'middle'});
  [[X0+0.2,N3.slice(0,3)],[X0+3.65,N3.slice(3)]].forEach(([x,items])=>items.forEach(([q,a],i)=>{const yy=y+OFF+i*RH;
    T(c.s,q,x,yy,1.9,RH,{fontSize:10,bold:true,color:INK,valign:'middle'});
    if(ans)T(c.s,a,x+1.9,yy,1.4,RH,{fontSize:9.5,bold:true,color:GREEN,valign:'middle'});
    else{T(c.s,'auf',x+1.9,yy,0.3,RH,{fontSize:9,color:GRAY,valign:'middle'});dl(c.s,x+2.25,yy+RH-0.06,0.95);}}));
  return h;}
function four(c,y,n,RH,ans){
  const cw=[1.5,1.25,1.25,1.25,1.25];const h=0.62+0.05+RH*6+0.15;card(c,X0,y,W,h);circleNum(c.s,n,X0+0.15,y+0.1,0.38,NEON,INK);
  T(c.s,'Runde die Zahlen auf Z, H, T und ZT.',X0+0.7,y+0.1,W-0.9,0.38,{fontSize:10.5,bold:true,color:INK,valign:'middle'});
  const x0=X0+0.2;const y0=y+0.62;
  ['Zahl','auf Z','auf H','auf T','auf ZT'].forEach((t,k)=>{const xx=x0+cw.slice(0,k).reduce((a,b)=>a+b,0);
    c.s.addShape(S.rect,{x:xx,y:y0,w:cw[k],h:RH,fill:{color:CHIP},line:{color:LINE,width:1}});T(c.s,t,xx+0.08,y0,cw[k]-0.1,RH,{fontSize:10,bold:true,color:INK,valign:'middle'});});
  N4.forEach(([q,a],i)=>{const yy=y0+RH*(i+1);[q,...a].forEach((t,k)=>{const xx=x0+cw.slice(0,k).reduce((a2,b)=>a2+b,0);
    c.s.addShape(S.rect,{x:xx,y:yy,w:cw[k],h:RH,fill:{color:'FFFFFF'},line:{color:LINE,width:1}});
    if(k===0)T(c.s,t,xx+0.08,yy,cw[k]-0.1,RH,{fontSize:10,bold:true,color:INK,valign:'middle'});
    else if(ans)T(c.s,t,xx+0.08,yy,cw[k]-0.1,RH,{fontSize:10,bold:true,color:GREEN,valign:'middle'});});});
  return h;}
function build(ans){
 let c=mk('LIGHT',ans?'Lösungen':'Seite 1');hdr(c.s);
 kicker(c,(ans?'Lösungsblatt':'Arbeitsblatt')+' · Mathematik',X0,1.45,7);
 head(c,[['Runden von ',false],['Zahlen',true],[ans?' – Lösungen':'',false]],X0,1.8,W,0.7,24);
 let y;
 if(!ans){T(c.s,'Name:',X0,2.6,0.8,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+0.8,2.9,3.0);
  T(c.s,'Datum:',X0+4.1,2.6,0.9,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+5.0,2.9,2.07);y=3.35;}
 else y=2.55;
 const RH=ans?0.26:0.5;
 y+=two(c,y,1,'Runde die Anzahl von Personen auf Z!',N1.slice(0,5),N1.slice(5),'Personen',RH,ans)+0.12;
 y+=two(c,y,2,'Runde die Streckenlänge auf H!',N2.slice(0,5),N2.slice(5),'km',RH,ans)+0.12;
 if(!ans){c=mk('LIGHT','Seite 2');hdr(c.s);y=1.5;}
 y+=three(c,y,3,ans?0.26:0.62,ans)+0.12;
 y+=four(c,y,4,ans?0.27:0.62,ans)+0.1;
 return y;}
const yy=build(true);
pres.writeFile({fileName:'/home/user/claudecloud/videoslides/arbeitsblatt-runden-loesungen-a4.pptx'}).then(()=>console.log('ok',yy));
