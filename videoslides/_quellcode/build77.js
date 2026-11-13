const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const BG='FFFFFF',INK='2D1B0E',Y='E8B53A',YL='F6DF8C',OD='C2571A',O='DA702F',CHIP='FCE9C4',LINE='EBC58A',GRAY='7A6A5A',W='FFFFFF',BROWN='8B4A1C';
const FONT='Poppins';
const THEME={name:'logoprima',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:W,dk2:OD,lt2:BG,accent1:Y,accent2:OD,accent3:CHIP,accent4:GRAY,accent5:O,accent6:LINE,hlink:OD,folHlink:GRAY}};
const pres=new pptxgen();pres.defineLayout({name:'STORY',width:7.5,height:13.333});pres.layout='STORY';
pres.title='logoprima+ Instagram-Story';pres.author='Cleverbox';
const S=pres.ShapeType;const Wd=7.5,H=13.333,X0=0.55,CW=6.4;
function frame(n){const s=pres.addSlide();s.background={color:BG};
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:20,color:INK,margin:0,valign:'top',isTextBox:true},o));
  s.addImage({path:__dirname+'/logo_small.png',x:X0,y:1.85,w:2.5,h:2.5*0.3709,altText:'cleverbox'});
  for(let i=0;i<3;i++)s.addShape(S.roundRect,{x:Wd-X0-1.5+i*0.52,y:2.3,w:0.42,h:0.1,rectRadius:0.05,fill:{color:i<=n?OD:LINE},line:{color:i<=n?OD:LINE,width:0}});
  s.addShape(S.line,{x:X0,y:3.0,w:CW,h:0,line:{color:LINE,width:1.5}});
  return {s,T};}
const card=(s,x,y,w,h,fill,line)=>s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.25,fill:{color:fill||W},line:{color:line||LINE,width:2}});
const kick=(T,t,y)=>T(t,X0,y,CW,0.45,{fontSize:18,bold:true,color:OD});
const head=(T,segs,y,sz=44,h=2.0)=>T(segs.map(([t,a,b])=>({text:t,options:{color:a?OD:INK,highlight:a?YL:undefined,breakLine:!!b}})),X0,y,CW,h,{fontSize:sz,lineSpacingMultiple:1.0});
const circ=(s,T,n,x,y,d,fill,col,fs)=>{s.addShape(S.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,width:0}});T(String(n),x,y,d,d,{fontSize:fs||d*34,bold:true,color:col,align:'center',valign:'middle'});};
// ---- 1 Hook ----
{const {s,T}=frame(0);
  kick(T,'logoprima+ · Knobelaufgabe',3.2);
  head(T,[['Schaffst du',false,true],['das?',true]],3.7,52,2.1);
  card(s,X0,6.0,CW,4.95);
  circ(s,T,1,X0+0.25,6.2,0.5,YL,INK,17);
  T('Welche Zahl fehlt?',X0+0.95,6.2,3.5,0.5,{fontSize:17,bold:true,valign:'middle'});
  s.addShape(S.roundRect,{x:X0+CW-1.85,y:6.22,w:1.6,h:0.46,rectRadius:0.1,fill:{color:CHIP},line:{color:LINE,width:1.25}});
  T('Level 2',X0+CW-1.85,6.22,1.6,0.46,{fontSize:13,bold:true,color:BROWN,align:'center',valign:'middle'});
  const g=[[2,7,6],[9,5,1],[4,3,null]],ts=1.0,gp=0.12,x0=X0+(CW-3*ts-2*gp)/2,y0=6.9;
  g.forEach((r,ri)=>r.forEach((v,ci)=>{const q=v===null,x=x0+ci*(ts+gp),y=y0+ri*(ts+gp);
    s.addShape(S.roundRect,{x,y,w:ts,h:ts,rectRadius:0.16,fill:{color:q?OD:((ri+ci)%2?YL:CHIP)},line:{color:q?OD:LINE,width:2}});
    T(q?'?':String(v),x,y,ts,ts,{fontSize:q?44:40,bold:true,color:q?W:INK,align:'center',valign:'middle'});}));
  T('Alle Zeilen, Spalten und Diagonalen haben dieselbe Summe.',X0+0.3,10.35,CW-0.6,0.4,{fontSize:12,color:GRAY,align:'center'});
  T('Antwort in der Umfrage tippen, Auflösung folgt!',X0,11.15,CW,0.6,{fontSize:14,bold:true,color:OD,align:'center'});}
// ---- 2 Nutzen ----
{const {s,T}=frame(1);
  kick(T,'logoprima+ · Mathematik',3.2);
  head(T,[['Das ',false],['Logik-Heft',true,true],['gratis für dich',false]],3.7,38,1.9);
  // Arbeitsblatt-Vorschau
  const iw=2.6,ih=iw*1.4142,ix=X0+0.05,iy=5.75;
  s.addShape(S.roundRect,{x:ix+0.1,y:iy+0.1,w:iw,h:ih,rectRadius:0.06,fill:{color:LINE},line:{color:LINE,width:0}});
  s.addImage({path:__dirname+'/st/ab1.jpg',x:ix,y:iy,w:iw,h:ih});
  s.addShape(S.rect,{x:ix,y:iy,w:iw,h:ih,fill:{color:'FFFFFF',transparency:100},line:{color:INK,width:1}});
  const pts=[['50','Arbeitsblätter'],['5–9','Schulstufe'],['4','Levels'],['PDF','mit Lösungen']];
  pts.forEach(([a,b],i)=>{const x=X0+3.0,y=5.75+i*0.98,w=3.4;card(s,x,y,w,0.85,CHIP,LINE);
    T(a,x+0.15,y,1.2,0.85,{fontSize:24,bold:true,color:OD,valign:'middle'});T(b,x+1.3,y,w-1.4,0.85,{fontSize:14,bold:true,valign:'middle'});});
  card(s,X0+3.0,9.75,3.4,0.95,YL,LINE);
  T('Zum Ausdrucken, ohne Anmeldung zum Üben',X0+3.15,9.75,3.1,0.95,{fontSize:12.5,bold:true,color:INK,valign:'middle'});
  T('Für Schule, Nachhilfe und zu Hause.',X0,10.95,CW,0.5,{fontSize:15,color:GRAY,align:'center'});}
// ---- 3 CTA ----
{const {s,T}=frame(2);
  kick(T,'Auflösung: die fehlende Zahl ist 8',3.2);
  head(T,[['Hol dir das',false,true],['Logik-Heft ',true,true],['gratis!',false]],3.7,48,2.8);
  card(s,X0,6.95,CW,2.6,CHIP,LINE);
  const cw=1.5,ch=cw*1.4142,cx=X0+0.3,cy=7.2;
  s.addShape(S.roundRect,{x:cx+0.08,y:cy+0.08,w:cw,h:ch,rectRadius:0.04,fill:{color:LINE},line:{color:LINE,width:0}});
  s.addImage({path:__dirname+'/st/cover.jpg',x:cx,y:cy,w:cw,h:ch});
  [['✓','50 Arbeitsblätter'],['✓','Schulstufe 5 bis 9'],['✓','Lösungen inklusive']].forEach(([c,t],i)=>{const y=7.35+i*0.7;
    s.addShape(S.ellipse,{x:X0+2.2,y:y+0.03,w:0.42,h:0.42,fill:{color:OD},line:{color:OD,width:0}});T(c,X0+2.2,y+0.03,0.42,0.42,{fontSize:14,bold:true,color:W,align:'center',valign:'middle'});
    T(t,X0+2.8,y,3.4,0.5,{fontSize:16,bold:true,valign:'middle'});});
  T('Link-Sticker antippen',X0,9.85,CW,0.5,{fontSize:17,bold:true,color:OD,align:'center'});
  s.addShape(S.downArrow,{x:3.4,y:10.4,w:0.7,h:0.55,fill:{color:OD},line:{color:OD,width:0}});}
const OUT='/home/user/claudecloud/videoslides/logoprima-instagram-story.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
