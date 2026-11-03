const pptxgen=require('pptxgenjs');const fs=require('fs');
const OUTD='/home/user/claudecloud/videoslides/';const q=JSON.parse(fs.readFileSync(__dirname+'/forms.json'));
const K=120,i_=v=>v/K;const BGc='DCEBFA',FILL='8DBBF2',OUTL='0F2A52',LAB='14459A';
const fm=s=>{const o=[];s.split(/(h_[abc])/).forEach(p=>{if(!p)return;const m=p.match(/^h_([abc])$/);if(m){o.push({text:'h'});o.push({text:m[1],options:{subscript:true}});}else o.push({text:p});});return o;};
// Formen
{const pres=new pptxgen();pres.layout='LAYOUT_WIDE';pres.title='Flächeninhalt – Formen';
q.formen.forEach(f=>{const s=pres.addSlide();s.background={color:BGc};s.addNotes('Form '+String(f.nr).padStart(2,'0')+': '+f.name);
 const xs=f.poly.map(p=>p[0]),ys=f.poly.map(p=>p[1]);const x0=Math.min(...xs),y0=Math.min(...ys),w=Math.max(...xs)-x0,h=Math.max(...ys)-y0;
 const pts=f.poly.map((p,k)=>{const o={x:i_(p[0]-x0),y:i_(p[1]-y0)};if(k===0)o.moveTo=true;return o;});pts.push({close:true});
 s.addShape(pres.ShapeType.custGeom,{x:i_(x0),y:i_(y0),w:i_(w),h:i_(h),points:pts,fill:{color:FILL},line:{color:OUTL,width:6},objectName:'Form '+String(f.nr).padStart(2,'0')+' '+f.name});
 f.dash.forEach((d,k)=>{const [a,b]=d;s.addShape(pres.ShapeType.line,{x:i_(Math.min(a[0],b[0])),y:i_(Math.min(a[1],b[1])),w:i_(Math.abs(a[0]-b[0])),h:i_(Math.abs(a[1]-b[1])),line:{color:LAB,width:4,dashType:'dash'},objectName:'Hilfslinie '+(k+1)});});
 f.ra.forEach((r,k)=>s.addShape(pres.ShapeType.rect,{x:i_(r[0]),y:i_(r[1]),w:i_(50),h:i_(50),fill:{type:'none'},line:{color:LAB,width:3.5},objectName:'Rechter Winkel '+(k+1)}));
 f.labs.forEach((l,k)=>{const [t,x,y,sub]=l;const runs=[{text:t}];if(sub)runs.push({text:sub,options:{subscript:true}});
  s.addText(runs,{x:i_(x-60),y:i_(y-45),w:i_(120),h:i_(90),fontFace:'Poppins',fontSize:Math.round(72*0.6*0.9),bold:true,color:LAB,align:'center',valign:'middle',margin:0,isTextBox:true,objectName:'Beschriftung '+(k+1)});});
});
pres.writeFile({fileName:OUTD+'flaecheninhalt-formen.pptx'}).then(()=>console.log('formen ok'));}
// Formeln
{const pres=new pptxgen();pres.layout='LAYOUT_WIDE';pres.title='Flächeninhalt – Formeln';
q.formeln.forEach(f=>{const s=pres.addSlide();s.background={color:BGc};s.addNotes('Formel '+String(f.nr).padStart(2,'0')+': '+f.name);
 const w=f.pw,h=f.ph;const x=(1600-w)/2,y=(900-h)/2;
 s.addShape(pres.ShapeType.roundRect,{x:i_(x),y:i_(y),w:i_(w),h:i_(h),rectRadius:0.3,fill:{color:OUTL},line:{color:OUTL,width:0},objectName:'Formel-Fläche'});
 s.addText(fm(f.s),{x:i_(x),y:i_(y),w:i_(w),h:i_(h),fontFace:'Poppins',fontSize:Math.round(120*0.6*0.9),bold:true,color:FILL,align:'center',valign:'middle',margin:0,isTextBox:true,objectName:'Formel '+String(f.nr).padStart(2,'0')+' '+f.name});});
pres.writeFile({fileName:OUTD+'flaecheninhalt-formeln.pptx'}).then(()=>console.log('formeln ok'));}
