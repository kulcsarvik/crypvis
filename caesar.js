const A_CODE = 'A'.charCodeAt(0);
const inputText = document.getElementById('inputText');
const shiftRange = document.getElementById('shiftRange');
const shiftValue = document.getElementById('shiftValue');
const mode = document.getElementById('mode');
const outputArea = document.getElementById('outputArea');
const alphabetRow = document.getElementById('alphabetRow');
const runBtn = document.getElementById('runBtn');
const stepBtn = document.getElementById('stepBtn');
const stopBtn = document.getElementById('stopBtn');

let stepping = false, stepTimer = null;

function buildAlphabet(){
  alphabetRow.innerHTML = '';
  for(let i=0; i<26; i++){
    const letter = document.createElement('div');
    letter.className = 'letter';
    letter.textContent = String.fromCharCode(A_CODE + i);
    alphabetRow.appendChild(letter);
  }
}

function normalizeShift(s){ return ((s % 26) + 26) % 26; }

function applyCaesar(text, shift, modeType='enc'){
  shift = normalizeShift(Number(shift));
  if(modeType === 'dec') shift = 26 - shift;
  let out = '';
  for(let ch of text){
    const code = ch.charCodeAt(0);
    if(code >= 65 && code < 91){
      out += String.fromCharCode(((code - 65 + shift) % 26) + 65);
    } else if(code >= 97 && code < 123){
      out += String.fromCharCode(((code - 97 + shift) % 26) + 97);
    } else {
      out += ch;
    }
  }
  return out;
}

function showMappingAnimation(shift, modeType='enc'){
  const s = normalizeShift(shift);
  const letters = alphabetRow.children;
  Array.from(alphabetRow.querySelectorAll('.arrow')).forEach(a => a.remove());

  for(let i = 0; i < 26; i++){
    const endIndex = (modeType === 'dec' ? i - s + 26 : i + s) % 26;
    const arrow = document.createElement('div');
    arrow.className = 'arrow';
    
    const startX = i * 32 + 14;      
    const offsetX = (endIndex - i) * 32;
    arrow.style.left = `${startX}px`;
    arrow.style.transform = `translateX(${offsetX}px) rotate(0deg)`;
    
    alphabetRow.appendChild(arrow);
  }
}

function run(){
  const text = inputText.value;
  const s = Number(shiftRange.value);
  const out = applyCaesar(text, s, mode.value);
  outputArea.textContent = out;
  showMappingAnimation(s, mode.value);
}

function playSteps(){
  if(stepping) return;
  stepping = true; 
  stepBtn.disabled = true; 
  stopBtn.disabled = false;

  const text = inputText.value;
  const s = Number(shiftRange.value);
  const modeType = mode.value;
  let idx = 0; 
  outputArea.textContent = '';
  showMappingAnimation(s, modeType);

  function doStep(){
    if(!stepping || idx >= text.length){ stopSteps(); return; }
    const ch = text[idx];
    outputArea.textContent += applyCaesar(ch, s, modeType);
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
}

shiftRange.addEventListener('input', () => {
  shiftValue.textContent = shiftRange.value;
  showMappingAnimation(shiftRange.value, mode.value);
});
runBtn.addEventListener('click', run);
stepBtn.addEventListener('click', playSteps);
stopBtn.addEventListener('click', stopSteps);

buildAlphabet();
shiftValue.textContent = shiftRange.value;
showMappingAnimation(Number(shiftRange.value), mode.value);
