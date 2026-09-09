(() => {
  const body = document.body;
  const header = document.querySelector('.site-header');
  const loader = document.querySelector('.page-loader');
  const menuToggle = document.querySelector('.menu-toggle');
  const navWrap = document.querySelector('.nav-wrap');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-wrap .btn');
  const heroProduct = document.querySelector('.hero-product');
  const counters = document.querySelectorAll('[data-counter]');
  const reveals = document.querySelectorAll('.reveal');

  window.addEventListener('load', () => {
    setTimeout(() => loader?.classList.add('loaded'), 250);
  });

  const syncHeader = () => {
    header?.classList.toggle('scrolled', window.scrollY > 24);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  menuToggle?.addEventListener('click', () => {
    const open = navWrap.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    body.classList.toggle('menu-open', open);
  });

  navLinks.forEach(link => link.addEventListener('click', () => {
    navWrap?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Menüyü aç');
    body.classList.remove('menu-open');
  }));

  // IntersectionObserver ile hafif ve performanslı scroll reveal.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => {
    if (!el.classList.contains('is-visible')) revealObserver.observe(el);
  });

  // Sayaç animasyonu.
  const animateCounter = el => {
    const target = Number(el.dataset.counter || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;
      entry.target.dataset.done = '1';
      animateCounter(entry.target);
    });
  }, { threshold: 0.7 });

  counters.forEach(counter => counterObserver.observe(counter));

  // Hero ürününde 3-8px arası, hafif mouse parallax.
  if (heroProduct && !window.matchMedia('(pointer: coarse)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let frame = null;
    window.addEventListener('mousemove', event => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        heroProduct.style.transform = `translate3d(${x * 4}px, ${y * 4}px, 0)`;
        frame = null;
      });
    }, { passive: true });
  }

  // Butonlarda pointer tabanlı ışık hareketi.
  document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      button.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      button.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  // Dahili anchor linklerde küçük ofset.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const headerHeight = header?.offsetHeight || 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerHeight + 2,
        behavior: 'smooth'
      });
    });
  });
})();
