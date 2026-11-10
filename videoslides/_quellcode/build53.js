const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='D8F2F2', CARD='F3FCFC', INK='0B2326', GREEN='0A5C66', NEON='5FE0E6', DEEP='0F3A40',
  GRAY='4A6A6E', LINE='9FCFD2', CHIP='BFE8EA', TAB2='CBEEEE', DEEP2='17525A', DEEPLINE='2F7C85', DSUB='A9D7DB';
const FONT='Poppins';
const THEME={name:'Cleverbox Teal',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.layout='LAYOUT_WIDE';
pres.title='Der Bewerbungsprozess – Videofolien';
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



const OUT='/home/user/claudecloud/videoslides/cleverbox-bewerbungsprozess-slides.pptx';
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

const TXT=JSON.parse(require('fs').readFileSync(__dirname+'/bw.json','utf8'));
function person(s,cx,y,w,fill){fill=fill||DEEP;s.addShape(S.ellipse,{x:cx-w*0.25,y,w:w*0.5,h:w*0.5,fill:{color:fill},line:{color:fill,width:0}});
  s.addShape(S.roundRect,{x:cx-w*0.5,y:y+w*0.58,w,h:w*0.62,rectRadius:w*0.28,fill:{color:fill},line:{color:fill,width:0}});}
function L(c,kick,segs,subt,size=38,subY=4.7){kicker(c,kick,0.7,1.2);head(c,segs,0.7,1.75,6.2,3.0,size);if(subt)sub(c,subt,0.7,subY,5.8,1.8,18);}
function lst(c,items,hi,y0=0.7,gap=0.68,h=0.58){steps(c,hi,items,7.2,y0,gap,h,5.4);}
const BRIEF=['Absender und Empfänger','Ort und Datum','Betreff','Anrede','Einleitung','Hauptteil','Schluss','Grußformel, Unterschrift','Beilagen'];
const CVL=['Persönliche Daten','Foto','Ausbildung','Praxis- und Berufserfahrung','Besondere Fähigkeiten','Persönliche Interessen','Ort, Datum, Unterschrift'];
const GES=['Begrüßung','Fragen an dich','Das Unternehmen stellt sich vor','„Haben Sie noch Fragen?“','Verabschiedung'];
const AUS=['Eignungstest','Leistungsprobe','Fragebogen','Assessment-Center'];
const SL=[];
const add=(mode,fn)=>{SL.push(fn);SL.push(mode);};
// 1
add('DARK',c=>{L(c,'Bewerbung',[['Der ',false],['Bewerbungsprozess',true]],'Du hast eine interessante Stellenanzeige gefunden. Und jetzt?',44);
 card(c,7.5,0.9,5.1,4.9,DEEP2,DEEPLINE);T(c.s,'Stellenanzeige',7.8,1.05,4.5,0.5,{fontSize:16,bold:true,color:NEON,valign:'middle'});
 [4.2,3.6,3.9,3.0].forEach((w,i)=>c.s.addShape(S.roundRect,{x:7.8,y:1.8+i*0.5,w,h:0.22,rectRadius:0.08,fill:{color:DEEPLINE},line:{color:DEEPLINE,width:0}}));
 tile(c.s,7.8,4.1,2.2,0.8,'Jetzt bewerben',NEON,DEEP,15);bubble(c.s,'Und jetzt?',10.1,4.9,2.4,0.8,CARD,INK,16);});
// 2
add('LIGHT',c=>{L(c,'Überblick',[['Von der Anzeige bis zum ',false],['Arbeitsvertrag',true]],'Schritt für Schritt durch den Bewerbungsprozess.',38);
 lst(c,['Bewerbungsunterlagen','Vorauswahl im Unternehmen','Vorstellungsgespräch','Weitere Auswahlverfahren','Entscheidung und Arbeitsvertrag'],[],1.0,1.1,0.95);});
// 3
add('NEON',c=>{L(c,'Für Lehrkräfte',[['Arbeitsblatt zum ',false],['Video',false]],'Auf cleverbox.co.at, plus Anleitung zur Lehrerplattform im verlinkten Video.',38);
 card(c,7.2,1.1,5.4,4.4);tile(c.s,7.6,1.5,4.6,1.1,'Arbeitsblatt zum Video',DEEP,NEON,20);tile(c.s,7.6,2.9,4.6,1.1,'cleverbox.co.at',NEON,DEEP,20);tile(c.s,7.6,4.3,4.6,0.9,'Anleitung im Video (Beschreibung)',CHIP,INK,15);});
// 4
add('LIGHT',c=>{L(c,'Stellenanzeige',[['Am Anfang steht die ',false],['Stellenanzeige',true]],'Jobsuchende wählen die Anzeigen aus, die sie interessieren.',38);
 [0,1,2].forEach(i=>{const y=1.0+i*1.85,on=i===1;card(c,7.2,y,5.4,1.55,on?NEON:CARD,on?DEEP:LINE);T(c.s,'Stellenanzeige '+(i+1),7.5,y+0.15,4.8,0.4,{fontSize:14,bold:true,color:INK});
  [3.6,3.0].forEach((w,k)=>c.s.addShape(S.roundRect,{x:7.5,y:y+0.7+k*0.35,w,h:0.18,rectRadius:0.06,fill:{color:on?DEEP:CHIP},line:{color:on?DEEP:CHIP,width:0}}));});
 check(c.s,11.7,2.95,0.6,DEEP);});
// 5
add('LIGHT',c=>{L(c,'Bewerbungsunterlagen',[['Auf sich ',false],['aufmerksam',true],[' machen',false]],'Dazu gehören drei Teile.',40);
 ['?','?','?'].forEach((t,i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);circleNum(c.s,i+1,7.5,y+0.5,0.55,CHIP,GRAY);T(c.s,t,8.4,y,3.0,1.55,{fontSize:30,bold:true,color:GRAY,valign:'middle'});});});
// 6
add('LIGHT',c=>{L(c,'Drei Teile',[['Schreiben, Lebenslauf, ',false],['Beilagen',true]],null,38);
 [['Bewerbungsschreiben',''],['Lebenslauf mit Foto',''],['Beilagen','Zeugnisse und weitere Qualifikationen']].forEach(([t,s_],i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);circleNum(c.s,i+1,7.5,y+0.45,0.6,NEON,DEEP);T(c.s,t,8.4,y+0.2,4.0,0.6,{fontSize:18,bold:true,valign:'middle'});if(s_)T(c.s,s_,8.4,y+0.8,4.0,0.5,{fontSize:13,color:GRAY,valign:'top'});});});
// 7
add('LIGHT',c=>{L(c,'Bewerbungsschreiben',[['Auch ',false],['Anschreiben',true],[' oder Motivationsschreiben',false]],'Es soll zeigen, dass man an genau dieser Stelle interessiert ist.',36);
 card(c,7.6,0.9,4.6,5.3);[0.4,2.8,3.4,2.2,3.8,3.2,2.6].forEach((w,i)=>c.s.addShape(S.roundRect,{x:7.95,y:1.35+i*0.6,w:w*1.05,h:0.2,rectRadius:0.06,fill:{color:i===0?DEEP:CHIP},line:{color:i===0?DEEP:CHIP,width:0}}));
 badge(c.s,'Interesse zeigen',8.2,5.4,2.6,0.5,NEON,DEEP,14);});
// 8
add('LIGHT',c=>{L(c,'Vorbereitung',[['Stellenanzeige ',false],['genau lesen',true]],null,40);
 bubble(c.s,'Welche Fähigkeiten und Kenntnisse bringe ich mit, die hier gefragt sind?',7.2,1.3,5.4,2.0,NEON,DEEP,17);
 card(c,7.2,3.9,5.4,1.7);T(c.s,'Anforderungen ↔ meine Stärken',7.4,3.9,5.0,1.7,{fontSize:18,bold:true,align:'center',valign:'middle'});});
// 9
add('LIGHT',c=>{L(c,'Aufbau',[['Ähnlicher ',false],['Aufbau',true],[' bei jedem Schreiben',false]],'Von oben nach unten:',38);lst(c,BRIEF,[],0.55,0.68,0.58);});
// 10-18
const BL=[['Oben: ','Absender und Empfänger','Adresse des Unternehmens: Website oder Inserat.'],['Rechtsbündig: ','Ort und Datum',null],['Der ','Betreff','Verweist auf das Inserat, z. B. „Bewerbung als Bürokauffrau“.'],['Die ','Anrede','Wenn möglich an die zuständige Person. Nicht „Sehr geehrte Damen und Herren“.'],['Die ','Einleitung','Bezug auf das Inserat, z. B. „Ich habe Ihr Inserat auf karriere.at gelesen.“'],['Der ','Hauptteil','Warum dieses Unternehmen, warum geeignet? Stärken mit den Anforderungen verknüpfen.'],['Der ','Schluss','Bitte um ein persönliches Gespräch.'],['Grußformel und ','Unterschrift','Online: eingescannte Unterschrift wirkt besser.'],['Ganz unten: ','Beilagen','Zeugnisse nur in Kopie.']];
BL.forEach((b,i)=>add('LIGHT',c=>{L(c,'Bewerbungsschreiben',[[b[0],false],[b[1],true]],b[2],40);lst(c,BRIEF,[i],0.55,0.68,0.58);}));
// 19
add('LIGHT',c=>{L(c,'Lebenslauf',[['Qualifikationen auf ',false],['einen Blick',true]],'Übersichtlich und vollständig.',38);lst(c,CVL,[],0.9,0.85,0.72);});
const CL=[['Persönliche ','Daten','Name, Adresse, Telefon, E-Mail, Geburtsdatum und -ort, Staatsangehörigkeit.'],['Ein ','Foto','Rechts oben, am besten vom Fotografen. Keine selbstgemachten oder unscharfen Fotos.'],['Die ','Ausbildung','Beginnend mit der aktuellsten.'],['Praxis- und ','Berufserfahrung','Unternehmen, Position, Aufgaben, beginnend mit der aktuellsten.'],['Besondere ','Fähigkeiten','Sprachkenntnisse mit Niveau, EDV-Kenntnisse, Führerschein.'],['Persönliche ','Interessen','Wenn sie zur Stelle passen. „Chillen“ hilft wenig, ein Sportverein schon.'],['Zum Schluss: ','Unterschrift','Ort, Datum und Unterschrift.']];
CL.forEach((b,i)=>add('LIGHT',c=>{L(c,'Lebenslauf',[[b[0],false],[b[1],true]],b[2],40);lst(c,CVL,[i],0.9,0.85,0.72);}));
// 27
add('LIGHT',c=>{L(c,'Vorauswahl',[['Zwei Arten von ',false],['Kriterien',true]],'Alle Bewerbungen werden geprüft.',40);
 [['Formale Kriterien','die Form'],['Inhaltliche Kriterien','der Inhalt']].forEach(([t,s_],i)=>{const y=1.3+i*2.4;card(c,7.2,y,5.4,2.0);tile(c.s,7.5,y+0.25,4.8,0.8,t,i?DEEP:NEON,i?NEON:DEEP,19);T(c.s,s_,7.5,y+1.2,4.8,0.5,{fontSize:16,color:GRAY,align:'center',valign:'middle'});});});
// 28
add('LIGHT',c=>{L(c,'Formale Kriterien',[['Die ',false],['Form',true],[' zählt',false]],null,42);
 ['Unterlagen vollständig?','Sauber und übersichtlich?','Grammatik und Rechtschreibung?','Gesamteindruck?'].forEach((t,i)=>{const y=1.0+i*1.35;card(c,7.2,y,5.4,1.1);check(c.s,7.5,y+0.3,0.5,DEEP);T(c.s,t,8.3,y,4.2,1.1,{fontSize:16,bold:true,valign:'middle'});});});
// 29
add('LIGHT',c=>{L(c,'Inhaltliche Kriterien',[['Der ',false],['Inhalt',true],[' zählt',false]],'Die wichtigste Frage: Passen die Qualifikationen zum Anforderungsprofil?',36);
 ['Informationen, Stil und Ausdruck','Berufliche Entwicklung','Lücken oder häufige Wechsel?','Referenzen?','Passt es zum Anforderungsprofil?'].forEach((t,i)=>{const y=0.8+i*1.15,on=i===4;card(c,7.2,y,5.4,0.95,on?NEON:CARD,on?DEEP:LINE);T(c.s,t,7.5,y,4.8,0.95,{fontSize:16,bold:true,valign:'middle'});});});
// 30
add('NEON',c=>{L(c,'Tipp',[['Vor dem Abschicken ',false],['kontrollieren',false]],'Ein Tippfehler oder ein fehlendes Zeugnis kann den Ausschlag geben.',38);
 card(c,7.2,1.0,5.4,1.3);xmark(c.s,7.5,1.3,0.7);T(c.s,'Tippfehler',8.5,1.0,4.0,1.3,{fontSize:18,bold:true,valign:'middle'});
 card(c,7.2,2.6,5.4,1.3);xmark(c.s,7.5,2.9,0.7);T(c.s,'Zeugnis fehlt',8.5,2.6,4.0,1.3,{fontSize:18,bold:true,valign:'middle'});
 card(c,7.2,4.2,5.4,1.6,DEEP,DEEP);check(c.s,7.5,4.65,0.7,NEON);T(c.s,'Genau kontrollieren oder gegenlesen lassen',8.5,4.2,4.0,1.6,{fontSize:16,bold:true,color:CARD,valign:'middle'});});
// 31
add('DARK',c=>{L(c,'Vorstellungsgespräch',[['Wer überzeugt, wird ',false],['eingeladen',true]],'Beide Seiten lernen sich persönlich kennen.',38);
 ['Einzelgespräch','Mehrpersonengespräch','Round-Table-Gespräch'].forEach((t,i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55,DEEP2,DEEPLINE);circleNum(c.s,i+1,7.5,y+0.5,0.55,NEON,DEEP);T(c.s,t,8.4,y,4.0,1.55,{fontSize:18,bold:true,color:CARD,valign:'middle'});});});
// 32-34
const people=(c,nb,nf)=>{card(c,7.2,1.0,5.4,4.8);T(c.s,'Du',7.4,1.1,2.4,0.4,{fontSize:13,bold:true,color:GRAY,align:'center'});T(c.s,'Unternehmen',10.0,1.1,2.4,0.4,{fontSize:13,bold:true,color:GRAY,align:'center'});
 for(let i=0;i<nb;i++)person(c.s,8.6,1.7+i*1.45,0.8,NEON===undefined?DEEP:GREEN);for(let i=0;i<nf;i++)person(c.s,11.2,1.7+i*1.45,0.8,DEEP);};
add('LIGHT',c=>{L(c,'Einzelgespräch',[['Eine Person ',false],['aus dem Unternehmen',true]],null,38);people(c,1,1);});
add('LIGHT',c=>{L(c,'Mehrpersonengespräch',[['Mehrere Personen ',false],['aus dem Unternehmen',true]],'Zum Beispiel Personalchefin und zukünftiger Vorgesetzter.',36);people(c,1,2);});
add('LIGHT',c=>{L(c,'Round-Table-Gespräch',[['Mehrere Bewerber:innen, ',false],['mehrere Personen',true]],null,36);people(c,3,2);});
// 35
add('LIGHT',c=>{L(c,'Ablauf',[['Oft nach diesem ',false],['Muster',true]],'Kein Gespräch läuft genau gleich ab.',40);lst(c,GES,[],1.0,1.1,0.95);});
const GL=[['Die ','Begrüßung','In die Augen schauen, erst setzen, wenn man dazu aufgefordert wird. Einstiegsfrage: „Haben Sie gut hergefunden?“'],['Fragen ','an dich','„Können Sie etwas über sich erzählen?“ „Warum genau diese Stelle?“ „Stärken und Schwächen?“'],['Das ','Unternehmen','Stellt sich vor und informiert über die Stelle. Vorher informieren, dann passende Rückfragen stellen.'],['„Haben Sie noch ',' Fragen?“','Unbedingt eine Frage stellen: „Wie sieht ein typischer Arbeitstag aus?“ „Werde ich eingeschult?“'],['Die ','Verabschiedung','Man bedankt sich für das Gespräch.']];
GL.forEach((b,i)=>add('LIGHT',c=>{L(c,'Vorstellungsgespräch',[[b[0],false],[b[1],true]],b[2],40);lst(c,GES,[i],1.0,1.1,0.95);}));
// 41
add('LIGHT',c=>{L(c,'Weitere Verfahren',[['Neben dem Gespräch: ',false],['weitere Verfahren',true]],'Sie prüfen bestimmte Kenntnisse und Fähigkeiten.',36);lst(c,AUS,[],1.3,1.2,1.0);});
const AL=[['Der ','Eignungstest','Überblick über die Fähigkeiten: kreative, mathematische und sprachliche Aufgaben.'],['Die ','Leistungsprobe','Prüft eine bestimmte Fähigkeit, z. B. eine Abschrift in zehn Minuten oder eine Übersetzung.'],['Der ','Fragebogen','Einstellungen und Verhalten in bestimmten Situationen ergeben ein Persönlichkeitsbild.'],['Das ','Assessment-Center','Mehrere Bewerber:innen werden gleichzeitig beurteilt, während sie gemeinsam Aufgaben lösen.']];
AL.forEach((b,i)=>add('LIGHT',c=>{L(c,'Auswahlverfahren',[[b[0],false],[b[1],true]],b[2],40);lst(c,AUS,[i],1.3,1.2,1.0);}));
// 46
add('NEON',c=>{L(c,'Entscheidung',[['Details vereinbaren, ',false],['Vertrag unterschreiben',false]],'Eintrittsdatum, Arbeitszeit und Gehalt.',38);
 card(c,7.2,0.9,5.4,5.0);T(c.s,'Arbeitsvertrag',7.5,1.0,4.8,0.6,{fontSize:20,bold:true,color:GREEN,valign:'middle'});
 ['Eintrittsdatum','Arbeitszeit','Gehalt'].forEach((t,i)=>{tile(c.s,7.5,1.8+i*0.8,4.8,0.65,t,CHIP,INK,15);});
 [7.6,10.1].forEach(x=>{c.s.addShape(S.line,{x,y:5.2,w:2.1,h:0,line:{color:DEEP,width:2}});});T(c.s,'Unterschrift',7.6,5.25,2.1,0.4,{fontSize:11,color:GRAY,align:'center'});T(c.s,'Unterschrift',10.1,5.25,2.1,0.4,{fontSize:11,color:GRAY,align:'center'});});
// 47
add('LIGHT',c=>{L(c,'Zusammenfassung',[['Die ',false],['Unterlagen',true]],'Beide Dokumente haben einen festen Aufbau.',40);
 ['Bewerbungsschreiben','Lebenslauf','Beilagen'].forEach((t,i)=>{const y=1.1+i*1.85;card(c,7.2,y,5.4,1.55);check(c.s,7.5,y+0.5,0.55,NEON,DEEP);T(c.s,t,8.4,y,4.0,1.55,{fontSize:18,bold:true,valign:'middle'});});});
// 48
add('LIGHT',c=>{L(c,'Zusammenfassung',[['Der ',false],['Ablauf',true]],null,42);lst(c,['Prüfung: formal und inhaltlich','Vorstellungsgespräch','Weitere Auswahlverfahren (manchmal)','Entscheidung','Arbeitsvertrag'],[],1.0,1.1,0.95);});
// 49
add('NEON',c=>{L(c,'Ausblick',[['Worauf es ankommt ',false],['im nächsten Video',false]],null,38);bubble(c.s,'Worauf kommt es bei der Bewerbung an?',7.3,1.5,5.0,2.0,CARD,INK,18);tile(c.s,8.0,4.2,3.6,1.0,'Nächstes Video',DEEP,NEON,18);});
// 50
add('DARK',c=>{L(c,'Bis zum nächsten Mal',[['Danke fürs ',false],['Zuschauen',true]],null,44);card(c,8.2,1.5,3.6,3.6,DEEP2,DEEPLINE);T(c.s,'Abo',8.2,1.8,3.6,1.4,{fontSize:44,bold:true,color:NEON,align:'center',valign:'middle'});badge(c.s,'kostenlos',9.0,3.6,2.0,0.55,NEON,DEEP,16);});
let _i=0,_k=0;
while(_i<SL.length){const f=SL[_i];let mode='LIGHT';if(typeof SL[_i+1]==='string'){mode=SL[_i+1];_i+=2;}else _i+=1;
  const t=TXT[_k];const c=mk(mode,'Folie '+(_k+1)+' – '+t[1]+': '+t[2]);f(c);_k++;}
if(_k!==50)throw new Error('Folienzahl '+_k);
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok',n);})();
