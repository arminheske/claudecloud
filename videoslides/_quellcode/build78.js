const pptxgen = require('pptxgenjs');
const { applyTheme } = require('/root/.claude/skills/synced/a0fffd8f-fbe1-4e7d-aa5e-38324b1aa029_20e1b83a-f4da-4ff7-a932-8b62f50170b1/pptx/scripts/apply_theme.js');
const BG='FFFFFF',INK='2D1B0E',Y='E8B53A',YL='F6DF8C',OD='C2571A',O='DA702F',CHIP='FCE9C4',LINE='EBC58A',GRAY='7A6A5A',W='FFFFFF';
const FONT='Poppins';
const THEME={name:'logoprima',headFontFace:FONT,bodyFontFace:FONT,colors:{dk1:INK,lt1:W,dk2:OD,lt2:BG,accent1:Y,accent2:OD,accent3:CHIP,accent4:GRAY,accent5:O,accent6:LINE,hlink:OD,folHlink:GRAY}};
const pres=new pptxgen();pres.defineLayout({name:'STORY',width:7.5,height:13.333});pres.layout='STORY';
pres.title='logoprima+ Instagram-Story';pres.author='Cleverbox';
const S=pres.ShapeType;const X0=0.55,CW=6.4;
const s=pres.addSlide();s.background={color:BG};
const T=(t,x,y,w,h,o={})=>s.addText(t,Object.assign({x,y,w,h,fontFace:FONT,fontSize:20,color:INK,margin:0,valign:'top',isTextBox:true},o));
// Logo klein oben
s.addImage({path:__dirname+'/logo_small.png',x:X0,y:1.85,w:2.2,h:2.2*0.3709,altText:'cleverbox'});
// Überschrift
T([{text:'Das ',options:{color:INK}},{text:'Logik-Heft',options:{color:OD,highlight:YL,breakLine:true}},{text:'gratis für dich',options:{color:INK}}],X0,2.95,CW,2.0,{fontSize:46,lineSpacingMultiple:1.0,valign:'middle'});
// Platzhalter Mockup
const py=5.2,ph=4.3;
s.addShape(S.roundRect,{x:X0,y:py,w:CW,h:ph,rectRadius:0.25,fill:{color:CHIP},line:{color:OD,width:2.5,dashType:'dash'}});
T('MOCKUP',X0,py+ph/2-0.45,CW,0.6,{fontSize:28,bold:true,color:OD,align:'center',valign:'middle'});
T('hier das Heft-Mockup einfügen',X0,py+ph/2+0.15,CW,0.4,{fontSize:15,color:GRAY,align:'center',valign:'middle'});
// Details
const d=[['50','Arbeitsblätter'],['5–9','Schulstufe'],['4','Levels'],['PDF','mit Lösungen']];
d.forEach(([a,b],i)=>{const w=3.1,h=0.9,x=X0+(i%2)*(w+0.2),y=9.8+Math.floor(i/2)*1.05;
  s.addShape(S.roundRect,{x,y,w,h,rectRadius:0.2,fill:{color:W},line:{color:LINE,width:2}});
  T(a,x+0.2,y,1.2,h,{fontSize:26,bold:true,color:OD,valign:'middle'});
  T(b,x+1.35,y,w-1.45,h,{fontSize:14,bold:true,valign:'middle'});});
const OUT='/home/user/claudecloud/videoslides/logoprima-instagram-story.pptx';
(async()=>{await pres.writeFile({fileName:OUT});await applyTheme(OUT,THEME);console.log('ok');})();
