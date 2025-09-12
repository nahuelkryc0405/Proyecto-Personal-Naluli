document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('top');
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (btn && header) {
    btn.addEventListener('click', () => {
      const open = header.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (nav) {
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        header.classList.remove('is-open');
        btn && btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const links = document.querySelectorAll('.nav-links a');
  const sections = ['hero','catalogo','contacto'].map(id => document.getElementById(id)).filter(Boolean);
  const spy = () => {
    let current = null;
    const y = window.scrollY + 90;
    sections.forEach(s => { if (s.offsetTop <= y) current = s.id; });
    links.forEach(l => { l.classList.toggle('active', l.getAttribute('href') === '#' + current); });
  };
  spy();
  window.addEventListener('scroll', spy, { passive: true });

  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const email = form.email.value.trim();
      const mensaje = form.mensaje.value.trim();
      if (!nombre || !email || !mensaje) { alert('Por favor, completá todos los campos.'); return; }
      const phone = '549116364674';
      const texto = `Hola Naluli! Soy ${nombre}. Mi email es ${email}. Quería consultar: ${mensaje}`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(texto)}`;
      window.open(url, '_blank');
      form.reset();
    });
  }
});
