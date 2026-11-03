const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='DCEBFA', CARD='F4F9FF', INK='0B1E3A', GREEN='1F5FBF', NEON='FFD84D', DEEP='0F2A52',
  GRAY='4A5F7A', LINE='A9C6EA', CHIP='C9DDF5', TAB2='D4E4F7', DEEP2='1B3D75', DEEPLINE='3B66A8', DSUB='B5CCEC';
const FONT='Poppins';
const THEME={name:'Mathebox Blau',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='Mathebox – Sponsoring-Angebot';
pres.author='Armin Heske';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Mathebox · Sponsoring-Angebot',options:{x:0.6,y:11.3,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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



const X0=0.6,W=7.07,HW=3.45;
function H(c,t,y){T(c.s,t,X0,y,W,0.5,{fontSize:20,bold:true,color:c.mode==='DARK'?NEON:GREEN,valign:'middle'});}
function tc(c,x,y,w,h,title,body,num,ts=14,bs=11.5){ // kompakte Karte
  card(c,x,y,w,h,c.mode==='DARK'?DEEP2:CARD,c.mode==='DARK'?DEEPLINE:LINE);
  let ox=0.25;
  if(num!==undefined){circleNum(c.s,num,x+0.2,y+0.18,0.42,NEON,INK);ox=0.75;}
  T(c.s,title,x+ox,y+0.15,w-ox-0.15,0.48,{fontSize:ts,bold:true,color:c.P.text,valign:'middle'});
  T(c.s,body,x+0.25,y+0.72,w-0.5,h-0.8,{fontSize:bs,color:c.P.sub,lineSpacingMultiple:1.15});
}
function ck(c,x,y,w,h,t,dark){
  card(c,x,y,w,h,dark?DEEP2:CARD,dark?DEEPLINE:LINE);check(c.s,x+0.18,y+(h-0.36)/2,0.36);
  T(c.s,t,x+0.7,y,w-0.85,h,{fontSize:11.5,color:dark?BG:INK,valign:'middle',lineSpacingMultiple:1.1});
}
function st(c,x,y,w,h,big,label,sub_){
  card(c,x,y,w,h,CARD,LINE);
  T(c.s,big,x+0.25,y+0.15,w-0.5,0.6,{fontSize:24,bold:true,color:GREEN,valign:'middle'});
  T(c.s,label,x+0.25,y+0.78,w-0.5,0.35,{fontSize:13,bold:true,color:INK});
  T(c.s,sub_,x+0.25,y+1.12,w-0.5,0.4,{fontSize:10.5,color:GRAY});
}
// ---------- Seite 1
{const c=mk('LIGHT','Seite 1');
 kicker(c,'Sponsoring-Angebot',X0,0.6,6);
 head(c,[['Mathebox\n',false],['Hauptsponsoring',true]],X0,1.05,5.2,1.9,40);
 sub(c,'Wir laden Sie ein, Hauptsponsor der Mathebox zu werden: Ihr Logo erscheint groß auf jeder Seite der kostenlosen Mathe-Übungssoftware, für 6.000 € pro Jahr.',X0,3.05,4.9,1.5,13.5);
 badge(c.s,'17. Okt. 2026 · Armin Heske',X0,4.65,3.3,0.45,NEON,INK,13);
 card(c,5.7,1.1,1.97,3.9,DEEP,DEEP);
 [['+',0,0],['×',1,0],['7×8',0,1],['=56',1,1],['π',0,2],['x²',1,2]].forEach(([t,i,j])=>tile(c.s,5.85+i*0.87,1.25+j*1.15,0.8,1.0,t,(i+j)%2?DEEP2:NEON,(i+j)%2?NEON:INK,16));
 H(c,'Über die Mathebox',5.3);
 card(c,X0,5.85,W,1.7);
 T(c.s,'Eine völlig kostenlose Sammlung von Übungssoftware für den Mathematik-Unterricht, die in Österreich seit Jahren im Schulalltag eingesetzt wird. Jede Schülerin und jeder Schüler übt in eigenem Tempo und auf eigenem Niveau. Lehrkräfte sparen sich Aufgabensuche und Korrektur.',X0+0.3,5.9,W-0.6,1.6,{fontSize:13,color:INK,lineSpacingMultiple:1.2,valign:'middle'});
 H(c,'Vier Wege zum Üben',7.75);
 [['Im Unterricht','Individuelles, differenziertes Üben direkt am Gerät.'],['Hausübungen','Mit E-Mail-Bestätigung und Protokolldruck.'],['Üben daheim','Kopfrechnen, Einmaleins, Formeln jederzeit selbst trainieren.'],['Übungsblätter','Mit stepbystep Blätter mit oder ohne Lösungen erstellen.']].forEach((t,i)=>tc(c,X0+(i%2)*3.62,8.3+Math.floor(i/2)*1.4,HW,1.3,t[0],t[1],i+1));
 card(c,X0,11.1-0.0,0.0,0.0);
}
// ---------- Seite 2
{const c=mk('LIGHT','Seite 2');
 kicker(c,'Reichweite in Zahlen',X0,0.6,6);
 head(c,[['108.000 Besuche',true],['\nin 12 Monaten',false]],X0,1.0,W,1.6,34);
 sub(c,'Server-Statistik, Nov 2025 bis Okt 2026',X0,2.6,W,0.4,13);
 [['108.008','Besuche','ca. 9.000 pro Monat'],['1.555.843','Seitenaufrufe','ca. 130.000 pro Monat'],['ca. 14','Seiten pro Besuch','Nutzer*innen bleiben und üben aktiv'],['ca. 105 GB','Datenvolumen','ca. 8,8 GB pro Monat']].forEach((t,i)=>st(c,X0+(i%2)*3.62,3.15+Math.floor(i/2)*1.6,HW,1.5,t[0],t[1],t[2]));
 T(c.s,'Quelle: Server-Statistik der Mathebox. Die Werte enthalten auch automatisierte Zugriffe.',X0,6.4,W,0.5,{fontSize:10.5,color:GRAY});
 H(c,'Die Nutzung folgt dem Schuljahr',7.0);
 [['14.384','Besuche im März','Spitzenmonat'],['13.762','Besuche im Juni','zweiter Höhepunkt'],['Sommer','ruhiger','Ferienzeit']].forEach((t,i)=>{const w=2.25;st(c,X0+i*(w+0.16),7.55,w,1.5,t[0],t[1],t[2]);});
 H(c,'Zielgruppe: Schwerpunkt Österreich',9.3);
 [['Lehrkräfte','Im Unterricht und für Hausübungen, Empfehlung im Kollegium.'],['Schüler*innen','Allein oder in der Klasse: Kopfrechnen, Einmaleins, Formeln.'],['Eltern','Übungsblätter mit Lösungen für das Lernen daheim.']].forEach((t,i)=>{const w=2.25;tc(c,X0+i*(w+0.16),9.85,w,1.35,t[0],t[1],i+1,11.5,10);});
}
// ---------- Seite 3
{const c=mk('DARK','Seite 3');
 kicker(c,'Das Sponsoring-Paket',X0,0.6,6);
 head(c,[['Ihr Logo auf\n',false],['jeder Seite',true]],X0,1.0,W,1.7,38);
 sub(c,'Als Hauptsponsor sind Sie der einzige Sponsor. Logo und Wortlaut stimmen wir vorab gemeinsam ab.',X0,2.8,W,0.7,14);
 ['Großes Logo im Kopfbereich neben dem Mathebox-Logo','Exklusivität: keine weiteren Sponsoren oder Werbebanner','Verlinkung des Logos auf eine Seite Ihrer Wahl','Nennung als Hauptsponsor auf Startseite und eigener Partner-Seite mit kurzem Text','Mitgestaltung des Wordings, z. B. „Mit freundlicher Unterstützung von …“','Reichweiten-Bericht pro Quartal mit Besuchen und Seitenaufrufen'].forEach((t,i)=>ck(c,X0,3.55+i*0.72,W,0.62,t,true));
 H(c,'Ihre Vorteile als Sponsor',7.95);
 const vs=[['Gezielte Reichweite','Rund 100.000 Besuche pro Jahr aus Schule und Elternhaus.'],['Hohe Verweildauer','Etwa 14 Seiten pro Besuch, Logo bei jeder sichtbar.'],['Positives Umfeld','Kostenlos, werbefrei, ohne Registrierung: Vertrauen färbt ab.'],['Dauerhafte Präsenz','Logo auf allen Seiten, während der gesamten Laufzeit.'],['Sichtbarer Beitrag','Die Mathebox bleibt für Schulen kostenlos, auch dank Ihrer Unterstützung.']];
 vs.forEach((t,i)=>{const full=i===4,x=full?X0:X0+(i%2)*3.62,y=8.5+Math.floor(i/2)*0.95,w=full?W:HW;
   card(c,x,y,w,0.85,DEEP2,DEEPLINE);T(c.s,t[0],x+0.25,y+0.08,w-0.5,0.35,{fontSize:13,bold:true,color:BG,valign:'middle'});T(c.s,t[1],x+0.25,y+0.45,w-0.5,0.36,{fontSize:9.5,color:DSUB});});
}
// ---------- Seite 4
{const c=mk('LIGHT','Seite 4');
 kicker(c,'Konditionen',X0,0.6,6);
 card(c,X0,1.1,W,1.9,NEON,NEON);
 T(c.s,'6.000 €',X0+0.35,1.2,3.6,1.2,{fontSize:46,bold:true,color:DEEP,valign:'middle'});
 T(c.s,'für 12 Monate',X0+0.35,2.35,3.6,0.5,{fontSize:18,bold:true,color:DEEP});
 T(c.s,'Das Hauptsponsoring kostet 6.000 € für 12 Monate. 10 % Rabatt bei 2 Jahren Laufzeit.',X0+4.0,1.3,2.8,1.6,{fontSize:12,color:DEEP,valign:'middle',lineSpacingMultiple:1.2});
 const rows=[['Laufzeit','12 Monate, Option auf Verlängerung'],['Preis','6.000 € pro Jahr (zzgl. USt., falls zutreffend)'],['Mehrjahresvertrag','10 % Rabatt bei 2 Jahren Laufzeit'],['Zahlung','jährlich im Voraus oder in 2 Raten'],['Exklusivität','ein Hauptsponsor, keine weiteren Banner'],['Kündigung','beiderseitig, mit 3 Monaten Frist zum Laufzeitende'],['Reporting','Besuche und Seitenaufrufe pro Quartal']];
 card(c,X0,3.2,W,3.2);
 rows.forEach((r,i)=>{const y=3.25+i*0.45;
   if(i)c.s.addShape(S.line,{x:X0+0.25,y:y,w:W-0.5,h:0,line:{color:LINE,width:1}});
   T(c.s,r[0],X0+0.3,y,2.0,0.45,{fontSize:11.5,bold:true,color:GREEN,valign:'middle'});
   T(c.s,r[1],X0+2.4,y,4.5,0.45,{fontSize:11.5,color:INK,valign:'middle'});});
 H(c,'Datenschutz und Unabhängigkeit',6.55);
 ['Logo als statisches Bild, ohne Scripts, Cookies oder Tracking.','Sponsor erhält keine Nutzerdaten, nichts Personenbezogenes gespeichert.','Inhalte und Aufgaben bleiben unabhängig vom Sponsor.','Keine Werbung für Kinder, nur die dezente Nennung als Förderer.'].forEach((t,i)=>ck(c,X0+(i%2)*3.62,7.1+Math.floor(i/2)*0.9,HW,0.8,t,false));
 H(c,'Nächste Schritte: 15 Minuten Telefonat',8.95);
 ['Kennenlernen und Fragen klären','Logo und Wortlaut abstimmen','Vereinbarung unterzeichnen','Logo geht auf allen Seiten online'].forEach((t,i)=>{const w=1.68,x=X0+i*(w+0.12);card(c,x,9.5,w,1.05);circleNum(c.s,i+1,x+0.15,9.6,0.4,NEON,INK);T(c.s,t,x+0.15,10.05,w-0.3,0.5,{fontSize:9.5,bold:true,color:INK});});
 card(c,X0,10.7,W,0.6,DEEP,DEEP);
 T(c.s,[{text:'Armin Heske, Mathebox  ',options:{bold:true,color:NEON}},{text:'[E-Mail] · [Telefon] · www.mathebox.at',options:{color:BG}}],X0+0.25,10.7,W-0.4,0.6,{fontSize:11,valign:'middle'});
}
pres.writeFile({fileName:'/home/user/claudecloud/videoslides/mathebox-sponsoring-a4.pptx'}).then(()=>console.log('ok'));
