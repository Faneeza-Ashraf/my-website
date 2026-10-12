document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const navbar = document.getElementById('navbar');

  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });

  /* ---------- Menu filter ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const menuItems = document.querySelectorAll('.menu-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      menuItems.forEach(item => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.classList.toggle('hide', !show);
      });
    });
  });

  /* ---------- Reservation form ---------- */
  const form = document.getElementById('reservation-form');
  const modal = document.getElementById('modal');
  const modalText = document.getElementById('modal-text');
  const modalClose = document.getElementById('modal-close');
  const dateInput = document.getElementById('date');

  // Prevent selecting past dates
  dateInput.min = new Date().toISOString().split('T')[0];

  const setError = (input, message) => {
    input.classList.toggle('invalid', Boolean(message));
    input.parentElement.querySelector('.error').textContent = message;
  };

  const validate = () => {
    let valid = true;
    const fields = {
      name: 'Please enter your name.',
      email: 'Please enter your email.',
      date: 'Please select a date.',
      time: 'Please select a time.',
      guests: 'Please enter the number of guests.'
    };

    Object.keys(fields).forEach(id => {
      const input = form.elements[id];
      const value = input.value.trim();
      if (!value) {
        setError(input, fields[id]);
        valid = false;
      } else if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError(input, 'Please enter a valid email address.');
        valid = false;
      } else if (id === 'guests' && (Number(value) < 1 || Number(value) > 20)) {
        setError(input, 'Guests must be between 1 and 20.');
        valid = false;
      } else {
        setError(input, '');
      }
    });

    return valid;
  };

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    const { name, date, time, guests } = form.elements;
    modalText.textContent =
      `Thank you, ${name.value.trim()}! Your table for ${guests.value} on ${date.value} at ${time.value} is booked. A confirmation has been sent to your email.`;
    modal.classList.add('show');
    form.reset();
  });

  // Clear errors while typing
  form.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => setError(input, ''));
  });

  /* ---------- Modal close ---------- */
  const closeModal = () => modal.classList.remove('show');
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});
