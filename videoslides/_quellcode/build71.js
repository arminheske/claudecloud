const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const BG='FFF7EA',INK='2D1B0E',Y='E8B53A',OD='C2571A',O='DA702F',CHIP='FCE9C4',LINE='EBC58A',GRAY='7A6A5A',W='FFFFFF',YL='F6DF8C';
const FONT='Poppins';
const THEME={name:'logoprima',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:W,dk2:OD,lt2:BG,accent1:Y,accent2:OD,accent3:CHIP,accent4:GRAY,accent5:O,accent6:LINE,hlink:OD,folHlink:GRAY}};
const pres=new pptxgen();pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='logoprima+ Arbeitsblätter – Cover, 4 Verfeinerungen';pres.author='Cleverbox';
const S=pres.ShapeType;const Wd=8.27,H=11.69;
const DIR='/home/user/claudecloud/videoslides/logoprima-elemente-bilder/';
const IM={1:['01-wuerfelnetz',557,714],2:['02-zahlenpyramide',955,624],3:['03-mustereihe',1659,324],4:['04-waage',1329,744],5:['05-zahlenstrahl',1768,523],6:['06-spielwuerfel',1293,340],7:['07-labyrinth',739,738],8:['08-symmetrie',739,850],9:['09-zahlenkreis',781,864],10:['10-mini-sudoku',717,718],11:['11-rechenkette',1599,340],12:['12-zahlenschloss',865,910],13:['13-zahlenfeld',807,808],14:['14-wuerfelturm',579,796],15:['15-domino',1525,310],16:['16-wuerfelplan',705,706]};
function ctx(){const s=pres.addSlide();s.background={color:BG};
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:16,color:INK,margin:0,valign:'top',isTextBox:true},o));
  // Elemente: w ODER h angeben, (x,y)=Mitte
  const img=(n,cx,cy,w,h,tr)=>{const [f,pw,ph]=IM[n];let ww=w,hh=h;if(w&&!h)hh=w*ph/pw;if(h&&!w)ww=h*pw/ph;s.addImage({path:DIR+f+'.png',x:cx-ww/2,y:cy-hh/2,w:ww,h:hh,transparency:tr||0});};
  const path=(pts,fill)=>{const pp=pts.filter(p=>p.x!==undefined);const xs=pp.map(p=>p.x).concat(pts.filter(p=>p.curve).flatMap(p=>[p.curve.x1,p.curve.x2])),ys=pp.map(p=>p.y).concat(pts.filter(p=>p.curve).flatMap(p=>[p.curve.y1,p.curve.y2]));const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
    s.addShape(S.custGeom,{x:x0,y:y0,w,h,fill:{color:fill},line:{color:fill,width:0},points:pts.map(p=>{const q=Object.assign({},p);if(p.x!==undefined){q.x=p.x-x0;q.y=p.y-y0;}if(p.curve){q.curve={type:'cubic',x1:p.curve.x1-x0,y1:p.curve.y1-y0,x2:p.curve.x2-x0,y2:p.curve.y2-y0};}return q;})});};
  // Wellenbänder (oben/unten), s = Höhenfaktor
  const waves=(k=1,ok=true)=>{
    // oben: orange Fläche, gelb links darüber
    path([{x:0,y:0,moveTo:true},{x:Wd,y:0},{x:Wd,y:1.05*k},{x:0,y:0.95*k,curve:{x1:Wd*0.72,y1:2.45*k,x2:Wd*0.3,y2:2.0*k}},{close:true}],OD);
    path([{x:0,y:0,moveTo:true},{x:Wd*0.78,y:0},{x:0,y:0.9*k,curve:{x1:Wd*0.62,y1:0.7*k,x2:Wd*0.3,y2:1.0*k}},{close:true}],Y);
    // unten: gespiegelt
    const b=H;
    path([{x:0,y:b,moveTo:true},{x:Wd,y:b},{x:Wd,y:b-1.5*k},{x:0,y:b-1.2*k,curve:{x1:Wd*0.6,y1:b-2.3*k,x2:Wd*0.25,y2:b-2.2*k}},{close:true}],OD);
    const kb=0.8;path([{x:Wd,y:b-1.2*k,moveTo:true},{x:Wd,y:b-3.0*kb},{x:0,y:b-1.2*k,curve:{x1:Wd*0.75,y1:b-3.35*kb,x2:Wd*0.3,y2:b-3.2*kb}},{x:0,y:b-1.2*k},{close:true}],Y);};
  const foot=()=>{s.addShape(S.roundRect,{x:0.45,y:H-1.1,w:2.55,h:0.78,rectRadius:0.2,fill:{color:W},line:{color:W,width:0}});
    s.addImage({path:__dirname+'/cleverbox-logo.png',x:0.6,y:H-1.0,w:2.25,h:2.25*0.3709,altText:'cleverbox'});
    s.addShape(S.roundRect,{x:Wd-3.05,y:H-1.1,w:2.6,h:0.78,rectRadius:0.2,fill:{color:W},line:{color:W,width:0}});
    T('www.cleverbox.co.at',Wd-3.0,H-1.1,1.7,0.78,{fontSize:10,bold:true,color:OD,align:'center',valign:'middle'});
    s.addImage({path:__dirname+'/qr.png',x:Wd-1.2,y:H-1.04,w:0.66,h:0.66,altText:'QR'});};
  return {s,T,img,path,waves,foot};}
const SUB='Knobeln, kombinieren und logisch denken:\n50 Arbeitsblätter für die 5. bis 9. Schulstufe.';
const title=(T,y,c1,c2,sz=66)=>{T([{text:'logoprima+',options:{color:c1,breakLine:true}},{text:'Arbeitsblätter',options:{color:c2}}],0.6,y,7.2,2.2,{fontSize:sz,lineSpacingMultiple:0.95,bold:false});};
// V1: aufgeräumt, Elemente farbig in der Mitte
(()=>{const {s,T,img,waves,foot}=ctx();waves(1);
  title(T,2.35,Y,OD);T(SUB,0.65,4.65,6.8,0.9,{fontSize:15,color:GRAY,lineSpacingMultiple:1.3});
  s.addShape(S.roundRect,{x:0.6,y:5.9,w:7.07,h:3.1,rectRadius:0.2,fill:{color:W},line:{color:LINE,width:1.25}});
  img(13,1.95,7.45,null,2.3);img(14,4.1,7.45,null,2.55);img(4,6.45,7.3,3.0);
  foot();})();
// V2: Schulstufen-Treppe, Titel dunkler
(()=>{const {s,T,waves,foot}=ctx();waves(1);
  title(T,2.35,OD,INK,62);T(SUB,0.65,4.65,6.8,0.9,{fontSize:15,color:GRAY,lineSpacingMultiple:1.3});
  const nb=5,bw=1.15,gap=0.15,x0=0.6+(7.07-(5*bw+4*gap))/2,base=8.8;
  for(let i=0;i<nb;i++){const h=1.3+i*0.6,x=x0+i*(bw+gap);
    s.addShape(S.roundRect,{x,y:base-h,w:bw,h,rectRadius:0.1,fill:{color:i%2?Y:YL},line:{color:INK,width:1.5}});
    s.addShape(S.ellipse,{x:x+bw/2-0.28,y:base-h+0.13,w:0.56,h:0.56,fill:{color:W},line:{color:INK,width:1.25}});
    T(String(5+i),x+bw/2-0.28,base-h+0.13,0.56,0.56,{fontSize:19,bold:true,color:INK,align:'center',valign:'middle'});
    T('10 Blätter',x,base-0.45,bw,0.3,{fontSize:10,bold:true,color:INK,align:'center'});}
  T('Schulstufe',0.6,base+0.08,7.07,0.3,{fontSize:11,bold:true,color:GRAY,align:'center'});
  foot();})();
// V3: Collage aus sechs Karten
(()=>{const {s,T,img,waves,foot}=ctx();waves(0.9);
  title(T,2.2,OD,Y,60);T(SUB,0.65,4.45,6.8,0.9,{fontSize:15,color:GRAY,lineSpacingMultiple:1.3});
  const cw=2.2,ch=1.7,gx=(7.07-3*cw)/2,x0=0.6,y0=5.65;
  const L=[[16,1.35],[2,1.9],[10,1.35],[12,1.35],[9,1.4],[7,1.35]];
  L.forEach(([n,h],i)=>{const x=x0+(i%3)*(cw+gx),y=y0+Math.floor(i/3)*(ch+0.2);
    s.addShape(S.roundRect,{x,y,w:cw,h:ch,rectRadius:0.15,fill:{color:W},line:{color:LINE,width:1.25}});
    const [,pw,ph]=IM[n];const ww=Math.min(1.9,h*pw/ph);img(n,x+cw/2,y+ch/2,ww,null);});
  foot();})();
// V4: Poster mit großem Badge und Würfelturm
(()=>{const {s,T,img,waves,foot}=ctx();waves(1);
  img(13,6.7,6.9,null,3.0,70);
  title(T,2.35,Y,OD,66);T(SUB,0.65,4.65,6.8,0.9,{fontSize:15,color:GRAY,lineSpacingMultiple:1.3});
  s.addShape(S.ellipse,{x:0.75,y:5.85,w:2.6,h:2.6,fill:{color:OD},line:{color:OD,width:0}});
  T('50',0.75,6.15,2.6,1.35,{fontSize:72,bold:true,color:W,align:'center',valign:'middle'});
  T('Arbeitsblätter',0.75,7.45,2.6,0.4,{fontSize:15,bold:true,color:W,align:'center'});
  T('5. bis 9. Schulstufe',0.75,7.8,2.6,0.35,{fontSize:11,color:'FFE9C4',align:'center'});
  img(14,5.7,7.2,null,3.3);
  ['Anfänger','Fortgeschrittene','Profis'].forEach((t,i)=>{const w=[1.45,2.0,1.2][i],x=3.75+[0,1.6,3.2][i]-0;/* gestaffelt unten */});
  foot();})();
const OUT='/home/user/claudecloud/videoslides/logoprima-heft-cover-verfeinerung-a4.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
