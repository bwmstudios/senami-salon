/* Senami Salon — main.js */

/* ── Nav: darken on scroll ── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ── Hero: trigger Ken-Burns after load ── */
window.addEventListener('load', () => {
  document.querySelector('.hero')?.classList.add('loaded');
});

/* ── Burger / Drawer ── */
const burger          = document.getElementById('burger');
const drawer          = document.getElementById('drawer');
const drawerClose     = document.getElementById('drawerClose');
const drawerBackdrop  = document.getElementById('drawerBackdrop');

function openDrawer() {
  drawer.classList.add('open');
  drawerBackdrop.classList.add('show');
  document.body.style.overflow = 'hidden';
}
function closeDrawer() {
  drawer.classList.remove('open');
  drawerBackdrop.classList.remove('show');
  document.body.style.overflow = '';
}

burger?.addEventListener('click', openDrawer);
drawerClose?.addEventListener('click', closeDrawer);
drawerBackdrop?.addEventListener('click', closeDrawer);

document.querySelectorAll('.drawer-link').forEach(link => {
  link.addEventListener('click', closeDrawer);
});

/* ── Scroll reveal (IntersectionObserver) ── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Smooth anchor scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = nav.offsetHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── Gallery: lightbox-style click expand ── */
const galleryItems = document.querySelectorAll('.g-item');
let lightbox = null;

function buildLightbox() {
  lightbox = document.createElement('div');
  lightbox.id = 'lightbox';
  lightbox.style.cssText = `
    position:fixed;inset:0;z-index:9999;
    background:rgba(0,0,0,.92);
    display:flex;align-items:center;justify-content:center;
    opacity:0;transition:opacity .3s;cursor:zoom-out;
  `;
  const img = document.createElement('img');
  img.style.cssText = `
    max-width:90vw;max-height:90vh;object-fit:contain;
    border-radius:6px;transform:scale(.96);
    transition:transform .35s cubic-bezier(0.16,1,0.3,1);
  `;
  const close = document.createElement('button');
  close.innerHTML = '✕';
  close.setAttribute('aria-label', 'Close');
  close.style.cssText = `
    position:absolute;top:20px;right:24px;
    font-size:22px;color:rgba(255,255,255,.6);
    background:none;border:none;cursor:pointer;z-index:1;
    transition:color .2s;
  `;
  close.onmouseenter = () => close.style.color = '#fff';
  close.onmouseleave = () => close.style.color = 'rgba(255,255,255,.6)';

  lightbox.appendChild(img);
  lightbox.appendChild(close);
  document.body.appendChild(lightbox);

  function closeLB() {
    lightbox.style.opacity = '0';
    img.style.transform = 'scale(.96)';
    setTimeout(() => { lightbox.style.display = 'none'; }, 300);
    document.body.style.overflow = '';
  }

  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLB(); });
  close.addEventListener('click', closeLB);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox.style.display !== 'none') closeLB();
  });

  return { lightbox, img };
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => {
    if (!lightbox) buildLightbox();
    const lb  = lightbox;
    const img = lb.querySelector('img');
    img.src = item.querySelector('img').src;
    img.alt = item.querySelector('img').alt;
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => {
      lb.style.opacity = '1';
      img.style.transform = 'scale(1)';
    });
  });
});
