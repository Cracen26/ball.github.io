
// Dark mode
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const root = document.documentElement;
if (localStorage.getItem('theme') === 'dark' || (prefersDark && !localStorage.getItem('theme'))) {
  document.documentElement.classList.add('dark');
}
document.getElementById('themeToggle').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Mobile menu
const btn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
btn.addEventListener('click', () => navLinks.classList.toggle('open'));

// Smooth scroll offset for sticky header
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      const y = el.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
      navLinks.classList.remove('open');
    }
  });
});

// Load JSON content
async function loadJSON(url) {
  const res = await fetch(url);
  return await res.json();
}

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html) e.innerHTML = html;
  return e;
}

// Render awards
(async function renderAwards() {
  const data = await loadJSON('awards.json');
  const list = document.getElementById('awardsList');
  data.sort((a,b) => b.year - a.year).forEach(a => {
    const row = el('div', 'list-item');
    row.appendChild(el('div', '', `<strong>${a.year}</strong> — ${a.name}`));
    const meta = el('div', 'meta', a.org);
    row.appendChild(meta);
    list.appendChild(row);
  });
})();

// Render books
(async function renderBooks() {
  const data = await loadJSON('books.json');
  const grid = document.getElementById('booksGrid');
  data.forEach(b => {
    const c = el('div', 'card');
    c.appendChild(el('h3', '', b.title));
    c.appendChild(el('p', 'small', `${b.publisher} · ${b.year}`));
    const a = el('a', 'btn ghost small', 'Buy');
    a.href = b.buy || '#';
    c.appendChild(a);
    grid.appendChild(c);
  });
})();

// Render publications + search
(async function renderPubs() {
  const data = await loadJSON('publications.json');
  const list = document.getElementById('pubsList');
  const input = document.getElementById('pubsSearch');
  function draw(q='') {
    list.innerHTML = '';
    const ql = q.trim().toLowerCase();
    data
      .filter(p => !ql || JSON.stringify(p).toLowerCase().includes(ql))
      .sort((a,b) => b.year - a.year)
      .forEach(p => {
        const row = el('div', 'list-item');
        row.appendChild(el('div', '', `<strong>${p.title}</strong><div class="small">${p.authors}</div>`));
        row.appendChild(el('div', 'meta', `${p.venue} · ${p.year} ${p.link ? ' · <a href="'+p.link+'">Link</a>' : ''}`));
        list.appendChild(row);
      });
  }
  draw();
  input.addEventListener('input', () => draw(input.value));
})();

// Back to top
const backTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backTop.style.display = window.scrollY > 600 ? 'inline-flex' : 'none';
});
backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
