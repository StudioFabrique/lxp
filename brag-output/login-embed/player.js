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
    lastFrame = now;paint();
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
  window.addEventListener('message',event => {
    if (event.source !== parent || !event.data || typeof event.data !== 'object' || event.data.channel !== channel) return;
    const {action,color,contentColor,backgroundColor,textColor,autoplay,gesture,colorScheme,transparentBackground} = event.data;
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
