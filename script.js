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