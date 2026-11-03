const pptxgen=require('pptxgenjs');const fs=require('fs');
const q=JSON.parse(fs.readFileSync(__dirname+'/tab.json'));const k=v=>v/144;
const pres=new pptxgen();pres.layout='LAYOUT_WIDE';pres.title='Excel Haushaltsplaner Tabelle';
const s=pres.addSlide();s.background={color:'ECEEF8'};
const [cx,cy,cw,ch]=q.card;
s.addShape(pres.ShapeType.roundRect,{x:k(cx),y:k(cy),w:k(cw),h:k(ch),rectRadius:0.18,fill:{color:'FAFAFA'},line:{color:'D3D8EE',width:1.5},objectName:'Karte'});
q.cells.forEach((c,i)=>{
 const nm=(c.r===0?'Spaltenkopf ':'Zelle ')+(c.r===0?(c.t||'leer'):c.r+'-'+c.c);
 s.addShape(pres.ShapeType.rect,{x:k(c.x),y:k(c.y),w:k(c.w),h:k(c.h),fill:{color:c.fill},line:{color:'D3D8EE',width:1},objectName:nm});
 if(c.t)s.addText(c.t,{x:k(c.x+22),y:k(c.y),w:k(c.w-30),h:k(c.h),fontFace:'Poppins',fontSize:Math.round((c.size||32)*0.5*0.9),bold:c.bold,color:c.col,valign:'middle',margin:0,wrap:false,isTextBox:true,objectName:nm+' Text'});
});
s.addNotes('Excel-Tabelle Haushaltsplaner im Cleverbox-Farbprofil: Zellen H3:H7 und B8:H8 sind leer (Gesamtsummen) und hellblau hinterlegt.');
pres.writeFile({fileName:'/home/user/claudecloud/videoslides/excel-haushaltsplaner-tabelle.pptx'}).then(()=>console.log('ok'));
