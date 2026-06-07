// PARTICLES HERO
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 8) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 4) + 'px';
    p.style.opacity = (0.3 + Math.random() * 0.5).toString();
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

// PARALLAX BG SECTIONS
const parallaxSections = [
  { section: '.event', img: '.event-bg img' },
  { section: '.download', img: '.download-bg img' }
];
window.addEventListener('scroll', () => {
  parallaxSections.forEach(({ section, img }) => {
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

// STATS GLOW ANIMATION
document.querySelectorAll('.stat-item').forEach((item, i) => {
  item.style.animationDelay = (i * 0.1) + 's';
});

// ORANGE CURSOR TRAIL ON HERO
const hero = document.querySelector('.hero');
if (hero && window.innerWidth > 900) {
  hero.addEventListener('mousemove', e => {
    const dot = document.createElement('div');
    dot.style.cssText = `position:fixed;width:5px;height:5px;background:#FF781E;border-radius:50%;pointer-events:none;z-index:9999;left:${e.clientX-2.5}px;top:${e.clientY-2.5}px;opacity:.7;transition:opacity .8s,transform .8s;`;
    document.body.appendChild(dot);
    setTimeout(() => { dot.style.opacity='0'; dot.style.transform='scale(0)'; }, 50);
    setTimeout(() => dot.remove(), 850);
  });
}

// TRAITS DIGITAUX BLEUS SUR FOND BLANC
function initDigitalCanvas() {
  const canvas = document.getElementById('digitalCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const lines = Array.from({length: 8}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 1.2,
    vy: (Math.random() - 0.5) * 0.8,
    len: 80 + Math.random() * 120,
    alpha: 0.15 + Math.random() * 0.25,
    width: 1 + Math.random() * 1.5,
    history: [],
  }));

  const dots = Array.from({length: 30}, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1 + Math.random() * 2,
    alpha: 0.1 + Math.random() * 0.3,
    pulse: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Traits ondulés
    lines.forEach(line => {
      line.history.push({x: line.x, y: line.y});
      if (line.history.length > line.len) line.history.shift();
      line.x += line.vx;
      line.y += line.vy;
      if (line.x < 0 || line.x > canvas.width) line.vx *= -1;
      if (line.y < 0 || line.y > canvas.height) line.vy *= -1;

      if (line.history.length > 2) {
        ctx.beginPath();
        ctx.moveTo(line.history[0].x, line.history[0].y);
        for (let i = 1; i < line.history.length; i++) {
          ctx.lineTo(line.history[i].x, line.history[i].y);
        }
        const grad = ctx.createLinearGradient(
          line.history[0].x, line.history[0].y,
          line.history[line.history.length-1].x, line.history[line.history.length-1].y
        );
        grad.addColorStop(0, `rgba(30,120,220,0)`);
        grad.addColorStop(0.5, `rgba(30,120,220,${line.alpha})`);
        grad.addColorStop(1, `rgba(30,120,220,0)`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = line.width;
        ctx.stroke();
      }
    });

    // Points brillants
    dots.forEach(dot => {
      dot.pulse += 0.03;
      const a = dot.alpha * (0.6 + 0.4 * Math.sin(dot.pulse));
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(30,120,220,${a})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
}
initDigitalCanvas();

// FIX IMAGES MANQUANTES — retry avec fallback
document.querySelectorAll('.app-card-img').forEach(img => {
  img.addEventListener('error', () => {
    if (!img.dataset.retried) {
      img.dataset.retried = '1';
      const urls = [
        'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&q=80',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=80',
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
      ];
      const idx = Array.from(document.querySelectorAll('.app-card-img')).indexOf(img);
      img.src = urls[idx % urls.length];
    }
  });
});
