const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');

const BG='DCEBFA', CARD='F4F9FF', INK='0B1E3A', GREEN='14459A', NEON='8DBBF2', DEEP='0F2A52',
  GRAY='4A5F7A', LINE='A9C6EA', CHIP='C9DDF5', TAB2='D4E4F7', DEEP2='1B3D75', DEEPLINE='3B66A8', DSUB='B5CCEC';
const FONT='Poppins';
const THEME={name:'Cleverbox Mathe Blau',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'FF7A45',accent6:LINE,hlink:GREEN,folHlink:GRAY}};

const pres=new pptxgen();
pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='Flächeninhalt aller Grundfiguren – Zusammenfassung';
pres.author='Cleverbox';
pres.theme={headFontFace:FONT,bodyFontFace:FONT};
const S=pres.ShapeType;

[['LIGHT',BG,GRAY],['DARK',DEEP,DSUB],['NEON',NEON,DEEP]].forEach(([n,bg,fc])=>{
  pres.defineSlideMaster({title:n,background:{color:bg},objects:[
    {text:{text:'Cleverbox · Mathematik',options:{x:0.6,y:11.3,w:6,h:0.3,fontFace:FONT,fontSize:11,color:fc,margin:0}}}]});
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
function fm(str){ // a_b -> Index
  const out=[];str.split(/(h_[abc])/).forEach(p=>{ if(!p)return; const m=p.match(/^h_([abc])$/); if(m){out.push({text:'h'});out.push({text:m[1],options:{subscript:true}});} else out.push({text:p}); });return out;}
function chk(s,x,y,d,fill=NEON,col=INK){
  s.addShape(S.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,width:0}});
  s.addShape(S.rect,{x:x+d*0.17,y:y+d*0.53,w:d*0.30,h:d*0.13,rotate:49,fill:{color:col},line:{color:col,width:0}});
  s.addShape(S.rect,{x:x+d*0.30,y:y+d*0.40,w:d*0.55,h:d*0.13,rotate:311,fill:{color:col},line:{color:col,width:0}});
}
function shapeIcon(s,type,x,y,w,h,fill,line){
  const o={x,y,w,h,fill:{color:fill},line:{color:line,width:1.5}};
  if(type==='kite'){s.addShape(S.custGeom,Object.assign({},o,{points:[{x:0,y:h*0.38,moveTo:true},{x:w*0.5,y:0},{x:w,y:h*0.38},{x:w*0.5,y:h},{close:true}]}));}
  else s.addShape(S[type],o);
}
function H(c,t,y){T(c.s,t,X0,y,W,0.5,{fontSize:20,bold:true,color:c.mode==='DARK'?NEON:GREEN,valign:'middle'});}
// ---------- Seite 1
{const c=mk('LIGHT','Seite 1');
 kicker(c,'Zusammenfassung · Flächeninhalt',X0,0.6,7);
 head(c,[['Flächeninhalt aller\n',false],['Grundfiguren',true]],X0,1.05,W,1.9,40);
 // Grundidee
 card(c,X0,3.1,W,2.15,DEEP,DEEP);
 T(c.s,'Die Grundidee',X0+0.35,3.25,5,0.45,{fontSize:15,bold:true,color:NEON,valign:'middle'});
 T(c.s,'Alle Flächenformeln lassen sich vom Rechteck herleiten.',X0+0.35,3.75,W-0.7,0.5,{fontSize:17,bold:true,color:'FFFFFF',valign:'middle'});
 T(c.s,'Man verwandelt jede Figur durch Verdoppeln, Zerschneiden oder Umlegen in ein Rechteck oder ein Parallelogramm und rechnet dann mit bekannten Formeln.',X0+0.35,4.3,W-0.7,0.85,{fontSize:12.5,color:DSUB,lineSpacingMultiple:1.2});
 H(c,'Ausgangspunkt: das Rechteck',5.55);
 card(c,X0,6.15,W,5.0);
 // Raster 5x3
 const gx=X0+0.9,gy=6.75,cs=0.62;
 for(let r=0;r<3;r++)for(let k=0;k<5;k++)c.s.addShape(S.rect,{x:gx+k*cs,y:gy+r*cs,w:cs,h:cs,fill:{color:(r+k)%2?CHIP:'D9E8FA'},line:{color:GREEN,width:1}});
 T(c.s,'Länge a = 5 cm',gx,gy-0.5,5*cs,0.4,{fontSize:12,bold:true,color:GREEN,align:'center',valign:'middle'});
 T(c.s,'3 cm',X0+0.2,gy,0.65,3*cs,{fontSize:12,bold:true,color:GREEN,align:'center',valign:'middle'});
 T(c.s,'1 Kästchen = 1 cm²',gx,gy+3*cs+0.1,5*cs,0.35,{fontSize:10.5,color:GRAY,align:'center'});
 T(c.s,'Der Flächeninhalt gibt an, wie oft eine Einheitsfläche (z. B. 1 cm²) in die Figur passt.',X0+0.35,9.05,W-0.7,0.6,{fontSize:12,color:INK,lineSpacingMultiple:1.2});
 const st=[['5 cm','Länge: 5 cm² passen in eine Reihe'],['3 Reihen','Breite: 3 cm, also 3 Reihen'],['3 · 5 cm² = 15 cm²','Reihen mal Kästchen pro Reihe']];
 const rx=X0+4.45;T(c.s,'Rechnung',rx,6.55,2.4,0.35,{fontSize:12,bold:true,color:GREEN});
 T(c.s,'5 cm² pro Reihe\n3 Reihen\n3 · 5 cm² = 15 cm²',rx,6.95,2.4,1.3,{fontSize:12,color:INK,lineSpacingMultiple:1.35,valign:'top'});
 card(c,X0+0.35,9.8,W-0.7,1.0,NEON,NEON);
 T(c.s,'A = a · b',X0+0.6,9.8,3.2,1.0,{fontSize:30,bold:true,color:DEEP,valign:'middle'});
 T(c.s,'Länge = Kästchen pro Reihe\nBreite = Zahl der Reihen',X0+3.9,9.8,2.8,1.0,{fontSize:11,color:DEEP,valign:'middle',lineSpacingMultiple:1.2});
}
// ---------- Seite 2
{const c=mk('LIGHT','Seite 2');
 kicker(c,'Die Herleitungen im Überblick',X0,0.6,7);
 head(c,[['Alles vom ',false],['Rechteck',true],[' abgeleitet',false]],X0,1.0,W,1.0,30);
 const rows=[
  ['rect','Rechteck','Einheitsquadrate zählen: Länge mal Breite','A = a · b'],
  ['rect','Quadrat','Sonderfall des Rechtecks (Länge = Breite)','A = a · a'],
  ['rtTriangle','Rechtwinkeliges Dreieck','Verdoppeln ergibt ein Rechteck, das Dreieck ist die Hälfte','A = a · b : 2'],
  ['parallelogram','Parallelogramm','Höhe einzeichnen, Dreieck links abschneiden und rechts anlegen: Rechteck mit Länge a und Breite h','A = a · h_a\noder A = b · h_b'],
  ['diamond','Raute','Sonderfall des Parallelogramms (alle Seiten gleich lang, nur eine Höhe) oder Deltoid','A = a · h\noder A = e · f : 2'],
  ['trapezoid','Trapez','Zweites, umgedrehtes Trapez danebenlegen: Parallelogramm mit Seite (a + c), das Trapez ist die Hälfte','A = (a + c) · h : 2'],
  ['kite','Deltoid','Diagonalen teilen es in 4 Dreiecke, verdoppelt ergibt sich ein Rechteck mit e und f, das Deltoid ist die Hälfte','A = e · f : 2'],
  ['triangle','Allgemeines Dreieck','Verdoppeln ergibt ein Parallelogramm, das Dreieck ist die Hälfte (ebenso a · h_a : 2 und b · h_b : 2)','A = c · h_c : 2']];
 rows.forEach((r,i)=>{
  const y=2.05+i*1.14,h=1.05;
  card(c,X0,y,W,h);
  const iw=0.95,ih=0.62;
  shapeIcon(c.s,r[0],X0+0.3,y+(h-ih)/2,r[0]==='rect'&&i===1?0.62:(r[0]==='kite'?0.7:iw),ih,i%2?NEON:'C9DDF5',DEEP);
  T(c.s,r[1],X0+1.5,y+0.08,2.95,0.3,{fontSize:13,bold:true,color:INK,valign:'middle'});
  T(c.s,fm(r[2]),X0+1.5,y+0.4,2.95,0.6,{fontSize:9,color:GRAY,lineSpacingMultiple:1.1,valign:'top'});
  card(c,X0+4.55,y+0.15,2.35,h-0.3,DEEP,DEEP);
  const ls=r[3].split('\n');ls.forEach((l,k)=>T(c.s,fm(l),X0+4.55,y+0.15+(ls.length>1?k*(h-0.3)/2:0),2.35,ls.length>1?(h-0.3)/2:h-0.3,{fontSize:10.5,bold:true,color:NEON,align:'center',valign:'middle',wrap:false}));
 });
}
// ---------- Seite 3
{const c=mk('DARK','Seite 3');
 kicker(c,'Wichtige Zusätze und Merksätze',X0,0.6,7);
 head(c,[['Das solltest du\n',false],['wissen',true]],X0,1.0,W,1.7,38);
 const z=[['Parallelogramm','Beide Formeln sind richtig. Man verwendet immer die Seite mit der dazugehörigen Höhe: a mit h_a oder b mit h_b.'],['Raute','Ein Parallelogramm mit vier gleich langen Seiten. Weil die Diagonalen normal aufeinander stehen, ist sie zugleich ein Deltoid. Beide Formeln sind erlaubt.'],['Formel e · f : 2','Gilt für alle Vierecke, deren Diagonalen normal aufeinander stehen, nicht nur für Deltoide.'],['Dreieck','Man kann jede der drei Seiten als Grundseite nehmen, muss aber die dazugehörige Höhe verwenden.']];
 z.forEach((t,i)=>{const x=X0+(i%2)*3.62,y=2.85+Math.floor(i/2)*2.15,w=3.45;
  card(c,x,y,w,2.0,DEEP2,DEEPLINE);
  T(c.s,t[0],x+0.25,y+0.15,w-0.5,0.4,{fontSize:14,bold:true,color:NEON,valign:'middle'});
  T(c.s,fm(t[1].replace(/h_a/g,'h_a')),x+0.25,y+0.6,w-0.5,1.3,{fontSize:10.5,color:BG,lineSpacingMultiple:1.2,valign:'top'});});
 H(c,'Merksätze',7.3);
 ['Parallelogramm und Dreieck: Seite mal dazugehörige Höhe (beim Dreieck durch 2).','Alle Flächen stammen vom Rechteck ab.','Formel vergessen? Verwandle die Figur in ein Rechteck oder Parallelogramm und überlege, welchen Teil davon du brauchst.'].forEach((t,i)=>{
  const y=7.9+i*0.82;card(c,X0,y,W,0.72,DEEP2,DEEPLINE);chk(c.s,X0+0.2,y+0.17,0.38);
  T(c.s,t,X0+0.8,y,W-1.0,0.72,{fontSize:11,color:BG,valign:'middle',lineSpacingMultiple:1.1});});
 card(c,X0,10.45,W,0.8,NEON,NEON);
 c.s.addShape(S.ellipse,{x:X0+0.25,y:10.57,w:0.56,h:0.56,fill:{color:NEON},line:{color:DEEP,width:2.5}});
 T(c.s,[{text:'Ausblick: ',options:{bold:true}},{text:'Auch die Kreisfläche lässt sich auf das Rechteck zurückführen. Das zeigt das Folgevideo zum Kreis.'}],X0+1.0,10.45,W-1.2,0.8,{fontSize:10.5,color:DEEP,valign:'middle'});
}
pres.writeFile({fileName:'/home/user/claudecloud/videoslides/flaecheninhalt-zusammenfassung-a4.pptx'}).then(()=>console.log('ok'));
