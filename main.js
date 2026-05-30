/* main.js — Yahya Sahnoun Portfolio */

// ── NAV: hamburger
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
}

// ── NAV: hide on scroll down, show on scroll up
let lastScroll = 0;
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (current > lastScroll && current > 100) {
    nav.style.transform = 'translateY(-100%)';
    nav.style.transition = 'transform 0.3s ease';
  } else {
    nav.style.transform = 'translateY(0)';
  }
  lastScroll = current;
}, { passive: true });

// ── SCROLL FADE-IN
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.section, .case-study, .service-card-big, .timeline-item, .edu-card, .work-card').forEach(el => {
  el.classList.add('fade-in');
  observer.observe(el);
});

// ── FILTER TABS (work page)
const filterBtns = document.querySelectorAll('.filter-btn');
const caseStudies = document.querySelectorAll('.case-study');
if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      caseStudies.forEach(cs => {
        const cats = cs.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) {
          cs.style.display = '';
          cs.nextElementSibling?.classList.remove('hidden');
        } else {
          cs.style.display = 'none';
          cs.nextElementSibling?.classList.add('hidden');
        }
      });
    });
  });
}

// ── CONTACT FORM (simple demo)
// ──const form = document.getElementById('contactForm');
// ──const formSuccess = document.getElementById('formSuccess');
// ──if (form && formSuccess) {
// ──  form.addEventListener('submit', (e) => {
// ──    e.preventDefault();
    // In production: send to Formspree, Netlify Forms, EmailJS, etc.
    // e.g. fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(form) })
 // ──   form.style.display = 'none';
 // ──   formSuccess.style.display = 'flex';
// ──  });
// ──}
// ── CONTACT FORM (Formspree Integration)
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form && formSuccess) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;

    // Loading state
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Submit to Formspree
    fetch('https://formspree.io/f/mreddorj', {
      method: 'POST',
      body: new FormData(form),
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        showSuccess();
      } else {
        throw new Error('Submission failed');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Something went wrong. Please try again or email me directly at yahyasahnoun0@gmail.com');
      
      // Reset button
      submitButton.textContent = originalButtonText;
      submitButton.disabled = false;
    });
  });
}

// Show success message
function showSuccess() {
  form.style.display = 'none';
  formSuccess.style.display = 'block';
  
  // Optional: Scroll to success message smoothly
  formSuccess.scrollIntoView({ behavior: 'smooth' });
}

// ── SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── NUMBER COUNT-UP animation on stats
function countUp(el, target, duration = 1500) {
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      el.textContent = prefix + target + suffix;
      clearInterval(timer);
    } else {
      el.textContent = prefix + Math.floor(start) + suffix;
    }
  }, 16);
}

// Observe stats
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num, .metric-num').forEach(num => {
        const text = num.textContent;
        const val = parseInt(text.replace(/[^0-9]/g, ''));
        if (val && !isNaN(val)) {
          const suffix = text.replace(/[0-9]/g, '').replace('+','').trim();
          num.dataset.suffix = text.includes('+') ? '+' : suffix;
          countUp(num, val, 1200);
        }
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats, .case-metrics-bar').forEach(el => {
  statsObserver.observe(el);
});
