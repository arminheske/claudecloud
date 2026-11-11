const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='FFFFFF', CARD='FFFFFF', INK='0B2326', GREEN='0A5C66', NEON='A8EDF0', DEEP='0F3A40',
  GRAY='4A6A6E', LINE='9FCFD2', CHIP='D8F2F2', TAB2='D4E4F7', DEEP2='1B3D75', DEEPLINE='3B66A8', DSUB='B5CCEC';
const FONT='Poppins';
const THEME={name:'Mathebox Blau',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='Der Bewerbungsprozess – Arbeitsblatt';
pres.author='Armin Heske';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Cleverbox · Betriebswirtschaft · '+(process.argv[2]==='ans'?'Lösungen':'Arbeitsblatt')+'',options:{x:0.6,y:11.3,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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
const IW=6.67,IX=X0+0.2;
const lines=(t,w,fs=9)=>Math.ceil(t.length/(w*(fs===9?14.5:13.5)));
const TABLES={
 t2:{cols:[['Textstelle',5.1],['Teil',1.57]],rows:[['„Gerne stelle ich mich Ihnen in einem persönlichen Gespräch vor.“','Schluss'],['„Bewerbung als Bürokauffrau – Ihr Inserat auf karriere.at vom 3. März“','Betreff'],['„Sehr geehrte Frau Berger,“','Anrede'],['„Durch mein Praktikum im Rechnungswesen kenne ich die Arbeit mit Buchhaltungsprogrammen bereits sehr gut.“','Hauptteil'],['„Ich habe Ihr Inserat auf karriere.at gelesen und bewerbe mich um die Stelle als Bürokauffrau.“','Einleitung']],ans:[1],minrow:0.3},
 t3:{cols:[['Was Lisa gemacht hat',3.4],['Was ist besser?',3.27]],rows:[['Sie beginnt mit „Sehr geehrte Damen und Herren“, obwohl im Inserat eine Ansprechperson genannt ist.','Die genannte Person direkt ansprechen. Das zeigt Interesse.'],['Sie legt ihr Originalzeugnis bei.','Zeugnisse immer nur in Kopie beilegen.'],['Sie verwendet ein Urlaubsfoto als Bewerbungsfoto.','Ein professionelles Foto, am besten vom Fotografen.'],['Sie schreibt dasselbe Bewerbungsschreiben für alle Stellen.','Auf das jeweilige Inserat eingehen und die eigenen Stärken mit den Anforderungen verknüpfen.'],['Im Lebenslauf steht ihre erste Schule ganz oben.','Mit dem aktuellsten Eintrag beginnen.']],ans:[1],minrow:0.3},
 t4:{cols:[['Angabe',3.9],['Abschnitt',2.77]],rows:[['Englisch: sehr gute Kenntnisse (B2)','besondere Fähigkeiten'],['Telefonnummer und E-Mail-Adresse','persönliche Daten'],['Ferialpraxis bei der Raiffeisenbank, Juli 2026','Praxis- und Berufserfahrung'],['Handelsakademie Steyr, seit 2024','Ausbildung'],['Führerschein B','besondere Fähigkeiten'],['Trainerin im Volleyballverein','persönliche Interessen'],['Staatsangehörigkeit','persönliche Daten']],ans:[1],minrow:0.23},
 t5:{cols:[['Kriterium',4.3],['formal',1.18],['inhaltlich',1.19]],rows:[['Vollständigkeit der Unterlagen','X',''],['Lücken im Lebenslauf','','X'],['korrekte Rechtschreibung','X',''],['Häufigkeit von Arbeitsplatzwechseln','','X'],['Sauberkeit und Übersichtlichkeit','X',''],['Qualifikationen im Vergleich zum Anforderungsprofil','','X'],['Gesamteindruck','X',''],['Stil und Ausdruck','','X']],ans:[1,2],center:[1,2],minrow:0.23}
};
function tRows(tb,cols){return tb.rows.map(r=>Math.max(tb.minrow||0.27,...r.map((t,ci)=>{const txt=String(t);const w=tb.cols[ci][1]-0.12;return lines(txt,w)*0.14+0.06;})));}
const BL=[];
function tableBlock(n,title,instr,key,after,afterAns){BL.push({n,title,instr,key,after,afterAns});}
BL.push({n:1,title:'Die Bewerbungsunterlagen',instr:'Ergänze den Lückentext.',key:'gap'});
tableBlock(2,'Welcher Teil ist das?','Ordne die Textstellen dem passenden Teil des Bewerbungsschreibens zu: Betreff, Anrede, Einleitung, Hauptteil oder Schluss.','t2',null,null);
tableBlock(3,'Finde die Fehler','Lisa hat ihre Bewerbung vorbereitet. Was sollte sie besser machen? Begründe jeweils kurz.','t3',null,null);
tableBlock(4,'Der Lebenslauf','In welchen Abschnitt des Lebenslaufs gehören diese Angaben?','t4',null,null);
tableBlock(5,'Formale oder inhaltliche Kriterien?','Kreuze an, wie das Unternehmen die Bewerbungen prüft.','t5',null,null);
const GAP=[['Eine vollständige Bewerbung besteht aus dem',null,'Bewerbungsschreiben'],[', dem',null,'Lebenslauf'],['mit Foto und den',null,'Beilagen'],[', zum Beispiel',null,'Zeugnissen'],['. Das Bewerbungsschreiben wird auch Anschreiben oder',null,'Motivationsschreiben'],['genannt. Es soll zeigen, dass man an der Stelle',null,'interessiert'],['ist.',null,null]];
function measure(b,ans){
  let h=0.5; if(b.instr)h+=lines(b.instr,IW-0.1,9.5)*0.17+0.08;
  if(b.key&&TABLES[b.key]){const tb=TABLES[b.key];h+=0.3+tRows(tb).reduce((a,x)=>a+x,0)+0.1;}
  if(b.key==='gap')h+=1.15;
  if(b.key==='inv')h+=2.15+0.9+0.1+(ans?0.5:0.7)+0.3;
  if(b.after)b.after.forEach((a,i)=>{h+=ans?(lines(b.afterAns[i],IW,9.5)*0.18+0.34):(0.32+a[1]*0.3);});
  if(!b.key&&b.afterAns&&!b.after)h+=0;
  return h+0.12;}
function draw(c,y,b,ans){
  const h=measure(b,ans);card(c,X0,y,W,h);circleNum(c.s,b.n,X0+0.15,y+0.1,0.38,NEON,INK);
  T(c.s,b.title,X0+0.7,y+0.1,W-0.9,0.38,{fontSize:11,bold:true,color:INK,valign:'middle'});
  let yy=y+0.5;
  if(b.instr){const hl=lines(b.instr,IW-0.1,9.5)*0.17+0.08;T(c.s,b.instr,IX,yy,IW,hl,{fontSize:9.5,color:GRAY,valign:'top'});yy+=hl;}
  if(b.key&&TABLES[b.key]){const tb=TABLES[b.key];const rh=tRows(tb);yy+=0.05;
    let xx=IX;tb.cols.forEach(([t,w])=>{c.s.addShape(S.rect,{x:xx,y:yy,w,h:0.3,fill:{color:CHIP},line:{color:LINE,width:1}});T(c.s,t,xx+0.06,yy,w-0.1,0.3,{fontSize:9,bold:true,color:INK,valign:'middle'});xx+=w;});yy+=0.3;
    tb.rows.forEach((r,ri)=>{xx=IX;r.forEach((t,ci)=>{const w=tb.cols[ci][1];const isAns=tb.ans.includes(ci);
      c.s.addShape(S.rect,{x:xx,y:yy,w,h:rh[ri],fill:{color:'FFFFFF'},line:{color:LINE,width:1}});
      if(!isAns||ans)T(c.s,String(t),xx+0.06,yy,w-0.1,rh[ri],{fontSize:9,bold:isAns,color:isAns?GREEN:INK,valign:'middle',align:(tb.center&&tb.center.includes(ci))?'center':'left'});xx+=w;});yy+=rh[ri];});
    yy+=0.1;}
  if(b.key==='gap'){
    if(ans){const runs=[];GAP.forEach(([a,_,s_],k)=>{const nx=GAP[k+1];runs.push({text:a+' ',options:{color:INK}});if(s_)runs.push({text:s_+((nx&&/^[.,]/.test(nx[0]))?'':' '),options:{bold:true,color:GREEN}});});T(c.s,runs,IX,yy,IW,1.1,{fontSize:10,valign:'top',lineSpacingMultiple:1.4});}
    else{const txt=GAP.map(([a,_,s_])=>a+(s_?' ____________________':'')).join(' ').replace(/ \./g,'.').replace(/ ,/g,',');T(c.s,txt,IX,yy,IW,1.1,{fontSize:10,color:INK,valign:'top',lineSpacingMultiple:1.4});}
    yy+=1.15;}
  if(b.key==='inv'){
    c.s.addShape(S.rect,{x:IX,y:yy,w:IW,h:2.05,fill:{color:'FFFFFF'},line:{color:LINE,width:1.25}});
    INV.forEach((l,i)=>{const [a,bb]=l.split('|');const ly=yy+0.07+i*0.215;T(c.s,a,IX+0.15,ly,IW-1.6,0.22,{fontSize:9,bold:i===2,color:INK,valign:'middle'});if(bb)T(c.s,bb,IX+IW-1.5,ly,1.35,0.22,{fontSize:9,bold:i>=5,color:INK,align:'right',valign:'middle'});});
    yy+=2.15;
    const ia=['Lieferdatum','Fortlaufende Rechnungsnummer','UID-Nummer des Verkäufers'];
    ia.forEach((a,i)=>{T(c.s,(i+1)+'.',IX,yy+i*0.3,0.3,0.28,{fontSize:9.5,bold:true,color:GRAY,valign:'middle'});if(ans)T(c.s,a,IX+0.35,yy+i*0.3,IW-0.4,0.28,{fontSize:9.5,bold:true,color:GREEN,valign:'middle'});else dl(c.s,IX+0.35,yy+i*0.3+0.26,IW-0.5);});
    yy+=0.9+0.1;
    T(c.s,'Was kann passieren, wenn Sport Huber die Rechnung so akzeptiert?',IX,yy,IW,0.28,{fontSize:9.5,color:INK,valign:'middle'});yy+=0.28;
    if(ans)T(c.s,'Sport Huber darf die Umsatzsteuer (108,00 €) nicht als Vorsteuer abziehen. Die Rechnung sollte korrigiert werden.',IX,yy,IW,0.45,{fontSize:9.5,bold:true,color:GREEN,valign:'top'});else{dl(c.s,IX,yy+0.26,IW);dl(c.s,IX,yy+0.58,IW);}
  }
  if(b.after)b.after.forEach((a,i)=>{
    if(a[0])T(c.s,a[0],IX,yy,IW,0.3,{fontSize:9.5,color:INK,valign:'middle'});
    if(ans){const hh=lines(b.afterAns[i],IW,9.5)*0.18+0.04;T(c.s,b.afterAns[i],IX,yy+(a[0]?0.3:0),IW,hh,{fontSize:9.5,bold:true,color:GREEN,valign:'top'});yy+=(a[0]?0.3:0)+hh+0.04;}
    else{const y0=yy+(a[0]?0.3:0);for(let k=0;k<a[1];k++)dl(c.s,IX,y0+0.26+k*0.3,IW);yy=y0+a[1]*0.3+0.02;}});
  return h;}
function build(ans){
 let c=mk('LIGHT',ans?'Lösungen':'Seite 1');hdr(c.s);
 kicker(c,(ans?'Lösungsblatt':'Arbeitsblatt')+' · Betriebswirtschaft',X0,1.45,7);
 head(c,[['Der ',false],['Bewerbungsprozess',true],[ans?' – Lösungen':'',false]],X0,1.8,W,0.7,24);
 let y=2.6;
 if(!ans){T(c.s,'Name:',X0,2.6,0.8,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+0.8,2.9,3.0);
  T(c.s,'Datum:',X0+4.1,2.6,0.9,0.35,{fontSize:11,bold:true,color:GRAY,valign:'middle'});dl(c.s,X0+5.0,2.9,2.07);y=3.1;} else y=2.5;
 let pg=1;
 BL.filter(b=>b.n<=5).forEach(b=>{const h=measure(b,ans);
  if(y+h>11.2){pg++;c=mk('LIGHT','Seite '+pg);hdr(c.s);y=1.45;}
  console.log(b.n,pg,y.toFixed(2),h.toFixed(2));draw(c,y,b,ans);y+=h+0.1;});
 return [pg,y];}
const ANS=process.argv[2]==='ans';const r=build(ANS);
pres.writeFile({fileName:'/home/user/claudecloud/videoslides/arbeitsblatt-bewerbungsprozess'+(ANS?'-loesungen':'')+'-a4.pptx'}).then(()=>console.log('ok',r));
