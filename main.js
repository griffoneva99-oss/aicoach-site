// HEADER SMART SCROLL
const header = document.getElementById('header');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const cur = window.pageYOffset;
  if (cur > 80) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  if (cur > lastScroll && cur > 200) header.classList.add('hidden'); else header.classList.remove('hidden');
  lastScroll = cur;
}, { passive: true });

// MOBILE MENU
const burger = document.getElementById('navBurger');
const mobileNav = document.getElementById('navMobile');
burger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  const open = mobileNav.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => { mobileNav.classList.remove('open'); }));

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const t = document.querySelector(this.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - header.offsetHeight - 20, behavior: 'smooth' }); }
  });
});

// COUNTERS
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const step = target / 120;
  let cur = 0;
  const t = setInterval(() => {
    cur += step;
    if (cur >= target) { cur = target; clearInterval(t); }
    el.textContent = target >= 10000 ? Math.floor(cur).toLocaleString('fr-FR') : Math.floor(cur);
  }, 16);
}
let countersStarted = false;
window.addEventListener('scroll', () => {
  if (countersStarted) return;
  const stats = document.querySelector('.stats');
  if (stats && stats.getBoundingClientRect().top < window.innerHeight * 0.9) {
    countersStarted = true;
    document.querySelectorAll('.stat-num[data-target]').forEach(el => animateCounter(el));
  }
}, { passive: true });

// BILINGUAL
let currentLang = 'fr';
document.getElementById('langBtn').addEventListener('click', () => {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  document.getElementById('langBtn').textContent = currentLang === 'fr' ? 'EN' : 'FR';
  document.querySelectorAll('[data-fr]').forEach(el => {
    const val = currentLang === 'fr' ? el.dataset.fr : el.dataset.en;
    if (val) el.innerHTML = val;
  });
});

// FORM SUBMIT
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = currentLang === 'fr' ? 'Message envoyé !' : 'Message sent!';
    btn.style.background = '#1EB478';
    setTimeout(() => { btn.textContent = currentLang === 'fr' ? 'Envoyer le message' : 'Send message'; btn.style.background = ''; }, 3000);
  });
}
