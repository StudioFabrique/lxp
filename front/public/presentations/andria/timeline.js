/* Offline, deterministic animation. Every glow is emitted by the real CursorGlowCard. */
gsap.registerPlugin(MorphSVGPlugin);
const sourceSceneClocks={"dashboards":{"start":99.0,"duration":13.0},"identity-2":{"start":112.0,"duration":3.0},"identity":{"start":0.0,"duration":3.0},"structure":{"start":3.0,"duration":14.0},"author":{"start":17.0,"duration":9.0},"assistant":{"start":26.0,"duration":12.0},"assess":{"start":38.0,"duration":8.0},"assignments":{"start":46.0,"duration":7.0},"organize":{"start":53.0,"duration":9.0},"progression":{"start":62.0,"duration":7.0},"care":{"start":69.0,"duration":16.0},"steering":{"start":85.0,"duration":8.0},"personalize":{"start":93.0,"duration":6.0}};
const tl = gsap.timeline({ paused: true });
// Construct later tweens directly at their new times after shortening structure.
const originalTimelineMethods={};
for(const method of ['to','from','fromTo','set']){
  originalTimelineMethods[method]=tl[method];
  tl[method]=function(...args){
    const positionIndex=method==='fromTo'?3:2;
    if(typeof args[positionIndex]==='number'&&args[positionIndex]>=21) args[positionIndex]-=4;
    return originalTimelineMethods[method].apply(this,args);
  };
}
const scenes = [ ['structure',3],['author',21],['assistant',30],['assess',42],['assignments',50],['organize',57],['progression',66],['care',73],['steering',89],['personalize',97] ];
for (const [id,start] of scenes) {
  tl.fromTo(`#${id} .scene-heading`,{y:24,opacity:0},{y:0,opacity:1,duration:.6,ease:'power3.out'},start);
}
const levelsForRail=['0','formation','1','2','3','4','5'];
const reveal=(selector,start,extra={})=>tl.fromTo(selector,{opacity:0,y:35,...extra},{opacity:1,y:0,x:0,z:0,rotationX:0,rotationY:0,scale:1,duration:.75,ease:'power3.out'},start);
// Original SVG geometry and the creator's expanded ANDRIA caption.
document.querySelectorAll('#intro-logo .logo-pixel').forEach((pixel,index)=>{
  tl.fromTo(pixel,{opacity:0,y:(index%5)*2+4},{opacity:1,y:0,duration:.5,ease:'power2.out'},.05+(index%32)*.012);
});
tl.fromTo('#intro-logo',{rotationY:-12,scale:.96},{rotationY:0,scale:1,duration:1.1,ease:'power3.out'},0);
tl.to('#intro-logo .ink',{fill:'var(--color-primary)',duration:.6},.7);
reveal('#identity p',.6);
tl.to('#identity .identity',{opacity:0,y:-18,duration:.3},2.7);
// Seven nested entities, with native cards carried through a depth transition.
reveal('.hierarchy-rail',3.15);
// Overview first: the seven levels land as a nested 3D stack while each rail
// stop flips into its own indentation, then the stack folds into the first card.
const plateDrop=[3.35,3.55,3.75,3.95,4.15,4.35,4.55];
tl.fromTo('#level-stack',{rotationX:70,rotation:-40,scale:.62,x:-60,y:40},{rotationX:54,rotation:-12,scale:.8,x:-150,y:30,duration:1.6,ease:'power3.out'},3.2);
tl.to('#level-stack',{rotationX:46,rotation:-4,x:-150,y:70,duration:1.4,ease:'sine.inOut'},4.8);
plateDrop.forEach((time,index)=>{
  const turn=index%2?24:-24;
  tl.fromTo('#plate-'+index,{opacity:0,z:index*60+520,rotation:turn,x:turn*3},{opacity:1,z:index*60,rotation:0,x:0,duration:.75,ease:'back.out(1.3)'},time);
  tl.fromTo('#rail-'+levelsForRail[index],{x:0,rotationY:-75,opacity:0,transformPerspective:900},{x:index*30,rotationY:0,opacity:1,duration:.75,ease:'back.out(1.5)'},time);
  tl.fromTo('#rail-'+levelsForRail[index]+'>span',{scale:1},{scale:1.14,duration:.22,yoyo:true,repeat:1,ease:'sine.inOut'},time+.45);
});
// Exploded view: the stack opens in depth while it turns.
tl.to('.level-plate',{z:(index)=>index*74,duration:.8,ease:'power2.inOut',stagger:.04},5.3);
tl.to('.level-plate',{z:0,opacity:0,duration:.45,ease:'power2.in',stagger:{each:.05,from:'end'}},6.15);
tl.to('#level-stack',{rotationX:0,rotation:0,x:0,y:0,scale:1.05,duration:.65,ease:'power2.in'},6.15);
tl.fromTo('.rail-line i',{scaleY:0},{scaleY:1,duration:8.1,ease:'none'},6.8);
const levels=levelsForRail;
const selectedRows={'0':2,'formation':4,'1':2,'2':3,'3':2,'4':3};
const steps=[6.8,8.15,9.5,10.85,12.2,13.55,14.9];
// Each child card grows out of the clicked row; parents recede into a deck
// behind it, so the nesting stays visible while the drill-down continues.
const rowOrigins={'0':'50% 290px','formation':'50% 566px','1':'50% 290px','2':'50% 428px','3':'50% 290px','4':'50% 428px'};
levels.forEach((level,index)=>{
  const start=steps[index];
  const parent=levels[index-1];
  const entrance=index===0?{opacity:0,y:-40,z:-340,rotationX:40,rotation:-12,scale:.75}:{opacity:0,scale:.32,rotationX:22,y:0,z:0,transformOrigin:rowOrigins[parent]};
  tl.fromTo('#face-'+level,entrance,{x:0,y:0,z:0,rotationY:0,rotationX:0,rotation:0,scale:1,duration:.6,ease:'expo.out'},start);
  tl.to('#face-'+level,{opacity:1,duration:index===0?.55:.18,ease:'power1.out'},start);
  // Colour handoff: --t crossfades fill, border, icon and glow through color-mix
  // (seek-safe, unlike tweening var() colours), the tile pops.
  tl.fromTo('#rail-'+level+'>span',{'--t':0},{'--t':100,duration:.7,ease:'power2.inOut'},start);
  tl.fromTo('#rail-'+level+'>span',{scale:1},{scale:1.12,duration:.3,ease:'power2.out',yoyo:true,repeat:1},start+.05);
    // Focus: lift and tilt the stop in 3D, fade its glass in and sweep a sheen.
  tl.fromTo('#rail-'+level+' .stop-glass',{opacity:0,scale:.9,backgroundPosition:'-160% 0, 0 0'},{opacity:1,scale:1,duration:.45,ease:'power3.out'},start);
  tl.to('#rail-'+level+' .stop-glass',{backgroundPosition:'260% 0, 0 0',duration:.9,ease:'power2.inOut'},start+.1);
  // Per-stop perspective keeps the tilt centred on the stop, whatever its rail position.
  tl.to('#rail-'+level,{transformPerspective:1400,scale:1.04,rotationY:-4,rotationX:1.5,duration:.55,ease:'back.out(1.4)'},start);
  if(index>0){
    tl.to('#rail-'+parent+' .stop-glass',{opacity:0,scale:.94,duration:.35,ease:'power2.out'},start);
    tl.to('#rail-'+parent,{scale:1,rotationY:0,rotationX:0,duration:.45,ease:'power2.out'},start);
  }
  if(index<6){
    const next=steps[index+1];
    tl.to('#face-'+level+' .list-row:nth-child('+selectedRows[level]+')',{backgroundColor:'var(--color-base-300)',x:7,scale:1.015,duration:.25},next-.75);
    // First step back: the parent stays readable just above the child card.
    tl.to('#face-'+level,{transformOrigin:'50% 0%',y:-58,z:-220,rotationX:10,scale:.94,opacity:.3,duration:.4,ease:'power3.inOut'},next-.1);
    // Second step back: the grandparent fades into the distance.
    if(index<5) tl.to('#face-'+level,{y:-104,z:-440,rotationX:14,scale:.88,opacity:0,duration:.5,ease:'power2.inOut'},steps[index+2]-.25);
  }
});
reveal('#hierarchy-caption-intro',3.6);
tl.to('#hierarchy-caption-intro',{opacity:0,y:-12,duration:.3},6.3);
reveal('#hierarchy-caption-text',6.9);
// The final activity card opens directly into the editor.
tl.to('#face-5',{scale:1.06,z:50,duration:1.0,ease:'power2.inOut'},15.8);
tl.to('#face-4',{opacity:0,z:-520,duration:.8,ease:'power2.in'},15.8);
reveal('.palette',21.05,{x:-40});reveal('.editor-surface',21.15,{rotationY:7,z:-100});
tl.fromTo('.activity-choice',{opacity:0,x:-18},{opacity:1,x:0,duration:.35,stagger:.08},21.2);
reveal('#editor-checks',22.0);reveal('#editor-table',23.1);reveal('#editor-code',24.3);
tl.fromTo('#author .feature-pill',{opacity:0,y:18},{opacity:1,y:0,duration:.45,stagger:.09},25);
reveal('.reading-panel',30.1,{x:-45});reveal('.chat-panel',30.35,{x:100,rotationY:-5});

reveal('.chat-context',33.05);reveal('#chat-question',33.25);reveal('#chat-answer',34.0);
reveal('#chat-quiz',38.0,{y:0});
tl.fromTo('#assistant .feature-pill',{opacity:0,y:15},{opacity:1,y:0,duration:.4,stagger:.1},38.5);
reveal('.quiz-panel',42.1,{rotationY:6});reveal('.assessment-side',42.25,{x:70});
tl.to('#answer-1',{borderColor:'var(--color-primary)',backgroundColor:'var(--color-base-200)',duration:.25},44.1);
tl.to('#answer-1 .radio-dot',{backgroundColor:'var(--color-primary)',duration:.25},44.1);
reveal('#quiz-explanation',44.5);
tl.fromTo('.quiz-types .feature-pill',{opacity:0,y:12},{opacity:1,y:0,duration:.4,stagger:.14},46);
reveal('#assignments .work-panel:first-child',50.1,{x:-70,rotationY:5});reveal('.handoff',51.5);reveal('#correction',52.1,{x:70,rotationY:-5});
reveal('.calendar-panel',57.1,{rotationX:7});
tl.fromTo('.calendar-event',{opacity:0,y:15},{opacity:1,y:0,duration:.5,stagger:.15},57.7);
// The bottom row lands with the other panels of the scene; a second reveal made it blink.
reveal('.progression-layout',66.1);
tl.fromTo('#progression .product-progress i',{scaleX:0},{scaleX:1,duration:1.1,stagger:.2,ease:'power2.out'},66.8);
reveal('#progression .profile-choices',68.0);
reveal('.usage-panel',89.1,{rotationY:6});reveal('.steering-right',89.5,{x:65});
tl.fromTo('#steering .product-progress i',{scaleX:0},{scaleX:1,duration:1.1,stagger:.3,ease:'power3.out'},90);
// Theme values are read from the actual compiled DaisyUI themes.
const themeTokens={};
for(const name of ['ocean','sage','aurora']){
  const css=getComputedStyle(document.getElementById('choice-'+name));themeTokens[name]={};
  for(const token of ['primary','primary-content','secondary','secondary-content','accent','neutral','neutral-content','base-100','base-200','base-300','base-content','success','error']) themeTokens[name]['--color-'+token]=css.getPropertyValue('--color-'+token).trim();
}
reveal('.theme-product',97.1,{rotationY:-7,z:-80});reveal('.theme-choices',97.1);
tl.fromTo('#theme-product',themeTokens.ocean,{...themeTokens.sage,duration:.65,immediateRender:false},99.0);
tl.to('#theme-product',{...themeTokens.aurora,duration:.65},101.0);
[['ocean',97.1],['sage',99.0],['aurora',101.0]].forEach(([name,start])=>{
  tl.fromTo('#choice-'+name,{x:0},{x:18,duration:.35},start);
  if(name!=='aurora')tl.to('#choice-'+name,{x:0,duration:.35},start+1.7);
});
// Studio closing reuses the animated ANDRIA identity.
// CursorGlowCard's real blurred span: animate its position on the frame clock,
// replacing pointer/spring time only. No React hydration, socket or API at runtime.


// Fade from assembled pixels to the exact, seamless source logo.
[['#intro-logo',0],['#intro-logo-2',116]].forEach(([selector,start])=>{
  tl.fromTo(selector+' .logo-settled',{opacity:0},{opacity:1,duration:.22,ease:'power2.inOut'},start+1.1);
  tl.to(selector+' > .brand-svg:not(.logo-settled)',{opacity:0,duration:.22},start+1.1);
});
window.__timelines=window.__timelines||{};
window.__timelines.main=tl;
tl.fromTo("#intro-logo-2", {rotationY:-12,scale:.96}, {rotationY:0,scale:1,duration:1.1,ease:'power3.out'}, 116);


// New interactions below use the current scene clock.
for(const method of Object.keys(originalTimelineMethods)) tl[method]=originalTimelineMethods[method];

// Each pointer follows actual UI controls. Measure layout once during setup;
// animation, clicks and feedback then remain deterministic on timeline seeks.
// CSS zoom scales a box and everything inside it, while offsets are reported in
// the box's own units: weight every offset by the zoom in effect at that node.
const effectiveZoom=(node)=>{
  let zoom=1;
  for(let current=node;current&&current.nodeType===1;current=current.parentElement)zoom*=Number.parseFloat(getComputedStyle(current).zoom)||1;
  return zoom;
};
const controlPoint=(element)=>{
  let x=0,y=0,node=element;
  while(node){const zoom=effectiveZoom(node);x+=(node.offsetLeft||0)*zoom;y+=(node.offsetTop||0)*zoom;node=node.offsetParent;}
  const zoom=effectiveZoom(element);
  return {x:x+element.offsetWidth*zoom*.78,y:y+element.offsetHeight*zoom*.58};
};
const cursorPaths=new Map();
const cursorScene=(id,actions)=>{
  const scene=document.getElementById(id),pointer=scene.querySelector('.scene-pointer'),ring=scene.querySelector('.scene-click');
  const start=sourceSceneClocks[scene.id].start,duration=sourceSceneClocks[scene.id].duration;
  // Embedded scenes are initially hidden. Expose their layout only while
  // measuring, without painting them or changing playback visibility.
  const previousDisplay=scene.style.display,previousVisibility=scene.style.visibility;
  scene.style.display='block';scene.style.visibility='hidden';
  const points=actions.map(([offset,selector,point,kind='click'])=>({offset,element:scene.querySelector(selector),point,kind})).filter(a=>a.element&&a.kind==='click').map(a=>({...a,...(a.point||controlPoint(a.element))}));
  scene.style.display=previousDisplay;scene.style.visibility=previousVisibility;
  if(!points.length)return;
  points.forEach((point,index)=>{
    const click=start+point.offset;
    const previous=points[index-1];
    const travel=id==='structure'?.5:(previous?Math.min(.65,point.offset-previous.offset-.6):.6);
    const from=id==='structure'?{x:point.x+32,y:point.y+18}:(previous||{x:point.x+40,y:point.y+35});
    const paths=cursorPaths.get(id)||[];paths.push({click,travel,from,to:point});cursorPaths.set(id,paths);
    tl.fromTo(pointer,{opacity:0,x:from.x,y:from.y,scale:1},{opacity:1,x:point.x,y:point.y,scale:1,duration:travel,ease:'power2.inOut',immediateRender:false},click-travel);
    tl.fromTo(point.element,{boxShadow:'0 0 0 0px color-mix(in srgb,var(--color-primary) 0%,transparent)'},{boxShadow:'0 0 0 3px color-mix(in srgb,var(--color-primary) 35%,transparent)',duration:.12,immediateRender:false},click);
    tl.to(point.element,{boxShadow:'0 0 0 0px color-mix(in srgb,var(--color-primary) 0%,transparent)',duration:.3},click+.16);
    tl.to(pointer,{scale:id==='structure'?.94:.90,duration:.12},click);
    tl.to(pointer,{scale:1,duration:.18},click+.13);
    // Pin the pulse with identical coordinates in both states: shared transform
    // tweens must never restore it to the canvas origin during a seek/replay.
    const pulse={x:point.x+3*34/28-22,y:point.y+2*42/36-22};
    tl.fromTo(ring,{...pulse,scale:.35,opacity:.55},{...pulse,scale:1.3,opacity:0,duration:.45,immediateRender:false},click);
    tl.to(pointer,{opacity:0,duration:.2},click+.32);
  });
};
cursorScene('structure',[
  [4.7,'#face-0 .list-row:nth-child(2)',{x:1435,y:497}],
  [6.05,'#face-formation .list-row:nth-child(4)',{x:1435,y:801}],
  [7.4,'#face-1 .list-row:nth-child(2)',{x:1435,y:497}],
  [8.75,'#face-2 .list-row:nth-child(3)',{x:1435,y:649}],
  [10.1,'#face-3 .list-row:nth-child(2)',{x:1435,y:497}],
  [11.45,'#face-4 .list-row:nth-child(3)',{x:1435,y:649}],
]);
cursorScene('author',[[1.0,'.editor-tools >span:nth-of-type(5)'],[2.1,'.editor-tools >span:nth-of-type(6)'],[3.3,'.editor-tools >span:nth-of-type(7)']]);
cursorScene('assistant',[[2.9,'#ask-selection'],[3.0,'.chat-input',null,'focus'],[7.0,'.chat-source strong',null,'focus'],[9.0,'#chat-quiz .product-button']]);
cursorScene('assess',[[2.0,'#answer-1']]);
cursorScene('assignments',[[1.3,'.file-row',null,'focus'],[3.1,'#correction .score',null,'focus'],[5.0,'#correction .submission-status',null,'focus']]);
cursorScene('organize',[[1.3,'.calendar-tabs b',null,'focus'],[2.4,'.calendar-day:nth-child(2) .calendar-event'],[4.3,'.operation-bottom .product-row',null,'focus'],[6.0,'.operation-bottom .fixture-glow:last-child .product-row',null,'focus']]);
cursorScene('progression',[[1.1,'.resume-lesson',null,'focus'],[2.8,'.profile-choices',null,'focus'],[4.3,'.profile-choices .feature-pill',null,'focus']]);
cursorScene('steering',[[1.3,'.usage-total',null,'focus'],[3.0,'.usage-row',null,'focus'],[5.0,'.steering-right .product-row',null,'focus']]);
cursorScene('personalize',[[1.8,'#choice-sage'],[3.8,'#choice-aurora']]);
// Complete registration after all interactions have joined the root timeline.
window.__timelines.main=tl;


// A compact floating sidebar unfolds, then the camera follows each build.
tl.fromTo('#dashboards .scene-heading',{opacity:0,y:24},{opacity:1,y:0,duration:.6,ease:'power3.out'},99);
tl.fromTo('.floating-sidebar',{opacity:0,x:-8,z:55,rotationY:4,rotationX:1},{opacity:1,x:0,z:65,rotationY:0,rotationX:0,duration:.65,ease:'power2.out'},99.1);
tl.set('.sidebar-identity',{scale:.38},99);
tl.set('.sidebar-layout>small,.dashboard-navigation a>span:last-child,.dashboard-profile>div',{opacity:0,x:-8},99);
tl.set('#dashboard-nav-admin',{opacity:0},99);
tl.set('.sidebar-surface-middle',{scaleX:0},99);
tl.set('.sidebar-surface-right',{x:0},99);
tl.set('.sidebar-active-surface',{scaleX:56/292},99);
tl.set('.sidebar-profile-divider',{scaleX:56/292},99);
tl.set('.dashboard-navigation a>span:first-of-type,.dashboard-profile>.avatar',{x:6.5},99);
tl.to('.dashboard-navigation a>span:first-of-type,.dashboard-profile>.avatar',{x:0,duration:.8,ease:'sine.inOut'},100.1);
tl.to('.sidebar-surface-middle',{scaleX:1,duration:.8,ease:'sine.inOut'},100.1);
tl.to('.sidebar-surface-right',{x:236,duration:.8,ease:'sine.inOut'},100.1);
tl.to('.sidebar-active-surface,.sidebar-profile-divider',{scaleX:1,duration:.8,ease:'sine.inOut'},100.1);
tl.to('.sidebar-identity',{scale:1,duration:.8,ease:'sine.inOut'},100.1);
tl.to('.sidebar-layout>small,.dashboard-navigation a>span:last-child,.dashboard-profile>div',{opacity:1,x:0,duration:.4,ease:'sine.inOut'},100.9);
tl.fromTo('.dashboard-board',{opacity:0,z:-55,rotationY:2},{opacity:1,z:0,rotationY:0,duration:.6,ease:'power2.out'},100.35);
// One continuous camera advance: no repeated push-pull as cards appear.
// Cards land like the level plates: from the front, turning slightly in plane.
let dashboardDrop=0;
const buildDashboard=()=>{/* landings are built with the slabs in the dashboards block below */};
buildDashboard('#dashboard-student .dashboard-header',100.55);
buildDashboard('#dash-resume',100.9);buildDashboard('#dash-calendar',101.25);
buildDashboard('#dash-paths',101.6);buildDashboard('#dash-skills',101.95);
tl.fromTo('#dashboard-student .product-progress i',{scaleX:0},{scaleX:1,duration:.9,ease:'power2.out'},101.2);
tl.to('#dashboard-student',{opacity:0,duration:.6,ease:'sine.inOut'},104);
tl.to('#dashboard-nav-student',{opacity:0,duration:.6,ease:'sine.inOut'},104);
tl.set('#dashboard-teacher',{opacity:0},99);
tl.fromTo('#dashboard-teacher',{opacity:0},{opacity:1,duration:.6,ease:'sine.inOut',immediateRender:false},104);
tl.to('#dashboard-nav-admin',{opacity:1,duration:.6,ease:'sine.inOut'},104);

buildDashboard('#dashboard-teacher .dashboard-header',104);
buildDashboard('#dash-actions',104.1);buildDashboard('#dash-alerts',104.45);
buildDashboard('#dash-latest',104.8);buildDashboard('#dash-feedback',105.15);
tl.fromTo('.dashboard-caption',{opacity:0,y:14},{opacity:1,y:0,duration:.5},102);
cursorScene('dashboards',[[1.8,'#dashboard-nav-student li:first-child',null,'focus'],[4.1,'#dash-resume .dashboard-resume',null,'focus'],[6.6,'#dash-paths .product-row',null,'focus'],[8.8,'#dashboard-nav-admin li:first-child',null,'focus'],[10.5,'#dash-actions .product-row',null,'focus'],[12.0,'#dash-alerts small',null,'focus'],[14.0,'#dash-feedback .product-button',null,'focus']]);
window.__timelines.main=tl;



// Shared examples explain relationships using real LXP presentation fixtures.
Object.assign(sourceSceneClocks,{groups:{start:115,duration:16},trainers:{start:131,duration:16},tags:{start:147,duration:16}});
for(const [id,start] of [['groups',115],['trainers',131],['tags',147]]){
  tl.fromTo('#'+id+' .scene-heading,#'+id+' .relationship-subtitle',{opacity:0,y:18},{opacity:1,y:0,duration:.55,ease:'power2.out'},start);
  tl.fromTo('#'+id+' .relationship-stage',{z:-80,rotationY:-3,rotationX:2},{z:0,rotationY:0,rotationX:0,duration:1.1,ease:'power2.out'},start+.15);
  tl.fromTo('#'+id+' .relationship-card',{opacity:0,y:24,z:-65},{opacity:1,y:0,z:0,duration:.65,stagger:.18,ease:'power2.out'},start+.15);
  tl.fromTo('#'+id+' .relationship-caption',{opacity:0,y:10},{opacity:1,y:0,duration:.45,ease:'power2.out'},start+10);
}
tl.set('#group-january',{opacity:0},115);
tl.set('#group-choice-october',{backgroundColor:'var(--color-base-300)'},115);
for(const [at,previous,next] of [[118.05,'october','january'],[123.05,'january','october']]){
  tl.to('#group-'+previous,{opacity:0,z:-16,duration:.3,ease:'sine.inOut'},at);
  tl.fromTo('#group-'+next,{opacity:0,z:25},{opacity:1,z:0,duration:.45,ease:'power2.out',immediateRender:false},at+.08);
  tl.to('#group-choice-'+previous,{backgroundColor:'var(--color-base-100)',duration:.25},at);
  tl.to('#group-choice-'+next,{backgroundColor:'var(--color-base-300)',duration:.25},at);
}
tl.set('#team-group .relationship-native-teachers ul,#team-january,#team-saved',{opacity:0},131);
tl.to('#team-save',{backgroundColor:'var(--color-success)',color:'var(--color-success-content)',duration:.35},134.15);
tl.fromTo('#team-saved',{opacity:0,y:8},{opacity:1,y:0,duration:.4,ease:'power2.out',immediateRender:false},134.15);
tl.fromTo('#team-group .relationship-native-teachers ul',{opacity:0,y:12},{opacity:1,y:0,duration:.55,ease:'power2.out',immediateRender:false},134.25);
tl.fromTo('#team-january',{opacity:0,y:14},{opacity:1,y:0,duration:.55,ease:'power2.out',immediateRender:false},137.5);
tl.to('#team-group .fixture-glow',{borderColor:'var(--color-success)',duration:.4},134.25);
tl.set('#tags .relationship-content-tag',{opacity:0},147);
tl.fromTo('#tags .relationship-content-tag',{opacity:0,scale:.95,y:8},{opacity:1,scale:1,y:0,duration:.4,stagger:.3,ease:'power2.out',immediateRender:false},150.2);
tl.to('#tag-choice',{boxShadow:'0 0 0 3px color-mix(in srgb,var(--color-primary) 35%,transparent)',duration:.25},150.15);
cursorScene('groups',[[3,'#group-choice-january'],[8,'#group-choice-october']]);
cursorScene('trainers',[[3.1,'#team-save']]);
cursorScene('tags',[[3.1,'#tag-choice']]);

// Drag an I-beam over the passage before offering the contextual AI action.
const selectionScene=document.getElementById('assistant');
const selectionDisplay=selectionScene.style.display,selectionVisibility=selectionScene.style.visibility;
selectionScene.style.display='block';selectionScene.style.visibility='hidden';
// The text caret follows the highlight line by line. Lines are measured against
// the reading panel, so transforms applied to the panels do not shift them.
const caret=selectionScene.querySelector('.selection-cursor');
const readingPanel=selectionScene.querySelector('.reading-panel'),selectionUnit=1920/document.getElementById('root').getBoundingClientRect().width;
let panelX=0,panelY=0;
for(let node=readingPanel;node;node=node.offsetParent){const zoom=effectiveZoom(node);panelX+=(node.offsetLeft||0)*zoom;panelY+=(node.offsetTop||0)*zoom;}
const panelRect=readingPanel.getBoundingClientRect();
const selectionLines=[...selectionScene.querySelector('.selection-text').getClientRects()].map(rect=>({left:panelX+(rect.left-panelRect.left)*selectionUnit,right:panelX+(rect.right-panelRect.left)*selectionUnit,middle:panelY+(rect.top-panelRect.top+rect.height/2)*selectionUnit}));
const selectionLength=selectionLines.reduce((sum,line)=>sum+line.right-line.left,0);
selectionScene.querySelector('.scene-inner').appendChild(caret);
const placeCaret=(progress)=>{
  let distance=progress*selectionLength;
  for(const [index,line] of selectionLines.entries()){
    const width=line.right-line.left;
    if(distance<=width||index===selectionLines.length-1){caret.style.transform=`translate(${line.left+Math.min(distance,width)-12}px,${line.middle-28}px)`;return;}
    distance-=width;
  }
};
let caretProgress=0;
const caretProxy={get n(){return caretProgress;},set n(value){caretProgress=value;placeCaret(value);}};
selectionScene.style.display=selectionDisplay;selectionScene.style.visibility=selectionVisibility;
tl.set('.selection-highlight',{scaleX:0},26);
tl.set('.selection-cursor',{opacity:0},26);
tl.set(caretProxy,{n:0},26);
tl.set('#ask-selection',{opacity:0},26);
tl.to('.selection-cursor',{opacity:1,duration:.18},27);
tl.set('.selection-text',{backgroundSize:'0% 100%'},26);
tl.fromTo('.selection-text',{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',duration:.95,ease:'sine.inOut',immediateRender:false},27.15);
tl.fromTo(caretProxy,{n:0},{n:1,duration:.95,ease:'sine.inOut',immediateRender:false},27.15);
tl.to('.selection-cursor',{opacity:0,duration:.2},28.1);
tl.fromTo('#ask-selection',{opacity:0,y:10,scale:.98},{opacity:1,y:0,scale:1,duration:.4,ease:'power2.out',immediateRender:false},28.1);


// Email preferences and administration are demonstrated without sending mail.
Object.assign(sourceSceneClocks,{emails:{start:163,duration:18},instance:{start:181,duration:18}});
for(const [id,start] of [['emails',163],['instance',181]]){
  tl.fromTo('#'+id+' .scene-heading,#'+id+' .relationship-subtitle',{opacity:0,y:18},{opacity:1,y:0,duration:.55,ease:'power2.out'},start);
  tl.fromTo('#'+id+' .relationship-stage',{z:-80,rotationY:-3,rotationX:2},{z:0,rotationY:0,rotationX:0,duration:1.1,ease:'power2.out'},start+.15);
  tl.fromTo('#'+id+' .relationship-card,#'+id+' #instance-preview',{opacity:0,y:24,z:-65},{opacity:1,y:0,z:0,duration:.65,stagger:.18,ease:'power2.out'},start+.15);
  tl.fromTo('#'+id+' .relationship-caption',{opacity:0,y:10},{opacity:1,y:0,duration:.45,ease:'power2.out'},start+12);
}


// Celebrate a real course accomplishment, then open its journal history.
Object.assign(sourceSceneClocks,{accomplishments:{start:199,duration:16}});
tl.fromTo('#accomplishments .scene-heading,#accomplishments .relationship-subtitle',{opacity:0,y:18},{opacity:1,y:0,duration:.55,ease:'power2.out'},199);
tl.fromTo('#accomplishments .relationship-stage',{z:-80,rotationY:-3,rotationX:2},{z:0,rotationY:0,rotationX:0,duration:1.1,ease:'power2.out'},199.15);
tl.fromTo('#accomplishments .relationship-card',{opacity:0,y:24,z:-65},{opacity:1,y:0,z:0,duration:.65,stagger:.18,ease:'power2.out'},199.15);
tl.set('#accomplishment-sent,#accomplishment-toast,#accomplishment-journal',{opacity:0},199);
tl.fromTo('#accomplishment-sent',{opacity:0,y:8},{opacity:1,y:0,duration:.4,ease:'power2.out',immediateRender:false},202.2);
tl.fromTo('#accomplishment-toast',{opacity:0,y:14,z:20},{opacity:1,y:0,z:0,duration:.45,ease:'power2.out',immediateRender:false},202.3);
tl.to('#accomplishment-congratulate',{backgroundColor:'var(--color-success)',color:'var(--color-success-content)',duration:.35},202.2);
tl.to('#accomplishment-overview',{opacity:0,y:-12,duration:.3},207.15);
tl.fromTo('#accomplishment-journal',{opacity:0,y:18,z:-25},{opacity:1,y:0,z:0,duration:.5,ease:'power2.out',immediateRender:false},207.25);
tl.to('#accomplishment-toast',{opacity:0,y:8,duration:.25},206.75);
tl.fromTo('#accomplishments .relationship-caption',{opacity:0,y:10},{opacity:1,y:0,duration:.45,ease:'power2.out'},208);
cursorScene('accomplishments',[[3.1,'#accomplishment-congratulate'],[8.1,'#accomplishment-open-journal']]);
// Fixed particle indices replace browser-clock physics so Studio seeks/replay
// reproduce the local feedback burst and the learner's full-screen confetti.
const celebrationPoint=cursorPaths.get('accomplishments')[0].to;
document.querySelectorAll('#accomplishments .accomplishment-confetti').forEach((particle,i)=>{
  const burst=i<40,j=burst?i:i-40,phase=j*2.3999632297;
  const x=burst?celebrationPoint.x:1020+(j*127%760);
  const y=burst?celebrationPoint.y:245-(j*31%160);
  const dx=burst?Math.cos(phase)*(65+(j*29%190)):Math.sin(phase)*110;
  const peak=burst?y-100-(j*13%140):y+175;
  const at=202.13+(j%7)*.035+(burst?0:.18);
  tl.fromTo(particle,{x,y,opacity:0,rotation:j*19,rotationX:0,scale:.7},{x:x+dx*.55,y:peak,opacity:1,rotation:j*19+100,rotationX:170,scale:1,duration:burst?.6:.8,ease:burst?'power2.out':'sine.in',immediateRender:false},at);
  tl.to(particle,{x:x+dx,y:burst?y+130:890,rotation:j*19+360,rotationX:540,duration:burst?1.3:2.3,ease:'power1.in'},at+(burst?.6:.8));
  tl.to(particle,{opacity:0,duration:.35},at+(burst?1.55:2.75));
});
tl.set('#accomplishments .relationship-stage',{rotationY:0},215);

// Only retained clicks create visible outcomes: quiz preview and event detail.
tl.fromTo('#chat-quiz-preview',{opacity:0,y:8},{opacity:1,y:0,duration:.45,ease:'power3.out'},35.1);
tl.to('#chat-quiz-preview',{opacity:0,y:-12,duration:.25},37.6);
tl.fromTo('#calendar-event-preview',{opacity:0,y:8},{opacity:1,y:0,duration:.45,ease:'power3.out'},55.5);
tl.to('#calendar-event-preview',{opacity:0,y:-12,duration:.25},57.1);
window.__timelines.main=tl;

// Reproduce CursorGlowCard's slow autoGlow orbit and pointer response on the
// seekable film clock. Layout is measured while hidden scenes are exposed;
// nothing depends on live mouse events or requestAnimationFrame callbacks.
const glowLayout=(card)=>{
  let x=0,y=0,scale=1,node=card;
  while(node&&node.id!=='root'){
    if(node.classList.contains('native-card')){x*=1.82;y*=1.82;scale*=1.82;}
    x+=node.offsetLeft||0;y+=node.offsetTop||0;node=node.offsetParent;
  }
  return {x,y,scale,width:card.clientWidth,height:card.clientHeight};
};
const pointerEase=gsap.parseEase('power2.inOut');
document.querySelectorAll('.fixture-glow,.native-card>.group').forEach((card,index)=>{
  const glow=card.querySelector(':scope>div:first-child>span');if(!glow)return;
  const scene=card.closest('.scene'),start=sourceSceneClocks[scene.id].start,duration=sourceSceneClocks[scene.id].duration;
  const previousDisplay=scene.style.display,previousVisibility=scene.style.visibility;
  scene.style.display='block';scene.style.visibility='hidden';
  const box=glowLayout(card);
  scene.style.display=previousDisplay;scene.style.visibility=previousVisibility;
  const paths=cursorPaths.get(scene.id)||[],phase=index*.43;
  const state=(elapsed)=>{
    const time=start+elapsed;
    let x=box.width*(.5+.34*Math.sin(elapsed*.32+phase));
    let y=box.height*(.5+.29*Math.sin(elapsed*.23+1+phase));
    let strength=0;
    for(const path of paths){
      if(time<path.click-path.travel||time>path.click+.52)continue;
      const progress=Math.min(1,Math.max(0,(time-path.click+path.travel-.06)/path.travel));
      const eased=pointerEase(progress);
      const px=path.from.x+(path.to.x-path.from.x)*eased;
      const py=path.from.y+(path.to.y-path.from.y)*eased;
      const localX=(px-box.x)/box.scale,localY=(py-box.y)/box.scale;
      if(localX<0||localY<0||localX>box.width||localY>box.height)continue;
      strength=Math.min(1,progress*3)*Math.max(0,Math.min(1,(path.click+.52-time)/.2));
      x+=(localX-x)*strength;y+=(localY-y)*strength;
    }
    return {x,y,scale:2.4,opacity:(.35+.35*strength)*Math.min(1,elapsed/.45)};
  };
  const samples=new Set([0,duration]);
  for(let time=.2;time<duration;time+=.2)samples.add(Number(time.toFixed(3)));
  for(const path of paths)for(const time of [path.click-path.travel,path.click,path.click+.32,path.click+.52])if(time>=start&&time<=start+duration)samples.add(time-start);
  const times=[...samples].sort((a,b)=>a-b);
  tl.set(glow,{...state(0),xPercent:-50,yPercent:-50},start);
  for(let i=1;i<times.length;i++)tl.to(glow,{...state(times[i]),duration:times[i]-times[i-1],ease:'none'},start+times[i-1]);
});
window.__timelines.main=tl;

// The real launcher arrives with the app's motion, then becomes the camera's focus.
tl.fromTo('#dashboard-chatbot>button',{opacity:0,x:40,scale:.95},{opacity:1,x:0,scale:1,duration:.45,ease:'power2.out'},100.9);
tl.to('#dashboard-chatbot svg',{rotation:-6,y:-2,duration:.5,ease:'sine.inOut'},103);
tl.to('#dashboard-chatbot svg',{rotation:0,y:0,duration:.5,ease:'sine.inOut'},103.5);
tl.to('.dashboard-camera',{x:-384,y:-360,scale:3.6,duration:1.45,ease:'power2.inOut'},108.3);
tl.to('#dashboards .scene-heading,#dashboards .presentation-roles,.dashboard-caption',{opacity:0,duration:.65,ease:'sine.inOut'},108.3);
tl.to('.dashboard-stage',{opacity:0,duration:1,ease:'sine.inOut'},108.3);
tl.to('#dashboard-chatbot svg',{rotation:-8,y:-2,duration:.4,ease:'sine.inOut'},109.8);
tl.to('#dashboard-chatbot svg',{rotation:5,y:0,duration:.5,ease:'sine.inOut'},110.2);
tl.to('#dashboard-chatbot svg',{rotation:0,duration:.4,ease:'sine.inOut'},110.7);
tl.fromTo('.dashboard-chatbot-message',{opacity:0,x:16},{opacity:1,x:0,duration:.5,ease:'power2.out'},109.8);
// A centered shutter briefly closes the native eyes without rotating their strokes.
tl.fromTo('#dashboard-eye-shutter-left,#dashboard-eye-shutter-right',
  {attr:{y:12,height:4}},{attr:{y:13.98,height:.04},duration:.1,ease:'power1.inOut',immediateRender:false},110.35);
tl.fromTo('#dashboard-eye-shutter-left,#dashboard-eye-shutter-right',
  {attr:{y:13.98,height:.04}},{attr:{y:12,height:4},duration:.14,ease:'power1.out',immediateRender:false},110.5);
window.__timelines.main=tl;

// The dedicated chatbot shares the native launcher's small greeting and blink.
tl.fromTo('#assistant-avatar',{scale:.88,rotation:-8},{scale:1,rotation:0,duration:.45,ease:'power2.out'},26.5);
tl.to('#assistant-avatar',{rotation:-6,y:-1.5,duration:.35,ease:'sine.inOut'},30.2);
tl.to('#assistant-avatar',{rotation:0,y:0,duration:.4,ease:'sine.inOut'},30.55);
tl.fromTo('#assistant-eye-shutter-left,#assistant-eye-shutter-right',{attr:{y:12,height:4}},{attr:{y:13.98,height:.04},duration:.1,ease:'power1.inOut',immediateRender:false},30.65);
tl.fromTo('#assistant-eye-shutter-left,#assistant-eye-shutter-right',{attr:{y:13.98,height:.04}},{attr:{y:12,height:4},duration:.14,ease:'power1.out',immediateRender:false},30.8);
// Remove idle tails without speeding up motion, clicks or readable content.
tl.set('#tags .relationship-stage',{rotationY:0},163);
const idleCuts=[[23.5, 26], [44, 46], [51, 53], [59.5, 62], [67, 69], [80.5, 85], [90, 93]];
const compactTime=(time)=>time-idleCuts.reduce((sum,[start,end])=>sum+(time>start?Math.max(0,Math.min(time,end)-start):0),0);
const authoredTweens=tl.getChildren(false,true,true).map(tween=>({tween,start:tween.startTime(),end:tween.startTime()+tween.totalDuration()}));
for(const {tween,start,end} of authoredTweens){
  tween.totalDuration(Math.max(0,compactTime(end)-compactTime(start)));
  tween.startTime(compactTime(start));
}
// Slower pedagogical levels: the scene lasts 19 s instead of 14 s, every
// movement and pointer stretched alike; the following scenes start 5 s later.
{
  const structure=document.getElementById('structure'),from=3,before=14,after=19,ratio=after/before;
  for(const tween of tl.getChildren(false,true,false)){
    const inside=tween.targets?.().some(target=>target instanceof Element&&structure.contains(target));
    const start=tween.startTime();
    if(inside&&start>=from){tween.totalDuration(tween.totalDuration()*ratio);tween.startTime(from+(start-from)*ratio);}
    else if(!inside&&start>=from+before)tween.startTime(start+after-before);
  }
}
window.__timelines.main=tl;

// Shared stacking, in presentation time, as in the pedagogical levels: each
// panel lands from the front with a slight in-plane turn, then stays flat.
const sceneStages=[['author','.editor-layout'],['assistant','.assistant-layout'],['assess','.assessment-layout'],['assignments','.two-panels'],['organize','.operations'],['progression','.progression-layout'],['steering','.steering-layout'],['personalize','.theme-layout'],['groups','.relationship-stage'],['trainers','.relationship-stage'],['tags','.relationship-stage']];
sceneStages.forEach(([id,selector])=>{
  const scene=document.getElementById(id),stage=scene?.querySelector(selector);
  if(!stage)return;
  const start=Number(scene.dataset.start),duration=Number(scene.dataset.duration);
  const panels=[...stage.children].filter(element=>getComputedStyle(element).display!=='none');
  // The landing replaces each panel's former entrance, so nothing ends tilted.
  for(const tween of tl.getChildren(false,true,false)){
    const time=tween.startTime();
    if(time<start-.1||time>start+1.6)continue;
    // Only the panels lose their former entrance; other targets of a shared tween keep it.
    const own=tween.targets?.().filter(target=>panels.includes(target))||[];
    if(own.length)tween.kill(own);
  }
  panels.forEach((panel,index)=>{
    const turn=index%2?3:-3;
    tl.fromTo(panel,{opacity:0,z:460,y:-18,x:turn*3,rotation:turn,rotationX:0,rotationY:0},{opacity:1,z:0,y:0,x:0,rotation:0,rotationX:0,rotationY:0,duration:.8,ease:'back.out(1.25)',immediateRender:false},start+.15+index*.16);
    tl.set(panel,{opacity:0},start-.01);
  });
  tl.set(stage,{rotationX:0,rotationY:0,rotation:0},start);
  tl.to(stage,{opacity:0,z:-80,duration:.4,ease:'power2.in'},start+duration-.4);
  tl.set(stage,{opacity:1,z:0},start-.01);
});

// The tile player seeks with suppressed callbacks, so form values are driven by
// tweens on properties: a proxy setter writes the text on every render.
const textProxy=(write)=>{let value=0;return {get n(){return value;},set n(next){value=next;write(next);}};};
const typeInto=(element,text,from,to)=>{
  const proxy=textProxy(n=>{element.value=text.slice(0,Math.round(n));});
  tl.set(proxy,{n:0},from-.02);
  tl.fromTo(proxy,{n:0},{n:text.length,duration:to-from,ease:'none',immediateRender:false},from);
};
// Care, around the genuine FeelingFeedback card (presentation time). It lands
// on the plane of the stacked levels, its icon turning in relief, then faces
// the reader: the mood slides to rain, a comment is sent, the team acknowledges
// the alert and the same 3D icon morphs to the sun.
{
  const scene=document.getElementById('care'),S=Number(scene.dataset.start),D=Number(scene.dataset.duration);
  const inner=scene.querySelector('.scene-inner'),icon=document.getElementById('feeling-3d');
  const range=document.getElementById('feeling-range'),comment=document.getElementById('feeling-comment');
  const form=document.getElementById('feeling-form'),levels=[1,2,3,4,5].map(n=>icon.getAttribute('data-level-'+n));
  // The drag is shown continuously; the component itself keeps its 1 to 5 scale.
  range.step='any';
  const display=scene.style.display,visibility=scene.style.visibility;
  scene.style.display='block';scene.style.visibility='hidden';
  const root=document.getElementById('root').getBoundingClientRect(),unit=1920/root.width;
  const base=inner.getBoundingClientRect();
  const at=(element,fx=.5,fy=.5)=>{const r=element.getBoundingClientRect();return {x:(r.left-base.left+r.width*fx)*unit,y:(r.top-base.top+r.height*fy)*unit};};
  const thumb=(value)=>{const r=range.getBoundingClientRect(),size=r.height;return {x:(r.left-base.left+size/2+(r.width-size)*(value-1)/4)*unit,y:(r.top-base.top+r.height/2)*unit};};
  // The learner's card and the team's alert share the same top and height.
  {
    const card=document.querySelector('#feeling-card .feeling-zoom>div').getBoundingClientRect(),stage=scene.querySelector('.care-stage').getBoundingClientRect(),panel=document.getElementById('risk-panel');
    // The stage is zoomed: its children's CSS lengths are scaled by that zoom.
    const stageZoom=effectiveZoom(scene.querySelector('.care-stage'));
    panel.style.top=((card.top-stage.top)*unit/stageZoom)+'px';
    panel.style.height=(card.height*unit/stageZoom)+'px';
  }
  const centred=358;
  const shift=(point)=>({x:point.x+centred*effectiveZoom(scene.querySelector('.care-stage')),y:point.y});
  const points={from:shift(thumb(3)),to:shift(thumb(2)),comment:shift(at(comment,.3,.5)),send:shift(at(document.getElementById('feeling-send'))),review:at(document.getElementById('review-button'),.6,.55)};
  scene.style.display=display;scene.style.visibility=visibility;
  const pointer='#care .scene-pointer',ring='#care .scene-click',tip=(point)=>({x:point.x-3.6,y:point.y-2.3});
  const click=(point,time)=>{
    tl.to(pointer,{scale:.92,duration:.1},time);tl.to(pointer,{scale:1,duration:.16},time+.1);
    tl.fromTo(ring,{x:point.x-22,y:point.y-22,scale:.35,opacity:.6},{x:point.x-22,y:point.y-22,scale:1.4,opacity:0,duration:.45,immediateRender:false},time);
  };
  const T={flatten:1.3,press:2.8,drag:2.9,dragEnd:3.5,comment:4.2,typing:4.3,typed:5.3,send:5.8,slide:6.4,alert:6.6,review:8.2,sun:9.2};
  // The thumb value itself is tweened, so the range really slides on every seek.
  tl.set(range,{value:3},S-.02);
  tl.fromTo(range,{value:3},{value:2,duration:T.dragEnd-T.drag,ease:'power2.inOut',immediateRender:false},S+T.drag);
  typeInto(comment,'Je bloque sur la dernière leçon.',S+T.typing,S+T.typed);
  const mood=textProxy(n=>icon.setAttribute('aria-label',['Ressenti : nuageux avec éclaircies','Ressenti : pluie','Ressenti : soleil'][Math.round(n)]));
  tl.set(mood,{n:0},S-.02);tl.set(mood,{n:1},S+T.drag+.3);tl.set(mood,{n:2},S+T.sun);
  // 1. Same view as the stacked levels: the card lands, its icon turns in relief.
  tl.set('.care-stage',{rotationX:54,rotation:-12,scale:.82,y:30,opacity:1},S-.01);
  tl.fromTo('.care-stage',{rotationX:54,rotation:-12,scale:.82,y:30},{rotationX:50,rotation:-8,scale:.84,y:30,duration:T.flatten,ease:'sine.inOut',immediateRender:false},S);
  tl.to('.care-stage',{rotationX:0,rotation:0,scale:1,y:0,duration:1,ease:'power3.inOut'},S+T.flatten);
  tl.set('#feeling-card',{opacity:0},0);
  tl.fromTo('#feeling-card',{opacity:0,x:centred-12,z:480,y:-18,rotation:-4},{opacity:1,x:centred,z:0,y:0,rotation:0,duration:.85,ease:'back.out(1.25)',immediateRender:false},S+.2);
  tl.fromTo(icon,{transformPerspective:320,rotationY:-180,scale:.6,z:0},{rotationY:0,scale:1,z:0,duration:1.1,ease:'power3.out',immediateRender:false},S+.5);
  // 2. The thumb really slides to the rainy mood: the icon morphs and lifts out.
  tl.fromTo(pointer,{opacity:0,...tip({x:points.from.x+70,y:points.from.y+60}),scale:1},{opacity:1,...tip(points.from),duration:.5,ease:'power2.inOut',immediateRender:false},S+T.press-.5);
  tl.to(pointer,{scale:.92,duration:.1},S+T.press);
  tl.to(pointer,{...tip(points.to),duration:T.dragEnd-T.drag,ease:'power2.inOut'},S+T.drag);
  tl.to(pointer,{scale:1,duration:.16},S+T.dragEnd);
  tl.to('#feeling-card .feeling-path',{morphSVG:levels[1],duration:.7,ease:'power2.inOut'},S+T.drag+.2);
  tl.fromTo(icon,{rotationY:0},{rotationY:360,duration:1.05,ease:'power2.inOut',immediateRender:false},S+T.drag+.15);
  tl.to(icon,{scale:1.9,z:70,duration:.5,ease:'power2.out'},S+T.drag+.15);
  tl.to(icon,{scale:1,z:0,duration:.55,ease:'power2.in'},S+T.drag+.65);
  // 3. A comment, then Envoyer: a toast confirms while the form stays in place.
  tl.to(pointer,{...tip(points.comment),duration:.5,ease:'power2.inOut'},S+T.comment-.5);
  click(points.comment,S+T.comment);
  tl.to(pointer,{...tip(points.send),duration:.45,ease:'power2.inOut'},S+T.send-.45);
  click(points.send,S+T.send);
  tl.to(pointer,{opacity:0,duration:.25},S+T.send+.3);
  // The mood card keeps its full size after sending; only the toast confirms.
  tl.set('#care-toast',{opacity:0,xPercent:-50},0);
  tl.fromTo('#care-toast',{opacity:0,xPercent:-50,y:-14},{opacity:1,xPercent:-50,y:0,duration:.35,ease:'power2.out',immediateRender:false},S+T.send+.2);
  tl.to('#care-toast',{opacity:0,y:-10,duration:.3},S+T.send+1.2);
  // 4. The learner card slides aside, flat; the team alert lands next to it.
  tl.to('#feeling-card',{x:0,duration:.8,ease:'power3.inOut'},S+T.slide);
  tl.set('#risk-panel',{opacity:0},0);
  tl.fromTo('#risk-panel',{opacity:0,x:9,z:480,y:-18,rotation:3,rotationX:0,rotationY:0},{opacity:1,x:0,z:0,y:0,rotation:0,rotationX:0,rotationY:0,duration:.85,ease:'back.out(1.25)',immediateRender:false},S+T.alert);
  tl.fromTo(pointer,{opacity:0,...tip({x:points.review.x+90,y:points.review.y+80})},{opacity:1,...tip(points.review),duration:.5,ease:'power2.inOut',immediateRender:false},S+T.review-.5);
  click(points.review,S+T.review);
  tl.to(pointer,{opacity:0,duration:.25},S+T.review+.35);
  const ack=S+T.review+.05;
  tl.to('.alert-ack-idle',{opacity:0,duration:.15},ack);
  tl.to('.alert-ack-confirmed',{opacity:1,duration:.2},ack);
  tl.to('#risk-panel .fixture-glow>div:first-child>span',{backgroundColor:'color-mix(in srgb,var(--color-success) 40%,transparent)',duration:.4,ease:'sine.inOut'},ack);
  tl.to('#risk-panel .alert-group',{borderColor:'color-mix(in srgb,var(--color-success) 30%,transparent)',duration:.4},ack);
  tl.to('#risk-panel .alert-group>strong,#risk-panel .risk-badge',{color:'var(--color-success)',duration:.4},ack);
  tl.to('#risk-panel .risk-badge',{borderColor:'var(--color-success)',duration:.4},ack);
  tl.to('#risk-panel .alert-state-pending',{opacity:0,duration:.15},ack);
  tl.to('#risk-panel .alert-state-resolved',{opacity:1,duration:.2},ack);
  // 5. Supported, the rain turns to sun with the same relief and spin.
  tl.to('#feeling-card .feeling-path',{morphSVG:levels[4],duration:.8,ease:'power2.inOut'},S+T.sun+.05);
  tl.fromTo(icon,{rotationY:0},{rotationY:360,duration:1.1,ease:'power2.inOut',immediateRender:false},S+T.sun);
  tl.to(icon,{scale:2,z:80,duration:.55,ease:'power2.out'},S+T.sun);
  tl.to(icon,{scale:1,z:0,duration:.6,ease:'power2.in'},S+T.sun+.55);
  tl.set('#care .care-caption',{opacity:0},0);
  tl.fromTo('#care .care-caption',{opacity:0,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out',immediateRender:false},S+T.sun+.4);
  tl.to('.care-stage',{opacity:0,duration:.4,ease:'power2.in'},S+D-.4);
}
// Cards and headers get the sidebar's treatment: three glass layers that give way to a solid pane.
for(const element of document.querySelectorAll('#dashboards .dash-build,#dashboards .dashboard-header')){
  for(const layer of ['back','mid','front','solid']){
    const slab=document.createElement('div');
    slab.className='card-slab card-slab-'+layer;slab.setAttribute('aria-hidden','true');
    element.prepend(slab);
  }
}
// Dashboards, built like a product reveal: the compact sidebar lands as liquid
// glass, unfolds, then the board settles and the chatbot arrives last.
{
  const scene=document.getElementById('dashboards'),S=Number(scene.dataset.start),E=S+Number(scene.dataset.duration);
  const inScene=(tween)=>tween.targets&&tween.targets().some(target=>target instanceof Element&&scene.contains(target));
  const tweens=tl.getChildren(false,true,false).filter(inScene);
  const first=(test)=>tweens.find(test);
  const has=(tween,selector)=>tween.targets().some(target=>target.matches?.(selector));
  // Replace the short entrances; the expansion and every later build keep their order.
  first(t=>has(t,'.floating-sidebar')&&t.startTime()<S+.5)?.kill();
  first(t=>has(t,'.dashboard-board')&&t.vars.opacity===1)?.kill();
  first(t=>has(t,'#dashboard-chatbot>button')&&t.vars.opacity===1)?.kill();
  // Make room for the landing: later tweens keep their sequence, about 10 % faster.
  const from=S+.5,to=S+1.7,k=(E-to)/(E-from),map=(time)=>time<from?time:to+(time-from)*k;
  for(const tween of tl.getChildren(false,true,false).filter(inScene)){
    const start=tween.startTime();
    if(start<from||start>=E)continue;
    tween.totalDuration(tween.totalDuration()*k);
    tween.startTime(map(start));
  }
  const zoomStart=tweens.find(t=>has(t,'.dashboard-camera')).startTime();
  // 1. The compact sidebar lands delicately, turning in full 3D, as glass.
  tl.fromTo('.floating-sidebar',{opacity:0,x:-24,y:-30,z:620,rotationX:0,rotationY:0,rotation:-8},{opacity:1,x:0,y:0,z:65,rotationX:0,rotationY:0,rotation:0,duration:1.2,ease:'back.out(1.2)',immediateRender:false},S+.2);
  tl.set('.floating-sidebar',{opacity:0},0);
  // 2. Once unfolded, the glass takes the real sidebar colour beneath its sheen.
  const solid='.floating-sidebar>.sidebar-surface:not(.sidebar-glass)';
  tl.set(solid,{opacity:0},0);
  tl.fromTo(solid,{opacity:0},{opacity:1,duration:1.1,ease:'sine.inOut',immediateRender:false},map(S+1.95));
  // The glass pane follows the real expansion, then leaves the genuine sidebar.
  const expansion=tl.getChildren(false,true,false).find(t=>t.targets?.().some(target=>target.classList?.contains('sidebar-surface-middle'))&&t.vars.scaleX===1);
  if(expansion){
    tl.set('.sidebar-solid-pane',{opacity:0},0);
    tl.to('.sidebar-solid-pane',{opacity:1,duration:.2},expansion.startTime()+expansion.duration());
  }
  if(expansion)tl.fromTo('.sidebar-glass-pane',{width:104},{width:340,duration:expansion.duration(),ease:expansion.vars.ease,immediateRender:false},expansion.startTime());
  tl.to('.sidebar-glass-front',{opacity:0,duration:1.1,ease:'sine.inOut'},map(S+1.95));
  // 3. The board settles in depth after the sidebar.
  tl.fromTo('.dashboard-board',{opacity:0,z:0,rotationY:0},{opacity:1,z:0,rotationY:0,duration:.3,ease:'sine.out',immediateRender:false},S+.3);
  tl.set('.dashboard-board',{z:0,rotationY:0},S-.01);
  tl.set('.dashboard-board',{opacity:0},0);
  // 4. The chatbot arrives only once the whole interface is straight again, before its greeting.
  tl.fromTo('#dashboard-chatbot>button',{opacity:0,x:110,y:40,scale:.4,rotation:-28},{opacity:1,x:0,y:0,scale:1,rotation:0,duration:.8,ease:'back.out(1.7)',immediateRender:false},zoomStart-.6);
  tl.set('#dashboard-chatbot>button',{opacity:0},0);
  // The camera first holds on the sidebar while it lands and unfolds, then pulls back
  // as the cards stack; the interface keeps a gentle tilt so its relief stays visible.
  const pull=S+2.4,focus={x:1204,y:22,scale:1.6};
  tl.fromTo('.dashboard-camera',{...focus},{...focus,duration:pull-S,ease:'none',immediateRender:false},S);
  tl.fromTo('.dashboard-camera',{...focus},{x:0,y:0,scale:1,duration:1.1,ease:'power2.inOut',immediateRender:false},pull);
  tl.set('.dashboard-camera',{...focus},S-.01);
  tl.fromTo('.dashboard-stage',{rotationX:54,rotation:-12,scale:.95,x:110,y:20},{rotationX:48,rotation:-6,scale:.95,x:50,y:20,duration:pull-S,ease:'sine.inOut',immediateRender:false},S);
  tl.set('.dashboard-stage',{rotationX:54,rotation:-12,scale:.95,x:110,y:20},S-.01);
  tl.fromTo('.dashboard-stage',{rotationX:48,rotation:-6,scale:.95,x:50,y:20},{rotationX:26,rotation:-3,scale:.94,x:-20,y:10,duration:1.9,ease:'power2.inOut',immediateRender:false},pull);
  // The elements land once the camera has pulled back, already in their final colours. The learner's
  // elements are then taken off one by one and the team's are put in their place. Opacity is only
  // animated on the slab's children, never on the slab itself: group opacity would flatten its 3D.
  const student=['#dashboard-student .dashboard-header','#dash-resume','#dash-calendar','#dash-paths','#dash-skills'];
  const team=['#dashboard-teacher .dashboard-header','#dash-actions','#dash-alerts','#dash-latest','#dash-feedback'];
  const swap=tweens.find(t=>has(t,'#dashboard-student')&&t.vars.opacity===0);
  const swapAt=swap?swap.startTime():S+6;
  for(const face of tweens.filter(t=>t.targets().some(x=>x.id==='dashboard-student'||x.id==='dashboard-teacher')))face.kill();
  tl.set('#dashboard-student,#dashboard-teacher',{opacity:1},0);
  const place=(selector,index,start)=>{
    const element=scene.querySelector(selector),kids=[...element.children],turn=index%2?8:-8;
    tl.fromTo(element,{x:-turn*3,y:-30,z:360,rotation:turn},{x:0,y:0,z:65,rotation:0,duration:1.1,ease:'back.out(1.2)',immediateRender:false},start);
    tl.fromTo(kids,{opacity:0},{opacity:1,duration:.2,ease:'power1.out',immediateRender:false},start+.1);
  };
  // Each learner component flips edge-on and comes back, in the same place, as its team counterpart.
  const flip=(from,to,index,start)=>{
    const out=scene.querySelector(from),into=scene.querySelector(to),outKids=[...out.children],inKids=[...into.children],half=.4;
    tl.fromTo(out,{rotationY:0},{rotationY:90,duration:half,ease:'power2.in',immediateRender:false},start);
    tl.fromTo(outKids,{opacity:1},{opacity:0,duration:.01,immediateRender:false},start+half);
    tl.fromTo(inKids,{opacity:0},{opacity:1,duration:.01,immediateRender:false},start+half);
    tl.fromTo(into,{z:65,rotationY:-90},{z:65,rotationY:0,duration:.5,ease:'back.out(1.3)',immediateRender:false},start+half);
  };
  student.forEach((selector,index)=>place(selector,index,S+3.15+index*.2));
  student.forEach((selector,index)=>flip(selector,team[index],index,swapAt+index*.1));
  // Before the final zoom the whole interface stands straight again, in plain 2D: the
  // relief (elevation, slab thickness, sidebar depth) is set back as well as the tilt.
  const flat=zoomStart-1.8;
  tl.fromTo('.dashboard-stage',{rotationX:26,rotation:-3,scale:.94,x:-20,y:10},{rotationX:0,rotation:0,scale:1,x:0,y:0,duration:1.1,ease:'power3.inOut',immediateRender:false},flat);
  const teamEls=team.map(selector=>scene.querySelector(selector));
  tl.fromTo(teamEls,{z:65},{z:0,duration:1.1,ease:'power3.inOut',immediateRender:false},flat);
  tl.fromTo(teamEls.flatMap(el=>[...el.querySelectorAll(':scope>.card-slab')]),{opacity:1},{opacity:0,duration:1.1,ease:'power3.inOut',immediateRender:false},flat);
  tl.fromTo('.floating-sidebar',{z:65},{z:0,duration:1.1,ease:'power3.inOut',immediateRender:false},flat);
  tl.fromTo('.sidebar-glass-back,.sidebar-glass-mid',{opacity:1},{opacity:0,duration:1.1,ease:'power3.inOut',immediateRender:false},flat);
}

// Instance, as three plates in depth (presentation time): the settings plate
// drives two live previews. Each change leaves its setting as a beam of light
// and lands on the plate it affects, which then updates.
{
  const scene=document.getElementById('instance'),S=Number(scene.dataset.start),D=Number(scene.dataset.duration);
  const inner=scene.querySelector('.scene-inner');
  const display=scene.style.display,visibility=scene.style.visibility;
  scene.style.display='block';scene.style.visibility='hidden';
  const root=document.getElementById('root').getBoundingClientRect(),unit=1920/root.width,base=inner.getBoundingClientRect();
  const at=(id,fx=.5,fy=.55)=>{const r=document.getElementById(id).getBoundingClientRect();return {x:(r.left-base.left+r.width*fx)*unit,y:(r.top-base.top+r.height*fy)*unit};};
  const points={name:at('brand-name',.62,.5),aurora:at('brand-aurora',.5,.55),sage:at('brand-sage',.5,.55),contrast:at('brand-tpl-contrast',.5,.55)};
  scene.style.display=display;scene.style.visibility=visibility;
  const pointer='#instance .scene-pointer',ring='#instance .scene-click',tip=(point)=>({x:point.x-3.6,y:point.y-2.3});
  const moveClick=(point,time,from)=>{
    if(from)tl.fromTo(pointer,{opacity:0,...tip(from),scale:1},{opacity:1,...tip(point),duration:.55,ease:'power2.inOut',immediateRender:false},time-.55);
    else tl.to(pointer,{opacity:1,...tip(point),duration:.55,ease:'power2.inOut'},time-.55);
    tl.to(pointer,{scale:.92,duration:.1},time);tl.to(pointer,{scale:1,duration:.16},time+.1);
    tl.fromTo(ring,{x:point.x-22,y:point.y-22,scale:.35,opacity:.6},{x:point.x-22,y:point.y-22,scale:1.4,opacity:0,duration:.45,immediateRender:false},time);
  };
  const T={land:.15,name:2.2,typed:3.5,aurora:5.4,sage:8.0,template:10.6};
  // Plates land from the front, like the pedagogical levels; the previews keep a slight turn.
  const plates=[['#brand-source',{rotationY:0,z:0}],['#brand-app',{rotationY:-7,z:-50}],['#brand-mail',{rotationY:-7,z:20}]];
  plates.forEach(([selector,rest],index)=>{
    tl.set(selector,{opacity:0},S-.01);
    tl.fromTo(selector,{opacity:0,z:460,y:-18,rotationY:rest.rotationY+(index?-8:0)},{opacity:1,z:rest.z,y:0,rotationY:rest.rotationY,duration:.8,ease:'back.out(1.25)',immediateRender:false},S+T.land+index*.18);
  });
  // Themes act on the application plate, read from the compiled themes.
  tl.set('#brand-app',{...themeTokens.ocean},S-.01);
  // The e-mail keeps the organisation's identity: it wakes up when the name arrives.
  tl.set('#brand-mail .brand-sheet',{opacity:.35,filter:'grayscale(1)'},S-.01);
  tl.set('#brand-mail',{boxShadow:'0 30px 70px color-mix(in srgb,var(--color-neutral) 16%,transparent)'},S-.01);
  tl.set('#plate-contrast',{opacity:0,rotationY:90},S-.01);tl.set('#plate-minimal',{opacity:1,rotationY:0},S-.01);
  // A beam draws from its setting to its target, then fades; the target pulses.
  const links=scene.querySelector('.brand-links');
  const beam=(id,time,target)=>{
    const path=links.querySelector(id),length=path.getTotalLength(),travel=.85;
    // The streak grows along its curve behind a bright head, then is drawn in from its origin.
    const dot=document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('r','9');links.appendChild(dot);
    let progress=0;
    const head={get n(){return progress;},set n(value){progress=value;const point=path.getPointAtLength(value*length);dot.setAttribute('cx',point.x);dot.setAttribute('cy',point.y);}};
    tl.set(id,{strokeDashoffset:1,opacity:0},S-.01);
    tl.set(dot,{opacity:0},S-.01);tl.set(head,{n:0},S-.02);
    tl.set(id,{opacity:1},S+time);tl.set(dot,{opacity:1},S+time);
    tl.fromTo(id,{strokeDashoffset:1},{strokeDashoffset:0,duration:travel,ease:'power2.inOut',immediateRender:false},S+time);
    tl.fromTo(head,{n:0},{n:1,duration:travel,ease:'power2.inOut',immediateRender:false},S+time);
    tl.to(dot,{opacity:0,duration:.2},S+time+travel);
    tl.to(id,{strokeDashoffset:-1,duration:.7,ease:'power2.in'},S+time+travel+.1);
    tl.set(id,{opacity:0},S+time+travel+.8);
    if(target){
      tl.to(target,{boxShadow:'0 0 0 4px var(--color-primary), 0 30px 70px color-mix(in srgb,var(--color-primary) 30%,transparent)',duration:.25,ease:'power2.out'},S+time+travel-.1);
      tl.to(target,{boxShadow:'0 0 0 0px var(--color-primary), 0 30px 70px color-mix(in srgb,var(--color-neutral) 16%,transparent)',duration:.6,ease:'power2.inOut'},S+time+travel+.25);
    }
  };
  const select=(id,time)=>tl.fromTo(id,{borderColor:'var(--color-base-300)'},{borderColor:'var(--color-primary)',duration:.25,immediateRender:false},S+time);
  const deselect=(id,time)=>tl.to(id,{borderColor:'var(--color-base-300)',duration:.25},S+time);
  const press=(id,time)=>{
    tl.to(id,{transformPerspective:700,z:50,scale:1.06,duration:.2,ease:'power2.out'},S+time);
    tl.to(id,{z:0,scale:1,duration:.45,ease:'back.out(1.6)'},S+time+.25);
  };
  // 1. The name is typed: logo and name replace the default brand, and the e-mail follows.
  const name='Institut Horizon',nameText=document.getElementById('brand-name-text');
  moveClick(points.name,S+T.name,{x:points.name.x+160,y:points.name.y+120});
  tl.to('#instance .brand-bar',{opacity:1,duration:.1},S+T.name);
  const typing=textProxy(n=>{nameText.textContent=name.slice(0,Math.round(n));});
  tl.set(typing,{n:0},S-.02);
  tl.fromTo(typing,{n:0},{n:name.length,duration:T.typed-T.name-.2,ease:'none',immediateRender:false},S+T.name+.2);
  tl.to('#instance .brand-bar',{opacity:0,duration:.15},S+T.typed+.2);
  beam('#beam-identity',T.typed,'#brand-app');
  tl.to('#brand-logo-default',{opacity:0,duration:.3},S+T.typed+.8);
  tl.to('#brand-logo-org',{opacity:1,duration:.4},S+T.typed+.9);
  beam('#beam-identity-mail',T.typed+.1,'#brand-mail');
  tl.to('#brand-mail .brand-sheet',{opacity:1,filter:'grayscale(0)',duration:.5},S+T.typed+1.0);
  // 2. Two themes in a row: the application plate follows each one.
  const retheme=(point,chip,previous,theme,time,from)=>{
    moveClick(point,S+time,from);
    press(chip,time);deselect(previous,time);select(chip,time);
    beam('#beam-theme',time+.1,'#brand-app');
    tl.to('#brand-app',{...themeTokens[theme],duration:.7,ease:'sine.inOut'},S+time+.9);
  };
  retheme(points.aurora,'#brand-aurora','#brand-ocean','aurora',T.aurora,{x:points.name.x+10,y:points.name.y+10});
  retheme(points.sage,'#brand-sage','#brand-aurora','sage',T.sage,points.aurora);
  // 3. The e-mail template: the sheet turns over to the chosen model.
  moveClick(points.contrast,S+T.template,points.sage);
  press('#brand-tpl-contrast',T.template);deselect('#brand-tpl-minimal',T.template);select('#brand-tpl-contrast',T.template);
  beam('#beam-template',T.template+.1,'#brand-mail');
  tl.to('#plate-minimal',{opacity:0,rotationY:-90,duration:.35,ease:'power2.in'},S+T.template+1.0);
  tl.fromTo('#plate-contrast',{opacity:0,rotationY:90},{opacity:1,rotationY:0,duration:.5,ease:'power2.out',immediateRender:false},S+T.template+1.35);
  tl.to(pointer,{opacity:0,duration:.25},S+T.template+.5);
  // The settled plates fade out with the scene.
  tl.to('#instance .brand-stage',{opacity:0,duration:.4,ease:'power2.in'},S+D-.4);
  tl.set('#instance .brand-stage',{opacity:1},S-.01);
}
// Emails, in two numbered steps (presentation time): each trigger card lands,
// one click, and the e-mail it sends flies into place beside it.
{
  const scene=document.getElementById('emails'),S=Number(scene.dataset.start),D=Number(scene.dataset.duration);
  const inner=scene.querySelector('.scene-inner');
  const display=scene.style.display,visibility=scene.style.visibility;
  scene.style.display='block';scene.style.visibility='hidden';
  const root=document.getElementById('root').getBoundingClientRect(),unit=1920/root.width,base=inner.getBoundingClientRect();
  const at=(id,fx=.5,fy=.55)=>{const r=document.getElementById(id).getBoundingClientRect();return {x:(r.left-base.left+r.width*fx)*unit,y:(r.top-base.top+r.height*fy)*unit};};
  const points={weekly:at('email-weekly'),summary:at('email-summary-choice'),available:at('email-availability-choice')};
  scene.style.display=display;scene.style.visibility=visibility;
  const pointer='#emails .scene-pointer',ring='#emails .scene-click',tip=(point)=>({x:point.x-3.6,y:point.y-2.3});
  const moveClick=(point,time,from)=>{
    if(from)tl.fromTo(pointer,{opacity:0,...tip(from),scale:1},{opacity:1,...tip(point),duration:.5,ease:'power2.inOut',immediateRender:false},time-.5);
    else tl.to(pointer,{...tip(point),duration:.5,ease:'power2.inOut'},time-.5);
    tl.to(pointer,{scale:.92,duration:.1},time);tl.to(pointer,{scale:1,duration:.16},time+.1);
    tl.fromTo(ring,{x:point.x-22,y:point.y-22,scale:.35,opacity:.6},{x:point.x-22,y:point.y-22,scale:1.4,opacity:0,duration:.45,immediateRender:false},time);
  };
  const land=(target,time,turn)=>{
    tl.set(target,{opacity:0},S-.01);
    tl.fromTo(target,{opacity:0,z:460,y:-18,x:turn*3,rotation:turn},{opacity:1,z:0,y:0,x:0,rotation:0,duration:.8,ease:'back.out(1.25)',immediateRender:false},time);
  };
  const step=(id,trigger,button,mail,t0,clicks)=>{
    land('#'+id+' .mail-step-label',S+t0,-2);
    land('#'+id+' .mail-trigger',S+t0+.15,-3);
    clicks.forEach(([point,time],index)=>moveClick(point,S+time,index===0?{x:point.x+90,y:point.y+80}:null));
    const sent=S+clicks[clicks.length-1][1]+.05;
    tl.set('#'+button+' .mail-done',{display:'none'},S-.01);tl.set('#'+button+' .mail-idle',{display:'inline'},S-.01);
    tl.set('#'+button+' .mail-idle',{display:'none'},sent);tl.set('#'+button+' .mail-done',{display:'inline'},sent);
    tl.fromTo('#'+button,{backgroundColor:'var(--color-primary)'},{backgroundColor:'var(--color-success)',color:'var(--color-success-content)',duration:.3,immediateRender:false},sent);
    // The arrow button pops in, then the e-mail flies out of the trigger and lands like a plate.
    tl.set('#'+id+' .mail-arrow',{scale:.4,opacity:0},S-.01);
    tl.to('#'+id+' .mail-arrow',{scale:1,opacity:1,duration:.45,ease:'back.out(1.7)'},sent+.1);
    tl.set('#'+mail,{opacity:0},S-.01);
    tl.fromTo('#'+mail,{opacity:0,x:-520,y:20,z:300,scale:.35,rotation:-10},{opacity:1,x:0,y:0,z:0,scale:1,rotation:0,duration:1.1,ease:'back.out(1.15)',immediateRender:false},sent+.25);
    return sent;
  };
  const teamSent=step('mail-step-team','mail-trigger','email-summary-choice','mail-team',.2,[[points.weekly,1.7],[points.summary,3.1]]);
  // The first step steps back a little while the learners' step comes in.
  tl.to('#mail-step-team',{opacity:.55,duration:.5},teamSent+3.2);
  step('mail-step-learner','mail-trigger','email-availability-choice','mail-learner',7.4,[[points.available,9.2]]);
  tl.to('#mail-step-team',{opacity:1,duration:.5},S+12.6);
  tl.to(pointer,{opacity:0,duration:.25},S+9.6);
  tl.set('#mail-step-team',{opacity:1},S-.01);
  tl.to('#emails .mail-stage',{opacity:0,duration:.4,ease:'power2.in'},S+D-.4);
  tl.set('#emails .mail-stage',{opacity:1},S-.01);
}

// Accomplishments (presentation time): the two cards stack under the angle of
// the levels, then face the reader. Congratulating bursts 3D confetti from the
// button, a token arcs to the learner, the medal turns in relief, confetti rains.
{
  const scene=document.getElementById('accomplishments'),S=Number(scene.dataset.start),D=Number(scene.dataset.duration);
  const stage=scene.querySelector('.accomplishment-stage'),cards=[...stage.children];
  const inScene=(tween)=>tween.targets?.().some(target=>target instanceof Element&&scene.contains(target));
  for(const tween of tl.getChildren(false,true,false).filter(inScene)){
    const targets=tween.targets();
    const own=targets.filter(target=>cards.includes(target)||target===stage||target.classList?.contains('accomplishment-confetti'));
    if(own.length)tween.kill(own);
  }
  // Where the click and the learner's medal sit once the stage faces the reader.
  const display=scene.style.display,visibility=scene.style.visibility;
  scene.style.display='block';scene.style.visibility='hidden';
  const root=document.getElementById('root').getBoundingClientRect(),unit=1920/root.width,base=scene.querySelector('.scene-inner').getBoundingClientRect();
  const centre=(element)=>{const r=element.getBoundingClientRect();return {x:(r.left-base.left+r.width/2)*unit,y:(r.top-base.top+r.height/2)*unit};};
  const button=centre(document.getElementById('accomplishment-congratulate')),medal=centre(scene.querySelector('.accomplishment-medallion'));
  scene.style.display=display;scene.style.visibility=visibility;
  const click=S+3.13;
  tl.set(stage,{rotationX:54,rotation:-12,scale:.9,x:60,y:30},S-.01);
  tl.fromTo(stage,{rotationX:54,rotation:-12,scale:.9,x:60,y:30},{rotationX:50,rotation:-8,scale:.92,x:50,y:30,duration:1.3,ease:'sine.inOut',immediateRender:false},S);
  tl.to(stage,{rotationX:0,rotation:0,scale:1,x:0,y:0,duration:1,ease:'power3.inOut'},S+1.3);
  cards.forEach((card,index)=>{
    const turn=index%2?3:-3;
    tl.set(card,{opacity:0},S-.01);
    tl.fromTo(card,{opacity:0,z:460,y:-18,x:turn*3,rotation:turn,rotationX:0,rotationY:0},{opacity:1,z:0,y:0,x:0,rotation:0,rotationX:0,rotationY:0,duration:.8,ease:'back.out(1.25)',immediateRender:false},S+.15+index*.2);
  });
  // The completed course pops toward the viewer under the click.
  tl.to('#accomplishment-team .accomplishment-feedback',{transformPerspective:800,z:50,scale:1.03,duration:.25,ease:'power2.out'},click);
  tl.to('#accomplishment-team .accomplishment-feedback',{z:0,scale:1,duration:.5,ease:'back.out(1.6)'},click+.3);
  // A token carries the congratulations in a 3D arc to the learner.
  const token='#accomplishments .cheer-token';
  tl.set(token,{opacity:0,x:button.x-28,y:button.y-28,z:0,scale:.5},S-.01);
  tl.to(token,{opacity:1,scale:1,duration:.15},click+.05);
  tl.to(token,{keyframes:[{x:(button.x+medal.x)/2-28,y:Math.min(button.y,medal.y)-230,z:260,rotationY:180,scale:1.4,duration:.45,ease:'power2.out'},{x:medal.x-28,y:medal.y-28,z:0,rotationY:360,scale:.6,duration:.45,ease:'power2.in'}]},click+.1);
  tl.to(token,{opacity:0,duration:.12},click+1.0);
  // The medal answers by turning twice in relief.
  tl.fromTo('#accomplishments .accomplishment-medallion',{transformPerspective:600,rotationY:0,z:0,scale:1},{rotationY:720,z:90,scale:1.25,duration:1.1,ease:'power3.out',immediateRender:false},click+1.0);
  tl.to('#accomplishments .accomplishment-medallion',{z:0,scale:1,duration:.5,ease:'back.out(1.6)'},click+2.1);
  // 3D confetti: each piece tumbles on three axes; some fly toward the camera.
  // Festive colours are the confetti's own, independent of the tile theme, so
  // they stay visible whatever colour the host gives the sequence. Pieces
  // 0-59 burst from the button, 60-99 from the medal, 100+ rain across the scene.
  const colours=['#f59e0b','#10b981','#3b82f6','#ec4899','#8b5cf6','#ef4444','#facc15'];
  scene.querySelectorAll('.accomplishment-confetti').forEach((piece,i)=>{
    const group=i<60?0:i<100?1:2,j=group===2?i-100:group===1?i-60:i;
    const phase=j*2.3999632297,depth=((j*37)%11)/10;
    piece.style.background=colours[i%colours.length];
    const spinX=360*(2+j%3),spinY=360*(1+(j*7)%3),spinZ=(j%2?1:-1)*(180+(j*41)%360);
    // Every tween states its own start values: the player paints the end of the
    // scene first and then rewinds, and lazily recorded values would be stale.
    const rest=(at)=>tl.fromTo(piece,{opacity:0},{opacity:0,duration:.01,immediateRender:false},at);
    if(group<2){
      const origin=group===0?button:medal,start=(group===0?click+.02:click+1.05)+(j%6)*.02;
      const reach=260+(j*29)%520,up=300+(j*13)%360,z=-200+depth*700;
      const peak={x:origin.x+Math.cos(phase)*reach,y:origin.y-up,z,rotationX:spinX*.5,rotationY:spinY*.5,rotation:j*19+spinZ*.5,scale:1.1};
      const land={x:origin.x+Math.cos(phase)*reach*1.35,y:origin.y+560,z:z*.6,rotationX:spinX,rotationY:spinY,rotation:j*19+spinZ,scale:1.1};
      rest(start-.02);
      tl.fromTo(piece,{opacity:1,x:origin.x,y:origin.y,z:0,rotationX:0,rotationY:0,rotation:j*19,scale:.6},{opacity:1,...peak,duration:.9,ease:'power3.out',immediateRender:false},start);
      tl.fromTo(piece,{opacity:1,...peak},{opacity:1,...land,duration:2.6,ease:'power1.in',immediateRender:false},start+.9);
      tl.fromTo(piece,{opacity:1},{opacity:0,duration:.01,immediateRender:false},start+3.5);
    }else{
      // A steady shower from just after the click until the journal is open.
      const start=click+.9+j*.07,fall=2.8+depth*1.2,z=-300+depth*600,x=10+(j*197)%1900,drift=Math.sin(phase)*160;
      rest(start-.02);
      tl.fromTo(piece,{opacity:1,x,y:-80,z,rotationX:0,rotationY:0,rotation:j*23,scale:1},{opacity:1,x:x+drift,y:1120,z,rotationX:spinX,rotationY:spinY,rotation:j*23+spinZ,duration:fall,ease:'none',immediateRender:false},start);
      tl.fromTo(piece,{opacity:1},{opacity:0,duration:.01,immediateRender:false},start+fall);
    }
  });
  // One caption per step so the cause and effect read without prior context.
  const steps=[...scene.querySelectorAll('.accomplishment-step')],stepTimes=[[.5,3.0],[3.0,4.2],[4.2,8.0],[8.0,D-.4]];
  steps.forEach((step,index)=>{
    const [from,to]=stepTimes[index];
    tl.set(step,{opacity:0,y:12},S-.01);
    tl.fromTo(step,{opacity:0,y:12},{opacity:1,y:0,duration:.4,ease:'power2.out',immediateRender:false},S+from);
    tl.to(step,{opacity:0,y:-8,duration:.3,ease:'power2.in'},S+to-.3);
  });
  tl.to(stage,{opacity:0,duration:.4,ease:'power2.in'},S+D-.4);
  tl.set(stage,{opacity:1},S-.01);
}
window.__timelines.main=tl;
