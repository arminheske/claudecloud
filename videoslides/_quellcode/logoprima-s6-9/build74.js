const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const fs=require('fs');
const SS=parseInt(process.argv[2]||'5');const SHF=process.argv[3]||(__dirname+'/s5/sheets.json');const OUTF=process.argv[4]||'/home/user/claudecloud/videoslides/logoprima-schulstufe5.pptx';
const MODE=process.argv[5]||'build';
const SH=MODE==='measure'?[]:JSON.parse(fs.readFileSync(SHF,'utf8'));
const BG='FFFFFF',INK='2D1B0E',GREEN='C2571A',NEON='F6DF8C',DEEP='3A2616',GRAY='7A6A5A',LINE='EBC58A',CHIP='FCE9C4',W='FFFFFF';
const FONT='Poppins';
const THEME={name:'logoprima',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:W,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'DA702F',accent6:LINE,hlink:GREEN,folHlink:GRAY}};
const pres=new pptxgen();pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='logoprima+ Schulstufe 5';pres.author='Cleverbox';
const S=pres.ShapeType;const Wd=8.27,H=11.69,X0=0.6,CW=7.07;
const IMGDIR=__dirname+(SS===5?'/s5/':'/ss/');
function base(bg){const s=pres.addSlide();s.background={color:bg||W};
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:12,color:INK,margin:0,valign:'top',isTextBox:true},o));
  return {s,T};}
function path(s,pts,fill){const pp=pts.filter(p=>p.x!==undefined);const xs=pp.map(p=>p.x).concat(pts.filter(p=>p.curve).flatMap(p=>[p.curve.x1,p.curve.x2])),ys=pp.map(p=>p.y).concat(pts.filter(p=>p.curve).flatMap(p=>[p.curve.y1,p.curve.y2]));
  const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
  s.addShape(S.custGeom,{x:x0,y:y0,w,h,fill:{color:fill},line:{color:fill,width:0},points:pts.map(p=>{const q=Object.assign({},p);if(p.x!==undefined){q.x=p.x-x0;q.y=p.y-y0;}if(p.curve)q.curve={type:'cubic',x1:p.curve.x1-x0,y1:p.curve.y1-y0,x2:p.curve.x2-x0,y2:p.curve.y2-y0};return q;})});}
const LOGO_R=0.3709;
function hdr(s,T){
  s.addImage({path:__dirname+'/cleverbox-logo.png',x:X0,y:0.22,w:2.55,h:2.55*LOGO_R,altText:'cleverbox – modern. kostenlos. lehrreich.'});
  s.addImage({path:__dirname+'/qr.png',x:X0+CW-0.95,y:0.25,w:0.95,h:0.95,altText:'QR-Code zu www.cleverbox.co.at'});
  T('Mehr Material:\nwww.cleverbox.co.at',X0+CW-3.55,0.3,2.5,0.85,{fontSize:10,color:GRAY,align:'right',valign:'middle',lineSpacingMultiple:1.2});
  s.addShape(S.line,{x:X0,y:1.3,w:CW,h:0,line:{color:LINE,width:1.25}});}
function headline(T,kick,segs,y=1.42){
  T(kick,X0,y,5.5,0.3,{fontSize:14,bold:true,color:GREEN,valign:'middle'});
  T(segs.map(([t,a])=>({text:t,options:{color:a?GREEN:INK,highlight:a?NEON:undefined}})),X0,y+0.34,5.0,0.55,{fontSize:24,valign:'middle'});}
function footer(T,txt){T(txt,X0,11.3,6,0.3,{fontSize:11,color:GRAY});}
function circleNum(s,T,num,x,y,d,fill,color){s.addShape(S.ellipse,{x,y,w:d,h:d,fill:{color:fill},line:{color:fill,width:0}});T(String(num),x,y,d,d,{fontSize:d>0.55?20:15,bold:true,color,align:'center',valign:'middle'});}
// ---------- Textmaß ----------
function isOpt(p){return p.length<=70;}
function splitParas(t){ // Fragezeile + Optionen
  const P=t.paras;let q=-1;
  for(let i=P.length-2;i>=0;i--){if(/[?:]$/.test(P[i])){q=i;break;}}
  const opt=new Set();
  if(q>=0){for(let j=q+1;j<P.length;j++){if(isOpt(P[j])&&!/[?]$/.test(P[j]))opt.add(j);else{break;}}
    if(opt.size<2)opt.clear();}
  if(opt.size){const nz=x=>x.toLowerCase().replace(/\s+/g,'').replace(/[·•*]/g,'*');const a=nz(t.ans||'');
    const hit=[...opt].some(j=>{const p=nz(t.paras[j]);return p===a||(a.length>3&&(p.includes(a)||a.includes(p)));});
    if(!hit)opt.clear();}
  return opt;}
function layoutTask(t,fs){fs=fs||9.5;const CPI=1/(0.0074*fs),LH=fs*0.0187;
  const figs=t.img.filter(i=>i.w>=2.5),pics=t.img.filter(i=>i.w<2.5);
  const fig=figs[0]||null,pic=pics[0]||null;
  const imgW=fig?Math.min(2.25,fig.w):(pic?Math.min(1.15,pic.w*0.83):0);
  const imgH=fig?imgW*fig.h/fig.w:(pic?imgW*pic.h/pic.w:0);
  const tw=CW-0.5-(imgW?imgW+0.25:0);
  const opt=splitParas(t);
  const pre=t.paras.map((p,i)=>[p,i]).filter(([p,i])=>!opt.has(i));
  const opts=t.paras.filter((p,i)=>opt.has(i));
  let preLines=0;pre.forEach(([p])=>{preLines+=Math.max(1,Math.ceil(p.length/(tw*CPI)));});
  const preH=preLines*LH+pre.length*0.035;
  // Optionen: 2 Spalten, wenn kurz
  const twoCol=opts.length>=4&&Math.max(...opts.map(o=>o.length))<=Math.floor((tw/2-0.3)*CPI);
  const ow=twoCol?tw/2:tw;
  const optLines=opts.map(o=>Math.max(1,Math.ceil(o.length/((ow-0.3)*CPI))));
  let optH=0;
  if(opts.length){if(twoCol){const rows=Math.ceil(opts.length/2);optH=rows*(LH*1.25);}else optH=optLines.reduce((a,b)=>a+b,0)*LH+opts.length*0.045;optH+=0.04;}
  const bodyH=preH+optH;
  const textBlock=0.44+bodyH;
  const h=Math.max(textBlock+(opts.length?0.18:0.4),imgH+0.3);
  return {fig,pic,imgW,imgH,tw,opt,pre,opts,twoCol,ow,optLines,LH,preH,bodyH,h};}
// ---------- Arbeitsblatt ----------
function levelBadge(s,T,lv,x,y){
  s.addShape(S.roundRect,{x,y,w:2.35,h:0.62,rectRadius:0.14,fill:{color:CHIP},line:{color:LINE,width:1.25}});
  T('Level '+lv,x+0.18,y,1.2,0.62,{fontSize:13,bold:true,color:DEEP,valign:'middle'});
  for(let i=0;i<4;i++)s.addShape(S.ellipse,{x:x+1.4+i*0.22,y:y+0.17,w:0.17,h:0.22,fill:{color:i<lv?GREEN:W},line:{color:GREEN,width:1}});
  T('von 4',x+1.4,y+0.4,0.95,0.17,{fontSize:7,color:GRAY});}
function sheet(sh){
  const {s,T}=base(W);hdr(s,T);
  headline(T,'logoprima+ · Mathematik',[['Arbeitsblatt '+sh.n,true]]);
  levelBadge(s,T,sh.level,X0+CW-2.35,1.5);
  T('Name:',X0,2.42,0.8,0.3,{fontSize:11,bold:true,color:GRAY,valign:'middle'});s.addShape(S.line,{x:X0+0.8,y:2.68,w:3.0,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});
  T('Datum:',X0+4.1,2.42,0.9,0.3,{fontSize:11,bold:true,color:GRAY,valign:'middle'});s.addShape(S.line,{x:X0+5.0,y:2.68,w:2.07,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});
  const top=2.92,bottom=11.1,gap=0.13;
  let FS=11.5,L,natural,extra;
  do{L=sh.tasks.map(t=>layoutTask(t,FS));natural=L.reduce((a,l)=>a+l.h,0)+gap*3;extra=(bottom-top)-natural;if(extra>=0.0)break;FS-=0.25;}while(FS>8.5);
  
  console.log('SHEET '+JSON.stringify({n:sh.n,fs:FS,rest:+extra.toFixed(2),h:L.map(l=>+l.h.toFixed(2))}));
  const add=extra>0?extra/4:0;let y=top;
  sh.tasks.forEach((t,i)=>{const l=L[i],h=l.h+add;
    s.addShape(S.roundRect,{x:X0,y,w:CW,h,rectRadius:0.15,fill:{color:W},line:{color:LINE,width:1.25}});
    circleNum(s,T,i+1,X0+0.15,y+0.1,0.38,NEON,INK);
    T(t.title,X0+0.7,y+0.1,l.tw-0.3,0.38,{fontSize:Math.min(13,FS+2),bold:true,color:INK,valign:'middle'});
    const runs=l.pre.map(([p],j)=>({text:p,options:{breakLine:j<l.pre.length-1,paraSpaceAfter:2,color:INK}}));
    T(runs,X0+0.25,y+0.52,l.tw,l.preH+0.1,{fontSize:FS,lineSpacingMultiple:1.05});
    if(l.opts.length){let oy=y+0.52+l.preH+0.06;const lh=l.LH;
      l.opts.forEach((o,k)=>{let ox,yy;
        if(l.twoCol){const rows=Math.ceil(l.opts.length/2);const col=Math.floor(k/rows),row=k%rows;ox=X0+0.25+col*l.ow;yy=oy+row*lh*1.25;}
        else{ox=X0+0.25;yy=oy;oy+=l.optLines[k]*lh+0.045;}
        s.addShape(S.ellipse,{x:ox,y:yy+lh*0.3,w:0.1,h:0.1,fill:{color:W},line:{color:INK,width:0.75}});
        T(o,ox+0.2,yy,l.ow-0.25,lh*l.optLines[k]+0.02,{fontSize:FS,color:INK,lineSpacingMultiple:1.0});});}
    if(l.fig||l.pic)s.addImage({path:IMGDIR+(l.fig||l.pic).file,x:X0+CW-0.2-l.imgW,y:y+0.14,w:l.imgW,h:l.imgH});
    if(!l.opts.length){s.addShape(S.line,{x:X0+1.0,y:y+h-0.14,w:l.tw-0.2,h:0,line:{color:LINE,width:1.25,dashType:'sysDot'}});
    T('Antwort:',X0+0.25,y+h-0.3,0.75,0.26,{fontSize:9.5,bold:true,color:GRAY,valign:'middle'});}
    y+=h+gap;});
  footer(T,'Cleverbox · Mathematik · Arbeitsblatt');}
// ---------- Trennblatt ----------
function divider(){
  const {s,T}=base(W);hdr(s,T);
  headline(T,'logoprima+ · Mathematik',[['Schulstufe ',false],[String(SS),true]]);
  s.addShape(S.ellipse,{x:X0,y:3.1,w:2.9,h:2.9,fill:{color:NEON},line:{color:LINE,width:1.25}});
  T(String(SS),X0,3.1,2.9,2.9,{fontSize:120,bold:true,color:DEEP,align:'center',valign:'middle'});
  T('10 Arbeitsblätter in 4 Levels. Die Lösungen stehen am Ende der Schulstufe, nach Arbeitsblättern geordnet.',X0+3.2,3.9,3.85,1.6,{fontSize:14,color:GRAY,lineSpacingMultiple:1.3});
  const lv=[['Level 1','Arbeitsblatt 1 – 2'],['Level 2','Arbeitsblatt 3 – 5'],['Level 3','Arbeitsblatt 6 – 8'],['Level 4','Arbeitsblatt 9 – 10']];
  lv.forEach(([a,b],i)=>{const y=6.55+i*0.8;s.addShape(S.roundRect,{x:X0,y,w:CW,h:0.66,rectRadius:0.15,fill:{color:W},line:{color:LINE,width:1.25}});
    circleNum(s,T,i+1,X0+0.15,y+0.14,0.38,NEON,INK);
    T(a,X0+0.75,y,1.5,0.66,{fontSize:14,bold:true,color:INK,valign:'middle'});T(b,X0+2.3,y,2.7,0.66,{fontSize:12,color:GRAY,valign:'middle'});
    for(let k=0;k<4;k++)s.addShape(S.ellipse,{x:X0+CW-1.15+k*0.24,y:y+0.2,w:0.18,h:0.26,fill:{color:k<=i?GREEN:W},line:{color:GREEN,width:1}});});
  footer(T,'Cleverbox · Mathematik · logoprima+');}
// ---------- Lösungen ----------
function solutions(){
  let page=null,col=0,y=0;const colW=3.45,top=2.55,bottom=11.1;let pages=0;
  const newPage=()=>{const {s,T}=base(W);pages++;hdr(s,T);
    headline(T,'Lösungsblatt · Mathematik',[['Schulstufe '+SS+' – ',false],['Lösungen',true]]);
    footer(T,'Cleverbox · Mathematik · Lösungen'+(pages>1?' (Fortsetzung)':''));page={s,T};col=0;y=top;};
  newPage();
  SH.forEach(sh=>{
    const items=sh.tasks.map((t,i)=>({n:i+1,title:t.title,ans:t.ans}));
    const cpl=45;
    const nl=items.map(it=>Math.max(1,Math.ceil((it.n+'  '+it.title+': '+it.ans).length/cpl)));
    const h=0.55+nl.reduce((a,b)=>a+b,0)*0.19+0.12;
    if(y+h>bottom){if(col===0){col=1;y=top;}else newPage();}
    if(y+h>bottom)newPage();
    const x=X0+col*(colW+0.17);const {s,T}=page;
    s.addShape(S.roundRect,{x,y,w:colW,h,rectRadius:0.15,fill:{color:W},line:{color:LINE,width:1.25}});
    circleNum(s,T,sh.n,x+0.12,y+0.1,0.38,NEON,INK);
    T('Arbeitsblatt '+sh.n,x+0.62,y+0.1,1.8,0.38,{fontSize:11,bold:true,color:INK,valign:'middle'});
    s.addShape(S.roundRect,{x:x+colW-1.0,y:y+0.15,w:0.88,h:0.28,rectRadius:0.08,fill:{color:CHIP},line:{color:LINE,width:1}});
    T('Level '+sh.level,x+colW-1.0,y+0.15,0.88,0.28,{fontSize:9,bold:true,color:DEEP,align:'center',valign:'middle'});
    const runs=[];items.forEach((it,k)=>{runs.push({text:it.n+'  '+it.title+': ',options:{color:GRAY}});runs.push({text:it.ans,options:{bold:true,color:GREEN,breakLine:k<items.length-1}});});
    T(runs,x+0.15,y+0.58,colW-0.3,h-0.65,{fontSize:9.5,valign:'top',lineSpacingMultiple:1.0});
    y+=h+0.12;});
}
if(MODE==='measure'){const T=JSON.parse(fs.readFileSync(SHF,'utf8'));console.log('RESULT '+JSON.stringify(T.map(t=>+layoutTask(t,10).h.toFixed(2))));process.exit(0);}
divider();SH.forEach(sheet);solutions();
const OUT=OUTF;
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
