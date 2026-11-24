// Abre o menu móvel e devolve o foco ao botão quando fechado pelo teclado.
const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');
const desktop = matchMedia('(min-width: 769px)');

function setMenu(open) {
  toggle.setAttribute('aria-expanded', String(open));
  toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}

toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') === 'false'));
nav.addEventListener('click', (event) => {
  const link = event.target.closest('a');
  if (!link || desktop.matches) return;

  setMenu(false);
  const section = link.hash ? document.getElementById(link.hash.slice(1)) : null;
  if (section) {
    section.setAttribute('tabindex', '-1');
    section.focus({ preventScroll: true });
    return;
  }
  toggle.focus();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    toggle.focus();
  }
});
desktop.addEventListener('change', () => setMenu(false));

// A animação só começa quando o cartão já entrou na tela. O HTML é visível por padrão.
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
const footer = document.querySelector('#rodape');
const footerYear = footer?.querySelector('#footer-year');
const floatingWhatsApp = document.querySelector('.whatsapp-float');
if (footerYear) footerYear.textContent = new Date().getFullYear();

if ('IntersectionObserver' in window) {
  const animatedItems = document.querySelectorAll('.service-card, .process-step, .sign-card, .about-portrait, .about-copy, .gallery-carousel, .review-card, .faq-item, .contact-content');
  const cards = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (entry.target === footer) {
        floatingWhatsApp?.classList.toggle('whatsapp-float-hidden', entry.isIntersecting);
        floatingWhatsApp?.toggleAttribute('inert', entry.isIntersecting);
        continue;
      }
      if (!entry.isIntersecting || entry.intersectionRatio < 0.12) continue;
      observer.unobserve(entry.target);
      if (!reduceMotion.matches && !entry.target.matches(':focus-within')) {
        entry.target.animate(
          [{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 360, easing: 'ease-out' }
        );
      }
    }
  }, { threshold: footer ? [0, 0.12] : 0.12 });
  if (footer && floatingWhatsApp) cards.observe(footer);
  if (typeof Element.prototype.animate === 'function' && !reduceMotion.matches) {
    animatedItems.forEach((card) => cards.observe(card));
  }
  reduceMotion.addEventListener('change', () => {
    if (!reduceMotion.matches) return;
    animatedItems.forEach((card) => {
      cards.unobserve(card);
      card.getAnimations?.().forEach((animation) => animation.cancel());
    });
  });
}

// A rolagem nativa continua disponível sem JavaScript.
const gallery = document.querySelector('.gallery-carousel');
if (gallery) {
  const track = gallery.querySelector('.gallery-track');
  const slides = [...track.querySelectorAll('.gallery-slide')];
  const controls = gallery.querySelector('.gallery-controls');
  const counter = gallery.querySelector('.gallery-counter');
  const progress = gallery.querySelector('.gallery-progress');
  const previous = controls.querySelector('.gallery-prev');
  const next = controls.querySelector('.gallery-next');
  let frame = 0;

  function bounds() {
    return Math.max(0, track.scrollWidth - track.clientWidth);
  }

  function leadingPhoto() {
    const first = slides[0].offsetLeft;
    const position = track.scrollLeft;
    return slides.reduce((closest, slide, index) =>
      Math.abs(slide.offsetLeft - first - position) < Math.abs(slides[closest].offsetLeft - first - position) ? index : closest, 0);
  }

  function updateGallery() {
    frame = 0;
    const end = bounds();
    const atEnd = track.scrollLeft >= end - 2;
    const count = atEnd && end > 2 ? slides.length : leadingPhoto() + 1;
    const label = `${count} / ${slides.length}`;
    if (counter.textContent !== label) counter.textContent = label;
    progress.value = count;
    previous.setAttribute('aria-disabled', String(track.scrollLeft <= 2));
    next.setAttribute('aria-disabled', String(atEnd));
  }

  function moveGallery(direction) {
    const step = slides[1]?.offsetLeft - slides[0].offsetLeft;
    if (!(step > 0)) return;
    const left = Math.max(0, Math.min(leadingPhoto() * step + direction * step, bounds()));
    track.scrollTo({ left, behavior: reduceMotion.matches ? 'instant' : 'smooth' });
  }

  if (slides.length) {
    slides.forEach((slide, index) => slide.setAttribute('aria-label', `Foto ${index + 1} de ${slides.length}`));
    controls.hidden = false;
    progress.max = slides.length;
    updateGallery();
    track.addEventListener('scroll', () => {
      if (!frame) frame = requestAnimationFrame(updateGallery);
    }, { passive: true });
    window.addEventListener('resize', updateGallery);
    previous.addEventListener('click', () => {
      if (previous.getAttribute('aria-disabled') === 'false') moveGallery(-1);
    });
    next.addEventListener('click', () => {
      if (next.getAttribute('aria-disabled') === 'false') moveGallery(1);
    });
    track.addEventListener('keydown', (event) => {
      if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      moveGallery(event.key === 'ArrowRight' ? 1 : -1);
    });
  }

  const dialog = document.querySelector('.gallery-dialog');
  if (dialog && typeof dialog.showModal === 'function') {
    const enlarged = dialog.querySelector('img');
    const close = dialog.querySelector('.gallery-close');
    const previousPhoto = dialog.querySelector('.gallery-prev');
    const nextPhoto = dialog.querySelector('.gallery-next');
    const dialogCounter = dialog.querySelector('.gallery-dialog-counter');
    let trigger;
    let active = 0;

    function showPhoto(index) {
      if (index < 0 || index >= slides.length) return;
      active = index;
      const photo = slides[index].querySelector('img');
      enlarged.src = photo.currentSrc || photo.src;
      enlarged.alt = photo.alt;
      dialogCounter.textContent = `${index + 1} / ${slides.length}`;
      previousPhoto.setAttribute('aria-disabled', String(index === 0));
      nextPhoto.setAttribute('aria-disabled', String(index === slides.length - 1));
    }

    slides.forEach((slide, index) => {
      const link = slide.querySelector('a');
      link.addEventListener('click', (event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        trigger = link;
        showPhoto(index);
        dialog.showModal();
      });
    });
    previousPhoto.addEventListener('click', () => showPhoto(active - 1));
    nextPhoto.addEventListener('click', () => showPhoto(active + 1));
    close.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
    dialog.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); showPhoto(active - 1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); showPhoto(active + 1); }
    });
  }
}

// Monta a mensagem localmente. Com JavaScript desligado, a action abre o chat direto.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
  const contactName = contactForm.querySelector('#contact-name');
  const contactService = contactForm.querySelector('#contact-service');
  const contactDescription = contactForm.querySelector('#contact-description');
  const nameError = contactForm.querySelector('#contact-name-error');

  function showContactNameError(show) {
    nameError.textContent = show ? 'Informe seu nome para continuar.' : '';
    if (show) contactName.setAttribute('aria-invalid', 'true');
    else contactName.removeAttribute('aria-invalid');
  }

  contactName.addEventListener('invalid', (event) => {
    event.preventDefault();
    showContactNameError(true);
    contactName.focus();
  });
  contactName.addEventListener('input', () => {
    if (contactName.value.trim()) showContactNameError(false);
  });
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactName.value.trim();
    if (!name) {
      showContactNameError(true);
      contactName.focus();
      return;
    }
    const description = contactDescription.value.trim();
    const message = `Olá, meu nome é ${name}. Preciso de: ${contactService.value}. ${description}`.trimEnd();
    window.open(`${contactForm.action}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}
