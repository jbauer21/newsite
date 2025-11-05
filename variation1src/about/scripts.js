document.addEventListener('DOMContentLoaded', () => {
  const PER_PIXEL_DELAY_MS = 0.5; // stagger between pixel "blinks"

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function createOverlay() {
    const wrap = document.createElement('div');
    wrap.className = 'pixel_wrapper';
    document.body.prepend(wrap);
    return wrap;
  }

  function buildGrid(wrap) {
    wrap.innerHTML = '';
    const columns = window.innerWidth < 400 ? 10 : (window.innerWidth < 1000 ? 30 : 50);
    const pixelSide = window.innerWidth / columns;
    const rows = Math.ceil(window.innerHeight / pixelSide);

    for (let c = 0; c < columns; c++) {
      const col = document.createElement('div');
      col.className = 'pixel_column';
      col.style.width = `${100 / columns}vw`;
      for (let r = 0; r < rows; r++) {
        const px = document.createElement('div');
        px.className = 'pixel';
        px.style.height = `${pixelSide}px`;
        col.appendChild(px);
      }
      wrap.appendChild(col);
    }
    return Array.from(wrap.querySelectorAll('.pixel'));
  }

  // Reveal on load: start black (opacity:1), then blink OUT to transparent (add .revealed)
  function revealOnLoad() {
    const wrap = createOverlay();
    let pixels = buildGrid(wrap);

    const order = shuffle([...pixels]);
    order.forEach((el, idx) => {
      setTimeout(() => el.classList.add('revealed'), idx * PER_PIXEL_DELAY_MS);
    });

    const total = order.length * PER_PIXEL_DELAY_MS + 20;
    setTimeout(() => wrap.remove(), total);
  }

  function coverThenNavigate(href) {
    const wrap = createOverlay();
    let pixels = buildGrid(wrap);

    // make everything transparent first
    pixels.forEach(p => p.classList.add('revealed'));
    // force a reflow so the class applies before we start toggling
    wrap.offsetHeight;

    const order = shuffle([...pixels]);
    // block clicks while covering
    wrap.style.pointerEvents = 'all';

    order.forEach((el, idx) => {
      setTimeout(() => el.classList.remove('revealed'), idx * PER_PIXEL_DELAY_MS);
    });

    const total = order.length * PER_PIXEL_DELAY_MS + 20;
    setTimeout(() => {
      window.location.assign(href);
    }, total);
  }

  // Intercept standard link clicks
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a) return;

    // Allow new-tab/middle-clicks/modified clicks
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    // Let _blank do its thing
    if (a.target && a.target.toLowerCase() !== '_self') return;

    e.preventDefault();
    coverThenNavigate(a.href);
  }, true);

  // Intercept form submissions
  document.addEventListener('submit', (e) => {
    const form = e.target;
    if (!(form instanceof HTMLFormElement)) return;
    e.preventDefault();

    const action = form.getAttribute('action') || window.location.href;
    coverThenNavigate(action);
  }, true);

  // Initial reveal
  revealOnLoad();
});