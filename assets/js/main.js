/* =====================================================
   RAIS Portfolio — JavaScript v3
   One-card-at-a-time reviews · touch swipe · auto-advance
   ===================================================== */

(function () {
  'use strict';

  /* =====================================================
     SCROLL REVEAL
     ===================================================== */
  const revealTargets = [
    '.hero-content', '.section-header', '.project-card',
    '.about-grid', '.reviews-header', '.contact-inner',
  ];

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -50px 0px', threshold: 0.08 }
    );
    document.querySelectorAll(revealTargets.join(',')).forEach((el) => {
      el.setAttribute('data-reveal', '');
      revealObserver.observe(el);
    });
  }

  /* =====================================================
     STICKY HEADER TINT
     ===================================================== */
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.style.background = window.scrollY > 20
        ? 'rgba(10,10,10,0.97)'
        : 'rgba(10,10,10,0.88)';
    }, { passive: true });
  }

  /* =====================================================
     MOBILE MENU — open / close
     ===================================================== */
  const menuToggle   = document.getElementById('menuToggle');
  const menuClose    = document.getElementById('menuClose');
  const mobileMenu   = document.getElementById('mobileMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');

  function openMenu() {
    mobileMenu.removeAttribute('hidden');
    /* rAF so CSS transition fires after display */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mobileMenu.classList.add('is-open');
        menuBackdrop.classList.add('is-open');
        menuToggle.classList.add('is-open');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Close menu');
        document.body.style.overflow = 'hidden';
        menuClose.focus();
      });
    });
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    menuBackdrop.classList.remove('is-open');
    menuToggle.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
    /* Hide after transition (0.45s) */
    setTimeout(() => {
      if (!mobileMenu.classList.contains('is-open')) {
        mobileMenu.setAttribute('hidden', '');
      }
    }, 460);
    menuToggle.focus();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.hasAttribute('hidden') || !mobileMenu.classList.contains('is-open')
        ? openMenu()
        : closeMenu();
    });
    menuClose    && menuClose.addEventListener('click', closeMenu);
    menuBackdrop && menuBackdrop.addEventListener('click', closeMenu);

    /* Close on Escape */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
    });

    /* Close when any menu link is tapped */
    mobileMenu.querySelectorAll('[data-menu-close]').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* =====================================================
     SMOOTH SCROLL
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      /* #hero and #top both mean "go to top of page" */
      if (id === '#hero' || id === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =====================================================
     ACTIVE NAV HIGHLIGHT
     ===================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach((s) => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    navLinks.forEach((link) => {
      link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
    });
  }, { passive: true });

  /* =====================================================
     PROJECT CARD — 3D TILT (desktop) / tap scale (mobile)
     ===================================================== */
  const isTouchDevice = () => window.matchMedia('(hover: none)').matches;

  document.querySelectorAll('.project-card').forEach((card) => {
    const preview = card.querySelector('.project-preview');
    if (!preview) return;

    /* ── Desktop: 3D tilt ── */
    preview.addEventListener('mousemove', (e) => {
      if (isTouchDevice()) return;
      const r = preview.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      preview.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 6}deg) scale(1.02)`;
      preview.style.boxShadow = `${-x * 12}px ${y * 12}px 40px rgba(0,0,0,0.4)`;
    });
    preview.addEventListener('mouseleave', () => {
      preview.style.transform = '';
      preview.style.boxShadow = '';
    });

    /* ── Mobile: tap-to-reveal overlay ── */
    let tapTimer   = null;
    let isRevealed = false;

    card.addEventListener('touchend', (e) => {
      if (!isTouchDevice()) return;

      if (isRevealed) {
        /* Second tap → open the project site */
        const link = card.querySelector('.project-link');
        if (link) window.open(link.href, '_blank', 'noopener,noreferrer');
        hideOverlay();
        return;
      }

      /* First tap → reveal overlay.
         Only prevent default if the event is cancelable (i.e. not mid-scroll).
         Fixes: "[Intervention] Ignored attempt to cancel a touchend event with cancelable=false" */
      if (e.cancelable) e.preventDefault();
      showOverlay();
      clearTimeout(tapTimer);
      tapTimer = setTimeout(hideOverlay, 2500);
    }, { passive: false });

    function showOverlay() {
      isRevealed = true;
      preview.classList.add('is-tapped');
    }
    function hideOverlay() {
      isRevealed = false;
      preview.classList.remove('is-tapped');
      clearTimeout(tapTimer);
    }

    /* Hide when tapping anywhere outside this card */
    document.addEventListener('touchstart', (e) => {
      if (isRevealed && !card.contains(e.target)) hideOverlay();
    }, { passive: true });

    /* Desktop click fallback (not touch) */
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (isTouchDevice()) return;
      const link = card.querySelector('.project-link');
      if (link) window.open(link.href, '_blank', 'noopener,noreferrer');
    });
  });

  /* =====================================================
     REVIEWS — ONE-AT-A-TIME SLIDER
     Fade + slide up on enter, fade + slide up on exit.
     Auto-advances every 6 s. Touch-swipe supported.
     ===================================================== */
  (function initReviews() {
    const viewport  = document.getElementById('reviewsViewport');
    const track     = document.getElementById('reviewsTrack');
    const dotsWrap  = document.getElementById('reviewsDots');
    const prevBtn   = document.getElementById('reviewsPrev');
    const nextBtn   = document.getElementById('reviewsNext');
    const currEl    = document.getElementById('reviewsCurrent');
    const totalEl   = document.getElementById('reviewsTotal');
    if (!track || !viewport) return;

    const cards     = Array.from(track.querySelectorAll('.review-card'));
    const total     = cards.length;
    let   idx       = 0;
    let   autoTimer = null;
    let   locked    = false;   // prevent rapid clicks during transition

    /* Update total count */
    if (totalEl) totalEl.textContent = total;

    /* ── Build dot buttons ── */
    const dots = cards.map((_, i) => {
      const btn = document.createElement('button');
      btn.className = 'dot-btn';
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-label', `Review ${i + 1}`);
      btn.addEventListener('click', () => { if (!locked) goTo(i); });
      dotsWrap && dotsWrap.appendChild(btn);
      return btn;
    });

    /* ── Set the active card with animation ── */
    function goTo(newIdx, dir = 1) {
      if (locked || newIdx === idx) return;
      locked = true;

      const prevCard = cards[idx];
      const nextCard = cards[(newIdx + total) % total];
      idx = (newIdx + total) % total;

      /* Exit current */
      prevCard.classList.remove('is-active');
      prevCard.classList.add('is-exit');

      /* After exit transition, clean up */
      const onExit = () => {
        prevCard.classList.remove('is-exit');
        prevCard.removeEventListener('transitionend', onExit);
      };
      prevCard.addEventListener('transitionend', onExit);

      /* Enter new — slight delay so exit starts first */
      setTimeout(() => {
        nextCard.classList.add('is-active');
        updateUI();
        /* Unlock after enter transition */
        setTimeout(() => { locked = false; }, 580);
      }, 80);
    }

    /* First init — no animation, just activate */
    function initFirst() {
      cards[0].classList.add('is-active');
      updateUI();
    }

    function updateUI() {
      if (currEl) currEl.textContent = idx + 1;
      dots.forEach((d, i) => {
        d.classList.toggle('is-active', i === idx);
        d.setAttribute('aria-selected', i === idx ? 'true' : 'false');
      });
    }

    /* ── Auto-advance ── */
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => goTo(idx + 1), 6000);
    }
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }

    /* ── Arrows ── */
    prevBtn && prevBtn.addEventListener('click', () => {
      stopAuto(); goTo(idx - 1); startAuto();
    });
    nextBtn && nextBtn.addEventListener('click', () => {
      stopAuto(); goTo(idx + 1); startAuto();
    });

    /* ── Pause on hover ── */
    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', startAuto);

    /* ── Touch swipe ── */
    let touchStartX = 0;
    let touchStartY = 0;
    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      stopAuto();
      viewport.classList.add('is-swiping');
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      viewport.classList.remove('is-swiping');

      /* Only treat as horizontal swipe if dx > dy (not a scroll) */
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        goTo(dx < 0 ? idx + 1 : idx - 1);
      }
      startAuto();
    }, { passive: true });

    /* ── Keyboard support ── */
    document.addEventListener('keydown', (e) => {
      const section = document.getElementById('reviews');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      /* Only respond when reviews section is in view */
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      if (e.key === 'ArrowLeft')  { stopAuto(); goTo(idx - 1); startAuto(); }
      if (e.key === 'ArrowRight') { stopAuto(); goTo(idx + 1); startAuto(); }
    });

    /* ── Start ── */
    initFirst();
    startAuto();
  })();

  /* =====================================================
     LAZY-LOAD IFRAMES
     ===================================================== */
  if ('IntersectionObserver' in window) {
    const ifrObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target.querySelector('iframe');
            if (iframe && iframe.dataset.src) {
              iframe.src = iframe.dataset.src;
              delete iframe.dataset.src;
            }
            ifrObs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );
    document.querySelectorAll('.project-iframe-wrap').forEach((w) => ifrObs.observe(w));
  }

})();
