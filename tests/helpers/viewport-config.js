/**
 * Viewport Configurations for Testing
 * Different device and screen sizes for responsive testing
 */

const viewports = {
  // Desktop viewports
  desktop: {
    width: 1920,
    height: 1080,
  },
  
  desktopSmall: {
    width: 1366,
    height: 768,
  },
  
  // Tablet viewports
  tablet: {
    width: 768,
    height: 1024,
  },
  
  tabletLandscape: {
    width: 1024,
    height: 768,
  },
  
  // Mobile viewports
  mobile: {
    width: 375,
    height: 667,
  },
  
  mobileLarge: {
    width: 414,
    height: 896,
  },
  
  mobileSmall: {
    width: 320,
    height: 568,
  },
};

/**
 * Devices with full configuration including user agent
 */
const devices = {
  iPhoneSE: {
    name: 'iPhone SE',
    viewport: { width: 375, height: 667 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
  
  iPhone12: {
    name: 'iPhone 12',
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
  },
  
  pixel5: {
    name: 'Pixel 5',
    viewport: { width: 393, height: 851 },
    userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36',
    deviceScaleFactor: 2.75,
    isMobile: true,
    hasTouch: true,
  },
  
  iPadMini: {
    name: 'iPad Mini',
    viewport: { width: 768, height: 1024 },
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  },
};

/**
 * Get viewport configuration by name
 * @param {string} name - Viewport name
 * @returns {object} Viewport configuration
 */
function getViewport(name) {
  return viewports[name] || viewports.desktop;
}

/**
 * Get device configuration by name
 * @param {string} name - Device name
 * @returns {object} Device configuration
 */
function getDevice(name) {
  return devices[name];
}

/**
 * Check if viewport is mobile size
 * @param {object} viewport - Viewport object with width and height
 * @returns {boolean} True if mobile size
 */
function isMobileViewport(viewport) {
  return viewport.width < 768;
}

/**
 * Check if viewport is tablet size
 * @param {object} viewport - Viewport object with width and height
 * @returns {boolean} True if tablet size
 */
function isTabletViewport(viewport) {
  return viewport.width >= 768 && viewport.width < 1024;
}

/**
 * Check if viewport is desktop size
 * @param {object} viewport - Viewport object with width and height
 * @returns {boolean} True if desktop size
 */
function isDesktopViewport(viewport) {
  return viewport.width >= 1024;
}

module.exports = {
  viewports,
  devices,
  getViewport,
  getDevice,
  isMobileViewport,
  isTabletViewport,
  isDesktopViewport,
};




