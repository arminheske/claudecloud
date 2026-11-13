const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const BG='58529E',CY='4FC3F7',MID='5991CD',DK='284798',BX='4A54A1',LT='8F7EBA',W='FFFFFF',YE='F5A623',RD='E2231A',GR='8BC34A',INK='1D2A6B';
const FONT='Poppins';
const THEME={name:'Cleverbox Farbprofil',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:W,dk2:DK,lt2:'ECEEF8',accent1:CY,accent2:'475BA6',accent3:LT,accent4:BX,accent5:YE,accent6:GR,hlink:CY,folHlink:LT}};
const pres=new pptxgen();pres.defineLayout({name:'HL',width:7.5,height:13.333});pres.layout='HL';
pres.title='Cleverbox Highlight-Cover';pres.author='Cleverbox';
const S=pres.ShapeType;const CX=3.75,CYc=6.667;
const mix=(a,b,t)=>{const p=h=>[0,2,4].map(i=>parseInt(h.substr(i,2),16));const A=p(a),B=p(b);return A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('').toUpperCase();};
function cover(name,draw){const s=pres.addSlide();s.background={color:BG};s.addNotes(name);
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:20,color:W,margin:0,valign:'middle',align:'center',isTextBox:true,bold:true},o));
  const el=(x,y,w,h,fill,lw=0,lc=W)=>s.addShape(S.ellipse,{x,y,w,h,fill:{color:fill},line:{color:lw?lc:fill,width:lw}});
  const rr=(x,y,w,h,fill,rad=0.12,lw=0,lc=W)=>s.addShape(S.roundRect,{x,y,w,h,rectRadius:rad,fill:{color:fill},line:{color:lw?lc:fill,width:lw}});
  // Glow: konzentrische Kreise von Rand (BG) bis Mitte (CY)
  const R=3.1,N=16;for(let i=0;i<N;i++){const t=i/(N-1),r=R*(1-t*0.82);const col=t<0.22?mix(BG,MID,t/0.22):mix(MID,CY,(t-0.22)/0.78);el(CX-r,CYc-r,2*r,2*r,col);}
  draw({s,T,el,rr});return s;}
// 1 Start (Box)
{const s=pres.addSlide();s.background={color:BG};s.addNotes('Start');s.addImage({path:__dirname+'/box.png',x:0,y:CYc-3.75,w:7.5,h:7.5*827/826});}
// 2 Mathe
cover('Mathe',({T,rr})=>{const ts=1.5,g=0.18,x0=CX-ts-g/2,y0=CYc-ts-g/2;
  [['+',W,INK],['−',YE,INK],['×',YE,INK],['÷',W,INK]].forEach(([t,f,c],i)=>{const x=x0+(i%2)*(ts+g),y=y0+Math.floor(i/2)*(ts+g);rr(x,y,ts,ts,f,0.25);T(t,x,y,ts,ts,{fontSize:70,color:c});});});
// 3 Logik
cover('Logik',({T,rr})=>{const ts=1.0,g=0.14,x0=CX-1.5*ts-g,y0=CYc-1.5*ts-g;
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){const q=(r===2&&c===2),x=x0+c*(ts+g),y=y0+r*(ts+g);rr(x,y,ts,ts,q?YE:W,0.18);T(q?'?':['2','7','6','9','5','1','4','3'][r*3+c],x,y,ts,ts,{fontSize:q?48:42,color:q?W:INK});}});
// 4 Excel
cover('Excel',({s,T,rr})=>{const cw=0.95,ch=0.72,x0=CX-2*cw,y0=CYc-2.5*ch;
  rr(x0-0.15,y0-0.15,4*cw+0.3,5*ch+0.3,DK,0.2);
  for(let r=0;r<5;r++)for(let c=0;c<4;c++){const hd=r===0,hit=(r===2&&c===2);
    s.addShape(S.rect,{x:x0+c*cw,y:y0+r*ch,w:cw,h:ch,fill:{color:hd?CY:(hit?YE:W)},line:{color:DK,width:1.5}});
    if(hd)T(['A','B','C','D'][c],x0+c*cw,y0,cw,ch,{fontSize:20,color:INK});}});
// 5 Programmieren
cover('Programmieren',({s,T,rr})=>{rr(CX-2.2,CYc-1.55,4.4,3.1,DK,0.3);
  [0,1,2].forEach(i=>s.addShape(S.ellipse,{x:CX-1.95+i*0.3,y:CYc-1.32,w:0.2,h:0.2,fill:{color:[RD,YE,GR][i]},line:{color:[RD,YE,GR][i],width:0}}));
  T('</>',CX-2.2,CYc-0.9,4.4,2.1,{fontSize:84,color:W,fontFace:'Courier New'});});
// 6 BWL
cover('Betriebswirtschaft',({s,T,rr,el})=>{const bw=0.9,g=0.25,base=CYc+1.7,x0=CX-1.5*bw-g;
  [1.2,2.0,2.9].forEach((h,i)=>rr(x0+i*(bw+g),base-h,bw,h,i===2?YE:W,0.1));
  s.addShape(S.line,{x:x0-0.2,y:base,w:3*bw+2*g+0.4,h:0,line:{color:W,width:4}});
  el(CX+0.9,CYc-2.35,1.15,1.15,YE,3,W);T('€',CX+0.9,CYc-2.35,1.15,1.15,{fontSize:40,color:INK});});
// 7 Lingobox
cover('Lingobox',({s,T,rr})=>{rr(CX-2.2,CYc-1.9,2.9,1.6,W,0.3);s.addShape(S.triangle,{x:CX-1.7,y:CYc-0.35,w:0.5,h:0.45,flipV:true,fill:{color:W},line:{color:W,width:0}});T('Hello',CX-2.2,CYc-1.9,2.9,1.6,{fontSize:30,color:INK});
  rr(CX-0.7,CYc+0.2,2.9,1.6,YE,0.3);s.addShape(S.triangle,{x:CX+1.4,y:CYc+1.75,w:0.5,h:0.45,flipV:true,fill:{color:YE},line:{color:YE,width:0}});T('Hallo',CX-0.7,CYc+0.2,2.9,1.6,{fontSize:30,color:INK});});
// 8 Material
cover('Unterrichtsmaterial',({s,T,rr,el})=>{rr(CX-1.35,CYc-1.9,2.7,3.5,LT,0.12);rr(CX-1.55,CYc-1.75,2.7,3.5,W,0.12);
  [0,1,2,3].forEach(i=>rr(CX-1.2,CYc-1.4+i*0.5,i===3?1.2:2.0,0.2,i===0?CY:LT,0.08));
  el(CX+0.55,CYc+0.9,1.2,1.2,GR,3,W);T('✓',CX+0.55,CYc+0.9,1.2,1.2,{fontSize:42,color:W});});
const OUT='/home/user/claudecloud/videoslides/cleverbox-highlight-cover.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
