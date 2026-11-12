const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
// 
// logoprima-Farben im Cleverbox-Stil
const BG='FFF7EA',CARD='FFFFFF',INK='2D1B0E',GREEN='C2571A',NEON='F6DF8C',DEEP='3A2616',GRAY='7A6A5A',LINE='EBC58A',CHIP='FCE9C4',MID='E9B63A',DEEP2='8B4A1C';
const FONT='Poppins';
const THEME={name:'logoprima',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:'DA702F',accent6:LINE,hlink:GREEN,folHlink:GRAY}};
const pres=new pptxgen();pres.defineLayout({name:'A4',width:8.27,height:11.69});pres.layout='A4';
pres.title='logoprima+ Logik-Heft – Cover (logoprima-Farben, Cleverbox-Stil)';pres.author='Cleverbox';
const S=pres.ShapeType;
const mix=(a,b,t)=>{const p=h=>[0,2,4].map(i=>parseInt(h.substr(i,2),16));const A=p(a),B=p(b);return A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('').toUpperCase();};
function mk(titleSegs,sub){
  const s=pres.addSlide();s.background={color:BG};
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:16,color:INK,margin:0,valign:'top',isTextBox:true},o));
  const card=(x,y,w,h,fill,line,lw)=>s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.15,fill:{color:fill||CARD},line:{color:line||LINE,width:lw||1.25}});
  const ln=(x1,y1,x2,y2,color,width,dash)=>s.addShape(S.line,{x:Math.min(x1,x2),y:Math.min(y1,y2),w:Math.abs(x2-x1),h:Math.abs(y2-y1),flipV:((x2-x1)*(y2-y1))<0,line:{color,width,dashType:dash||'solid'}});
  const poly=(pts,fill,lw=1.25,lc=DEEP)=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
    s.addShape(S.custGeom,{x:x0,y:y0,w,h,fill:{color:fill},line:{color:lc,width:lw},points:pts.map((p,i)=>i===0?{x:p[0]-x0,y:p[1]-y0,moveTo:true}:{x:p[0]-x0,y:p[1]-y0}).concat([{close:true}])});};
  const cube=(cx,cy,u,c)=>{const dx=u*0.866,dy=u*0.5;
    poly([[cx,cy-dy],[cx+dx,cy],[cx,cy+dy],[cx-dx,cy]],mix(c,'FFFFFF',0.5));
    poly([[cx-dx,cy],[cx,cy+dy],[cx,cy+dy+u],[cx-dx,cy+u]],c);
    poly([[cx+dx,cy],[cx,cy+dy],[cx,cy+dy+u],[cx+dx,cy+u]],mix(c,'000000',0.25));};
  // Kopf
  s.addImage({path:__dirname+'/cleverbox-logo.png',x:0.6,y:0.5,w:2.3,h:2.3*0.3709,altText:'cleverbox'});
  s.addShape(S.roundRect,{x:5.15,y:0.62,w:2.52,h:0.42,rectRadius:0.1,fill:{color:NEON},line:{color:NEON,width:0}});
  T('Übungsheft · Mathematik',5.15,0.62,2.52,0.42,{fontSize:11,bold:true,color:DEEP,align:'center',valign:'middle'});
  // Titelblock
  T('das denksportcenter',0.6,1.75,7,0.4,{fontSize:18,bold:true,color:GREEN});
  T(titleSegs.flatMap((line,li)=>line.map(([t,a],k)=>({text:t,options:{color:a?GREEN:INK,highlight:a?NEON:undefined,breakLine:k===line.length-1&&li<titleSegs.length-1}}))),0.6,2.2,7.07,1.85,{fontSize:54,lineSpacingMultiple:1.05});
  T(sub,0.6,4.15,6.2,0.7,{fontSize:15,color:GRAY,lineSpacingMultiple:1.25});
  // Schulstufen-Karten
  const y0=8.55;
  for(let i=0;i<5;i++){const x=0.6+i*1.43,w=1.29;card(x,y0,w,1.3);
    s.addShape(S.ellipse,{x:x+0.35,y:y0+0.14,w:0.6,h:0.6,fill:{color:i===4?GREEN:NEON},line:{color:i===4?GREEN:NEON,width:0}});
    T(String(5+i),x+0.35,y0+0.14,0.6,0.6,{fontSize:20,bold:true,color:i===4?'FFFFFF':DEEP,align:'center',valign:'middle'});
    T('Schulstufe',x,y0+0.78,w,0.22,{fontSize:9,color:GRAY,align:'center'});
    T('10 Blätter',x,y0+0.98,w,0.25,{fontSize:11,bold:true,color:INK,align:'center'});}
  // Chips
  [['Anfänger',1.5],['Fortgeschrittene',2.1],['Profis',1.2]].reduce((x,[t,w])=>{s.addShape(S.roundRect,{x,y:10.05,w,h:0.4,rectRadius:0.1,fill:{color:CHIP},line:{color:LINE,width:1.25}});T(t,x,10.05,w,0.4,{fontSize:11,bold:true,color:DEEP,align:'center',valign:'middle'});return x+w+0.15;},0.6);
  // Fuß
  s.addShape(S.line,{x:0.6,y:10.75,w:7.07,h:0,line:{color:LINE,width:1.25}});
  T('Cleverbox · Mathematik',0.6,10.95,4,0.3,{fontSize:11,color:GRAY});
  T('www.cleverbox.co.at',0.6,11.22,4,0.3,{fontSize:11,bold:true,color:GREEN});
  s.addImage({path:__dirname+'/qr.png',x:6.82,y:10.9,w:0.85,h:0.85,altText:'QR-Code zu www.cleverbox.co.at'});
  return {s,T,card,ln,poly,cube};}
const TS=[[['logoprima+',false]],[['Logik-Heft',true]]];
const SUB='Knobeln, kombinieren und logisch denken: 50 Arbeitsblätter für die 5. bis 9. Schulstufe.';
const HY=4.95,HH=3.4; // Hero-Karte
// 1 Würfel
(()=>{const {s,T,card,cube}=mk(TS,SUB);card(0.6,HY,7.07,HH);
  const u=0.6,dx=u*0.866,dy=u*0.5,bx=4.135,by=HY+1.7;
  [[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1]].forEach(([i,j,k])=>cube(bx+(i-j)*dx,by+(i+j)*dy-k*u,u,MID));
  cube(bx,by-2*u,u,GREEN);
  s.addShape(S.roundRect,{x:5.65,y:HY+0.4,w:1.7,h:0.55,rectRadius:0.1,fill:{color:NEON},line:{color:NEON,width:0}});T('Welcher Würfel fehlt?',5.65,HY+0.4,1.7,0.55,{fontSize:10,bold:true,color:DEEP,align:'center',valign:'middle'});})();
// 2 Zahlenrätsel
(()=>{const {s,T,card}=mk(TS,SUB);card(0.6,HY,7.07,HH);
  const g=[[2,7,6],[9,5,1],[4,3,null]],ts=0.8,gp=0.12,gx=4.135-(3*ts+2*gp)/2,gy=HY+0.2;
  g.forEach((row,r)=>row.forEach((v,c)=>{const x=gx+c*(ts+gp),y=gy+r*(ts+gp),q=v===null;
    s.addShape(S.roundRect,{x,y,w:ts,h:ts,rectRadius:0.12,fill:{color:q?GREEN:CHIP},line:{color:q?GREEN:LINE,width:1.25}});
    T(q?'?':String(v),x,y,ts,ts,{fontSize:34,bold:true,color:q?'FFFFFF':DEEP,align:'center',valign:'middle'});}));
  T('Welche Zahl fehlt?',0.6,HY+HH-0.36,7.07,0.35,{fontSize:12,bold:true,color:GREEN,align:'center'});})();
// 3 Tour
(()=>{const {s,T,card,ln}=mk([[['Die',false]],[['Logik-Tour',true]]],'Fünf Schulstufen, 50 Arbeitsblätter: Station für Station zum Denksport-Profi.');card(0.6,HY,7.07,HH);
  const P=[[1.5,HY+2.9],[3.2,HY+2.25],[2.0,HY+1.55],[4.5,HY+1.15],[6.4,HY+0.9]];
  for(let i=0;i<4;i++){ln(P[i][0],P[i][1],P[i+1][0],P[i+1][1],LINE,3,'dash');}
  P.forEach(([x,y],i)=>{const r=0.4;s.addShape(S.ellipse,{x:x-r,y:y-r,w:2*r,h:2*r,fill:{color:i===4?GREEN:NEON},line:{color:i===4?GREEN:LINE,width:1.25}});
    T(String(5+i),x-r,y-r,2*r,2*r,{fontSize:20,bold:true,color:i===4?'FFFFFF':DEEP,align:'center',valign:'middle'});});
  s.addShape(S.star5,{x:6.4-0.28,y:HY+0.9-0.95,w:0.56,h:0.56,fill:{color:NEON},line:{color:GREEN,width:1.5}});
  s.addShape(S.roundRect,{x:0.85,y:HY+0.3,w:1.7,h:0.42,rectRadius:0.1,fill:{color:DEEP},line:{color:DEEP,width:0}});T('Tour starten',0.85,HY+0.3,1.7,0.42,{fontSize:11,bold:true,color:NEON,align:'center',valign:'middle'});})();
// 4 Glühbirne
(()=>{const {s,T,card,ln,cube}=mk(TS,SUB);card(0.6,HY,7.07,HH);
  const cx=4.135,cy=HY+1.3,r=1.05;
  for(let a=-20;a<=200;a+=28){const t=a*Math.PI/180,r1=r+0.2,r2=r+0.5;ln(cx+r1*Math.cos(t),cy-r1*Math.sin(t),cx+r2*Math.cos(t),cy-r2*Math.sin(t),LINE,3);}
  s.addShape(S.ellipse,{x:cx-r,y:cy-r,w:2*r,h:2*r,fill:{color:NEON},line:{color:DEEP,width:1.5}});
  s.addShape(S.roundRect,{x:cx-0.5,y:cy+r-0.2,w:1.0,h:0.55,rectRadius:0.08,fill:{color:CHIP},line:{color:DEEP,width:1.5}});
  [0.14,0.28,0.42].forEach(dy=>ln(cx-0.45,cy+r-0.2+dy,cx+0.45,cy+r-0.2+dy,DEEP,1));
  [[0,0,0],[1,0,0],[0,1,0],[0,0,1]].forEach(([i,j,k])=>{const u=0.38,dx=u*0.866,dy=u*0.5;cube(cx+(i-j)*dx,cy-0.15+(i+j)*dy-k*u,u,MID);});
  T('Denksport für alle Schulstufen',0.6,HY+HH-0.4,7.07,0.35,{fontSize:12,bold:true,color:GREEN,align:'center'});})();
const OUT='/home/user/claudecloud/videoslides/logoprima-heft-cover-logoprima-farben-a4.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
