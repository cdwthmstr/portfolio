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
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.screenshot-thumb').forEach((thumb) => {
  thumb.addEventListener('click', () => {
    lightboxImg.src = thumb.dataset.full;
    lightboxImg.alt = thumb.querySelector('img').alt;
    lightbox.classList.add('open');
  });
});

function closeLightbox() {
  lightbox.classList.remove('open');
  lightboxImg.src = '';
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

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      let visibleCount = 0;

      cards.forEach((card) => {
        const matches = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !matches);
        if (matches) visibleCount += 1;
      });

      if (isTimeline && timelineBadge) {
        timelineBadge.textContent = `${visibleCount} ${timelineBadgeLabels[filter]}`;
      }
    });
  });
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
