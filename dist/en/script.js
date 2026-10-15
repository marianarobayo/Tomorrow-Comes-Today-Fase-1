/* Navegación, overlays accesibles e interacciones de la exposición. */
'use strict';
const $ = selector => document.querySelector(selector);
const dialog = $('#chapter-dialog');
const visited = new Set();
let activeIndex = 0;
let returnFocus = null;
let toastTimer;
const number = n => String(n + 1).padStart(2, '0');

chapters.forEach((chapter, index) => {
  const button = document.createElement('button');
  button.className = 'chapter-card';
  button.dataset.chapter = chapter.id;
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'chapter-dialog');
  button.innerHTML = `<span class="chapter-number">${number(index)}</span><strong>${chapter.name}</strong><small>${chapter.kicker}</small><span class="chapter-arrow" aria-hidden="true">↗</span>`;
  button.addEventListener('click', () => openChapter(index, button));
  $('#chapter-grid').append(button);
  const link = document.createElement('button');
  link.textContent = `${number(index)}  ${chapter.name}`;
  link.addEventListener('click', () => openChapter(index));
  $('#dialog-index').append(link);
});

function openChapter(index, trigger) {
  activeIndex = index;
  const chapter = chapters[index];
  if (!dialog.open) returnFocus = trigger || document.activeElement;
  $('#dialog-position').textContent = `ARCHIVE ${number(index)} / 08 · SCENARIO 13`;
  $('#dialog-kicker').textContent = chapter.kicker.toUpperCase();
  $('#dialog-title').textContent = chapter.title;
  renderChapterText(chapter, index);
  $('#page-source').textContent = `SOURCE PDF · P. ${chapter.page}`;
  $('#previous').disabled = index === 0;
  $('#next').disabled = index === chapters.length - 1;
  [...$('#dialog-index').children].forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
  visited.add(chapter.id);
  document.querySelector(`[data-chapter="${chapter.id}"]`).classList.add('visited');
  $('#visit-count').textContent = `${String(visited.size).padStart(2, '0')} / 08 chapters explored`;
  if (!dialog.open) dialog.showModal();
  document.body.style.overflow = 'hidden';
  $('#dialog-article').scrollTop = 0;
  $('#dialog-title').tabIndex = -1;
  $('#dialog-title').focus({preventScroll:true});
  history.replaceState(null, '', `#${chapter.id}`);
}
function closeChapter() { dialog.close(); }
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  history.replaceState(null, '', '#archivo');
  if (returnFocus && document.contains(returnFocus)) returnFocus.focus({preventScroll:true});
});
$('#close-dialog').addEventListener('click', closeChapter);
$('#previous').addEventListener('click', () => { if (activeIndex > 0) openChapter(activeIndex - 1); });
$('#next').addEventListener('click', () => { if (activeIndex < chapters.length - 1) openChapter(activeIndex + 1); });
dialog.addEventListener('click', event => {
  if(event.target !== dialog) return;
  const rect = dialog.getBoundingClientRect();
  if(event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeChapter();
});
document.addEventListener('keydown', event => {
  if (!dialog.open || $('#visual-dialog').open || ['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;
  if (event.key === 'ArrowRight' && activeIndex < chapters.length - 1) { event.preventDefault(); openChapter(activeIndex + 1); }
  if (event.key === 'ArrowLeft' && activeIndex > 0) { event.preventDefault(); openChapter(activeIndex - 1); }
});
$('#font-size').addEventListener('click', () => {
  const expanded = dialog.classList.toggle('large-reading');
  $('#font-size').setAttribute('aria-pressed', String(expanded));
  $('#font-size').textContent = expanded ? 'Aa −' : 'Aa +';
});
function notify(message) {
  clearTimeout(toastTimer);
  $('#toast').textContent = message;
  $('#toast').classList.add('show');
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 4500);
}
$('#presentation').setAttribute('aria-pressed', 'false');
$('#presentation').addEventListener('click', async () => {
  const enabled = document.body.classList.toggle('presentation-mode');
  $('#presentation').setAttribute('aria-pressed', String(enabled));
  $('#presentation').innerHTML = enabled ? 'Exit presentation <span aria-hidden="true">↙</span>' : 'Presentation mode <span aria-hidden="true">↗</span>';
  if (enabled) {
    try { if (!document.fullscreenElement && document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen(); } catch { /* La lectura ampliada sigue disponible si el navegador limita pantalla completa. */ }
    notify('Presentation mode · larger text · ← → to switch chapters · Esc to close');
    openChapter(0, $('#presentation'));
  } else if (document.fullscreenElement) {
    try { await document.exitFullscreen(); } catch { /* La salida manual también está disponible. */ }
  }
});
$('#reveal').addEventListener('click', () => {
  const expanded = $('#reveal').getAttribute('aria-expanded') !== 'true';
  $('#reveal').setAttribute('aria-expanded', String(expanded));
  $('#second-reading').hidden = !expanded;
  $('#reveal').innerHTML = expanded ? 'Return to the message <span aria-hidden="true">↙</span>' : 'Read between the lines <span aria-hidden="true">↗</span>';
});
$('#credits').addEventListener('click', () => $('#credits-dialog').showModal());
$('#close-credits').addEventListener('click', () => $('#credits-dialog').close());
function openHash() {
  const [chapterHash, referenceHash] = location.hash.split('/');
  const index = chapters.findIndex(chapter => `#${chapter.id}` === chapterHash);
  if (index >= 0) openChapter(index, document.querySelector(`[data-chapter="${chapters[index].id}"]`));
  else if (dialog.open) closeChapter();
  if(index === 7 && /^ref-\d+$/.test(referenceHash || '')) focusReference(Number(referenceHash.slice(4)));
}
window.addEventListener('hashchange', openHash);
openHash();

$('#close-visual').addEventListener('click', () => $('#visual-dialog').close());
$('#visual-dialog').addEventListener('click', event => { if(event.target === $('#visual-dialog')) $('#visual-dialog').close(); });
