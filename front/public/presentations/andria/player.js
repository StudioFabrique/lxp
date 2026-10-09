const sequences=[[{"id": "structure", "start": 3.0, "duration": 19.0}], [{"id": "personalize", "start": 79.5, "duration": 6.0}], [{"id": "assistant", "start": 28.5, "duration": 12.0}], [{"id": "steering", "start": 74.5, "duration": 5.0}], [{"id": "author", "start": 22.0, "duration": 6.5}], [{"id": "assess", "start": 40.5, "duration": 6.0}], [{"id": "organize", "start": 51.5, "duration": 6.5}], [{"id": "care", "start": 63.0, "duration": 11.5}], [{"id": "dashboards", "start": 85.5, "duration": 13.0}], [{"id": "progression", "start": 58.0, "duration": 5.0}], [{"id": "groups", "start": 101.5, "duration": 16.0}], [{"id": "trainers", "start": 117.5, "duration": 16.0}], [{"id": "tags", "start": 133.5, "duration": 16.0}], [{"id": "emails", "start": 149.5, "duration": 18.0}], [{"id": "instance", "start": 167.5, "duration": 18.0}], [{"id": "accomplishments", "start": 185.5, "duration": 16.0}]];
const opening={"id": "identity", "start": 0.0, "duration": 3.0};
/* Sidebar tutorial, presentation only: the film stops once the sidebar is unfolded and glass windows in 3D
   explain its entries one by one. Around each explanation, excerpts of the real components the entry leads to
   (cloned from the film's own screens) float in depth, joined to the entry by fine curves, while the camera moves.
   The last button resumes the sequence. Never loaded with data on the login tiles. */
(() => {
  let steps = [];
  let state = null;
  const SVG = 'http://www.w3.org/2000/svg';
  const make = (tag, className) => Object.assign(document.createElement(tag), {className});
  const clamp = (value, min, max) => Math.min(Math.max(value, min), Math.max(min, max));
  const role = new URLSearchParams(location.search).get('role') === 'student' ? 'student' : 'team';
  // Slow, different camera moves for the successive entries: a pan and a slight turn of the interface.
  const MOVES = [
    {x: 0, y: 0, scale: 0, rotationX: 0, rotation: 0},
    {x: -50, y: -24, scale: .08, rotationX: 3, rotation: -1.5},
    {x: 30, y: -44, scale: .04, rotationX: -2, rotation: 1.5},
    {x: -20, y: 14, scale: .1, rotationX: 2, rotation: -2},
  ];
  // The real components each sidebar entry leads to, taken from the film's screens (first match of each selector).
  const EXCERPTS = {
    team: {
      home: ['#dash-actions .fixture-glow', '#dash-latest .fixture-glow', '#dash-alerts .fixture-glow'],
      user: ['#group-january', '#team-group .relationship-card', '#team-group'],
      group: ['#team-group', '#group-october'],
      parcours: ['#face-1 .native-card', '#face-formation .native-card', '#group-parcours'],
      module: ['#face-2 .native-card', '#face-1 .native-card', '#face-3 .native-card'],
      course: ['#face-3 .native-card', '#face-4 .native-card', '#face-2 .native-card'],
      calendar: ['#organize .calendar-panel', '#calendar-event-preview', '#organize .operation-bottom .fixture-glow:nth-child(2)'],
      evaluations: ['#correction', '#assignments .work-panel', '#risk-panel .fixture-glow'],
      resource: ['#organize .operation-bottom .fixture-glow', '#steering .steering-right .fixture-glow'],
      role: ['#organize .operation-bottom .fixture-glow:nth-child(2)', '#team-group', '#group-october'],
      tag: ['#tag-library', '#tags .relationship-card', '#tag-choice'],
      mediatheque: ['#organize .operation-bottom .fixture-glow', '#author .palette'],
    },
    student: {
      home: ['#dash-resume .fixture-glow', '#dash-paths .fixture-glow', '#dash-skills .fixture-glow'],
      parcours: ['#dash-paths .fixture-glow', '#face-1 .native-card'],
      calendar: ['#organize .calendar-panel', '#calendar-event-preview'],
      assignments: ['#assignments .work-panel', '#correction'],
      resources: ['#organize .operation-bottom .fixture-glow', '#steering .steering-right .fixture-glow'],
    },
  };
  // Where the excerpts float around the explanation, relative to it: [dx, dy from its right/top, anchor] and tilt.
  const SLOTS = [
    {at: 'below-left', rotationY: -10, rotation: -1.5, z: 30},
    {at: 'above-right', rotationY: -12, rotation: 1, z: 50},
    {at: 'below-right', rotationY: -8, rotation: 1.5, z: 0},
  ];
  const CHIP_WIDTH = 420;
  const CHIP_MAX_HEIGHT = 230;
  // Sizes are left to the layout (copied pixel widths wrap the text differently); only the excerpt's root keeps its own.
  const SKIP = new Set(['width', 'height', 'inline-size', 'block-size', 'perspective-origin', 'transform', 'opacity', 'transition', 'animation', 'will-change', 'perspective', 'transform-style', 'transform-origin', 'filter']);
  // A frozen copy of a real component: its computed styles are copied one by one, so it keeps its look away from its screen.
  const snapshot = el => {
    const scene = el.closest('section.scene');
    const was = scene.style.display;
    scene.style.display = 'block';
    const view = el.ownerDocument.defaultView;
    const clone = el.cloneNode(true);
    clone.querySelectorAll('.pointer-events-none.absolute, .card-slab').forEach(extra => extra.remove());
    const originals = [el, ...el.querySelectorAll('*')].filter(node => !node.matches('.pointer-events-none.absolute, .card-slab') && !node.closest('.pointer-events-none.absolute, .card-slab'));
    const copies = [clone, ...clone.querySelectorAll('*')];
    const size = {width: el.offsetWidth, height: el.offsetHeight};
    originals.forEach((original, index) => {
      const copy = copies[index];
      const computed = view.getComputedStyle(original);
      let css = '';
      for (const property of computed) if (!SKIP.has(property)) css += `${property}:${computed.getPropertyValue(property)};`;
      copy.removeAttribute('id');
      copy.style.cssText = css;
      // Elements the timeline keeps hidden at this instant are shown: the excerpt is a still of the finished component.
      copy.style.opacity = original.style.opacity !== '' && parseFloat(computed.opacity) === 0 ? '1' : computed.opacity;
    });
    scene.style.display = was;
    Object.assign(clone.style, {position: 'relative', left: '0', top: '0', margin: '0', opacity: '1', width: `${size.width}px`, height: `${size.height}px`, overflow: 'hidden'});
    return {clone, ...size};
  };
  window.__setupTutorial = (nav, details) => {
    steps = [...nav.querySelectorAll('.dashboard-navigation>li')].filter(item => item.style.display !== 'none').map(item => {
      const link = item.querySelector('a');
      const label = link?.getAttribute('aria-label') ?? '';
      const detail = details.get(label);
      return {link, label, description: detail?.description ?? '', key: detail?.key ?? '', icon: link?.querySelector('svg')};
    }).filter(step => step.link);
    window.__startTutorial = steps.length ? start : undefined;
  };
  const poseOf = () => ({
    camera: {x: gsap.getProperty('.dashboard-camera', 'x'), y: gsap.getProperty('.dashboard-camera', 'y'), scale: gsap.getProperty('.dashboard-camera', 'scale')},
    stage: {rotationX: gsap.getProperty('.dashboard-stage', 'rotationX'), rotation: gsap.getProperty('.dashboard-stage', 'rotation')},
  });
  const killOwn = () => {
    if (!state) return;
    // Only the tutorial's own tweens: the camera and stage also carry the film's timeline tweens, which must survive.
    gsap.killTweensOf([state.layer, state.window, state.links, ...state.chips]);
    state.chips.forEach(chip => gsap.killTweensOf(chip.firstChild));
    state.moves.forEach(tween => tween.kill());
    state.moves = [];
  };
  const cleanup = () => {
    if (!state) return;
    killOwn();
    for (const step of steps) step.link.classList.remove('tutorial-active');
    state.nav.classList.remove('tutorial-on');
    state.layer.remove();
    state = null;
  };
  window.__stopTutorial = cleanup;
  const curve = (from, to) => {
    const reach = Math.max((to.x - from.x) * .55, 40);
    return `M${from.x},${from.y} C${from.x + reach},${from.y} ${to.x - reach},${to.y} ${to.x},${to.y}`;
  };
  const show = index => {
    const {layer, window: panel, links, nav, sidebar} = state;
    const step = steps[index];
    state.index = index;
    steps.forEach((other, position) => other.link.classList.toggle('tutorial-active', position === index));
    layer.querySelector('.tutorial-count').textContent = `Étape ${index + 1} sur ${steps.length}`;
    layer.querySelector('.tutorial-title').textContent = step.label;
    layer.querySelector('.tutorial-text').textContent = step.description;
    layer.querySelector('.tutorial-icon').replaceChildren(...(step.icon ? [step.icon.cloneNode(true)] : []));
    layer.querySelector('.tutorial-prev').disabled = index === 0;
    const next = layer.querySelector('.tutorial-next');
    next.textContent = index === steps.length - 1 ? 'Continuer' : 'Suivant';
    // The real components of this entry, as floating excerpts.
    state.chips.forEach(chip => { gsap.killTweensOf(chip.firstChild); chip.remove(); });
    state.chips = [];
    const wanted = (EXCERPTS[role][step.key] ?? []);
    for (const selector of wanted) {
      if (state.chips.length >= SLOTS.length) break;
      const source = document.querySelector(selector);
      if (!source || !source.textContent.trim()) continue;
      const shot = snapshot(source);
      if (!shot.width || !shot.height) continue;
      const scale = CHIP_WIDTH / shot.width;
      const shown = Math.min(shot.height * scale, CHIP_MAX_HEIGHT);
      const chip = make('div', 'tutorial-chip');
      const inner = make('div', 'tutorial-chip-inner');
      Object.assign(chip.style, {width: `${CHIP_WIDTH}px`, height: `${shown}px`});
      chip.classList.toggle('is-cropped', shot.height * scale > CHIP_MAX_HEIGHT);
      Object.assign(inner.style, {width: `${shot.width}px`, height: `${shot.height}px`});
      gsap.set(inner, {scale, transformOrigin: '0 0'});
      inner.appendChild(shot.clone);
      chip.appendChild(inner);
      layer.appendChild(chip);
      state.chips.push(chip);
    }
    // Camera move of this step: measured at its end pose, then played from the current one.
    const move = MOVES[index % MOVES.length];
    const from = poseOf();
    const to = {
      camera: {x: state.base.camera.x + move.x, y: state.base.camera.y + move.y, scale: state.base.camera.scale + move.scale},
      stage: {rotationX: state.base.stage.rotationX + move.rotationX, rotation: state.base.stage.rotation + move.rotation},
    };
    state.moves.forEach(tween => tween.kill());
    gsap.set('.dashboard-camera', to.camera);
    gsap.set('.dashboard-stage', to.stage);
    // Positions are read in the 1920 x 1080 space of the scene, whatever the zoom of the frame.
    const area = layer.getBoundingClientRect();
    const unit = area.width / 1920 || 1;
    const rect = step.link.getBoundingClientRect();
    const edge = (sidebar.getBoundingClientRect().right - area.left) / unit;
    const centre = (rect.top + rect.height / 2 - area.top) / unit;
    gsap.set('.dashboard-camera', from.camera);
    gsap.set('.dashboard-stage', from.stage);
    state.moves = [
      gsap.to('.dashboard-camera', {...to.camera, duration: 1, ease: 'power2.inOut'}),
      gsap.to('.dashboard-stage', {...to.stage, duration: 1, ease: 'power2.inOut'}),
    ];
    // The explanation sits beside its entry; the excerpts float around it.
    const width = panel.offsetWidth;
    const height = panel.offsetHeight;
    const left = clamp(edge + 120, 0, Math.min(860, 1920 - 70 - width));
    const top = clamp(centre - height / 2, 270, 1080 - 520);
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
    const origin = {x: edge - 4, y: centre};
    const targets = [{x: left, y: top + height / 2}];
    const placed = [];
    state.chips.forEach((chip, position) => {
      const slot = SLOTS[position];
      const chipHeight = parseFloat(chip.style.height);
      const spots = {
        'below-left': {x: left - 20, y: top + height + 34},
        'above-right': {x: left + width - CHIP_WIDTH + 70, y: top - chipHeight - 34},
        'below-right': {x: left + width - CHIP_WIDTH + 30, y: top + height + 34 + (state.chips.length > 2 ? 90 : 0)},
      };
      const spot = {x: clamp(spots[slot.at].x, 30, 1920 - CHIP_WIDTH - 90), y: clamp(spots[slot.at].y, 30, 1080 - chipHeight - 40)};
      chip.style.left = `${spot.x}px`;
      chip.style.top = `${spot.y}px`;
      placed.push({chip, slot, spot});
      targets.push({x: spot.x, y: spot.y + Math.min(chipHeight / 2, 60)});
    });
    // Fine curves from the entry to each card, drawn in one after the other.
    links.replaceChildren();
    const paths = targets.map(target => {
      const path = document.createElementNS(SVG, 'path');
      path.setAttribute('d', curve(origin, target));
      path.setAttribute('pathLength', '1');
      path.setAttribute('class', 'tutorial-curve');
      const dot = document.createElementNS(SVG, 'circle');
      dot.setAttribute('cx', target.x);
      dot.setAttribute('cy', target.y);
      dot.setAttribute('r', 5);
      dot.setAttribute('class', 'tutorial-dot');
      links.append(path, dot);
      return {path, dot};
    });
    const start = document.createElementNS(SVG, 'circle');
    start.setAttribute('cx', origin.x);
    start.setAttribute('cy', origin.y);
    start.setAttribute('r', 6);
    start.setAttribute('class', 'tutorial-dot');
    links.appendChild(start);
    gsap.killTweensOf([panel, links]);
    gsap.fromTo(panel, {opacity: 0, x: 60, z: -120, rotationY: -16}, {opacity: 1, x: 0, z: 0, rotationY: -4, duration: .65, ease: 'power3.out'});
    gsap.fromTo(paths.map(item => item.path), {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: .8, ease: 'power2.inOut', stagger: .12});
    gsap.fromTo(paths.map(item => item.dot).concat(start), {opacity: 0, scale: 0, transformOrigin: 'center'}, {opacity: 1, scale: 1, duration: .35, delay: .5, stagger: .1, ease: 'back.out(2)'});
    placed.forEach(({chip, slot, spot}, position) => {
      gsap.fromTo(chip, {opacity: 0, x: 50, y: 30, z: -240, rotationY: slot.rotationY - 22}, {opacity: 1, x: 0, y: 0, z: slot.z, rotationY: slot.rotationY, rotation: slot.rotation, duration: .8, delay: .2 + position * .14, ease: 'power3.out'});
      // A slow float keeps the excerpts alive in depth while the step is read.
      gsap.to(chip.firstChild, {y: position % 2 ? -8 : 8, duration: 2.6 + position * .5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1});
    });
    next.focus({preventScroll: true});
  };
  const finish = () => {
    if (!state) return;
    const {resume, layer, base} = state;
    // The film resumes from its own camera pose: the interface settles back into it first.
    state.moves.forEach(tween => tween.kill());
    state.moves = [
      gsap.to('.dashboard-camera', {...base.camera, duration: .5, ease: 'power2.inOut'}),
      gsap.to('.dashboard-stage', {...base.stage, duration: .5, ease: 'power2.inOut'}),
    ];
    gsap.to(layer, {opacity: 0, duration: .4, delay: .1, ease: 'power1.in', onComplete: () => { cleanup(); resume(); }});
  };
  function start(resume) {
    cleanup();
    const scene = document.getElementById('dashboards');
    const nav = steps[0].link.closest('.dashboard-navigation');
    const layer = make('div', 'tutorial-layer');
    layer.setAttribute('role', 'dialog');
    layer.setAttribute('aria-label', 'Découverte de la barre latérale');
    layer.innerHTML = '<svg class="tutorial-links" width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden="true"></svg><div class="tutorial-window"><div class="tutorial-head"><span class="tutorial-icon" aria-hidden="true"></span><div><small class="tutorial-count"></small><h3 class="tutorial-title"></h3></div></div><p class="tutorial-text" aria-live="polite"></p><div class="tutorial-actions"><button type="button" class="btn btn-ghost btn-sm tutorial-prev">Précédent</button><button type="button" class="btn btn-primary btn-sm tutorial-next"></button></div></div>';
    scene.appendChild(layer);
    state = {layer, nav, resume, index: 0, moves: [], chips: [], base: poseOf(), window: layer.querySelector('.tutorial-window'), links: layer.querySelector('.tutorial-links'), sidebar: scene.querySelector('.floating-sidebar')};
    nav.classList.add('tutorial-on');
    layer.querySelector('.tutorial-prev').addEventListener('click', () => show(Math.max(state.index - 1, 0)));
    layer.querySelector('.tutorial-next').addEventListener('click', () => state.index >= steps.length - 1 ? finish() : show(state.index + 1));
    layer.addEventListener('keydown', event => {
      if (event.key === 'ArrowRight') layer.querySelector('.tutorial-next').click();
      if (event.key === 'ArrowLeft') layer.querySelector('.tutorial-prev').click();
    });
    show(0);
  }
})();
/* Only local, authored scenes. No network, API, active IA or Studio dependency. */
(() => {
  const channel = 'andria-auth-presentation';
  let timeline = window.__timelines?.main;
  const root = document.getElementById('root');
  const allScenes = [...document.querySelectorAll('section.scene')];
  const params = new URLSearchParams(location.search);
  const quality = params.get('quality') ?? '0';
  const qualityIndex = Number(quality);
  const sequence = sequences[/^(0|[1-9]\d*)$/.test(quality) && Number.isSafeInteger(qualityIndex) && qualityIndex < sequences.length ? qualityIndex : 0];
  const logoOnly = params.get('mode') === 'logo';
  const chatbotOnly = params.get('mode') === 'chatbot';
  const dashboard = sequences.flat().find(clip => clip.id === 'dashboards');
  const chatbotClip = dashboard && {id: dashboard.id, start: dashboard.start + dashboard.duration - 2.4, duration: 2.4};
  if (logoOnly) root.dataset.logoOnly = 'true';
  if (chatbotOnly) root.dataset.chatbotOnly = 'true';
  // Gestures are timed against this clip, whose position follows the composition.
  if (chatbotOnly && chatbotClip) {
    window.__chatbotClipStart = chatbotClip.start;
    if (window.__createBrandTimeline) timeline = window.__timelines.main = window.__createBrandTimeline(params.get('gesture'));
  }
  // A single-role dashboards sequence plays a longer tail (cursor click on the chatbot), declared by the composition.
  const roleExtra = params.get('role') && window.__dashboardRoleExtra ? window.__dashboardRoleExtra : 0;
  const clips = logoOnly ? [opening] : chatbotOnly && chatbotClip ? [chatbotClip] : sequence.map(clip => clip.id === 'dashboards' ? {...clip, duration: clip.duration + roleExtra} : clip);
  const duration = clips.reduce((total, clip) => total + clip.duration, 0);
  let elapsed = 0;
  let lastFrame = null;
  let frame = 0;
  let playing = false;
  let initialized = false;
  let showingOutro = false;
  // Lets the host offer "Rejouer" while the last seconds still play.
  const endingLead = 3;
  let endingSent = false;
  let activeSceneId = null;
  // Presentation only: the film stops once at `hold` (seconds into the clip) while the sidebar tutorial runs.
  let holdPassed = false;
  const notify = state => parent.postMessage({channel, state}, '*');
  const fit = () => {
    if (chatbotOnly) {
      // Crop the existing launcher from the final dashboard greeting.
      const scale = Math.min(innerWidth / 320, innerHeight / 320);
      root.style.zoom = String(scale);
      root.style.transform = 'none';
      root.style.left = `${innerWidth / (2 * scale) - 1390}px`;
      root.style.top = `${innerHeight / (2 * scale) - 610}px`;
      return;
    }
    const scale = Math.min(innerWidth / (logoOnly ? 900 : 1920), innerHeight / (logoOnly ? 280 : 1080));
    // Render text and nested 3D cards at the viewport's resolution instead of
    // shrinking already rasterized layers. Zoom also scales positioned offsets.
    const useZoom = CSS.supports('zoom', '1');
    root.style.zoom = useZoom ? String(scale) : '1';
    root.style.transform = useZoom ? 'none' : `scale(${scale})`;
    const offsetScale = useZoom ? scale : 1;
    root.style.left = `${(innerWidth - 1920 * scale) / (2 * offsetScale)}px`;
    root.style.top = `${(innerHeight - 1080 * scale) / (2 * offsetScale)}px`;
  };
  const paint = () => {
    let local = elapsed;
    let active = clips[clips.length - 1];
    for (const clip of clips) {
      active = clip;
      if (local < clip.duration || clip === clips[clips.length - 1]) break;
      local -= clip.duration;
    }
    // Expose the scene before seeking so the masked block reveal is measured
    // in its visible layout, then hold the clean logo before its exit fade.
    const outro = active.id === opening.id;
    // Skip the empty lead-in, retaining the block construction itself.
    const offset = outro ? Math.min(local + .08, 2.1) : Math.min(local, active.duration - .001);
    if (activeSceneId !== active.id) {
      for (const scene of allScenes) scene.style.display = scene.id === active.id ? 'block' : 'none';
      activeSceneId = active.id;
    }
    timeline.totalTime(active.start + offset, true);
    if (outro !== showingOutro) {
      showingOutro = outro;
      if (playing) notify(outro ? 'outro' : 'playing');
    }
  };
  const pause = (state='paused') => {
    playing = false;lastFrame = null;cancelAnimationFrame(frame);notify(elapsed >= duration ? 'ended' : state);
  };
  const tick = now => {
    if (!playing) return;
    if (lastFrame !== null) elapsed = Math.min(duration, elapsed + (now-lastFrame)/1000);
    lastFrame = now;
    const hold = params.get('role') && Number.isFinite(window.__tutorialHold) ? window.__tutorialHold : null;
    const holding = hold !== null && !holdPassed && elapsed >= hold && !!window.__startTutorial;
    if (holding) elapsed = hold;
    paint();
    if (holding) {
      holdPassed = true;playing = false;lastFrame = null;cancelAnimationFrame(frame);notify('paused');
      // The sequence carries on from the same instant once the tutorial is done.
      window.__startTutorial(play);
      return;
    }
    if (elapsed >= duration) { pause('ended'); return; }
    if (!endingSent && !logoOnly && !chatbotOnly && duration - elapsed <= endingLead) { endingSent = true; notify('ending'); }
    frame = requestAnimationFrame(tick);
  };
  const play = () => {
    if (playing) return;
    if (elapsed >= duration) elapsed = 0;
    playing = true;endingSent = false;lastFrame = null;notify(logoOnly ? 'outro' : 'playing');frame = requestAnimationFrame(tick);
  };
  // Plays the logo's block reveal backwards (faster than the reveal) and reports when it is empty.
  const reverse = () => {
    if (!logoOnly) return;
    playing = false;cancelAnimationFrame(frame);
    elapsed = Math.min(elapsed, 2.02);lastFrame = null;
    const step = now => {
      if (lastFrame !== null) elapsed = Math.max(0, elapsed - (now - lastFrame) / 1000 * 4);
      lastFrame = now;paint();
      if (elapsed <= 0) { notify('reversed'); return; }
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  };
  const tint = (value, contentColor, backgroundColor, textColor, transparentBackground) => {
    const valid = color => typeof color === 'string' && color.length < 120 && CSS.supports('color',color);
    if (!valid(value)) return;
    root.style.setProperty('--embed-logo-color',value);
    for (const token of ['primary','secondary','accent']) root.style.setProperty('--color-'+token,value);
    root.style.setProperty('--sidebar-bg',value);
    if (valid(contentColor)) {
      root.style.setProperty('--embed-content-color',contentColor);
      for (const token of ['primary','secondary','accent']) root.style.setProperty('--color-'+token+'-content',contentColor);
      root.style.setProperty('--sidebar-content',contentColor);
      root.style.setProperty('--sidebar-active',`color-mix(in srgb,${contentColor} 18%,${value})`);
      root.style.setProperty('--sidebar-active-content',contentColor);
      root.style.setProperty('--sidebar-border',`color-mix(in srgb,${contentColor} 25%,${value})`);
    }
    if (valid(backgroundColor)) {
      // The complete iframe viewport includes the margins around its 16:9 canvas.
      document.documentElement.style.setProperty('--embed-page-background',backgroundColor);
      root.style.setProperty('--color-base-100',backgroundColor);
      // The standalone logo is composited over its parent's surface, but keeps an opaque ink-on-tile colour.
      if (logoOnly && transparentBackground === true) {
        document.documentElement.style.setProperty('--embed-page-background','transparent');
        root.style.background = 'transparent';
        for (const scene of allScenes) scene.style.background = 'transparent';
      }
      root.style.setProperty('--color-base-200',`color-mix(in srgb,${value} 7%,${backgroundColor})`);
      root.style.setProperty('--color-base-300',`color-mix(in srgb,${value} 22%,${backgroundColor})`);
    }
    if (valid(textColor)) root.style.setProperty('--color-base-content',textColor);
  };
  // Replaces the sample data of the dashboards scene with the signed-in user's real dashboard.
  // Only text and sidebar entries change: the layout and the 3D timeline stay as authored.
  const applyContent = content => {
    if (!params.get('role') || !content || typeof content !== 'object') return;
    const str = (value, max = 160) => typeof value === 'string' ? value.slice(0, max) : '';
    const setText = (element, value) => { if (element) element.textContent = str(value); };
    const student = content.space === 'student';
    const face = document.getElementById(student ? 'dashboard-student' : 'dashboard-teacher');
    const nav = document.getElementById(student ? 'dashboard-nav-student' : 'dashboard-nav-admin');
    if (!face || !nav) return;
    const style = document.createElement('style');
    style.textContent = '.dashboard-face .product-row>div{min-width:0}.dashboard-face b,.dashboard-face small,.dashboard-face h2,.dashboard-face .dashboard-header p,.dashboard-face .fixture-content p,.dashboard-face .fixture-content h3{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dashboard-face .product-row b,.dashboard-face .product-row small{display:block}';
    document.head.appendChild(style);
    // Templates are taken before any edit, since cards are emptied and refilled.
    const rowTemplate = document.querySelector(student ? '#dash-paths .product-row' : '#dash-actions .product-row')?.cloneNode(true);
    const moduleIcon = document.querySelector('#dash-latest .panel-title svg')?.cloneNode(true);
    // Rows keep the icon of the card they come from; the cards that take another slot's content borrow a fitting one.
    const rowIcon = id => document.querySelector(`#${id} .product-row>svg`)?.cloneNode(true);
    const rowIcons = student ? {} : {'dash-actions': rowIcon('dash-actions'), 'dash-alerts': rowIcon('dash-latest'), 'dash-latest': rowIcon('dash-latest'), 'dash-feedback': rowIcon('dash-actions')};
    // Header.
    const header = face.querySelector('.dashboard-header');
    setText(header?.querySelector('small'), content.spaceLabel);
    setText(header?.querySelector('h2'), content.title);
    setText(header?.querySelector('p'), content.message);
    const action = header?.querySelector('.product-button');
    if (action) { if (typeof content.headerAction === 'string') action.textContent = str(content.headerAction); else action.style.display = 'none'; }
    // Sidebar: only the entries the role can open, under their real labels.
    setText(nav.querySelector(':scope>small'), content.spaceLabel);
    const navEntries = Array.isArray(content.nav) ? content.nav : [];
    const entries = new Map(navEntries.map(entry => [str(entry?.label), str(entry?.displayLabel)]));
    for (const item of nav.querySelectorAll('.dashboard-navigation>li')) {
      const link = item.querySelector('a');
      const label = link?.getAttribute('aria-label') ?? '';
      if (!entries.has(label)) { item.style.display = 'none'; continue; }
      const shown = entries.get(label) || label;
      link.setAttribute('aria-label', shown);
      link.setAttribute('data-tip', shown);
      setText(link.querySelector(':scope>span:last-child'), shown);
    }
    window.__setupTutorial?.(nav, new Map(navEntries.map(entry => [str(entry?.displayLabel) || str(entry?.label), {description: str(entry?.description, 220), key: str(entry?.key, 40)}])));
    const profile = document.querySelector('#dashboards .dashboard-profile');
    setText(profile?.querySelector('.avatar'), str(content.initials, 3));
    setText(profile?.querySelector('b'), content.userName);
    setText(profile?.querySelector('small'), content.roleLabel);
    // Cards.
    for (const card of Array.isArray(content.cards) ? content.cards : []) {
      const element = document.getElementById(str(card?.id));
      const box = element?.querySelector('.fixture-content');
      if (!box || !face.contains(element)) continue;
      setText(box.querySelector('.panel-title h3'), card.title);
      const icon = box.querySelector('.panel-title svg');
      if (card.id === 'dash-alerts' && icon && moduleIcon) icon.replaceWith(moduleIcon.cloneNode(true));
      for (const child of [...box.children]) if (!child.classList.contains('panel-title')) child.remove();
      for (const row of (Array.isArray(card.rows) ? card.rows : []).slice(0, 3)) {
        if (!rowTemplate) break;
        const line = rowTemplate.cloneNode(true);
        const icon = rowIcons[card.id];
        if (icon) line.querySelector(':scope>svg')?.replaceWith(icon.cloneNode(true));
        setText(line.querySelector('b'), row?.title);
        setText(line.querySelector('small'), row?.subtitle);
        box.appendChild(line);
      }
    }
    if (student && content.resume && typeof content.resume === 'object') {
      const resume = document.getElementById('dash-resume');
      setText(resume?.querySelector('h3'), content.resume.course);
      setText(resume?.querySelector('.fixture-content>p'), content.resume.lesson);
      setText(resume?.querySelector('.dashboard-resume strong'), content.resume.action);
      setText(resume?.querySelector('.dashboard-resume span'), '');
      const progress = resume?.querySelector('.product-progress');
      if (progress) progress.style.visibility = 'hidden';
      const calendar = document.getElementById('dash-calendar');
      setText(calendar?.querySelector('strong'), 'Votre calendrier');
      setText(calendar?.querySelector('.fixture-content>p'), 'Retrouvez vos prochaines séances.');
      const skills = document.getElementById('dash-skills');
      setText(skills?.querySelector('.fixture-content>p'), 'Suivez vos compétences et accomplissements.');
      for (const badge of skills?.querySelectorAll('.skill-badge') ?? []) badge.style.display = 'none';
    }
  };
  window.addEventListener('message',event => {
    if (event.source !== parent || !event.data || typeof event.data !== 'object' || event.data.channel !== channel) return;
    const {action,color,contentColor,backgroundColor,textColor,autoplay,gesture,colorScheme,transparentBackground,content,chatbot} = event.data;
    if (action === 'content') {
      applyContent(content);
      // Where the application's own launcher sits in this frame (px, centre and diameter): converted to scene units.
      const finite = value => typeof value === 'number' && Number.isFinite(value);
      if (params.get('role') && chatbot && finite(chatbot.centerX) && finite(chatbot.centerY) && finite(chatbot.size) && chatbot.size > 0) {
        const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
        window.__dezoomChatbot?.({
          x: (chatbot.centerX - (innerWidth - 1920 * scale) / 2) / scale,
          y: (chatbot.centerY - (innerHeight - 1080 * scale) / 2) / scale,
          size: chatbot.size / scale,
        });
      }
      return;
    }
    if (colorScheme === 'light' || colorScheme === 'dark') document.documentElement.style.colorScheme = colorScheme;
    if (action === 'initialize') {
      tint(color,contentColor,backgroundColor,textColor,transparentBackground);
      // Reveal only after the parent palette and selected scene are painted.
      if (!initialized) { initialized = true; elapsed = autoplay === true ? 0 : duration;paint();root.style.visibility = 'visible';autoplay === true ? play() : pause('ended'); }
    } else if (action === 'color') tint(color,contentColor,backgroundColor,textColor,transparentBackground);
    else if (action === 'play') play();
    else if (action === 'reverse') reverse();
    else if (action === 'pause') {
      if (logoOnly) {elapsed = duration;paint();}
      pause();
    }
    else if (action === 'replay') {
      if (chatbotOnly && ['wave','nod','look','double-blink'].includes(gesture) && window.__createBrandTimeline) {
        timeline.totalTime(0, true);
        timeline.kill();
        timeline = window.__createBrandTimeline(gesture);
      }
      const wasPlaying = playing;
      holdPassed = false;window.__stopTutorial?.();
      elapsed = 0;endingSent = false;paint();play();
      if (wasPlaying) notify('playing');
    }
  });
  window.addEventListener('resize',fit);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));
  if (!timeline || !root) {notify('error');return;}
  document.documentElement.style.setProperty('--embed-page-background',getComputedStyle(root).backgroundColor);
  root.style.setProperty('--embed-logo-color','var(--color-primary)');
  elapsed = duration;fit();paint();notify('ready');
})();
