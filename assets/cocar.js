/* CMDDI | Cocar de luz
   Partículas em WebGL, coloridas com as penas da logomarca, partem dispersas como
   sementes, se reúnem no cocar e revelam a logomarca. Fogem do cursor e se espalham
   como penas ao vento quando a página rola. Sem dependências externas. */
(function(){
  var hero = document.getElementById('hero');
  var esc = document.querySelector('#hero .hero-escudo img');
  if(!hero || !esc) return;
  if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if(innerWidth < 900) return;

  var cv = document.createElement('canvas');
  cv.className = 'm-cocar'; cv.setAttribute('aria-hidden','true');
  var gl = cv.getContext('webgl', {alpha:true, antialias:false, premultipliedAlpha:true});
  if(!gl) return;
  hero.insertBefore(cv, hero.firstChild.nextSibling);
  hero.classList.add('m-cocar-on');

  // logomarca sem fundo, para flutuar sobre a fotografia (troca também quando o idioma muda)
  function alfa(src){ return src.replace(/logo-cmddi-(\w\w)\.jpg/, 'logo-cmddi-$1-alfa.webp'); }
  esc.setAttribute('src', alfa(esc.getAttribute('src')));
  new MutationObserver(function(){ var a = esc.getAttribute('src'); if(/\.jpg/.test(a)) esc.setAttribute('src', alfa(a)); })
    .observe(esc, {attributes:true, attributeFilter:['src']});

  var VS = [
    'attribute vec2 aStart; attribute vec2 aTarget; attribute vec3 aColor; attribute vec2 aSeed;',
    'uniform vec2 uRes; uniform vec4 uRect; uniform vec2 uMouse; uniform float uTime, uProg, uScatter, uDpr, uFade;',
    'varying vec3 vColor; varying float vAlpha;',
    'void main(){',
    '  float s = aSeed.x; float amb = aSeed.y;',
    '  vec2 tgt = amb > .5 ? aTarget * uRes : uRect.xy + aTarget * uRect.zw;',
    '  float d = clamp(uProg * 1.45 - s * .45, 0., 1.);',
    '  float e = 1. - pow(1. - d, 3.);',
    '  vec2 p = mix(aStart, tgt, e);',
    '  float sw = 1. - e;',
    '  p += vec2(sin(uTime * 1.3 + s * 40.), cos(uTime * 1.1 + s * 33.)) * 60. * sw * sw;',
    '  p += vec2(sin(uTime * .7 + s * 21.), cos(uTime * .8 + s * 17.)) * (amb > .5 ? 22. : 1.6);',
    '  vec2 dm = p - uMouse; float dist = length(dm) + .001;',
    '  p += dm / dist * max(0., 140. - dist) * (amb > .5 ? .6 : .85);',
    '  float sc = uScatter * uScatter;',
    '  p += vec2((s - .5) * 900. + sin(s * 90. + uTime) * 40., -(260. + 520. * fract(s * 7.31))) * sc;',
    '  vec2 clip = (p / uRes) * 2. - 1.;',
    '  gl_Position = vec4(clip.x, -clip.y, 0., 1.);',
    '  float sz = amb > .5 ? 1.6 + 3.2 * fract(s * 13.7) : 2.1 + 1.5 * fract(s * 5.3);',
    '  gl_PointSize = sz * uDpr * (1. + sw * 1.4);',
    '  vColor = aColor;',
    '  float tw = .55 + .45 * sin(uTime * 2.2 + s * 60.);',
    '  vAlpha = amb > .5 ? (.18 + .35 * tw) * smoothstep(0., .4, uProg) : mix(.95, uFade * (.6 + .4 * tw), smoothstep(.85, 1., uProg));',
    '  vAlpha *= 1. - sc * .7;',
    '}'].join('\n');
  var FS = [
    'precision mediump float; varying vec3 vColor; varying float vAlpha;',
    'void main(){ float r = length(gl_PointCoord - .5); float a = smoothstep(.5, .0, r); a = a * a;',
    '  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha); }'].join('\n');

  function sh(t, src){ var s = gl.createShader(t); gl.shaderSource(s, src); gl.compileShader(s); return s; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  if(!gl.getProgramParameter(pr, gl.LINK_STATUS)){ cv.remove(); hero.classList.remove('m-cocar-on'); return; }
  gl.useProgram(pr);
  var U = {}; ['uRes','uRect','uMouse','uTime','uProg','uScatter','uDpr','uFade'].forEach(function(n){ U[n] = gl.getUniformLocation(pr, n); });

  var W = 0, H = 0, dpr = Math.min(devicePixelRatio || 1, 2), rect = [0,0,1,1];
  function medir(){
    var hr = hero.getBoundingClientRect(); W = hr.width; H = hr.height;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px';
    var er = esc.getBoundingClientRect();
    rect = [er.left - hr.left, er.top - hr.top, er.width, er.height];
    gl.viewport(0, 0, cv.width, cv.height);
  }

  var img = new Image();
  img.onload = function(){
    var S = 240, c = document.createElement('canvas'); c.width = c.height = S;
    var x = c.getContext('2d'); x.drawImage(img, 0, 0, S, S);
    var px = x.getImageData(0, 0, S, S).data, cand = [];
    for(var yy = 0; yy < S * .56; yy++) for(var xx = 0; xx < S; xx++){
      var i = (yy * S + xx) * 4, r = px[i], g = px[i+1], b = px[i+2], al = px[i+3];
      var mx = Math.max(r,g,b), mn = Math.min(r,g,b);
      if(al > 140 && (mx - mn > 60 || mx > 225)) cand.push([xx, yy, r, g, b]);
    }
    for(var k = cand.length - 1; k > 0; k--){ var j = Math.random() * (k + 1) | 0, t = cand[k]; cand[k] = cand[j]; cand[j] = t; }
    var NC = Math.min(cand.length, 7000), NA = 1400, N = NC + NA;
    var st = new Float32Array(N*2), tg = new Float32Array(N*2), co = new Float32Array(N*3), sd = new Float32Array(N*2);
    medir();
    var pal = [[.83,.58,.29],[.91,.72,.43],[.35,.56,.24],[.95,.85,.62]];
    for(var n = 0; n < N; n++){
      var ang = Math.random() * 6.283, rad = Math.max(W, H) * (.35 + Math.random() * .7);
      st[n*2] = W * .6 + Math.cos(ang) * rad; st[n*2+1] = H * .5 + Math.sin(ang) * rad;
      sd[n*2] = Math.random();
      if(n < NC){
        var p = cand[n];
        tg[n*2] = (p[0] + Math.random()) / S; tg[n*2+1] = (p[1] + Math.random()) / S;
        co[n*3] = p[2] / 255; co[n*3+1] = p[3] / 255; co[n*3+2] = p[4] / 255; sd[n*2+1] = 0;
      } else {
        tg[n*2] = Math.random(); tg[n*2+1] = Math.random();
        var q = pal[Math.random() * pal.length | 0]; co[n*3] = q[0]; co[n*3+1] = q[1]; co[n*3+2] = q[2]; sd[n*2+1] = 1;
      }
    }
    function buf(name, arr, size){
      var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); gl.bufferData(gl.ARRAY_BUFFER, arr, gl.STATIC_DRAW);
      var l = gl.getAttribLocation(pr, name); gl.enableVertexAttribArray(l); gl.vertexAttribPointer(l, size, gl.FLOAT, false, 0, 0);
    }
    buf('aStart', st, 2); buf('aTarget', tg, 2); buf('aColor', co, 3); buf('aSeed', sd, 2);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    var mouse = [-9999, -9999], t0 = performance.now(), vis = true, revelado = false, scat = 0;
    hero.addEventListener('mousemove', function(e){ var hr = hero.getBoundingClientRect(); mouse = [e.clientX - hr.left, e.clientY - hr.top]; });
    hero.addEventListener('mouseleave', function(){ mouse = [-9999, -9999]; });
    addEventListener('resize', medir);
    addEventListener('scroll', function(){ scat = Math.min(1, Math.max(0, scrollY / (hero.offsetHeight * .9))); }, {passive:true});
    var espera = !!document.getElementById('cm-ab');
    new IntersectionObserver(function(es){ if(espera) return; vis = es[0].isIntersecting; if(vis) requestAnimationFrame(frame); }).observe(hero);

    var DUR = 3600;
    if(espera){ vis = false; addEventListener('abertura-fim', function(){ setTimeout(function(){ espera = false; t0 = performance.now(); vis = true; requestAnimationFrame(frame); }, 350); }, {once:true}); }
    function frame(now){
      if(!vis) return;
      var el = now - t0, prog = Math.min(1, el / DUR);
      if(prog >= .92 && !revelado){ revelado = true; hero.classList.add('m-cocar-revela'); medir(); }
      gl.clearColor(0,0,0,0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uRes, W, H); gl.uniform4f(U.uRect, rect[0], rect[1], rect[2], rect[3]);
      gl.uniform2f(U.uMouse, mouse[0], mouse[1]); gl.uniform1f(U.uTime, el / 1000);
      gl.uniform1f(U.uProg, prog); gl.uniform1f(U.uScatter, scat); gl.uniform1f(U.uDpr, dpr); gl.uniform1f(U.uFade, .22);
      gl.drawArrays(gl.POINTS, 0, N);
      requestAnimationFrame(frame);
    }
    if(vis) requestAnimationFrame(frame);
  };
  img.src = esc.getAttribute('src');
})();
