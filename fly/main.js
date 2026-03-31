// ============ CURSOR ============
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

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

// ============ NAV SCROLL ============
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 40);
});

// ============ PAGE NAVIGATION ============
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  document.getElementById('nav-' + id).classList.add('active');
  window.scrollTo(0, 0);
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
function submitForm() {
  const email = document.getElementById('f-email').value;
  const prenom = document.getElementById('f-prenom').value;
  if (!email || !prenom) {
    alert('Merci de renseigner au minimum votre prénom et votre email.');
    return;
  }
  const notif = document.getElementById('notification');
  notif.classList.add('show');
  setTimeout(() => notif.classList.remove('show'), 3500);
  // Réinitialisation du formulaire
  ['f-prenom', 'f-nom', 'f-email', 'f-tel', 'f-message'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('f-projet').selectedIndex = 0;
  document.getElementById('f-forfait').selectedIndex = 0;
}
