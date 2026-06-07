// LISÉRÉS BLEUS 3D ONDULANTS — fond du site entier
(function() {
  // Créer un canvas fixe derrière tout le site
  const canvas = document.createElement('canvas');
  canvas.id = 'siteCanvas';
  canvas.style.cssText = `
    position:fixed;top:0;left:0;width:100vw;height:100vh;
    pointer-events:none;z-index:0;opacity:1;
  `;
  document.body.insertBefore(canvas, document.body.firstChild);

  // S'assurer que tout le contenu est au-dessus
  document.querySelectorAll('body > *:not(#siteCanvas)').forEach(el => {
    if (getComputedStyle(el).position === 'static') {
      el.style.position = 'relative';
    }
    el.style.zIndex = '1';
  });

  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // 5 lisérés avec paramètres distincts
  const streams = [
    { yRatio: 0.18, amp: 90,  freq: 0.0035, speed: 0.008, phase: 0.0, thick: 3.5, color: [20,130,255],  glow: 28 },
    { yRatio: 0.38, amp: 70,  freq: 0.0042, speed: 0.006, phase: 1.8, thick: 2.5, color: [40,160,255],  glow: 22 },
    { yRatio: 0.55, amp: 110, freq: 0.0028, speed: 0.009, phase: 3.2, thick: 4,   color: [10,110,240],  glow: 32 },
    { yRatio: 0.72, amp: 60,  freq: 0.0050, speed: 0.007, phase: 0.9, thick: 2,   color: [70,180,255],  glow: 18 },
    { yRatio: 0.88, amp: 80,  freq: 0.0038, speed: 0.0055,phase: 2.1, thick: 3,   color: [30,150,255],  glow: 25 },
  ];

  let t = 0;

  function getY(s, x) {
    const w1 = Math.sin(x * s.freq + t * s.speed + s.phase);
    const w2 = Math.sin(x * s.freq * 1.7 + t * s.speed * 0.6 + s.phase + 1.4) * 0.35;
    const w3 = Math.sin(x * s.freq * 0.5 + t * s.speed * 1.3 + s.phase + 2.8) * 0.2;
    return s.yRatio * canvas.height + (w1 + w2 + w3) * s.amp;
  }

  function drawStream(s) {
    const W = canvas.width;
    const steps = Math.ceil(W / 2);
    const [r, g, b] = s.color;

    // Construire le path
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * W;
      const y = getY(s, x);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    // Couche 1 — halo large et doux
    ctx.shadowBlur = 0;
    ctx.strokeStyle = `rgba(${r},${g},${b},0.08)`;
    ctx.lineWidth = s.thick * 8;
    ctx.stroke();

    // Couche 2 — glow moyen
    ctx.strokeStyle = `rgba(${r},${g},${b},0.18)`;
    ctx.lineWidth = s.thick * 4;
    ctx.stroke();

    // Couche 3 — glow serré
    ctx.strokeStyle = `rgba(${r},${g},${b},0.45)`;
    ctx.lineWidth = s.thick * 1.8;
    ctx.stroke();

    // Couche 4 — ligne principale lumineuse
    ctx.strokeStyle = `rgba(${r},${g},${b},0.85)`;
    ctx.lineWidth = s.thick;
    ctx.stroke();

    // Couche 5 — reflet blanc au centre
    ctx.strokeStyle = `rgba(200,230,255,0.55)`;
    ctx.lineWidth = s.thick * 0.3;
    ctx.stroke();

    // Points lumineux mobiles
    const dotCount = 6;
    for (let d = 0; d < dotCount; d++) {
      const prog = ((d / dotCount) + t * s.speed * 0.015) % 1;
      const x = prog * W;
      const y = getY(s, x);
      const pulse = 0.5 + 0.5 * Math.sin(t * 0.08 + d * 2.1);

      // Halo du point
      const grad = ctx.createRadialGradient(x, y, 0, x, y, s.thick * 5);
      grad.addColorStop(0, `rgba(200,235,255,${0.9 * pulse})`);
      grad.addColorStop(0.4, `rgba(${r},${g},${b},${0.5 * pulse})`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(x, y, s.thick * 5, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Noyau brillant
      ctx.beginPath();
      ctx.arc(x, y, s.thick * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(230,245,255,${0.95 * pulse})`;
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fond blanc légèrement teinté
    ctx.fillStyle = 'rgba(248,250,255,1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    streams.forEach(drawStream);
    t++;
    requestAnimationFrame(animate);
  }
  animate();
})();

// Supprimer l'ancien canvas hero s'il existe
window.addEventListener('DOMContentLoaded', () => {
  const old = document.getElementById('digitalCanvas');
  if (old) old.style.display = 'none';
});

// REVEAL ON SCROLL
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
  // Hero visible immédiatement
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150 + 200);
  });
});

// PARALLAX sections plein écran
window.addEventListener('scroll', () => {
  [{ s: '.event', i: '.event-bg img' }, { s: '.download', i: '.download-bg img' }]
    .forEach(({ s, i }) => {
      const el = document.querySelector(s), im = document.querySelector(i);
      if (!el || !im) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) {
        const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
        im.style.transform = `translateY(${(p - 0.5) * 60}px) scale(1.1)`;
      }
    });
}, { passive: true });

// CARD 3D HOVER
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.app-card, .pricing-card, .testi-card, .team-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 6;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 6;
      card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
});
