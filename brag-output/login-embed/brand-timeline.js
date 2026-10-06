/* The authored grid reveal and native chatbot greeting, without other scenes. */
(() => {
  const build = requested => {
  const tl = gsap.timeline({paused: true});
  if (new URLSearchParams(location.search).get('mode') === 'chatbot') {
    const gesture = ['wave', 'nod', 'look', 'double-blink'].includes(requested) ? requested : 'wave';
    const avatar = '#dashboard-chatbot svg';
    if (gesture === 'nod') {
      tl.to(avatar, {y: 3, scaleY: .94, duration: .25, ease: 'sine.inOut'}, 91.35);
      tl.to(avatar, {y: -2, scaleY: 1, duration: .3, ease: 'sine.inOut'}, 91.6);
      tl.to(avatar, {y: 2, duration: .25, ease: 'sine.inOut'}, 91.9);
      tl.to(avatar, {y: 0, duration: .3, ease: 'sine.inOut'}, 92.15);
    } else if (gesture === 'look') {
      tl.to(avatar, {x: -3, rotation: -5, duration: .35, ease: 'sine.inOut'}, 91.3);
      tl.to(avatar, {x: 3, rotation: 5, duration: .5, ease: 'sine.inOut'}, 91.7);
      tl.to(avatar, {x: 0, rotation: 0, duration: .35, ease: 'sine.inOut'}, 92.3);
    } else if (gesture === 'double-blink') {
      tl.to(avatar, {scale: 1.05, y: -1, duration: .4, ease: 'sine.inOut'}, 91.3);
      tl.to(avatar, {scale: 1, y: 0, duration: .4, ease: 'sine.inOut'}, 92.25);
    } else {
      tl.to(avatar, {rotation: -8, y: -2, duration: .4, ease: 'sine.inOut'}, 91.3);
      tl.to(avatar, {rotation: 5, y: 0, duration: .5, ease: 'sine.inOut'}, 91.7);
      tl.to(avatar, {rotation: 0, duration: .4, ease: 'sine.inOut'}, 92.2);
    }
    for (const time of gesture === 'double-blink' ? [91.6, 92.05] : [91.85]) {
      tl.fromTo('#dashboard-eye-shutter-left,#dashboard-eye-shutter-right',
        {attr: {y: 12, height: 4}}, {attr: {y: 13.98, height: .04}, duration: .1, ease: 'power1.inOut', immediateRender: false}, time);
      tl.fromTo('#dashboard-eye-shutter-left,#dashboard-eye-shutter-right',
        {attr: {y: 13.98, height: .04}}, {attr: {y: 12, height: 4}, duration: .14, ease: 'power1.out', immediateRender: false}, time + .15);
    }
    tl.set(avatar, {x: 0, y: 0, rotation: 0, scale: 1, scaleY: 1}, 93.3);
  } else {
    document.querySelectorAll('#intro-logo .logo-pixel').forEach((pixel, index) => {
      tl.fromTo(pixel, {opacity: 0, y: (index % 5) * 2 + 4},
        {opacity: 1, y: 0, duration: .5, ease: 'power2.out'}, .05 + (index % 32) * .012);
    });
    tl.fromTo('#intro-logo', {rotationY: -12, scale: .96},
      {rotationY: 0, scale: 1, duration: 1.1, ease: 'power3.out'}, 0);
    tl.fromTo('#intro-logo .logo-settled', {opacity: 0},
      {opacity: 1, duration: .22, ease: 'power2.inOut'}, 1.1);
    tl.to('#intro-logo > .brand-svg:not(.logo-settled)', {opacity: 0, duration: .22}, 1.1);
  }
  return tl;
  };
  window.__createBrandTimeline = build;
  window.__timelines = {main: build(new URLSearchParams(location.search).get('gesture'))};
})();
