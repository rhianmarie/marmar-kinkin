// ---------- dates (month is 0-based: 0 = Jan, 11 = Dec) ----------
const START    = new Date(2025, 11, 12); // started talking, Dec 12, 2025 (also the 1st anniversary date)
const OFFICIAL = new Date(2026, 9, 17);  // official, Oct 17, 2026; monthsary is the 17th of every month
const ANNIV    = new Date(2026, 11, 12); // 1st anniversary, Dec 12, 2026

// ---------- helpers ----------
const $ = (id) => document.getElementById(id);

// whole calendar days from a to b (safe across daylight saving)
function daysBetween(a, b) {
  const ua = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const ub = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((ub - ua) / 86400000);
}

function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function monthsaryDate(n) {
  return new Date(OFFICIAL.getFullYear(), OFFICIAL.getMonth() + n, 17);
}

function fmt(d) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function plural(n, word) {
  return n + ' ' + word + (n === 1 ? '' : 's');
}

// a few hearts floating up on special days
function floatHearts() {
  for (let i = 0; i < 16; i++) {
    const h = document.createElement('span');
    h.className = 'float-heart';
    h.textContent = '\u2764';
    h.setAttribute('aria-hidden', 'true');
    h.style.left = Math.random() * 95 + 'vw';
    h.style.fontSize = 14 + Math.random() * 18 + 'px';
    h.style.animationDelay = Math.random() * 3 + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 10000);
  }
}

// ---------- days of us ----------
function updateCounter() {
  const el = $('counter');
  if (!el) return;
  el.textContent = daysBetween(START, new Date()) + ' days of us';
}

// ---------- monthsary ----------
let celebrated = false;
function updateMonthsary() {
  const now = new Date();
  let n = 1;
  while (daysBetween(now, monthsaryDate(n)) < 0) n++;
  const left = daysBetween(now, monthsaryDate(n));
  const done = n - 1;

  const title = $('ms-title');
  const big = $('ms-days');
  const sub = $('ms-sub');
  const heart = $('heart');
  if (!title || !big || !sub || !heart) return;

  if (left === 0) {
    title.textContent = 'Happy ' + ordinal(n) + ' monthsary, kinkin!';
    big.textContent = 'today';
    sub.textContent = 'I love you, today and every 17th.';
    heart.classList.add('fast');
    if (!celebrated) { celebrated = true; floatHearts(); }
  } else {
    title.textContent = 'our ' + ordinal(n) + ' monthsary';
    big.textContent = plural(left, 'day') + ' to go';
    sub.textContent = fmt(monthsaryDate(n)) +
      (done > 0 ? ' \u00b7 ' + plural(done, 'monthsary') + ' celebrated so far' : '');
    heart.classList.remove('fast');
  }
}

// ---------- 1st anniversary recap ----------
function updateAnniversary() {
  const lock = $('recap-lock');
  const recap = $('recap');
  const sub = $('anniv-sub');
  const title = $('anniv-title');
  if (!lock || !recap) return;

  const left = daysBetween(new Date(), ANNIV);
  const preview = new URLSearchParams(location.search).get('preview') === 'recap';

  if (left > 0 && !preview) {
    title.textContent = 'our 1st anniversary';
    sub.textContent = fmt(ANNIV) + ' \u00b7 ' + plural(left, 'day') + ' to go. Our recap opens that day.';
    lock.hidden = false;
    recap.hidden = true;
  } else {
    lock.hidden = true;
    recap.hidden = false;
    const days = $('year-days');
    if (days) days.textContent = daysBetween(START, ANNIV);
    if (left === 0 && !celebrated) { celebrated = true; floatHearts(); }
  }
}

// ---------- monthly letters link ----------
function setupLetters() {
  const btn = $('letters-btn');
  if (!btn) return;
  if (btn.getAttribute('href').indexOf('PASTE_YOUR') !== -1) {
    btn.classList.add('soon');
    btn.removeAttribute('target');
    btn.setAttribute('aria-disabled', 'true');
    btn.textContent = 'letters coming soon';
    btn.addEventListener('click', (e) => e.preventDefault());
  }
}

// ---------- envelope ----------
function setupEnvelope() {
  const env = $('envelope');
  const letter = $('letter');
  if (!env || !letter) return;
  env.addEventListener('click', () => {
    env.setAttribute('aria-expanded', String(letter.classList.toggle('open')));
  });
}

// ---------- anniversary gift: unwrap one by one ----------
function setupGift() {
  const items = Array.from(document.querySelectorAll('.gift-item'));
  const progress = $('gift-progress');
  if (!items.length) return;
  let opened = 0;

  function lockState() {
    items.forEach((item, i) => {
      const btn = item.querySelector('.gift-wrap');
      btn.disabled = i > opened;
      btn.setAttribute('aria-label', 'Unwrap gift ' + (i + 1));
    });
    if (progress) {
      progress.textContent = opened >= items.length
        ? 'all ' + items.length + ' unwrapped. I love you, kinkin.'
        : 'tap gift ' + (opened + 1) + ' to unwrap it (' + opened + ' of ' + items.length + ' opened)';
    }
  }

  items.forEach((item, i) => {
    const btn = item.querySelector('.gift-wrap');
    const reveal = item.querySelector('.gift-reveal');
    btn.addEventListener('click', () => {
      if (i > opened) return;
      btn.hidden = true;
      reveal.hidden = false;
      if (i === opened) opened++;
      lockState();
      reveal.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
  lockState();
}

function refresh() {
  updateCounter();
  updateMonthsary();
  updateAnniversary();
}

refresh();
setupLetters();
setupEnvelope();
setupGift();
setInterval(refresh, 60000);
