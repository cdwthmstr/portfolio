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
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
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

// ---------- Focus areas accordion ----------
document.querySelectorAll('.accordion-item').forEach((item) => {
  const header = item.querySelector('.accordion-header');
  const icon = item.querySelector('.accordion-icon');

  header.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    document.querySelectorAll('.accordion-item.open').forEach((openItem) => {
      openItem.classList.remove('open');
      openItem.querySelector('.accordion-icon').textContent = '+';
    });

    if (!isOpen) {
      item.classList.add('open');
      icon.textContent = '×';
    }
  });
});

// ---------- Filter tabs (Work, Path, etc.) ----------
const timelineBadge = document.getElementById('timelineBadge');
const timelineBadgeLabels = { all: 'Milestones', education: 'in Education', certification: 'Certifications' };

document.querySelectorAll('.filter-group').forEach((group) => {
  const tabs = group.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll(group.dataset.target);
  const isTimeline = group.dataset.target === '.timeline-row';
  const limit = group.dataset.limit ? parseInt(group.dataset.limit, 10) : null;
  const showMoreBtn = document.querySelector(`[data-show-more-for="${group.dataset.target}"]`);
  let showAll = false;

  function applyFilter(filter) {
    let totalMatches = 0;
    cards.forEach((card) => {
      if (filter === 'all' || card.dataset.category === filter) totalMatches += 1;
    });

    let seen = 0;
    cards.forEach((card) => {
      const matches = filter === 'all' || card.dataset.category === filter;
      if (matches) seen += 1;
      const withinLimit = !limit || showAll || seen <= limit;
      card.classList.toggle('hidden', !(matches && withinLimit));
    });

    if (showMoreBtn) {
      const needsToggle = limit && totalMatches > limit;
      showMoreBtn.classList.toggle('hidden', !needsToggle);
      showMoreBtn.textContent = showAll ? 'Show Less' : 'Show More';
    }

    if (isTimeline && timelineBadge) {
      timelineBadge.textContent = `${totalMatches} ${timelineBadgeLabels[filter]}`;
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      showAll = false;
      applyFilter(tab.dataset.filter);
    });
  });

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      showAll = !showAll;
      const activeTab = group.querySelector('.filter-tab.active');
      applyFilter(activeTab ? activeTab.dataset.filter : 'all');
    });
  }

  if (limit) {
    const initialTab = group.querySelector('.filter-tab.active');
    applyFilter(initialTab ? initialTab.dataset.filter : 'all');
  }
});

// ---------- Contact form (mailto handoff) ----------
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  const subject = encodeURIComponent(`Portfolio contact from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);

  window.location.href = `mailto:mjaravata.work@gmail.com?subject=${subject}&body=${body}`;
  formNote.textContent = "Opening your email app... if nothing happens, email me directly at mjaravata.work@gmail.com";
});

// ---------- Footer year ----------
document.getElementById('year').textContent = new Date().getFullYear();
