/* ============================================================
   LOADER
============================================================ */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('loaded'), 300);
});

/* ============================================================
   MOBILE MENU
============================================================ */
const menuIcon = document.getElementById('menu-icon');
const navlist = document.getElementById('navlist');

menuIcon.addEventListener('click', () => {
  navlist.classList.toggle('active');
  const icon = menuIcon.querySelector('i');
  icon.classList.toggle('fa-bars');
  icon.classList.toggle('fa-xmark');
});

document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navlist.classList.remove('active');
    const icon = menuIcon.querySelector('i');
    icon.classList.add('fa-bars');
    icon.classList.remove('fa-xmark');
  });
});

/* ============================================================
   ACTIVE NAV LINK ON SCROLL
============================================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink(){
  let current = 'home';
  const scrollY = window.pageYOffset;
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    const height = sec.offsetHeight;
    if (scrollY >= top && scrollY < top + height) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active-link', link.getAttribute('href') === `#${current}`);
  });
}
window.addEventListener('scroll', setActiveLink);

/* ============================================================
   HEADER SHADOW ON SCROLL
============================================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.style.boxShadow = window.scrollY > 40 ? '0 8px 30px rgba(0,0,0,0.25)' : 'none';
});

/* ============================================================
   THEME TOGGLE (dark / light)
============================================================ */
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme){
  root.setAttribute('data-theme', theme);
  themeToggle.innerHTML = theme === 'light'
    ? "<i class='fa-solid fa-sun'></i>"
    : "<i class='fa-solid fa-moon'></i>";
}

let savedTheme = 'dark';
try {
  savedTheme = localStorage.getItem('portfolio-theme') ||
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
} catch (e) { /* localStorage unavailable — default to dark */ }
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
});

/* ============================================================
   TYPEWRITER EFFECT (hero status line)
============================================================ */
const typedEl = document.getElementById('typed-line');
const phrases = [
  'Open to Internships',
  'Building Full-Stack Projects',
  'Learning Every Day'
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  if (!typedEl) return;
  const current = phrases[phraseIndex];
  if (!deleting){
    charIndex++;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length){
      deleting = true;
      setTimeout(typeLoop, 1400);
      return;
    }
  } else {
    charIndex--;
    typedEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0){
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
============================================================ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

/* ============================================================
   ANIMATED COUNTERS (About stats)
============================================================ */
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-count'), 10);
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const tick = () => {
      count = Math.min(target, count + step);
      el.textContent = count;
      if (count < target) requestAnimationFrame(tick);
    };
    tick();
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => counterObserver.observe(c));

/* ============================================================
   CONTACT FORM — EmailJS
   To activate: sign up free at https://www.emailjs.com,
   then replace the three placeholder strings below with
   your Public Key, Service ID, and Template ID, and add
   the EmailJS CDN script tag to index.html before script.js:
   <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
============================================================ */
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';
const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';
const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';

if (window.emailjs && EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    status.textContent = 'Contact form is not connected yet — add your EmailJS keys in script.js.';
    return;
  }

  status.textContent = 'Sending...';
  emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form)
    .then(() => {
      status.textContent = 'Message sent — thank you! I will get back to you soon.';
      form.reset();
    })
    .catch(() => {
      status.textContent = 'Something went wrong. Please email me directly instead.';
    });
});

/* ============================================================
   FOOTER YEAR
============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();