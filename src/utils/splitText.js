export function splitIntoWords(el) {
  // Idempotent: if already split, return the existing word-inner nodes
  // without rewriting the DOM (which would lose the source spaces).
  if (el.dataset.splitText) {
    const existing = el.querySelectorAll('.word-inner');
    if (existing.length) return existing;
  }
  // First call: snapshot the source text from the rendered JSX
  // and cache it on a data attribute so any future call can recover it.
  const text = el.innerText.trim().replace(/\s+/g, ' ');
  el.dataset.splitText = text;
  el.innerHTML = text
    .split(' ')
    .map(
      (word) =>
        `<span style="display:inline-block;overflow:hidden;vertical-align:bottom;margin-right:0.32em">` +
        `<span class="word-inner" style="display:inline-block">${word}</span>` +
        `</span>`
    )
    .join('');
  return el.querySelectorAll('.word-inner');
}

export function splitIntoLines(el) {
  el.innerHTML = el.innerText
    .split('\n')
    .filter(Boolean)
    .map(
      (line) =>
        `<div style="overflow:hidden">
           <div class="line-inner" style="display:block">${line}</div>
         </div>`
    )
    .join('');
  return el.querySelectorAll('.line-inner');
}
