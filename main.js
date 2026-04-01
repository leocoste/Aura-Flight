// ============ CURSOR (désactivé sur tactile) ============
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
const isTouch = window.matchMedia('(hover: none)').matches;

if (!isTouch) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  function animCursor() {
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
}

// ============ NAV SCROLL ============
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);
});

// ============ HAMBURGER MENU ============
const hamburger = document.getElementById('navHamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
    // Bloquer le scroll du body quand le menu est ouvert
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Fermer le menu au clic sur un lien
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });
}

function closeMenu() {
  if (hamburger && navLinks) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// ============ PAGE NAVIGATION ============
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  window.scrollTo(0, 0);
  closeMenu(); // Fermer le menu hamburger si ouvert
  observeFadeIns();
  return false;
}

// ============ FADE IN OBSERVER ============
function observeFadeIns() {
  const els = document.querySelectorAll('.fade-in:not(.visible)');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}
observeFadeIns();

// ============ FORM SUBMIT ============
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    // 1. On récupère le texte exact séléctionné par l'utilisateur
    const selectElt = document.getElementById('f-projet');
    const selectedText = selectElt.options[selectElt.selectedIndex].text;

    // 2. On crée l'objet de données
    const formData = new FormData(contactForm);
    const object = Object.fromEntries(formData);

    // 3. ON SYNCHRONISE TOUT :
    // On force le champ "type_projet" et "subject" avec le TEXTE visible
    object.type_projet = selectedText; 
    object.subject = "Demande pour : " + selectedText;

    const json = JSON.stringify(object);

    // --- Reste du code (Bouton + Fetch) ---
    const btn = contactForm.querySelector('.btn-submit');
    const originalText = btn.innerHTML;
    btn.innerHTML = "Envoi en cours...";
    btn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    })
    .then(async (response) => {
      if (response.status == 200) {
        const notif = document.getElementById('notification');
        notif.classList.add('show');
        setTimeout(() => notif.classList.remove('show'), 3500);
        contactForm.reset();
      } else {
        const result = await response.json();
        alert("Erreur : " + result.message);
      }
    })
    .catch(error => {
      console.error(error);
      alert("Une erreur est survenue lors de l'envoi.");
    })
    .finally(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    });
  });

  // ============ LIGHTBOX ============
  const items = document.querySelectorAll('#portfolio .grid-item');
  const lightbox = document.getElementById('lightbox');
  const content = document.getElementById('lightbox-content');
  const closeBtn = document.querySelector('.close');
  const nextBtn = document.querySelector('.next');
  const prevBtn = document.querySelector('.prev');

  let currentIndex = 0;

  function showMedia(index) {
    const item = items[index];
    const type = item.dataset.type;
    const src = item.dataset.src;

    content.innerHTML = '';

    if (type === "image") {
      content.innerHTML = `<img src="${src}" />`;
    }

    if (type === "youtube") {
      content.innerHTML = `
        <iframe 
          src="https://www.youtube.com/embed/${src}?autoplay=1" 
          frameborder="0" 
          allowfullscreen>
        </iframe>`;
    }

    lightbox.classList.add('active');
    currentIndex = index;
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => showMedia(index));
  });

  closeBtn.onclick = () => {
    lightbox.classList.remove('active');
    content.innerHTML = '';
  };

  nextBtn.onclick = () => {
    currentIndex = (currentIndex + 1) % items.length;
    showMedia(currentIndex);
  };

  prevBtn.onclick = () => {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    showMedia(currentIndex);
  };

  // ESC pour fermer
  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") {
      lightbox.classList.remove('active');
      content.innerHTML = '';
    }
  });

  // Swipe tactile sur la lightbox
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        currentIndex = (currentIndex + 1) % items.length;
      } else {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
      }
      showMedia(currentIndex);
    }
  }, { passive: true });
}
