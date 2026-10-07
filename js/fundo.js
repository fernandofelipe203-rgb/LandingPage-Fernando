/* ===== Fundo: rede de pontos conectados, com "mensagens" (pontos verdes) viajando entre eles ===== */
(function () {
  const cv = document.getElementById("fundo"), ctx = cv.getContext("2d");
  const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const D = 130; // distância máxima para dois pontos se ligarem
  let W, H, pts = [], pulsos = [], A, B, mouse = { x: -999, y: -999 };

  function cores() {
    const st = getComputedStyle(document.documentElement);
    A = st.getPropertyValue("--rgb-a").trim(); B = st.getPropertyValue("--rgb-b").trim();
  }
  function medir() {
    const dpr = Math.min(devicePixelRatio, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(110, Math.max(40, Math.round(W * H / 17000)));
    pts = Array.from({ length: n }, (_, i) => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: 1 + Math.random() * 1.8, c: i % 3 ? B : A
    }));
    pulsos = [];
  }
  addEventListener("pointermove", e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  addEventListener("pointerleave", () => { mouse.x = mouse.y = -999; });

  function desenhar(animar) {
    ctx.clearRect(0, 0, W, H);
    pts.forEach(p => {
      if (animar) {
        const dm = Math.hypot(mouse.x - p.x, mouse.y - p.y);
        if (dm < 220) { p.vx += (mouse.x - p.x) * 0.00002; p.vy += (mouse.y - p.y) * 0.00002; } // o mouse atrai de leve
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx)); p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }
      ctx.fillStyle = "rgba(" + p.c + ",.85)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill();
    });
    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
      const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
      if (d < D) { ctx.strokeStyle = "rgba(" + B + "," + ((1 - d / D) * 0.28) + ")"; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
    }
    pts.forEach(p => { // ligações com o mouse, em verde
      const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
      if (d < 170) { ctx.strokeStyle = "rgba(" + A + "," + ((1 - d / 170) * 0.6) + ")"; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke(); }
    });
    if (!animar) return;
    // "mensagens" viajando entre pontos vizinhos
    if (pulsos.length < 6 && Math.random() < 0.03) {
      const a = pts[Math.floor(Math.random() * pts.length)], b = pts.find(q => q !== a && Math.hypot(q.x - a.x, q.y - a.y) < D);
      if (b) pulsos.push({ a, b, t: 0 });
    }
    pulsos = pulsos.filter(p => (p.t += 0.025) < 1);
    pulsos.forEach(p => {
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      ctx.shadowBlur = 14; ctx.shadowColor = "rgb(" + A + ")"; ctx.fillStyle = "rgb(" + A + ")";
      ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.3); ctx.fill(); ctx.shadowBlur = 0;
    });
  }

  cores(); medir();
  addEventListener("resize", () => { medir(); if (reduz) desenhar(false); });
  if (reduz) { desenhar(false); return; } // sem movimento para quem prefere assim
  (function animar() { desenhar(true); requestAnimationFrame(animar); })();
})();
