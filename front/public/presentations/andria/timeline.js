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
  tl.fromTo('#rail-'+levelsForRail[index]+'>span',{scale:1,borderColor:'var(--color-base-300)'},{scale:1.14,borderColor:'var(--color-primary)',duration:.22,yoyo:true,repeat:1,ease:'sine.inOut'},time+.45);
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
  tl.to('#rail-'+level+'>span',{backgroundColor:'var(--color-primary)',color:'var(--color-primary-content)',duration:.25},start);
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
reveal('#organize .operation-bottom',59.0);
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
const controlPoint=(element)=>{
  let x=0,y=0,node=element;
  while(node){x+=node.offsetLeft||0;y+=node.offsetTop||0;node=node.offsetParent;}
  return {x:x+element.offsetWidth*.78,y:y+element.offsetHeight*.58};
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
  [4.7,'#face-0 .list-row:nth-child(2)',{x:1360,y:550}],
  [6.05,'#face-formation .list-row:nth-child(4)',{x:1360,y:826}],
  [7.4,'#face-1 .list-row:nth-child(2)',{x:1360,y:550}],
  [8.75,'#face-2 .list-row:nth-child(3)',{x:1360,y:688}],
  [10.1,'#face-3 .list-row:nth-child(2)',{x:1360,y:550}],
  [11.45,'#face-4 .list-row:nth-child(3)',{x:1360,y:688}],
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
const buildDashboard=(selector,time)=>{
  const turn=dashboardDrop++%2?3:-3;
  tl.fromTo(selector,{opacity:0,z:420,y:-18,x:turn*3,rotation:turn},{opacity:1,z:0,y:0,x:0,rotation:0,duration:.75,ease:'back.out(1.25)'},time);
};
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
const selectionWidth=document.getElementById('selected-passage').offsetWidth;
selectionScene.style.display=selectionDisplay;selectionScene.style.visibility=selectionVisibility;
tl.set('.selection-highlight',{scaleX:0},26);
tl.set('.selection-cursor',{opacity:0,x:0},26);
tl.set('#ask-selection',{opacity:0},26);
tl.to('.selection-cursor',{opacity:1,duration:.18},27);
tl.fromTo('.selection-highlight',{scaleX:0},{scaleX:1,duration:.95,ease:'sine.inOut',immediateRender:false},27.15);
tl.fromTo('.selection-cursor',{x:0},{x:selectionWidth,duration:.95,ease:'sine.inOut',immediateRender:false},27.15);
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
tl.set('#email-summary,#email-availability',{opacity:0},163);
tl.to('#email-waiting',{opacity:0,duration:.25},167.1);
tl.fromTo('#email-summary',{opacity:0,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out',immediateRender:false},167.2);
tl.to('#email-summary-choice',{backgroundColor:'var(--color-success)',color:'var(--color-success-content)',duration:.35},167.15);
tl.to('#email-summary',{opacity:0,y:-8,duration:.3},173.1);
tl.fromTo('#email-availability',{opacity:0,y:14},{opacity:1,y:0,duration:.5,ease:'power2.out',immediateRender:false},173.2);
tl.set('#instance-brand-custom,#instance-website,#instance-email-sample',{opacity:0},181);
tl.to('.instance-brand-default',{opacity:0,duration:.25},184.15);
tl.fromTo('#instance-brand-custom,#instance-website',{opacity:0,y:8},{opacity:1,y:0,duration:.45,ease:'power2.out',immediateRender:false},184.2);
const instanceBaseTokens=(name)=>Object.fromEntries(['base-100','base-200','base-300','base-content'].map(token=>['--color-'+token,themeTokens[name]['--color-'+token]]));
tl.to('#instance-preview',{...instanceBaseTokens('aurora'),duration:.65,ease:'sine.inOut'},187.15);
tl.to('#instance-aurora',{backgroundColor:'var(--color-base-300)',duration:.25},187.15);
tl.to('#instance-preview',{...instanceBaseTokens('ocean'),duration:.65,ease:'sine.inOut'},189.15);
tl.to('#instance-ocean',{backgroundColor:'var(--color-base-300)',duration:.25},189.15);
tl.fromTo('#instance-email-sample',{opacity:0,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out',immediateRender:false},192.2);
tl.to('#instance-banner',{backgroundColor:'var(--color-base-300)',borderColor:'var(--color-primary)',duration:.25},192.15);
tl.set('#instance .relationship-stage',{rotationY:0},199);
cursorScene('emails',[[4.1,'#email-summary-choice'],[10.1,'#email-availability-choice']]);
cursorScene('instance',[[3.1,'#instance-identity-save'],[6.1,'#instance-aurora'],[8.1,'#instance-ocean'],[11.1,'#instance-banner']]);


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
const sceneStages=[['author','.editor-layout'],['assistant','.assistant-layout'],['assess','.assessment-layout'],['assignments','.two-panels'],['organize','.operations'],['progression','.progression-layout'],['steering','.steering-layout'],['personalize','.theme-layout'],['groups','.relationship-stage'],['trainers','.relationship-stage'],['tags','.relationship-stage'],['emails','.relationship-stage'],['instance','.relationship-stage'],['accomplishments','.relationship-stage']];
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
    tl.fromTo(panel,{opacity:0,z:460,y:-18,x:turn*3,rotation:turn},{opacity:1,z:0,y:0,x:0,rotation:0,duration:.8,ease:'back.out(1.25)',immediateRender:false},start+.15+index*.16);
    tl.set(panel,{opacity:0},start-.01);
  });
  tl.set(stage,{rotationX:0,rotationY:0,rotation:0},start);
  tl.to(stage,{opacity:0,z:-80,duration:.4,ease:'power2.in'},start+duration-.4);
  tl.set(stage,{opacity:1,z:0},start-.01);
});

// Care, rebuilt around the genuine FeelingFeedback card (presentation time).
// The learner shares a rainy mood and a comment, the team acknowledges the
// alert, then the same 3D icon morphs to the sun.
{
  const scene=document.getElementById('care'),S=Number(scene.dataset.start);
  const inner=scene.querySelector('.scene-inner'),icon=document.getElementById('feeling-3d');
  const range=document.getElementById('feeling-range'),comment=document.getElementById('feeling-comment');
  const form=document.getElementById('feeling-form'),levels=[1,2,3,4,5].map(n=>icon.getAttribute('data-level-'+n));
  // Measure controls at rest, in scene coordinates, with the scene laid out but unpainted.
  const display=scene.style.display,visibility=scene.style.visibility;
  scene.style.display='block';scene.style.visibility='hidden';
  const root=document.getElementById('root').getBoundingClientRect(),unit=1920/root.width;
  const base=inner.getBoundingClientRect();
  const at=(element,fx=.5,fy=.5)=>{const r=element.getBoundingClientRect();return {x:(r.left-base.left+r.width*fx)*unit,y:(r.top-base.top+r.height*fy)*unit};};
  const thumb=(value)=>{const r=range.getBoundingClientRect(),size=r.height;return {x:(r.left-base.left+size/2+(r.width-size)*(value-1)/4)*unit,y:(r.top-base.top+r.height/2)*unit};};
  const centred=358,formHeight=form.offsetHeight;
  const shift=(point)=>({x:point.x+centred,y:point.y});
  const points={from:shift(thumb(3)),to:shift(thumb(2)),comment:shift(at(comment,.3,.5)),send:shift(at(document.getElementById('feeling-send'))),review:at(document.getElementById('review-button'),.6,.55)};
  scene.style.display=display;scene.style.visibility=visibility;
  const pointer='#care .scene-pointer',ring='#care .scene-click';
  const tip=(point)=>({x:point.x-3.6,y:point.y-2.3});
  const click=(point,time)=>{
    tl.to(pointer,{scale:.92,duration:.1},time);tl.to(pointer,{scale:1,duration:.16},time+.1);
    tl.fromTo(ring,{x:point.x-22,y:point.y-22,scale:.35,opacity:.6},{x:point.x-22,y:point.y-22,scale:1.4,opacity:0,duration:.45,immediateRender:false},time);
  };
  // Form values follow the scene clock, so every seek shows the same state.
  const text='Je bloque sur la dernière leçon.',clock={p:0};
  tl.fromTo(clock,{p:0},{p:1,duration:Number(scene.dataset.duration),ease:'none',immediateRender:false,onUpdate:()=>{
    const t=tl.time()-S;
    range.value=String(t<2.3?3:2);
    comment.value=text.slice(0,Math.round(Math.min(1,Math.max(0,(t-3.5)/1.1))*text.length));
    icon.setAttribute('aria-label',t<2.3?'Ressenti : nuageux avec éclaircies':t<9.4?'Ressenti : pluie':'Ressenti : soleil');
  }},S);
  // 1. The genuine card arrives in depth, centred, its icon turning in relief.
  tl.fromTo('#feeling-card',{opacity:0,x:centred-12,z:480,y:-18,rotation:-4},{opacity:1,x:centred,z:0,y:0,rotation:0,duration:.85,ease:'back.out(1.25)',immediateRender:false},S+.3);
  tl.set('#feeling-card',{opacity:0},0);
  tl.fromTo(icon,{transformPerspective:320,rotationY:-180,scale:.6},{rotationY:0,scale:1,duration:1,ease:'power3.out',immediateRender:false},S+.6);
  // 2. The learner drags the range to the rainy mood: the icon morphs and lifts out.
  tl.fromTo(pointer,{opacity:0,...tip({x:points.from.x+70,y:points.from.y+60}),scale:1},{opacity:1,...tip(points.from),duration:.5,ease:'power2.inOut',immediateRender:false},S+1.4);
  click(points.from,S+1.95);
  tl.to(pointer,{...tip(points.to),duration:.45,ease:'power2.inOut'},S+2.05);
  tl.to('#feeling-card .feeling-path',{morphSVG:levels[1],duration:.7,ease:'power2.inOut'},S+2.25);
  tl.fromTo(icon,{rotationY:0},{rotationY:360,duration:1,ease:'power2.inOut',immediateRender:false},S+2.2);
  tl.to(icon,{scale:1.9,z:70,duration:.5,ease:'power2.out'},S+2.2);
  tl.to(icon,{scale:1,z:0,duration:.55,ease:'power2.in'},S+2.7);
  // 3. A comment, then Envoyer: as in the LXP, the form closes and a toast confirms.
  tl.to(pointer,{...tip(points.comment),duration:.5,ease:'power2.inOut'},S+2.9);
  click(points.comment,S+3.4);
  tl.to(pointer,{...tip(points.send),duration:.5,ease:'power2.inOut'},S+4.7);
  click(points.send,S+5.2);
  tl.to(pointer,{opacity:0,duration:.25},S+5.5);
  tl.fromTo(form,{height:formHeight,opacity:1},{height:0,opacity:0,duration:.45,ease:'power2.inOut',immediateRender:false},S+5.35);
  tl.fromTo('#care-toast',{opacity:0,xPercent:-50,y:-14},{opacity:1,xPercent:-50,y:0,duration:.35,ease:'power2.out',immediateRender:false},S+5.4);
  tl.set('#care-toast',{opacity:0,xPercent:-50},0);
  tl.to('#care-toast',{opacity:0,y:-10,duration:.3},S+6.6);
  // 4. The learner card steps back in depth while the team alert comes forward.
  tl.to('#feeling-card',{x:-60,z:-320,opacity:.35,duration:.9,ease:'power3.inOut'},S+5.9);
  tl.set('#risk-panel',{opacity:0},0);
  tl.fromTo('#risk-panel',{opacity:0,x:9,z:480,y:-18,rotation:3},{opacity:1,x:0,z:0,y:0,rotation:0,duration:.85,ease:'back.out(1.25)',immediateRender:false},S+6.0);
  tl.fromTo(pointer,{opacity:0,...tip({x:points.review.x+90,y:points.review.y+80})},{opacity:1,...tip(points.review),duration:.5,ease:'power2.inOut',immediateRender:false},S+7.3);
  click(points.review,S+7.8);
  tl.to(pointer,{opacity:0,duration:.25},S+8.15);
  tl.to('.alert-ack-idle',{opacity:0,duration:.15},S+7.85);
  tl.to('.alert-ack-confirmed',{opacity:1,duration:.2},S+7.85);
  tl.to('#risk-panel .fixture-glow>div:first-child>span',{backgroundColor:'color-mix(in srgb,var(--color-success) 40%,transparent)',duration:.4,ease:'sine.inOut'},S+7.85);
  tl.to('#risk-panel .alert-group',{borderColor:'color-mix(in srgb,var(--color-success) 30%,transparent)',duration:.4},S+7.85);
  tl.to('#risk-panel .alert-group>strong,#risk-panel .risk-badge',{color:'var(--color-success)',duration:.4},S+7.85);
  tl.to('#risk-panel .risk-badge',{borderColor:'var(--color-success)',duration:.4},S+7.85);
  tl.to('#risk-panel .alert-state-pending',{opacity:0,duration:.15},S+7.85);
  tl.to('#risk-panel .alert-state-resolved',{opacity:1,duration:.2},S+7.85);
  // 5. Supported, the learner comes back to the front and the rain turns to sun.
  tl.to('#feeling-card',{x:0,z:0,opacity:1,duration:.9,ease:'power3.inOut'},S+8.5);
  tl.to('#feeling-card .feeling-path',{morphSVG:levels[4],duration:.8,ease:'power2.inOut'},S+9.45);
  tl.fromTo(icon,{rotationY:0},{rotationY:360,duration:1.1,ease:'power2.inOut',immediateRender:false},S+9.4);
  tl.to(icon,{scale:2,z:80,duration:.55,ease:'power2.out'},S+9.4);
  tl.to(icon,{scale:1,z:0,duration:.6,ease:'power2.in'},S+9.95);
  tl.fromTo('#care .care-caption',{opacity:0,y:12},{opacity:1,y:0,duration:.5,ease:'power2.out',immediateRender:false},S+9.6);
  tl.set('#care .care-caption',{opacity:0},0);
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
  // 1. The compact sidebar lands delicately, turning in full 3D, as glass.
  tl.fromTo('.floating-sidebar',{opacity:0,x:-24,y:-30,z:620,rotationX:0,rotationY:0,rotation:-8},{opacity:1,x:0,y:0,z:65,rotationX:0,rotationY:0,rotation:0,duration:1.2,ease:'back.out(1.2)',immediateRender:false},S+.2);
  tl.set('.floating-sidebar',{opacity:0},0);
  // 2. Once unfolded, the glass takes the real sidebar colour beneath its sheen.
  const solid='.floating-sidebar>.sidebar-surface:not(.sidebar-glass)';
  tl.set(solid,{opacity:0},0);
  tl.fromTo(solid,{opacity:0},{opacity:1,duration:1.1,ease:'sine.inOut',immediateRender:false},map(S+1.95));
  // The glass pane follows the real expansion, then leaves the genuine sidebar.
  const expansion=tl.getChildren(false,true,false).find(t=>t.targets?.().some(target=>target.classList?.contains('sidebar-surface-middle'))&&t.vars.scaleX===1);
  if(expansion)tl.fromTo('.sidebar-glass-pane',{width:104},{width:340,duration:expansion.duration(),ease:expansion.vars.ease,immediateRender:false},expansion.startTime());
  tl.to('.sidebar-glass',{opacity:0,duration:1.1,ease:'sine.inOut'},map(S+1.95));
  // 3. The board settles in depth after the sidebar.
  tl.fromTo('.dashboard-board',{opacity:0},{opacity:1,duration:.3,ease:'sine.out',immediateRender:false},map(S+1.35));
  tl.set('.dashboard-board',{opacity:0},0);
  // 4. The chatbot arrives once the cards are in place, before its greeting.
  tl.fromTo('#dashboard-chatbot>button',{opacity:0,x:110,y:40,scale:.4,rotation:-28},{opacity:1,x:0,y:0,scale:1,rotation:0,duration:.8,ease:'back.out(1.7)',immediateRender:false},map(S+3.4));
  tl.set('#dashboard-chatbot>button',{opacity:0},0);
}
window.__timelines.main=tl;
