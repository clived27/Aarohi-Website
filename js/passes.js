// THE AAROHI CHRONICLE — Article Reader Controller

document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  const slides = Array.from(track.querySelectorAll('.news-page-item'));
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  const currentPageEl = document.getElementById('currentPage');
  const dotsContainer = document.getElementById('pageDots');

  const totalPages = slides.length;
  let currentIndex = 0;

  // Build page jump dots
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot-item');
      dot.setAttribute('aria-label', `Go to page ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToPage(i));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot-item')) : [];

  // Navigate to specific page
  function goToPage(index, smooth = true) {
    if (index < 0) index = 0;
    if (index >= totalPages) index = totalPages - 1;
    currentIndex = index;

    const target = slides[currentIndex];
    if (target) {
      track.scrollTo({
        left: target.offsetLeft,
        behavior: smooth ? 'smooth' : 'auto'
      });
    }

    updateReaderUI();
  }

  // Update UI Elements
  function updateReaderUI() {
    // 1. Current Page counter
    if (currentPageEl) {
      currentPageEl.textContent = currentIndex + 1;
    }

    // 2. Active Dot indicator
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });

    // 3. Arrow button states
    if (btnPrev) btnPrev.disabled = currentIndex === 0;
    if (btnNext) btnNext.disabled = currentIndex === totalPages - 1;
  }

  // Arrow click handlers
  if (btnPrev) {
    btnPrev.addEventListener('click', () => goToPage(currentIndex - 1));
  }
  if (btnNext) {
    btnNext.addEventListener('click', () => goToPage(currentIndex + 1));
  }

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goToPage(currentIndex - 1);
    if (e.key === 'ArrowRight') goToPage(currentIndex + 1);
  });

  // Touch swipe support & scroll settling
  let scrollTimeout;
  track.addEventListener('scroll', () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const currentScroll = track.scrollLeft;
      const trackWidth = track.clientWidth;
      let closestIdx = 0;
      let minDistance = Infinity;

      slides.forEach((slide, idx) => {
        const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
        const viewCenter = currentScroll + trackWidth / 2;
        const dist = Math.abs(slideCenter - viewCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      if (closestIdx !== currentIndex) {
        currentIndex = closestIdx;
        updateReaderUI();
      }
    }, 50);
  }, { passive: true });

  // Touch gesture support on mobile
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        goToPage(currentIndex + 1);
      } else {
        goToPage(currentIndex - 1);
      }
    }
  }, { passive: true });

  // Initial UI state
  updateReaderUI();
});
