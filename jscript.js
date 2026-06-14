document.addEventListener('DOMContentLoaded', () => {

  
  const session = JSON.parse(sessionStorage.getItem('brgy_user') || 'null');

  if (session) {
    const nameEl   = document.getElementById('userName');
    const roleEl   = document.getElementById('userRole');
    const avatarEl = document.getElementById('userAvatar');
    if (nameEl) nameEl.textContent = session.name;
    if (roleEl) roleEl.textContent = session.role;
    if (avatarEl) {
      const roleIcons = { 'Barangay Admin': '🛡', 'Barangay Captain': '☺︎', 'Resident': '𖠿' };
      avatarEl.textContent = roleIcons[session.role] || '👤';
    }
  }

  document.getElementById('logoutBtn')?.addEventListener('click', () => {
    sessionStorage.removeItem('brgy_user');
    window.location.href = 'login.html';
  });

  
  const navLinks = document.querySelectorAll('.nav-link[data-page]');
  const sections = document.querySelectorAll('.page-section');
  const topbarTitle = document.getElementById('topbarTitle');

  
  const sidebar    = document.querySelector('.sidebar');
  const menuToggle = document.getElementById('menuToggle');

  function navigateTo(pageId) {
    sections.forEach(s => s.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById(pageId);
    const link   = document.querySelector(`.nav-link[data-page="${pageId}"]`);

    if (target) target.classList.add('active');
    if (link) {
      link.classList.add('active');
      if (topbarTitle) {
        topbarTitle.textContent = link.querySelector('.nav-label')?.textContent || 'BayanLink';
      }
    }
    if (sidebar) sidebar.classList.remove('mobile-open');
    document.body.style.overflow = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => navigateTo(link.dataset.page));
  });
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.addEventListener('click', () => navigateTo(el.dataset.nav));
  });

  menuToggle?.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('mobile-open');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 &&
        sidebar.classList.contains('mobile-open') &&
        !sidebar.contains(e.target) &&
        e.target !== menuToggle) {
      sidebar.classList.remove('mobile-open');
      document.body.style.overflow = '';
    }
  });


  
  const darkToggle = document.getElementById('darkToggle');
  const root = document.documentElement;
  let isDark = false;

  darkToggle?.addEventListener('click', () => {
    isDark = !isDark;
    if (isDark) {
      root.style.setProperty('--surface',    '#0F1A13');
      root.style.setProperty('--white',      '#192B1F');
      root.style.setProperty('--slate-900',  '#E8F5EC');
      root.style.setProperty('--slate-600',  '#A8C5B2');
      root.style.setProperty('--slate-400',  '#7A9E87');
      root.style.setProperty('--slate-200',  '#2A3D30');
      root.style.setProperty('--green-50',   '#152A1D');
      root.style.setProperty('--green-100',  '#1E3D27');
      darkToggle.textContent = '☀︎';
      darkToggle.title = 'Switch to Light Mode';
    } else {
      root.style.setProperty('--surface',    '#F7FAF8');
      root.style.setProperty('--white',      '#FFFFFF');
      root.style.setProperty('--slate-900',  '#1C2B22');
      root.style.setProperty('--slate-600',  '#3D5445');
      root.style.setProperty('--slate-400',  '#6B8C77');
      root.style.setProperty('--slate-200',  '#C4D5CC');
      root.style.setProperty('--green-50',   '#F0FBF4');
      root.style.setProperty('--green-100',  '#C6F0D8');
      darkToggle.textContent = '⏾';
      darkToggle.title = 'Switch to Dark Mode';
    }
  });


  
  function animateCounter(el, end, duration = 1400) {
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { el.textContent = end.toLocaleString(); clearInterval(timer); return; }
      el.textContent = Math.floor(start).toLocaleString();
    }, 16);
  }
  const homeSection = document.getElementById('home');
  let countersRan = false;

  function tryRunCounters() {
    if (countersRan || !homeSection?.classList.contains('active')) return;
    countersRan = true;
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(el => animateCounter(el, parseInt(el.dataset.count, 10)));
  }
  setTimeout(tryRunCounters, 200);
  navLinks.forEach(l => l.addEventListener('click', () => setTimeout(tryRunCounters, 50)));


  
  const filterBtns = document.querySelectorAll('.filter-btn');
  const annCards   = document.querySelectorAll('.ann-card[data-tag]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      annCards.forEach(card => {
        if (filter === 'all' || card.dataset.tag === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  
  function showToast(msg, icon = '✅') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }


  
  const modalOverlay = document.getElementById('modalOverlay');
  let pendingAction = null;

  function openModal(serviceTitle) {
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc  = document.getElementById('modalDesc');
    if (modalTitle) modalTitle.textContent = `Request: ${serviceTitle}`;
    if (modalDesc) modalDesc.textContent = `You're about to submit a request for ${serviceTitle}. Make sure you have your valid ID and required documents ready. Processing takes 3–5 working days. Payment is given upon retrieval of the physical copy of the certificate.`;
    modalOverlay?.classList.add('open');
    pendingAction = serviceTitle;
  }

  document.getElementById('modalConfirm')?.addEventListener('click', () => {
    modalOverlay?.classList.remove('open');
    showToast(`Request for "${pendingAction}" submitted successfully!`, '📄');
    pendingAction = null;
  });

  document.getElementById('modalCancel')?.addEventListener('click', () => {
    modalOverlay?.classList.remove('open');
    pendingAction = null;
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('open');
      pendingAction = null;
    }
  });
  window.openCertModal = openModal;


  
  const complaintForm = document.getElementById('complaintForm');

  complaintForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const fields = complaintForm.querySelectorAll('[required]');
    let valid = true;
    complaintForm.querySelectorAll('.field-error').forEach(el => el.remove());
    complaintForm.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

    fields.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.classList.add('input-error');
        const err = document.createElement('span');
        err.className = 'field-error';
        err.textContent = 'This field is required.';
        field.parentNode.appendChild(err);
      }
    });
    const emailField = complaintForm.querySelector('input[type="email"]');
    if (emailField?.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      valid = false;
      emailField.classList.add('input-error');
      const err = document.createElement('span');
      err.className = 'field-error';
      err.textContent = 'Please enter a valid email address.';
      emailField.parentNode.appendChild(err);
    }

    if (valid) {
      const btn = complaintForm.querySelector('.form-btn');
      btn.textContent = 'Submitting…';
      btn.disabled = true;

      setTimeout(() => {
        complaintForm.reset();
        btn.innerHTML = '📨 Submit Complaint / Concern';
        btn.disabled = false;
        showToast('Your concern has been submitted. We will respond within 2 business days.');
        navigateTo('announcements'); // Redirect to announcements after submit
        setTimeout(() => navigateTo('contact'), 100);
      }, 1200);
    }
  });
  const style = document.createElement('style');
  style.textContent = `
    .input-error { border-color: #EF4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.10) !important; }
    .field-error { font-size: 11px; color: #EF4444; margin-top: 4px; display: block; font-weight: 500; }
  `;
  document.head.appendChild(style);


  
  document.querySelectorAll('[data-cert]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.cert));
  });


  
  const heroHighlights = ['Your Community', 'Every Resident', 'BayanLink'];
  let hIdx = 0;
  const heroHighlight = document.getElementById('heroHighlight');

  if (heroHighlight) {
    setInterval(() => {
      heroHighlight.style.opacity = '0';
      heroHighlight.style.transform = 'translateY(6px)';
      setTimeout(() => {
        hIdx = (hIdx + 1) % heroHighlights.length;
        heroHighlight.textContent = heroHighlights[hIdx];
        heroHighlight.style.opacity = '1';
        heroHighlight.style.transform = 'translateY(0)';
      }, 300);
    }, 2800);
  }
  const hlStyle = document.createElement('style');
  hlStyle.textContent = `#heroHighlight { transition: opacity 0.3s ease, transform 0.3s ease; display: inline-block; }`;
  document.head.appendChild(hlStyle);

});