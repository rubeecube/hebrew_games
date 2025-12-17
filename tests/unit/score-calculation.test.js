/**
 * Unit tests for score calculation logic
 * Common patterns across games
 */

describe('Score Calculation', () => {
  describe('Basic score increments', () => {
    test('should add points correctly', () => {
      let score = 0;
      score += 10;
      expect(score).toBe(10);
      score += 20;
      expect(score).toBe(30);
    });

    test('should handle negative score prevention', () => {
      let score = 50;
      const penalty = -100;
      score = Math.max(0, score + penalty);
      expect(score).toBe(0);
    });
  });

  describe('Combo multiplier system', () => {
    const calculateComboScore = (baseScore, comboCount) => {
      const multiplier = Math.min(1 + (comboCount * 0.1), 3.0);
      return Math.floor(baseScore * multiplier);
    };

    test('should apply combo multiplier', () => {
      expect(calculateComboScore(10, 0)).toBe(10);
      expect(calculateComboScore(10, 5)).toBe(15);
      expect(calculateComboScore(10, 10)).toBe(20);
    });

    test('should cap combo multiplier at 3x', () => {
      expect(calculateComboScore(10, 20)).toBe(30);
      expect(calculateComboScore(10, 100)).toBe(30);
    });

    test('should handle negative combo count', () => {
      expect(calculateComboScore(10, -5)).toBe(5);
    });
  });

  describe('Level-based scoring', () => {
    const getLevelMultiplier = (level) => {
      return 1 + (level - 1) * 0.2;
    };

    test('should increase score multiplier with level', () => {
      expect(getLevelMultiplier(1)).toBe(1.0);
      expect(getLevelMultiplier(2)).toBe(1.2);
      expect(getLevelMultiplier(5)).toBe(1.8);
    });

    test('should handle level 0 or negative', () => {
      expect(getLevelMultiplier(0)).toBe(0.8);
      expect(getLevelMultiplier(-1)).toBe(0.6);
    });
  });

  describe('WPM (Words Per Minute) calculation', () => {
    const calculateWPM = (charactersTyped, timeInSeconds) => {
      if (timeInSeconds === 0) return 0;
      const words = charactersTyped / 5; // Standard: 1 word = 5 characters
      const minutes = timeInSeconds / 60;
      return Math.round(words / minutes);
    };

    test('should calculate WPM correctly', () => {
      expect(calculateWPM(250, 60)).toBe(50); // 50 chars in 1 min = 50 WPM
      expect(calculateWPM(100, 30)).toBe(40); // 100 chars in 30s = 40 WPM
    });

    test('should handle zero time', () => {
      expect(calculateWPM(100, 0)).toBe(0);
    });

    test('should handle zero characters', () => {
      expect(calculateWPM(0, 60)).toBe(0);
    });

    test('should round to nearest integer', () => {
      expect(calculateWPM(125, 60)).toBe(25);
      expect(calculateWPM(127, 60)).toBe(25);
    });
  });

  describe('Accuracy calculation', () => {
    const calculateAccuracy = (correct, total) => {
      if (total === 0) return 100;
      return Math.round((correct / total) * 100);
    };

    test('should calculate accuracy percentage', () => {
      expect(calculateAccuracy(90, 100)).toBe(90);
      expect(calculateAccuracy(50, 100)).toBe(50);
      expect(calculateAccuracy(100, 100)).toBe(100);
    });

    test('should handle zero total', () => {
      expect(calculateAccuracy(0, 0)).toBe(100);
    });

    test('should handle perfect accuracy', () => {
      expect(calculateAccuracy(50, 50)).toBe(100);
    });

    test('should round correctly', () => {
      expect(calculateAccuracy(33, 100)).toBe(33);
      expect(calculateAccuracy(67, 100)).toBe(67);
    });
  });

  describe('Lives system', () => {
    const MAX_LIVES = 3;

    test('should decrease lives on error', () => {
      let lives = MAX_LIVES;
      lives--;
      expect(lives).toBe(2);
    });

    test('should not go below zero lives', () => {
      let lives = 1;
      lives = Math.max(0, lives - 1);
      expect(lives).toBe(0);
      lives = Math.max(0, lives - 1);
      expect(lives).toBe(0);
    });

    test('should detect game over', () => {
      let lives = 0;
      const isGameOver = lives <= 0;
      expect(isGameOver).toBe(true);
    });
  });

  describe('Level progression', () => {
    const calculateLevel = (score) => {
      return Math.floor(score / 100) + 1;
    };

    test('should advance level based on score', () => {
      expect(calculateLevel(0)).toBe(1);
      expect(calculateLevel(50)).toBe(1);
      expect(calculateLevel(100)).toBe(2);
      expect(calculateLevel(250)).toBe(3);
    });

    test('should handle large scores', () => {
      expect(calculateLevel(1000)).toBe(11);
    });
  });

  describe('Time bonus calculation', () => {
    const calculateTimeBonus = (timeRemaining, maxTime) => {
      if (maxTime === 0) return 0;
      const percentage = timeRemaining / maxTime;
      return Math.floor(percentage * 100);
    };

    test('should calculate bonus based on time remaining', () => {
      expect(calculateTimeBonus(30, 30)).toBe(100);
      expect(calculateTimeBonus(15, 30)).toBe(50);
      expect(calculateTimeBonus(0, 30)).toBe(0);
    });

    test('should handle zero max time', () => {
      expect(calculateTimeBonus(10, 0)).toBe(0);
    });

    test('should handle negative time remaining', () => {
      expect(calculateTimeBonus(-5, 30)).toBe(-17);
    });
  });

  describe('Difficulty speed calculation', () => {
    const calculateSpeed = (baseSpeed, level) => {
      return baseSpeed + (level - 1) * 0.5;
    };

    test('should increase speed with level', () => {
      expect(calculateSpeed(2, 1)).toBe(2);
      expect(calculateSpeed(2, 2)).toBe(2.5);
      expect(calculateSpeed(2, 5)).toBe(4);
    });

    test('should handle base speed of zero', () => {
      expect(calculateSpeed(0, 5)).toBe(2);
    });
  });
});

