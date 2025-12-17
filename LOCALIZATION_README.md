# Localization System Documentation

## Overview
A comprehensive localization system has been added to the Hebrew Typing Games project, supporting Hebrew (עברית), English, and French (Français) languages.

## Features Implemented

### 1. Language Selector
- **Location**: Top-left corner of all pages
- **Languages**: 
  - 🇮🇱 Hebrew (עברית)
  - 🇬🇧 English
  - 🇫🇷 French (Français)
- **Persistence**: Selected language is saved in `localStorage` and persists across page reloads
- **Default**: Hebrew (he)

### 2. Automatic Content Hiding
When a language is selected:
- **Hebrew mode**: Hides all `.lang-en` and `.lang-fr` elements
- **English mode**: Hides all `.lang-he` and `.lang-fr` elements
- **French mode**: Hides all `.lang-he` and `.lang-en` elements

This ensures a clean, single-language experience as requested.

### 3. Dynamic Translation
The system uses the `data-i18n` attribute for dynamic content translation:
```html
<span data-i18n="common.score">ניקוד:</span>
```

### 4. RTL/LTR Support
- Automatically sets `dir="rtl"` for Hebrew
- Automatically sets `dir="ltr"` for English and French
- Updates the `html` element's `lang` attribute

## Files Updated

### Core Files
1. **localization.js** - Main localization engine with all translations
2. **index.html** - Main menu with language selector
3. **game1-runner.html** - Run and Jump game
4. **game2-car.html** - Hebrew Car game
5. **game3-typing.html** - Sentence Typing game
6. **game4-falling.html** - Falling Letters game
7. **game5-balloons.html** - Balloon Pop game

### Translation Coverage
Each file includes translations for:
- Page titles and headings
- Instructions and gameplay hints
- Button labels (Start, Restart, Back, etc.)
- Score, Lives, Speed, and other stats
- Game Over messages
- Success/completion messages

## How It Works

### 1. Initialization
```javascript
// Auto-initializes when DOM is ready
initLocalization();
```

### 2. Language Selection
```javascript
// Get current language
const lang = getCurrentLanguage(); // Returns 'he', 'en', or 'fr'

// Set language
setLanguage('en');
updateTranslations();
```

### 3. Translation Lookup
```javascript
// Get translation for a key
const translation = t('common', 'score');
// Returns: 'ניקוד:' (he), 'Score:' (en), or 'Score :' (fr)
```

### 4. HTML Structure
Multi-language content uses this pattern:
```html
<h1>
    <span class="lang-he" data-i18n="game1.title">רץ וקפוץ!</span>
    <span class="lang-en" data-i18n="game1.title">Run and Jump!</span>
    <span class="lang-fr" data-i18n="game1.title">Courir et sauter !</span>
</h1>
```

## Translation Keys

### Common Translations (all games)
- `common.back` - Back button
- `common.startGame` - Start Game button
- `common.playAgain` - Play Again button
- `common.restart` - Restart button
- `common.skip` - Skip button
- `common.start` - Start button
- `common.gameOver` - Game Over message
- `common.wellDone` - Well Done message
- `common.yourScore` - Your Score label
- `common.score` - Score label
- `common.lives` - Lives label
- `common.level` - Level label
- `common.speed` - Speed label

### Game-Specific Translations
Each game has its own section (e.g., `game1`, `game2`, etc.) containing:
- `title` - Game title
- `inst1`, `inst2`, `inst3`, etc. - Instruction lines
- Game-specific labels and messages

### Index Page Translations
- `index.title` - Main page title
- `index.subtitle` - Main page subtitle
- `index.game1.title` - Game 1 title
- `index.game1.desc` - Game 1 description
- Similar structure for games 2-5

## Usage Examples

### Adding a New Translatable Element
1. Add the translation to `localization.js`:
```javascript
translations.common.newLabel = {
    he: 'תווית חדשה',
    en: 'New Label',
    fr: 'Nouvelle étiquette'
};
```

2. Use in HTML:
```html
<span class="lang-he" data-i18n="common.newLabel">תווית חדשה</span>
<span class="lang-en" data-i18n="common.newLabel">New Label</span>
<span class="lang-fr" data-i18n="common.newLabel">Nouvelle étiquette</span>
```

### Adding a New Game
Include the localization script:
```html
<script src="localization.js"></script>
```

The language selector and translation system will initialize automatically.

## Testing

### Manual Testing
1. Open any game page
2. Click the language selector buttons in the top-left
3. Verify:
   - Only the selected language text is visible
   - All UI elements are translated correctly
   - Language persists when navigating between pages
   - RTL/LTR layout adjusts appropriately

### Browser Console Testing
```javascript
// Check current language
getCurrentLanguage()

// Switch to English
setLanguage('en')
updateTranslations()

// Switch to French
setLanguage('fr')
updateTranslations()

// Switch back to Hebrew
setLanguage('he')
updateTranslations()
```

## Browser Compatibility
- Uses `localStorage` for persistence (IE8+)
- Uses `querySelector` and `querySelectorAll` (IE8+)
- Uses `classList` (IE10+, polyfill available for IE8-9)
- Fully compatible with all modern browsers

## Styling
The language selector is styled to:
- Be visible but unobtrusive
- Highlight the active language
- Provide hover feedback
- Adapt to mobile screens (smaller on mobile)
- Match the overall design aesthetic

## Future Enhancements
Potential improvements:
1. Add more languages (Spanish, German, etc.)
2. Add translation for game6, game7, game8 (not yet implemented)
3. Add keyboard shortcuts for language switching
4. Add a language auto-detect based on browser settings
5. Add more granular control over text visibility

## Technical Notes
- All translations are loaded on page load (no async loading)
- Language selection triggers immediate UI update
- No page reload required for language changes
- The system is lightweight (~14KB for localization.js)
- Zero external dependencies

## Support
For issues or questions about the localization system, please check:
1. Browser console for JavaScript errors
2. localStorage to verify language preference is saved
3. Network tab to ensure localization.js loads correctly




