const A_CODE = 'A'.charCodeAt(0), a_CODE = 'a'.charCodeAt(0);
const inputText = document.getElementById('inputText');
const shiftRange = document.getElementById('shiftRange');
const shiftValue = document.getElementById('shiftValue');
const mode = document.getElementById('mode');
const outputArea = document.getElementById('outputArea');
const alphabetRow = document.getElementById('alphabetRow');
const mappedRow = document.getElementById('mappedRow');
const runBtn = document.getElementById('runBtn');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const randomBtn = document.getElementById('randomBtn');
const processLog = document.getElementById('processLog');

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

function applyCaesarChar(ch, shift, modeType='enc'){
  shift = normalizeShift(Number(shift));
  if (modeType === 'dec') shift = 26 - shift;
  const code = ch.charCodeAt(0);
  if (code >= A_CODE && code < A_CODE + 26) {
    return String.fromCharCode(((code - A_CODE + shift) % 26) + A_CODE);
  } else if (code >= a_CODE && code < a_CODE + 26) {
    return String.fromCharCode(((code - a_CODE + shift) % 26) + a_CODE);
  } else {
    return ch;
  }
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
  const modeType = mode.value;

  let out = '';
  const lines = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);

    if (code >= A_CODE && code < A_CODE + 26) {
      const pos = code - A_CODE;
      const usedShift = modeType === 'dec' ? (26 - normalizeShift(s)) : normalizeShift(s);
      const mappedIndex = (pos + usedShift) % 26;
      const mappedChar = String.fromCharCode(A_CODE + mappedIndex);
      out += mappedChar;
    } else if (code >= a_CODE && code < a_CODE + 26) {
      const pos = code - a_CODE;
      const usedShift = modeType === 'dec' ? (26 - normalizeShift(s)) : normalizeShift(s);
      const mappedIndex = (pos + usedShift) % 26;
      const mappedChar = String.fromCharCode(a_CODE + mappedIndex);
      out += mappedChar;
    } else {
      out += ch;
    }
  }

  outputArea.textContent = out || '(empty)';
  processLog.textContent = lines.join('\n');
  updateMapping(s);
}

shiftRange.addEventListener('input', ()=>{
  shiftValue.textContent = shiftRange.value;
  updateMapping(shiftRange.value);
});

runBtn.addEventListener('click', run);

copyBtn.addEventListener('click', ()=>{
  navigator.clipboard.writeText(outputArea.textContent);
  copyBtn.textContent='Copied!';
  setTimeout(()=>copyBtn.textContent='Copy Output',900);
});

clearBtn.addEventListener('click', ()=>{
  inputText.value='';
  outputArea.textContent='';
  processLog.textContent='(press Run)';
});

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

window.addEventListener('keydown', (e)=>{
  if (e.ctrlKey && e.key === 'Enter') run();
});
