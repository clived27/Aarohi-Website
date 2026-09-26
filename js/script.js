// AAROHI 26 — site interactions

/* ============================================================
   COUNTDOWN TIMER — target: 23 October 2026, 00:00:00 IST
   ============================================================ */
(function () {
  // IST is UTC+5:30 → Oct 23 2026 00:00:00 IST = Oct 22 2026 18:30:00 UTC
  const TARGET = new Date('2026-10-23T00:00:00+05:30').getTime();

  const daysEl    = document.getElementById('cd-days');
  const hoursEl   = document.getElementById('cd-hours');
  const minsEl    = document.getElementById('cd-minutes');
  const secsEl    = document.getElementById('cd-seconds');
  const expiredEl = document.getElementById('cd-expired');
  const boxesEl   = document.querySelector('.countdown-boxes');

  if (!daysEl) return;   // not on homepage — bail

  const pad = (n) => String(n).padStart(2, '0');

  function tick() {
    const now  = Date.now();
    const diff = TARGET - now;

    if (diff <= 0) {
      if (boxesEl)   boxesEl.style.display  = 'none';
      if (expiredEl) expiredEl.classList.remove('hidden');
      return;
    }

    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5)  / 36e5);
    const m = Math.floor((diff % 36e5)   / 6e4);
    const s = Math.floor((diff % 6e4)    / 1e3);

    daysEl.textContent  = pad(d);
    hoursEl.textContent = pad(h);
    minsEl.textContent  = pad(m);
    secsEl.textContent  = pad(s);
  }

  tick();
  setInterval(tick, 1000);
})();


document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    // close the menu after a link is tapped (mobile)
    links.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Navbar scroll background transition (transparent at top, black on scroll)
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleNavbarScroll = () => {
      if (window.scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();
  }

  document.querySelectorAll('.event-card').forEach((card) => {
    const registerLink = card.querySelector('.register-btn');

    if (!registerLink) return;

    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Register for ${card.querySelector('.event-poster')?.alt || 'this event'}`);

    card.addEventListener('click', (event) => {
      if (event.target.closest('.register-btn')) return;
      window.open(registerLink.href, '_blank', 'noopener,noreferrer');
    });

    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;

      event.preventDefault();
      window.open(registerLink.href, '_blank', 'noopener,noreferrer');
    });
  });

  /* ============================================================
     HOMEPAGE BACKGROUND CROSSFADE
     front.jpeg shows first; crossfades to back.jpeg at 50% scroll.
     Uses rAF-throttled scroll listener for precise progress tracking.
     Only opacity transitions → GPU-composited, zero repaints.
     ============================================================ */
  const bgFront = document.getElementById('bgFront');
  const bgBack  = document.getElementById('bgBack');

  if (bgFront && bgBack) {
    let ticking = false;
    let isBack = false;   // track current state to avoid redundant class changes

    function updateBg() {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrolled / maxScroll : 0;

      if (progress >= 0.5 && !isBack) {
        // Crossfade → back image
        bgFront.classList.add('bg-faded');
        bgBack.classList.add('bg-visible');
        isBack = true;
      } else if (progress < 0.5 && isBack) {
        // Crossfade → front image
        bgFront.classList.remove('bg-faded');
        bgBack.classList.remove('bg-visible');
        isBack = false;
      }
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateBg);
        ticking = true;
      }
    }, { passive: true });

    // Run once on load in case page is already scrolled
    updateBg();
  }
});
