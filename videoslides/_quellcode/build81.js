const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const PAL={
 mathe:{name:'Mathebox Blau',BG:'DCEBFA',CARD:'F4F9FF',INK:'0B1E3A',GREEN:'14459A',NEON:'8DBBF2',DEEP:'0F2A52',GRAY:'4A5F7A',LINE:'A9C6EA',CHIP:'C9DDF5',out:'/home/user/claudecloud/videoslides/mathebox-vorstellungsstory'},
 lingo:{name:'Lingobox Rosa',BG:'EBCBE2',CARD:'FBF1F8',INK:'2B1027',GREEN:'7A1F6B',NEON:'F58AD2',DEEP:'3D1636',GRAY:'6B4A64',LINE:'D3A0C6',CHIP:'F3DDEC',out:'/home/user/claudecloud/videoslides/lingobox-vorstellungsstory'}};
const FONT='Poppins';
const STORIES={
 mathe:{brand:'Mathebox',url:'www.mathebox.at',frames:[
  {kick:'Neu von Cleverbox',head:[['Mathe üben. ',false,true],['Kostenlos.',true]],mock:'MOCKUP Mathebox',details:[['Mathe-Übungen','direkt im Browser'],['Kostenlos','ohne Registrierung'],['mathebox.at','für Schule und zu Hause']]},
  {kick:'Jetzt ausprobieren',head:[['Teste die ',false,true],['Mathebox!',true]],mock:'MOCKUP Mathebox Aufgabe',details:[['www.mathebox.at','Link-Sticker antippen'],['Gratis','keine Anmeldung nötig']]}]},
 lingo:{brand:'Lingobox',url:'www.lingobox.at',frames:[
  {kick:'Neu von Cleverbox',head:[['Das ',false],['Vokabeltool',true,true],['komplett kostenlos',false]],mock:'MOCKUP Lingobox',details:[['Sets','anlegen oder importieren'],['Hausaufgaben','mit Bestätigung per E-Mail'],['LiveModus','Vokabeltest live (Beta)']]},
  {kick:'Jetzt ausprobieren',head:[['Teste die ',false,true],['Lingobox!',true]],mock:'MOCKUP Lingobox Üben',details:[['www.lingobox.at','Link-Sticker antippen'],['Kostenlos','Fortschritt per E-Mail']]}]}};
function build(key){
  const P=PAL[key],ST=STORIES[key];const {BG,CARD,INK,GREEN,NEON,DEEP,GRAY,LINE,CHIP}=P;
  const pres=new pptxgen();pres.defineLayout({name:'STORY',width:7.5,height:13.333});pres.layout='STORY';
  pres.title=ST.brand+' Vorstellung';pres.author='Cleverbox';
  const THEME={name:P.name,headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:CARD,dk2:DEEP,lt2:BG,accent1:NEON,accent2:GREEN,accent3:CHIP,accent4:GRAY,accent5:LINE,accent6:DEEP,hlink:GREEN,folHlink:GRAY}};
  const S=pres.ShapeType;const X0=0.55,CW=6.4;
  ST.frames.forEach((f,fi)=>{
    const s=pres.addSlide();s.background={color:BG};
    const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:20,color:INK,margin:0,valign:'top',isTextBox:true},o));
    s.addImage({path:__dirname+'/logo_small.png',x:X0,y:1.85,w:2.2,h:2.2*0.3709,altText:'cleverbox'});
    ST.frames.forEach((_,i)=>s.addShape(S.roundRect,{x:7.5-X0-0.5*ST.frames.length+i*0.5,y:2.3,w:0.4,h:0.1,rectRadius:0.05,fill:{color:i<=fi?GREEN:LINE},line:{color:i<=fi?GREEN:LINE,width:0}}));
    T(f.kick,X0,3.0,CW,0.45,{fontSize:17,bold:true,color:GREEN});
    T(f.head.map(([t,a,b])=>({text:t,options:{color:a?GREEN:INK,highlight:a?NEON:undefined,breakLine:!!b}})),X0,3.5,CW,1.9,{fontSize:46,lineSpacingMultiple:1.0,valign:'top'});
    const py=5.5,ph=3.0;
    s.addShape(S.roundRect,{x:X0,y:py,w:CW,h:ph,rectRadius:0.25,fill:{color:CARD},line:{color:GREEN,width:2.5,dashType:'dash'}});
    T(f.mock,X0,py+ph/2-0.4,CW,0.6,{fontSize:26,bold:true,color:GREEN,align:'center',valign:'middle'});
    T('hier das Mockup einfügen',X0,py+ph/2+0.2,CW,0.4,{fontSize:14,color:GRAY,align:'center',valign:'middle'});
    const n=f.details.length,dh=0.78,gap=0.12;
    f.details.forEach(([a,b],i)=>{const y=8.7+i*(dh+gap);
      s.addShape(S.roundRect,{x:X0,y,w:CW,h:dh,rectRadius:0.2,fill:{color:CARD},line:{color:LINE,width:2}});
      s.addShape(S.ellipse,{x:X0+0.2,y:y+0.14,w:0.5,h:0.5,fill:{color:NEON},line:{color:NEON,width:0}});
      T(String(i+1),X0+0.2,y+0.14,0.5,0.5,{fontSize:16,bold:true,color:INK,align:'center',valign:'middle'});
      T([{text:a,options:{bold:true,color:INK,fontSize:18,breakLine:true}},{text:b,options:{color:GRAY,fontSize:13}}],X0+0.95,y,CW-1.1,dh,{valign:'middle'});});
  });
  const OUT=P.out+'.pptx';
  return pres.writeFile({fileName:OUT}).then(()=>applyTheme(OUT,THEME)).then(()=>console.log('ok',OUT));}
(async()=>{await build('mathe');await build('lingo');})();
