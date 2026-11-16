/* CMDDI | camada de movimento 2026
   GSAP 3.13 (ScrollTrigger, SplitText, DrawSVG) hospedado no próprio site. */
(function(){
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  // barra de progresso de leitura
  var bar = document.createElement('div'); bar.id = 'mprog'; document.body.appendChild(bar);
  var tick = false;
  function prog(){
    var h = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, scrollY / h) : 0) + ')';
    tick = false;
  }
  addEventListener('scroll', function(){ if(!tick){ tick = true; requestAnimationFrame(prog); } }, {passive:true});
  prog();

  // entrada da abertura
  document.querySelectorAll('#hero .hero-eyebrow, #hero .hero-h1, #hero .hero-desc, #hero .hero-lei, #hero .hero-btns').forEach(function(el, i){
    el.classList.add('m-entra');
    setTimeout(function(){ el.classList.add('ok'); }, reduz ? 0 : 200 + i * 140);
  });

  // revelações simples (funcionam mesmo sem GSAP)
  var alvos = document.querySelectorAll('.m-rev');
  if('IntersectionObserver' in window && !reduz){
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('ok'); io.unobserve(e.target); } });
    }, {threshold:.18, rootMargin:'0px 0px -6% 0px'});
    alvos.forEach(function(el){ io.observe(el); });
  } else {
    alvos.forEach(function(el){ el.classList.add('ok'); });
  }

  // grafismo serrilhado Terena desenhado na base de cada faixa
  document.querySelectorAll('.m-banda').forEach(function(b){
    var d = 'M0 20', x = 0, up = true;
    while(x < 1200){ x += 18; d += ' L' + x + ' ' + (up ? 4 : 20); up = !up; }
    var ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'm-zig'); svg.setAttribute('viewBox', '0 0 1200 24'); svg.setAttribute('preserveAspectRatio', 'none'); svg.setAttribute('aria-hidden', 'true');
    var p = document.createElementNS(ns, 'path'); p.setAttribute('d', d); svg.appendChild(p); b.appendChild(svg);
  });

  if(reduz) return;

  function iniciar(){
    if(!window.gsap || !window.ScrollTrigger) return false;
    var plug = [ScrollTrigger]; if(window.SplitText) plug.push(SplitText); if(window.DrawSVGPlugin) plug.push(DrawSVGPlugin);
    gsap.registerPlugin.apply(gsap, plug);

    // títulos: palavras sobem por trás de uma máscara, linha a linha
    if(window.SplitText){
      document.querySelectorAll('.m-banda h2, .sec-h2, .m-povos h2').forEach(function(h){
        ScrollTrigger.create({trigger:h, start:'top 88%', once:true, onEnter:function(){
          var sp = SplitText.create(h, {type:'lines,words', mask:'lines'});
          gsap.from(sp.words, {yPercent:115, rotate:3, duration:1.1, ease:'expo.out', stagger:.045, onComplete:function(){ sp.revert(); }});
        }});
      });
    }

    // faixas: a foto se abre em losango, o grafismo da cerâmica Terena
    document.querySelectorAll('.m-banda').forEach(function(b){
      var w = b.querySelector('.m-banda-img'), img = w && w.querySelector('img');
      if(w) gsap.fromTo(w, {clipPath:'polygon(50% 22%, 78% 50%, 50% 78%, 22% 50%)'},
        {clipPath:'polygon(50% -75%, 175% 50%, 50% 175%, -75% 50%)', ease:'none', scrollTrigger:{trigger:b, start:'top 90%', end:'top 10%', scrub:.6}});
      if(img) gsap.fromTo(img, {yPercent:-7, scale:1.18}, {yPercent:7, scale:1.02, ease:'none', scrollTrigger:{trigger:b, start:'top bottom', end:'bottom top', scrub:true}});
      var z = b.querySelector('.m-zig path');
      if(z && window.DrawSVGPlugin) gsap.fromTo(z, {drawSVG:'50% 50%'}, {drawSVG:'0% 100%', ease:'none', scrollTrigger:{trigger:b, start:'top 75%', end:'bottom 60%', scrub:true}});
      var l = b.querySelector('.m-linha');
      if(l) gsap.fromTo(l, {scaleX:0}, {scaleX:1, duration:1.2, ease:'power3.out', scrollTrigger:{trigger:b, start:'top 65%'}});
    });

    // galeria dos povos: rolagem horizontal fixada
    var mm = gsap.matchMedia();
    mm.add('(min-width: 900px)', function(){
      var sec = document.querySelector('.m-povos'), tr = sec && sec.querySelector('.m-povos-track');
      if(!tr) return;
      var dist = function(){ return tr.scrollWidth - innerWidth + 64; };
      var tw = gsap.to(tr, {x:function(){ return -dist(); }, ease:'none',
        scrollTrigger:{trigger:sec, pin:true, scrub:1, start:'top top', end:function(){ return '+=' + dist(); }, invalidateOnRefresh:true}});
      tr.querySelectorAll('.m-povo img').forEach(function(im){
        gsap.fromTo(im, {xPercent:-8, scale:1.15}, {xPercent:8, scale:1.05, ease:'none', scrollTrigger:{trigger:im.parentNode, containerAnimation:tw, start:'left right', end:'right left', scrub:true}});
      });
      tr.querySelectorAll('.m-povo').forEach(function(c){
        gsap.from(c, {opacity:.25, y:40, ease:'none', scrollTrigger:{trigger:c, containerAnimation:tw, start:'left 95%', end:'left 55%', scrub:true}});
      });
    });

    // chamada final e abertura
    var c = document.querySelector('#cta .m-fundo img');
    if(c) gsap.fromTo(c, {yPercent:-7}, {yPercent:7, ease:'none', scrollTrigger:{trigger:'#cta', start:'top bottom', end:'bottom top', scrub:true}});
    var hf = document.querySelector('.m-hero-foto');
    if(hf) gsap.to(hf, {yPercent:14, ease:'none', scrollTrigger:{trigger:'#hero', start:'top top', end:'bottom top', scrub:true}});

    addEventListener('load', function(){ ScrollTrigger.refresh(); });
    return true;
  }
  if(!iniciar()) addEventListener('load', iniciar);

  // botões magnéticos
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
