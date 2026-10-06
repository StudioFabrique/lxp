const sequences=[[{"id": "structure", "start": 3.0, "duration": 14.0}, {"id": "personalize", "start": 74.5, "duration": 6.0}], [{"id": "assistant", "start": 23.5, "duration": 12.0}, {"id": "steering", "start": 69.5, "duration": 5.0}], [{"id": "author", "start": 17.0, "duration": 6.5}, {"id": "assess", "start": 35.5, "duration": 6.0}], [{"id": "organize", "start": 46.5, "duration": 6.5}, {"id": "care", "start": 58.0, "duration": 11.5}], [{"id": "dashboards", "start": 80.5, "duration": 13.0}, {"id": "structure", "start": 3.0, "duration": 14.0}, {"id": "organize", "start": 46.5, "duration": 6.5}], [{"id": "progression", "start": 53.0, "duration": 5.0}], [{"id": "groups", "start": 96.5, "duration": 16.0}], [{"id": "trainers", "start": 112.5, "duration": 16.0}], [{"id": "tags", "start": 128.5, "duration": 16.0}], [{"id": "emails", "start": 144.5, "duration": 18.0}], [{"id": "instance", "start": 162.5, "duration": 18.0}], [{"id": "accomplishments", "start": 180.5, "duration": 16.0}]];
const opening={"id": "identity", "start": 0.0, "duration": 3.0};
/* Only local, authored scenes. No network, API, active IA or Studio dependency. */
(() => {
  const channel = 'andria-auth-presentation';
  const timeline = window.__timelines?.main;
  const root = document.getElementById('root');
  const allScenes = [...document.querySelectorAll('section.scene')];
  const params = new URLSearchParams(location.search);
  const quality = params.get('quality') ?? '0';
  const qualityIndex = Number(quality);
  const sequence = sequences[/^(0|[1-9]\d*)$/.test(quality) && Number.isSafeInteger(qualityIndex) && qualityIndex < sequences.length ? qualityIndex : 0];
  const clips = [...sequence, opening];
  const duration = clips.reduce((total, clip) => total + clip.duration, 0);
  let elapsed = 0;
  let lastFrame = null;
  let frame = 0;
  let playing = false;
  let initialized = false;
  let showingOutro = false;
  const notify = state => parent.postMessage({channel, state}, '*');
  const fit = () => {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    root.style.transform = `scale(${scale})`;
    root.style.left = `${(innerWidth - 1920 * scale) / 2}px`;
    root.style.top = `${(innerHeight - 1080 * scale) / 2}px`;
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
    for (const scene of allScenes) scene.style.display = scene.id === active.id ? 'block' : 'none';
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
    lastFrame = now;paint();
    if (elapsed >= duration) { pause('ended'); return; }
    frame = requestAnimationFrame(tick);
  };
  const play = () => {
    if (playing) return;
    if (elapsed >= duration) elapsed = 0;
    playing = true;lastFrame = null;notify(elapsed >= duration - opening.duration ? 'outro' : 'playing');frame = requestAnimationFrame(tick);
  };
  const tint = (value, contentColor, backgroundColor, textColor) => {
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
      root.style.setProperty('--color-base-200',`color-mix(in srgb,${value} 7%,${backgroundColor})`);
      root.style.setProperty('--color-base-300',`color-mix(in srgb,${value} 22%,${backgroundColor})`);
    }
    if (valid(textColor)) root.style.setProperty('--color-base-content',textColor);
  };
  window.addEventListener('message',event => {
    if (event.source !== parent || !event.data || typeof event.data !== 'object' || event.data.channel !== channel) return;
    const {action,color,contentColor,backgroundColor,textColor,autoplay} = event.data;
    if (action === 'initialize') {
      tint(color,contentColor,backgroundColor,textColor);
      // Reveal only after the parent palette and selected scene are painted.
      if (!initialized) { initialized = true; elapsed = autoplay === true ? 0 : duration;paint();root.style.visibility = 'visible';autoplay === true ? play() : pause('ended'); }
    } else if (action === 'color') tint(color,contentColor,backgroundColor,textColor);
    else if (action === 'play') play();
    else if (action === 'pause') pause();
    else if (action === 'replay') {elapsed = 0;play();}
  });
  window.addEventListener('resize',fit);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  window.addEventListener('pagehide',()=>cancelAnimationFrame(frame));
  if (!timeline || !root) {notify('error');return;}
  document.documentElement.style.setProperty('--embed-page-background',getComputedStyle(root).backgroundColor);
  root.style.setProperty('--embed-logo-color','var(--color-primary)');
  elapsed = duration;fit();paint();notify('ready');
})();
