(() => {
  const root = document.documentElement;
  const key = 'cheonma-reader-v1';
  let state = {};
  try { state = JSON.parse(localStorage.getItem(key)) || {}; } catch {}
  if (typeof state !== 'object' || Array.isArray(state)) state = {};
  let saveTimer;
  const save = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} };
  const themeButtons = document.querySelectorAll('[data-set-theme]');
  const themes = ['light', 'sepia', 'dark'];
  function setTheme(value) {
    root.dataset.theme = value;
    root.style.colorScheme = value === 'dark' ? 'dark' : 'light';
    themeButtons.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.setTheme === value));
    });
  }
  setTheme(themes.includes(state.theme) ? state.theme : 'sepia');
  themeButtons.forEach(button => button.addEventListener('click', () => {
    state.theme = button.dataset.setTheme;
    setTheme(state.theme);
    save();
  }));
  const chapter = Number(document.body.dataset.chapter);
  const resume = document.querySelector('#resume');
  if (resume && Number.isInteger(state.chapter) && state.chapter >= 1 && state.chapter <= Number(document.body.dataset.total)) {
    resume.hidden = false;
    resume.href = `chapter-${String(state.chapter).padStart(2, '0')}.html?resume=1`;
    resume.textContent = `${state.chapter}화 이어 읽기`;
  }
  if (!chapter) return;
  let size = Number(state.size);
  if (!Number.isFinite(size) || size < 16 || size > 30) size = 20;
  const smaller = document.querySelector('#smaller'), larger = document.querySelector('#larger');
  function setSize() {
    root.style.setProperty('--reading-size', `${size / 16}rem`);
    document.querySelector('#font-size').textContent = `${size}`;
    smaller.disabled = size <= 16; larger.disabled = size >= 30;
    state.size = size; save();
  }
  smaller.addEventListener('click', () => { size = Math.max(16, size - 2); setSize(); });
  larger.addEventListener('click', () => { size = Math.min(30, size + 2); setSize(); });
  setSize();
  const oldPosition = state.chapter === chapter && Number.isFinite(state.position) ? Math.max(0, Math.min(1, state.position)) : 0;
  state.chapter = chapter;
  let ready = false;
  function update() {
    const distance = document.documentElement.scrollHeight - innerHeight;
    const position = distance > 0 ? scrollY / distance : 0;
    document.querySelector('.progress').style.width = `${Math.max(0, Math.min(100, position * 100))}%`;
    if (ready) { state.position = position; clearTimeout(saveTimer); saveTimer = setTimeout(save, 250); }
  }
  requestAnimationFrame(() => {
    if (new URLSearchParams(location.search).has('resume')) scrollTo(0, oldPosition * (document.documentElement.scrollHeight - innerHeight));
    ready = true; update();
  });
  let pending = false;
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(() => { update(); pending = false; }); } }, { passive: true });
  addEventListener('pagehide', () => { update(); clearTimeout(saveTimer); save(); });
  addEventListener('resize', update, { passive: true });
})();
