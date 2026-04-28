// ============================================================
//  MAIN.JS — Nav, Cursor, Smooth Scroll, Reveals, Counters
//  Code Blue Web Portfolio
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ---- Custom Cursor ----------------------------------------
  const cursor = document.querySelector('.cursor');
  const cursorFollow = document.querySelector('.cursor-follower');

  if (cursor && cursorFollow) {
    document.addEventListener('mousemove', e => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursorFollow.style.left = e.clientX + 'px';
      cursorFollow.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('a, button, .project-card, .chip, .feature-card, input, select, textarea').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('is-hovering');
        cursorFollow.classList.add('is-hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hovering');
        cursorFollow.classList.remove('is-hovering');
      });
    });
  }

  // ---- Nav Scroll Behavior ----------------------------------
  const nav = document.querySelector('.nav');

  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile Hamburger Menu --------------------------------
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    const toggleMenu = (open) => {
      hamburger.classList.toggle('open', open);
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', () => {
      toggleMenu(!mobileMenu.classList.contains('open'));
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') toggleMenu(false);
    });
  }

  // ---- Scroll Reveal (IntersectionObserver) -----------------
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- Stat Counter Animation --------------------------------
  const statEls = document.querySelectorAll('.stat');

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        const numberEl = entry.target.querySelector('.stat__number');
        if (numberEl) {
          const target = parseInt(numberEl.dataset.target, 10);
          const suffix = numberEl.dataset.suffix || '';
          const duration = 1400;
          const start = performance.now();

          const tick = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
            numberEl.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
        }
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statEls.forEach(el => statObserver.observe(el));

  // ---- Page Transition ----------------------------------------
  const overlay = document.querySelector('.page-overlay');

  if (overlay) {
    overlay.classList.remove('visible');

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        link.addEventListener('click', e => {
          e.preventDefault();
          overlay.classList.add('visible');
          setTimeout(() => { window.location.href = href; }, 400);
        });
      }
    });
  }

  // ---- Smooth anchor scroll -----------------------------------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');

      if (href === '#') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) { }
    });
  });

  // ---- Contact Form → Google Apps Script -----------------------
  // ⚠️ PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL BELOW
  const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyxeic7Y6CVJkCl4vDs674mYM1sAi36hn2fiUg5Vx9fa7LneLylIZ2gzuxaGuP_HUVVpg/exec';

  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = contactForm?.querySelector('.contact__submit');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect form data
      const formData = new FormData(contactForm);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      // Loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formStatus.textContent = '';
      formStatus.classList.remove('error');

      try {
        await fetch(SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(data)
        });

        // Google Apps Script with no-cors always returns opaque response,
        // so we assume success if no error is thrown
        formStatus.textContent = '✓ Message sent! We\'ll get back to you soon.';
        formStatus.classList.remove('error');
        contactForm.reset();

      } catch (err) {
        formStatus.textContent = '✗ Something went wrong. Please try WhatsApp or email instead.';
        formStatus.classList.add('error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';

        // Clear status after 6 seconds
        setTimeout(() => { formStatus.textContent = ''; }, 6000);
      }
    });
  }

});
