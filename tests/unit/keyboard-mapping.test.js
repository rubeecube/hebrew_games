/**
 * Unit tests for Hebrew keyboard mapping helper
 */

const {
  hebrewLetters,
  englishToHebrewMap,
  hebrewToEnglishMap,
  englishToHebrew,
  hebrewToEnglish,
  getRandomHebrewLetter,
  isHebrewLetter,
  getEnglishKeyForHebrew,
} = require('../helpers/hebrew-keyboard');

describe('Hebrew Keyboard Mapping', () => {
  describe('hebrewLetters array', () => {
    test('should contain Hebrew letters', () => {
      expect(hebrewLetters).toBeDefined();
      expect(hebrewLetters.length).toBeGreaterThan(0);
      expect(hebrewLetters).toContain('א');
      expect(hebrewLetters).toContain('ב');
      expect(hebrewLetters).toContain('ת');
    });

    test('should contain 27 Hebrew letters', () => {
      expect(hebrewLetters.length).toBe(27);
    });
  });

  describe('englishToHebrew', () => {
    test('should convert English key to Hebrew letter', () => {
      expect(englishToHebrew('a')).toBe('ש');
      expect(englishToHebrew('s')).toBe('ד');
      expect(englishToHebrew('d')).toBe('ג');
    });

    test('should handle uppercase English keys', () => {
      expect(englishToHebrew('A')).toBe('ש');
      expect(englishToHebrew('S')).toBe('ד');
    });

    test('should return original key if no mapping exists', () => {
      expect(englishToHebrew('!')).toBe('!');
      expect(englishToHebrew('@')).toBe('@');
    });

    test('should handle special keys', () => {
      expect(englishToHebrew('1')).toBe('1');
      expect(englishToHebrew('2')).toBe('2');
    });
  });

  describe('hebrewToEnglish', () => {
    test('should convert Hebrew letter to English key', () => {
      expect(hebrewToEnglish('ש')).toBe('a');
      expect(hebrewToEnglish('ד')).toBe('s');
      expect(hebrewToEnglish('ג')).toBe('d');
    });

    test('should return original letter if no mapping exists', () => {
      expect(hebrewToEnglish('!')).toBe('!');
      expect(hebrewToEnglish('@')).toBe('@');
    });

    test('should handle all common Hebrew letters', () => {
      expect(hebrewToEnglish('א')).toBe('t');
      expect(hebrewToEnglish('ב')).toBe('c');
      expect(hebrewToEnglish('ת')).toBe(',');
    });
  });

  describe('getRandomHebrewLetter', () => {
    test('should return a Hebrew letter', () => {
      const letter = getRandomHebrewLetter();
      expect(hebrewLetters).toContain(letter);
    });

    test('should return different letters over multiple calls', () => {
      const letters = new Set();
      for (let i = 0; i < 50; i++) {
        letters.add(getRandomHebrewLetter());
      }
      // Should have gotten at least 10 different letters in 50 tries
      expect(letters.size).toBeGreaterThan(10);
    });
  });

  describe('isHebrewLetter', () => {
    test('should return true for Hebrew letters', () => {
      expect(isHebrewLetter('א')).toBe(true);
      expect(isHebrewLetter('ב')).toBe(true);
      expect(isHebrewLetter('ש')).toBe(true);
    });

    test('should return false for non-Hebrew characters', () => {
      expect(isHebrewLetter('a')).toBe(false);
      expect(isHebrewLetter('1')).toBe(false);
      expect(isHebrewLetter('!')).toBe(false);
    });

    test('should return false for empty string', () => {
      expect(isHebrewLetter('')).toBe(false);
    });
  });

  describe('getEnglishKeyForHebrew', () => {
    test('should return English key for Hebrew letter', () => {
      expect(getEnglishKeyForHebrew('ש')).toBe('a');
      expect(getEnglishKeyForHebrew('ד')).toBe('s');
      expect(getEnglishKeyForHebrew('ג')).toBe('d');
    });

    test('should return original character if no mapping', () => {
      expect(getEnglishKeyForHebrew('!')).toBe('!');
      expect(getEnglishKeyForHebrew('x')).toBe('x');
    });
  });

  describe('mapping consistency', () => {
    test('englishToHebrew and hebrewToEnglish should be inverse', () => {
      const englishKey = 'a';
      const hebrewLetter = englishToHebrew(englishKey);
      const backToEnglish = hebrewToEnglish(hebrewLetter);
      expect(backToEnglish).toBe(englishKey);
    });

    test('all English keys map to something', () => {
      expect(englishToHebrewMap).toBeDefined();
      expect(Object.keys(englishToHebrewMap).length).toBeGreaterThan(0);
    });

    test('all Hebrew letters have reverse mapping', () => {
      expect(hebrewToEnglishMap).toBeDefined();
      expect(Object.keys(hebrewToEnglishMap).length).toBeGreaterThan(0);
    });
  });

  describe('common game scenarios', () => {
    test('should handle rapid key conversion', () => {
      const keys = ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'];
      const hebrewLetters = keys.map(k => englishToHebrew(k));
      
      expect(hebrewLetters.length).toBe(keys.length);
      hebrewLetters.forEach(letter => {
        expect(typeof letter).toBe('string');
      });
    });

    test('should handle mixed case input', () => {
      expect(englishToHebrew('a')).toBe(englishToHebrew('A'));
      expect(englishToHebrew('s')).toBe(englishToHebrew('S'));
    });
  });
});




