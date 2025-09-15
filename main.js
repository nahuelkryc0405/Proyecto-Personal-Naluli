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
    let current = sections[0].id;
    const y = window.scrollY + 100;
    for (let i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= y) {
        current = sections[i].id;
      }
    }
    // Si estamos al final de la página, activa la última sección
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
      current = sections[sections.length - 1].id;
    }
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });
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
(function () {
  const STORAGE_KEY = 'theme';
  const DARK_CLASS = 'dark';

  function isDark() {
    return document.body.classList.contains(DARK_CLASS);
  }

  function applyStoredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark') {
        document.body.classList.add(DARK_CLASS);
      } else if (saved === 'light') {
        document.body.classList.remove(DARK_CLASS);
      }
    } catch (e) {
      // Si localStorage no está disponible, seguimos sin persistencia
    }
  }

  function updateButtonLabel(btn) {
      const dark = isDark();
      btn.textContent = dark ? 'Modo claro' : 'Modo oscuro';
      btn.title = dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
  }

  function initThemeToggle() {
    applyStoredTheme();

    let btn = document.getElementById('theme-toggle');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'theme-toggle';
      btn.className = 'theme-toggle';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-label', 'Alternar modo oscuro');
      document.body.appendChild(btn);
    }

    updateButtonLabel(btn);

    btn.addEventListener('click', function () {
      document.body.classList.toggle(DARK_CLASS);
      try {
        localStorage.setItem(STORAGE_KEY, isDark() ? 'dark' : 'light');
      } catch (e) {
        // ignorar si no se puede persistir
      }
      updateButtonLabel(btn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

(function () {
  function findHideTarget() {
    // Priorizar el header completo si existe
    const header = document.querySelector('header.site-header, header#top, header[role="banner"], .site-header, header');
    if (header) return header;

    // Si no hay header, usar el nav o su contenedor más cercano de header
    const nav = document.querySelector('#site-nav, nav, [role="navigation"], .navbar, .nav, .top-nav');
    if (!nav) return null;
    const wrapper = nav.closest('header, .site-header, .header, .topbar, .top-bar');
    return wrapper || nav;
  }

  function initHideNavOnScroll() {
    const bar = findHideTarget();
    if (!bar) return;

    bar.classList.add('hide-on-scroll');

    let lastY = window.scrollY || 0;
    let ticking = false;
    const threshold = 10; // evitar parpadeos por micro scroll

    function update() {
      ticking = false;
      const y = window.scrollY || 0;

      if (y <= 0) {
        bar.classList.remove('is-hidden');
        lastY = y;
        return;
      }

      const delta = y - lastY;
      if (Math.abs(delta) < threshold) return;

      if (delta > 0) {
        // Scrolleo hacia abajo: ocultar
        bar.classList.add('is-hidden');
      } else {
        // Scrolleo hacia arriba: mostrar
        bar.classList.remove('is-hidden');
      }
      lastY = y;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHideNavOnScroll);
  } else {
    initHideNavOnScroll();
  }
})();

(function CartModule() {
  const CART_KEY = 'cart';

  // Integración opcional con Tienda Nube
  // - Define TN.domain (sin https://)
  // - Agrega data-tn-variant="<ID_VARIANTE>" en cada .product-card
  // - Implementa TN.buildCartUrl si tienes el formato de URL de tu tienda
  const TN = {
    domain: '', // ejemplo: 'mitienda.tiendanube.com'
    buildCartUrl(items) {
      // items = [{ variant: '123456', qty: 2 }, ...]
      // Devuelve una URL absoluta o relativa, o null si no aplica
      return null;
    }
  };

  const styles = `
  .cart-fab{position:fixed;right:1rem;bottom:4.25rem;display:inline-flex;align-items:center;gap:.5rem;background:var(--accent);color:#fff;font-weight:800;border:0;border-radius:999px;padding:.7rem 1rem;box-shadow:var(--shadow);cursor:pointer;z-index:10000}
  .cart-fab:hover{opacity:.95;transform:translateY(-1px)}
  .cart-badge{min-width:22px;height:22px;line-height:22px;text-align:center;font-size:.8rem;font-weight:800;color:#fff;background:#ef476f;border-radius:999px;padding:0 .35rem}
  .cart-overlay{position:fixed;inset:0;background:rgba(0,0,0,.4);opacity:0;pointer-events:none;transition:opacity .18s ease;z-index:9998}
  .cart-overlay.open{opacity:1;pointer-events:auto}
  .cart-drawer{position:fixed;top:0;right:0;height:100vh;width:min(420px,92vw);background:#fff;color:var(--text);box-shadow:-10px 0 30px rgba(0,0,0,.15);border-left:1px solid #f3d7e1;transform:translateX(100%);transition:transform .22s ease;z-index:9999;display:grid;grid-template-rows:auto 1fr auto}
  .cart-drawer.open{transform:translateX(0)}
  .cart-header{display:flex;align-items:center;justify-content:space-between;padding:1rem;border-bottom:1px solid #f3d7e1}
  .cart-title{font-weight:800}
  .cart-items{overflow:auto;padding:.5rem 1rem;display:grid;gap:.75rem}
  .cart-item{display:grid;grid-template-columns:64px 1fr auto;gap:.75rem;align-items:center;background:var(--surface);border:1px solid #f3d7e1;border-radius:var(--radius);padding:.5rem}
  .cart-item img{width:64px;height:64px;object-fit:cover;border-radius:8px;background:#fff}
  .cart-item .title{font-weight:700;color:var(--text)}
  .cart-item .price{color:var(--muted);font-weight:700;font-size:.95rem}
  .qty{display:inline-flex;align-items:center;gap:.35rem;border:1px solid #f3d7e1;border-radius:10px;padding:.15rem;background:#fff}
  .qty button{border:0;background:transparent;padding:.25rem .4rem;font-weight:800;cursor:pointer}
  .qty input{width:2.5rem;text-align:center;border:0;outline:none;background:transparent;color:var(--text)}
  .cart-remove{background:transparent;border:0;color:#d90429;font-weight:800;cursor:pointer;padding:.25rem .5rem}
  .cart-footer{padding:1rem;border-top:1px solid #f3d7e1;display:grid;gap:.75rem}
  .cart-total{display:flex;justify-content:space-between;font-weight:800}
  .cart-actions{display:flex;gap:.5rem}
  .btn-danger{background:#ef476f;color:#fff}
  body.dark .cart-drawer{background:#161616;color:#e3e3e3;border-left-color:#2a2a2a;box-shadow:-10px 0 30px rgba(0,0,0,.45)}
  body.dark .cart-item{background:#111;border-color:#2a2a2a}
  body.dark .qty{border-color:#2a2a2a;background:#0d0d0d}
  body.dark .cart-remove{color:#ff6b81}
  body.dark .cart-header,body.dark .cart-footer{border-color:#2a2a2a}
  .add-to-cart{background:transparent;color:var(--accent);border:2px solid var(--accent)}
  .add-to-cart:hover{background:var(--accent);color:#fff}
  body.cart-open{overflow:hidden}
  `;

  function injectStyles() {
    if (document.getElementById('cart-styles')) return;
    const tag = document.createElement('style');
    tag.id = 'cart-styles';
    tag.textContent = styles;
    document.head.appendChild(tag);
  }

  function money(n) {
    try {
      return n.toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 });
    } catch (e) {
      return '$' + (n || 0).toString();
    }
  }

  const Cart = {
    items: [],
    load() {
      try { this.items = JSON.parse(localStorage.getItem(CART_KEY) || '[]'); } catch { this.items = []; }
    },
    save() {
      try { localStorage.setItem(CART_KEY, JSON.stringify(this.items)); } catch {}
    },
    count() { return this.items.reduce((a, it) => a + it.qty, 0); },
    total() { return this.items.reduce((a, it) => a + it.price * it.qty, 0); },
    add(item) {
      const found = this.items.find(i => i.id === item.id);
      if (found) found.qty += item.qty || 1; else this.items.push({ ...item, qty: item.qty || 1 });
      this.save();
    },
    setQty(id, qty) {
      const it = this.items.find(i => i.id === id);
      if (!it) return;
      it.qty = Math.max(1, qty|0);
      this.save();
    },
    remove(id) {
      this.items = this.items.filter(i => i.id !== id);
      this.save();
    },
    clear() { this.items = []; this.save(); }
  };

  function parsePrice(text) {
    if (!text) return 0;
    const digits = text.toString().replace(/[^0-9]/g, '');
    return parseInt(digits || '0', 10);
  }

  function scanProducts() {
    const cards = Array.from(document.querySelectorAll('.product-card'));
    return cards.map((card, idx) => {
      const title = card.querySelector('.product-title')?.textContent?.trim() || 'Producto ' + (idx+1);
      const priceText = card.querySelector('.price')?.textContent || '0';
      const price = parsePrice(priceText);
      const img = card.querySelector('img')?.getAttribute('src') || '';
      const id = (title.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-_]/g,'') || 'prod') + '-' + idx;
      const variant = card.getAttribute('data-tn-variant') || null; // para Tienda Nube
      return { id, title, price, img, card, variant };
    });
  }

  function ensureAddButtons(products) {
    products.forEach(p => {
      const meta = p.card.querySelector('.product-meta') || p.card;
      if (meta.querySelector('.add-to-cart')) return;
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm add-to-cart';
      btn.type = 'button';
      btn.textContent = 'Agregar';
      btn.addEventListener('click', () => {
        Cart.add({ id: p.id, title: p.title, price: p.price, img: p.img, qty: 1, variant: p.variant });
        updateBadge();
        openDrawer();
        renderDrawer();
      });
      meta.appendChild(btn);
    });
  }

  let fab, badge, overlay, drawer, list;

  function createUI() {
    // FAB
    fab = document.createElement('button');
    fab.className = 'cart-fab';
    fab.type = 'button';
    fab.innerHTML = '<span class="emoji" aria-hidden="true">🛒</span><span>Carrito</span> <span class="cart-badge">0</span>';
    badge = fab.querySelector('.cart-badge');
    fab.setAttribute('aria-label', 'Abrir carrito');
    fab.addEventListener('click', () => { openDrawer(); renderDrawer(); });
    document.body.appendChild(fab);

    // Overlay + Drawer
    overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.addEventListener('click', closeDrawer);

    drawer = document.createElement('aside');
    drawer.className = 'cart-drawer';
    drawer.innerHTML = `
      <div class="cart-header">
        <div class="cart-title">Tu carrito</div>
        <button type="button" class="btn btn-outline" data-close>✕</button>
      </div>
      <div class="cart-items" id="cart-items"></div>
      <div class="cart-footer">
        <div class="cart-total"><span>Total</span><span id="cart-total">$0</span></div>
        <div class="cart-actions">
          <button type="button" class="btn btn-danger" id="cart-clear">Vaciar</button>
          <a href="#contacto" class="btn" id="cart-checkout">Finalizar</a>
        </div>
      </div>`;
    list = drawer.querySelector('#cart-items');
    drawer.querySelector('[data-close]')?.addEventListener('click', closeDrawer);
    drawer.querySelector('#cart-clear')?.addEventListener('click', () => { Cart.clear(); updateBadge(); renderDrawer(); });
    const checkoutBtn = drawer.querySelector('#cart-checkout');
    checkoutBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      handleCheckout();
    });
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }

  function updateBadge() { if (badge) badge.textContent = Cart.count(); }

  function openDrawer() {
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.classList.add('cart-open');
  }
  function closeDrawer() {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.classList.remove('cart-open');
  }

  function renderDrawer() {
    if (!list) return;
    if (Cart.items.length === 0) {
      list.innerHTML = '<p style="padding:1rem;color:var(--muted)">Tu carrito está vacío.</p>';
      drawer.querySelector('#cart-total').textContent = money(0);
      return;
    }
    list.innerHTML = '';
    Cart.items.forEach(it => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${it.img}" alt="${it.title}">
        <div>
          <div class="title">${it.title}</div>
          <div class="price">${money(it.price)}</div>
          <div class="qty" role="group" aria-label="Cantidad">
            <button type="button" data-dec aria-label="Quitar">-</button>
            <input type="number" min="1" value="${it.qty}" aria-label="Cantidad"/>
            <button type="button" data-inc aria-label="Agregar">+</button>
          </div>
        </div>
        <div>
          <button type="button" class="cart-remove" aria-label="Eliminar" title="Eliminar" data-remove>✕</button>
        </div>`;
      // Handlers
      row.querySelector('[data-inc]')?.addEventListener('click', () => { Cart.setQty(it.id, it.qty + 1); updateBadge(); renderDrawer(); });
      row.querySelector('[data-dec]')?.addEventListener('click', () => { Cart.setQty(it.id, Math.max(1, it.qty - 1)); updateBadge(); renderDrawer(); });
      row.querySelector('input')?.addEventListener('change', (e) => { const v = parseInt(e.target.value, 10) || 1; Cart.setQty(it.id, Math.max(1, v)); updateBadge(); renderDrawer(); });
      row.querySelector('[data-remove]')?.addEventListener('click', () => { Cart.remove(it.id); updateBadge(); renderDrawer(); });
      list.appendChild(row);
    });
    drawer.querySelector('#cart-total').textContent = money(Cart.total());
  }

  function handleCheckout() {
    if (!Cart.items.length) { closeDrawer(); return; }
    // Si está configurado Tienda Nube e IDs de variante presentes en todos los ítems
    if (TN.domain && typeof TN.buildCartUrl === 'function') {
      const entries = Cart.items.map(it => ({ variant: it.variant, qty: it.qty })).filter(x => x.variant);
      if (entries.length === Cart.items.length) {
        const url = TN.buildCartUrl(entries);
        if (url) {
          const absolute = /^https?:\/\//i.test(url) ? url : ('https://' + TN.domain.replace(/^https?:\/\//,'') + (url.startsWith('/') ? url : '/' + url));
          window.location.href = absolute;
          return;
        }
      } else {
        console.warn('Faltan data-tn-variant en algunos productos. No se puede enviar a Tienda Nube.');
      }
    }
    // Fallback: ir a contacto
    window.location.hash = '#contacto';
    closeDrawer();
  }

  function init() {
    injectStyles();
    Cart.load();
    const products = scanProducts();
    ensureAddButtons(products);
    createUI();
    updateBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
