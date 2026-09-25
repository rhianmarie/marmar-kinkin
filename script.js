const start = new Date('2025-12-12T00:00:00');
function updateCounter(){
  const days = Math.floor((Date.now() - start) / 86400000);
  document.getElementById('counter').textContent = days + ' days of us';
}
updateCounter();
setInterval(updateCounter, 3600000);
