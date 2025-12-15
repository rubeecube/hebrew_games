// Multi-language support for Hebrew Typing Games
const translations = {
    he: {
        'index.title': 'משחקי תרגול עברית',
        'index.subtitle': 'שפרו את מיומנות ההקלדה שלכם בעברית דרך משחקים מהנים!',
        'index.game1.title': 'רץ וקפוץ',
        'index.game1.desc': 'לחצו על האות העברית הנכונה כדי לקפוץ ולהתקדם!',
        'index.game2.title': 'מכונית עברית',
        'index.game2.desc': 'נווטו ימינה ושמאלה באמצעות אותיות עבריות אקראיות!',
        'index.game3.title': 'הקלדת משפטים',
        'index.game3.desc': 'תרגול הקלדה מהיר עם משפטים מעיתונים עבריים',
        'index.game4.title': 'אותיות נופלות',
        'index.game4.desc': 'הקלידו את האותיות לפני שהן נוגעות בקרקע!',
        'index.game5.title': 'פצח בלונים',
        'index.game5.desc': 'פוצצו בלונים עם אותיות לפני שהם עפים!',
        'index.game6.title': 'קרב חלל עברי',
        'index.game6.desc': 'ירו בחייזרים עם אותיות עבריות!',
        'index.game7.title': 'תופס אותיות',
        'index.game7.desc': 'תפסו אותיות ירוקות, הימנעו מאדומות!',
        'index.game8.title': 'בועות אותיות',
        'index.game8.desc': 'פוצצו בועות לפני שהזמן אוזל - קומבו!'
    },
    en: {
        'index.title': 'Hebrew Typing Games',
        'index.subtitle': 'Improve your Hebrew typing skills through fun games!',
        'index.game1.title': 'Run and Jump',
        'index.game1.desc': 'Press the correct Hebrew letter to jump and advance!',
        'index.game2.title': 'Hebrew Car',
        'index.game2.desc': 'Navigate left and right using random Hebrew letters!',
        'index.game3.title': 'Sentence Typing',
        'index.game3.desc': 'Fast typing practice with sentences from Hebrew newspapers',
        'index.game4.title': 'Falling Letters',
        'index.game4.desc': 'Type the letters before they hit the ground!',
        'index.game5.title': 'Balloon Pop',
        'index.game5.desc': 'Pop balloons with letters before they fly away!',
        'index.game6.title': 'Space Shooter',
        'index.game6.desc': 'Shoot aliens with Hebrew letters!',
        'index.game7.title': 'Letter Catcher',
        'index.game7.desc': 'Catch green letters, avoid red ones!',
        'index.game8.title': 'Letter Bubbles',
        'index.game8.desc': 'Pop bubbles before time runs out - combo bonuses!'
    },
    fr: {
        'index.title': 'Jeux de frappe hébraïque',
        'index.subtitle': 'Améliorez vos compétences de frappe en hébreu avec des jeux amusants !',
        'index.game1.title': 'Courir et sauter',
        'index.game1.desc': 'Appuyez sur la bonne lettre hébraïque pour sauter et avancer !',
        'index.game2.title': 'Voiture hébraïque',
        'index.game2.desc': 'Naviguez à gauche et à droite avec des lettres hébraïques aléatoires !',
        'index.game3.title': 'Frappe de phrases',
        'index.game3.desc': 'Pratique de frappe rapide avec des phrases de journaux hébreux',
        'index.game4.title': 'Lettres tombantes',
        'index.game4.desc': 'Tapez les lettres avant qu\'elles ne touchent le sol !',
        'index.game5.title': 'Éclater des ballons',
        'index.game5.desc': 'Éclatez les ballons avec des lettres avant qu\'ils ne s\'envolent !',
        'index.game6.title': 'Tireur spatial',
        'index.game6.desc': 'Tirez sur les extraterrestres avec des lettres hébraïques !',
        'index.game7.title': 'Attraper les lettres',
        'index.game7.desc': 'Attrapez les lettres vertes, évitez les rouges !',
        'index.game8.title': 'Bulles de lettres',
        'index.game8.desc': 'Éclatez les bulles avant que le temps ne soit écoulé - bonus combo !'
    }
};

let currentLang = 'he';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('hebrewGameLang', lang);
    
    // Hide all language spans
    document.querySelectorAll('.lang-he, .lang-en, .lang-fr').forEach(el => {
        el.style.display = 'none';
    });
    
    // Show selected language
    document.querySelectorAll(`.lang-${lang}`).forEach(el => {
        el.style.display = 'inline';
    });
    
    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-lang="${lang}"]`)?.classList.add('active');
    
    // Update direction and language attributes
    const html = document.documentElement;
    const isHebrew = lang === 'he';
    
    // Set direction: RTL for Hebrew, LTR for others
    html.setAttribute('dir', isHebrew ? 'rtl' : 'ltr');
    html.setAttribute('lang', lang);
    
    // Also set on body for better browser support
    document.body.setAttribute('dir', isHebrew ? 'rtl' : 'ltr');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Get saved language or default to Hebrew
    const savedLang = localStorage.getItem('hebrewGameLang') || 'he';
    setLanguage(savedLang);
    
    // Add language selector if not exists
    if (!document.querySelector('.lang-selector')) {
        const langSelector = document.createElement('div');
        langSelector.className = 'lang-selector';
        langSelector.innerHTML = `
            <button class="lang-btn" data-lang="he" onclick="setLanguage('he')">🇮🇱 עברית</button>
            <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">🇬🇧 English</button>
            <button class="lang-btn" data-lang="fr" onclick="setLanguage('fr')">🇫🇷 Français</button>
        `;
        document.body.insertBefore(langSelector, document.body.firstChild);
    }
    
    setLanguage(savedLang);
});
