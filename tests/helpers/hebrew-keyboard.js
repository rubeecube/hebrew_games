/**
 * Hebrew Keyboard Mapping Helper
 * Maps English QWERTY keys to Hebrew keyboard layout
 */

// Hebrew alphabet in QWERTY order
const hebrewLetters = [
  'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י',
  'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר',
  'ש', 'ת', 'ך', 'ם', 'ן', 'ף', 'ץ'
];

// English to Hebrew keyboard mapping (based on Israeli standard layout)
const englishToHebrewMap = {
  // Top row (numbers)
  '1': '1', '2': '2', '3': '3', '4': '4', '5': '5',
  '6': '6', '7': '7', '8': '8', '9': '9', '0': '0',
  
  // Top letter row (QWERTY)
  'q': '/', 'Q': '/',
  'w': '\'', 'W': '\'',
  'e': 'ק', 'E': 'ק',
  'r': 'ר', 'R': 'ר',
  't': 'א', 'T': 'א',
  'y': 'ט', 'Y': 'ט',
  'u': 'ו', 'U': 'ו',
  'i': 'ן', 'I': 'ן',
  'o': 'ם', 'O': 'ם',
  'p': 'פ', 'P': 'פ',
  
  // Middle row (ASDFGH)
  'a': 'ש', 'A': 'ש',
  's': 'ד', 'S': 'ד',
  'd': 'ג', 'D': 'ג',
  'f': 'כ', 'F': 'כ',
  'g': 'ע', 'G': 'ע',
  'h': 'י', 'H': 'י',
  'j': 'ח', 'J': 'ח',
  'k': 'ל', 'K': 'ל',
  'l': 'ך', 'L': 'ך',
  ';': 'ף', ':': 'ף',
  '\'': ',', '"': ',',
  
  // Bottom row (ZXCVBN)
  'z': 'ז', 'Z': 'ז',
  'x': 'ס', 'X': 'ס',
  'c': 'ב', 'C': 'ב',
  'v': 'ה', 'V': 'ה',
  'b': 'נ', 'B': 'נ',
  'n': 'מ', 'N': 'מ',
  'm': 'צ', 'M': 'צ',
  ',': 'ת', '<': 'ת',
  '.': 'ץ', '>': 'ץ',
  '/': '.', '?': '.',
};

// Reverse mapping (Hebrew to English)
const hebrewToEnglishMap = {};
for (const [eng, heb] of Object.entries(englishToHebrewMap)) {
  if (!hebrewToEnglishMap[heb]) {
    hebrewToEnglishMap[heb] = eng.toLowerCase();
  }
}

/**
 * Convert English key to Hebrew letter
 * @param {string} englishKey - English QWERTY key
 * @returns {string} Hebrew letter or original key if no mapping
 */
function englishToHebrew(englishKey) {
  return englishToHebrewMap[englishKey] || englishKey;
}

/**
 * Convert Hebrew letter to English key
 * @param {string} hebrewLetter - Hebrew letter
 * @returns {string} English QWERTY key or original letter if no mapping
 */
function hebrewToEnglish(hebrewLetter) {
  return hebrewToEnglishMap[hebrewLetter] || hebrewLetter;
}

/**
 * Get random Hebrew letter
 * @returns {string} Random Hebrew letter
 */
function getRandomHebrewLetter() {
  return hebrewLetters[Math.floor(Math.random() * hebrewLetters.length)];
}

/**
 * Check if a character is a Hebrew letter
 * @param {string} char - Character to check
 * @returns {boolean} True if Hebrew letter
 */
function isHebrewLetter(char) {
  return hebrewLetters.includes(char);
}

/**
 * Get the English key equivalent for a Hebrew letter
 * Useful for simulating keyboard input in tests
 * @param {string} hebrewLetter - Hebrew letter
 * @returns {string} English key to press
 */
function getEnglishKeyForHebrew(hebrewLetter) {
  return hebrewToEnglish(hebrewLetter) || hebrewLetter;
}

module.exports = {
  hebrewLetters,
  englishToHebrewMap,
  hebrewToEnglishMap,
  englishToHebrew,
  hebrewToEnglish,
  getRandomHebrewLetter,
  isHebrewLetter,
  getEnglishKeyForHebrew,
};




