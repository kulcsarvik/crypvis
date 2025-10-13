const A_CODE = 'A'.charCodeAt(0), a_CODE = 'a'.charCodeAt(0);
const inputText = document.getElementById('inputText');
const shiftRange = document.getElementById('shiftRange');
const shiftValue = document.getElementById('shiftValue');
const mode = document.getElementById('mode');
const outputArea = document.getElementById('outputArea');
const alphabetRow = document.getElementById('alphabetRow');
const mappedRow = document.getElementById('mappedRow');
const runBtn = document.getElementById('runBtn');
const visualizeBtn = document.getElementById('visualizeBtn');
const stepBtn = document.getElementById('stepBtn');
const stopBtn = document.getElementById('stopBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const randomBtn = document.getElementById('randomBtn');

let stepping = false;
let stepTimer = null;

function buildAlphabet() {
  alphabetRow.innerHTML = '';
  mappedRow.innerHTML = '';
  for (let i = 0; i < 26; i++) {
    const letter = document.createElement('div');
    letter.className = 'letter';
    letter.textContent = String.fromCharCode(A_CODE + i);
    alphabetRow.appendChild(letter);

    const mapped = document.createElement('div');
    mapped.className = 'letter small';
    mapped.textContent = String.fromCharCode(A_CODE + i);
    mappedRow.appendChild(mapped);
  }
}

function normalizeShift(s) { return ((s % 26) + 26) % 26; }

function applyCaesar(text, shift, modeType='enc'){
  shift = normalizeShift(Number(shift));
  if(modeType === 'dec') shift = 26 - shift;
  let out = '';
  for (let ch of text) {
    const code = ch.charCodeAt(0);
    if (code >= A_CODE && code < A_CODE + 26) {
      out += String.fromCharCode(((code - A_CODE + shift) % 26) + A_CODE);
    } else if (code >= a_CODE && code < a_CODE + 26) {
      out += String.fromCharCode(((code - a_CODE + shift) % 26) + a_CODE);
    } else {
      out += ch;
    }
  }
  return out;
}

function updateMapping(shift){
  const s = normalizeShift(shift);
  const mappedChildren = mappedRow.children;
  for (let i = 0; i < 26; i++) {
    mappedChildren[i].textContent = String.fromCharCode(A_CODE + ((i + s) % 26));
    mappedChildren[i].classList.remove('highlight');
  }
}

function run() {
  const text = inputText.value;
  const s = Number(shiftRange.value);
  const out = applyCaesar(text, s, mode.value);
  outputArea.textContent = out;
  updateMapping(s);
}

function playSteps() {
  if (stepping) return;
  stepping = true;
  stepBtn.disabled = true;
  stopBtn.disabled = false;

  const text = inputText.value;
  const s = Number(shiftRange.value);
  const modeType = mode.value;
  let idx = 0;
  outputArea.textContent = '';

  updateMapping(s);

  function doStep(){
    if (!stepping || idx >= text.length) { stopSteps(); return; }
    const ch = text[idx];
    const code = ch.charCodeAt(0);
    Array.from(mappedRow.children).forEach(c => c.classList.remove('cursor','highlight'));

    if (code >= A_CODE && code < A_CODE + 26) {
      const pos = code - A_CODE;
      const mappedIndex = (pos + (modeType==='dec' ? 26 - Number(s) : Number(s))) % 26;
      mappedRow.children[mappedIndex].classList.add('highlight','cursor');
    } else if (code >= a_CODE && code < a_CODE + 26) {
      const pos = code - a_CODE;
      const mappedIndex = (pos + (modeType==='dec' ? 26 - Number(s) : Number(s))) % 26;
      mappedRow.children[mappedIndex].classList.add('highlight','cursor');
    }

    const transformed = applyCaesar(ch, s, modeType);
    outputArea.textContent += transformed;

    idx++;
    stepTimer = setTimeout(doStep, 220);
  }

  doStep();
}

function stopSteps(){
  stepping = false;
  stepBtn.disabled = false;
  stopBtn.disabled = true;
  clearTimeout(stepTimer);
  Array.from(mappedRow.children).forEach(c => c.classList.remove('cursor'));
}

shiftRange.addEventListener('input', ()=>{ shiftValue.textContent = shiftRange.value; updateMapping(shiftRange.value); });
runBtn.addEventListener('click', run);
visualizeBtn.addEventListener('click', ()=>{ updateMapping(Number(shiftRange.value)); });
stepBtn.addEventListener('click', playSteps);
stopBtn.addEventListener('click', stopSteps);
copyBtn.addEventListener('click', ()=>{ navigator.clipboard.writeText(outputArea.textContent); copyBtn.textContent='Copied!'; setTimeout(()=>copyBtn.textContent='Copy Output',900); });
clearBtn.addEventListener('click', ()=>{ inputText.value=''; outputArea.textContent=''; });
randomBtn.addEventListener('click', ()=>{ inputText.value = sample(); });

function sample(){
  const examples = [
    'Hello!',
    'There will be no explanation, just reputation',
    'The quick brown fox jumps over the lazy dog.',
    'You must like me for me'
  ];
  return examples[Math.floor(Math.random()*examples.length)];
}

buildAlphabet();
updateMapping(Number(shiftRange.value));
shiftValue.textContent = shiftRange.value;

window.addEventListener('keydown', (e)=>{ if (e.ctrlKey && e.key === 'Enter') run(); });
