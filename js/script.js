// ---------- Navbar scroll state ----------
const navbar = document.getElementById('navbar');

function updateNavbarState() {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}

window.addEventListener('scroll', updateNavbarState, { passive: true });
updateNavbarState();

// ---------- Mobile nav toggle ----------
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Scroll spy (active nav link) ----------
const sections = document.querySelectorAll('main section[id]');
const navLinkMap = new Map(
  Array.from(navLinks.querySelectorAll('.nav-link')).map((link) => [
    link.getAttribute('href').slice(1),
    link,
  ])
);

const spyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const link = navLinkMap.get(entry.target.id);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinkMap.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

sections.forEach((section) => spyObserver.observe(section));

// ---------- Scroll reveal ----------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('visible', entry.isIntersecting);
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// ---------- Screenshot lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.screenshot-thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    lightboxVideo.pause();
    lightboxVideo.style.display = 'none';
    lightboxImg.style.display = '';
    lightboxImg.src = thumb.dataset.full;
    lightboxImg.alt = thumb.querySelector('img').alt;
    lightbox.classList.add('open');
  });
});

document.querySelectorAll('.video-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    lightboxImg.style.display = 'none';
    lightboxImg.src = '';
    lightboxVideo.style.display = 'block';
    lightboxVideo.src = trigger.dataset.video;
    lightbox.classList.add('open');
    lightboxVideo.play();
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
  lightboxVideo.pause();
  lightboxVideo.removeAttribute('src');
  lightboxVideo.load();
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// ---------- Team modal ----------
const teamModal = document.getElementById('teamModal');
const teamCreditBtn = document.getElementById('teamCreditBtn');
const teamModalClose = document.getElementById('teamModalClose');

if (teamModal && teamCreditBtn) {
  teamCreditBtn.addEventListener('click', () => {
    teamModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  function closeTeamModal() {
    teamModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  teamModalClose.addEventListener('click', closeTeamModal);
  teamModal.addEventListener('click', (e) => {
    if (e.target === teamModal) closeTeamModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTeamModal();
  });
}

// ---------- Focus areas accordion ----------
const ACCORDION_PAD = 32; // must match .accordion-item.open .accordion-body padding-bottom
document.querySelectorAll('.accordion-item').forEach((item) => {
  const header = item.querySelector('.accordion-header');
  const icon = item.querySelector('.accordion-icon');
  const body = item.querySelector('.accordion-body');

  if (item.classList.contains('open')) {
    body.style.maxHeight = `${body.scrollHeight + ACCORDION_PAD}px`;
  }

  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.accordion-icon').textContent = '+';
      openItem.querySelector('.accordion-body').style.maxHeight = '';
    });

    if (!isOpen) {
      item.classList.add('open');
      icon.textContent = '×';
      body.style.maxHeight = `${body.scrollHeight + ACCORDION_PAD}px`;
    }
  });
});

window.addEventListener('resize', () => {
  const openBody = document.querySelector('.accordion-item.open .accordion-body');
  if (openBody) openBody.style.maxHeight = `${openBody.scrollHeight + ACCORDION_PAD}px`;
});

// ---------- Filter tabs (Work, Path, etc.) ----------
const timelineBadge = document.getElementById('timelineBadge');
const timelineBadgeLabels = { all: 'Milestones', education: 'in Education', certification: 'Certifications' };

document.querySelectorAll('.filter-group').forEach((group) => {
  const tabs = group.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll(group.dataset.target);
  const isTimeline = group.dataset.target === '.timeline-row';
  const limit = group.dataset.limit ? parseInt(group.dataset.limit, 10) : null;
  const increment = limit || 5;
  const showMoreBtn = document.querySelector(`[data-show-more-for="${group.dataset.target}"]`);
  let visibleCount = limit;

  function countMatches(filter) {
    let total = 0;
    cards.forEach((card) => {
      if (filter === 'all' || card.dataset.category === filter) total += 1;
    });
    return total;
  }

  function applyFilter(filter) {
    const totalMatches = countMatches(filter);

    let seen = 0;
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      if (matches) seen += 1;
      const withinLimit = !limit || seen <= visibleCount;
      card.classList.toggle('hidden', !(matches && withinLimit));
    });

    if (showMoreBtn) {
      const needsToggle = limit && totalMatches > limit;
      showMoreBtn.classList.toggle('hidden', !needsToggle);
      showMoreBtn.textContent = visibleCount >= totalMatches ? 'Show Less' : 'Show More';
    }

    if (isTimeline && timelineBadge) {
      timelineBadge.textContent = `${totalMatches} ${timelineBadgeLabels[filter]}`;
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      visibleCount = limit;
      applyFilter(tab.dataset.filter);
    });
  });

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      const activeTab = group.querySelector('.filter-tab.active');
      const filter = activeTab ? activeTab.dataset.filter : 'all';
      const totalMatches = countMatches(filter);

      visibleCount = visibleCount >= totalMatches ? limit : Math.min(visibleCount + increment, totalMatches);
      applyFilter(filter);
    });
  }

  if (limit) {
    const initialTab = group.querySelector('.filter-tab.active');
    applyFilter(initialTab ? initialTab.dataset.filter : 'all');
  }
});

// ---------- Contact form (Formspree) ----------
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
const contactSubmitBtn = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const originalBtnText = contactSubmitBtn.textContent;

  contactSubmitBtn.disabled = true;
  contactSubmitBtn.textContent = 'Sending...';
  formNote.textContent = '';

  try {
    const response = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm),
    });

    if (!response.ok) throw new Error('Form submission failed');

    formNote.textContent = `Thanks, ${name}! Your message is on its way, I'll get back to you soon.`;
    contactForm.reset();
  } catch (err) {
    formNote.textContent = 'Something went wrong. Please email me directly at mjaravata.work@gmail.com';
  } finally {
    contactSubmitBtn.disabled = false;
    contactSubmitBtn.textContent = originalBtnText;
  }
});

// ---------- Site-wide particle animation ----------
(function () {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;

  const isMobile = window.matchMedia('(max-width: 860px)').matches;
  if (isMobile) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = canvas.getContext('2d');
  const colors = ['#ff9a00', '#ff3b30', '#ffb84d', '#ff6b57', '#ffd08a'];
  const particleCount = 90;
  const repelRadius = 130;

  let particles = [];
  let width = 0;
  let height = 0;
  let mouseX = -9999;
  let mouseY = -9999;
  let rafId = null;
  let isVisible = true;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function createParticles() {
    particles = Array.from({ length: particleCount }, () => {
      const baseX = Math.random() * width;
      const baseY = Math.random() * height;
      return {
        baseX,
        baseY,
        x: baseX,
        y: baseY,
        radius: 1 + Math.random() * 2.2,
        color: colors[Math.floor(Math.random() * colors.length)],
        driftAngle: Math.random() * Math.PI * 2,
        driftSpeed: 0.15 + Math.random() * 0.25,
        driftRadius: 10 + Math.random() * 20,
      };
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.7;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function step() {
    particles.forEach((p) => {
      p.driftAngle += 0.0032 * p.driftSpeed;
      const idleX = p.baseX + Math.cos(p.driftAngle) * p.driftRadius;
      const idleY = p.baseY + Math.sin(p.driftAngle) * p.driftRadius;

      const dx = idleX - mouseX;
      const dy = idleY - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let targetX = idleX;
      let targetY = idleY;

      if (dist < repelRadius) {
        const force = (repelRadius - dist) / repelRadius;
        const angle = Math.atan2(dy, dx);
        targetX = idleX + Math.cos(angle) * force * 60;
        targetY = idleY + Math.sin(angle) * force * 60;
      }

      p.x += (targetX - p.x) * 0.12;
      p.y += (targetY - p.y) * 0.12;
    });

    draw();

    rafId = isVisible ? requestAnimationFrame(step) : null;
  }

  function handleMouseMove(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }

  function handleMouseLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  resize();
  createParticles();

  if (prefersReducedMotion) {
    draw();
  } else {
    rafId = requestAnimationFrame(step);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    document.addEventListener('visibilitychange', () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible && rafId === null) {
        rafId = requestAnimationFrame(step);
      }
    });
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
    if (prefersReducedMotion) draw();
  });
})();

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
