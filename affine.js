const inputText = document.getElementById("inputText");
const aValue = document.getElementById("aValue");
const bValue = document.getElementById("bValue");
const outputArea = document.getElementById("outputArea");
const detailsArea = document.getElementById("detailsArea");
const modeSelect = document.getElementById("mode");
const alphabetRow = document.getElementById("alphabetRow");
const mappedRow = document.getElementById("mappedRow");
const runBtn = document.getElementById("runBtn");
const copyBtn = document.getElementById("copyBtn");
const clearBtn = document.getElementById("clearBtn");
const randomBtn = document.getElementById("randomBtn");

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function modInverse(a, m) {
  a = ((a % m) + m) % m;
  for (let x = 1; x < m; x++) {
    if ((a * x) % m === 1) return x;
  }
  return null;
}

function affineEncrypt(text, a, b, showSteps = false) {
  let result = "";
  let steps = [];

  for (let ch of text.toUpperCase()) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) {
      result += ch;
      continue;
    }
    const cipherIndex = (a * idx + b) % 26;
    const cipherChar = alphabet[cipherIndex];
    result += cipherChar;

    if (showSteps)
      steps.push(`${ch} → (${idx}×${a} + ${b}) mod 26 = ${cipherIndex} → ${cipherChar}`);
  }

  if (showSteps) detailsArea.innerHTML = steps.join("<br>");
  return result;
}

function affineDecrypt(text, a, b, showSteps = false) {
  let result = "";
  let steps = [];
  const a_inv = modInverse(a, 26);
  if (a_inv === null) {
    detailsArea.textContent = "Error: no inverse for a.";
    return "(invalid a)";
  }

  for (let ch of text.toUpperCase()) {
    const idx = alphabet.indexOf(ch);
    if (idx === -1) {
      result += ch;
      continue;
    }
    const plainIndex = (a_inv * (idx - b + 26)) % 26;
    const plainChar = alphabet[plainIndex];
    result += plainChar;

    if (showSteps)
      steps.push(`${ch} → ${a_inv}×(${idx} - ${b}) mod 26 = ${plainIndex} → ${plainChar}`);
  }

  if (showSteps) detailsArea.innerHTML = steps.join("<br>");
  return result;
}

function updateMapping(a, b, mode) {
  alphabetRow.innerHTML = "";
  mappedRow.innerHTML = "";

  for (let i = 0; i < 26; i++) {
    const plain = alphabet[i];
    let cipher;
    if (mode === "enc") {
      cipher = alphabet[(a * i + b) % 26];
    } else {
      const a_inv = modInverse(a, 26);
      cipher = a_inv ? alphabet[(a_inv * (i - b + 26)) % 26] : "?";
    }

    const pDiv = document.createElement("div");
    pDiv.textContent = plain;
    alphabetRow.appendChild(pDiv);

    const cDiv = document.createElement("div");
    cDiv.textContent = cipher;
    mappedRow.appendChild(cDiv);
  }
}

// --- Event handlers ---
runBtn.addEventListener("click", () => {
  const text = inputText.value;
  const a = parseInt(aValue.value);
  const b = parseInt(bValue.value);
  const mode = modeSelect.value;

  if (modInverse(a, 26) === null) {
    outputArea.textContent = "Error: 'a' must be coprime with 26.";
    detailsArea.textContent = "";
    return;
  }

  detailsArea.innerHTML = "";

  const output =
    mode === "enc"
      ? affineEncrypt(text, a, b, true)
      : affineDecrypt(text, a, b, true);

  outputArea.textContent = output;
  updateMapping(a, b, mode);
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputArea.textContent);
});

clearBtn.addEventListener("click", () => {
  inputText.value = "";
  outputArea.textContent = "";
  detailsArea.textContent = "";
});

randomBtn.addEventListener("click", () => {
  const coprimeA = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];
  aValue.value = coprimeA[Math.floor(Math.random() * coprimeA.length)];
  bValue.value = Math.floor(Math.random() * 26);
  inputText.value = "AFFINECIPHER";
});

updateMapping(5, 8, "enc");
