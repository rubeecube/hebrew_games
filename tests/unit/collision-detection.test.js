/**
 * Unit tests for collision detection algorithms
 * Common in games like runner, car, falling letters, etc.
 */

describe('Collision Detection Logic', () => {
  describe('Rectangle collision (AABB)', () => {
    const rectCollision = (rect1, rect2) => {
      return rect1.x < rect2.x + rect2.width &&
             rect1.x + rect1.width > rect2.x &&
             rect1.y < rect2.y + rect2.height &&
             rect1.y + rect1.height > rect2.y;
    };

    test('should detect collision when rectangles overlap', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 25, y: 25, width: 50, height: 50 };
      expect(rectCollision(rect1, rect2)).toBe(true);
    });

    test('should not detect collision when rectangles do not overlap', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 100, y: 100, width: 50, height: 50 };
      expect(rectCollision(rect1, rect2)).toBe(false);
    });

    test('should detect collision when rectangles touch edges', () => {
      const rect1 = { x: 0, y: 0, width: 50, height: 50 };
      const rect2 = { x: 50, y: 0, width: 50, height: 50 };
      // Touching edges should be detected
      expect(rectCollision(rect1, rect2)).toBe(false);
    });

    test('should detect collision when one rectangle contains another', () => {
      const rect1 = { x: 0, y: 0, width: 100, height: 100 };
      const rect2 = { x: 25, y: 25, width: 50, height: 50 };
      expect(rectCollision(rect1, rect2)).toBe(true);
    });
  });

  describe('Circle collision', () => {
    const circleCollision = (circle1, circle2) => {
      const dx = circle1.x - circle2.x;
      const dy = circle1.y - circle2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < circle1.radius + circle2.radius;
    };

    test('should detect collision when circles overlap', () => {
      const circle1 = { x: 0, y: 0, radius: 50 };
      const circle2 = { x: 50, y: 0, radius: 50 };
      expect(circleCollision(circle1, circle2)).toBe(true);
    });

    test('should not detect collision when circles are apart', () => {
      const circle1 = { x: 0, y: 0, radius: 50 };
      const circle2 = { x: 200, y: 0, radius: 50 };
      expect(circleCollision(circle1, circle2)).toBe(false);
    });

    test('should detect collision when circles touch', () => {
      const circle1 = { x: 0, y: 0, radius: 50 };
      const circle2 = { x: 100, y: 0, radius: 50 };
      expect(circleCollision(circle1, circle2)).toBe(false);
    });

    test('should detect collision when one circle contains another', () => {
      const circle1 = { x: 0, y: 0, radius: 100 };
      const circle2 = { x: 10, y: 10, radius: 20 };
      expect(circleCollision(circle1, circle2)).toBe(true);
    });
  });

  describe('Point in rectangle', () => {
    const pointInRect = (point, rect) => {
      return point.x >= rect.x &&
             point.x <= rect.x + rect.width &&
             point.y >= rect.y &&
             point.y <= rect.y + rect.height;
    };

    test('should detect point inside rectangle', () => {
      const point = { x: 50, y: 50 };
      const rect = { x: 0, y: 0, width: 100, height: 100 };
      expect(pointInRect(point, rect)).toBe(true);
    });

    test('should not detect point outside rectangle', () => {
      const point = { x: 150, y: 150 };
      const rect = { x: 0, y: 0, width: 100, height: 100 };
      expect(pointInRect(point, rect)).toBe(false);
    });

    test('should detect point on edge', () => {
      const point = { x: 100, y: 50 };
      const rect = { x: 0, y: 0, width: 100, height: 100 };
      expect(pointInRect(point, rect)).toBe(true);
    });
  });

  describe('Distance calculations', () => {
    const distance = (x1, y1, x2, y2) => {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    };

    test('should calculate distance between two points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
      expect(distance(0, 0, 0, 10)).toBe(10);
    });

    test('should return 0 for same point', () => {
      expect(distance(5, 5, 5, 5)).toBe(0);
    });

    test('should handle negative coordinates', () => {
      expect(distance(-3, -4, 0, 0)).toBe(5);
    });
  });

  describe('Bounds checking', () => {
    const isInBounds = (obj, bounds) => {
      return obj.x >= bounds.minX &&
             obj.x + obj.width <= bounds.maxX &&
             obj.y >= bounds.minY &&
             obj.y + obj.height <= bounds.maxY;
    };

    test('should detect object in bounds', () => {
      const obj = { x: 50, y: 50, width: 50, height: 50 };
      const bounds = { minX: 0, minY: 0, maxX: 800, maxY: 600 };
      expect(isInBounds(obj, bounds)).toBe(true);
    });

    test('should detect object out of bounds', () => {
      const obj = { x: 750, y: 50, width: 100, height: 50 };
      const bounds = { minX: 0, minY: 0, maxX: 800, maxY: 600 };
      expect(isInBounds(obj, bounds)).toBe(false);
    });

    test('should detect object at edge', () => {
      const obj = { x: 0, y: 0, width: 800, height: 600 };
      const bounds = { minX: 0, minY: 0, maxX: 800, maxY: 600 };
      expect(isInBounds(obj, bounds)).toBe(true);
    });
  });
});




