/**
 * Unit tests for viewport configuration helper
 */

const {
  viewports,
  devices,
  getViewport,
  getDevice,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
} = require('../helpers/viewport-config');

describe('Viewport Configuration', () => {
  describe('viewports object', () => {
    test('should have desktop viewport', () => {
      expect(viewports.desktop).toBeDefined();
      expect(viewports.desktop.width).toBe(1920);
      expect(viewports.desktop.height).toBe(1080);
    });

    test('should have mobile viewport', () => {
      expect(viewports.mobile).toBeDefined();
      expect(viewports.mobile.width).toBe(375);
      expect(viewports.mobile.height).toBe(667);
    });

    test('should have tablet viewport', () => {
      expect(viewports.tablet).toBeDefined();
      expect(viewports.tablet.width).toBe(768);
      expect(viewports.tablet.height).toBe(1024);
    });

    test('all viewports should have width and height', () => {
      Object.values(viewports).forEach(viewport => {
        expect(viewport).toHaveProperty('width');
        expect(viewport).toHaveProperty('height');
        expect(typeof viewport.width).toBe('number');
        expect(typeof viewport.height).toBe('number');
      });
    });
  });

  describe('devices object', () => {
    test('should have iPhone devices', () => {
      expect(devices.iPhoneSE).toBeDefined();
      expect(devices.iPhone12).toBeDefined();
    });

    test('should have Android devices', () => {
      expect(devices.pixel5).toBeDefined();
    });

    test('should have tablet devices', () => {
      expect(devices.iPadMini).toBeDefined();
    });

    test('all devices should have required properties', () => {
      Object.values(devices).forEach(device => {
        expect(device).toHaveProperty('name');
        expect(device).toHaveProperty('viewport');
        expect(device).toHaveProperty('userAgent');
        expect(device).toHaveProperty('deviceScaleFactor');
        expect(device).toHaveProperty('isMobile');
        expect(device).toHaveProperty('hasTouch');
      });
    });

    test('mobile devices should have isMobile true', () => {
      expect(devices.iPhoneSE.isMobile).toBe(true);
      expect(devices.iPhone12.isMobile).toBe(true);
      expect(devices.pixel5.isMobile).toBe(true);
    });

    test('mobile devices should have hasTouch true', () => {
      expect(devices.iPhoneSE.hasTouch).toBe(true);
      expect(devices.iPhone12.hasTouch).toBe(true);
    });
  });

  describe('getViewport', () => {
    test('should return viewport by name', () => {
      const desktop = getViewport('desktop');
      expect(desktop.width).toBe(1920);
      expect(desktop.height).toBe(1080);
    });

    test('should return mobile viewport', () => {
      const mobile = getViewport('mobile');
      expect(mobile.width).toBe(375);
    });

    test('should return default viewport for unknown name', () => {
      const unknown = getViewport('unknownViewport');
      expect(unknown).toEqual(viewports.desktop);
    });
  });

  describe('getDevice', () => {
    test('should return device by name', () => {
      const iphone = getDevice('iPhoneSE');
      expect(iphone.name).toBe('iPhone SE');
    });

    test('should return undefined for unknown device', () => {
      const unknown = getDevice('unknownDevice');
      expect(unknown).toBeUndefined();
    });
  });

  describe('isMobileViewport', () => {
    test('should return true for mobile viewports', () => {
      expect(isMobileViewport({ width: 375, height: 667 })).toBe(true);
      expect(isMobileViewport({ width: 414, height: 896 })).toBe(true);
      expect(isMobileViewport({ width: 320, height: 568 })).toBe(true);
    });

    test('should return false for tablet and desktop', () => {
      expect(isMobileViewport({ width: 768, height: 1024 })).toBe(false);
      expect(isMobileViewport({ width: 1920, height: 1080 })).toBe(false);
    });

    test('should handle edge case at 768px', () => {
      expect(isMobileViewport({ width: 767, height: 600 })).toBe(true);
      expect(isMobileViewport({ width: 768, height: 600 })).toBe(false);
    });
  });

  describe('isTabletViewport', () => {
    test('should return true for tablet viewports', () => {
      expect(isTabletViewport({ width: 768, height: 1024 })).toBe(true);
      expect(isTabletViewport({ width: 800, height: 600 })).toBe(true);
      expect(isTabletViewport({ width: 1000, height: 800 })).toBe(true);
    });

    test('should return false for mobile and desktop', () => {
      expect(isTabletViewport({ width: 375, height: 667 })).toBe(false);
      expect(isTabletViewport({ width: 1920, height: 1080 })).toBe(false);
    });

    test('should handle edge cases', () => {
      expect(isTabletViewport({ width: 767, height: 600 })).toBe(false);
      expect(isTabletViewport({ width: 768, height: 600 })).toBe(true);
      expect(isTabletViewport({ width: 1023, height: 600 })).toBe(true);
      expect(isTabletViewport({ width: 1024, height: 600 })).toBe(false);
    });
  });

  describe('isDesktopViewport', () => {
    test('should return true for desktop viewports', () => {
      expect(isDesktopViewport({ width: 1024, height: 768 })).toBe(true);
      expect(isDesktopViewport({ width: 1366, height: 768 })).toBe(true);
      expect(isDesktopViewport({ width: 1920, height: 1080 })).toBe(true);
    });

    test('should return false for mobile and tablet', () => {
      expect(isDesktopViewport({ width: 375, height: 667 })).toBe(false);
      expect(isDesktopViewport({ width: 768, height: 1024 })).toBe(false);
    });

    test('should handle edge case at 1024px', () => {
      expect(isDesktopViewport({ width: 1023, height: 600 })).toBe(false);
      expect(isDesktopViewport({ width: 1024, height: 600 })).toBe(true);
    });
  });

  describe('viewport classification consistency', () => {
    test('every viewport should be exactly one type', () => {
      const testViewports = [
        { width: 320, height: 568 },
        { width: 375, height: 667 },
        { width: 768, height: 1024 },
        { width: 1024, height: 768 },
        { width: 1920, height: 1080 },
      ];

      testViewports.forEach(vp => {
        const mobile = isMobileViewport(vp);
        const tablet = isTabletViewport(vp);
        const desktop = isDesktopViewport(vp);
        
        const count = [mobile, tablet, desktop].filter(Boolean).length;
        expect(count).toBe(1);
      });
    });
  });
});




