const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const BG='58529E',CY='4FC3F7';
const FONT='Poppins';
const THEME={name:'Cleverbox Lila Blau',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:BG,lt1:'FFFFFF',dk2:BG,lt2:CY,accent1:CY,accent2:BG,accent3:CY,accent4:BG,accent5:CY,accent6:BG,hlink:CY,folHlink:BG}};
const pres=new pptxgen();pres.defineLayout({name:'HL',width:7.5,height:13.333});pres.layout='HL';
pres.title='Cleverbox Highlight-Cover';pres.author='Cleverbox';
const S=pres.ShapeType;const CX=3.75,CYc=6.667;
function cover(name,draw){const s=pres.addSlide();s.background={color:BG};s.addNotes(name);
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:20,color:CY,margin:0,valign:'middle',align:'center',isTextBox:true,bold:true},o));
  const rr=(x,y,w,h,fill,rad=0.2)=>s.addShape(S.roundRect,{x,y,w,h,rectRadius:rad,fill:{color:fill},line:{color:fill,width:0}});
  const el=(x,y,w,h,fill)=>s.addShape(S.ellipse,{x,y,w,h,fill:{color:fill},line:{color:fill,width:0}});
  const rect=(x,y,w,h,fill)=>s.addShape(S.rect,{x,y,w,h,fill:{color:fill},line:{color:fill,width:0}});
  const poly=(pts,fill)=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
    s.addShape(S.custGeom,{x:x0,y:y0,w,h,fill:{color:fill},line:{color:fill,width:0},points:pts.map((p,i)=>i===0?{x:p[0]-x0,y:p[1]-y0,moveTo:true}:{x:p[0]-x0,y:p[1]-y0}).concat([{close:true}])});};
  draw({s,T,rr,el,rect,poly});}
// 1 Start: offene Box
cover('Start',({poly})=>{const w=2.0,d=1.15,u=2.2,cx=CX,cy=CYc-1.35;
  poly([[cx,cy-d],[cx+w,cy],[cx+w,cy+u],[cx,cy+u+d],[cx-w,cy+u],[cx-w,cy]],CY);
  poly([[cx,cy-d+0.35],[cx+w-0.55,cy],[cx,cy+d-0.35],[cx-w+0.55,cy]],BG);
  poly([[cx-0.07,cy+d],[cx+0.07,cy+d],[cx+0.07,cy+u+d],[cx-0.07,cy+u+d]],BG);});
// 2 Mathe: π
cover('Mathe',({T})=>T('π',CX-2.5,CYc-2.4,5,4.8,{fontSize:340}));
// 3 Logik: Quadrat mit ?
cover('Logik',({rr,T})=>{rr(CX-1.9,CYc-1.9,3.8,3.8,CY,0.5);T('?',CX-1.9,CYc-1.9,3.8,3.8,{fontSize:220,color:BG});});
// 4 Excel: Tabelle
cover('Excel',({rr,rect})=>{const x0=CX-2.0,y0=CYc-1.9,w=4.0,h=3.8;rr(x0,y0,w,h,CY,0.25);
  [1,2,3].forEach(i=>{rect(x0,y0+i*h/4-0.04,w,0.08,BG);});[1,2].forEach(i=>rect(x0+i*w/3-0.04,y0+0.0,0.08,h,BG));
});
// 5 Programmieren
cover('Programmieren',({T})=>T('</>',CX-3.1,CYc-1.5,6.2,3.0,{fontSize:190,fontFace:'Courier New'}));
// 6 BWL: Balken
cover('Betriebswirtschaft',({rr,rect})=>{const bw=1.0,g=0.3,base=CYc+1.9,x0=CX-1.5*bw-g;
  [1.5,2.6,3.8].forEach((h,i)=>rr(x0+i*(bw+g),base-h,bw,h,CY,0.12));rect(x0-0.3,base+0.1,3*bw+2*g+0.6,0.14,CY);});
// 7 Lingobox: Sprechblase
cover('Lingobox',({rr,T,s})=>{rr(CX-2.2,CYc-1.8,4.4,3.0,CY,0.6);s.addShape(S.triangle,{x:CX-1.4,y:CYc+1.1,w:0.9,h:0.8,flipV:true,fill:{color:CY},line:{color:CY,width:0}});
  T('Aa',CX-2.2,CYc-1.8,4.4,3.0,{fontSize:120,color:BG});});
// 8 Material: Blatt mit Haken
cover('Material',({rr,rect,s,T})=>{const x0=CX-1.6,y0=CYc-2.1,w=3.2,h=4.2;rr(x0,y0,w,h,CY,0.2);
  [0,1,2].forEach(i=>rr(x0+0.45,y0+0.7+i*0.62,i===2?1.5:2.3,0.2,BG,0.1));
  s.addShape(S.ellipse,{x:CX+0.5,y:CYc+0.55,w:1.7,h:1.7,fill:{color:BG},line:{color:CY,width:6}});T('✓',CX+0.5,CYc+0.55,1.7,1.7,{fontSize:70,color:CY});});
const OUT='/home/user/claudecloud/videoslides/cleverbox-highlight-cover.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
