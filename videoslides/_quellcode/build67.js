const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const BG='FFF7EA',CARD='FFFFFF',INK='2D1B0E',Y='E8C947',O='DA702F',TAN='DC933F',BROWN='8B4A1C',GRAY='7A6A5A',LINE='F0D9B5',CHIP='FCE9C4',GRN='6DBE4B',BLU='5688D2',RED='8B2017';
const FONT='Poppins';
const THEME={name:'logoprima',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:BROWN,lt2:BG,accent1:Y,accent2:O,accent3:CHIP,accent4:GRAY,accent5:GRN,accent6:BLU,hlink:O,folHlink:GRAY}};
const pres=new pptxgen();pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='logoprima+ Logikheft – Cover';pres.author='Cleverbox';
const S=pres.ShapeType;
const s=pres.addSlide();s.background={color:BG};
const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:16,color:INK,margin:0,valign:'top',isTextBox:true},o));
const mix=(a,b,t)=>{const p=h=>[0,2,4].map(i=>parseInt(h.substr(i,2),16));const A=p(a),B=p(b);return A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('').toUpperCase();};
// dekorative Kreise
s.addShape(S.ellipse,{x:5.6,y:-1.3,w:4.6,h:4.6,fill:{color:CHIP},line:{color:CHIP,width:0}});
s.addShape(S.ellipse,{x:-1.2,y:9.6,w:3.4,h:3.4,fill:{color:CHIP},line:{color:CHIP,width:0}});
// Kopf
s.addImage({path:__dirname+'/cleverbox-logo.png',x:0.6,y:0.5,w:2.3,h:2.3*0.3709,altText:'cleverbox'});
s.addShape(S.roundRect,{x:5.35,y:0.62,w:2.32,h:0.42,rectRadius:0.1,fill:{color:INK},line:{color:INK,width:0}});
T('Übungsheft · Mathematik',5.35,0.62,2.32,0.42,{fontSize:11,bold:true,color:Y,align:'center',valign:'middle'});
// Titel
T([{text:'logo',options:{color:Y}},{text:'prima+',options:{color:O}}],0.6,1.95,7.1,1.35,{fontSize:78,bold:true,valign:'middle'});
T('das denksportcenter',0.65,3.25,7,0.5,{fontSize:20,color:GRAY});
T([{text:'Das ',options:{color:INK}},{text:'Logik-Heft',options:{color:INK,highlight:Y}}],0.6,4.05,7.1,0.9,{fontSize:38});
T('Knobeln, kombinieren und logisch denken: 50 Arbeitsblätter für die 5. bis 9. Schulstufe.',0.6,4.95,5.6,0.9,{fontSize:15,color:GRAY,lineSpacingMultiple:1.25});
// Würfel (isometrisch)
function cube(cx,cy,u,c){ // cx,cy = Mitte der Oberseite; u = Kantenlänge
  const dx=u*0.866,dy=u*0.5;
  const poly=(pts,fill)=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
    s.addShape(pres.ShapeType.custGeom,{x:x0,y:y0,w,h,fill:{color:fill},line:{color:INK,width:1},points:pts.map((p,i)=>i===0?{x:p[0]-x0,y:p[1]-y0,moveTo:true}:{x:p[0]-x0,y:p[1]-y0}).concat([{close:true}])});};
  poly([[cx,cy-dy],[cx+dx,cy],[cx,cy+dy],[cx-dx,cy]],mix(c,'FFFFFF',0.45));
  poly([[cx-dx,cy],[cx,cy+dy],[cx,cy+dy+u],[cx-dx,cy+u]],c);
  poly([[cx+dx,cy],[cx,cy+dy],[cx,cy+dy+u],[cx+dx,cy+u]],mix(c,'000000',0.22));
}
const u=0.62,dx=u*0.866,dy=u*0.5;
// Würfelgruppe links unten (Bauwerk aus 6 Würfeln)
const bx=2.15,by=8.0;
[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1]].forEach(([i,j,k])=>{ // i nach rechts-unten, j nach links-unten, k nach oben
  const cx=bx+(i-j)*dx,cy=by+(i+j)*dy-k*u;cube(cx,cy,u,GRN);});
cube(bx,by-2*u,u,BLU);cube(bx-dx*2.3,by+0.1,u,Y);
// Treppen-Balken rechts: 5 Schulstufen
const nb=5,bw=0.62,gap=0.1,bx0=4.07,base=9.35;
for(let i=0;i<nb;i++){const h=1.55+i*0.55,x=bx0+i*(bw+gap),col=mix(Y,O,i/(nb-1));
  s.addShape(S.roundRect,{x,y:base-h,w:bw,h,rectRadius:0.08,fill:{color:col},line:{color:col,width:0}});
  s.addShape(S.ellipse,{x:x+0.06,y:base-h+0.14,w:0.5,h:0.5,fill:{color:CARD},line:{color:CARD,width:0}});
  T(String(5+i),x+0.06,base-h+0.14,0.5,0.5,{fontSize:17,bold:true,color:i<2?BROWN:O,align:'center',valign:'middle'});
  T('10',x,base-0.62,bw,0.4,{fontSize:15,bold:true,color:i<2?BROWN:'FFFFFF',align:'center',valign:'middle'});
  T('Blätter',x,base-0.3,bw,0.25,{fontSize:8,color:i<2?BROWN:'FFFFFF',align:'center',valign:'middle'});}
T('Schulstufe',bx0,base+0.1,5*(bw+gap),0.35,{fontSize:12,bold:true,color:GRAY,align:'center'});
// Chips
['Anfänger','Fortgeschrittene','Profis'].forEach((t,i)=>{const w=[1.45,2.0,1.2][i],x=0.6+[0,1.6,3.75][i];
  s.addShape(S.roundRect,{x,y:10.0,w,h:0.46,rectRadius:0.12,fill:{color:i===2?O:(i===1?TAN:Y)},line:{color:INK,width:1}});
  T(t,x,10.0,w,0.46,{fontSize:12,bold:true,color:INK,align:'center',valign:'middle'});});
// Fuß
s.addShape(S.line,{x:0.6,y:10.75,w:7.07,h:0,line:{color:LINE,width:1.25}});
T('Cleverbox · Mathematik',0.6,10.95,4,0.3,{fontSize:11,color:GRAY});
T('www.cleverbox.co.at',0.6,11.22,4,0.3,{fontSize:11,bold:true,color:BROWN});
s.addImage({path:__dirname+'/qr.png',x:6.82,y:10.9,w:0.85,h:0.85,altText:'QR-Code zu www.cleverbox.co.at'});
const OUT='/home/user/claudecloud/videoslides/logoprima-heft-cover-a4.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
