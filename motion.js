'use strict';
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 701px)');
  const hero = document.querySelector('.hero');
  const photo = document.querySelector('.hero-photo');
  const progress = document.createElement('div');
  progress.className = 'reading-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const seen = new WeakSet(), active = new Map();
  let observer, frame = 0;
  function animate(element, keyframes, options) {
    if (preference.matches || typeof element.animate !== 'function') return;
    active.get(element)?.cancel();
    const animation = element.animate(keyframes, options);
    active.set(element, animation);
    animation.finished.then(() => {
      if (active.get(element) === animation) active.delete(element);
    }).catch(() => {});
  }
  function watch(element, delay = 0) {
    if (!observer || seen.has(element)) return;
    seen.add(element);
    element.dataset.motionDelay = String(delay);
    observer.observe(element);
  }
  if (!preference.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        animate(entry.target, [{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'translateY(0)'}], {
          duration:850,delay:Number(entry.target.dataset.motionDelay || 0),easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'
        });
      }
    }, {threshold:0.1});
    document.querySelectorAll('.case-feature,.intro > div,.editorial figure,.section-heading,.search,.why > h2,.why-grid > div,.story-copy > h2,.story-copy > p,.steps li,.story > img,.cta > *,.footer-top').forEach(element => {
      watch(element, Math.min(Array.from(element.parentElement.children).indexOf(element),2)*90);
    });
  }
  document.querySelectorAll('.hero-copy > *').forEach((element,index) => {
    animate(element,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'translateY(0)'}],{
      duration:1000,delay:120+index*140,easing:'cubic-bezier(.2,.7,.2,1)',fill:'backwards'
    });
  });
  const arrow=document.querySelector('.hero-bottom a span');
  if(arrow) animate(arrow,[{transform:'translateY(0)'},{transform:'translateY(6px)',offset:.5},{transform:'translateY(0)'}],{duration:1800,iterations:3,delay:1200,easing:'ease-in-out'});
  const grid=document.querySelector('#property-grid');
  function watchProperties(){grid?.querySelectorAll('.property').forEach((element,index)=>watch(element,index*100));}
  watchProperties();
  if(grid && observer) new MutationObserver(watchProperties).observe(grid,{childList:true});
  function updateScroll(){
    frame=0;
    const max=document.documentElement.scrollHeight-innerHeight;
    progress.style.transform=`scaleX(${max>0?Math.min(1,Math.max(0,scrollY/max)):0})`;
    if(hero && photo){
      const rect=hero.getBoundingClientRect();
      // Limit the offset to the image overscan; no empty edges.
      const shift=!preference.matches && desktop.matches && rect.bottom>0?Math.min(15,Math.max(0,-rect.top*.025)):0;
      photo.style.setProperty('--hero-shift',`${shift}px`);
    }
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(updateScroll);}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule,{passive:true});
  preference.addEventListener('change',()=>{
    if(preference.matches){observer?.disconnect();active.forEach(animation=>animation.cancel());active.clear();}
    schedule();
  });
  document.addEventListener('focusin',event=>{
    active.forEach((animation,element)=>{if(element.contains(event.target))animation.cancel();});
  });
  updateScroll();
})();
