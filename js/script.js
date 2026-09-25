// AAROHI 26 — site interactions

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
});
