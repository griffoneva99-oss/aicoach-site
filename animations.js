// LISÉRÉS BLEUS LUMINEUX ONDULANTS
function initDigitalCanvas() {
  const canvas = document.getElementById('digitalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = canvas.parentElement.offsetHeight || 600;
  }
  resize();
  window.addEventListener('resize', () => { resize(); });

  const W = () => canvas.width;
  const H = () => canvas.height;

  // Création des lisérés ondulants
  const streams = [
    { yBase: 0.35, amp: 0.12, freq: 0.8, speed: 0.004, phase: 0, width: 3, alpha: 0.7, color: '30,140,255' },
    { yBase: 0.45, amp: 0.08, freq: 1.1, speed: 0.003, phase: 1.2, width: 2, alpha: 0.5, color: '60,160,255' },
    { yBase: 0.55, amp: 0.14, freq: 0.7, speed: 0.005, phase: 2.5, width: 2.5, alpha: 0.6, color: '20,120,240' },
    { yBase: 0.65, amp: 0.06, freq: 1.4, speed: 0.0035, phase: 0.8, width: 1.5, alpha: 0.4, color: '80,180,255' },
  ];

  let t = 0;

  function drawStream(s) {
    const h = H(), w = W();
    const steps = Math.ceil(w / 3);

    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * w;
      const wave1 = Math.sin(x * 0.006 * s.freq + t * s.speed * 300 + s.phase) * s.amp * h;
      const wave2 = Math.sin(x * 0.003 * s.freq + t * s.speed * 200 + s.phase + 1) * s.amp * 0.4 * h;
      const y = s.yBase * h + wave1 + wave2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }

    // Glow effect — plusieurs passes
    for (let pass = 0; pass < 4; pass++) {
      const blurW = s.width * (1 + pass * 2.5);
      const a = s.alpha * (1 - pass * 0.22);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(${s.color},${a * (pass === 0 ? 1 : 0.4)})`;
      ctx.lineWidth = pass === 0 ? s.width : blurW;
      ctx.stroke();
    }

    // Ligne centrale brillante
    ctx.strokeStyle = `rgba(180,220,255,${s.alpha * 0.6})`;
    ctx.lineWidth = s.width * 0.4;
    ctx.stroke();

    // Points lumineux le long du tracé
    const dotCount = Math.floor(w / 120);
    for (let d = 0; d < dotCount; d++) {
      const prog = (d / dotCount + t * 0.0003 * s.speed * 80) % 1;
      const x = prog * w;
      const wave1 = Math.sin(x * 0.006 * s.freq + t * s.speed * 300 + s.phase) * s.amp * h;
      const wave2 = Math.sin(x * 0.003 * s.freq + t * s.speed * 200 + s.phase + 1) * s.amp * 0.4 * h;
      const y = s.yBase * h + wave1 + wave2;
      const pAlpha = 0.4 + 0.6 * Math.sin(t * 0.05 + d * 1.3);
      ctx.beginPath();
      ctx.arc(x, y, s.width * 1.2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,230,255,${pAlpha * s.alpha})`;
      ctx.fill();
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W(), H());
    streams.forEach(drawStream);
    t++;
    requestAnimationFrame(animate);
  }
  animate();
}
initDigitalCanvas();

// PARTICLES LÉGÈRES
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 15; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `left:${Math.random()*100}%;animation-duration:${8+Math.random()*10}s;animation-delay:${Math.random()*8}s;width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;opacity:${0.2+Math.random()*0.3};`;
    container.appendChild(p);
  }
}
createParticles();

// REVEAL ON SCROLL
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// HERO LOAD
window.addEventListener('load', () => {
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 150 + 300);
  });
});

// PARALLAX
window.addEventListener('scroll', () => {
  [{ section: '.event', img: '.event-bg img' }, { section: '.download', img: '.download-bg img' }]
    .forEach(({ section, img }) => {
      const el = document.querySelector(section);
      const im = document.querySelector(img);
      if (!el || !im) return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
        im.style.transform = `translateY(${(p - 0.5) * 60}px) scale(1.1)`;
      }
    });
}, { passive: true });

// CARD 3D HOVER
document.querySelectorAll('.app-card, .pricing-card, .testi-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 5;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 5;
    card.style.transform = `perspective(1000px) rotateX(${-y}deg) rotateY(${x}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});
