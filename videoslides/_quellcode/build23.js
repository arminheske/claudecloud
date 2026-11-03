const pptxgen=require('pptxgenjs');const fs=require('fs');
const OUTD='/home/user/claudecloud/videoslides/';const q=JSON.parse(fs.readFileSync(__dirname+'/forms.json'));
const K=120,i_=v=>v/K;const BGc='DCEBFA',FILL='8DBBF2',OUTL='0F2A52';
const pres=new pptxgen();pres.layout='LAYOUT_WIDE';pres.title='Flächeninhalt – Formeln';
q.formeln.forEach(f=>{const s=pres.addSlide();s.background={color:BGc};const nn=String(f.nr).padStart(2,'0');s.addNotes('Formel '+nn+': '+f.name);
 const x0=(1600-f.pw)/2,y0=(900-f.ph)/2;
 s.addShape(pres.ShapeType.roundRect,{x:i_(x0),y:i_(y0),w:i_(f.pw),h:i_(f.ph),rectRadius:0.35,fill:{color:OUTL},line:{color:OUTL,width:0},objectName:'Formel '+nn+' Fläche '+f.name});
 f.els.forEach((e,k)=>{
  if(e.k==='line'){s.addShape(pres.ShapeType.rect,{x:i_(x0+e.x),y:i_(y0+e.y),w:i_(e.w),h:i_(e.h),fill:{color:FILL},line:{color:FILL,width:0},objectName:'Formel '+nn+' Bruchstrich'});return;}
  const runs=[];e.tk.forEach(([kk,t])=>runs.push(kk==='s'?{text:t,options:{subscript:true}}:{text:t}));
  s.addText(runs,{x:i_(x0+e.x-6),y:i_(y0+e.cy-70),w:i_(e.w+12),h:i_(140),fontFace:'Poppins',fontSize:Math.round(112*0.6*0.9),bold:true,color:FILL,align:'center',valign:'middle',margin:0,wrap:false,isTextBox:true,objectName:'Formel '+nn+' Text '+(k+1)});});
});
pres.writeFile({fileName:OUTD+'flaecheninhalt-formeln.pptx'}).then(()=>console.log('ok'));
