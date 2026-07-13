
/* V15: forzar apertura siempre desde la portada */
(function forceStartAtTop() {
  function resetToTop() {
    if (location.hash) {
      history.replaceState(null, document.title, location.pathname + location.search);
    }
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }

  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  resetToTop();

  document.addEventListener("DOMContentLoaded", () => {
    resetToTop();
    requestAnimationFrame(resetToTop);
    setTimeout(resetToTop, 50);
    setTimeout(resetToTop, 250);
  });

  window.addEventListener("load", () => {
    resetToTop();
    requestAnimationFrame(resetToTop);
    setTimeout(resetToTop, 100);
  });

  window.addEventListener("pageshow", event => {
    resetToTop();
    if (event.persisted) {
      requestAnimationFrame(resetToTop);
      setTimeout(resetToTop, 100);
    }
  });
})();

if("scrollRestoration" in history){history.scrollRestoration="manual";}
window.addEventListener("load",()=>window.scrollTo(0,0));
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.addEventListener('pageshow', () => {
  if (!window.location.hash) window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
});
const config = window.WEDDING_CONFIG || {};

document.querySelectorAll('[data-link]').forEach(link => {
  const kind = link.dataset.link;
  const url = kind === 'pinterest' ? config.pinterestUrl
    : kind === 'forms' ? config.formsUrl
    : kind === 'maps' ? config.mapsUrl
    : null;

  if (url && !url.startsWith('PEGAR_AQUI')) {
    link.href = url;
  } else if (kind !== 'maps') {
    link.addEventListener('click', event => {
      event.preventDefault();
      alert('Este botón todavía necesita que agregues el enlace en config.js.');
    });
  }
});

const target = new Date(config.weddingDate || '2026-11-06T17:15:00-03:00').getTime();
const els = {
  days: document.getElementById('days'),
  hours: document.getElementById('hours'),
  minutes: document.getElementById('minutes'),
  seconds: document.getElementById('seconds'),
  finished: document.getElementById('countdown-finished')
};

function updateCountdown() {
  const diff = target - Date.now();
  if (diff <= 0) {
    document.querySelector('.countdown').hidden = true;
    els.finished.hidden = false;
    return;
  }
  const day = 86400000, hour = 3600000, minute = 60000;
  els.days.textContent = String(Math.floor(diff / day)).padStart(3, '0');
  els.hours.textContent = String(Math.floor((diff % day) / hour)).padStart(2, '0');
  els.minutes.textContent = String(Math.floor((diff % hour) / minute)).padStart(2, '0');
  els.seconds.textContent = String(Math.floor((diff % minute) / 1000)).padStart(2, '0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const gallery = document.getElementById('gallery');
document.getElementById('gallery-next').addEventListener('click', () => {
  gallery.scrollBy({ left: gallery.clientWidth * .75, behavior: 'smooth' });
});
document.getElementById('gallery-prev').addEventListener('click', () => {
  gallery.scrollBy({ left: -gallery.clientWidth * .75, behavior: 'smooth' });
});

document.querySelectorAll('.copy-account').forEach(button => {
  button.addEventListener('click', async () => {
    const box = button.closest('.account-data');
    const text = [...box.querySelectorAll('p')].map(p => p.innerText).join('\n');
    try {
      await navigator.clipboard.writeText(text);
      const original = button.textContent;
      button.textContent = 'Datos copiados';
      setTimeout(() => button.textContent = original, 1800);
    } catch {
      alert('No se pudieron copiar automáticamente. Podés seleccionar los datos manualmente.');
    }
  });
});

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  document.body.classList.toggle('menu-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.textContent = open ? 'Cerrar' : 'Menú';
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menú';
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');
document.querySelectorAll('.gallery img, .rsvp-photo img').forEach(img => { img.addEventListener('click', () => { lightboxImage.src = img.src; lightboxImage.alt = img.alt; lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden','false'); document.body.classList.add('menu-open'); }); });
function closeLightbox(){ lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden','true'); document.body.classList.remove('menu-open'); }
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox(); });


// Aparición escalonada para tarjetas y fotos, sin afectar la navegación.
document.querySelectorAll('.details-grid .detail-card, .gallery figure, .gift-options details, .faq-list details').forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 55, 275)}ms`;
});
