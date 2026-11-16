/* CMDDI | Abertura "As sete penas"
   As sete penas da logomarca se abrem em leque, o arco se desenha, o nome surge
   e a tela se abre em losango, o grafismo da cerâmica Terena. Aparece em toda entrada. */
(function(){
  var reduz = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var css = [
  '#cm-ab{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;pointer-events:auto;cursor:pointer}',
  '#cm-ab .fundo{position:absolute;inset:0;width:100%;height:100%}',
  '#cm-ab .fundo rect.tela{fill:#0A0F08}',
  '#cm-ab .fundo .furo{transform-box:fill-box;transform-origin:center;transform:scale(0)}',
  '#cm-ab.sai .fundo .furo{animation:cmFuro 1.1s cubic-bezier(.7,0,.2,1) forwards}',
  '@keyframes cmFuro{to{transform:scale(1)}}',
  '#cm-ab .palco{position:relative;display:grid;justify-items:center;gap:22px;transition:opacity .5s,transform .9s cubic-bezier(.7,0,.2,1)}',
  '#cm-ab.sai .palco{opacity:0;transform:scale(1.35)}',
  '#cm-ab svg.leque{width:min(470px,84vw);overflow:visible}',
  '#cm-ab .pena{transform-origin:0 0;transform:rotate(0) scale(.15);opacity:0;animation:cmPena 1.6s cubic-bezier(.2,.9,.2,1) forwards}',
  '@keyframes cmPena{40%{opacity:1}to{opacity:1;transform:rotate(var(--a)) scale(1)}}',
  '#cm-ab .pena .p{fill:transparent;stroke:var(--c);stroke-width:2.4;stroke-dasharray:330;stroke-dashoffset:330;animation:cmTraco 1s ease forwards,cmEnche .5s ease forwards;animation-delay:var(--d),calc(var(--d) + 1s)}',
  '#cm-ab .pena .r{stroke:#fff;stroke-width:2;stroke-linecap:round;opacity:0;animation:cmOp .4s ease forwards;animation-delay:calc(var(--d) + 1.3s)}',
  '#cm-ab .pena .b{stroke:rgba(0,0,0,.35);stroke-width:1.4;stroke-linecap:round;opacity:0;animation:cmOp .4s ease forwards;animation-delay:calc(var(--d) + 1.35s)}',
  '@keyframes cmTraco{to{stroke-dashoffset:0}}@keyframes cmEnche{to{fill:var(--c)}}@keyframes cmOp{to{opacity:1}}',
  '#cm-ab .arco{fill:none;stroke-linecap:round;stroke-dasharray:300;stroke-dashoffset:300;animation:cmTraco .9s cubic-bezier(.6,0,.2,1) 1.9s forwards}',
  '#cm-ab .brilho{fill:url(#cmHalo);opacity:0;animation:cmOp 1.4s ease 1.7s forwards}',
  '#cm-ab .nome{text-align:center;color:#EDE5CF;font-family:Cinzel,Georgia,serif;opacity:0;transform:translateY(14px);animation:cmSobe 1s ease 2.35s forwards}',
  '#cm-ab .nome b{display:block;font-size:clamp(2.1rem,6vw,3.2rem);letter-spacing:.32em;font-weight:700;padding-left:.32em;background:linear-gradient(90deg,#E8B86D,#fff3d6,#D4954A);-webkit-background-clip:text;background-clip:text;color:transparent}',
  '#cm-ab .nome span{display:block;margin-top:10px;font-size:clamp(.62rem,1.6vw,.78rem);letter-spacing:.28em;text-transform:uppercase;color:rgba(237,229,207,.75);max-width:34ch}',
  '@keyframes cmSobe{to{opacity:1;transform:none}}',
  '#cm-ab .poeira i{position:absolute;width:3px;height:3px;border-radius:50%;background:#E8B86D;opacity:0;animation:cmPo 2.6s ease-out forwards}',
  '@keyframes cmPo{20%{opacity:.9}to{opacity:0;transform:translate(var(--x),var(--y))}}',
  '#cm-ab.sai .pular{opacity:0}',
  '#cm-ab .pular{transition:opacity .3s;position:absolute;bottom:22px;right:24px;font:600 .62rem/1 system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:rgba(237,229,207,.45)}',
  '@media (prefers-reduced-motion:reduce){#cm-ab *{animation-duration:.01s!important;animation-delay:0s!important}}'
  ].join('\n');
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var cores = ['#E2231A','#F26522','#F7A21B','#8DC63F','#3FA535','#1E88E5','#1A3E8C'];
  function penas(){
    var h = '';
    for(var i = 0; i < 7; i++){
      var a = -63 + i * 21, d = (0.3 + Math.abs(i - 3) * 0.16).toFixed(2) + 's';
      var barbas = '';
      for(var k = 0; k < 6; k++){ var y = -26 - k * 13; barbas += '<path class="b" d="M0 ' + y + ' l-' + (9 - k) + ' -' + (6 + k) + ' M0 ' + y + ' l' + (9 - k) + ' -' + (6 + k) + '"/>'; }
      h += '<g class="pena" style="--a:' + a + 'deg;--c:' + cores[i] + ';--d:' + d + ';animation-delay:' + d + '">' +
        '<path class="p" style="--c:' + cores[i] + '" d="M0 -6 C-16 -34 -19 -84 0 -124 C19 -84 16 -34 0 -6Z"/>' +
        '<path class="r" d="M0 -10 L0 -112"/>' + barbas + '</g>';
    }
    return h;
  }
  var html = '<div id="cm-ab" aria-hidden="true">' +
    '<svg class="fundo" preserveAspectRatio="none" viewBox="0 0 100 100"><defs><mask id="cmMask"><rect width="100" height="100" fill="#fff"/>' +
    '<polygon class="furo" points="50,-60 160,50 50,160 -60,50" fill="#000"/></mask></defs>' +
    '<rect class="tela" width="100" height="100" mask="url(#cmMask)"/></svg>' +
    '<div class="poeira"></div>' +
    '<div class="palco"><svg class="leque" viewBox="-170 -150 340 190"><defs><radialGradient id="cmHalo"><stop offset="0" stop-color="#E8B86D" stop-opacity=".35"/><stop offset="1" stop-color="#E8B86D" stop-opacity="0"/></radialGradient></defs>' +
    '<ellipse class="brilho" cx="0" cy="-60" rx="170" ry="110"/>' + penas() +
    '<path class="arco" d="M-150 22 Q0 -14 150 22" stroke="#F7B500" stroke-width="6"/>' +
    '<path class="arco" style="animation-delay:2.05s" d="M-120 30 Q0 2 120 30" stroke="#3FA535" stroke-width="4"/></svg>' +
    '<div class="nome"><b>CMDDI</b><span>Conselho Municipal dos Direitos e Defesa dos Povos Indígenas</span></div></div>' +
    '<span class="pular">toque para entrar</span></div>';

  function abrir(){
    var velho = document.getElementById('cm-ab'); if(velho) velho.remove();
    var t = document.createElement('div'); t.innerHTML = html; var ab = t.firstElementChild;
    document.body.insertBefore(ab, document.body.firstChild);
    var po = ab.querySelector('.poeira');
    for(var i = 0; i < 26; i++){
      var s = document.createElement('i');
      s.style.left = (50 + (Math.random() - .5) * 30) + '%'; s.style.top = (46 + (Math.random() - .5) * 16) + '%';
      s.style.setProperty('--x', ((Math.random() - .5) * 260) + 'px'); s.style.setProperty('--y', (-80 - Math.random() * 220) + 'px');
      s.style.animationDelay = (1.6 + Math.random() * 1.8) + 's'; po.appendChild(s);
    }
    document.documentElement.style.overflow = 'hidden';
    var feito = false;
    function fim(){
      if(feito) return; feito = true; ab.classList.add('sai');
      document.documentElement.style.overflow = '';
      window.dispatchEvent(new Event('abertura-fim'));
      setTimeout(function(){ ab.remove(); }, 1150);
    }
    setTimeout(fim, reduz ? 600 : 4400);
    ab.addEventListener('click', fim);
  }
  abrir();
  addEventListener('pageshow', function(e){ if(e.persisted) abrir(); });
})();
