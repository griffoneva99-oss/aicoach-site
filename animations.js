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
