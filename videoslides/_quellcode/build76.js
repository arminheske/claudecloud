const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const BG='FFF7EA',INK='2D1B0E',Y='E8B53A',YL='F6DF8C',OD='C2571A',O='DA702F',CHIP='FCE9C4',LINE='EBC58A',GRAY='7A6A5A',W='FFFFFF';
const FONT='Poppins';
const THEME={name:'logoprima',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:W,dk2:OD,lt2:BG,accent1:Y,accent2:OD,accent3:CHIP,accent4:GRAY,accent5:O,accent6:LINE,hlink:OD,folHlink:GRAY}};
const pres=new pptxgen();pres.defineLayout({name:'STORY',width:7.5,height:13.333});pres.layout='STORY';
pres.title='logoprima+ Instagram-Story';pres.author='Cleverbox';
const S=pres.ShapeType;const Wd=7.5,H=13.333;
function path(s,pts,fill){const pp=pts.filter(p=>p.x!==undefined);const xs=pp.map(p=>p.x).concat(pts.filter(p=>p.curve).flatMap(p=>[p.curve.x1,p.curve.x2])),ys=pp.map(p=>p.y).concat(pts.filter(p=>p.curve).flatMap(p=>[p.curve.y1,p.curve.y2]));
  const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
  s.addShape(S.custGeom,{x:x0,y:y0,w,h,fill:{color:fill},line:{color:fill,width:0},points:pts.map(p=>{const q=Object.assign({},p);if(p.x!==undefined){q.x=p.x-x0;q.y=p.y-y0;}if(p.curve)q.curve={type:'cubic',x1:p.curve.x1-x0,y1:p.curve.y1-y0,x2:p.curve.x2-x0,y2:p.curve.y2-y0};return q;})});}
function frame(){const s=pres.addSlide();s.background={color:BG};
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:20,color:INK,margin:0,valign:'top',isTextBox:true},o));
  // Wellen oben/unten (außerhalb der Story-Safe-Zones)
  path(s,[{x:0,y:0,moveTo:true},{x:Wd,y:0},{x:Wd,y:0.55},{x:0,y:0.5,curve:{x1:Wd*0.7,y1:1.2,x2:Wd*0.3,y2:1.0}},{close:true}],OD);
  path(s,[{x:0,y:0,moveTo:true},{x:Wd*0.78,y:0},{x:0,y:0.45,curve:{x1:Wd*0.6,y1:0.35,x2:Wd*0.3,y2:0.5}},{close:true}],Y);
  path(s,[{x:0,y:H,moveTo:true},{x:Wd,y:H},{x:Wd,y:H-0.5},{x:0,y:H-0.5,curve:{x1:Wd*0.6,y1:H-1.2,x2:Wd*0.25,y2:H-1.1}},{close:true}],OD);
  path(s,[{x:Wd,y:H-0.5,moveTo:true},{x:Wd,y:H-1.2},{x:0,y:H-0.5,curve:{x1:Wd*0.75,y1:H-1.55,x2:Wd*0.3,y2:H-1.4}},{close:true}],Y);
  return {s,T};}
const wordmark=(T,y,sz=34,al='center')=>T([{text:'logo',options:{color:Y}},{text:'prima+',options:{color:OD}}],0.5,y,6.5,0.7,{fontSize:sz,bold:true,align:al,valign:'middle'});
const pill=(s,T,t,x,y,w,h,fill,col,sz=16)=>{s.addShape(S.roundRect,{x,y,w,h,rectRadius:h/2,fill:{color:fill},line:{color:fill,width:0}});T(t,x,y,w,h,{fontSize:sz,bold:true,color:col,align:'center',valign:'middle'});};
const card=(s,x,y,w,h,fill,line)=>s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.25,fill:{color:fill||W},line:{color:line||LINE,width:2}});
const circ=(s,T,n,x,y,d,fill,col)=>{s.addShape(S.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,width:0}});T(String(n),x,y,d,d,{fontSize:d*34,bold:true,color:col,align:'center',valign:'middle'});};
const dots=(s,n)=>{for(let i=0;i<3;i++)s.addShape(S.ellipse,{x:3.15+i*0.4,y:1.25,w:0.18,h:0.18,fill:{color:i===n?OD:LINE},line:{color:i===n?OD:LINE,width:0}});};
// ---- Frame 1: Hook ----
{const {s,T}=frame();dots(s,0);
  pill(s,T,'KNOBELAUFGABE',2.1,2.0,3.3,0.55,OD,W,16);
  T([{text:'Welche Zahl',options:{color:INK,breakLine:true}},{text:'fehlt?',options:{color:OD,highlight:YL}}],0.5,2.85,6.5,2.0,{fontSize:58,align:'center',lineSpacingMultiple:0.95});
  const g=[[2,7,6],[9,5,1],[4,3,null]],ts=1.62,gp=0.16,x0=(Wd-3*ts-2*gp)/2,y0=5.35;
  g.forEach((r,ri)=>r.forEach((v,ci)=>{const q=v===null;const x=x0+ci*(ts+gp),y=y0+ri*(ts+gp);
    s.addShape(S.roundRect,{x,y,w:ts,h:ts,rectRadius:0.2,fill:{color:q?OD:((ri+ci)%2?YL:CHIP)},line:{color:INK,width:2}});
    T(q?'?':String(v),x,y,ts,ts,{fontSize:q?66:58,bold:true,color:q?W:INK,align:'center',valign:'middle'});}));
  T('Jede Zeile, Spalte und Diagonale ergibt dieselbe Summe.',0.8,10.7,5.9,0.8,{fontSize:17,color:GRAY,align:'center',lineSpacingMultiple:1.2});
  pill(s,T,'Auflösung in der letzten Story',1.35,11.45,4.8,0.6,CHIP,OD,15);}
// ---- Frame 2: Nutzen ----
{const {s,T}=frame();dots(s,1);
  wordmark(T,1.8,40);
  T([{text:'Das ',options:{color:INK}},{text:'Logik-Heft',options:{color:OD,highlight:YL}}],0.5,2.65,6.5,1.0,{fontSize:46,align:'center'});
  T('50 Arbeitsblätter zum Knobeln, Kombinieren und logisch Denken. Kostenlos als PDF.',0.9,3.8,5.7,1.1,{fontSize:18,color:GRAY,align:'center',lineSpacingMultiple:1.25});
  const stufen=[['5',''],['6',''],['7',''],['8',''],['9','']];
  stufen.forEach(([n],i)=>{const w=1.18,x=0.55+i*(w+0.13),y=5.15,h=1.35;card(s,x,y,w,h);circ(s,T,n,x+w/2-0.3,y+0.15,0.6,i===4?OD:YL,i===4?W:INK);
    T('Schulstufe',x,y+0.8,w,0.25,{fontSize:9,color:GRAY,align:'center'});T('10 Blätter',x,y+1.02,w,0.28,{fontSize:11,bold:true,color:INK,align:'center'});});
  const pts=[['4 Levels','von leicht bis knifflig'],['Mit Lösungen','alles zum Selbstkontrollieren'],['Zum Ausdrucken','A4, druckfreundlich']];
  pts.forEach(([a,b],i)=>{const y=6.95+i*1.2;card(s,0.7,y,6.1,1.0,CHIP,LINE);s.addShape(S.ellipse,{x:0.95,y:y+0.27,w:0.46,h:0.46,fill:{color:OD},line:{color:OD,width:0}});T('✓',0.95,y+0.27,0.46,0.46,{fontSize:16,bold:true,color:W,align:'center',valign:'middle'});
    T([{text:a,options:{bold:true,color:INK,breakLine:true,fontSize:18}},{text:b,options:{color:GRAY,fontSize:13}}],1.65,y,4.9,1.0,{valign:'middle'});});
  T('Für Lehrkräfte, Eltern und alle, die gern knobeln.',0.9,10.65,5.7,0.7,{fontSize:15,color:GRAY,align:'center'});}
// ---- Frame 3: CTA ----
{const {s,T}=frame();dots(s,2);
  T('Auflösung: die fehlende Zahl ist 8.',0.7,1.85,6.1,0.5,{fontSize:15,color:GRAY,align:'center'});
  wordmark(T,2.5,34);
  T([{text:'Hol dir das ',options:{color:INK,breakLine:true}},{text:'Logik-Heft',options:{color:OD,highlight:YL,breakLine:true}},{text:'gratis!',options:{color:INK}}],0.5,3.3,6.5,3.0,{fontSize:54,align:'center',lineSpacingMultiple:1.0});
  // Heftmockup
  const bx=2.35,by=6.5,bw=2.8,bh=3.2;
  s.addShape(S.roundRect,{x:bx+0.12,y:by+0.12,w:bw,h:bh,rectRadius:0.12,fill:{color:LINE},line:{color:LINE,width:0}});
  s.addShape(S.roundRect,{x:bx,y:by,w:bw,h:bh,rectRadius:0.12,fill:{color:BG},line:{color:INK,width:2}});
  path(s,[{x:bx,y:by,moveTo:true},{x:bx+bw,y:by},{x:bx+bw,y:by+0.35},{x:bx,y:by+0.3,curve:{x1:bx+bw*0.7,y1:by+0.8,x2:bx+bw*0.3,y2:by+0.7}},{close:true}],OD);
  path(s,[{x:bx,y:by+bh,moveTo:true},{x:bx+bw,y:by+bh},{x:bx+bw,y:by+bh-0.3},{x:bx,y:by+bh-0.3,curve:{x1:bx+bw*0.6,y1:by+bh-0.8,x2:bx+bw*0.25,y2:by+bh-0.7}},{close:true}],Y);
  T([{text:'logo',options:{color:Y}},{text:'prima+',options:{color:OD}}],bx,by+0.85,bw,0.55,{fontSize:22,bold:true,align:'center',valign:'middle'});
  T('Arbeitsblätter',bx,by+1.4,bw,0.4,{fontSize:15,bold:true,color:OD,align:'center'});
  T('50 Blätter · Schulstufe 5–9',bx,by+1.85,bw,0.3,{fontSize:9,color:GRAY,align:'center'});
  T('Gratis-Download: Link unten antippen',0.7,10.0,6.1,0.5,{fontSize:15,bold:true,color:INK,align:'center'});
  s.addShape(S.downArrow,{x:3.4,y:10.55,w:0.7,h:0.55,fill:{color:OD},line:{color:OD,width:0}});}
const OUT='/home/user/claudecloud/videoslides/logoprima-instagram-story.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
