const pptxgen = require('pptxgenjs');
const BGC=process.argv[2]||'FFFFFF';const OUT=process.argv[3];
const INK='2D1B0E',Y='E9B63A',YL='F6DF8C',O='DA702F',OD='C2571A',CHIP='FCE9C4',LINE='EBC58A',W='FFFFFF',GRN='7DBE5B',BLU='5B94E0',GRAY='7A6A5A';
const FONT='Poppins';
const pres=new pptxgen();pres.layout='LAYOUT_WIDE';pres.title='logoprima+ Elemente';pres.author='Cleverbox';
const S=pres.ShapeType;const CX=6.667,CY=3.75;
const mix=(a,b,t)=>{const p=h=>[0,2,4].map(i=>parseInt(h.substr(i,2),16));const A=p(a),B=p(b);return A.map((v,i)=>Math.round(v+(B[i]-v)*t).toString(16).padStart(2,'0')).join('').toUpperCase();};
function ctx(name){const s=pres.addSlide();s.background={color:BGC};s.addNotes(name);
  const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:28,bold:true,color:INK,margin:0,valign:'middle',align:'center',isTextBox:true},o));
  const rr=(x,y,w,h,fill,lw=2.25,rad=0.12,lc=INK)=>s.addShape(S.roundRect,{x,y,w,h,rectRadius:rad,fill:{color:fill},line:{color:lc,width:lw}});
  const rect=(x,y,w,h,fill,lw=2.25)=>s.addShape(S.rect,{x,y,w,h,fill:{color:fill},line:{color:INK,width:lw}});
  const el=(x,y,w,h,fill,lw=2.25)=>s.addShape(S.ellipse,{x,y,w,h,fill:{color:fill},line:{color:INK,width:lw}});
  const ln=(x1,y1,x2,y2,color,width,dash)=>s.addShape(S.line,{x:Math.min(x1,x2),y:Math.min(y1,y2),w:Math.abs(x2-x1),h:Math.abs(y2-y1),flipV:((x2-x1)*(y2-y1))<0,line:{color,width,dashType:dash||'solid'}});
  const poly=(pts,fill,lw=2.25,lc=INK,dash)=>{const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0||0.001,h=Math.max(...ys)-y0||0.001;
    s.addShape(S.custGeom,{x:x0,y:y0,w,h,fill:fill?{color:fill}:{color:'FFFFFF',transparency:100},line:{color:lc,width:lw,dashType:dash||'solid'},points:pts.map((p,i)=>i===0?{x:p[0]-x0,y:p[1]-y0,moveTo:true}:{x:p[0]-x0,y:p[1]-y0}).concat([{close:true}])});};
  return {s,T,rr,rect,el,ln,poly};}
const ELS=[];
// 01 Würfelnetz
ELS.push(['wuerfelnetz',()=>{const {rect,T}=ctx('Würfelnetz');const u=1.05,x0=CX-1.5*u,y0=CY-2*u;
  [[1,0],[0,1],[1,1],[2,1],[1,2],[1,3]].forEach(([c,r],i)=>{const q=(c===1&&r===2);rect(x0+c*u,y0+r*u,u,u,q?O:(i%2?YL:Y));if(q)T('?',x0+c*u,y0+r*u,u,u,{fontSize:44,color:W});});}]);
// 02 Zahlenpyramide
ELS.push(['zahlenpyramide',()=>{const {rr,T}=ctx('Zahlenpyramide');const bw=1.45,bh=0.9;
  const rows=[[37],[18,19],[8,null,9],[5,3,7,2]];
  rows.forEach((row,ri)=>{const n=row.length,y=CY-2*bh+ri*bh+0.0-0.1,x0=CX-n*bw/2;
    row.forEach((v,ci)=>{const q=v===null;const x=x0+ci*bw;rr(x,y,bw,bh,q?O:CHIP,2.25,0.08);T(q?'?':String(v),x,y,bw,bh,{fontSize:30,color:q?W:INK});});});}]);
// 03 Mustereihe
ELS.push(['mustereihe',()=>{const {rr,el,poly,rect,T}=ctx('Mustereihe');const w=1.6,g=0.18,x0=CX-(6*w+5*g)/2,y=CY-w/2;
  for(let i=0;i<6;i++){const x=x0+i*(w+g),q=i===5;rr(x,y,w,w,q?O:W,2.25,0.14);
    const k=i%3,cx=x+w/2,cy=y+w/2;
    if(q)T('?',x,y,w,w,{fontSize:54,color:W});
    else if(k===0)el(cx-0.4,cy-0.4,0.8,0.8,Y);
    else if(k===1)poly([[cx,cy-0.45],[cx+0.45,cy+0.38],[cx-0.45,cy+0.38]],O);
    else rect(cx-0.38,cy-0.38,0.76,0.76,YL);}}]);
// 04 Waage
ELS.push(['waage',()=>{const {rr,el,rect,ln,poly,T}=ctx('Waage');
  poly([[CX-1.0,CY+2.3],[CX+1.0,CY+2.3],[CX+0.12,CY-1.6],[CX-0.12,CY-1.6]],CHIP);
  rr(CX-1.2,CY+2.2,2.4,0.3,Y,2.25,0.1);
  rr(CX-3.4,CY-1.75,6.8,0.28,Y,2.25,0.1);el(CX-0.22,CY-1.9,0.44,0.44,O);
  [-1,1].forEach(sd=>{const px=CX+sd*3.0;ln(px,CY-1.5,px-0.9,CY+0.5,INK,2);ln(px,CY-1.5,px+0.9,CY+0.5,INK,2);
    poly([[px-1.15,CY+0.5],[px+1.15,CY+0.5],[px+0.8,CY+0.9],[px-0.8,CY+0.9]],YL);});
  [-0.6,0.15].forEach(dx=>rect(CX-3.0+dx-0.25,CY-0.1,0.7,0.6,Y));
  [-0.7,0,0.7].forEach(dx=>el(CX+3.0+dx-0.3,CY+0.0,0.6,0.6,O));
  T('=',CX-0.6,CY-0.6,1.2,0.9,{fontSize:40});}]);
// 05 Zahlenstrahl
ELS.push(['zahlenstrahl',()=>{const {s,ln,T,poly}=ctx('Zahlenstrahl');const x0=CX-5.2,y0=CY+0.9,step=1.04;
  ln(x0-0.3,y0,x0+10*step+0.4,y0,INK,3);poly([[x0+10*step+0.55,y0],[x0+10*step+0.25,y0-0.17],[x0+10*step+0.25,y0+0.17]],INK,1);
  for(let i=0;i<=10;i++){const v=i-3;ln(x0+i*step,y0-0.15,x0+i*step,y0+0.15,INK,3);T(String(v),x0+i*step-0.4,y0+0.25,0.8,0.5,{fontSize:22,color:v===0?OD:INK});}
  const arc=(xa,xb,h,col)=>{const w=xb-xa;s.addShape(S.custGeom,{x:xa,y:y0-0.2-h,w,h,fill:{color:'FFFFFF',transparency:100},line:{color:col,width:4},points:[{x:0,y:h,moveTo:true},{x:w,y:h,curve:{type:'cubic',x1:0,y1:-h*0.33,x2:w,y2:-h*0.33}}]});
    poly([[xb,y0-0.12],[xb-0.14,y0-0.38],[xb+0.14,y0-0.38]],col,1,col);};
  arc(x0+3*step,x0+7*step,1.7,O);T('+4',x0+3*step,y0-2.5,4*step,0.6,{fontSize:28,color:OD});
  arc(x0+7*step,x0+4*step,1.3,Y);T('−3',x0+4*step,y0-1.1,3*step,0.6,{fontSize:28,color:INK});}]);
// 06 Spielwürfel
ELS.push(['spielwuerfel',()=>{const {rr,el,T}=ctx('Spielwürfel');const w=1.7,g=0.5,x0=CX-(3*w+2*g+2.4)/2,y=CY-w/2;
  const P={2:[[.28,.28],[.72,.72]],5:[[.28,.28],[.72,.28],[.5,.5],[.28,.72],[.72,.72]],6:[[.28,.25],[.72,.25],[.28,.5],[.72,.5],[.28,.75],[.72,.75]],3:[[.25,.25],[.5,.5],[.75,.75]]};
  [2,5,null].forEach((v,i)=>{const x=x0+i*(w+g+(i===2?0.3:0));rr(x,y,w,w,v===null?O:W,2.25,0.25);
    if(v===null)T('?',x,y,w,w,{fontSize:64,color:W});else P[v].forEach(([px,py])=>el(x+px*w-0.13,y+py*w-0.13,0.26,0.26,OD,1));});
  T('+',x0+w-0.05,y,g+0.1,w,{fontSize:44});T('+',x0+2*w+g-0.05,y,g+0.4,w,{fontSize:44});
  T('= 13',x0+3*w+2*g+0.9,y,1.6,w,{fontSize:40,align:'left'});}]);
// 07 Labyrinth
ELS.push(['labyrinth',()=>{const {s,ln,el,T,poly}=ctx('Labyrinth');const N=7,u=0.62,x0=CX-N*u/2,y0=CY-N*u/2;
  let seed=7;const rnd=()=>{seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  const vis=[...Array(N)].map(()=>Array(N).fill(false)),wallR=[...Array(N)].map(()=>Array(N).fill(true)),wallB=[...Array(N)].map(()=>Array(N).fill(true));
  const stack=[[0,0]];vis[0][0]=true;
  while(stack.length){const [r,c]=stack[stack.length-1];const nb=[[r-1,c],[r+1,c],[r,c-1],[r,c+1]].filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N&&!vis[a][b]);
    if(!nb.length){stack.pop();continue;}const [a,b]=nb[Math.floor(rnd()*nb.length)];
    if(a===r+1)wallB[r][c]=false;else if(a===r-1)wallB[a][b]=false;else if(b===c+1)wallR[r][c]=false;else wallR[a][b]=false;vis[a][b]=true;stack.push([a,b]);}
  s.addShape(S.rect,{x:x0,y:y0,w:N*u,h:N*u,fill:{color:CHIP},line:{color:INK,width:4}});
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){if(c<N-1&&wallR[r][c])ln(x0+(c+1)*u,y0+r*u,x0+(c+1)*u,y0+(r+1)*u,INK,4);if(r<N-1&&wallB[r][c])ln(x0+c*u,y0+(r+1)*u,x0+(c+1)*u,y0+(r+1)*u,INK,4);}
  el(x0+0.15,y0+0.15,u-0.3,u-0.3,O);s.addShape(S.star5,{x:x0+(N-1)*u+0.1,y:y0+(N-1)*u+0.1,w:u-0.2,h:u-0.2,fill:{color:Y},line:{color:INK,width:2}});}]);
// 08 Symmetrie
ELS.push(['symmetrie',()=>{const {ln,poly,T}=ctx('Symmetrie');const ax=CX,sc=0.9;
  const pts=[[-0.3,-1.9],[-1.4,-1.0],[-1.0,-0.2],[-2.0,0.4],[-1.2,1.0],[-1.5,1.9],[-0.3,1.5]].map(([x,y])=>[x,y]);
  poly(pts.map(([x,y])=>[ax+x*1.1,CY+y*1.05]),Y);
  poly(pts.map(([x,y])=>[ax-x*1.1,CY+y*1.05]).reverse(),null,3,O,'dash');
  ln(ax,CY-2.6,ax,CY+2.6,OD,3,'dash');T('?',ax+0.5,CY-0.35,0.7,0.7,{fontSize:36,color:OD});}]);
// 09 Zahlenkreis
ELS.push(['zahlenkreis',()=>{const {el,ln,T,s}=ctx('Zahlenkreis');const R=2.1,vals=['2','4','8','16','32','?'];
  el(CX-0.9,CY-0.9,1.8,1.8,CHIP);T('×2',CX-0.9,CY-0.9,1.8,1.8,{fontSize:36,color:OD});
  vals.forEach((v,i)=>{const a=(-90+i*60)*Math.PI/180,x=CX+R*Math.cos(a),y=CY+R*Math.sin(a);const q=v==='?';ln(CX+0.9*Math.cos(a),CY+0.9*Math.sin(a),x-0.45*Math.cos(a),y-0.45*Math.sin(a),LINE,3);
    el(x-0.5,y-0.5,1.0,1.0,q?O:(i%2?YL:Y));T(v,x-0.5,y-0.5,1.0,1.0,{fontSize:q?34:26,color:q?W:INK});});}]);
// 10 Mini-Sudoku
ELS.push(['mini-sudoku',()=>{const {s,rect,ln,T}=ctx('Mini-Sudoku');const u=1.05,x0=CX-2*u,y0=CY-2*u;
  const g=[[1,0,3,0],[0,4,0,2],[0,1,0,3],[4,0,2,0]];
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const q=(r===1&&c===0);s.addShape(S.rect,{x:x0+c*u,y:y0+r*u,w:u,h:u,fill:{color:q?O:(((r>>1)+(c>>1))%2?YL:W)},line:{color:INK,width:1.25}});
    if(g[r][c])T(String(g[r][c]),x0+c*u,y0+r*u,u,u,{fontSize:36});else if(q)T('?',x0+c*u,y0+r*u,u,u,{fontSize:40,color:W});}
  s.addShape(S.rect,{x:x0,y:y0,w:4*u,h:4*u,fill:{color:'FFFFFF',transparency:100},line:{color:INK,width:4}});
  ln(x0+2*u,y0,x0+2*u,y0+4*u,INK,4);ln(x0,y0+2*u,x0+4*u,y0+2*u,INK,4);}]);
// 11 Rechenkette
ELS.push(['rechenkette',()=>{const {rr,s,T}=ctx('Rechenkette');const w=1.7,aw=1.1,tot=4*w+3*aw,x0=CX-tot/2,y=CY-w/2;
  [['3',YL],['×2',CHIP],['+4',CHIP],['?',O]].forEach(([t,f],i)=>{const x=x0+i*(w+aw);rr(x,y,w,w,f,2.25,0.2);T(t,x,y,w,w,{fontSize:i===3?60:46,color:i===3?W:INK});
    if(i<3)s.addShape(S.rightArrow,{x:x+w+0.1,y:CY-0.28,w:aw-0.2,h:0.56,fill:{color:Y},line:{color:INK,width:2.25}});});}]);
// 12 Zahlenschloss
ELS.push(['zahlenschloss',()=>{const {rr,rect,T,s}=ctx('Zahlenschloss');
  s.addShape(S.roundRect,{x:CX-1.35,y:CY-2.7,w:2.7,h:3.4,rectRadius:1.35,fill:{color:'FFFFFF',transparency:100},line:{color:INK,width:16}});
  s.addShape(S.roundRect,{x:CX-1.35,y:CY-2.7,w:2.7,h:3.4,rectRadius:1.35,fill:{color:'FFFFFF',transparency:100},line:{color:'B9B2A8',width:9}});
  rr(CX-2.6,CY-0.3,5.2,3.0,Y,2.5,0.3);
  [0,1,2,3].forEach(i=>{const x=CX-2.05+i*1.07;rr(x,CY+0.35,0.95,1.5,i===3?O:W,2.25,0.14);T(i===3?'?':['3','7','1'][i],x,CY+0.35,0.95,1.5,{fontSize:46,color:i===3?W:INK});});}]);
// 13 Zahlenfeld (magisches Quadrat)
ELS.push(['zahlenfeld',()=>{const {rr,T}=ctx('Zahlenfeld');const g=[[2,7,6],[9,5,1],[4,3,null]],ts=1.5,gp=0.16,x0=CX-(3*ts+2*gp)/2,y0=CY-(3*ts+2*gp)/2;
  g.forEach((row,r)=>row.forEach((v,c)=>{const q=v===null;rr(x0+c*(ts+gp),y0+r*(ts+gp),ts,ts,q?O:((r+c)%2?YL:CHIP),2.25,0.16);T(q?'?':String(v),x0+c*(ts+gp),y0+r*(ts+gp),ts,ts,{fontSize:q?56:50,color:q?W:INK});}));}]);
// 14 Würfelturm
ELS.push(['wuerfelturm',()=>{const {poly}=ctx('Würfelturm');const u=0.95,dx=u*0.866,dy=u*0.5,bx=CX,by=CY+0.1;
  const cube=(cx,cy,c)=>{poly([[cx,cy-dy],[cx+dx,cy],[cx,cy+dy],[cx-dx,cy]],mix(c,'FFFFFF',0.45));poly([[cx-dx,cy],[cx,cy+dy],[cx,cy+dy+u],[cx-dx,cy+u]],c);poly([[cx+dx,cy],[cx,cy+dy],[cx,cy+dy+u],[cx+dx,cy+u]],mix(c,'000000',0.22));};
  // Hinten nach vorn, unten nach oben
  const cells=[[0,0,0],[1,0,0],[0,1,0],[1,1,0],[0,0,1],[1,0,1],[0,0,2]];
  cells.sort((a,b)=>(a[0]+a[1]+a[2])-(b[0]+b[1]+b[2])||a[2]-b[2]);
  cells.forEach(([i,j,k],n)=>cube(bx+(i-j)*dx,by+(i+j)*dy-k*u,(k===2)?O:(k===1?Y:YL)));}]);
// 15 Domino-Kette
ELS.push(['domino',()=>{const {rr,el,ln,T}=ctx('Domino');const w=3.0,h=1.5,g=0.3,x0=CX-(3*w+2*g)/2,y=CY-h/2;
  const P={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.25,.25],[.5,.5],[.75,.75]],4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],5:[[.28,.28],[.72,.28],[.5,.5],[.28,.72],[.72,.72]]};
  const pips=(x,y0,s,v)=>P[v].forEach(([px,py])=>el(x+px*s-0.1,y0+py*s-0.1,0.2,0.2,OD,1));
  [[3,5],[5,2],[2,null]].forEach(([a,b],i)=>{const x=x0+i*(w+g);rr(x,y,w,h,W,2.25,0.2);ln(x+w/2,y+0.15,x+w/2,y+h-0.15,INK,2.25);
    pips(x,y,h,a);if(b===null){rr(x+w/2+0.1,y+0.1,w/2-0.2,h-0.2,O,1.5,0.12);T('?',x+w/2,y,w/2,h,{fontSize:50,color:W});}else pips(x+w/2,y,h,b);});}]);
// 16 Würfelplan (Draufsicht)
ELS.push(['wuerfelplan',()=>{const {rr,T,s}=ctx('Würfelplan');const g=[[2,1,0],[1,3,1],[0,1,'?']],ts=1.3,gp=0.12,x0=CX-(3*ts+2*gp)/2,y0=CY-(3*ts+2*gp)/2;
  g.forEach((row,r)=>row.forEach((v,c)=>{const q=v==='?';const x=x0+c*(ts+gp),y=y0+r*(ts+gp);rr(x,y,ts,ts,q?O:(v===0?W:(v>=3?Y:YL)),2.25,0.12);T(String(v),x,y,ts,ts,{fontSize:q?48:42,color:q?W:INK});}));}]);
ELS.forEach(([n,f])=>f());
(async()=>{await pres.writeFile({fileName:OUT});require('fs').writeFileSync(__dirname+'/el/names.json',JSON.stringify(ELS.map(e=>e[0])));console.log('ok',OUT,ELS.length);})();
