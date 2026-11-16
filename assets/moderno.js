/* CMDDI | camada de movimento 2026 */
(function(){
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var bar = document.createElement('div'); bar.id = 'mprog'; document.body.appendChild(bar);
  var tick = false;
  function prog(){
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    tick = false;
  }
  addEventListener('scroll', function(){ if(!tick){ tick = true; requestAnimationFrame(prog); } }, {passive:true});
  prog();

  document.querySelectorAll('#hero .hero-eyebrow, #hero .hero-h1, #hero .hero-desc, #hero .hero-lei, #hero .hero-btns').forEach(function(el, i){
    el.classList.add('m-entra');
    setTimeout(function(){ el.classList.add('ok'); }, reduz ? 0 : 200 + i * 140);
  });

  var alvos = document.querySelectorAll('.m-banda .m-rev');
  if('IntersectionObserver' in window && !reduz){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('ok'); io.unobserve(e.target); } });
    }, {threshold:.18, rootMargin:'0px 0px -6% 0px'});
    alvos.forEach(function(el){ io.observe(el); });
  } else {
    alvos.forEach(function(el){ el.classList.add('ok'); });
  }

  if(reduz) return;

  function paralaxe(){
    if(!window.gsap || !window.ScrollTrigger) return false;
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll('.m-banda').forEach(function(b){
      var img = b.querySelector('.m-banda-img');
      if(img) gsap.fromTo(img, {yPercent:-8}, {yPercent:8, ease:'none', scrollTrigger:{trigger:b, start:'top bottom', end:'bottom top', scrub:true}});
      var l = b.querySelector('.m-linha');
      if(l) gsap.fromTo(l, {scaleX:0}, {scaleX:1, duration:1.2, ease:'power3.out', scrollTrigger:{trigger:b, start:'top 70%'}});
    });
    var c = document.querySelector('#cta .m-fundo img');
    if(c) gsap.fromTo(c, {yPercent:-7}, {yPercent:7, ease:'none', scrollTrigger:{trigger:'#cta', start:'top bottom', end:'bottom top', scrub:true}});
    var hf = document.querySelector('.m-hero-foto');
    if(hf) gsap.to(hf, {yPercent:14, opacity:.6, ease:'none', scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:true}});
    return true;
  }
  if(!paralaxe()) addEventListener('load', paralaxe);

  if(matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('.btn-primario, .btn-sec').forEach(function(b){
      b.addEventListener('mousemove', function(ev){
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + (ev.clientX - r.left - r.width/2) * .18 + 'px,' + (ev.clientY - r.top - r.height/2) * .28 + 'px)';
      });
      b.addEventListener('mouseleave', function(){ b.style.transform = ''; });
    });
  }
})();
