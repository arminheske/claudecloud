const pptxgen=require('pptxgenjs');const fs=require('fs');
const SP=__dirname+'/';const OUTD='/home/user/claudecloud/videoslides/';const px=v=>v/96;
const E=JSON.parse(fs.readFileSync(SP+'el_dbg.json'));
const pres=new pptxgen();pres.layout='LAYOUT_WIDE';pres.title='Thumbnail Denken vor Syntax';
const s=pres.addSlide();s.background={color:'E8F6D2'};
s.addImage({path:SP+'bg-dbg.png',x:0,y:0,w:13.333,h:7.5,objectName:'Hintergrund'});
E.forEach(e=>{
 if(e.k==='rr')s.addShape(pres.ShapeType.roundRect,{x:px(e.x),y:px(e.y),w:px(e.w),h:px(e.h),rectRadius:e.r,fill:{color:e.f},line:{color:e.l,width:e.lw?e.lw*0.75:0},objectName:e.n});
 else if(e.k==='el')s.addShape(pres.ShapeType.ellipse,{x:px(e.x),y:px(e.y),w:px(e.w),h:px(e.h),fill:{color:e.f},line:{color:e.l,width:e.lw*0.75},objectName:e.n});
 else if(e.k==='ar')s.addShape(pres.ShapeType.rightArrow,{x:px(e.x),y:px(e.y),w:px(e.w),h:px(e.h),fill:{color:e.f},line:{color:e.f,width:0},objectName:e.n});
 else if(e.k==='tri')s.addShape(pres.ShapeType.triangle,{x:px(e.x),y:px(e.y),w:px(e.w),h:px(e.h),rotate:90,fill:{color:e.f},line:{color:e.f,width:0},objectName:e.n});
 else if(e.k==='img')s.addImage({path:e.p,x:px(e.x),y:px(e.y),w:px(e.w),h:px(e.h),objectName:e.n});
 else s.addText(e.t,{x:px(e.x),y:px(e.y),w:px(e.w),h:px(e.h),fontFace:'Poppins',fontSize:Math.round(e.px*0.75*0.9),bold:true,italic:e.f==='bi',color:e.c,align:e.al,valign:'middle',margin:0,wrap:false,isTextBox:true,objectName:e.n});
});
s.addNotes('YouTube-Thumbnail 1280x720, alle Teile sind getrennte Ebenen.');
pres.writeFile({fileName:OUTD+'cleverbox-thumbnail-programmieren-denken.pptx'}).then(()=>console.log('ok'));
